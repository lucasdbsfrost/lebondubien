/*
 * Textes du site, repris de lebondubien.fr.
 * Pour corriger un texte, modifiez-le ici : la page se met à jour toute seule.
 * Les paragraphes sont séparés par une ligne vide.
 */
window.LBDB = window.LBDB || {};

LBDB.devise = 'Pacem, Felicitatem, Singularitatem';

/* Rejoindre l'Éveil : chaque univers renvoie vers son serveur Discord. */
LBDB.univers = [
  { id: 'neutre', nom: 'Neutre', lien: 'https://discord.gg/9sN8J43g4K' },
  { id: 'minecraft', nom: 'Minecraft', lien: 'https://discord.gg/7qfPDX4NKy' },
  { id: 'metro', nom: 'Metro', lien: 'https://discord.gg/9sN8J43g4K' },
  { id: 'gmod', nom: 'GMod', lien: 'https://discord.gg/9sN8J43g4K' },
];

/* Images : cherchées d'abord dans le dossier images/, puis en ligne si elles manquent. */
LBDB.images = {
  blason: 'blason.png',
  moines: 'moines.png',
  fideles: 'fideles.png',
  templiers: 'templiers.png',
  kerberos: 'kerberos.png',
  justitia: 'justitia.png',
};
LBDB.imagesEnLigne = 'https://lebondubien.fr/';

LBDB.accueil = {
  titre: ['Trouvez refuge.', 'Rejoignez l’Éveil.'],
  chapeau: "Le monde s'est brisé : pas nous. Le Bon du Bien accueille chacun, protège les siens et garde la Lumière allumée. Venez tel que vous êtes.",
  note: 'Aucune croyance reniée. Aucune origine refusée. On ne combat que la haine.',
  engagements: [
    { titre: 'Un refuge ouvert', texte: 'Les portes ne se ferment à personne' },
    { titre: 'Une communauté', texte: "Le partage avant l'accumulation" },
    { titre: 'Un serment', texte: 'Protéger plus faible que soi' },
  ],
  cotes: [
    { titre: 'Paix', sous: 'un seuil sûr', texte: "Le refuge est inviolable. Quiconque y entre dépose la haine au seuil. Ici, le cauchemar s'arrête à la porte." },
    { titre: 'Prospérité', sous: 'le partage', texte: "De la communauté naît l'abondance partagée : le pain, l'eau, la chaleur, le savoir. La communauté avant l'individu." },
    { titre: 'Unité', sous: 'un peuple', texte: "Un Dieu Unique, un peuple uni. La foi rassemble les croyances plutôt qu'elle ne les nie. La différence est une force." },
  ],
  pas: [
    { titre: 'Déposer la haine', texte: "Au seuil, on laisse les rancunes. Le refuge ne s'ouvre qu'aux mains vides de violence." },
    { titre: 'Protéger les siens', texte: "Veiller sur plus faible que soi. C'est le geste fondateur du Bon du Bien." },
    { titre: 'Garder le serment', texte: "Pacem, Felicitatem, Singularitatem. Le reste s'apprend auprès des Éveillés." },
  ],
  appel: {
    titre: "L'Éveil vous attend",
    texte: 'Nul besoin de renier votre passé. Venez tel que vous êtes ; la Lumière fait le reste.',
    serment: "Déposer la haine au seuil. Protéger plus faible que soi. Garder le serment. Le reste s'apprend auprès des Éveillés.",
  },
  pied: [
    'Dans un monde brisé, une foi qui accueille chacun. Nous ne combattons que la haine.',
    'Déposez la haine au seuil. On vous accueille tel que vous êtes.',
  ],
};

