/**
 * LEEWAY COMPLIANCE HEADER — DO NOT REMOVE
 * REGION: LEEWAY.APP.RUNTIME
 * TAG: LEEWAY.APP.RUNTIME.BROWSER_EXPORTS
 * WHAT: Browser-local Office-compatible artifact exporters.
 * WHY: Keep Office Suites exports usable on static GitHub Pages without a server handoff.
 * WHO: LeeWay Office Suites engineering.
 * WHERE: src/leeway/officeExports.ts
 * WHEN: 2026-11-04 source transformation repair.
 * HOW: Build standards-compatible files from in-browser data and download them locally.
 * AGENTS: ASSESS, ALIGN, AUDIT
 * LICENSE: Apache-2.0
 */

import JSZip from 'jszip';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import * as XLSX from 'xlsx';
import { TransformSlide } from './types';

const escapeXml = (value: string): string =>
  value.replace(/[<>&'\"]/g, (character) => {
    switch (character) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case "'": return '&apos;';
      case '"': return '&quot;';
      default: return character;
    }
  });

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadText(text: string, filename: string, mimeType = 'text/plain'): void {
  downloadBlob(new Blob([text], { type: `${mimeType};charset=utf-8` }), filename);
}

export async function createOdtBlob(title: string, content: string): Promise<Blob> {
  const zip = new JSZip();
  zip.file('mimetype', 'application/vnd.oasis.opendocument.text', { compression: 'STORE' });
  zip.file('META-INF/manifest.xml', `<?xml version="1.0" encoding="UTF-8"?>
<manifest:manifest xmlns:manifest="urn:oasis:names:tc:opendocument:xmlns:manifest:1.0" manifest:version="1.2">
  <manifest:file-entry manifest:full-path="/" manifest:media-type="application/vnd.oasis.opendocument.text"/>
  <manifest:file-entry manifest:full-path="content.xml" manifest:media-type="text/xml"/>
  <manifest:file-entry manifest:full-path="styles.xml" manifest:media-type="text/xml"/>
  <manifest:file-entry manifest:full-path="meta.xml" manifest:media-type="text/xml"/>
</manifest:manifest>`);
  const now = new Date().toISOString();
  zip.file('meta.xml', `<?xml version="1.0" encoding="UTF-8"?>
<office:document-meta xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" xmlns:meta="urn:oasis:names:tc:opendocument:xmlns:meta:1.0" xmlns:dc="http://purl.org/dc/elements/1.1/" office:version="1.2"><office:meta><dc:title>${escapeXml(title)}</dc:title><dc:creator>LeeWay Office Suites</dc:creator><meta:creation-date>${now}</meta:creation-date><dc:date>${now}</dc:date><meta:generator>LeeWay Office Suites browser runtime</meta:generator></office:meta></office:document-meta>`);
  zip.file('styles.xml', `<?xml version="1.0" encoding="UTF-8"?><office:document-styles xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0" xmlns:fo="urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0" office:version="1.2"><office:styles><style:default-style style:family="paragraph"><style:paragraph-properties fo:line-height="120%" fo:margin-bottom="0.2cm"/><style:text-properties fo:font-size="11pt"/></style:default-style></office:styles></office:document-styles>`);
  const paragraphs = content.split('\n').map((line) => `<text:p>${escapeXml(line || ' ')}</text:p>`).join('');
  zip.file('content.xml', `<?xml version="1.0" encoding="UTF-8"?><office:document-content xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0" office:version="1.2"><office:body><office:text><text:h text:outline-level="1">${escapeXml(title)}</text:h>${paragraphs}</office:text></office:body></office:document-content>`);
  return zip.generateAsync({ type: 'blob', mimeType: 'application/vnd.oasis.opendocument.text', compression: 'DEFLATE' });
}

