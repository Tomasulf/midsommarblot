import { useState } from "react";
import { jsPDF } from "jspdf";

const T = {
  bg:"#0d0b08",papper:"#1a1510",kant:"#3a2e1e",kant2:"#1e1810",
  text:"#e8d8b8",textDim:"#8a7a5a",guld:"#c9a84c",guldDim:"#7a5a1a",rod:"#8b1a1a"
};
const BtnH={background:`linear-gradient(135deg,${T.guldDim},${T.guld})`,color:T.bg,border:"none",borderRadius:3,padding:"12px 24px",fontSize:14,fontFamily:"'Cinzel',serif",fontWeight:700,cursor:"pointer",letterSpacing:1};
const BtnS={background:"transparent",color:T.textDim,border:`1px solid ${T.kant}`,borderRadius:3,padding:"12px 24px",fontSize:14,fontFamily:"'Cinzel',serif",cursor:"pointer",letterSpacing:1};
const Sida={maxWidth:520,margin:"0 auto",padding:"16px"};
const SRubrik={fontFamily:"'Cinzel',serif",fontSize:20,color:T.guld,marginBottom:16,letterSpacing:2,borderBottom:`1px solid ${T.kant}`,paddingBottom:8};
const Tillbaka={background:"none",border:"none",color:T.textDim,fontSize:13,cursor:"pointer",padding:"6px 0",marginBottom:6,fontFamily:"inherit"};
const Kort={background:T.papper,border:`1px solid ${T.kant}`,borderRadius:4,padding:"14px",marginBottom:10};
const Lbl={fontSize:10,color:T.guldDim,letterSpacing:2,textTransform:"uppercase",marginBottom:8,display:"block"};
const RT={fontSize:13,color:T.text,lineHeight:1.7,margin:0};

const DANSLATAR=[
  {id:"abba",titel:"Dancing Queen – ABBA",tid:"~20 min in"},
  {id:"midsommar",titel:"Visa vid midsommartid",tid:"~35 min in"},
  {id:"trollmors",titel:"Trollmors vaggsång",tid:"~50 min in"},
  {id:"helan",titel:"Helan går",tid:"~65 min in"},
  {id:"folkdans",titel:"Folkdanslåt (valfri)",tid:"Slutritual"},
];

// ─── VINSTVILLKOR ────────────────────────────────────────────────────────────
const VINSTVILLKOR = {
  byn: {
    rubrik: "🌿 Byn vinner om…",
    villkor: [
      "Kultledaren pekas ut och avslöjas vid Domen – oavsett om de kultmärkta överlever.",
      "Mörkblotets Välsignelse saboteras (tre bybor vid stången: 'Ljuset håller!') OCH Kultledaren avslöjas.",
    ],
    tips: "Byn måste hitta KULTLEDAREN – inte bara de märkta. En märkt avslöjad räcker inte för seger.",
  },
  kulten: {
    rubrik: "🩸 Kulten vinner om…",
    villkor: [
      "Kultledaren överlever Domen oavslöjad – oavsett vad som händer med de märkta.",
      "Mörkblotets Välsignelse aktiveras (Kultledaren håller handen på stången 30 sek ostört under dansen).",
    ],
    tips: "Kultledaren behöver bara överleva. De märkta är sköldar och distraktioner.",
  },
  oavgjort: {
    rubrik: "⚖️ Oavgjort om…",
    villkor: [
      "En eller båda kultmärkta avslöjas – men Kultledaren klarar sig.",
      "Välsignelsen saboteras – men Kultledaren klarar sig ändå.",
    ],
    tips: "Vid oavgjort: Vägaren avgör med dramaturgi. Mörkret dog inte – det slumrade bara.",
  },
};

// ─── KULTLEDARE-INFO ─────────────────────────────────────────────────────────
const KULTLEDARE_INFO = {
  rubrik: "🩸 Du är Kultledaren",
  hemlig: true,
  beskrivning: "Bakom din byboroll gömmer sig Mörkblotets sanna ledare. Du kom till Ausås Blotängar med ett syfte: fullborda ritualen vid Solståndsnatten. Du vet vilka de kultmärkta är – de vet inte om dig.",
  uppdrag: "Överlev Domen oavslöjad. Det är allt som krävs för kultens seger. Mörkblotets Välsignelse är en bonus – om du kan aktivera den vinner kulten automatiskt.",
  valssignelsen: "Håll handen på midsommarstången ostört i 30 sekunder under dansen i Fas 3. Om mer än två personer bevittnar detta avbryts ritualen.",
  vetOmMarkta: "Du känner till de kultmärktas identiteter. Kontakta Vägaren diskret direkt efter rollutlottningen för att få deras namn.",
  foermaga: "🩸 Blodsband: En gång – skicka ett hemligt tecken till en kultmärkt (bestäm tecknet med Vägaren, t.ex. nudda örat). De förstår att du ser dem.",
  foermaga2: "🕯 Avrätta: Om en kultmärkt verkar nära att avslöja dig – presentera deras namn för Vägaren. De avslöjas som kultmärkt och förlorar sin förmåga.",
  risk: "Om byn löst rebusen vet de hur de saboterar Välsignelsen. Fokusera då på att överleva Domen istället.",
  tips: "Spela din byboroll fullt ut. Den bäste kultledaren är den som aldrig verkar misstänkt. Var lugn, hjälpsam och rimlig.",
};

// ─── KULTMÄRKEN ───────────────────────────────────────────────────────────────
const KULTMARKEN=[
  {
    id:"mk1",namn:"Skuggviskaren",
    kultInfo:"Du har blivit märkt av Mörkblotets Kult. Du vet att du tjänar en hemlig ledare i byn – men du vet inte vem. Kulten vinner om ledaren överlever Domen oavslöjad. Du vinner med kulten om det sker.",
    direktiv:"Ditt hemliga kultuppdrag: Se till att INGEN pekar på Runläsaren vid omröstningen. Avled, byt ämne, börja prata om någon annan när Runläsaren hamnar i skottgluggen.",
    hur:"Du spelar din byboroll fullt ut. Kultuppdraget är ett extra lager. Ingen ska veta att du är märkt.",
    risk:"Om du avslöjas som kultmärkt: du 'vaknar ur förtrollningen' och spelar vidare som vanlig bybo. Kultledaren kan också avrätta dig om du blir en belastning.",
  },
  {
    id:"mk2",namn:"Mörkrets Spegel",
    kultInfo:"Du har blivit märkt av Mörkblotets Kult. Du vet att du tjänar en hemlig ledare i byn – men du vet inte vem. Kulten vinner om ledaren överlever Domen oavslöjad. Du vinner med kulten om det sker.",
    direktiv:"Ditt hemliga kultuppdrag: Håll ett öga på midsommarstången. Om tre eller fler personer samlas vid den under dansen – skapa omedelbart en distraktion. Börja sjunga fel, spill något, ropa på någon. Du skyddar kultledarens ritual.",
    hur:"Du spelar din byboroll fullt ut. Kultuppdraget är ett extra lager. Ingen ska veta att du är märkt.",
    risk:"Om du avslöjas som kultmärkt: du spelar vidare som vanlig bybo. Kultledaren kan avrätta dig om du blir en belastning.",
  },
  {
    id:"mk3",namn:"Tystnadens Väktare",
    kultInfo:"Du har blivit märkt av Mörkblotets Kult. Du vet att du tjänar en hemlig ledare i byn – men du vet inte vem. Kulten vinner om ledaren överlever Domen oavslöjad. Du vinner med kulten om det sker.",
    direktiv:"Ditt hemliga kultuppdrag: Om Läkemedlaren eller Smedmästaren verkar nära att avslöja något viktigt – avbryt dem. Ställ en fråga, skratta högt, dra in någon annan. Du skyddar kultledarens anonymitet.",
    hur:"Gör det naturligt. Du är en social bybo som råkar avbryta folk lite för ofta.",
    risk:"Om du avslöjas som kultmärkt: du spelar vidare som vanlig bybo. Kultledaren kan avrätta dig om du blir en belastning.",
  },
];

const KULTMARKE_KANDIDATER=["smedmastaren","lakemedlaren","soldaten","hogprasten","runlaesaren","den_resande"];

// ─── REBUS ────────────────────────────────────────────────────────────────────
const REBUS={
  losning:"Om kultens märkta tjänare lyckas hålla folk borta från midsommarstången under hela dansen väcker de Mörkblotets kraft. Byn stoppar det genom att minst TRE personer håller händerna på stången och ropar: 'Ljuset håller!'",
  ledtradar:[
    {del:"I",  text:"»Vid det som aldrig faller ned…«",         rollId:"klokagumman"},
    {del:"II", text:"»…lägger handen den som äger natten…«",    rollId:"runlaesaren"},
    {del:"III",text:"»…när klockan slagit halvt det sista…«",   rollId:"den_resande"},
    {del:"IV", text:"»…och tre röster ropar mot ljuset…«",      rollId:"hogprasten"},
    {del:"V",  text:"»…då bryts förtrollningen under elden.«",  rollId:"klokagumman"},
  ],
};


// ─── GILLEUPPDRAG ─────────────────────────────────────────────────────────────
const GILLEUPPDRAG = {
  ortagillet: {
    namn: "🌿 Örtagillets uppdrag",
    color: "#a8d5a2",
    uppdrag: [
      "Samla rebusen: Kloka Gumman bär del I och V, Runläsaren del II, Den Resande del III, Högprästen del IV. Örtagillet leder arbetet med att samla dem.",
      "Minst två av tre örtagillsmedlemmar måste ha bildat en allians med en person från ett ANNAT gille innan Tinget.",
      "Om rebusen löses: samordna sabotaget vid stången. Se till att tre personer finns där under dansen.",
    ],
    beloning: "Om örtagillet lyckas med sina uppdrag: Kloka Gummans Helig Blick kan användas TVÅ gånger istället för en.",
  },
  smederna: {
    namn: "⚒ Smedernas uppdrag",
    color: "#d4956a",
    uppdrag: [
      "Enas om en gemensam anklagelse INNAN Tinget öppnar. Alla tre smederna måste stödja samma person offentligt.",
      "Soldaten måste ha genomfört minst ett pressförhör under Fas 1.",
      "Smedmästaren ska ha ifrågasatt Den Resande offentligt minst en gång.",
    ],
    beloning: "Om smederna lyckas: deras gemensamma anklagelse vid Tinget räknas som tre röster och kan inte blockeras av någon förmåga.",
  },
  mankyrkan: {
    namn: "☽ Månkyrkans uppdrag",
    color: "#9999e0",
    uppdrag: [
      "Högprästen måste ha avgivit sin profetia offentligt under Fas 1 – och den måste namnge en riktning (person, gille eller händelse).",
      "Runläsaren måste ha gett minst två runorakel till spelare utanför Månkyrkan.",
      "Månkyrkan måste gemensamt ha genomfört Högprästvets helgade ritual under Fas 1 eller 2.",
    ],
    beloning: "Om Månkyrkan lyckas: vid Domen får Månkyrkan ställa en bindande ja/nej-fråga till valfri spelare – de måste svara ärligt.",
  },
};

// ─── FASMEDDELANDEN PER ROLL ──────────────────────────────────────────────────
const FASMEDDELANDEN = {
  fas1: {
    rubrik: "🌿 Fas 1 börjar – Allianser & Viskningar",
    stämning: "Solen hänger lågt men sjunker inte. Ängarna doftar. Blotet väntar. Nu börjar spelet på allvar.",
    roller: {
      klokagumman:  "Du bär rebusens första och sista ord. Del I och V är dina. Välj klokt vem du delar dem med – och i vilken ordning. Börja med att observera. Tala sist.",
      lakemedlaren: "Ditt mål: en allians i varje gille innan Tinget. Börja med den du litar minst på – det är den farligaste att ha som fiende.",
      blomsterbaeraren: "BLOMSTERDAGS! 🌸 Ge din första blomma till den vuxna som ser mest nervös ut. Vad de tvingas göra – det väljer du!",
      smedmastaren: "Tinget öppnar om trettio minuter. Du har inte tid att tveka. Samla Soldaten och bestäm er för ett namn. Håll det hemligt tills Tinget.",
      soldaten:     "Ditt pressförhör måste ske nu – i Fas 1. Välj någon du misstänker och ta dem avsides. Tre frågor. Lyssna på pauserna.",
      grytan:       "BOM BOM BOM! 🥁 Slå på grytan och berätta något konstigt du sett. Sant eller falskt – du väljer! Minst en gång nu.",
      hogprasten:   "Din profetia måste avges nu. Samla folk kring dig. Välj dina ord med omsorg – vag nog att alltid ha rätt, tydlig nog att verka vis.",
      runlaesaren:  "Ditt första orakel ska ges under Fas 1. Välj mottagaren med omsorg – oraklet bör rucka på något de tror sig veta.",
      korsriddaren: "⚔️ Dags för din första äreduel! Utmana någon vuxen. Vem ser ut som de behöver bevisas felaktig? Gå fram och utmana dem!",
      den_resande:  "Du behöver tre hemligheter. Du har trettio minuter. Börja med den person som verkar mest ensam – ensamma folk berättar mest.",
      KULTLEDARE:   "🩸 Kontakta Vägaren diskret NU för att få de kultmärktas namn. Lär känna dem utan att avslöja att du vet. De arbetar för dig – men de vet inte vem du är.",
      KULTMARKT:    "🩸 Du tjänar kulten. Din ledare finns bland byborna – du vet inte vem. Börja ditt direktiv subtilt. Ingen ska märka något ännu.",
    },
  },
  fas2: {
    rubrik: "⚖️ Fas 2 – Tinget öppnar",
    stämning: "Vägaren har ringt i klockan. Det är dags att tala högt om det som viskats i skuggorna.",
    roller: {
      klokagumman:  "Du har observerat länge nog. Vad vet du nu? Om du använt Helig Blick – har du avslöjat det för rätt person? Tinget är din scen.",
      lakemedlaren: "Dina allianser prövas nu. Om någon i din krets anklagas – du måste välja om du riskerar dig eller håller tyst.",
      blomsterbaeraren: "Sitt nära en vuxen du tycker verkar konstig. Lyssna NOGA. Berätta sedan till Blomsterbärarens kompis vad du hört! 🌸",
      smedmastaren: "Är smederna redo? Om ni enats om en anklagelse – nu är rätt tillfälle. Gå fram. Tala med kraft. Låt ingen blockera er.",
      soldaten:     "Du MÅSTE anklagas nu om du inte gjort det. Välj din person. Tala högt, tala klart. Inga ursäkter.",
      grytan:       "PANG PANG PANG! 🥁 Nu är det dags för din stora PANG PANG PANG-förmåga om du inte använt den! Vem ska du fråga?",
      hogprasten:   "Din profetia avges under Tinget. Om den stämmer – påminn alla om det nu. Om den inte stämmer – börja sudda.",
      runlaesaren:  "Runbindning är mäktigast nu. Välj två spelare vars koppling skapar mest förvirring – och bind dem ihop inför alla.",
      korsriddaren: "⚔️ Om någon anklagas orättvist – nu kan du använda Riddarlöftet! Ställ dig framför dem och vittna! Är du modig nog?",
      den_resande:  "Dina hemligheter är värda mest nu. Vem betalar bäst? Sätt ett pris – och håll fast vid det.",
      KULTLEDARE:   "🩸 Styr misstankarna varsamt. Var den rimligaste rösten i rummet. Stöd en anklagelse mot någon oskyldig om det hjälper att avleda.",
      KULTMARKT:    "🩸 Ditt direktiv gäller fortfarande. Om din person hotas av anklagelse – agera. Men avslöja dig inte.",
    },
  },
  fas3: {
    rubrik: "🕯 Fas 3 – Ritualen & Dansen",
    stämning: "Elden tänds. Musiken börjar. Midsommarstången kallar. Men under dansen pågår det viktigaste spelet.",
    roller: {
      klokagumman:  "Håll ögonen på stången under dansen. Om tre bybor samlas där och ropar 'Ljuset håller!' – se till att du är en av dem.",
      lakemedlaren: "Led Helan går med full kraft. Men håll ett öga på stången. Om du löst rebusen – mobilisera tre personer dit.",
      blomsterbaeraren: "DANSA SÅ GALET DU KAN! 🌸 Hitta den konstigaste dansen du kan och lär ut den till minst en vuxen!",
      smedmastaren: "Du vägrar dansa. Det vet alla. Men du vaktar. Håll koll på stången – och på den som försöker nå den.",
      soldaten:     "Marschera. Men håll ett öga på stången. Om Kultledaren försöker aktivera Välsignelsen – du ska vara den som ser det.",
      grytan:       "BOM BOM BOM till ALLA låtar! 🥁 Du är byns hjärta! Dansa, stampa, ropa! Ingen sover i Ausås Blotängar ikväll!",
      hogprasten:   "Led cirkelgången under Trollmors vaggsång. Men var medveten: om kultledaren rör sig mot stången och du ser det – din profetia kan bekräftas nu.",
      runlaesaren:  "Sitt på marken. Blund ögon. Men lyssna. Kultledarens dans är annorlunda än andras – kan du känna vem det är?",
      korsriddaren: "⚔️ Vakta midsommarstången som en RIKTIG riddare! Om någon verkar vilja vara där ensam – du ställer dig bredvid och vaktar! Det är rättvisans uppdrag!",
      den_resande:  "Dina hemligheter har spelat ut sin roll. Nu handlar det om att överleva. Dans med alla. Skapa goodwill. Du röstar sist.",
      KULTLEDARE:   "🩸 Nu eller aldrig. 30 sekunder vid stången, ostört. Välj rätt ögonblick – när dansen är som intensivast och uppmärksamheten som störst någon annanstans.",
      KULTMARKT:    "🩸 Håll folk borta från stången. Det är ditt sista uppdrag. Hur du gör det – det är upp till dig. Var kreativ.",
    },
  },
  fas4: {
    rubrik: "🗳️ Fas 4 – Domen",
    stämning: "Dansen är slut. Vägaren kräver svar. En dom ska fällas.",
    roller: {
      klokagumman:  "Du vet mer än någon annan vid det här laget. Vad säger din blick? Peka med övertygelse – och förklara varför.",
      lakemedlaren: "Dina allianser avgörs nu. Vem förtjänar din röst? Och vem förtjänar din tystnad?",
      blomsterbaeraren: "Peka på den vuxna som verkade KONSTIGAST under kvällen. Magkänslan räknas! 🌸",
      smedmastaren: "Smedernas röster väger tungt om ni enats. Håll linjen. Ingen viker sig nu.",
      soldaten:     "Du pekar på den du tror på. Inget mer att säga. Du har aldrig ljugit för dig själv – gör det inte nu heller.",
      grytan:       "Peka på den som ALDRIG ville ta emot din gryta! De har något att dölja! 🥁",
      hogprasten:   "Din profetia avgörs nu. Om du pekar rätt – du är Ausås Blotängars störste visionär. Om fel – du ber om förlåtelse. Välj.",
      runlaesaren:  "Runorna visar dig svaret. Du har läst tecknen hela kvällen. Vad ser du?",
      korsriddaren: "⚔️ Peka på den som verkade ONDAST under kvällen. En riddare tvekar aldrig inför orättvisan!",
      den_resande:  "Du röstar sist. Använd ditt vildkort om läget kräver det. En sista hemlighet kan avslöjas nu om priset är rätt.",
      KULTLEDARE:   "🩸 Håll masken. En sista minut. Peka på någon oskyldig med övertygelse. Du har överlevt hela kvällen – sluta inte nu.",
      KULTMARKT:    "🩸 Peka på den du tror bör avleda mest uppmärksamhet från kultledaren. Din ledare är fortfarande okänd – skydda det.",
    },
  },
};


