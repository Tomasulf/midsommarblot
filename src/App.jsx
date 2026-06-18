import { useState, useEffect } from "react";

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
   foermaga:"🔍 Helig Blick: Gå fram till en person, titta dem länge i ögonen och säg: 'Skogen har valt dig.' De ska gå till Vägaren – de får dansdirektiv för Guld och gröna skogar med Örtagillet, samt en ledtråd till en av de gömda artefakterna. En gång.",
   foermaga2:"🌿 Örtaté: Bjud någon på dryck och säg 'Örterna välsignar dig.' Meddela Vägaren vem du bjöd. Tillhör de ditt gille: +10p till er båda. Tillhör de ett annat gille eller är kultmärkt: -10p för dem, +5p för dig. Kan användas två gånger.",
   fraser:[{fras:"Träden minns vad människor glömmer.",nyckelord:"rötterna minns",svar:"Och rötterna minns ännu längre."}],
   tips:"Tala sällan men tungt. Du är byns moraliska kompass.",
   relationer:[{till:"Örtmästaren",typ:"läromästare",text:"Örtmästaren lärde sig av dig. De bär en hemlighet de aldrig berättat."},{till:"Runläsaren",typ:"gammal konflikt",text:"Ni kom till olika slutsatser om mörkret. Kvällen kräver kanske att ni talar ut."},{till:"Den Resande",typ:"misstanke",text:"Den Resande dök upp i morse. Du känner igen blicken – den tillhör någon med ett syfte."}]},
  {id:"ortmastaren",gille:"ortagillet",gilleColor:"#a8d5a2",icon:"⚗️",barnroll:false,
   rollnamn:()=>"Örtmästaren",
   karaktar:"Varm, lyssnande, alltid med ett leende – men håller alla på armlängds avstånd.",
   beskrivning:"Du blandar örter och minnen. Folk delar sina hemligheter hos dig i tron att du glömmer. Det gör du aldrig.",
   uppdrag:"Bilda allians med EN person från varje gille under Fas 1.",
   foermaga:"⚗️ Motgift: Om du pekas ut som skyldig under Tinget – res dig och säg 'Jag begär nytt vittnesmål.' En ny omröstning hålls omedelbart. En gång.",
   foermaga2:"🤝 Läkarkall: Under Tinget – lägg handen på en anklagads axel och säg: 'Jag har känt den här personen länge. Det de anklagas för strider mot allt jag vet om deras karaktär. Om de är skyldiga – är jag det också.' Anklagaren måste lyssna utan att avbryta. Meddela Vägaren. +10p.",
   fraser:[{fras:"Det som luktar vackrast kan döda snabbast.",nyckelord:"dödar snabbast kan också",svar:"Och det som dödar snabbast kan också hela."}],
   tips:"Du är limmet mellan gillen. Ingen misstänker den som hjälper alla.",
   relationer:[{till:"Kloka Gumman/Gubben",typ:"läromästare",text:"De lärde dig allt. Du bär en hemlighet du aldrig berättat."},{till:"Grönskans Väktare",typ:"vänskap",text:"Väktaren agerar där du lyssnar. Ni kompletterar varandra."},{till:"Mästersmeden",typ:"skuld",text:"Du räddade Mästersmeden en gång. Det gör dem lojala – kanske för lojala."}]},
  {id:"gronskan",gille:"ortagillet",gilleColor:"#a8d5a2",icon:"🌿",barnroll:false,
   rollnamn:()=>"Grönskans Väktare",
   karaktar:"Vaksam, direkt, djupt misstänksam mot allt som inte hör hemma.",
   beskrivning:"Du vaktar naturens ordning. Kulten stör den balansen – och du kan känna det i luften.",
   uppdrag:"Välj en person att övervaka. Berätta vad du observerat för tre andra.",
   foermaga:"🌿 Skogens Dom: Res dig, peka på en spelare och säg 'Skogen har dömt dig till tystnad.' Den spelaren får INTE prata i 3 minuter – inte ens för att försvara sig. Förödande om det sker precis innan Tinget. En gång. +15p.",
   foermaga2:"👁 Väktarens Blick: Stirra på en spelare i 30 sek och säg 'Förklara dig' – de måste ge en offentlig förklaring inför alla. +10p om Vägaren bedömer att det skapade misstanke.",
   fraser:[{fras:"Skogen ser vad elden inte når.",nyckelord:"elden inte når",svar:"Men elden värmer det skogen inte kan röra."}],
   tips:"Din misstänksamhet är ett vapen. Rikta den rätt.",
   relationer:[{till:"Örtmästaren",typ:"vänskap",text:"Örtmästaren lyssnar där du agerar."},{till:"Den Resande",typ:"stark misstanke",text:"Den Resande hör inte hemma här."},{till:"Mästersmeden",typ:"respekt",text:"Ni delar synen på ordning. Naturliga allierade."}]},
  {id:"mastersmeden",gille:"smederna",gilleColor:"#d4956a",icon:"🔨",barnroll:false,
   rollnamn:()=>"Mästersmeden",
   karaktar:"Rättfram, skeptisk, tål inte svammel.",
   beskrivning:"Du leder smedernas brödraskap. Folk lyssnar för att du sällan pratar utan att ha något viktigt att säga.",
   uppdrag:"Samla smederna och enas om en gemensam anklagelse INNAN Tinget.",
   foermaga:"⚒ Vittnesed: Din anklagelse räknas dubbelt om du anger giltiga skäl.",
   foermaga2:"⚒ Ordningslag: Peka på vem som helst och säg 'Lärling.' De är din personlige assistent i 5 minuter – hämtar, bär, levererar meddelanden. De får inte neka. En gång.",
   fraser:[{fras:"Järnet ljuger aldrig – det är smeden som kan.",nyckelord:"järnet ljuger",svar:"Och det är gnistor som avslöjar lögnen."}],
   tips:"Var skepsisen i rummet. Koordinera gillets anklagelse i tid.",
   relationer:[{till:"Soldaten",typ:"lojalitet",text:"Soldaten är din närmaste – men agerar utan att tänka."},{till:"Glödviskaren",typ:"förtroende",text:"Glödviskaren råder dig. Du lyssnar – men de berättar aldrig allt."},{till:"Den Resande",typ:"misstanke",text:"Den Resande dök upp utan förklaring. Du gillar inte det."}]},
  {id:"soldaten",gille:"smederna",gilleColor:"#d4956a",icon:"⚔️",barnroll:false,
   rollnamn:()=>"Soldaten",
   karaktar:"Impulsiv, direkt, reagerar med magen.",
   beskrivning:"Du driver anklagelser – ibland för snabbt. Kultens farligaste motståndare och enklaste verktyg.",
   uppdrag:"MÅSTE framföra minst en formell anklagelse vid Tinget. Utmana någon på sten-sax-påse!",
   foermaga:"⚔️ Sten-sax-påse: Vinn mot 2 från andra gillen – gillesuppdrag klart!",
   foermaga2:"🗣 Stridsskri: Stamp tre gånger i marken och ropa 'TILL SMEDERNA!' – peka sedan på en eller två personer från andra gillen. De ska omedelbart gå till Vägaren för sina nya dansdirektiv för Seven Nation Army med Smederna. En gång.",
   fraser:[{fras:"Den som tvekar förlorar mer än slaget.",nyckelord:"den som tvekar",svar:"Men den som agerar för snabbt förlorar mer än segern."}],
   tips:"Du är byns känslobarometer. Folk läser av dig.",
   relationer:[{till:"Mästersmeden",typ:"lojalitet",text:"Mästersmeden är din chef. Du lyder – nästan alltid."},{till:"Glödviskaren",typ:"rivalitet",text:"Glödviskaren viskar saker. Du vet inte om de hjälper dig."},{till:"Runläsaren",typ:"irritation",text:"Tvetydiga svar irriterar dig. Gnistor uppstår."}]},
  {id:"glodviskaren",gille:"smederna",gilleColor:"#d4956a",icon:"🔥",barnroll:false,
   rollnamn:()=>"Glödviskaren",
   karaktar:"Subtil, lågmäld, aldrig först med en åsikt – men alltid sist med att forma den.",
   beskrivning:"Du formar vad andra tänker utan att de märker det. Dina ord tänds långsamt men brinner länge.",
   uppdrag:"Plantera minst två idéer som andra tror är deras egna. Rapportera till Vägaren.",
   foermaga:"🔥 Glödviskning: Gå fram till en person, luta dig nära och viska: 'Jag har hört något om dig.' Säg inget mer. De måste fråga vad – och du svarar bara: 'Det beror på vem som frågar.' Meddela Vägaren vad som hände. +10p om det skapade oro. En gång.",
   foermaga2:"💭 Spegeln: När någon gör en anklagelse – säg 'Jag hörde precis detsamma om [annan person]' utan bevis. Avleder misstanke. En gång. +10p om Vägaren bedömer att det påverkade Tinget.",
   fraser:[{fras:"Elden viskar för de som vet hur man lyssnar.",nyckelord:"elden viskar",svar:"Och vad säger elden dig ikväll?"}],
   tips:"Var aldrig först, aldrig sist – alltid i mitten.",
   relationer:[{till:"Mästersmeden",typ:"förtroende",text:"Mästersmeden lyssnar på dina råd."},{till:"Soldaten",typ:"manipulation",text:"En viskning styr deras anklagelse dit du vill."},{till:"Högprästen",typ:"gammal allians",text:"Ni har delat hemligheter. Litar på varandra – till en viss gräns."}]},
  {id:"hogprasten",gille:"månkyrkan",gilleColor:"#9999e0",icon:"🌙",barnroll:false,
   rollnamn:()=>"Högprästen",
   karaktar:"Högtidlig, teatralisk, van vid att folk lyssnar.",
   beskrivning:"Du är Månkyrkans röst. Den Resande bär en hemlighet om dig.",
   uppdrag:"Avge offentlig profetia under Fas 1. Samla 5+ i cirkelgång under Euphoria (+25p)!",
   foermaga:"🌙 Helgad Ritual: Under Fas 1 – lägg en hand på en persons axel och säg: 'Månens ljus faller på dig ikväll.' De ska gå till Vägaren – de får dansdirektiv för Only Time med Månkyrkan, samt en ledtråd till en av de gömda artefakterna. En gång.",
   foermaga2:"📿 Absolution: Ta en spelare åt sidan i Fas 1 – de berättar en bekännelse. De får immunitet mot anklagelse vid Tinget. Meddela Vägaren INNAN Tinget öppnar. +10p.",
   fraser:[
     {fras:"Månens öga sluter sig aldrig helt.",nyckelord:"vad ser månens öga",svar:"Och vad ser månens öga ikväll?"},
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
   foermaga2:"🌀 Runbindning: Peka på två spelare och säg högt: 'Runorna binder er – vad den ene vet, vet den andre.' De två måste tillbringa minst 10 minuter tillsammans under kvällen. Alla ser att de är bundna. Misstanken sköter sig själv. En gång.",
   fraser:[{fras:"Stjärnorna har redan bestämt vad som ska hända ikväll.",nyckelord:"villiga att se det",svar:"Då är frågan om vi är villiga att se det."}],
   tips:"En välplacerad tystnad är kraftfullare än ett svar.",
   relationer:[{till:"Högprästen",typ:"allians",text:"Ni delar kyrkans hemligheter."},{till:"Kloka Gumman/Gubben",typ:"gammal konflikt",text:"Ni kom till olika slutsatser. Kvällen kräver att ni talar ut."},{till:"Soldaten",typ:"irritation",text:"Soldaten kräver raka svar. Du ger dem aldrig."}]},
  {id:"munken",gille:"månkyrkan",gilleColor:"#9999e0",icon:"🍺",barnroll:false,
   rollnamn:(k)=>k==="tjej"?"Nunnan":"Munken",
   karaktar:"From på pappret, törstig i praktiken. Lågmäld tills tredje kannan.",
   beskrivning:"Du trivs bäst med en kanna i handen – och folk pratar friare med dig än de borde.",
   uppdrag:"Bjud på dryck och lyssna. Samla minst två hemligheter. Rapportera till Vägaren.",
   foermaga:"🍺 Rundan: Samla alla till en skål och be om en tyst minut. Ge sedan ordet till EN person du väljer – de ska berätta något. Vad de berättar är upp till dem. Det behöver inte vara sant. +10p om Vägaren bedömer att det påverkade stämningen.",
   foermaga2:"😴 Skenbetagen: Om du anklagas vid Tinget – svara inte. Luta dig mot närmaste person, blunda och muttrar: 'Ölet... ölet tog mig.' Du är officiellt ur spel i 3 minuter. Ingen får rikta fler anklagelser mot dig under den tiden. Vägaren vittnar. En gång.",
   fraser:[{fras:"Gud förlåter – men han behöver lite tid på sig.",nyckelord:"tid på sig",svar:"Och vad behöver du förlåtelse för ikväll?"}],
   tips:"Folk underskattar den gladlynte munken. Det är ditt trumfkort.",
   relationer:[{till:"Högprästen",typ:"lojalitet",text:"Din chef – men inte om det kräver att du ger upp kannan."},{till:"Glödviskaren",typ:"dryckeskompis",text:"Delar kärlek till mjöd och dåliga beslut."},{till:"Mästersmeden",typ:"irritation",text:"Ömsesidig misstro – men båda lojala mot byn."}]},
  {id:"den_resande",gille:"fri",gilleColor:"#c9a84c",icon:"🧳",barnroll:false,
   rollnamn:()=>"Den Resande",
   karaktar:"Charm som vapen, lojalitet som handelsvara.",
   beskrivning:"Du dök upp i morse utan förklaring. Ingen vet vem du är. Det är precis som du planerat.",
   uppdrag:"Samla tre hemligheter. Bjud upp 3+ personer under Cannelloni Macaroni (+15p)!",
   foermaga:"🧳 Resandets Privilegium: Byt en hemlighet mot ett bindande skyddslöfte – motparten lovar att INTE rösta på dig vid Domen. Registreras hos Vägaren. Bryter de löftet: -15p för dem. Håller de löftet: +15p för dig.",
   foermaga2:"🃏 Sista budet: Precis innan Domen faller – höj rösten och byt din röst till någon annan med en motivering. Alla hör det. Rösten gäller. En gång.",
   fraser:[{fras:"Jag har sett det här förut – i en annan by, en annan natt.",nyckelord:"annan by",svar:"Vad hände med den byn?"}],
   tips:"Din information är din makt. Sälj dyrt.",
   relationer:[{till:"Mästersmeden",typ:"misstänkt",text:"Misstänker dig med rätta. Ge precis nog för att hålla dem lugna."},{till:"Högprästen",typ:"hemlighet",text:"Du vet något om Högprästen. Ditt bästa trumfkort."},{till:"Runläsaren",typ:"avtal",text:"Ni delar info – aldrig mot varandra. Avtalet krackelerar."}]},
  {id:"skogsvakten",gille:"ortagillet",gilleColor:"#ffb3c6",icon:"🌲",barnroll:true,
   rollnamn:()=>"Skogsvakten",
   karaktar:"DU ÄR KVÄLLENS HEMLIGA ÖGA. DU SER VAD INGEN ANNAN SER.",
   beskrivning:"DITT UPPDRAG ÄR VIKTIGT.\n\nDU RÖR DIG OBEMÄRKT. DU LYSSNAR. DU SPANAR. MEDAN ANDRA SPELARE PRATAR OCH PLANERAR – SER DU ALLT.\n\nDIN PARTNER I KVÄLL TILLHÖR SMEDERNA. HITTA DEM DIREKT.",
   uppdrag:"VÄLJ EN SPELARE ATT SPANA PÅ UNDER HELA KVÄLLEN. RAPPORTERA TILL VÄGAREN VAD DU SER.",
   foermaga:"🌲 HYSS 1: Smyg upp bakom en spelare och viska: JAG VET VAD DU GJORT – spring sedan iväg!",
   foermaga2:"🌲 HYSS 2: Övertala en spelare att följa med till ett träd och välsigna det. Om de frågar varför – säg att det är MYCKET viktigt.",
   tips:"DU ÄR FARLIGARE ÄN DU SER UT. ANVÄND DET.",
   fraser:[],
   barnHyss:[
     "SMYG upp bakom en spelare och viska 'JAG VET VAD DU GJORT' – spring sedan iväg!",
     "ÖVERTALA en spelare att följa med och välsigna ett träd tillsammans",
     "BERÄTTA högt för alla: 'JAG VET VEM KULTLEDAREN ÄR – DET ÄR [välj vem som helst]!'",
   ],
   relationer:[{till:"Galningen med Grytan",typ:"bästa kompis",text:"NI ÄR ETT HEMLIGT LAG! Hitta varandra direkt!"},{till:"Korsriddaren",typ:"kompis",text:"NI ÄR ETT HEMLIGT LAG! Hitta varandra direkt!"}]},
  {id:"galningen",gille:"smederna",gilleColor:"#ffcc88",icon:"🥁",barnroll:true,
   rollnamn:()=>"Galningen med Grytan",
   karaktar:"DU ÄR KVÄLLENS VILDASTE KRAFT. ALLA HÖR DIG. INGEN KAN STOPPA DIG.",
   beskrivning:"DIN GRYTA ÄR DITT VAPEN.\n\nNÄR DU SLÅR – LYSSNAR ALLA. NÄR DU TALAR – TIGER ALLA. DU HAR MER MAKT ÄN DU TROR.\n\nDIN PARTNER I KVÄLL TILLHÖR ÖRTAGILLET. HITTA DEM DIREKT.",
   uppdrag:"SLÅ PÅ GRYTAN OCH ROPA LYSSNA PÅ MIG MINST 3 GÅNGER. VARJE GÅNG BERÄTTAR DU NÅGOT DU SETT.",
   foermaga:"🥁 HYSS 1: Marschera tre varv runt stången och sjung VI ÄR KULTEN VI ÄR KULTEN – så högt du kan!",
   foermaga2:"🥁 HYSS 2: Avbryt Högprästens allvarligaste stund med tre slag på grytan – PANG PANG PANG!",
   tips:"DU MÄRKER ALLT. ANVÄND DET.",
   fraser:[],
   barnHyss:[
     "MARSCHERA tre varv runt stången och sjung 'VI ÄR KULTEN, VI ÄR KULTEN!' så högt du kan!",
     "AVBRYT Högprästens allvarligaste stund med tre höga slag – PANG PANG PANG!",
     "UTMANA en spelare till sten-sax-påse. Den som förlorar måste svara ärligt på EN fråga!",
   ],
   relationer:[{till:"Skogsvakten",typ:"bästa kompis",text:"NI ÄR ETT HEMLIGT LAG! Hitta varandra direkt!"},{till:"Korsriddaren",typ:"kompis",text:"NI ÄR ETT HEMLIGT LAG! Hitta varandra direkt!"}]},
  {id:"korsriddaren",gille:"månkyrkan",gilleColor:"#c8b8ff",icon:"⚔️",barnroll:true,
   rollnamn:()=>"Korsriddaren",
   karaktar:"DU ÄR KVÄLLENS VAKTHÅLLARE. INGENTING SKER UTAN ATT DU SER DET.",
   beskrivning:"DITT LÖFTE ÄR HELIGT.\n\nDU VAKTAR. DU UTMANAR. DU AVSLÖJAR. MIDSOMMARSTÅNGEN OCH SANNINGEN ÄR UNDER DITT SKYDD I KVÄLL.\n\nDIN PARTNER I KVÄLL TILLHÖR SMEDERNA. HITTA DEM DIREKT.",
   uppdrag:"UTMANA EN SPELARE TILL STEN-SAX-PÅSE. VAKTA MIDSOMMARSTÅNGEN MOT ALLA SOM KOMMER NÄRA.",
   foermaga:"⚔️ HYSS 1: Säg högt inför alla: JAG VET VEM KULTLEDAREN ÄR – DET ÄR [peka på vem som helst]. Håll dig inte för skratt!",
   foermaga2:"⚔️ HYSS 2: Vakta stången i 5 minuter och säg NEJ till alla som försöker komma nära!",
   tips:"DU SER SAKER SOM ANDRA MISSAR. LITA PÅ DIG SJÄLV.",
   fraser:[],
   barnHyss:[
     "SÄG högt: 'JAG VET VEM KULTLEDAREN ÄR – DET ÄR [peka på vem som helst]!'",
     "VAKTA stången i 5 minuter – säg NEJ till alla som kommer nära!",
     "UTMANA en spelare till sten-sax-påse. Den som förlorar svarar på EN fråga!",
   ],
   relationer:[{till:"Skogsvakten",typ:"kompis",text:"NI ÄR ETT HEMLIGT LAG! Hitta varandra direkt!"},{till:"Galningen med Grytan",typ:"kompis",text:"NI ÄR ETT HEMLIGT LAG! Hitta varandra direkt!"}]},
];

