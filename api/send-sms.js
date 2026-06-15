// ─── VERCEL SERVERLESS FUNCTION – Skicka rollkortslänk via SMS ───────────────
// Kräver i Vercel Environment Variables:
//   TWILIO_ACCOUNT_SID  – hittas på console.twilio.com
//   TWILIO_AUTH_TOKEN   – hittas på console.twilio.com
//   TWILIO_PHONE_NUMBER – ditt Twilio-nummer, format +46XXXXXXXXX

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, rollNamn, rollUrl } = req.body;

  if (!to || !rollNamn || !rollUrl) {
    return res.status(400).json({ error: 'Saknar to, rollNamn eller rollUrl' });
  }

  const ACCOUNT_SID  = process.env.TWILIO_ACCOUNT_SID;
  const AUTH_TOKEN   = process.env.TWILIO_AUTH_TOKEN;
  const FROM_NUMBER  = process.env.TWILIO_PHONE_NUMBER;

  if (!ACCOUNT_SID || !AUTH_TOKEN || !FROM_NUMBER) {
    return res.status(500).json({ error: 'Twilio-miljövariabler saknas' });
  }

  const meddelande =
    `🔥 Midsommarblot – Solståndsnatten 19 juni\n` +
    `Din hemliga roll väntar: ${rollNamn}\n\n` +
    `Öppna ENSAM och läs noga:\n${rollUrl}\n\n` +
    `Ausås Blotängar kallar. Visa ingen din roll.`;

  try {
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${ACCOUNT_SID}/Messages.json`;

    const formData = new URLSearchParams();
    formData.append('To', to);
    formData.append('From', FROM_NUMBER);
    formData.append('Body', meddelande);

    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${ACCOUNT_SID}:${AUTH_TOKEN}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Twilio error:', data);
      return res.status(response.status).json({ error: data.message || 'Twilio-fel' });
    }

    return res.status(200).json({ success: true, sid: data.sid });

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Serverfel: ' + err.message });
  }
}