// ─── POÄNGSYSTEM ──────────────────────────────────────────────────────────────

const UPPGIFTER = [
  // INDIVIDUELLA
  { id:"blomma",        label:"Ge bort en blomma",               poang:5,  kategori:"barnroll",    rollId:["blomsterbaeraren"] },
  { id:"gryta",         label:"Slå på grytan inför alla",        poang:5,  kategori:"barnroll",    rollId:["grytan"] },
  { id:"duell",         label:"Vinna en äreduel",                poang:10, kategori:"barnroll",    rollId:["korsriddaren"] },
  { id:"rebus_del",     label:"Dela en rebusbit med annan",      poang:10, kategori:"rebus",       rollId:["klokagumman","runlaesaren","hogprasten","den_resande"] },
  { id:"rebus_hel",     label:"Hela rebusen löst (gillet)",      poang:50, kategori:"rebus",       rollId:["klokagumman","lakemedlaren","blomsterbaeraren"] },
  { id:"allians",       label:"Bilda allians (annat gille)",     poang:15, kategori:"relation",    rollId:"*" },
  { id:"hemlighet",     label:"Samla en hemlighet",              poang:10, kategori:"relation",    rollId:"*" },
  { id:"pressforhor",   label:"Genomföra pressförhör",           poang:15, kategori:"förmåga",     rollId:["soldaten"] },
  { id:"orakel",        label:"Ge ett runorakel",                poang:10, kategori:"förmåga",     rollId:["runlaesaren"] },
  { id:"profetia_ratt", label:"Korrekt profetia vid Domen",      poang:25, kategori:"förmåga",     rollId:["hogprasten"] },
  { id:"profetia_fel",  label:"Fel profetia (avdrag)",           poang:-10,kategori:"förmåga",     rollId:["hogprasten"] },
  { id:"heliblick",     label:"Helig Blick använd korrekt",      poang:20, kategori:"förmåga",     rollId:["klokagumman"] },
  { id:"handelsvara",   label:"Byta hemlighet mot löfte",        poang:15, kategori:"förmåga",     rollId:["den_resande"] },
  { id:"avsloja_markt", label:"Peka ut kultmärkt vid Domen",     poang:20, kategori:"dom",         rollId:"*" },
  { id:"avsloja_ledare",label:"Peka ut Kultledaren vid Domen",   poang:40, kategori:"dom",         rollId:"*" },
  { id:"kultmarkt_klar",label:"Kultmärkt – direktiv utfört",     poang:20, kategori:"kult",        rollId:"*" },
  { id:"kultledare_klar",label:"Kultledaren överlever Domen",    poang:50, kategori:"kult",        rollId:"*" },
  // GILLEUPPDRAG – bonus till hela gillet
  { id:"gille_orta",    label:"🌿 Örtagillets uppdrag klart",    poang:30, kategori:"gille",       rollId:["klokagumman","lakemedlaren","blomsterbaeraren"], gilleBonus:true },
  { id:"gille_smed",    label:"⚒ Smedernas uppdrag klart",      poang:30, kategori:"gille",       rollId:["smedmastaren","soldaten","grytan"], gilleBonus:true },
  { id:"gille_kyr",     label:"☽ Månkyrkans uppdrag klart",     poang:30, kategori:"gille",       rollId:["hogprasten","runlaesaren","korsriddaren"], gilleBonus:true },
];

const INLOSEN = [
  { id:"ledtrad1", kostnad:30,  typ:"ledtrad",  label:"Ledtråd om kultledaren (svag)",   beskrivning:"Vägaren avslöjar: kultledarens GILLE (men inte vem)." },
  { id:"ledtrad2", kostnad:60,  typ:"ledtrad",  label:"Ledtråd om kultledaren (stark)",  beskrivning:"Vägaren avslöjar: kultledaren är INTE en av dessa tre (Vägaren väljer tre oskyldiga)." },
  { id:"roster5",  kostnad:50,  typ:"roster",   label:"5 extra röster vid Domen",        beskrivning:"Dina röster räknas × 5 vid den slutliga omröstningen." },
  { id:"roster10", kostnad:100, typ:"roster",   label:"10 extra röster vid Domen",       beskrivning:"Dina röster räknas × 10 vid den slutliga omröstningen." },
  { id:"skydd",    kostnad:40,  typ:"skydd",    label:"Immunitet mot en anklagelse",     beskrivning:"En anklagelse mot dig under Tinget avvisas automatiskt." },
];

const INITIAL_SPELARE = [
  { id:"klokagumman",   namn:"Kloka Gumman",        gille:"ortagillet",  icon:"🌾", poang:0, inlost:[], roster:1 },
  { id:"lakemedlaren",  namn:"Läkemedlaren",         gille:"ortagillet",  icon:"⚗️", poang:0, inlost:[], roster:1 },
  { id:"blomsterbaeraren",namn:"Blomsterbäraren",    gille:"ortagillet",  icon:"🌸", poang:0, inlost:[], roster:1 },
  { id:"smedmastaren",  namn:"Smedmästaren",         gille:"smederna",    icon:"🔨", poang:0, inlost:[], roster:1 },
  { id:"soldaten",      namn:"Soldaten",             gille:"smederna",    icon:"⚔️", poang:0, inlost:[], roster:1 },
  { id:"grytan",        namn:"Galningen m. Grytan",  gille:"smederna",    icon:"🥁", poang:0, inlost:[], roster:1 },
  { id:"hogprasten",    namn:"Högprästen",           gille:"mankyrkan",   icon:"🌙", poang:0, inlost:[], roster:1 },
  { id:"runlaesaren",   namn:"Runläsaren",           gille:"mankyrkan",   icon:"🔮", poang:0, inlost:[], roster:1 },
  { id:"korsriddaren",  namn:"Korsriddaren",         gille:"mankyrkan",   icon:"⚔️", poang:0, inlost:[], roster:1 },
  { id:"den_resande",   namn:"Den Resande",          gille:"fri",         icon:"🧳", poang:0, inlost:[], roster:1 },
];

const GILLE_FARG = { ortagillet:"#a8d5a2", smederna:"#d4956a", mankyrkan:"#9999e0", fri:"#c9a84c" };


// ─── FRASER & KEDJOR ──────────────────────────────────────────────────────────
//
// KEDJA 1 – "Skogens röst" (Rebus del I + III)
//   Kloka Gumman → Den Resande → Läkemedlaren
//
// KEDJA 2 – "Månens öga" (Rebus del II + IV)
//   Runläsaren → Smedmästaren → Högprästen
//
// KEDJA 3 – "Eldens vakt" (Sabotageinfo om stången)
//   Soldaten → Galningen med Grytan → Korsriddaren

const KEDJOR = [
  {
    id: "kedja1",
    namn: "Skogens röst",
    farg: "#a8d5a2",
    beskrivning: "Leder till Rebus del I & III – om när ritualen sker.",
    steg: [
      {
        fran: "klokagumman",
        till: "den_resande",
        frasFran: "Träden viskar en visa om hösten som aldrig kom.",
        triggerOrd: "viskar",
        svarslösenord: "Hösten hör de som lyssnar på rötterna.",
        pusselbit: "REBUS DEL I: »Vid det som aldrig faller ned…« – midsommarstången är nyckeln. Den som håller den äger ritualen.",
        poangBeloning: 15,
      },
      {
        fran: "den_resande",
        till: "lakemedlaren",
        frasFran: "Jag har rest länge men aldrig sett en eld som denna.",
        triggerOrd: "aldrig sett",
        svarslösenord: "Vissa eldar ser man bara en gång i livet.",
        pusselbit: "REBUS DEL III: »…när klockan slagit halvt det sista…« – ritualen aktiveras under SISTA HALVTIMMEN av spelet. Inte förrän.",
        poangBeloning: 15,
      },
    ],
  },
  {
    id: "kedja2",
    namn: "Månens öga",
    farg: "#9999e0",
    beskrivning: "Leder till Rebus del II & IV – om vem och hur många.",
    steg: [
      {
        fran: "runlaesaren",
        till: "smedmastaren",
        frasFran: "Runorna talar om en hand som söker mörker i ljusets natt.",
        triggerOrd: "hand som söker",
        svarslösenord: "Järnet känner igen handen som smider det.",
        pusselbit: "REBUS DEL II: »…lägger handen den som äger natten…« – Kultledaren måste FYSISKT hålla handen på stången. Det räcker inte att stå bredvid.",
        poangBeloning: 15,
      },
      {
        fran: "smedmastaren",
        till: "hogprasten",
        frasFran: "En smed litar på sin hammare – men hammaren kan stjälas.",
        triggerOrd: "stjälas",
        svarslösenord: "Det som stjäls i mörkret återkommer i ljuset.",
        pusselbit: "REBUS DEL IV: »…och tre röster ropar mot ljuset…« – TRE bybor måste hålla händerna på stången SAMTIDIGT och ropa högt: 'Ljuset håller!' Det bryter förtrollningen.",
        poangBeloning: 15,
      },
    ],
  },
  {
    id: "kedja3",
    namn: "Eldens vakt",
    farg: "#d4956a",
    beskrivning: "Leder till sabotageinfo – hur man stoppar Välsignelsen.",
    steg: [
      {
        fran: "soldaten",
        till: "grytan",
        frasFran: "En vakts öga ser mest när alla andras är på elden.",
        triggerOrd: "vakts öga",
        svarslösenord: "BOM! Ögat ser men grytan hör!",
        pusselbit: "SABOTAGEINFO DEL 1: Kultledarens ritual kräver 30 SEKUNDER ostört vid stången. Om någon pratar med dem, rör vid dem eller ställer sig bredvid – ritualen avbryts och måste börja om.",
        poangBeloning: 20,
      },
      {
        fran: "grytan",
        till: "korsriddaren",
        frasFran: "BOM BOM! Jag hörde något konstigt vid stången!",
        triggerOrd: "konstigt vid stången",
        svarslösenord: "Riddaren vaktar stången med svärd och hjärta!",
        pusselbit: "SABOTAGEINFO DEL 2: Om du ser någon stå stilla vid stången länge under dansen – spring dit och ställ dig bredvid dem. Fråga vad de gör. Det räcker för att avbryta ritualen. Du behöver inte förklara varför.",
        poangBeloning: 20,
      },
    ],
  },
];

// Hjälpfunktion – hitta kedjesteg för en roll
function hittaKedjesteg(rollId) {
  const resultat = [];
  KEDJOR.forEach(kedja => {
    kedja.steg.forEach((steg, idx) => {
      if (steg.fran === rollId) {
        resultat.push({ ...steg, kedjaId: kedja.id, kedjaNamn: kedja.namn, kedjaNr: idx + 1, farg: kedja.farg, typ: "sändare" });
      }
      if (steg.till === rollId) {
        resultat.push({ ...steg, kedjaId: kedja.id, kedjaNamn: kedja.namn, kedjaNr: idx + 1, farg: kedja.farg, typ: "mottagare" });
      }
    });
  });
  return resultat;
}

// ─── ÖPPNINGSMANUS ────────────────────────────────────────────────────────────
const OPPNINGSMANUS=`Välkommen till Ausås Blotängar, kära bybor.

Det är Solståndsnatten – den 19 juni 2026.
Den natt då solen står som högst och aldrig riktigt går ned.
Sedan urminnes tider har byborna samlats just denna natt för det stora blotet.

Men de gamla skrifterna varnar:
Solståndsnatten är också den natt då mörkrets krafter är som mest desperata.
Den natt då kulten vågar visa sig.

Och i år – i år känns luften tyngre än vanligt.

Bland er finns bybor med hemligheter.
Gamla tvister. Dolda lojaliteter.
Och kanske – kanske – någon som inte är den de utger sig för.

Presentera er för varandra.
Berätta vem ni är och vilket gille ni tillhör.
Men kom ihåg – på Solståndsnatten är ingen skyldig att berätta allt.`;

const BY_ROSTER=`AUSÅS BLOTÄNGAR – INVÅNARE DENNA SOLSTÅNDSNATT:

🌿 ÖRTAGILLET
  • Kloka Gumman – byns äldsta röst, bär hemligheter som rötter bär vatten
  • Läkemedlaren – blandar örter och minnen, lyssnar på allt
  • Blomsterbäraren – springer runt med blommor, ser allt vuxna missar

⚒ SMEDJANS BRÖDRASKAP
  • Smedmästaren – järnhand och stenhjärta, litar bara på bevis
  • Soldaten – snabb på beslut, långsam på ånger
  • Galningen med Grytan – bullrig, omöjlig att ignorera, slår på grytan

☽ MÅNKYRKAN
  • Högprästen – kyrkans röst, folkets hopp, mörkrets frestelse
  • Runläsaren – ser allt i stjärnorna, säger hälften av det
  • Korsriddaren – liten, modig, redo att slåss mot allt ont

🎲 DEN RESANDE
  • Den Resande – kom hit i morse, verkar veta för mycket

Bland dessa tio gömmer sig kultens inflytande.
Vem kan man lita på? Det får Solståndsnatten avgöra.`;

// ─── SPELLEDARKARAKTÄR ───────────────────────────────────────────────────────
const VAGAREN={
  namn:"Vägaren",
  icon:"⚖️",
  undertitel:"Tingets röst · Rättvisans väktare · Utan parti",
  beskrivning:"Du är Vägaren – den som kom till Ausås Blotängar för att bevittna, inte för att döma. Du bär en symbolisk våg. Du har inget gille, ingen lojalitet och ingenting att vinna eller förlora denna natt.\n\nDu är spelets röst. Du introducerar faserna, håller ordning vid Tinget och ser till att alla får tala. Men du avslöjar aldrig vad du tror – inte förrän allra sist, när domen ska fällas.",
  uppgifter:[
    "Läs öppningsmanuset och presentera byborna.",
    "Introducera varje ny fas med ett kort manus.",
    "Håll ordning vid Tinget – se till att anklagade får tala.",
    "Registrera förmågor diskret (Kloka Gummans Heliga Blick etc.).",
    "Vid Domen: räkna röster och avslöja rollerna dramatiskt.",
    "Sista ordet: 'Jag har vägt skuld mot oskuld. Vågen har talat.'",
  ],
  fasIntro:{
    fas1:"Solståndsnatten har börjat. Mingla, lyssna, bilda allianser. Tinget öppnar om trettio minuter.",
    fas2:"BYBOR AV AUSÅS BLOTÄNGAR! Tinget är öppnat! Vem bär mörkrets märke? Träd fram och tala!",
    fas3:"Tinget är stängt. Nu hedrar vi traditionen. Midsommarblotets dans – alla reser sig.",
    fas4:"Dansen är slut. Natten är kommen. Vägaren kräver nu sin dom.\n\nAlla pekar på den de tror bär mörkrets märke – tre, två, ett – PEK!",
  },
  tips:"Du vinner ingenting – men en bra Vägare gör kvällen oförglömlig. Var dramatisk, rättvis och mystisk i lagom delar.",
};

