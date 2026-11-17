'use strict';
/* ============================================================
   KULTIVO — LES ESCALES (17/11/2026, BAC À SABLE ; pour tous : ESCALES_ON = true ; aperçu : apercu-escales-voyage.html)
   Petits parcours de voyage de 15 niveaux, un par pays, ouverts avec des billets ✈️ ACHETÉS (ESC_TICKET_PRICE, le 1er offert ;
   17/11 : plus de billets gagnés tous les 20 niveaux, ça avantageait les joueurs placés haut).
   Un billet = l'escale de son choix, pour toujours (l'avion décolle : escTakeoff). 15 niveaux en 3 étapes :
     Q Q 🔗 Q Q | Q ⏳ Q Q 🔗 | Q Q ⏳ Q 🏆  (10 niveaux de questions, 2 de paires, 2 de frises (2 cœurs), 1 défi final ;
     chaque famille de paires / frises ne sert qu'UNE fois). Thème du pays sur toute la page (escTheme, body.in-escale).
   Gouttes, cœurs, XP, série et missions comme le grand parcours ; niveau refait = XP réduite (state.replay).
   Escale finie = tampon dans le carnet de voyage (en bas de l'onglet Escales) + carte d'escale (rangée avec les cartes
   d'événement, hors des 180) + badge (famille « 🧳 Globe-trotter » : 3, 6, 10 escales).
   Contenu : escales/<pays>.js (window.ESCALE_BANKS.<pays> : questions, pairs, order, facts).
   Branchements dans script.js : startSession (escTakePending), state.escale. Le reste passe par des « enveloppes »
   (renderMap, endSession, showCard) posées ici.
   Sauvegarde : data.escales = { <id> : { open: jour, done: { n: jour }, stamp: jour } }.
   ============================================================ */
const ESCALES_ON = BAC;
const ESCALES = [
    { id: 'japon', name: 'Japon', at: 'au Japon', icon: '🗾', flag: '🇯🇵', hat: 'japon', cls: 'esc-japon', blurb: 'Mont Fuji, sushis, mangas, samouraïs…',
      stages: ['Premiers pas', 'Tokyo · pop culture', 'Kyoto · traditions'], decor: ['🌸', '⛩️', '🍣', '🗻', '🎎', '🍵', '🏯', '🎏', '🍜', '🦌'],
      card: { id: 'esc-japon', theme: 'Escales', icon: '🗾', name: 'Escale au Japon', rarity: 'event', text: 'Gagnée en terminant l’Escale au Japon.' } },
    { id: 'italie', name: 'Italie', at: 'en Italie', icon: '🍕', blurb: 'Colisée, pizza, Venise…', soon: 'Bientôt' },
    { id: 'maghreb', name: 'Maghreb', at: 'au Maghreb', icon: '🕌', blurb: 'Médinas, couscous, Sahara…', soon: 'Bientôt' },
    { id: 'usa', name: 'États-Unis', at: 'aux États-Unis', icon: '🗽', blurb: 'Statue de la Liberté, Hollywood…', soon: 'Plus tard' }
];
// 17/11 (retour de l'utilisateur) : 2 niveaux de paires et 2 de frises (au lieu de 3 + 3), jamais la même famille deux fois
const ESC_LAYOUT = ['q', 'q', 'pairs', 'q', 'q', 'q', 'order', 'q', 'q', 'pairs', 'q', 'q', 'order', 'q', 'challenge'];
const ESC_LEVELS = ESC_LAYOUT.length;
const ESC_TICKET_PRICE = 1000;  // 17/11 : les billets s'ACHÈTENT (pas de passe-droit pour les joueurs placés haut) ; le 1er est offert
const ESC_KIND_NAME = { q: 'Questions', pairs: 'Paires', order: 'Frise', challenge: 'Défi final' };
const ESC_KIND_ICON = { pairs: '🔗', order: '⏳', challenge: '🏆' };

const escById = id => ESCALES.find(e => e.id === id);
const escBank = e => (window.ESCALE_BANKS || {})[e.id];
const escReady = e => !e.soon && !!escBank(e);
function escAll() { const d = state.data; if (!d.escales || typeof d.escales !== 'object') d.escales = {}; return d.escales; }
const escEntry = e => escAll()[e.id] || null;
const escFinished = id => !!(escAll()[id] && escAll()[id].stamp);
const escFinishedCount = () => Object.values(escAll()).filter(x => x && x.stamp).length;
const escDoneCount = e => Object.keys(escEntry(e)?.done || {}).length;
/** Prochain niveau à faire (les niveaux s'ouvrent dans l'ordre). */
function escUnlocked(e) {
    const done = escEntry(e)?.done || {};
    let n = 1;
    while (n <= ESC_LEVELS && done[n]) n++;
    return Math.min(n, ESC_LEVELS);
}

/* ---------- Billets ✈️ (17/11 : un STOCK de billets ; 1 offert à tous, les autres achetés en touchant la carte des billets ;
   plusieurs escales peuvent être ouvertes en même temps). Stock = 1 + billets achetés (data.escBought) − escales ouvertes. ---------- */
