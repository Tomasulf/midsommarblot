import {useState, useEffect } from "react";

// ─── TEMA & STILKONSTANTER ────────────────────────────────────────────────────
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

// ─── ROLLER ───────────────────────────────────────────────────────────────────
const ROLLER_MASTER=[
  {id:"kloka",gille:"ortagillet",gilleColor:"#a8d5a2",icon:"🌾",barnroll:false,
   rollnamn:(k)=>k==="kille"?"Kloke Gubben":"Kloka Gumman",
   karaktar:"Vis, gåtfull, sparsmakad med ord. Varje mening sitter.",
   beskrivning:"Du är byns äldsta röst. Du minns saker andra glömt och kan känna om en person bär lögner.",
   uppdrag:"Identifiera minst en kultmärkt utan att avslöja hur. Om du anklagas – neka lugnt.",
   foermaga:"🔍 Helig Blick: Viska ett namn till Vägaren – du får 'Ren' eller 'Fläckad'. En gång.",
   foermaga2:"🌿 Örtaté: Erbjud ett 'lugnande té' – motparten berättar en sanning.",
   fraser:[{fras:"Träden minns vad människor glömmer.",nyckelord:"minns vad",svar:"Och rötterna minns ännu längre."}],
   tips:"Tala sällan men tungt. Du är byns moraliska kompass.",
   relationer:[{till:"Örtmästaren",typ:"läromästare",text:"Örtmästaren lärde sig av dig. De bär en hemlighet de aldrig berättat."},{till:"Runläsaren",typ:"gammal konflikt",text:"Ni kom till olika slutsatser om mörkret. Kvällen kräver kanske att ni talar ut."},{till:"Den Resande",typ:"misstanke",text:"Den Resande dök upp i morse. Du känner igen blicken – den tillhör någon med ett syfte."}]},
  {id:"ortmastaren",gille:"ortagillet",gilleColor:"#a8d5a2",icon:"⚗️",barnroll:false,
   rollnamn:()=>"Örtmästaren",
   karaktar:"Varm, lyssnande, alltid med ett leende – men håller alla på armlängds avstånd.",
   beskrivning:"Du blandar örter och minnen. Folk delar sina hemligheter hos dig i tron att du glömmer. Det gör du aldrig.",
   uppdrag:"Bilda allians med EN person från varje gille under Fas 1.",
   foermaga:"⚗️ Motgift: Om du pekas ut – tvinga fram ny omröstning.",
   foermaga2:"🤝 Läkarkall: Lägg handen på en anklagads axel – alla måste höra motargument.",
   fraser:[{fras:"Det som luktar vackrast kan döda snabbast.",nyckelord:"luktar vackrast",svar:"Och det som dödar snabbast kan också hela."}],
   tips:"Du är limmet mellan gillen. Ingen misstänker den som hjälper alla.",
   relationer:[{till:"Kloka Gumman/Gubben",typ:"läromästare",text:"De lärde dig allt. Du bär en hemlighet du aldrig berättat."},{till:"Grönskans Väktare",typ:"vänskap",text:"Väktaren agerar där du lyssnar. Ni kompletterar varandra."},{till:"Mästersmeden",typ:"skuld",text:"Du räddade Mästersmeden en gång. Det gör dem lojala – kanske för lojala."}]},
  {id:"gronskan",gille:"ortagillet",gilleColor:"#a8d5a2",icon:"🌿",barnroll:false,
   rollnamn:()=>"Grönskans Väktare",
   karaktar:"Vaksam, direkt, djupt misstänksam mot allt som inte hör hemma.",
   beskrivning:"Du vaktar naturens ordning. Kulten stör den balansen – och du kan känna det i luften.",
   uppdrag:"Välj en person att övervaka. Berätta vad du observerat för tre andra.",
   foermaga:"🌿 Skogens Dom: En gång – personen måste lämna konversationen 2 min.",
   foermaga2:"👁 Väktarens Blick: Stirra 30 sek – de måste förklara sig.",
   fraser:[{fras:"Skogen ser vad elden inte når.",nyckelord:"elden inte når",svar:"Men elden värmer det skogen inte kan röra."}],
   tips:"Din misstänksamhet är ett vapen. Rikta den rätt.",
   relationer:[{till:"Örtmästaren",typ:"vänskap",text:"Örtmästaren lyssnar där du agerar."},{till:"Den Resande",typ:"stark misstanke",text:"Den Resande hör inte hemma här."},{till:"Mästersmeden",typ:"respekt",text:"Ni delar synen på ordning. Naturliga allierade."}]},
  {id:"mastersmeden",gille:"smederna",gilleColor:"#d4956a",icon:"🔨",barnroll:false,
   rollnamn:()=>"Mästersmeden",
   karaktar:"Rättfram, skeptisk, tål inte svammel.",
   beskrivning:"Du leder smedernas brödraskap. Folk lyssnar för att du sällan pratar utan att ha något viktigt att säga.",
   uppdrag:"Samla smederna och enas om en gemensam anklagelse INNAN Tinget.",
   foermaga:"⚒ Vittnesed: Din anklagelse räknas dubbelt med konkret skäl.",
   foermaga2:"🔒 Ordningslag: En gång – alla lyssnar på EN person i 2 min.",
   fraser:[{fras:"Järnet ljuger aldrig – det är smeden som kan.",nyckelord:"järnet ljuger",svar:"Och det är gnistor som avslöjar lögnen."}],
   tips:"Var skepsisen i rummet. Koordinera gillets anklagelse i tid.",
   relationer:[{till:"Soldaten",typ:"lojalitet",text:"Soldaten är din närmaste – men agerar utan att tänka."},{till:"Glödviskaren",typ:"förtroende",text:"Glödviskaren råder dig. Du lyssnar – men de berättar aldrig allt."},{till:"Den Resande",typ:"misstanke",text:"Den Resande dök upp utan förklaring. Du gillar inte det."}]},
  {id:"soldaten",gille:"smederna",gilleColor:"#d4956a",icon:"⚔️",barnroll:false,
   rollnamn:()=>"Soldaten",
   karaktar:"Impulsiv, direkt, reagerar med magen.",
   beskrivning:"Du driver anklagelser – ibland för snabbt. Kultens farligaste motståndare och enklaste verktyg.",
   uppdrag:"MÅSTE framföra minst en formell anklagelse vid Tinget. Utmana någon på sten-sax-påse!",
   foermaga:"⚔️ Sten-sax-påse: Vinn mot 2 från andra gillen – gillesuppdrag klart!",
   foermaga2:"🗣 Stridsskri: En gång – peka och ropa 'Förklara dig!' Alla lyssnar.",
   fraser:[{fras:"Den som tvekar förlorar mer än slaget.",nyckelord:"den som tvekar",svar:"Men den som agerar för snabbt förlorar mer än segern."}],
   tips:"Du är byns känslobarometer. Folk läser av dig.",
   relationer:[{till:"Mästersmeden",typ:"lojalitet",text:"Mästersmeden är din chef. Du lyder – nästan alltid."},{till:"Glödviskaren",typ:"rivalitet",text:"Glödviskaren viskar saker. Du vet inte om de hjälper dig."},{till:"Runläsaren",typ:"irritation",text:"Tvetydiga svar irriterar dig. Gnistor uppstår."}]},
  {id:"glodviskaren",gille:"smederna",gilleColor:"#d4956a",icon:"🔥",barnroll:false,
   rollnamn:()=>"Glödviskaren",
   karaktar:"Subtil, lågmäld, aldrig först med en åsikt – men alltid sist med att forma den.",
   beskrivning:"Du formar vad andra tänker utan att de märker det. Dina ord tänds långsamt men brinner länge.",
   uppdrag:"Plantera minst två idéer som andra tror är deras egna. Rapportera till Vägaren.",
   foermaga:"🔥 Glödviskning: Viska om en person – motparten måste reagera.",
   foermaga2:"💭 Spegeln: 'Jag hörde precis detsamma' – utan att bevisa det.",
   fraser:[{fras:"Elden viskar för de som vet hur man lyssnar.",nyckelord:"elden viskar",svar:"Och vad säger elden dig ikväll?"}],
   tips:"Var aldrig first, aldrig last – alltid i mitten.",
   relationer:[{till:"Mästersmeden",typ:"förtroende",text:"Mästersmeden lyssnar på dina råd."},{till:"Soldaten",typ:"manipulation",text:"En viskning styr deras anklagelse dit du vill."},{till:"Högprästen",typ:"gammal allians",text:"Ni har delat hemligheter. Litar på varandra – till en viss gräns."}]},
  {id:"hogprasten",gille:"månkyrkan",gilleColor:"#9999e0",icon:"🌙",barnroll:false,
   rollnamn:()=>"Högprästen",
   karaktar:"Högtidlig, teatralisk, van vid att folk lyssnar.",
   beskrivning:"Du är Månkyrkans röst. Den Resande bär en hemlighet om dig.",
   uppdrag:"Avge offentlig profetia under Fas 1. Samla 5+ i cirkelgång under Euphoria (+25p)!",
   foermaga:"🌙 Helgad Ritual: Samla alla – ingen kan anklagas under 3 min.",
   foermaga2:"📿 Absolution: Bekännelse i enrum = skydd 10 min.",
   fraser:[
     {fras:"Månens öga sluter sig aldrig helt.",nyckelord:"sluter sig aldrig",svar:"Och vad ser månens öga ikväll?"},
     {fras:"Blotet kräver renhet – och renhet är sällsynt ikväll.",nyckelord:"renhet är sällsynt",svar:"Kanske är det orenheten som håller oss levande."},
   ],
   tips:"Var dramatisk. Pauser, ögonkontakt, gester. Du sätter stämningen.",
   relationer:[{till:"Runläsaren",typ:"allians",text:"Ni delar kyrkans hemligheter. Starka – varandras svaghet."},{till:"Munken/Nunnan",typ:"frustration",text:"From nog men lite för förtjust i ölet. Lojal dock."},{till:"Den Resande",typ:"hot",text:"De vet något om dig. Det kan skada dig."}]},
  {id:"runlaesaren",gille:"månkyrkan",gilleColor:"#9999e0",icon:"🔮",barnroll:false,
   rollnamn:()=>"Runläsaren",
   karaktar:"Mystisk, aldrig rak, njuter av att folk aldrig vet vad du menar.",
   beskrivning:"Allt du säger kan tolkas åt två håll – och du väljer tolkningen i efterhand.",
   uppdrag:"Ge tre spelare ett runorakel. Minst ett ska stämma. Du väljer vilket i efterhand.",
   foermaga:"🔮 Tvetydig Profetia: Inget du säger kan bevisas vara lögn.",
   foermaga2:"🌀 Runbindning: En gång – koppla två spelare, skapar misstanke.",
   fraser:[{fras:"Stjärnorna har redan bestämt vad som ska hända ikväll.",nyckelord:"bestämt vad som ska",svar:"Då är frågan om vi är villiga att se det."}],
   tips:"En välplacerad tystnad är kraftfullare än ett svar.",
   relationer:[{till:"Högprästen",typ:"allians",text:"Ni delar kyrkans hemligheter."},{till:"Kloka Gumman/Gubben",typ:"gammal konflikt",text:"Ni kom till olika slutsatser. Kvällen kräver att ni talar ut."},{till:"Soldaten",typ:"irritation",text:"Soldaten kräver raka svar. Du ger dem aldrig."}]},
  {id:"munken",gille:"månkyrkan",gilleColor:"#9999e0",icon:"🍺",barnroll:false,
   rollnamn:(k)=>k==="tjej"?"Nunnan":"Munken",
   karaktar:"From på pappret, törstig i praktiken. Lågmäld tills tredje kannan.",
   beskrivning:"Du trivs bäst med en kanna i handen – och folk pratar friare med dig än de borde.",
   uppdrag:"Bjud på dryck och lyssna. Samla minst två hemligheter. Rapportera till Vägaren.",
   foermaga:"🍺 Rundan: Bjud alla på skål – 60 sek tystnad, du väljer vem som talar sedan.",
   foermaga2:"😴 Skenbetagen: Låtsas berusad om du anklagas. En gång.",
   fraser:[{fras:"Gud förlåter – men han behöver lite tid på sig.",nyckelord:"tid på sig",svar:"Och vad behöver du förlåtelse för ikväll?"}],
   tips:"Folk underskattar den gladlynte munken. Det är ditt trumfkort.",
   relationer:[{till:"Högprästen",typ:"lojalitet",text:"Din chef – men inte om det kräver att du ger upp kannan."},{till:"Glödviskaren",typ:"dryckeskompis",text:"Delar kärlek till mjöd och dåliga beslut."},{till:"Mästersmeden",typ:"irritation",text:"Ömsesidig misstro – men båda lojala mot byn."}]},
  {id:"den_resande",gille:"fri",gilleColor:"#c9a84c",icon:"🧳",barnroll:false,
   rollnamn:()=>"Den Resande",
   karaktar:"Charm som vapen, lojalitet som handelsvara.",
   beskrivning:"Du dök upp i morse utan förklaring. Ingen vet vem du är. Det är precis som du planerat.",
   uppdrag:"Samla tre hemligheter. Bjud upp 3+ personer under Cannelloni Macaroni (+15p)!",
   foermaga:"🧳 Resandets Privilegium: Byt hemlighet mot bindande skyddslöfte.",
   foermaga2:"🃏 Sista budet: Byt din röst i sista sekund med motivering.",
   fraser:[{fras:"Jag har sett det här förut – i en annan by, en annan natt.",nyckelord:"annan by",svar:"Vad hände med den byn?"}],
   tips:"Din information är din makt. Sälj dyrt.",
   relationer:[{till:"Mästersmeden",typ:"misstänkt",text:"Misstänker dig med rätta. Ge precis nog för att hålla dem lugna."},{till:"Högprästen",typ:"hemlighet",text:"Du vet något om Högprästen. Ditt bästa trumfkort."},{till:"Runläsaren",typ:"avtal",text:"Ni delar info – aldrig mot varandra. Avtalet krackelerar."}]},
  {id:"skogsvakten",gille:"ortagillet",gilleColor:"#ffb3c6",icon:"🌲",barnroll:true,
   rollnamn:()=>"Skogsvakten",
   karaktar:"Snabb, nyfiken, expert på att smyga.",
   beskrivning:"Du ser ALLT! 🌲 Du springer tyst som en räv. Vuxna tror att du leker – i själva verket spionerar du!\n\nHitta de andra barnrollerna DIREKT – ni känner igen varandra på att ni alla bär något GRÖNT.",
   uppdrag:"Spana på EN vuxen under kvällen. Rapportera till Vägaren!",
   foermaga:"🌲 JAG SÅG DIG: Smyg fram och ropa – personen berättar vad de gör inför alla!",
   foermaga2:"🍃 Falskt Rykte: Be Vägaren om en hemlig lapp och lägg nära en konstig vuxen!",
   tips:"Ingen misstänker Skogsvakten. Det är din superkraft! 🦊",
   fraser:[],
   relationer:[{till:"Grönskans Väktare",typ:"mentor",text:"Rapportera vad du ser till dem."},{till:"Galningen med Grytan",typ:"bästa kompis",text:"Ni hittar på hyss tillsammans!"},{till:"Korsriddaren",typ:"kompis",text:"Ni tre barnroller är ett hemligt lag!"}]},
  {id:"galningen",gille:"smederna",gilleColor:"#ffcc88",icon:"🥁",barnroll:true,
   rollnamn:()=>"Galningen med Grytan",
   karaktar:"Bullrig, energisk och totalt omöjlig att ignorera.",
   beskrivning:"Du är byns OFFICIELLA ljudmakare! 🥁\n\nHitta de andra barnrollerna DIREKT – ni känner igen varandra på att ni alla bär något GRÖNT.",
   uppdrag:"Slå på grytan och ropa 'LYSSNA PÅ MIG!' minst 3 gånger. Utmana EN vuxen till tävling!",
   foermaga:"🥁 PANG PANG PANG: Alla stannar 30 sek – du ställer EN fråga!",
   foermaga2:"💪 Utmaning: Den som förlorar svarar ärligt på EN fråga!",
   tips:"Ingen tror att du märker saker. Men du märker ALLT! 👀",
   fraser:[],
   relationer:[{till:"Mästersmeden",typ:"respekt",text:"Vill utmana dem i armbrytning. Gör det!"},{till:"Skogsvakten",typ:"bästa kompis",text:"Ni hittar på hyss tillsammans!"},{till:"Korsriddaren",typ:"kompis",text:"Ni tre är ett hemligt lag!"}]},
  {id:"korsriddaren",gille:"månkyrkan",gilleColor:"#c8b8ff",icon:"⚔️",barnroll:true,
   rollnamn:()=>"Korsriddaren",
   karaktar:"Liten, modig och fullständigt övertygad om att rättvisa alltid segrar.",
   beskrivning:"Du är Månkyrkans tappre riddare! ⚔️\n\nHitta de andra barnrollerna DIREKT – ni känner igen varandra på att ni alla bär något GRÖNT.",
   uppdrag:"Utmana EN vuxen till äreduel. Vakta midsommarstången!",
   foermaga:"⚔️ Riddarlöftet: 'JAG VITTNAR FÖR DENNES OSKULD!' Alla lyssnar!",
   foermaga2:"🛡 Stångens Väktare: Se någon vid stången – spring dit!",
   tips:"Barn ser saker vuxna är för smarta för att märka! 👀",
   fraser:[],
   relationer:[{till:"Högprästen",typ:"lojalitet",text:"Din befälhavare – men bara om det verkar rättvist."},{till:"Skogsvakten",typ:"kompis",text:"Ni tre är ett hemligt lag!"},{till:"Galningen med Grytan",typ:"kompis",text:"Ni hittar på hyss tillsammans!"}]},
];