// ─── ALLA 10 SPELARROLLER ─────────────────────────────────────────────────────
const ROLLER=[

  // ── 🌿 ÖRTAGILLET ──────────────────────────────────────────────────────────
  {
    id:"klokagumman",rollnamn:"Kloka Gumman",kon:"tjej",alder:"vuxen",
    gille:"🌿 Örtagillet",gilleColor:"#a8d5a2",icon:"🌾",
    namnforslag:["Sigrid den Visa","Gunnhild Rotfinnare","Mörkögda Maret","Hildeborg","Skuggsterskan"],
    karaktar:"Gåtfull, sparsmakad med ord. Varje mening sitter. Folk lyssnar när du talar – och det vet du.",
    beskrivning:"Du är byns äldsta röst. Du minns saker andra glömt och kan känna om en person bär lögner – bara genom att se dem i ögonen. Du delar sällan vad du vet, men du vet nästan allt.",
    uppdrag:"Identifiera minst en kultmärkt person. Avslöja inte hur du vet – bara vad du vet. Om du anklagas: neka lugnt och vrid misstanken mot anklagaren.",
    foermaga:"🔍 Helig Blick: Viska ett namn till Vägaren. Du får svaret 'Ren' eller 'Fläckad'. En gång.",
    foermaga2:"🌿 Örtaté: Erbjud en spelare ett 'lugnande té' – de måste berätta en sanning om sig själva i utbyte.",
    relationer:[
      {till:"Läkemedlaren",typ:"skuld",text:"Läkemedlaren är som en dotter för dig – men de bär en hemlighet de aldrig berättat. Du vet att den finns. Du väntar på rätt tillfälle."},
      {till:"Runläsaren",typ:"gammal konflikt",text:"Ni hade en gång ett djupt samtal om mörkret i byn. Ni kom fram till olika slutsatser och har inte pratat riktigt sedan dess. Kvällen kräver kanske att ni gör det."},
      {till:"Soldaten",typ:"oro",text:"Soldaten agerar för snabbt och för hårt. Du är orolig att de kommer att anklagas fel person – eller utnyttjas av kultens märkta."},
    ],
    dans:{lat:"midsommar",direktiv:"Vagga långsamt fram och tillbaka med slutna ögon under allsången. Om någon frågar: 'Jag hör de gamla rösterna.' Öppna inte ögonen förrän låten slutar."},
    rebus:{del:"I & V",text:"»Vid det som aldrig faller ned…« och »…då bryts förtrollningen under elden.«"},
    rebusInfo:"Du bär rebusens FÖRSTA och SISTA del. Dela dem vid rätt tillfälle – och till rätt person.",
    tips:"Tala sällan men tungt. Du är byns moraliska kompass – och kultmärktarnas största hot.",
    kultMarke:null,barnroll:false,
  },

  {
    id:"lakemedlaren",rollnamn:"Läkemedlaren",kon:"tjej",alder:"vuxen",
    gille:"🌿 Örtagillet",gilleColor:"#a8d5a2",icon:"⚗️",
    namnforslag:["Botare-Astrid","Silverhanden","Ragnhild Urtvatten","Den Tysta Läkaren","Mjöd-Maja"],
    karaktar:"Varm, lyssnande, alltid tillgänglig. Folk delar sina hemligheter hos dig – och det är precis vad du vill.",
    beskrivning:"Du blandar örter och minnen. Alla som kommit till dig med smärta har fått hjälp – och alla har berättat mer än de planerat. Du glömmer ingenting.",
    uppdrag:"Bilda en hemlig allians med minst EN person från varje gille under Fas 1. Avslöja inga allianser förrän det absolut krävs för att rädda någon du skyddar.",
    foermaga:"⚗️ Motgift: Om du pekas ut vid Tinget – res dig och säg 'Jag tar motgiftet'. Tvingar fram ny omröstning.",
    foermaga2:"🤝 Läkarkall: Lägg handen på en anklagads axel och säg 'Denne är ren.' Alla måste höra motargument innan anklagelsen fortsätter.",
    relationer:[
      {till:"Kloka Gumman",typ:"skuld",text:"Kloka Gumman lärde dig allt. Du har en hemlighet du aldrig berättat för henne. Kvällen kanske kräver att du gör det."},
      {till:"Smedmästaren",typ:"gammal skuld",text:"Du räddade Smedmästaren en gång. De har inte glömt och det gör dem lojala mot dig – kanske för lojala."},
      {till:"Soldaten",typ:"vänskap",text:"Soldaten är din nära vän. Du vet saker om dem som ingen annan vet. Och tvärtom."},
    ],
    dans:{lat:"helan",direktiv:"Led 'Helan går' med total auktoritet. Den som försöker smita – notera det högt: 'Udda att just du inte vill dricka med oss ikväll.'"},
    tips:"Du är limmet mellan gillen. Ingen misstänker den som hjälper alla – använd det.",
    kultMarke:null,barnroll:false,
  },

  {
    id:"blomsterbaeraren",rollnamn:"Blomsterbäraren",kon:"tjej",alder:"barn",
    gille:"🌿 Örtagillet",gilleColor:"#ffb3c6",icon:"🌸",
    namnforslag:["Blomstermonster","Superglada Saga","Blomfröken","Prinsessan av Blommor","Blommig Elin"],
    karaktar:"Superglad, lite galen, ger blommor till folk som inte alls räknat med det.",
    beskrivning:"Du har MASSOR av blommor och du MÅSTE ge bort dem! 🌸\n\nNär du ger en blomma till någon måste de göra exakt vad du säger i TIO SEKUNDER. Dansa som en krabba, ropa 'jag är ett träd', snurra tre varv – DU bestämmer!\n\nOch håll koll på vem som VÄGRAR ta emot din blomma. Det är misstänkt.",
    uppdrag:"Ge bort minst 4 blommor under kvällen – pinnar, löv, papper, vad som helst! Varje gång säger du: 'Ta blomman och gör som jag säger!' 🌼",
    foermaga:"🌸 Blomstermagi: En gång – ge en vuxen en blomma och tvinga dem att avslöja sin HEMLIGASTE spegelhemlighet från kvällen. De måste svara ärligt!",
    foermaga2:"",
    relationer:[
      {till:"Galningen med Grytan",typ:"kompis",text:"Din bästa kompis ikväll! Ni hittar på bus tillsammans. Ju galnare desto bättre."},
    ],
    dans:{lat:"alla",direktiv:"Dansa SÅ GALET du kan till alla låtar! Uppfinn egna moves. Försök få EN vuxen att dansa precis likadant som du!"},
    tips:"Ingen misstänker den glada blomsterbäraren. Det är din superkraft! 🦸",
    kultMarke:null,barnroll:true,
  },

  // ── ⚒ SMEDJANS BRÖDRASKAP ─────────────────────────────────────────────────
  {
    id:"smedmastaren",rollnamn:"Smedmästaren",kon:"kille",alder:"vuxen",
    gille:"⚒ Smedjans Brödraskap",gilleColor:"#d4956a",icon:"🔨",
    namnforslag:["Järn-Torsten","Halvard Stenhjärta","Björn den Bestämde","Erik Hammaren","Gunnar Järnnäve"],
    karaktar:"Rättfram, skeptisk, tål inte svammel. Svår att lura – men lätt att förutsäga.",
    beskrivning:"Du leder smedernas brödraskap. Folk lyssnar på dig för att du sällan pratar utan att ha något viktigt att säga. Din svaghet: du läser folk dåligt. Den som ler mot dig kan lura dig.",
    uppdrag:"Samla smederna och enas om en gemensam anklagelse INNAN Tinget öppnar. Alla tre smederna stödjer samma person offentligt.",
    foermaga:"⚒ Vittnesed: Din anklagelse räknas dubbelt om du ger ett konkret, faktabaserat skäl.",
    foermaga2:"🔒 Ordningslag: En gång – slå handen i bordet och kräv att alla lyssnar på EN person i 2 minuter. Du väljer vem.",
    relationer:[
      {till:"Den Resande",typ:"misstanke",text:"Den Resande dök upp i morse utan förklaring. Du gillar inte folk som inte kan förklara vart de kom ifrån. Håll ett öga på dem."},
      {till:"Soldaten",typ:"lojalitet",text:"Soldaten är din närmaste allierade – men de agerar ibland utan att tänka. Håll dem i schack."},
      {till:"Läkemedlaren",typ:"skuld",text:"Läkemedlaren räddade dig en gång. Du har inte betalat tillbaka den skulden och det vet ni båda."},
    ],
    dans:{lat:"folkdans",direktiv:"VÄGRA dansa. Armarna i kors, stirrar på folk. Om någon frågar varför: 'Jag vaktar.' Håll ut minst 5 minuter."},
    tips:"Du är byns ankare. Håll fast vid fakta. Låt inte kultmärkta använda din auktoritet mot dig.",
    kultMarke:null,barnroll:false,
  },

  {
    id:"soldaten",rollnamn:"Soldaten",kon:"tjej",alder:"vuxen",
    gille:"⚒ Smedjans Brödraskap",gilleColor:"#d4956a",icon:"⚔️",
    namnforslag:["Vildkatten","Stridslysten Maja","Rödbård","Snabbdragen Saga","Eldsjälen"],
    karaktar:"Impulsiv, direkt, säger vad hon tänker innan hon tänkt klart. Svår att manipulera – lätt att provocera.",
    beskrivning:"Du reagerar med instinkten och agerar med hjärtat. Det gör dig opålitlig som strateg men trovärdig som vittne. Folk vet att du säger vad du faktiskt tror.",
    uppdrag:"Du MÅSTE framföra minst en formell anklagelse under Tinget. Koordinera med Smedmästaren i förväg – men om du inte kan hålla dig kan det hända tidigare.",
    foermaga:"⚔️ Pressförhör: Ta med en person avsides i 2 min och ställ tre direkta ja/nej-frågor de måste svara på.",
    foermaga2:"🗣 Stridsskri: En gång – peka på någon och ropa 'Förklara dig!' Alla stannar och lyssnar.",
    relationer:[
      {till:"Smedmästaren",typ:"lojalitet",text:"Smedmästaren är din chef i gillet. Du lyder – nästan alltid. Men om de har fel är du den enda som säger det."},
      {till:"Läkemedlaren",typ:"vänskap",text:"Läkemedlaren är din nära vän. De vet saker om dig som ingen annan vet. Och tvärtom."},
      {till:"Runläsaren",typ:"irritation",text:"Du litar inte på tvetydiga svar. Runläsaren ger aldrig raka svar. Ni är som eld och vatten."},
    ],
    dans:{lat:"midsommar",direktiv:"MARSCHERA i militärtakt runt hela gruppen under allsången. 'Vakthållning tar aldrig paus.' Håll på tills låten slutar."},
    tips:"Du är byns känslobarometer. Folk läser av dig för att avgöra vad de ska tycka. Det är mer makt än du tror.",
    kultMarke:null,barnroll:false,
  },

  {
    id:"grytan",rollnamn:"Galningen med Grytan",kon:"kille",alder:"barn",
    gille:"⚒ Smedjans Brödraskap",gilleColor:"#ffcc88",icon:"🥁",
    namnforslag:["Grytbulle","Bom-Bom-Björn","Bullret","Lille Larmet","Grytmllaren"],
    karaktar:"Bullrig, energisk och totalt omöjlig att ignorera.",
    beskrivning:"Du är byns OFFICIELLA ljudmakare! 🥁\n\nDu har en låtsasgryta och du slår på den när något viktigt händer. Alla MÅSTE lyssna på dig när du slår – det är LAGEN i Ausås Blotängar!\n\nDu är lite galen men det gillar alla.",
    uppdrag:"Slå på din gryta och ropa 'LYSSNA PÅ MIG!' minst 3 gånger under kvällen. Varje gång berättar du något du sett – sant eller påhittat, du väljer! 🎺",
    foermaga:"🥁 PANG PANG PANG: En gång – slå SÅ HÅRT att alla måste stanna och lyssna i 30 sekunder. Sedan ställer du EN fråga till en person du väljer. De MÅSTE svara.",
    foermaga2:"",
    relationer:[
      {till:"Blomsterbäraren",typ:"kompis",text:"Din bästa kompis ikväll! Ni hittar på bus tillsammans. Ju galnare desto bättre."},
    ],
    dans:{lat:"alla",direktiv:"Klappa takten och stampa med fötterna till ALLA låtar! Ropa 'BOM BOM BOM!' Ju mer stoj desto bättre!"},
    tips:"Du är bullrig och rolig – ingen tror att du märker saker. Men du märker ALLT! 👀",
    kultMarke:null,barnroll:true,
  },

  // ── ☽ MÅNKYRKAN ────────────────────────────────────────────────────────────
  {
    id:"hogprasten",rollnamn:"Högprästen",kon:"kille",alder:"ungdom",
    gille:"☽ Månkyrkan",gilleColor:"#9999e0",icon:"🌙",
    namnforslag:["Månrösten","Helgad Arvid","Stjärnskådaren","Nattens Röst","Halvard av Kyrkan"],
    karaktar:"Högtidlig och lite teatralisk – men bakom ceremonin finns ett skarpt huvud som räknar ut allt.",
    beskrivning:"Du är Månkyrkans röst. Folk lyssnar för att du låter som om du vet. Ibland gör du det. En sak vet du säkert: Den Resande bär på en hemlighet om dig – och du vill ha den tillbaka.",
    uppdrag:"Avge en offentlig profetia tidigt under Fas 1. Om du har rätt vid Domen – stor prestige. Om du har fel – du ber om förlåtelse inför alla.",
    foermaga:"🌙 Helgad Ritual: En gång – samla alla och led en ceremoni du hittar på. Max 3 min. Under ritualen kan ingen anklagas.",
    foermaga2:"📿 Absolution: Om en spelare bekänner en hemlighet för dig i enrum – de är skyddade från anklagelse i 10 minuter.",
    relationer:[
      {till:"Den Resande",typ:"hot",text:"Den Resande vet något om dig. Du vet inte exakt vad – men du vet att det kan skada dig. Håll dem nära och hitta ett sätt att neutralisera hotet."},
      {till:"Runläsaren",typ:"allians",text:"Du och Runläsaren delar kyrkans hemligheter. Det gör er starka – men också varandras svaghet."},
      {till:"Smedmästaren",typ:"spänning",text:"Smedmästaren litar på bevis. Du erbjuder profetior. Ni ser på världen fundamentalt olika – och det skapar gnistor."},
    ],
    dans:{lat:"trollmors",direktiv:"Ställ dig i mitten, lyft armarna sakta och led en andäktig cirkelgång med bara gester. Tala inte. Mimiken högtidlig. Håll på tills låten slutar."},
    rebus:{del:"IV",text:"»…och tre röster ropar mot ljuset…«"},
    rebusInfo:"Din rebusbit avslöjar sabotagestrategin – tre röster vid stången. Dela den bara med de mest pålitliga.",
    tips:"Var dramatisk. Pauser, lång ögonkontakt, gester. Du sätter stämningen för hela kvällen.",
    kultMarke:null,barnroll:false,
  },

  {
    id:"runlaesaren",rollnamn:"Runläsaren",kon:"tjej",alder:"ungdom",
    gille:"☽ Månkyrkan",gilleColor:"#9999e0",icon:"🔮",
    namnforslag:["Tvetyggiga Sigrun","Månögda Raven","Skuggornas Röst","Stjärntyderskan","Gåtefulla Kari"],
    karaktar:"Mystisk, aldrig rak, njuter av att folk aldrig vet vad du menar. Det är ett spel du alltid vinner.",
    beskrivning:"Du läser runor och stjärnor. Allt du säger kan tolkas åt två håll och du väljer tolkningen i efterhand. Din gamla konflikt med Kloka Gumman handlar om just detta: hon vill ha svar, du ger gåtor.",
    uppdrag:"Ge tre olika spelare ett 'runorakel' under kvällen – en mening om vad du 'ser' kring dem. Minst ett orakel ska visa sig stämma. Du väljer vilket i efterhand.",
    foermaga:"🔮 Tvetydig Profetia: Inget du säger kan bevisas vara lögn. Allt är tolkningsbart. Använd det maximalt.",
    foermaga2:"🌀 Runbindning: En gång – 'Runorna visar att dessa två delar ett öde.' Pekar ut två spelare. Skapar misstanke utan konkreta anklagelser.",
    relationer:[
      {till:"Kloka Gumman",typ:"gammal konflikt",text:"Ni hade en gång ett samtal om mörkret i byn och kom fram till olika slutsatser. Ni har inte pratat riktigt sedan dess. Kvällen kräver kanske att ni gör det."},
      {till:"Hogprasten",typ:"allians",text:"Du och Högprästen delar kyrkans hemligheter. Det gör er starka – men också varandras svaghet."},
      {till:"Soldaten",typ:"irritation",text:"Soldaten kräver alltid raka svar. Det är tröttande. Men deras direkthet gör dem svåra att läsa – vilket irriterar dig tillbaka."},
    ],
    dans:{lat:"trollmors",direktiv:"Sätt dig på marken med korsade ben och blundade ögon. Vyssja med under låten. Om någon nuddar dig – viska 'Jag ser ditt öde' utan att öppna ögonen."},
    rebus:{del:"II",text:"»…lägger handen den som äger natten…«"},
    rebusInfo:"Din rebusbit är poetisk – ge den som ett orakel till någon du vill manipulera.",
    tips:"Var mystisk. En välplacerad tystnad är kraftfullare än ett svar.",
    kultMarke:null,barnroll:false,
  },

  {
    id:"korsriddaren",rollnamn:"Korsriddaren",kon:"tjej",alder:"barn",
    gille:"☽ Månkyrkan",gilleColor:"#c8b8ff",icon:"⚔️",
    namnforslag:["Riddaren Lill-Birgit","Modigaste Maja","Järnnäven","Prinsessan med Svärdet","Lansen Linn"],
    karaktar:"Liten, modig och fullständigt övertygad om att hon kan besegra allt ont i byn – med eller utan svärd.",
    beskrivning:"Du är Månkyrkans tappre riddare! ⚔️\n\nDu har svurit ett heligt löfte att skydda Ausås Blotängar från allt ont – inklusive kultister, troll, skumma vuxna och folk som vägrar äta sin mat.\n\nDitt svärd är osynligt men MYCKET kraftfullt.",
    uppdrag:"Du måste utmana MINST EN person under kvällen till en äreduel (gör tumkrig, tärningskast, eller 'vem kan hålla andan längst'). Den som förlorar måste svara på en fråga om kvällen ärligt! ⚔️\n\nOch om du ser något konstigt – rapportera direkt till Högprästen!",
    foermaga:"⚔️ Riddarlöftet: En gång kan du ställa dig framför en person som håller på att bli anklagad och ropa 'JAG VITTNAR FÖR DENNES OSKULD!' Alla måste lyssna på ditt vittnesmål.",
    foermaga2:"",
    relationer:[
      {till:"Hogprasten",typ:"lojalitet",text:"Högprästen är din befälhavare. Du gör vad de säger – men bara om det verkar rättvist."},
      {till:"Blomsterbaeraren",typ:"kompis",text:"Blomsterbäraren är rolig men lite för blommig. Ni kan ändå hitta på saker tillsammans."},
    ],
    dans:{lat:"folkdans",direktiv:"Dans som en RIDDARE – stolt, upprätt och med osynligt svärd i hand. Om någon frågar vad du gör: 'Jag dansar och vaktar SAMTIDIGT.' Det är möjligt när man är riddare."},
    tips:"Du är liten men ingen litar mer på rättvisa än du. Och ibland ser barn saker vuxna missar! 👀",
    kultMarke:null,barnroll:true,
  },

  // ── 🎲 DEN RESANDE ─────────────────────────────────────────────────────────
  {
    id:"den_resande",rollnamn:"Den Resande",kon:"kille",alder:"vuxen",
    gille:"🎲 Utan gille",gilleColor:"#c9a84c",icon:"🧳",
    namnforslag:["Silvermunnen","Vandraren","Köpmannen utan Hem","Tor Två Ansikten","Den som kom i morse"],
    karaktar:"Charm som vapen, lojalitet som handelsvara. Alltid på rätt sida – just nu.",
    beskrivning:"Du dök upp i Ausås Blotängar i morse utan förklaring. Ingen vet vem du är eller vad du vill. Det är precis som du planerat. Du tillhör inget gille och har inga skyldigheter – men du har information, och information är makt.",
    uppdrag:"Samla minst TRE hemligheter – konkreta saker du fått höra i förtroende. Vid Tinget auktionerar du ut dem: vem betalar mest med skyddslöften?",
    foermaga:"🧳 Resandets Privilegium: Du kan byta en hemlighet mot ett bindande skyddslöfte. Den som bryter sitt löfte förlorar trovärdighet inför alla.",
    foermaga2:"🃏 Sista budet: En gång kan du byta din röst vid omröstningen i absolut sista sekund och ge en kort motivering.",
    relationer:[
      {till:"Smedmastaren",typ:"misstänkt",text:"Smedmästaren misstänker dig – med rätta. Ge dem precis tillräckligt med information för att hålla dem lugna, men aldrig nog för att avslöja ditt syfte."},
      {till:"Hogprasten",typ:"hemlighet",text:"Du vet något om Högprästen som de inte vill att byn ska veta. Vad det är – det väljer du under kvällen. Men det är ditt bästa trumfkort."},
      {till:"Runlaesaren",typ:"avtal",text:"Du och Runläsaren har ett tyst avtal: ni delar information, aldrig mot varandra. Men avtalet börjar krackelera."},
    ],
    dans:{lat:"abba",direktiv:"Dans MED ALLA och INGEN. Bryt in i andras dans, 8 sekunder, sedan vidare till nästa person. Stanna aldrig. Du är hela dansgolvets bästa vän – och ingen vet varför."},
    rebus:{del:"III",text:"»…när klockan slagit halvt det sista…«"},
    rebusInfo:"Din rebusbit handlar om tidpunkten. Sälj den dyrt – och till rätt person.",
    tips:"Din rebusbit är din mest värdefulla handelsvara. Ingen vet vad du egentligen vill ha ut av Solståndsnatten. Håll det så.",
    kultMarke:null,barnroll:false,
  },
];