const escTicketsUsed = () => Object.values(escAll()).filter(x => x && x.open).length;
const escBought = () => Math.max(0, Number(state.data.escBought) || 0);
const escStock = () => Math.max(0, 1 + escBought() - escTicketsUsed());
/** Pastille de l'onglet Escales : des billets en stock ET une escale à ouvrir. */
const escBadgeCount = () => (ESCALES.some(e => escReady(e) && !escEntry(e)?.open) ? escStock() : 0);
/** Acheter un billet (carte des billets, ou au moment d'ouvrir une escale sans billet). Renvoie true si c'est fait. */
async function escBuyTicket(forWhat) {
    const d = state.data;
    const price = ESC_TICKET_PRICE;
    if (d.coins < price) { showToast(`✈️ Un billet coûte ${fmtNum(price)} 🪙 : il te manque ${fmtNum(price - d.coins)} 🪙.`); return false; }
    const ok = await askConfirm({
        title: forWhat ? `${forWhat.icon} Pas de billet en stock` : '✈️ Acheter un billet ?',
        info: [{ big: `${fmtNum(price)} 🪙`, label: 'le billet' }, { big: `${fmtNum(d.coins)} 🪙`, label: 'tu as' }, { big: `${fmtNum(d.coins - price)} 🪙`, label: 'il t’en restera', tone: 'warn' }],
        text: forWhat ? `Acheter un billet pour partir ${forWhat.at} ?` : 'Il ira dans ton stock : tu pourras l’utiliser pour l’escale de ton choix, quand tu veux.',
        yes: `Acheter · ${fmtNum(price)} 🪙`, no: 'Plus tard'
    });
    if (!ok || d.coins < price) return false;
    d.coins -= price;
    d.escBought = escBought() + 1;
    d.totals.purchases++;
    saveData();
    renderHeader();
    playSound('win');
    if (!forWhat) { showToast(`✈️ Billet acheté ! Tu en as ${escStock()} en stock.`); escRenderPage(); escApplyTab(); }
    checkBadges();
    return true;
}

/* ---------- Contenu d'un niveau ---------- */
const escNoise = id => (Math.imul(id ^ 0x9e3779b9, 2654435761) >>> 0) / 4294967296;
/** Questions de chaque niveau de questions (n → [questions]) : triées par difficulté (avec un peu de hasard fixe), puis
    réparties dans les 8 niveaux de questions. Toujours la même répartition pour tout le monde. */
function escQuestionLevels(e) {
    const sortD = list => [...list].sort((a, b) => (a.d + escNoise(a.id) * 0.5) - (b.d + escNoise(b.id) * 0.5) || a.id - b.id);
    const levels = ESC_LAYOUT.map((k, i) => (k === 'q' ? i + 1 : 0)).filter(Boolean);
    const out = {};
    // 17/11 : étapes À THÈME (champ « stage » 1, 2, 3 des questions) : chaque étape pioche dans ses questions, de la plus facile
    // à la plus dure ; sans champ « stage », tout le pays d'un seul tenant
    const all = escBank(e).questions;
    const groups = all.some(q => q.stage) ? [1, 2, 3].map(st => [levels.filter(n => Math.floor((n - 1) / 5) + 1 === st), sortD(all.filter(q => (q.stage || 1) === st))])
        : [[levels, sortD(all)]];
    groups.forEach(([lv, qs]) => lv.forEach((n, i) => {
        out[n] = qs.slice(Math.floor(i * qs.length / lv.length), Math.floor((i + 1) * qs.length / lv.length));
    }));
    return out;
}
/** 17/11 : révisions = 2 questions ratées au plus des niveaux d'avant de l'escale (les plus ratées d'abord), comme au parcours. */
function escReviews(e, n, lv) {
    const before = new Set(Object.entries(lv).filter(([k]) => Number(k) < n).flatMap(([, qs]) => qs.map(q => q.id)));
    return shuffle(escBank(e).questions.filter(q => before.has(q.id) && missCount(q.id) > 0 && !isLater(q.id)))
        .sort((a, b) => missCount(b.id) - missCount(a.id)).slice(0, 2);
}
const escTarget = n => 1.5 + 0.35 * Math.floor((n - 1) / 5);   // difficulté visée des paires et frises : 1,5 → 2,2
/** 2 familles par niveau, TOUJOURS les mêmes et jamais deux fois dans l'escale (17/11) : 1er niveau = familles 1 et 2,
    2e niveau = familles 3 et 4. */
function escPickFamilies(list, n) {
    const k = ESC_LAYOUT.slice(0, n - 1).filter(x => x === ESC_LAYOUT[n - 1]).length;   // 0 ou 1 : rang de ce niveau
    return [list[(k * 2) % list.length], list[(k * 2 + 1) % list.length]];
}
function escItems(e, n) {
    const bank = escBank(e);
    const kind = ESC_LAYOUT[n - 1];
    const t = escTarget(n);
    if (kind === 'q') {
        const lv = escQuestionLevels(e);
        return shuffle([...lv[n].map(q => ({ q, review: false })), ...escReviews(e, n, lv).map(q => ({ q, review: true }))]);
    }
    if (kind === 'pairs') {
        const fams = escPickFamilies(bank.pairs, n);
        return fams.map(family => ({ family, pairs: pickPairs(family, t), matched: new Set(), failed: new Set(), order: null }));
    }
    if (kind === 'order') {
        const fams = escPickFamilies(bank.order, n);
        return fams.map(family => ({ family, items: pickOrderItems(family, t, 4, 0), placed: [], checked: false }));
    }
    // Défi final : 10 questions de l'escale, celles qui ont été ratées d'abord
    const qs = shuffle([...bank.questions]).sort((a, b) => missCount(b.id) - missCount(a.id)).slice(0, 10);
    return qs.map(q => ({ q, review: false }));
}