LBDB.foi = {
  titre: "Qu'est-ce que le Bon du Bien ?",
  intro: `Le Bon du Bien est un tout : une religion, une idéologie, une pensée. Chacun peut y appartenir, pourvu qu'il en suive les idées et prête serment.

Il accueille son prochain quels que soient sa religion, ses idéologies, ses origines et ses orientations. Son but est simple : apporter la paix, la prospérité et l'unité au monde, et améliorer les conditions de vie du genre humain, l'accès à l'eau, à l'électricité, à la nourriture et à l'éducation.`,
  preceptes: [
    { latin: 'Pacem', titre: 'La Paix', texte: "Le Bon du Bien accueille son prochain quels que soient sa religion, ses idéologies, ses origines et ses orientations. Il ne combat qu'une seule sorte d'ennemis : ceux qui ne sont que haine et violence, qui dénigrent les préceptes et les fidèles." },
    { latin: 'Felicitatem', titre: 'La Prospérité', texte: "Améliorer l'accès à l'eau courante, à l'électricité, à la nourriture et à l'éducation. Le savoir compte parmi les ressources les plus précieuses : le Bon du Bien recherche activement les scientifiques et les livres." },
    { latin: 'Singularitatem', titre: "L'Unité", texte: "Depuis les bombes, l'humanité s'entre-déchire. Le Bon du Bien veut rassembler organisations et factions en une seule entité, le genre humain, pour mener les dernières guerres saintes et reconquérir le monde." },
  ],
  symboles: [
    { nom: 'Le triangle', texte: 'Chacun de ses trois côtés porte un précepte : Paix, Prospérité, Unité.' },
    { nom: 'Les épées', texte: "La force de l'Ordre du Temple, bras armé de la foi." },
    { nom: 'Le livre', texte: "Le savoir, la connaissance et l'ouverture d'esprit." },
    { nom: "L'aigle à deux têtes", texte: 'La séparation entre le monde des vivants et celui des morts.' },
  ],
  couleurs: [
    { nom: 'Le Rouge', cle: 'rouge', texte: 'La Force : celle du sang, de la passion, du bras qui protège.' },
    { nom: 'Le Noir', cle: 'noir', texte: 'Le Mal : les ténèbres que nous combattons.' },
    { nom: 'Le Blanc', cle: 'blanc', texte: 'La Lumière : là où nous menons les âmes égarées.' },
  ],
  croyants: {
    intro: "Le Bon du Bien n'exige pas une seule forme de foi. Religieux ou non, chacun trouve sa place pourvu qu'il en suive les idées.",
    religieux: [
      { titre: 'Les purs fidèles', texte: 'Ils ne croient qu\'au Bon du Bien. Ils font les prières, assistent aux messes et voient le Saint-Père Negan comme celui qui transmet la parole de Dieu, la voix universelle, un être exceptionnel et saint.' },
      { titre: 'Les éveillés', texte: "Venus d'une autre religion, ils ont choisi d'embrasser la parole du Bon du Bien. Certains s'y consacrent pleinement, d'autres gardent quelques rites de leur ancienne foi. Tous voient le Saint-Père Negan comme un saint." },
    ],
    nonCroyants: [
      'Ceux qui ne croient pas en Dieu, mais voient un culte de la personnalité autour du Saint-Père Negan et des Apôtres.',
      'Ceux qui considèrent le Saint-Père comme un simple visionnaire, le seul capable de guider l\'humanité.',
      "Ceux qui croient en la réussite de l'institution du Bon du Bien, sans croire aux Apôtres ni en un dieu.",
    ],
    citation: { texte: 'Peu importe ce que vous croyez : ici, il y a une place pour tous ceux qui veulent le bien de l\'humanité.', auteur: "Père Trotskov, l'Apôtre Fondateur" },
  },
  religion: {
    titre: 'Un seul Dieu, mille visages',
    texte: 'Le Bon du Bien croit qu\'il existe un seul Dieu, et que les hommes, selon les civilisations, les âges et les époques, en ont eu des interprétations différentes. Ainsi, polythéistes et monothéistes croient tous en notre Dieu. Ils en ont simplement une vision différente.',
  },
  concept: [
    { titre: "Le soft power d'abord", texte: 'Une théocratie ultra-expansionniste, ni pacifiste ni belliciste. Le Bon du Bien manie avant tout la transmission culturelle, la diplomatie et l’influence pour porter ses préceptes.' },
    { titre: 'Prêt à défendre les siens', texte: 'S’il le faut, l’Église sait se mobiliser et basculer en hard power pour protéger les fidèles et les préceptes contre ceux qui ne sont que haine et violence.' },
  ],
  echo: {
    source: 'Extrait de la Sainte Trinité Universelle, Fragment IV, 3ᵉ récit',
    citation: "La plus grande souffrance d'un homme est la solitude face à lui-même. L'Écho Mortis est l'incarnation de cette vérité. L'Infidèle y découvrira, pour l'éternité, qu'il est à la fois le geôlier, le tortionnaire et le prisonnier de son âme.",
    auteur: "Père Innocentis, l'Apôtre Déchu",
    intro: "L'Écho Mortis est le lieu où est jugée, après sa mort, toute personne ayant bafoué les valeurs et les préceptes du Bon du Bien. Il se manifeste comme un néant absolu, où le pécheur est voué à subir, pour l'éternité, un silence si profond qu'il perçoit les mouvements les plus infimes de son propre corps. Chaque battement, chaque flux devient un bruit intolérable, propre à consumer la raison de l'être le plus endurci, sans espoir de rémission.",
    chapitres: [
      { titre: 'Le Principe et les condamnés', texte: `Toute âme qui, de son vivant, a délibérément et durablement refusé d'écouter la parole sacrée, la détresse d'autrui ou les appels à l'unité du Bon du Bien se voit, dans l'au-delà, privée de toute perception extérieure. Son champ sensoriel, incapable de subsister dans le vide, se replie alors sur l'unique source de stimuli qui lui reste, son propre corps.` },
      { titre: "Mécanisme de la Damnation : L'Hyper-Conscience", texte: `La damnation n'est pas infligée par une entité extérieure, mais constitue un processus auto-entretenu. Privée de toute sensation venue du dehors, la conscience, dans son effort désespéré pour affirmer son existence, amplifie de façon exponentielle les signaux internes normalement imperceptibles. Elle s'enfonce ainsi dans un état d'hyper-conscience éternelle, où les fonctions organiques les plus élémentaires deviennent un supplice ininterrompu.

Le battement cardiaque, à peine perceptible dans la vie terrestre, se transforme en un martèlement sourd et régulier, semblable à un glas funèbre qui scande une éternité immobile. Chaque pulsation déchire le silence, rappelant au damné l'inexorable passage d'un temps désormais vide de sens.

L'estomac et les intestins, vidés pour l'éternité, deviennent des cavernes résonnantes. Des gargouillis secs et profonds, des spasmes musculaires atroces qui résonnent comme des coups de tonnerre lointains, rappellent une faim qui ne peut être apaisée et des fonctions digestives tournant à vide dans un corps qui n'a plus besoin de se nourrir, mais ne peut cesser de ressentir cette faim insatiable.

Chaque inspiration, bien que vaine, produit un sifflement aigu et rauque, comme l'air passant à travers un sas de sable fin. Chaque expiration est un gémissement étouffé, le son d'une vie qui tente de s'échapper mais ne le peut. Le damné devient terriblement conscient du mouvement de ses poumons, de l'expansion et de la contraction de sa cage thoracique, dans un cycle absurde et bruyant.

La peau elle-même devient une source d'agonie. Le damné perçoit le glissement des fibres musculaires sous le derme, le picotement sec d'une peau qui ne transpire plus, le frisson de terminaisons nerveuses cherchant en vain un stimulus extérieur. C'est la sensation d'être habité par une colonie d'insectes se déplaçant en permanence juste sous la surface.

Le flux du sang n'est plus seulement entendu, mais ressenti comme un réseau de rivières tumultueuses parcourant ses veines. Le damné perçoit chaque remous, chaque frottement dans ses artères, comme si un essaim invisible grouillait sous sa peau, dessinant une cartographie vivante et cauchemardesque de ses propres entrailles.

Le moindre micro-mouvement, la plus infime contraction musculaire, provoque un craquement sec et amplifié, comme si son squelette cherchait à se briser pour échapper à cette prison de chair à laquelle il ne peut échapper. La déglutition devient un bruit humide et obstrué, une tentative vaine d'étancher sa soif et d'avaler une panique qui n'a pas de voix.` },
      { titre: 'Le Cercle du Désespoir', texte: `L'horreur ultime de l'Écho Mortis réside dans cette pleine conscience que le damné a de son état. Il comprend, sans pouvoir jamais l'oublier, que cette torture est le reflet exact de son existence passée. Chaque battement est le rappel d'un cœur qui n'a battu que pour soi ; chaque ruissellement, le symbole d'une vie tournant autour de ses propres désirs. La folie qui s'ensuit impose au damné une lucidité forcée. Ce dernier assiste, impuissant, à la lente dislocation de son esprit, condamné à se haïr pour l'éternité.` },
      { titre: 'Justice et Rédemption', texte: `Le châtiment de l'Écho Mortis est d'une justesse implacable. Ceux ayant choisi l'isolement moral, ayant fermé leurs oreilles à la parole du Bien, se retrouvent enfermés dans la prison la plus solitaire qui soit. Leur être tout entier devient l'instrument et la cible de leur propre supplice. Aucun cri n'est possible, aucune prière n'est entendue. Il n'y a que l'écho sans fin de leur faute, résonant dans le néant qu'ils ont eux-mêmes choisi. Il n'y a que l'écho de la mort cherchant désespérément à rentrer dans un corps voué à une éternité malheureuse.` },
    ],
  },
};