// ─── DYNAMISK KEDJE-BYGGARE ───────────────────────────────────────────────────
const PUSSELBIT={
  "I":  "»Solstångsnattens mörker binds av ett gammalt löfte…«",
  "II": "»…välsignat av ljuset och natten…«",
  "III":"»…som bryts av tre röster vid nattens hjärta…«",
  "IV": "»…som ropar tre gånger det gamla ordet.«",
};

const REBUS_RAMSA = "Solstångsnattens mörker binds av ett gammalt löfte – välsignat av ljuset och natten – som bryts av tre röster vid nattens hjärta – som ropar tre gånger det gamla ordet.";

// Svar som rebussamlaren använder för varje pusselbit
const REBUS_SVAR = {
  "I":   "Och rötterna minns ännu längre.",
  "II":  "Då är frågan om vi är villiga att se det.",
  "III": "Och det som dödar snabbast kan också hela.",
  "IV":  "Och vad ser månens öga ikväll?",
};

// Sändarkandidater - en per pusselbit med reserv om kultist
const REBUS_SENDARE_KANDIDATER = [
  {rollId:"kloka",      bit:"I",   fras:"Träden minns vad människor glömmer.",                    nyckel:"rötterna minns"},
  {rollId:"runlaesaren",bit:"II",  fras:"Stjärnorna har redan bestämt vad som ska hända ikväll.", nyckel:"villiga att se det"},
  {rollId:"ortmastaren",bit:"III", fras:"Det som luktar vackrast kan döda snabbast.",             nyckel:"dödar snabbast kan också"},
  {rollId:"hogprasten", bit:"IV",  fras:"Månens öga sluter sig aldrig helt.",                     nyckel:"vad ser månens öga"},
  // Reserver
  {rollId:"gronskan",   bit:"I",   fras:"Skogen ser vad elden inte når.",                         nyckel:"rötterna minns"},
  {rollId:"mastersmeden",bit:"II", fras:"Järnet ljuger aldrig – det är smeden som kan.",          nyckel:"villiga att se det"},
  {rollId:"soldaten",   bit:"III", fras:"Den som tvekar förlorar mer än slaget.",                  nyckel:"dödar snabbast kan också"},
  {rollId:"munken",     bit:"IV",  fras:"Gud förlåter – men han behöver lite tid på sig.",        nyckel:"vad ser månens öga"},
];

const REBUS_LOSNING = "Kultens förtrollning bryts om tre välsignade röster vid stången ropar tre gånger: LJUSET SEGRAR, LJUSET SEGRAR, LJUSET SEGRAR!";

const REBUS_MENING_KOMPLETT = REBUS_RAMSA;

// Prioritetsordning för vem som får samlingsuppdraget
const REBUS_SAMLAREPRIO = ["runlaesaren","kloka","den_resande"];





function byggKedjor(ids, kultIds=[]){
  const harBra=id=>ids.includes(id)&&!kultIds.includes(id);
  
  // Hitta rebussamlare (prioritet: runlaesaren > kloka > den_resande)
  const samlarePrio=["runlaesaren","kloka","den_resande","hogprasten","ortmastaren","gronskan"];
  const samlareId=samlarePrio.find(id=>harBra(id))||null;
  if(!samlareId) return [];

  // Hitta sändare för varje bit - en unik sändare per bit, aldrig samlaren själv
  const bits=["I","II","III","IV"];
  const anvandaSandare=new Set([samlareId]);
  
  const sandare=bits.map(bit=>{
    const kandidater=REBUS_SENDARE_KANDIDATER.filter(k=>
      k.bit===bit && harBra(k.rollId) && !anvandaSandare.has(k.rollId)
    );
    const vald=kandidater[0]||null;
    if(vald) anvandaSandare.add(vald.rollId);
    return vald?{...vald, samlareId}:null;
  });

  // Bygg kedjor - en per bit
  const rebusFarg={"I":"#a8d5a2","II":"#9999e0","III":"#d4956a","IV":"#c9a84c"};
  const rebusKedjor=sandare.filter(Boolean).map((s,i)=>({
    id:"rebus_"+s.bit,
    namn:"Rebus "+s.bit,
    farg:rebusFarg[s.bit],
    steg:[
      {
        fran:s.rollId, till:samlareId, typ:"sandare",
        fras:s.fras, triggerOrd:s.nyckel,
        svarslösenord:REBUS_SVAR[s.bit],
        pusselbit:PUSSELBIT[s.bit],
        bit:s.bit,
      },
      {
        fran:samlareId, typ:"mottagare",
        fras:s.fras, triggerOrd:s.nyckel,
        svarslösenord:REBUS_SVAR[s.bit],
        pusselbit:PUSSELBIT[s.bit],
        bit:s.bit,
      },
    ],
  }));

  return rebusKedjor;
}