let escPending = null;
function escTakePending() { const p = escPending; escPending = null; return p; }
/** Lance le niveau n de l'escale (passe par startSession, qui gère gouttes, cœurs, écran de leçon). */
function startEscaleLevel(e, n) {
    const kind = ESC_LAYOUT[n - 1];
    const done = !!escEntry(e)?.done?.[n];
    escPending = { mode: kind === 'q' ? 'level' : kind, items: escItems(e, n), esc: { id: e.id, n }, cost: !done, replay: done };
    startSession(escPending.mode);
    escPending = null;   // startSession l'a pris (ou a renoncé : pas de goutte)
    escTheme();
}

/* ---------- Thème du pays (17/11) : pendant une escale (son petit parcours et ses niveaux), le décor de l'événement en
   cours (Noël, Halloween…) laisse la place à celui du pays, sur toute la page ---------- */
function escThemeId() {
    if (!ESCALES_ON) return null;
    if (state.escale && !$('studyScreen').hidden) return state.escale.id;
    if (!$('mapScreen').hidden && escUi.tab === 'escales' && escUi.view && escEntry(escById(escUi.view))?.open) return escUi.view;
    return null;
}
let escThemeOn = null;
function escTheme() {
    const id = escThemeId();
    document.body.classList.toggle('in-escale', !!id);
    document.body.classList.toggle('in-escales', ESCALES_ON && !$('mapScreen').hidden && escUi.tab === 'escales');
    ESCALES.forEach(e => document.body.classList.toggle(`esc-theme-${e.id}`, id === e.id));
    if (id === escThemeOn) return;
    escThemeOn = id;
    // Petits décors à côté des leçons (grand écran) : ceux du pays
    const box = $('lessonDecor');
    if (box) {
        buildDecor(box, 8);
        const e = id && escById(id);
        if (e) box.querySelectorAll('.decor-badge').forEach((b, i) => {
            b.textContent = e.decor[(i * 3) % e.decor.length];
            delete b.dataset.noel; delete b.dataset.event; delete b.dataset.baby;
        });
    }
}

/* ---------- Kulti en voyage ---------- */
if (typeof KULTI_HATS !== 'undefined') {
    // Bandeau japonais (hachimaki) : blanc, rond rouge sur le front, nœud derrière
    KULTI_HATS.japon = '<svg class="kulti-hat" viewBox="0 0 36 36" aria-hidden="true"><path d="M7.6 6.2 Q18 2.6 28.4 6.2 L28.2 9.4 Q18 5.9 7.8 9.4 Z" fill="#fff" stroke="#c9ced8" stroke-width=".5"/><circle cx="18" cy="6.3" r="1.55" fill="#e0242f"/><path d="M28 6.6 L32.6 4.6 L31.6 8.1 Z M28 8.2 L32.2 9.8 L29.4 11.4 Z" fill="#fff" stroke="#c9ced8" stroke-width=".45"/></svg>';
}

