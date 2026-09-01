// Front Cover JPG = First Page - MANDATORY logic
// Every ebook first page is its front cover JPG, minted not printed
import { PDFDocument } from 'pdf-lib'

export async function mergeCoverAsFirstPage(coverJpgBuffer: Buffer, pdfBuffer: Buffer): Promise<Buffer> {
  const pdfDoc = await PDFDocument.load(pdfBuffer)
  const coverDoc = await PDFDocument.create()
  const jpgImage = await coverDoc.embedJpg(coverJpgBuffer)
  const page = coverDoc.addPage([jpgImage.width, jpgImage.height])
  page.drawImage(jpgImage, { x: 0, y: 0, width: page.getWidth(), height: page.getHeight() })
  
  const coverPdfBytes = await coverDoc.save()
  const coverPdf = await PDFDocument.load(coverPdfBytes)
  
  // Merge: cover as page 0 + original pdf
  const finalDoc = await PDFDocument.create()
  const [coverPage] = await finalDoc.copyPages(coverPdf, [0])
  finalDoc.addPage(coverPage)
  const originalPages = await finalDoc.copyPages(pdfDoc, pdfDoc.getPageIndices())
  originalPages.forEach(p => finalDoc.addPage(p))
  
  const finalBytes = await finalDoc.save()
  return Buffer.from(finalBytes)
}

export async function convertDocToPdf(docBuffer: Buffer, ext: string): Promise<Buffer> {
  // For doc/docx/rtf/txt/odt/mobi -> PDF conversion
  // In production: use LibreOffice API or mammoth + pdf-lib
  // For now placeholder - return as is if already PDF, else create simple PDF with text
  if (ext === 'pdf') return docBuffer
  // TODO: implement conversion via external service
  // For MVP: client uploads PDF only, other formats will be handled via CloudConvert API later
  return docBuffer
}