// ─── TILLDELNINGSLOGIK ────────────────────────────────────────────────────────
function blandaOchTilldela(antalBarn) {
  // Slumpa kultmärken
  const markeSlump=[...KULTMARKEN].sort(()=>Math.random()-0.5).slice(0,2);
  const kandidatSlump=[...KULTMARKE_KANDIDATER].sort(()=>Math.random()-0.5).slice(0,2);

  // Slumpa kultledare bland vuxna/ungdomar (inte barn, inte samma som märkta)
  const vuxnaIds = ROLLER.filter(r=>!r.barnroll).map(r=>r.id);
  const ejKultledare = kandidatSlump; // märkta kan inte också vara ledare
  const ledareKandidater = vuxnaIds.filter(id=>!ejKultledare.includes(id));
  const kultledareId = ledareKandidater[Math.floor(Math.random()*ledareKandidater.length)];

  const vuxna=ROLLER.filter(r=>!r.barnroll).map(r=>{
    const markeIdx=kandidatSlump.indexOf(r.id);
    const erLedare=r.id===kultledareId;
    let updated = {...r};
    if(markeIdx!==-1) updated={...updated,kultMarke:markeSlump[markeIdx]};
    if(erLedare) updated={...updated,erKultledare:true};
    return updated;
  }).sort(()=>Math.random()-0.5);

  const barn=ROLLER.filter(r=>r.barnroll).sort(()=>Math.random()-0.5).slice(0,antalBarn);
  return [...vuxna,...barn];
}

// ─── TEXTEXPORT ───────────────────────────────────────────────────────────────
function genereraText(roll){
  const lines=[
    "════════════════════════════════════",
    "MIDSOMMARBLOT · SOLSTÅNDSNATTEN","19 JUNI 2026 · AUSÅS BLOTÄNGAR",
    "════════════════════════════════════","",
    `${roll.icon}  ${roll.rollnamn}`,
    `Gille: ${roll.gille}`,"",
    "── ALTERNATIVA NAMN ──────────────",
    roll.namnforslag.join(" · "),"",
    "── KARAKTÄR ──────────────────────",roll.karaktar,"",
    "── BAKGRUND ──────────────────────",roll.beskrivning,"",
    "── DITT UPPDRAG ──────────────────",roll.uppdrag,"",
    "── FÖRMÅGA I ─────────────────────",roll.foermaga,
    ...(roll.foermaga2?["","── FÖRMÅGA II ────────────────────",roll.foermaga2]:[]),"",
    "── DINA RELATIONER ───────────────",
    ...(roll.relationer||[]).map(r=>`• ${r.till} (${r.typ}): ${r.text}`),"",
    ...(roll.rebus?["── DIN REBUSDEL ──────────────────",`${roll.rebus.del}: ${roll.rebus.text}`,roll.rebusInfo||"",""]:[]),
    ...(roll.kultMarke?["══ HEMLIGT KULTMÄRKE ══════════════",`Märke: ${roll.kultMarke.namn}`,"",roll.kultMarke.direktiv,"",`Hur: ${roll.kultMarke.hur}`,"",`Risk: ${roll.kultMarke.risk}`,"══════════════════════════════════",""]:[]),
    "── DANSDIREKTIV ──────────────────",roll.dans.direktiv,"",
    "── TIPS ──────────────────────────",roll.tips,"",
    "════════════════════════════════════",
    "Memorera. Visa ingen. Lycka till.",
    "════════════════════════════════════",
  ];
  return lines.join("\n");
}
function laddaNer(roll){
  const blob=new Blob([genereraText(roll)],{type:"text/plain;charset=utf-8"});
  const url=URL.createObjectURL(blob);const a=document.createElement("a");
  a.href=url;a.download=`solståndsnatten-${roll.id}.txt`;a.click();URL.revokeObjectURL(url);
}
function skickaMail(roll,email){
  const s=encodeURIComponent("Midsommarblot – Solståndsnatten 19 juni 2026 · Din roll");
  const b=encodeURIComponent(genereraText(roll));
  window.open(`mailto:${email}?subject=${s}&body=${b}`);
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App(){
  const [vy,setVy]=useState("start");
  // Kolla om appen öppnats via SMS-länk med rolldata
  const urlParams = new URLSearchParams(window.location.search);
  const rollFranUrl = urlParams.get('roll');
  const [antalBarn,setAntalBarn]=useState(2);
  const [fordel,setFordel]=useState([]);
  const [idx,setIdx]=useState(0);
  const [roll,setRoll]=useState(null);
  const [avslojar,setAvslojar]=useState(false);
  const [bekr,setBekr]=useState(false);
  const [alder,setAlder]=useState("");
  const [kon,setKon]=useState(null);
  const [alderKlar,setAlderKlar]=useState(false);
  const [sTab,setSTab]=useState(0);
  const [visaKontakter,setVisaKontakter]=useState(false);
  const [visaVagare,setVisaVagare]=useState(false);
  const [spelare,setSpelare]=useState(()=>INITIAL_SPELARE.map(s=>({...s})));
  const [domAvslojad,setDomAvslojad]=useState(false);
  const [aktivFas,setAktivFas]=useState(null);
  const [spelarRollId,setSpelarRollId]=useState(null);
  const [spelarErLedare,setSpelarErLedare]=useState(false);
  const [spelarErMarkt,setSpelarErMarkt]=useState(false);
  const [spelarKon,setSpelarKon]=useState(null);

  function starta(){setFordel(blandaOchTilldela(antalBarn));setIdx(0);setVy("drag");reset();}
  function reset(){setRoll(null);setAvslojar(false);setBekr(false);setAlder("");setKon(null);setAlderKlar(false);}
  function bekraftaAlder(){
    const a=parseInt(alder);
    if(!alder||isNaN(a)||a<1||a>120||!kon)return;
    setAlderKlar(true);
    setSpelarKon(kon);
    const r=fordel[idx];
    if(a<10&&!r.barnroll){
      // Tilldela könsanpassad barnroll om möjligt
      const barnroller=ROLLER.filter(x=>x.barnroll);
      const konsBarn=barnroller.filter(b=>b.kon===kon);
      const pool=konsBarn.length>0?konsBarn:barnroller;
      setRoll({...pool[Math.floor(Math.random()*pool.length)],kultMarke:undefined});
    } else setRoll(r);
    setAvslojar(false);setBekr(false);
  }
  function nasta(){setIdx(i=>i+1);reset();}
  function sparaMinRoll(r){setSpelarRollId(r.id);setSpelarErLedare(!!r.erKultledare);setSpelarErMarkt(!!r.kultMarke);}
  const klart=idx>=fordel.length&&fordel.length>0;

  // Om URL innehåller rolldata – visa rollen direkt
  if(rollFranUrl){
    try{
      const decoded = JSON.parse(atob(rollFranUrl));
      const roll = ROLLER.find(r=>r.id===decoded.id);
      if(roll){
        const fullRoll = decoded.erKultledare ? {...roll,erKultledare:true} :
                         decoded.kultMarkeId  ? {...roll,kultMarke:KULTMARKEN.find(k=>k.id===decoded.kultMarkeId)} :
                         roll;
        return <div style={{minHeight:"100vh",background:T.bg,color:T.text,fontFamily:"'IM Fell English',Georgia,serif",paddingBottom:60}}>
          <style>{`@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=IM+Fell+English:ital@0;1&display=swap');*{box-sizing:border-box}body{margin:0;background:#0d0b08}button:active{opacity:.75}input:focus{outline:none}`}</style>
          <div style={{textAlign:"center",padding:"20px 0 8px"}}>
            <div style={{fontSize:11,letterSpacing:6,color:T.guldDim,fontFamily:"monospace"}}>SOLSTÅNDSNATTEN · 19 JUNI 2026</div>
          </div>
          <RollKort roll={fullRoll} onBekrafta={()=>window.location.href=window.location.pathname}/>
        </div>;
      }
    }catch(e){}
  }

  return <div style={{minHeight:"100vh",background:T.bg,color:T.text,fontFamily:"'IM Fell English',Georgia,serif",paddingBottom:60}}>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=IM+Fell+English:ital@0;1&display=swap');*{box-sizing:border-box}body{margin:0;background:#0d0b08}button:active{opacity:.75}input:focus{outline:none}`}</style>
    {vy==="start"&&<StartVy setVy={setVy}/>}
    {vy==="spelledare"&&<SpelledarVy setVy={setVy} starta={starta} tab={sTab} setTab={setSTab} antalBarn={antalBarn} setAntalBarn={setAntalBarn} visaVagare={visaVagare} setVisaVagare={setVisaVagare} spelare={spelare} setSpelare={setSpelare} domAvslojad={domAvslojad} setDomAvslojad={setDomAvslojad} fordel={fordel}/>}
    {vy==="drag"&&<DragVy fordel={fordel} idx={idx} roll={roll} avslojar={avslojar} bekr={bekr} klart={klart} alder={alder} setAlder={setAlder} kon={kon} setKon={setKon} alderKlar={alderKlar} bekraftaAlder={bekraftaAlder} setAvslojar={setAvslojar} setBekr={setBekr} nasta={nasta} setVy={setVy}/>}
    {vy==="guide"&&<GuideVy setVy={setVy}/>}
    {vy==="kontakter"&&<KontaktListeVy setVy={setVy} fordel={fordel}/>}
    {vy==="fasmeddelande"&&<FasMeddelandeVy rollId={spelarRollId} erLedare={spelarErLedare} erMarkt={spelarErMarkt} fas={aktivFas} setVy={setVy}/>}
    {vy==="fasval"&&<FasValVy setAktivFas={setAktivFas} setVy={setVy} fordel={fordel} setSpelarRollId={setSpelarRollId} setSpelarErLedare={setSpelarErLedare} setSpelarErMarkt={setSpelarErMarkt} setSpelarKon={setSpelarKon}/>}
    {vy==="poang"&&<PoangVy spelare={spelare} setSpelare={setSpelare} domAvslojad={domAvslojad} setDomAvslojad={setDomAvslojad} setVy={setVy}/>}
  </div>;
}

function StartVy({setVy}){return <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"90vh",padding:"24px 20px",textAlign:"center"}}>
  <div style={{fontSize:11,letterSpacing:9,color:T.guldDim,marginBottom:14,fontFamily:"monospace"}}>ᛗ ᛁ ᛞ ᛋ ᚢ ᛗ ᛒ ᛚ ᚩ ᛏ</div>
  <h1 style={{fontFamily:"'Cinzel',serif",fontSize:34,fontWeight:700,color:T.guld,margin:"0 0 4px",letterSpacing:3,textShadow:"0 0 40px #c9a84c44"}}>Midsommarblot</h1>
  <p style={{fontSize:13,color:T.textDim,margin:"0 0 2px",fontStyle:"italic"}}>Ausås Blotängar</p>
  <p style={{fontSize:12,color:T.guldDim,margin:"0 0 20px",letterSpacing:1}}>Solståndsnatten · 19 juni 2026</p>
  <div style={{width:80,height:1,background:`linear-gradient(to right,transparent,${T.guldDim},transparent)`,margin:"0 auto 20px"}}/>
  <p style={{fontSize:15,lineHeight:1.8,color:T.text,maxWidth:280}}>Det är natten då solen aldrig går ned.<br/>Byborna samlas kring midsommarstången<br/>för att fira årets ljusaste tid.<br/><br/>Men medan sången ekar över ängarna<br/>rör sig något i skuggorna.<br/><br/>Förtroenden kommer att prövas,<br/>allianser brytas och hemligheter avslöjas.<br/><br/>För i natt är ingenting som det verkar.</p>
  <div style={{display:"flex",gap:12,marginTop:26,flexWrap:"wrap",justifyContent:"center"}}>
    <button style={BtnH} onClick={()=>setVy("spelledare")}>⚖️ Spelledare / Vägaren</button>
    <button style={BtnS} onClick={()=>setVy("guide")}>📜 Roller & Relationer</button>
  </div>
  <div style={{display:"flex",gap:10,marginTop:10,width:"100%",maxWidth:280,flexDirection:"column"}}>
    <button style={{...BtnS,borderColor:"#9999cc44",color:"#9999cc"}} onClick={()=>setVy("fasval")}>📨 Visa mitt fasmeddelande</button>
    <button style={{...BtnS,borderColor:"#a8d5a244",color:"#a8d5a2"}} onClick={()=>setVy("kontakter")}>📤 Skicka rollkort</button>
    <button style={{...BtnS,borderColor:"#c9a84c44",color:T.guld}} onClick={()=>setVy("poang")}>⚖️ Resultattavla</button>
  </div>
</div>;}