// ─── DYNAMISK KEDJE-BYGGARE ───────────────────────────────────────────────────
const PUSSELBIT={
  "I":  "REBUS DEL I: »Vid det som aldrig faller ned…« – Stången är nyckeln. Den som håller den äger ritualen.",
  "III":"REBUS DEL III: »…när klockan slagit halvt det sista…« – Ritualen aktiveras bara under SISTA HALVTIMMEN.",
  "II": "REBUS DEL II: »…lägger handen den som äger natten…« – Kultledaren måste FYSISKT hålla handen på stången.",
  "IV": "REBUS DEL IV: »…och tre röster ropar mot ljuset…« – TRE bybor vid stången ropar: 'Ljuset håller!'",
  "sab1":"SABOTAGE: Kultledarens ritual kräver 30 sek ostört. Pratar du med dem – ritualen avbryts.",
  "sab2":"SABOTAGE: Det räcker att STÄLLA SIG BREDVID för att avbryta. Du behöver inte veta att de är ledare.",
};

const K1=[["kloka","den_resande","ortmastaren"],["kloka","den_resande","gronskan"],["kloka","ortmastaren","gronskan"],["ortmastaren","den_resande","gronskan"],["ortmastaren","kloka","gronskan"],["kloka","hogprasten","ortmastaren"],["kloka","munken","ortmastaren"],["gronskan","den_resande","ortmastaren"],["kloka","soldaten","ortmastaren"],["kloka","runlaesaren","ortmastaren"],["kloka","glodviskaren","ortmastaren"],["ortmastaren","munken","gronskan"],["kloka","mastersmeden","ortmastaren"],["den_resande","ortmastaren","munken"],["kloka","runlaesaren","gronskan"],["kloka","munken","gronskan"],["kloka","hogprasten","gronskan"],["ortmastaren","runlaesaren","gronskan"],["ortmastaren","hogprasten","gronskan"],["kloka","soldaten","gronskan"],["kloka","glodviskaren","gronskan"],["runlaesaren","ortmastaren","munken"],["hogprasten","ortmastaren","munken"],["gronskan","runlaesaren","munken"],["gronskan","mastersmeden","munken"],["gronskan","hogprasten","munken"],["gronskan","soldaten","munken"],["gronskan","glodviskaren","munken"],["gronskan","den_resande","munken"]];
const K2=[["runlaesaren","mastersmeden","hogprasten"],["runlaesaren","glodviskaren","hogprasten"],["hogprasten","mastersmeden","runlaesaren"],["runlaesaren","soldaten","hogprasten"],["munken","mastersmeden","hogprasten"],["runlaesaren","munken","hogprasten"],["hogprasten","glodviskaren","runlaesaren"],["munken","soldaten","hogprasten"],["runlaesaren","den_resande","hogprasten"],["hogprasten","ortmastaren","runlaesaren"],["hogprasten","kloka","runlaesaren"],["munken","den_resande","hogprasten"],["runlaesaren","gronskan","hogprasten"],["hogprasten","soldaten","munken"],["runlaesaren","kloka","hogprasten"],["munken","kloka","hogprasten"],["runlaesaren","ortmastaren","hogprasten"],["munken","ortmastaren","hogprasten"],["hogprasten","den_resande","runlaesaren"],["hogprasten","den_resande","munken"],["runlaesaren","munken","mastersmeden"],["runlaesaren","munken","soldaten"],["runlaesaren","munken","den_resande"],["runlaesaren","munken","glodviskaren"],["runlaesaren","munken","kloka"],["runlaesaren","munken","ortmastaren"],["runlaesaren","munken","gronskan"],["munken","mastersmeden","soldaten"],["munken","mastersmeden","den_resande"],["munken","soldaten","den_resande"],["runlaesaren","mastersmeden","soldaten"],["runlaesaren","mastersmeden","den_resande"],["hogprasten","glodviskaren","mastersmeden"],["hogprasten","glodviskaren","soldaten"],["hogprasten","mastersmeden","soldaten"],["hogprasten","glodviskaren","den_resande"],["hogprasten","mastersmeden","den_resande"]];
const K3=[["soldaten","galningen","korsriddaren"],["glodviskaren","galningen","korsriddaren"],["mastersmeden","galningen","korsriddaren"],["soldaten","skogsvakten","korsriddaren"],["soldaten","galningen","skogsvakten"],["glodviskaren","skogsvakten","korsriddaren"],["soldaten","glodviskaren","mastersmeden"],["glodviskaren","soldaten","den_resande"],["mastersmeden","soldaten","gronskan"],["soldaten","munken","mastersmeden"],["glodviskaren","munken","soldaten"],["mastersmeden","gronskan","den_resande"],["soldaten","ortmastaren","gronskan"],["glodviskaren","gronskan","den_resande"],["mastersmeden","munken","glodviskaren"],["soldaten","mastersmeden","den_resande"],["glodviskaren","mastersmeden","den_resande"],["soldaten","kloka","mastersmeden"],["mastersmeden","kloka","den_resande"],["munken","gronskan","den_resande"],["runlaesaren","soldaten","mastersmeden"],["hogprasten","soldaten","mastersmeden"],["ortmastaren","soldaten","mastersmeden"],["kloka","soldaten","mastersmeden"],["runlaesaren","glodviskaren","mastersmeden"],["hogprasten","glodviskaren","mastersmeden"],["kloka","glodviskaren","mastersmeden"],["ortmastaren","glodviskaren","mastersmeden"]];

function byggKedjor(ids){
  const har=id=>ids.includes(id);
  return [
    {id:"k1",namn:"Skogens röst",farg:"#a8d5a2",delar:["I","III"],kombos:K1},
    {id:"k2",namn:"Månens öga",farg:"#9999e0",delar:["II","IV"],kombos:K2},
    {id:"k3",namn:"Eldens vakt",farg:"#d4956a",delar:["sab1","sab2"],kombos:K3},
  ].map(m=>{
    const v=m.kombos.find(k=>k.every(id=>har(id)));
    if(!v)return null;
    const [s,mid,t]=v;
    const sF=ROLLER_MASTER.find(r=>r.id===s)?.fraser?.[0];
    const mF=ROLLER_MASTER.find(r=>r.id===mid)?.fraser?.[1]||ROLLER_MASTER.find(r=>r.id===mid)?.fraser?.[0];
    return {id:m.id,namn:m.namn,farg:m.farg,steg:[
      {fran:s,till:mid,typ:"sandare",fras:sF?.fras,triggerOrd:sF?.nyckelord,svarslösenord:sF?.svar,pusselbit:PUSSELBIT[m.delar[0]]},
      {fran:mid,till:t,typ:"mottagare_sandare",fras:mF?.fras,triggerOrd:mF?.nyckelord,svarslösenord:mF?.svar,pusselbit:PUSSELBIT[m.delar[1]]},
      {fran:t,typ:"mottagare"},
    ]};
  }).filter(Boolean);
}

function hittaKedjesteg(rollId,kedjor){
  const res=[];
  (kedjor||[]).forEach(k=>{
    k.steg.forEach(s=>{
      if(s.fran===rollId||s.till===rollId) res.push({...s,kedjaId:k.id,kedjaNamn:k.namn,farg:k.farg});
    });
  });
  return res;
}

// ─── DANSDIREKTIV ─────────────────────────────────────────────────────────────
const DANSLATAR=[
  {id:"cannelloni",titel:"Cannelloni Macaroni",poang:5},
  {id:"walking",   titel:"Walking on Sunshine",poang:5},
  {id:"euphoria",  titel:"Euphoria – Loreen",  poang:5},
  {id:"guld",      titel:"Guld och gröna skogar",gille:"ortagillet",poang:10},
  {id:"only",      titel:"Only Time",           gille:"månkyrkan",poang:10},
  {id:"seven",     titel:"Seven Nation Army",   gille:"smederna",poang:10},
];

const DANS_DIREKTIV={
  cannelloni:{
    kloka:"Vagga med armarna utsträckta och ögonen slutna.",
    ortmastaren:"Dra med en slumpmässig person och dans parvis. Byt partner minst en gång.",
    gronskan:"Dans med värdighet. Rätta upp folk som dansar fel.",
    mastersmeden:"Klappar fötterna utan att erkänna att det är dans. Armarna i kors.",
    soldaten:"Marschera i takt runt gruppen. Rak rygg.",
    glodviskaren:"Dansar minimalistiskt nära ljusen. Blicken i lågan.",
    hogprasten:"Försöker samla folk till cirkelgång. Utsträckta armar.",
    runlaesaren:"Armarna rakt upp, ögonen blundade. Svajar i takten.",
    munken:"Sjunger med på fel text med full övertygelse.",
    den_resande:"Bjud upp EN ny person per vers – minst 3 uppbud! +15p om lyckas.",
    skogsvakten:"Spring runt och SPANA! Vem dansar konstigt?",
    galningen:"KLAPPA! STAMPA! ROPA 'BOM BOM BOM!'",
    korsriddaren:"Dans som en RIDDARE – stolt med osynligt svärd!",
  },
  walking:{
    kloka:"Gå majestätiskt runt kanten. Nicka gillande åt folk.",
    ortmastaren:"Dans med alla – aldrig samma person två gånger.",
    gronskan:"Marschera med värdighet. Rätta upp folk.",
    mastersmeden:"Fortfarande vägrar – men NU klappar båda fötterna.",
    soldaten:"Full militärtakt. Ropa 'Sol-DA-ten!' i takten.",
    glodviskaren:"Stirrar in i lågan. 'Elden visar mig saker.'",
    hogprasten:"Led andäktig cirkelgång. Försök samla 5+ runt stången!",
    runlaesaren:"Armarna upp, ögonen blundade. 'Stjärnorna har talat.'",
    munken:"Sjunger med på fel text MED ÄNNU MER övertygelse.",
    den_resande:"Dans med alla, aldrig samma person två gånger.",
    skogsvakten:"Rapportera vem som dansar med vem!",
    galningen:"STAMPA OCH KLAPPA DUBBELT SÅ HÖGT!",
    korsriddaren:"Patrullera med osynligt svärd. Vakta glädjen.",
  },
  euphoria:{
    kloka:"Utsträckta armar, ögonen slutna, ansiktet mot himlen. Slow motion.",
    ortmastaren:"Led tre personer in i en spontan dans du hittar på.",
    gronskan:"Dans med full värdighet – inga tokiga rörelser.",
    mastersmeden:"Nu dansar han. Men han vet inte om det.",
    soldaten:"Full energi. Rör axlarna, stampar. 'Kriget är vunnet!'",
    glodviskaren:"Cirkulerar med armarna utsträckta. Whispar 'Euphoria...'",
    hogprasten:"SAMLA 5+ I CIRKELGÅNG RUNT STÅNGEN – +25p bonus!",
    runlaesaren:"Armarna rakt upp. Ögonen stängda. Svajar kraftigt.",
    munken:"Dansar med FULL ENERGI och sjunger på fel språk.",
    den_resande:"Dans med den som verkar mest avslappnad. Det är den farligaste.",
    skogsvakten:"SPRING RUNT STÅNGEN tre varv! Ropa 'JAG DANSAR!'",
    galningen:"MAX VOLYM! STAMPA! KLAPPA! VRÅLA MED!",
    korsriddaren:"Dans med riddarheder runt stången.",
  },
  guld:{
    kloka:"SKUTTA SOM EN ORK! Hela örtagillet skuttar runt stången!",
    ortmastaren:"SKUTTA SOM EN ORK! Hela örtagillet skuttar runt stången!",
    gronskan:"SKUTTA SOM EN ORK! Hela örtagillet skuttar runt stången!",
    skogsvakten:"SKUTTA SOM EN ORK! Du är med!",
  },
  only:{
    hogprasten:"Håll hand med hela Månkyrkan i ring. Tyst och högtidlig.",
    runlaesaren:"Håll hand. Blundade ögon. Känn månens kraft.",
    munken:"Håll hand. Inga skratt. Inga kanor. Bara högtid. (2 min.)",
    korsriddaren:"Håll hand. Du är kyrkans väktare. Stå rak.",
  },
  seven:{
    mastersmeden:"CIRKULERA RUNT STÅNGEN. Rör axlarna. Smederna marscherar.",
    soldaten:"CIRKULERA med full krigarenergi. Rör axlarna i takten.",
    glodviskaren:"Cirkulera. Subtilt. Intensivt. Ögonen på alla.",
    galningen:"CIRKULERA OCH SLÅ GRYTAN I TAKTEN! BOM BOM BOM!",
  },
};

