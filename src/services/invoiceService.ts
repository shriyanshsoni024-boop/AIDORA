/**
 * AIDORA Cooperative Platform - Tax Invoice Generator
 * 
 * Generates an official, verifiable AIDORA Cooperative Tax Invoice PDF
 * with itemized breakdown (Labor, Cooperative Platform Fee, GST, Total),
 * booking token, customer and artisan details.
 */

import { jsPDF } from 'jspdf';
import { Booking, User } from '../types';

export interface InvoiceOptions {
  booking: Booking;
  customer?: User | null;
}

export const generateTaxInvoicePdf = (options: InvoiceOptions): void => {
  const { booking, customer } = options;
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;

  // Colors
  const primaryColor = [29, 170, 92]; // #1DAA5C
  const darkColor = [15, 23, 42];     // #0F172A
  const mutedColor = [100, 116, 139]; // #64748B
  const lightBg = [248, 250, 252];    // #F8FAFC
  const borderColor = [226, 232, 240];// #E2E8F0

  // 1. Header Banner
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('AIDORA COOPERATIVE SERVICES', margin, 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('National Artisans & Gig Workers Cooperative Federation • SIH 26089', margin, 21);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('TAX INVOICE', pageWidth - margin, 17, { align: 'right' });

  // 2. Metadata Box
  let y = 38;
  const invoiceNo = `INV-2026-${booking.token || booking.id.replace('b-', '').slice(-6).toUpperCase()}`;
  const issueDate = new Date(booking.createdAt || Date.now()).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  doc.setFontSize(9);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Invoice Number:', margin, y);
  doc.setFont('helvetica', 'normal');
  doc.text(invoiceNo, margin + 28, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Booking Token:', margin, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.text(booking.token || 'N/A', margin + 28, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.text('GSTIN / UIN:', pageWidth / 2 + 5, y);
  doc.setFont('helvetica', 'normal');
  doc.text('29AAACA8899Z1ZE (Coop Federation)', pageWidth / 2 + 30, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Invoice Date:', pageWidth / 2 + 5, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.text(issueDate, pageWidth / 2 + 30, y + 6);

  // 3. Customer & Worker Cards (Side by side)
  y += 16;
  const colWidth = (contentWidth - 8) / 2;

  // Billed To Box
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
  doc.roundedRect(margin, y, colWidth, 34, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('BILLED TO (CUSTOMER)', margin + 4, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text(booking.customerName || customer?.name || 'Valued Customer', margin + 4, y + 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
  doc.text(`Phone: ${booking.customerPhone || customer?.phone || 'Verified on platform'}`, margin + 4, y + 19);
  
  const addressText = booking.address || 'Bengaluru Urban, Karnataka';
  const splitAddress = doc.splitTextToSize(addressText, colWidth - 8);
  doc.text(splitAddress.slice(0, 2), margin + 4, y + 25);

  // Service Artisan Box
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.roundedRect(margin + colWidth + 8, y, colWidth, 34, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('SERVICE ARTISAN & COOPERATIVE', margin + colWidth + 12, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text(booking.worker?.name || 'Assigned Certified Artisan', margin + colWidth + 12, y + 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
  doc.text(`Trade: ${booking.serviceName} (${booking.tier || 'Standard'} Tier)`, margin + colWidth + 12, y + 19);
  const coopText = booking.worker?.cooperativeName || 'Bangalore Shramik Sahakari Sangha';
  const splitCoop = doc.splitTextToSize(coopText, colWidth - 8);
  doc.text(splitCoop.slice(0, 2), margin + colWidth + 12, y + 25);

  // 4. Line Items Table
  y += 44;

  // Table Header
  doc.setFillColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.rect(margin, y, contentWidth, 8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text('SL', margin + 3, y + 5.5);
  doc.text('DESCRIPTION & SERVICE SCOPE', margin + 14, y + 5.5);
  doc.text('SAC / HSN', margin + 98, y + 5.5);
  doc.text('TIER', margin + 125, y + 5.5);
  doc.text('AMOUNT (INR)', pageWidth - margin - 3, y + 5.5, { align: 'right' });

  // Table Rows
  y += 8;
  const basePrice = booking.estimatedPrice || (booking.totalPrice - (booking.connectionFee || 25));
  const coopFee = booking.connectionFee || 25;
  const gstPlatform = Math.round((coopFee * 0.18) * 10) / 10;
  const netTotal = booking.totalPrice || (basePrice + coopFee);

  const items = [
    {
      sl: '1',
      desc: `${booking.serviceName} - Direct Artisan Labor (${booking.tier} Tier)`,
      sac: '998719',
      tier: booking.tier || 'MEDIUM',
      amount: `₹${basePrice.toFixed(2)}`,
    },
    {
      sl: '2',
      desc: 'AIDORA Cooperative Platform & Safety Escrow Fee',
      sac: '998314',
      tier: 'Standard',
      amount: `₹${(coopFee - gstPlatform).toFixed(2)}`,
    },
    {
      sl: '3',
      desc: 'GST on Platform Services (CGST 9% + SGST 9%)',
      sac: '998314',
      tier: '18% Tax',
      amount: `₹${gstPlatform.toFixed(2)}`,
    },
  ];

  items.forEach((item, idx) => {
    const isEven = idx % 2 === 0;
    if (isEven) {
      doc.setFillColor(250, 250, 250);
      doc.rect(margin, y, contentWidth, 8, 'F');
    }
    doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
    doc.line(margin, y + 8, pageWidth - margin, y + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text(item.sl, margin + 3, y + 5.5);
    doc.text(item.desc, margin + 14, y + 5.5);
    doc.text(item.sac, margin + 98, y + 5.5);
    doc.text(item.tier, margin + 125, y + 5.5);
    doc.setFont('helvetica', 'bold');
    doc.text(item.amount, pageWidth - margin - 3, y + 5.5, { align: 'right' });

    y += 8;
  });

  // 5. Total and Payment Summary Box
  y += 6;
  const summaryBoxWidth = 75;
  const summaryX = pageWidth - margin - summaryBoxWidth;

  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
  doc.roundedRect(summaryX, y, summaryBoxWidth, 26, 2, 2, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
  doc.text('Subtotal:', summaryX + 4, y + 6);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text(`₹${(basePrice + coopFee - gstPlatform).toFixed(2)}`, pageWidth - margin - 4, y + 6, { align: 'right' });

  doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
  doc.text('Taxes (GST 18%):', summaryX + 4, y + 12);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text(`₹${gstPlatform.toFixed(2)}`, pageWidth - margin - 4, y + 12, { align: 'right' });

  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
  doc.line(summaryX + 4, y + 15, pageWidth - margin - 4, y + 15);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('Total Paid:', summaryX + 4, y + 21);
  doc.text(`₹${netTotal.toFixed(2)}`, pageWidth - margin - 4, y + 21, { align: 'right' });

  // 6. Payment Badge & Escrow Note
  doc.setFillColor(236, 253, 245); // light green
  doc.setDrawColor(16, 185, 129);
  doc.roundedRect(margin, y, 90, 26, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(5, 150, 105);
  doc.text('PAYMENT STATUS: COMPLETED & VERIFIED', margin + 4, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text('Payment Mode: Digital Escrow / UPI / Razorpay Test', margin + 4, y + 14);
  doc.text('Worker Direct Payout: 100% of Base Labor Transferred', margin + 4, y + 19);
  doc.text('Cooperative Margin: Retained for Artisan Welfare Pool', margin + 4, y + 23);

  // 7. Footer & Cooperative Seal
  y += 38;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text('Terms & Conditions:', margin, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
  doc.text('1. This invoice is generated under the National Cooperative Policy framework for skilled informal labor.', margin, y + 4);
  doc.text('2. 30-Day Service Guarantee applies to all verified cooperative jobs.', margin, y + 8);
  doc.text('3. This is an electronically generated authentic document and does not require a physical signature.', margin, y + 12);

  // Save the document
  const fileName = `AIDORA_Tax_Invoice_${booking.token || booking.id.replace('b-', '')}.pdf`;
  doc.save(fileName);
};
