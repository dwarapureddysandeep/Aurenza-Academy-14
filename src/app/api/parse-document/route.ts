import { NextRequest, NextResponse } from 'next/server';

function scanBinaryStrings(buffer: Buffer): string {
  let text = '';
  let currentString = '';
  
  // 1. Scan for standard ASCII printable strings
  for (let i = 0; i < buffer.length; i++) {
    const charCode = buffer[i];
    if ((charCode >= 32 && charCode <= 126) || charCode === 10 || charCode === 13 || charCode === 9) {
      currentString += String.fromCharCode(charCode);
    } else {
      if (currentString.trim().length > 4) {
        text += currentString.trim() + ' ';
      }
      currentString = '';
    }
  }
  if (currentString.trim().length > 4) {
    text += currentString.trim() + ' ';
  }

  // 2. Scan for UTF-16 LE printable strings (often found in newer/modified MS Office files)
  let utf16Text = '';
  let currentU16 = '';
  for (let i = 0; i < buffer.length - 1; i += 2) {
    try {
      const charCode = buffer.readUInt16LE(i);
      if ((charCode >= 32 && charCode <= 126) || charCode === 10 || charCode === 13 || charCode === 9) {
        currentU16 += String.fromCharCode(charCode);
      } else {
        if (currentU16.trim().length > 4) {
          utf16Text += currentU16.trim() + ' ';
        }
        currentU16 = '';
      }
    } catch (e) {
      break;
    }
  }
  if (currentU16.trim().length > 4) {
    utf16Text += currentU16.trim() + ' ';
  }

  // Use the longer match, which represents the more complete string encoding
  const combined = (text.length > utf16Text.length ? text : utf16Text)
    .replace(/\s+/g, ' ')
    .trim();

  // Return parsed string sequence up to a sensible limit to prevent payload noise
  return combined.substring(0, 15000);
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const fileName = file.name || '';
    const fileExtension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
    const fileSize = file.size;

    // Check size limit: 5MB
    if (fileSize > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File exceeds 5MB size limit' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    let extractedText = '';

    if (fileExtension === '.txt') {
      extractedText = buffer.toString('utf8');
    } else if (fileExtension === '.rtf') {
      try {
        const rtfText = buffer.toString('utf8');
        const cleanRtfText = rtfText
          .replace(/\\'[0-9a-f]{2}/g, '')
          .replace(/\\[a-z0-9\-]+ ?/gi, '')
          .replace(/[\{\}]/g, '')
          .replace(/\s+/g, ' ')
          .trim();
        extractedText = cleanRtfText;
      } catch (err: any) {
        console.error('RTF parsing error:', err);
        return NextResponse.json({ error: 'Failed to parse RTF document content' }, { status: 500 });
      }
    } else if (fileExtension === '.pdf') {
      // PDF Parsing
      try {
        const pdfParse = require('pdf-parse');
        const pdfData = await pdfParse(buffer);
        extractedText = pdfData.text || '';
      } catch (err: any) {
        console.error('PDF parsing error:', err);
        return NextResponse.json({ error: 'Failed to parse PDF document content' }, { status: 500 });
      }
    } else if (fileExtension === '.docx') {
      // Word DOCX Parsing
      try {
        const mammoth = require('mammoth');
        const result = await mammoth.extractRawText({ buffer });
        extractedText = result.value || '';
      } catch (err: any) {
        console.error('DOCX parsing error:', err);
        return NextResponse.json({ error: 'Failed to parse Word (.docx) document content' }, { status: 500 });
      }
    } else if (fileExtension === '.pptx') {
      // PowerPoint PPTX Parsing (unzip slide files and extract text)
      try {
        const AdmZip = require('adm-zip');
        const zip = new AdmZip(buffer);
        const zipEntries = zip.getEntries();
        let pptxText = '';

        zipEntries.forEach((entry: any) => {
          if (entry.entryName.startsWith('ppt/slides/slide') && entry.entryName.endsWith('.xml')) {
            const slideXml = entry.getData().toString('utf8');
            // Extract content between <a:t>...</a:t>
            const matches = slideXml.match(/<a:t>([^<]*)<\/a:t>/g);
            if (matches) {
              matches.forEach((m: string) => {
                // Strip tags
                const t = m.replace(/<a:t>|<\/a:t>/g, '').trim();
                if (t) {
                  pptxText += t + ' ';
                }
              });
            }
          }
        });

        extractedText = pptxText.trim();
        if (!extractedText) {
          extractedText = 'Empty presentation slide content detected.';
        }
      } catch (err: any) {
        console.error('PPTX parsing error:', err);
        return NextResponse.json({ error: 'Failed to parse PowerPoint (.pptx) document content' }, { status: 500 });
      }
    } else if (fileExtension === '.doc' || fileExtension === '.ppt') {
      // Legacy formats (DOC / PPT) fallback string scanner
      try {
        extractedText = scanBinaryStrings(buffer);
        if (!extractedText.trim()) {
          extractedText = `Fallback parsed empty content for ${fileName}.`;
        }
      } catch (err: any) {
        console.error('Legacy file parsing error:', err);
        return NextResponse.json({ error: 'Failed to parse legacy document binary structure' }, { status: 500 });
      }
    } else {
      return NextResponse.json({ error: `Unsupported file format: ${fileExtension}. Supported formats: .pdf, .docx, .doc, .txt, .pptx, .ppt, .rtf` }, { status: 400 });
    }

    // Sanitize extracted text
    const cleanText = extractedText
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, '') // remove control chars
      .replace(/\s+/g, ' ') // normalize whitespace
      .trim();

    return NextResponse.json({
      success: true,
      text: cleanText,
      fileName,
      fileSize,
      fileType: fileExtension
    });

  } catch (err: any) {
    console.error('Document parsing server error:', err);
    return NextResponse.json({ error: 'Internal server error while parsing file.' }, { status: 500 });
  }
}