LBDB.origines = {
  titre: 'La Chronique du Bon du Bien',
  intro: "L'histoire du Bon du Bien, réunie en un seul récit : de la première flamme jusqu'aux reliques sacrées d'aujourd'hui. Six générations, une même Lumière.",
  generations: [
    {
      num: 'I', nom: 'La Genèse', titre: 'La première flamme',
      texte: 'Dans les ténèbres des premiers jours, un illuminé se forge une réputation. De ses révélations naissent une foi et ses premiers fidèles.',
      faits: [
        { date: 'La vision', titre: 'Le Père Negan', texte: "Seul survivant d'une expédition, Negan découvre des textes sacrés et vit une expérience mystique. Convaincu d'un appel divin, il fonde l'Église du Bon du Bien." },
        { date: 'Les premiers pas', titre: 'Le Père Trotskov', texte: "Trotskov suit les pas de Negan pour porter l'essor de l'Église. À Coopa, les Hommes Libres se dressent en premiers obstacles." },
        { date: '27 août 2021', titre: "La bataille d'Urfim", texte: "Une attaque des Hommes Libres faillit emporter le Père ; le Grand Maître Sunshine y tombe. Trotskov survit, ou ressuscite. L'Inquisition tient le seuil : Whisper, Sombrage et Thanatos viennent de la Terre Sainte." },
        { date: 'Le retour', titre: 'Les trois pouvoirs', texte: "La chute du Baron ouvre le retour à Coopa. Julien (Clergé), Raznov (Temple) et Sombrage (Inquisition) centralisent enfin les trois pouvoirs de l'Église." },
      ],
    },
    {
      num: 'II', nom: 'Le développement', titre: 'Une terre à soi',
      texte: "L'Église chemine vers des contrées plus animées. De cette errance naît un refuge : une base saine pour les fidèles et pour tous ceux qui partagent l'idéal de paix.",
      faits: [
        { date: '2022', titre: 'Astra & Noctalia', texte: 'En chemin, des figures notables rejoignent les rangs : Maître Askeli, Klins et Ivan Troyani, quatrième Grand Maître du Temple.' },
        { date: '26 octobre 2022', titre: "La fondation d'Immaculem", texte: 'Dans la contrée de Landmark naît Immaculem : symbole de pureté et de paix, refuge des fidèles, saluée jusqu\'aux plus hautes sphères de la Terre Sainte.' },
        { date: '24 mars 2023', titre: 'Le premier Concile', texte: "Les Maîtres, le Grand Maître de l'Église, le Père Trotskov et les Apôtres se réunissent pour le premier concile du Bon du Bien." },
        { date: '31 mars 2023', titre: 'La 4ᵉ Guerre Sainte', texte: "Dans la contrée de TY, l'Église affronte un groupe de cannibales et révèle au monde entier la force et la bonté d'Immaculem." },
      ],
    },
    {
      num: 'III', nom: "L'expansion", titre: 'Un phare dans les ténèbres',
      texte: "Phare pour les civils, Immaculem porte le nom du Bon du Bien jusqu'aux contrées lointaines. Mais c'est dans la paix que surgit le trouble.",
      faits: [
        { date: '2023-2024', titre: 'Akho & Wolf', texte: "La renommée de l'Église gagne des terres lointaines, théâtre de la 5ᵉ Guerre Sainte." },
        { date: '14 juillet 2023', titre: "L'incendie d'Immaculem", texte: 'Un drame aux causes encore obscures coûte de nombreuses vies et de précieuses mémoires. Un Apôtre proclame la 6ᵉ Guerre Sainte contre les Monolithes, tenus pour responsables.' },
        { date: 'fin 2023', titre: 'Le retour à la paix', texte: "L'Ordre du Temple, mené par Ivan Troyani, éradique la menace et ramène la paix. Le deuxième grand Concile s'ouvre sur les causes du drame." },
      ],
    },
    {
      num: 'IV', nom: 'La prospérité', titre: 'Le dessein du Bon du Bien',
      texte: "L'histoire semble se répéter, mais Klins et Ivan Troyani s'efforcent d'instaurer une ère de prospérité, là où les anciens connurent le drame.",
      faits: [
        { date: '2024', titre: 'Croisades & alliances', texte: "Première croisade contre l'Ordre 25, puis 7ᵉ et 8ᵉ Guerres Saintes. Reconnu faction mineure influente, le Bon du Bien siège au Grand Banquet aux côtés des plus hautes sphères." },
        { date: '27 décembre 2024', titre: 'La 9ᵉ Guerre Sainte', texte: 'De retour de campagne, le Grand Maître Troyani déclare une nouvelle guerre sainte contre les Cannibales.' },
        { date: '25 avril 2025', titre: 'Talia & la 10ᵉ Guerre', texte: 'Contre la Confrérie Fantôme, la victoire faillit échapper au Père. L\'épisode le pousse hors de ses terres, vers la ville d\'Asheville.' },
        { date: '21 juin 2025', titre: 'Asheville & la 11ᵉ Guerre', texte: "Maîtres de l'église-bastion, les fidèles remportent la 11ᵉ Guerre Sainte contre les Reapers. De l'Épée de Saint Negan, nulle trace : l'espoir de la revoir s'éteint. La haine prend le deuil pour la vengeance, et la ferveur se durcit en zèle.", lien: 'chroniques/asheville' },
      ],
    },
    {
      num: 'V', nom: 'Le Zèle', titre: 'Le départ en guerre sainte',
      texte: "Sous la conduite spirituelle de l'Apôtre Celenius, le Bon du Bien se fait guerre sainte : de contrée en contrée, il porte sa Lumière au loin et connaît sa plus vaste expansion.",
      faits: [
        { date: 'juin 2025', titre: "L'appel de Celenius", texte: "L'Apôtre Celenius, dit l'Apôtre de la Haine, appelle les fidèles au départ. Contre les bandits et les factions hostiles, l'Église fait vœu de ne plus rien pardonner." },
        { date: 'XXX YYY', titre: "L'Ordo Sagitta Custodia", texte: "De la guerre sainte naît un ordre nouveau, l'Ordo Sagitta Custodia : gardiens des reliques et des marches saintes, ses flèches veillent là où le glaive a déjà tout moissonné." },
        { date: 'XXX YYY', titre: "L'ombre sur le Père", texte: "Un attentat vise le Père Trotskov. Les coupables furent livrés à l'Inquisition ; de leur sort, nul ne revint. Le Père en réchappe, et la guerre sainte n'en devient que plus sanglante." },
        { date: '2025', titre: 'La Moisson Pourpre', texte: "De contrée en contrée, la plus longue guerre sainte du Bon du Bien soumet les factions hostiles. L'Église s'étend comme jamais ; mais les combats furent d'une telle cruauté que plus rien n'en fut consigné." },
      ],
    },
    {
      num: 'VI', nom: "L'Unité", titre: 'La Lumière portée aux peuples',
      texte: 'Passé le zèle, le Bon du Bien se tourne vers les peuples : il rassemble les divisés, relève les opprimés, et paie de ses plus grands hommes le prix de la main tendue.',
      faits: [
        { date: 'décembre 2025', titre: 'Le tertre volcanique', texte: "Aux confins s'élève le tertre volcanique : l'Église y accueille un peuple d'illuminés, divisé par ses nombreux morts en martyr, et entreprend de le rassembler sous une même Lumière." },
        { date: 'janvier 2026', titre: 'Le don suprême', texte: "Un peuple perdu, errant sans terre et sans mémoire, mit au jour un laboratoire que le monde d'avant avait scellé puis oublié. Dans ses couloirs vivait encore la créature qui, jadis, avait emporté l'île entière ; depuis, rien n'y avait plus poussé que la haine. Un Grand Maître y descendit seul, non pour l'abattre mais pour la secourir, et il s'offrit tout entier. Le chaos se tut ; du Grand Maître, on ne retrouva rien, et la créature qui remonta au jour n'était plus tout à fait la même." },
        { date: 'février 2026', titre: 'Le souffle de la révolution', texte: "Dans une contrée sombre tenue par une dictature, le Bureau réussit l'exploit d'organiser une révolution pour y ramener la paix. Le Père Trotskov y porta le discours qui souleva le peuple ; du tyran, on ne reparla plus. Paix, prospérité et unité furent rendues à la contrée, et l'Église du Bon du Bien reçut de cet exploit un souffle nouveau." },
        { date: 'août 2026', titre: 'La 13ᵉ Guerre Sainte', texte: "Neuf jours durant, l'Église porta la guerre sainte jusqu'aux murs de l'Empire de Qin ; au neuvième, la compagnie entière y fut saignée jusqu'au dernier homme, et l'on n'en ramena que deux têtes. Première grande défaite du Temple : les ténèbres se révélèrent plus nombreuses, plus patientes et plus tenaces qu'on ne les avait crues.", lien: 'chroniques/neuf-jours' },
      ],
    },
  ],
};

