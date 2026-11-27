'use strict';
/* ============================================================
   KULTIVORE — LES ESCALES (17/11/2026, BAC À SABLE ; pour tous : ESCALES_ON = true ; aperçu : apercu-escales-voyage.html)
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
// 18/11 : aussi dans l'APPLI Android (testeurs), pas encore sur le site
const ESCALES_ON = BAC || (typeof IS_APP !== 'undefined' && IS_APP);
const ESCALES = [
    { id: 'japon', name: 'Japon', at: 'au Japon', icon: '🗾', flag: '🇯🇵', hat: 'japon', cls: 'esc-japon', blurb: 'Mont Fuji, sushis, mangas, samouraïs…',
      stages: ['Premiers pas', 'Tokyo · pop culture', 'Kyoto · traditions'], decor: ['🌸', '⛩️', '🍣', '🗻', '🎎', '🍵', '🏯', '🎏', '🍜', '🦌'],
      card: { id: 'esc-japon', theme: 'Escales', icon: '🗾', name: 'Escale au Japon', rarity: 'event', text: 'Gagnée en terminant l’Escale au Japon.' } },
    { id: 'italie', name: 'Italie', at: 'en Italie', icon: '🍕', flag: '🇮🇹', hat: 'italie', cls: 'esc-italie', blurb: 'Colisée, pizza, gondoles, Renaissance…',
      stages: ['Premiers pas', 'Rome · Antiquité', 'Florence · Renaissance'], decor: ['🍕', '🏛️', '🎭', '🍝', '🛵', '☕', '🌋', '🎨', '🍋', '⛪'],
      card: { id: 'esc-italie', theme: 'Escales', icon: '🍕', name: 'Escale en Italie', rarity: 'event', text: 'Gagnée en terminant l’Escale en Italie.' } },
    { id: 'usa', name: 'États-Unis', at: 'aux États-Unis', icon: '🗽', flag: '🇺🇸', hat: 'usa', cls: 'esc-usa', blurb: 'New York, Hollywood, Far West…',
      stages: ['Premiers pas', 'Hollywood · pop culture', 'Washington · histoire'], decor: ['🗽', '🍔', '🏈', '🎬', '🎸', '🦅', '🏀', '🚀', '🌭', '🤠'],
      card: { id: 'esc-usa', theme: 'Escales', icon: '🗽', name: 'Escale aux États-Unis', rarity: 'event', text: 'Gagnée en terminant l’Escale aux États-Unis.' } },
    { id: 'grece', name: 'Grèce', at: 'en Grèce', icon: '🏛️', blurb: 'Acropole, dieux de l’Olympe, îles…', soon: 'Bientôt' },
    { id: 'egypte', name: 'Égypte', at: 'en Égypte', icon: '🏺', blurb: 'Pyramides, pharaons, Nil…', soon: 'Bientôt' },
    { id: 'maghreb', name: 'Maghreb', at: 'au Maghreb', icon: '🕌', hat: 'maghreb', cls: 'esc-maghreb', blurb: 'Médinas, couscous, Sahara, raï…', soon: 'Plus tard',   // 17/11 : prêt, mais publié plus tard (choix de l'utilisateur)
      stages: ['Premiers pas', 'Marrakech · médinas', 'Sahara · histoire'], decor: ['🕌', '🐪', '🏜️', '🫖', '🌴', '⭐', '🌙', '🥘', '🦂', '🏺'],
      card: { id: 'esc-maghreb', theme: 'Escales', icon: '🕌', name: 'Escale au Maghreb', rarity: 'event', text: 'Gagnée en terminant l’Escale au Maghreb.' } }
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
const escStock = () => Math.max(0, 1 + escBought() + (Math.max(0, Number(state.data.escGift) || 0)) - escTicketsUsed());   // escGift : billets offerts (calendrier de l'Avent)
/** Pastille de l'onglet Escales : des billets en stock ET une escale à ouvrir. */
// 23/11 (1.1, choix de l'utilisateur) : PLUS DE PASTILLE pour les billets (même offerts) : un billet en stock est seulement signalé
// dans la page (« ✈️ 1 billet à utiliser »). La pastille de l'onglet ne compte plus que les coffres de collection à ouvrir.
const escBadgeCount = () => (!V11 && ESCALES.some(e => escReady(e) && !escEntry(e)?.open) ? escStock() : 0);
// 23/11 (1.1) : coffres de collection prêts à ouvrir (pastille de l'onglet Escales)
const escChestsReady = () => V11 ? ESCALES.filter(e => escReady(e) && escEntry(e)?.open).reduce((s, e) => s + [1, 2, 3].filter(k => escStageDone(e, k) && !escEntry(e)?.chests?.[k] && (typeof escLootItems !== 'function' || escLootItems(e).length)).length, 0) : 0;
/** Acheter un billet (carte des billets, ou au moment d'ouvrir une escale sans billet). Renvoie true si c'est fait. */
async function escBuyTicket(forWhat) {
    const d = state.data;
    const price = ESC_TICKET_PRICE;
    if (d.coins < price) { showToast(`✈️ Un billet coûte ${fmtNum(price)} 🪙 : il te manque ${fmtNum(price - d.coins)} 🪙.`); return false; }
    const ok = await askConfirm({
        art: forWhat ? escLootPreview(forWhat) : null,   // 23/11 (1.1) : la récompense, au moment de payer
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
    // 17/11 : canotier de gondolier (Italie), chapeau de cow-boy (États-Unis) ; le fez du Maghreb existe déjà (kulti.js)
    KULTI_HATS.italie = '<svg class="kulti-hat" viewBox="0 0 36 36" aria-hidden="true"><ellipse cx="17" cy="6.6" rx="10.5" ry="2" fill="#e8c766" stroke="#c9a43f" stroke-width=".5"/><path d="M11.2 6.4 L11.6 0.6 Q17 -0.8 22.4 0.6 L22.8 6.4 Z" fill="#f3d983" stroke="#c9a43f" stroke-width=".5"/><rect x="11.4" y="3.4" width="11.2" height="2" fill="#1d1d1f"/><rect x="11.4" y="3.4" width="3.7" height="2" fill="#2e9e4f"/><rect x="18.9" y="3.4" width="3.7" height="2" fill="#d4262f"/></svg>';
    KULTI_HATS.usa = '<svg class="kulti-hat" viewBox="0 0 36 36" aria-hidden="true"><path d="M3.6 5.4 Q8 9.2 17 8.4 Q26 9.2 30.4 5.4 Q28.4 10.4 17 10.6 Q5.6 10.4 3.6 5.4 Z" fill="#8a5a2b"/><path d="M10.4 8 Q9.6 0.4 13 -0.8 Q15 0.6 17 0.2 Q19 0.6 21 -0.8 Q24.4 0.4 23.6 8 Z" fill="#a06a35"/><path d="M10.6 6 Q17 7.2 23.4 6 L23.3 7.6 Q17 8.8 10.7 7.6 Z" fill="#4a2d14"/></svg>';
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
        if (b.dataset.tab === 'escales' && escBadgeCount() + escChestsReady() > 0) {
            const dot = el('span', 'esc-dot');
            dot.textContent = String(escBadgeCount() + escChestsReady());
            b.append(dot);
        }
    });
    // 17/11 : classes du body AVANT de mesurer (sinon le bandeau de Noël, encore caché par « in-escales », mesurait 0 et
    // l'interrupteur passait sous la barre du haut en revenant sur le Parcours)
    document.body.classList.toggle('in-escales', !$('mapScreen').hidden && onEsc);
    if (!onEsc && typeof updateEventBanner === 'function') updateEventBanner();
    const top = escPlaceSwitch();
    $('mapScreen').classList.toggle('is-esc', onEsc);
    ESCALES.forEach(e => e.cls && $('mapScreen').classList.toggle(e.cls, onEsc && escUi.view === e.id));
    $('escPage').hidden = !onEsc;
    if (onEsc) escRenderPage();
    escTheme();
    // En-tête du petit parcours (« ← Escales ») collé juste sous l'onglet
    const head = document.querySelector('#escPage .esc-head');
    if (head) head.style.top = `${Math.round(top + sw.offsetHeight + 6)}px`;
}
/** Place l'interrupteur collé sous la barre du haut (et sous le bandeau d'événement s'il est là ; sur les Escales, le bandeau
    est caché). 23/11 (1.1) : si la barre du haut n'est pas affichée au moment de la mesure (retour d'un niveau), sa hauteur
    valait 0 → valeur par défaut trop petite → l'interrupteur passait sous la barre jusqu'au prochain calcul. On remesure plus tard. */
