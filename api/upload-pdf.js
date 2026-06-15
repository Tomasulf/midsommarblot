// ─── VERCEL SERVERLESS FUNCTION – Ta emot PDF och lagra i Blob Storage ────────
// Kräver: BLOB_READ_WRITE_TOKEN i Vercel Environment Variables
// Aktivera Vercel Blob i dashboarden: Storage → Create Blob Store
// Token skapas automatiskt och läggs till i projektet

import { put } from '@vercel/blob';

export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { pdfBase64, filnamn } = req.body;
  if (!pdfBase64 || !filnamn) {
    return res.status(400).json({ error: 'Saknar pdfBase64 eller filnamn' });
  }

  try {
    // Konvertera base64 till buffer
    const pdfBuffer = Buffer.from(pdfBase64, 'base64');

    // Ladda upp till Vercel Blob
    const blob = await put(
      `rollkort/${filnamn}-${Date.now()}.pdf`,
      pdfBuffer,
      {
        access: 'public',
        contentType: 'application/pdf',
        // Filen raderas automatiskt efter 24h om du vill
        // (Vercel Blob stöder inte TTL direkt men du kan rensa manuellt)
      }
    );

    return res.status(200).json({ url: blob.url });

  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ error: 'Uppladdning misslyckades: ' + err.message });
  }
}
