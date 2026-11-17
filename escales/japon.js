'use strict';
/* ============================================================
   KULTIVO — Escale au Japon (17/11/2026, bac à sable ; aperçu : apercu-escales-voyage.html)
   Questions FACILES (d ≈ 1,7 en moyenne, de 1,2 à 2,6 ; 3 à 2,6 au plus) : les grands classiques du pays ont le droit
   d'être là même s'ils existent ailleurs dans le jeu (jamais la même question exacte).
   ids 40000+ (Japon : 40000-40199). Paires et frises propres à l'escale.
   Chargé avant escales.js : window.ESCALE_BANKS.japon (pas de « const » commun à plusieurs fichiers).
   ============================================================ */
window.ESCALE_BANKS = window.ESCALE_BANKS || {};
window.ESCALE_BANKS.japon = {
    questions: [
        { id: 40000, theme: 'Géographie', d: 1.2, q: 'Quelle est la capitale du Japon ?', a: ['Tokyo', 'Tokio'], exp: 'Avec ses environs, c’est la plus grande ville du monde : près de 37 millions d’habitants.' },
        { id: 40001, theme: 'Géographie', d: 1.4, q: 'Quel volcan enneigé est le plus haut sommet du Japon ?', a: ['mont Fuji', 'Fuji', 'Fujiyama', 'Fuji-san'], exp: '3 776 m. Sa dernière éruption date de 1707.' },
        { id: 40002, theme: 'Géographie', d: 1.5, q: 'Quel arbre aux fleurs roses est le symbole du printemps au Japon ?', a: ['cerisier', 'cerisier du Japon', 'sakura'], exp: 'Les fleurs de cerisier (sakura) ne durent qu’une semaine environ : on les guette chaque année.' },
        { id: 40003, theme: 'Gastronomie', d: 1.2, q: 'Quel plat japonais associe du riz vinaigré et du poisson cru ?', a: ['sushi', 'sushis'], exp: 'À l’origine, le riz servait surtout à conserver le poisson !' },
        { id: 40004, theme: 'Gastronomie', d: 1.3, q: 'Avec quels couverts mange-t-on traditionnellement au Japon ?', a: ['baguettes', 'des baguettes', 'baguette'], exp: 'Planter ses baguettes debout dans le riz est très mal vu : ça rappelle les rites funéraires.' },
        { id: 40005, theme: 'Gastronomie', d: 1.7, q: 'Comment appelle-t-on la soupe japonaise de nouilles servie dans un bouillon ?', a: ['ramen', 'ramens', 'ramén'], exp: 'Au Japon, on aspire ses nouilles bruyamment : c’est une façon de dire que c’est bon.' },
        { id: 40006, theme: 'Gastronomie', d: 1.5, q: 'Quelle pâte verte très piquante accompagne les sushis ?', a: ['wasabi'], exp: 'Le vrai wasabi est une racine râpée ; souvent, on sert du raifort coloré en vert.' },
        { id: 40007, theme: 'Gastronomie', d: 1.9, q: 'Quel thé vert en poudre utilise-t-on pour la cérémonie du thé ?', a: ['matcha', 'thé matcha'], exp: 'On le fouette avec un petit fouet en bambou, le chasen.' },
        { id: 40008, theme: 'Sport', d: 1.3, q: 'Quelle lutte japonaise oppose deux colosses dans un cercle de terre ?', a: ['sumo', 'le sumo', 'sumotori'], exp: 'Le premier qui touche le sol avec autre chose que ses pieds, ou qui sort du cercle, a perdu.' },
        { id: 40009, theme: 'Sport', d: 1.6, q: 'Quel art martial japonais, dont le nom veut dire « voie de la souplesse », est très pratiqué en France ?', a: ['judo'], exp: 'Créé en 1882 par Jigoro Kano. La France est l’un des pays où il y a le plus de judokas.' },
        { id: 40010, theme: 'Histoire', d: 1.3, q: 'Comment appelle-t-on les guerriers du Japon d’autrefois, armés d’un sabre ?', a: ['samouraïs', 'samouraï', 'samurai', 'samurais'], exp: 'Leur sabre courbé s’appelle le katana. Ils ont disparu avec la modernisation du pays, en 1868.' },
        { id: 40011, theme: 'Arts', d: 1.3, q: 'Comment s’appelle le long vêtement traditionnel japonais serré par une large ceinture ?', a: ['kimono', 'kimonos'], exp: 'La large ceinture s’appelle l’obi. On porte encore le kimono pour les grandes fêtes.' },
        { id: 40012, theme: 'Arts', d: 1.3, q: 'Quel art japonais consiste à plier une feuille de papier pour en faire des formes ?', a: ['origami', 'origamis'], exp: 'Selon une légende, plier 1 000 grues en papier permet de faire un vœu.' },
        { id: 40013, theme: 'Littérature', d: 1.2, q: 'Comment appelle-t-on les bandes dessinées japonaises ?', a: ['manga', 'mangas'], exp: 'Ils se lisent de droite à gauche. La France est l’un des plus grands pays lecteurs de mangas au monde.' },
        { id: 40014, theme: 'Jeux', d: 1.2, q: 'Quelle petite souris jaune électrique est la mascotte des Pokémon ?', a: ['Pikachu'], exp: 'Son nom mélange « pika » (une étincelle) et « chu » (le cri d’une souris) en japonais.' },
        { id: 40015, theme: 'Jeux', d: 1.3, q: 'Quelle entreprise japonaise a créé Mario, Zelda et la console Switch ?', a: ['Nintendo'], exp: 'Avant les jeux vidéo, Nintendo fabriquait des cartes à jouer, dès 1889 !' },
        { id: 40016, theme: 'Technologie', d: 2.0, q: 'Comment s’appelle le train à grande vitesse japonais ?', a: ['Shinkansen', 'train-balle', 'train balle'], exp: 'Le premier a roulé en 1964, avant les JO de Tokyo : 17 ans avant notre TGV.' },
        { id: 40017, theme: 'Géographie', d: 1.5, q: 'Quelle est la monnaie du Japon ?', a: ['yen', 'yens', 'le yen'], exp: 'Son symbole est ¥. Les Japonais paient encore beaucoup en espèces.' },
        { id: 40018, theme: 'Géographie', d: 1.6, q: 'Quel surnom poétique donne-t-on au Japon, à l’est de l’Asie ?', a: ['pays du Soleil levant', 'Soleil levant', 'empire du Soleil levant'], exp: 'Son nom japonais, Nihon, veut dire « origine du soleil ». D’où le disque rouge du drapeau.' },
        { id: 40019, theme: 'Histoire', d: 1.5, q: 'Sur quelle ville japonaise la première bombe atomique a-t-elle été lâchée, le 6 août 1945 ?', a: ['Hiroshima'], exp: 'Le Dôme de Genbaku, resté debout, est devenu le Mémorial de la paix.' },
        { id: 40020, theme: 'Histoire', d: 2.2, q: 'Quelle autre ville japonaise a été frappée par une bombe atomique, trois jours après Hiroshima ?', a: ['Nagasaki'], exp: 'Le 9 août 1945. Le Japon a capitulé quelques jours plus tard.' },
        { id: 40021, theme: 'Géographie', d: 1.9, q: 'Quelle ancienne capitale impériale est célèbre pour ses temples et son Pavillon d’or ?', a: ['Kyoto', 'Kyōto'], exp: 'Elle a été la capitale pendant plus de mille ans, de 794 à 1868.' },
        { id: 40022, theme: 'Géographie', d: 2.6, q: 'Quelle ville japonaise est célèbre pour ses daims qui se promènent en liberté autour des temples ?', a: ['Nara'], exp: 'Plus de mille daims vivent dans son parc ; certains saluent les visiteurs en baissant la tête !' },
        { id: 40023, theme: 'Monuments', d: 2.6, q: 'Comment appelle-t-on le grand portail, souvent rouge, à l’entrée des sanctuaires japonais ?', a: ['torii', 'toriis'], exp: 'Il marque le passage vers un lieu sacré. Le plus célèbre semble flotter sur la mer, à Miyajima.' },
        { id: 40024, theme: 'Arts', d: 1.3, q: 'Comment appelle-t-on un arbre miniature que l’on cultive en pot ?', a: ['bonsaï', 'bonsai', 'bonsaïs'], exp: 'Certains bonsaïs ont plusieurs centaines d’années et se transmettent de génération en génération.' },
        { id: 40025, theme: 'Langue française', d: 1.3, q: 'Quel mot japonais désigne une vague géante provoquée par un séisme sous la mer ?', a: ['tsunami', 'tsunamis'], exp: 'Il veut dire « vague du port » : les pêcheurs rentraient et trouvaient leur port détruit.' },
        { id: 40026, theme: 'Littérature', d: 2.2, q: 'Quel petit poème japonais tient en 3 vers de 5, 7 et 5 syllabes ?', a: ['haïku', 'haiku', 'haïkus'], exp: 'Le plus célèbre, de Bashō, parle d’une grenouille qui saute dans un vieil étang.' },
        { id: 40027, theme: 'Musique', d: 1.2, q: 'Quel loisir né au Japon consiste à chanter sur la musique d’une chanson connue ?', a: ['karaoké', 'karaoke'], exp: 'Le mot veut dire « orchestre vide » : il ne manque que ta voix !' },
        { id: 40028, theme: 'Cinéma', d: 1.4, q: 'Quel monstre géant sorti de la mer en 1954 est une star du cinéma japonais ?', a: ['Godzilla', 'Gojira'], exp: 'Il est apparu dans plus de 30 films. Son nom japonais, Gojira, mélange gorille et baleine.' },
        { id: 40029, theme: 'Cinéma', d: 1.8, q: 'Quel studio d’animation japonais a créé Mon voisin Totoro et Le Voyage de Chihiro ?', a: ['Ghibli', 'studio Ghibli'], exp: 'Totoro est même devenu le logo du studio.' },
        { id: 40030, theme: 'Cinéma', d: 2.2, q: 'Quel grand réalisateur japonais a cofondé le studio Ghibli et réalisé Le Voyage de Chihiro ?', a: ['Hayao Miyazaki', 'Miyazaki'], exp: 'Le Voyage de Chihiro a gagné l’Oscar du meilleur film d’animation en 2003.' },
        { id: 40031, theme: 'Littérature', d: 1.7, q: 'Dans quel manga Luffy, au chapeau de paille, veut-il devenir le roi des pirates ?', a: ['One Piece'], exp: 'Commencé en 1997, c’est le manga le plus vendu de l’histoire.' },
        { id: 40032, theme: 'Littérature', d: 1.5, q: 'Quel héros de Dragon Ball, aux cheveux en pointe, devient Super Saiyan ?', a: ['Son Goku', 'Goku', 'Sangoku', 'San Goku', 'Son Gokû'], exp: 'Le manga d’Akira Toriyama est sorti en 1984.' },
        { id: 40033, theme: 'Littérature', d: 1.6, q: 'Quel jeune ninja blond rêve de devenir Hokage, le chef de son village ?', a: ['Naruto', 'Naruto Uzumaki'], exp: 'Le manga de Masashi Kishimoto a été publié de 1999 à 2014.' },
        { id: 40034, theme: 'Arts', d: 1.4, q: 'Quelle petite chatte blanche avec un nœud rouge est une star japonaise ?', a: ['Hello Kitty', 'Kitty'], exp: 'Née en 1974, elle n’a pas de bouche : « pour qu’on lui prête nos émotions », explique sa marque, Sanrio.' },
        { id: 40035, theme: 'Jeux', d: 1.4, q: 'Quelle boule jaune mange des pac-gommes dans un jeu d’arcade japonais de 1980 ?', a: ['Pac-Man', 'Pacman', 'Pac Man'], exp: 'Son créateur s’est inspiré d’une pizza à laquelle il manquait une part.' },
        { id: 40036, theme: 'Technologie', d: 1.4, q: 'Quelle grande marque japonaise a créé la console PlayStation ?', a: ['Sony'], exp: 'La première PlayStation est sortie en 1994 au Japon. Sony avait aussi inventé le Walkman.' },
        { id: 40037, theme: 'Technologie', d: 1.6, q: 'Quel constructeur japonais, n° 1 mondial de l’automobile, fabrique la Yaris et la Prius ?', a: ['Toyota'], exp: 'La Toyota Corolla est la voiture la plus vendue de tous les temps.' },
        { id: 40038, theme: 'Technologie', d: 1.8, q: 'Quelle marque japonaise de motos et de voitures a un grand « H » pour logo ?', a: ['Honda'], exp: 'Soichiro Honda a commencé en fixant de petits moteurs sur des vélos, après la guerre.' },
        { id: 40039, theme: 'Géographie', d: 2.4, q: 'Le Japon est un archipel : combien compte-t-il de grandes îles principales ?', a: ['4', 'quatre'], exp: 'Honshu, Hokkaido, Kyushu et Shikoku… et plus de 14 000 petites îles autour.' },
        { id: 40040, theme: 'Géographie', d: 2.4, q: 'Quelle grande île du nord du Japon accueille le festival de la neige de Sapporo ?', a: ['Hokkaido', 'Hokkaidō', 'Hokkaïdo'], exp: 'Chaque hiver, on y sculpte d’immenses statues de neige et de glace.' },
        { id: 40041, theme: 'Géographie', d: 1.5, q: 'Quel océan borde la côte est du Japon ?', a: ['Pacifique', 'océan Pacifique'], exp: 'Le Japon est sur la « ceinture de feu » du Pacifique : beaucoup de volcans et de séismes.' },
        { id: 40042, theme: 'Gastronomie', d: 1.9, q: 'Comment appelle-t-on les beignets japonais de légumes ou de crevettes ?', a: ['tempura', 'tempuras'], exp: 'Ce sont les Portugais, au XVIe siècle, qui auraient apporté cette friture au Japon.' },
        { id: 40043, theme: 'Gastronomie', d: 2.4, q: 'Quelle boule de riz, souvent entourée d’une feuille d’algue, est le casse-croûte préféré des Japonais ?', a: ['onigiri', 'onigiris', 'omusubi'], exp: 'On en trouve partout, même dans les supérettes ouvertes jour et nuit.' },
        { id: 40044, theme: 'Gastronomie', d: 1.3, q: 'Quelle sauce brune et salée, à base de soja, trouve-t-on sur toutes les tables japonaises ?', a: ['sauce soja', 'soja', 'shoyu', 'sauce de soja'], exp: 'Au Japon, on l’appelle shoyu. On en trempe le poisson, jamais le riz.' },
        { id: 40045, theme: 'Géographie', d: 2.4, q: 'Quelle grande ville japonaise, surnommée « la cuisine du pays », est célèbre pour son château ?', a: ['Osaka', 'Ōsaka'], exp: 'Ses habitants ont un dicton : « Mange jusqu’à en tomber » (kuidaore).' },
        { id: 40046, theme: 'Langue française', d: 1.8, q: 'Quel mot japonais, devenu mondial, désigne les petits dessins de nos messages ?', a: ['emoji', 'émoji', 'emojis', 'émojis'], exp: 'Il veut dire « image » (e) + « caractère » (moji). Les premiers sont nés en 1999 au Japon.' },
        { id: 40047, theme: 'Langue française', d: 1.8, q: 'Comment dit-on « merci » en japonais ?', a: ['arigato', 'arigatou', 'arigatō', 'arigato gozaimasu', 'domo arigato'], exp: 'Pour être plus poli, on dit « arigatō gozaimasu ».' },
        { id: 40048, theme: 'Langue française', d: 2.0, q: 'Quel mot japonais veut dire « mignon » et désigne un style tout doux et coloré ?', a: ['kawaii', 'kawai'], exp: 'Tout peut être kawaii au Japon : les panneaux, les mascottes des villes, même ceux de la police !' },
        { id: 40049, theme: 'Géographie', d: 2.4, q: 'Quel quartier de Tokyo est connu pour son carrefour géant, traversé par des milliers de piétons à chaque feu vert ?', a: ['Shibuya'], exp: 'Près du carrefour, la statue du chien Hachiko, qui attendit son maître pendant près de 10 ans.' },
        { id: 40050, theme: 'Sport', d: 2.0, q: 'Quel sport de batte et de balle est le plus populaire au Japon ?', a: ['baseball', 'base-ball', 'le baseball'], exp: 'Le tournoi des lycées, le Koshien, est suivi par tout le pays chaque été.' },
        { id: 40051, theme: 'Arts', d: 1.9, q: 'Quel animal porte-bonheur japonais lève la patte pour attirer la chance ?', a: ['chat', 'le chat', 'maneki-neko', 'maneki neko', 'chat porte-bonheur'], exp: 'Le maneki-neko : patte gauche levée pour les clients, patte droite pour l’argent.' },
        { id: 40052, theme: 'Arts', d: 2.6, q: 'Comment appelle-t-on la fête où l’on pique-nique sous les cerisiers en fleurs ?', a: ['hanami'], exp: 'Le mot veut dire « regarder les fleurs ». La météo annonce même l’arrivée des fleurs ville par ville.' },
        { id: 40053, theme: 'Gastronomie', d: 1.8, q: 'Quelle soupe japonaise est faite avec une pâte de soja fermentée ?', a: ['soupe miso', 'miso', 'soupe au miso'], exp: 'Beaucoup de Japonais en boivent un bol à chaque repas, même au petit déjeuner.' }
    ],
    pairs: [
        { id: 'esc-jp-plats', theme: 'Gastronomie', title: 'Cuisine japonaise', left: 'Plat', right: 'Ce que c’est', pairs: [
            ['Sushi', 'Riz vinaigré et poisson', 1.2], ['Ramen', 'Soupe de nouilles', 1.5], ['Tempura', 'Beignets', 1.8],
            ['Wasabi', 'Pâte verte piquante', 1.5], ['Matcha', 'Thé vert en poudre', 1.8], ['Onigiri', 'Boule de riz', 2.1],
            ['Yakitori', 'Brochettes de poulet', 2.3], ['Sashimi', 'Poisson cru en tranches', 2], ['Gyoza', 'Raviolis grillés', 2.2],
            ['Mochi', 'Gâteau de riz gluant', 2.3], ['Miso', 'Pâte de soja', 2]] },
        { id: 'esc-jp-mots', theme: 'Langue française', title: 'Mots japonais', left: 'Mot', right: 'Sens', pairs: [
            ['Kimono', 'Vêtement traditionnel', 1.3], ['Origami', 'Pliage de papier', 1.3], ['Samouraï', 'Guerrier au sabre', 1.4],
            ['Tsunami', 'Vague géante', 1.3], ['Bonsaï', 'Arbre miniature', 1.4], ['Manga', 'Bande dessinée', 1.2],
            ['Haïku', 'Poème très court', 2.1], ['Kawaii', 'Mignon', 1.9], ['Sensei', 'Maître, professeur', 2],
            ['Dojo', 'Salle d’arts martiaux', 2.1], ['Zen', 'Calme, sérénité', 1.6]] },
        { id: 'esc-jp-pop', theme: 'Jeux', title: 'Stars japonaises', left: 'Personnage', right: 'Qui c’est', pairs: [
            ['Pikachu', 'Pokémon électrique', 1.2], ['Son Goku', 'Héros de Dragon Ball', 1.5], ['Luffy', 'Pirate de One Piece', 1.7],
            ['Godzilla', 'Monstre géant', 1.3], ['Totoro', 'Esprit de la forêt', 1.8], ['Hello Kitty', 'Chatte au nœud rouge', 1.4],
            ['Mario', 'Plombier moustachu', 1.2], ['Pac-Man', 'Boule jaune gourmande', 1.4], ['Doraemon', 'Chat robot bleu', 2.4],
            ['Naruto', 'Ninja blond', 1.6]] },
        { id: 'esc-jp-lieux', theme: 'Géographie', title: 'Voyage au Japon', left: 'Lieu', right: 'Ce qu’on y voit', pairs: [
            ['Tokyo', 'La capitale', 1.2], ['Kyoto', 'Temples et Pavillon d’or', 1.9], ['Hiroshima', 'Mémorial de la paix', 1.7],
            ['Nara', 'Daims en liberté', 2.4], ['Mont Fuji', 'Le plus haut sommet', 1.4], ['Hokkaido', 'Festival de la neige', 2.3],
            ['Okinawa', 'Plages tropicales', 2.3], ['Shibuya', 'Carrefour géant', 2.3], ['Osaka', 'Château et cuisine de rue', 2.3]] }
    ],
    order: [
        { id: 'esc-jp-histoire', theme: 'Histoire', title: 'Histoire du Japon', prompt: 'Du plus ancien au plus récent', ends: ['Plus ancien', 'Plus récent'], items: [
            ['Kyoto devient la capitale', 794, '794', 2.6], ['Arrivée des premiers Européens (des Portugais)', 1543, '1543', 2.6],
            ['Création de Nintendo (cartes à jouer)', 1889, '1889', 2.2], ['Bombe atomique sur Hiroshima', 1945, '1945', 1.4],
            ['Premiers JO de Tokyo', 1964, '1964', 1.9], ['Séisme et tsunami de Fukushima', 2011, '2011', 1.6],
            ['JO de Tokyo, reportés à cause du Covid', 2021, '2021', 1.5], ['Fin des samouraïs (ère Meiji)', 1868, '1868', 2.3]] },
        { id: 'esc-jp-pop-dates', theme: 'Jeux', title: 'Japon pop', prompt: 'Du plus ancien au plus récent', ends: ['Plus ancien', 'Plus récent'], items: [
            ['Godzilla (1er film)', 1954, '1954', 1.8], ['Hello Kitty', 1974, '1974', 2], ['Pac-Man', 1980, '1980', 1.8],
            ['Dragon Ball (manga)', 1984, '1984', 2], ['Super Mario Bros.', 1985, '1985', 1.8], ['Game Boy', 1989, '1989', 1.8],
            ['Pokémon (1ers jeux)', 1996, '1996', 1.6], ['One Piece (manga)', 1997, '1997', 2], ['Le Voyage de Chihiro', 2001, '2001', 2],
            ['Nintendo Switch', 2017, '2017', 1.4]] },
        { id: 'esc-jp-hauteurs', theme: 'Monuments', title: 'Japon en hauteur', prompt: 'Du plus petit au plus haut', ends: ['Plus petit', 'Plus haut'], items: [
            ['Grand Bouddha de Kamakura', 13.35, '≈ 13 m (avec son socle)', 2], ['Torii flottant de Miyajima', 16.6, '≈ 17 m', 2.2],
            ['Pagode du Tō-ji (Kyoto)', 54.8, '55 m', 2.2], ['Tour de Tokyo', 333, '333 m', 1.8],
            ['Tokyo Skytree', 634, '634 m', 1.6], ['Mont Fuji', 3776, '3 776 m', 1.2]] }
    ],
    facts: [
        'Le Japon est l’un des pays qui ont le plus de distributeurs automatiques : environ 1 pour 30 habitants.',
        'Les trains japonais sont si ponctuels qu’un retard de 5 minutes donne droit à un certificat de retard.',
        'Le Japon compte plus de 6 800 îles « officielles » d’après un ancien comptage… et plus de 14 000 selon le nouveau (2023).',
        'Dans les écoles japonaises, ce sont les élèves qui font le ménage de leur classe.',
        'Le mont Fuji appartient en partie à un sanctuaire : son sommet est une propriété privée.',
        'Au Japon, on enlève ses chaussures en entrant dans une maison, et on met des chaussons spéciaux pour les toilettes !',
        'Le Japon a l’une des plus longues espérances de vie au monde : plus de 84 ans.',
        'Les mascottes sont partout : presque chaque ville japonaise a la sienne, souvent toute ronde et toute douce.'
    ]
};