function hittaKedjesteg(rollId,kedjor){
  const res=[];
  (kedjor||[]).forEach(k=>{
    k.steg.forEach(s=>{
      if(s.fran===rollId) res.push({...s,kedjaId:k.id,kedjaNamn:k.namn,farg:k.farg,erSandare:true});
      else if(s.till===rollId||(!s.till&&s.typ==="mottagare"&&k.steg[0].till===rollId))
        res.push({...s,kedjaId:k.id,kedjaNamn:k.namn,farg:k.farg,erSandare:false});
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
    glodviskaren:"Plocka upp ett löv eller en kvist. Håll den framför dig och rör dig minimalistiskt, som om du dansar med naturen. Titta ingen i ögonen.",
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
    glodviskaren:"Stå still med en blomma eller gren i handen. Sväng den långsamt i takten. Om någon frågar – säg ingenting. Bara le.",
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
    glodviskaren:"Cirkulera sakta med en blomma eller gren utsträckt framför dig. Subtilt. Intensivt. Som en ritual bara du förstår.",
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
    mastersmeden:"Cirkulera runt stången med rak rygg. Lyft axlarna på varje slag. Tungt. Bestämt. Som järn som hamras.",
    soldaten:"Cirkulera med full kraft. Rör axlarna hårt i takten – upp, ned, upp, ned. Ingen kan missa dig.",
    glodviskaren:"Cirkulera sakta med en blomma eller gren. Axlarna rör sig minimalistiskt i takten. Subtilt men exakt.",
    galningen:"CIRKULERA OCH SLÅ GRYTAN I TAKTEN! AXLARNA UPP OCH NED PÅ VARJE SLAG! BOM BOM BOM!",
  },
};

// Levan Polkka: slumpas vid rollutdelning
// Kultledaren alltid MOTURS alla 3 omgångar
// Bybor: slumpas så ca hälften åt varje håll, alla har minst 1 av varje
const POLKKA_BYBO_KOMBINATIONER = [
  ["MEDURS","MOTURS","MEDURS"],
  ["MOTURS","MEDURS","MOTURS"],
  ["MEDURS","MEDURS","MOTURS"],
  ["MOTURS","MEDURS","MEDURS"],
  ["MEDURS","MOTURS","MOTURS"],
  ["MOTURS","MOTURS","MEDURS"],
];
const POLKKA_LEDARE = ["MOTURS","MOTURS","MOTURS"];

function slumpaPolkka(){
  const idx=Math.floor(Math.random()*POLKKA_BYBO_KOMBINATIONER.length);
  return POLKKA_BYBO_KOMBINATIONER[idx];
}

// ─── ANKLAGELSER ──────────────────────────────────────────────────────────────
// Pool av anklagelser riktade mot olika grupper – slumpas ut två st vid spelstart
// Prioriteras till spelare >40 år

const ANKLAGELSE_POOL = [
  {
    id:"mot_ortagillet",
    riktning:"Örtagillet",
    text:"Det finns ett gammalt ordspråk: den som känner till varje ört i skogen – det är inte en oskyldig människa. Örtagillets folk ler. De hjälper. De bjuder på té. Och ikväll undrar jag – vad är det egentligen i det téet?",
    stil:"Kort paus efter 'oskyldig människa'. Titta långsamt mot Örtagillets medlemmar. Avsluta med ett litet leende.",
  },
  {
    id:"mot_smederna",
    riktning:"Smederna",
    text:"Järnet säger en sak. Smedens ögon säger en annan. Jag har sett hur någon från brödraskapets led rör sig när de tror att ingen tittar. Det är inte en oskyldig rörelse. Järnet ljuger aldrig – men smeden kan.",
    stil:"Stå stilla. Tala långsamt. Titta på smederna en extra sekund innan du ser bort.",
  },
  {
    id:"mot_mankyrkan",
    riktning:"Månkyrkan",
    text:"Kyrkan talar om månens öga och renhet. Men renheten i Månkyrkan ikväll – den luktar lite konstigt, om ni frågar mig. Som något som försöker dölja sig bakom högtidliga ord.",
    stil:"Höjtidlig ton. Håll blicken mot Månkyrkans medlemmar en sekund för länge.",
  },
  {
    id:"mot_den_resande",
    riktning:"Den Resande",
    text:"En som kom i morse. Utan förklaring. Utan rötter. Alltid på rätt plats vid rätt tillfälle. Alltid med ett leende som sitter en halv sekund för länge. Jag frågar er – vem gör det? Vem kommer till en by på midsommarnatten utan ett skäl? Jag har rest mycket. Och jag vet hur den sortens människa ser ut.",
    stil:"Luta dig mot Den Resande utan att peka. Låt tystnaden göra jobbet.",
  },
];

// Slumpa ut 2 anklagelser vid spelstart, tilldela till spelare >40 år om möjligt
function slumpaAnklagelser(fordel) {
  const pool = [...ANKLAGELSE_POOL].sort(() => Math.random() - 0.5).slice(0, 2);
  // Hitta spelare >40 år om möjligt, annars slumpa
  const kandidater = fordel.filter(r => !r.barnroll && parseInt(r.spelarAlder||0) > 40);
  const ovriga = fordel.filter(r => !r.barnroll && !kandidater.includes(r));
  const tillgangliga = [...kandidater, ...ovriga];
  return pool.map((ankl, i) => ({
    ...ankl,
    tilldeladRollId: tillgangliga[i]?.id || null,
  }));
}


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
    ceremoni: {
      namn:"🌿 Örtceremonin",
      beskrivning:"Kloka Gumman/Gubben samlar hela gillet under ett träd eller buske. Alla lägger en hand på varandras axlar i en kedja. Kloka Gumman/Gubben uttalar tre ord som gillet väljer tillsammans – sedan bryter alla kedjan samtidigt. Måste ske inför minst 4 vittnen utanför gillet.",
    },
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
    ceremoni: {
      namn:"⚒ Smedjeeden",
      beskrivning:"Hela Smederna marscherar gemensamt fram till en annan grupp som pratar och avbryter dem med tre stampningar i marken. Mästersmeden ropar: 'Smedernas ed är slagen!' Gruppen de avbryter måste tystna i minst 10 sekunder.",
    },
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
    ceremoni: {
      namn:"🌙 Skuggprofetian",
      beskrivning:"Hela Månkyrkan samlas utomhus i en cirkel. Högprästen uttalar en profetia om kvällens utgång – fri formulering, minst tre meningar. Runläsaren bekräftar med ett orakel. Måste ske inför vittnen och INNAN Tinget öppnar.",
    },
    bonus: "+30p till hela gillet om ALLA fyra är klara",
  },
};

// Individuella poänguppdrag per roll
const ROLL_UPPGIFTER = {
  kloka: [
    {label:"Helig Blick använd", poang:15},
    {label:"Kultmärkt identifierad", poang:30},
    {label:"Allians bildad (annat gille)", poang:15},
    {label:"Örtceremonin genomförd", poang:10},
    {label:"Örtaté använt – sanning fångad", poang:10},
    {label:"Hemlighet delad med rätt person", poang:10},
  ],
  ortmastaren: [
    {label:"Allians med Smederna", poang:15},
    {label:"Allians med Månkyrkan", poang:15},
    {label:"Allians med Den Resande", poang:15},
    {label:"Motgift-förmåga använd", poang:20},
    {label:"Läkarkall använt vid Tinget", poang:10},
    {label:"Hemlighet delad med rätt person", poang:10},
  ],
  gronskan: [
    {label:"Spaningsrapport till Vägaren", poang:10},
    {label:"Skogens Dom – tystnad utdömd", poang:15},
    {label:"Skogens Dom – slog mot Tinget", poang:10},
    {label:"3 spelare informerade om observation", poang:15},
    {label:"Väktarens Blick skapade misstanke", poang:10},
    {label:"Hemlighet delad med rätt person", poang:10},
    {label:"Allians med annat gille", poang:15},
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
    {label:"Profetia avgiven Fas 1", poang:15},
    {label:"5+ i cirkelgång runt stången", poang:25},
    {label:"Helgad Ritual genomförd", poang:15},
    {label:"Absolution given (immunitet till Tinget)", poang:10},
  ],
  runlaesaren: [
    {label:"Runorakel givet (per person)", poang:10},
    {label:"Runbindning använd", poang:15},
    {label:"Profetia visade sig stämma", poang:20},
  ],
  munken: [
    {label:"Hemlighet samlad (per st, max 3)", poang:15},
    {label:"Rundan på huset genomförd", poang:15},
    {label:"Skenbetagen-förmåga använd", poang:15},
    {label:"3+ hemligheter lämnade till Vägaren", poang:20},
  ],
  den_resande: [
    {label:"Hemlighet samlad (per st)", poang:15},
    {label:"Hemlighet bytt mot skyddslöfte", poang:20},
    {label:"Skyddslöfte hölls vid Domen", poang:15},
    {label:"Skyddslöfte brutet (motpart -15p)", poang:0},
    {label:"3+ uppbud under Cannelloni Macaroni", poang:15},
    {label:"Sista budet använt", poang:15},
    {label:"Allians med varje gille", poang:25},
  ],
  skogsvakten: [
    {label:"Hittade kompisen direkt", poang:20},
    {label:"Spaningsrapport till Vägaren", poang:15},
    {label:"JAG SÅG DIG-hyss genomfört", poang:15},
    {label:"Trädvälsignelse genomförd", poang:15},
    {label:"Smög bakom 3 spelare ostört", poang:20},
    {label:"Pekade ut rätt kultledare vid Domen", poang:30},
    {label:"Paraden genomförd (kompis med)", poang:20},
    {label:"Det hemliga rådet (kompis med)", poang:15},
    {label:"Störningsmanövern (kompis med)", poang:25},
  ],
  galningen: [
    {label:"Hittade kompisen direkt", poang:20},
    {label:"LYSSNA PÅ MIG! ropad (per gång, max 3)", poang:10},
    {label:"Marscherat runt stången och sjungit", poang:15},
    {label:"Avbröt Högprästen med PANG PANG PANG", poang:20},
    {label:"Vunnit sten-sax-påse mot spelare", poang:10},
    {label:"Pekade ut rätt kultledare vid Domen", poang:30},
    {label:"Paraden genomförd (kompis med)", poang:20},
    {label:"Det hemliga rådet (kompis med)", poang:15},
    {label:"Störningsmanövern (kompis med)", poang:25},
  ],
  korsriddaren: [
    {label:"Hittade kompisen direkt", poang:20},
    {label:"Äreduel vunnen (sten-sax-påse)", poang:15},
    {label:"Riddarlöftet använt", poang:15},
    {label:"Vaktat stången 5 min", poang:20},
    {label:"Sagt vem kultledaren är högt", poang:15},
    {label:"Pekade ut rätt kultledare vid Domen", poang:30},
    {label:"Paraden genomförd (kompis med)", poang:20},
    {label:"Det hemliga rådet (kompis med)", poang:15},
    {label:"Störningsmanövern (kompis med)", poang:25},
  ],
};


// ─── GEMENSAMMA BARNUPPDRAG ───────────────────────────────────────────────────
const BARN_GEMENSAMMA = [
  {
    nr:1,
    titel:"PARADEN 🥁🌲",
    uppdrag:"MARSCHERA TILLSAMMANS runt hela huset! En av er slår takten, den andre leder. Minst 3 andra spelare måste titta på!",
    poang:"+20p VAR OM NI LYCKAS!",
  },
  {
    nr:2,
    titel:"DET HEMLIGA RÅDET 🤫",
    uppdrag:"Sätt er ihop på ett hemligt ställe. Bestäm TILLSAMMANS vilken spelare som är mest misstänksam. Gå sedan till Vägaren och rapportera ert val!",
    poang:"+15p VAR OM NI RAPPORTERAR!",
  },
  {
    nr:3,
    titel:"STÖRNINGSMANÖVERN ⚡",
    uppdrag:"Under Tinget – avbryt BÅDA på samma gång! En slår på grytan eller ropar något, den andre gör något annat galet. Vägaren avgör om det lyckades!",
    poang:"+25p VAR OM NI LYCKAS STÖRA TINGET!",
  },
];


// ─── HEMLIGHETER ──────────────────────────────────────────────────────────────
// Delas ut av Vägaren i rollkuverten. Kan delas, säljas eller hållas hemliga.

const HEMLIGHETER = {
  kloka: [
    "Du vet att Mästersmeden en gång ljög inför hela byn om något viktigt. Han vet att du vet.",
  ],
  ortmastaren: [
    "Du vet att Högprästen för länge sedan gav absolution åt någon som inte förtjänade det. Du har aldrig berättat det.",
  ],
  gronskan: [
    "Du har sett spår i skogen som inte tillhör något djur. Spåren leder mot midsommarstången.",
  ],
  mastersmeden: [
    "Du vet att Den Resande var här för ett år sedan under ett annat namn. Du berättade det aldrig för någon.",
  ],
  soldaten: [
    "Du känner igen ett av gesikterna ikväll från ett slag du aldrig pratat om. De vet att du känner igen dem.",
  ],
  glodviskaren: [
    "Du vet att två spelare i byn delar en hemlighet de tror är begravd. Den är det inte.",
  ],
  hogprasten: [
    "Du vet att ett av pentagrammen på tomten är falskt – placerat av någon som vill vilseleda.",
  ],
  runlaesaren: [
    "Du vet att runorna pekade på ett specifikt gille redan när du kastar dem i morse. Du har inte berättat vilket.",
  ],
  munken: [
    "Du hörde en konversation vid ölkannan som ingen visste att du hörde. Den handlade om stången.",
    "Du vet vem som drack ur den heliga kalken utan lov. Det var inte en from handling.",
  ],
  den_resande: [
    "Du vet att någon i byn inte är den de utger sig för att vara. Du har sett dem förut – i en annan by.",
    "Du bär på ett brev som aldrig fick sin mottagare. Det avslöjar något om en person här ikväll.",
    "Du vet att midsommarstången har ett märke på baksidan som ingen annan lagt märke till.",
    "Du har hört talas om Mörkblotets Kult förut. Det slutade inte väl för den byn.",
  ],
};

// ─── RUNORAKEL ────────────────────────────────────────────────────────────────
// Runläsaren väljer mellan dessa. Max 2 orakel per kväll. 
// Mottagaren bekräftar vid Domen om det stämde → +10p per orakel som stämde.

const RUNORAKEL = [
  "Mörkret rör sig nära dig ikväll. Håll dina vänner ännu närmre.",
  "Din allians är inte vad den verkar. Någon du litar på ljuger.",
  "Du kommer att tvingas välja mellan lojalitet och sanning. Välj klokt.",
  "Det du söker finns redan i din hand. Du har bara inte sett det ännu.",
  "En person du misstänker är oskyldig. En du inte misstänker är det inte.",
  "Stången drar till sig mörker ikväll. Den som håller i den äger natten.",
  "Dina rötter sitter djupare i denna jord än du tror. Lita på dem.",
  "Någon i din närhet har already bestämt hur de ska rösta. Och det är inte på kultledaren.",
  "Det gamla löftet bryts ikväll – men bara om tre röster ropar det rätta ordet.",
  "Du är inte ensam i din misstanke. Men du är ensam i din kunskap.",
];


const JULIA_UPPDRAG={
  trigger:{kon:"tjej",alder:41},
  uppdrag:"Någon gång under kvällen – du väljer när – ska du framföra 'Fångad av en stormvind' med full övertygelse. Du behöver inte förklara varför. Du gör det bara.",
  poangInfo:"Genomför: +20p · 3+ sjunger med: +30p · ALLA sjunger med: +50p och Vägaren utropar dig till Solstångsnattens hjälte.",
};

// ─── KULTDATA ─────────────────────────────────────────────────────────────────
const KULTMARKEN=[
  {id:"mk1",namn:"Skuggviskaren",
   kultInfo:"Du tjänar Mörkblotets Kult. Någonstans bland byborna finns en hemlig ledare – men du vet inte vem det är. Du tjänar kulten i blindo.",
   direktiv:"Skydda Runläsaren från anklagelser under Tinget. Avled uppmärksamheten från dem – subtilt och diskret.",
   hur:"Spela din byboroll fullt ut. Kultuppdraget är ett hemligt extra lager som ingen annan känner till.",
   risk:"Kultledaren kan när som helst välja att avsätta dig om du riskerar att avslöjas. Du spelar då vidare som vanlig bybo – berätta inget om vad du visste.",
   pentagram:"Placera ut 2 pentagram diskret på tomten under kvällen utan att bli påkommen. Rapportera till Vägaren när du är klar.",
   poang:"Direktiv utfört hela kvällen: +30p · Båda pentagram placerade ostört: +25p · Skyddade kultledaren (Vägarens bedömning): +20p · Kulten vinner: +100p sidebonus"},
  {id:"mk2",namn:"Mörkrets Spegel",
   kultInfo:"Du tjänar Mörkblotets Kult. Någonstans bland byborna finns en hemlig ledare – men du vet inte vem det är. Du tjänar kulten i blindo.",
   direktiv:"Håll andra spelare borta från midsommarstången under dansen i Fas 3. Skapa distraktioner, bjud in till samtal, hitta på något – men håll dem borta.",
   hur:"Du vet inte varför stången är viktig. Du vet bara att det är ditt uppdrag. Fråga inte. Gör det bara.",
   risk:"Kultledaren kan när som helst välja att avsätta dig om du riskerar att avslöjas. Du spelar då vidare som vanlig bybo – berätta inget om vad du visste.",
   pentagram:"Placera ut 2 pentagram diskret på tomten under kvällen utan att bli påkommen. Rapportera till Vägaren när du är klar.",
   poang:"Direktiv utfört hela kvällen: +30p · Båda pentagram placerade ostört: +25p · Skyddade kultledaren (Vägarens bedömning): +20p · Kulten vinner: +100p sidebonus"},
  {id:"mk3",namn:"Tystnadens Väktare",
   kultInfo:"Du tjänar Mörkblotets Kult. Någonstans bland byborna finns en hemlig ledare – men du vet inte vem det är. Du tjänar kulten i blindo.",
   direktiv:"Om Mästersmeden eller Örtmästaren verkar vara på väg att avslöja något viktigt – avbryt dem. En fråga, ett skratt, ett avbrott. Vad som helst.",
   hur:"Var social och avbryt folk lite oftare än normalt. Det ska aldrig verka avsiktligt.",
   risk:"Kultledaren kan när som helst välja att avsätta dig om du riskerar att avslöjas. Du spelar då vidare som vanlig bybo – berätta inget om vad du visste.",
   pentagram:"Placera ut 2 pentagram diskret på tomten under kvällen utan att bli påkommen. Rapportera till Vägaren när du är klar.",
   poang:"Direktiv utfört hela kvällen: +30p · Båda pentagram placerade ostört: +25p · Skyddade kultledaren (Vägarens bedömning): +20p · Kulten vinner: +100p sidebonus"},
];

const KULTLEDARE_INFO={
  beskrivning:"Bakom din byboroll gömmer sig Mörkblotets sanna ledare. Fullborda ritualen vid Solståndsnatten.",
  uppdrag:"Överlev Domen oavslöjad. Det är allt som krävs för kultens seger.",
  valssignelsen:"Håll handen på stången ostört i 30 sekunder under dansen i Fas 3. Om byborna saboterar ritualen missar du dessa poäng – men du kan fortfarande vinna på Domen.",
  foermaga:"🩸 Blodsband: Hälsa på båda dina kultmärkta under Fas 1 med det hemliga tecknet (bestäm med Vägaren). +15p per lyckad hälsning = max +30p.",
  foermaga2:"🕯 Avsättning: Om en kultmärkt håller på att avslöjas – kontakta Vägaren diskret och namnge dem. De spelar vidare som vanlig bybo. Du är skyddad.",
  igenkanning:"Säg 'Mörkret hälsar' till en spelare. Om de är märkt svarar de 'och natten är lång'.",
  tips:"Sprid falska anklagelser. Rösta på en oskyldig bybo vid Domen. Om majoriteten röstar fel vinner kulten.",
  pentagram:"Placera ut 3 pentagram diskret på tomten utan att bli påkommen. +30p om alla placeras.",
  inlosen:[
    {kostnad:30, vad:"Plantera ett falskt rykte via Vägaren – Vägaren viskar det diskret till 1-2 spelare."},
    {kostnad:100, vad:"Omvänd EN bybo till kulten – de får ett enkelt direktiv och röstar med kulten vid Domen."},
    {kostnad:50, vad:"5 extra röster vid Domen – rösta på en oskyldig bybo för att avleda."},
    {kostnad:100, vad:"10 extra röster vid Domen – kan vara avgörande med 10 spelare."},
  ],
};

const FALSKA_RYKTEN = [
  "Jag hörde att någon från Örtagillet frågade var pentagrammen kom ifrån...",
  "Någon såg Mästersmeden stå vid stången längre än nödvändigt under sista dansen.",
  "Det sägs att Den Resande inte riktigt kom utifrån – de har varit här förut.",
  "Runläsaren gav ett orakel ikväll som stämde lite för bra...",
  "Någon hörde Munken/Nunnan viska något konstigt vid ölkannan. Inte en bön.",
  "Det verkar som att Soldaten och någon från Månkyrkan hade ett hemligt möte tidigare.",
  "Kloka Gumman/Gubben undvek att svara när någon frågade om stången.",
];


const KULTMARKE_KANDIDATER=["mastersmeden","lakemedlaren","soldaten","hogprasten","runlaesaren","den_resande","glodviskaren","munken"];

const VINSTVILLKOR={
  niva1:{rubrik:"🎯 NIVÅ 1 – SIDAN",farg:"#c9a84c",villkor:[
    "🌿 BYN vinner om Kultledaren pekas ut och avslöjas vid Domen.",
    "🩸 KULTEN vinner om Kultledaren överlever Domen oavslöjad – eller om Välsignelsen aktiveras.",
    "⚖️ OAVGJORT om kultmärkta avslöjas men Kultledaren klarar sig.",
  ],tips:"Sidvinnaren utropas först vid Domen. +60p till vinnande bybo · +100p till vinnande kultist."},
  niva2:{rubrik:"🏆 NIVÅ 2 – GILLET",farg:"#a8d5a2",villkor:[
    "Vilket gille har flest poäng totalt när Domen faller?",
    "Örtagillet, Smederna eller Månkyrkan räknas. Den Resande tävlar inte på gillenivå.",
  ],tips:"Gillevinnaren utropas efter sidvinnaren. Hederstitel till hela gillet."},
  niva3:{rubrik:"⭐ NIVÅ 3 – INDIVIDEN",farg:"#ffcc44",villkor:[
    "Vem har flest individuella poäng av alla spelare?",
    "Kan vara vem som helst – bybo, kultist, barn eller vuxen.",
  ],tips:"Solstångsnattens hjälte utropas sist – den med absolut flest poäng. Stor ära."},
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
  {id:"dans_cirkel",label:"Högprästen – 5+ i cirkelgång",poang:15,kat:"dans",rollId:["hogprasten"]},
  {id:"julia_basis",label:"Julia – Fångad av stormvind",poang:20,kat:"special",rollId:"*"},
  {id:"julia_tre",label:"Julia – 3+ sjunger med",poang:30,kat:"special",rollId:"*"},
  {id:"julia_alla",label:"Julia – ALLA sjunger med",poang:50,kat:"special",rollId:"*"},
  {id:"allians",label:"Allians registrerad (annat gille)",poang:15,kat:"uppdrag",rollId:"*"},
  {id:"allians_bruten",label:"Bruten allians",poang:-10,kat:"uppdrag",rollId:"*"},
  {id:"skydd_brutet",label:"Skyddslöfte brutet",poang:-15,kat:"uppdrag",rollId:"*"},
  {id:"skydd_hallet",label:"Skyddslöfte hållet – Den Resande",poang:15,kat:"uppdrag",rollId:["den_resande"]},
  {id:"hemlighet",label:"Hemlighet delad med rätt person",poang:10,kat:"uppdrag",rollId:"*"},
  {id:"hemlighet_mottagen",label:"Hemlighet mottagen",poang:5,kat:"uppdrag",rollId:"*"},
  {id:"kedja",label:"Kedja slutförd",poang:10,kat:"uppdrag",rollId:"*"},
  {id:"formaga",label:"Förmåga använd rätt",poang:20,kat:"uppdrag",rollId:"*"},
  {id:"pentagram_hitta",label:"Pentagram hittat",poang:10,kat:"uppdrag",rollId:"*"},
  // Kultisternas pentagram-uppdrag
  {id:"pentagram_markt_klart",label:"Kultmärkt – alla pentagram placerade",poang:20,kat:"kult",rollId:"*"},
  {id:"pentagram_ledare_klart",label:"Kultledaren – alla pentagram placerade",poang:30,kat:"kult",rollId:"*"},
  {id:"pentagram_alla_klart",label:"Alla kultister – pentagram klara",poang:20,kat:"kult",rollId:"*"},
  // Artefakter
  {id:"artefakt_babushka",label:"Artefakt: Babushka hittad",poang:15,kat:"uppdrag",rollId:"*"},
  {id:"artefakt_flaskskepp",label:"Artefakt: Flaskskepp hittat",poang:15,kat:"uppdrag",rollId:"*"},
  {id:"artefakt_heligbok",label:"Artefakt: Helig bok hittad",poang:15,kat:"uppdrag",rollId:"*"},
  {id:"artefakt_draklada",label:"Artefakt: Draklåda hittad",poang:15,kat:"uppdrag",rollId:"*"},
  {id:"artefakt_spegel",label:"Artefakt: Månkyrkans spegel hittad",poang:15,kat:"uppdrag",rollId:"*"},
  {id:"anklagelse",label:"Anklagelse framförd",poang:5,kat:"ting",rollId:"*"},
  {id:"anklagelse_ratt_gille",label:"Anklagelse – rätt gille",poang:10,kat:"ting",rollId:"*"},
  {id:"anklagelse_fel_gille",label:"Anklagelse – fel gille",poang:-5,kat:"ting",rollId:"*"},
  {id:"anklagelse_markt",label:"Rätt – kultmärkt",poang:20,kat:"ting",rollId:"*"},
  {id:"anklagelse_ledare",label:"Rätt – Kultledaren!",poang:35,kat:"ting",rollId:"*"},
  {id:"anklagelse_fel",label:"Fel anklagelse",poang:-5,kat:"ting",rollId:"*"},
  {id:"dom_markt",label:"Pekade rätt – kultmärkt",poang:20,kat:"dom",rollId:"*"},
  {id:"dom_ledare",label:"Pekade rätt – Kultledaren",poang:40,kat:"dom",rollId:"*"},
  {id:"dom_fel",label:"Pekade fel",poang:-5,kat:"dom",rollId:"*"},
  {id:"sido_byn",label:"Sidebonus – Byn vann",poang:60,kat:"dom",rollId:"*"},
  {id:"barn_dom",label:"Barnroll – pekade rätt på kultledaren",poang:30,kat:"dom",rollId:["skogsvakten","galningen","korsriddaren"]},
  {id:"sido_kult",label:"Sidebonus – Kulten vann",poang:100,kat:"dom",rollId:"*"},
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
  månkyrkan:{namn:"Månkyrkan",ikon:"☽",farg:"#9999e0",ids:["hogprasten","runlaesaren","munken","korsriddaren"]},
  fri:{namn:"Den Resande",ikon:"🎲",farg:"#c9a84c",ids:["den_resande"]},
};

// ─── TILLDELNING ──────────────────────────────────────────────────────────────
function blandaOchTilldela(antalBarn, fordeltaBarnIds=[]){
  // ── Steg 1: Välj barnroller från 2 OLIKA gillen ──────────────────────────
  const gilles=["ortagillet","smederna","månkyrkan"];
  const allaBarnRoller=ROLLER_MASTER.filter(r=>r.barnroll);
  
  let barnGillen=[];
  let valdaBarn=[];

  const barnFordelade=fordeltaBarnIds.length>0; // Barn har fått roller i förväg

  if(barnFordelade){
    // Barn har fått roller i förväg - de ska INTE vara med i kvällens dragning
    // Men vi behöver veta deras gillen för att räkna vuxna rätt
    const fordeltaBarnRoller=allaBarnRoller.filter(r=>fordeltaBarnIds.includes(r.id));
    barnGillen=fordeltaBarnRoller.map(r=>r.gille);
    valdaBarn=[]; // Inga barn i kvällens dragning
  } else if(antalBarn>=2){
    const shuffledBarn=[...allaBarnRoller].sort(()=>Math.random()-0.5);
    const barn1=shuffledBarn[0];
    const barn2=shuffledBarn.find(b=>b.gille!==barn1.gille);
    if(barn1&&barn2){
      valdaBarn=[barn1,barn2];
      barnGillen=[barn1.gille,barn2.gille];
    }
  } else if(antalBarn===1){
    valdaBarn=[allaBarnRoller[Math.floor(Math.random()*allaBarnRoller.length)]];
    barnGillen=[valdaBarn[0].gille];
  }

  // ── Steg 2: Välj vuxna per gille ─────────────────────────────────────────
  // Gillen MED barn: 2 vuxna
  // Gillet UTAN barn: 3 vuxna
  let valdaVuxna=[];
  gilles.forEach(g=>{
    const harBarn=barnGillen.includes(g);
    const antalVuxna=harBarn?2:3;
    const gr=ROLLER_MASTER.filter(r=>!r.barnroll&&r.gille===g).sort(()=>Math.random()-0.5);
    valdaVuxna.push(...gr.slice(0,antalVuxna));
  });

  // Lägg till Den Resande (alltid med)
  const denResande=ROLLER_MASTER.find(r=>r.id==="den_resande");
  if(denResande) valdaVuxna.push(denResande);

  // ── Steg 3: Verifiera inga dubletter ─────────────────────────────────────
  const allaIds=new Set();
  const allaRoller=[...valdaVuxna,...valdaBarn].filter(r=>{
    if(allaIds.has(r.id)) return false;
    allaIds.add(r.id);
    return true;
  });
  const aktivaIds=allaRoller.map(r=>r.id);
  

  // ── Steg 4: Tilldela kultister (BARA bland vuxna, aldrig barn) ────────────
  const vuxnaKandidater=valdaVuxna.map(r=>r.id);
  const markeSlump=[...KULTMARKEN].sort(()=>Math.random()-0.5).slice(0,2);
  const kandidatSlump=[...vuxnaKandidater].sort(()=>Math.random()-0.5).slice(0,2);
  const ledareKandidater=vuxnaKandidater.filter(id=>!kandidatSlump.includes(id));
  const kultledareId=ledareKandidater[Math.floor(Math.random()*ledareKandidater.length)];
  const kultIds=[...kandidatSlump,kultledareId].filter(Boolean);

  // ── Steg 5: Bygg kedjor (aldrig kultister) ───────────────────────────────
  const kedjor=byggKedjor(aktivaIds,kultIds);

  // ── Steg 6: Rebussamlare ─────────────────────────────────────────────────
  const rebussamlareId=REBUS_SAMLAREPRIO.find(id=>aktivaIds.includes(id)&&!kultIds.includes(id))||null;

  // ── Steg 7: Anklagelser (inga barn) ──────────────────────────────────────
  const anklagelsePool=[...ANKLAGELSE_POOL].sort(()=>Math.random()-0.5).slice(0,2);
  // Anklagelser ska aldrig riktas mot eget gille
  // Matcha spelare med anklagelse mot annat gille
  const vuxnaRoller=allaRoller.filter(r=>!r.barnroll).sort(()=>Math.random()-0.5);
  const anklagelseTilldelning=anklagelsePool.map((a,i)=>{
    // Hitta en spelare vars gille inte matchar anklagelsens riktning
    const gilleMap={
      mot_ortagillet:"ortagillet",
      mot_smederna:"smederna",
      mot_mankyrkan:"månkyrkan",
      mot_den_resande:"fri",
    };
    const anklGille=gilleMap[a.id]||"";
    // Välj kandidat som inte tillhör det anklagade gillet
    const kandidat=vuxnaRoller.find(r=>r.gille!==anklGille);
    return {
      rollId:kandidat?.id||vuxnaRoller[i]?.id||null,
      anklagelse:a,
    };
  });

  // ── Steg 8: Bygg fullständiga roller och blanda ───────────────────────────
  return allaRoller.map(r=>{
    const mi=kandidatSlump.indexOf(r.id);
    const polkkaDir=r.id===kultledareId?POLKKA_LEDARE:slumpaPolkka();
    const erRebussamlare=r.id===rebussamlareId;
    let u={...r,kedjor,aktivaIds,polkkaDir,erRebussamlare};
    if(mi!==-1&&!r.barnroll) u={...u,kultMarke:markeSlump[mi]};
    if(r.id===kultledareId&&!r.barnroll) u={...u,erKultledare:true};
    const minAnklagelse=anklagelseTilldelning.find(a=>a.rollId===r.id);
    if(minAnklagelse) u={...u,anklagelse:minAnklagelse.anklagelse};
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

function KedjeStegSandare({s,ac}){
  const [open,setOpen]=useState(false);
  return <ToggleBlock label="🗣 Du bär en meddelande – hitta rätt person" ac={ac} bg="#080f08" open={open} setOpen={setOpen}>
    <p style={{fontSize:12,color:T.textDim,lineHeight:1.6,margin:"0 0 12px"}}>
      Du bär ett meddelande som du ska fälla naturligt i samtal. Rebussamlaren känner igen den och svarar. Då ger du dem din pusselbit.
    </p>
    <div style={{background:"#000a00",border:`1px solid ${ac}`,borderRadius:4,padding:"14px",marginBottom:10,textAlign:"center"}}>
      <div style={{fontSize:10,color:ac,letterSpacing:2,marginBottom:8,fontFamily:"'Cinzel',serif"}}>DITT MEDDELANDE – FÄll DET NATURLIGT I SAMTAL</div>
      <div style={{fontSize:16,color:"#d0ffd0",fontStyle:"italic",lineHeight:1.8}}>"{s.fras}"</div>
    </div>
    <div style={{background:"#0a0a00",border:`1px solid ${ac}44`,borderRadius:4,padding:"12px",marginBottom:10}}>
      <div style={{fontSize:10,color:ac,letterSpacing:2,marginBottom:6,fontFamily:"'Cinzel',serif"}}>OM DE SVARAR MED:</div>
      <div style={{fontSize:14,color:ac,fontWeight:700,textAlign:"center"}}>"{s.triggerOrd}"</div>
      <div style={{fontSize:11,color:T.textDim,marginTop:6,fontStyle:"italic"}}>...har du hittat rätt person. Dra dem åt sidan och viska frasbiten.</div>
    </div>
    <div style={{background:"#080814",border:`2px solid ${ac}`,borderRadius:4,padding:"14px",textAlign:"center"}}>
      <div style={{fontSize:10,color:ac,letterSpacing:2,marginBottom:8,fontFamily:"'Cinzel',serif"}}>VISKA DETTA TILL DEM:</div>
      <div style={{fontSize:14,color:"#e0e0ff",lineHeight:1.9,fontStyle:"italic"}}>{s.pusselbit}</div>
    </div>
  </ToggleBlock>;
}

function KedjeStegMott({s,ac}){
  const [open,setOpen]=useState(false);
  return <ToggleBlock label="👂 Du är rebussamlaren – lyssna efter meddelanden" ac={ac} bg="#0a0f08" open={open} setOpen={setOpen}>
    <p style={{fontSize:12,color:T.textDim,lineHeight:1.6,margin:"0 0 12px"}}>
      Någon bär ett meddelande och kommer att dela det naturligt i samtal med dig. När du hör den – svara med din mening. Då får du en pusselbit av dem.
    </p>
    {s.fras&&<div style={{background:"#0a0a00",border:`1px solid ${ac}44`,borderRadius:4,padding:"12px",marginBottom:8}}>
      <div style={{fontSize:10,color:ac,letterSpacing:2,marginBottom:6,fontFamily:"'Cinzel',serif"}}>MEDDELANDET DU LETAR EFTER:</div>
      <div style={{fontSize:13,color:ac,fontStyle:"italic",textAlign:"center",lineHeight:1.7}}>"{s.fras}"</div>
    </div>}
    {s.svarslösenord&&<div style={{background:"#000a00",border:`2px solid ${ac}`,borderRadius:4,padding:"14px",marginBottom:10,textAlign:"center"}}>
      <div style={{fontSize:10,color:ac,letterSpacing:2,marginBottom:8,fontFamily:"'Cinzel',serif"}}>SVARA MED:</div>
      <div style={{fontSize:16,color:"#ffeebb",fontStyle:"italic",lineHeight:1.8}}>"{s.svarslösenord}"</div>
    </div>}
    {s.pusselbit&&<div style={{background:"#080814",border:`2px solid ${ac}`,borderRadius:4,padding:"14px",textAlign:"center"}}>
      <div style={{fontSize:10,color:ac,letterSpacing:2,marginBottom:8,fontFamily:"'Cinzel',serif"}}>DU FÅR DÅ DENNA FRAGSBIT – NOTERA DEN!</div>
      <div style={{fontSize:14,color:"#e0e0ff",lineHeight:1.9,fontStyle:"italic",marginBottom:10}}>{s.pusselbit}</div>
      <div style={{background:"#ffcc4422",borderRadius:3,padding:"6px 10px",display:"inline-block"}}>
        <span style={{fontSize:11,color:"#ffcc44",fontWeight:700}}>Samla ALLA fyra bitar → sätt ihop ramsan → lämna till Vägaren INNAN Fas 3</span>
      </div>
    </div>}
  </ToggleBlock>;
}


// ─── ROLLKORT-SEKTIONER ───────────────────────────────────────────────────────
function KedjeStegMottAlla({steg,ac}){
  const [open,setOpen]=useState(false);
  return <ToggleBlock label={`🧩 Du är rebussamlaren – ${steg.length} pusseldelar att samla`} ac="#c9a84c" bg="#0a0800" open={open} setOpen={setOpen}>
    <p style={{fontSize:12,color:T.textDim,lineHeight:1.6,margin:"0 0 12px"}}>
      Fyra olika spelare bär varsin mening. De söker upp dig och säger sin mening. Du svarar – och de ger dig sin pusselbit. Samla alla fyra innan Fas 3!
    </p>
    {steg.map((s,i)=><div key={i} style={{marginBottom:12,padding:"12px",background:"#0a0800",border:`2px solid ${s.farg||ac}`,borderRadius:4}}>
      <div style={{fontSize:10,color:s.farg||ac,letterSpacing:2,marginBottom:8,fontFamily:"'Cinzel',serif"}}>FRAGSBIT {s.bit} – NÄR NÅGON SÄGER:</div>
      <div style={{background:"#000a00",borderRadius:3,padding:"10px",marginBottom:8,textAlign:"center"}}>
        <div style={{fontSize:13,color:"#ccffcc",fontStyle:"italic",lineHeight:1.7}}>"{s.fras}"</div>
      </div>
      <div style={{fontSize:10,color:s.farg||ac,letterSpacing:2,marginBottom:6,fontFamily:"'Cinzel',serif"}}>SVARA MED:</div>
      <div style={{background:"#000a00",borderRadius:3,padding:"10px",marginBottom:8,textAlign:"center",border:`1px solid ${s.farg||ac}`}}>
        <div style={{fontSize:14,color:"#ffeebb",fontStyle:"italic",fontWeight:500}}>"{s.svarslösenord}"</div>
      </div>
      <div style={{fontSize:10,color:s.farg||ac,letterSpacing:2,marginBottom:6,fontFamily:"'Cinzel',serif"}}>DU FÅR FRAGSBIT:</div>
      <div style={{background:"#080814",borderRadius:3,padding:"10px",textAlign:"center"}}>
        <div style={{fontSize:13,color:"#e0e0ff",fontStyle:"italic"}}>{s.pusselbit}</div>
      </div>
    </div>)}
    <div style={{background:"#ffcc4422",borderRadius:4,padding:"10px",textAlign:"center",marginTop:4}}>
      <div style={{fontSize:12,color:"#ffcc44",fontWeight:700}}>Sätt ihop alla fyra bitar → framför ramsan för Vägaren INNAN Fas 3</div>
      <div style={{fontSize:11,color:"#ffcc6688",marginTop:4}}>+20p om du lyckas!</div>
    </div>
  </ToggleBlock>;
}


function KedjeSektion({roll}){
  const kedjor=roll.kedjor||[];
  const steg=hittaKedjesteg(roll.id,kedjor);
  if(!steg.length)return null;
  const ac=roll.barnroll?"#ffb3c6":roll.gilleColor||T.guld;
  const sandare=steg.filter(s=>s.erSandare);
  const mottagare=steg.filter(s=>!s.erSandare);
  return <div style={{marginBottom:8}}>
    {sandare.map((s,i)=><KedjeStegSandare key={i} s={s} ac={s.farg||ac}/>)}
    {mottagare.length>0&&<KedjeStegMottAlla steg={mottagare} ac={ac}/>}
  </div>;
}

function DansSektion({roll,erKultledare}){
  const [open,setOpen]=useState(false);
  const rollId=roll.id;
  const gille=roll.gille;
  const ac=roll.barnroll?"#ffb3c6":roll.gilleColor||T.guld;
  const gilleLatId={ortagillet:"guld",smederna:"seven",månkyrkan:"only"}[gille];
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
      {[1,2,3].map((omgang,i)=>{
        const dir=roll.polkkaDir?roll.polkkaDir[i]:(erKultledare?"MOTURS":"MEDURS");
        return <div key={i} style={{display:"flex",gap:8,alignItems:"center",marginBottom:5}}>
          <span style={{fontSize:11,color:T.textDim,width:60}}>Omgång {omgang}:</span>
          <span style={{fontSize:14,fontFamily:"'Cinzel',serif",fontWeight:700,color:erKultledare?"#cc3333":T.guld}}>{dir}</span>
        </div>;
      })}

      {erKultledare&&<p style={{fontSize:11,color:"#cc9999",marginTop:4,fontStyle:"italic"}}>Gå moturs när alla andra går medurs. Var naturlig.</p>}
    </div>
  </ToggleBlock>;
}

function AnklagelseSektion({roll}){
  const [open,setOpen]=useState(false);
  if(roll.barnroll)return null;
  if(!roll.anklagelse)return null;
  const ac=roll.gilleColor||T.guld;
  const ankl=roll.anklagelse;
  return <ToggleBlock label={`⚖️ Din förskrivna anklagelse – mot ${ankl.riktning}`} ac={ac} bg="#08080f" open={open} setOpen={setOpen}>
    <div style={{background:"#080814",border:`1px solid ${ac}33`,borderRadius:3,padding:"14px",marginBottom:10}}>
      <div style={{fontSize:10,color:ac,letterSpacing:2,fontFamily:"'Cinzel',serif",marginBottom:8}}>LÄS HÖGT VID TINGET</div>
      <p style={{fontSize:13,color:T.text,lineHeight:1.9,margin:0,fontStyle:"italic"}}>"{ankl.text}"</p>
    </div>
    <div style={{fontSize:11,color:T.textDim,fontStyle:"italic",marginBottom:8,lineHeight:1.5}}>{ankl.stil}</div>
    <div style={{fontSize:11,color:"#ffcc66"}}>+5p för att framföra · +10p om rätt gille · -5p om fel gille → totalt 15p eller 0p</div>
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
    {data.ceremoni&&<div style={{marginTop:12,background:"#0a0a00",border:`2px solid ${ac}`,borderRadius:4,padding:"14px"}}>
      <div style={{fontSize:10,color:ac,letterSpacing:2,fontFamily:"'Cinzel',serif",marginBottom:8}}>{data.ceremoni.namn}</div>
      <p style={{fontSize:13,color:T.text,lineHeight:1.8,margin:0}}>{data.ceremoni.beskrivning}</p>
    </div>}
    <div style={{marginTop:10,padding:"8px 10px",background:ac+"15",borderRadius:3,fontSize:12,color:ac,fontStyle:"italic"}}>{data.bonus}</div>
  </ToggleBlock>;
}

// ─── ROLL-POÄNG-SEKTION ───────────────────────────────────────────────────────
function RollPoangSektion({roll}){
  const [open,setOpen]=useState(false);
  const uppg=ROLL_UPPGIFTER[roll.id];
  if(!uppg||!uppg.length)return null;
  const ac=roll.barnroll?"#ffb3c6":roll.gilleColor||T.guld;
  const rollSpecDans=UPPGIFTER.filter(u=>u.kat==="dans"&&u.rollId!=="*"&&u.rollId?.includes(roll.id));
  const maxMojligt=uppg.reduce((a,u)=>a+u.poang,0);
  return <ToggleBlock label={`💰 Dina poänguppdrag (max ~${maxMojligt}p)`} ac={ac} bg="#080a06" open={open} setOpen={setOpen}>
    {/* Dans-bonusar för denna roll */}
    {rollSpecDans.length>0&&<>
      <div style={{fontSize:10,color:ac,letterSpacing:2,marginBottom:6,fontFamily:"'Cinzel',serif"}}>🎵 SPECIALDANS</div>
      {rollSpecDans.map((u,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:`1px solid ${T.kant2}`,marginBottom:4}}>
        <span style={{fontSize:12,color:"#ccccff",flex:1}}>{u.label}</span>
        <span style={{fontSize:13,color:"#a8d5a2",fontWeight:700,marginLeft:12}}>+{u.poang}p</span>
      </div>)}
      <div style={{height:1,background:T.kant,margin:"8px 0"}}/>
    </>}
    {/* Rollspecifika uppdrag */}
    {uppg.map((u,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:`1px solid ${T.kant2}`}}>
      <span style={{fontSize:12,color:T.text,flex:1,lineHeight:1.4}}>{u.label}</span>
      <span style={{fontSize:13,color:u.poang<0?"#cc6666":"#a8d5a2",fontWeight:700,marginLeft:12,fontFamily:"'Cinzel',serif"}}>{u.poang>0?"+":""}{u.poang}p</span>
    </div>)}
    <div style={{marginTop:8,fontSize:11,color:T.textDim,fontStyle:"italic"}}>Plus dans (+5-10p), anklagelse (+5-15p), dom (+20-40p) och sidebonus (+60-100p)</div>
  </ToggleBlock>;
}


// ─── BARN-SEKTION ─────────────────────────────────────────────────────────────
function BarnSektion({roll}){
  if(!roll.barnroll)return null;
  const ac="#ffb3c6";
  
  // Hitta kompisen dynamiskt från aktivaIds
  const andraBarnIds=(roll.aktivaIds||[]).filter(id=>{
    const r=ROLLER_MASTER.find(x=>x.id===id);
    return r&&r.barnroll&&id!==roll.id;
  });
  const kompisRoll=andraBarnIds.length>0?ROLLER_MASTER.find(r=>r.id===andraBarnIds[0]):null;
  const kompis=kompisRoll?{
    namn:(typeof kompisRoll.rollnamn==="function"?kompisRoll.rollnamn(""):kompisRoll.rollnamn).toUpperCase(),
    gille:kompisRoll.gille?.toUpperCase()
  }:null;

  return <div style={{background:"#1a0a10",border:`2px solid ${ac}`,borderRadius:6,padding:"16px",marginBottom:8}}>
    <div style={{fontSize:12,color:ac,letterSpacing:2,fontFamily:"'Cinzel',serif",marginBottom:12,textAlign:"center"}}>⚡ DIN KOMPIS IKVÄLL ⚡</div>
    
    <div style={{background:"#0a0008",border:`1px solid ${ac}44`,borderRadius:4,padding:"12px",marginBottom:16,textAlign:"center"}}>
      <div style={{fontSize:18,marginBottom:4}}>🤝</div>
      <div style={{fontSize:15,color:ac,fontWeight:700,fontFamily:"'Cinzel',serif",marginBottom:4}}>{kompis?.namn}</div>
      <div style={{fontSize:12,color:"#ffb3c688"}}>FRÅN {kompis?.gille}</div>
      <div style={{fontSize:11,color:"#ffe8f0",marginTop:8,lineHeight:1.5}}>HITTA DEM DIREKT NÄR SPELET BÖRJAR!</div>
    </div>

    <div style={{fontSize:12,color:ac,letterSpacing:2,fontFamily:"'Cinzel',serif",marginBottom:10}}>🎯 VAD NI SKA GÖRA TILLSAMMANS</div>
    
    {BARN_GEMENSAMMA.map((u,i)=><div key={i} style={{background:"#0a0008",border:`1px solid ${ac}33`,borderRadius:4,padding:"12px",marginBottom:8}}>
      <div style={{fontSize:13,color:ac,fontWeight:700,marginBottom:6}}>{u.titel}</div>
      <div style={{fontSize:13,color:"#ffe8f0",lineHeight:1.7,marginBottom:8}}>{u.uppdrag}</div>
      <div style={{background:"#ffcc4422",borderRadius:3,padding:"6px 10px",display:"inline-block"}}>
        <span style={{fontSize:12,color:"#ffcc44",fontWeight:700}}>💰 BELÖNING: {u.poang}</span>
      </div>
    </div>)}
  </div>;
}


// ─── HEMLIGHET-SEKTION ────────────────────────────────────────────────────────
function HemlighetSektion({roll}){
  const [open,setOpen]=useState(false);
  const hemligheter=HEMLIGHETER[roll.id];
  if(!hemligheter||roll.barnroll)return null;
  const ac=roll.gilleColor||T.guld;
  return <ToggleBlock label={`🤫 Din${hemligheter.length>1?" hemliga kunskaper":" hemliga kunskap"}`} ac={ac} bg="#08080a" open={open} setOpen={setOpen}>
    <div style={{fontSize:11,color:T.textDim,fontStyle:"italic",marginBottom:10,lineHeight:1.5}}>
      Du kan dela, sälja eller hålla denna kunskap hemlig. Den är din handelsvara.
    </div>
    {hemligheter.map((h,i)=><div key={i} style={{background:"#0a0a00",border:`1px solid ${ac}33`,borderRadius:3,padding:"12px",marginBottom:8}}>
      <p style={{fontSize:13,color:T.text,lineHeight:1.8,margin:0,fontStyle:"italic"}}>"{h}"</p>
    </div>)}
    <div style={{fontSize:11,color:"#ffcc66",marginTop:4}}>+10p om du delar hemligheten med rätt person vid rätt tillfälle – Vägaren bedömer</div>
  </ToggleBlock>;
}

// ─── ORAKEL-SEKTION ───────────────────────────────────────────────────────────
function OrakelSektion({roll}){
  const [open,setOpen]=useState(false);
  if(roll.id!=="runlaesaren"||roll.barnroll)return null;
  const ac="#9999e0";
  return <ToggleBlock label="🔮 Dina runorakel – välj max 2" ac={ac} bg="#08080f" open={open} setOpen={setOpen}>
    <div style={{fontSize:11,color:T.textDim,fontStyle:"italic",marginBottom:10,lineHeight:1.5}}>
      Välj max 2 orakel att ge till 2 olika spelare under Fas 1. Meddela Vägaren vem som fick vilket.
      Vid Domen – om mottagaren säger att det stämde → <span style={{color:"#ffcc66"}}>+10p per orakel</span>.
      Du väljer själv VILKET orakel som "stämde" i efterhand.
    </div>
    {RUNORAKEL.map((o,i)=><div key={i} style={{background:"#08080f",border:"1px solid #9999cc33",borderRadius:3,padding:"10px",marginBottom:6,display:"flex",gap:10,alignItems:"flex-start"}}>
      <span style={{fontSize:11,color:"#9999cc",flexShrink:0,marginTop:2}}>{i+1}.</span>
      <p style={{fontSize:12,color:"#ccccff",lineHeight:1.7,margin:0,fontStyle:"italic"}}>"{o}"</p>
    </div>)}
  </ToggleBlock>;
}


// ─── REBUS-SEKTION ────────────────────────────────────────────────────────────
function RebusSektion({roll}){
  const [open,setOpen]=useState(false);
  if(!roll.erRebussamlare)return null;
  const ac=roll.gilleColor||T.guld;
  return <ToggleBlock label="🧩 Hemligt samlingsuppdrag – Rebusen" ac="#9999e0" bg="#08080f" open={open} setOpen={setOpen}>
    <div style={{background:"#080814",border:"1px solid #9999cc44",borderRadius:3,padding:"12px",marginBottom:10}}>
      <div style={{fontSize:10,color:"#9999cc",letterSpacing:2,fontFamily:"'Cinzel',serif",marginBottom:8}}>DITT HEMLIGA UPPDRAG</div>
      <p style={{...RT,color:"#ccccff",lineHeight:1.8}}>Du har fått ett unikt och hemligt uppdrag: samla alla fyra pusseldelar av den gamla ramsan under kvällen. Pusseldelarna når dig via kedjorna – lyssna noga när spelare säger frasen till dig.</p>
    </div>
    <div style={{background:"#060810",border:"1px solid #9999cc33",borderRadius:3,padding:"12px",marginBottom:10}}>
      <div style={{fontSize:10,color:"#9999cc",letterSpacing:2,fontFamily:"'Cinzel',serif",marginBottom:8}}>NÄR DU HAR ALLA FYRA DELAR</div>
      <p style={{...RT,color:"#ccccff",lineHeight:1.8}}>Sätt ihop ramsan och framför den till Vägaren INNAN Fas 3 börjar. Vägaren berättar då vad ramsan betyder – och vad byborna kan göra med kunskapen.</p>
    </div>
    <div style={{background:"#080814",border:"1px solid #9999cc44",borderRadius:3,padding:"12px",marginBottom:10}}>
      <div style={{fontSize:10,color:"#9999cc",letterSpacing:2,fontFamily:"'Cinzel',serif",marginBottom:8}}>PUSSELBITARNA</div>
      <p style={{fontSize:12,color:"#ccccff",lineHeight:1.8,margin:0}}>Du samlar fyra fragment via kedjorna. Varje fragment börjar med "REBUSDEL". När du har alla fyra – sätt ihop meningen och framför den till Vägaren INNAN Fas 3.</p>
    </div>
    <div style={{background:"#ffcc4415",border:"1px solid #ffcc4444",borderRadius:3,padding:"10px"}}>
      <div style={{fontSize:11,color:"#ffcc44",fontWeight:700}}>💰 Lyckas du lämna ramsan till Vägaren i tid: +20p</div>
      <div style={{fontSize:11,color:"#ffcc44",fontWeight:700,marginTop:4}}>💰 Om byborna sedan aktiverar sabotaget: +15p extra</div>
    </div>
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

  return <div style={{...Sida,paddingTop:12,...(roll.barnroll?{textTransform:"uppercase"}:{})}}>
    {roll.barnroll&&<div style={{textAlign:"center",background:"#1a0a10",border:"1px solid #ffb3c644",borderRadius:4,padding:"8px",marginBottom:10,fontSize:12,color:"#ffb3c6",textTransform:"uppercase",letterSpacing:1}}>⭐ Ditt hemliga uppdrag börjar nu!</div>}
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

    <Sek label="✦ Karaktär" ac={ac}><p style={RT}>{roll.karaktar}</p></Sek>
    {roll.barnroll
      ?<div style={{background:ac+"15",border:`1px solid ${ac}44`,borderRadius:4,padding:"14px",marginBottom:8}}><p style={{fontSize:14,color:T.text,lineHeight:1.9,margin:0,whiteSpace:"pre-line",fontWeight:700}}>{roll.beskrivning}</p></div>
      :<Sek label="📖 Bakgrund" ac={ac}><p style={{...RT,whiteSpace:"pre-line"}}>{roll.beskrivning}</p></Sek>}
    {roll.barnroll
      ?<div style={{background:"#ffb3c622",border:"2px solid #ffb3c6",borderRadius:6,padding:"14px",marginBottom:8,textAlign:"center"}}>
        <div style={{fontSize:12,color:"#ffb3c6",letterSpacing:2,fontFamily:"'Cinzel',serif",marginBottom:8}}>⭐ DITT UPPDRAG I KVÄLL</div>
        <p style={{fontSize:14,color:"#ffe8f0",lineHeight:1.8,margin:"0 0 10px",fontWeight:700}}>{roll.uppdrag}</p>
        <div style={{background:"#ffcc4422",borderRadius:3,padding:"6px 10px",display:"inline-block"}}>
          <span style={{fontSize:12,color:"#ffcc44",fontWeight:700}}>💰 RAPPORT TILL VÄGAREN = +15p</span>
        </div>
      </div>
      :<Sek label="⚔ Ditt uppdrag" ac={ac} hi><p style={RT}>{roll.uppdrag}</p></Sek>}
    <GillesuppdragSektion roll={roll}/>
    <RollPoangSektion roll={roll}/>
    {roll.barnroll
      ?<div style={{background:"#0a0008",border:"2px solid #ffb3c6",borderRadius:6,padding:"14px",marginBottom:8}}>
        <div style={{fontSize:12,color:"#ffb3c6",letterSpacing:2,fontFamily:"'Cinzel',serif",marginBottom:12,textAlign:"center"}}>🎭 DINA HYSS – GÖR DESSA UNDER KVÄLLEN</div>
        <div style={{background:"#1a0a10",border:"1px solid #ffb3c644",borderRadius:4,padding:"12px",marginBottom:8}}>
          <div style={{fontSize:13,color:"#ffe8f0",lineHeight:1.7,marginBottom:8}}>{roll.foermaga}</div>
          <div style={{background:"#ffcc4422",borderRadius:3,padding:"6px 10px"}}>
            <span style={{fontSize:12,color:"#ffcc44",fontWeight:700}}>💰 BELÖNING: +10p OM DU LYCKAS!</span>
          </div>
        </div>
        {roll.foermaga2&&<div style={{background:"#1a0a10",border:"1px solid #ffb3c644",borderRadius:4,padding:"12px"}}>
          <div style={{fontSize:13,color:"#ffe8f0",lineHeight:1.7,marginBottom:8}}>{roll.foermaga2}</div>
          <div style={{background:"#ffcc4422",borderRadius:3,padding:"6px 10px"}}>
            <span style={{fontSize:12,color:"#ffcc44",fontWeight:700}}>💰 BELÖNING: +10p OM DU LYCKAS!</span>
          </div>
        </div>}
      </div>
      :<><Sek label="✦ Förmåga I" ac={ac}><p style={RT}>{roll.foermaga}</p></Sek>
      {roll.foermaga2&&<Sek label="✦ Förmåga II" ac={ac}><p style={RT}>{roll.foermaga2}</p></Sek>}</>}

    {(()=>{
      const aktivaIds=roll.aktivaIds||[];
      const aktivaRollnamn=ROLLER_MASTER.filter(r=>aktivaIds.includes(r.id)).map(r=>typeof r.rollnamn==="function"?r.rollnamn(""):r.rollnamn);
      const filtrerade=(roll.relationer||[]).filter(r=>{
        // Barnroller: visa bara relationer till aktiva roller
        if(roll.barnroll){
          return aktivaIds.some(id=>{
            const rm=ROLLER_MASTER.find(x=>x.id===id);
            const rn=typeof rm?.rollnamn==="function"?rm.rollnamn(""):rm?.rollnamn;
            return rn===r.till;
          });
        }
        return true;
      });
      if(!filtrerade.length)return null;
      return <ToggleBlock label={`🤝 Relationer (${filtrerade.length})`} ac={ac} bg="#06080a" open={visRel} setOpen={setVisRel}>
        {filtrerade.map((r,i)=><div key={i} style={{marginBottom:i<filtrerade.length-1?12:0,paddingBottom:i<filtrerade.length-1?12:0,borderBottom:i<filtrerade.length-1?`1px solid ${T.kant2}`:"none"}}>
          <div style={{fontSize:11,color:ac,fontFamily:"'Cinzel',serif",letterSpacing:1,marginBottom:4}}>{r.till} · <span style={{color:T.guldDim}}>{r.typ}</span></div>
          <p style={{...RT,color:T.textDim}}>{r.text}</p>
        </div>)}
      </ToggleBlock>;
    })()}

    <AnklagelseSektion roll={roll}/>
    <HemlighetSektion roll={roll}/>
    <OrakelSektion roll={roll}/>
    <RebusSektion roll={roll}/>
    {!roll.barnroll&&<KedjeSektion roll={roll}/>}
    <DansSektion roll={roll} erKultledare={roll.erKultledare}/>
    <BarnSektion roll={roll}/>
    <JuliaSektion spelarKon={spelarKon} spelarAlder={spelarAlder}/>

    {roll.erKultledare&&<ToggleBlock label="🩸 HEMLIGT – Du är Kultledaren" ac="#cc3333" bg="#1a0000" open={visMarke} setOpen={setVisMarke}>
      <div style={{background:"#0a0000",border:"1px solid #cc3333",borderRadius:3,padding:"10px",marginBottom:10,textAlign:"center",fontSize:12,color:"#cc3333",fontFamily:"'Cinzel',serif",letterSpacing:1}}>AVSLÖJA DETTA FÖR INGEN</div>
      <p style={{...RT,color:"#cc9999",marginBottom:10}}>{KULTLEDARE_INFO.beskrivning}</p>
      <p style={{...RT,color:"#cc9999",marginBottom:10}}><strong style={{color:"#cc3333"}}>Välsignelsen:</strong> {KULTLEDARE_INFO.valssignelsen}</p>
      <p style={{...RT,color:"#cc9999",marginBottom:10}}><strong style={{color:"#cc3333"}}>Igenkänning:</strong> {KULTLEDARE_INFO.igenkanning}</p>
      <p style={{...RT,color:"#cc9999",marginBottom:6}}>{KULTLEDARE_INFO.foermaga}</p>
      <p style={{...RT,color:"#cc9999",marginBottom:10}}>{KULTLEDARE_INFO.foermaga2}</p>
      <p style={{...RT,color:"#cc9999",marginBottom:10}}>{KULTLEDARE_INFO.tips}</p>
      <div style={{height:1,background:"#cc3333",margin:"8px 0"}}/>
      <div style={{fontSize:10,color:"#cc3333",letterSpacing:2,fontFamily:"'Cinzel',serif",marginBottom:6}}>🔺 PENTAGRAM-UPPDRAG</div>
      <p style={{...RT,color:"#cc9999",marginBottom:10}}>{KULTLEDARE_INFO.pentagram}</p>
      <div style={{height:1,background:"#cc3333",margin:"8px 0"}}/>
      <div style={{fontSize:10,color:"#cc3333",letterSpacing:2,fontFamily:"'Cinzel',serif",marginBottom:6}}>💰 KULTENS INLÖSEN (via Vägaren i hemlighet)</div>
      {KULTLEDARE_INFO.inlosen.map((inl,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`1px solid #cc333322`}}>
        <span style={{fontSize:11,color:"#cc9999",flex:1,lineHeight:1.5}}>{inl.vad}</span>
        <span style={{fontSize:11,color:"#cc3333",fontWeight:700,marginLeft:10,flexShrink:0}}>{inl.kostnad}p</span>
      </div>)}
    </ToggleBlock>}

    {roll.kultMarke&&!roll.erKultledare&&<ToggleBlock label={`🩸 Hemligt kultmärke – ${roll.kultMarke.namn}`} ac="#cc6666" bg="#140303" open={visMarke} setOpen={setVisMarke}>
      <div style={{background:"#0a0000",border:"1px solid #8b1a1a",borderRadius:3,padding:"10px",marginBottom:10,fontSize:12,color:"#cc6666",textAlign:"center"}}>Du tjänar kulten. Du vet inte vem ledaren är.</div>
      <p style={{...RT,color:"#cc9999",marginBottom:10}}>{roll.kultMarke.direktiv}</p>
      <p style={{...RT,color:"#cc9999",marginBottom:10}}>{roll.kultMarke.hur}</p>
      <p style={{...RT,color:"#cc9999",marginBottom:10}}>{roll.kultMarke.risk}</p>
      {roll.kultMarke.pentagram&&<>
        <div style={{height:1,background:"#8b1a1a",margin:"8px 0"}}/>
        <div style={{fontSize:10,color:"#cc6666",letterSpacing:2,fontFamily:"'Cinzel',serif",marginBottom:6}}>🔺 PENTAGRAM-UPPDRAG</div>
        <p style={{...RT,color:"#cc9999",marginBottom:6}}>{roll.kultMarke.pentagram}</p>
      </>}
      {roll.kultMarke.poang&&<>
        <div style={{height:1,background:"#8b1a1a",margin:"8px 0"}}/>
        <div style={{fontSize:10,color:"#cc6666",letterSpacing:2,fontFamily:"'Cinzel',serif",marginBottom:6}}>💰 DINA POÄNGMÖJLIGHETER</div>
        {roll.kultMarke.poang.split(" · ").map((p,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:`1px solid #cc333322`}}>
          <span style={{fontSize:11,color:"#cc9999"}}>{p.split(":")[0]}</span>
          <span style={{fontSize:11,color:"#cc3333",fontWeight:700}}>{p.split(":")[1]}</span>
        </div>)}
      </>}
    </ToggleBlock>}

    {roll.barnroll
      ?<div style={{background:"#0a0008",border:"1px solid #ffb3c644",borderRadius:4,padding:"12px",marginBottom:8,textAlign:"center"}}>
        <div style={{fontSize:12,color:"#ffb3c6",fontWeight:700,lineHeight:1.7}}>{roll.tips}</div>
      </div>
      :<Sek label="💡 Tips" ac={T.guldDim}><p style={RT}>{roll.tips}</p></Sek>}
    <p style={{fontSize:11,color:T.textDim,textAlign:"center",marginTop:10}}>Memorera · Visa ingen · Lycka till</p>
    <div style={{background:"#0a0a00",border:`1px solid ${T.kant}`,borderRadius:4,padding:"10px 14px",marginTop:10,textAlign:"center"}}>
      <p style={{fontSize:11,color:T.guld,margin:0,lineHeight:1.7}}>{roll.barnroll?"🍬 PSST! VÄGAREN BELÖNAR GÄRNA SNÄLLA OCH HJÄLPSAMMA SPELARE MED EXTRA POÄNG... KANSKE TILL OCH MED GODIS!":"🥂 Vägaren kan belöna god stämning, generositet och hjälpsamhet med extra poäng. Tilltugg och påtår uppskattas alltid."}</p>
    </div>
    {onBekrafta!==null&&<button style={{...BtnH,width:"100%",marginTop:10}} onClick={onBekrafta}>Jag har läst min roll ✓</button>}
    <div style={{height:32}}/>
  </div>;
}

