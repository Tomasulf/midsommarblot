# 🔥 Midsommarblot – Deployguide till Vercel

## Vad du behöver
- Ett gratis konto på [vercel.com](https://vercel.com)
- Ett gratis konto på [github.com](https://github.com) (enklaste vägen)

---

## Steg 1 – Ladda upp koden till GitHub

1. Gå till [github.com](https://github.com) och logga in
2. Tryck på **"New repository"** (gröna knappen)
3. Namnge det `midsommarblot`
4. Välj **Public** och tryck **"Create repository"**
5. Tryck på **"uploading an existing file"**
6. Ladda upp **alla filer** från den här mappen:
   - `package.json`
   - `vite.config.js`
   - `index.html`
   - `src/main.jsx`
   - `src/App.jsx`
7. Tryck **"Commit changes"**

---

## Steg 2 – Deploya på Vercel

1. Gå till [vercel.com](https://vercel.com) och logga in med GitHub
2. Tryck **"Add New → Project"**
3. Välj ditt `midsommarblot`-repo
4. Vercel känner igen Vite automatiskt – tryck bara **"Deploy"**
5. Vänta ~1 minut

✅ **Din app är live!**
Du får en URL som t.ex. `midsommarblot.vercel.app`

---

## Steg 3 – Skicka roller via SMS

1. Öppna appen på din telefon via URL:en
2. Gå till **Spelledare → Setup**
3. Tryck **"Starta – Dela ut roller"**
4. En lista med alla roller visas med **📱 SMS**-knappar
5. Tryck SMS bredvid en roll → din SMS-app öppnas med länken förfylld
6. Ange mottagarens nummer och skicka!

Mottagaren klickar länken → ser sin roll direkt i webbläsaren.
Ingen app att installera. Fungerar på alla telefoner.

---

## Steg 4 – Eget domännamn (valfritt, gratis)

I Vercel-dashboarden kan du lägga till ett eget domännamn.
T.ex. `ausas.vercel.app` eller köp ett eget för ~10 kr/år.

---

## Felsökning

**"Build failed" i Vercel?**
→ Kontrollera att alla 5 filer är uppladdade till GitHub

**SMS-knappen öppnar inte appen?**
→ Kopiera länken istället och skicka via iMessage/WhatsApp

**Vill uppdatera appen?**
→ Ladda upp ny `src/App.jsx` till GitHub → Vercel bygger om automatiskt

---

## Teknisk info
- React 18 + Vite 4
- Inga externa databaser – all data i appen
- Roller kodas i URL:en med Base64 (ingen server behövs)
- Fungerar offline efter första laddningen


---

## Steg 5 – Sätt upp mail & SMS (efter deploy)

### Mail via Resend (gratis, 3000 mail/mån)

1. Gå till [resend.com](https://resend.com) och skapa ett gratis konto
2. Gå till **API Keys** → **Create API Key**
3. Kopiera nyckeln (börjar med `re_...`)
4. I Vercel-dashboarden: **Settings → Environment Variables**
5. Lägg till: `RESEND_API_KEY` = din nyckel
6. Gå även till **Domains** i Resend och verifiera din mailadress

> Utan verifierad domän kan du testa med `onboarding@resend.dev` som avsändare

### SMS via Twilio (ca 0.08 kr/SMS)

1. Gå till [twilio.com](https://twilio.com) och skapa konto
2. Skaffa ett telefonnummer (gratis testnummer funkar för test)
3. I Vercel: lägg till dessa miljövariabler:
   - `TWILIO_ACCOUNT_SID` – finns på twilio.com/console
   - `TWILIO_AUTH_TOKEN` – finns på twilio.com/console  
   - `TWILIO_PHONE_NUMBER` – ditt Twilio-nummer, format `+46XXXXXXXXX`
4. Redeploya i Vercel (eller vänta – det sker automatiskt)

### Skicka rollkort

1. Öppna appen → tryck **📤 Skicka rollkort**
2. Fyll i namn + mail och/eller telefon för varje spelare
3. Tryck **✉ Mail** eller **📱 SMS** per spelare
4. Klart! Spelaren får rollkortet direkt.


---

## Steg 6 – Aktivera Vercel Blob Storage (för SMS-flödet)

1. Gå till ditt projekt i Vercel-dashboarden
2. Tryck på **Storage** i menyn
3. Tryck **Create Blob Store** → ge den ett namn → **Create**
4. Vercel lägger automatiskt till `BLOB_READ_WRITE_TOKEN` som miljövariabel
5. Klart! PDF:er laddas nu upp och spelaren får en länk via SMS

### Flödet i korthet

**Mail:** Appen genererar PDF i webbläsaren → skickar som bilaga via Resend → spelaren får PDF direkt i inkorgen

**SMS:** Appen genererar PDF i webbläsaren → laddar upp till Vercel Blob → Twilio skickar SMS med länk → spelaren öppnar PDF i mobilen

