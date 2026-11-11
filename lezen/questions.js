/*
 * Opdrachtenbank Lezen A2: vorm gebaseerd op het echte examen en de officiële
 * oefenexamens (25 meerkeuzevragen over 9-10 korte teksten, 65 minuten).
 * Geen echte examenvragen: alle teksten en vragen zijn zelf geschreven.
 *
 * Elke vraag heeft drie antwoorden. De uitleg noemt ook waarom de andere
 * antwoorden fout zijn, zoals in de antwoordsleutel van DUO-oefenmateriaal.
 */

const TEKSTSOORTEN = {
  brief: "Brief",
  email: "E-mail",
  folder: "Folder",
  tabel: "Overzicht",
  formulier: "Formulier",
  mededeling: "Mededeling",
  artikel: "Artikel",
  bericht: "Bericht",
};

const EXAM_BLUEPRINT = {
  size: 25,
  durationSeconds: 65 * 60,
  // De officiële cesuur stelt de minister per examen vast en is niet openbaar.
  // Oefenmateriaal noemt 18 of 19 van de 25; deze site gebruikt 18.
  passScore: 18,
  tekstenPerExamen: [9, 10],
};

const EXAMENS = [
  {
    id: "lezen-1-moeilijk",
    naam: "Oefenexamen 1 · moeilijk",
    uitleg:
      "Negen teksten en 25 vragen, in de vorm van het echte examen. De teksten zijn langer dan gemiddeld en de foute antwoorden lijken vaak op het juiste antwoord.",
    teksten: [
      {
        id: "t1",
        soort: "brief",
        titel: "Extra controle van uw bloeddruk",
        situatie:
          "Yasmin krijgt een brief van haar huisartsenpraktijk over haar bloeddruk en een griepprik.",
        body: [
          "Geachte mevrouw Yildiz,",
          "Uw bloeddruk was in september te hoog. Daarom nodigen wij u uit voor een extra controle. De controle duurt ongeveer twintig minuten. U hoeft niet te vasten, maar drink vooraf geen koffie en rook niet in het uur voor de meting.",
          "De controle is op dinsdag 4 november tussen 08.00 en 12.00 uur of op donderdag 6 november tussen 14.00 en 17.00 uur. Maak zelf een afspraak via de website of bel de balie. Let op: op woensdag is de praktijk gesloten.",
          "Neem uw lijst met medicijnen mee. Gebruikt u een eigen bloeddrukmeter? Neem die dan ook mee. De assistente vergelijkt uw metingen met de onze.",
          "Wilt u ook een griepprik? Die kunt u op dezelfde afspraak krijgen. De griepprik is gratis voor mensen van 60 jaar en ouder. Bent u jonger, dan betaalt u € 22,50. U kunt de griepprik ook later halen op de inloopochtend van zaterdag 15 november, van 09.00 tot 11.00 uur.",
          "Hebt u koorts of bent u verkouden? Bel dan de praktijk en verzet uw afspraak. Kom niet met klachten naar de praktijk.",
          "Met vriendelijke groet,",
          "Assistente M. de Groot",
        ],
        vragen: [
          {
            id: "t1-v1",
            vraag: "Waarom krijgt Yasmin deze brief?",
            opties: [
              "Omdat zij een afspraak heeft gemaakt voor de griepprik.",
              "Omdat haar bloeddruk extra gecontroleerd moet worden.",
              "Omdat de praktijk op woensdag gesloten is.",
            ],
            juist: 1,
            uitleg:
              "Haar bloeddruk was te hoog, daarom komt er een extra controle. De griepprik is een extraatje bij die afspraak en de sluiting op woensdag is alleen praktische informatie.",
          },
          {
            id: "t1-v2",
            vraag: "Wat moet Yasmin vóór de bloeddrukmeting niet doen?",
            opties: [
              "Koffie drinken.",
              "Haar medicijnen innemen.",
              "Haar eigen bloeddrukmeter meenemen.",
            ],
            juist: 0,
            uitleg:
              "De brief zegt: drink vooraf geen koffie en rook niet in het uur voor de meting. Medicijnen innemen wordt niet verboden en de meter moet juist mee.",
          },
          {
            id: "t1-v3",
            vraag: "Yasmin is 45 jaar en wil de griepprik. Wat betaalt zij daarvoor?",
            opties: ["Niets.", "€ 22,50.", "€ 45,00."],
            juist: 1,
            uitleg:
              "Gratis is alleen voor mensen van 60 jaar en ouder. Yasmin is jonger en betaalt daarom € 22,50.",
          },
          {
            id: "t1-v4",
            vraag: "Yasmin heeft op de dag van de controle koorts. Wat moet zij doen?",
            opties: [
              "Naar de inloopochtend op zaterdag gaan.",
              "De praktijk bellen en de afspraak verzetten.",
              "Toch komen, maar een mondkapje dragen.",
            ],
            juist: 1,
            uitleg:
              "Bij koorts of verkoudheid moet zij bellen en de afspraak verzetten. De inloopochtend is alleen voor de griepprik en over een mondkapje staat niets in de brief.",
          },
        ],
      },
      {
        id: "t2",
        soort: "email",
        titel: "Verzoek andere werktijden",
        situatie:
          "Karim wil zijn werktijden veranderen. Hij mailt zijn leidinggevende, mevrouw Bakker.",
        body: [
          "Aan: s.bakker@bedrijf.nl",
          "Onderwerp: Verzoek andere werktijden",
          "Beste mevrouw Bakker,",
          "Ik werk nu van maandag tot en met vrijdag van 07.00 tot 15.00 uur. Mijn dochter gaat vanaf 1 december naar een nieuwe school. De school begint om 08.30 uur en gaat om 14.30 uur uit.",
          "Daarom wil ik graag van 08.30 tot 16.30 uur werken. Op woensdag kan ik niet, want dan past mijn moeder niet op. Ik wil woensdag graag vrij zijn.",
          "Mijn collega Dennis kan op woensdag mijn werk doen. Hij heeft dat al met mij besproken en hij vindt het goed.",
          "Kan ik met u over dit verzoek praten? Ik kan op donderdag 20 november om 10.00 uur of op vrijdag 21 november om 15.00 uur.",
          "Met vriendelijke groet,",
          "Karim Haddad",
        ],
        vragen: [
          {
            id: "t2-v1",
            vraag: "Waarom wil Karim andere werktijden?",
            opties: [
              "Omdat hij zijn dochter naar school wil brengen en ophalen.",
              "Omdat hij op woensdag bij zijn moeder moet werken.",
              "Omdat hij op vrijdag eerder wil beginnen.",
            ],
            juist: 0,
            uitleg:
              "De nieuwe school begint om 08.30 uur en gaat om 14.30 uur uit; zijn huidige dienst past daar niet bij. Zijn moeder past juist niet op woensdag.",
          },
          {
            id: "t2-v2",
            vraag: "Wat stelt Karim voor om het werk op woensdag op te lossen?",
            opties: [
              "Zijn moeder neemt het werk over.",
              "Dennis doet op woensdag zijn werk.",
              "Hij begint op woensdag later.",
            ],
            juist: 1,
            uitleg:
              "Dennis kan volgens Karim op woensdag zijn werk doen. Zijn moeder past niet op en later beginnen is geen oplossing voor de hele woensdag.",
          },
        ],
      },
      {
        id: "t3",
        soort: "folder",
        titel: "Bezorgen bij supermarkt De Linde",
        situatie: "Mila leest de folder van supermarkt De Linde.",
        body: [
          "Bestel online en wij brengen uw boodschappen thuis. Bestellen kan iedere dag tot 20.00 uur. Bezorgen kan van maandag tot en met zaterdag, tussen 09.00 en 19.00 uur. Op zondag bezorgen wij niet.",
          "Bezorgen kost € 3,50. Bij een bestelling van € 50,00 of meer is bezorgen gratis. Wilt u alleen boodschappen ophalen? Dan betaalt u geen bezorgkosten. Haal uw bestelling dan op bij de balie bij ingang 2.",
          "Let op: koelverse producten bezorgen wij alleen in de ochtend. Dat is beter voor de kwaliteit. U kunt tot 12.00 uur 's middags nog een bestelling voor de volgende dag aanpassen.",
          "Een bestelling annuleren kan tot twee uur voor de bezorgtijd. Daarna betaalt u de bezorgkosten. Alcohol bezorgen wij niet aan jongeren onder de 18 jaar. De bezorger vraagt altijd om een identiteitsbewijs.",
        ],
        vragen: [
          {
            id: "t3-v1",
            vraag: "Mila bestelt voor € 56,00. Wat betaalt zij voor het bezorgen?",
            opties: ["Niets.", "€ 3,50.", "€ 50,00."],
            juist: 0,
            uitleg:
              "Vanaf € 50,00 is bezorgen gratis. Bij een kleinere bestelling betaalt zij € 3,50; het bestelbedrag zelf is geen bezorgkosten.",
          },
          {
            id: "t3-v2",
            vraag:
              "Mila wil op zondag koelverse producten laten bezorgen. Kan dat?",
            opties: [
              "Ja, bestellen kan iedere dag tot 20.00 uur.",
              "Nee, op zondag wordt niet bezorgd.",
              "Ja, maar dan betaalt zij € 3,50 extra.",
            ],
            juist: 1,
            uitleg:
              "Op zondag bezorgt De Linde niet. Dat bestellen tot 20.00 uur kan, geldt voor het bestellen, niet voor het bezorgen.",
          },
        ],
      },
      {
        id: "t4",
        soort: "tabel",
        titel: "Cursussen bij Buurthuis De Es",
        situatie:
          "In het buurthuis hangt een overzicht van de cursussen van dit najaar.",
        body: [
          "Alle cursussen bestaan uit acht lessen. Aanmelden kan bij de balie tot vrijdag 31 oktober. Betalen doet u bij de eerste les. Er is geen les in de herfstvakantie (21 tot en met 29 oktober). Wie een les mist, betaalt niet minder.",
          {
            tabel: {
              kop: ["Cursus", "Dag en tijd", "Prijs", "Bijzonderheden"],
              rijen: [
                ["Nederlands schrijven", "maandag 19.00-20.30", "€ 25", "boek € 12"],
                ["Koken voor thuis", "dinsdag 18.00-20.00", "€ 40", "max. 10 mensen"],
                ["Basis computer", "woensdag 14.00-16.00", "€ 30", "laptop niet nodig"],
                ["Fotografie", "donderdag 19.30-21.00", "€ 35", "eigen camera nodig"],
                ["Gitaar voor beginners", "zaterdag 10.00-11.00", "€ 45", "gitaar huren € 5 per les"],
              ],
            },
          },
          "Op dinsdag 4 november is er een gratis proefles Koken voor thuis. Vragen? Mail naar cursus@buurthuis.nl.",
        ],
        vragen: [
          {
            id: "t4-v1",
            vraag: "Nabil wil fotograferen met zijn eigen camera. Welke cursus past bij hem?",
            opties: [
              "Fotografie.",
              "Basis computer.",
              "Gitaar voor beginners.",
            ],
            juist: 0,
            uitleg:
              "Bij Fotografie is een eigen camera nodig. Basis computer vraagt geen laptop en bij Gitaar huurt u een gitaar.",
          },
          {
            id: "t4-v2",
            vraag:
              "Sanne wil Koken voor thuis en Fotografie doen. Wat betaalt zij samen, zonder extra's?",
            opties: ["€ 65.", "€ 75.", "€ 85."],
            juist: 1,
            uitleg:
              "Koken kost € 40 en Fotografie € 35, samen € 75. De bedragen € 65 en € 85 komen van verkeerd optellen.",
          },
          {
            id: "t4-v3",
            vraag:
              "Sanne meldt zich op 2 november aan voor Koken voor thuis. Wat gebeurt er?",
            opties: [
              "Zij kan niet meer meedoen: aanmelden kon tot 31 oktober.",
              "Zij kan meedoen en betaalt bij de eerste les.",
              "Zij kan meedoen, maar betaalt € 5 extra.",
            ],
            juist: 0,
            uitleg:
              "De aanmeldtermijn sluit op vrijdag 31 oktober. De proefles op 4 november is iets anders dan de cursus zelf.",
          },
        ],
      },
      {
        id: "t5",
        soort: "formulier",
        titel: "Melding openbare ruimte",
        situatie:
          "Tomas ziet een kapotte lantaarnpaal en veel afval. Hij vult het meldformulier van de gemeente in.",
        body: [
          "De gemeente doet niets met anonieme meldingen. U krijgt binnen vijf werkdagen een bericht. Is het gevaarlijk? Bel dan direct 14070.",
          {
            tabel: {
              kop: ["Veld", "Ingevuld"],
              rijen: [
                ["Naam", "Tomas Nowak"],
                ["Adres", "Duinstraat 14"],
                ["Postcode en woonplaats", "2513 KX Den Haag"],
                ["Telefoon", "06 2841 9930"],
                ["E-mail", "t.nowak@mail.nl"],
                ["Wat wilt u melden?", "Kapotte lantaarnpaal"],
                ["Waar is het?", "Tegenover Duinstraat 21, bij de speeltuin"],
                ["Sinds wanneer?", "Sinds zondag 9 november"],
                [
                  "Wat is er precies aan de hand?",
                  "De lamp is kapot en er liggen vuilniszakken onder de paal. 's Avonds is het daar heel donker.",
                ],
                ["Hebt u dit eerder gemeld?", "Nee."],
              ],
            },
          },
        ],
        vragen: [
          {
            id: "t5-v1",
            vraag: "Wat meldt Tomas bij de gemeente?",
            opties: [
              "Afval en geluidsoverlast.",
              "Een kapotte lantaarnpaal en afval.",
              "Een kapotte speeltuin.",
            ],
            juist: 1,
            uitleg:
              "Hij kiest 'kapotte lantaarnpaal' en schrijft dat er vuilniszakken onder de paal liggen. Over geluidsoverlast en een kapotte speeltuin staat niets in het formulier.",
          },
          {
            id: "t5-v2",
            vraag: "Wanneer krijgt Tomas een bericht van de gemeente?",
            opties: ["Binnen 24 uur.", "Binnen vijf werkdagen.", "Niet, want hij meldt het anoniem."],
            juist: 1,
            uitleg:
              "De gemeente antwoordt binnen vijf werkdagen. Zijn naam, adres en e-mail zijn ingevuld, dus de melding is niet anoniem.",
          },
        ],
      },
      {
        id: "t6",
        soort: "mededeling",
        titel: "Nieuwe openingstijden",
        situatie:
          "Lina leest een mededeling op de deur van sportschool Fit & Vrij.",
        body: [
          "Beste leden,",
          "Vanaf maandag 1 december veranderen onze openingstijden. We zijn dan op werkdagen open van 06.30 tot 22.00 uur. Op zaterdag van 08.00 tot 18.00 uur. Op zondag zijn we gesloten. Nu zijn we op zondag nog open van 10.00 tot 14.00 uur.",
          "De groepslessen van 07.00 uur vervallen. De les Bodyfit van maandag 07.00 uur verhuist naar dinsdag 19.00 uur. De les Yoga van donderdag 20.00 uur blijft op dezelfde tijd.",
          "Het zwembad is in december gesloten voor onderhoud. In januari kunt u weer zwemmen. Leden met een zwemabonnement betalen in december de helft.",
          "Let op: in de kerstvakantie (22 december tot 4 januari) is de sportschool alleen open van 10.00 tot 16.00 uur. De groepslessen gaan in die weken niet door.",
          "Vragen? Mail naar info@fitvrij.nl of spreek de balie aan.",
          "Team Fit & Vrij",
        ],
        vragen: [
          {
            id: "t6-v1",
            vraag: "Wat verandert er op zondag?",
            opties: [
              "De sportschool gaat eerder open.",
              "De sportschool is dan dicht.",
              "Er komen extra groepslessen.",
            ],
            juist: 1,
            uitleg:
              "Vanaf 1 december is de sportschool op zondag gesloten; nu is zij nog open van 10.00 tot 14.00 uur.",
          },
          {
            id: "t6-v2",
            vraag:
              "Lina doet mee met Bodyfit op maandag 07.00 uur. Wat moet zij vanaf december doen?",
            opties: [
              "Naar de les op dinsdag 19.00 uur gaan.",
              "Naar de les op donderdag 20.00 uur gaan.",
              "Stoppen met de groepslessen.",
            ],
            juist: 0,
            uitleg:
              "Bodyfit verhuist naar dinsdag 19.00 uur. Donderdag 20.00 uur is de les Yoga.",
          },
          {
            id: "t6-v3",
            vraag:
              "Lina wil op dinsdag 30 december sporten. Tussen welke tijden kan dat?",
            opties: ["06.30 tot 22.00 uur.", "10.00 tot 16.00 uur.", "08.00 tot 18.00 uur."],
            juist: 1,
            uitleg:
              "30 december valt in de kerstvakantie (22 december tot 4 januari). In die weken is de sportschool open van 10.00 tot 16.00 uur.",
          },
        ],
      },
      {
        id: "t7",
        soort: "artikel",
        titel: "Groenten uit de buurt",
        situatie:
          "In de wijkkrant staat een artikel over de nieuwe buurtmoestuin.",
        body: [
          "Achter het buurthuis ligt sinds september een buurtmoestuin. Buurtbewoners verbouwen daar samen groenten en fruit. Er zijn twintig tuintjes. Achttien zijn al vergeven. Twee tuintjes zijn nog vrij voor bewoners die niet eerder hebben meegedaan.",
          "Iedere zaterdagochtend werken vrijwilligers van 09.00 tot 12.00 uur in de tuin. Iedereen mag helpen, ook kinderen. Wie meehelpt, mag groenten meenemen naar huis. Het is niet nodig om een eigen tuintje te hebben.",
          "De gemeente gaf geld voor de tuin. Het water komt uit een regenton. In de zomer mogen bewoners geen kraanwater gebruiken, omdat dat te duur is.",
          "Er is één regel: gebruik geen bestrijdingsmiddelen. De tuin moet ook veilig zijn voor bijen en vogels.",
          "Wilt u een tuintje? Stuur een e-mail naar tuin@wijkkrant.nl. Vertel daarin waarom u mee wilt doen. De gemeente kiest niet: de volgorde van aanmelden telt.",
          "Opening: zaterdag 6 december om 14.00 uur, met soep en brood.",
        ],
        vragen: [
          {
            id: "t7-v1",
            vraag: "Wie kan er nog een tuintje krijgen?",
            opties: [
              "Alleen mensen met ervaring in de tuin.",
              "Bewoners die nog niet eerder meededen.",
              "Alleen gezinnen met kinderen.",
            ],
            juist: 1,
            uitleg:
              "De twee vrije tuintjes zijn voor bewoners die niet eerder hebben meegedaan. Over ervaring of kinderen staat niets bij de vrije tuintjes.",
          },
          {
            id: "t7-v2",
            vraag: "Moet je een eigen tuintje hebben om te komen helpen?",
            opties: [
              "Ja, alleen mensen met een tuintje mogen helpen.",
              "Nee, iedereen mag helpen en groenten meenemen.",
              "Nee, maar je moet wel je eigen gereedschap meenemen.",
            ],
            juist: 1,
            uitleg:
              "Iedereen mag helpen, ook zonder eigen tuintje, en wie helpt mag groenten meenemen. Over eigen gereedschap staat niets in de tekst.",
          },
          {
            id: "t7-v3",
            vraag: "Waarom mag er in de zomer geen kraanwater worden gebruikt?",
            opties: [
              "Omdat kraanwater te duur is.",
              "Omdat het water uit de kraan vies is.",
              "Omdat de tuin in de zomer dicht is.",
            ],
            juist: 0,
            uitleg:
              "De tekst zegt letterlijk dat kraanwater te duur is. De tuin is in de zomer open en over vies water staat niets in de tekst.",
          },
        ],
      },
      {
        id: "t8",
        soort: "brief",
        titel: "Onderhoud aan de verwarming",
        situatie:
          "Amal krijgt een brief van de woningcorporatie over onderhoud aan de verwarming.",
        body: [
          "Geachte mevrouw Amrani,",
          "In uw woning aan de Lavendelstraat 8 wordt de verwarming niet goed warm. U meldde dit op 3 november. Onze monteur komt op donderdag 20 november tussen 13.00 en 17.00 uur. Hij heeft ongeveer 45 minuten nodig.",
          "U hoeft niet de hele middag thuis te zijn als u een sleutel bij een buur achterlaat. Schrijf dan vóór 15 november de naam en het huisnummer van die buur op de kaart en stop de kaart in de brievenbus bij de ingang. De sleutel zelf mag niet in de brievenbus.",
          "De monteur controleert ook de kachel in de woonkamer. Zorg dat de kast onder de ketel leeg is. Haal dozen en flessen weg.",
          "Na het bezoek krijgt u een brief met wat de monteur heeft gedaan. Is de verwarming daarna nog niet warm? Bel dan binnen drie dagen naar 088 220 44 10. Dan komt de monteur opnieuw. Voor een tweede bezoek betaalt u niets als het probleem niet is opgelost.",
          "Woont u er niet op 20 november? Bel dan voor 15 november om een nieuwe afspraak. Een afspraak in de avond is niet mogelijk.",
          "Met vriendelijke groet,",
          "J. de Wit",
          "Woningcorporatie Achterhoek",
        ],
        vragen: [
          {
            id: "t8-v1",
            vraag: "Waarom schrijft de corporatie deze brief?",
            opties: [
              "Omdat Amal een nieuwe verwarming heeft gekocht.",
              "Omdat de verwarming in haar woning niet goed werkt.",
              "Omdat zij haar huur te laat heeft betaald.",
            ],
            juist: 1,
            uitleg:
              "Zij meldde op 3 november dat de verwarming niet goed warm wordt; daarom komt de monteur. Over een nieuwe verwarming of te late huur staat niets in de brief.",
          },
          {
            id: "t8-v2",
            vraag: "Amal is op 20 november niet thuis. Wat kan zij doen?",
            opties: [
              "De sleutel in de brievenbus bij de ingang doen.",
              "Voor 15 november de naam van een buur met een sleutel doorgeven.",
              "Een afspraak in de avond maken.",
            ],
            juist: 1,
            uitleg:
              "Zij mag de naam en het huisnummer van een buur op de kaart schrijven en die kaart in de brievenbus doen. De sleutel zelf mag daar niet in, en een avondafspraak is niet mogelijk.",
          },
          {
            id: "t8-v3",
            vraag:
              "De verwarming is na het bezoek nog steeds koud. Wat moet Amal doen?",
            opties: [
              "Binnen drie dagen bellen; het tweede bezoek is dan gratis.",
              "Zelf een andere monteur betalen.",
              "Wachten tot het volgende onderhoud.",
            ],
            juist: 0,
            uitleg:
              "Zij moet binnen drie dagen bellen. Komt de monteur opnieuw voor hetzelfde probleem, dan betaalt zij niets.",
          },
        ],
      },
      {
        id: "t9",
        soort: "bericht",
        titel: "Mama komt morgen thuis",
        situatie:
          "Sofia krijgt een bericht van haar zus Nadia over het ophalen van hun moeder en het eten.",
        body: [
          "Hoi Sofia,",
          "Kun je mij morgen helpen? Mama komt morgen om 15.30 uur met de trein uit Arnhem. Ik moet tot 17.00 uur werken, dus ik kan haar niet ophalen.",
          "Haal jij haar van het station? Ze heeft een zware tas bij zich. Neem de bus terug, want met de tas is lopen te ver.",
          "Ik heb vanmiddag eten gekookt. Het staat in de koelkast bij mama. Wil jij het om 18.00 uur opwarmen? Mama eet geen varkensvlees. Er is soep en rijst met kip.",
          "De sleutel van mama ligt onder de bloempot bij de deur. Leg hem daarna terug. Ik kom rond 19.30 uur bij jullie.",
          "Bel me als de trein later komt.",
          "Liefs, Nadia",
        ],
        vragen: [
          {
            id: "t9-v1",
            vraag: "Waarom kan Nadia hun moeder niet ophalen?",
            opties: [
              "Zij heeft geen vervoer.",
              "Zij moet tot 17.00 uur werken.",
              "Zij is ziek.",
            ],
            juist: 1,
            uitleg:
              "Nadia schrijft dat zij tot 17.00 uur moet werken en hun moeder al om 15.30 uur aankomt. Over ziekte of vervoer staat niets in het bericht.",
          },
          {
            id: "t9-v2",
            vraag: "Wat moet Sofia met de sleutel van hun moeder doen?",
            opties: [
              "Meenemen naar haar eigen huis.",
              "Terugleggen onder de bloempot.",
              "Aan de buur geven.",
            ],
            juist: 1,
            uitleg:
              "De sleutel ligt onder de bloempot en moet daar terug. Over de buur staat niets in het bericht.",
          },
          {
            id: "t9-v3",
            vraag: "Hoe laat komt Nadia bij hen?",
            opties: ["Om 15.30 uur.", "Om 18.00 uur.", "Om 19.30 uur."],
            juist: 2,
            uitleg:
              "Nadia komt rond 19.30 uur. Om 15.30 uur komt hun moeder aan en om 18.00 uur moet het eten worden opgewarmd.",
          },
        ],
      },
    ],
  },
];

function aantalVragen(examen) {
  return examen.teksten.reduce((som, tekst) => som + tekst.vragen.length, 0);
}

if (typeof module !== "undefined") {
  module.exports = {
    TEKSTSOORTEN,
    EXAM_BLUEPRINT,
    EXAMENS,
    aantalVragen,
  };
}
