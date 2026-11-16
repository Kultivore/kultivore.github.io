'use strict';

/* ============================================================
   KULTIVO — « La tournée du Père Noël » (Semaine de Noël, 21 → 27 décembre 2026), ids 32000+.
   Préparé le 16/11/2026 (bac à sable). 70 questions, 11 étapes (`stop` = code du pays, ordre de la tournée dans NOEL_TOUR,
   noel-tour.js) : 7 questions pour les 4 premières, 6 pour les autres. Formats : questions, « Vrai ou faux » (tf: true),
   « Devine l'année » (year : à 5 ans près), rébus. theme = vrai thème du jeu (missions « thème »).
   Faits vérifiés en ligne le 16/11 (Sydney-Hobart 1945, village du Père Noël 1985, sapin du Rockefeller Center 1933,
   cornichon de Noël presque inconnu en Allemagne : sondage YouGov 2016). Donald Duck en Suède : 1959 ou 1960 selon les
   sources → pas de question sur l'année.
   ============================================================ */

window.EVENT_BANKS = window.EVENT_BANKS || {};

window.EVENT_BANKS.noel = [
    // ---------- 1. Australie ----------
    { id: 32000, stop: 'AU', theme: 'Géographie', d: 1.4, q: 'En Australie, en quelle saison tombe Noël ?', a: ['L’été', 'Été', 'En été'],
      exp: 'Dans l’hémisphère Sud, Noël tombe en plein été : on le fête souvent à la plage ou autour d’un barbecue.' },
    { id: 32001, stop: 'AU', theme: 'Géographie', d: 1.6, tf: true, q: 'En Australie, on voit souvent le Père Noël représenté en short ou sur une planche de surf.', a: ['Vrai'],
      exp: 'Noël tombe en été : le Père Noël surfeur est une image très courante là-bas.' },
    { id: 32002, stop: 'AU', theme: 'Musique', d: 2.1, q: 'Dans une chanson de Noël australienne, quels animaux tirent le traîneau du Père Noël à la place des rennes ?', a: ['Des kangourous', 'Kangourous', 'Kangourou'],
      exp: 'Dans « Six White Boomers », six grands kangourous blancs (des « boomers ») tirent le traîneau.' },
    { id: 32003, stop: 'AU', theme: 'Gastronomie', d: 2.0, q: 'Quels petits crustacés roses sont un grand classique du repas de Noël en Australie ?', a: ['Les crevettes', 'Crevettes', 'Crevette', 'Gambas', 'Des crevettes'],
      exp: 'En plein été, les Australiens préfèrent un repas frais : crevettes, fruits de mer et salades.' },
    { id: 32004, stop: 'AU', theme: 'Sport', d: 2.8, year: 1945, q: 'Devine l’année : 1re édition de la course de voile Sydney-Hobart, qui part chaque 26 décembre.', a: ['1945'],
      exp: 'La 1re course est partie le 26 décembre 1945, avec 9 bateaux. Elle part depuis chaque lendemain de Noël.' },
    { id: 32005, stop: 'AU', theme: 'Géographie', d: 2.6, q: 'Quelle célèbre plage de Sydney accueille des milliers de personnes le jour de Noël ?', a: ['Bondi', 'Bondi Beach', 'La plage de Bondi'],
      exp: 'À Bondi Beach, on fête Noël en maillot de bain, souvent avec un bonnet rouge sur la tête.' },
    { id: 32006, stop: 'AU', theme: 'Géographie', d: 1.3, tf: true, q: 'En Australie, il neige souvent à Noël.', a: ['Faux'],
      exp: 'Décembre, c’est l’été : il fait souvent plus de 30 °C à Noël.' },

    // ---------- 2. Philippines ----------
    { id: 32007, stop: 'PH', theme: 'Géographie', d: 2.4, q: 'Aux Philippines, dès quel mois entend-on les premiers chants de Noël ?', a: ['Septembre', 'En septembre'],
      exp: 'Les mois « en -bre » : aux Philippines, Noël dure de septembre à janvier, sans doute le plus long du monde.' },
    { id: 32008, stop: 'PH', theme: 'Histoire', d: 1.8, q: 'Quel pays a gouverné les Philippines pendant plus de 300 ans, y apportant le christianisme et Noël ?', a: ['L’Espagne', 'Espagne'],
      exp: 'Les Philippines ont été une colonie espagnole de 1565 à 1898 : c’est le pays d’Asie qui compte le plus de catholiques.' },
    { id: 32009, stop: 'PH', theme: 'Mythologie', d: 2.5, tf: true, q: 'Aux Philippines, beaucoup vont à la messe à l’aube pendant les 9 jours qui précèdent Noël.', a: ['Vrai'],
      exp: 'C’est le « Simbang Gabi » : 9 messes très tôt le matin, du 16 au 24 décembre.' },
    { id: 32010, stop: 'PH', theme: 'Arts', d: 3.0, q: 'Quelle lanterne en forme d’étoile, en bambou et en papier, décore les maisons philippines à Noël ?', a: ['Le parol', 'Parol', 'Parols'],
      exp: 'Le parol représente l’étoile qui a guidé les Rois mages. Certains, géants, s’allument de mille couleurs.' },
    { id: 32011, stop: 'PH', theme: 'Gastronomie', d: 3.0, q: 'Aux Philippines, comment s’appelle le grand repas de famille qui suit la messe de minuit ?', a: ['Noche Buena', 'Nochebuena', 'La Noche Buena'],
      exp: 'Le nom vient de l’espagnol : « la bonne nuit ». On y mange souvent du jambon et du fromage en boule.' },
    { id: 32012, stop: 'PH', theme: 'Histoire', d: 2.2, tf: true, q: 'Aux Philippines, les fêtes de Noël se terminent en janvier.', a: ['Vrai'],
      exp: 'Elles s’achèvent avec la fête des Rois, début janvier.' },
    { id: 32013, stop: 'PH', theme: 'Histoire', d: 2.8, year: 1521, q: 'Devine l’année : Magellan arrive aux Philippines et y apporte le christianisme.', a: ['1521'],
      exp: 'Le navigateur arrive en mars 1521. Il est tué sur l’île de Mactan quelques semaines plus tard.' },

    // ---------- 3. Japon ----------
    { id: 32014, stop: 'JP', theme: 'Gastronomie', d: 2.2, q: 'Quelle chaîne de fast-food sert le repas de Noël de très nombreux Japonais ?', a: ['KFC', 'Kentucky Fried Chicken', 'Kentucky'],
      exp: 'Une publicité « Kentucky pour Noël » a lancé la mode : il faut parfois réserver son seau de poulet des semaines à l’avance.' },
    { id: 32015, stop: 'JP', theme: 'Gastronomie', d: 1.8, tf: true, q: 'Au Japon, le gâteau de Noël est une génoise à la crème garnie de fraises.', a: ['Vrai'],
      exp: 'Blanc et rouge, ce « Christmas cake » est un classique des pâtisseries japonaises.' },
    { id: 32016, stop: 'JP', theme: 'Géographie', d: 2.0, tf: true, q: 'Au Japon, le 25 décembre est un jour férié.', a: ['Faux'],
      exp: 'Noël n’y est pas une fête religieuse : la plupart des Japonais vont travailler ou à l’école.' },
    { id: 32017, stop: 'JP', theme: 'Géographie', d: 2.4, q: 'Au Japon, le réveillon de Noël est surtout la soirée… de la famille ou des amoureux ?', a: ['Des amoureux', 'Amoureux', 'Les amoureux', 'Des couples', 'En couple'],
      exp: 'Le 24 au soir est une soirée romantique, un peu comme notre Saint-Valentin. La famille, c’est pour le Nouvel An.' },
    { id: 32018, stop: 'JP', theme: 'Musique', d: 2.8, q: 'Au Japon, quelle symphonie de Beethoven est jouée partout en décembre ? Donne son numéro.', a: ['9', 'La 9e', 'Neuvième', 'La neuvième', '9e'],
      exp: 'Les Japonais l’appellent « Daiku » (« numéro neuf ») : des chœurs de milliers de chanteurs la donnent chaque fin d’année.' },
    { id: 32019, stop: 'JP', theme: 'Histoire', d: 2.8, year: 1974, q: 'Devine l’année : KFC lance au Japon sa campagne « Kentucky pour Noël ».', a: ['1974'],
      exp: 'La campagne de 1974 a si bien marché que le poulet frit est devenu le repas de Noël de millions de Japonais.' },
    { id: 32020, stop: 'JP', theme: 'Géographie', d: 2.0, q: 'Au Japon, quelle fête de famille, la plus importante de l’année, suit Noël de près ?', a: ['Le Nouvel An', 'Nouvel An', 'Le jour de l’An', 'Jour de l’An', 'Shogatsu', 'Shōgatsu'],
      exp: 'Le Nouvel An (« Shōgatsu ») est la grande fête familiale japonaise : on visite les temples et on mange des plats spéciaux.' },

    // ---------- 4. Suède ----------
    { id: 32021, stop: 'SE', theme: 'Mythologie', d: 2.0, q: 'Quelle sainte fête-t-on en Suède le 13 décembre, avec une couronne de bougies sur la tête ?', a: ['Lucie', 'Sainte Lucie', 'Sainte-Lucie', 'Lucia', 'Santa Lucia'],
      exp: 'Une jeune fille en robe blanche, couronnée de bougies, mène une procession en chantant.' },
    { id: 32022, stop: 'SE', theme: 'Arts', d: 2.6, q: 'Quel animal de paille est une décoration de Noël suédoise (un géant est construit chaque année à Gävle) ?', a: ['La chèvre', 'Chèvre', 'Le bouc', 'Bouc', 'Une chèvre', 'Un bouc'],
      exp: 'La chèvre de Gävle, haute de 13 m, a souvent été incendiée par des farceurs : elle est maintenant très surveillée.' },
    { id: 32023, stop: 'SE', theme: 'Cinéma', d: 2.4, tf: true, q: 'En Suède, le 24 décembre à 15 h, des millions de personnes regardent des dessins animés de Donald à la télé.', a: ['Vrai'],
      exp: 'Une émission Disney avec Donald (« Kalle Anka ») passe chaque réveillon depuis 1959-1960 : c’est une vraie tradition.' },
    { id: 32024, stop: 'SE', theme: 'Sciences', d: 1.6, tf: true, q: 'La fête de Lucie célèbre la lumière au moment des nuits les plus longues de l’année.', a: ['Vrai'],
      exp: 'Mi-décembre, il fait nuit presque tout le temps en Suède : Lucie apporte la lumière.' },
    { id: 32025, stop: 'SE', theme: 'Gastronomie', d: 1.8, q: 'Quel plat de viande hachée en petites boules, star des restaurants Ikea, est servi au buffet de Noël suédois ?', a: ['Les boulettes de viande', 'Boulettes de viande', 'Boulettes', 'Köttbullar', 'Les boulettes'],
      exp: 'Les « köttbullar » sont au menu du « julbord », le grand buffet de Noël.' },
    { id: 32026, stop: 'SE', theme: 'Géographie', d: 2.0, tf: true, q: 'En Suède, les enfants ouvrent leurs cadeaux le soir du 24 décembre.', a: ['Vrai'],
      exp: 'Comme dans une grande partie de l’Europe du Nord, les cadeaux se donnent le soir du réveillon.' },
    { id: 32027, stop: 'SE', theme: 'Gastronomie', d: 1.6, q: 'Quelle boisson chaude aux épices, le « glögg », boit-on en Suède à Noël ?', a: ['Le vin chaud', 'Vin chaud', 'Du vin chaud'],
      exp: 'Le glögg est un vin chaud aux épices, servi avec des amandes et des raisins secs.' },

    // ---------- 5. Allemagne ----------
    { id: 32028, stop: 'DE', theme: 'Histoire', d: 2.2, tf: true, q: 'En Allemagne, la tradition veut qu’on cache un cornichon en verre dans le sapin : celui qui le trouve a un cadeau en plus.', a: ['Faux'],
      exp: 'C’est surtout une tradition américaine : en 2016, 91 % des Allemands interrogés n’en avaient jamais entendu parler !' },
    { id: 32029, stop: 'DE', theme: 'Gastronomie', d: 2.5, q: 'Quelle brioche aux fruits secs, couverte de sucre glace, est le gâteau de Noël allemand ?', a: ['Le stollen', 'Stollen', 'Christstollen'],
      exp: 'Sa forme rappellerait l’Enfant Jésus emmailloté. Celui de Dresde est le plus célèbre.' },
    { id: 32030, stop: 'DE', theme: 'Géographie', d: 2.8, q: 'Quelle ville de Bavière est célèbre pour son marché de Noël et ses pains d’épices (« Lebkuchen ») ?', a: ['Nuremberg', 'Nürnberg', 'Nurnberg'],
      exp: 'Son « Christkindlesmarkt » attire des millions de visiteurs chaque année.' },
    { id: 32031, stop: 'DE', theme: 'Musique', d: 2.8, year: 1818, q: 'Devine l’année : le chant « Douce nuit » (« Stille Nacht ») est chanté pour la 1re fois, en Autriche.', a: ['1818'],
      exp: 'Le soir de Noël 1818, à Oberndorf, près de Salzbourg. C’est l’un des chants les plus traduits au monde.' },
    { id: 32032, stop: 'DE', theme: 'Histoire', d: 1.8, q: 'De quel pays vient la tradition du sapin de Noël décoré ?', a: ['L’Allemagne', 'Allemagne'],
      exp: 'Elle vient des pays germaniques (Alsace comprise), puis s’est répandue dans le monde au XIXe siècle.' },
    { id: 32033, stop: 'DE', theme: 'Mythologie', d: 1.8, q: 'En Allemagne, quel saint remplit les chaussures des enfants de friandises le 6 décembre ?', a: ['Saint Nicolas', 'Saint-Nicolas', 'Nicolas', 'Nikolaus'],
      exp: 'La veille, les enfants posent leurs bottes devant la porte. Même tradition dans l’est de la France.' },

    // ---------- 6. Italie ----------
    { id: 32034, stop: 'IT', theme: 'Gastronomie', d: 1.8, q: 'Quelle haute brioche de Noël aux fruits confits vient de Milan ?', a: ['Le panettone', 'Panettone'],
      exp: 'Le panettone est devenu le gâteau de Noël de toute l’Italie, et bien au-delà.' },
    { id: 32035, stop: 'IT', theme: 'Mythologie', d: 2.6, q: 'En Italie, quelle gentille sorcière sur un balai apporte des cadeaux la nuit du 5 au 6 janvier ?', a: ['La Befana', 'Befana'],
      exp: 'Elle remplit les chaussettes des enfants sages de bonbons… et celles des autres de charbon (en sucre) !' },
    { id: 32036, stop: 'IT', theme: 'Histoire', d: 2.8, q: 'Quel saint aurait créé la 1re crèche vivante, en 1223 à Greccio ?', a: ['Saint François d’Assise', 'François d’Assise', 'Saint François'],
      exp: 'Il a fait rejouer la naissance de Jésus avec de vraies personnes, un bœuf et un âne.' },
    { id: 32037, stop: 'IT', theme: 'Arts', d: 2.6, q: 'Quelle ville du sud de l’Italie est célèbre pour sa rue des santons, San Gregorio Armeno ?', a: ['Naples', 'Napoli'],
      exp: 'Ses artisans fabriquent des crèches toute l’année, avec parfois des figurines de footballeurs ou de stars.' },
    { id: 32038, stop: 'IT', theme: 'Géographie', d: 1.4, q: 'Dans quel petit État, enclavé dans Rome, le pape célèbre-t-il la messe de Noël ?', a: ['Le Vatican', 'Vatican', 'La Cité du Vatican'],
      exp: 'La messe est célébrée dans la basilique Saint-Pierre et retransmise dans le monde entier.' },
    { id: 32039, stop: 'IT', theme: 'Gastronomie', d: 3.0, q: 'Quelle brioche de Noël de Vérone, en forme d’étoile à 8 branches, est couverte de sucre glace ?', a: ['Le pandoro', 'Pandoro'],
      exp: 'Le pandoro (« pain d’or ») est le grand rival du panettone, sans fruits confits.' },

    // ---------- 7. France ----------
    { id: 32040, stop: 'FR', theme: 'Gastronomie', d: 2.0, q: 'Combien de desserts mange-t-on traditionnellement à Noël en Provence ?', a: ['13', 'Treize'],
      exp: 'Nougats, fruits secs, pompe à l’huile, dattes… Le nombre 13 rappellerait Jésus et les 12 apôtres.' },
    { id: 32041, stop: 'FR', theme: 'Arts', d: 2.0, q: 'Comment appelle-t-on les petites figurines d’argile des crèches de Provence ?', a: ['Les santons', 'Santons', 'Santon'],
      exp: 'Du provençal « santoun », « petit saint ». On y trouve aussi le boulanger, le meunier ou le berger.' },
    { id: 32042, stop: 'FR', theme: 'Géographie', d: 1.6, q: 'Quelle ville d’Alsace se dit « capitale de Noël », avec l’un des plus anciens marchés de Noël d’Europe ?', a: ['Strasbourg'],
      exp: 'Son « Christkindelsmärik » existe depuis 1570, autour de la cathédrale.' },
    { id: 32043, stop: 'FR', theme: 'Histoire', d: 1.8, tf: true, q: 'La bûche de Noël rappelle une vraie bûche qu’on faisait brûler longtemps dans la cheminée le soir de Noël.', a: ['Vrai'],
      exp: 'Une grosse bûche devait brûler toute la nuit, pour porter chance. Le gâteau a pris le relais au XIXe siècle.' },
    { id: 32044, stop: 'FR', theme: 'Langue française', d: 1.3, q: 'Comment s’appelle le repas de fête du soir du 24 décembre ?', a: ['Le réveillon', 'Réveillon', 'Le réveillon de Noël'],
      exp: 'Du verbe « réveiller » : on veille tard, souvent jusqu’après minuit.' },
    { id: 32045, stop: 'FR', theme: 'Histoire', d: 1.8, q: 'Quelle entreprise répond, en France, aux lettres envoyées au Père Noël ?', a: ['La Poste', 'Poste'],
      exp: 'Son « secrétariat du Père Noël » répond aux enfants depuis 1962, dès que la lettre a une adresse.' },

    // ---------- 8. Royaume-Uni ----------
    { id: 32046, stop: 'GB', theme: 'Gastronomie', d: 2.6, q: 'Quel tube en carton qui claque, avec une couronne en papier dedans, ouvre-t-on à deux à Noël au Royaume-Uni ?', a: ['Un cracker', 'Cracker', 'Christmas cracker', 'Les crackers', 'Crackers'],
      exp: 'On tire chacun d’un côté : il claque et libère une couronne, une blague et un petit jouet.' },
    { id: 32047, stop: 'GB', theme: 'Langue française', d: 2.4, q: 'Comment s’appelle en anglais le 26 décembre, jour férié au Royaume-Uni ?', a: ['Boxing Day'],
      exp: '« Box » comme boîte : c’était le jour des étrennes données aux domestiques et aux commerçants.' },
    { id: 32048, stop: 'GB', theme: 'Histoire', d: 1.8, tf: true, q: 'Chaque année, le roi du Royaume-Uni fait un discours à la télévision le jour de Noël.', a: ['Vrai'],
      exp: 'Le message de Noël existe depuis 1932 (à la radio d’abord). Des millions de Britanniques le regardent après le repas.' },
    { id: 32049, stop: 'GB', theme: 'Géographie', d: 2.8, q: 'Quel pays offre chaque année à Londres le grand sapin de Trafalgar Square ?', a: ['La Norvège', 'Norvège'],
      exp: 'Depuis 1947, pour remercier les Britanniques de leur aide pendant la Seconde Guerre mondiale.' },
    { id: 32050, stop: 'GB', theme: 'Sciences', d: 1.6, q: 'Sous quelle plante accrochée au plafond est-il de tradition de s’embrasser ?', a: ['Le gui', 'Gui', 'Du gui'],
      exp: 'La tradition est surtout anglaise, mais elle est aussi très répandue en France pour le Nouvel An.' },
    { id: 32051, stop: 'GB', theme: 'Gastronomie', d: 2.0, q: 'Quel gâteau sombre aux fruits secs, souvent flambé, est le dessert de Noël britannique ?', a: ['Le Christmas pudding', 'Christmas pudding', 'Pudding', 'Le pudding', 'Plum pudding'],
      exp: 'On le prépare parfois des semaines à l’avance, et on cachait une pièce dedans pour porter chance.' },

    // ---------- 9. Mexique ----------
    { id: 32052, stop: 'MX', theme: 'Arts', d: 1.6, q: 'Quel objet rempli de bonbons casse-t-on les yeux bandés pendant les fêtes de Noël mexicaines ?', a: ['La piñata', 'Piñata', 'Pinata'],
      exp: 'La piñata traditionnelle a 7 pointes, comme les 7 péchés capitaux qu’on « casse ».' },
    { id: 32053, stop: 'MX', theme: 'Sciences', d: 2.4, q: 'Quelle plante aux feuilles rouges, venue du Mexique, est devenue la « fleur de Noël » ?', a: ['Le poinsettia', 'Poinsettia', 'L’étoile de Noël', 'Étoile de Noël'],
      exp: 'Les « pétales » rouges sont en fait des feuilles. Son nom vient de Joel Poinsett, qui l’a rapportée aux États-Unis.' },
    { id: 32054, stop: 'MX', theme: 'Histoire', d: 3.0, q: 'Comment s’appellent les fêtes mexicaines du 16 au 24 décembre, qui rejouent la recherche d’un abri par Marie et Joseph ?', a: ['Les posadas', 'Posadas', 'Las posadas', 'Posada'],
      exp: '« Posada » veut dire « auberge » : chaque soir, on va de maison en maison en chantant.' },
    { id: 32055, stop: 'MX', theme: 'Géographie', d: 2.0, tf: true, q: 'Au Mexique, beaucoup d’enfants reçoivent des cadeaux le 6 janvier, apportés par les Rois mages.', a: ['Vrai'],
      exp: 'Le « Día de Reyes » est un grand jour de cadeaux, avec une brioche en couronne, la « rosca de Reyes ».' },
    { id: 32056, stop: 'MX', theme: 'Gastronomie', d: 2.8, q: 'Quels petits paquets de pâte de maïs, cuits dans une feuille, sont un plat de fête au Mexique ?', a: ['Les tamales', 'Tamales', 'Tamal', 'Tamals'],
      exp: 'On les prépare en famille, par dizaines, pour Noël et la Chandeleur.' },
    { id: 32057, stop: 'MX', theme: 'Langue française', d: 1.2, q: 'Dans quelle langue dit-on « ¡ Feliz Navidad ! », comme au Mexique ?', a: ['L’espagnol', 'Espagnol', 'En espagnol'],
      exp: '« Feliz Navidad » veut dire « Joyeux Noël ». La chanson du même nom (1970) est un tube partout dans le monde.' },

    // ---------- 10. États-Unis ----------
    { id: 32058, stop: 'US', theme: 'Gastronomie', d: 1.6, q: 'Aux États-Unis, que laissent les enfants au Père Noël, avec un verre de lait, le soir du 24 ?', a: ['Des cookies', 'Cookies', 'Des biscuits', 'Biscuits', 'Des gâteaux'],
      exp: 'Et parfois une carotte pour les rennes !' },
    { id: 32059, stop: 'US', theme: 'Cinéma', d: 1.8, rebus: ['👩', '❌', '✈️'], q: 'Quel film de Noël se cache derrière ce rébus ?', a: ['Maman, j’ai raté l’avion', 'Maman j’ai raté l’avion', 'Home Alone'],
      exp: 'Maman · raté · l’avion : Kevin, oublié par sa famille, défend seul sa maison contre deux cambrioleurs.' },
    { id: 32060, stop: 'US', theme: 'Musique', d: 2.2, q: 'Quel ballet de Tchaïkovski, joué partout à Noël, surtout aux États-Unis, a pour héros un jouet en bois ?', a: ['Casse-Noisette', 'Le Casse-Noisette', 'Casse noisette', 'The Nutcracker'],
      exp: 'C’est le ballet le plus joué en Amérique : de nombreuses compagnies y font l’essentiel de leurs entrées de l’année.' },
    { id: 32061, stop: 'US', theme: 'Monuments', d: 2.6, q: 'Devant quel grand ensemble de gratte-ciel de New York installe-t-on chaque année un immense sapin, au-dessus d’une patinoire ?', a: ['Le Rockefeller Center', 'Rockefeller Center', 'Rockefeller'],
      exp: 'La tradition officielle date de 1933 : le sapin dépasse souvent 20 mètres.' },
    { id: 32062, stop: 'US', theme: 'Cinéma', d: 2.4, year: 1990, q: 'Devine l’année : sortie du film « Maman, j’ai raté l’avion ».', a: ['1990'],
      exp: 'Sorti fin 1990, avec Macaulay Culkin. Il passe encore à la télé presque chaque Noël.' },
    { id: 32063, stop: 'US', theme: 'Histoire', d: 2.4, tf: true, q: 'C’est la marque Coca-Cola qui a inventé le Père Noël habillé en rouge.', a: ['Faux'],
      exp: 'Il était déjà souvent en rouge avant. Les publicités de Coca-Cola des années 1930 ont surtout rendu cette image célèbre.' },

    // ---------- 11. Laponie ----------
    { id: 32064, stop: 'FI', theme: 'Géographie', d: 2.6, q: 'Dans quelle ville de Laponie finlandaise se trouve le village du Père Noël ?', a: ['Rovaniemi'],
      exp: 'Le village est posé sur le cercle polaire : on peut y rencontrer le Père Noël toute l’année.' },
    { id: 32065, stop: 'FI', theme: 'Géographie', d: 1.8, tf: true, q: 'Au village du Père Noël, on peut envoyer une lettre avec un tampon spécial du Père Noël.', a: ['Vrai'],
      exp: 'Son bureau de poste reçoit des centaines de milliers de lettres d’enfants du monde entier chaque année.' },
    { id: 32066, stop: 'FI', theme: 'Sciences', d: 1.6, q: 'Quel phénomène lumineux vert, qui danse dans le ciel, peut-on voir en Laponie en hiver ?', a: ['Les aurores boréales', 'Aurores boréales', 'Aurore boréale', 'Une aurore boréale', 'Aurore polaire', 'Aurores polaires'],
      exp: 'Des particules venues du Soleil font briller le haut de l’atmosphère, surtout près des pôles.' },
    { id: 32067, stop: 'FI', theme: 'Sciences', d: 1.8, tf: true, q: 'Tout au nord de la Laponie, le soleil ne se lève pas du tout pendant plusieurs semaines en hiver.', a: ['Vrai'],
      exp: 'C’est la nuit polaire. En été, c’est l’inverse : le soleil ne se couche pas.' },
    { id: 32068, stop: 'FI', theme: 'Géographie', d: 2.4, tf: true, q: 'La Laponie s’étend sur quatre pays : la Norvège, la Suède, la Finlande et la Russie.', a: ['Vrai'],
      exp: 'C’est une région, pas un pays : elle couvre le nord de ces quatre pays.' },
    { id: 32069, stop: 'FI', theme: 'Histoire', d: 2.8, year: 1985, q: 'Devine l’année : ouverture du village du Père Noël à Rovaniemi.', a: ['1985'],
      exp: 'Ouvert en 1985, il accueille aujourd’hui des centaines de milliers de visiteurs par an.' }
];

