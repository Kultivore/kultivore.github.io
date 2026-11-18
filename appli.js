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

    /* 6) Clavier (18/11) : par défaut, Android REDIMENSIONNE toute la page quand le clavier s'ouvre / se ferme
          (780 → 438 points sur un S22) : à chaque « Vérifier » / « Continuer », tout sautait. L'appli est maintenant en
          « adjustNothing » (AndroidManifest.xml) : la page garde sa taille et le clavier passe par-dessus, comme dans Chrome.
          Comme dans Chrome, on fait rétrécir seulement visualViewport.height (c'est lui que lisent updateKeyboardMode,
          fitToKeyboard, keepAnswerVisible…). La partie de la page cachée par le clavier est calculée par Android
          (MainActivity.java, qui appelle window.kultivoKb(points)). */
    if (P.Keyboard) call(() => P.Keyboard.setAccessoryBarVisible && P.Keyboard.setAccessoryBarVisible({ isVisible: false }));
    const vv = window.visualViewport;
    const desc = vv && Object.getOwnPropertyDescriptor(Object.getPrototypeOf(vv), 'height');
    if (desc && desc.get) {
        let kb = 0;   // partie de la page cachée par le clavier (en points CSS)
        Object.defineProperty(vv, 'height', { configurable: true, get: () => Math.max(0, desc.get.call(vv) - kb) });
        window.kultivoKb = h => {
            const v = Math.max(0, Math.round(Number(h) || 0));
            if (window.__kbLog) window.__kbLog.push([Math.round(performance.now()), v, window.innerHeight]);
            if (v === kb) return;
            kb = v;
            document.documentElement.style.setProperty('--app-kb', `${kb}px`);
            document.documentElement.classList.toggle('app-kb', kb > 0);
            vv.dispatchEvent(new Event('resize'));
        };
    }
})();