// 27/11 : hauteur du bandeau RETENUE (la mesurer à chaque arrivée sur le parcours bloquait le balayage ~150 ms pendant Noël)
let escBannerH = 0;
const escBannerBottom = b => (parseFloat(b.style.top) || topbarHeight() + 8) + (escBannerH || (escBannerH = b.offsetHeight) || 38);
let escStickK = 0;   // écart de place de l'interrupteur collé, rattrapé en défilant (voir plus bas)
function escPlaceSwitch(tries = 0) {
    const sw = $('escSwitch');
    if (!sw) return 0;
    const onEsc = escUi.tab === 'escales';
    const banner = $('eventBanner');
    const bar = $('topbar');
    const useBanner = !onEsc && banner && !banner.hidden;
    // 27/11 : le bandeau est DANS la page du Parcours : pendant l'animation d'arrivée sur la page, il défile avec elle (sa place à
    // l'écran est fausse, −2 700 px vu sur le téléphone). On part donc de sa place VOULUE (style.top) + sa hauteur.
    // 27/11 : hauteur de la barre RETENUE (topbarH, script.js) : la remesurer forçait le recalcul des 300 niveaux (~85 ms à chaque
    // arrivée sur le Parcours, d'où un petit blocage au balayage). Même valeur, mesurée seulement si on ne l'a pas encore.
    const h = useBanner ? escBannerBottom(banner) : (topbarH || bar?.getBoundingClientRect().height || 0);
    if (V11 && (!h || $('mapScreen').hidden)) {   // pas encore affiché : on réessaie un peu plus tard (le retour sur la carte recalcule aussi)
        clearTimeout(escPlaceSwitch.t);
        if (tries < 20) escPlaceSwitch.t = setTimeout(() => { const t = escPlaceSwitch(tries + 1); const hd = document.querySelector('#escPage .esc-head'); if (t && hd) hd.style.top = `${Math.round(t + sw.offsetHeight + 6)}px`; }, 250);
        return parseFloat(sw.style.top) || 0;
    }
    const top = (h || 56) + 6 - (useBanner ? escStickK : 0);   // l'écart rattrapé ne sert QUE sous le bandeau d'un événement
    sw.style.top = `${Math.round(top)}px`;
    return top;
}
/* 25/11 : sur certains téléphones (appli), l'interrupteur collé restait trop bas sous le bandeau de Noël, sans qu'on sache
   pourquoi (décalage entre la mesure et l'endroit où il se colle). Correction qui se règle toute seule : quand on a bien défilé
   (l'interrupteur est forcément collé), on compare sa VRAIE place à la place voulue (juste sous le bandeau / la barre) et on
   rattrape l'écart (escStickK). */