const POLKKA=[
  {omgang:1,bybo:"MEDURS",ledare:"MOTURS"},
  {omgang:2,bybo:"MOTURS",ledare:"MEDURS"},
  {omgang:3,bybo:"MEDURS",ledare:"MOTURS"},
];

// ─── ANKLAGELSER ──────────────────────────────────────────────────────────────
const ANKLAGELSER={
  kloka:"Träden minns – och jag minns med dem. Det finns någon bland oss ikväll vars rötter inte sitter i vår jord. Jag kan känna det. Jag har känt det hela kvällen. Jag säger ingenting mer – men jag ber er alla se er om.",
  ortmastaren:"Jag vill inte tro det. Men det som luktar vackrast kan döda snabbast – och här ikväll finns det någon vars vänlighet luktar lite för vackert. Tinget bör ta det på allvar.",
  gronskan:"Skogen ser vad elden inte når. Och ikväll ser skogen ett ansikte bland oss som inte stämmer. Balansen är störd. Jag kräver att Tinget undersöker detta.",
  mastersmeden:"Järnet ljuger aldrig. Smederna har diskuterat och vi är överens: det finns en röta i Ausås Blotängar ikväll. Och röta sprider sig om man inte tar tag i den.",
  soldaten:"Jag tvekar inte. Någon i det här rummet ler vid fel tillfällen, svarar en halv sekund för sent och undviker ett specifikt ämne. Tinget bör agera – och agera nu.",
  glodviskaren:"Elden viskar ikväll om någon som ler för mycket. Som alltid finns på rätt plats vid rätt tillfälle. Som hjälper alla – men kanske hjälper sig själv mest av allt.",
  hogprasten:"Månkyrkan har tagit emot ett tecken. Det pekar mot någon som kom till Ausås Blotängar utifrån. Någon vars rötter inte sitter i vår jord. Jag avger detta i kyrkans namn.",
  runlaesaren:"Runorna pekade på ett specifikt gillefärg redan när kvällen började. Jag ville inte tro det. Runorna hade inte fel. De har aldrig fel.",
  munken:"Gud förlåter – men han behöver lite tid på sig. Och under den tid han tar på sig har jag lyssnat noga. Det jag hört om en viss person den här kvällen... det var faktiskt ganska mörkt.",
  den_resande:"Jag har sett det här förut – i en annan by, en annan natt. Det slutade inte väl. Mönstret är detsamma: ett gille, en person, ett syfte som inte stämmer med vad de säger.",
};

// ─── GILLESUPPDRAG ────────────────────────────────────────────────────────────
const GILLESUPPDRAG = {
  ortagillet: {
    rubrik: "🌿 Örtagillets uppdrag",
    gemensamt: [
      "Genomför Örtceremonin inför minst 4 vittnen",
      "Kloka Gumman/Gubben använder Helig Blick",
      "Minst 2 av 3 bildar allians utanför gillet",
      "Alla dansar Guld och gröna skogar – skuttar som orkar",
    ],
    bonus: "+30p till hela gillet om ALLA fyra är klara",
  },
  smederna: {
    rubrik: "⚒ Smedernas uppdrag",
    gemensamt: [
      "Genomför Smedjeeden – avbryt en annan grupps samtal",
      "Enas om gemensam anklagelse INNAN Tinget",
      "Soldaten vinner sten-sax-påse mot 2 från andra gillen",
      "Alla dansar Seven Nation Army – cirkulerar runt stången",
    ],
    bonus: "+30p till hela gillet om ALLA fyra är klara",
  },
  månkyrkan: {
    rubrik: "☽ Månkyrkans uppdrag",
    gemensamt: [
      "Genomför Skuggprofetian utomhus inför vittnen",
      "Högprästen avger profetia INNAN Fas 2",
      "Runläsaren ger minst 2 orakel utanför kyrkan",
      "Alla dansar Only Time – håller hand i ring",
    ],
    bonus: "+30p till hela gillet om ALLA fyra är klara",
  },
};

// Individuella poänguppdrag per roll
const ROLL_UPPGIFTER = {
  kloka: [
    {label:"Helig Blick använd", poang:15},
    {label:"Kultmärkt identifierad", poang:30},
    {label:"Allians bildad", poang:15},
    {label:"Örtceremonin genomförd", poang:10},
  ],
  ortmastaren: [
    {label:"Allians med Örtagillet", poang:10},
    {label:"Allians med Smederna", poang:10},
    {label:"Allians med Månkyrkan", poang:10},
    {label:"Allians med Den Resande", poang:10},
    {label:"Motgift-förmåga använd", poang:20},
  ],
  gronskan: [
    {label:"Spaningsrapport till Vägaren", poang:10},
    {label:"Skogens Dom använd", poang:15},
    {label:"3 personer informerade om observation", poang:15},
    {label:"Pentagram hittat", poang:10},
  ],
  mastersmeden: [
    {label:"Gemensam anklagelse ledd", poang:20},
    {label:"Ordningslag använd", poang:15},
    {label:"Vittnesed använd vid anklagelse", poang:15},
    {label:"Smedjeeden genomförd", poang:10},
  ],
  soldaten: [
    {label:"Sten-sax-påse vunnen (1 person)", poang:5},
    {label:"Sten-sax-påse vunnen mot 2+ utanför gillet", poang:20},
    {label:"Stridsskri använd", poang:10},
    {label:"Formell anklagelse framförd", poang:15},
  ],
  glodviskaren: [
    {label:"Idé planterad (köpt av annan)", poang:15},
    {label:"Glödviskning genomförd", poang:10},
    {label:"Spegeln-förmåga använd", poang:10},
    {label:"Rapport till Vägaren", poang:10},
  ],
  hogprasten: [
    {label:"Profetia avgiven Fas 1", poang:20},
    {label:"5+ i cirkelgång runt stången", poang:25},
    {label:"Helgad Ritual genomförd", poang:15},
    {label:"Absolution given", poang:10},
  ],
  runlaesaren: [
    {label:"Runorakel givet (per person)", poang:10},
    {label:"Runbindning använd", poang:15},
    {label:"Profetia visade sig stämma", poang:20},
  ],
  munken: [
    {label:"Hemlighet samlad (per st, max 3)", poang:10},
    {label:"Rundan på huset genomförd", poang:15},
    {label:"Skenbetagen-förmåga använd", poang:10},
  ],
  den_resande: [
    {label:"Hemlighet samlad (per st)", poang:10},
    {label:"Hemlighet bytt mot löfte", poang:15},
    {label:"3+ uppbud under Cannelloni Macaroni", poang:15},
    {label:"Sista budet använt", poang:10},
  ],
  skogsvakten: [
    {label:"Hittade de andra barnrollerna", poang:15},
    {label:"Spaningsrapport till Vägaren", poang:5},
    {label:"JAG SÅG DIG-förmåga använd", poang:10},
    {label:"Falskt rykte placerat", poang:10},
    {label:"Vuxen övad att smaka löv", poang:10},
    {label:"Smög bakom 3 vuxna ostört", poang:15},
  ],
  galningen: [
    {label:"Hittade de andra barnrollerna", poang:15},
    {label:"LYSSNA PÅ MIG! ropad (per gång)", poang:3},
    {label:"PANG PANG PANG använd", poang:10},
    {label:"Vunnit tävling mot vuxen", poang:10},
    {label:"3 vuxna övertygade att dansa konstigt", poang:15},
  ],
  korsriddaren: [
    {label:"Hittade de andra barnrollerna", poang:15},
    {label:"Äreduel vunnen (per duell)", poang:5},
    {label:"Riddarlöftet använt", poang:10},
    {label:"Vaktat stången 5 min", poang:15},
    {label:"Misstänkt vuxen rapporterad", poang:10},
  ],
};


const JULIA_UPPDRAG={
  trigger:{kon:"tjej",alder:41},
  uppdrag:"Någon gång under kvällen – du väljer när – ska du framföra 'Fångad av en stormvind' med full övertygelse. Du behöver inte förklara varför. Du gör det bara.",
  poangInfo:"Genomför: +20p · 3+ sjunger med: +30p · ALLA sjunger med: +50p och Vägaren utropar dig till Solstångsnattens hjälte.",
};

// ─── KULTDATA ─────────────────────────────────────────────────────────────────
const KULTMARKEN=[
  {id:"mk1",namn:"Skuggviskaren",
   kultInfo:"Du tjänar Mörkblotets Kult. En hemlig ledare finns bland er – men du vet inte vem.",
   direktiv:"Skydda Runläsaren från anklagelse under Tinget. Avled uppmärksamheten diskret.",
   hur:"Spela din byboroll fullt ut. Kultuppdraget är ett extra lager.",
   risk:"Om du avslöjas spelar du vidare som vanlig bybo."},
  {id:"mk2",namn:"Mörkrets Spegel",
   kultInfo:"Du tjänar Mörkblotets Kult. En hemlig ledare finns bland er – men du vet inte vem.",
   direktiv:"Håll folk borta från midsommarstången under dansen. Skapa distraktioner.",
   hur:"Veta inte varför stången är viktig – du vet bara att du måste hålla folk borta.",
   risk:"Om du avslöjas spelar du vidare som vanlig bybo."},
  {id:"mk3",namn:"Tystnadens Väktare",
   kultInfo:"Du tjänar Mörkblotets Kult. En hemlig ledare finns bland er – men du vet inte vem.",
   direktiv:"Om Mästersmeden eller Örtmästaren verkar nära att avslöja något – avbryt dem.",
   hur:"Var social och råka avbryta folk lite för ofta.",
   risk:"Om du avslöjas spelar du vidare som vanlig bybo."},
];

const KULTLEDARE_INFO={
  beskrivning:"Bakom din byboroll gömmer sig Mörkblotets sanna ledare. Fullborda ritualen vid Solståndsnatten.",
  uppdrag:"Överlev Domen oavslöjad. Det är allt som krävs för kultens seger.",
  valssignelsen:"Håll handen på stången ostört i 30 sekunder under dansen i Fas 3.",
  foermaga:"🩸 Blodsband: Skicka hemligt tecken till kultmärkt (bestäm tecken med Vägaren).",
  foermaga2:"🕯 Avrätta: Presentera en kultmärkts namn för Vägaren om de håller på att avslöja dig.",
  igenkanning:"Säg 'Mörkret hälsar' till en spelare. Om de är märkt svarar de 'och natten är lång'.",
  tips:"Spela din byboroll fullt ut. Den bäste kultledaren verkar aldrig misstänkt.",
};

const KULTMARKE_KANDIDATER=["mastersmeden","lakemedlaren","soldaten","hogprasten","runlaesaren","den_resande","glodviskaren","munken"];

const VINSTVILLKOR={
  byn:{rubrik:"🌿 Byn vinner om…",villkor:["Kultledaren pekas ut och avslöjas vid Domen.","Välsignelsen saboteras OCH Kultledaren avslöjas."],tips:"Byn måste hitta KULTLEDAREN – inte bara de märkta."},
  kulten:{rubrik:"🩸 Kulten vinner om…",villkor:["Kultledaren överlever Domen oavslöjad.","Välsignelsen aktiveras (30 sek ostört vid stången)."],tips:"Kultledaren behöver bara överleva."},
  oavgjort:{rubrik:"⚖️ Oavgjort om…",villkor:["Märkta avslöjas men Kultledaren överlever."],tips:"Vägaren avgör med dramaturgi."},
};

// ─── POÄNGSYSTEM ──────────────────────────────────────────────────────────────
const UPPGIFTER=[
  {id:"dans_cannelloni",label:"Cannelloni Macaroni",poang:5,kat:"dans",rollId:"*"},
  {id:"dans_walking",label:"Walking on Sunshine",poang:5,kat:"dans",rollId:"*"},
  {id:"dans_euphoria",label:"Euphoria – Loreen",poang:5,kat:"dans",rollId:"*"},
  {id:"dans_polkka",label:"Levan Polkka – rätt håll",poang:10,kat:"dans",rollId:"*"},
  {id:"dans_gilledans",label:"Gilledans genomförd",poang:10,kat:"dans",rollId:"*"},
  {id:"dans_alla",label:"Alla 6 danser klara",poang:20,kat:"dans",rollId:"*"},
  {id:"dans_uppbud",label:"Den Resande – 3+ uppbud",poang:15,kat:"dans",rollId:["den_resande"]},
  {id:"dans_cirkel",label:"Högprästen – 5+ i cirkelgång",poang:25,kat:"dans",rollId:["hogprasten"]},
  {id:"julia_basis",label:"Julia – Fångad av stormvind",poang:20,kat:"special",rollId:"*"},
  {id:"julia_tre",label:"Julia – 3+ sjunger med",poang:30,kat:"special",rollId:"*"},
  {id:"julia_alla",label:"Julia – ALLA sjunger med",poang:50,kat:"special",rollId:"*"},
  {id:"allians",label:"Allians registrerad",poang:15,kat:"uppdrag",rollId:"*"},
  {id:"hemlighet",label:"Hemlighet samlad",poang:10,kat:"uppdrag",rollId:"*"},
  {id:"kedja",label:"Kedja slutförd",poang:10,kat:"uppdrag",rollId:"*"},
  {id:"formaga",label:"Förmåga använd rätt",poang:20,kat:"uppdrag",rollId:"*"},
  {id:"pentagram_hitta",label:"Pentagram hittat",poang:10,kat:"uppdrag",rollId:"*"},
  {id:"anklagelse",label:"Anklagelse framförd",poang:15,kat:"ting",rollId:"*"},
  {id:"anklagelse_dom",label:"Anklagelse ledde till dom",poang:10,kat:"ting",rollId:"*"},
  {id:"anklagelse_markt",label:"Rätt – kultmärkt",poang:20,kat:"ting",rollId:"*"},
  {id:"anklagelse_ledare",label:"Rätt – Kultledaren!",poang:35,kat:"ting",rollId:"*"},
  {id:"anklagelse_fel",label:"Fel anklagelse",poang:-5,kat:"ting",rollId:"*"},
  {id:"dom_markt",label:"Pekade rätt – kultmärkt",poang:20,kat:"dom",rollId:"*"},
  {id:"dom_ledare",label:"Pekade rätt – Kultledaren",poang:40,kat:"dom",rollId:"*"},
  {id:"dom_fel",label:"Pekade fel",poang:-5,kat:"dom",rollId:"*"},
  {id:"sido_byn",label:"Sidebonus – Byn vann",poang:30,kat:"dom",rollId:"*"},
  {id:"sido_kult",label:"Sidebonus – Kulten vann",poang:50,kat:"dom",rollId:"*"},
  {id:"gille_bonus",label:"Gillebonus",poang:30,kat:"gille",rollId:"*",gilleBonus:true},
];

