'use strict';

/* ============================================================
   KULTIVO — Noël 2026 (16/11/2026, BAC À SABLE ; pour tous : NOEL_ON = true et retirer `bacOnly` de l'événement noel-2026)
   Chargé APRÈS script.js (il utilise ses fonctions ; tout est appelé après le chargement de la page).
   1) Décor de Noël tout décembre (neige, icônes, anecdotes : EVENT_BANKS.noelFacts dans evenements/noel.js).
   2) Calendrier de l'Avent (1er → 24 décembre) : une case par jour, ouvrable SEULEMENT ce jour-là, après une partie qui
      compte (de l'XP gagnée aujourd'hui). Case ratée = perdue. Le 24 : cadre « Étoile de l'Avent » + 20 🪙 pour qui l'ouvre.
   3) ⚡ Pièces ×2 · 15 min : objet à gagner (jamais vendu), activé dans la boutique ; les pièces gagnées en répondant
      comptent double (addXp, script.js).
   4) Rayon de Noël dans la boutique (tout décembre) : 3 objets d'avatar (cosmetiques.js, rayon: 'noel').
   5) Tournée du Père Noël (Semaine de Noël, 21 → 27 décembre ; événement noel-2026 de script.js) : 11 étapes, 5 questions
      trouvées par étape ; 3 pays ouverts au départ, +1 à chaque étape ; une question ratée attend 1 partie ; s'il manque
      des questions, le pays suivant s'ouvre en avance ; en dernier recours, des questions déjà trouvées (sans cadeau).
   Bac à sable : menu 🧪 → « Noël » = choisir un faux jour de décembre (localStorage kultivo_bac_noelday, noelSimDay()).
   ============================================================ */

const NOEL_ON = BAC;
const NOEL_YEAR = 2026;
const inNoelMonth = () => NOEL_ON && noelDayKey().startsWith(`${NOEL_YEAR}-12-`);

/* ---------- 1) Décor de décembre ---------- */
const NOEL_DECOR = ['🎄', '❄️', '🎁', '⛄', '🦌', '🔔', '🧦', '🌟', '🍪', '🛷'];
const noelDecorOn = () => inNoelMonth();
function showNoelFact(badge) {
    const facts = (window.EVENT_BANKS && window.EVENT_BANKS.noelFacts) || [];
    if (!facts.length) return;
    $('factTitle').textContent = '🎄 Noël';
    $('factText').textContent = nbspPunct(facts[Number(badge.dataset.fact || 0) % facts.length]);
    const bubble = $('factBubble');
    bubble.hidden = false;
    const r = badge.getBoundingClientRect();
    const top = r.bottom + 10 + bubble.offsetHeight < window.innerHeight - 90 ? r.bottom + 10 : r.top - 10 - bubble.offsetHeight;
    bubble.style.top = `${Math.max(70, top)}px`;
}
/** Neige qui tombe derrière le parcours et les leçons (rien si « réduire les animations »). */
function noelSnow() {
    let box = document.getElementById('noelSnow');
    const on = document.body.classList.contains('deco-noel') && !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
    if (!on) { if (box) box.remove(); return; }
    if (box) return;
    box = el('div', 'noel-snow');
    box.id = 'noelSnow';
    box.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 26; i++) {
        const f = el('i');
        f.textContent = i % 3 ? '•' : '❄';
        f.style.left = `${(i * 37) % 100}%`;
        f.style.fontSize = `${6 + ((i * 7) % 10)}px`;
        f.style.opacity = (0.35 + ((i * 13) % 50) / 100).toFixed(2);
        f.style.animationDuration = `${9 + ((i * 5) % 9)}s`;
        f.style.animationDelay = `${-((i * 11) % 17)}s`;
        box.append(f);
    }
    document.body.append(box);
}