LBDB.branches = {
  voix: { titre: 'La Voix', sous: 'le Saint-Père, son Envoyé, ses représentants', texte: "Sous la Voix, aucune ne passe devant l'autre : les Fidèles vivent la foi, le Clergé la transmet, l'Ordre du Temple la défend." },
  liste: [
    {
      id: 'clerge', nom: 'Le Clergé', sous: 'Les moines gardiens du savoir', image: 'moines', couleur: 'bleu',
      resume: 'Vêtus de bleu, les moines du Clergé veillent sur la mémoire de la foi. Ils consignent les récits des fidèles, préservent les reliques et transmettent les préceptes à ceux qui passent le seuil.',
      texte: 'Les moines du Clergé veillent sur la mémoire de la foi. Éloquence et bonne diction sont conseillées, car ils recrutent de nouveaux fidèles, célèbrent messes et mariages, commercent, brassent et cuisinent, et éduquent les survivants en leur apprenant à lire et à écrire.',
      grades: [
        { nom: 'Prieur', niveau: 'Nouveau', texte: 'A prêté serment : assiste les gradés lors des cérémonies et recrute les fidèles.' },
        { nom: 'Moine', niveau: 'Confirmé', texte: 'Religieux de confiance : célèbre les messes, recrute et peut mener une section.' },
        { nom: 'Diacre', niveau: 'Expérimenté', texte: 'Passerelle entre les maîtres et les hommes du rang ; grade de transition.' },
        { nom: 'Aîné', niveau: 'Maître', texte: "Bras droit du Doyen : accès à toutes les responsabilités religieuses." },
        { nom: 'Doyen', niveau: 'Grand Maître', texte: 'Héritier du savoir des Apôtres et des anciens Grands Maîtres.' },
      ],
      polesTitre: 'Les spécialisations',
      poles: [
        { sigle: 'P', nom: 'Pontifex', sous: 'Le pôle religieux', texte: "S'occupe des événements religieux (messes, mariages, enterrements, confessions), de l'entretien des reliques saintes et du recrutement des fidèles et des moines au sein d'Immaculem. Les moines sont les porte-paroles du culte." },
        { sigle: 'M', nom: 'Mire', sous: 'Le pôle médical', texte: "Médecins, chirurgiens et apothicaires : maintenir un espace de santé convenable au sein d'Immaculem et traiter toute maladie ou blessure. On nomme indistinctement « mire » ceux qui exercent ces trois métiers." },
        { sigle: 'C', nom: 'Cellérier', sous: 'Le pôle administratif', texte: "Logistique, administration et finances d'Immaculem : approvisionnement en denrées, production de vivres et de matériel, financement des locaux et locations d'habitations ou de stands." },
      ],
    },
    {
      id: 'fideles', nom: 'Les Fidèles', sous: 'Ceux qui vivent la foi', image: 'fideles', couleur: 'blanc',
      resume: 'Le cœur vivant du Bon du Bien. Ils prient, assistent aux messes et portent les préceptes dans leur quotidien, jusque dans les refuges les plus reculés.',
      texte: `Le cœur vivant du Bon du Bien. Ils prient, assistent aux messes et portent les préceptes dans leur quotidien, jusque dans les refuges les plus reculés. Le point le plus important : le fidèle est libre.

Le fidèle croit ou non en une religion, monothéiste ou polythéiste, et il a le droit de la partager : chaque foi n'est qu'une interprétation d'une même entité supérieure, et mérite donc respect et écoute. Il n'attend aucun avantage matériel à suivre la cause, mais sait que le Bon du Bien est sa deuxième famille. Il bénéficie de privilèges et d'un passeport pour Immaculem, le quartier général des envoyés du Saint-Père.`,
      devoirsTitre: 'Les devoirs du fidèle',
      devoirs: [
        'Toujours soutenir le Bon du Bien, en toute circonstance.',
        'En cas de guerre non sainte, fournir une aide financière et de la main-d\'œuvre.',
        'En cas de guerre sainte, participer activement.',
      ],
    },
    {
      id: 'temple', nom: "L'Ordre du Temple", sous: 'Les Templiers, bras armé de la foi', image: 'templiers', couleur: 'rouge',
      resume: 'Les Templiers portent la Force au service de la Paix. Ils tiennent le seuil des refuges, mènent les guerres saintes contre la haine et protègent les fidèles partout où la Lumière avance.',
      texte: "Les Templiers portent la Force au service de la Paix. Ils protègent le Saint-Père, les moines, les pèlerins et tout survivant qui demande leur aide. Défenseurs de la foi et d'Immaculem, ils mènent entraînements, expéditions et convois, et tiennent le seuil partout où la Lumière avance.",
      grades: [
        { nom: 'Écuyer', niveau: 'Nouveau', texte: "Recrue de l'Ordre : apprend le maniement des armes, les codes et la discipline." },
        { nom: 'Templier', niveau: 'Confirmé', texte: 'Soldat adoubé : protège le Saint-Père, les moines et les fidèles, tient le seuil.' },
        { nom: 'Sergent', niveau: 'Confirmé', texte: 'Templier aguerri : encadre les écuyers et mène les hommes du rang.' },
        { nom: 'Lieutenant', niveau: 'Expérimenté', texte: 'Officier : commande une escouade en mission et répond au Maréchal.' },
        { nom: 'Maréchal', niveau: 'Expérimenté', texte: 'Chef de guerre : planifie les expéditions et conduit les troupes au combat.' },
        { nom: 'Sénéchal', niveau: 'Maître', texte: "Bras droit du Grand Maître : dirige une part de l'Ordre et forme les officiers." },
        { nom: 'Grand Maître', niveau: 'Grand Maître', texte: "Chef suprême de l'Ordre : déclare les guerres saintes et en répond devant le Saint-Père." },
      ],
      polesTitre: 'Les ordres réguliers',
      poles: [
        { sigle: 'G', nom: "La Garde d'Immaculem", texte: "La troupe régulière de l'Ordre du Temple." },
        { sigle: 'S', nom: 'Ordo Siluan', texte: "Le pôle d'éclaireurs, en référence à l'Apôtre des Ombres." },
        { sigle: 'SC', nom: 'Ordo Sagitta Custodia', texte: "La branche spécialiste de l'Ordre du Temple, l'élite du Bon du Bien regroupée en plusieurs légions renommées." },
        { sigle: 'PM', nom: 'Ordo Priorum Militum', texte: "Veille à ce que l'aspect religieux soit respecté au sein de l'armée templière." },
        { sigle: 'I', nom: 'I.C.A.A.R.', texte: 'Unité de recherche militaro-scientifique, qui travaille de concert avec les moines templiers et les civils.' },
        { sigle: 'T', nom: 'Ordre de Thémis', texte: "La police militaire de l'Ordre." },
      ],
      legions: {
        intro: "L'élite du Temple, regroupée en légions d'exception. Chacune porte son blason, sa devise et sa spécialité.",
        liste: [
          { nom: 'Kerberos', rang: 'Prima Legio I', image: 'kerberos', alt: 'Blason de la Prima Legio Kerberos : une hydre à trois têtes sur écu.', devise: 'Empathy is Weakness', specialite: 'Unité de Contre-Insurrection / Terrorisme' },
          { nom: 'Iustitia', rang: 'Secunda Legio II', image: 'justitia', alt: 'Blason de la Secunda Legio Iustitia : la balance, le livre et les crânes, sous la devise Justitia per Poenam.', devise: "L'Innocence est la Plus Grande Illusion de la Vie.", specialite: 'Unité de Terreur / PSY-OPS' },
        ],
      },
      radio: [
        ['RAS', 'Rien à signaler.'],
        ['10-4', 'Compris (aussi : Affirmatif, Négatif).'],
        ['Avorter', 'Annuler la demande.'],
        ['Clear', 'Zone dégagée.'],
        ['En sécu de zone', 'Se mettre à couvert et défendre la zone.'],
        ['Contact', 'Ennemi repéré : préciser la direction (gauche, droite, en face, derrière) et le type (visuel ou auditif).'],
      ],
    },
  ],
};