function SpelledarVy({setVy,starta,tab,setTab,antalBarn,setAntalBarn,visaVagare,setVisaVagare,spelare,setSpelare,domAvslojad,setDomAvslojad,fordel}){
  const [visaRoster,setVisaRoster]=useState(false);
  return <div style={Sida}>
    <button style={Tillbaka} onClick={()=>setVy("start")}>← Tillbaka</button>
    <h2 style={SRubrik}>⚖️ Vägaren – Spelledare</h2>
    <TabBar tabs={["Setup","Spelguide","Vägaren","Rebus","Fas →","⚖️ Poäng"]} active={tab} onChange={setTab}/>

    {tab===0&&<>
      <div style={{...Kort,borderColor:"#5e000055",background:"#120808"}}>
        <div style={{...Lbl,color:"#cc6666"}}>🩸 Kvällens setup</div>
        <p style={{fontSize:12,color:"#cc9999",lineHeight:1.7,margin:0}}>
          <strong style={{color:"#cc3333"}}>1 hemlig Kultledare</strong> – slumpas bland vuxna/ungdomar. Vet allt om de märkta.<br/>
          <strong style={{color:"#cc6666"}}>2 Kultmärkta</strong> – vet att de tjänar kulten, men inte vem ledaren är.<br/>
          <strong style={{color:"#a8d5a2"}}>7 Bybor</strong> – vet ingenting. Måste hitta Kultledaren.<br/>
          + 2 barnroller (inga kultuppdrag).<br/><br/>
          Kultledaren kontaktar Vägaren diskret efter rollutlottning för att få de märktas namn.
        </p>
      </div>
      <div style={{...Kort,borderColor:"#c9a84c44"}}>
        <div style={Lbl}>⚖️ Vinstvillkor</div>
        {Object.entries(VINSTVILLKOR).map(([k,v])=><div key={k} style={{marginBottom:12,paddingBottom:12,borderBottom:`1px solid ${T.kant2}`}}>
          <div style={{fontSize:12,color:k==="byn"?"#a8d5a2":k==="kulten"?"#cc3333":T.guld,fontFamily:"'Cinzel',serif",marginBottom:6}}>{v.rubrik}</div>
          <ul style={{margin:"0 0 6px",paddingLeft:16}}>{v.villkor.map((vv,i)=><li key={i} style={{fontSize:12,color:T.textDim,marginBottom:4,lineHeight:1.5}}>{vv}</li>)}</ul>
          <p style={{fontSize:11,color:T.guldDim,margin:0,fontStyle:"italic"}}>{v.tips}</p>
        </div>)}
      </div>
      <div style={Kort}>
        <div style={Lbl}>🌸 Antal barnroller att använda</div>
        <div style={{display:"flex",alignItems:"center",gap:20,marginBottom:8}}>
          <button style={{background:T.kant,border:"none",color:T.text,width:34,height:34,borderRadius:3,fontSize:18,cursor:"pointer"}} onClick={()=>setAntalBarn(Math.max(0,antalBarn-1))}>−</button>
          <span style={{fontSize:24,fontFamily:"'Cinzel',serif",color:"#ffb3c6",minWidth:24,textAlign:"center"}}>{antalBarn}</span>
          <button style={{background:T.kant,border:"none",color:T.text,width:34,height:34,borderRadius:3,fontSize:18,cursor:"pointer"}} onClick={()=>setAntalBarn(Math.min(3,antalBarn+1))}>+</button>
        </div>
        <p style={{fontSize:11,color:T.textDim,margin:0}}>Tillgängliga: Blomsterbäraren 🌸, Galningen med Grytan 🥁, Korsriddaren ⚔️</p>
      </div>
      <div style={{...Kort,borderColor:T.guldDim}}>
        <button style={{background:"none",border:"none",cursor:"pointer",width:"100%",textAlign:"left",padding:0,color:"inherit",fontFamily:"inherit"}} onClick={()=>setVisaRoster(v=>!v)}>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <span style={Lbl}>📣 Byuppläsning – manus</span>
            <span style={{color:T.textDim,fontSize:12}}>{visaRoster?"▲":"▼"}</span>
          </div>
        </button>
        {visaRoster&&<pre style={{fontSize:11,color:"#d0c8a0",lineHeight:1.9,margin:0,whiteSpace:"pre-wrap",fontFamily:"'IM Fell English',Georgia,serif",fontStyle:"italic"}}>{BY_ROSTER}</pre>}
      </div>
      <div style={{...Kort,borderColor:T.guldDim+"88"}}>
        <div style={Lbl}>🔄 Omvändelselösenord</div>
        <div style={{background:"#0a0a00",border:`1px solid ${T.guldDim}`,borderRadius:3,padding:"8px",fontSize:14,color:T.guld,fontStyle:"italic",textAlign:"center"}}>"Månens nåd är villkorslös"</div>
      </div>
      <div style={Kort}>
        <div style={Lbl}>🎀 Gilletecken</div>
        <div style={{fontSize:12,color:T.textDim,lineHeight:2}}>
          🌿 Örtagillet – blomma bakom höger öra<br/>
          ⚒ Smederna – liten sten i vänster hand<br/>
          ☽ Månkyrkan – vitt snöre om handleden<br/>
          🧳 Den Resande – inget kännetecken
        </div>
      </div>
      <button style={{...BtnH,width:"100%"}} onClick={starta}>Starta – Dela ut roller →</button>
      {fordel&&fordel.length>0&&<SmsUtskick fordel={fordel}/>}
    </>}

    {tab===1&&<div>{FASER.map(f=><FasBlock key={f.fas} fas={f}/>)}</div>}

    {tab===2&&<div>
      <div style={{...Kort,borderColor:"#c9a84c55",background:"#0a0a00"}}>
        <div style={{fontSize:36,textAlign:"center",marginBottom:8}}>⚖️</div>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:18,color:T.guld,textAlign:"center",marginBottom:4}}>{VAGAREN.namn}</div>
        <div style={{fontSize:11,color:T.textDim,textAlign:"center",fontStyle:"italic",marginBottom:14}}>{VAGAREN.undertitel}</div>
        <p style={{fontSize:12,color:T.text,lineHeight:1.7,marginBottom:14,whiteSpace:"pre-line"}}>{VAGAREN.beskrivning}</p>
        <div style={Lbl}>Dina uppgifter</div>
        <ul style={{margin:0,paddingLeft:18}}>{VAGAREN.uppgifter.map((u,i)=><li key={i} style={{fontSize:12,color:T.textDim,marginBottom:6,lineHeight:1.5}}>{u}</li>)}</ul>
      </div>
      <div style={{...Kort,borderColor:"#c9a84c33"}}>
        <div style={Lbl}>📣 Fasintroduktioner</div>
        {Object.entries(VAGAREN.fasIntro).map(([k,v])=><div key={k} style={{marginBottom:12,paddingBottom:12,borderBottom:`1px solid ${T.kant2}`}}>
          <div style={{fontSize:10,color:T.guld,letterSpacing:2,fontFamily:"'Cinzel',serif",marginBottom:6}}>{k.toUpperCase()}</div>
          <p style={{fontSize:12,color:"#aac0ff",fontStyle:"italic",lineHeight:1.7,margin:0,whiteSpace:"pre-line"}}>{v}</p>
        </div>)}
      </div>
      <div style={{...Kort,borderColor:"#c9a84c33"}}>
        <div style={Lbl}>💡 Tips till Vägaren</div>
        <p style={{fontSize:12,color:T.textDim,margin:0,lineHeight:1.6}}>{VAGAREN.tips}</p>
      </div>
    </div>}

    {tab===3&&<div>
      <div style={{...Kort,borderColor:"#9999cc55",background:"#080814"}}>
        <div style={{...Lbl,color:"#9999cc"}}>🧩 Rebusen – Mörkblotets kraft</div>
        <p style={{fontSize:12,color:"#b0b0e0",lineHeight:1.6,margin:"0 0 10px"}}>{REBUS.losning}</p>
        <div style={{background:"#0a1a0a",border:"1px solid #3d6b3a",borderRadius:3,padding:"10px",marginBottom:10}}>
          <div style={{fontSize:10,color:"#a8d5a2",letterSpacing:2,marginBottom:4,fontFamily:"'Cinzel',serif"}}>SABOTAGE</div>
          <p style={{fontSize:12,color:"#a8d5a2",margin:0}}>Tre personer håller händerna på stången och ropar: "Ljuset håller!"</p>
        </div>
      </div>
      {REBUS.ledtradar.map(r=>{const ro=ROLLER.find(x=>x.id===r.rollId);return <div key={r.del} style={{...Kort,marginBottom:8,borderColor:"#9999cc33"}}>
        <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4}}>
          <span style={{fontSize:13,color:"#9999cc",fontFamily:"'Cinzel',serif",fontWeight:700}}>Del {r.del}</span>
          <span style={{fontSize:13,color:T.text}}>{ro?.icon} {ro?.rollnamn}</span>
        </div>
        <div style={{fontSize:14,color:"#ccccff",fontStyle:"italic"}}>{r.text}</div>
      </div>;})}
      <div style={{...Kort,borderColor:"#d4956a33",marginTop:8}}>
        <div style={{...Lbl,color:"#d4956a"}}>🔗 Kedjor – fraser & triggers</div>
        <p style={{fontSize:12,color:T.textDim,margin:"0 0 12px",fontStyle:"italic"}}>Tre parallella kedjor. Spelarna vet bara sin del – inte helheten.</p>
        {KEDJOR.map(kedja=><div key={kedja.id} style={{marginBottom:12,paddingBottom:12,borderBottom:`1px solid ${T.kant2}`}}>
          <div style={{fontSize:12,color:kedja.farg,fontFamily:"'Cinzel',serif",marginBottom:6}}>{kedja.namn}</div>
          {kedja.steg.map((steg,i)=>{
            const fRoll=ROLLER.find(r=>r.id===steg.fran);
            const tRoll=ROLLER.find(r=>r.id===steg.till);
            return <div key={i} style={{display:"flex",flexWrap:"wrap",alignItems:"center",gap:6,fontSize:11,color:T.textDim,marginBottom:4}}>
              <span style={{color:kedja.farg}}>{fRoll?.icon} {fRoll?.rollnamn}</span>
              <span>→ trigger: »{steg.triggerOrd}« →</span>
              <span style={{color:kedja.farg}}>{tRoll?.icon} {tRoll?.rollnamn}</span>
            </div>;
          })}
        </div>)}
      </div>
    </div>}
    {tab===4&&<div>
      <div style={{...Kort,borderColor:"#9999cc55",background:"#080814"}}>
        <div style={{...Lbl,color:"#9999cc"}}>📨 Skicka fasmeddelande</div>
        <p style={{fontSize:12,color:T.textDim,lineHeight:1.6,margin:"0 0 14px"}}>Tryck på en fas för att aktivera den. Alla spelare öppnar sedan sin telefon och ser sitt personliga meddelande.</p>
        {["fas1","fas2","fas3","fas4"].map(fasId=>{
          const fas=FASMEDDELANDEN[fasId];
          return <button key={fasId} style={{...BtnS,width:"100%",marginBottom:10,textAlign:"left",padding:"14px 16px",borderColor:fasId==="fas4"?"#c9a84c44":"#9999cc44"}} onClick={()=>{setAktivFas(fasId);}}>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:13,color:fasId==="fas4"?T.guld:"#9999cc",marginBottom:4}}>{fas.rubrik}</div>
            <div style={{fontSize:11,color:T.textDim,fontStyle:"italic"}}>{fas.stämning.slice(0,60)}…</div>
          </button>;
        })}
      </div>
      {aktivFas&&<div style={{...Kort,borderColor:"#a8d5a255",background:"#060e06"}}>
        <div style={{...Lbl,color:"#a8d5a2"}}>✓ Aktiv fas: {FASMEDDELANDEN[aktivFas].rubrik}</div>
        <p style={{fontSize:12,color:T.textDim,margin:0}}>Be alla spelare öppna sin telefon och trycka 'Visa mitt fasmeddelande'.</p>
      </div>}
    </div>}
    {tab===5&&<PoangAdmin spelare={spelare} setSpelare={setSpelare} domAvslojad={domAvslojad} setDomAvslojad={setDomAvslojad}/>}
  </div>;
}

const FASER=[
  {fas:"FÖRBEREDELSE",icon:"📋",tid:"Innan alla anländer",color:"#7a5a1a",steg:[
    "Öppna appen och starta rollutlottningen.",
    "Välj antal barnroller (0–3) beroende på hur många barn som spelar.",
    "Notera vilka 2 spelare som fick kultmärken.",
    "Förbered gilletecken: blommor, stenar, snöre.",
    "Peka ut midsommarstången – spelets viktigaste plats.",
  ]},
  {fas:"ÖPPNING",icon:"🔥",tid:"0–10 min",color:"#8b1a1a",manus:OPPNINGSMANUS,steg:[
    "Läs öppningsmanuset högt som Vägaren.",
    "Läs upp BY_ROSTER – alla karaktärsnamn utan att avslöja vem som spelar vem.",
    "Alla presenterar sig med rollnamn och gille.",
  ]},
  {fas:"FAS 1 – ALLIANSER",icon:"🤫",tid:"10–40 min",color:"#2a2a5e",steg:[
    "Fri mingel. Allianser, hemligheter, förmågor, rebussamlande.",
    "Kultmärkta aktiverar sina direktiv tyst.",
    "DANS ~20 min: Dancing Queen.",
    "DANS ~35 min: Visa vid midsommartid.",
    "Om rebusen löses: informera byn PRIVAT om stångstrategin.",
  ]},
  {fas:"FAS 2 – TINGET",icon:"⚖️",tid:"40–60 min",color:"#3d6b3a",manus:"'BYBOR AV AUSÅS BLOTÄNGAR! Tinget är öppnat! Vem bär mörkrets märke? Träd fram och tala!'",steg:[
    "Max 3 formella anklagelser.",
    "Den anklagade svarar i 90 sekunder. Anklagaren 30 sek slutplädering.",
    "DANS ~50 min: Trollmors vaggsång som kuslig bakgrundsmusik.",
  ]},
  {fas:"FAS 3 – RITUALEN",icon:"🕯",tid:"60–70 min",color:"#5e0000",manus:"'Innan domen faller – midsommarblotets dans. Alla reser sig. Stången kallar.'",steg:[
    "Spela Helan går – snapsrunda.",
    "Spela folkdanslåten – alla dansar.",
    "KRITISKT: Håll koll på stången. Kultmärkta försöker hålla folk borta.",
    "Om byn löst rebusen: tre personer samlas och ropar 'Ljuset håller!'",
  ]},
  {fas:"FAS 4 – DOMEN",icon:"🗳️",tid:"70–80 min",color:"#c9a84c",manus:"'Dansen är slut. Vägaren kräver nu sin dom.\n\nAlla pekar på den de tror bär mörkrets märke – tre, två, ett – PEK!'",steg:[
    "Alla pekar samtidigt.",
    "Majoriteten avgör. Vägaren avslöjar om den utpekade är Kultledare, kultmärkt eller oskyldig.",
    "🌿 BYN VINNER: Om Kultledaren avslöjas – oavsett om märkta överlever.",
    "🩸 KULTEN VINNER: Om Kultledaren överlever oavslöjad – oavsett vad som händer med de märkta.",
    "⚖️ OAVGJORT: Om märkta avslöjas men Kultledaren klarar sig – mörkret slumrade bara.",
    "Avslöja därefter Kultledaren + de märktas identiteter – stor dramatik!",
    "Vägaren avslutar: 'Jag har vägt skuld mot oskuld. Vågen har talat.'",
    "Avslöja ALLA roller – stor dramatik!",
  ]},
];

function DragVy({fordel,idx,roll,avslojar,bekr,klart,alder,setAlder,kon,setKon,alderKlar,bekraftaAlder,setAvslojar,setBekr,nasta,setVy}){
  const C={display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"85vh",padding:"24px 20px",textAlign:"center"};
  if(klart)return <div style={C}><div style={{fontSize:48,marginBottom:12}}>🔥</div><h3 style={{fontFamily:"'Cinzel',serif",fontSize:20,color:T.guld,marginBottom:12}}>Alla roller delade!</h3><p style={{fontSize:15,lineHeight:1.8,color:T.text}}>Ausås Blotängar är redo.<br/>Solståndsnatten börjar nu.</p><button style={{...BtnH,marginTop:32}} onClick={()=>setVy("start")}>Avsluta</button></div>;
  if(bekr)return <div style={C}><p style={{fontSize:15,lineHeight:1.8,color:T.text}}>Du har din roll.<br/>Ge telefonen vidare.</p><button style={{...BtnH,marginTop:24}} onClick={nasta}>Nästa spelare →</button></div>;
  if(avslojar&&roll)return <RollKort roll={roll} onBekrafta={()=>setBekr(true)}/>;
  if(alderKlar&&roll)return <div style={C}><div style={{fontSize:64,marginBottom:10}}>{roll.icon}</div><p style={{fontSize:13,color:T.textDim,fontStyle:"italic",marginBottom:24}}>Håll skärmen borta från de andra.</p><button style={BtnH} onClick={()=>setAvslojar(true)}>Visa min roll →</button></div>;
  return <div style={C}>
    <div style={{fontSize:11,letterSpacing:8,color:T.guldDim,marginBottom:14,fontFamily:"monospace"}}>ᚱ ᚩ ᛚ ᛚ</div>
    <p style={{fontSize:15,color:T.text,marginBottom:4}}>Spelare {idx+1} av {fordel.length}</p>
    <p style={{fontSize:13,color:T.textDim,fontStyle:"italic",marginBottom:28}}>Räck telefonen till nästa spelare</p>
    <div style={{...Kort,width:"100%",maxWidth:320}}>
      <div style={{...Lbl,textAlign:"center"}}>Hur gammal är du?</div>
      <input type="number" min="1" max="120" value={alder} onChange={e=>setAlder(e.target.value)} onKeyDown={e=>e.key==="Enter"&&bekraftaAlder()} placeholder="Ange ålder..." style={{width:"100%",background:"#0a0a00",border:`1px solid ${T.kant}`,borderRadius:3,padding:"12px",color:T.text,fontSize:18,fontFamily:"'Cinzel',serif",textAlign:"center",marginBottom:16}} autoFocus/>
      <div style={{...Lbl,textAlign:"center",marginBottom:8}}>Vad är ditt kön?</div>
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        {[["tjej","👧 Tjej"],["kille","👦 Kille"],["annat","🌟 Annat"]].map(([k,label])=>
          <button key={k} style={{flex:1,background:kon===k?T.guldDim:"#0a0a00",border:`1px solid ${kon===k?T.guld:T.kant}`,color:kon===k?T.bg:T.textDim,borderRadius:3,padding:"10px 4px",fontSize:12,fontFamily:"'Cinzel',serif",cursor:"pointer"}} onClick={()=>setKon(k)}>{label}</button>
        )}
      </div>
      <button style={{...BtnH,width:"100%",opacity:(!alder||!kon)?0.5:1}} onClick={bekraftaAlder}>Dra min roll →</button>
      {(!alder||!kon)&&<p style={{fontSize:11,color:T.textDim,textAlign:"center",marginTop:8,margin:"8px 0 0"}}>Fyll i både ålder och kön</p>}
    </div>
    <p style={{fontSize:11,color:T.textDim,marginTop:14}}>Håll skärmen borta från de andra</p>
  </div>;
}