/* ---------- 2) Calendrier de l'Avent ---------- */
// Cadeaux (choix de l'utilisateur, 16/11) : 20 🪙 au plus par case ; dimanches 6, 13, 20 = une carte ; objets utiles ;
// le 24 = cadre « Étoile de l'Avent » + 20 🪙. Le 1er décembre 2026 est un mardi.
const ADVENT_GIFTS = {
    1: { coins: 10 }, 2: { inv: 'hintLetter' }, 3: { coins: 10 }, 4: { boost: 1 }, 5: { coins: 10 }, 6: { card: 1 },
    7: { coins: 15 }, 8: { inv: 'freeze' }, 9: { inv: 'heart' }, 10: { coins: 15 }, 11: { boost: 1 }, 12: { coins: 15 }, 13: { card: 1 },
    14: { inv: 'nudge' }, 15: { coins: 15 }, 16: { inv: 'hintLetter' }, 17: { coins: 15 }, 18: { boost: 1 }, 19: { coins: 15 },
    20: { card: 1, rare: true }, 21: { coins: 20 }, 22: { drops: 1 }, 23: { coins: 20 }, 24: { coins: 20, star: true }
};
const ADVENT_INV = { hintLetter: ['🅰️', 'Indice « initiales »'], freeze: ['🧊', 'Gel de série'], heart: ['💖', 'Cœur de secours'], nudge: ['👆', 'Coup de pouce'] };
/** Icône d'un cadeau : la pièce est dessinée par la police du jeu (pas d'image Twemoji). */
const giftIcon = icon => { if (icon !== '🪙') return emojiImg(icon); const s = el('span', 'advent-coin'); s.textContent = '🪙'; return s; };
function adventGiftInfo(g) {   // [icône, texte court, texte long]
    if (g.star) return ['🌟', 'Cadre + 20 🪙', 'Le cadre « Étoile de l’Avent » et 20 🪙'];
    if (g.coins) return ['🪙', `+${g.coins}`, `${g.coins} pièces`];
    if (g.card) return ['🃏', 'Carte', g.rare ? 'Une carte rare ou mieux' : 'Une carte'];
    if (g.boost) return ['⚡', '×2', '⚡ Pièces ×2 pendant 15 minutes (à activer dans la boutique)'];
    if (g.drops) return ['💧', 'Gouttes', 'Toutes tes gouttes rechargées'];
    if (g.inv) return [ADVENT_INV[g.inv][0], ADVENT_INV[g.inv][1].split(' ')[0], ADVENT_INV[g.inv][1]];
    return ['🎁', '', ''];
}
/** Jour du calendrier (1 à 24), ou 0 en dehors. */
function adventDay() {
    if (!NOEL_ON) return 0;
    const k = noelDayKey();
    if (!k.startsWith(`${NOEL_YEAR}-12-`)) return 0;
    const d = Number(k.slice(8));
    return d >= 1 && d <= 24 ? d : 0;
}
function adventData() {
    const d = state.data;
    if (!d.advent || d.advent.y !== NOEL_YEAR) d.advent = { y: NOEL_YEAR, open: {}, star: false };
    return d.advent;
}
const playedToday = () => (state.data.activeDays[todayKey()] || 0) > 0;   // une partie qui compte (de l'XP gagnée aujourd'hui)
const adventCanOpen = () => { const day = adventDay(); return !!day && !adventData().open[day] && playedToday(); };
const adventToOpen = () => (adventCanOpen() ? 1 : 0);

/** Ligne « 🗓️ Calendrier de l'Avent » dans Défis, sous les missions (seulement du 1er au 24 décembre). */
function renderAdventRow() {
    const row = $('adventRow');
    if (!row) return;
    const day = adventDay();
    row.hidden = !day;
    if (!day) return;
    const ad = adventData();
    const opened = Object.keys(ad.open).length;
    const bar = el('span', 'quest-row-bar');
    const fill = el('i', 'is-me');
    fill.style.width = `${Math.round((opened / 24) * 100)}%`;
    bar.append(fill);
    const sub = ad.open[day] ? `${opened} / 24 cases · à demain !` : playedToday() ? `${opened} / 24 cases · la case ${day} t’attend !` : `${opened} / 24 cases · joue une partie pour ouvrir la case ${day}`;
    row.replaceChildren(twoLineRow('🗓️ Calendrier de l’Avent', bar, sub), rowArrow());
    if (adventCanOpen()) row.setAttribute('data-notif', '1');
    else row.removeAttribute('data-notif');
}