/* ---------- Onglet « 🗺️ Parcours | 🧳 Escales » en haut du parcours ---------- */
const escUi = { tab: 'parcours', view: null };
function escSwitchEl() {
    let sw = $('escSwitch');
    if (sw) return sw;
    sw = el('div', 'esc-switch');
    sw.id = 'escSwitch';
    sw.setAttribute('role', 'tablist');
    [['parcours', '🗺️ Parcours'], ['escales', '🧳 Escales']].forEach(([key, label]) => {
        const b = el('button', 'esc-switch-btn');
        b.type = 'button';
        b.dataset.tab = key;
        b.setAttribute('role', 'tab');
        b.textContent = label;
        b.addEventListener('click', () => {
            if (escUi.tab === key && key === 'escales' && escUi.view) { escUi.view = null; escRenderPage(); window.scrollTo(0, 0); return; }
            escUi.tab = key;
            if (key === 'escales') escUi.view = null;
            showScreen('map');
            if (key === 'parcours') setTimeout(() => document.querySelector('#mapPath .node.is-current:not(.is-optional)')?.scrollIntoView({ block: 'center' }), 60);
        });
        sw.append(b);
    });
    $('mapScreen').prepend(sw);
    const page = el('div', 'esc-page');
    page.id = 'escPage';
    page.hidden = true;
    sw.after(page);
    return sw;
}
function escApplyTab() {
    if (!ESCALES_ON) return;
    const sw = escSwitchEl();
    const onEsc = escUi.tab === 'escales';
    sw.querySelectorAll('.esc-switch-btn').forEach(b => {
        const on = b.dataset.tab === escUi.tab;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-selected', String(on));
        b.querySelector('.esc-dot')?.remove();
        if (b.dataset.tab === 'escales' && escBadgeCount() > 0) {
            const dot = el('span', 'esc-dot');
            dot.textContent = String(escBadgeCount());
            b.append(dot);
        }
    });
    // Collé sous la barre du haut (et sous le bandeau d'événement s'il est là ; sur les Escales, le bandeau est caché)
    const banner = $('eventBanner');
    const top = !onEsc && banner && !banner.hidden ? banner.getBoundingClientRect().bottom + 6 : ($('topbar')?.getBoundingClientRect().height || 56) + 6;
    sw.style.top = `${Math.round(top)}px`;
    $('mapScreen').classList.toggle('is-esc', onEsc);
    ESCALES.forEach(e => e.cls && $('mapScreen').classList.toggle(e.cls, onEsc && escUi.view === e.id));
    $('escPage').hidden = !onEsc;
    if (onEsc) escRenderPage();
    escTheme();
    // En-tête du petit parcours (« ← Escales ») collé juste sous l'onglet
    const head = document.querySelector('#escPage .esc-head');
    if (head) head.style.top = `${Math.round(top + sw.offsetHeight + 6)}px`;
}
const escOrigRenderMap = renderMap;
renderMap = function () { escOrigRenderMap(); escApplyTab(); };
// En arrivant sur le parcours avec l'onglet Escales : liste en haut, ou petit parcours centré sur le niveau en cours
// (passe après le défilement du grand parcours)
const escOrigShowScreen = showScreen;
showScreen = function (name) {
    escOrigShowScreen(name);
    if (ESCALES_ON) escTheme();
    if (!ESCALES_ON || name !== 'map' || escUi.tab !== 'escales') return;
    setTimeout(() => { if (escUi.view) escScrollToCurrent(); else window.scrollTo(0, 0); }, 120);
};
// Bulles d'aide du grand parcours (coffres, révisions, tutoriel) : pas pendant qu'on regarde les Escales
['maybeShowChestTip', 'maybeShowReviewsTip', 'startTour'].forEach(name => {
    const orig = window[name];
    if (typeof orig !== 'function') return;
    window[name] = function (...args) { if (ESCALES_ON && escUi.tab === 'escales' && !$('mapScreen').hidden) return; return orig.apply(this, args); };
});