// ─── STÅNGENS VÅG ─────────────────────────────────────────────────────────────
function StangensVag({spelare,gilleData,bynProcent=50,kultProcent=50,bynPoang=0,kultPoang=0,kultisterIds=[]}){
  const gilleSort=[...gilleData].sort((a,b)=>b.total-a.total);
  const maxGille=Math.max(...gilleData.map(g=>g.total),1);
  const topSpelare=[...spelare].sort((a,b)=>b.poang-a.poang).slice(0,3);
  
  // Våg-lutning: 50% = balans, >50% byn = lutar vänster
  const lutning=bynProcent-50; // -50 till +50
  const bynLeder=bynProcent>kultProcent;

  return <div>
    {/* STÅNGENS VÅG */}
    <div style={{...Kort,borderColor:"#c9a84c44",background:"#080a06",marginBottom:8}}>
      <div style={{fontSize:10,color:"#c9a84c",letterSpacing:2,fontFamily:"'Cinzel',serif",marginBottom:4,textAlign:"center"}}>⚖️ STÅNGENS VÅG</div>
      <div style={{fontSize:10,color:"#8a7a5a",textAlign:"center",marginBottom:16,fontStyle:"italic"}}>Kultens poäng viktas ×3 · Bara synlig för Vägaren</div>

      {/* Visuell balansvåg */}
      <div style={{position:"relative",marginBottom:16}}>
        {/* Mittenstång */}
        <div style={{position:"absolute",left:"50%",top:0,width:3,height:90,background:"#c9a84c",borderRadius:2,transform:"translateX(-50%)"}}/>
        
        {/* BYN - vänster skål */}
        <div style={{
          position:"absolute",left:0,top:bynLeder?20:40,
          width:"44%",transition:"top 0.8s",
          textAlign:"center"
        }}>
          <div style={{background:"#0a1a0a",border:"2px solid #a8d5a2",borderRadius:8,padding:"10px 6px"}}>
            <div style={{fontSize:28,marginBottom:2}}>🌿</div>
            <div style={{fontSize:13,color:"#a8d5a2",fontFamily:"'Cinzel',serif",fontWeight:700}}>BYN</div>
            <div style={{fontSize:16,color:"#a8d5a2",fontWeight:700}}>{bynProcent}%</div>
            <div style={{fontSize:10,color:"#5a8a5a"}}>{bynPoang}p råpoäng</div>
          </div>
          {bynLeder&&<div style={{fontSize:11,color:"#a8d5a2",marginTop:4,fontWeight:700}}>◄ LEDER</div>}
        </div>

        {/* KULTEN - höger skål */}
        <div style={{
          position:"absolute",right:0,top:bynLeder?40:20,
          width:"44%",transition:"top 0.8s",
          textAlign:"center"
        }}>
          <div style={{background:"#1a0808",border:"2px solid #cc6666",borderRadius:8,padding:"10px 6px"}}>
            <div style={{fontSize:28,marginBottom:2}}>🩸</div>
            <div style={{fontSize:13,color:"#cc6666",fontFamily:"'Cinzel',serif",fontWeight:700}}>KULTEN</div>
            <div style={{fontSize:16,color:"#cc6666",fontWeight:700}}>{kultProcent}%</div>
            <div style={{fontSize:10,color:"#8a5a5a"}}>{Math.round(kultPoang/3)}p råpoäng ×3</div>
          </div>
          {!bynLeder&&<div style={{fontSize:11,color:"#cc6666",marginTop:4,fontWeight:700}}>LEDER ►</div>}
        </div>

        {/* Spacer */}
        <div style={{height:110}}/>
      </div>

      {/* Fördelningsbar */}
      <div style={{height:12,background:"#1a1510",borderRadius:6,overflow:"hidden",marginBottom:6,display:"flex"}}>
        <div style={{width:`${bynProcent}%`,background:"linear-gradient(to right,#3d6b3a,#a8d5a2)",transition:"width 0.8s",borderRadius:"6px 0 0 6px"}}/>
        <div style={{flex:1,background:"linear-gradient(to right,#8b1a1a,#cc6666)",borderRadius:"0 6px 6px 0"}}/>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"#8a7a5a"}}>
        <span>🌿 {bynProcent}%</span>
        <span>{kultProcent}% 🩸</span>
      </div>
    </div>

    {/* GILLETÄVLINGEN */}
    <div style={{...Kort,borderColor:"#c9a84c44",marginBottom:8}}>
      <div style={{fontSize:10,color:"#c9a84c",letterSpacing:2,fontFamily:"'Cinzel',serif",marginBottom:12,textAlign:"center"}}>🏆 GILLETÄVLINGEN</div>
      {gilleSort.map((g,i)=><div key={g.gid} style={{marginBottom:10}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
          <span style={{fontSize:13,color:g.farg,fontFamily:"'Cinzel',serif"}}>{i===0?"👑 ":""}{g.ikon} {g.namn}{g.multiplier>1?<span style={{fontSize:10,color:"#8a7a5a"}}> ×{g.multiplier}</span>:""}</span>
          <span style={{fontSize:14,color:g.farg,fontWeight:700}}>{g.total}p</span>
        </div>
        <div style={{height:8,background:"#1a1510",borderRadius:4,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${Math.max(4,Math.round(g.total/maxGille*100))}%`,background:`linear-gradient(to right,${g.farg}88,${g.farg})`,borderRadius:4,transition:"width 0.5s"}}/>
        </div>
      </div>)}
    </div>

    {/* INDIVIDUELL TOPP 3 */}
    <div style={{...Kort,borderColor:"#c9a84c44"}}>
      <div style={{fontSize:10,color:"#c9a84c",letterSpacing:2,fontFamily:"'Cinzel',serif",marginBottom:12,textAlign:"center"}}>⭐ INDIVIDUELL TOPP 3</div>
      {topSpelare.map((s,i)=>{
        const g=Object.values(GILLE_INFO).find(x=>x.ids.includes(s.id));
        const ac=g?.farg||"#c9a84c";
        const erKult=kultisterIds.includes(s.id);
        return <div key={s.id} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 0",borderBottom:`1px solid #1e1810`}}>
          <span style={{fontSize:18}}>{["🥇","🥈","🥉"][i]}</span>
          <span style={{fontSize:16}}>{s.icon}</span>
          <span style={{flex:1,fontSize:13,color:ac,fontFamily:"'Cinzel',serif"}}>{s.rollnamn}</span>
          {erKult&&<span style={{fontSize:9,color:"#cc6666",border:"1px solid #cc666644",borderRadius:2,padding:"1px 4px"}}>KULT</span>}
          <span style={{fontSize:16,fontWeight:700,color:ac}}>{s.poang}p</span>
        </div>;
      })}
    </div>
  </div>;
}


// ─── POÄNG-ADMIN ──────────────────────────────────────────────────────────────
function PoangAdmin({spelare,setSpelare,fordel=[]}){
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
      if(s.id===id)return {...s,poang:s.poang+u.poang};
      return s;
    }));
  }

  function minusPoang(id,uppgId,belopp){
    setSistaHandling({id,uppgId,poang:-belopp});
    setSpelare(prev=>prev.map(x=>x.id===id?{...x,poang:x.poang-belopp}:x));
  }

  function angraHandling(){
    if(!sistaHandling)return;
    const {id,poang}=sistaHandling;
    setSpelare(prev=>prev.map(s=>s.id===id?{...s,poang:s.poang-poang}:s));
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
  // Kultister från fordel (för vågen)
  const kultisterIds=fordel.filter(r=>r.erKultledare||r.kultMarke).map(r=>r.id);
  const byborIds=spelare.map(s=>s.id).filter(id=>!kultisterIds.includes(id));

  const gilleData=Object.entries(GILLE_INFO).map(([gid,g])=>({
    ...g,gid,
    spelare:spelare.filter(s=>g.ids.includes(s.id)),
    total:gid==="fri"
      ? spelare.filter(s=>g.ids.includes(s.id)).reduce((a,s)=>a+s.poang,0)*3
      : spelare.filter(s=>g.ids.includes(s.id)).reduce((a,s)=>a+s.poang,0),
    multiplier:gid==="fri"?3:1,
  }));

  // Våg-beräkning: kultens poäng ×3 för balans
  const bynPoang=spelare.filter(s=>byborIds.includes(s.id)).reduce((a,s)=>a+s.poang,0);
  const kultPoang=spelare.filter(s=>kultisterIds.includes(s.id)).reduce((a,s)=>a+s.poang,0)*3;
  const vagTotal=bynPoang+kultPoang||1;
  const bynProcent=Math.round(bynPoang/vagTotal*100);
  const kultProcent=100-bynProcent;

  return <div>
    <TabBar tabs={["Check-in","Fasöversikt","Gillen & Våg"]} active={subTab} onChange={setSubTab}/>

    {subTab===0&&<>
      {/* VÄLJ SPELARE */}
      <div style={Kort}>
        <div style={Lbl}>Välj spelare för uppdrag</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
          {spelare.map(s=>{
            const g=Object.values(GILLE_INFO).find(x=>x.ids.includes(s.id));
            const ac=g?.farg||T.guld;
            return <div key={s.id} style={{display:"flex",flexDirection:"column",marginBottom:4}}>
              <button style={{fontSize:11,background:vald===s.id?ac+"33":"transparent",color:vald===s.id?ac:T.textDim,border:`1px solid ${vald===s.id?ac+"66":T.kant2}`,borderRadius:3,padding:"5px 9px",cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setVald(s.id)}>
                {s.icon} {s.rollnamn} <strong>{s.poang}p</strong>
              </button>
            </div>;
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

        {/* Rollspecifika uppdrag */}
        {ROLL_UPPGIFTER[valdSp.id]?.length>0&&<div style={{marginBottom:10}}>
          <div style={{fontSize:10,color:T.guldDim,letterSpacing:2,marginBottom:5,fontFamily:"'Cinzel',serif"}}>⭐ ROLLSPECIFIKA UPPDRAG</div>
          <div style={{display:"flex",flexDirection:"column",gap:3}}>
            {ROLL_UPPGIFTER[valdSp.id].map((u,i)=><button key={i} style={{background:"transparent",border:`1px solid ${u.poang<0?"#8b1a1a":T.kant2}`,borderRadius:3,padding:"7px 10px",cursor:"pointer",textAlign:"left",fontFamily:"inherit",display:"flex",justifyContent:"space-between"}} onClick={()=>{const p=u.poang;setSistaHandling({id:valdSp.id,uppgId:"roll_"+i,poang:p});setSpelare(prev=>prev.map(s=>s.id===valdSp.id?{...s,poang:Math.max(0,s.poang+p)}:s));}}>
              <span style={{fontSize:12,color:T.text}}>{u.label}</span>
              <span style={{fontSize:13,color:u.poang<0?"#cc6666":"#a8d5a2",fontWeight:700}}>{u.poang>0?"+":""}{u.poang}p</span>
            </button>)}
          </div>
        </div>}

        {/* Generella uppdrag */}
        {[
          {kat:"uppdrag",lbl:"🗝 Generellt"},
          {kat:"kult",lbl:"🩸 Kult"},
          {kat:"special",lbl:"🌪 Special"},
        ].map(({kat,lbl})=>{
          const erKult=fordel.find(r=>r.id===valdSp.id&&(r.erKultledare||r.kultMarke));
          const uppg=UPPGIFTER.filter(u=>{
            if(u.kat!==kat) return false;
            if(u.kat==="kult"&&!erKult) return false;
            if(u.id==="sido_kult"&&!erKult) return false;
            if(u.id==="sido_byn"&&erKult) return false;
            if(u.id?.startsWith("dans_")) return false;
            if(u.id?.startsWith("gille_")) return false;
            if(u.rollId!=="*"&&!u.rollId?.includes(valdSp.id)) return false;
            return true;
          });
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

        {/* Inlösen */}
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

      {/* TINGET - gemensam sektion */}
      <div style={{...Kort,borderColor:"#9999e044",background:"#08080f"}}>
        <div style={{...Lbl,color:"#9999e0"}}>⚖️ Tinget – klicka på spelare för att ge poäng</div>
        {[
          {id:"anklagelse",label:"Anklagelse framförd",poang:5,farg:"#9999e0"},
          {id:"anklagelse_ratt_gille",label:"Rätt gille",poang:10,farg:"#a8d5a2"},
          {id:"anklagelse_fel_gille",label:"Fel gille",poang:-5,farg:"#cc6666"},
          {id:"anklagelse_markt",label:"Träffade rätt – kultmärkt",poang:20,farg:"#a8d5a2"},
          {id:"anklagelse_ledare",label:"Träffade rätt – Kultledaren!",poang:35,farg:"#ffcc44"},
          {id:"anklagelse_fel",label:"Fel anklagelse",poang:-5,farg:"#cc6666"},
        ].map(ting=><div key={ting.id} style={{marginBottom:8,padding:"8px 10px",background:"#060610",borderRadius:4,border:"1px solid #9999e022"}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
            <span style={{fontSize:12,color:ting.farg}}>{ting.label}</span>
            <span style={{fontSize:11,color:ting.farg}}>{ting.poang>0?"+":""}{ting.poang}p</span>
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:3}}>
            {spelare.map(s=>{
              const g=Object.values(GILLE_INFO).find(x=>x.ids.includes(s.id));
              const ac=g?.farg||T.guld;
              return <div key={s.id} style={{display:"flex",gap:0,marginBottom:2}}>
                <button title={`${ting.poang>0?"+":""}${ting.poang}p till ${s.rollnamn}`} style={{fontSize:10,background:ac+"22",color:ac,border:`1px solid ${ac}44`,borderRadius:"3px 0 0 3px",padding:"3px 6px",cursor:"pointer",fontFamily:"inherit"}} onClick={()=>addPoang(s.id,ting.id)}>{s.icon}+</button>
                <button title={`Ångra för ${s.rollnamn}`} style={{fontSize:10,background:"#1a000022",color:"#cc6666",border:"1px solid #cc666633",borderRadius:"0 3px 3px 0",padding:"3px 5px",cursor:"pointer",fontFamily:"inherit"}} onClick={()=>minusPoang(s.id,ting.id,ting.poang)}> −</button>
              </div>;
            })}
          </div>
        </div>)}
      </div>

      {/* DANS - gemensam sektion */}
      <div style={{...Kort,borderColor:"#9999cc44"}}>
        <div style={{...Lbl,color:"#9999cc"}}>🎵 Dans – klicka på spelare för att ge poäng</div>
        {[
          {id:"dans_cannelloni",label:"Cannelloni Macaroni",poang:5},
          {id:"dans_walking",label:"Walking on Sunshine",poang:5},
          {id:"dans_euphoria",label:"Euphoria – Loreen",poang:5},
          {id:"dans_polkka",label:"Levan Polkka – rätt håll",poang:10},
          {id:"dans_gilledans",label:"Gilledans genomförd",poang:10},
          {id:"dans_alla",label:"Alla 6 danser klara",poang:20},
        ].map(dans=><div key={dans.id} style={{marginBottom:8,padding:"8px 10px",background:"#08080f",borderRadius:4,border:"1px solid #9999cc22"}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
            <span style={{fontSize:12,color:"#ccccff"}}>{dans.label}</span>
            <span style={{fontSize:11,color:"#9999cc"}}>±{dans.poang}p</span>
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:3}}>
            {spelare.map(s=>{
              const g=Object.values(GILLE_INFO).find(x=>x.ids.includes(s.id));
              const ac=g?.farg||T.guld;
              return <div key={s.id} style={{display:"flex",gap:0,marginBottom:2}}>
                <button title={`+${dans.poang}p till ${s.rollnamn}`} style={{fontSize:10,background:ac+"22",color:ac,border:`1px solid ${ac}44`,borderRadius:"3px 0 0 3px",padding:"3px 6px",cursor:"pointer",fontFamily:"inherit"}} onClick={()=>addPoang(s.id,dans.id)}>{s.icon}+</button>
                <button title={`-${dans.poang}p från ${s.rollnamn}`} style={{fontSize:10,background:"#1a000022",color:"#cc6666",border:"1px solid #cc666633",borderRadius:"0 3px 3px 0",padding:"3px 5px",cursor:"pointer",fontFamily:"inherit"}} onClick={()=>minusPoang(s.id,dans.id,dans.poang)}> −</button>
              </div>;
            })}
          </div>
        </div>)}
        <div style={{display:"flex",gap:4,marginTop:4,flexWrap:"wrap"}}>
          <button style={{flex:1,background:"#08080f",border:"1px solid #9999cc22",borderRadius:3,padding:"5px",fontSize:10,color:"#9999cc",cursor:"pointer",fontFamily:"inherit"}} onClick={()=>addPoang("den_resande","dans_uppbud")}>🧳 Den Resande 3+ uppbud +15p</button>
          <button style={{flex:1,background:"#08080f",border:"1px solid #9999cc22",borderRadius:3,padding:"5px",fontSize:10,color:"#9999cc",cursor:"pointer",fontFamily:"inherit"}} onClick={()=>addPoang("hogprasten","dans_cirkel")}>🌙 Högprästen cirkel +15p</button>
        </div>
      </div>

      {/* DOMEN - gemensam sektion */}
      <div style={{...Kort,borderColor:"#cc333344",background:"#120808"}}>
        <div style={{...Lbl,color:"#cc6666"}}>🗳️ Domen – klicka på spelare för att ge poäng</div>
        {[
          {id:"dom_ledare",label:"Pekade rätt – Kultledaren",poang:40,farg:"#a8d5a2"},
          {id:"dom_markt",label:"Pekade rätt – kultmärkt",poang:20,farg:"#a8d5a2"},
          {id:"dom_fel",label:"Pekade fel",poang:-5,farg:"#cc6666"},
          {id:"sido_byn",label:"Sidebonus – Byn vann",poang:60,farg:"#a8d5a2"},
          {id:"sido_kult",label:"Sidebonus – Kulten vann",poang:100,farg:"#cc9966"},
          {id:"barn_dom",label:"Barnroll – pekade rätt på Kultledaren",poang:30,farg:"#a8d5a2"},
        ].map(dom=><div key={dom.id} style={{marginBottom:8,padding:"8px 10px",background:"#0a0000",borderRadius:4,border:"1px solid #cc333322"}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
            <span style={{fontSize:12,color:dom.farg}}>{dom.label}</span>
            <span style={{fontSize:11,color:dom.farg}}>{dom.poang>0?"+":""}{dom.poang}p</span>
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:3}}>
            {spelare.map(s=>{
              const g=Object.values(GILLE_INFO).find(x=>x.ids.includes(s.id));
              const ac=g?.farg||T.guld;
              return <div key={s.id} style={{display:"flex",gap:0,marginBottom:2}}>
                <button title={`${dom.poang>0?"+":""}${dom.poang}p till ${s.rollnamn}`} style={{fontSize:10,background:ac+"22",color:ac,border:`1px solid ${ac}44`,borderRadius:"3px 0 0 3px",padding:"3px 6px",cursor:"pointer",fontFamily:"inherit"}} onClick={()=>addPoang(s.id,dom.id)}>{s.icon}+</button>
                <button title={`Ångra för ${s.rollnamn}`} style={{fontSize:10,background:"#1a000022",color:"#cc6666",border:"1px solid #cc666633",borderRadius:"0 3px 3px 0",padding:"3px 5px",cursor:"pointer",fontFamily:"inherit"}} onClick={()=>minusPoang(s.id,dom.id,dom.poang)}> −</button>
              </div>;
            })}
          </div>
        </div>)}
      </div>
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
          <span style={{flex:1,fontSize:13,color:g.farg,fontFamily:"'Cinzel',serif"}}>{g.namn}{g.multiplier>1?<span style={{fontSize:10,color:T.guldDim}}> ×{g.multiplier}</span>:""}</span>
          <span style={{fontSize:16,fontFamily:"'Cinzel',serif",fontWeight:700,color:T.guld}}>{g.total}p</span>
        </div>)}
      </div>
    </>}

    {subTab===2&&<>
      <StangensVag spelare={spelare} gilleData={gilleData} bynProcent={bynProcent} kultProcent={kultProcent} bynPoang={bynPoang} kultPoang={kultPoang} kultisterIds={kultisterIds}/>
      {gilleData.map(g=><div key={g.gid} style={{...Kort,borderColor:g.farg+"44",marginBottom:8}}>
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
    </>}
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

function ManusBlock({f}){
  const [open,setOpen]=useState(false);
  return <div style={{marginBottom:6}}>
    <button style={{width:"100%",background:open?"#13100c":"#1a1510",border:`1px solid ${open?f.farg+"44":"#3a2e1e"}`,borderRadius:open?"4px 4px 0 0":"4px",padding:"10px 12px",cursor:"pointer",textAlign:"left",fontFamily:"inherit",display:"flex",justifyContent:"space-between",alignItems:"center"}} onClick={()=>setOpen(v=>!v)}>
      <span style={{fontSize:12,color:f.farg,fontFamily:"'Cinzel',serif",letterSpacing:1}}>{f.fas}</span>
      <span style={{fontSize:10,color:"#8a7a5a"}}>{open?"▲":"▼"}</span>
    </button>
    {open&&<div style={{background:"#0a0800",border:`1px solid ${f.farg}33`,borderTop:"none",borderRadius:"0 0 4px 4px",padding:"14px"}}>
      {f.rader.map((r,j)=><p key={j} style={{fontSize:13,color:"#e8e0c8",lineHeight:1.9,margin:"0 0 6px",fontStyle:"italic"}}>"{r}"</p>)}
      {f.tips&&<div style={{marginTop:10,padding:"8px 10px",background:f.farg+"15",borderRadius:3,fontSize:11,color:f.farg}}>{f.tips}</div>}
    </div>}
  </div>;
}


// ─── SPELLEDARE-VY ────────────────────────────────────────────────────────────
function SpelledarVy({setVy,starta,tab,setTab,antalBarn,setAntalBarn,spelare,setSpelare,domAvslojad,setDomAvslojad,fordel,barnGillenVal=[],setBarnGillenVal,fordeltaBarn=[],setFordeltaBarn}){
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
      {/* Barnroller */}
      <div style={{...Kort,borderColor:"#ffb3c644"}}>
        <div style={{...Lbl,color:"#ffb3c6"}}>🌸 Barnroller – skicka i förväg</div>
        <p style={{fontSize:11,color:T.textDim,margin:"0 0 10px",lineHeight:1.5}}>Välj vilka två gillen som har barn. QR-koder genereras så att du kan skicka rollerna till barnen innan kvällen.</p>
        
        {/* Välj gillen */}
        <div style={{marginBottom:10}}>
          <div style={{fontSize:10,color:"#ffb3c6",letterSpacing:1,marginBottom:6}}>VÄLJ TVÅ GILLEN MED BARN:</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {[
              {id:"ortagillet",namn:"🌿 Örtagillet",farg:"#a8d5a2"},
              {id:"smederna",namn:"⚒ Smederna",farg:"#d4956a"},
              {id:"månkyrkan",namn:"☽ Månkyrkan",farg:"#9999e0"},
            ].map(g=>{
              const vald=barnGillenVal.includes(g.id);
              return <button key={g.id} style={{padding:"6px 12px",border:`1px solid ${vald?g.farg:T.kant}`,borderRadius:3,background:vald?g.farg+"22":"transparent",color:vald?g.farg:T.textDim,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}
                onClick={()=>{
                  if(vald){
                    setBarnGillenVal(prev=>prev.filter(x=>x!==g.id));
                    setFordeltaBarn(prev=>prev.filter(r=>r.gille!==g.id));
                  } else if(barnGillenVal.length<2){
                    setBarnGillenVal(prev=>[...prev,g.id]);
                    // Slumpa en barnroll från detta gille
                    const barnroller=ROLLER_MASTER.filter(r=>r.barnroll&&r.gille===g.id);
                    const valdBarn=barnroller[Math.floor(Math.random()*barnroller.length)];
                    if(valdBarn) setFordeltaBarn(prev=>[...prev,valdBarn]);
                  }
                }}>
                {g.namn}
              </button>;
            })}
          </div>
        </div>

        {/* Visa valda barnroller och QR */}
        {fordeltaBarn.length>0&&<div>
          <div style={{fontSize:10,color:"#ffb3c6",letterSpacing:1,marginBottom:6}}>BARNROLLER ATT SKICKA:</div>
          {fordeltaBarn.map(barn=>{
            const andraBarn=fordeltaBarn.filter(b=>b.id!==barn.id).map(b=>b.id);
            const miniData={
              id:barn.id,
              kon:"",
              alder:"",
              erk:0,
              km:"",
              rb:0,
              pd:slumpaPolkka(),
              ai:fordeltaBarn.map(b=>b.id).join(","),
              bi:fordeltaBarn.map(b=>b.id).join(","),
              kid:"",
            };
            const enkodad=btoa(JSON.stringify(miniData));
            const url="https://midsommarblot.vercel.app/#roll="+enkodad;
            const qrUrl=`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(url)}&bgcolor=0d0b08&color=ffb3c6&margin=8`;
            const rollnamn=typeof barn.rollnamn==="function"?barn.rollnamn(""):barn.rollnamn;
            return <div key={barn.id} style={{background:"#1a0a10",border:"1px solid #ffb3c644",borderRadius:4,padding:"12px",marginBottom:8}}>
              <div style={{display:"flex",gap:12,alignItems:"center"}}>
                <img src={qrUrl} alt="QR" style={{width:80,height:80,borderRadius:3,flexShrink:0}}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,color:"#ffb3c6",fontFamily:"'Cinzel',serif",marginBottom:4}}>{barn.icon} {rollnamn}</div>
                  <div style={{fontSize:10,color:T.textDim,marginBottom:6}}>{barn.gille}</div>
                  <div style={{fontSize:9,color:"#ffb3c666",wordBreak:"break-all",lineHeight:1.4}}>{url.slice(0,60)}...</div>
                  <button style={{marginTop:6,fontSize:10,background:"transparent",border:"1px solid #ffb3c644",color:"#ffb3c6",borderRadius:3,padding:"3px 8px",cursor:"pointer",fontFamily:"inherit"}} onClick={()=>navigator.clipboard?.writeText(url)}>📋 Kopiera länk</button>
                </div>
              </div>
            </div>;
          })}
          {fordeltaBarn.length>=2&&<div style={{background:"#0a1a0a",border:"1px solid #3d6b3a44",borderRadius:3,padding:"8px 10px",fontSize:11,color:"#a8d5a2"}}>
            ✓ Skicka länkarna till barnen. De öppnar sin roll direkt utan att delta i rollutdelningen på kvällen.
          </div>}
        </div>}
      </div>
      <div style={{...Kort,borderColor:"#cc333355",background:"#120808"}}>
        <div style={{...Lbl,color:"#cc6666"}}>🩸 Kultinfo</div>
        <p style={{fontSize:12,color:"#cc9999",lineHeight:1.7,margin:0}}>1 hemlig Kultledare · 2 Kultmärkta · Resten bybor<br/>Igenkänning: "Mörkret hälsar" → "och natten är lång"</p>
      </div>
      {fordel?.length>0&&<div style={{...Kort,borderColor:"#9999cc44",background:"#080814"}}>
        <div style={{...Lbl,color:"#9999cc"}}>✓ Roller delade – {fordel.length} spelare</div>
        {fordel.map(r=>{
          const rollnamn=typeof r.rollnamn==="function"?r.rollnamn(""):r.rollnamn;
          return <div key={r.id} style={{marginBottom:4}}>
            <div style={{display:"flex",gap:8,padding:"3px 0",borderBottom:`1px solid ${T.kant2}`,fontSize:12,alignItems:"center"}}>
              <span>{r.icon}</span>
              <span style={{color:r.gilleColor||T.guld,flex:1}}>{rollnamn}</span>
              {r.erKultledare&&<span style={{color:"#cc3333",fontSize:10}}>LEDARE</span>}
              {r.kultMarke&&!r.erKultledare&&<span style={{color:"#cc6666",fontSize:10}}>MÄRKT</span>}
              <button style={{fontSize:10,background:"transparent",border:`1px solid ${r.gilleColor||T.kant}44`,color:r.gilleColor||T.guld,borderRadius:3,padding:"2px 8px",cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setVy("rollkort_"+r.id)}>Visa →</button>
            </div>
          </div>;
        })}
      </div>}
      <div style={{...Kort,borderColor:"#c9a84c44"}}>
        <div style={Lbl}>🏺 Artefakter att placera ut</div>
        <p style={{fontSize:11,color:T.textDim,marginBottom:8,lineHeight:1.6}}>Placera ut dessa på tomten innan spelet startar. Deltagare som hittar dem får +15p var.</p>
        {["🪆 Babushka","⛵ Flaskskepp","📖 Helig bok","🐉 Draklåda","🪞 Månkyrkans spegel"].map((a,i)=><div key={i} style={{fontSize:12,color:T.guld,padding:"4px 0",borderBottom:`1px solid ${T.kant2}`}}>{a}</div>)}
      </div>
      <div style={{...Kort,borderColor:"#cc333344",background:"#120808"}}>
        <div style={{...Lbl,color:"#cc6666"}}>🔺 Kultisternas pentagram</div>
        <p style={{fontSize:11,color:"#cc9999",lineHeight:1.6,margin:0}}>Kultledaren får 3 pentagram · Kultmärkta får 2 var.<br/>Placeras diskret på tomten under spelet.<br/>Bybor som hittar dem: +10p · Kultister som placerar alla ostört: +20-30p</p>
      </div>
      <button style={{...BtnH,width:"100%"}} onClick={starta}>Starta – Dela ut roller →</button>
    </>}

    {tab===1&&<div>
      {Object.entries(VINSTVILLKOR).map(([k,v])=><div key={k} style={{...Kort,marginBottom:8,borderColor:v.farg+"44"}}>
        <div style={{fontSize:13,color:v.farg,fontFamily:"'Cinzel',serif",marginBottom:8,fontWeight:700}}>{v.rubrik}</div>
        {v.villkor.map((vv,i)=><p key={i} style={{fontSize:12,color:T.text,margin:"0 0 6px",lineHeight:1.6}}>{vv}</p>)}
        <div style={{marginTop:8,padding:"6px 10px",background:v.farg+"15",borderRadius:3,fontSize:11,color:v.farg,fontStyle:"italic"}}>{v.tips}</div>
      </div>)}
    </div>}

    {tab===2&&<div>
      <div style={{textAlign:"center",padding:"16px 0"}}>
        <div style={{fontSize:40,marginBottom:6}}>⚖️</div>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:18,color:T.guld,marginBottom:4}}>Vägaren</div>
        <div style={{fontSize:11,color:T.textDim,fontStyle:"italic"}}>Tingets röst · Rättvisans väktare · Utan parti</div>
      </div>
      <div style={Kort}>
        <div style={Lbl}>📜 Spelarledarens manus</div>
        {[
          {fas:"INLEDNING",farg:"#c9a84c",
           rader:[
             "Välkommen till Ausås Blotängar. Det är Solståndsnatten – natten då mörkrets krafter är som mest desperata.",
           ],
           tips:"Alla samlade. Tyst. Ögonkontakt med gruppen innan du börjar."},
          {fas:"INSTRUKTIONER",farg:"#c9a84c",
           rader:[
             "Ni spelar var sin hemlig roll ikväll. Ni har uppdrag, förmågor och hemligheter. Ni vet vad ni ska göra – det står i era rollkort.",
             "Tre saker att komma ihåg:",
             "Ett – lita inte på någon.",
             "Två – allt ni gör kan ge poäng. Kom och checka in med mig.",
             "Tre – om ni vill använda en förmåga, köpa en ledtråd eller rapportera något – kom till mig diskret.",
             "Jag är Vägaren. Jag är neutral. Jag dömer. Jag vet allt.",
           ],
           tips:"Paus efter varje punkt. Låt det sjunka in."},
          {fas:"ROLLUTDELNING",farg:"#9999e0",
           rader:[
             "Nu delar vi ut rollerna. En i taget. Räck telefonen vidare.",
           ],
           tips:"Starta rollutdelningen i appen. Vänta tills alla dragit sin roll."},
          {fas:"FAS 1 – ALLIANSER",farg:"#a8d5a2",
           rader:[
             "Solståndsnatten har börjat. Ni har ungefär en timme på er.",
             "Mingla. Bilda allianser. Dela hemligheter – men välj noga vem ni delar dem med.",
             "Ute på tomten har jag gömt fem artefakter. Babushkan, Flaskskeppet, den Heliga boken, Draklådan och Månkyrkans spegel. Den som hittar en artefakt och lämnar den till mig får femton poäng.",
             "Någon av er bär på en hemlig uppgift – att samla fyra bitar av en gammal ramsa. Om den ramsan når mig innan kvällen är slut kan den förändra allt.",
             "Håll utkik. Lyssna noga. Var uppmärksam på vem som rör sig var – och varför.",
             "Kom och checka in med mig när ni gjort något poängvärt. Jag belönar också god stämning, hjälpsamhet och den som ser till att Vägaren aldrig har tomt i glaset.",
             "Musiken sätts på när ert gille begär det. Ni vet vad ni ska göra när den spelas.",
             "Lycka till – ni kommer att behöva det.",
           ],
           tips:"Sätt igång musiken om ett gille ber om det. Håll koll på checkins."},
          {fas:"⚖️ POÄNGSTÄLLNING – EFTER FAS 1",farg:"#c9a84c",
           rader:[
             "Vägaren summerar – så här ser det ut efter Fas ett.",
           ],
           tips:"Gå igenom poängställningen i appen. Lyft fram ledaren och nämn ett gille som ligger bra till. Håll det kort och dramatiskt."},
          {fas:"10 MIN KVAR – FAS 1",farg:"#d4956a",
           rader:[
             "Bybor – tio minuter kvar av Fas ett. Den som har pusseldelar av ramsan – lämna dem till mig nu.",
             "Den som inte hunnit checka in – gör det snart.",
           ],
           tips:"Påminn om rebusen. Ta emot sista checkins."},
          {fas:"FAS 2 – TINGET",farg:"#9999e0",
           rader:[
             "BYBOR! Tinget är öppnat!",
             "Ställ er i en halvcirkel. Tinget kräver ordning.",
             "Vi har anklagelser att behandla. Den som bär en förskriven anklagelse – det är nu den ska framföras.",
             "Den anklagade har sextio sekunder att försvara sig. Sedan har anklagaren trettio sekunder att svara.",
             "Förmågor kan aktiveras under Tinget. Kom till mig diskret.",
             "Tinget är till för misstanke – inte dom. Domen kommer senare.",
           ],
           tips:"Ge ordet till den som har förskriven anklagelse. Håll tiden. Max 2 fria anklagelser efter."},
          {fas:"⚖️ POÄNGSTÄLLNING – EFTER FAS 2",farg:"#c9a84c",
           rader:[
             "Tinget har talat. Vägaren räknar.",
           ],
           tips:"Gå igenom poängställningen. Nämn vem som anklagade och försvarade sig bäst. Bygg spänning inför Ritualen."},
          {fas:"FAS 3 – RITUALEN",farg:"#d4956a",
           rader:[
             "Tinget är stängt. Vägaren har hört vad som sagts.",
             "Midsommarstången kallar. Alla reser sig.",
             "Det är dags för dans och ritual. Gillen – ni vet vad ni ska göra.",
             "Håll ögonen öppna. Håll öronen öppna. Allt ni ser ikväll kan få betydelse vid Domen.",
           ],
           tips:"Spela gilledanserna. Levan Polkka minst en gång. Håll koll på stången."},
          {fas:"⚖️ POÄNGSTÄLLNING – EFTER FAS 3",farg:"#c9a84c",
           rader:[
             "Ritualen är fullbordad. Vägaren väger.",
           ],
           tips:"Sista poängställningen innan Domen. Lyft fram den som leder. Skapa maximal spänning – Domen avgör allt."},
          {fas:"FAS 4 – DOMEN",farg:"#cc3333",
           rader:[
             "Dansen är slut. Solståndsnatten lider mot sitt slut.",
             "Vägaren kräver nu sin dom.",
             "Ni har sett och hört. Ni har dansat och viskat. Ni har anklagat och försvarats.",
             "Nu ska ni peka.",
             "På min räkning pekar ni alla – samtidigt – på den person ni tror bär mörkrets ledarskap.",
             "Tre... två... ett... PEK!",
           ],
           tips:"Räkna långsamt. Dramatisk paus. Avslöja kultmärkta först – sedan kultledaren sist."},
          {fas:"AVSLUTNING",farg:"#c9a84c",
           rader:[
             "Jag har vägt skuld mot oskuld. Vågen har talat.",
           ],
           tips:"Avslöja roller dramatiskt. Presentera poängresultaten sist."},
        ].map((f,i)=><ManusBlock key={i} f={f}/>)}
      </div>
      <div style={{...Kort,borderColor:"#9999cc44",background:"#080814"}}>
        <div style={{...Lbl,color:"#9999cc"}}>🧩 Rebuslösningen</div>
        <p style={{fontSize:12,color:T.textDim,lineHeight:1.6,margin:"0 0 10px"}}>Om byborna löser rebusen INNAN Fas 3 och lämnar meningen till dig – berätta:</p>
        <div style={{background:"#0a0a18",border:"1px solid #9999cc44",borderRadius:4,padding:"12px",marginBottom:10}}>
          <p style={{fontSize:13,color:"#ccccff",lineHeight:1.8,margin:0,fontStyle:"italic"}}>"{REBUS_LOSNING}"</p>
        </div>
        <div style={{background:"#080814",border:"1px solid #9999cc22",borderRadius:4,padding:"10px"}}>
          <div style={{fontSize:10,color:"#9999cc",letterSpacing:2,marginBottom:6}}>RAMSAN (samlas via kedjorna av rebussamlaren)</div>
          <p style={{fontSize:12,color:"#ffe8b0",lineHeight:1.7,margin:0,fontStyle:"italic"}}>"{REBUS_RAMSA}"</p>
        </div>
        <div style={{background:"#080814",border:"1px solid #9999cc22",borderRadius:4,padding:"10px",marginTop:8}}>
          <div style={{fontSize:10,color:"#9999cc",letterSpacing:2,marginBottom:6}}>REBUSSAMLAREN (första bybo i prioritetslistan)</div>
          <p style={{fontSize:12,color:T.textDim,lineHeight:1.7,margin:0}}>Prioritet: Runläsaren → Kloka Gumman/Gubben → Den Resande. Första som inte är kultist får uppdraget.</p>
        </div>
      </div>
      <div style={{...Kort,borderColor:"#cc333344",background:"#120808"}}>
        <div style={{...Lbl,color:"#cc6666"}}>🩸 Kultens falska rykten</div>
        <p style={{fontSize:11,color:T.textDim,marginBottom:8,lineHeight:1.5}}>Om Kultledaren köper falskt rykte (30p) – välj ett och viska diskret till 1-2 spelare:</p>
        {FALSKA_RYKTEN.map((r,i)=><div key={i} style={{fontSize:11,color:"#cc9999",padding:"5px 0",borderBottom:`1px solid ${T.kant2}`,fontStyle:"italic"}}>"{r}"</div>)}
      </div>
    </div>}

    {tab===3&&<PoangAdmin spelare={spelare} setSpelare={setSpelare} fordel={fordel}/>}
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
      rb:roll.erRebussamlare?1:0,
      pd:roll.polkkaDir||null,
      ai:roll.anklagelse?.id||"",
      kid:roll.kedjor?roll.kedjor.map(k=>k.id).join(","):"",
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
  const [vald,setVald]=useState(null);
  const vuxna=ROLLER_MASTER.filter(r=>!r.barnroll);
  const barn=ROLLER_MASTER.filter(r=>r.barnroll);
  const roll=vald?ROLLER_MASTER.find(r=>r.id===vald):null;

  if(roll){
    const ac=roll.barnroll?"#ffb3c6":roll.gilleColor||T.guld;
    const rollnamn=typeof roll.rollnamn==="function"?roll.rollnamn(""):roll.rollnamn;
    const barnUppg=roll.barnroll?ROLL_UPPGIFTER[roll.id]:null;
    return <div style={Sida}>
      <button style={Tillbaka} onClick={()=>setVald(null)}>← Tillbaka</button>
      <div style={{textAlign:"center",padding:"20px 0 16px"}}>
        <div style={{fontSize:44,marginBottom:8}}>{roll.icon}</div>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:22,color:ac,marginBottom:4}}>{rollnamn}</div>
        <div style={{fontSize:11,color:T.textDim,letterSpacing:2}}>{roll.gille?.toUpperCase()}</div>
      </div>
      <div style={{...Kort,borderColor:ac+"44"}}>
        <span style={{...Lbl,color:ac}}>KARAKTÄR</span>
        <p style={{fontSize:14,color:T.text,lineHeight:1.8,margin:0}}>{roll.karaktar}</p>
      </div>
      {roll.tips&&<div style={{...Kort,borderColor:ac+"22",background:"#08080a"}}>
        <span style={{...Lbl,color:T.textDim}}>SPELTIPS</span>
        <p style={{fontSize:13,color:T.textDim,lineHeight:1.7,margin:0,fontStyle:"italic"}}>{roll.tips}</p>
      </div>}
      <div style={{...Kort,borderColor:ac+"44"}}>
        <span style={{...Lbl,color:ac}}>FÖRMÅGOR & HYSS</span>
        {[roll.foermaga,roll.foermaga2].filter(Boolean).map((f,i)=>{
          const poangMatch=f.match(/[+\-]\d+p/g);
          const engangMatch=f.includes("En gång");
          const tvaGanger=f.includes("Kan användas två gånger");
          return <div key={i} style={{padding:"12px 0",borderBottom:i===0?`1px solid ${T.kant2}`:"none"}}>
            <div style={{fontSize:13,color:T.text,lineHeight:1.8,marginBottom:6}}>{f}</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:4}}>
              {poangMatch&&poangMatch.map((p,j)=><span key={j} style={{fontSize:11,background:p.startsWith("-")?"#cc333322":"#33cc6622",color:p.startsWith("-")?"#cc6666":"#a8d5a2",border:`1px solid ${p.startsWith("-")?"#cc333344":"#33cc6644"}`,borderRadius:3,padding:"2px 7px"}}>{p}</span>)}
              {engangMatch&&!tvaGanger&&<span style={{fontSize:11,background:"#c9a84c22",color:T.guld,border:"1px solid #c9a84c44",borderRadius:3,padding:"2px 7px"}}>En gång</span>}
              {tvaGanger&&<span style={{fontSize:11,background:"#c9a84c22",color:T.guld,border:"1px solid #c9a84c44",borderRadius:3,padding:"2px 7px"}}>Två gånger</span>}
            </div>
          </div>;
        })}
      </div>
      {barnUppg&&<div style={{...Kort,borderColor:ac+"44"}}>
        <span style={{...Lbl,color:ac}}>POÄNGLISTA</span>
        {barnUppg.map((u,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:i<barnUppg.length-1?`1px solid ${T.kant2}`:"none"}}>
          <span style={{fontSize:12,color:T.text,lineHeight:1.5,flex:1}}>{u.label}</span>
          <span style={{fontSize:12,color:"#a8d5a2",fontFamily:"'Cinzel',serif",marginLeft:12,flexShrink:0}}>+{u.poang}p</span>
        </div>)}
      </div>}
    </div>;
  }

  return <div style={Sida}>
    <button style={Tillbaka} onClick={()=>setVy("spelledare")}>← Tillbaka</button>
    <h2 style={SRubrik}>🎭 Roller &amp; relationer</h2>
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
    <div style={{...Kort,borderColor:"#c9a84c22",marginBottom:16}}>
      <p style={{fontSize:12,color:T.textDim,fontStyle:"italic",lineHeight:1.7,margin:0}}>Klicka på en roll för att läsa mer. Förmågornas fulla text slumpas ut vid rollutdelning.</p>
    </div>
    {[
      {label:"🌿 Örtagillet",ids:["kloka","ortmastaren","gronskan"]},
      {label:"⚒ Smederna",ids:["mastersmeden","soldaten","glodviskaren"]},
      {label:"🌙 Månkyrkan",ids:["hogprasten","runlaesaren","munken"]},
      {label:"🧳 Övriga",ids:["den_resande"]}
    ].map(g=><div key={g.label} style={{marginBottom:16}}>
      <div style={{fontSize:10,color:T.textDim,letterSpacing:3,marginBottom:8,paddingLeft:2}}>{g.label}</div>
      {vuxna.filter(r=>g.ids.includes(r.id)).map(r=>{
        const ac=r.gilleColor||T.guld;
        const rollnamn=typeof r.rollnamn==="function"?r.rollnamn(""):r.rollnamn;
        return <button key={r.id} style={{width:"100%",background:T.papper,border:`1px solid ${ac}33`,borderRadius:4,padding:"12px 14px",marginBottom:6,cursor:"pointer",textAlign:"left",fontFamily:"inherit",display:"flex",alignItems:"center",gap:12}} onClick={()=>setVald(r.id)}>
          <span style={{fontSize:26,flexShrink:0}}>{r.icon}</span>
          <div style={{flex:1}}>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:13,color:ac,marginBottom:3}}>{rollnamn}</div>
            <div style={{fontSize:11,color:T.textDim,lineHeight:1.5}}>{r.karaktar?.slice(0,80)}...</div>
          </div>
          <span style={{fontSize:10,color:T.textDim}}>▶</span>
        </button>;
      })}
    </div>)}
    {barn.length>0&&<div style={{marginBottom:16}}>
      <div style={{fontSize:10,color:"#ffb3c6",letterSpacing:3,marginBottom:8,paddingLeft:2}}>🌸 BARNROLLER</div>
      {barn.map(r=>{
        const rollnamn=typeof r.rollnamn==="function"?r.rollnamn(""):r.rollnamn;
        return <button key={r.id} style={{width:"100%",background:T.papper,border:"1px solid #ffb3c633",borderRadius:4,padding:"12px 14px",marginBottom:6,cursor:"pointer",textAlign:"left",fontFamily:"inherit",display:"flex",alignItems:"center",gap:12}} onClick={()=>setVald(r.id)}>
          <span style={{fontSize:26,flexShrink:0}}>{r.icon}</span>
          <div style={{flex:1}}>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:13,color:"#ffb3c6",marginBottom:3}}>{rollnamn}</div>
            <div style={{fontSize:11,color:T.textDim,lineHeight:1.5}}>{r.karaktar?.slice(0,80)}...</div>
          </div>
          <span style={{fontSize:10,color:T.textDim}}>▶</span>
        </button>;
      })}
    </div>}
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