function openAdventModal(msg = null) {
    const day = adventDay();
    const ad = adventData();
    const grid = $('adventGrid');
    grid.replaceChildren();
    $('adventTitle').textContent = '🗓️ Calendrier de l’Avent';
    $('adventSub').textContent = 'Une case par jour, à ouvrir le jour même après une partie.';
    for (let n = 1; n <= 24; n++) {
        const g = ADVENT_GIFTS[n];
        const [icon, short] = adventGiftInfo(g);
        const b = el('button', 'advent-door');
        b.type = 'button';
        b.style.setProperty('--i', n);
        if (n === 24) b.classList.add('is-24');
        if (ad.open[n]) {
            b.classList.add('is-open');
            b.innerHTML = `<s>${n}</s><em></em><small></small>`;
            b.querySelector('em').append(giftIcon(icon));
            b.querySelector('small').textContent = short;
            b.addEventListener('click', () => adventTip(`Case ${n} : ${adventGiftInfo(g)[2]}.`));
        } else if (n < day) {
            b.classList.add('is-lost');
            b.textContent = String(n);
            b.addEventListener('click', () => adventTip(`Case ${n} ratée : chaque case ne s’ouvre que le jour même.`));
        } else if (n === day) {
            b.classList.add(playedToday() ? 'is-today' : 'is-wait');
            b.textContent = n === 24 ? '🌟 24' : String(n);
            b.addEventListener('click', () => (playedToday() ? adventOpenDoor(b) : adventTip(`Joue une partie (un niveau, un entraînement, un défi…) pour ouvrir la case ${n} !`)));
        } else {
            b.classList.add('is-later');
            b.textContent = n === 24 ? '🌟 24' : String(n);
            b.addEventListener('click', () => adventTip(n === 24 ? 'Le 24 décembre : le cadre « Étoile de l’Avent » et 20 🪙, si tu ouvres la case ce jour-là.' : `Patience : la case ${n} s’ouvre le ${n} décembre.`));
        }
        grid.append(b);
    }
    adventTip(msg || (day && ad.open[day] ? `Case ${day} ouverte : reviens demain pour la suivante !` : ''));
    $('adventModal').hidden = false;
}
function adventTip(text) {
    const t = $('adventTip');
    t.textContent = text || '';
    t.hidden = !text;
}

/** Ouvre la case du jour : la porte tourne, le cadeau est donné. */
function adventOpenDoor(btn) {
    const day = adventDay();
    const ad = adventData();
    if (!day || ad.open[day] || !playedToday()) return;
    const g = ADVENT_GIFTS[day];
    const d = state.data;
    ad.open[day] = todayKey();
    if (g.coins) d.coins += g.coins;
    if (g.inv) d.inv[g.inv] = Math.min((d.inv[g.inv] || 0) + 1, g.inv === 'freeze' ? 5 : 999);
    if (g.boost) d.inv.boost = (d.inv.boost || 0) + 1;
    if (g.drops) { syncDrops(); addDrops(DROPS_MAX); }
    if (g.star) ad.star = true;
    saveData();
    renderHeader();
    updateNavNotifications();
    renderAdventRow();
    playSound('unlock');
    const [icon, , long] = adventGiftInfo(g);
    btn.classList.remove('is-today');
    btn.classList.add('is-opening');
    setTimeout(() => {
        btn.className = 'advent-door is-open is-new' + (day === 24 ? ' is-24' : '');
        btn.innerHTML = `<s>${day}</s><em></em><small></small>`;
        btn.querySelector('em').append(giftIcon(icon));
        btn.querySelector('small').textContent = adventGiftInfo(g)[1];
        adventTip(`🎁 Case ${day} : ${long} !${g.boost ? ' Active-le quand tu veux dans la boutique.' : ''}${g.star ? ' Le cadre est dans « Mon avatar ».' : ''}`);
        if (g.star) { avCheck(); launchConfetti(); }
        if (g.card) setTimeout(() => { $('adventModal').hidden = true; openCardBoxes([{ size: 1, rare: !!g.rare }], `🗓️ Case ${day} du calendrier`); }, 900);
    }, 450);
}