LBDB.reliques = [
  {
    id: 'epee', nom: 'L’Épée de Saint Negan', statut: 'Perdue', perdue: true, forme: 'epee',
    texte: `La première épée du Saint-Père Negan, forgée d’acier de Damas afin de représenter la force et la puissance qu’incarne le Saint-Père. Elle fut utilisée pour adouber son premier Templier au service du Bon du Bien. Confiée au premier Grand Maître du Bon du Bien, elle aura été perdue lors de la seconde Guerre Sainte, menée pour libérer des gens réduits en esclavage par un groupe de bandits autour de la Terre Sainte. Depuis que son propriétaire est mort, l’épée demeure absente.

Certains disent que cette épée vibre au contact d’un hérétique ou d’un traître au Bon du Bien. Elle est connue, et surtout redoutée, pour ces facultés.`,
    lien: { route: 'chroniques/asheville', texte: 'Lire la chronique d’Asheville' },
  },
  {
    id: 'couronne', nom: 'La Couronne de Saint Negan', statut: 'Appartient au Saint-Père Negan', forme: 'couronne',
    texte: `Après avoir pris le contrôle de sa zone et fondé la Terre Sainte, ses premiers fidèles lui forgèrent une couronne à son effigie et aux couleurs du Bon du Bien, faite de noir et de rouge. Cette dernière est encore en la possession du Saint-Père résidant en Terre Sainte.

Personne ne sait réellement ce dont elle est capable ; seul le Saint-Père en a conscience.`,
  },
  {
    id: 'collier', nom: 'Le Collier de Saint Negan', statut: 'Appartient au Saint-Père Negan', forme: 'collier',
    texte: `Il est l’artéfact le plus connu du Bon du Bien, celui qui représente la justice du Saint-Père et sa piété. Toute personne s’intéressant à la théologie du Bon du Bien connaît ce collier, mais seulement en surface. En effet, la plupart des fidèles y voient la représentation de la justice divine et de l’unité du Bon du Bien.

Néanmoins, la réalité est tout autre. Sur ce collier d’or, composé d’une chaîne et d’un triangle, est gravée une inscription lisible seulement par celui qui le touche. Cette inscription demeure incertaine : certains disent qu’elle prédit le cataclysme, d’autres les préceptes du Bon du Bien.`,
  },
  {
    id: 'rose', nom: 'La Rose du dernier Matin', statut: 'Se trouve en Terre Sainte', forme: 'rose',
    texte: `Seule relique attestant de l’existence de la Terre Sainte, la Rose du dernier Matin est entourée de légendes. On raconte que c’est le Père Negan qui, à la suite de sa révélation, découvrit un pétale de rose immaculé.

Une fois rapporté en Terre Sainte, ce pétale fut planté dans la terre, puis donna naissance à une rose unique, composée de trois fleurs et de trente-trois épines, arborant une teinte oscillant entre le rouge et l’or.

Lorsque cette fleur ressuscitée fut éclose en Terre Sainte, elle se brisa dans la main du Grand Pope. Celui-ci recueillit alors la fleur et la plaça sous une cloche de verre.

Cette rose symbolise à la fois que la bonté peut éclore même dans les lieux les plus sombres de cette terre, et qu’une renaissance est toujours possible dans un endroit guidé par le Bon et le Bien.`,
  },
  {
    id: 'inebranlable', nom: 'L’Inébranlable', statut: 'Perdue', perdue: true, forme: 'hallebarde',
    texte: `Hallebarde sacrée du Gardien Éternel de Sa Sainteté Negan, cette arme légendaire incarne la fidélité absolue et la protection divine. Forgée dans l’acier du premier sanctuaire où Negan reçut sa vision, dans les chaînes brisées des prisonniers libérés par le Bon du Bien, et dans la pierre tombale du premier martyr en guise de contrepoids, elle fut bénie par trois nuits de prières continues sous les « Larmes de Saint Negan ».

Son porteur, le Gardien Éternel Gregor Mikhailov, demeure dans les mémoires comme le rempart vivant de Sa Sainteté. Par différentes prouesses, il marqua l’histoire du Bon du Bien : il arrêta à lui seul une charge de mutants près de la Terre Sainte, intercepta trois balles destinées à Negan durant la Trahison du Doyen Vilicius, et son cri de guerre faisait trembler les cœurs les plus valeureux.

La hallebarde fut perdue lors de l’événement tragique de l’Hérésie du Doyen Vilicius. Ce jour-là, Gregor sacrifia sa vie pour couvrir la fuite du Saint-Père. Les récits disent qu’il mourut avec une vaillance inouïe, debout, l’arme levée, comme une ultime barrière entre Negan et ses ennemis. Depuis, l’Inébranlable a disparu, et le Bon du Bien n’a cessé de la rechercher, persuadé qu’elle réapparaîtra lorsque la foi des fidèles en aura le plus besoin.`,
  },
  {
    id: 'anneau-communion', nom: 'L’Anneau de Communion', statut: 'Perdu', perdue: true, forme: 'anneau',
    texte: `Après l’Apocalypse, alors qu’il avait rejoint les premiers disciples du Saint-Père, le Père Innocentis entendit ce que l’on nomma plus tard « l’Appel » : une voix douce mais tourmentée qui le hantait dans ses rêves les plus profonds. Le Père eut des visions qui le menèrent dans ce qui était autrefois un lieu de culte ; c’est à cet instant qu’il vit l’Anneau de Communion.

L’Anneau n’était pas d’or. Il était fait d’un métal inconnu, tiède au toucher, qui vibrait doucement selon les prières faites par le clergé. Lorsqu’Innocentis le passa à son doigt, la Terre Sainte résonna en lui. Par l’Anneau, il pouvait entendre les âmes des Justes, ceux qui reposent et nous guident depuis les tombeaux de la Terre Sainte.

Mais l’Anneau avait un prix : chaque vision, chaque murmure, dévorait une part de son âme, l’essoufflant peu à peu, le menant de crises de paranoïa jusqu’à la démence. L’extase devint dépendance ; le lien au divin, une douleur constante.

Quand les Hérétiques menacèrent la foi, l’Ordre du Temple la protégea : ce fut la troisième Guerre Sainte, qui dura de longs mois. Les impurs lâchèrent leurs créatures, des choses abominables en quête de chair fraîche. C’est lors de la Bataille de la prise d’Agapol qu’Innocentis fut mordu par une de ces bêtes ; sachant que sa seule chance était de sectionner le membre infecté, il prit une simple dague et se coupa la main droite pour stopper le mal.

L’Anneau tomba dans la boue, soudé à la main tranchée. Le Frère Wojilis, moine sans arme ni armure, se jeta dans la horde pour l’y reprendre ; on le retrouva mort, les doigts encore crispés sur la relique. Les Templiers l’emportèrent avec elle et firent retraite sur Agapol.

La horde revint trois jours plus tard ; la cité tomba au quatrième jour du siège, et brûla. Dans la confusion de la fuite, l’étui scellé fut confié à un écuyer que l’on retrouva mort, l’étui vide. Depuis, nul n’a revu l’Anneau : perdu dans la boue de la retraite, ou emporté. Personne ne le sut jamais.`,
    lien: { route: 'chroniques/agapol', texte: 'Lire la chronique d’Agapol' },
  },
];
LBDB.reliquesIntro = "Le Triangle, le serment gravé, les reliques des Apôtres : chaque symbole porte la mémoire de l'Effondrement et la promesse de l'Éveil.";