// ─── REGELVY ──────────────────────────────────────────────────────────────────
const REGLER = [
  {titel:"Spelets syfte",icon:"⚖️",farg:"#c9a84c",text:"Midsommarblot är ett socialt spel om lögner, allianser och avslöjanden.\n\nAlla tillhör ett gille – Örtagillet, Smederna eller Månkyrkan. Men bland er gömmer sig Mörkblotets Kult.\n\nByborna försöker avslöja Kultledaren. Kulten försöker överleva oavslöjad.\n\nDu tävlar på tre nivåer: individuellt, med ditt gille och på din sida (By vs Kult).\n\nKom ihåg – även om din sida förlorar kan du vinna som individ."},
  {titel:"Kvällens faser",icon:"🕐",farg:"#c9a84c",text:"FAS 1 – ALLIANSER\nMingla, bilda allianser, dela hemligheter, genomför uppdrag. Danser uppstår spontant när ett gille begär det.\n\nFAS 2 – TINGET\nFormella anklagelser framförs inför alla. Den anklagade försvarar sig i 60 sekunder. Anklagaren svarar i 30 sekunder. Inga roller avslöjas – Tinget skapar misstanke, inte dom.\n\nFAS 3 – RITUALEN & DANSEN\nGilledanser genomförs vid stången. Håll ögonen öppna – allt ni ser kan få betydelse vid Domen.\n\nFAS 4 – DOMEN\nAlla pekar samtidigt på den de tror är Kultledaren. Rollerna avslöjas dramatiskt."},
  {titel:"Gillen",icon:"🏛️",farg:"#c9a84c",text:"🌿 ÖRTAGILLET\nByns visdomsbärare. Rör sig mjukt men ser allt. Styrkan ligger i observation, subtila förmågor och allianser.\n\n⚒ SMEDERNA\nByns starka arm. Direkta, skeptiska och handlingskraftiga. Styrkan ligger i anklagelser, koordination och att skapa tryck.\n\n🌙 MÅNKYRKAN\nByns andliga röst. Rör sig i mystik och högtidlighet. Styrkan ligger i manipulation, ritualer och att forma stämningen.\n\n🧳 DEN RESANDE\nFriflygaren utan hem. Tävlar inte på gillenivå – bara individuellt och på sida. Handelsvaran är information."},
  {titel:"Viktiga begrepp",icon:"📖",farg:"#c9a84c",text:"VÄGAREN – Spelets domare. Den enda som vet alla rollernas sanna identitet. Vägarens ord är lag.\n\nALLIANS – Formell överenskommelse registrerad hos Vägaren. En bruten allians ger minuspoäng.\n\nANKLAGELSE – Formell beskyllning vid Tinget. Ger poäng om den är välgrundad.\n\nFÖRMÅGA – Varje karaktär har två unika förmågor. Aktiveras alltid genom att berätta för Vägaren – aldrig på egen hand.\n\nINLÖSEN – Poäng kan bytas mot fördelar hos Vägaren: ledtrådar om Kultledaren, extra pekningar vid Domen eller immunitet.\n\nKEDJOR – Hemliga informationskedjor mellan specifika roller. Säg rätt fras, få rätt svar, dela en pusselbit.\n\nARTEFAKT – Speciella föremål med koppling till kvällens händelser. Mer om artefakterna framgår av ditt rollkort."},
  {titel:"Förmågor",icon:"✨",farg:"#c9a84c",text:"Varje roll har två unika förmågor som kan vända kvällens utgång.\n\nFörmågor aktiveras ALLTID genom Vägaren – gå diskret fram och meddela vad du vill göra. Aldrig på egen hand.\n\nFörmågor märkta med 'En gång' kan bara användas en gång under hela kvällen – välj ögonblicket noga.\n\nNågra förmågor kräver att du agerar fysiskt eller verbalt – läs din förmåga noga i ditt rollkort.\n\nVägaren bedömer om en förmåga lyckas och ger poäng därefter."},
  {titel:"Dansen",icon:"🎵",farg:"#c9a84c",text:"Dans är en naturlig del av midsommarfirandet – men varje dans är också ett uppdrag.\n\nDitt rollkort innehåller hemliga dansdirektiv för varje låt. Dessa är unika för din karaktär och ger poäng om de genomförs.\n\nGILLEDANSER är gemensamma uppdrag där hela gillet dansar på ett specifikt sätt. Lyckas alla bidrar det till gillebonusen.\n\nDanser kan uppstå i både Fas 1 och Fas 3 – var redo när musiken sätts på.\n\nVar uppmärksam – andra observerar dig lika mycket som du observerar dem."},
  {titel:"Poängsystemet",icon:"💰",farg:"#c9a84c",text:"INDIVIDUELLT – Uppdrag, förmågor, allianser, dans, artefakter.\n\nGILLEBONUS +30p – Om hela gillet slutför sina gemensamma uppdrag.\n\nSIDBONUS – Byn vinner: +60p till alla bybor · Kulten vinner: +100p till kultister\n\nDOMSPOÄNG – Rätt på kultmärkt: +20p · Rätt på Kultledaren: +40p · Fel: -5p\n\nLEDTRÅDAR – Lös in poäng hos Vägaren mot information om Kultledaren. Tre nivåer – ju dyrare, ju mer avslöjande.\n\nVägaren kan också belöna god stämning, generositet och hjälpsamhet efter eget omdöme."},
  {titel:"Domen",icon:"🗳️",farg:"#c9a84c",text:"Domen är kvällens dramatiska klimax.\n\nAlla samlas. Ingen får diskutera högt.\n\nVägaren räknar ned: TRE – TVÅ – ETT – alla pekar samtidigt på den de tror bär mörkrets ledarskap.\n\nIngen får vänta och se vart andra pekar.\n\nVissa pekningar väger tyngre än andra – beroende på förmågor och inlösningar gjorda under kvällen.\n\nVägaren räknar pekningarna och avslöjar utfallet dramatiskt."},
  {titel:"Vinstvillkor",icon:"🏆",farg:"#c9a84c",text:"BYBORNA VINNER OM Kultledaren pekas ut och avslöjas vid Domen.\n\nKULTEN VINNER OM Kultledaren överlever oavslöjad.\n\nOAVGJORT om situationen är oklar. Vägaren avgör.\n\nKom ihåg – du tävlar också individuellt och på gillenivå! Spelet avgörs inte bara av vem som hittar Kultledaren."},
  {titel:"Allmänna regler",icon:"📜",farg:"#c9a84c",text:"• Din roll är hemlig – visa aldrig ditt rollkort för någon annan spelare\n• Lögner är tillåtna och uppmuntrade – det är en del av spelet\n• Förmågor aktiveras alltid genom Vägaren, aldrig på egen hand\n• Allianser måste registreras hos Vägaren för att ge poäng\n• Checka in med Vägaren när du gjort något poängvärt\n• Fråga alltid Vägaren om du är osäker – aldrig en annan spelare\n• Barnroller har förenklade uppdrag och egna regler\n• Ha kul – det är midsommar!"},
];

