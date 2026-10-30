import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

const GOOGLE_FONTS_CSS_URL =
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Homemade+Apple&family=Vampiro+One&family=Syne+Tactile&family=Instrument+Serif:ital@0;1&display=swap';

let cachedFontEmbedCSS = null;
let fontEmbedPromise = null;

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Fetches and embeds studio webfonts (Vampiro One, Homemade Apple, Syne Tactile, Instrument Serif, Inter)
 * as base64 @font-face rules (latin subset only for speed) so isolated <svg><foreignObject> renders authentic typography.
 */
export function getStudioFontEmbedCSS() {
  if (cachedFontEmbedCSS !== null) return Promise.resolve(cachedFontEmbedCSS);
  if (fontEmbedPromise) return fontEmbedPromise;

  fontEmbedPromise = (async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const res = await fetch(GOOGLE_FONTS_CSS_URL, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (!res.ok) return '';
      const rawCss = await res.text();

      // Keep only latin blocks (skip cyrillic/vietnamese/greek to cut download count by 70%)
      const blockRegex = /\/\*\s*([a-z-]+)\s*\*\/\s*@font-face\s*\{[^}]+\}/gi;
      const blocks = [...rawCss.matchAll(blockRegex)];
      let cssText =
        blocks.length > 0
          ? blocks
              .filter((m) => m[1] === 'latin')
              .map((m) => m[0])
              .join('\n')
          : rawCss;

      const urlRegex = /url\((['"]?)(https?:\/\/[^)'"]+)\1\)/g;
      const matches = [...cssText.matchAll(urlRegex)];

      await Promise.all(
        matches.map(async (match) => {
          const fullMatch = match[0];
          const fontUrl = match[2];
          try {
            const fontRes = await fetch(fontUrl);
            if (!fontRes.ok) return;
            const fontBlob = await fontRes.blob();
            const dataUrl = await blobToDataUrl(fontBlob);
            cssText = cssText.split(fullMatch).join(`url("${dataUrl}")`);
          } catch {
            // Ignore individual font fetch failure
          }
        })
      );

      cachedFontEmbedCSS = cssText;
      return cssText;
    } catch {
      return '';
    } finally {
      fontEmbedPromise = null;
    }
  })();

  return fontEmbedPromise;
}

/**
 * Loads an image URL and waits for full bitmap decoding.
 */
function loadDecodedImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.decoding = 'sync';
    img.onload = async () => {
      try {
        if (img.decode) await img.decode();
      } catch {
        // Proceed even if decode() warns
      }
      resolve(img);
    };
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Pre-renders an <img> element onto an offscreen canvas with its exact object-fit (cover/contain)
 * so mobile WebKit <svg><foreignObject> never drops large card artwork or mis-crops aspect ratios.
 */
async function rasterizeImgToDataUrl(imgEl, scale = 2) {
  const src = imgEl.currentSrc || imgEl.src;
  if (!src) return null;

  const decodedImg = await loadDecodedImage(src);
  const nw = decodedImg.naturalWidth || decodedImg.width || 688;
  const nh = decodedImg.naturalHeight || decodedImg.height || 960;

  const computed = window.getComputedStyle(imgEl);
  const cssW = imgEl.offsetWidth || imgEl.clientWidth || parseFloat(computed.width) || 350;
  const cssH = imgEl.offsetHeight || imgEl.clientHeight || parseFloat(computed.height) || 488;
  const targetW = Math.max(1, Math.round(cssW * scale));
  const targetH = Math.max(1, Math.round(cssH * scale));

  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const objectFit = computed.objectFit || 'fill';

  let drawX = 0;
  let drawY = 0;
  let drawW = targetW;
  let drawH = targetH;

  if (objectFit === 'cover') {
    const scaleFactor = Math.max(targetW / nw, targetH / nh);
    drawW = nw * scaleFactor;
    drawH = nh * scaleFactor;
    drawX = (targetW - drawW) / 2;
    drawY = (targetH - drawH) / 2;
  } else if (objectFit === 'contain') {
    const scaleFactor = Math.min(targetW / nw, targetH / nh);
    drawW = nw * scaleFactor;
    drawH = nh * scaleFactor;
    drawX = (targetW - drawW) / 2;
    drawY = (targetH - drawH) / 2;
  }

  ctx.drawImage(decodedImg, drawX, drawY, drawW, drawH);

  // Use PNG for assets that require alpha transparency (frames, textures, emojis, stickers, Pokémon rounded corners)
  const needsAlpha =
    src.includes('frame') ||
    src.includes('texture') ||
    src.includes('emojis') ||
    src.includes('stickers') ||
    src.includes('pokemon') ||
    src.includes('metallic_back') ||
    objectFit === 'contain';

  return needsAlpha
    ? canvas.toDataURL('image/png')
    : canvas.toDataURL('image/jpeg', 0.92);
}

const TRANSPARENT_PIXEL_GIF =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

/**
 * Prepares a card DOM subtree for mobile-safe <svg><foreignObject> capture:
 * 1. Locks resolved pixel values for all cqw / container-query properties from the live 350x488 stage.
 * 2. Pre-rasterizes all <img> tags into sized data URLs rendered via CSS background-image so
 *    Mobile WebKit <foreignObject> never drops large card artwork or suffers async <img> decode blanks.
 * Returns a cleanup callback to restore original DOM attributes/styles.
 */
async function prepareElementForMobileCapture(rootElement) {
  const restoreCallbacks = [];

  // 1. Snapshot resolved computed pixel styles on all descendants before disabling @container
  const allElements = [rootElement, ...Array.from(rootElement.querySelectorAll('*'))];
  const styleSnapshots = allElements.map((el) => {
    const cs = window.getComputedStyle(el);
    return {
      el,
      originalStyleAttr: el.getAttribute('style'),
      computed: {
        width: cs.width,
        height: cs.height,
        fontSize: cs.fontSize,
        lineHeight: cs.lineHeight,
        letterSpacing: cs.letterSpacing,
        borderTopWidth: cs.borderTopWidth,
        borderRightWidth: cs.borderRightWidth,
        borderBottomWidth: cs.borderBottomWidth,
        borderLeftWidth: cs.borderLeftWidth,
        borderTopLeftRadius: cs.borderTopLeftRadius,
        borderTopRightRadius: cs.borderTopRightRadius,
        borderBottomRightRadius: cs.borderBottomRightRadius,
        borderBottomLeftRadius: cs.borderBottomLeftRadius,
        paddingTop: cs.paddingTop,
        paddingRight: cs.paddingRight,
        paddingBottom: cs.paddingBottom,
        paddingLeft: cs.paddingLeft,
      },
      isContainer: cs.containerType && cs.containerType !== 'normal',
    };
  });

  // Apply locked pixel metrics so cqw units never collapse inside <foreignObject>
  styleSnapshots.forEach(({ el, originalStyleAttr, computed, isContainer }) => {
    if (!(el instanceof HTMLElement)) return;
    restoreCallbacks.push(() => {
      if (originalStyleAttr === null) {
        el.removeAttribute('style');
      } else {
        el.setAttribute('style', originalStyleAttr);
      }
    });

    Object.entries(computed).forEach(([prop, val]) => {
      if (val && val !== '0px' && val !== 'normal' && val !== 'auto') {
        el.style[prop] = val;
      }
    });

    if (isContainer) {
      el.style.containerType = 'normal';
    }
  });

  // 2. Pre-rasterize every <img> into a decoded data URL and paint via CSS background-image
  // so Mobile Safari / Chrome <svg><foreignObject> renders 100% of card backgrounds synchronously.
  const imgElements = Array.from(rootElement.querySelectorAll('img'));
  await Promise.all(
    imgElements.map(async (imgEl) => {
      try {
        const originalSrc = imgEl.getAttribute('src');
        const originalSrcset = imgEl.getAttribute('srcset');
        const originalLoading = imgEl.getAttribute('loading');
        const originalDecoding = imgEl.getAttribute('decoding');

        const dataUrl = await rasterizeImgToDataUrl(imgEl, 2);
        if (!dataUrl) return;

        restoreCallbacks.push(() => {
          if (originalSrc !== null) imgEl.setAttribute('src', originalSrc);
          if (originalSrcset !== null) imgEl.setAttribute('srcset', originalSrcset);
          else imgEl.removeAttribute('srcset');
          if (originalLoading !== null) imgEl.setAttribute('loading', originalLoading);
          else imgEl.removeAttribute('loading');
          if (originalDecoding !== null) imgEl.setAttribute('decoding', originalDecoding);
          else imgEl.removeAttribute('decoding');
        });

        imgEl.removeAttribute('srcset');
        imgEl.setAttribute('loading', 'eager');
        imgEl.setAttribute('decoding', 'sync');
        imgEl.src = TRANSPARENT_PIXEL_GIF;
        imgEl.style.backgroundImage = `url("${dataUrl}")`;
        imgEl.style.backgroundSize = '100% 100%';
        imgEl.style.backgroundPosition = 'center';
        imgEl.style.backgroundRepeat = 'no-repeat';
      } catch (err) {
        console.warn('Image pre-rasterize fallback:', err);
      }
    })
  );

  return () => {
    for (let i = restoreCallbacks.length - 1; i >= 0; i--) {
      try {
        restoreCallbacks[i]();
      } catch {
        // Ignore cleanup errors
      }
    }
  };
}

/**
 * Generates an elevated, gallery-grade 300+ DPI PDF for printing keychain keepsakes.
 * Configured specifically for standard 54mm x 75.35mm aspect-accurate keychain cards.
 *
 * @param {HTMLElement} frontElement - DOM node of the front card face
 * @param {HTMLElement} backElement - DOM node of the back card face
 * @param {Object} options - Custom options (title, etc.)
 */
export async function generateKeychainPdf({
  frontElement,
  backElement,
  cardTitle = 'bloom-keychain-keepsake',
}) {
  if (!frontElement || !backElement) {
    throw new Error('Front and Back elements are required to generate PDF');
  }

  // Ensure all webfonts (Homemade Apple, Syne Tactile, Instrument Serif, Vampiro One, etc.) are 100% loaded
  if (typeof document !== 'undefined' && document.fonts) {
    try {
      await document.fonts.ready;
    } catch {
      // Fallback gracefully if font loading check isn't supported
    }
  }

  const fontEmbedCSS = await getStudioFontEmbedCSS();

  // 1. Capture Front and Back DOM nodes at crisp print density (54mm x 75.4mm keychain scale)
  const isMobileDevice =
    typeof window !== 'undefined' &&
    (window.innerWidth < 1024 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent));

  const imageCaptureOptions = {
    width: 350,
    height: 488,
    pixelRatio: isMobileDevice ? 2 : 2.5,
    quality: 0.95,
    cacheBust: false,
    skipFonts: true,
    fontEmbedCSS,
    includeQueryParams: false,
    onImageErrorHandler: (err) => {
      console.warn('PDF image capture warning:', err);
    },
    style: {
      transform: 'none',
      backgroundColor: 'transparent',
      opacity: '1',
    },
  };

  const captureCard = async (element) => {
    const cleanup = await prepareElementForMobileCapture(element);
    try {
      try {
        return await toPng(element, imageCaptureOptions);
      } catch (err) {
        console.warn('Initial PDF capture attempt encountered an issue, retrying with fallback...', err);
        return await toPng(element, {
          ...imageCaptureOptions,
          pixelRatio: 1.5,
        });
      }
    } finally {
      cleanup();
    }
  };

  // Yield frames sequentially to avoid single-thread mobile CPU bottlenecks
  const frontDataUrl = await captureCard(frontElement);
  await new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 16)));
  const backDataUrl = await captureCard(backElement);
  await new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 16)));

  // 2. Create A4 Document (210mm x 297mm)
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pageWidth = 210;
  const pageHeight = 297;

  // Keychain card physical dimensions (Standard ID / mini-card format: 54mm x 75.35mm aspect-matched)
  const cardW = 54;
  const cardH = 75.35;
  const gap = 12; // 12mm generous breathing gap between front and back cards
  const totalCardsW = cardW * 2 + gap; // 120mm

  // Center horizontally on page
  const startX = (pageWidth - totalCardsW) / 2; // 45mm
  const startY = 92; // Vertically balanced placement

  const frontX = startX; // 45mm
  const backX = startX + cardW + gap; // 111mm

  // -------------------------------------------------------------
  // 1. EDITORIAL HEADER & BRANDING
  // -------------------------------------------------------------
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(7.5);
  pdf.setTextColor(113, 113, 122); // #71717a
  pdf.text('BLOOM KEEPSAKE STUDIO  •  PRINT EDITION', pageWidth / 2, 28, { align: 'center' });

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(19);
  pdf.setTextColor(24, 24, 27); // #18181b
  pdf.text('Keychain Keepsake Card', pageWidth / 2, 37, { align: 'center' });

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8.5);
  pdf.setTextColor(113, 113, 122); // #71717a
  pdf.text(
    'Double-Sided 54 × 75.4 mm Keepsake  •  100% Actual Scale Print Guide',
    pageWidth / 2,
    44,
    { align: 'center' }
  );

  // Subtle Header Divider
  pdf.setDrawColor(228, 228, 231); // #e4e4e7
  pdf.setLineWidth(0.2);
  pdf.line(startX - 5, 50, startX + totalCardsW + 5, 50);

  // -------------------------------------------------------------
  // 2. 50MM CALIBRATION SCALE (Precision Ruler Check)
  // -------------------------------------------------------------
  const rulerW = 50;
  const rulerX = (pageWidth - rulerW) / 2; // 80mm
  const rulerY = 60;

  pdf.setDrawColor(161, 161, 170); // #a1a1aa
  pdf.setLineWidth(0.25);
  pdf.line(rulerX, rulerY, rulerX + rulerW, rulerY); // Baseline
  pdf.line(rulerX, rulerY - 2.2, rulerX, rulerY + 2.2); // 0mm tick
  pdf.line(rulerX + rulerW, rulerY - 2.2, rulerX + rulerW, rulerY + 2.2); // 50mm tick
  pdf.line(rulerX + rulerW / 2, rulerY - 1.5, rulerX + rulerW / 2, rulerY + 1.5); // 25mm tick

  // Sub-division 10mm ticks
  for (let mm = 10; mm < 50; mm += 10) {
    if (mm !== 25) {
      pdf.line(rulerX + mm, rulerY - 1.0, rulerX + mm, rulerY + 1.0);
    }
  }

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(6.5);
  pdf.setTextColor(140, 140, 140);
  pdf.text('0 mm', rulerX, rulerY + 4, { align: 'center' });
  pdf.text('25 mm', rulerX + 25, rulerY + 4, { align: 'center' });
  pdf.text('50 mm', rulerX + 50, rulerY + 4, { align: 'center' });

  pdf.text(
    'Calibration Scale: Measure with physical ruler before trimming. Confirm print scale is set to "100% Actual Size" (Do not "Fit to Page").',
    pageWidth / 2,
    rulerY + 8.5,
    { align: 'center' }
  );

  // -------------------------------------------------------------
  // 3. CARD LABELS (Above Cards)
  // -------------------------------------------------------------
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(7.5);
  pdf.setTextColor(82, 82, 91); // #52525b
  pdf.text('SIDE A  •  FRONT COVER', frontX + cardW / 2, startY - 4.5, { align: 'center' });
  pdf.text('SIDE B  •  BACK LETTER', backX + cardW / 2, startY - 4.5, { align: 'center' });

  // -------------------------------------------------------------
  // 4. PRECISION CROP MARKS (Cutting Ticks for Trimming)
  // -------------------------------------------------------------
  const drawCropMarks = (x, y, w, h, isLeftCard, isRightCard) => {
    pdf.setDrawColor(161, 161, 170); // #a1a1aa
    pdf.setLineWidth(0.18);
    const outerTick = 4.5; // 4.5mm outer tick mark
    const innerTick = 2.0; // 2.0mm inner tick mark so marks never collide in the 12mm gap
    const offset = 2.0; // 2mm offset from card edge

    const leftTickLen = isLeftCard ? outerTick : innerTick;
    const rightTickLen = isRightCard ? outerTick : innerTick;

    // Top-left
    pdf.line(x - offset - leftTickLen, y, x - offset, y);
    pdf.line(x, y - offset - outerTick, x, y - offset);

    // Top-right
    pdf.line(x + w + offset, y, x + w + offset + rightTickLen, y);
    pdf.line(x + w, y - offset - outerTick, x + w, y - offset);

    // Bottom-left
    pdf.line(x - offset - leftTickLen, y + h, x - offset, y + h);
    pdf.line(x, y + h + offset, x, y + h + offset + outerTick);

    // Bottom-right
    pdf.line(x + w + offset, y + h, x + w + offset + rightTickLen, y + h);
    pdf.line(x + w, y + h + offset, x + w, y + h + offset + outerTick);
  };

  drawCropMarks(frontX, startY, cardW, cardH, true, false);
  drawCropMarks(backX, startY, cardW, cardH, false, true);

  // Faint Center Folding / Separation Guide
  const centerGuideX = frontX + cardW + gap / 2; // 105mm
  pdf.setDrawColor(212, 212, 216); // #d4d4d8
  pdf.setLineWidth(0.15);
  pdf.setLineDashPattern([1.2, 2.0], 0);
  pdf.line(centerGuideX, startY - 2, centerGuideX, startY + cardH + 2);
  pdf.setLineDashPattern([], 0); // Reset dash

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(5.5);
  pdf.setTextColor(161, 161, 170);
  pdf.text('FOLD / CUT', centerGuideX, startY - 4.5, { align: 'center' });

  // -------------------------------------------------------------
  // 5. EMBED HIGH-RES CARD IMAGES (With 'FAST' hardware compression to eliminate main-thread freeze)
  // -------------------------------------------------------------
  pdf.addImage(frontDataUrl, 'PNG', frontX, startY, cardW, cardH, undefined, 'FAST');
  pdf.addImage(backDataUrl, 'PNG', backX, startY, cardW, cardH, undefined, 'FAST');

  // -------------------------------------------------------------
  // 6. MODERN 3-STEP ASSEMBLY GUIDE (Clean Editorial Columns)
  // -------------------------------------------------------------
  const guideY = startY + cardH + 16; // ~183mm

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(7.5);
  pdf.setTextColor(113, 113, 122); // #71717a
  pdf.text('ASSEMBLY INSTRUCTIONS', pageWidth / 2, guideY, { align: 'center' });

  pdf.setDrawColor(228, 228, 231); // #e4e4e7
  pdf.setLineWidth(0.18);
  pdf.line(startX, guideY + 4, startX + totalCardsW, guideY + 4);

  // 3 Columns evenly spaced across 120mm
  const colW = 36;
  const col1X = startX; // 45mm
  const col2X = startX + 42; // 87mm
  const col3X = startX + 84; // 129mm
  const colTextY = guideY + 11;

  // Step 1: Print
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.setTextColor(24, 24, 27);
  pdf.text('01 / PRINT', col1X, colTextY);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7);
  pdf.setTextColor(113, 113, 122);
  pdf.text(
    'Print on 250–300 gsm heavy cardstock or photo paper. Set printer scaling to 100% (Actual Size).',
    col1X,
    colTextY + 4.5,
    { maxWidth: colW }
  );

  // Step 2: Trim
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.setTextColor(24, 24, 27);
  pdf.text('02 / TRIM', col2X, colTextY);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7);
  pdf.setTextColor(113, 113, 122);
  pdf.text(
    'Use a craft knife or scissors along the crop marks. Trim corners to follow the card silhouette.',
    col2X,
    colTextY + 4.5,
    { maxWidth: colW }
  );

  // Step 3: Assemble
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.setTextColor(24, 24, 27);
  pdf.text('03 / ASSEMBLE', col3X, colTextY);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7);
  pdf.setTextColor(113, 113, 122);
  pdf.text(
    'Affix front and back together with double-sided tape, or slide into your acrylic keychain blank.',
    col3X,
    colTextY + 4.5,
    { maxWidth: colW }
  );

  // -------------------------------------------------------------
  // 7. FOOTER NOTE & CLICKABLE WEB APP LINK
  // -------------------------------------------------------------
  const footerDividerY = pageHeight - 22; // 275mm
  pdf.setDrawColor(228, 228, 231); // #e4e4e7
  pdf.setLineWidth(0.18);
  pdf.line(startX, footerDividerY, startX + totalCardsW, footerDividerY);

  const appUrl = (typeof window !== 'undefined' && window.location?.origin) 
    ? window.location.origin 
    : 'https://bloomcard.app';

  // Left studio colophon
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(6.8);
  pdf.setTextColor(161, 161, 170); // #a1a1aa
  pdf.text('Bloom Keepsake Studio  •  Handcrafted Digital Keepsake', startX, footerDividerY + 6.5);

  // Right clickable studio link
  const linkLabel = 'Create your own card at bloomcard.app  ->';
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(6.8);
  pdf.setTextColor(37, 99, 235); // #2563eb (refined modern link blue)
  const linkW = pdf.getTextWidth(linkLabel);
  const linkX = startX + totalCardsW - linkW;
  const linkY = footerDividerY + 6.5;

  pdf.textWithLink(linkLabel, linkX, linkY, { url: appUrl });
  // Add a clickable target bounding box covering the link for mobile & desktop touch/mouse targets
  pdf.link(linkX - 1, linkY - 3.5, linkW + 2, 5, { url: appUrl });

  // 8. Save & trigger download
  const sanitizedTitle = cardTitle.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
  pdf.save(`${sanitizedTitle}-keychain-print.pdf`);
}
