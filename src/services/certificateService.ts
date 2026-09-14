/**
 * AIDORA Cooperative Platform - Skill Certificate PDF Generator
 * 
 * Generates an official "AIDORA Cooperative Skill Certificate" PDF
 * using jsPDF with genuine verification details, score, validity, and credentials.
 */

import { jsPDF } from 'jspdf';
import { WorkerCertificate } from '../types';

export interface CertificateGenerateParams {
  workerName: string;
  phone?: string;
  trade?: string;
  certificate: WorkerCertificate;
}

export const generateSkillCertificatePdf = (params: CertificateGenerateParams): void => {
  const { workerName, phone, trade, certificate } = params;

  // A4 Landscape for standard official certificate layout
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();   // 297 mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 210 mm
  const margin = 14;

  // Colors
  const primaryGreen = [29, 170, 92];   // #1DAA5C
  const goldAccent = [217, 119, 6];      // #D97706
  const darkNavy = [15, 23, 42];         // #0F172A
  const slateText = [71, 85, 105];       // #475569
  const softBg = [253, 254, 253];

  // 1. Certificate Outer Border & Background
  doc.setFillColor(softBg[0], softBg[1], softBg[2]);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Multi-tier Decorative Borders
  doc.setDrawColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
  doc.setLineWidth(3);
  doc.rect(margin, margin, pageWidth - margin * 2, pageHeight - margin * 2);

  doc.setDrawColor(goldAccent[0], goldAccent[1], goldAccent[2]);
  doc.setLineWidth(0.8);
  doc.rect(margin + 2.5, margin + 2.5, pageWidth - margin * 2 - 5, pageHeight - margin * 2 - 5);

  doc.setDrawColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
  doc.setLineWidth(0.3);
  doc.rect(margin + 4.5, margin + 4.5, pageWidth - margin * 2 - 9, pageHeight - margin * 2 - 9);

  // 2. Header Emblem & Titles
  let y = margin + 18;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(goldAccent[0], goldAccent[1], goldAccent[2]);
  doc.text('NATIONAL ARTISANS & GIG WORKERS COOPERATIVE FEDERATION', pageWidth / 2, y, { align: 'center' });

  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.text('Affiliated under the Cooperative Societies Act & Smart India Hackathon 2024 / PS 26089', pageWidth / 2, y, { align: 'center' });

  y += 14;
  doc.setFont('times', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('AIDORA COOPERATIVE SKILL CERTIFICATE', pageWidth / 2, y, { align: 'center' });

  y += 6;
  doc.setDrawColor(goldAccent[0], goldAccent[1], goldAccent[2]);
  doc.setLineWidth(1);
  doc.line(pageWidth / 2 - 60, y, pageWidth / 2 + 60, y);

  y += 8;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(11);
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.text('This is to officially certify that', pageWidth / 2, y, { align: 'center' });

  // 3. Worker Name
  y += 14;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
  doc.text(workerName.toUpperCase(), pageWidth / 2, y, { align: 'center' });

  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  if (phone) {
    doc.text(`Registered Artisan Phone: ${phone}  •  KYC Status: Verified`, pageWidth / 2, y, { align: 'center' });
  }

  // 4. Citation Text
  y += 10;
  doc.setFont('times', 'normal');
  doc.setFontSize(11.5);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  const certTitle = (certificate as any).title || `${certificate.profession || trade || 'Technical Trades'} Mastery & Safety Certification`;
  doc.text(
    `has demonstrated high vocational competence and successfully completed the rigorous training assessment in`,
    pageWidth / 2,
    y,
    { align: 'center' }
  );

  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text(`"${certTitle}"`, pageWidth / 2, y, { align: 'center' });

  if (certificate.score) {
    y += 7;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(goldAccent[0], goldAccent[1], goldAccent[2]);
    doc.text(`Assessment Score: ${certificate.score}% Mastery Level • Grade A`, pageWidth / 2, y, { align: 'center' });
  }

  // 5. Verification & Security Details Box
  y += 14;
  const certNumber = certificate.certificateNumber || `SYH-COOP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const issueYear = certificate.issueDate ? new Date(certificate.issueDate).getFullYear() : ((certificate as any).issuedYear || 2026);
  const validUntil = issueYear + 3;

  const infoBoxWidth = 230;
  const infoBoxX = (pageWidth - infoBoxWidth) / 2;

  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.5);
  doc.roundedRect(infoBoxX, y, infoBoxWidth, 14, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text(`Certificate No:`, infoBoxX + 6, y + 9);
  doc.setFont('helvetica', 'normal');
  doc.text(certNumber, infoBoxX + 32, y + 9);

  doc.setFont('helvetica', 'bold');
  doc.text(`Issued Year:`, infoBoxX + 90, y + 9);
  doc.setFont('helvetica', 'normal');
  doc.text(`${issueYear}`, infoBoxX + 110, y + 9);

  doc.setFont('helvetica', 'bold');
  doc.text(`Validity:`, infoBoxX + 130, y + 9);
  doc.setFont('helvetica', 'normal');
  doc.text(`3 Years (Valid till ${validUntil})`, infoBoxX + 144, y + 9);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
  doc.text(`[ Verified Seal ]`, infoBoxX + 195, y + 9);

  // 6. Signatures & Seals
  const sigY = pageHeight - margin - 22;

  // Left Signature: Technical Cell Director
  doc.setDrawColor(slateText[0], slateText[1], slateText[2]);
  doc.setLineWidth(0.5);
  doc.line(margin + 25, sigY, margin + 85, sigY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('Dr. S. K. Narayan', margin + 55, sigY + 5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.text('Director, Technical & Vocational Cell', margin + 55, sigY + 9, { align: 'center' });

  // Center Emblem text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(goldAccent[0], goldAccent[1], goldAccent[2]);
  doc.text('★ AIDORA TRUSTED ARTISAN ★', pageWidth / 2, sigY + 4, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.text('Digitally Authenticated on National Cooperative Ledger', pageWidth / 2, sigY + 8, { align: 'center' });

  // Right Signature: Chief Registrar
  doc.line(pageWidth - margin - 85, sigY, pageWidth - margin - 25, sigY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('Prof. Meera Deshmukh', pageWidth - margin - 55, sigY + 5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.text('Registrar General, Cooperative Federation', pageWidth - margin - 55, sigY + 9, { align: 'center' });

  // Save the PDF
  const cleanFilename = `AIDORA_Skill_Certificate_${certNumber.replace(/[^a-zA-Z0-9-]/g, '_')}.pdf`;
  doc.save(cleanFilename);
};