// Anecdotes des décors de Noël (parcours et leçons, tout le mois de décembre)
window.EVENT_BANKS.noelFacts = [
    'Le 1er calendrier de l’Avent imprimé a été vendu en Allemagne au début du XXe siècle : au départ, on y collait des images.',
    'En Islande, ce ne sont pas un mais treize lutins, les « Jólasveinar », qui passent chacun leur tour les 13 nuits avant Noël.',
    'En Catalogne, le « Caga Tió » est une bûche à visage souriant qu’on tape avec un bâton… pour qu’elle donne des cadeaux.',
    '« Vive le vent » est l’adaptation française de « Jingle Bells », une chanson américaine de 1857 qui ne parle pas de Noël, mais d’une course en traîneau.',
    'Les boules de Noël en verre auraient été inventées en Lorraine, à Goetzenbruck, une année sans pommes pour décorer les sapins.',
    'Le Père Noël a une adresse officielle en France : « Père Noël, Pôle Nord ». Pas besoin de timbre !',
    'En Ukraine, on décore parfois le sapin avec une fausse toile d’araignée, qui porterait bonheur.',
    'Le plus grand sapin de Noël naturel décoré mesurait plus de 67 m, aux États-Unis, en 1950.',
    'Le gui pousse sur les arbres sans toucher le sol : c’est pour ça que les Gaulois le trouvaient magique.',
    'Les rennes sont les seuls cervidés dont les femelles ont aussi des bois.',
    'Au Venezuela, à Caracas, on va à la messe de Noël… en patins à roulettes !',
    'Le chocolat chaud et les pains d’épices étaient déjà des douceurs d’hiver au Moyen Âge, grâce aux épices venues d’Orient.'
];
