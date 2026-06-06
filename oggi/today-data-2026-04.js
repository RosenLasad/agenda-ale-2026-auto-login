(function(){
  "use strict";

  if(!window.AGENDA_TODAY_DATA) {
    window.AGENDA_TODAY_DATA = { byDay: {} };
  }

  if(!window.AGENDA_TODAY_DATA.byDay) {
    window.AGENDA_TODAY_DATA.byDay = {};
  }

  Object.assign(window.AGENDA_TODAY_DATA.byDay, {
      "04-05": {
        feast: {
          holiday: "Pasqua",
          holidayAlt: "Domenica di Pasqua",
          saint: "San Vincenzo Ferreri",
          saintType: "predicatore domenicano",
          saintBio: "Frate domenicano nato a Valencia nel XIV secolo, fu uno dei grandi predicatori del suo tempo e contribui a ricomporre il Grande Scisma d'Occidente.",
          saintQuote: null
        },
        history: {
          year: 1887,
          title: "Anne Sullivan riesce a far comprendere a Helen Keller il significato della parola \"water\".",
          text: "Una svolta decisiva nella formazione di Helen Keller: da quel momento il linguaggio comincia davvero ad aprirsi."
        },
        proverb: {
          original: "Arvi cioi cioi.",
          translation: "Aprile, piovere piovere.",
          note: "Detto breve e popolare: aprile e luminoso, ma capriccioso."
        },
        foodNote: "Essendo Pasqua, a Genova ci sta benissimo una torta pasqualina: legata alla tradizione ligure e perfetta anche da mangiare fredda il giorno dopo.",
        heroSubline: "Genova · domenica di Pasqua"
      },
      "04-06": {
        feast: {
          holiday: "Lunedi dell'Angelo",
          holidayAlt: "Pasquetta",
          saint: "San Guglielmo di Eskilsoe",
          saintType: "missionario e abate",
          saintBio: "Nato in Francia nel XII secolo, fu canonico a Parigi e venne chiamato in Danimarca per aiutare la riforma di varie comunita religiose. Divenne abate a Eskilsoe ed e ricordato per rigore, santita e perseveranza.",
          saintQuote: null
        },
        history: {
          year: 1896,
          title: "Si aprono ad Atene i primi Giochi Olimpici moderni.",
          text: "Una data perfetta per il 6 aprile: lo sport torna simbolicamente al centro della storia contemporanea."
        },
        proverb: {
          original: "Arvi cioi cioi.",
          translation: "Aprile, piovere piovere.",
          note: "Detto breve e popolare: aprile e luminoso, ma capriccioso."
        },
        foodNote: "Essendo Pasquetta, a Genova ci sta benissimo anche una torta pasqualina.",
        heroSubline: "Genova · lunedi di Pasquetta"
      },
      "04-07": {
        feast: {
          holiday: "Giornata mondiale della salute",
          holidayAlt: "World Health Day",
          saint: "San Giovanni Battista de La Salle",
          saintType: "educatore e patrono degli insegnanti",
          saintBio: "Sacerdote francese nato a Reims nel 1651, fondo i Fratelli delle Scuole Cristiane e fu un grande innovatore dell'educazione, soprattutto per i ragazzi poveri.",
          saintQuote: null
        },
        history: {
          year: 1948,
          title: "Nasce formalmente l'Organizzazione mondiale della sanita.",
          text: "Proprio per questo il 7 aprile e diventato la Giornata mondiale della salute."
        },
        proverb: {
          original: "A salute sensa denae a l'e 'na meza moutia.",
          translation: "La salute senza soldi e una mezza malattia.",
          note: "Proverbio amaro ma forte: sta benissimo con una giornata dedicata alla salute."
        },
        foodNote: "Giornata da tavola verde e leggera: asparagi, fave e piselli stanno benissimo anche in piatti semplici e primaverili.",
        heroSubline: "Chi l’é troppo bon o l’é un mincion"
      },
      "04-08": {
        feast: {
          holiday: "Giornata internazionale del popolo Rom",
          holidayAlt: "International Roma Day",
          saint: "Santa Giulia Billiart",
          saintType: "educatrice e fondatrice",
          saintBio: "Nata in Francia nel 1751, dedico la vita all'educazione cristiana delle ragazze, fondo le Suore di Notre Dame de Namur e continuo a insegnare anche dopo anni di grave malattia.",
          saintQuote: null
        },
        history: {
          year: 1820,
          title: "Viene ritrovata sull'isola di Milo la Venere di Milo.",
          text: "Una delle statue piu celebri del mondo antico torna alla luce e comincia la sua storia moderna."
        },
        proverb: {
          original: "A megio mexinn-a a l'e o decotto de cantinn-a.",
          translation: "La miglior medicina e il decotto di cantina.",
          note: "Proverbio ironico e molto ligure: piu da sorriso che da ricetta."
        },
        foodNote: "Inizio aprile vuol dire primi profumi dolci di stagione: fragole e nespole cominciano a dare alla tavola un'aria piu chiara e leggera.",
        heroSubline: "Chi l’é stæto bruxòu da l’ægua cäda, à puia da freida ascì"
      },
      "04-09": {
        feast: {
          holiday: "Giovedi nell'Ottava di Pasqua",
          holidayAlt: "",
          saint: "Santa Valdetrude (Waldetrudis)",
          saintType: "nobile e fondatrice",
          saintBio: "Nobile del VII secolo, sposò san Vincenzo Madelgario, ebbe figli venerati come santi e fondò il monastero attorno a cui sorse poi Mons, in Belgio.",
          saintQuote: null
        },
        history: {
          year: 1865,
          title: "Robert E. Lee si arrende ad Appomattox Court House.",
          text: "La resa del generale confederato segna di fatto la fine della Guerra civile americana."
        },
        proverb: {
          original: "D’Arvî, ògni gòtta un barî.",
          translation: "Ad aprile, ogni goccia vale un barile.",
          note: "Perfetto per aprire il cuore agricolo del mese: l'acqua di aprile e una benedizione."
        },
        foodNote: "Giornata da sapori verdi e semplici: asparagi, fave e piselli sono perfetti per una tavola leggera ma viva.",
        heroSubline: "L’é megio o pöco che o ninte",
        practicalTip: "Goditi la luce lunga del pomeriggio, ma tieni qualcosa di leggero per la sera."
      },
      "04-10": {
        feast: {
          holiday: "Venerdi nell'Ottava di Pasqua",
          holidayAlt: "",
          saint: "San Michele de’ Sanctis",
          saintType: "religioso trinitario",
          saintBio: "Religioso trinitario spagnolo, entrò giovanissimo in convento, divenne sacerdote ed è ricordato per la sua forte devozione all’Eucaristia e per la vita di penitenza e preghiera.",
          saintQuote: null
        },
        history: {
          year: 2019,
          title: "Viene diffusa la prima immagine di un buco nero.",
          text: "L'immagine del buco nero al centro della galassia M87 diventa subito una svolta simbolica della storia dell'astronomia."
        },
        proverb: {
          original: "A-i dexe d'Arvî, o cucco o deuv'aprî.",
          translation: "Ai dieci d'aprile, il cuculo deve aprire il becco.",
          note: "Questo e quasi obbligatorio il 10 aprile: proverbio legato proprio alla data."
        },
        foodNote: "Aprile invita a piatti freschi ma non estivi: carciofi, asparagi e un po' di erbette stanno benissimo.",
        heroSubline: "Cazze in pê comme i gatti",
        practicalTip: "Aprile invita a uscire, ma conviene ancora vestirsi a strati e non per fiducia."
      },
      "04-11": {
        feast: {
          holiday: "Sabato nell'Ottava di Pasqua",
          holidayAlt: "",
          saint: "Sant’Antipa",
          saintType: "vescovo e martire",
          saintBio: "Martire dei primi secoli, tradizionalmente considerato discepolo di san Giovanni e vescovo di Pergamo; la tradizione lo ricorda come ucciso per la fede.",
          saintQuote: null
        },
        history: {
          year: 1814,
          title: "Napoleone abdica senza condizioni a Fontainebleau.",
          text: "Con questa abdicazione si apre il suo esilio all'isola d'Elba."
        },
        proverb: {
          original: "In Arvî a l'è a lunn-a de rissêue.",
          translation: "In aprile c'è la luna delle rondini.",
          note: "Bello, leggero e molto da stagione che si apre."
        },
        foodNote: "Giornata buona per una cucina di stagione senza complicarsi troppo: fave fresche, piselli e una torta salata fanno gia primavera.",
        heroSubline: "No gh'é bella reuza ch'a no divente un grattacu",
        practicalTip: "Giornata buona per stare fuori un po' di piu, meglio con una giacca nello zaino."
      },
      "04-12": {
        feast: {
          holiday: "Seconda Domenica di Pasqua",
          holidayAlt: "Domenica della Divina Misericordia",
          saint: "San Giulio I",
          saintType: "papa",
          saintBio: "Papa del IV secolo, difese sant’Atanasio nella crisi ariana e promosse la costruzione di varie basiliche e chiese a Roma.",
          saintQuote: null
        },
        history: {
          year: 1981,
          title: "La NASA lancia Columbia, il primo Space Shuttle.",
          text: "Si apre una nuova fase dell'esplorazione spaziale americana."
        },
        proverb: {
          original: "A Pasqua d'Arvî, carie o barî.",
          translation: "Con la Pasqua in aprile, riempi il barile.",
          note: "Perfetto nel tempo pasquale di quell'anno."
        },
        foodNote: "Domenica da tavola piena ma chiara: torta pasqualina, carciofi e un finale con fragole ci stanno benissimo.",
        heroSubline: "Pansa pinn-a a veu repöso",
        practicalTip: "Se passi tempo all'aperto, approfitta del sole ma non dimenticare che l'aria puo cambiare in fretta."
      },
      "04-13": {
        feast: {
          holiday: "",
          holidayAlt: "",
          saint: "San Martino I",
          saintType: "papa e martire",
          saintBio: "Papa dal 649 al 653, condannò il monotelismo, fu arrestato dall’autorità imperiale bizantina, deportato e morì in esilio; è ricordato come l’ultimo papa martire.",
          saintQuote: null
        },
        history: {
          year: 1895,
          title: "Alfred Dreyfus viene deportato all'Isola del Diavolo.",
          text: "Uno degli episodi piu celebri e controversi della storia francese entra nella sua fase piu drammatica."
        },
        proverb: {
          original: "Arvî o dâ a fior de vitta.",
          translation: "Aprile dà il fiore della vita.",
          note: "Molto adatto a meta mese: luce, ripresa, vitalita."
        },
        foodNote: "Dopo i giorni di festa, tornano bene i sapori semplici: asparagi, bietole e un piatto leggero rimettono ordine.",
        heroSubline: "Læte e vin fan sunnâ u campanin",
        practicalTip: "Riparti leggero, ma senza scoprirti troppo: il pomeriggio puo illudere."
      },
      "04-14": {
        feast: {
          holiday: "Martedi della Seconda Settimana di Pasqua",
          holidayAlt: "",
          saint: "Santa Lidvina di Schiedam",
          saintType: "mistica",
          saintBio: "Olandese, dopo una grave caduta in gioventù rimase inferma per gran parte della vita; è ricordata per la pazienza nella sofferenza e per le sue esperienze mistiche.",
          saintQuote: null
        },
        history: {
          year: 1865,
          title: "Abraham Lincoln viene colpito al Ford's Theatre.",
          text: "L'attentato al presidente americano scuote profondamente gli Stati Uniti alla fine della Guerra civile."
        },
        proverb: {
          original: "In Arvî a terra a s'arve.",
          translation: "In aprile la terra si apre.",
          note: "Ha un tono semplice e bello, molto primaverile."
        },
        foodNote: "Giornata adatta a una cucina morbida di primavera: piselli, fave e patate novelle danno un tono dolce e fresco.",
        heroSubline: "A-o boso ghe voe l'onto",
        practicalTip: "Oggi conviene scegliere mezze maniche con prudenza e tenere un secondo strato vicino."
      },
      "04-15": {
        feast: {
          holiday: "Giornata mondiale dell'arte",
          holidayAlt: "",
          saint: "San Paterno di Avranches",
          saintType: "vescovo ed eremita",
          saintBio: "Figura del VI secolo nata a Poitiers, prima eremita e poi fondatore di comunità monastiche; divenne quindi vescovo di Avranches in Normandia.",
          saintQuote: null
        },
        history: {
          year: 1912,
          title: "Il Titanic affonda nell'Atlantico del Nord.",
          text: "Dopo la collisione con un iceberg, il transatlantico diventa uno dei simboli piu noti del Novecento."
        },
        proverb: {
          original: "Arvî o l'è o meize ch'o fa cantâ i öxelli.",
          translation: "Aprile è il mese che fa cantare gli uccelli.",
          note: "Uno dei piu poetici del gruppo, ma resta concreto."
        },
        foodNote: "Meta aprile chiama ingredienti netti ma delicati: carciofi, asparagi e un po' di maggiorana fanno gia stagione.",
        heroSubline: "A parolla a l'è d'argento, o scilençio o l'è d'öo",
        practicalTip: "La stagione avanza, ma aprile resta mobile: meglio comodita e un po' di elasticita nel vestirsi."
      },
      "04-16": {
        feast: {
          holiday: "Giovedi della Seconda Settimana di Pasqua",
          holidayAlt: "",
          saint: "Santa Bernadette Soubirous",
          saintType: "veggente di Lourdes",
          saintBio: "Giovane francese di Lourdes, nel 1858 riferì le apparizioni della Vergine nella grotta di Massabielle; in seguito visse da religiosa a Nevers, in una vita segnata da malattia, preghiera e discrezione.",
          saintQuote: null
        },
        history: {
          year: 1912,
          title: "Harriet Quimby attraversa la Manica in aereo.",
          text: "Diventa la prima donna a compiere l'impresa, entrando nella storia dell'aviazione."
        },
        proverb: {
          original: "In Arvî, o sô o va e o ven comme o voe lù.",
          translation: "In aprile, il sole va e viene come vuole lui.",
          note: "Perfetto per il carattere mobile del mese."
        },
        foodNote: "Buon momento per un primo di primavera: verdure tenere, un po' di pesto o una minestra leggera funzionano bene.",
        heroSubline: "Dì de scì e fâ de nò, o l’è un bòn mòddo de levâse o ròppo",
        practicalTip: "Buona giornata per camminare o stare un po' fuori, ma occhio all'aria piu fresca verso sera."
      },
      "04-17": {
        feast: {
          holiday: "Venerdi della Seconda Settimana di Pasqua",
          holidayAlt: "",
          saint: "Sant’Aniceto",
          saintType: "papa",
          saintBio: "Papa del II secolo, originario della Siria, contrastò il marcionismo e altre correnti gnostiche; durante il suo pontificato emerse anche la discussione tra Oriente e Occidente sulla data della Pasqua.",
          saintQuote: null
        },
        history: {
          year: 1982,
          title: "Entra in vigore il Canada Act.",
          text: "Il Canada completa la piena sovranita costituzionale rispetto al Regno Unito."
        },
        proverb: {
          original: "Arvî, no te levâ o vestî.",
          translation: "Aprile, non toglierti ancora i vestiti pesanti.",
          note: "Molto utile anche come tono pratico, non solo proverbiale."
        },
        foodNote: "Tavola semplice e verde: fave fresche, lattughine, piselli e magari un formaggio morbido per accompagnare.",
        heroSubline: "O pù l'è nemigo do ben",
        practicalTip: "Sfrutta la luce del tardo pomeriggio, ma non fidarti troppo di un cielo che sembra gia estivo."
      },
      "04-18": {
        feast: {
          holiday: "Sabato della Seconda Settimana di Pasqua",
          holidayAlt: "",
          saint: "Sant’Apollonio l’Apologista",
          saintType: "senatore e martire",
          saintBio: "Senatore romano e cristiano dei primi secoli, compose una difesa della fede considerata preziosa per la Chiesa antica; rifiutò di rinnegare Cristo e fu condannato a morte.",
          saintQuote: null
        },
        history: {
          year: 1775,
          title: "Paul Revere compie la sua celebre cavalcata notturna.",
          text: "L'allarme lanciato ai coloni americani diventa uno degli episodi simbolici della Rivoluzione americana."
        },
        proverb: {
          original: "In Arvî, levate o panno e mettite o lino.",
          translation: "In aprile, togli il panno e metti il lino.",
          note: "Bello metterlo dopo quello del 17: sembra quasi un dialogo tra prudenza e cambio di stagione."
        },
        foodNote: "Giornata da mercato di aprile: asparagi, fragole e nespole danno gia alla cucina un'aria piu luminosa.",
        heroSubline: "Chi l’ha i denti n’ha o pan e chi l’ha o pan n’ha i denti",
        practicalTip: "Se esci al mercato o a passeggio, vestiti leggero ma con margine: il vento puo farsi sentire."
      },
      "04-19": {
        feast: {
          holiday: "Terza Domenica di Pasqua",
          holidayAlt: "",
          saint: "Sant’Alfeo (Aelfheah)",
          saintType: "arcivescovo e martire",
          saintBio: "Arcivescovo di Canterbury, già monaco e vescovo di Winchester, fu ucciso dai Danesi nel 1012 ed è venerato come martire.",
          saintQuote: null
        },
        history: {
          year: 1775,
          title: "Con Lexington e Concord inizia la Rivoluzione americana.",
          text: "Gli scontri segnano l'avvio militare della guerra d'indipendenza delle colonie."
        },
        proverb: {
          original: "Arvî o fa o fûeggio e Mazzo o fa o fî.",
          translation: "Aprile fa la foglia e maggio fa il fiore.",
          note: "Ottimo per accompagnare il passaggio verso la fine del mese."
        },
        foodNote: "Domenica da piatti stagionali ma non pesanti: torta salata, carciofi trifolati o un primo con verdure primaverili.",
        heroSubline: "L'é megio esse testa d'alice che coa de sturiun",
        practicalTip: "Giornata da vivere con calma all'aperto, tenendo pero un capo in piu per il rientro."
      },
      "04-20": {
        feast: {
          holiday: "Lunedi della Terza Settimana di Pasqua",
          holidayAlt: "",
          saint: "San Mariano",
          saintType: "monaco",
          saintBio: "Giovane fuggiasco proveniente da Bourges, entrò nel monastero fondato da san Germano ad Auxerre e fu ricordato per obbedienza, umiltà e fedeltà anche nei lavori più semplici.",
          saintQuote: null
        },
        history: {
          year: 2010,
          title: "Esplode la piattaforma Deepwater Horizon.",
          text: "L'incidente provoca il piu grande sversamento di petrolio della storia."
        },
        proverb: {
          original: "A-o vinti d'Arvî, a fava a l'è in sciô fî.",
          translation: "Al venti d'aprile, la fava è sul filo.",
          note: "Altro proverbio perfetto per la data precisa."
        },
        foodNote: "Oggi stanno bene sapori puliti e vegetali: asparagi, piselli e un contorno fresco fanno il loro dovere.",
        heroSubline: "In te piazze o s'impara a vive",
        practicalTip: "Aprile premia chi si veste bene a strati: poco peso addosso, ma senza scoprirsi troppo."
      },
      "04-21": {
        feast: {
          holiday: "Giornata mondiale della creativita e dell'innovazione",
          holidayAlt: "",
          saint: "Sant’Anselmo d’Aosta",
          saintType: "vescovo, teologo e dottore della Chiesa",
          saintBio: "Teologo e filosofo dell’XI secolo, fu abate di Bec e poi arcivescovo di Canterbury; è una figura centrale della scolastica medievale, famosa per il dialogo tra fede e ragione.",
          saintQuote: "“I believe in order to understand.” / “Credo per comprendere.”"
        },
        history: {
          year: 1836,
          title: "La battaglia di San Jacinto decide la rivoluzione texana.",
          text: "La vittoria delle forze texane porta rapidamente all'indipendenza dal Messico."
        },
        proverb: {
          original: "Se o cucco o no canta a-i vinti d’Arvî, o l’è mòrto o o l’è in cammin.",
          translation: "Se il cuculo non canta al 20 aprile, o è morto o sta arrivando.",
          note: "Sta benissimo subito dopo quello del 20, come continuazione naturale."
        },
        foodNote: "Giornata da cucina chiara e creativa: fave, erbette e fragole permettono combinazioni semplici ma piene di stagione.",
        heroSubline: "Chi texe l'aragna o ne mangia a mosca",
        practicalTip: "Buon momento per stare fuori nelle ore centrali, con qualcosa di piu addosso per mattina e sera."
      },
      "04-22": {
        feast: {
          holiday: "Giornata della Terra",
          holidayAlt: "Earth Day",
          saint: "Sant’Abdieso",
          saintType: "diacono e martire",
          saintBio: "Diacono della comunità cristiana di Persia, fu coinvolto nelle persecuzioni di Sapore II e subì il martirio insieme ad altri compagni.",
          saintQuote: null
        },
        history: {
          year: 1889,
          title: "Inizia l'Oklahoma Land Rush.",
          text: "Migliaia di coloni si precipitano a occupare terre aperte improvvisamente alla colonizzazione."
        },
        proverb: {
          original: "L’ægua d’Arvî a l’è megio de l’euggio de San Viçenço.",
          translation: "L'acqua d'aprile è più preziosa dell'olio consacrato.",
          note: "Molto forte e molto ligure nel tono."
        },
        foodNote: "Per una giornata dedicata alla Terra, stanno bene ingredienti nudi e di stagione: verdure fresche, legumi teneri e frutta vera di aprile.",
        heroSubline: "A gata frita a l'ha puia de l'ægua freida",
        practicalTip: "Giornata ideale per respirare un po' d'aria aperta, ma con scarpe e vestiti pronti anche a un cambio rapido."
      },
      "04-23": {
        feast: {
          holiday: "Giornata mondiale del libro e del diritto d'autore",
          holidayAlt: "",
          saint: "San Giorgio / Sant’Adalberto di Praga",
          saintType: "martire · vescovo e martire",
          saintBio: "San Giorgio è il martire dei primi secoli tradizionalmente raffigurato come il cavaliere che sconfigge il drago; Sant’Adalberto fu il primo vescovo di Praga, missionario tra i Prussiani e martirizzato nel 997.",
          saintQuote: null
        },
        history: {
          year: 2005,
          title: "Viene caricato il primo video su YouTube.",
          text: "Un gesto minuscolo per l'epoca, ma destinato a cambiare la storia del web e dei video online."
        },
        proverb: {
          original: "Se Arvî o trona, l'annâ a l'è bonn-a.",
          translation: "Se in aprile tuona, l'annata sarà buona.",
          note: "Breve, secco, molto proverbiale."
        },
        foodNote: "Oggi ci stanno bene piatti essenziali ma eleganti: carciofi, asparagi e magari un primo ligure con profumo di basilico.",
        heroSubline: "O gattiño de San Benigno o l’aveiva l’anima in scio mento",
        practicalTip: "Se ti muovi molto oggi, scegli abiti pratici e leggeri, ma non lasciare a casa una giacca fine."
      },
      "04-24": {
        feast: {
          holiday: "",
          holidayAlt: "",
          saint: "San Fedele di Sigmaringen",
          saintType: "sacerdote cappuccino e martire",
          saintBio: "Avvocato diventato cappuccino, difensore dei poveri e poi missionario nella Svizzera dei Grigioni; fu ucciso nel 1622 ed è venerato come martire.",
          saintQuote: null
        },
        history: {
          year: 1916,
          title: "Inizia a Dublino l'Easter Rising.",
          text: "La sollevazione irlandese contro il dominio britannico diventa un momento decisivo per la storia del paese."
        },
        proverb: {
          original: "Arvî bagnòu, ricolta da beato.",
          translation: "Aprile bagnato, raccolto da beato.",
          note: "Si collega bene al tema della pioggia benefica."
        },
        foodNote: "Fine aprile inoltrato: le fragole prendono spazio, ma anche fave e piselli restano perfetti per una tavola gentile.",
        heroSubline: "Dâ un corpo a-o cerchio e un a-a botte",
        practicalTip: "Fine aprile porta piu luce, non sempre piu stabilita: meglio restare comodi e versatili."
      },
      "04-25": {
        feast: {
          holiday: "Festa della Liberazione",
          holidayAlt: "",
          saint: "San Marco evangelista",
          saintType: "evangelista",
          saintBio: "Figura del cristianesimo delle origini, associato a Pietro e Paolo, è tradizionalmente considerato l’autore del secondo Vangelo ed è il patrono di Venezia.",
          saintQuote: null
        },
        history: {
          year: 1990,
          title: "Il telescopio spaziale Hubble viene messo in orbita.",
          text: "Inizia una delle avventure scientifiche piu importanti e spettacolari dell'astronomia moderna."
        },
        proverb: {
          original: "Arvî o l'ha trenta dì, ma se o ciêuve trentun, o n'ha mâ nisciun.",
          translation: "Aprile ha 30 giorni, ma se piovesse il 31 non farebbe male a nessuno.",
          note: "Simpatico e perfetto da mettere verso la fine del mese."
        },
        foodNote: "Giornata da pranzo semplice ma felice: focaccia, torta salata, fave fresche e qualcosa di buono da condividere.",
        heroSubline: "L’é megio pîase un carogno che un mincion",
        practicalTip: "Se stai fuori a lungo, approfitta della bella luce ma considera un rientro piu fresco del previsto."
      },
      "04-26": {
        feast: {
          holiday: "Quarta Domenica di Pasqua",
          holidayAlt: "Good Shepherd Sunday",
          saint: "San Cleto (Anacleto)",
          saintType: "papa e martire",
          saintBio: "Terzo vescovo di Roma dopo Pietro e Lino, è ricordato tra i primi pastori della Chiesa romana ed è venerato come martire.",
          saintQuote: null
        },
        history: {
          year: 1986,
          title: "Avviene il disastro nucleare di Chernobyl.",
          text: "L'incidente alla centrale ucraina diventa uno dei simboli globali del rischio nucleare."
        },
        proverb: {
          original: "Arvî asciutto, o contadin o l'è distrutto.",
          translation: "Aprile troppo secco rovina il contadino.",
          note: "Buon contrappeso ai proverbi sull'acqua benefica."
        },
        foodNote: "Domenica buona per una cucina di primavera piena ma ariosa: trofie al pesto, verdure di stagione e un finale con fragole.",
        heroSubline: "Chi va a-o molin s'infarin-a",
        practicalTip: "Giornata buona per una passeggiata lenta o un pranzo fuori, con qualcosa da mettere appena cala il sole."
      },
      "04-27": {
        feast: {
          holiday: "Lunedi della Quarta Settimana di Pasqua",
          holidayAlt: "",
          saint: "Santa Zita",
          saintType: "laica",
          saintBio: "Serva domestica a Lucca, è ricordata per la sua fedeltà nel lavoro, la carità verso i poveri e la semplicità concreta della sua santità quotidiana.",
          saintQuote: "“A servant is not holy if she is not busy.” / “Una serva non è santa se non è operosa.”"
        },
        history: {
          year: 1961,
          title: "La Sierra Leone ottiene l'indipendenza.",
          text: "Lo stato africano si separa formalmente dal Regno Unito e inizia la sua storia autonoma."
        },
        proverb: {
          original: "Tramontann-a d'Arvî, tèn serròu o barî.",
          translation: "La tramontana d'aprile chiude i barili.",
          note: "Molto locale, molto atmosferico, molto giusto per Agenda."
        },
        foodNote: "In questi giorni la tavola puo alleggerirsi bene: asparagi, lattuga, piselli e frutta delicata fanno gia quasi maggio.",
        heroSubline: "Tanto o tronò che o ciovè",
        practicalTip: "Ormai la stagione si sente bene, ma aprile non e ancora estate: vestiti leggero, non sfrontato."
      },
      "04-28": {
        feast: {
          holiday: "Giornata mondiale per la salute e la sicurezza sul lavoro",
          holidayAlt: "",
          saint: "San Pietro Chanel / San Luigi Maria Grignion de Montfort",
          saintType: "missionario e martire · sacerdote e predicatore",
          saintBio: "San Pietro Chanel fu sacerdote marista, missionario in Oceania e protomartire del Pacifico meridionale; san Luigi Maria Grignion de Montfort fu un grande predicatore popolare e promotore della devozione mariana.",
          saintQuote: null
        },
        history: {
          year: 1945,
          title: "Benito Mussolini viene catturato e giustiziato.",
          text: "La fine del dittatore italiano segna simbolicamente il crollo finale del fascismo repubblicano."
        },
        proverb: {
          original: "Gigo d'Arvî, centu d'Agostu.",
          translation: "Una gelata d'aprile vale cento giornate d'agosto.",
          note: "Forte e memorabile, con un'immagine netta."
        },
        foodNote: "Giornata da sapori nitidi e puliti: carciofi, patate novelle e un contorno verde sono una combinazione molto da aprile.",
        heroSubline: "O timon o l'è in man do dêu",
        practicalTip: "Oggi funziona bene una via di mezzo: aria aperta, passo tranquillo e un capo leggero sempre con te."
      },
      "04-29": {
        feast: {
          holiday: "Giornata internazionale della danza",
          holidayAlt: "",
          saint: "Santa Caterina da Siena",
          saintType: "mistica e dottore della Chiesa",
          saintBio: "Terziaria domenicana, mistica e riformatrice del XIV secolo, influente nella vita politica ed ecclesiale del suo tempo; è dottore della Chiesa e patrona d’Italia e d’Europa.",
          saintQuote: "“Stay in the holy and sweet delight of God.” / “Resta nel santo e dolce diletto di Dio.”"
        },
        history: {
          year: 2011,
          title: "Il principe William sposa Catherine Middleton.",
          text: "Il matrimonio reale britannico diventa un evento globale seguito in tutto il mondo."
        },
        proverb: {
          original: "Arvî amaro o fa o gran caro.",
          translation: "Un aprile freddo rende il grano prezioso.",
          note: "Bel proverbio da fine mese, piu severo e contadino."
        },
        foodNote: "Fine mese con tono dolce e fresco: fragole, kiwi e nespole cominciano a prendersi la scena anche da soli.",
        heroSubline: "Chi l’ha o mâ l’ha o mâ, chi l’ha i dinæ o se ne va ",
        practicalTip: "La luce invita a fare di piu, ma il consiglio resta lo stesso: strati leggeri e niente eccessi."
      },
      "04-30": {
        feast: {
          holiday: "Giornata internazionale del jazz",
          holidayAlt: "",
          saint: "San Pio V",
          saintType: "papa",
          saintBio: "Papa domenicano del XVI secolo, figura chiave della Riforma cattolica post-tridentina, noto per il rigore ascetico e per il suo forte impulso riformatore.",
          saintQuote: null
        },
        history: {
          year: 1789,
          title: "George Washington presta giuramento come primo presidente degli Stati Uniti.",
          text: "Si apre ufficialmente la storia della presidenza americana."
        },
        proverb: {
          original: "Arvî o donda, Mazzo o feconda.",
          translation: "Aprile culla, maggio feconda.",
          note: "Perfetto per chiudere aprile e aprire idealmente maggio."
        },
        foodNote: "Ultimo giorno di aprile: cucina semplice, primaverile e luminosa, con verdure tenere e frutta chiara di stagione.",
        heroSubline: "A gallinna ch'a canta a l'ha fæto l'euvo",
        practicalTip: "Aprile si chiude bene se lo prendi con misura: goditi il sole, ma lascia spazio a un po' di prudenza."
      }
  });
})();