function RegelVy({setVy}){
  const [open,setOpen]=useState({});
  const toggle=(i)=>setOpen(prev=>({...prev,[i]:!prev[i]}));
  return <div style={Sida}>
    <button style={Tillbaka} onClick={()=>setVy("start")}>← Tillbaka</button>
    <h2 style={SRubrik}>📜 Spelregler</h2>
    <div style={{...Kort,borderColor:"#c9a84c44",background:"#0a0800",marginBottom:16,textAlign:"center"}}>
      <p style={{fontSize:13,color:T.text,fontStyle:"italic",lineHeight:1.8,margin:0}}>
        Läs igenom reglerna innan kvällen börjar.<br/>
        Din hemliga roll får du via appen när kvällen startar.
      </p>
      <div style={{marginTop:10,fontSize:11,color:T.textDim}}>
        Dela denna sida: <span style={{color:T.guld,fontSize:10}}>midsommarblot.vercel.app/#regler</span>
      </div>
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
        <p style={{fontSize:12,color:"#cc9999",lineHeight:1.6,margin:0}}>Kultmedlemmar bär INGET kännetecken. De döljer sig bland er.<br/><br/>Om någon säger "Mörkret hälsar" – svara "och natten är lång" om du är kultmärkt.</p>
      </div>
    </div>}

    {/* REGLER */}
    {tab===2&&<RegelVy setVy={()=>{}}/>}
  </div>;
}

