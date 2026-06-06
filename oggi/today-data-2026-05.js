(function(){
"use strict";

  if(!window.AGENDA_TODAY_DATA) {
    window.AGENDA_TODAY_DATA = { byDay: {} };
  }

  if(!window.AGENDA_TODAY_DATA.byDay) {
    window.AGENDA_TODAY_DATA.byDay = {};
  }

  Object.assign(window.AGENDA_TODAY_DATA.byDay, {
      "05-01": {
        feast: {
          holiday: "Festa dei Lavoratori",
          holidayAlt: "Primo Maggio",
          saint: "San Giuseppe Artigiano",
          saintType: "sposo di Maria, custode della Santa Famiglia e patrono dei lavoratori",
          saintBio: "San Giuseppe, uomo giusto della casa di Davide, fu il custode di Gesu e di Maria. La memoria di San Giuseppe Artigiano mette in risalto il suo lavoro umile di falegname e la dignita del lavoro umano vissuto con fede.",
          saintQuote: null
        },
        history: {
          year: 1886,
          title: "A Chicago inizia lo sciopero che porta a Haymarket.",
          text: "Dalle proteste per la giornata di otto ore nasce il simbolo storico del Primo Maggio."
        },
        proverb: {
          original: "Né de mazzo, né de mazzon, no te levâ o pelisson",
          translation: "Né a maggio, né a giugno (maggione), non toglierti il cappotto (invito alla prudenza per i cali termici).",
          note: "Maggio può illudere: il proverbio invita a non scoprirsi troppo presto."
        },
        foodNote: "Tradizione assoluta: fave, salame (di Sant'Olcese) e sardo fresco. La scampagnata classica dei genovesi.",
        heroSubline: "Sciùtte e pùie e bagnæ e fùie.",
        practicalTip: "Tipica brezza di mare (o maistrâ) che rinfresca il pomeriggio. Mare calmo."
      },
      "05-02": {
        feast: {
          holiday: "",
          holidayAlt: "",
          saint: "Sant'Atanasio di Alessandria",
          saintType: "vescovo, dottore della Chiesa e difensore della fede",
          saintBio: "Patriarca di Alessandria nel IV secolo, fu il grande oppositore dell'arianesimo e uno dei protagonisti del Concilio di Nicea. Affronto esili e persecuzioni pur di difendere la piena divinita di Cristo.",
          saintQuote: "Dio si e fatto uomo perche l'uomo diventi Dio."
        },
        history: {
          year: 1519,
          title: "Muore Leonardo da Vinci ad Amboise.",
          text: "Si spegne una delle menti più straordinarie del Rinascimento, tra arte, scienza e invenzione."
        },
        proverb: {
          original: "Mazzo ortolan, tanta paggia e poco gran",
          translation: "Maggio troppo piovoso fa crescere molta paglia ma poco grano.",
          note: "Detto agricolo: troppa pioggia fa crescere il campo, ma non sempre il raccolto."
        },
        foodNote: "Il basilico di Pra' inizia a dare il meglio di sé grazie alle temperature miti. Tempo di fare il primo vero pesto dell'anno.",
        heroSubline: "Ogni fegatetto o l'ha o so amaretto.",
        practicalTip: "Giornata di transizione; le temperature minime si assestano sui 14°C."
      },
      "05-03": {
        feast: {
          holiday: "Quinta Domenica di Pasqua",
          holidayAlt: "",
          saint: "Santi Filippo e Giacomo, apostoli",
          saintType: "apostoli",
          saintBio: "La liturgia ricorda insieme gli apostoli Filippo e Giacomo il Minore. Filippo compare spesso nel Vangelo come discepolo pronto a cercare Cristo, mentre Giacomo fu una figura importante della Chiesa di Gerusalemme e testimone fedele della risurrezione.",
          saintQuote: null
        },
        history: {
          year: 1937,
          title: "Esce il romanzo Via col vento.",
          text: "Il libro di Margaret Mitchell diventa presto un caso editoriale mondiale."
        },
        proverb: {
          original: "Mazzo asciutto, gran per tutto",
          translation: "Maggio asciutto garantisce grano ovunque.",
          note: "Secco ma ottimista: un maggio asciutto promette bene per i cereali."
        },
        foodNote: "Erbe spontanee: è il momento di raccogliere la borragine per i ripieni dei pansoti.",
        heroSubline: "In te l'incertezza, tègni a drita.",
        practicalTip: "Luna Piena. In mare si osservano le \"marea di Luna\", con escursioni più marcate nel porto."
      },
      "05-04": {
        feast: {
          holiday: "",
          holidayAlt: "",
          saint: "San Silvano; San Nereo",
          saintType: "testimone della fede dei primi secoli; martire della Chiesa antica",
          saintBio: "In questa data la tradizione ricorda san Silvano e san Nereo tra i santi dei primi secoli cristiani. Il loro ricordo richiama la fedelta dei testimoni antichi, spesso venerati piu per la fermezza nella fede che per l'abbondanza di notizie biografiche.",
          saintQuote: null
        },
        history: {
          year: 1949,
          title: "La tragedia di Superga spezza il Grande Torino.",
          text: "L'incidente aereo cancella una delle squadre più forti e amate della storia del calcio italiano."
        },
        proverb: {
          original: "S'o ciêuve o quattro de mazzo, o ciêuve quaranta giorni d'appresso",
          translation: "Se piove il 4 maggio (Santa Monica), piove per i successivi 40 giorni.",
          note: "Proverbio meteorologico netto, quasi da calendario contadino."
        },
        foodNote: "Nelle pescherie compaiono i bianchetti (se la stagione lo permette) da fare in frittella o scottati.",
        heroSubline: "O scigo o n'ha mai dæto bòn pan.",
        practicalTip: "Possibile comparsa della \"Lupa\": la nebbia marina causata dall'aria calda sull'acqua ancora fredda."
      },
      "05-05": {
        feast: {
          holiday: "",
          holidayAlt: "",
          saint: "San Gioviniano",
          saintType: "martire dei primi secoli",
          saintBio: "San Gioviniano e ricordato dalla tradizione come martire cristiano. La sua memoria appartiene a quel vasto gruppo di santi antichi di cui si conservano poche notizie storiche ma una duratura venerazione liturgica.",
          saintQuote: null
        },
        history: {
          year: 1821,
          title: "Muore Napoleone Bonaparte a Sant'Elena.",
          text: "Finisce in esilio la parabola dell'uomo che ha ridisegnato l'Europa tra rivoluzione e impero."
        },
        proverb: {
          original: "Mazzo fiorìo, d’agosto o l’è finìo",
          translation: "Se tutto fiorisce troppo presto a maggio, il raccolto ad agosto sarà già terminato o scarso.",
          note: "Avverte contro una primavera troppo anticipata, bella ma non sempre generosa."
        },
        foodNote: "Le zucchine trombetta di Albenga arrivano sui banchi del mercato: dolcissime e croccanti.",
        heroSubline: "Fa bèn e scòrditelo, fa mâ e pensaghe.",
        practicalTip: "Umidità in aumento. Le prime rose fioriscono nei giardini di Nervi."
      },
      "05-06": {
        feast: {
          holiday: "",
          holidayAlt: "",
          saint: "San Giuditta; San Venerio",
          saintType: "testimone della fede; eremita",
          saintBio: "La tradizione ricorda san Giuditta accanto a san Venerio, eremita molto venerato in Liguria e legato all'isola del Tino. Venerio visse una vita di preghiera, penitenza e solitudine, diventando un punto di riferimento spirituale per i naviganti e per le comunita della costa.",
          saintQuote: null
        },
        history: {
          year: 1937,
          title: "L'Hindenburg va in fiamme nel New Jersey.",
          text: "Il disastro diventa l'immagine più celebre del tramonto dei grandi dirigibili."
        },
        proverb: {
          original: "A-o primmo de mazzo o l’asino o se scassa",
          translation: "Al primo di maggio l’asino si scalcia (per il primo caldo).",
          note: "Immagine rustica e vivace: con il primo caldo anche gli animali cambiano umore."
        },
        foodNote: "Tempo di farinata cotta nel forno a legna; col fresco della sera è ancora perfetta.",
        heroSubline: "Â prestâ e palanche à un amigo, ti perdi e palanche e ti perdi l’amigo.",
        practicalTip: "Vento di tramontana scura se arriva una perturbazione, con mare che increspa al largo."
      },
      "05-07": {
        feast: {
          holiday: "",
          holidayAlt: "",
          saint: "San Flavia; San Augusto",
          saintType: "santi dei primi secoli",
          saintBio: "San Flavia e san Augusto appartengono al novero dei santi antichi ricordati dalla tradizione cristiana. La loro memoria e sobria, ma richiama la continuita silenziosa della santita vissuta nei primi tempi della Chiesa.",
          saintQuote: null
        },
        history: {
          year: 1915,
          title: "Il Lusitania viene affondato da un U-Boot tedesco.",
          text: "La tragedia scuote l'opinione pubblica e avvicina gli Stati Uniti alla guerra."
        },
        proverb: {
          original: "In mazzo l'ase o se gratta o cû",
          translation: "In maggio l'asino si gratta il sedere (segno di eccitazione per la primavera inoltrata).",
          note: "Detto scherzoso e popolare sulla primavera piena."
        },
        foodNote: "I carciofi di Albenga sono alla fine della stagione: ideali da conservare sott'olio.",
        heroSubline: "O gattiño de San Benigno o l’aveiva l’anima in scio mento.",
        practicalTip: "Cielo terso. La costellazione del Leone domina il cielo serale a Sud."
      },
      "05-08": {
        feast: {
          holiday: "",
          holidayAlt: "",
          saint: "San Vittore M.; Beata Vergine del Rosario di Pompei",
          saintType: "martire; memoria mariana",
          saintBio: "San Vittore e venerato come martire dei primi secoli. Nello stesso giorno la devozione popolare celebra la Beata Vergine del Rosario di Pompei, legata in modo particolare all'opera di Bartolo Longo e alla preghiera del Rosario come via di consolazione e speranza.",
          saintQuote: null
        },
        history: {
          year: 1945,
          title: "La Germania firma la resa: è il V-E Day.",
          text: "Per l'Europa la guerra finisce ufficialmente, anche se il conflitto mondiale non è ancora concluso in Asia."
        },
        proverb: {
          original: "Mazzo o fa o fî e Giugno o fa o fior",
          translation: "Maggio prepara il filo (delle piante) e giugno fa il fiore.",
          note: "Molto agricolo: maggio prepara, giugno compie."
        },
        foodNote: "Un calice di Pigato fresco è il compagno ideale per i piatti di verdure primaverili.",
        heroSubline: "Zena de drento, Zena de feua, chi n’ha palanche ch’o se ne vaia feua.",
        practicalTip: "Temperature massime verso i 20°C. Inizia il periodo ideale per la pesca alle seppie."
      },
      "05-09": {
        feast: {
          holiday: "Giornata dell'Europa",
          holidayAlt: "Europe Day",
          saint: "San Gregorio Ostiense",
          saintType: "vescovo",
          saintBio: "Vescovo di Ostia nell'XI secolo, fu inviato come legato pontificio in Spagna e vi fu molto venerato. La tradizione popolare lo invoca come protettore dei campi e dei raccolti contro le calamita e le infestazioni.",
          saintQuote: null
        },
        history: {
          year: 1978,
          title: "Aldo Moro e Peppino Impastato vengono ritrovati uccisi.",
          text: "In Italia il 9 maggio resta una data simbolica di terrorismo politico e violenza mafiosa."
        },
        proverb: {
          original: "Arvî o fa o fûeggio e Mazzo o fa o fî",
          translation: "Aprile fa la foglia e maggio fa il filo.",
          note: "Bello nel passaggio tra i due mesi: aprile apre, maggio porta avanti."
        },
        foodNote: "Dolcezza di stagione: le fragole della zona di Finale Ligure o dell'entroterra sono al picco della maturazione.",
        heroSubline: "Scioppa de mazzon e no mangiâ de liron.",
        practicalTip: "La Luna in Apogeo (punto più lontano dalla Terra). Effetti gravitazionali minimi: maree stabili e \"stanche\"."
      },
      "05-10": {
        feast: {
          holiday: "Festa della Mamma",
          holidayAlt: "Sesta Domenica di Pasqua",
          saint: "Sant'Alfio",
          saintType: "martire",
          saintBio: "Sant'Alfio e ricordato insieme ai fratelli Filadelfo e Cirino, con i quali condivise il martirio. La loro vicenda, molto venerata in Sicilia, e segno di coraggio e fedelta a Cristo fino alla prova estrema.",
          saintQuote: null
        },
        history: {
          year: 1994,
          title: "Nelson Mandela diventa presidente del Sudafrica.",
          text: "Con il suo insediamento si apre una nuova fase storica dopo il regime di apartheid."
        },
        proverb: {
          original: "A mazzo o fengo o vegne de sasso",
          translation: "A maggio il fango (nei campi) diventa duro come sasso.",
          note: "Parla dei campi: a maggio il fango si asciuga e si compatta."
        },
        foodNote: "Preparazione del polpettone alla genovese con fagiolini e patate, profumato con la maggiorana.",
        heroSubline: "Chi lavora mangia, chi non lavora mangia e beve.",
        practicalTip: "Formazione di nubi \"a pecorelle\" (çê a dante de can), presagio di piogge entro 24 ore."
      },
      "05-11": {
        feast: {
          holiday: "",
          holidayAlt: "",
          saint: "San Fabio martire",
          saintType: "martire",
          saintBio: "San Fabio e ricordato come martire della Chiesa antica. La sua memoria conserva il profilo di un credente che preferi la fedelta al Vangelo alla sicurezza personale.",
          saintQuote: null
        },
        history: {
          year: 1960,
          title: "Il Mossad cattura Adolf Eichmann in Argentina.",
          text: "L'arresto del gerarca nazista apre la strada a un processo centrale per la memoria della Shoah."
        },
        proverb: {
          original: "Mazzo rinfresca o bosco",
          translation: "Le piogge di maggio rinfrescano la vegetazione.",
          note: "Breve e chiaro: la pioggia di maggio ridà fiato al verde."
        },
        foodNote: "È il momento dei piselli freschi da cucinare \"in umido\" con le seppie.",
        heroSubline: "O meize de çiule o ven pe tutti.",
        practicalTip: "Sant’Egidio. Periodo del \"colpo di coda\" primaverile con piogge rapide che puliscono l'aria."
      },
      "05-12": {
        feast: {
          holiday: "",
          holidayAlt: "",
          saint: "San Pancrazio; San Nereo e Achilleo",
          saintType: "martire; martiri",
          saintBio: "San Pancrazio, giovane martire romano, e uno dei santi piu amati della Chiesa antica. Nello stesso giorno si commemorano anche i santi Nereo e Achilleo, martiri venerati a Roma come testimoni coraggiosi della fede.",
          saintQuote: null
        },
        history: {
          year: 1994,
          title: "Viene inaugurato il Tunnel della Manica.",
          text: "La grande opera collega stabilmente Francia e Gran Bretagna sotto il mare."
        },
        proverb: {
          original: "Chi dorme in mazzo, o dorme a so danno",
          translation: "Chi dorme a maggio (non lavora i campi), ne pagherà le conseguenze.",
          note: "Invita a non perdere tempo proprio nel mese decisivo dei lavori."
        },
        foodNote: "La palamita (pesce azzurro) inizia a trovarsi con frequenza: ottima sott'olio o alla griglia.",
        heroSubline: "Gh’é un po’ de pèrsa, fémmo doi ravieu.",
        practicalTip: "Ripristino del regime di brezza. Il vento gira con il sole: da Est al mattino, Sud-Ovest al pomeriggio."
      },
      "05-13": {
        feast: {
          holiday: "",
          holidayAlt: "",
          saint: "Madonna di Fatima",
          saintType: "memoria mariana",
          saintBio: "La memoria richiama le apparizioni della Vergine Maria a Fatima nel 1917 ai tre pastorelli Lucia, Francesco e Giacinta. Questo giorno e legato in modo speciale alla preghiera, alla conversione e alla pace.",
          saintQuote: null
        },
        history: {
          year: 1981,
          title: "Giovanni Paolo II viene ferito in Piazza San Pietro.",
          text: "L'attentato di Ali Ağca segna in profondità il pontificato del papa polacco."
        },
        proverb: {
          original: "Mazzo o donda, Giugno o feconda",
          translation: "Maggio culla le piante, giugno le rende feconde.",
          note: "Proverbio dolce e agricolo: maggio accompagna, giugno compie."
        },
        foodNote: "I fiori di zucca iniziano a spuntare. Preparali ripieni \"alla ligure\" con patate e formaggio.",
        heroSubline: "Chi mangia o pescio o s'imbrogia a lisca.",
        practicalTip: "Il mare inizia a superare i 17°C in superficie. Acqua ancora frizzante per i primi bagni."
      },
      "05-14": {
        feast: {
          holiday: "Ascensione del Signore",
          holidayAlt: "",
          saint: "San Mattia Apostolo",
          saintType: "apostolo",
          saintBio: "San Mattia fu scelto dagli apostoli per prendere il posto di Giuda Iscariota dopo l'Ascensione del Signore. La sua figura richiama la continuita della testimonianza apostolica e la chiamata ricevuta al servizio della Chiesa.",
          saintQuote: null
        },
        history: {
          year: 1948,
          title: "Nasce ufficialmente lo Stato d'Israele.",
          text: "La proclamazione di Ben-Gurion apre una nuova epoca in Medio Oriente."
        },
        proverb: {
          original: "Se o ciêuve de mazzo, l'erba a cresce comme un mazzo",
          translation: "Se piove a maggio, l'erba cresce a mazzi (velocemente).",
          note: "Pioggia di maggio uguale crescita rapida e abbondante."
        },
        foodNote: "Profumo di maggiorana (persa): erba fondamentale per dare l'anima ai ripieni genovesi.",
        heroSubline: "Vin amaro o tègne o caro.",
        practicalTip: "Spica, la stella più luminosa della Vergine, brilla alta a Sud verso le 22:00."
      },
      "05-15": {
        feast: {
          holiday: "",
          holidayAlt: "",
          saint: "San Torquato; Sant'Achille",
          saintType: "vescovo; santo venerato dalla tradizione antica",
          saintBio: "San Torquato e ricordato dalla tradizione come vescovo missionario dei primi secoli, legato all'evangelizzazione della Spagna. Accanto a lui si ricorda sant'Achille, anch'egli venerato come antico testimone della fede.",
          saintQuote: null
        },
        history: {
          year: 1940,
          title: "I fratelli McDonald aprono il loro primo ristorante.",
          text: "Da un locale in California prende avvio una delle catene alimentari più note del mondo."
        },
        proverb: {
          original: "A-o vinti de mazzo o freido o l'è into laccio",
          translation: "Al venti di maggio il freddo è ormai \"al laccio\" (imprigionato/finito).",
          note: "Segna il punto in cui il freddo dovrebbe davvero mollare."
        },
        foodNote: "Metà mese: le acciughe di Monterosso iniziano la stagione migliore. Ottime fritte o marinate.",
        heroSubline: "Pan d'un giorno e vin d'un anno.",
        practicalTip: "Metà mese: le giornate durano quasi 15 ore. La luce è zenitale e cruda sul mare."
      },
      "05-16": {
        feast: {
          holiday: "",
          holidayAlt: "",
          saint: "San Ubaldo vescovo",
          saintType: "vescovo",
          saintBio: "Vescovo di Gubbio nel XII secolo, san Ubaldo fu pastore mite e saldo, vicino al suo popolo nelle difficolta civili e religiose. E ricordato per la sua umilta e per la capacita di custodire la pace.",
          saintQuote: null
        },
        history: {
          year: 1929,
          title: "A Hollywood si svolge la prima notte degli Oscar.",
          text: "Comincia la storia del premio cinematografico più famoso dell'industria americana."
        },
        proverb: {
          original: "Mazzo amaro, o contadin o l'è caro",
          translation: "Un maggio freddo rende cari i prodotti del contadino.",
          note: "Maggio amaro significa prodotti più scarsi e quindi più cari."
        },
        foodNote: "Degustazione di Vermentino dei Colli di Luni, sapido e perfetto con i frutti di mare.",
        heroSubline: "I parénti son cómme e scàrpe: ciù son stréite e ciù fan mâ.",
        practicalTip: "Luna all'Ultimo Quarto. Buona visibilità serale per osservare i crateri lunari con binocolo."
      },
      "05-17": {
        feast: {
          holiday: "Settima Domenica di Pasqua",
          holidayAlt: "",
          saint: "San Pasquale Baylon",
          saintType: "religioso francescano",
          saintBio: "Frate spagnolo del XVI secolo, appartenne ai francescani alcantarini e visse con semplicita, carita e profonda devozione eucaristica. E venerato in particolare come santo dell'adorazione e della vita umile.",
          saintQuote: "Gesu nel Santissimo Sacramento sia benedetto e lodato."
        },
        history: {
          year: 1990,
          title: "L'OMS depenna l'omosessualità dalle malattie mentali.",
          text: "È una decisione simbolica e storica nel percorso di riconoscimento e dignità delle persone LGBT."
        },
        proverb: {
          original: "D'arvî e de mazzo no te levâ o pelasso",
          translation: "Ad aprile e maggio non toglierti la lana.",
          note: "Altro richiamo classico alla prudenza tra aprile e maggio."
        },
        foodNote: "Cerca le ciliegie di Castelbianco: le prime iniziano ad arrossire.",
        heroSubline: "A l’é megio cadde da un scalin che da una schera.",
        practicalTip: "Venti termici intensi nelle valli (Polcevera e Bisagno) verso il mare."
      },
      "05-18": {
        feast: {
          holiday: "",
          holidayAlt: "",
          saint: "San Giovanni I Papa; San Felice da Cantalice",
          saintType: "papa e martire; religioso cappuccino",
          saintBio: "San Giovanni I fu papa nel VI secolo e subi persecuzione fino alla morte. San Felice da Cantalice, frate cappuccino del XVI secolo, fu amato dal popolo di Roma per la sua poverta lieta, la preghiera semplice e la carita quotidiana.",
          saintQuote: null
        },
        history: {
          year: 1980,
          title: "Il Mount St. Helens erutta in modo catastrofico.",
          text: "L'esplosione devasta una vasta area e resta uno dei disastri vulcanici più celebri del Novecento."
        },
        proverb: {
          original: "Mazzo o l'ha trenta dì e se o ciovesse trentun o no fese mâ a niscun",
          translation: "Maggio ha 30 giorni, ma se piovesse anche il 31 farebbe bene a tutti (variante di quello di aprile).",
          note: "Variante simpatica: a maggio un po' di pioggia in più non guasta."
        },
        foodNote: "Tempo di torta Pasqualina, anche se fuori Pasqua, con i carciofi o le bietole tenere.",
        heroSubline: "In te piazze o s'impara a vive.",
        practicalTip: "Mare \"vivo\". Possibili onde lunghe da Libeccio se soffia al largo delle Baleari."
      },
      "05-19": {
        feast: {
          holiday: "",
          holidayAlt: "",
          saint: "San Pietro di Morrone (Celestino V)",
          saintType: "eremita e papa",
          saintBio: "Pietro del Morrone visse a lungo da eremita prima di essere eletto papa con il nome di Celestino V nel 1294. Rimase celebre per l'amore alla vita contemplativa, per l'umilta radicale e per la rinuncia al pontificato.",
          saintQuote: null
        },
        history: {
          year: 1536,
          title: "Anna Bolena viene decapitata a Londra.",
          text: "La caduta della regina segna uno dei passaggi più drammatici della corte di Enrico VIII."
        },
        proverb: {
          original: "O sô de mazzo o l'è o sô de l'amô",
          translation: "Il sole di maggio è il sole dell'amore.",
          note: "Il sole di maggio è mite, vitale, quasi affettivo."
        },
        foodNote: "I limoni di Monterosso sono carichi di succo: prepara una limonata fresca o un sorbetto.",
        heroSubline: "Chi l’ha o mâ l’ha o mâ, chi l’ha i dinæ o se ne va.",
        practicalTip: "Aria limpida. Dalle alture (Righi) si intravede il profilo della Corsica all'alba."
      },
      "05-20": {
        feast: {
          holiday: "",
          holidayAlt: "",
          saint: "San Bernardino da Siena",
          saintType: "predicatore francescano",
          saintBio: "Frate minore del XV secolo, percorse molte citta italiane come predicatore popolare, richiamando alla pace, alla conversione e alla devozione al nome di Gesu. Il suo simbolo piu noto e il monogramma IHS.",
          saintQuote: "Il nome di Gesu e luce, nutrimento e medicina dell'anima."
        },
        history: {
          year: 1927,
          title: "Lindbergh parte per la trasvolata atlantica in solitaria.",
          text: "Il volo dello Spirit of St. Louis diventa una delle imprese simbolo dell'aviazione."
        },
        proverb: {
          original: "Mazzo o l'è o meize di matti",
          translation: "Maggio è il mese dei matti (per l'instabilità del tempo e dell'umore).",
          note: "Coglie bene l'instabilità del mese, nel tempo e nell'umore."
        },
        foodNote: "Inizio della raccolta delle erbe aromatiche da essiccare: timo, origano e santoreggia.",
        heroSubline: "L'é megio esse testa d'alice che coa de sturiun.",
        practicalTip: "Inizio del caldo umido (mòlla). La macchia mediterranea profuma intensamente di resina."
      },
      "05-21": {
        feast: {
          holiday: "",
          holidayAlt: "",
          saint: "San Vittorio; San Andrea Bobola",
          saintType: "martire; sacerdote gesuita e martire",
          saintBio: "San Vittorio e ricordato dalla tradizione come martire. Sant'Andrea Bobola, gesuita polacco del XVII secolo, fu missionario instancabile e mori martire durante le persecuzioni, diventando uno dei santi piu venerati della Polonia.",
          saintQuote: null
        },
        history: {
          year: 1932,
          title: "Amelia Earhart attraversa l'Atlantico da sola.",
          text: "È la prima donna a riuscirci, entrando definitivamente nella storia del volo."
        },
        proverb: {
          original: "In mazzo a fava a l'è in sciô piatto",
          translation: "In maggio la fava è finalmente pronta nel piatto.",
          note: "Perfetto da tavola stagionale: a maggio la fava è finalmente pronta."
        },
        foodNote: "Spazio alle lattughe ripiene in brodo, un piatto antico e raffinato della tavola genovese.",
        heroSubline: "Nâve ròtta, ògni vento o l’è cóntra.",
        practicalTip: "Transizione solare verso i Gemelli. Il sole tramonta molto a Nord-Ovest, verso Capo Mele."
      },
      "05-22": {
        feast: {
          holiday: "",
          holidayAlt: "",
          saint: "Santa Rita da Cascia",
          saintType: "religiosa agostiniana",
          saintBio: "Santa Rita visse tra Umbria e Cascia tra XIV e XV secolo. Sposa, madre e poi monaca agostiniana, e venerata come santa della pace, del perdono e delle cause considerate impossibili.",
          saintQuote: "Nulla e impossibile a Dio."
        },
        history: {
          year: 1939,
          title: "Italia e Germania firmano il Patto d'Acciaio.",
          text: "L'alleanza sancisce l'avvicinamento definitivo tra il fascismo italiano e il nazismo tedesco."
        },
        proverb: {
          original: "Se o trona in mazzo, o vèn o bòn tempo",
          translation: "Se tuona in maggio, arriva il bel tempo stabile.",
          note: "Paradossale ma tipico: il tuono non sempre annuncia brutto tempo."
        },
        foodNote: "Pesce: le triglie di scoglio sono saporite e ottime alla livornese o in cartoccio.",
        heroSubline: "Chi n'ha figgeu, n'ha pensê.",
        practicalTip: "Mare calmo, \"olio\". Condizioni perfette per avvistare cetacei nel Santuario Pelagos."
      },
      "05-23": {
        feast: {
          holiday: "",
          holidayAlt: "",
          saint: "San Desiderio di Langres",
          saintType: "vescovo e martire",
          saintBio: "Vescovo di Langres nel IV secolo, san Desiderio e ricordato dalla tradizione come pastore fedele fino al martirio. La sua memoria unisce il servizio episcopale alla testimonianza coraggiosa della fede.",
          saintQuote: null
        },
        history: {
          year: 1992,
          title: "La strage di Capaci uccide Giovanni Falcone.",
          text: "L'attentato mafioso colpisce lo Stato e cambia per sempre la storia civile italiana."
        },
        proverb: {
          original: "Chi n'ha de mazzo, n'ha de tutto l'anno",
          translation: "Chi non raccoglie (erbe/fieno) a maggio, ne risente tutto l'anno.",
          note: "Detto da lavori agricoli: maggio decide molto del resto dell'anno."
        },
        foodNote: "Nelle valli si iniziano a trovare i primi asparagi violetti di Albenga, Presidio Slow Food.",
        heroSubline: "I figgeu son de chi i fa, non de chi i màngia.",
        practicalTip: "Possibili temporali pomeridiani nell'entroterra che portano aria fresca sulla costa verso sera."
      },
      "05-24": {
        feast: {
          holiday: "Pentecoste",
          holidayAlt: "",
          saint: "Maria Ausiliatrice",
          saintType: "memoria mariana",
          saintBio: "Maria Ausiliatrice e uno dei titoli piu amati attribuiti alla Vergine Maria, particolarmente diffuso da san Giovanni Bosco. Questo nome richiama la protezione materna di Maria e il suo aiuto nelle prove della vita e della Chiesa.",
          saintQuote: null
        },
        history: {
          year: 1915,
          title: "L'Italia entra nella Prima guerra mondiale.",
          text: "La dichiarazione di guerra all'Impero austro-ungarico apre uno dei capitoli più traumatici del Novecento italiano."
        },
        proverb: {
          original: "A mazzo o sô o l'ammazza i pùixi",
          translation: "A maggio il sole uccide le pulci (inizia a scaldare davvero).",
          note: "Il sole comincia a farsi serio: è la soglia del caldo vero."
        },
        foodNote: "Le focaccine di Voltri, sottili e croccanti, sono lo snack ideale per un pomeriggio al mare.",
        heroSubline: "Vento de fòra, pòrta a barca a-a demòra.",
        practicalTip: "Aria di \"macaia\": cielo grigio e umido senza pioggia, tipico del clima genovese."
      },
      "05-25": {
        feast: {
          holiday: "",
          holidayAlt: "",
          saint: "San Beda il Venerabile; Santa Maria Maddalena de' Pazzi",
          saintType: "monaco, dottore della Chiesa e storico; religiosa carmelitana",
          saintBio: "San Beda, monaco inglese dell'VIII secolo, fu grande studioso della Scrittura e della storia ecclesiastica. Santa Maria Maddalena de' Pazzi, carmelitana fiorentina del XVI secolo, visse un'intensa esperienza mistica unita a penitenza e amore ardente per Cristo.",
          saintQuote: null
        },
        history: {
          year: 1961,
          title: "Kennedy lancia la sfida della Luna.",
          text: "L'obiettivo annunciato al Congresso orienta l'intera corsa spaziale americana degli anni Sessanta."
        },
        proverb: {
          original: "Mazzo o l'è o meize da rêuza",
          translation: "Maggio è il mese della rosa.",
          note: "Uno dei più belli del mese: maggio è il tempo delle rose."
        },
        foodNote: "È il momento del Rossese di Dolceacqua, un rosso leggero perfetto per accompagnare lo stoccafisso.",
        heroSubline: "O mâ o l’è un bòn méistro, ma o vêu êsse pagòu.",
        practicalTip: "La stella Arturo brilla color arancio quasi allo zenit sopra la Lanterna."
      },
      "05-26": {
        feast: {
          holiday: "",
          holidayAlt: "",
          saint: "San Filippo Neri",
          saintType: "sacerdote e fondatore dell'Oratorio",
          saintBio: "Sacerdote fiorentino del XVI secolo, visse a Roma e divenne celebre per la gioia, l'umorismo, la carita e la capacita di guidare i giovani e il popolo alla fede. Fondo la Congregazione dell'Oratorio.",
          saintQuote: "State buoni, se potete."
        },
        history: {
          year: 1805,
          title: "Napoleone viene incoronato Re d'Italia a Milano.",
          text: "Nel Duomo prende forma simbolica l'estensione italiana del suo impero."
        },
        proverb: {
          original: "Se o ciêuve pe l'Ascension, ogni ricolta a va in perdission",
          translation: "Se piove per l'Ascensione (spesso a maggio), ogni raccolto va in rovina.",
          note: "Lega la festa dell'Ascensione al timore per il raccolto."
        },
        foodNote: "Prova il Prebuggiun: il mix di erbe selvatiche che dà carattere a minestre e ravioli.",
        heroSubline: "Tanta nebbia in t'a tæra, tanto sô in t'o mâ.",
        practicalTip: "Luna Nuova. Notti buie: il braccio della Via Lattea inizia a essere visibile verso l'orizzonte Sud-Est."
      },
      "05-27": {
        feast: {
          holiday: "",
          holidayAlt: "",
          saint: "Sant'Agostino di Canterbury",
          saintType: "vescovo e missionario",
          saintBio: "Monaco benedettino inviato da papa Gregorio Magno in Inghilterra alla fine del VI secolo, fu il primo arcivescovo di Canterbury. La sua missione segno un passaggio decisivo nella evangelizzazione del popolo anglosassone.",
          saintQuote: null
        },
        history: {
          year: 1937,
          title: "Si inaugura il Golden Gate Bridge.",
          text: "Il ponte diventa subito uno dei simboli più riconoscibili di San Francisco e dell'ingegneria moderna."
        },
        proverb: {
          original: "Mazzo l'è o tempo di çexi",
          translation: "Maggio è il tempo dei ciliegi (varietà precoci).",
          note: "Molto stagionale: maggio comincia a sapere già di ciliegie."
        },
        foodNote: "I fagiolini \"stringa\" iniziano a trovarsi negli orti: teneri e senza filo.",
        heroSubline: "Barba ròssa e pelo de can, schiva o mænâ comm'un can.",
        practicalTip: "Rinforzo del vento di Scirocco. Mare che inizia a \"mugugnare\" contro le dighe foranee."
      },
      "05-28": {
        feast: {
          holiday: "",
          holidayAlt: "",
          saint: "San Emilio martire",
          saintType: "martire",
          saintBio: "San Emilio e ricordato come martire cristiano. La sua memoria appartiene alla schiera dei testimoni antichi che hanno lasciato soprattutto l'esempio della fedelta fino al sacrificio.",
          saintQuote: null
        },
        history: {
          year: 1974,
          title: "La bomba di Piazza della Loggia devasta Brescia.",
          text: "La strage segna uno dei momenti più gravi della stagione del terrorismo neofascista in Italia."
        },
        proverb: {
          original: "A bagnòu, Mazzo fiorìo",
          translation: "Aprile bagnato porta un maggio fiorito.",
          note: "Connette bene i due mesi: l'acqua di aprile apre alla fioritura di maggio."
        },
        foodNote: "Tempo di panissa fritta, il \"cibo di strada\" per eccellenza insieme alla focaccia.",
        heroSubline: "Chi veu vedde un cattio, fasse arraggiâ un bon.",
        practicalTip: "Temperatura percepita in aumento. Primo vero assaggio d'estate nei vicoli del centro storico."
      },
      "05-29": {
        feast: {
          holiday: "",
          holidayAlt: "",
          saint: "San Paolo VI Papa",
          saintType: "papa",
          saintBio: "Giovanni Battista Montini, papa Paolo VI, guido la Chiesa negli anni decisivi del Concilio Vaticano II e del suo compimento. Fu un pontefice di dialogo, profondita spirituale e forte senso missionario.",
          saintQuote: "Se vuoi la pace, lavora per la giustizia."
        },
        history: {
          year: 1953,
          title: "Hillary e Tenzing raggiungono l'Everest.",
          text: "La conquista della vetta più alta del mondo entra nella storia dell'alpinismo."
        },
        proverb: {
          original: "Mazzo o dâ o bòn odô a-a tæra",
          translation: "Maggio dà il buon odore alla terra.",
          note: "Ha un tono quasi sensoriale: maggio cambia davvero l'odore della terra."
        },
        foodNote: "Preparazione dello scabeccio: pesce fritto e poi marinato in aceto, cipolle e rosmarino.",
        heroSubline: "Meschinna quella cà donde a gallinna canta e o gallo taxe.",
        practicalTip: "Il mare si stabilizza. Sulle spiagge di Corso Italia la sabbia scotta nelle ore centrali."
      },
      "05-30": {
        feast: {
          holiday: "",
          holidayAlt: "",
          saint: "San Giovanna d'Arco; San Ferdinando",
          saintType: "vergine, condottiera e patrona; re e confessore",
          saintBio: "Santa Giovanna d'Arco, giovane francese del XV secolo, guido con straordinario coraggio la propria missione fino al martirio. San Ferdinando III di Castiglia fu sovrano cristiano del XIII secolo, ricordato per il senso di giustizia, la preghiera e il governo ispirato alla fede.",
          saintQuote: "Agisci e Dio agira."
        },
        history: {
          year: 1431,
          title: "Giovanna d'Arco viene arsa sul rogo a Rouen.",
          text: "Muore a soli 19 anni la giovane che diventerà uno dei simboli più forti della storia francese."
        },
        proverb: {
          original: "Mazzo o l'è o meize da sperança",
          translation: "Maggio è il mese della speranza (per i futuri raccolti estivi).",
          note: "Chiusura fiduciosa: maggio guarda già all'estate e ai suoi frutti."
        },
        foodNote: "Le prime albicocche di Valleggia (caratteristiche per i puntini rossi) iniziano a maturare.",
        heroSubline: "Chi t'accarezza ciù de l'ordinario, o t'ha ingannòu o o l'ha de l'itinerario.",
        practicalTip: "Stelle di fine maggio: Vega sorge a Nord-Est, preannunciando il Triangolo Estivo."
      },
      "05-31": {
        feast: {
          holiday: "Santissima Trinità",
          holidayAlt: "",
          saint: "Visitazione della Beata Vergine Maria",
          saintType: "festa mariana",
          saintBio: "La Visitazione ricorda l'incontro tra Maria ed Elisabetta narrato nel Vangelo di Luca. E una festa che unisce gioia, servizio e lode, e mette al centro la prontezza di Maria nel portare Cristo agli altri.",
          saintQuote: "L'anima mia magnifica il Signore."
        },
        history: {
          year: 1970,
          title: "Un terremoto devasta il Perù.",
          text: "Il sisma del 1970 provoca decine di migliaia di vittime ed è tra i peggiori disastri del continente."
        },
        proverb: {
          original: "Chi canta a mazzo, canta a gran voxe",
          translation: "Chi gioisce a maggio lo fa a gran voce.",
          note: "Proverbio finale da mese felice e aperto."
        },
        foodNote: "Chiusura in dolcezza con i canestrelli di Torriglia o Acquasanta per accompagnare il caffè domenicale.",
        heroSubline: "A l’é megio cadde da un scalin che da una schera.",
        practicalTip: "Chiusura del mese con temperature stabili tra 18°C e 24°C. Mare accogliente."
      }
  });
})();