const INLOSEN=[
  {id:"led1",kostnad:30,typ:"ledtrad",label:"Ledtråd nivå 1 – gille",beskrivning:"Kultledarens GILLE avslöjas."},
  {id:"led2",kostnad:60,typ:"ledtrad",label:"Ledtråd nivå 2 – uteslutning",beskrivning:"Tre oskyldiga namnges."},
  {id:"led3",kostnad:90,typ:"ledtrad",label:"Ledtråd nivå 3 – kön",beskrivning:"Kultledarens KÖN avslöjas."},
  {id:"immun",kostnad:40,typ:"skydd",label:"Immunitet mot en anklagelse",beskrivning:"En anklagelse avvisas automatiskt."},
  {id:"r5",kostnad:50,typ:"roster",label:"5 extra röster vid Domen",beskrivning:"Din röst räknas som 5."},
  {id:"r10",kostnad:100,typ:"roster",label:"10 extra röster vid Domen",beskrivning:"Din röst räknas som 10."},
];

const INITIAL_SPELARE=ROLLER_MASTER.filter(r=>!r.barnroll).concat(ROLLER_MASTER.filter(r=>r.barnroll).slice(0,2)).map(r=>({
  id:r.id, rollnamn:typeof r.rollnamn==="function"?r.rollnamn(""):r.rollnamn,
  icon:r.icon, gille:r.gille, gilleColor:r.gilleColor,
  poang:0, inlost:[], roster:1,
}));

const GILLE_INFO={
  ortagillet:{namn:"Örtagillet",ikon:"🌿",farg:"#a8d5a2",ids:["kloka","ortmastaren","gronskan","skogsvakten"]},
  smederna:{namn:"Smederna",ikon:"⚒",farg:"#d4956a",ids:["mastersmeden","soldaten","glodviskaren","galningen"]},
  mankyrkan:{namn:"Månkyrkan",ikon:"☽",farg:"#9999e0",ids:["hogprasten","runlaesaren","munken","korsriddaren"]},
  fri:{namn:"Den Resande",ikon:"🎲",farg:"#c9a84c",ids:["den_resande"]},
};

// ─── TILLDELNING ──────────────────────────────────────────────────────────────
function blandaOchTilldela(antalBarn){
  const gilles=["ortagillet","smederna","månkyrkan"];
  let valdaVuxna=[];
  gilles.forEach(g=>{
    const gr=ROLLER_MASTER.filter(r=>!r.barnroll&&r.gille===g).sort(()=>Math.random()-0.5);
    valdaVuxna.push(...gr.slice(0,2));
  });
  const denResande=ROLLER_MASTER.find(r=>r.id==="den_resande");
  if(denResande)valdaVuxna.push(denResande);
  const allaBarn=ROLLER_MASTER.filter(r=>r.barnroll).sort(()=>Math.random()-0.5);
  let valdaBarn=allaBarn.slice(0,Math.min(antalBarn,3));
  if(valdaBarn.length>=2&&valdaBarn[0].gille===valdaBarn[1].gille){
    const sw=allaBarn.find(b=>b.gille!==valdaBarn[0].gille);
    if(sw)valdaBarn[1]=sw;
  }
  const aktivaIds=[...valdaVuxna,...valdaBarn].map(r=>r.id);
  const kedjor=byggKedjor(aktivaIds);
  const kandidater=valdaVuxna.filter(r=>r.gille!=="fri").map(r=>r.id);
  const markeSlump=[...KULTMARKEN].sort(()=>Math.random()-0.5).slice(0,2);
  const kandidatSlump=[...kandidater].sort(()=>Math.random()-0.5).slice(0,2);
  const ledareKandidater=kandidater.filter(id=>!kandidatSlump.includes(id));
  const kultledareId=ledareKandidater[Math.floor(Math.random()*ledareKandidater.length)];
  return [...valdaVuxna,...valdaBarn].map(r=>{
    const mi=kandidatSlump.indexOf(r.id);
    let u={...r,kedjor};
    if(mi!==-1)u={...u,kultMarke:markeSlump[mi]};
    if(r.id===kultledareId)u={...u,erKultledare:true};
    return u;
  }).sort(()=>Math.random()-0.5);
}

// ─── HJÄLPKOMPONENTER ─────────────────────────────────────────────────────────
function Sek({label,ac,children,hi}){
  return <div style={{border:`1px solid ${ac}33`,borderRadius:3,padding:"10px 12px",marginBottom:8,background:hi?ac+"10":"transparent"}}>
    <div style={{fontSize:10,letterSpacing:2,textTransform:"uppercase",marginBottom:5,color:ac,fontFamily:"'Cinzel',serif"}}>{label}</div>
    {children}
  </div>;
}
function ToggleBlock({label,ac,bg,open,setOpen,children}){
  return <>
    <button style={{width:"100%",background:bg||"transparent",border:`1px solid ${ac}44`,borderRadius:open?"4px 4px 0 0":"4px",padding:"10px 12px",fontSize:12,fontFamily:"inherit",cursor:"pointer",textAlign:"left",color:ac,display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:0}} onClick={()=>setOpen(v=>!v)}>
      <span>{label}</span><span style={{fontSize:10}}>{open?"▲":"▼"}</span>
    </button>
    {open&&<div style={{background:bg||"transparent",border:`1px solid ${ac}44`,borderTop:"none",borderRadius:"0 0 4px 4px",padding:"12px 14px",marginBottom:8}}>{children}</div>}
  </>;
}
function TabBar({tabs,active,onChange}){
  return <div style={{display:"flex",gap:4,marginBottom:16}}>
    {tabs.map((t,i)=><button key={t} style={{flex:1,background:active===i?T.guldDim:T.kant2,border:`1px solid ${active===i?T.guldDim:T.kant}`,color:active===i?T.text:T.textDim,padding:"7px 3px",fontSize:10,fontFamily:"'Cinzel',serif",cursor:"pointer",borderRadius:3,letterSpacing:0.5}} onClick={()=>onChange(i)}>{t}</button>)}
  </div>;
}

// ─── ROLLKORT-SEKTIONER ───────────────────────────────────────────────────────
function KedjeSektion({roll}){
  const kedjor=roll.kedjor||[];
  const steg=hittaKedjesteg(roll.id,kedjor);
  if(!steg.length)return null;
  const ac=roll.barnroll?"#ffb3c6":roll.gilleColor||T.guld;
  return <div style={{marginBottom:8}}>
    {steg.filter(s=>s.typ==="sandare").map((s,i)=>{
      const [open,setOpen]=useState(false);
      return <ToggleBlock key={i} label={`🗣 Din fras – ${s.kedjaNamn}`} ac={ac} bg="#080f08" open={open} setOpen={setOpen}>
        <div style={{fontSize:10,color:ac,letterSpacing:2,marginBottom:6,fontFamily:"'Cinzel',serif"}}>DIN FRAS</div>
        <div style={{background:"#000a00",border:`1px solid ${ac}44`,borderRadius:3,padding:"12px",marginBottom:10,fontSize:14,color:"#d0ffd0",fontStyle:"italic",textAlign:"center",lineHeight:1.7}}>"{s.fras}"</div>
        <div style={{fontSize:10,color:ac,letterSpacing:2,marginBottom:6,fontFamily:"'Cinzel',serif"}}>OM MOTTAGAREN SVARAR MED</div>
        <div style={{background:"#0a0800",border:`1px solid ${ac}33`,borderRadius:3,padding:"10px",marginBottom:10,fontSize:13,color:ac,fontWeight:700}}>"{s.triggerOrd}"</div>
        <div style={{fontSize:10,color:ac,letterSpacing:2,marginBottom:6,fontFamily:"'Cinzel',serif"}}>GE DEM DENNA PUSSELBIT</div>
        <div style={{background:"#080808",border:`1px solid ${ac}55`,borderRadius:3,padding:"10px",fontSize:12,color:"#e0e0ff",lineHeight:1.7}}>{s.pusselbit}</div>
      </ToggleBlock>;
    })}
    {steg.filter(s=>s.typ==="mottagare"||s.typ==="mottagare_sandare").map((s,i)=>{
      const [open,setOpen]=useState(false);
      return <ToggleBlock key={i} label={`👂 Lyssna efter – ${s.kedjaNamn}`} ac={ac} bg="#0a0f08" open={open} setOpen={setOpen}>
        <div style={{fontSize:10,color:ac,letterSpacing:2,marginBottom:6,fontFamily:"'Cinzel',serif"}}>OM NÅGON SÄGER NÅGOT MED</div>
        <div style={{background:"#000a00",border:`1px solid ${ac}44`,borderRadius:3,padding:"12px",marginBottom:10,fontSize:16,color:ac,fontWeight:700,textAlign:"center"}}>"{s.triggerOrd}"</div>
        <div style={{fontSize:10,color:ac,letterSpacing:2,marginBottom:6,fontFamily:"'Cinzel',serif"}}>SVARA MED</div>
        <div style={{background:"#0a0800",border:`1px solid ${ac}44`,borderRadius:3,padding:"12px",marginBottom:10,fontSize:14,color:"#ffeebb",fontStyle:"italic",textAlign:"center"}}>"{s.svarslösenord}"</div>
        {s.pusselbit&&<><div style={{fontSize:10,color:ac,letterSpacing:2,marginBottom:6,fontFamily:"'Cinzel',serif"}}>DU FÅR SEDAN DENNA PUSSELBIT</div>
        <div style={{background:"#080808",border:`1px solid ${ac}33`,borderRadius:3,padding:"10px",fontSize:12,color:T.textDim,fontStyle:"italic"}}>Den som sagt frasen delar sin pusselbit med dig.</div></>}
      </ToggleBlock>;
    })}
  </div>;
}

function DansSektion({roll,erKultledare}){
  const [open,setOpen]=useState(false);
  const rollId=roll.id;
  const gille=roll.gille;
  const ac=roll.barnroll?"#ffb3c6":roll.gilleColor||T.guld;
  const gilleLatId={ortagillet:"guld",smederna:"seven",mankyrkan:"only"}[gille];
  const relevanta=["cannelloni","walking","euphoria",...(gilleLatId?[gilleLatId]:[])];
  const harDir=relevanta.some(lid=>DANS_DIREKTIV[lid]?.[rollId]);
  if(!harDir)return null;
  return <ToggleBlock label="🎵 Dansdirektiv" ac={ac} bg="#090514" open={open} setOpen={setOpen}>
    {relevanta.map(lid=>{
      const lat=DANSLATAR.find(l=>l.id===lid);
      const dir=DANS_DIREKTIV[lid]?.[rollId];
      if(!dir)return null;
      return <div key={lid} style={{marginBottom:12,paddingBottom:12,borderBottom:`1px solid ${T.kant2}`}}>
        <div style={{fontSize:10,color:ac,letterSpacing:2,fontFamily:"'Cinzel',serif",marginBottom:5}}>{lat?.titel}</div>
        <p style={{fontSize:13,color:"#c8b8f0",lineHeight:1.7,margin:0}}>{dir}</p>
        {lat?.poang>0&&<div style={{fontSize:10,color:"#ffcc66",marginTop:4}}>+{lat.poang}p om genomförd</div>}
      </div>;
    })}
    <div style={{borderTop:`1px solid ${T.kant}`,paddingTop:10}}>
      <div style={{fontSize:10,color:erKultledare?"#cc3333":T.guld,letterSpacing:2,fontFamily:"'Cinzel',serif",marginBottom:6}}>{erKultledare?"🩸 LEVAN POLKKA – HEMLIGT":"🎵 LEVAN POLKKA – GÅ RUNT HUSET"}</div>
      {POLKKA.map((p,i)=><div key={i} style={{display:"flex",gap:8,alignItems:"center",marginBottom:5}}>
        <span style={{fontSize:11,color:T.textDim,width:60}}>Omgång {p.omgang}:</span>
        <span style={{fontSize:13,fontFamily:"'Cinzel',serif",fontWeight:700,color:erKultledare?"#cc3333":T.guld}}>{erKultledare?p.ledare:p.bybo}</span>
      </div>)}
      {!erKultledare&&<p style={{fontSize:11,color:T.textDim,marginTop:4,fontStyle:"italic"}}>Kultledaren går alltid åt ANNAT håll – vem märker det?</p>}
      {erKultledare&&<p style={{fontSize:11,color:"#cc9999",marginTop:4,fontStyle:"italic"}}>Gå moturs när alla andra går medurs. Var naturlig.</p>}
    </div>
  </ToggleBlock>;
}

function AnklagelseSektion({roll}){
  const [open,setOpen]=useState(false);
  if(roll.barnroll)return null;
  const text=ANKLAGELSER[roll.id];
  if(!text)return null;
  const ac=roll.gilleColor||T.guld;
  return <ToggleBlock label="⚖️ Din förskrivna anklagelse" ac={ac} bg="#08080f" open={open} setOpen={setOpen}>
    <div style={{background:"#080814",border:`1px solid ${ac}33`,borderRadius:3,padding:"14px",marginBottom:10}}>
      <div style={{fontSize:10,color:ac,letterSpacing:2,fontFamily:"'Cinzel',serif",marginBottom:8}}>LÄS HÖGT VID TINGET</div>
      <p style={{fontSize:13,color:T.text,lineHeight:1.9,margin:0,fontStyle:"italic"}}>"{text}"</p>
    </div>
    <div style={{fontSize:11,color:"#ffcc66"}}>+15p för att framföra · +10p om majoriteten följer · +20-35p om korrekt</div>
  </ToggleBlock>;
}

function JuliaSektion({spelarKon,spelarAlder}){
  const [open,setOpen]=useState(false);
  if(spelarKon!=="tjej"||parseInt(spelarAlder)!==41)return null;
  return <ToggleBlock label="🌪 Ditt hemliga specialuppdrag" ac="#ffcc44" bg="#0a0800" open={open} setOpen={setOpen}>
    <div style={{background:"#0a0800",border:"1px solid #ffcc4444",borderRadius:3,padding:"12px",marginBottom:10,textAlign:"center"}}>
      <div style={{fontSize:11,color:"#ffcc44",letterSpacing:2,fontFamily:"'Cinzel',serif",marginBottom:8}}>DETTA ÄR BARA FÖR DIG</div>
      <p style={{fontSize:14,color:"#ffe88a",lineHeight:1.8,margin:0}}>{JULIA_UPPDRAG.uppdrag}</p>
    </div>
    <p style={{fontSize:12,color:"#ffe88a",lineHeight:1.7,margin:0}}>{JULIA_UPPDRAG.poangInfo}</p>
  </ToggleBlock>;
}