/* ---------- 3) ⚡ Pièces ×2 ---------- */
const BOOST_MS = 15 * 60 * 1000;
const boostOn = () => (state.data.boostUntil || 0) > Date.now();
function activateBoost() {
    const d = state.data;
    if (boostOn() || !(d.inv.boost > 0)) return;
    d.inv.boost--;
    d.boostUntil = Date.now() + BOOST_MS;
    saveData();
    playSound('unlock');
    showToast('⚡ Pièces ×2 pendant 15 minutes : à toi de jouer !');
    renderBoostChip();
    if (!$('shopScreen').hidden) renderShop();
}
/** Ligne de la boutique (Objets utiles) : seulement si on en a, ou si un bonus est en cours. */
function boostShopLine(line, mkBtn) {
    const d = state.data;
    const have = d.inv.boost || 0;
    if (!have && !boostOn()) return null;
    const left = Math.ceil(((d.boostUntil || 0) - Date.now()) / 60000);
    return line('⚡', 'Pièces ×2 · 15 min', 'Pendant 15 minutes, les pièces gagnées en répondant comptent double. À gagner, jamais vendu.',
        [mkBtn(boostOn() ? `En cours · ${left} min` : 'Activer', 'btn-violet', boostOn() || !have, activateBoost)],
        { text: `🎒 ${have} en stock`, zero: !have });
}
/** Pastille « ⚡ 14:32 » à côté des pièces pendant le bonus. */
function renderBoostChip() {
    let chip = document.getElementById('boostChip');
    if (!boostOn()) { if (chip) chip.remove(); return; }
    if (!chip) {
        chip = el('span', 'boost-chip');
        chip.id = 'boostChip';
        chip.title = 'Pièces ×2';
        $('coinChip').after(chip);
    }
    const s = Math.max(0, Math.round(((state.data.boostUntil || 0) - Date.now()) / 1000));
    chip.textContent = `⚡×2 ${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
setInterval(() => { if (document.getElementById('boostChip') || boostOn()) renderBoostChip(); }, 1000);

/* ---------- 4) Rayon de Noël ---------- */
function noelRayonCard() {
    if (!inNoelMonth()) return null;
    const d = state.data;
    const items = AV_ITEMS.filter(it => it.rayon === 'noel');
    if (!items.length) return null;
    const card = el('article', 'card vitrine is-rayon');
    const head = el('div', 'vitrine-head');
    const h = el('h2');
    h.textContent = '🎄 Rayon de Noël';
    const left = el('span');
    left.textContent = '⏳ tout décembre';
    head.append(h, left);
    const row = el('div', 'vitrine-row');
    items.forEach(it => {
        const owned = !!d.av.owned[it.id];
        const c = el('div', 'vit-cell is-event');
        const p = el('span', 'vit-pill is-event');
        p.textContent = 'Noël';
        const a = el('div', 'vit-art');
        a.append(avAlone(it));
        const b = el('b');
        b.textContent = it.name;
        const t = el('span', 'vit-type');
        t.textContent = AV_TYPE_NAME[it.type];
        const btn = el('button', `btn ${owned ? 'btn-ghost' : 'btn-green'}`);
        btn.type = 'button';
        btn.textContent = owned ? '✓ À toi' : `${it.price} 🪙`;
        btn.disabled = owned || d.coins < it.price;
        if (!owned) btn.addEventListener('click', () => buyAvItem(it));
        c.append(p, a, b, t, btn);
        row.append(c);
    });
    const foot = el('p', 'vitrine-foot');
    foot.textContent = '🎅 Tout le mois de décembre, en plus de la vitrine de la semaine.';
    card.append(head, row, foot);
    return card;
}

/* ---------- 5) Tournée du Père Noël ---------- */
// [code de la carte, drapeau (flags/), nom, sous-titre, « Joyeux Noël » dans la langue du pays, anecdote d'arrivée]
const NOEL_TOUR = [
    ['AU', 'au', 'Australie', 'Noël en plein été', 'Merry Christmas !', 'En Australie, le repas de Noël se prend souvent dehors, à la plage ou autour d’un barbecue : il fait plus de 30 °C !'],
    ['PH', 'ph', 'Philippines', 'Le plus long Noël du monde', 'Maligayang Pasko !', 'Aux Philippines, les décorations de Noël sortent dès septembre et restent jusqu’en janvier.'],
    ['JP', 'jp', 'Japon', 'Le poulet de Noël', 'Merii Kurisumasu !', 'Au Japon, des millions de familles réservent leur seau de poulet frit des semaines avant Noël.'],
    ['SE', 'se', 'Suède', 'La fête des lumières', 'God jul !', 'En Suède, le 13 décembre, des jeunes filles couronnées de bougies chantent pour la Sainte-Lucie.'],
    ['DE', 'de', 'Allemagne', 'Les marchés de Noël', 'Frohe Weihnachten !', 'Les marchés de Noël allemands existent depuis le Moyen Âge : vin chaud, pain d’épices et boules en verre.'],
    ['IT', 'it', 'Italie', 'La Befana', 'Buon Natale !', 'En Italie, c’est la Befana, une gentille sorcière sur son balai, qui apporte des cadeaux… le 6 janvier !'],
    ['FR', 'fr', 'France', 'Bûche et santons', 'Joyeux Noël !', 'En Provence, on dresse 13 desserts sur la table du réveillon, qui restent servis jusqu’au 27 décembre.'],
    ['GB', 'gb', 'Royaume-Uni', 'Pudding et crackers', 'Merry Christmas !', 'Au Royaume-Uni, on porte à table la couronne en papier trouvée dans son cracker… même le grand-père !'],
    ['MX', 'mx', 'Mexique', 'Les posadas', '¡ Feliz Navidad !', 'Au Mexique, du 16 au 24 décembre, les « posadas » font défiler chants, bougies et piñatas de maison en maison.'],
    ['US', 'us', 'États-Unis', 'Lait et cookies', 'Merry Christmas !', 'Aux États-Unis, on laisse des cookies et un verre de lait au Père Noël… et une carotte pour les rennes.'],
    ['FI', 'fi', 'Laponie', 'Le village du Père Noël', 'Hyvää joulua !', 'Retour à la maison ! À Rovaniemi, le village du Père Noël est posé sur le cercle polaire.']
];
const TOUR_PER_STOP = 5;
const TOUR_OPEN = 3;   // pays ouverts au départ (celui où l'on est + les 2 suivants)
function tourData(ev) {
    const ed = eventData(ev);
    if (!ed.tour) ed.tour = { sessions: 0, missAt: {}, asked: {}, extra: 0 };
    return ed.tour;
}
const tourFound = ev => Object.keys(eventData(ev).found).length;
/** Étape en cours (0 à 10) ; 11 = tournée terminée. */
const tourStage = ev => Math.min(NOEL_TOUR.length, Math.floor(tourFound(ev) / TOUR_PER_STOP));
const stopIndex = code => NOEL_TOUR.findIndex(s => s[0] === code);

/** 10 questions : nouvelles des pays ouverts d'abord (le pays en cours en premier), puis les ratées qui ont attendu
    1 partie ; s'il en manque, un pays de plus s'ouvre ; en dernier recours, des questions déjà trouvées (sans cadeau). */
function tourPick(ev) {
    const bank = eventQuestions(ev);
    const ed = eventData(ev);
    const t = tourData(ev);
    const stage = Math.min(tourStage(ev), NOEL_TOUR.length - 1);
    const waiting = q => t.missAt[q.id] === t.sessions;   // ratée à la partie d'avant : elle attend celle-ci
    let picked = [];
    for (let extra = t.extra; ; extra++) {
        const open = Math.min(NOEL_TOUR.length, stage + TOUR_OPEN + extra);
        const inOpen = q => stopIndex(q.stop) < open;
        // nouvelles : 5 au plus du pays en cours (en premier), puis celles des autres pays ouverts, mélangées
        const freshAll = bank.filter(q => inOpen(q) && !ed.found[q.id] && !t.asked[q.id]);
        const here = shuffle(freshAll.filter(q => stopIndex(q.stop) === stage));
        const others = shuffle(freshAll.filter(q => stopIndex(q.stop) !== stage)).sort((a, b) => stopIndex(a.stop) - stopIndex(b.stop));
        const fresh = [...here.slice(0, TOUR_PER_STOP), ...others, ...here.slice(TOUR_PER_STOP)];
        const missed = shuffle(bank.filter(q => inOpen(q) && !ed.found[q.id] && t.asked[q.id] && !waiting(q)));
        picked = [...fresh, ...missed].slice(0, EVENT_SIZE);
        if (picked.length >= EVENT_SIZE || open >= NOEL_TOUR.length) { t.extra = extra; break; }
    }
    if (picked.length < EVENT_SIZE) {   // presque tout est trouvé : des questions déjà vues complètent (elles ne donnent rien)
        const rest = shuffle(bank.filter(q => !picked.includes(q) && (ed.found[q.id] || waiting(q))));
        picked = picked.concat(rest.slice(0, EVENT_SIZE - picked.length));
    }
    saveData();
    return shuffle(picked).map(q => ({ q, review: !!t.asked[q.id] }));
}
/** Fin de partie : les questions ratées attendent la partie suivante. */
function tourAfterSession(ev, ids, right) {
    const t = tourData(ev);
    const ed = eventData(ev);
    t.sessions++;
    ids.forEach(id => {
        t.asked[id] = 1;
        if (!right.includes(id) && !ed.found[id]) t.missAt[id] = t.sessions;
    });
    // les pays ouverts en avance restent ouverts, mais on ne compte plus l'avance une fois le traîneau arrivé
    const stage = Math.min(tourStage(ev), NOEL_TOUR.length - 1);
    t.extra = Math.max(0, Math.min(t.extra, NOEL_TOUR.length - stage - TOUR_OPEN));
}
/** Étiquette d'une question de la tournée : « 🛷 Japon · Vrai ou faux ? » */
function tourTag(q) {
    const s = NOEL_TOUR[stopIndex(q.stop)];
    const kind = q.tf ? ' · Vrai ou faux ?' : q.year !== undefined ? ' · Devine l’année' : q.rebus ? ' · 🧩 Rébus' : '';
    return `🛷 ${s ? s[2] : 'Tournée'}${kind}`;
}
const flagImgOf = cc => { const i = el('img', 'tour-flag'); i.src = `flags/${cc}.svg`; i.alt = ''; return i; };

/** Écran de fin : étape(s) livrée(s) pendant la partie → carte d'arrivée (tampon du pays, anecdote, prochaine étape). */
function tourEndBlock(ev, before, total) {
    const s0 = Math.floor(Math.min(before, ev.goal) / TOUR_PER_STOP);
    const s1 = Math.floor(Math.min(total, ev.goal) / TOUR_PER_STOP);
    const box = el('div', 'tour-arrive');
    if (s1 > s0) {
        const done = NOEL_TOUR[s1 - 1];
        const stamp = el('div', 'tour-stamp');
        stamp.append(flagImgOf(done[1]));
        const sn = el('span');
        sn.textContent = `${done[2]} livré${done[2] === 'Philippines' ? 'es' : ['Australie', 'Suède', 'Allemagne', 'Italie', 'France', 'Laponie'].includes(done[2]) ? 'e' : ''}`;
        stamp.append(sn);
        const tx = el('div', 'tour-arrive-text');
        const h = el('b');
        h.textContent = s1 >= NOEL_TOUR.length ? '🏠 Tournée terminée !' : `${done[4]} 🎄`;
        const p = el('p');
        p.textContent = nbspPunct(done[5]);
        const next = el('small');
        next.textContent = s1 >= NOEL_TOUR.length ? `${ev.goal} cadeaux livrés dans ${NOEL_TOUR.length} pays !`
            : `${s1 - s0 > 1 ? `${s1 - s0} étapes livrées ! ` : ''}Prochaine étape : ${NOEL_TOUR[s1][2]}`;
        tx.append(h, p, next);
        box.append(stamp, tx);
        playSound('stamp');
    } else if (s1 < NOEL_TOUR.length) {
        const cur = NOEL_TOUR[s1];
        const n = Math.min(total, ev.goal) - s1 * TOUR_PER_STOP;
        box.classList.add('is-small');
        const tx = el('span');
        tx.textContent = `🛷 ${cur[2]} : ${n} / ${TOUR_PER_STOP} cadeaux livrés`;
        box.append(flagImgOf(cur[1]), tx);
    } else return;
    $('endExtra').prepend(box);
}

/* Carte du monde (carte-monde.js, chargée à la 1re ouverture comme pour l'encyclopédie) */
const SVGNS = 'http://www.w3.org/2000/svg';
function tourCenter(code) {   // centre de la plus grande partie d'un pays (France sans la Guyane…)
    const d = (WORLD_MAP.countries.find(c => c[0] === code) || [])[1];
    if (!d) return null;
    let best = null;
    for (const sub of d.split('M').filter(Boolean)) {
        const n = sub.match(/-?[\d.]+/g).map(Number), xs = [], ys = [];
        for (let i = 0; i + 1 < n.length; i += 2) { xs.push(n[i]); ys.push(n[i + 1]); }
        const w = Math.max(...xs) - Math.min(...xs), hh = Math.max(...ys) - Math.min(...ys);
        if (!best || w * hh > best.a) best = { a: w * hh, x: (Math.max(...xs) + Math.min(...xs)) / 2, y: (Math.max(...ys) + Math.min(...ys)) / 2 };
    }
    return best;
}
function tourMap(stage) {
    const svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${WORLD_MAP.w} ${WORLD_MAP.h}`);
    svg.setAttribute('class', 'tour-map');
    for (const [c, d] of WORLD_MAP.countries) {
        if (c === 'AQ') continue;
        const i = stopIndex(c);
        const p = document.createElementNS(SVGNS, 'path');
        p.setAttribute('d', d);
        p.setAttribute('class', `land${i < 0 ? '' : i < stage ? ' is-done' : ' is-stop'}`);
        svg.append(p);
    }
    const pts = NOEL_TOUR.map(s => tourCenter(s[0]) || { x: 0, y: 0 });
    pts[NOEL_TOUR.length - 1] = { x: pts[NOEL_TOUR.length - 1].x, y: pts[NOEL_TOUR.length - 1].y - 18 };   // Laponie : nord de la Finlande
    const path = (from, to, cls) => {
        if (to <= from) return;
        let d = `M${pts[from].x},${pts[from].y}`;
        for (let i = from + 1; i <= to; i++) {
            const a = pts[i - 1], b = pts[i];
            d += ` Q${(a.x + b.x) / 2},${Math.min(a.y, b.y) - Math.abs(a.x - b.x) * 0.18} ${b.x},${b.y}`;
        }
        const pl = document.createElementNS(SVGNS, 'path');
        pl.setAttribute('d', d);
        pl.setAttribute('class', cls);
        svg.append(pl);
    };
    path(0, NOEL_TOUR.length - 1, 'route');
    path(0, Math.min(stage, NOEL_TOUR.length - 1), 'route is-done');
    pts.forEach((p, i) => {
        if (i === stage) return;
        const c = document.createElementNS(SVGNS, 'circle');
        c.setAttribute('cx', p.x); c.setAttribute('cy', p.y); c.setAttribute('r', 9);
        c.setAttribute('class', `dot${i < stage ? ' is-done' : ''}${i === NOEL_TOUR.length - 1 ? ' is-final' : ''}`);
        svg.append(c);
    });
    const cur = pts[Math.min(stage, NOEL_TOUR.length - 1)];
    const sled = document.createElementNS(SVGNS, 'image');
    sled.setAttribute('href', 'emoji/1f6f7.svg');
    sled.setAttribute('x', cur.x - 26); sled.setAttribute('y', cur.y - 30);
    sled.setAttribute('width', 52); sled.setAttribute('height', 52);
    svg.append(sled);
    return svg;
}