function RollKort({roll,onBekrafta}){
  const [visNamn,setVisNamn]=useState(false);
  const [visRel,setVisRel]=useState(false);
  const [visRebus,setVisRebus]=useState(false);
  const [visMarke,setVisMarke]=useState(false);
  const [visDans,setVisDans]=useState(false);
  const [email,setEmail]=useState("");
  const [nedladdad,setNedladdad]=useState(false);
  const [mailOk,setMailOk]=useState(false);
  const ac=roll.barnroll?"#ffb3c6":roll.gilleColor||T.guld;
  return <div style={{...Sida,paddingTop:12}}>
    {roll.barnroll&&<div style={{textAlign:"center",background:"#1a0a10",border:"1px solid #ffb3c644",borderRadius:4,padding:"8px",marginBottom:10,fontSize:12,color:"#ffb3c6"}}>🌸 Barnroll – enkel och rolig!</div>}
    <div style={{textAlign:"center",padding:"14px 0 10px"}}>
      <div style={{fontSize:50}}>{roll.icon}</div>
      <div style={{fontFamily:"'Cinzel',serif",fontSize:21,fontWeight:700,color:ac,letterSpacing:2,marginTop:6}}>{roll.rollnamn}</div>
      <div style={{fontSize:12,color:ac+"88",letterSpacing:1,marginTop:2}}>{roll.gille}</div>
    </div>
    <ToggleBlock label="🎭 Alternativa namn (valfritt)" ac={ac} bg="#0a0a00" open={visNamn} setOpen={setVisNamn}>
      <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
        {roll.namnforslag.map((n,i)=><span key={i} style={{fontSize:12,background:ac+"18",color:ac,padding:"5px 12px",borderRadius:2,border:`1px solid ${ac}33`}}>{n}</span>)}
      </div>
    </ToggleBlock>
    <Sek label="✦ Karaktär" ac={ac}><p style={RT}><em>{roll.karaktar}</em></p></Sek>
    <Sek label="📖 Bakgrund" ac={ac}><p style={{...RT,whiteSpace:"pre-line"}}>{roll.beskrivning}</p></Sek>
    <Sek label="⚔ Ditt uppdrag" ac={ac} hi><p style={RT}>{roll.uppdrag}</p></Sek>
    <Sek label="✦ Förmåga I" ac={ac}><p style={RT}>{roll.foermaga}</p></Sek>
    {roll.foermaga2&&<Sek label="✦ Förmåga II" ac={ac}><p style={RT}>{roll.foermaga2}</p></Sek>}
    {roll.relationer&&roll.relationer.length>0&&
      <ToggleBlock label={`🤝 Dina relationer (${roll.relationer.length} st)`} ac={ac} bg="#06080a" open={visRel} setOpen={setVisRel}>
        {roll.relationer.map((r,i)=><div key={i} style={{marginBottom:i<roll.relationer.length-1?12:0,paddingBottom:i<roll.relationer.length-1?12:0,borderBottom:i<roll.relationer.length-1?`1px solid ${T.kant2}`:"none"}}>
          <div style={{fontSize:11,color:ac,fontFamily:"'Cinzel',serif",letterSpacing:1,marginBottom:4}}>{r.till} · <span style={{color:T.guldDim}}>{r.typ}</span></div>
          <p style={{...RT,color:T.textDim}}>{r.text}</p>
        </div>)}
      </ToggleBlock>}
    {roll.rebus&&<ToggleBlock label={`🧩 Din rebusdel – Del ${roll.rebus.del}`} ac="#9999cc" bg="#0a0a18" open={visRebus} setOpen={setVisRebus}>
      <div style={{fontSize:15,color:"#ccccff",fontStyle:"italic",textAlign:"center",padding:"12px",letterSpacing:0.5,lineHeight:1.9,background:"#06060f",borderRadius:3}}>{roll.rebus.text}</div>
      {roll.rebusInfo&&<p style={{...RT,color:"#a0a0cc",marginTop:8}}>{roll.rebusInfo}</p>}
    </ToggleBlock>}
    {roll.erKultledare&&<ToggleBlock label="🩸 HEMLIGT – Du är Kultledaren" ac="#cc3333" bg="#1a0000" open={visMarke} setOpen={setVisMarke}>
      <div style={{background:"#0a0000",border:"1px solid #cc3333",borderRadius:3,padding:"10px",marginBottom:12,fontSize:12,color:"#cc3333",textAlign:"center",fontFamily:"'Cinzel',serif",letterSpacing:1}}>AVSLÖJA DETTA FÖR INGEN</div>
      <div style={{fontSize:10,color:"#cc3333",letterSpacing:2,marginBottom:6,fontFamily:"'Cinzel',serif"}}>DIN SANNA IDENTITET</div>
      <p style={{...RT,color:"#cc9999",marginBottom:12}}>{KULTLEDARE_INFO.beskrivning}</p>
      <div style={{fontSize:10,color:"#cc3333",letterSpacing:2,marginBottom:6,fontFamily:"'Cinzel',serif"}}>DITT UPPDRAG</div>
      <p style={{...RT,color:"#cc9999",marginBottom:12}}>{KULTLEDARE_INFO.uppdrag}</p>
      <div style={{fontSize:10,color:"#cc3333",letterSpacing:2,marginBottom:6,fontFamily:"'Cinzel',serif"}}>MÖRKBLOTETS VÄLSIGNELSE</div>
      <p style={{...RT,color:"#cc9999",marginBottom:12}}>{KULTLEDARE_INFO.valssignelsen}</p>
      <div style={{fontSize:10,color:"#cc3333",letterSpacing:2,marginBottom:6,fontFamily:"'Cinzel',serif"}}>✦ FÖRMÅGA I</div>
      <p style={{...RT,color:"#cc9999",marginBottom:8}}>{KULTLEDARE_INFO.foermaga}</p>
      <div style={{fontSize:10,color:"#cc3333",letterSpacing:2,marginBottom:6,fontFamily:"'Cinzel',serif"}}>✦ FÖRMÅGA II</div>
      <p style={{...RT,color:"#cc9999",marginBottom:12}}>{KULTLEDARE_INFO.foermaga2}</p>
      <div style={{fontSize:10,color:"#cc3333",letterSpacing:2,marginBottom:6,fontFamily:"'Cinzel',serif"}}>DE KULTMÄRKTA</div>
      <p style={{...RT,color:"#cc9999",marginBottom:12}}>Kontakta Vägaren diskret direkt efter att du läst denna roll. Du får namnen på de två kultmärkta.</p>
      <div style={{fontSize:10,color:"#cc3333",letterSpacing:2,marginBottom:4,fontFamily:"'Cinzel',serif"}}>TIPS</div>
      <p style={{...RT,color:"#cc9999"}}>{KULTLEDARE_INFO.tips}</p>
    </ToggleBlock>}
    {!roll.erKultledare&&roll.kultMarke&&<ToggleBlock label={`🩸 Hemligt kultmärke – ${roll.kultMarke.namn}`} ac="#cc6666" bg="#140303" open={visMarke} setOpen={setVisMarke}>
      <div style={{background:"#0a0000",border:"1px solid #8b1a1a",borderRadius:3,padding:"10px",marginBottom:12,fontSize:12,color:"#cc6666",textAlign:"center"}}>Du är märkt av kulten. Du vet att du tjänar en hemlig ledare – men inte vem.</div>
      <div style={{fontSize:10,color:"#cc6666",letterSpacing:2,marginBottom:6,fontFamily:"'Cinzel',serif"}}>KULTENS SYFTE</div>
      <p style={{...RT,color:"#cc9999",marginBottom:10}}>{roll.kultMarke.kultInfo}</p>
      <div style={{fontSize:10,color:"#cc6666",letterSpacing:2,marginBottom:6,fontFamily:"'Cinzel',serif"}}>DITT HEMLIGA UPPDRAG</div>
      <p style={{...RT,color:"#cc9999",marginBottom:10}}>{roll.kultMarke.direktiv}</p>
      <div style={{fontSize:10,color:"#cc6666",letterSpacing:2,marginBottom:4,fontFamily:"'Cinzel',serif"}}>HUR DU GÖR DET</div>
      <p style={{...RT,color:"#cc9999",marginBottom:10}}>{roll.kultMarke.hur}</p>
      <div style={{fontSize:10,color:"#cc6666",letterSpacing:2,marginBottom:4,fontFamily:"'Cinzel',serif"}}>RISK</div>
      <p style={{...RT,color:"#cc9999"}}>{roll.kultMarke.risk}</p>
    </ToggleBlock>}
    {roll.dans&&<ToggleBlock label="🎵 Ditt dansdirektiv" ac={ac} bg="#090514" open={visDans} setOpen={setVisDans}>
      <p style={{...RT,color:"#c8b8f0"}}>{roll.dans.direktiv}</p>
    </ToggleBlock>}

    {/* KEDJOR */}
    <KedjeSektion rollId={roll.id}/>
    <Sek label="💡 Tips" ac={T.guldDim}><p style={RT}>{roll.tips}</p></Sek>
    <div style={{...Kort,borderColor:T.guldDim,marginTop:14}}>
      <div style={Lbl}>📨 Spara din roll</div>
      <button style={{...BtnS,width:"100%",marginBottom:10,fontSize:12,padding:"10px"}} onClick={()=>{laddaNer(roll);setNedladdad(true);}}>
        {nedladdad?"✓ Nedladdad!":"⬇ Ladda ned som textfil"}
      </button>
      <div style={{fontSize:11,color:T.textDim,marginBottom:8,textAlign:"center"}}>– eller skicka till din mail –</div>
      <div style={{display:"flex",gap:8}}>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="din@mail.se" style={{flex:1,background:"#0a0a00",border:`1px solid ${T.kant}`,borderRadius:3,padding:"8px 10px",color:T.text,fontSize:12,fontFamily:"inherit"}}/>
        <button style={{...BtnS,padding:"8px 14px",fontSize:12}} onClick={()=>{if(email){skickaMail(roll,email);setMailOk(true);}}}>
          {mailOk?"✓":"✉ Mail"}
        </button>
      </div>
    </div>
    <p style={{fontSize:11,color:T.textDim,textAlign:"center",marginTop:10}}>Memorera · Visa ingen · Lycka till</p>
    <button style={{...BtnH,width:"100%",marginTop:10}} onClick={onBekrafta}>Jag har läst min roll ✓</button>
    <div style={{height:32}}/>
  </div>;
}

function FasValVy({setAktivFas,setVy,fordel}){
  const [valdFas,setValdFas]=useState(null);
  const [valdRoll,setValdRoll]=useState(null);
  return <div style={Sida}>
    <button style={Tillbaka} onClick={()=>setVy("start")}>← Tillbaka</button>
    <h2 style={SRubrik}>📨 Fasmeddelande</h2>
    <div style={Kort}>
      <div style={Lbl}>Välj vilken fas som är aktiv</div>
      {["fas1","fas2","fas3","fas4"].map(fasId=>{
        const fas=FASMEDDELANDEN[fasId];
        return <button key={fasId} style={{...BtnS,width:"100%",marginBottom:8,textAlign:"left",padding:"12px 14px",borderColor:valdFas===fasId?"#9999cc":"#2a2010",background:valdFas===fasId?"#080814":"transparent"}} onClick={()=>setValdFas(fasId)}>
          <div style={{fontSize:13,color:valdFas===fasId?"#9999cc":T.textDim}}>{fas.rubrik}</div>
        </button>;
      })}
    </div>
    {valdFas&&<div style={Kort}>
      <div style={Lbl}>Vem är du?</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
        {[...ROLLER.filter(r=>!r.barnroll),...ROLLER.filter(r=>r.barnroll)].map(r=><button key={r.id} style={{fontSize:12,background:valdRoll===r.id?r.gilleColor+"33":"transparent",color:valdRoll===r.id?r.gilleColor:T.textDim,border:`1px solid ${valdRoll===r.id?r.gilleColor+"66":T.kant2}`,borderRadius:3,padding:"6px 12px",cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setValdRoll(r.id)}>{r.icon} {r.rollnamn}</button>)}
      </div>
    </div>}
    {valdFas&&valdRoll&&<button style={{...BtnH,width:"100%"}} onClick={()=>{setAktivFas(valdFas);setVy("fasmeddelande");}}>Visa mitt meddelande →</button>}
  </div>;
}

function FasMeddelandeVy({rollId,erLedare,erMarkt,fas,setVy}){
  if(!fas||!rollId) return <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"85vh",padding:24,textAlign:"center"}}>
    <p style={{color:T.textDim}}>Inget fasmeddelande aktiverat ännu.</p>
    <button style={{...BtnS,marginTop:16}} onClick={()=>setVy("start")}>← Tillbaka</button>
  </div>;

  const fasData=FASMEDDELANDEN[fas];
  const rollMsg = erLedare ? fasData.roller["KULTLEDARE"] :
                  erMarkt  ? fasData.roller["KULTMARKT"]  :
                  fasData.roller[rollId] || "Håll ögonen öppna och lita på dina instinkter.";

  const roll=ROLLER.find(r=>r.id===rollId);
  const ac=roll?roll.gilleColor:T.guld;
  const hemligFarg=erLedare?"#cc3333":erMarkt?"#cc6666":null;

  return <div style={Sida}>
    <div style={{textAlign:"center",padding:"20px 0 16px"}}>
      <div style={{fontSize:11,letterSpacing:8,color:T.guldDim,marginBottom:10,fontFamily:"monospace"}}>ᚠ ᚨ ᛋ</div>
      <div style={{fontFamily:"'Cinzel',serif",fontSize:16,color:T.guld,letterSpacing:2,marginBottom:4}}>{fasData.rubrik}</div>
    </div>

    <div style={{...Kort,borderColor:"#3a2e1e",background:"#0a0807",marginBottom:12}}>
      <p style={{fontSize:13,color:T.textDim,fontStyle:"italic",lineHeight:1.7,margin:0,textAlign:"center"}}>{fasData.stämning}</p>
    </div>

    <div style={{...Kort,borderColor:ac+"55",background:ac+"0a"}}>
      <div style={{fontSize:10,color:ac,letterSpacing:2,marginBottom:8,fontFamily:"'Cinzel',serif"}}>{roll?.icon} {roll?.rollnamn} – DITT MEDDELANDE</div>
      <p style={{fontSize:14,color:T.text,lineHeight:1.8,margin:0}}>{rollMsg}</p>
    </div>

    {(erLedare||erMarkt)&&<div style={{...Kort,borderColor:hemligFarg+"55",background:"#140303"}}>
      <div style={{fontSize:10,color:hemligFarg,letterSpacing:2,marginBottom:6,fontFamily:"'Cinzel',serif"}}>{erLedare?"🩸 KULTLEDAREN":"🩸 KULTMÄRKT"}</div>
      <p style={{fontSize:12,color:"#cc9999",margin:0,lineHeight:1.6}}>{erLedare?"Du är kultledarens öga och hand. Håll masken.":"Tjäna kulten tyst. Din ledare ser dig."}</p>
    </div>}

    {(()=>{
      const gilleMap={klokagumman:"ortagillet",lakemedlaren:"ortagillet",blomsterbaeraren:"ortagillet",smedmastaren:"smederna",soldaten:"smederna",grytan:"smederna",hogprasten:"mankyrkan",runlaesaren:"mankyrkan",korsriddaren:"mankyrkan"};
      const gKey=gilleMap[rollId];
      const gu=gKey?GILLEUPPDRAG[gKey]:null;
      return gu?<div style={{...Kort,borderColor:"#7a5a1a55"}}>
        <div style={{...Lbl,color:"#ffcc88"}}>{gu.namn} – Uppdrag</div>
        <ul style={{margin:"0 0 8px",paddingLeft:16}}>{gu.uppdrag.map((u,i)=><li key={i} style={{fontSize:12,color:T.textDim,marginBottom:5,lineHeight:1.5}}>{u}</li>)}</ul>
        <div style={{fontSize:10,color:"#ffcc66",letterSpacing:1,marginBottom:4}}>BELÖNING OM NI LYCKAS</div>
        <p style={{fontSize:12,color:"#ffcc88",margin:0,fontStyle:"italic"}}>{gu.beloning}</p>
      </div>:null;
    })()}

    <button style={{...BtnS,width:"100%",marginTop:16}} onClick={()=>setVy("start")}>← Tillbaka</button>
    <div style={{height:32}}/>
  </div>;
}


// ─── SMS-UTSKICK ──────────────────────────────────────────────────────────────
function SmsUtskick({fordel}){
  const [kopieradId,setKopieradId]=useState(null);
  const baseUrl = window.location.origin + window.location.pathname;

  function genereraUrl(roll){
    const data = {
      id: roll.id,
      erKultledare: roll.erKultledare||false,
      kultMarkeId: roll.kultMarke?.id||null,
    };
    return baseUrl + "?roll=" + btoa(JSON.stringify(data));
  }

  function oppnaSms(roll, telefon){
    const url = genereraUrl(roll);
    const text = encodeURIComponent(
      "🔥 Midsommarblot – Solståndsnatten 19 juni\n" +
      "Din hemliga roll väntar.\n\n" +
      "Öppna länken ENSAM och läs noga:\n" + url + "\n\n" +
      "Ausås Blotängar kallar. Visa ingen din roll."
    );
    window.open(`sms:${telefon||""}?body=${text}`);
  }

  function kopieraUrl(roll){
    const url = genereraUrl(roll);
    navigator.clipboard.writeText(url).then(()=>{
      setKopieradId(roll.id);
      setTimeout(()=>setKopieradId(null),2000);
    });
  }

  const vuxna = fordel.filter(r=>!r.barnroll);
  const barn  = fordel.filter(r=>r.barnroll);

  return <div style={{...Kort,borderColor:"#9999cc55",marginTop:10}}>
    <div style={{...Lbl,color:"#9999cc"}}>📱 Skicka roller via SMS</div>
    <p style={{fontSize:12,color:T.textDim,margin:"0 0 12px",lineHeight:1.5}}>
      Tryck på "SMS" för att öppna din SMS-app med länken förfylld. Mottagaren klickar länken och ser sin roll direkt.
    </p>
    {[...vuxna,...barn].map(roll=>{
      const ac=roll.barnroll?"#ffb3c6":roll.gilleColor||T.guld;
      const erLedare=roll.erKultledare;
      const erMarkt=!!roll.kultMarke;
      return <div key={roll.id} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 0",borderBottom:`1px solid ${T.kant2}`}}>
        <span style={{fontSize:18,width:28}}>{roll.icon}</span>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:12,color:ac,fontFamily:"'Cinzel',serif"}}>{roll.rollnamn}</div>
          {erLedare&&<div style={{fontSize:10,color:"#cc3333"}}>🩸 Kultledare</div>}
          {erMarkt&&!erLedare&&<div style={{fontSize:10,color:"#cc6666"}}>🩸 {roll.kultMarke.namn}</div>}
        </div>
        <button style={{background:"#0a0a18",border:"1px solid #9999cc44",color:"#9999cc",borderRadius:3,padding:"6px 12px",fontSize:11,cursor:"pointer",fontFamily:"'Cinzel',serif",whiteSpace:"nowrap"}} onClick={()=>oppnaSms(roll,"")}>
          📱 SMS
        </button>
        <button style={{background:kopieradId===roll.id?"#0a1a0a":"transparent",border:`1px solid ${kopieradId===roll.id?"#3d6b3a":T.kant2}`,color:kopieradId===roll.id?"#a8d5a2":T.textDim,borderRadius:3,padding:"6px 10px",fontSize:11,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}} onClick={()=>kopieraUrl(roll)}>
          {kopieradId===roll.id?"✓ Kopierad":"🔗 Kopiera"}
        </button>
      </div>;
    })}
    <p style={{fontSize:11,color:T.textDim,margin:"10px 0 0",fontStyle:"italic"}}>Tips: Kopiera länken och klistra in i valfritt SMS, WhatsApp eller iMessage.</p>
  </div>;
}