// ─── GILLESUPPDRAG-SEKTION ────────────────────────────────────────────────────
function GillesuppdragSektion({roll}){
  const [open,setOpen]=useState(false);
  const gille=roll.gille;
  const data=GILLESUPPDRAG[gille];
  if(!data)return null;
  const ac=roll.barnroll?"#ffb3c6":roll.gilleColor||T.guld;
  return <ToggleBlock label={data.rubrik} ac={ac} bg="#060e06" open={open} setOpen={setOpen}>
    <div style={{fontSize:11,color:T.textDim,fontStyle:"italic",marginBottom:10,lineHeight:1.5}}>Alla i gillet måste bidra för gillebonus!</div>
    {data.gemensamt.map((u,i)=><div key={i} style={{display:"flex",gap:8,padding:"5px 0",borderBottom:`1px solid ${T.kant2}`}}>
      <span style={{fontSize:13,color:ac,flexShrink:0}}>•</span>
      <span style={{fontSize:12,color:T.text,lineHeight:1.5}}>{u}</span>
    </div>)}
    <div style={{marginTop:10,padding:"8px 10px",background:ac+"15",borderRadius:3,fontSize:12,color:ac,fontStyle:"italic"}}>{data.bonus}</div>
  </ToggleBlock>;
}

// ─── ROLL-POÄNG-SEKTION ───────────────────────────────────────────────────────
function RollPoangSektion({roll}){
  const [open,setOpen]=useState(false);
  const uppg=ROLL_UPPGIFTER[roll.id];
  if(!uppg||!uppg.length)return null;
  const ac=roll.barnroll?"#ffb3c6":roll.gilleColor||T.guld;
  const maxMojligt=uppg.reduce((a,u)=>a+u.poang,0);
  return <ToggleBlock label={`💰 Dina poänguppdrag (max ~${maxMojligt}p)`} ac={ac} bg="#080a06" open={open} setOpen={setOpen}>
    {uppg.map((u,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:`1px solid ${T.kant2}`}}>
      <span style={{fontSize:12,color:T.text,flex:1,lineHeight:1.4}}>{u.label}</span>
      <span style={{fontSize:13,color:"#a8d5a2",fontWeight:700,marginLeft:12,fontFamily:"'Cinzel',serif"}}>+{u.poang}p</span>
    </div>)}
    <div style={{marginTop:8,fontSize:11,color:T.textDim,fontStyle:"italic"}}>Plus dans (+5-10p), anklagelse (+15p), dom (+20-40p) och sidebonus (+30-50p)</div>
  </ToggleBlock>;
}


// ─── ROLLKORT ─────────────────────────────────────────────────────────────────
function RollKort({roll,onBekrafta,spelarKon,spelarAlder}){
  const [visNamn,setVisNamn]=useState(false);
  const [visRel,setVisRel]=useState(false);
  const [visMarke,setVisMarke]=useState(false);
  const ac=roll.barnroll?"#ffb3c6":roll.gilleColor||T.guld;
  const rollnamn=typeof roll.rollnamn==="function"?roll.rollnamn(spelarKon||""):roll.rollnamn;
  const namnforslag=roll.namnforslag||[];

  return <div style={{...Sida,paddingTop:12}}>
    {roll.barnroll&&<div style={{textAlign:"center",background:"#1a0a10",border:"1px solid #ffb3c644",borderRadius:4,padding:"8px",marginBottom:10,fontSize:12,color:"#ffb3c6"}}>🌸 Barnroll – enkel och rolig!</div>}
    <div style={{textAlign:"center",padding:"14px 0 10px"}}>
      <div style={{fontSize:50}}>{roll.icon}</div>
      <div style={{fontFamily:"'Cinzel',serif",fontSize:21,fontWeight:700,color:ac,letterSpacing:2,marginTop:6}}>{rollnamn}</div>
      <div style={{fontSize:12,color:ac+"88",letterSpacing:1,marginTop:2}}>{roll.gille}</div>
    </div>

    {namnforslag.length>0&&<ToggleBlock label="🎭 Alternativa namn" ac={ac} bg="#0a0a00" open={visNamn} setOpen={setVisNamn}>
      <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
        {namnforslag.map((n,i)=><span key={i} style={{fontSize:12,background:ac+"18",color:ac,padding:"5px 12px",borderRadius:2,border:`1px solid ${ac}33`}}>{n}</span>)}
      </div>
    </ToggleBlock>}

    <Sek label="✦ Karaktär" ac={ac}><p style={RT}><em>{roll.karaktar}</em></p></Sek>
    <Sek label="📖 Bakgrund" ac={ac}><p style={{...RT,whiteSpace:"pre-line"}}>{roll.beskrivning}</p></Sek>
    <Sek label="⚔ Ditt uppdrag" ac={ac} hi><p style={RT}>{roll.uppdrag}</p></Sek>
    <GillesuppdragSektion roll={roll}/>
    <RollPoangSektion roll={roll}/>
    <Sek label="✦ Förmåga I" ac={ac}><p style={RT}>{roll.foermaga}</p></Sek>
    {roll.foermaga2&&<Sek label="✦ Förmåga II" ac={ac}><p style={RT}>{roll.foermaga2}</p></Sek>}

    {roll.relationer?.length>0&&<ToggleBlock label={`🤝 Relationer (${roll.relationer.length})`} ac={ac} bg="#06080a" open={visRel} setOpen={setVisRel}>
      {roll.relationer.map((r,i)=><div key={i} style={{marginBottom:i<roll.relationer.length-1?12:0,paddingBottom:i<roll.relationer.length-1?12:0,borderBottom:i<roll.relationer.length-1?`1px solid ${T.kant2}`:"none"}}>
        <div style={{fontSize:11,color:ac,fontFamily:"'Cinzel',serif",letterSpacing:1,marginBottom:4}}>{r.till} · <span style={{color:T.guldDim}}>{r.typ}</span></div>
        <p style={{...RT,color:T.textDim}}>{r.text}</p>
      </div>)}
    </ToggleBlock>}

    <AnklagelseSektion roll={roll}/>
    <KedjeSektion roll={roll}/>
    <DansSektion roll={roll} erKultledare={roll.erKultledare}/>
    <JuliaSektion spelarKon={spelarKon} spelarAlder={spelarAlder}/>

    {roll.erKultledare&&<ToggleBlock label="🩸 HEMLIGT – Du är Kultledaren" ac="#cc3333" bg="#1a0000" open={visMarke} setOpen={setVisMarke}>
      <div style={{background:"#0a0000",border:"1px solid #cc3333",borderRadius:3,padding:"10px",marginBottom:10,textAlign:"center",fontSize:12,color:"#cc3333",fontFamily:"'Cinzel',serif",letterSpacing:1}}>AVSLÖJA DETTA FÖR INGEN</div>
      <p style={{...RT,color:"#cc9999",marginBottom:10}}>{KULTLEDARE_INFO.beskrivning}</p>
      <p style={{...RT,color:"#cc9999",marginBottom:10}}><strong style={{color:"#cc3333"}}>Välsignelsen:</strong> {KULTLEDARE_INFO.valssignelsen}</p>
      <p style={{...RT,color:"#cc9999",marginBottom:10}}><strong style={{color:"#cc3333"}}>Igenkänning:</strong> {KULTLEDARE_INFO.igenkanning}</p>
      <p style={{...RT,color:"#cc9999",marginBottom:6}}>{KULTLEDARE_INFO.foermaga}</p>
      <p style={{...RT,color:"#cc9999",marginBottom:10}}>{KULTLEDARE_INFO.foermaga2}</p>
      <p style={{...RT,color:"#cc9999"}}>{KULTLEDARE_INFO.tips}</p>
    </ToggleBlock>}

    {roll.kultMarke&&!roll.erKultledare&&<ToggleBlock label={`🩸 Hemligt kultmärke – ${roll.kultMarke.namn}`} ac="#cc6666" bg="#140303" open={visMarke} setOpen={setVisMarke}>
      <div style={{background:"#0a0000",border:"1px solid #8b1a1a",borderRadius:3,padding:"10px",marginBottom:10,fontSize:12,color:"#cc6666",textAlign:"center"}}>Du tjänar kulten. Du vet inte vem ledaren är.</div>
      <p style={{...RT,color:"#cc9999",marginBottom:10}}>{roll.kultMarke.direktiv}</p>
      <p style={{...RT,color:"#cc9999",marginBottom:10}}>{roll.kultMarke.hur}</p>
      <p style={{...RT,color:"#cc9999"}}>{roll.kultMarke.risk}</p>
    </ToggleBlock>}

    <Sek label="💡 Tips" ac={T.guldDim}><p style={RT}>{roll.tips}</p></Sek>
    <p style={{fontSize:11,color:T.textDim,textAlign:"center",marginTop:10}}>Memorera · Visa ingen · Lycka till</p>
    {onBekrafta!==null&&<button style={{...BtnH,width:"100%",marginTop:10}} onClick={onBekrafta}>Jag har läst min roll ✓</button>}
    <div style={{height:32}}/>
  </div>;
}