/** Page de la tournée (Défis → 🎅 Noël). */
function renderTour(ev, page) {
    const ed = eventData(ev);
    if (ed.won && !state.data.cards[ev.card.id]) setTimeout(() => openCardBoxes([{ fixed: [ev.card] }], `${ev.icon} Carte ${ev.name} !`), 300);
    const found = Math.min(tourFound(ev), ev.goal);
    const stage = tourStage(ev);
    const card = el('article', 'card event-card tour-card');
    const top = el('div', 'tour-top');
    const h = el('h2');
    h.textContent = '🛷 Tournée du Père Noël';
    const when = el('span', 'tour-when');
    when.textContent = `jusqu’au ${shortDate(ev.end)}`;
    top.append(h, when);
    const mapBox = el('div', 'tour-map-box');
    if (window.WORLD_MAP) mapBox.append(tourMap(stage));
    else encLoad('carte-monde.js').then(() => { if (challengesTab === 'event' && !$('challengesScreen').hidden) renderEvent(); }).catch(() => {});
    const leg = el('div', 'tour-leg');
    const legT = el('span');
    if (stage >= NOEL_TOUR.length) legT.textContent = '🏠 Tournée terminée !';
    else {
        const s = NOEL_TOUR[stage];
        legT.append(flagImgOf(s[1]));
        legT.append(document.createTextNode(` Étape ${stage + 1} / ${NOEL_TOUR.length} · ${s[2]}`));
    }
    const gifts = el('span', 'tour-gifts');
    const inStop = stage >= NOEL_TOUR.length ? TOUR_PER_STOP : found - stage * TOUR_PER_STOP;
    for (let i = 0; i < TOUR_PER_STOP; i++) { const g = el('i', i < inStop ? 'is-on' : ''); if (i < inStop) g.append(emojiImg('🎁')); gifts.append(g); }
    leg.append(legT, gifts);
    const p = el('p', 'tour-blurb');
    p.textContent = `${found} / ${ev.goal} cadeaux livrés. Chaque question trouvée = un cadeau ; tous les ${TOUR_PER_STOP} cadeaux, le traîneau change de pays. Sans gouttes 💧 ni cœurs.`;
    const actions = el('div', 'card-actions');
    const btn = el('button', 'btn btn-red');
    btn.type = 'button';
    btn.textContent = ed.won ? '🛷 Rejouer pour le plaisir' : '🛷 Livrer des cadeaux';
    btn.addEventListener('click', openEventStart);
    actions.append(btn);
    // Étapes : toutes, avec les emojis d'avatar gagnés en route (15, 30, 45, 55 questions = étapes 3, 6, 9, 11)
    const list = el('div', 'tour-stops');
    NOEL_TOUR.forEach((s, i) => {
        const st = i < stage ? 'is-done' : i === stage ? 'is-cur' : 'is-lock';
        const r = el('div', `tour-stop ${st}`);
        const n = el('span', 'tour-n');
        n.textContent = String(i + 1);
        const tx = el('span', 'tour-name');
        const b = el('b');
        b.textContent = s[2];
        const sm = el('small');
        sm.textContent = s[3];
        tx.append(b, sm);
        const right = el('span', 'tour-r');
        right.textContent = i < stage ? '5 / 5 ✓' : i === stage ? `${inStop} / 5` : '🔒';
        const reward = (ev.rewards || []).find(x => x.at === (i + 1) * TOUR_PER_STOP);
        if (reward) right.append(emojiImg(reward.emoji));
        r.append(n, flagImgOf(s[1]), tx, right);
        list.append(r);
    });
    const reward = el('div', 'event-reward');
    const rtext = el('p');
    rtext.textContent = ed.won ? `✅ Carte gagnée ! Elle est dans ta collection, et le badge dans ton profil.`
        : `🎄 Au bout de la tournée (${ev.goal} cadeaux) : la carte « ${ev.card.name} »${evBadgeText(ev)} et l’emoji 🌟.`;
    reward.append(cardFace(ev.card, false, false), rtext);
    const left = pumpkinsLeft(ev);
    const hidden = el('p', 'event-pumpkins');
    hidden.textContent = left ? `🎁 Cadeaux cachés du jour : ${PUMPKINS_PER_DAY - left}/${PUMPKINS_PER_DAY} · dans les onglets du jeu (+${PUMPKIN_COINS} 🪙 chacun)`
        : `🎁 Cadeaux cachés du jour : ${PUMPKINS_PER_DAY}/${PUMPKINS_PER_DAY} · reviens demain !`;
    card.append(top, mapBox, leg, p, actions, list, reward, hidden);
    page.append(card);
    const friends = renderEventFriends(ev, found);
    if (friends) page.append(friends);
}

