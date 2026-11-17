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
        { id: 40000, stage: 2, theme: 'Géographie', d: 1.6, q: 'Quel quartier de Tokyo est le paradis des fans de mangas, de jeux vidéo et d’électronique ?', a: ['Akihabara', 'Akiba'], exp: 'Surnommé « Akiba », il est rempli de boutiques de mangas, de salles de jeux et de cafés à thème.' },
        { id: 40001, stage: 1, theme: 'Géographie', d: 2.2, q: 'Quelle île du sud du Japon, aux plages tropicales, est connue pour ses nombreux centenaires ?', a: ['Okinawa', 'îles Ryūkyū', 'Ryukyu'], exp: 'Longtemps un royaume à part (le royaume de Ryūkyū), Okinawa est l’une des régions du monde où l’on vit le plus vieux.' },
        { id: 40002, stage: 3, theme: 'Géographie', d: 1.5, q: 'Quel arbre aux fleurs roses est le symbole du printemps au Japon ?', a: ['cerisier', 'cerisier du Japon', 'sakura'], exp: 'Les fleurs de cerisier (sakura) ne durent qu’une semaine environ : on les guette chaque année.' },
        { id: 40003, stage: 1, theme: 'Gastronomie', d: 1.8, q: 'Quelle boîte-repas japonaise à compartiments emporte-t-on à l’école ou au travail ?', a: ['bento', 'bentō', 'bento box', 'bentos'], exp: 'Riz, poisson, légumes, omelette… Certains parents font même des bentos en forme de personnages !' },
        { id: 40004, stage: 1, theme: 'Gastronomie', d: 1.3, q: 'Avec quels couverts mange-t-on traditionnellement au Japon ?', a: ['baguettes', 'des baguettes', 'baguette'], exp: 'Planter ses baguettes debout dans le riz est très mal vu : ça rappelle les rites funéraires.' },
        { id: 40005, stage: 1, theme: 'Gastronomie', d: 2.0, q: 'Quelles boulettes japonaises garnies de poulpe cuisent dans une plaque creusée de trous ronds ?', a: ['takoyaki', 'takoyakis'], exp: 'Une spécialité de rue d’Osaka, servie avec une sauce brune, de la mayonnaise et des copeaux de bonite qui « dansent » avec la chaleur.' },
        { id: 40006, stage: 1, theme: 'Gastronomie', d: 2.3, q: 'Quelle galette japonaise au chou, cuite sur une plaque, est la grande spécialité d’Osaka et d’Hiroshima ?', a: ['okonomiyaki', 'okonomiyakis'], exp: 'Son nom veut dire à peu près « ce que vous aimez, grillé » : on y met ce qu’on veut.' },
        { id: 40007, stage: 3, theme: 'Géographie', d: 2.2, q: 'Comment appelle-t-on les bains japonais d’eau chaude naturelle, chauffée par les volcans ?', a: ['onsen', 'onsens'], exp: 'Le Japon en compte des milliers. On s’y lave AVANT d’entrer dans le bain, et on y va sans maillot.' },
        { id: 40008, stage: 3, theme: 'Sport', d: 1.9, q: 'Quel art martial japonais, sans coups de poing, utilise la force de l’adversaire pour le projeter ?', a: ['aïkido', 'aikido'], exp: 'Il a été créé au XXe siècle par Morihei Ueshiba. Son nom veut dire « la voie de l’harmonie des énergies ».' },
        { id: 40009, stage: 3, theme: 'Sport', d: 1.6, q: 'Quel art martial japonais, dont le nom veut dire « voie de la souplesse », est très pratiqué en France ?', a: ['judo'], exp: 'Créé en 1882 par Jigoro Kano. La France est l’un des pays où il y a le plus de judokas.' },
        { id: 40010, stage: 3, theme: 'Histoire', d: 1.9, q: 'Comment appelle-t-on les étoiles en métal que lancent les ninjas ?', a: ['shuriken', 'shurikens'], exp: 'Il en existe aussi en forme de petites flèches. Dans la réalité, les ninjas s’en servaient surtout pour distraire l’ennemi.' },
        { id: 40011, stage: 3, theme: 'Arts', d: 1.3, q: 'Comment s’appelle le long vêtement traditionnel japonais serré par une large ceinture ?', a: ['kimono', 'kimonos'], exp: 'La large ceinture s’appelle l’obi. On porte encore le kimono pour les grandes fêtes.' },
        { id: 40012, stage: 3, theme: 'Arts', d: 2.3, q: 'Quelle figurine porte-bonheur japonaise, ronde et rouge, n’a pas d’yeux : on en peint un en faisant un vœu ?', a: ['daruma', 'darumas'], exp: 'On peint le second œil quand le vœu s’est réalisé. Elle se relève toujours quand on la pousse.' },
        { id: 40013, stage: 1, theme: 'Littérature', d: 1.2, q: 'Comment appelle-t-on les bandes dessinées japonaises ?', a: ['manga', 'mangas'], exp: 'Ils se lisent de droite à gauche. La France est l’un des plus grands pays lecteurs de mangas au monde.' },
        { id: 40014, stage: 2, theme: 'Cinéma', d: 1.6, q: 'Quel robot géant, piloté par Actarus, a fait rêver les enfants français à partir de 1978 ?', a: ['Goldorak', 'Grendizer'], exp: 'Ce dessin animé japonais a été un immense succès à la télévision française, dans l’émission Récré A2.' },
        { id: 40015, stage: 2, theme: 'Jeux', d: 1.3, q: 'Quelle entreprise japonaise a créé Mario, Zelda et la console Switch ?', a: ['Nintendo'], exp: 'Avant les jeux vidéo, Nintendo fabriquait des cartes à jouer, dès 1889 !' },
        { id: 40016, stage: 1, theme: 'Technologie', d: 2.0, q: 'Comment s’appelle le train à grande vitesse japonais ?', a: ['Shinkansen', 'train-balle', 'train balle'], exp: 'Le premier a roulé en 1964, avant les JO de Tokyo : 17 ans avant notre TGV.' },
        { id: 40017, stage: 3, theme: 'Géographie', d: 2.0, q: 'Au Japon, les feuilles de quel arbre, rouges en automne, sont aussi admirées que les fleurs de cerisier ?', a: ['érable', 'érable du Japon', 'érables', 'momiji'], exp: 'Aller admirer les érables rouges a même un nom : le « momijigari », la « chasse aux feuilles rouges ».' },
        { id: 40018, stage: 1, theme: 'Géographie', d: 1.6, q: 'Quel surnom poétique donne-t-on au Japon, à l’est de l’Asie ?', a: ['pays du Soleil levant', 'Soleil levant', 'empire du Soleil levant'], exp: 'Son nom japonais, Nihon, veut dire « origine du soleil ». D’où le disque rouge du drapeau.' },
        { id: 40019, stage: 3, theme: 'Histoire', d: 2.3, q: 'Quelle fleur est le symbole de l’empereur du Japon, au point qu’on parle du « trône du… » ?', a: ['chrysanthème', 'chrysanthèmes'], exp: 'Un chrysanthème doré à 16 pétales figure sur les passeports japonais.' },
        { id: 40020, stage: 3, theme: 'Histoire', d: 2.2, q: 'Quelle autre ville japonaise a été frappée par une bombe atomique, trois jours après Hiroshima ?', a: ['Nagasaki'], exp: 'Le 9 août 1945. Le Japon a capitulé quelques jours plus tard.' },
        { id: 40021, stage: 3, theme: 'Géographie', d: 1.9, q: 'Quelle ancienne capitale impériale est célèbre pour ses temples et son Pavillon d’or ?', a: ['Kyoto', 'Kyōto'], exp: 'Elle a été la capitale pendant plus de mille ans, de 794 à 1868.' },
        { id: 40022, stage: 3, theme: 'Géographie', d: 2.6, q: 'Quelle ville japonaise est célèbre pour ses daims qui se promènent en liberté autour des temples ?', a: ['Nara'], exp: 'Plus de mille daims vivent dans son parc ; certains saluent les visiteurs en baissant la tête !' },
        { id: 40023, stage: 3, theme: 'Monuments', d: 2.6, q: 'Comment appelle-t-on le grand portail, souvent rouge, à l’entrée des sanctuaires japonais ?', a: ['torii', 'toriis'], exp: 'Il marque le passage vers un lieu sacré. Le plus célèbre semble flotter sur la mer, à Miyajima.' },
        { id: 40024, stage: 3, theme: 'Arts', d: 1.6, q: 'Quel matelas japonais se déplie sur le sol pour dormir, puis se range dans un placard ?', a: ['futon', 'futons'], exp: 'Il se pose sur des tatamis. Rangé le matin, il libère la pièce pour la journée.' },
        { id: 40025, stage: 1, theme: 'Langue française', d: 1.3, q: 'Quel mot japonais désigne une vague géante provoquée par un séisme sous la mer ?', a: ['tsunami', 'tsunamis'], exp: 'Il veut dire « vague du port » : les pêcheurs rentraient et trouvaient leur port détruit.' },
        { id: 40026, stage: 2, theme: 'Littérature', d: 2.0, q: 'Dans quel manga celui dont on écrit le nom dans un cahier meurt-il ?', a: ['Death Note'], exp: 'Le lycéen Light Yagami trouve ce cahier tombé du monde des dieux de la mort.' },
        { id: 40027, stage: 1, theme: 'Musique', d: 1.2, q: 'Quel loisir né au Japon consiste à chanter sur la musique d’une chanson connue ?', a: ['karaoké', 'karaoke'], exp: 'Le mot veut dire « orchestre vide » : il ne manque que ta voix !' },
        { id: 40028, stage: 2, theme: 'Cinéma', d: 1.8, q: 'Quel pirate de l’espace balafré, capitaine de l’Arcadia, est un héros de dessin animé japonais ?', a: ['Albator', 'Capitaine Albator', 'Harlock', 'Captain Harlock'], exp: 'Créé par Leiji Matsumoto, il est connu en France sous le nom d’Albator depuis 1980.' },
        { id: 40029, stage: 2, theme: 'Sport', d: 1.6, q: 'Dans quel dessin animé japonais deux jeunes footballeurs rêvent-ils de gagner la Coupe du monde ?', a: ['Olive et Tom', 'Captain Tsubasa'], exp: 'En japonais, Olivier Atton s’appelle Tsubasa Ozora. Les terrains y semblent ne jamais finir !' },
        { id: 40030, stage: 2, theme: 'Cinéma', d: 2.2, q: 'Quel grand réalisateur japonais a cofondé le studio Ghibli et réalisé Le Voyage de Chihiro ?', a: ['Hayao Miyazaki', 'Miyazaki'], exp: 'Le Voyage de Chihiro a gagné l’Oscar du meilleur film d’animation en 2003.' },
        { id: 40031, stage: 2, theme: 'Littérature', d: 1.7, q: 'Dans quel manga Luffy, au chapeau de paille, veut-il devenir le roi des pirates ?', a: ['One Piece'], exp: 'Commencé en 1997, c’est le manga le plus vendu de l’histoire.' },
        { id: 40032, stage: 2, theme: 'Littérature', d: 1.5, q: 'Quel héros de Dragon Ball, aux cheveux en pointe, devient Super Saiyan ?', a: ['Son Goku', 'Goku', 'Sangoku', 'San Goku', 'Son Gokû'], exp: 'Le manga d’Akira Toriyama est sorti en 1984.' },
        { id: 40033, stage: 2, theme: 'Littérature', d: 1.8, q: 'Quelle héroïne de manga en uniforme de marin combat « au nom de la Lune » ?', a: ['Sailor Moon', 'Bunny', 'Usagi'], exp: 'Le manga de Naoko Takeuchi, adapté en dessin animé, a fait le tour du monde dans les années 1990.' },
        { id: 40034, stage: 1, theme: 'Arts', d: 1.4, q: 'Quelle petite chatte blanche avec un nœud rouge est une star japonaise ?', a: ['Hello Kitty', 'Kitty'], exp: 'Née en 1974, elle n’a pas de bouche : « pour qu’on lui prête nos émotions », explique sa marque, Sanrio.' },
        { id: 40035, stage: 2, theme: 'Cinéma', d: 2.0, q: 'Quel détective japonais, grand séducteur, se fait assommer par sa partenaire avec une massue géante ?', a: ['Nicky Larson', 'City Hunter', 'Ryo Saeba'], exp: 'En japonais, il s’appelle Ryo Saeba. Philippe Lacheau en a tiré un film français en 2019.' },
        { id: 40036, stage: 1, theme: 'Technologie', d: 1.4, q: 'Quelle grande marque japonaise a créé la console PlayStation ?', a: ['Sony'], exp: 'La première PlayStation est sortie en 1994 au Japon. Sony avait aussi inventé le Walkman.' },
        { id: 40037, stage: 1, theme: 'Technologie', d: 1.6, q: 'Quel constructeur japonais, n° 1 mondial de l’automobile, fabrique la Yaris et la Prius ?', a: ['Toyota'], exp: 'La Toyota Corolla est la voiture la plus vendue de tous les temps.' },
        { id: 40038, stage: 1, theme: 'Technologie', d: 1.8, q: 'Quelle marque japonaise de motos et de voitures a un grand « H » pour logo ?', a: ['Honda'], exp: 'Soichiro Honda a commencé en fixant de petits moteurs sur des vélos, après la guerre.' },
        { id: 40039, stage: 1, theme: 'Géographie', d: 2.4, q: 'Le Japon est un archipel : combien compte-t-il de grandes îles principales ?', a: ['4', 'quatre'], exp: 'Honshu, Hokkaido, Kyushu et Shikoku… et plus de 14 000 petites îles autour.' },
        { id: 40040, stage: 2, theme: 'Géographie', d: 2.4, q: 'Quel quartier de Tokyo est célèbre pour ses jeunes aux tenues excentriques et colorées ?', a: ['Harajuku'], exp: 'Sa rue Takeshita est le temple de la mode « kawaii » et des crêpes géantes.' },
        { id: 40041, stage: 1, theme: 'Géographie', d: 1.5, q: 'Quel océan borde la côte est du Japon ?', a: ['Pacifique', 'océan Pacifique'], exp: 'Le Japon est sur la « ceinture de feu » du Pacifique : beaucoup de volcans et de séismes.' },
        { id: 40042, stage: 3, theme: 'Géographie', d: 2.5, q: 'Comment appelle-t-on les auberges traditionnelles japonaises, avec tatamis et bains chauds ?', a: ['ryokan', 'ryokans'], exp: 'On y dort sur un futon, en yukata (un kimono léger), et on y sert souvent un grand repas traditionnel.' },
        { id: 40043, stage: 1, theme: 'Langue française', d: 1.5, q: 'Comment dit-on « au revoir » en japonais ?', a: ['sayonara', 'sayônara', 'sayōnara'], exp: 'Les Japonais le disent surtout pour un long au revoir ; entre amis, on préfère « mata ne » (« à plus »).' },
        { id: 40044, stage: 1, theme: 'Gastronomie', d: 1.3, q: 'Quelle sauce brune et salée, à base de soja, trouve-t-on sur toutes les tables japonaises ?', a: ['sauce soja', 'soja', 'shoyu', 'sauce de soja'], exp: 'Au Japon, on l’appelle shoyu. On en trempe le poisson, jamais le riz.' },
        { id: 40045, stage: 1, theme: 'Géographie', d: 2.4, q: 'Quelle grande ville japonaise, surnommée « la cuisine du pays », est célèbre pour son château ?', a: ['Osaka', 'Ōsaka'], exp: 'Ses habitants ont un dicton : « Mange jusqu’à en tomber » (kuidaore).' },
        { id: 40046, stage: 2, theme: 'Langue française', d: 1.9, q: 'Quel mot japonais désigne un fan passionné de mangas, d’animés ou de jeux vidéo ?', a: ['otaku', 'otakus'], exp: 'Au Japon, le mot a longtemps été un peu moqueur ; ailleurs, les fans l’utilisent avec fierté.' },
        { id: 40047, stage: 1, theme: 'Langue française', d: 1.8, q: 'Comment dit-on « merci » en japonais ?', a: ['arigato', 'arigatou', 'arigatō', 'arigato gozaimasu', 'domo arigato'], exp: 'Pour être plus poli, on dit « arigatō gozaimasu ».' },
        { id: 40048, stage: 2, theme: 'Langue française', d: 2.0, q: 'Quel mot japonais veut dire « mignon » et désigne un style tout doux et coloré ?', a: ['kawaii', 'kawai'], exp: 'Tout peut être kawaii au Japon : les panneaux, les mascottes des villes, même celles de la police !' },
        { id: 40049, stage: 2, theme: 'Géographie', d: 2.4, q: 'Quel quartier de Tokyo est connu pour son carrefour géant, traversé par des milliers de piétons à chaque feu vert ?', a: ['Shibuya'], exp: 'Près du carrefour, la statue du chien Hachiko, qui attendit son maître pendant près de 10 ans.' },
        { id: 40050, stage: 1, theme: 'Sport', d: 2.0, q: 'Quel sport de batte et de balle est le plus populaire au Japon ?', a: ['baseball', 'base-ball', 'le baseball'], exp: 'Le tournoi des lycées, le Koshien, est suivi par tout le pays chaque été.' },
        { id: 40051, stage: 3, theme: 'Arts', d: 1.9, q: 'Quel animal porte-bonheur japonais lève la patte pour attirer la chance ?', a: ['chat', 'le chat', 'maneki-neko', 'maneki neko', 'chat porte-bonheur'], exp: 'Le maneki-neko : patte gauche levée pour les clients, patte droite pour l’argent.' },
        { id: 40052, stage: 3, theme: 'Arts', d: 2.6, q: 'Comment appelle-t-on la fête où l’on pique-nique sous les cerisiers en fleurs ?', a: ['hanami'], exp: 'Le mot veut dire « regarder les fleurs ». La météo annonce même l’arrivée des fleurs ville par ville.' },
        { id: 40053, stage: 2, theme: 'Arts', d: 1.6, q: 'Comment appelle-t-on le fait de se déguiser en personnage de manga ou de jeu vidéo ?', a: ['cosplay', 'costume play'], exp: 'Le mot a été inventé au Japon dans les années 1980, en mélangeant les mots anglais « costume » et « play ».' },
        // 17/11 : 6 de plus (60 = 6 par niveau de questions)
        { id: 40054, stage: 1, theme: 'Géographie', d: 1.4, q: 'Sur le drapeau du Japon, de quelle couleur est le disque au centre ?', a: ['rouge', 'rouge vif'], exp: 'Le drapeau s’appelle « Hinomaru », le « cercle du soleil » : un disque rouge sur fond blanc.' },
        { id: 40055, stage: 3, theme: 'Arts', d: 1.8, q: 'Comment appelle-t-on les artistes japonaises en kimono, formées à la danse, à la musique et à l’art de recevoir ?', a: ['geisha', 'geishas', 'geiko', 'guécha'], exp: 'À Kyoto, on les appelle « geiko », et les apprenties « maiko ».' },
        { id: 40056, stage: 1, theme: 'Technologie', d: 2.0, q: 'Quelle marque japonaise fabrique à la fois des motos et des pianos ?', a: ['Yamaha'], exp: 'Tout a commencé par des orgues et des pianos à la fin du XIXe siècle ; les motos sont arrivées en 1955.' },
        { id: 40057, stage: 2, theme: 'Arts', d: 1.9, q: 'Quelle marque japonaise de vêtements simples, connue pour ses doudounes légères, a des magasins dans le monde entier ?', a: ['Uniqlo'], exp: 'Elle a ouvert son premier magasin à Hiroshima en 1984.' },
        { id: 40058, stage: 2, theme: 'Histoire', d: 1.9, q: 'Comment appelle-t-on la mafia japonaise, dont les membres sont souvent couverts de tatouages ?', a: ['yakuza', 'yakuzas'], exp: 'À cause d’eux, beaucoup de bains publics japonais refusent encore les personnes tatouées.' },
        { id: 40059, stage: 1, theme: 'Langue française', d: 1.6, q: 'Comment dit-on « bonjour » en japonais ?', a: ['konnichiwa', 'konichiwa', 'konnichi wa', 'ohayo', 'ohayō', 'ohayo gozaimasu'], exp: '« Konnichiwa » sert dans la journée ; le matin, on dit « ohayō gozaimasu ».' }
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
        // Ordre = rang dans l'escale (17/11) : niveau 7 (Tokyo) = familles 1-2, niveau 13 (Kyoto) = familles 3-4
        { id: 'esc-jp-pop-dates', theme: 'Jeux', title: 'Japon pop', prompt: 'Du plus ancien au plus récent', ends: ['Plus ancien', 'Plus récent'], items: [
            ['Godzilla (1er film)', 1954, '1954', 1.8], ['Hello Kitty', 1974, '1974', 2], ['Pac-Man', 1980, '1980', 1.8],
            ['Dragon Ball (manga)', 1984, '1984', 2], ['Super Mario Bros.', 1985, '1985', 1.8], ['Game Boy', 1989, '1989', 1.8],
            ['Pokémon (1ers jeux)', 1996, '1996', 1.6], ['One Piece (manga)', 1997, '1997', 2], ['Le Voyage de Chihiro', 2001, '2001', 2],
            ['Nintendo Switch', 2017, '2017', 1.4]] },
        { id: 'esc-jp-nord-sud', theme: 'Géographie', title: 'Du nord au sud', prompt: 'Du plus au nord au plus au sud', ends: ['Plus au nord', 'Plus au sud'], items: [
            ['Sapporo (Hokkaidō)', -43.06, '43° N', 1.8], ['Tokyo', -35.68, '35,7° N', 1.4], ['Kyoto', -35.01, '35° N', 2],
            ['Hiroshima', -34.39, '34,4° N', 2], ['Nagasaki', -32.75, '32,7° N', 2.2], ['Okinawa (Naha)', -26.21, '26° N', 1.6]] },
        { id: 'esc-jp-histoire', theme: 'Histoire', title: 'Histoire du Japon', prompt: 'Du plus ancien au plus récent', ends: ['Plus ancien', 'Plus récent'], items: [
            ['Kyoto devient la capitale', 794, '794', 2.6], ['Arrivée des premiers Européens (des Portugais)', 1543, '1543', 2.6],
            ['Création de Nintendo (cartes à jouer)', 1889, '1889', 2.2], ['Bombe atomique sur Hiroshima', 1945, '1945', 1.4],
            ['Premiers JO de Tokyo', 1964, '1964', 1.9], ['Séisme et tsunami de Fukushima', 2011, '2011', 1.6],
            ['JO de Tokyo, reportés à cause du Covid', 2021, '2021', 1.5], ['Fin des samouraïs (ère Meiji)', 1868, '1868', 2.3]] },
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