// ─── POÄNG-ADMIN ──────────────────────────────────────────────────────────────
function PoangAdmin({spelare,setSpelare}){
  const [vald,setVald]=useState(null);
  const [subTab,setSubTab]=useState(0);

  const [sistaHandling,setSistaHandling]=useState(null);

  function addPoang(id,uppgId){
    const u=UPPGIFTER.find(x=>x.id===uppgId);
    if(!u)return;
    setSistaHandling({id,uppgId,poang:u.poang});
    setSpelare(prev=>prev.map(s=>{
      if(u.gilleBonus){
        const sp=prev.find(x=>x.id===id);
        const gIds=Object.values(GILLE_INFO).find(g=>g.ids.includes(id))?.ids||[];
        if(gIds.includes(s.id))return {...s,poang:s.poang+u.poang};
        return s;
      }
      if(s.id===id)return {...s,poang:Math.max(0,s.poang+u.poang)};
      return s;
    }));
  }

  function angraHandling(){
    if(!sistaHandling)return;
    const {id,poang}=sistaHandling;
    setSpelare(prev=>prev.map(s=>s.id===id?{...s,poang:Math.max(0,s.poang-poang)}:s));
    setSistaHandling(null);
  }

  function losIn(id,inlId){
    const inl=INLOSEN.find(x=>x.id===inlId);
    const sp=spelare.find(s=>s.id===id);
    if(!inl||!sp||sp.poang<inl.kostnad)return;
    setSpelare(prev=>prev.map(s=>{
      if(s.id!==id)return s;
      const nr=inl.id==="r5"?s.roster+5:inl.id==="r10"?s.roster+10:s.roster;
      return {...s,poang:s.poang-inl.kostnad,inlost:[...s.inlost,inlId],roster:nr};
    }));
  }

  const valdSp=spelare.find(s=>s.id===vald);
  const maxP=Math.max(...spelare.map(s=>s.poang),1);
  const gilleData=Object.entries(GILLE_INFO).map(([gid,g])=>({
    ...g,gid,
    spelare:spelare.filter(s=>g.ids.includes(s.id)),
    total:spelare.filter(s=>g.ids.includes(s.id)).reduce((a,s)=>a+s.poang,0),
  }));

  return <div>
    <TabBar tabs={["Check-in","Fasöversikt","Gillen"]} active={subTab} onChange={setSubTab}/>

    {subTab===0&&<>
      <div style={Kort}>
        <div style={Lbl}>Välj spelare</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
          {spelare.map(s=>{
            const g=Object.values(GILLE_INFO).find(x=>x.ids.includes(s.id));
            const ac=g?.farg||T.guld;
            return <button key={s.id} style={{fontSize:11,background:vald===s.id?ac+"33":"transparent",color:vald===s.id?ac:T.textDim,border:`1px solid ${vald===s.id?ac+"66":T.kant2}`,borderRadius:3,padding:"5px 9px",cursor:"pointer",fontFamily:"inherit",marginBottom:4}} onClick={()=>setVald(s.id)}>
              {s.icon} {s.rollnamn} <strong>{s.poang}p</strong>
            </button>;
          })}
        </div>
      </div>
      {valdSp&&<div style={Kort}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <span style={{fontFamily:"'Cinzel',serif",fontSize:14,color:T.guld}}>{valdSp.icon} {valdSp.rollnamn}</span>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {sistaHandling&&sistaHandling.id===valdSp.id&&<button style={{fontSize:11,background:"#1a0808",border:"1px solid #8b1a1a",borderRadius:3,padding:"4px 10px",color:"#cc6666",cursor:"pointer",fontFamily:"inherit"}} onClick={angraHandling}>↩ Ångra {sistaHandling.poang>0?"+":""}{sistaHandling.poang}p</button>}
            <span style={{fontFamily:"'Cinzel',serif",fontSize:22,color:T.guld}}>{valdSp.poang}p</span>
          </div>
        </div>
        {[{kat:"dans",lbl:"🎵 Dans"},{kat:"uppdrag",lbl:"⚔ Uppdrag"},{kat:"special",lbl:"🌪 Special"},{kat:"ting",lbl:"⚖️ Tinget"},{kat:"dom",lbl:"🗳️ Domen"},{kat:"gille",lbl:"🏅 Gille"}].map(({kat,lbl})=>{
          const uppg=UPPGIFTER.filter(u=>u.kat===kat&&(u.rollId==="*"||u.rollId.includes(valdSp.id)));
          if(!uppg.length)return null;
          return <div key={kat} style={{marginBottom:10}}>
            <div style={{fontSize:10,color:T.guldDim,letterSpacing:2,marginBottom:5,fontFamily:"'Cinzel',serif"}}>{lbl}</div>
            <div style={{display:"flex",flexDirection:"column",gap:3}}>
              {uppg.map(u=><button key={u.id} style={{background:"transparent",border:`1px solid ${u.poang<0?"#8b1a1a":T.kant2}`,borderRadius:3,padding:"7px 10px",cursor:"pointer",textAlign:"left",fontFamily:"inherit",display:"flex",justifyContent:"space-between"}} onClick={()=>addPoang(valdSp.id,u.id)}>
                <span style={{fontSize:12,color:T.text}}>{u.label}</span>
                <span style={{fontSize:13,color:u.poang<0?"#cc6666":"#a8d5a2",fontWeight:700}}>{u.poang>0?"+":""}{u.poang}p</span>
              </button>)}
            </div>
          </div>;
        })}
        <div style={{borderTop:`1px solid ${T.kant}`,marginTop:10,paddingTop:10}}>
          <div style={Lbl}>💰 Lös in</div>
          {INLOSEN.map(inl=>{
            const klar=valdSp.inlost.includes(inl.id);
            const harP=valdSp.poang>=inl.kostnad;
            return <button key={inl.id} disabled={!harP||klar} style={{width:"100%",marginBottom:5,background:klar?"#0a1a0a":"transparent",border:`1px solid ${klar?"#3d6b3a":harP?"#9999cc44":T.kant2}`,borderRadius:3,padding:"8px 10px",cursor:harP&&!klar?"pointer":"not-allowed",opacity:harP||klar?1:0.4,textAlign:"left",fontFamily:"inherit"}} onClick={()=>losIn(valdSp.id,inl.id)}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                <span style={{fontSize:12,color:klar?"#a8d5a2":harP?T.text:T.textDim}}>{klar?"✓ ":""}{inl.label}</span>
                <span style={{fontSize:12,color:"#cc6666",fontWeight:700}}>{inl.kostnad}p</span>
              </div>
              <div style={{fontSize:10,color:T.textDim}}>{inl.beskrivning}</div>
            </button>;
          })}
        </div>
      </div>}
    </>}

    {subTab===1&&<>
      <div style={{...Kort,borderColor:"#c9a84c44"}}>
        <div style={Lbl}>📊 Individuell poängställning</div>
        {[...spelare].sort((a,b)=>b.poang-a.poang).map((s,i)=>{
          const g=Object.values(GILLE_INFO).find(x=>x.ids.includes(s.id));
          const ac=g?.farg||T.guld;
          return <div key={s.id} style={{marginBottom:8}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
              <span style={{fontSize:12,color:ac}}>{i+1}. {s.icon} {s.rollnamn}</span>
              <span style={{fontSize:12,color:T.guld,fontWeight:700}}>{s.poang}p</span>
            </div>
            <div style={{height:4,background:T.kant2,borderRadius:2,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${Math.max(4,Math.round(s.poang/maxP*100))}%`,background:`linear-gradient(to right,${ac}88,${ac})`,borderRadius:2}}/>
            </div>
          </div>;
        })}
      </div>
      <div style={Kort}>
        <div style={Lbl}>🏅 Gillepoäng</div>
        {gilleData.map(g=><div key={g.gid} style={{display:"flex",alignItems:"center",gap:10,padding:"6px 0",borderBottom:`1px solid ${T.kant2}`}}>
          <span style={{fontSize:16}}>{g.ikon}</span>
          <span style={{flex:1,fontSize:13,color:g.farg,fontFamily:"'Cinzel',serif"}}>{g.namn}</span>
          <span style={{fontSize:16,fontFamily:"'Cinzel',serif",fontWeight:700,color:T.guld}}>{g.total}p</span>
        </div>)}
      </div>
    </>}

    {subTab===2&&gilleData.map(g=><div key={g.gid} style={{...Kort,borderColor:g.farg+"44",marginBottom:8}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
        <span style={{fontFamily:"'Cinzel',serif",fontSize:13,color:g.farg}}>{g.ikon} {g.namn}</span>
        <span style={{fontSize:16,color:T.guld,fontWeight:700}}>{g.total}p</span>
      </div>
      {g.spelare.map(s=><div key={s.id} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:`1px solid ${T.kant2}`}}>
        <span style={{fontSize:12,color:T.text}}>{s.icon} {s.rollnamn}</span>
        <span style={{fontSize:13,color:g.farg,fontWeight:700}}>{s.poang}p</span>
      </div>)}
      <button style={{...BtnS,width:"100%",marginTop:8,fontSize:11,padding:"6px",borderColor:g.farg+"44",color:g.farg}} onClick={()=>g.spelare.forEach(s=>addPoang(s.id,"gille_bonus"))}>
        + Gillebonus +30p till alla i {g.namn}
      </button>
    </div>)}
  </div>;
}

// ─── POÄNG-VY (Resultattavla) ─────────────────────────────────────────────────
function PoangVy({spelare,domAvslojad,setDomAvslojad,setVy}){
  const sorted=[...spelare].sort((a,b)=>b.poang-a.poang);
  const maxP=Math.max(...spelare.map(s=>s.poang),1);
  return <div style={Sida}>
    <button style={Tillbaka} onClick={()=>setVy("start")}>← Tillbaka</button>
    <h2 style={SRubrik}>⚖️ Resultattavla</h2>
    {!domAvslojad?<div style={{textAlign:"center",padding:"60px 20px"}}>
      <div style={{fontSize:48,marginBottom:16}}>⚖️</div>
      <p style={{fontSize:15,color:T.textDim,fontStyle:"italic",lineHeight:1.8,marginBottom:24}}>Förseglad till Domen.</p>
      <button style={BtnH} onClick={()=>setDomAvslojad(true)}>🩸 Vägaren avslöjar resultaten</button>
    </div>:<>
      <div style={{...Kort,borderColor:"#c9a84c55",background:"#0a0800",marginBottom:16,textAlign:"center"}}>
        <div style={{fontSize:11,color:T.guldDim,letterSpacing:3,fontFamily:"'Cinzel',serif"}}>SOLSTÅNDSNATTEN · AUSÅS BLOTÄNGAR</div>
      </div>
      {sorted.map((s,i)=>{
        const g=Object.values(GILLE_INFO).find(x=>x.ids.includes(s.id));
        const ac=g?.farg||T.guld;
        return <div key={s.id} style={{...Kort,marginBottom:8,borderColor:ac+"55"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
            <span style={{fontSize:14,color:T.textDim,width:20}}>{i+1}.</span>
            <span style={{fontSize:20}}>{s.icon}</span>
            <div style={{flex:1}}>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:13,color:ac}}>{s.rollnamn}</div>
              {s.roster>1&&<div style={{fontSize:11,color:"#ffcc66"}}>🗳️ {s.roster} röster vid Domen</div>}
            </div>
            <span style={{fontFamily:"'Cinzel',serif",fontSize:22,color:i===0?T.guld:T.text}}>{s.poang}p</span>
          </div>
          <div style={{height:5,background:T.kant2,borderRadius:2,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${Math.max(4,Math.round(s.poang/maxP*100))}%`,background:`linear-gradient(to right,${ac}88,${ac})`,borderRadius:2}}/>
          </div>
        </div>;
      })}
    </>}
  </div>;
}

// ─── DELTAGAR-VY ──────────────────────────────────────────────────────────────
function DeltagarVy({setVy,kontaktlista,setKontaktlista}){
  function upd(id,f,v){setKontaktlista(prev=>prev.map(k=>k.id===id?{...k,[f]:v}:k));}
  function laggTill(){setKontaktlista(prev=>[...prev,{id:Date.now(),namn:"",kon:"tjej",alder:"",mail:"",telefon:""}]);}
  function taBort(id){setKontaktlista(prev=>prev.filter(k=>k.id!==id));}
  const klara=kontaktlista.filter(k=>k.namn&&k.alder&&(k.mail||k.telefon)).length;
  const inp={width:"100%",background:"#0a0a00",border:`1px solid ${T.kant}`,borderRadius:3,padding:"8px 10px",color:T.text,fontSize:12,fontFamily:"inherit",marginBottom:8};
  return <div style={Sida}>
    <button style={Tillbaka} onClick={()=>setVy("spelledare")}>← Tillbaka</button>
    <h2 style={SRubrik}>👥 Deltagare</h2>
    <div style={{...Kort,borderColor:"#9999cc44",background:"#080814",marginBottom:12}}>
      <p style={{fontSize:12,color:T.textDim,lineHeight:1.6,margin:0}}>Fyll i kontaktinfo. Appen matchar automatiskt rätt person när de anger kön + ålder.<br/><br/><strong style={{color:"#9999cc"}}>Sparas automatiskt.</strong></p>
    </div>
    {kontaktlista.map((k,i)=>{
      const klar=k.namn&&k.alder&&(k.mail||k.telefon);
      return <div key={k.id} style={{...Kort,marginBottom:8,borderColor:klar?"#3d6b3a55":T.kant}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <span style={{fontFamily:"'Cinzel',serif",fontSize:12,color:klar?"#a8d5a2":T.guld}}>{klar?"✓ ":""}Deltagare {i+1}</span>
          <button style={{background:"none",border:"none",color:T.rod,cursor:"pointer",fontSize:16}} onClick={()=>taBort(k.id)}>✕</button>
        </div>
        <input style={inp} placeholder="Namn" value={k.namn} onChange={e=>upd(k.id,"namn",e.target.value)}/>
        <div style={{display:"flex",gap:8,marginBottom:8}}>
          <div style={{flex:1}}>
            <div style={{fontSize:9,color:T.guldDim,letterSpacing:2,marginBottom:4}}>KÖN</div>
            <div style={{display:"flex",gap:4}}>
              {[["tjej","👧"],["kille","👦"],["annat","🌟"]].map(([kv,em])=><button key={kv} style={{flex:1,background:k.kon===kv?T.guldDim:"#0a0a00",border:`1px solid ${k.kon===kv?T.guld:T.kant}`,color:k.kon===kv?T.bg:T.textDim,borderRadius:3,padding:"6px 2px",fontSize:10,cursor:"pointer"}} onClick={()=>upd(k.id,"kon",kv)}>{em} {kv}</button>)}
            </div>
          </div>
          <div style={{width:70}}>
            <div style={{fontSize:9,color:T.guldDim,letterSpacing:2,marginBottom:4}}>ÅLDER</div>
            <input type="number" placeholder="35" value={k.alder} onChange={e=>upd(k.id,"alder",e.target.value)} style={{...inp,marginBottom:0,textAlign:"center",padding:"6px"}}/>
          </div>
        </div>
        <input style={inp} placeholder="E-postadress" value={k.mail} onChange={e=>upd(k.id,"mail",e.target.value)}/>
        <input style={{...inp,marginBottom:0}} placeholder="Telefon (+46...)" value={k.telefon} onChange={e=>upd(k.id,"telefon",e.target.value)}/>
        {klar&&<div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:6}}>
          {k.namn&&<span style={{fontSize:10,background:"#0a1a0a",color:"#a8d5a2",padding:"2px 8px",borderRadius:2}}>✓ {k.namn}</span>}
          {k.mail&&<span style={{fontSize:10,background:"#0a1a0a",color:"#a8d5a2",padding:"2px 8px",borderRadius:2}}>✓ Mail</span>}
          {k.telefon&&<span style={{fontSize:10,background:"#0a1a0a",color:"#a8d5a2",padding:"2px 8px",borderRadius:2}}>✓ SMS</span>}
        </div>}
      </div>;
    })}
    <button style={{...BtnS,width:"100%",marginBottom:10}} onClick={laggTill}>+ Lägg till deltagare</button>
    <div style={{...Kort,borderColor:"#3d6b3a44",background:"#060e06"}}>
      <div style={{fontSize:11,color:"#a8d5a2",marginBottom:4}}>{klara} av {kontaktlista.length} klara</div>
      <div style={{height:4,background:T.kant2,borderRadius:2,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${kontaktlista.length>0?Math.round(klara/kontaktlista.length*100):0}%`,background:"linear-gradient(to right,#3d6b3a,#a8d5a2)",borderRadius:2}}/>
      </div>
    </div>
    <button style={{...BtnH,width:"100%",marginTop:8}} onClick={()=>setVy("spelledare")}>← Tillbaka</button>
    <div style={{height:32}}/>
  </div>;
}

// ─── SPELLEDARE-VY ────────────────────────────────────────────────────────────
function SpelledarVy({setVy,starta,tab,setTab,antalBarn,setAntalBarn,spelare,setSpelare,domAvslojad,setDomAvslojad,fordel}){
  const [visaRoster,setVisaRoster]=useState(false);
  const tabs=["Setup","Vinstvillkor","Vägaren","Poäng"];
  return <div style={Sida}>
    <button style={Tillbaka} onClick={()=>setVy("start")}>← Tillbaka</button>
    <h2 style={SRubrik}>⚖️ Spelledare</h2>
    <TabBar tabs={tabs} active={tab} onChange={setTab}/>

    {tab===0&&<>
      <div style={{...Kort,borderColor:"#9999cc44"}}>
        <div style={{...Lbl,color:"#9999cc"}}>👥 Deltagarinfo</div>
        <button style={{...BtnS,width:"100%",borderColor:"#9999cc44",color:"#9999cc",fontSize:12,padding:"10px"}} onClick={()=>setVy("deltagare")}>👥 Hantera deltagare →</button>
      </div>
      <div style={Kort}>
        <div style={Lbl}>🌸 Antal barnroller</div>
        <div style={{display:"flex",alignItems:"center",gap:20,marginBottom:6}}>
          <button style={{background:T.kant,border:"none",color:T.text,width:34,height:34,borderRadius:3,fontSize:18,cursor:"pointer"}} onClick={()=>setAntalBarn(Math.max(0,antalBarn-1))}>−</button>
          <span style={{fontSize:22,fontFamily:"'Cinzel',serif",color:"#ffb3c6",minWidth:24,textAlign:"center"}}>{antalBarn}</span>
          <button style={{background:T.kant,border:"none",color:T.text,width:34,height:34,borderRadius:3,fontSize:18,cursor:"pointer"}} onClick={()=>setAntalBarn(Math.min(3,antalBarn+1))}>+</button>
        </div>
      </div>
      <div style={{...Kort,borderColor:"#cc333355",background:"#120808"}}>
        <div style={{...Lbl,color:"#cc6666"}}>🩸 Kultinfo</div>
        <p style={{fontSize:12,color:"#cc9999",lineHeight:1.7,margin:0}}>1 hemlig Kultledare · 2 Kultmärkta · Resten bybor<br/>Igenkänning: "Mörkret hälsar" → "och natten är lång"</p>
      </div>
      {fordel?.length>0&&<div style={{...Kort,borderColor:"#9999cc44",background:"#080814"}}>
        <div style={{...Lbl,color:"#9999cc"}}>✓ Roller delade – {fordel.length} spelare</div>
        {fordel.map(r=>{
          const rollnamn=typeof r.rollnamn==="function"?r.rollnamn(""):r.rollnamn;
          return <div key={r.id} style={{display:"flex",gap:8,padding:"3px 0",borderBottom:`1px solid ${T.kant2}`,fontSize:12}}>
            <span>{r.icon}</span>
            <span style={{color:r.gilleColor||T.guld,flex:1}}>{rollnamn}</span>
            {r.erKultledare&&<span style={{color:"#cc3333",fontSize:10}}>LEDARE</span>}
            {r.kultMarke&&!r.erKultledare&&<span style={{color:"#cc6666",fontSize:10}}>MÄRKT</span>}
          </div>;
        })}
      </div>}
      <button style={{...BtnH,width:"100%"}} onClick={starta}>Starta – Dela ut roller →</button>
    </>}

    {tab===1&&<div>
      {Object.entries(VINSTVILLKOR).map(([k,v])=><div key={k} style={{...Kort,marginBottom:8,borderColor:k==="byn"?"#a8d5a244":k==="kulten"?"#cc333344":"#c9a84c44"}}>
        <div style={{fontSize:12,color:k==="byn"?"#a8d5a2":k==="kulten"?"#cc3333":T.guld,fontFamily:"'Cinzel',serif",marginBottom:6}}>{v.rubrik}</div>
        {v.villkor.map((vv,i)=><p key={i} style={{fontSize:11,color:T.textDim,margin:"0 0 4px",lineHeight:1.5}}>• {vv}</p>)}
        <p style={{fontSize:10,color:T.guldDim,margin:"4px 0 0",fontStyle:"italic"}}>{v.tips}</p>
      </div>)}
    </div>}

    {tab===2&&<div>
      <div style={{textAlign:"center",padding:"16px 0"}}>
        <div style={{fontSize:40,marginBottom:6}}>⚖️</div>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:18,color:T.guld,marginBottom:4}}>Vägaren</div>
        <div style={{fontSize:11,color:T.textDim,fontStyle:"italic"}}>Tingets röst · Rättvisans väktare · Utan parti</div>
      </div>
      <div style={Kort}>
        <div style={Lbl}>Fasintroduktioner</div>
        {[
          {fas:"Öppning","txt":"Välkommen till Ausås Blotängar. Det är Solståndsnatten – natten då mörkrets krafter är som mest desperata."},
          {fas:"Fas 1","txt":"Solståndsnatten har börjat. Mingla, lyssna, bilda allianser. Tinget öppnar om trettio minuter."},
          {fas:"Fas 2","txt":"BYBOR! Tinget är öppnat! Vem bär mörkrets märke? Träd fram och tala!"},
          {fas:"Fas 3","txt":"Ritualen och dansen. Midsommarstången kallar. Alla reser sig."},
          {fas:"Fas 4","txt":"Dansen är slut. Vägaren kräver nu sin dom. Alla pekar – tre, två, ett – PEK!"},
        ].map((f,i)=><div key={i} style={{marginBottom:10,paddingBottom:10,borderBottom:`1px solid ${T.kant2}`}}>
          <div style={{fontSize:10,color:T.guld,letterSpacing:2,marginBottom:4,fontFamily:"'Cinzel',serif"}}>{f.fas.toUpperCase()}</div>
          <p style={{fontSize:12,color:"#aac0ff",fontStyle:"italic",lineHeight:1.7,margin:0}}>"{f.txt}"</p>
        </div>)}
        <p style={{fontSize:11,color:T.textDim,fontStyle:"italic",margin:0}}>Avslutar alltid: "Jag har vägt skuld mot oskuld. Vågen har talat."</p>
      </div>
    </div>}

    {tab===3&&<PoangAdmin spelare={spelare} setSpelare={setSpelare}/>}
  </div>;
}

// ─── STARTVY ──────────────────────────────────────────────────────────────────
function StartVy({setVy}){
  return <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"95vh",padding:"24px 20px",textAlign:"center"}}>
    <div style={{fontSize:11,letterSpacing:9,color:T.guldDim,marginBottom:14,fontFamily:"monospace"}}>ᛗ ᛁ ᛞ ᛋ ᚢ ᛗ ᛒ ᛚ ᚩ ᛏ</div>
    <h1 style={{fontFamily:"'Cinzel',serif",fontSize:34,fontWeight:700,color:T.guld,margin:"0 0 4px",letterSpacing:3}}>Midsommarblot</h1>
    <p style={{fontSize:13,color:T.textDim,margin:"0 0 2px",fontStyle:"italic"}}>Ausås Blotängar</p>
    <p style={{fontSize:11,color:T.guldDim,margin:"0 0 20px",letterSpacing:1}}>Solståndsnatten · 19 juni 2026</p>
    <div style={{width:80,height:1,background:`linear-gradient(to right,transparent,${T.guldDim},transparent)`,margin:"0 auto 20px"}}/>
    <p style={{fontSize:14,lineHeight:1.9,color:T.text,maxWidth:300,marginBottom:28}}>
      Det är natten då solen aldrig går ned.<br/>
      Byborna samlas kring midsommarstången<br/>
      för att fira årets ljusaste tid.<br/><br/>
      Men medan sången ekar över ängarna<br/>
      rör sig något i skuggorna.<br/><br/>
      Förtroenden kommer att prövas,<br/>
      allianser brytas och hemligheter avslöjas.<br/><br/>
      För i natt är ingenting som det verkar.
    </p>
    <div style={{display:"flex",flexDirection:"column",gap:10,width:"100%",maxWidth:300}}>
      <button style={BtnH} onClick={()=>setVy("spelledare")}>⚖️ Spelledare / Vägaren</button>
      <button style={BtnS} onClick={()=>setVy("guide")}>📜 Roller & Relationer</button>
      <button style={{...BtnS,borderColor:"#9999cc44",color:"#9999cc"}} onClick={()=>setVy("regler")}>📖 Spelregler</button>
      <button style={{...BtnS,borderColor:"#c9a84c44",color:T.guld}} onClick={()=>setVy("poang")}>⚖️ Resultattavla</button>
    </div>
  </div>;
}

// ─── DRAG-VY ──────────────────────────────────────────────────────────────────
function DragVy({fordel,idx,roll,avslojar,bekr,klart,alder,setAlder,kon,setKon,alderKlar,bekraftaAlder,setAvslojar,setBekr,nasta,setVy}){
  const C={display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"90vh",padding:"24px 20px",textAlign:"center"};
  if(klart)return <div style={C}>
    <div style={{fontSize:48,marginBottom:12}}>🔥</div>
    <h3 style={{fontFamily:"'Cinzel',serif",fontSize:20,color:T.guld,marginBottom:12}}>Alla roller delade!</h3>
    <p style={{fontSize:15,lineHeight:1.8,color:T.text}}>Ausås Blotängar är redo.<br/>Solståndsnatten börjar nu.</p>
    <button style={{...BtnH,marginTop:32}} onClick={()=>setVy("start")}>← Tillbaka</button>
  </div>;
  if(bekr&&roll){
    // Spara roll i localStorage med unik nyckel
    // Spara bara rollId + kultinfo + kon/alder i URL - resten slås upp från ROLLER_MASTER
    const miniData={
      id:roll.id,
      kon:kon||"",
      alder:alder||"",
      erk:roll.erKultledare?1:0,
      km:roll.kultMarke?.id||"",
    };
    const enkodad=btoa(JSON.stringify(miniData));
    const url="https://midsommarblot.vercel.app/#roll="+enkodad;
    return <div style={{...C,padding:"20px"}}>
      <div style={{fontFamily:"'Cinzel',serif",fontSize:16,color:T.guld,marginBottom:4,textAlign:"center"}}>
        {typeof roll.rollnamn==="function"?roll.rollnamn(kon||""):roll.rollnamn}
      </div>
      <p style={{fontSize:12,color:T.textDim,textAlign:"center",marginBottom:16}}>Scanna QR-koden med din telefon för att spara din roll</p>
      <div style={{background:"#1a1510",border:`1px solid ${T.kant}`,borderRadius:8,padding:"16px",marginBottom:16,display:"flex",justifyContent:"center"}}>
        <QRKod url={url}/>
      </div>
      <p style={{fontSize:11,color:T.textDim,textAlign:"center",marginBottom:4}}>Eller öppna länken:</p>
      <div style={{background:"#0a0a00",border:`1px solid ${T.kant}`,borderRadius:3,padding:"8px",marginBottom:20,fontSize:10,color:T.guld,wordBreak:"break-all",textAlign:"center"}}>{url}</div>
      <button style={{...BtnH,width:"100%"}} onClick={nasta}>Nästa spelare →</button>
    </div>;
  }
  if(avslojar&&roll)return <RollKort roll={roll} onBekrafta={()=>setBekr(true)} spelarKon={kon} spelarAlder={alder}/>;
  if(alderKlar&&roll)return <div style={C}>
    <div style={{fontSize:64,marginBottom:10}}>{roll.icon}</div>
    <p style={{fontSize:13,color:T.textDim,fontStyle:"italic",marginBottom:24}}>Håll skärmen borta från de andra.</p>
    <button style={BtnH} onClick={()=>setAvslojar(true)}>Visa min roll →</button>
  </div>;
  return <div style={C}>
    <div style={{fontSize:11,letterSpacing:8,color:T.guldDim,marginBottom:14,fontFamily:"monospace"}}>ᚱ ᚩ ᛚ ᛚ</div>
    <p style={{fontSize:15,color:T.text,marginBottom:4}}>Spelare {idx+1} av {fordel.length}</p>
    <p style={{fontSize:13,color:T.textDim,fontStyle:"italic",marginBottom:28}}>Räck telefonen till nästa spelare</p>
    <div style={{...Kort,width:"100%",maxWidth:320}}>
      <div style={{...Lbl,textAlign:"center"}}>Hur gammal är du?</div>
      <input type="number" min="1" max="120" value={alder} onChange={e=>setAlder(e.target.value)} placeholder="Ange ålder..." style={{width:"100%",background:"#0a0a00",border:`1px solid ${T.kant}`,borderRadius:3,padding:"12px",color:T.text,fontSize:18,fontFamily:"'Cinzel',serif",textAlign:"center",marginBottom:14}} autoFocus/>
      <div style={{...Lbl,textAlign:"center",marginBottom:8}}>Vad är ditt kön?</div>
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        {[["tjej","👧 Tjej"],["kille","👦 Kille"],["annat","🌟 Annat"]].map(([k,label])=><button key={k} style={{flex:1,background:kon===k?T.guldDim:"#0a0a00",border:`1px solid ${kon===k?T.guld:T.kant}`,color:kon===k?T.bg:T.textDim,borderRadius:3,padding:"10px 4px",fontSize:11,cursor:"pointer",fontFamily:"'Cinzel',serif"}} onClick={()=>setKon(k)}>{label}</button>)}
      </div>
      <button style={{...BtnH,width:"100%",opacity:(!alder||!kon)?0.5:1}} onClick={bekraftaAlder} disabled={!alder||!kon}>Dra min roll →</button>
    </div>
  </div>;
}

// ─── GUIDE-VY ─────────────────────────────────────────────────────────────────
function GuideVy({setVy}){
  return <div style={Sida}>
    <button style={Tillbaka} onClick={()=>setVy("start")}>← Tillbaka</button>
    <h2 style={SRubrik}>📜 Roller & Relationer</h2>
    <div style={{...Kort,borderColor:"#9999cc44",background:"#080814",marginBottom:12}}>
      <div style={{...Lbl,color:"#9999cc"}}>🕸 Relationsnät</div>
      <p style={{fontSize:12,color:T.textDim,lineHeight:1.9,margin:0}}>
        Mästersmeden → misstänker → Den Resande<br/>
        Den Resande → hemlighet om → Högprästen<br/>
        Kloka Gumman/Gubben ↔ konflikt ↔ Runläsaren<br/>
        Örtmästaren ↔ skuld ↔ Mästersmeden<br/>
        Barnrollerna → ser allt vuxna missar
      </p>
    </div>
    {ROLLER_MASTER.map(r=>{
      const ac=r.barnroll?"#ffb3c6":r.gilleColor||T.guld;
      const rollnamn=typeof r.rollnamn==="function"?r.rollnamn(""):r.rollnamn;
      return <div key={r.id} style={{...Kort,marginBottom:8,borderColor:ac+"44"}}>
        <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:4}}>
          <span style={{fontSize:22}}>{r.icon}</span>
          <div>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:13,color:ac}}>{rollnamn}{r.barnroll?" 🌸":""}</div>
            <div style={{fontSize:11,color:T.textDim}}>{r.gille}</div>
          </div>
        </div>
        <p style={{fontSize:12,color:T.textDim,margin:0,lineHeight:1.5}}>{r.karaktar}</p>
      </div>;
    })}
  </div>;
}

// ─── APP ──────────────────────────────────────────────────────────────────────
// ─── QR-KOD KOMPONENT ────────────────────────────────────────────────────────
function QRKod({url}){
  const encoded=encodeURIComponent(url);
  const qrUrl=`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encoded}&bgcolor=0d0b08&color=c9a84c&margin=10`;
  return <div style={{textAlign:"center"}}>
    <img src={qrUrl} alt="QR-kod" style={{width:220,height:220,borderRadius:4,border:`1px solid ${T.kant}`}} onError={e=>{e.target.style.display="none";e.target.nextSibling.style.display="block";}}/>
    <div style={{display:"none",fontSize:10,color:T.textDim,wordBreak:"break-all",padding:"8px",marginTop:8,background:T.papper,borderRadius:4,border:`1px solid ${T.kant}`}}>{url}</div>
  </div>;
}


// ─── SPELARVY (öppnas via QR-länk) ───────────────────────────────────────────
function SpelarVy({rollData}){
  const [tab,setTab]=useState(0);
  if(!rollData)return <div style={{...Sida,textAlign:"center",paddingTop:60}}>
    <div style={{fontSize:40,marginBottom:16}}>🌑</div>
    <p style={{color:T.textDim,fontSize:14}}>Ingen roll hittad.<br/>Be spelledaren skicka din länk igen.</p>
  </div>;

  const roll=rollData;
  const ac=roll.barnroll?"#ffb3c6":roll.gilleColor||T.guld;
  const gilleData=GILLESUPPDRAG[roll.gille];
  const rollnamn=roll.rollnamn||"";

  const tabs=["🎭 Min roll","🌿 Mitt gille","📜 Regler"];

  return <div style={{minHeight:"100vh",background:T.bg,color:T.text,fontFamily:"'IM Fell English',Georgia,serif",paddingBottom:60}}>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=IM+Fell+English:ital@0;1&display=swap');*{box-sizing:border-box}body{margin:0;background:#0d0b08}`}</style>
    
    {/* Header */}
    <div style={{background:"#0a0800",borderBottom:`1px solid ${T.kant}`,padding:"10px 16px",textAlign:"center"}}>
      <div style={{fontSize:9,letterSpacing:4,color:T.guldDim,fontFamily:"monospace"}}>MIDSOMMARBLOT · AUSÅS BLOTÄNGAR</div>
    </div>

    {/* Tab-navigation */}
    <div style={{display:"flex",background:T.papper,borderBottom:`1px solid ${T.kant}`}}>
      {tabs.map((t,i)=><button key={t} style={{flex:1,padding:"10px 4px",border:"none",borderBottom:tab===i?`2px solid ${ac}`:"2px solid transparent",background:"transparent",color:tab===i?ac:T.textDim,fontSize:11,fontFamily:"'Cinzel',serif",cursor:"pointer",letterSpacing:0.5}} onClick={()=>setTab(i)}>{t}</button>)}
    </div>

    {/* MIN ROLL */}
    {tab===0&&<RollKort roll={roll} onBekrafta={null} spelarKon={roll.spelarKon} spelarAlder={roll.spelarAlder} visaBekrafta={false}/>}

    {/* MITT GILLE */}
    {tab===1&&<div style={Sida}>
      <div style={{textAlign:"center",padding:"20px 0 16px"}}>
        <div style={{fontSize:11,color:ac,letterSpacing:3,fontFamily:"'Cinzel',serif",marginBottom:4}}>{roll.gille?.toUpperCase()}</div>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:22,color:ac,marginBottom:4}}>{roll.gille==="ortagillet"?"🌿 Örtagillet":roll.gille==="smederna"?"⚒ Smedjans Brödraskap":roll.gille==="månkyrkan"?"☽ Månkyrkan":"🎲 Fri"}</div>
      </div>
      {gilleData&&<>
        <div style={Kort}>
          <div style={{...Lbl,color:ac}}>{gilleData.rubrik}</div>
          {gilleData.gemensamt.map((u,i)=><div key={i} style={{display:"flex",gap:8,padding:"6px 0",borderBottom:`1px solid ${T.kant2}`}}>
            <span style={{color:ac}}>•</span>
            <span style={{fontSize:13,color:T.text,lineHeight:1.5}}>{u}</span>
          </div>)}
          <div style={{marginTop:10,padding:"8px",background:ac+"15",borderRadius:3,fontSize:12,color:ac,fontStyle:"italic"}}>{gilleData.bonus}</div>
        </div>
      </>}
      <div style={Kort}>
        <div style={{...Lbl,color:ac}}>Ditt kännetecken</div>
        <p style={{fontSize:13,color:T.text,margin:0}}>
          {roll.gille==="ortagillet"?"🌸 Blomma bakom höger öra":
           roll.gille==="smederna"?"🪨 Liten sten i vänster hand":
           roll.gille==="månkyrkan"?"🤍 Vitt snöre om vänster handled":
           "🎲 Inget – du tillhör inget gille"}
        </p>
      </div>
      <div style={{...Kort,borderColor:"#cc333344",background:"#120808"}}>
        <div style={{...Lbl,color:"#cc6666"}}>🩸 Kultens kännetecken</div>
        <p style={{fontSize:12,color:"#cc9999",lineHeight:1.6,margin:0}}>Kultmedlemmar bär INGET kännetecken. De döljer sig bland er.<br/><br/>Om någon säger <em>"Mörkret hälsar"</em> – svara <em>"och natten är lång"</em> om du är kultmärkt.</p>
      </div>
    </div>}

    {/* REGLER */}
    {tab===2&&<RegelVy setVy={()=>{}}/>}