// ─── KEDJE-SEKTION i rollkort ─────────────────────────────────────────────────
function KedjeSektion({rollId}){
  const steg = hittaKedjesteg(rollId);
  if(!steg.length) return null;

  return <div style={{marginBottom:8}}>
    {steg.map((s,i)=>{
      const erSandare = s.typ==="sändare";
      const ac = s.farg;
      const bg = erSandare?"#080f08":"#08080f";
      const [open,setOpen] = useState(false);

      return <ToggleBlock key={i}
        label={erSandare
          ? `🗣 Din fras – ${s.kedjaNamn} (kedja ${s.kedjaNr})`
          : `👂 Din trigger – ${s.kedjaNamn} (kedja ${s.kedjaNr})`}
        ac={ac} bg={bg} open={open} setOpen={setOpen}>

        {erSandare ? <>
          <div style={{fontSize:10,color:ac,letterSpacing:2,marginBottom:6,fontFamily:"'Cinzel',serif"}}>DIN FRAS – SÄG DETTA NATURLIGT I SAMTAL</div>
          <div style={{background:"#000a00",border:`1px solid ${ac}44`,borderRadius:3,padding:"12px 14px",marginBottom:12,fontSize:14,color:"#d0ffd0",fontStyle:"italic",lineHeight:1.7,textAlign:"center"}}>
            "{s.frasFran}"
          </div>
          <div style={{fontSize:10,color:ac,letterSpacing:2,marginBottom:6,fontFamily:"'Cinzel',serif"}}>VAD DU LYSSNAR EFTER (som svar)</div>
          <div style={{background:"#0a0a00",border:`1px solid ${ac}33`,borderRadius:3,padding:"10px 12px",marginBottom:12}}>
            <div style={{fontSize:11,color:T.textDim,marginBottom:4}}>Om någon svarar med något som innehåller:</div>
            <div style={{fontSize:13,color:ac,fontStyle:"italic",fontWeight:700}}>"{s.svarslösenord.split(" ").slice(0,4).join(" ")}…"</div>
          </div>
          <div style={{fontSize:10,color:ac,letterSpacing:2,marginBottom:6,fontFamily:"'Cinzel',serif"}}>DÅ GER DU DEM DENNA PUSSELBIT</div>
          <div style={{background:"#080808",border:`1px solid ${ac}55`,borderRadius:3,padding:"12px",fontSize:12,color:"#e0e0ff",lineHeight:1.7}}>{s.pusselbit}</div>
          <div style={{fontSize:11,color:"#ffcc66",marginTop:8}}>+{s.poangBeloning} poäng registreras av Vägaren när kedjan är slutförd.</div>
        </> : <>
          <div style={{fontSize:10,color:ac,letterSpacing:2,marginBottom:6,fontFamily:"'Cinzel',serif"}}>LYSSNA EFTER – OM NÅGON SÄGER NÅGOT MED</div>
          <div style={{background:"#000a00",border:`1px solid ${ac}44`,borderRadius:3,padding:"12px 14px",marginBottom:12,fontSize:14,color:"#d0ffd0",fontStyle:"italic",textAlign:"center"}}>
            "…{s.triggerOrd}…"
          </div>
          <div style={{fontSize:10,color:ac,letterSpacing:2,marginBottom:6,fontFamily:"'Cinzel',serif"}}>SÅ SVARAR DU MED DETTA LÖSENORD</div>
          <div style={{background:"#0a0800",border:`1px solid ${ac}44`,borderRadius:3,padding:"12px 14px",marginBottom:12,fontSize:14,color:"#ffeebb",fontStyle:"italic",textAlign:"center",lineHeight:1.6}}>
            "{s.svarslösenord}"
          </div>
          <div style={{fontSize:10,color:ac,letterSpacing:2,marginBottom:6,fontFamily:"'Cinzel',serif"}}>OCH DÅ FÅR DU EN PUSSELBIT TILLBAKA</div>
          <div style={{background:"#080808",border:`1px solid ${ac}33`,borderRadius:3,padding:"10px 12px",fontSize:12,color:T.textDim,fontStyle:"italic"}}>Den som sagt frasen delar sin pusselbit med dig. Be dem visa den.</div>
        </>}
      </ToggleBlock>;
    })}
  </div>;
}


// ─── POÄNG-ADMIN (Vägarens vy) ───────────────────────────────────────────────
function PoangAdmin({spelare,setSpelare,domAvslojad,setDomAvslojad}){
  const [valdSpelare,setValdSpelare]=useState(null);
  const [bekraftaReset,setBekraftaReset]=useState(false);

  function laggTillPoang(spelarId, uppgiftId){
    const uppg=UPPGIFTER.find(u=>u.id===uppgiftId);
    if(!uppg)return;
    setSpelare(prev=>prev.map(s=>{
      if(uppg.gilleBonus){
        // Gilleuppdrag – ge poäng till alla i samma gille
        const gilleMembers=INITIAL_SPELARE.filter(x=>x.gille===s.gille).map(x=>x.id);
        if(gilleMembers.includes(spelarId)&&gilleMembers.includes(s.id)){
          return {...s,poang:s.poang+uppg.poang};
        }
        return s;
      }
      if(s.id===spelarId) return {...s,poang:Math.max(0,s.poang+uppg.poang)};
      return s;
    }));
  }

  function losaIn(spelarId, inlosenId){
    const inl=INLOSEN.find(i=>i.id===inlosenId);
    const sp=spelare.find(s=>s.id===spelarId);
    if(!inl||!sp||sp.poang<inl.kostnad)return;
    setSpelare(prev=>prev.map(s=>{
      if(s.id!==spelarId)return s;
      const nyaRoster=inl.typ==="roster5"?s.roster+5:inl.typ==="roster10"?s.roster+10:s.roster;
      return {...s,poang:s.poang-inl.kostnad,inlost:[...s.inlost,inlosenId],roster:nyaRoster};
    }));
  }

  const vald=spelare.find(s=>s.id===valdSpelare);

  return <div>
    {/* SNABBREGISTRERING */}
    <div style={Kort}>
      <div style={Lbl}>1. Välj spelare</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:0}}>
        {spelare.map(s=><button key={s.id} style={{fontSize:11,background:valdSpelare===s.id?GILLE_FARG[s.gille]+"33":"transparent",color:valdSpelare===s.id?GILLE_FARG[s.gille]:T.textDim,border:`1px solid ${valdSpelare===s.id?GILLE_FARG[s.gille]+"66":T.kant2}`,borderRadius:3,padding:"5px 10px",cursor:"pointer",fontFamily:"inherit",marginBottom:4}} onClick={()=>setValdSpelare(s.id)}>
          {s.icon} {s.namn} <span style={{color:GILLE_FARG[s.gille],fontWeight:700}}>{s.poang}p</span>
        </button>)}
      </div>
    </div>

    {vald&&<div style={Kort}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:15,color:GILLE_FARG[vald.gille]}}>{vald.icon} {vald.namn}</div>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:22,color:T.guld}}>{vald.poang}<span style={{fontSize:12,color:T.textDim}}> p</span></div>
      </div>
      <div style={Lbl}>2. Registrera utfört uppdrag</div>
      {["barnroll","rebus","relation","förmåga","dom","kult","gille"].map(kat=>{
        const uppg=UPPGIFTER.filter(u=>u.kategori===kat&&(u.rollId==="*"||u.rollId.includes(vald.id)));
        if(!uppg.length)return null;
        return <div key={kat} style={{marginBottom:10}}>
          <div style={{fontSize:10,color:T.guldDim,letterSpacing:2,marginBottom:6,textTransform:"uppercase",fontFamily:"'Cinzel',serif"}}>{kat}</div>
          <div style={{display:"flex",flexDirection:"column",gap:4}}>
            {uppg.map(u=><button key={u.id} style={{background:"transparent",border:`1px solid ${u.poang<0?"#8b1a1a":T.kant2}`,borderRadius:3,padding:"8px 12px",cursor:"pointer",textAlign:"left",fontFamily:"inherit",display:"flex",justifyContent:"space-between",alignItems:"center"}} onClick={()=>laggTillPoang(vald.id,u.id)}>
              <span style={{fontSize:12,color:T.text}}>{u.label}{u.gilleBonus?" (hela gillet)":""}</span>
              <span style={{fontSize:13,fontFamily:"'Cinzel',serif",color:u.poang<0?"#cc6666":"#a8d5a2",fontWeight:700,marginLeft:8}}>{u.poang>0?"+":""}{u.poang}p</span>
            </button>)}
          </div>
        </div>;
      })}

      <div style={{borderTop:`1px solid ${T.kant}`,marginTop:12,paddingTop:12}}>
        <div style={Lbl}>3. Lös in poäng</div>
        {INLOSEN.map(inl=>{
          const harRad=vald.inlost.includes(inl.id);
          const harPoang=vald.poang>=inl.kostnad;
          return <button key={inl.id} disabled={!harPoang||harRad} style={{width:"100%",marginBottom:6,background:harRad?"#0a1a0a":harPoang?"#0a0a18":"transparent",border:`1px solid ${harRad?"#3d6b3a":harPoang?"#9999cc44":T.kant2}`,borderRadius:3,padding:"10px 12px",cursor:harPoang&&!harRad?"pointer":"not-allowed",opacity:harPoang||harRad?1:0.4,textAlign:"left",fontFamily:"inherit"}} onClick={()=>!harRad&&losaIn(vald.id,inl.id)}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
              <span style={{fontSize:12,color:harRad?"#a8d5a2":harPoang?T.text:T.textDim,fontFamily:"'Cinzel',serif"}}>{harRad?"✓ ":""}{inl.label}</span>
              <span style={{fontSize:12,color:harRad?"#3d6b3a":"#cc6666",fontWeight:700}}>{inl.kostnad}p</span>
            </div>
            <div style={{fontSize:11,color:T.textDim,fontStyle:"italic"}}>{inl.beskrivning}</div>
          </button>;
        })}
      </div>
    </div>}

    {/* NOLLSTÄLL */}
    <div style={{...Kort,borderColor:T.rod+"44",marginTop:8}}>
      {!bekraftaReset
        ? <button style={{...BtnS,width:"100%",borderColor:T.rod+"44",color:T.rod,fontSize:12}} onClick={()=>setBekraftaReset(true)}>↺ Nollställ alla poäng</button>
        : <div>
            <p style={{fontSize:12,color:"#cc6666",margin:"0 0 10px",textAlign:"center"}}>Är du säker? Alla poäng nollställs.</p>
            <div style={{display:"flex",gap:8}}>
              <button style={{...BtnS,flex:1,fontSize:12}} onClick={()=>setBekraftaReset(false)}>Avbryt</button>
              <button style={{...BtnH,flex:1,fontSize:12,background:"#8b1a1a"}} onClick={()=>{setSpelare(INITIAL_SPELARE.map(s=>({...s})));setBekraftaReset(false);}}>Nollställ</button>
            </div>
          </div>}
    </div>
  </div>;
}

