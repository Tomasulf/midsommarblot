// ─── VERCEL SERVERLESS FUNCTION – Skicka rollkort via mail med PDF-bilaga ────
// Kräver: RESEND_API_KEY i Vercel Environment Variables

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { to, rollNamn, pdfBase64, rollHtml } = req.body;
  if (!to || !rollNamn) return res.status(400).json({ error: 'Saknar to eller rollNamn' });

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) return res.status(500).json({ error: 'RESEND_API_KEY saknas' });

  try {
    const payload = {
      from: 'Vägaren <vagaren@ausas.se>',
      to: [to],
      subject: `🔥 Midsommarblot – Din roll: ${rollNamn}`,
      html: rollHtml || `<p>Din roll är <strong>${rollNamn}</strong>. Se bifogad PDF.</p>`,
      text: `Din roll är ${rollNamn}. Se bifogad PDF.`,
    };

    // Bifoga PDF om den skickats med
    if (pdfBase64) {
      payload.attachments = [{
        filename: `rollkort-${rollNamn.toLowerCase().replace(/\s+/g,'-')}.pdf`,
        content: pdfBase64,
        content_type: 'application/pdf',
      }];
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data.message || 'Resend-fel' });

    return res.status(200).json({ success: true, id: data.id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