// ─── REGELVY ──────────────────────────────────────────────────────────────────
const REGLER = [
  {titel:"Spelets syfte",icon:"⚖️",farg:"#c9a84c",text:"Midsommarblot är ett socialt spel om lögner, allianser och avslöjanden.\n\nAlla tillhör ett gille – Örtagillet, Smederna eller Månkyrkan. Men bland er gömmer sig Mörkblotets Kult.\n\nByborna försöker avslöja Kultledaren. Kulten försöker överleva oavslöjad.\n\nDu tävlar på tre nivåer: individuellt, med ditt gille och på din sida (By vs Kult)."},
  {titel:"Kvällens faser",icon:"🕐",farg:"#c9a84c",text:"FAS 1 – ALLIANSER\nMingla, bilda allianser, dela hemligheter, genomför uppdrag. Danser uppstår spontant.\n\nFAS 2 – TINGET\nFormella anklagelser framförs. Den anklagade försvarar sig. Inga roller avslöjas – Tinget skapar misstanke.\n\nFAS 3 – RITUALEN & DANSEN\nGilledanser genomförs. Kultledaren försöker fullborda ritualen vid stången.\n\nFAS 4 – DOMEN\nAlla pekar på den de tror är Kultledaren. Rollerna avslöjas dramatiskt."},
  {titel:"Viktiga begrepp",icon:"📖",farg:"#c9a84c",text:"VÄGAREN – Spelets domare. Den enda som vet alla rollernas sanna identitet.\n\nALLIANS – Formell överenskommelse registrerad hos Vägaren. Allierade bör rösta likadant vid Domen.\n\nANKLAGELSE – Formell beskyllning vid Tinget. Varje roll har en förskriven anklagelse. Ger poäng om den leder rätt.\n\nFÖRMÅGA – Varje karaktär har två unika förmågor. Aktiveras genom att berätta för Vägaren.\n\nINLÖSEN – Poäng byts mot fördelar hos Vägaren: ledtrådar, extra röster eller immunitet.\n\nKEDJOR – Hemliga informationskedjor. Säg rätt fras, få rätt svar, dela en pusselbit om ritualen."},
  {titel:"Dansen",icon:"🎵",farg:"#c9a84c",text:"Dans är en naturlig del av midsommarfirandet – men varje dans är ett uppdrag.\n\nDitt rollkort innehåller hemliga dansdirektiv för varje låt. Dessa är unika för din karaktär och ger poäng.\n\nGILLEDANSER är gemensamma uppdrag där hela gillet dansar på ett specifikt sätt. Lyckas alla bidrar det till gillebonusen.\n\nVar uppmärksam – andra observerar dig lika mycket som du observerar dem."},
  {titel:"Poängsystemet",icon:"💰",farg:"#c9a84c",text:"INDIVIDUELLT – Uppdrag, förmågor, allianser, dans.\n\nGILLEBONUS +30p – Om hela gillet slutför sina uppdrag.\n\nSIDBONUS – Byn vinner: +30p · Kulten vinner: +50p\n\nDOMSPOÄNG – Rätt på kultmärkt: +20p · Rätt på Kultledaren: +40p · Fel: -5p\n\nLEDTRÅDAR – Lös in poäng hos Vägaren mot information om Kultledaren. Tre nivåer – ju dyrare, ju mer avslöjande."},
  {titel:"Domen",icon:"🗳️",farg:"#c9a84c",text:"Domen är kvällens dramatiska klimax.\n\nVägaren räknar ned: TRE – TVÅ – ETT – alla pekar samtidigt på den de tror är Kultledaren.\n\nAvslöjandet sker i ordning:\n1. Kultmärkta avslöjas\n2. Kultledaren avslöjas sist – dramatiskt\n\nOm Kultledaren pekas ut har Byn vunnit.\nOm Kultledaren överlever har Kulten vunnit."},
  {titel:"Vinstvillkor",icon:"🏆",farg:"#c9a84c",text:"BYBORNA VINNER OM Kultledaren pekas ut vid Domen.\n\nKULTEN VINNER OM Kultledaren överlever oavslöjad – eller om Mörkblotets ritual fullbordas.\n\nOAVGJORT om kultmärkta avslöjas men Kultledaren klarar sig. Vägaren avgör.\n\nKom ihåg – du tävlar också individuellt! Även om din sida förlorar kan du vinna som individ."},
  {titel:"Allmänna regler",icon:"📜",farg:"#c9a84c",text:"• Din roll är hemlig – visa aldrig ditt rollkort\n• Lögner är tillåtna och uppmuntrade\n• Förmågor aktiveras genom Vägaren\n• Allianser registreras alltid hos Vägaren\n• Barnroller har förenklade uppdrag\n• Fråga Vägaren om du är osäker\n• Ha kul – det är midsommar!"},
];