/* ---------- Page Escales : billets, voyages, escales à ouvrir, carnet ---------- */
function escRenderPage() {
    const page = $('escPage');
    page.replaceChildren();
    const e = escUi.view && escById(escUi.view);
    if (e && escEntry(e)?.open) { escRenderTrip(page, e); return; }
    escUi.view = null;

    // Carte des billets : le stock, et un tap = en acheter un
    const tk = el('button', 'esc-tickets');
    tk.type = 'button';
    const stock = escStock();
    tk.innerHTML = '<span class="esc-tickets-ico"></span><span class="esc-tickets-t"><b></b><small></small></span><span class="esc-tickets-buy"></span>';
    tk.querySelector('.esc-tickets-ico').append(emojiImg('✈️'));
    tk.querySelector('b').textContent = `${stock} ${stock > 1 ? 'billets' : 'billet'} en stock`;
    tk.querySelector('small').textContent = '1 billet = 1 escale de ton choix, pour toujours.';
    tk.querySelector('.esc-tickets-buy').innerHTML = `<small>Acheter</small>${fmtNum(ESC_TICKET_PRICE)} 🪙`;
    tk.addEventListener('click', () => escBuyTicket(null));
    page.append(tk);

    const mine = ESCALES.filter(x => escEntry(x)?.open);
    const toOpen = ESCALES.filter(x => escReady(x) && !escEntry(x)?.open);
    const soon = ESCALES.filter(x => !escReady(x));
    const section = (title, list, fn) => {
        if (!list.length) return;
        const h = el('div', 'esc-sec');
        h.textContent = title;
        page.append(h, ...list.map(fn));
    };
    section('Mes voyages', mine, x => {
        const row = escRow(x);
        const done = escDoneCount(x);
        const fin = !!escEntry(x).stamp;
        row.sub.textContent = fin ? `${ESC_LEVELS} / ${ESC_LEVELS} · tampon gagné` : `Niveau ${escUnlocked(x)} / ${ESC_LEVELS}`;
        const bar = el('div', 'esc-bar');
        const fill = el('i');
        fill.style.width = `${Math.round(100 * done / ESC_LEVELS)}%`;
        bar.append(fill);
        row.text.append(bar);
        row.btn.textContent = fin ? 'Revoir' : 'Continuer';
        row.btn.className = `esc-btn${fin ? ' is-ghost' : ''}`;
        if (fin) { row.box.classList.add('is-done'); row.box.append(escStamp(x, 'esc-mini-stamp')); }
        const go = () => { escUi.view = x.id; escApplyTab(); window.scrollTo(0, 0); setTimeout(escScrollToCurrent, 60); };
        row.box.addEventListener('click', go);
        return row.box;
    });
    section('À ouvrir avec un billet', toOpen, x => {
        const row = escRow(x);
        row.sub.textContent = x.blurb;
        row.btn.textContent = stock ? '✈️ 1 billet' : `✈️ ${fmtNum(ESC_TICKET_PRICE)} 🪙`;
        row.btn.className = `esc-btn${stock || state.data.coins >= ESC_TICKET_PRICE ? '' : ' is-off'}`;
        row.box.addEventListener('click', () => escOpenWithTicket(x));
        return row.box;
    });
    section('Bientôt', soon, x => {
        const row = escRow(x);
        row.sub.textContent = x.blurb;
        row.btn.textContent = `🔒 ${x.soon || 'Bientôt'}`;
        row.btn.className = 'esc-btn is-ghost';
        row.box.classList.add('is-soon');
        return row.box;
    });
    page.append(escCarnet());
    // 17/11 : escale qui vient d'être finie : on descend jusqu'au carnet et le tampon s'y pose
    if (escUi.landing) {
        const id = escUi.landing;
        escUi.landing = null;
        const st = page.querySelector(`.esc-carnet-cell[data-id="${id}"] .esc-stamp`);
        if (st) {
            st.classList.add('is-waiting');
            setTimeout(() => {
                page.querySelector('.esc-carnet').scrollIntoView({ block: 'center', behavior: 'smooth' });
                setTimeout(() => { st.classList.remove('is-waiting'); st.classList.add('is-landing'); playSound('stamp'); }, 700);
            }, 250);
        }
        const after = escUi.afterLanding;
        escUi.afterLanding = null;
        if (after) setTimeout(after, 3500);
    }
}
function escRow(x) {
    const box = el('button', 'esc-dest');
    box.type = 'button';
    const ico = el('span', 'esc-dest-ico');
    ico.append(emojiImg(x.icon));
    const text = el('span', 'esc-dest-t');
    const b = el('b');
    b.textContent = `Escale ${x.at}`;
    const sub = el('small');
    text.append(b, sub);
    const btn = el('span', 'esc-btn');
    box.append(ico, text, btn);
    return { box, text, sub, btn };
}
async function escOpenWithTicket(x) {
    // Pas de billet en stock : on propose d'en acheter un (puis on part)
    if (!escStock() && !(await escBuyTicket(x))) return;
    const stock = escStock();
    const ok = await askConfirm({
        title: `${x.icon} Partir ${x.at} ?`,
        info: [{ big: String(ESC_LEVELS), label: 'niveaux' }, { big: `✈️ ${stock}`, label: 'billets' }, { big: `✈️ ${stock - 1}`, label: 'il t’en restera', tone: 'warn' }],
        text: `${ESC_LEVELS} niveaux, puis un tampon, une carte et un badge. L’escale reste ouverte pour toujours.`,
        yes: '✈️ Partir · 1 billet', no: 'Plus tard'
    });
    if (!ok || !escStock()) { escRenderPage(); return; }
    escAll()[x.id] = { open: todayKey(), done: {}, stamp: null };
    saveData();
    renderHeader();
    escTakeoff(x, () => {
        escUi.view = x.id;
        escApplyTab();
        window.scrollTo(0, 0);
        setTimeout(escScrollToCurrent, 60);
    });
}

/** 17/11 : l'avion décolle (~2,4 s, tap = fin tout de suite ; rien si « réduire les animations »). */
function escTakeoff(x, done) {
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) { playSound('unlock'); done(); return; }
    const ov = el('div', 'esc-takeoff');
    ov.innerHTML = '<div class="esc-to-clouds"><i></i><i></i><i></i><i></i></div><div class="esc-to-runway"></div>'
        + '<div class="esc-to-plane"></div><div class="esc-to-text"><small>Embarquement immédiat</small><b></b><em></em></div>';
    ov.querySelector('.esc-to-plane').append(emojiImg('✈️'));
    ov.querySelector('b').textContent = `Destination : ${x.name}`;
    ov.querySelector('em').append(emojiImg(x.icon));
    document.body.append(ov);
    playSound('hop');
    setTimeout(() => playSound('unlock'), 900);
    let ended = false;
    const finish = () => {
        if (ended) return;
        ended = true;
        done();
        ov.classList.add('is-out');
        setTimeout(() => ov.remove(), 350);
    };
    ov._done = finish;
    ov.addEventListener('click', finish);
    setTimeout(finish, 2600);
}