let escStickRaf = 0;
if (ESCALES_ON && V11) window.addEventListener('scroll', () => {
    if (escStickRaf) return;
    escStickRaf = requestAnimationFrame(() => {
        escStickRaf = 0;
        const sw = $('escSwitch');
        if (!sw || $('mapScreen').hidden || window.scrollY < 300) return;
        const bn = $('eventBanner');
        if (escUi.tab === 'escales' || !bn || bn.hidden) { if (escStickK) { escStickK = 0; escPlaceSwitch(); } return; }   // hors événement : rien (comme avant le 25/11)
        escPlaceSwitch();   // d'abord la place normale (si la mesure était seulement ancienne) …
        requestAnimationFrame(() => escStickFix(sw));   // … puis on rattrape l'écart qui reste
    });
}, { passive: true });
function escStickFix(sw) {
        if (!sw.offsetParent || $('mapScreen').hidden || window.scrollY < 300) return;
        const banner = $('eventBanner');
        const useBanner = escUi.tab !== 'escales' && banner && !banner.hidden;   // (même règle qu'escPlaceSwitch)
        // SEULEMENT avec le bandeau d'un événement (demande de l'utilisateur) : sans événement, l'interrupteur marche bien,
        // on n'y touche pas du tout.
        if (!useBanner) { if (escStickK) { escStickK = 0; escPlaceSwitch(); } return; }
        const want = escBannerBottom(banner) + 6;
        const err = sw.getBoundingClientRect().top - want;
        if (Math.abs(err) > 2 && Math.abs(err) < 200) {
            escStickK += err;
            const t = escPlaceSwitch();
            const hd = document.querySelector('#escPage .esc-head');
            if (t && hd) hd.style.top = `${Math.round(t + sw.offsetHeight + 6)}px`;
        }
}
if (ESCALES_ON && V11) window.addEventListener('resize', () => escPlaceSwitch());
// 25/11 : pendant un événement (bandeau rouge de Noël…), l'interrupteur se calait parfois trop bas : il avait été mesuré avant que la
// barre du haut ait sa taille finale, et le bandeau était replacé ensuite sans lui. Maintenant, à chaque placement du bandeau et à
// chaque changement de taille de la barre du haut, l'interrupteur suit.
if (ESCALES_ON && V11 && typeof updateEventBanner === 'function') {
    const escOrigBanner = updateEventBanner;
    updateEventBanner = function () { escOrigBanner.apply(this, arguments); if (!$('mapScreen').hidden) escPlaceSwitch(); };
    // (27/11 : la barre du haut est surveillée par topbarHeight dans script.js)
}
const escOrigRenderMap = renderMap;
// 18/11 : sur les Escales, le grand parcours est caché AVANT d'être dessiné (sinon il défilait jusqu'au niveau en cours
// et on voyait un instant le bas de la page des Escales, le carnet, avant le retour en haut)
renderMap = function () {
    if (ESCALES_ON) $('mapScreen').classList.toggle('is-esc', escUi.tab === 'escales');
    escOrigRenderMap.apply(this, arguments); escApplyTab();
};
// En arrivant sur le parcours avec l'onglet Escales : liste en haut, ou petit parcours centré sur le niveau en cours
// (passe après le défilement du grand parcours)
const escOrigShowScreen = showScreen;
showScreen = function (name) {
    escOrigShowScreen(name);
    if (ESCALES_ON) escTheme();
    if (!ESCALES_ON || name !== 'map' || escUi.tab !== 'escales') return;
    if (!escUi.view) window.scrollTo(0, 0);   // 18/11 : tout de suite en haut (plus d'éclair du carnet)
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
    if (V11) mine.sort((a, b) => !!escEntry(a).stamp - !!escEntry(b).stamp);   // 23/11 (1.1) : escales en cours d'abord, finies ensuite
    const toOpen = ESCALES.filter(x => escReady(x) && !escEntry(x)?.open);
    const soon = ESCALES.filter(x => !escReady(x));
    const section = (title, list, fn, chip = '') => {
        if (!list.length) return;
        const h = el('div', 'esc-sec');
        h.textContent = title;
        if (chip) { const c = el('span', 'esc-sec-chip'); c.textContent = chip; h.append(c); }   // 23/11 (1.1)
        page.append(h, ...list.map(fn));
    };
    const mineRow = x => {
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
        // 23/11 (1.1) : coffre(s) de collection à ouvrir dans ce voyage → c'est écrit ici (sinon la pastille de l'onglet était un mystère)
        const chests = V11 ? [1, 2, 3].filter(k => escStageDone(x, k) && !escEntry(x)?.chests?.[k] && escLootItems(x).length).length : 0;
        if (chests) {
            const chip = el('span', 'esc-chest-chip');
            chip.textContent = `🎁 ${chests > 1 ? `${chests} coffres` : '1 coffre'} à ouvrir`;
            row.text.append(chip);
            const dot = el('span', 'esc-row-dot');
            dot.textContent = String(chests);
            row.box.append(dot);
        }
        const go = () => {
            escUi.view = x.id; escApplyTab(); window.scrollTo(0, 0);
            setTimeout(() => {   // coffre à ouvrir : on descend jusqu'à lui et il brille ; sinon, le niveau en cours
                const ch = chests && document.querySelector('#escPage .chest-node.is-ready');
                if (ch) { ch.scrollIntoView({ block: 'center' }); ch.classList.add('notif-flash'); } else escScrollToCurrent();
            }, 60);
        };
        row.box.addEventListener('click', go);
        return row.box;
    };
    // 23/11 (1.1) : les voyages EN COURS en haut ; les voyages TERMINÉS sous « À ouvrir » (sinon, avec beaucoup de voyages finis,
    // on ne voyait plus les escales à découvrir)
    if (!V11) section('Mes voyages', mine, mineRow);
    else section('Mes voyages en cours', mine.filter(x => !escEntry(x).stamp), mineRow);
    section('À ouvrir avec un billet', toOpen, x => {
        const row = escRow(x);
        row.sub.textContent = x.blurb;
        row.btn.textContent = stock ? '✈️ 1 billet' : `✈️ ${fmtNum(ESC_TICKET_PRICE)} 🪙`;
        row.btn.className = `esc-btn${stock || state.data.coins >= ESC_TICKET_PRICE ? '' : ' is-off'}`;
        row.box.addEventListener('click', () => escOpenWithTicket(x));
        return row.box;
    }, V11 && stock ? `✈️ ${stock > 1 ? `${stock} billets` : '1 billet'} à utiliser` : '');   // 23/11 (1.1) : ce que compte la pastille de l'onglet
    if (V11) section('Voyages terminés', mine.filter(x => escEntry(x).stamp), mineRow);
    section('Bientôt', soon, x => {
        const row = escRow(x);
        row.sub.textContent = x.blurb;
        row.btn.textContent = `🔒 ${V11 ? 'Bientôt' : x.soon || 'Bientôt'}`;   // 23/11 (1.1) : « Bientôt » pour toutes (le Maghreb disait « Plus tard »)
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
    const loot = escLootPreview(x);   // 23/11 (1.1) : la collection à gagner, visible avant de partir
    const ok = await askConfirm({
        art: loot,
        title: `${x.icon} Partir ${x.at} ?`,
        info: [{ big: String(ESC_LEVELS), label: 'niveaux' }, { big: `✈️ ${stock}`, label: 'billets' }, { big: `✈️ ${stock - 1}`, label: 'il t’en restera', tone: 'warn' }],
        text: loot ? 'À gagner aussi : un tampon et une carte. L’escale reste ouverte pour toujours.'
            : `${ESC_LEVELS} niveaux, puis un tampon, une carte et un badge. L’escale reste ouverte pour toujours.`,
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
    escPlaneSound();
    setTimeout(() => playSound('unlock'), 1500);
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
        if (V11 && n % 5 === 0 && escLootItems(e).length) list.append(escChestStop(e, n / 5));   // 23/11 (1.1) : coffre de la collection après les niveaux 5, 10, 15
        const li = el('li', `esc-stop is-${kind}-stop${kind === 'challenge' ? ' is-final' : ''}`);
        li.style.setProperty('--x', kind === 'challenge' ? '0px' : `${Math.round(Math.sin(n * 1.3) * 52)}px`);
        const done = !!ed.done[n];
        if (done) li.dataset.done = '1';
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
    if (V11) { requestAnimationFrame(() => escDrawTrail(list)); setTimeout(() => escDrawTrail(list), 400); }   // 23/11 (1.1) : pointillés
}
/** 23/11 (1.1) : pointillés entre les niveaux (et les coffres), comme sur le grand parcours ; dorés derrière soi. */
function escDrawTrail(list) {
    if (!list.isConnected) return;
    list.querySelector('.map-trail')?.remove();
    const base = list.getBoundingClientRect();
    if (!base.height) return;
    const pts = [...list.children].filter(li => li.querySelector('.esc-node, .chest-node')).map(li => {
        const box = li.querySelector('.esc-node, .chest-node').getBoundingClientRect();
        return { cx: box.left + box.width / 2 - base.left, top: box.top - base.top, bottom: box.bottom - base.top, done: li.dataset.done === '1' };
    });
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('class', 'map-trail');
    svg.setAttribute('width', base.width);
    svg.setAttribute('height', base.height);
    for (let i = 1; i < pts.length; i++) {   // la liste va du haut (niveau 15) vers le bas (niveau 1) : i est SOUS i − 1
        const a = pts[i - 1], b = pts[i];
        const line = document.createElementNS(ns, 'line');
        line.setAttribute('x1', b.cx); line.setAttribute('y1', b.top - 6);
        line.setAttribute('x2', a.cx); line.setAttribute('y2', a.bottom + 6);
        line.setAttribute('class', b.done ? 'is-done' : '');
        svg.append(line);
    }
    list.prepend(svg);
}
/** 23/11 (1.1) : coffre de la collection d'avatar (étape k = 1, 2, 3), posé après les niveaux 5, 10 et 15. */
function escChestStop(e, k) {
    const it = escLootItems(e)[k - 1];
    const ready = escStageDone(e, k) && !escEntry(e)?.chests?.[k];
    const opened = !!escEntry(e)?.chests?.[k];
    const li = el('li', 'esc-stop esc-chest-stop');
    li.style.setProperty('--x', `${Math.round(Math.sin((5 * k + 0.5) * 1.3) * 52)}px`);
    if (opened || ready) li.dataset.done = '1';
    const btn = el('button', `chest-node ${ready ? 'is-ready' : opened ? 'is-open' : 'is-locked'}`);
    btn.type = 'button';
    btn.textContent = '🎁';
    btn.setAttribute('aria-label', ready ? 'Coffre à ouvrir' : opened ? 'Coffre déjà ouvert' : `Coffre : termine le niveau ${5 * k}`);
    btn.addEventListener('click', () => {
        if (escStageDone(e, k) && !escEntry(e)?.chests?.[k]) escOpenLootChest(e, k);
        else if (escEntry(e)?.chests?.[k]) showToast(`🎁 Déjà ouvert : ${AV_TYPE_NAME[it.type].toLowerCase()} « ${it.name} », dans Profil → Mon avatar.`);
        else showToast(k < 3 ? `🎁 Termine le niveau ${5 * k} pour ouvrir ce coffre.` : '🎁 Réussis le défi final pour ouvrir ce coffre.');
    });
    li.append(btn);
    return li;
}
/** Ouvre le coffre : l'objet est donné tout de suite (déjà « ouvert » : pas de pastille dans le Profil), puis montré en grand. */
async function escOpenLootChest(e, k) {
    const it = escLootItems(e)[k - 1];
    const d = state.data;
    const ed = escEntry(e);
    ed.chests = ed.chests || {};
    ed.chests[k] = todayKey();
    d.av.grant[it.id] = 1; d.av.known[it.id] = 1; d.av.opened[it.id] = 1;
    saveData();
    if (typeof avCheck === 'function') avCheck();
    updateNavNotifications();
    playSound('unlock');
    launchConfetti();
    const art = escLootAvatar(it);
    art.classList.add('esc-chest-reveal');
    const wear = await askConfirm({
        art, title: '🎁 Nouveau pour ton avatar !',
        text: `${AV_TYPE_NAME[it.type]} « ${it.name} » de la collection « ${ESC_LOOK_NAME[e.id] || e.name} ». Il t’attend dans Profil → Mon avatar.`,
        yes: 'Le mettre maintenant', no: 'Plus tard'
    });
    if (wear) { avWear(it); saveData(); if (typeof pushAvatar === 'function') pushAvatar(); showToast('✓ C’est sur ton avatar !'); }
    escRenderPage();
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
    const rd = done && V11 ? replayTilesData('escale') : null;   // 23/11 (1.1) : mêmes cases que le parcours (touchables)
    const info = rd ? rd.tiles
        : done
        ? [{ big: '🔁', label: 'déjà réussi' }, { big: 'gratuit', label: 'pas de goutte', tone: 'good' }]
        : [{ big: `💧 ${drops}`, label: 'gouttes' }, { big: `💧 ${Math.max(0, drops - 1)}`, label: 'il t’en restera', tone: drops > 1 ? null : 'warn' }];
    const asked = askConfirm({
        title: `${ESC_KIND_ICON[kind] || e.icon} ${kind === 'challenge' ? 'Défi final' : `Niveau ${n}`} · Escale ${e.at}`,
        info,
        sub: V11 ? what : '',   // 23/11 (1.1) : en bleu au-dessus des cases, comme le parcours
        text: V11 ? (kind === 'challenge' ? '2 cœurs : réussis-le pour gagner le tampon de l’escale !' : '')
            : `${what}${kind === 'challenge' ? ', 2 cœurs : réussis-le pour gagner le tampon de l’escale !' : '.'}${done ? '\nNiveau refait : XP réduite.' : ''}`,
        yes: done ? 'Rejouer' : 'Commencer · −1 💧', no: 'Plus tard'
    });
    if (rd) replayTilesHelp($('askInfo').firstElementChild, rd.helps);
    const ok = await asked;
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
    // 23/11 (1.1) : défi final = seulement « 🏆 Défi final · 3/10 » (le nom de l'escale est déjà en haut ; le thème reste visible)
    tag.textContent = V11 && state.mode === 'challenge' ? `🏆 Défi final · ${state.done + 1}/${state.total}`
        : `${e.icon} Escale ${e.at}${state.mode === 'challenge' ? ` · Défi final ${state.done + 1}/${state.total}` : ''}`;
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
    // 23/11 (1.1) : fin d'une étape (niveaux 5, 10, 15) → le coffre de la collection attend sur le chemin
    const chestLine = V11 && n % 5 === 0 && escLootItems(e).length && !escEntry(e)?.chests?.[n / 5] ? '\n🎁 Un coffre t’attend sur le chemin de l’escale !' : '';
    setEnd({
        emoji: kind === 'challenge' ? '🏆' : '🎉',
        face: kind === 'challenge' || state.errors === 0 ? 'fier' : 'content',
        title: finished ? `Escale ${e.at} terminée !` : kind === 'challenge' ? 'Défi final relevé !' : `Niveau ${n} terminé !`,
        text: (finished ? `📕 Tampon dans ton carnet de voyage\n🃏 Carte « ${e.card.name} »${V11 ? '' : `\n🏅 Badge « ${e.name} »`}` : next) + chestLine,
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
function escCarnet(done = x => escFinished(x.id)) {   // 17/11 : « done » = le carnet d'un ami
    const box = el('div', 'esc-carnet');
    const head = el('div', 'esc-carnet-head');
    const list = V11 ? ESCALES.filter(x => escReady(x) || done(x)) : ESCALES;   // 23/11 (1.1) : seulement les escales déjà sorties
    const got = list.filter(done);
    head.innerHTML = '<b>📕 Mon carnet de voyage</b><small></small>';
    head.querySelector('small').textContent = `${got.length} / ${list.length} tampons`;
    const pages = el('div', 'esc-carnet-pages');
    list.forEach((x, i) => {
        const cell = el('div', `esc-carnet-cell${i % 2 ? ' is-l' : ' is-r'}`);
        cell.dataset.id = x.id;
        if (done(x)) cell.append(escStamp(x));
        else { const empty = el('div', 'esc-stamp is-empty'); empty.innerHTML = '<strong></strong><em>?</em>'; empty.querySelector('strong').textContent = x.name.toUpperCase(); cell.append(empty); }
        pages.append(cell);
    });
    box.append(head, pages);
    return box;
}

/* ---------- 23/11 (1.1) : COLLECTION D'AVATAR DE CHAQUE ESCALE (jamais vendue) ----------
   Emoji à la fin de l'étape 1 (niveaux 1-5), fond à la fin de l'étape 2 (6-10), cadre avec le défi final.
   Les objets passent par le système habituel (AV_ALL / avCheck) : pastille sur l'avatar, cadenas à ouvrir dans Mon avatar,
   ligne « Débloqué pour ton avatar » sur l'écran de fin. Apparence : style.css (classe = id). */
const ESC_LOOKS = {
    japon:  [['pic', '🍣', 'Sushi'], ['bg', null, 'Cerisiers'], ['frame', null, 'Torii']],
    italie: [['pic', '🍕', 'Pizza'], ['bg', null, 'Toscane'], ['frame', null, 'Mosaïque']],
    usa:    [['pic', '🗽', 'Liberté'], ['bg', null, 'Skyline'], ['frame', null, 'Stars & Stripes']]
};
const ESC_LOOK_NAME = { japon: 'Sakura', italie: 'Dolce vita', usa: 'Big Apple' };
/** Étape k (1, 2, 3) d'une escale terminée ? (étape 3 = défi final réussi) */
function escStageDone(e, k) {
    if (k >= 3) return escFinished(e.id);
    const done = escEntry(e)?.done || {};
    for (let n = 1; n <= 5 * k; n++) if (!done[n]) return false;
    return true;
}
const escLootItems = e => (ESC_LOOKS[e.id] || []).map((x, i) => AVI[`${x[0] === 'frame' ? 'fr' : x[0]}-esc-${e.id}`]).filter(Boolean);
if (ESCALES_ON && V11 && typeof AV_ALL !== 'undefined') {
    ESCALES.filter(escReady).forEach(e => (ESC_LOOKS[e.id] || []).forEach(([type, emoji, name], i) => {
        const k = i + 1;
        const it = { id: `${type === 'frame' ? 'fr' : type}-esc-${e.id}`, type, kind: 'earn', name, escale: e.id, step: k,
            how: k < 3 ? `Ouvre le coffre de l’étape ${k} de l’Escale ${e.at}` : `Ouvre le coffre du défi final de l’Escale ${e.at}`, test: () => !!escEntry(e)?.chests?.[k] };   // donné en ouvrant le coffre sur le chemin (escOpenLootChest)
        if (emoji) it.emoji = emoji;
        if (type === 'frame') it.fx = 'tag';
        if (!AVI[it.id]) { AV_ALL.push(it); AVI[it.id] = it; }
    }));
}
/** Rond d'avatar qui montre UN objet de la collection (sur ma couleur et mon initiale). */
function escLootAvatar(it) {
    const look = state.data.avatar || {};
    const a = el('span', 'league-avatar');
    a.style.setProperty('--hue', String(Number.isInteger(look.hue) ? look.hue : 210));
    if (it.type === 'pic') a.append(emojiImg(it.emoji));
    else {
        a.textContent = [...(myAvatarName() || 'K')][0].toUpperCase();
        if (it.type === 'bg') a.classList.add(it.id); else a.classList.add('fr', it.id, 'fx-tag');
    }
    return a;
}
/** Aperçu de la collection dans les fenêtres d'achat / de départ : la collection COMPLÈTE portée par un seul avatar. */
function escLootPreview(e) {
    const items = V11 ? escLootItems(e) : [];
    if (!items.length) return null;
    const box = el('div', 'esc-loot-preview');
    const t = el('b');
    t.textContent = `🎁 Collection « ${ESC_LOOK_NAME[e.id] || e.name} » à gagner`;
    const look = state.data.avatar || {};
    const a = el('span', 'league-avatar');
    a.style.setProperty('--hue', String(Number.isInteger(look.hue) ? look.hue : 210));
    items.forEach(it => {
        if (it.type === 'pic') a.append(emojiImg(it.emoji));
        else if (it.type === 'bg') a.classList.add(it.id);
        else a.classList.add('fr', it.id, 'fx-tag');
    });
    box.append(a, t);   // 23/11 : compact (la fenêtre devait tenir sans défiler)
    return box;
}
/** Ligne « 🎁 À gagner » en haut du petit parcours d'une escale : les 3 objets, avec un cadenas tant qu'ils ne sont pas gagnés. */
function escLootRow(e) {
    const items = escLootItems(e);
    if (!items.length) return null;
    const box = el('div', 'esc-loot');
    const t = el('b', 'esc-loot-title');
    t.textContent = '🎁 À gagner dans cette escale';
    const row = el('div', 'esc-loot-row');
    items.forEach(it => {
        const got = escStageDone(e, it.step);
        const cell = el('button', `esc-loot-cell${got ? ' is-got' : ''}`);
        cell.type = 'button';
        const a = escLootAvatar(it);
        const lab = el('small');
        lab.textContent = got ? '✓ Gagné' : it.step < 3 ? `Étape ${it.step}` : 'Défi final';
        cell.append(a, lab);
        if (!got) { const lk = el('span', 'esc-loot-lock'); lk.textContent = '🔒'; cell.append(lk); }
        cell.addEventListener('click', () => showToast(got ? `${AV_TYPE_NAME[it.type]} « ${it.name} » gagné : choisis-le dans Profil → Mon avatar.` : `${AV_TYPE_NAME[it.type]} « ${it.name} » : ${it.how.charAt(0).toLowerCase()}${it.how.slice(1)}.`));
        row.append(cell);
    });
    box.append(t, row);
    return box;
}

/* ---------- Cartes et badges ---------- */
if (ESCALES_ON) {
    ESCALES.filter(x => x.card && escReady(x)).forEach(x => { if (!EVENT_CARDS.some(c => c.id === x.card.id)) EVENT_CARDS.push(x.card); });
    if (typeof BADGES_NEW !== 'undefined') {
        BADGES_NEW.push(
            // 23/11 (1.1) : plus un badge par escale (il y en aurait des dizaines), mais « 1 escale » dans la famille Globe-trotter
            ...(V11 ? [{ id: 'trot1', icon: '✈️', name: 'Premier voyage', desc: 'Terminer 1 escale', test: () => escFinishedCount() >= 1 }]
                : ESCALES.filter(x => x.card && escReady(x)).map(x => ({ id: `esc-${x.id}`, icon: x.icon, name: x.name, desc: `Terminer l’Escale ${x.at}`, test: () => escFinished(x.id) }))),
            { id: 'trot3', icon: '🧳', name: 'Globe-trotter', desc: 'Terminer 3 escales', test: () => escFinishedCount() >= 3 },
            { id: 'trot6', icon: '🌍', name: 'Baroudeur', desc: 'Terminer 6 escales', test: () => escFinishedCount() >= 6 },
            { id: 'trot10', icon: '🌐', name: 'Tour du monde', desc: 'Terminer 10 escales', test: () => escFinishedCount() >= 10 });
    }
    if (typeof BADGE_FAMS !== 'undefined') {
        BADGE_FAMS.push(['🧳', 'Globe-trotter', 'escales finies', [...(V11 ? [['trot1', '1 escale', 1, escFinishedCount]]
            : ESCALES.filter(x => x.card && escReady(x)).map(x => [`esc-${x.id}`, x.name, 1, () => +escFinished(x.id)])),
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
            window.addEventListener('pagehide', restore, { once: true });   // appli fermée pendant la démo : on remet quand même
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
    head.textContent = `🧳 Escales · ${list.filter(x => owned(x.card)).length}/${ESCALES.filter(x => x.card && escReady(x)).length}`;
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

/* ---------- 17/11 : carnet de voyage des amis, livre « Voyages » de l'encyclopédie, tutoriel, annonce ---------- */
// Résumé envoyé aux amis : les escales finies (leur carnet de voyage)
if (ESCALES_ON) {
    const escOrigSummary = profileSummary;
    profileSummary = function () { const s = escOrigSummary(); s.escales = ESCALES.filter(x => escFinished(x.id)).map(x => x.id); return s; };
}
/** 3e onglet du profil d'un ami : son carnet de voyage (tampons des escales finies). */
function escFriendTab(f, s, tabBtn, pages) {
    if (!ESCALES_ON) return;
    let list = Array.isArray(s.escales) ? s.escales : [];
    if (BAC && !s.escales && f && f.link === 'bac1') list = ['japon', 'italie'];   // bac à sable : Léa a déjà voyagé
    tabBtn('voyages', `🧳 Voyages · ${list.length}`);
    const box = pages.voyages.box;
    box.append(escCarnet(x => list.includes(x.id)));
    if (!list.length) {
        const p = el('p', 'friend-empty');
        p.textContent = 'Pas encore d’escale terminée.';
        box.prepend(p);
    }
}
// Encyclopédie : un livre « 🧳 Voyages », un chapitre par escale (les questions des escales, copiées avec ce thème)
let escEncCache = null;
function escEncQuestions() {
    if (!ESCALES_ON) return [];
    if (escEncCache) return escEncCache;
    escEncCache = [];
    ESCALES.filter(escReady).forEach(e => escBank(e).questions.forEach(q => escEncCache.push({ ...q, theme: 'Voyages', escale: e.id })));
    return escEncCache;
}
if (ESCALES_ON && typeof ENC_CHAPTERS !== 'undefined') {
    ENC_CHAPTERS.Voyages = ESCALES.filter(escReady).map(e => [e.icon, `Escale ${e.at}`, escBank(e).questions.map(q => q.id)]);
}
// Tutoriel du début : une bulle sur l'onglet des Escales (après celle des coffres)
if (ESCALES_ON && typeof TOUR_STEPS !== 'undefined') {
    const i = TOUR_STEPS.findIndex(st => String(st.text).includes('coffre'));
    TOUR_STEPS.splice(i >= 0 ? i + 1 : TOUR_STEPS.length - 1, 0, {
        target: () => document.querySelector('.esc-switch-btn[data-tab="escales"]'),
        text: '🧳 Ici, les Escales : de petits voyages de 15 niveaux au Japon, en Italie… Ton premier billet d’avion est offert !'
    });
}
// Annonce « Quoi de neuf ? » : UNE fois, seulement pour les joueurs qui jouaient avant l'arrivée des escales
const ESC_NEWS_DAY = BAC ? '2099-01-01' : '2026-11-18';   // à mettre au jour de la mise en ligne pour tous
const ESC_PATCH_NOTES = [
    ['🧳', 'Les Escales', 'Nouvel onglet en haut du Parcours : de petits voyages de 15 niveaux au Japon, en Italie et aux États-Unis.'],
    ['✈️', 'Ton premier billet est offert', 'Choisis ta première escale gratuitement. Les billets suivants s’achètent 1 000 🪙, en touchant la carte des billets.'],
    ['📕', 'Ton carnet de voyage', 'Chaque escale terminée te donne un tampon et une carte, et ses coffres une collection d’avatar. Tes amis peuvent voir ton carnet dans ton profil.'],
    ['🎩', 'Chaque pays a son décor', 'Ses étapes, ses paires, ses frises, ses couleurs… et Kulti change même de chapeau !']
];
function escNews() {
    const d = state.data;
    if (!ESCALES_ON || d.escNews || !d.onboarded || !d.tourDone) return;
    const oldPlayer = Object.keys(d.activeDays || {}).some(k => k < ESC_NEWS_DAY);
    if (!oldPlayer) { d.escNews = todayKey(); saveData(); return; }   // nouveau joueur : le tutoriel lui montre les Escales
    if (document.querySelector('.modal-overlay:not([hidden]), .tour:not([hidden])') || !$('studyScreen').hidden) { setTimeout(escNews, 4000); return; }
    const list = $('patchList');
    list.replaceChildren();
    ESC_PATCH_NOTES.forEach(([icon, title, text]) => {
        const item = el('div', 'patch-item');
        const ic = el('span', 'patch-icon');
        ic.textContent = icon;
        const body = el('div');
        const b = el('b');
        b.textContent = title;
        const p = el('p');
        p.textContent = text;
        body.append(b, p);
        item.append(ic, body);
        list.append(item);
    });
    d.escNews = todayKey();   // une seule fois, même si la fenêtre est fermée tout de suite
    saveData();
    $('patchModal').hidden = false;
}
if (ESCALES_ON) window.addEventListener('load', () => setTimeout(escNews, 5000));
/** 17/11 : salle « Mon tour du monde » du livre Voyages : les questions de chaque escale posées sur son pays (le Maghreb sur ses 3 pays). */
const ESC_COUNTRIES = { japon: ['JP'], italie: ['IT'], maghreb: ['MA', 'DZ', 'TN'], usa: ['US'] };
function escMapData() {
    const o = {}, all = encAll();
    ESCALES.filter(escReady).forEach(e => (ESC_COUNTRIES[e.id] || []).forEach(cc => {
        o[cc] = escBank(e).questions.map(q => all.get(q.id)).filter(Boolean);
    }));
    return o;
}
/** 17/11 : salle « 📸 Mon album de voyage » du livre Voyages (remplace la carte du monde) : une page par escale, un polaroïd
    par question réussie (icône du sujet + la réponse écrite à la main), un polaroïd vide « ? » pour les autres, rangés par étape. */
let escAlbumTab = null;
function openEscAlbum(id = null, keepScroll = 0) {
    const list = ESCALES.filter(escReady);
    if (!list.length) return;
    escAlbumTab = id || escAlbumTab || (list.find(e => escEntry(e)?.open) || list[0]).id;
    const e = escById(escAlbumTab);
    const all = encAll();
    const qs = escBank(e).questions.map(q => ({ q: all.get(q.id), orig: q })).filter(x => x.q);
    const known = qs.filter(x => encKnown(x.q));
    const h = el('h2', 'review-title enc-title is-sm');
    h.textContent = '📸 Mon album de voyage';
    const tabs = el('div', 'esc-album-tabs');
    list.forEach(x => {
        const b = el('button', `esc-album-tab${x.id === e.id ? ' is-on' : ''}`);
        b.type = 'button';
        const k = escBank(x).questions.filter(q => encKnown(q)).length;
        b.textContent = `${x.icon} ${x.name}`;
        const s = el('small');
        s.textContent = `${k} / ${escBank(x).questions.length}`;
        b.append(s);
        b.addEventListener('click', () => openEscAlbum(x.id));
        tabs.append(b);
    });
    const cnt = el('p', 'enc-chap-sub');
    cnt.textContent = `${known.length} / ${qs.length} souvenirs ${e.at}`;
    let page = null;
    const back = () => ({ label: '← Mon album', fn: () => openEscAlbum(e.id, page ? page.scrollTop : 0) });
    const parts = [];
    [1, 2, 3].forEach(st => {
        const inStage = qs.filter(x => (x.orig.stage || 1) === st);
        if (!inStage.length) return;
        const sh = el('p', 'esc-album-stage');
        sh.textContent = `Étape ${st} · ${e.stages[st - 1]}`;
        const grid = el('div', 'esc-album-grid');
        inStage.forEach((x, i) => {
            const ok = encKnown(x.q);
            const p = el('button', `esc-pola${ok ? '' : ' is-blank'}`);
            p.type = 'button';
            p.style.setProperty('--r', `${[-4, 3, -2, 4, -3, 2][(x.q.id + i) % 6]}deg`);
            const ph = el('span', 'esc-pola-ph');
            const cap = el('span', 'esc-pola-cap');
            if (ok) {
                ph.textContent = ESC_SOUVENIR[x.q.id] || encIcon(x.orig.theme);
                cap.textContent = x.q.a[0];
                p.addEventListener('click', () => openEncFiche(x.q, known.map(k => k.q), back()));
            } else {
                ph.textContent = '?';
                cap.textContent = '…';
                p.addEventListener('click', () => showToast('📸 Réussis cette question dans l’escale pour coller la photo.'));
            }
            p.append(ph, cap);
            grid.append(p);
        });
        parts.push(sh, grid);
    });
    page = encPage(encBackBtn('← Voyages', () => openEncBook('Voyages', true)), h, tabs, cnt, ...parts);
    page.classList.add('esc-albumpage');
    if (keepScroll) page.scrollTop = keepScroll;
    if (known.length >= qs.length) encDone(`album-${e.id}`, true, cnt);
}

/* 17/11 : toucher l'onglet « Parcours » (en bas) quand on y est déjà = basculer entre Parcours et Escales */
if (ESCALES_ON) document.addEventListener('click', ev => {
    const b = ev.target.closest('.nav-btn[data-screen="map"]');
    if (!b || $('mapScreen').hidden || !$('studyScreen').hidden) return;
    ev.stopImmediatePropagation();
    ev.preventDefault();
    escUi.tab = escUi.tab === 'escales' ? 'parcours' : 'escales';
    escUi.view = null;
    escApplyTab();
    if (escUi.tab === 'parcours') setTimeout(() => document.querySelector('#mapPath .node.is-current:not(.is-optional)')?.scrollIntoView({ block: 'center' }), 60);
    else window.scrollTo(0, 0);
}, true);
/** 17/11 : l'emoji de chaque souvenir de l'album (sinon l'icône du thème). */
const ESC_SOUVENIR = {
    40000: '🎮', 40001: '🏝️', 40002: '🌸', 40003: '🍱', 40004: '🥢', 40005: '🐙', 40006: '🥞', 40007: '♨️', 40008: '🥋', 40009: '🥋', 40010: '⭐', 40011: '👘',
    40012: '🎎', 40013: '📚', 40014: '🤖', 40015: '🍄', 40016: '🚄', 40017: '🍁', 40018: '🌅', 40019: '🌼', 40020: '🕊️', 40021: '⛩️', 40022: '🦌', 40023: '⛩️',
    40024: '🛏️', 40025: '🌊', 40026: '📓', 40027: '🎤', 40028: '🏴‍☠️', 40029: '⚽', 40030: '🎬', 40031: '🏴‍☠️', 40032: '🐉', 40033: '🌙', 40034: '🐱', 40035: '🔨',
    40036: '🎮', 40037: '🚗', 40038: '🏍️', 40039: '🗾', 40040: '👗', 40041: '🌊', 40042: '🏯', 40043: '👋', 40044: '🫙', 40045: '🏯', 40046: '🤓', 40047: '🙏',
    40048: '💖', 40049: '🚶', 40050: '⚾', 40051: '🐈', 40052: '🧺', 40053: '🎭', 40054: '🔴', 40055: '🪭', 40056: '🎹', 40057: '🧥', 40058: '🐉', 40059: '👋',
    40200: '👢', 40201: '🟩', 40202: '🍕', 40203: '🧀', 40204: '👋', 40205: '🌿', 40206: '🍝', 40207: '👍', 40208: '🍞', 40209: '🌰', 40210: '🍙', 40211: '🙏',
    40212: '☀️', 40213: '😱', 40214: '🌋', 40215: '🌽', 40216: '👠', 40217: '💙', 40218: '🏆', 40219: '🔱', 40220: '🏞️', 40221: '🚗', 40222: '👋', 40223: '🥣',
    40224: '⚔️', 40225: '📜', 40226: '🏟️', 40227: '🧱', 40228: '⛪', 40229: '💂', 40230: '🏛️', 40231: '🔱', 40232: '📅', 40233: '🛡️', 40234: '🪖', 40235: '💧',
    40236: '🌋', 40237: '🏚️', 40238: '👑', 40239: '🥻', 40240: '📅', 40241: '⛰️', 40242: '🚣', 40243: '🎭', 40244: '🌉', 40245: '🌷', 40246: '💰', 40247: '💋',
    40248: '🍷', 40249: '🎼', 40250: '🏘️', 40251: '🐎', 40252: '🧸', 40253: '👜', 40254: '🐍', 40255: '🌟', 40256: '🏆', 40257: '🎨', 40258: '🎬', 40259: '🎤',
    40600: '🌶️', 40601: '🏄', 40602: '🥤', 40603: '👟', 40604: '💨', 40605: '🛣️', 40606: '🛍️', 40607: '🥧', 40608: '🥜', 40609: '💵', 40610: '☕', 40611: '🏀',
    40612: '🏈', 40613: '🌴', 40614: '🦃', 40615: '🎆', 40616: '🦅', 40617: '👌', 40618: '🏰', 40619: '🐊', 40620: '💻', 40621: '👖', 40622: '🏞️', 40623: '🌴',
    40624: '🎸', 40625: '🎭', 40626: '🎬', 40627: '🎤', 40628: '👑', 40629: '🚀', 40630: '💖', 40631: '💪', 40632: '🛡️', 40633: '💋', 40634: '📱', 40635: '🚀',
    40636: '🧸', 40637: '🎷', 40638: '📺', 40639: '🎧', 40640: '🏍️', 40641: '🌳', 40642: '🚢', 40643: '🔔', 40644: '🪶', 40645: '🦬', 40646: '🗳️', 40647: '🛡️',
    40648: '⛏️', 40649: '🧸', 40650: '🎩', 40651: '🛰️', 40652: '🏛️', 40653: '📜', 40654: '🏰', 40655: '🐴', 40656: '🗿', 40657: '🏹', 40658: '⛪', 40659: '🎙️',
    // Maghreb (publié plus tard)
};

/** 17/11 : bruit d'avion qui décolle (moteur qui monte + souffle), seulement si le son est activé. */
if (typeof SOUNDS !== 'undefined') SOUNDS.plane = [[70, 0, 2.1, 'triangle', 210], [104, 0.05, 2.0, 'triangle', 330], [150, 0.4, 1.6, 'sine', 520]];
function escPlaneSound() {
    if (!state.data.sound) return;
    try {
        playSound('plane');
        if (typeof synthNoise === 'function') { synthNoise(0, 2.2, 0.16, 260, 0.9, 2200); synthNoise(0.5, 1.6, 0.08, 900, 0.6, 3500); }
    } catch (e) { /* pas de son : tant pis */ }
}