/* ---------- Bac à sable : choisir un faux jour de décembre ---------- */
function openNoelBacMenu() {
    const grid = $('adventGrid');
    grid.replaceChildren();
    $('adventTitle').textContent = '🧪 Noël : quel jour ?';
    $('adventSub').textContent = 'Le jeu fait comme si on était ce jour-là (seulement pour Noël). Il se recharge.';
    const days = [['1er déc.', '2026-12-01'], ['5 déc.', '2026-12-05'], ['6 déc. (carte)', '2026-12-06'], ['11 déc. (⚡)', '2026-12-11'],
        ['21 déc. (tournée)', '2026-12-21'], ['23 déc.', '2026-12-23'], ['24 déc. (cadre)', '2026-12-24'], ['27 déc.', '2026-12-27'], ['Vrai jour', null]];
    const set = v => {
        try { if (v) localStorage.setItem('kultivo_bac_noelday', v); else localStorage.removeItem('kultivo_bac_noelday'); } catch (e) { /* stockage bloqué */ }
        location.reload();
    };
    days.forEach(([label, v]) => {
        const b = el('button', `btn ${v === noelSimDay() ? 'btn-green' : 'btn-ghost'} advent-bac-btn`);
        b.type = 'button';
        b.textContent = label;
        b.addEventListener('click', () => set(v));
        grid.append(b);
    });
    const tools = [['Calendrier à zéro', () => { delete state.data.advent; }], ['Tournée à zéro', () => { const e = EVENTS.find(x => x.id === 'noel-2026'); delete state.data.events[e.id]; state.data.avatarExtra = state.data.avatarExtra.filter(x => !e.rewards.some(r => r.emoji === x)); }],
        ['+3 ⚡ Pièces ×2', () => { state.data.inv.boost = (state.data.inv.boost || 0) + 3; }], ['+20 cadeaux tournée', () => {
            const e = EVENTS.find(x => x.id === 'noel-2026'); const ed = eventData(e);
            eventQuestions(e).filter(q => !ed.found[q.id]).slice(0, 20).forEach(q => { ed.found[q.id] = 1; });
        }]];
    tools.forEach(([label, fn]) => {
        const b = el('button', 'btn btn-violet advent-bac-btn');
        b.type = 'button';
        b.textContent = label;
        b.addEventListener('click', () => {
            fn();
            saveData();
            renderHeader();
            updateNavNotifications();
            if (!$('challengesScreen').hidden) renderChallenges();
            if (challengesTab === 'event' && !$('challengesScreen').hidden) renderEvent();
            adventTip(`🧪 ${label} : fait.`);
        });
        grid.append(b);
    });
    adventTip(noelSimDay() ? `Jour simulé : ${shortDate(noelSimDay())}.` : 'Aucun jour simulé : le vrai jour.');
    $('adventModal').hidden = false;
}

/* ---------- Branchements (après le chargement de la page) ---------- */
document.addEventListener('DOMContentLoaded', () => {
    const row = $('adventRow');
    if (row) row.addEventListener('click', () => openAdventModal());
    $('closeAdventBtn').addEventListener('click', () => { $('adventModal').hidden = true; });
    $('adventModal').addEventListener('click', e => { if (e.target === $('adventModal')) $('adventModal').hidden = true; });
    setTimeout(() => { noelSnow(); renderBoostChip(); }, 500);
});