/* ---------- Le petit parcours d'une escale ---------- */
function escRenderTrip(page, e) {
    const head = el('div', 'esc-head');
    // 17/11 : vrai bouton (contour + relief) et progression en barre sous le nom
    const back = el('button', 'esc-back');
    back.type = 'button';
    back.setAttribute('aria-label', 'Retour aux escales');
    back.innerHTML = '<span aria-hidden="true">←</span>';
    back.addEventListener('click', () => { escUi.view = null; escApplyTab(); window.scrollTo(0, 0); });
    const mid = el('div', 'esc-head-mid');
    const title = el('b');
    title.textContent = `${e.icon} Escale ${e.at}`;
    const prog = el('div', 'esc-head-prog');
    const bar = el('span', 'esc-bar');
    const fill = el('i');
    fill.style.width = `${Math.round(100 * escDoneCount(e) / ESC_LEVELS)}%`;
    bar.append(fill);
    const count = el('small');
    count.textContent = `${escDoneCount(e)} / ${ESC_LEVELS}`;
    prog.append(bar, count);
    mid.append(title, prog);
    const flag = el('span', 'esc-head-flag');
    flag.append(emojiImg(e.flag || e.icon));
    head.append(back, mid, flag);
    page.append(head);

    const trip = el('div', 'esc-trip');
    // Décor du pays : petites icônes, un tap = une anecdote
    const facts = escBank(e).facts || [];
    (e.decor || []).forEach((ic, i) => {
        const dec = el('button', 'esc-decor');
        dec.type = 'button';
        dec.style.top = `${4 + i * 9.4}%`;
        dec.style[i % 2 ? 'right' : 'left'] = `${2 + (i * 7) % 9}px`;
        dec.append(emojiImg(ic));
        dec.addEventListener('click', ev => { ev.stopPropagation(); escShowFact(e, facts[i % Math.max(1, facts.length)], dec); });
        trip.append(dec);
    });
    const list = el('ol', 'esc-path');
    const unlocked = escUnlocked(e);
    const ed = escEntry(e);
    const qLevels = escQuestionLevels(e);
    for (let n = ESC_LEVELS; n >= 1; n--) {
        const kind = ESC_LAYOUT[n - 1];
        const li = el('li', `esc-stop is-${kind}-stop${kind === 'challenge' ? ' is-final' : ''}`);
        li.style.setProperty('--x', kind === 'challenge' ? '0px' : `${Math.round(Math.sin(n * 1.3) * 52)}px`);
        const done = !!ed.done[n];
        const locked = !done && n > unlocked;
        const btn = el('button', `esc-node is-${kind}${done ? ' is-done' : locked ? ' is-locked' : ' is-current'}`);
        btn.type = 'button';
        btn.dataset.n = String(n);
        btn.setAttribute('aria-label', `Niveau ${n}${done ? ', terminé' : locked ? ', verrouillé' : ''}`);
        if (ESC_KIND_ICON[kind]) {
            const ic = el('span', 'esc-node-icon');
            ic.textContent = ESC_KIND_ICON[kind];
            const num = el('span', 'esc-node-num');
            num.textContent = String(n);
            btn.append(ic, num);
        } else btn.textContent = String(n);
        if (done) { const ck = el('span', 'esc-node-check'); ck.textContent = '✓'; btn.append(ck); }
        if (locked) { const lk = el('span', 'esc-node-lock'); lk.textContent = '🔒'; btn.append(lk); }
        btn.addEventListener('click', () => escTapLevel(e, n));
        li.append(btn);
        // Nom et contenu sous le niveau, comme sur le grand parcours
        const lab = el('div', 'esc-stop-label');
        const name = el('span', 'esc-stop-name');
        name.textContent = kind === 'q' ? plural(qLevels[n].length, 'question', 'questions') : ESC_KIND_NAME[kind];
        const meta = el('span', 'esc-stop-meta');
        meta.textContent = kind === 'pairs' ? '2 grilles' : kind === 'order' ? '2 frises · 2 cœurs'
            : ed.stamp ? '📕 Tampon gagné' : '10 questions · le tampon !';
        lab.append(name);
        if (kind !== 'q') lab.append(meta);
        li.append(lab);
        if (!done && !locked) {
            const k = kultiEl('content', 'esc-kulti kulti-blink kulti-float', false, e.hat);
            li.append(k);
        }
        list.append(li);
        if ((n - 1) % 5 === 0) {   // 1er niveau d'une étape : son titre juste en dessous
            const s = el('li', 'esc-stage');
            s.textContent = `Étape ${Math.floor((n - 1) / 5) + 1} · ${e.stages[Math.floor((n - 1) / 5)]}`;
            list.append(s);
        }
    }
    trip.append(list);
    page.append(trip);
}
function escScrollToCurrent() {
    if (!$("escPage") || $("escPage").hidden) return;
    const cur = document.querySelector('#escPage .esc-node.is-current');
    if (cur) cur.scrollIntoView({ block: 'center' });
}
function escShowFact(e, text, badge) {
    if (!text) return;
    $('factTitle').textContent = `${e.icon} Le savais-tu ?`;
    $('factText').textContent = text;
    const bubble = $('factBubble');
    bubble.hidden = false;
    const r = badge.getBoundingClientRect();
    const top = r.bottom + 10 + bubble.offsetHeight < window.innerHeight - 90 ? r.bottom + 10 : r.top - 10 - bubble.offsetHeight;
    bubble.style.top = `${Math.max(70, top)}px`;
}
async function escTapLevel(e, n) {
    const ed = escEntry(e);
    const done = !!ed.done[n];
    if (!done && n > escUnlocked(e)) { showToast(`🔒 Termine d’abord le niveau ${escUnlocked(e)}.`); return; }
    const kind = ESC_LAYOUT[n - 1];
    const rv = kind === 'q' ? escReviews(e, n, escQuestionLevels(e)).length : 0;
    const what = kind === 'q' ? `${escQuestionLevels(e)[n].length} questions${rv ? ` + ${rv} à revoir` : ''}` : kind === 'pairs' ? '2 grilles de paires' : kind === 'order' ? '2 frises de 4 cartes, 2 cœurs' : '10 questions déjà vues';
    const drops = state.data.drops;
    const info = done
        ? [{ big: '🔁', label: 'déjà réussi' }, { big: 'gratuit', label: 'pas de goutte', tone: 'good' }]
        : [{ big: `💧 ${drops}`, label: 'gouttes' }, { big: `💧 ${Math.max(0, drops - 1)}`, label: 'il t’en restera', tone: drops > 1 ? null : 'warn' }];
    const ok = await askConfirm({
        title: `${ESC_KIND_ICON[kind] || e.icon} ${kind === 'challenge' ? 'Défi final' : `Niveau ${n}`} · Escale ${e.at}`,
        info,
        text: `${what}${kind === 'challenge' ? ', 2 cœurs : réussis-le pour gagner le tampon de l’escale !' : '.'}${done ? '\nNiveau refait : XP réduite.' : ''}`,
        yes: done ? 'Rejouer' : 'Commencer · −1 💧', no: 'Plus tard'
    });
    if (!ok) return;
    startEscaleLevel(e, n);
}