export async function createDocxBlob(title: string, content: string): Promise<Blob> {
  const zip = new JSZip();
  zip.file('[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/></Types>`);
  zip.file('_rels/.rels', `<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`);
  zip.file('word/_rels/document.xml.rels', `<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>`);
  zip.file('word/styles.xml', `<?xml version="1.0" encoding="UTF-8"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:rPr><w:sz w:val="22"/></w:rPr></w:style></w:styles>`);
  const paragraphs = [title, ...content.split('\n')].map((line) => `<w:p><w:r><w:t xml:space="preserve">${escapeXml(line || ' ')}</w:t></w:r></w:p>`).join('');
  zip.file('word/document.xml', `<?xml version="1.0" encoding="UTF-8"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${paragraphs}<w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/></w:sectPr></w:body></w:document>`);
  return zip.generateAsync({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', compression: 'DEFLATE' });
}

export async function createPdfBlob(title: string, content: string): Promise<Blob> {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const lines = content.split('\n').flatMap((line) => {
    const words = line.split(/\s+/);
    const wrapped: string[] = [];
    let current = '';
    words.forEach((word) => {
      const candidate = current ? `${current} ${word}` : word;
      if (font.widthOfTextAtSize(candidate, 10) > 500 && current) {
        wrapped.push(current);
        current = word;
      } else current = candidate;
    });
    wrapped.push(current);
    return wrapped.length ? wrapped : [''];
  });
  let page = pdf.addPage([612, 792]);
  let y = 748;
  page.drawText(title, { x: 48, y, size: 18, font: bold, color: rgb(0.05, 0.25, 0.45) });
  y -= 32;
  lines.forEach((line) => {
    if (y < 48) { page = pdf.addPage([612, 792]); y = 748; }
    page.drawText(line.slice(0, 120), { x: 48, y, size: 10, font, color: rgb(0.1, 0.12, 0.16) });
    y -= 15;
  });
  const pdfBytes = await pdf.save();
  const pdfBuffer = new ArrayBuffer(pdfBytes.byteLength);
  new Uint8Array(pdfBuffer).set(pdfBytes);
  return new Blob([pdfBuffer], { type: 'application/pdf' });
}

export async function createOdpBlob(title: string, slides: TransformSlide[]): Promise<Blob> {
  const zip = new JSZip();
  zip.file('mimetype', 'application/vnd.oasis.opendocument.presentation', { compression: 'STORE' });
  zip.file('META-INF/manifest.xml', `<?xml version="1.0" encoding="UTF-8"?><manifest:manifest xmlns:manifest="urn:oasis:names:tc:opendocument:xmlns:manifest:1.0" manifest:version="1.2"><manifest:file-entry manifest:full-path="/" manifest:media-type="application/vnd.oasis.opendocument.presentation"/><manifest:file-entry manifest:full-path="content.xml" manifest:media-type="text/xml"/></manifest:manifest>`);
  const pages = slides.map((slide, index) => `<draw:page draw:name="Slide ${index + 1}"><draw:frame svg:width="25cm" svg:height="4cm" svg:x="1.5cm" svg:y="1.5cm"><draw:text-box><text:h text:outline-level="1">${escapeXml(slide.title)}</text:h><text:p>${escapeXml(slide.subtitle)}</text:p></draw:text-box></draw:frame><draw:frame svg:width="25cm" svg:height="12cm" svg:x="1.5cm" svg:y="6cm"><draw:text-box>${slide.bullets.map((bullet) => `<text:p>• ${escapeXml(bullet)}</text:p>`).join('')}</draw:text-box></draw:frame></draw:page>`).join('');
  zip.file('content.xml', `<?xml version="1.0" encoding="UTF-8"?><office:document-content xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" xmlns:draw="urn:oasis:names:tc:opendocument:xmlns:drawing:1.0" xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0" xmlns:svg="urn:oasis:names:tc:opendocument:xmlns:svg-compatible:1.0" office:version="1.2"><office:body><office:presentation>${pages}</office:presentation></office:body></office:document-content>`);
  return zip.generateAsync({ type: 'blob', mimeType: 'application/vnd.oasis.opendocument.presentation', compression: 'DEFLATE' });
}

export function createSpreadsheetBlob(sheetName: string, rows: Array<Array<string | number>>, format: 'xlsx' | 'ods' | 'csv'): Blob {
  const workbook = XLSX.utils.book_new();
  const sheet = XLSX.utils.aoa_to_sheet(rows);
  XLSX.utils.book_append_sheet(workbook, sheet, sheetName.slice(0, 31));
  if (format === 'csv') return new Blob([XLSX.utils.sheet_to_csv(sheet)], { type: 'text/csv;charset=utf-8' });
  const data = XLSX.write(workbook, { bookType: format, type: 'array' });
  return new Blob([data], { type: format === 'ods' ? 'application/vnd.oasis.opendocument.spreadsheet' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

export function createHtmlDeckBlob(title: string, slides: TransformSlide[]): Blob {
  const slideHtml = slides.map((slide) => `<section><h1>${escapeXml(slide.title)}</h1><h2>${escapeXml(slide.subtitle)}</h2><ul>${slide.bullets.map((bullet) => `<li>${escapeXml(bullet)}</li>`).join('')}</ul></section>`).join('');
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${escapeXml(title)}</title><style>body{font-family:Arial;background:#071324;color:#f8fafc;margin:0}section{box-sizing:border-box;min-height:100vh;padding:12vh 12vw;page-break-after:always}h1{font-size:4rem;color:#22d3ee}h2{color:#a5f3fc}li{font-size:1.5rem;margin:1rem 0}</style></head><body>${slideHtml}</body></html>`;
  return new Blob([html], { type: 'text/html;charset=utf-8' });
}
