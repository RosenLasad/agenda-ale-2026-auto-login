(function(){
  "use strict";

  window.AGENDA_TODAY_DATA = {
    byDay: {},

    feastFallback: {
      title: "Oggi non ho ancora una ricorrenza compilata.",
      subtitle: "Sezione pronta per essere arricchita giorno per giorno.",
      bio: "La struttura e pronta: qui possiamo aggiungere santi, ricorrenze civili, frasi e piccole note storiche quando vuoi.",
      quote: null
    },

    historyFallbacks: [
      "Giornata buona per ricordare che ogni data puo avere una memoria, piccola o grande.",
      "Questa sezione e pronta per ospitare un fatto storico del giorno, locale o generale.",
      "Possiamo popolare questa parte con eventi di Genova, della Liguria o della storia mondiale."
    ],

    seasonRanges: [
      {
        start: "03-21",
        end: "04-15",
        id: "early-spring-genoa",
        title: "Primavera ligure in assestamento",
        text: "A Genova l'inizio di aprile e mite ma instabile: la luce cresce bene, il sole puo gia scaldare nelle ore centrali, ma la sera resta fresca e qualche pioggia resta sempre possibile."
      },
      {
        start: "04-16",
        end: "05-20",
        id: "late-spring-genoa",
        title: "Primavera piena",
        text: "La luce diventa piu generosa e la citta tende ad alleggerirsi. Restano possibili passaggi freschi o ventosi, ma la stagione si fa piu stabile e ariosa."
      },
      {
        start: "05-21",
        end: "06-20",
        id: "early-summer-genoa",
        title: "Verso l\'estate",
        text: "Le ore di luce sono lunghe e il clima invita a stare fuori. La sera puo ancora essere gradevole, ma il sole di giorno comincia a farsi sentire."
      },
      {
        start: "06-21",
        end: "08-31",
        id: "summer-genoa",
        title: "Estate ligure",
        text: "Periodo di luce piena, caldo crescente e giornate che invitano al mare o alle uscite serali. Da tenere d\'occhio afa e giornate molto luminose."
      },
      {
        start: "09-01",
        end: "10-15",
        id: "early-autumn-genoa",
        title: "Autunno ancora mite",
        text: "L\'estate lascia spazio a una luce piu morbida. Le giornate restano spesso piacevoli, ma aumentano i segnali di instabilita e i primi richiami dell\'autunno."
      },
      {
        start: "10-16",
        end: "11-30",
        id: "deep-autumn-genoa",
        title: "Autunno ligure",
        text: "Tempo piu mobile, aria piu umida e giornate che si accorciano in modo evidente. Periodo da vivere con piu attenzione a pioggia, vento e sbalzi."
      },
      {
        start: "12-01",
        end: "01-31",
        id: "winter-genoa",
        title: "Inverno mediterraneo",
        text: "A Genova l\'inverno ha una sua misura: luce breve, aria talvolta pungente e giornate che possono alternare cielo limpido, umidita e vento."
      },
      {
        start: "02-01",
        end: "03-20",
        id: "late-winter-genoa",
        title: "Fine inverno",
        text: "Il freddo puo ancora farsi sentire, ma la luce comincia a cambiare. E il tratto dell\'anno in cui si percepisce il ritorno della stagione nuova."
      }
    ],

    foodRanges: [
      {
        start: "03-21",
        end: "04-30",
        items: ["Asparagi", "Carciofi", "Fave", "Piselli", "Fragole", "Nespole"],
        note: "Periodo buono per sapori verdi, piatti piu leggeri e primi ingredienti davvero primaverili."
      },
      {
        start: "05-01",
        end: "06-30",
        items: ["Zucchine", "Ciliegie", "Albicocche", "Fagiolini", "Lattuga", "Basilico"],
        note: "La tavola diventa piu fresca, profumata e adatta a pranzi leggeri o serate all\'aperto."
      },
      {
        start: "07-01",
        end: "08-31",
        items: ["Pomodori", "Pesche", "Melone", "Anguria", "Cetrioli", "Fichi"],
        note: "Mesi di frutta acquosa, verdure piene e cucina semplice, estiva, immediata."
      },
      {
        start: "09-01",
        end: "10-31",
        items: ["Uva", "Funghi", "Zucca", "Fichi", "Pere", "Castagne"],
        note: "Sapori piu tondi e passaggio graduale verso piatti piu caldi e autunnali."
      },
      {
        start: "11-01",
        end: "01-31",
        items: ["Broccoli", "Cavolfiore", "Arance", "Mandarini", "Finocchi", "Carciofi"],
        note: "Stagione da cucina piu piena, comfort food e ingredienti robusti ma netti."
      },
      {
        start: "02-01",
        end: "03-20",
        items: ["Cavoli", "Spinaci", "Carciofi", "Arance", "Kiwi", "Bietole"],
        note: "Ultimo tratto dell\'inverno: tavola semplice, verdure forti e primi segnali di cambiamento."
      }
    ],

    practicalTips: [
      "Porta qualcosa di leggero per la sera: il giorno puo illudere, ma l\'aria cambia in fretta.",
      "Se esci nel pomeriggio, approfitta della luce lunga ma non fidarti troppo del cielo.",
      "Giornata adatta a una passeggiata o a una gita breve, meglio con una giacca nello zaino.",
      "La luce del tardo pomeriggio puo essere bellissima: sfruttala, ma occhio al vento.",
      "Muoviti leggero: in questa stagione conviene vestirsi a strati e non a scommessa."
    ],

    proverbFallbacks: [
      {
        original: "A-o tempo ghe veu o passo giusto.",
        translation: "Al tempo ci vuole il passo giusto.",
        note: "Un invito a prendere la giornata per quello che e, senza forzarla."
      },
      {
        original: "Pian pianin se va lontan.",
        translation: "Piano piano si va lontano.",
        note: "Buona chiusura di giornata: costanza piu che fretta."
      },
      {
        original: "Chi guarda o ce, no perde a via.",
        translation: "Chi guarda il cielo non perde la strada.",
        note: "Perfetto per una pagina che racconta il giorno."
      }
    ]
  };
})();