/* ---------- Pendant la partie : étiquette de la question ---------- */
const escOrigShowCard = showCard;
showCard = function () {
    escOrigShowCard();
    if (!state.escale) return;
    const e = escById(state.escale.id);
    const tag = $('challengeTag');
    tag.hidden = false;
    tag.textContent = `${e.icon} Escale ${e.at}${state.mode === 'challenge' ? ` · Défi final ${state.done + 1}/${state.total}` : ''}`;
};

/* ---------- Fin d'un niveau d'escale ---------- */
const escOrigEndSession = endSession;
endSession = function (win) {
    if (!state.escale) return escOrigEndSession(win);
    const e = escById(state.escale.id);
    const n = state.escale.n;
    const kind = ESC_LAYOUT[n - 1];
    stopTimer();
    queueStats(win ? 'won' : 'lost');
    state.phase = 'over';
    $('cardView').hidden = true;
    $('pairsView').hidden = true;
    $('orderView').hidden = true;
    $('endView').hidden = false;
    escUi.tab = 'escales';
    escUi.view = e.id;
    if (!win) {
        playSound('lose');
        setEnd({
            emoji: '💔',
            title: kind === 'challenge' ? 'Défi final raté' : 'Niveau raté',
            text: `💔 Plus de cœurs. Tu peux réessayer quand tu veux : l’escale ${e.at} t’attend.`,
            extra: xpSummary(),
            primary: 'Réessayer',
            onPrimary: () => startEscaleLevel(e, n),
            secondary: 'Retour à l’escale',
            onSecondary: returnToMap
        });
        showRescueOption();
        bumpStreak();
        renderHeader();
        checkBadges();
        return;
    }
    $('progressBar').style.width = '100%';
    if (PAL_ELEC) placeProgressRider(100);
    bumpStreak();
    if (state.errors === 0 && !state.replay) { addXp(XP_FLAWLESS); state.data.totals.flawless++; }
    if (kind === 'challenge' && !state.replay) addXp(XP_CHALLENGE_WIN);
    if (!state.replay) {   // comme un niveau du parcours pour les missions
        missionEvent('levels');
        if (state.errors === 0) missionEvent('flawless');
        if (kind === 'order') missionEvent('order');
        if (kind === 'pairs') missionEvent('pairs');
    }
    const ed = escEntry(e);
    ed.done[n] = ed.done[n] || todayKey();
    const finished = kind === 'challenge' && !ed.stamp;
    if (finished) { ed.stamp = todayKey(); escUi.view = null; escUi.landing = e.id; }   // 17/11 : « Continuer » mène au carnet, où le tampon se pose
    const next = n < ESC_LEVELS ? `Le niveau ${n + 1} de l’escale est ouvert.` : '';
    setEnd({
        emoji: kind === 'challenge' ? '🏆' : '🎉',
        face: kind === 'challenge' || state.errors === 0 ? 'fier' : 'content',
        title: finished ? `Escale ${e.at} terminée !` : kind === 'challenge' ? 'Défi final relevé !' : `Niveau ${n} terminé !`,
        text: finished ? `📕 Tampon dans ton carnet de voyage\n🃏 Carte « ${e.card.name} »\n🏅 Badge « ${e.name} »` : next,
        stamp: !finished && state.errors === 0,
        stats: [statXp(), statAccuracy(), statTime()],
        extra: rewardSummary(),
        primary: 'Continuer',
        onPrimary: returnToMap
    });
    if (finished) {
        const st = escStamp(e, 'esc-end-stamp');
        $('endEmoji').append(st);
        playSound('stamp');
        setTimeout(() => { if (!state.data.cards[e.card.id]) openCardBoxes([{ fixed: [e.card] }], `${e.icon} Carte de l’escale !`); }, 1400);
    }
    playSound('win');
    launchConfetti();
    saveData();
    renderHeader();
    checkBadges();
};