function RegelVy({setVy}){
  const [open,setOpen]=useState({});
  const toggle=(i)=>setOpen(prev=>({...prev,[i]:!prev[i]}));
  return <div style={Sida}>
    <button style={Tillbaka} onClick={()=>setVy("start")}>← Tillbaka</button>
    <h2 style={SRubrik}>📜 Spelregler</h2>
    <div style={{...Kort,borderColor:"#c9a84c44",background:"#0a0800",marginBottom:16,textAlign:"center"}}>
      <p style={{fontSize:13,color:TEXT,fontStyle:"italic",lineHeight:1.8,margin:0}}>
        Läs igenom reglerna innan kvällen börjar.<br/>
        Din hemliga roll får du via appen när kvällen startar.
      </p>
    </div>
    {REGLER.map((r,i)=><div key={i} style={{marginBottom:6}}>
      <button style={{width:"100%",background:open[i]?"#13100c":T.papper,border:`1px solid ${open[i]?"#c9a84c44":T.kant}`,borderRadius:open[i]?"4px 4px 0 0":"4px",padding:"12px 14px",fontSize:13,fontFamily:"'Cinzel',serif",cursor:"pointer",textAlign:"left",color:open[i]?T.guld:T.text,display:"flex",justifyContent:"space-between",alignItems:"center"}} onClick={()=>toggle(i)}>
        <span>{r.icon} {r.titel}</span>
        <span style={{fontSize:10,color:T.textDim}}>{open[i]?"▲":"▼"}</span>
      </button>
      {open[i]&&<div style={{background:"#0d0b08",border:`1px solid #c9a84c44`,borderTop:"none",borderRadius:"0 0 4px 4px",padding:"14px"}}>
        <p style={{fontSize:12,color:T.text,lineHeight:1.9,margin:0,whiteSpace:"pre-line"}}>{r.text}</p>
      </div>}
    </div>)}
    <div style={{height:32}}/>
  </div>;
}


export default function App(){
  // Kolla om vi är i spelarläge (QR-länk)
  const hash=window.location.hash||"";
  if(hash.startsWith("#roll=")&&hash.length>6){
    try{
      const enkodad=hash.slice(6);
      const mini=JSON.parse(atob(enkodad));
      if(mini&&mini.id){
        // Slå upp full rolldata från ROLLER_MASTER
        const basRoll=ROLLER_MASTER.find(r=>r.id===mini.id);
        if(basRoll){
          const kultmarken_alla=[
            {id:"mk1",namn:"Skuggviskaren",direktiv:"Skydda Runläsaren från anklagelse under Tinget.",hur:"Spela din byboroll fullt ut.",risk:"Om du avslöjas spelar du vidare som vanlig bybo."},
            {id:"mk2",namn:"Mörkrets Spegel",direktiv:"Håll folk borta från midsommarstången under dansen.",hur:"Skapa distraktioner naturligt.",risk:"Om du avslöjas spelar du vidare som vanlig bybo."},
            {id:"mk3",namn:"Tystnadens Väktare",direktiv:"Om Mästersmeden eller Örtmästaren verkar nära att avslöja något – avbryt dem.",hur:"Var social och råka avbryta folk lite för ofta.",risk:"Om du avslöjas spelar du vidare som vanlig bybo."},
          ];
          const rollData={
            ...basRoll,
            rollnamn:typeof basRoll.rollnamn==="function"?basRoll.rollnamn(mini.kon):basRoll.rollnamn,
            erKultledare:mini.erk===1,
            kultMarke:mini.km?kultmarken_alla.find(k=>k.id===mini.km)||null:null,
            spelarKon:mini.kon,
            spelarAlder:mini.alder,
          };
          return <SpelarVy rollData={rollData}/>;
        }
      }
    }catch(e){}
    return <SpelarVy rollData={null}/>;
  }

  const [vy,setVy]=useState("start");
  const [sTab,setSTab]=useState(0);
  const [antalBarn,setAntalBarn]=useState(2);
  const [fordel,setFordel]=useState([]);
  const [idx,setIdx]=useState(0);
  const [roll,setRoll]=useState(null);
  const [avslojar,setAvslojar]=useState(false);
  const [bekr,setBekr]=useState(false);
  const [alder,setAlder]=useState("");
  const [kon,setKon]=useState(null);
  const [alderKlar,setAlderKlar]=useState(false);
  const [spelare,setSpelare]=useState(()=>INITIAL_SPELARE.map(s=>({...s})));
  const [domAvslojad,setDomAvslojad]=useState(false);
  const [kontaktlista,setKontaktlista]=useState(()=>{
    try{const s=localStorage.getItem("mb_kontakter");if(s)return JSON.parse(s);}catch(e){}
    return Array.from({length:10},(_,i)=>({id:i+1,namn:"",kon:"tjej",alder:"",mail:"",telefon:""}));
  });
  useEffect(()=>{try{localStorage.setItem("mb_kontakter",JSON.stringify(kontaktlista));}catch(e){};},[kontaktlista]);

  function starta(){
    setFordel(blandaOchTilldela(antalBarn));
    setIdx(0);reset();setVy("drag");
  }
  function reset(){setRoll(null);setAvslojar(false);setBekr(false);setAlder("");setKon(null);setAlderKlar(false);}
  function bekraftaAlder(){
    const a=parseInt(alder);
    if(!alder||isNaN(a)||a<1||a>120||!kon)return;
    setAlderKlar(true);
    const r=fordel[idx];
    let tilldelad;
    if(a<10&&!r.barnroll){
      const barn=ROLLER_MASTER.filter(x=>x.barnroll).sort(()=>Math.random()-0.5);
      tilldelad={...barn[0],kultMarke:undefined,erKultledare:false};
    } else tilldelad=r;
    setRoll(tilldelad);
    setAvslojar(false);setBekr(false);
  }
  function nasta(){setIdx(i=>i+1);reset();}
  const klart=idx>=fordel.length&&fordel.length>0;

  const css=`@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=IM+Fell+English:ital@0;1&display=swap');*{box-sizing:border-box}body{margin:0;background:#0d0b08}button:active{opacity:.8}input:focus{outline:none;border-color:#c9a84c!important}`;

  return <div style={{minHeight:"100vh",background:T.bg,color:T.text,fontFamily:"'IM Fell English',Georgia,serif",paddingBottom:60}}>
    <style>{css}</style>
    {vy==="start"&&<StartVy setVy={setVy}/>}
    {vy==="spelledare"&&<SpelledarVy setVy={setVy} starta={starta} tab={sTab} setTab={setSTab} antalBarn={antalBarn} setAntalBarn={setAntalBarn} spelare={spelare} setSpelare={setSpelare} domAvslojad={domAvslojad} setDomAvslojad={setDomAvslojad} fordel={fordel}/>}
    {vy==="deltagare"&&<DeltagarVy setVy={setVy} kontaktlista={kontaktlista} setKontaktlista={setKontaktlista}/>}
    {vy==="drag"&&<DragVy fordel={fordel} idx={idx} roll={roll} avslojar={avslojar} bekr={bekr} klart={klart} alder={alder} setAlder={setAlder} kon={kon} setKon={setKon} alderKlar={alderKlar} bekraftaAlder={bekraftaAlder} setAvslojar={setAvslojar} setBekr={setBekr} nasta={nasta} setVy={setVy}/>}
    {vy==="guide"&&<GuideVy setVy={setVy}/>}
    {vy==="regler"&&<RegelVy setVy={setVy}/>}
    {vy==="poang"&&<PoangVy spelare={spelare} domAvslojad={domAvslojad} setDomAvslojad={setDomAvslojad} setVy={setVy}/>}
  </div>;
}