// ─── POÄNG-VY (Resultattavla – avslöjas vid Domen) ───────────────────────────
function PoangVy({spelare,setSpelare,domAvslojad,setDomAvslojad,setVy}){
  const sorterad=[...spelare].sort((a,b)=>b.poang-a.poang);
  const maxPoang=Math.max(...spelare.map(s=>s.poang),1);

  return <div style={Sida}>
    <button style={Tillbaka} onClick={()=>setVy("start")}>← Tillbaka</button>
    <h2 style={SRubrik}>⚖️ Vägarens Våg</h2>

    {!domAvslojad
      ? <div style={{textAlign:"center",padding:"60px 20px"}}>
          <div style={{fontSize:48,marginBottom:16}}>⚖️</div>
          <p style={{fontSize:15,color:T.textDim,fontStyle:"italic",lineHeight:1.8,maxWidth:280,margin:"0 auto 24px"}}>Resultattavlan är förseglad.<br/>Den avslöjas av Vägaren vid Domen.</p>
          <button style={{...BtnH}} onClick={()=>setDomAvslojad(true)}>🩸 Vägaren avslöjar resultaten</button>
        </div>
      : <>
          <div style={{...Kort,borderColor:"#c9a84c55",background:"#0a0800",marginBottom:16,textAlign:"center"}}>
            <div style={{fontSize:11,color:T.guldDim,letterSpacing:3,marginBottom:6,fontFamily:"'Cinzel',serif"}}>SOLSTÅNDSNATTEN · AUSÅS BLOTÄNGAR</div>
            <div style={{fontSize:13,color:T.textDim,fontStyle:"italic"}}>Vägarens våg har vägt era gärningar</div>
          </div>

          {sorterad.map((s,i)=>{
            const ac=GILLE_FARG[s.gille];
            const bredd=Math.max(4,(s.poang/maxPoang)*100);
            const harInlost=s.inlost.length>0;
            const harRoster=s.roster>1;
            return <div key={s.id} style={{...Kort,marginBottom:8,borderColor:ac+"55",background:i===0?"#0a0a00":T.papper}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                <div style={{fontFamily:"'Cinzel',serif",fontSize:16,color:T.textDim,width:24}}>{i+1}.</div>
                <span style={{fontSize:20}}>{s.icon}</span>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"'Cinzel',serif",fontSize:13,color:ac}}>{s.namn}</div>
                  {harRoster&&<div style={{fontSize:11,color:"#ffcc66"}}>🗳️ {s.roster} röster vid Domen</div>}
                </div>
                <div style={{fontFamily:"'Cinzel',serif",fontSize:22,color:i===0?T.guld:T.text}}>{s.poang}<span style={{fontSize:12,color:T.textDim}}>p</span></div>
              </div>
              <div style={{height:6,background:T.kant2,borderRadius:3,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${bredd}%`,background:`linear-gradient(to right,${ac}88,${ac})`,borderRadius:3,transition:"width 1s ease"}}/>
              </div>
              {harInlost&&<div style={{marginTop:6,display:"flex",flexWrap:"wrap",gap:4}}>
                {s.inlost.map(iId=>{const inl=INLOSEN.find(x=>x.id===iId);return inl?<span key={iId} style={{fontSize:10,background:ac+"22",color:ac,padding:"2px 8px",borderRadius:2}}>{inl.label}</span>:null;})}
              </div>}
            </div>;
          })}

          <div style={{...Kort,marginTop:8,borderColor:"#c9a84c33"}}>
            <div style={Lbl}>🗳️ Röststyrka vid Domen</div>
            {sorterad.filter(s=>s.roster>1).map(s=><div key={s.id} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",fontSize:12,borderBottom:`1px solid ${T.kant2}`}}>
              <span style={{color:GILLE_FARG[s.gille]}}>{s.icon} {s.namn}</span>
              <span style={{color:"#ffcc66",fontFamily:"'Cinzel',serif"}}>{s.roster} röster</span>
            </div>)}
            {sorterad.every(s=>s.roster<=1)&&<p style={{fontSize:12,color:T.textDim,margin:0,fontStyle:"italic"}}>Ingen har löst in extra röster.</p>}
          </div>
        </>}
  </div>;
}


// ─── KONTAKTLISTA & UTSKICK ───────────────────────────────────────────────────

const TOM_KONTAKT = { namn: "", mail: "", telefon: "", rollId: null };

// Rollkort HTML-generator (för mailutskick)
function genereraRollHTML(roll) {
  const ac = roll.barnroll ? "#ffb3c6" : roll.gilleColor || "#c9a84c";
  const kedjesteg = hittaKedjesteg(roll.id);
  const sandare = kedjesteg.filter(s => s.typ === "sändare");
  const mottagare = kedjesteg.filter(s => s.typ === "mottagare");

  return `<!DOCTYPE html>
<html lang="sv"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Midsommarblot – ${roll.rollnamn}</title>
<style>
body{margin:0;padding:20px;background:#0d0b08;color:#e8d8b8;font-family:Georgia,serif;}
.wrap{max-width:560px;margin:0 auto;}
.header{background:#13100c;border:1px solid #3a2e1e;border-radius:6px 6px 0 0;padding:28px 24px;text-align:center;border-bottom:none;}
.body{background:#13100c;border:1px solid #3a2e1e;border-top:none;border-bottom:none;padding:0 24px;}
.footer{background:#0a0807;border:1px solid #3a2e1e;border-top:none;border-radius:0 0 6px 6px;padding:16px 24px;text-align:center;}
h1{color:${ac};font-size:28px;letter-spacing:3px;margin:8px 0 4px;}
.gille{color:${ac}88;font-size:11px;letter-spacing:2px;}
.varning{display:inline-block;background:#0a1a0a;border:1px solid ${ac}66;border-radius:3px;padding:4px 14px;font-size:10px;color:${ac};letter-spacing:2px;margin-top:8px;}
.sek{padding:14px 0;border-bottom:1px solid #1e1810;}
.sek:last-child{border-bottom:none;}
.lbl{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#3d6b3a;margin-bottom:8px;}
p{font-size:13px;line-height:1.8;margin:0;}
.uppdrag{background:#0a1a0a;border-left:3px solid ${ac};padding:12px 14px;font-size:13px;line-height:1.8;}
.formaga{background:#0d0d0a;border:1px solid #3a2e1e;border-radius:3px;padding:10px 12px;margin-bottom:6px;}
.formaga-namn{color:${ac};font-size:11px;font-weight:bold;margin-bottom:4px;}
.rel-till{color:${ac};font-size:12px;font-weight:bold;}
.rel-typ{color:#3d6b3a;font-size:9px;letter-spacing:2px;text-transform:uppercase;display:block;margin-bottom:4px;}
.rebus{background:#080814;border:1px solid #9999cc44;border-radius:3px;padding:14px;text-align:center;}
.rebus-vers{font-size:16px;color:#ccccff;font-style:italic;line-height:1.9;}
.kedja{border:1px solid ${ac}33;border-radius:3px;margin-bottom:8px;overflow:hidden;}
.kedja-hdr{background:#080f08;padding:8px 12px;font-size:10px;color:${ac};letter-spacing:1px;}
.kedja-body{padding:12px;}
.fras{background:#000a00;border:1px solid ${ac}44;border-radius:3px;padding:10px;font-size:14px;color:#d0ffd0;font-style:italic;text-align:center;margin-bottom:8px;}
.trigger{background:#0a0800;border:1px solid ${ac}33;border-radius:3px;padding:8px 12px;font-size:12px;color:#8a7a5a;margin-bottom:8px;}
.pusselbit{background:#080808;border:1px solid ${ac}55;border-radius:3px;padding:10px;font-size:12px;color:#e0e0ff;line-height:1.7;}
.pusselbit-lbl{font-size:9px;color:${ac};letter-spacing:2px;display:block;margin-bottom:4px;}
.dans{background:#090514;border:1px solid ${ac}33;border-radius:3px;padding:12px;}
.lat{display:inline-block;background:${ac}18;color:${ac};border:1px solid ${ac}33;border-radius:2px;padding:2px 8px;font-size:10px;margin-right:4px;margin-bottom:6px;}
.poang{background:#0a0a00;border:1px solid #c9a84c33;border-radius:3px;padding:10px 12px;}
.p-rad{display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #1e1810;font-size:11px;}
.p-rad:last-child{border-bottom:none;}
.tips{background:#0a0807;border-left:3px solid #7a5a1a;padding:10px 14px;font-size:12px;color:#8a7a5a;font-style:italic;line-height:1.7;}
</style></head><body><div class="wrap">
<div class="header">
<div style="font-size:10px;color:#3d6b3a;letter-spacing:6px;margin-bottom:10px;">ᛗ ᛁ ᛞ ᛋ ᚢ ᛗ</div>
<div style="font-size:40px">${roll.icon}</div>
<h1>${roll.rollnamn}</h1>
<div class="gille">${roll.gille} · Ausås Blotängar</div>
<div class="varning">⚠ VISA INGEN DETTA MAIL</div>
</div>
<div class="body">
<div class="sek"><div class="lbl">✦ Karaktär</div><p><em style="color:#c8b898">${roll.karaktar}</em></p></div>
<div class="sek"><div class="lbl">📖 Bakgrund</div><p>${roll.beskrivning.replace(/\n/g,"<br>")}</p></div>
<div class="sek"><div class="lbl">⚔ Ditt uppdrag</div><div class="uppdrag">${roll.uppdrag}</div></div>
<div class="sek"><div class="lbl">✦ Förmågor</div>
<div class="formaga"><div class="formaga-namn">${roll.foermaga.split(":")[0]}</div><p style="font-size:12px;color:#c8b898">${roll.foermaga.split(":").slice(1).join(":").trim()}</p></div>
${roll.foermaga2 ? `<div class="formaga"><div class="formaga-namn">${roll.foermaga2.split(":")[0]}</div><p style="font-size:12px;color:#c8b898">${roll.foermaga2.split(":").slice(1).join(":").trim()}</p></div>` : ""}
</div>
${roll.relationer && roll.relationer.length ? `<div class="sek"><div class="lbl">🤝 Relationer</div>${roll.relationer.map(r => `<div style="margin-bottom:10px"><div class="rel-till">${r.till}</div><span class="rel-typ">${r.typ}</span><p style="font-size:12px;color:#8a7a5a">${r.text}</p></div>`).join("")}</div>` : ""}
${roll.rebus ? `<div class="sek"><div class="lbl">🧩 Din rebusdel – ${roll.rebus.del}</div><div class="rebus"><div class="rebus-vers">${roll.rebus.text}</div>${roll.rebusInfo ? `<p style="font-size:11px;color:#9999cc;margin-top:8px">${roll.rebusInfo}</p>` : ""}</div></div>` : ""}
${sandare.length ? `<div class="sek"><div class="lbl">🔗 Din nyckelkedja</div>${sandare.map(s => `<div class="kedja"><div class="kedja-hdr">${s.kedjaNamn} – Du är sändare</div><div class="kedja-body"><p style="font-size:9px;color:#3d6b3a;letter-spacing:2px;margin-bottom:6px">DIN FRAS – säg detta naturligt i samtal</p><div class="fras">"${s.frasFran}"</div><p style="font-size:9px;color:#3d6b3a;letter-spacing:2px;margin-bottom:6px">OM MOTTAGAREN SVARAR MED</p><div class="trigger"><strong style="color:${ac}">"…${s.triggerOrd}…"</strong></div><p style="font-size:9px;color:#3d6b3a;letter-spacing:2px;margin-bottom:6px">GE DEM DENNA PUSSELBIT</p><div class="pusselbit"><span class="pusselbit-lbl">REBUS – HEMLIGHET ATT DELA</span>${s.pusselbit}</div></div></div>`).join("")}</div>` : ""}
${mottagare.length ? `<div class="sek"><div class="lbl">👂 Du lyssnar efter</div>${mottagare.map(s => `<div class="kedja"><div class="kedja-hdr">${s.kedjaNamn} – Du är mottagare</div><div class="kedja-body"><p style="font-size:9px;color:#3d6b3a;letter-spacing:2px;margin-bottom:6px">LYSSNA EFTER NYCKELORDET</p><div class="trigger"><strong style="color:${ac};font-size:14px">"…${s.triggerOrd}…"</strong></div><p style="font-size:9px;color:#3d6b3a;letter-spacing:2px;margin-bottom:6px">SVARA MED</p><div class="fras">"${s.svarslösenord}"</div><p style="font-size:11px;color:#8a7a5a">Du får sedan en pusselbit tillbaka.</p></div></div>`).join("")}</div>` : ""}
${roll.dans ? `<div class="sek"><div class="lbl">🎵 Dansdirektiv</div><div class="dans">${roll.dans.latar.map(lid => { const lat=DANSLATAR.find(l=>l.id===lid); return lat?`<span class="lat">${lat.titel.split(" – ")[0]}</span>`:""}).join("")}<p style="font-size:12px;color:#c8b8f0;margin-top:4px">${roll.dans.direktiv}</p></div></div>` : ""}
<div class="sek"><div class="lbl">⚖️ Poäng</div><div class="poang">
<div class="p-rad"><span>Dela rebusbit med rätt person</span><span style="color:#a8d5a2">+10p</span></div>
<div class="p-rad"><span>Bilda allians med annat gille</span><span style="color:#a8d5a2">+15p</span></div>
<div class="p-rad"><span>Använda förmåga korrekt</span><span style="color:#a8d5a2">+20p</span></div>
<div class="p-rad"><span>Gilleuppdrag slutfört (hela gillet)</span><span style="color:#a8d5a2">+30p</span></div>
<div class="p-rad"><span>Peka ut Kultledaren vid Domen</span><span style="color:#a8d5a2">+40p</span></div>
<div class="p-rad"><span style="color:#c9a84c">30p → ledtråd om kultledaren (hos Vägaren)</span><span></span></div>
<div class="p-rad"><span style="color:#c9a84c">50p → 5 extra röster vid Domen</span><span></span></div>
</div></div>
<div class="sek"><div class="lbl">💡 Tips</div><div class="tips">${roll.tips}</div></div>
</div>
<div class="footer">
<div style="font-family:monospace;font-size:11px;color:#3a2e1e;letter-spacing:5px;margin-bottom:8px">ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ</div>
<p style="font-size:10px;color:#3a2e1e;line-height:1.9">Solståndsnatten · 19 juni 2026 · Ausås Blotängar<br>
Memorera din roll. Visa ingen detta mail.<br>
Fasmeddelanden skickas inför varje ny fas under kvällen.</p>
</div></div></body></html>`;
}

// ─── KONTAKTLISTE-KOMPONENT ───────────────────────────────────────────────────
function KontaktListeVy({ setVy, fordel }) {
  const [kontakter, setKontakter] = useState(() =>
    ROLLER.filter(r => !r.barnroll).map(r => ({
      rollId: r.id,
      namn: "",
      mail: "",
      telefon: "",
    })).concat(
      ROLLER.filter(r => r.barnroll).slice(0, 2).map(r => ({
        rollId: r.id,
        namn: "",
        mail: "",
        telefon: "",
      }))
    )
  );
  const [skickarId, setSkickarId] = useState(null);
  const [statusMap, setStatusMap] = useState({});

  function uppdatera(rollId, falt, varde) {
    setKontakter(prev => prev.map(k => k.rollId === rollId ? { ...k, [falt]: varde } : k));
  }

  async function skicka(kontakt, satt) {
    const roll = ROLLER.find(r => r.id === kontakt.rollId);
    if (!roll) return;

    // Hitta rätt roll från fordel om kultmärke/ledare tilldelats
    const fordelsRoll = fordel ? fordel.find(r => r.id === kontakt.rollId) : null;
    const fullRoll = fordelsRoll || roll;

    setSkickarId(kontakt.rollId + satt);
    setStatusMap(prev => ({ ...prev, [kontakt.rollId]: { satt, status: "skickar" } }));

    try {
      if (satt === "mail") {
        await skickaViaMailMedPDF(fullRoll, kontakt.mail);
        setStatusMap(prev => ({ ...prev, [kontakt.rollId]: { satt, status: "ok" } }));
      } else {
        await laddaUppOchSkickaSms(fullRoll, kontakt.telefon);
        setStatusMap(prev => ({ ...prev, [kontakt.rollId]: { satt, status: "ok" } }));
      }
    } catch (err) {
      setStatusMap(prev => ({ ...prev, [kontakt.rollId]: { satt, status: "fel", msg: err.message } }));
    }
    setSkickarId(null);
  }

  return (
    <div style={Sida}>
      <button style={Tillbaka} onClick={() => setVy("start")}>← Tillbaka</button>
      <h2 style={SRubrik}>📱 Skicka rollkort</h2>

      <div style={{ ...Kort, borderColor: "#9999cc44", background: "#080814", marginBottom: 16 }}>
        <div style={{ ...Lbl, color: "#9999cc" }}>ℹ Så här fungerar det</div>
        <p style={{ fontSize: 12, color: T.textDim, lineHeight: 1.6, margin: 0 }}>
          Fyll i namn och kontaktinfo för varje spelare. Tryck sedan Mail eller SMS
          för att skicka rollkortet. Rollerna slumpas automatiskt – kultmärken och
          kultledare tilldelas när du startar spelet.
        </p>
      </div>

      {kontakter.map(k => {
        const roll = ROLLER.find(r => r.id === k.rollId);
        if (!roll) return null;
        const ac = roll.barnroll ? "#ffb3c6" : roll.gilleColor || T.guld;
        const status = statusMap[k.rollId];
        const laderMail = skickarId === k.rollId + "mail";
        const laderSms = skickarId === k.rollId + "sms";

        return (
          <div key={k.rollId} style={{ ...Kort, borderColor: ac + "44", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 20 }}>{roll.icon}</span>
              <div>
                <div style={{ fontFamily: "'Cinzel',serif", fontSize: 13, color: ac }}>{roll.rollnamn}</div>
                <div style={{ fontSize: 10, color: T.textDim }}>{roll.gille}</div>
              </div>
              {status && (
                <div style={{ marginLeft: "auto", fontSize: 11, color: status.status === "ok" ? "#a8d5a2" : status.status === "fel" ? "#cc6666" : T.textDim }}>
                  {status.status === "ok" ? "✓ Skickat" : status.status === "fel" ? "✗ Fel" : "…"}
                </div>
              )}
            </div>

            <input
              placeholder="Namn"
              value={k.namn}
              onChange={e => uppdatera(k.rollId, "namn", e.target.value)}
              style={{ width: "100%", background: "#0a0a00", border: `1px solid ${T.kant}`, borderRadius: 3, padding: "8px 10px", color: T.text, fontSize: 12, fontFamily: "inherit", marginBottom: 6 }}
            />
            <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
              <input
                placeholder="E-postadress"
                value={k.mail}
                onChange={e => uppdatera(k.rollId, "mail", e.target.value)}
                style={{ flex: 1, background: "#0a0a00", border: `1px solid ${T.kant}`, borderRadius: 3, padding: "8px 10px", color: T.text, fontSize: 12, fontFamily: "inherit" }}
              />
              <button
                style={{ ...BtnS, padding: "8px 12px", fontSize: 11, borderColor: k.mail ? "#9999cc66" : T.kant, color: k.mail ? "#9999cc" : T.textDim, opacity: laderMail ? 0.6 : 1, whiteSpace: "nowrap" }}
                disabled={!k.mail || !!laderMail}
                onClick={() => skicka(k, "mail")}
              >
                {laderMail ? "…" : "✉ Mail"}
              </button>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <input
                placeholder="+46701234567"
                value={k.telefon}
                onChange={e => uppdatera(k.rollId, "telefon", e.target.value)}
                style={{ flex: 1, background: "#0a0a00", border: `1px solid ${T.kant}`, borderRadius: 3, padding: "8px 10px", color: T.text, fontSize: 12, fontFamily: "inherit" }}
              />
              <button
                style={{ ...BtnS, padding: "8px 12px", fontSize: 11, borderColor: k.telefon ? "#a8d5a266" : T.kant, color: k.telefon ? "#a8d5a2" : T.textDim, opacity: laderSms ? 0.6 : 1, whiteSpace: "nowrap" }}
                disabled={!k.telefon || !!laderSms}
                onClick={() => skicka(k, "sms")}
              >
                {laderSms ? "…" : "📱 SMS"}
              </button>
            </div>
            {status?.status === "fel" && (
              <p style={{ fontSize: 10, color: "#cc6666", margin: "6px 0 0" }}>Fel: {status.msg}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

function GuideVy({setVy}){
  return <div style={Sida}>
    <button style={Tillbaka} onClick={()=>setVy("start")}>← Tillbaka</button>
    <h2 style={SRubrik}>Ausås Blotängar – Roller</h2>
    <div style={{...Kort,borderColor:"#9999cc44",background:"#080814",marginBottom:14}}>
      <div style={{...Lbl,color:"#9999cc"}}>🕸 Relationsnät</div>
      <p style={{fontSize:12,color:T.textDim,lineHeight:1.9,margin:0}}>
        Smedmästaren → misstänker → Den Resande<br/>
        Den Resande → vet hemlighet om → Högprästen<br/>
        Kloka Gumman ↔ gammal konflikt ↔ Runläsaren<br/>
        Soldaten ↔ vänskap ↔ Läkemedlaren<br/>
        Läkemedlaren ↔ skuld ↔ Kloka Gumman &amp; Smedmästaren<br/>
        Högprästen + Runläsaren → delar kyrkans hemligheter<br/>
        Barnen → ser allt vuxna missar
      </p>
    </div>
    {ROLLER.map(r=>{
      const ac=r.barnroll?"#ffb3c6":r.gilleColor||T.guld;
      return <div key={r.id} style={{...Kort,marginBottom:8,borderColor:ac+"44"}}>
        <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:4}}>
          <span style={{fontSize:22}}>{r.icon}</span>
          <div>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:13,color:ac}}>{r.rollnamn}{r.barnroll?" 🌸":""}</div>
            <div style={{fontSize:11,color:T.textDim}}>{r.gille}</div>
          </div>
        </div>
        <p style={{fontSize:12,color:T.textDim,margin:0,lineHeight:1.5}}>{r.karaktar}</p>
        {r.relationer&&<div style={{marginTop:5,fontSize:11,color:T.guldDim+""}}>{r.relationer.map((rel,i)=><span key={i} style={{marginRight:8}}>→ {rel.till}</span>)}</div>}
      </div>;
    })}
  </div>;
}

function Sek({label,ac,children,hi}){return <div style={{border:`1px solid ${ac}33`,borderRadius:3,padding:"10px 12px",marginBottom:8,background:hi?ac+"10":"transparent"}}>
  <div style={{fontSize:10,letterSpacing:2,textTransform:"uppercase",marginBottom:5,color:ac,fontFamily:"'Cinzel',serif"}}>{label}</div>
  {children}</div>;}
function ToggleBlock({label,ac,bg,open,setOpen,children}){return <>
  <button style={{width:"100%",background:bg,border:`1px solid ${ac}44`,borderRadius:open?"4px 4px 0 0":"4px",padding:"10px 12px",fontSize:12,fontFamily:"inherit",cursor:"pointer",textAlign:"left",color:ac,display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:0}} onClick={()=>setOpen(v=>!v)}>
    <span>{label}</span><span style={{fontSize:10}}>{open?"▲":"▼"}</span>
  </button>
  {open&&<div style={{background:bg,border:`1px solid ${ac}44`,borderTop:"none",borderRadius:"0 0 4px 4px",padding:"12px 14px",marginBottom:8}}>{children}</div>}
</>;}
function FasBlock({fas}){const [open,setOpen]=useState(false);return <div style={{...Kort,marginBottom:8,borderColor:fas.color+"77"}}>
  <button style={{background:"none",border:"none",cursor:"pointer",width:"100%",textAlign:"left",padding:0,color:"inherit",fontFamily:"inherit"}} onClick={()=>setOpen(o=>!o)}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <span style={{fontFamily:"'Cinzel',serif",fontSize:12,color:fas.color,letterSpacing:1}}>{fas.icon} {fas.fas}</span>
      <div style={{display:"flex",gap:10,alignItems:"center"}}><span style={{fontSize:11,color:T.textDim}}>{fas.tid}</span><span style={{color:T.textDim,fontSize:11}}>{open?"▲":"▼"}</span></div>
    </div>
  </button>
  {open&&<div style={{marginTop:12}}>
    {fas.manus&&<div style={{background:"#08080f",border:`1px solid ${fas.color}44`,borderRadius:3,padding:"10px 12px",marginBottom:10}}>
      <div style={{fontSize:10,color:fas.color,letterSpacing:2,marginBottom:6,fontFamily:"'Cinzel',serif"}}>MANUS – LÄS HÖGT</div>
      <p style={{fontSize:12,color:"#aac0ff",lineHeight:1.8,margin:0,whiteSpace:"pre-line",fontStyle:"italic"}}>{fas.manus}</p>
    </div>}
    <ul style={{margin:0,paddingLeft:18}}>{fas.steg.map((s,i)=><li key={i} style={{fontSize:12,color:T.textDim,marginBottom:5,lineHeight:1.5}}>{s}</li>)}</ul>
  </div>}
</div>;}
function TabBar({tabs,active,onChange}){return <div style={{display:"flex",gap:4,marginBottom:16}}>
  {tabs.map((t,i)=><button key={t} style={{flex:1,background:active===i?T.guldDim:T.kant2,border:`1px solid ${active===i?T.guldDim:T.kant}`,color:active===i?T.text:T.textDim,padding:"8px 4px",fontSize:11,fontFamily:"'Cinzel',serif",cursor:"pointer",borderRadius:3,letterSpacing:1}} onClick={()=>onChange(i)}>{t}</button>)}
</div>;}
