/* Le Code de la vie en communauté : deux textes, repris de lebondubien.fr. */
window.LBDB = window.LBDB || {};

LBDB.code = {
  titre: 'Le Code de la vie en communauté',
  sous: 'Conduite & sanctions',
  intro: "Deux textes encadrent la vie : le Code du Bon du Bien, qui lie tous ses membres, et les Lois d'Immaculem, qui s'imposent à quiconque foule la colonie.",
  textes: [
    {
      id: 'bdb', nom: 'Le Code du Bon du Bien', court: 'Code du Bon du Bien', unite: 'règle',
      preambule: ['Ce Code constitue le socle des principes de conduite au sein du Bon du Bien. Tous les membres, quel que soit leur rang, ont l\'obligation de le connaître, de le respecter et de s\'y conformer pleinement.'],
      sections: [
        { num: 'I', titre: 'Règles Générales', regles: [
          ['1.1', "Chaque membre doit faire preuve de sérieux et de retenue lorsqu'il se trouve en présence de factions tierces, de groupes extérieurs ou d'autres survivants, ainsi que durant tout événement organisé par le Bon du Bien."],
          ['1.2', 'La hiérarchie doit être respectée en toutes circonstances. Certaines personnes méritent plus de considération que d\'autres selon leur rang : Grand Pope › Pope › Grand Maître › Maître › Membres influents › Nouveaux membres (vous).'],
          ['1.3', 'Chaque membre est tenu de connaître au minimum l\'histoire et les fondements religieux du Bon du Bien.'],
          ['1.4', "Tout ordre ou mission émanant d'un membre du Bureau doit être exécuté sans délai ni contestation."],
          ['1.5', "Chaque membre doit cultiver l'humilité. Nul ne doit faire preuve d'arrogance, même après une promotion."],
          ['1.6', "La rumeur, les paroles inutiles ou les critiques non constructives sont interdites. La parole d'un fidèle est sacrée, et les querelles internes doivent être réglées dans le respect du rituel."],
          ['1.7', "L'aide mutuelle est une vertu : un membre du Bon du Bien ne doit jamais ignorer un autre membre dans le besoin, qu'il s'agisse de soins, de ressources ou de soutien moral."],
          ['1.8', 'Chaque membre doit porter un symbole visible du Bon du Bien à tout moment (le pendentif en Triangle).'],
        ] },
        { num: 'II', titre: 'Règles du Bastion', regles: [
          ['2.1', "Toute personne se présentant à l'entrée du bastion doit être contrôlée minutieusement. Le membre en poste doit immédiatement avertir le supérieur hiérarchique présent."],
          ['2.2', 'Il est strictement interdit de dissimuler des blessures ou des symptômes physiques à un supérieur.'],
          ['2.3', "Le vol, la dégradation ou toute atteinte au matériel ou aux biens de l'Église du Bon du Bien sont formellement interdits."],
          ['2.4', 'Un silence respectueux est de mise dans les lieux sacrés ou lors des événements religieux comme les messes.'],
        ] },
        { num: 'III', titre: "Règles d'Expédition", regles: [
          ['3.1', "Il est formellement interdit d'ouvrir le feu sur un allié, y compris en cas d'erreur liée à une mauvaise manipulation de l'arme."],
          ['3.2', "Il est interdit de tirer en premier sur un civil sans l'autorisation du supérieur."],
          ['3.3', "Lors de guerre sainte, avant chaque expédition, une courte prière ou un moment de recueillement est recommandé afin de partir avec l'esprit clair et le cœur aligné avec le Bien."],
        ] },
        { num: 'IV', titre: 'Règles de Respect', regles: [
          ['4.1', "Lors des rassemblements, il convient de demander l'autorisation de prendre la parole à un supérieur hiérarchique (PDP)."],
          ['4.2', 'Le respect envers les citoyens et la bonne représentation du Bon du Bien sont obligatoires. Chaque membre incarne l\'image de la faction.'],
          ['4.2 bis', 'Le respect s\'étend aussi à vous-même. Gardez un comportement digne, une posture droite et un langage propre le plus possible.'],
          ['4.3', 'En présence d\'un supérieur, il est obligatoire de lui témoigner respect et reconnaissance. Cela inclut le vouvoiement et l\'attitude corporelle appropriée.'],
          ['4.4', "Les promotions et remises de titres sont accordées en fonction du mérite et de l'implication au sein de la faction."],
          ['4.5', 'Toute insubordination envers un supérieur entraînera de lourdes conséquences.'],
          ['4.6', "Vous ne devez pas couper la parole à vos supérieurs ; l'usage d'une demande d'autorisation de parler est de rigueur."],
        ] },
        { num: 'V', titre: 'Relations avec les Autres Factions', regles: [
          ['5.1', 'Le respect entre factions est réciproque et non négociable. Aucun comportement irrespectueux ne sera toléré envers des groupes extérieurs.'],
          ['5.2', 'En toute situation, le membre du Bon du Bien doit conserver son calme, faire preuve de discernement, et ne provoquer aucun conflit, notamment en zones neutres.'],
          ['5.3', "En terrain neutre ou en présence d'alliés, les membres doivent incarner la discipline et la paix du Bon du Bien. Le comportement d'un seul peut ternir l'image de tous."],
        ] },
        { num: 'VI', titre: 'Règles de la vie spirituelle', regles: [
          ['6.1', 'Chaque membre doit participer au moins une fois aux rassemblements spirituels ou messes dirigées par le Pope ou le clergé.'],
          ['6.2', "Les prières individuelles sont encouragées, ainsi que l'étude des textes sacrés."],
          ['6.3', "Les enseignements du Bon du Bien doivent être transmis avec bienveillance, sans forcer les esprits. La foi se propose, elle ne s'impose pas."],
          ['6.4', "L'orgueil, l'envie, la colère et la trahison sont considérés comme des péchés majeurs. Chaque membre doit œuvrer à purifier son cœur."],
          ['6.7', "Nul ne peut parler au nom du Bon du Bien sans y avoir été autorisé. Les paroles liées au dogme ou à la doctrine doivent être transmises avec fidélité et sagesse."],
          ['6.8', 'Les anciens membres sont considérés comme les gardiens de la sagesse. Il convient de les consulter avant toute décision importante.'],
          ['6.9', 'Il est formellement interdit de déformer, falsifier ou modifier les textes sacrés, les paroles des Maîtres et Grands Maîtres sans autorisation du Grand Pope.'],
        ] },
        { num: 'VII', titre: 'Cohabitation entre Clergé et Templiers', regles: [
          ['7.1', "Clergé et Templiers sont les deux bras du Bon du Bien. L'un protège par l'épée, l'autre élève par la parole. Aucun ne prévaut sur l'autre ; ils agissent en harmonie sous l'autorité spirituelle du Grand Pope."],
          ['7.2', "Les décisions concernant la sécurité, la guerre ou l'armement relèvent de la compétence du Grand Maître du Temple, mais toute action militaire majeure doit être validée par le Clergé, via le Doyen."],
          ['7.3', "Inversement, les décisions spirituelles, économiques ou doctrinales sont guidées par le Doyen du Clergé, mais doivent être coordonnées avec le Temple si elles influencent la sécurité ou l'ordre d'Immaculem."],
          ['7.4', "Les Templiers doivent assistance et protection à tous les Moines dans l'exercice de leurs fonctions, même en dehors d'Immaculem."],
          ['7.5', 'Les Moines doivent honorer les Templiers et reconnaître leur rôle sacré dans la défense du dogme, en leur offrant soutien moral, soins et guidance spirituelle.'],
          ['7.6', "Aucune moquerie, compétition stérile ou tension ouverte entre les deux spécialisations ne sera tolérée. L'unité est un pilier sacré de la prospérité d'Immaculem."],
        ] },
      ],
      final: {
        titre: 'Avis du Bureau',
        texte: "Tout manquement à ce Code entraînera des sanctions appropriées, proportionnelles à la gravité de l'infraction. Son application revient aux Grands Maîtres, selon les circonstances et la conduite de chacun. La bienveillance prime : on prévient, on accompagne, et l'on pardonne tout ce qui peut l'être, mais la bonté n'est pas la faiblesse. Les fautes les plus graves, celles qui blessent la communauté ou trahissent la foi, appellent une réponse à leur mesure, confiée à l'autorité de l'Inquisition. Son regard ne se pose que sur les membres du Bon du Bien, et son verdict ne se discute pas.",
      },
    },
    {
      id: 'immaculem', nom: "Les Lois d'Immaculem", court: "Lois d'Immaculem", unite: 'article',
      preambule: [
        'Immaculem, nouvelle colonie du Bon du Bien, accueille nouveaux et anciens membres sous l\'appellation de « colon », dans l\'optique d\'y étendre l\'influence de nos préceptes.',
        "La paix, la prospérité et l'unité sont la base et le centre de notre groupe.",
      ],
      sections: [
        { num: 'I', titre: 'Droits des colons', regles: [
          ['I', "Tout homme au sein de la colonie est égal en tout domaine à son prochain. Les distinctions sociales sont une invention qui n'existe plus au sein d'Immaculem."],
          ['II', "L'utilisation d'armes au sein de la colonie, en dehors des autorités, ainsi que toute autre pratique menaçante envers quiconque à Immaculem, sont strictement interdites."],
          ['III', "Nul ne doit être inquiété pour ses opinions, même religieuses, pourvu que leur manifestation ne trouble pas l'ordre public établi par la loi. Ainsi, le prosélytisme est interdit sous toutes ses formes, hormis lorsqu'il est utilisé par les régents de la colonie."],
          ['IV', 'Tout homme en cours de jugement pour une accusation contraire aux règles de la colonie ne peut être déclaré coupable ou non coupable avant la fin du jugement : la présomption d\'innocence est un droit fondamental pour chaque individu à Immaculem.'],
        ] },
        { num: 'II', titre: 'Devoirs et commerce', regles: [
          ['V', "Toute personne se doit, au sein d'Immaculem, de respecter les droits, les devoirs et les préceptes qui incombent aux membres du Bon du Bien."],
          ['VI', 'Toute tentative de propagande ou de revente de marchandise de contrebande est prohibée. Un marchand ne peut vendre dans la colonie sans autorisation des autorités compétentes.'],
        ] },
        { num: 'III', titre: 'Le tribunal', regles: [
          ['VII', "Toute entorse aux règles citées peut mener à une arrestation, une détention, un jugement, puis à une peine choisie. Tout ceci est géré par les hauts membres du clergé du Bon du Bien. Le jugement est composé d'un Juge, d'un représentant du Bon du Bien ou des autorités faisant office de procureur de la régence, d'une ou plusieurs victimes ou témoins, d'un accusé et d'un possible avocat extérieur au Bon du Bien, ainsi que d'un représentant de la voix divine."],
          ['VIII', 'Le choix d\'un jugement clos ou non est une décision des autorités ; celle-ci ne peut être contestée de manière intérieure ou extérieure.'],
          ['IX', "La justice n'a le droit de condamner que les actions nuisibles à la société. Tout ce qui n'est pas condamnable par la justice ne peut être empêché, et nul ne peut être contraint à faire ce qu'elle n'ordonne pas."],
        ] },
        { num: 'IV', titre: 'Délits et peines', regles: [
          ['XII', "La consommation d'alcool de contrebande ne venant pas de services internes à Immaculem, ou de produits illicites au sein de la colonie, est pénalement répréhensible."],
          ['XIII', 'À la suite d\'un jugement, des peines lourdes peuvent être prononcées, telles que le bannissement à vie de la colonie ou encore l\'exécution par décision divine.'],
        ] },
        { num: 'V', titre: 'Recours et amendes', regles: [
          ['XIV', "Lors d'un jugement, le représentant de la voix divine peut s'opposer à la peine donnée : c'est la seule personne du tribunal possédant un droit de véto. Cela engendre un appel du jugement, et par extension un nouveau juge et un nouveau représentant. La voix divine peut s'opposer autant de fois qu'elle le désire."],
          ['XV', "L'accusé, comme le témoin ou la victime, peut faire appel face à une peine, engendrant les mêmes changements que dans l'article XIV."],
          ['XVI', 'Les autorités compétentes possèdent un document regroupant le montant des amendes ; elles ont le droit de vous amender si une infraction est commise.'],
          ['XVII', 'Une personne, même non citoyenne d\'Immaculem, peut porter plainte et demander un jugement auprès des autorités compétentes contre quiconque.'],
          ['XVIII', "Dans un jugement, une victime n'a pas d'immunité auprès des lois."],
        ] },
      ],
      final: {
        titre: 'Le Jugement',
        texte: "Ces lois s'appliquent à toute personne présente à Immaculem, membre du Bon du Bien ou non. Le jugement et les peines relèvent des hauts membres du clergé.",
      },
    },
  ],
};