/* ---------- Tampons et carnet de voyage ---------- */
function escStamp(e, cls) {
    const s = el('div', `esc-stamp ${cls || ''}`);
    s.innerHTML = '<span>ESCALE</span><em></em><strong></strong>';
    s.querySelector('em').append(emojiImg(e.icon));
    s.querySelector('strong').textContent = e.name.toUpperCase();
    return s;
}
function escCarnet() {
    const box = el('div', 'esc-carnet');
    const head = el('div', 'esc-carnet-head');
    const got = ESCALES.filter(x => escFinished(x.id));
    head.innerHTML = '<b>📕 Mon carnet de voyage</b><small></small>';
    head.querySelector('small').textContent = `${got.length} / ${ESCALES.length} tampons`;
    const pages = el('div', 'esc-carnet-pages');
    ESCALES.forEach((x, i) => {
        const cell = el('div', `esc-carnet-cell${i % 2 ? ' is-l' : ' is-r'}`);
        cell.dataset.id = x.id;
        if (escFinished(x.id)) cell.append(escStamp(x));
        else { const empty = el('div', 'esc-stamp is-empty'); empty.innerHTML = '<strong></strong><em>?</em>'; empty.querySelector('strong').textContent = x.name.toUpperCase(); cell.append(empty); }
        pages.append(cell);
    });
    box.append(head, pages);
    return box;
}

/* ---------- Cartes et badges ---------- */
if (ESCALES_ON) {
    ESCALES.filter(x => x.card).forEach(x => { if (!EVENT_CARDS.some(c => c.id === x.card.id)) EVENT_CARDS.push(x.card); });
    if (typeof BADGES_NEW !== 'undefined') {
        BADGES_NEW.push(
            { id: 'esc-japon', icon: '🗾', name: 'Japon', desc: 'Terminer l’Escale au Japon', test: () => escFinished('japon') },
            { id: 'trot3', icon: '🧳', name: 'Globe-trotter', desc: 'Terminer 3 escales', test: () => escFinishedCount() >= 3 },
            { id: 'trot6', icon: '🌍', name: 'Baroudeur', desc: 'Terminer 6 escales', test: () => escFinishedCount() >= 6 },
            { id: 'trot10', icon: '🌐', name: 'Tour du monde', desc: 'Terminer 10 escales', test: () => escFinishedCount() >= 10 });
    }
    if (typeof BADGE_FAMS !== 'undefined') {
        BADGE_FAMS.push(['🧳', 'Globe-trotter', 'escales finies', [['esc-japon', 'Japon', 1, () => +escFinished('japon')],
            ['trot3', '3 escales', 3, escFinishedCount], ['trot6', '6 escales', 6, escFinishedCount], ['trot10', '10 escales', 10, escFinishedCount]]]);
    }
}

/* ---------- Bac à sable (17/11) : voir l'avion puis la fin d'escale avec le tampon, sans toucher à sa vraie escale ---------- */
function escDemo() {
    const e = escById('japon');
    const keep = escAll()[e.id] ? JSON.parse(JSON.stringify(escAll()[e.id])) : null;
    showScreen('map');
    escTakeoff(e, () => {
        const ed = { open: todayKey(), done: {}, stamp: null };
        for (let n = 1; n <= ESC_LEVELS; n++) ed.done[n] = 'demo';   // déjà « fait » : pas de goutte dépensée
        escAll()[e.id] = ed;
        startEscaleLevel(e, ESC_LEVELS);
        setTimeout(() => {
            state.errors = 0;
            endSession(true);   // écran de fin : « Escale au Japon terminée ! » + tampon ; « Continuer » → le tampon se pose dans le carnet
            // l'escale est remise comme avant une fois le tampon posé (ou au plus tard 60 s après)
            let restored = false;
            const restore = () => { if (restored) return; restored = true; if (keep) escAll()[e.id] = keep; else delete escAll()[e.id]; saveData(); };
            escUi.afterLanding = restore;
            setTimeout(restore, 60000);
        }, 900);
    });
}

/* ---------- Collection (17/11) : les cartes d'escale ont leur propre rangée « 🧳 Escales » (plus dans « Événements ») ---------- */
function escCardsSection(container, btnFn, mine, has) {
    if (!ESCALES_ON) return;
    const owned = has || (c => !!state.data.cards[c.id]);
    const list = ESCALES.filter(x => x.card && (owned(x.card) || (mine && escReady(x))));
    if (!list.length || (!mine && !list.some(x => owned(x.card)))) return;
    const head = el('div', 'card-theme-head is-escale');
    head.textContent = `🧳 Escales · ${list.filter(x => owned(x.card)).length}/${ESCALES.filter(x => x.card).length}`;
    const row = el('div', 'card-row');
    list.forEach(x => {
        if (owned(x.card)) { row.append(btnFn(x.card)); return; }
        const btn = el('button', 'kcard-btn');
        btn.type = 'button';
        const box = el('div', 'kcard is-missing is-locked rarity-event');
        box.textContent = '🔒';
        btn.append(box);
        btn.addEventListener('click', () => { escUi.tab = 'escales'; escUi.view = null; showScreen('map'); showToast(`🧳 Termine l’Escale ${x.at} pour gagner sa carte.`); });
        row.append(btn);
    });
    container.append(head, row);
}
