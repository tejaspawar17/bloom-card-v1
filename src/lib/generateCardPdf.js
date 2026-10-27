import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

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

  // 1. Capture Front and Back DOM nodes at high pixel density (~800+ DPI at 54mm keychain scale)
  // cacheBust is set to false so blob: and data: URLs are never corrupted with query params.
  // skipFonts is set to true to isolate cross-origin Google Fonts stylesheets from ad/tracker blockers.
  // Note: We deliberately do NOT force borderRadius: '0px' here so that cards with native corner radii
  // (e.g. Pokemon cards) preserve their authentic rounded corners with clean alpha transparency.
  const imageCaptureOptions = {
    pixelRatio: 2.5,
    quality: 0.98,
    cacheBust: false,
    skipFonts: true,
    fontEmbedCSS: '',
    includeQueryParams: false,
    onImageErrorHandler: (err) => {
      console.warn('PDF image capture warning:', err);
    },
    style: {
      transform: 'none',
      backgroundColor: 'transparent',
    },
  };

  const captureCard = async (element) => {
    try {
      return await toPng(element, imageCaptureOptions);
    } catch (err) {
      console.warn('Initial PDF capture attempt encountered an issue, retrying with fallback...', err);
      return await toPng(element, {
        ...imageCaptureOptions,
        pixelRatio: 2,
      });
    }
  };

  const frontDataUrl = await captureCard(frontElement);
  const backDataUrl = await captureCard(backElement);

  // 2. Create A4 Document (210mm x 297mm)
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
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
  // 5. EMBED HIGH-RES CARD IMAGES (300+ DPI)
  // -------------------------------------------------------------
  pdf.addImage(frontDataUrl, 'PNG', frontX, startY, cardW, cardH);
  pdf.addImage(backDataUrl, 'PNG', backX, startY, cardW, cardH);

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
  // 7. FOOTER NOTE
  // -------------------------------------------------------------
  pdf.setDrawColor(240, 240, 240);
  pdf.setLineWidth(0.15);
  pdf.line(startX, pageHeight - 20, startX + totalCardsW, pageHeight - 20);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(6.5);
  pdf.setTextColor(161, 161, 170); // #a1a1aa
  pdf.text(
    'Bloom Card Keepsake Studio  •  bloomcard.app  •  Handcrafted digital keepsake',
    pageWidth / 2,
    pageHeight - 15,
    { align: 'center' }
  );

  // 8. Save & trigger download
  const sanitizedTitle = cardTitle.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
  pdf.save(`${sanitizedTitle}-keychain-print.pdf`);
}