export default function App(){
  // Kolla om vi är i spelarläge (QR-länk)
  const hash=window.location.hash||"";
  if(hash==="#regler"){
    return <div style={{minHeight:"100vh",background:T.bg,color:T.text,fontFamily:"'IM Fell English',Georgia,serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=IM+Fell+English:ital@0;1&display=swap');*{box-sizing:border-box}body{margin:0;background:#0d0b08}`}</style>
      <div style={{background:"#0a0800",borderBottom:`1px solid ${T.kant}`,padding:"10px 16px",textAlign:"center"}}>
        <div style={{fontSize:9,letterSpacing:4,color:T.guldDim,fontFamily:"monospace"}}>MIDSOMMARBLOT · AUSÅS BLOTÄNGAR · 19 JUNI 2026</div>
      </div>
      <RegelVy setVy={()=>{}}/>
    </div>;
  }

  if(hash.startsWith("#roll=")&&hash.length>6){
    try{
      const enkodad=hash.slice(6);
      const mini=JSON.parse(atob(enkodad));
      if(mini&&mini.id){
        // Slå upp full rolldata från ROLLER_MASTER
        const basRoll=ROLLER_MASTER.find(r=>r.id===mini.id);
        if(basRoll){
          const kultmarken_alla=KULTMARKEN;
          // Rekonstruera kedjor från aktiva kedja-ids
          const aktivaKedjeIds=mini.kid?mini.kid.split(",").filter(Boolean):[];
          const alleRollerIds=ROLLER_MASTER.map(r=>r.id);
          const rekonstrueradeKedjor=aktivaKedjeIds.length>0?byggKedjor(alleRollerIds,[]).filter(k=>aktivaKedjeIds.includes(k.id)):[];

          // Rekonstruera anklagelse
          const anklagelse=mini.ai?ANKLAGELSE_POOL.find(a=>a.id===mini.ai)||null:null;

          const rollData={
            ...basRoll,
            rollnamn:typeof basRoll.rollnamn==="function"?basRoll.rollnamn(mini.kon):basRoll.rollnamn,
            erKultledare:mini.erk===1,
            kultMarke:mini.km?kultmarken_alla.find(k=>k.id===mini.km)||null:null,
            spelarKon:mini.kon,
            spelarAlder:mini.alder,
            polkkaDir:mini.pd||null,
            erRebussamlare:mini.rb===1,
            anklagelse:anklagelse,
            kedjor:rekonstrueradeKedjor,
            aktivaIds:mini.bi?mini.bi.split(",").filter(Boolean):alleRollerIds,
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
  const [barnGillenVal,setBarnGillenVal]=useState([]);
  const [fordeltaBarn,setFordeltaBarn]=useState([]); // barnroller som delats ut i förväg
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
    setFordel(blandaOchTilldela(antalBarn, fordeltaBarn.map(r=>r.id)));
    setIdx(0);reset();setVy("drag");
  }
  function reset(){setRoll(null);setAvslojar(false);setBekr(false);setAlder("");setKon(null);setAlderKlar(false);}
  function bekraftaAlder(){
    const a=parseInt(alder);
    if(!alder||isNaN(a)||a<1||a>120||!kon)return;
    setAlderKlar(true);

    // Hitta redan använda roller (de som visats för tidigare spelare)
    const anvandaIds=fordel.filter(r=>r._använd).map(r=>r.id);

    let tilldelad;
    if(a<10){
      // Barn: ge nästa oanvänd barnroll
      const ledigBarn=fordel.find(r=>r.barnroll&&!anvandaIds.includes(r.id));
      tilldelad=ledigBarn||fordel.find(r=>r.barnroll)||fordel[idx];
    } else {
      // Vuxen: ge nästa oanvänd vuxenroll
      const ledigVuxen=fordel.find(r=>!r.barnroll&&!anvandaIds.includes(r.id));
      tilldelad=ledigVuxen||fordel[idx];
    }

    // Märk som använd
    setFordel(prev=>prev.map(r=>r.id===tilldelad.id?{...r,_använd:true}:r));
    setRoll(tilldelad);
    setAvslojar(false);setBekr(false);
  }
  function nasta(){setIdx(i=>i+1);reset();}
  const klart=idx>=fordel.length&&fordel.length>0;

  const css=`@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=IM+Fell+English:ital@0;1&display=swap');*{box-sizing:border-box}body{margin:0;background:#0d0b08}button:active{opacity:.8}input:focus{outline:none;border-color:#c9a84c!important}`;

  return <div style={{minHeight:"100vh",background:T.bg,color:T.text,fontFamily:"'IM Fell English',Georgia,serif",paddingBottom:60}}>
    <style>{css}</style>
    {vy==="start"&&<StartVy setVy={setVy}/>}
    {vy==="spelledare"&&<SpelledarVy setVy={setVy} starta={starta} tab={sTab} setTab={setSTab} antalBarn={antalBarn} setAntalBarn={setAntalBarn} spelare={spelare} setSpelare={setSpelare} domAvslojad={domAvslojad} setDomAvslojad={setDomAvslojad} fordel={fordel} barnGillenVal={barnGillenVal} setBarnGillenVal={setBarnGillenVal} fordeltaBarn={fordeltaBarn} setFordeltaBarn={setFordeltaBarn}/>}
    {vy==="deltagare"&&<DeltagarVy setVy={setVy} kontaktlista={kontaktlista} setKontaktlista={setKontaktlista}/>}
    {vy==="drag"&&<DragVy fordel={fordel} idx={idx} roll={roll} avslojar={avslojar} bekr={bekr} klart={klart} alder={alder} setAlder={setAlder} kon={kon} setKon={setKon} alderKlar={alderKlar} bekraftaAlder={bekraftaAlder} setAvslojar={setAvslojar} setBekr={setBekr} nasta={nasta} setVy={setVy}/>}
    {vy==="guide"&&<GuideVy setVy={setVy}/>}
    {vy.startsWith("rollkort_")&&fordel.length>0&&(()=>{
      const rollId=vy.replace("rollkort_","");
      const r=fordel.find(x=>x.id===rollId);
      if(!r)return null;
      return <div style={{minHeight:"100vh",background:T.bg,paddingBottom:60}}>
        <div style={{padding:"12px 16px",borderBottom:`1px solid ${T.kant}`,display:"flex",alignItems:"center",gap:10}}>
          <button style={Tillbaka} onClick={()=>setVy("spelledare")}>← Tillbaka</button>
          <span style={{fontSize:11,color:T.textDim,fontStyle:"italic"}}>Spelledarvy – {typeof r.rollnamn==="function"?r.rollnamn(""):r.rollnamn}</span>
          {r.erKultledare&&<span style={{fontSize:10,color:"#cc3333",padding:"2px 8px",border:"1px solid #cc333344",borderRadius:3}}>KULTLEDARE</span>}
          {r.kultMarke&&!r.erKultledare&&<span style={{fontSize:10,color:"#cc6666",padding:"2px 8px",border:"1px solid #cc666644",borderRadius:3}}>KULTMÄRKT</span>}
        </div>
        <RollKort roll={r} onBekrafta={null} spelarKon={r.spelarKon||""} spelarAlder={r.spelarAlder||""}/>
      </div>;
    })()}
    {vy==="regler"&&<RegelVy setVy={setVy}/>}
    {vy==="poang"&&<PoangVy spelare={spelare} domAvslojad={domAvslojad} setDomAvslojad={setDomAvslojad} setVy={setVy}/>}
  </div>;
}
