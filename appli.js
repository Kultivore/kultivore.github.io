'use strict';
/* ============================================================
   KULTIVO — morceaux propres à l'APPLI ANDROID (Capacitor), 17/11/2026.
   Sur le site (navigateur), ce fichier ne fait RIEN : tout est derrière `IS_APP` (script.js).
   Chargé après script.js et escales.js. Les « plugins » de Capacitor (App, StatusBar, Keyboard, Browser, Share,
   SplashScreen) sont lus dans window.Capacitor.Plugins : rien à importer, le jeu n'a pas d'étape de construction.
   Le projet de l'appli (Android Studio) est dans un dossier à part, hors du dépôt : voir son LISEZMOI.
   ============================================================ */
(function () {
    if (typeof IS_APP === 'undefined' || !IS_APP) return;
    const P = (window.Capacitor && window.Capacitor.Plugins) || {};
    const call = (fn) => { try { const r = fn(); if (r && r.catch) r.catch(() => {}); } catch (e) { /* plugin absent : tant pis */ } };
    document.documentElement.classList.add('is-app');

    /* 1) Bouton retour d'Android : branché directement sur onBackButton (script.js), plus besoin du faux historique.
          2e appui sur le Parcours = on quitte vraiment l'appli. */
    window.removeEventListener('popstate', onBackButton);
    armBackGuard = () => {};   // eslint-disable-line no-global-assign
    window.kultivoExitApp = () => call(() => P.App.exitApp());
    if (P.App) {
        call(() => P.App.addListener('backButton', () => onBackButton()));
        // Retour dans l'appli (après l'avoir mise en arrière-plan) : comme « visibilitychange » sur le site
        call(() => P.App.addListener('appStateChange', st => { if (st.isActive && typeof checkServerClock === 'function') checkServerClock(); }));
        // Lien « …/Kultivo/?ami=pseudo » ouvert dans l'appli (plus tard, avec les « App Links » et assetlinks.json)
        call(() => P.App.addListener('appUrlOpen', ev => {
            try {
                const u = new URL(ev.url);
                const ami = u.searchParams.get('ami');
                if (ami) { history.replaceState(null, '', `${location.pathname}?ami=${encodeURIComponent(ami)}`); readInviteFromUrl(); }
            } catch (e) { /* lien illisible */ }
        }));
    }

    /* 2) Barre d'état du téléphone (heure, batterie) : bleu du jeu, icônes blanches ; texte foncé en leçon si le thème est clair. */
    const paintBars = () => {
        if (!P.StatusBar) return;
        const meta = document.querySelector('meta[name="theme-color"]');
        call(() => P.StatusBar.setOverlaysWebView({ overlay: false }));
        call(() => P.StatusBar.setBackgroundColor({ color: (meta && meta.content) || '#3d8bff' }));
        call(() => P.StatusBar.setStyle({ style: 'DARK' }));   // DARK = icônes CLAIRES (sur fond bleu)
    };
    paintBars();

    /* 3) Écran de démarrage d'Android : on le cache dès que notre propre écran de chargement (#splash) est affiché. */
    if (P.SplashScreen) call(() => P.SplashScreen.hide());

    /* 4) Liens vers l'extérieur (politique de confidentialité, WhatsApp…) : ouverts dans le navigateur du téléphone,
          pas dans l'appli (sinon on ne pourrait plus revenir au jeu). */
    const openOut = (href) => {
        const url = new URL(href, GAME_URL).href;
        if (P.Browser) call(() => P.Browser.open({ url })); else window.location.href = url;
    };
    document.addEventListener('click', e => {
        const a = e.target.closest && e.target.closest('a[href]');
        if (!a) return;
        const href = a.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;
        if (a.target === '_blank' || /^https?:/i.test(href)) { e.preventDefault(); openOut(href); }
    }, true);
    const nativeOpen = window.open;
    window.open = (url, target, feat) => {
        if (url && /^https?:/i.test(String(url))) { openOut(String(url)); return null; }
        return nativeOpen.call(window, url, target, feat);
    };

    /* 5) Partage (invitations, récaps) : la vue web d'Android n'a pas navigator.share → plugin Share. */
    if (!navigator.share && P.Share) {
        navigator.share = (d) => P.Share.share({ title: d.title, text: d.text, url: d.url, dialogTitle: 'Partager' });
    }

    /* 6) Clavier : on garde pour l'instant le comportement du site (l'écran rétrécit quand le clavier s'ouvre : c'est sur
          ça que fitToKeyboard s'appuie). Plus tard (demande de l'utilisateur) : bloquer le défilement sous la question
          avec P.Keyboard (resize « none » + hauteur du clavier via keyboardWillShow) — à essayer sur le téléphone. */
    if (P.Keyboard) {
        call(() => P.Keyboard.setAccessoryBarVisible && P.Keyboard.setAccessoryBarVisible({ isVisible: false }));
    }
})();
