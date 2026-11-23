'use strict';
/* ============================================================
   KULTIVORE — morceaux propres à l'APPLI ANDROID (Capacitor), 17/11/2026.
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

    /* 2) Barre d'état du téléphone (heure, batterie). 18/11 : sur les Android récents elle est TRANSPARENTE (on voit le fond
          du jeu dessous) : icônes foncées en mode clair, blanches en mode sombre ; mises à jour quand le mode change
          (bouton Clair / Sombre du Profil, ou réglage du téléphone en « Comme mon téléphone »). */
    const darkNow = () => {
        const t = document.documentElement.dataset.theme;
        if (t === 'dark') return true;
        if (t === 'light') return false;
        return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    };
    let barsDark = null;
    const paintBars = () => {
        if (!P.StatusBar) return;
        const dark = darkNow();
        if (dark === barsDark) return;
        barsDark = dark;
        call(() => P.StatusBar.setBackgroundColor({ color: dark ? '#131a2e' : '#eef3f8' }));   // anciens Android (barre opaque)
        call(() => P.StatusBar.setStyle({ style: dark ? 'DARK' : 'LIGHT' }));   // DARK = icônes claires, LIGHT = icônes foncées
    };
    paintBars();
    new MutationObserver(paintBars).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    if (window.matchMedia) {
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        if (mq.addEventListener) mq.addEventListener('change', paintBars);
    }
    // 18/11 : barre d'état cachée pendant les leçons ESSAYÉE puis retirée (la page ne gagnait aucune place).
    // La barre de navigation d'Android (3 boutons / trait des gestes) est cachée par MainActivity.java (mode immersif).

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

    /* 7) 23/11 : appli d'essai « Kultivore TEST » (installée par le câble, identifiant fr.kultivore.app.test) : toujours ouverte en
          BAC À SABLE (copie, rien envoyé en ligne), pour essayer une mise à jour sans toucher à la vraie partie. */
    if (P.App && P.App.getInfo && !BAC) {
        call(() => P.App.getInfo().then(info => { if (info && /\.test$/.test(info.id || '')) location.replace(`${location.pathname}?bac=1`); }));
    }

    /* 8) 23/11 (1.1) : NOTIFICATIONS LOCALES (programmées par le téléphone, sans serveur), 2 au plus par jour :
          - « Rappel de série » : le soir (19 h, ou 21 h si on ouvre l'appli entre 19 h et 21 h sans avoir joué), seulement si on n'a
            pas joué ce jour-là ; reprogrammé à chaque sortie de l'appli et à chaque fin de partie (une partie jouée → demain) ;
          - « Gouttes rechargées » : quand les 5 gouttes sont pleines (jamais la nuit : décalé à 9 h).
          Chaque sorte a sa catégorie Android (réglable dans les paramètres du téléphone). Autorisation demandée UNE fois, à la fin
          d'une partie, avec une fenêtre du jeu d'abord. Pas d'alarme exacte (Google la réserve aux réveils) : à quelques minutes près. */
    const LN = P.LocalNotifications;
    if (LN && typeof V11 !== 'undefined' && V11) {
        const ID_SERIE = 101, ID_DROPS = 102;
        const ASK_KEY = 'kultivo_notif_asked';
        call(() => LN.createChannel({ id: 'serie', name: 'Rappel de série', description: 'Le soir, si tu n’as pas encore joué', importance: 4 }));
        call(() => LN.createChannel({ id: 'gouttes', name: 'Gouttes rechargées', description: 'Quand tes 5 gouttes sont pleines', importance: 3 }));
        const allowed = async () => { try { return (await LN.checkPermissions()).display === 'granted'; } catch (e) { return false; } };
        const notifPlan = async () => {
            if (!(await allowed())) return;
            try { await LN.cancel({ notifications: [{ id: ID_SERIE }, { id: ID_DROPS }] }); } catch (e) { /* rien à annuler */ }
            const d = state.data;
            if (!d || !d.onboarded) return;
            const now = new Date();
            const played = (d.activeDays && d.activeDays[todayKey()]) > 0;
            const at = new Date(now);
            at.setHours(19, 0, 0, 0);
            if (played) at.setDate(at.getDate() + 1);
            else if (now >= at) { at.setHours(21, 0, 0, 0); if (now >= at) { at.setDate(at.getDate() + 1); at.setHours(19, 0, 0, 0); } }
            const streak = typeof currentStreak === 'function' ? currentStreak() : 0;
            const list = [{
                id: ID_SERIE, channelId: 'serie', title: '🍽️ Kulti a faim !',
                body: streak >= 1 ? `Ta série de ${plural(streak, 'jour', 'jours')} t’attend 🔥 Un petit niveau ?` : 'Un petit niveau de culture G aujourd’hui ?',
                schedule: { at, allowWhileIdle: true }, isExactNotification: false
            }];
            if (typeof syncDrops === 'function') syncDrops();
            if (d.drops < DROPS_MAX && d.dropsAt) {
                const full = new Date(d.dropsAt + (DROPS_MAX - d.drops) * DROP_MS);
                if (full.getHours() >= 22 || full.getHours() < 8) {   // jamais la nuit : le lendemain matin à 9 h
                    if (full.getHours() >= 22) full.setDate(full.getDate() + 1);
                    full.setHours(9, 0, 0, 0);
                }
                if (full - now > 60000) list.push({ id: ID_DROPS, channelId: 'gouttes', title: '💧 Gouttes rechargées !',
                    body: `Tes ${DROPS_MAX} gouttes sont pleines : de quoi faire ${DROPS_MAX} niveaux. Kulti a faim !`,
                    schedule: { at: full, allowWhileIdle: true }, isExactNotification: false });
            }
            try { await LN.schedule({ notifications: list }); } catch (e) { /* refusé : tant pis */ }
        };
        window.kultivoNotifPlan = notifPlan;
        // Bac à sable de l'appli d'essai (menu 🧪) : une notification dans 1 minute pour la voir sans attendre le soir
        if (BAC) window.kultivoNotifTest = async kind => {
            if (!(await allowed())) { try { await LN.requestPermissions(); } catch (e) { /* */ } }
            if (!(await allowed())) { showToast('🔔 Notifications refusées : autorise-les dans les paramètres du téléphone.'); return; }
            const at = new Date(Date.now() + 60000);
            const streak = typeof currentStreak === 'function' ? currentStreak() : 0;
            let n;
            if (kind === 'serie') {
                n = { id: 201, channelId: 'serie', title: '🍽️ Kulti a faim !',
                    body: streak >= 1 ? `Ta série de ${plural(streak, 'jour', 'jours')} t’attend 🔥 Un petit niveau ?` : 'Un petit niveau de culture G aujourd’hui ?' };
            } else {
                const d = state.data;   // la 5e goutte arrive dans 1 minute (pour de vrai dans la copie du bac à sable)
                d.drops = DROPS_MAX - 1;
                d.dropsAt = Date.now() - DROP_MS + 60000;
                saveData(); renderHeader();
                n = { id: 202, channelId: 'gouttes', title: '💧 Gouttes rechargées !', body: `Tes ${DROPS_MAX} gouttes sont pleines : de quoi faire ${DROPS_MAX} niveaux. Kulti a faim !` };
            }
            try { await LN.schedule({ notifications: [{ ...n, schedule: { at, allowWhileIdle: true }, isExactNotification: false }] }); showToast('🔔 Notification dans 1 minute : sors de l’appli pour la voir.'); }
            catch (e) { showToast('🔔 Impossible de programmer la notification.'); }
        };
        // Fenêtre du jeu AVANT la demande d'Android (une seule fois) : à la fin d'une partie, quand rien d'autre n'est ouvert
        const askOnce = async () => {
            try { if (localStorage.getItem(ASK_KEY)) return; } catch (e) { return; }
            if (await allowed()) { try { localStorage.setItem(ASK_KEY, '1'); } catch (e) { /* */ } notifPlan(); return; }
            const busy = !$('askModal').hidden || document.querySelector('#streakAnim:not([hidden]), #tour:not([hidden]), .recap-overlay');
            if (busy) return;   // on réessaiera à la prochaine fin de partie
            try { localStorage.setItem(ASK_KEY, '1'); } catch (e) { /* */ }
            const yes = await askConfirm({
                art: kultiEl('parle', 'kulti-blink kulti-float'),
                title: '🔔 Un petit rappel ?',
                text: 'Kulti peut te prévenir le soir si tu n’as pas encore joué (pour garder ta série), et quand tes gouttes sont rechargées. Jamais plus de 2 fois par jour.',
                yes: 'Oui, préviens-moi', no: 'Non merci'
            });
            if (!yes) return;
            try { await LN.requestPermissions(); } catch (e) { /* */ }
            notifPlan();
        };
        const origSetEnd = setEnd;
        setEnd = function (...args) {   // eslint-disable-line no-global-assign
            const r = origSetEnd.apply(this, args);
            setTimeout(notifPlan, 500);
            if (state.data && (state.data.streak || 0) >= 1) setTimeout(askOnce, 2500);
            return r;
        };
        if (P.App) call(() => P.App.addListener('appStateChange', st => { if (!st.isActive) notifPlan(); }));
        setTimeout(notifPlan, 4000);
    }
})();
