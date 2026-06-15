// ─── VERCEL SERVERLESS FUNCTION – Generera PDF och returnera som base64 ──────
// Använder @sparticuz/chromium + puppeteer-core för att rendera HTML → PDF
// OBS: Kräver att HTML-rollkortet skickas in

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { rollHtml, rollNamn } = req.body;
  if (!rollHtml) return res.status(400).json({ error: 'Saknar rollHtml' });

  // PDF-generering sker client-side i appen via html → print-to-pdf
  // Denna endpoint är en fallback för server-side generering om det behövs
  // För nu: returnera HTML som spelaren kan skriva ut som PDF själv
  return res.status(200).json({
    success: true,
    message: 'PDF genereras client-side',
    html: rollHtml,
  });
}
