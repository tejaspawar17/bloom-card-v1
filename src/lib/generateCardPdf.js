import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

/**
 * Generates a print-ready 300+ DPI PDF for local print shops
 * Configured specifically for a 54mm x 86mm Keychain Card Keepsake.
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

  // Ensure all webfonts (Homemade Apple, Syne Tactile, Instrument Serif, etc.) are 100% loaded
  if (typeof document !== 'undefined' && document.fonts) {
    try {
      await document.fonts.ready;
    } catch {
      // Fallback gracefully if font loading check isn't supported
    }
  }

  // 1. Capture Front and Back DOM nodes at high pixel density (~800+ DPI at 54mm keychain scale)
  // Note: cacheBust must be false so blob: and data: memory URLs are never corrupted with query params.
  // skipFonts: true prevents cross-origin stylesheet errors (e.g. Brave Shields blocking Google Fonts).
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
      borderRadius: '0px', // Crisp square edges for accurate guillotine cutting
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
  const gap = 8; // Gap between front and back cards
  const totalCardsW = cardW * 2 + gap;

  // Center horizontally on page
  const startX = (pageWidth - totalCardsW) / 2; // ~47mm
  const startY = 85; // Upper-mid page

  const frontX = startX;
  const backX = startX + cardW + gap;

  // -------------------------------------------------------------
  // HEADER & PRINT SHOP INSTRUCTIONS
  // -------------------------------------------------------------
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  pdf.setTextColor(20, 20, 20);
  pdf.text('Bloom Keepsake — Keychain Edition', pageWidth / 2, 32, { align: 'center' });

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(110, 110, 110);
  pdf.text(
    'Print on 250–300gsm heavy cardstock or photo paper at 100% scale (Do NOT "Fit to Page").',
    pageWidth / 2,
    40,
    { align: 'center' }
  );
  pdf.text(
    'Cut along crop marks, fold/glue back-to-back, laminate, and punch hole at dotted guide for keychain ring.',
    pageWidth / 2,
    45,
    { align: 'center' }
  );

  // 50mm Calibration Ruler Check (ensures print shop operator printed at true 100% scale)
  const rulerX = (pageWidth - 50) / 2;
  const rulerY = 56;
  pdf.setDrawColor(180, 180, 180);
  pdf.setLineWidth(0.3);
  pdf.line(rulerX, rulerY, rulerX + 50, rulerY);
  pdf.line(rulerX, rulerY - 1.5, rulerX, rulerY + 1.5);
  pdf.line(rulerX + 50, rulerY - 1.5, rulerX + 50, rulerY + 1.5);
  pdf.setFontSize(7);
  pdf.setTextColor(140, 140, 140);
  pdf.text('50 mm calibration ruler (must measure exactly 5 cm when printed)', pageWidth / 2, rulerY + 4, { align: 'center' });

  // -------------------------------------------------------------
  // DRAW CROP MARKS (Cutting ticks for print shop cutter)
  // -------------------------------------------------------------
  const drawCropMarks = (x, y, w, h) => {
    pdf.setDrawColor(160, 160, 160);
    pdf.setLineWidth(0.2);
    const tick = 4; // 4mm tick mark
    const offset = 1.5; // Offset from card edge

    // Top-left
    pdf.line(x - offset - tick, y, x - offset, y);
    pdf.line(x, y - offset - tick, x, y - offset);

    // Top-right
    pdf.line(x + w + offset, y, x + w + offset + tick, y);
    pdf.line(x + w, y - offset - tick, x + w, y - offset);

    // Bottom-left
    pdf.line(x - offset - tick, y + h, x - offset, y + h);
    pdf.line(x, y + h + offset, x, y + h + offset + tick);

    // Bottom-right
    pdf.line(x + w + offset, y + h, x + w + offset + tick, y + h);
    pdf.line(x + w, y + h + offset, x + w, y + h + offset + tick);
  };

  drawCropMarks(frontX, startY, cardW, cardH);
  drawCropMarks(backX, startY, cardW, cardH);

  // Labels above cards
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.setTextColor(80, 80, 80);
  pdf.text('FRONT COVER', frontX + cardW / 2, startY - 4, { align: 'center' });
  pdf.text('BACK LETTER', backX + cardW / 2, startY - 4, { align: 'center' });

  // -------------------------------------------------------------
  // EMBED HIGH-RES CARD IMAGES (300+ DPI)
  // -------------------------------------------------------------
  pdf.addImage(frontDataUrl, 'PNG', frontX, startY, cardW, cardH);
  pdf.addImage(backDataUrl, 'PNG', backX, startY, cardW, cardH);

  // -------------------------------------------------------------
  // DOTTED KEYCHAIN HOLE PUNCH GUIDE (Safe 4mm target)
  // Positioned so that when cards are glued back-to-back, the holes align!
  // Front: Top-Left (x: 5.5mm, y: 5.5mm)
  // Back:  Top-Right (x: 54 - 5.5mm = 48.5mm, y: 5.5mm)
  // -------------------------------------------------------------
  const holeRadius = 2.0; // 4mm diameter hole
  const marginFromEdge = 5.5;

  const frontHoleX = frontX + marginFromEdge;
  const frontHoleY = startY + marginFromEdge;

  const backHoleX = backX + cardW - marginFromEdge;
  const backHoleY = startY + marginFromEdge;

  const drawHoleGuide = (hx, hy) => {
    // Outer white halo to stand out on dark cards
    pdf.setDrawColor(255, 255, 255);
    pdf.setLineWidth(0.4);
    pdf.setLineDashPattern([0.8, 0.8], 0);
    pdf.circle(hx, hy, holeRadius);

    // Inner contrasting dark dashed ring
    pdf.setDrawColor(40, 40, 40);
    pdf.setLineWidth(0.2);
    pdf.setLineDashPattern([0.6, 0.6], 0);
    pdf.circle(hx, hy, holeRadius);

    // Tiny center punch target dot
    pdf.setFillColor(60, 60, 60);
    pdf.circle(hx, hy, 0.25, 'F');

    // Reset dash pattern
    pdf.setLineDashPattern([], 0);
  };

  drawHoleGuide(frontHoleX, frontHoleY);
  drawHoleGuide(backHoleX, backHoleY);

  // Hole guide hint text below cards
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.5);
  pdf.setTextColor(130, 130, 130);
  pdf.text('Dotted circles mark the 4mm keychain hole punch guide (aligns back-to-back)', pageWidth / 2, startY + cardH + 12, { align: 'center' });

  // -------------------------------------------------------------
  // FOOTER NOTE
  // -------------------------------------------------------------
  pdf.setFontSize(7);
  pdf.setTextColor(160, 160, 160);
  pdf.text('Created with Bloom Card // bloomcard.app', pageWidth / 2, pageHeight - 16, { align: 'center' });

  // 3. Save & trigger download
  const sanitizedTitle = cardTitle.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
  pdf.save(`${sanitizedTitle}-keychain-print.pdf`);
}
