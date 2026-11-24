/* Fonctions communes aux deux écrans : utilitaires, animations (SVG), tableaux */
const L = 'ABCDE';
/* Chargement d'un cours : cours/<id>/content.js et ses images cours/<id>/img/ */
const DEFAULT_COURSE = 'ue2-ch5';
let COURSE_ID = null, IMGBASE = 'img/';
function loadCourse(id) {
  return new Promise((ok, ko) => {
    if (!/^[a-z0-9][a-z0-9-]{0,40}$/.test(id || '')) return ko(new Error('nom de cours invalide'));
    window.COURSE = null;
    const s = document.createElement('script');
    s.src = `cours/${id}/content.js?v=${Date.now()}`;
    s.onload = () => { if (!window.COURSE) return ko(new Error('le fichier content.js du cours est vide')); COURSE_ID = id; IMGBASE = `cours/${id}/img/`; ok(window.COURSE); };
    s.onerror = () => ko(new Error(`cours introuvable : cours/${id}/content.js`));
    document.head.appendChild(s);
  });
}
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
const inZone = (st, p) => { const [x1, y1, x2, y2] = st.zone; return p.x >= x1 && p.x <= x2 && p.y >= y1 && p.y <= y2; };

/* Couleurs des schémas (fond blanc dans les deux thèmes) */
const K = { dna: '#2f5e88', ink: '#2b3742', mute: '#6b7280', sage: '#a6ab99', ok: '#4f7a5a', ko: '#b5523b', honey: '#c2a05a', plum: '#3d2248' };
const T = (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-size="${o.fs || 15}" font-weight="${o.fw || 500}" fill="${o.fill || K.ink}" text-anchor="${o.a || 'middle'}" font-family="Poppins,sans-serif">${s}</text>`;
const svgWrap = (vb, inner) => `<svg class="anim-svg" viewBox="${vb}" role="img" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="100%" height="100%" fill="#fff"/>${inner}</svg>`;
/* g(k, i, html) : élément visible à partir de l'étape i ; il « arrive » quand i === k */
const g = (k, i, html, cls = '') => (k < i ? '' : `<g class="${i === k ? 'in ' : ''}${cls}">${html}</g>`);

/* ---------- 1. Assemblage du PIC ---------- */
function drawPIC(k) {
  const done = k >= 8, dx = done ? 230 : 0;
  const dnaY = 270;
  let dna;
  if (k >= 6) { // bulle transcriptionnelle
    const b0 = 395 + dx, b1 = 485 + dx;
    dna = `<path d="M20 ${dnaY} H${b0} C${b0 + 20} ${dnaY - 22},${b1 - 20} ${dnaY - 22},${b1} ${dnaY} H880" stroke="${K.dna}" stroke-width="4" fill="none"/>
           <path d="M20 ${dnaY + 10} H${b0} C${b0 + 20} ${dnaY + 32},${b1 - 20} ${dnaY + 32},${b1} ${dnaY + 10} H880" stroke="${K.dna}" stroke-width="4" fill="none"/>`;
  } else dna = `<path d="M20 ${dnaY} H880 M20 ${dnaY + 10} H880" stroke="${K.dna}" stroke-width="4"/>`;
  const box = (x1, x2, fill, lab) => `<rect x="${x1}" y="${dnaY - 9}" width="${x2 - x1}" height="28" rx="5" fill="${fill}" stroke="${K.ink}" stroke-width="1"/>${T((x1 + x2) / 2, dnaY + 10, lab, { fs: 12, fw: 600 })}`;
  const seq = box(130, 182, '#e5d2c4', 'BREu') + box(186, 252, '#f3e27a', 'TATA') + box(256, 300, '#e5d2c4', 'BREd') + box(420, 470, '#cfe0ee', 'Inr') + box(560, 610, '#e7d9ef', 'DPE')
    + T(219, dnaY + 44, '−30', { fs: 12, fill: K.mute }) + `<path d="M445 ${dnaY - 9} V${dnaY - 38} H478" stroke="${K.ink}" stroke-width="3" fill="none"/><path d="M478 ${dnaY - 44} l12 6 l-12 6z" fill="${K.ink}"/>` + T(452, dnaY - 46, 'TSS +1', { fs: 12, fw: 600 });
  const fade = done ? ' style="opacity:.22"' : '';
  const el = (cx, cy, rx, ry, fill, lab, tc = '#fff', fs = 15) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="#fff" stroke-width="2"/>${T(cx, cy + 5, lab, { fs, fw: 700, fill: tc })}`;
  const ctd = (x0, y0, p) => [0, 1, 2, 3, 4].map((i) => `<circle cx="${x0 + i * 15}" cy="${y0 + i * 11}" r="8" fill="#b9b3d9" stroke="#3e3d8f"/>`).join('') + T(x0 + 95, y0 + 52, 'CTD', { fs: 12, fw: 600, fill: '#3e3d8f' })
    + (p ? `<circle cx="${x0 - 12}" cy="${y0 - 6}" r="13" fill="${K.ko}"/>${T(x0 - 12, y0 - 1, 'P', { fs: 13, fw: 700, fill: '#fff' })}${T(x0 - 30, y0 + 2, 'Ser5', { fs: 12, fw: 700, fill: K.ko, a: 'end' })}` : '');
  let s = dna + seq;
  s += g(k, 1, el(225, 190, 95, 58, '#7fa37a', 'TFIID') + `<rect x="190" y="${dnaY - 26}" width="70" height="17" rx="8" fill="#3f6a47"/>` + T(225, dnaY - 13, 'TBP', { fs: 11, fw: 700, fill: '#fff' }), done ? 'faded' : '');
  s += g(k, 2, el(150, 236, 36, 22, '#f0e27a', 'TFIIA', K.ink, 12), done ? 'faded' : '');
  s += g(k, 3, el(318, 240, 40, 21, '#dba8a8', 'TFIIB', K.ink, 12), done ? 'faded' : '');
  s += g(k, 4, el(470 + dx, 212, 92, 54, '#3e3d8f', 'ARN pol II') + ctd(520 + dx, 300, k >= 7), '');
  s += g(k, 4, el(575, 160, 44, 24, '#e8a35a', 'TFIIF', K.ink, 13), done ? 'faded' : '');
  s += g(k, 5, el(588, 236, 40, 22, '#9aa0b5', 'TFIIE', K.ink, 12), done ? 'faded' : '');
  s += g(k, 6, el(420, 112, 112, 52, '#8a8f6a', 'TFIIH') + T(420, 135, 'core + kinase', { fs: 11, fill: '#fff' }), done ? 'faded' : '');
  if (k === 7) s += `<g class="in">${[0, 1, 2].map((i) => `<path d="M${455 + i * 6} ${dnaY - 70 - i * 18} h${28 - i * 6}" stroke="${K.ko}" stroke-width="4" stroke-linecap="round"/>`).join('')}${T(530, dnaY - 92, 'ARN avortés (2–7 nt)', { fs: 12, fw: 600, fill: K.ko, a: 'start' })}</g>`;
  if (done) s += `<g class="in"><path d="M${560 + dx} 190 C 760 150, 800 90, 870 60" stroke="${K.ko}" stroke-width="4" fill="none"/>${T(860, 50, 'ARN naissant (> 8 nt)', { fs: 13, fw: 600, fill: K.ko, a: 'end' })}${T(240, 70, 'Facteurs généraux libérés', { fs: 14, fw: 600, fill: K.mute })}</g>`;
  return svgWrap('0 0 900 370', s.replace(/class="faded"/g, fade ? 'style="opacity:.22"' : ''));
}
const PIC_CAP = [
  "Le promoteur minimum (± 50 pb autour du TSS) : BRE, boîte TATA (−30), Inr (contient le TSS), DPE. L'ARN pol II seule ne peut pas s'y fixer.",
  "TFIID arrive en premier : sa sous-unité TBP se fixe sur la boîte TATA (TFIID = TBP + 13 TAF).",
  "TFIIA stabilise la liaison de TBP sur la boîte TATA.",
  "TFIIB se fixe (sur les BRE) : il interagit avec TBP, l'ADN et l'ARN pol II, bloque l'ADN courbé et fixe la distance au TSS (≈ 35 nt).",
  "TFIIF arrive avec l'ARN pol II (12 sous-unités) : la polymérase est positionnée sur le TSS.",
  "TFIIE stabilise le complexe.",
  "TFIIH arrive en dernier (core + kinase) : avec de l'ATP, le PIC passe de la conformation fermée à ouverte. La bulle de transcription s'ouvre.",
  "TFIIH phosphoryle la sérine 5 du CTD. La polymérisation démarre sans amorce, par essais-échecs : ARN avortés de 2 à 7 nt.",
  "Au-delà de 8 nt, l'ARN naissant sort, heurte les facteurs généraux : le PIC se désorganise et laisse place au complexe d'élongation.",
];

/* ---------- 2. Compaction : de l'ADN au chromosome ---------- */
function drawCompaction(k) {
  const H = 90, y = (i) => 18 + i * H;
  const helix = (y0) => { let a = '', b = ''; for (let x = 40; x <= 440; x += 4) { const t = (x - 40) / 20; a += `${x === 40 ? 'M' : 'L'}${x} ${y0 + 10 * Math.sin(t)} `; b += `${x === 40 ? 'M' : 'L'}${x} ${y0 - 10 * Math.sin(t)} `; } return `<path d="${a}" stroke="${K.dna}" stroke-width="3" fill="none"/><path d="${b}" stroke="#c0504d" stroke-width="3" fill="none"/>`; };
  const beads = (y0) => { let p = `<path d="M40 ${y0} ${Array.from({ length: 8 }, (_, i) => `Q ${62 + i * 50} ${y0 + (i % 2 ? 14 : -14)} ${85 + i * 50} ${y0}`).join(' ')}" stroke="${K.dna}" stroke-width="2.5" fill="none"/>`; for (let i = 0; i < 7; i++) p += `<circle cx="${85 + i * 50}" cy="${y0}" r="15" fill="#e4c69a" stroke="#b08a52"/>`; return p; };
  const fibre = (y0) => { let p = `<rect x="40" y="${y0 - 26}" width="400" height="52" rx="26" fill="#f2e6d3"/>`; for (let i = 0; i < 13; i++) for (let j = 0; j < 2; j++) p += `<circle cx="${62 + i * 28 + j * 14}" cy="${y0 - 11 + j * 22}" r="12" fill="#e4c69a" stroke="#b08a52"/>`; return p; };
  const loops = (y0) => { let p = `<path d="M40 ${y0 + 18} H440" stroke="#b08a52" stroke-width="7" stroke-linecap="round"/>`; [85, 175, 305, 395].forEach((x) => { p += `<path d="M${x - 20} ${y0 + 18} C ${x - 55} ${y0 - 36}, ${x + 55} ${y0 - 36}, ${x + 20} ${y0 + 18}" stroke="#b08a52" stroke-width="7" fill="none"/><ellipse cx="${x}" cy="${y0 + 14}" rx="12" ry="7" fill="none" stroke="${K.honey}" stroke-width="4"/>`; });
    return p + T(240, y0 + 4, 'cohésine', { fs: 11, fw: 600, fill: K.honey }); };
  const noyau = (y0) => `<ellipse cx="220" cy="${y0}" rx="150" ry="32" fill="#e9ecf4" stroke="#7a86a8" stroke-width="7"/><ellipse cx="220" cy="${y0}" rx="90" ry="16" fill="#d6ead8"/>` + T(220, y0 + 5, 'A', { fs: 14, fw: 700, fill: K.ok }) + T(345, y0 - 4, 'B', { fs: 14, fw: 700, fill: K.ko }) + T(400, y0 + 5, 'lamina', { fs: 11, fill: '#7a86a8', a: 'start' });
  const chrom = (y0) => `<g transform="translate(240 ${y0})"><rect x="-80" y="-12" width="160" height="24" rx="12" fill="#d38b5d" transform="rotate(-16)"/><rect x="-80" y="-12" width="160" height="24" rx="12" fill="#d38b5d" transform="rotate(16)"/><circle r="8" fill="#9c5b33"/></g>`;
  const R = [
    [helix, 'ADN double brin', '⌀ 2 nm', []],
    [beads, 'Nucléosomes (nucléofilament)', '⌀ 11 nm', ['octamère 2 × (H2A, H2B, H3, H4) + 146 pb', '≈ 1 nucléosome / 200 pb · « collier de perles »']],
    [fibre, 'Fibre de chromatine', '⌀ 30 nm', ['histones (+) ↔ ADN (−) · stabilisée par H1', 'modèle solénoïde ou zigzag']],
    [loops, 'Boucles de chromatine', '', ['la fibre forme des boucles', 'boucles stabilisées par la cohésine']],
    [noyau, 'Compartiments et territoires', '', ['A : centre, boucles larges, transcrits', 'B : contre la lamina, non transcrits']],
    [chrom, 'Chromosome métaphasique', '⌀ 700 nm', ['compaction maximale (mitose)']],
  ];
  let s = `<path d="M16 ${y(0)} V${y(5) + 20}" stroke="${K.sage}" stroke-width="4"/><path d="M8 ${y(5) + 16} l8 14 l8 -14z" fill="${K.sage}"/>`;
  R.forEach(([f, name, d, det], i) => { const yy = y(i) + 30; s += g(k, i, `${f(yy)}${T(480, yy - 8, name, { fs: 18, fw: 700, a: 'start' })}${d ? T(990, yy - 8, d, { fs: 18, fw: 700, fill: K.honey, a: 'end' }) : ''}${det.map((l, j) => T(480, yy + 14 + j * 18, l, { fs: 13.5, fill: K.mute, a: 'start' })).join('')}`); });
  return svgWrap('0 0 1000 560', s);
}
const COMP_CAP = [
  "Au départ : la double hélice, 2 nm de diamètre. Pour la ranger dans le noyau, la protéger et contrôler l'accès aux gènes, il faut la compacter.",
  "1er niveau : l'ADN s'enroule autour d'octamères d'histones (1,65 tour = 146 pb). L'enchaînement des nucléosomes forme le nucléofilament.",
  "2e niveau : histones riches en Lys et Arg (charges +) attirent l'ADN (charges −) : le nucléofilament se condense en fibre de 30 nm, stabilisée par H1.",
  "3e niveau : la fibre forme des boucles, stabilisées par la cohésine.",
  "4e niveau : les compartiments A (boucles larges, au centre) sont transcrits ; les B (boucles courtes, contre la lamina) ne le sont pas. Chaque chromosome a son territoire.",
  "En mitose : compaction maximale, le chromosome métaphasique (700 nm).",
];

/* ---------- 3. Épissage alternatif : 4 exons, 3 isoformes ---------- */
function drawEpissage(k) {
  const ex = (x, w, y, fill, lab, fs = 15) => `<rect x="${x}" y="${y}" width="${w}" height="34" rx="6" fill="${fill}" stroke="${K.ink}" stroke-width="1"/>${T(x + w / 2, y + 23, lab, { fs, fw: 700 })}`;
  const COL = ['#e4b48f', '#7ea6cc', '#b9a6d6', '#e4b48f'];
  const E = [[40, 140], [250, 340], [450, 540], [660, 760]]; // exons du pré-ARNm (x début, x fin)
  const ISO = [
    { n: 'A', ex: [1, 2, 3, 4], c: K.ok, note: 'tous les exons gardés' },
    { n: 'B', ex: [1, 3, 4], c: K.ko, note: 'exon 2 exclu' },
    { n: 'C', ex: [1, 2, 4], c: K.plum, note: 'exon 3 exclu' },
  ];
  let s = `<path d="M140 70 H660" stroke="${K.mute}" stroke-width="3"/>`;
  E.forEach(([x1, x2], i) => { s += ex(x1, x2 - x1, 53, COL[i], 'Exon ' + (i + 1)); });
  [[140, 250], [340, 450], [540, 660]].forEach(([a1, a2]) => { s += T((a1 + a2) / 2, 110, 'intron', { fs: 12, fill: K.mute }); });
  // jonctions de l'isoforme en cours (seulement pendant son étape)
  const iso = ISO[k - 1];
  if (iso) {
    let arcs = '';
    for (let j = 0; j < iso.ex.length - 1; j++) {
      const x1 = E[iso.ex[j] - 1][1], x2 = E[iso.ex[j + 1] - 1][0], h = (x2 - x1) > 200 ? 70 : 42;
      arcs += `<path d="M${x1} 52 C ${x1 + 30} ${52 - h}, ${x2 - 30} ${52 - h}, ${x2} 52" stroke="${iso.c}" stroke-width="3.5" fill="none"/>`;
    }
    s += `<g class="in">${arcs}</g>`;
  }
  // les 3 ARNm matures
  ISO.forEach((o, i) => {
    const cx = 150 + i * 300, w = 52, x0 = cx - (o.ex.length * w) / 2;
    s += g(k, i + 1, o.ex.map((e, j) => ex(x0 + j * w, w, 200, COL[e - 1], String(e), 14)).join('')
      + T(cx, 262, `ARNm ${o.ex.join('-')}`, { fs: 14, fw: 600 }) + T(cx, 284, `${o.note} → isoforme ${o.n}`, { fs: 13.5, fill: o.c, fw: 600 }));
  });
  s += g(k, 4, `<rect x="40" y="315" width="820" height="48" rx="10" fill="#f4f1ea"/>${T(450, 345, '1 gène, 1 pré-ARNm → 3 ARNm → 3 isoformes. L\'ADN ne change pas (épissage sur l\'ARN, dans le noyau).', { fs: 14, fw: 600 })}`);
  return svgWrap('0 0 900 420', T(20, 26, 'pré-ARNm (le même dans toutes les cellules)', { fs: 14, fill: K.mute, a: 'start' }) + `<g transform="translate(0 40)">${s}</g>`);
}
const EPI_CAP = [
  "Un pré-ARNm avec 4 exons. Les exons 2 et 3 (bleu, violet) sont des exons « cassettes » : ils peuvent être gardés ou retirés.",
  "Isoforme A : le spliceosome relie 1 → 2 → 3 → 4. Tous les exons sont gardés : ARNm 1-2-3-4.",
  "Isoforme B : l'exon 1 est relié directement à l'exon 3. L'exon 2 part avec les introns : ARNm 1-3-4.",
  "Isoforme C : l'exon 2 est relié directement à l'exon 4. L'exon 3 part avec les introns : ARNm 1-2-4.",
  "Résultat : un gène, un seul pré-ARNm, 3 ARNm, 3 isoformes protéiques. L'ADN, lui, ne change pas.",
];
function drawPromoteurs(k) {
  let s = `<path d="M40 120 H860" stroke="${K.dna}" stroke-width="5"/>`;
  const exs = [70, 160, 250, 340, 430, 520, 610, 700, 790];
  exs.forEach((x) => { s += `<rect x="${x}" y="106" width="34" height="28" rx="4" fill="#e4b48f" stroke="${K.ink}"/>`; });
  const P = [[70, 'P1 muscle', 'Dp427 (protéine complète)', 500], [430, 'P2', 'Dp140', 300], [700, 'P3', 'Dp71 (forme courte)', 150]];
  P.forEach(([x, lab, prot, w], i) => { s += g(k, i, `<path d="M${x + 4} 104 V72 H${x + 34}" stroke="${K.ko}" stroke-width="3" fill="none"/><path d="M${x + 34} 66 l11 6 l-11 6z" fill="${K.ko}"/>${T(x + 6, 60, lab, { fs: 13, fw: 700, fill: K.ko, a: 'start' })}
    <rect x="${x}" y="${170 + i * 44}" width="${830 - x}" height="20" rx="10" fill="#f0d7c6"/>${830 - x < 260 ? T(x - 10, 185 + i * 44, 'ARNm → ' + prot, { fs: 13, fw: 600, a: 'end' }) : T(x + 8, 185 + i * 44, 'ARNm → ' + prot, { fs: 13, fw: 600, a: 'start' })}`); });
  return svgWrap('0 0 900 310', s + T(450, 300, 'Exemple du cours : la dystrophine a 7 promoteurs (muscle, cortex, rétine…) : 3 sont représentés ici.', { fs: 13, fill: K.mute }));
}
const PROMO_CAP = [
  "Promoteur 1 (muscle) : la transcription démarre au tout début du gène → ARNm long → Dp427.",
  "Promoteur 2 : un autre TSS, plus loin dans le gène → ARNm plus court → Dp140.",
  "Promoteur 3 : TSS encore plus loin → Dp71. Chaque tissu utilise son promoteur : même gène, protéines de tailles différentes.",
];

/* ---------- 4. NMD : 4 exons, 3 introns, 3 EJC ---------- */
function drawNMD(k, stopExon) {
  // k : 0 pré-ARNm · 1 ARNm + EJC · 2 traduction normale · 3 stop précoce (exon 2)
  const exW = 150, gap = 60, x0 = 60;
  const xs = [0, 1, 2, 3].map((i) => x0 + i * (exW + gap));
  let s = T(450, 26, 'pré-ARNm : 4 exons, 3 introns', { fs: 14, fill: K.mute });
  s += `<path d="M${x0} 62 H${xs[3] + exW}" stroke="${K.mute}" stroke-width="3"/>`;
  xs.forEach((x, i) => { s += `<rect x="${x}" y="46" width="${exW}" height="32" rx="6" fill="#e4b48f" stroke="${K.ink}"/>${T(x + exW / 2, 67, 'Exon ' + (i + 1), { fs: 14, fw: 700 })}`; if (i < 3) s += T(x + exW + gap / 2, 98, 'intron ' + (i + 1), { fs: 11.5, fill: K.mute }); });
  const mx = 90, mw = 170; // ARNm mature
  const ms = [0, 1, 2, 3].map((i) => mx + i * mw);
  const stopX = stopExon ? ms[stopExon - 1] + mw * 0.5 : null;
  const mature = (y, ejcOn, stop, ribo, note) => {
    let p = `<circle cx="${mx - 18}" cy="${y + 16}" r="13" fill="#7fa37a"/>${T(mx - 18, y + 21, 'm⁷G', { fs: 9, fw: 700, fill: '#fff' })}`;
    ms.forEach((x, i) => { p += `<rect x="${x}" y="${y}" width="${mw}" height="32" fill="#e4b48f" stroke="${K.ink}"/>${T(x + mw / 2, y + 21, String(i + 1), { fs: 14, fw: 700 })}`; });
    p += T(ms[3] + mw + 30, y + 21, 'AAAA', { fs: 13, fw: 700, fill: K.mute });
    [1, 2, 3].forEach((j) => { const x = ms[j] - 14; if (ejcOn(j)) p += `<circle cx="${x}" cy="${y - 14}" r="11" fill="${K.ok}"/>${T(x, y - 10, 'EJC', { fs: 8, fw: 700, fill: '#fff' })}<path d="M${x} ${y - 3} V${y}" stroke="${K.ok}" stroke-width="2"/>`; else p += `<circle cx="${x}" cy="${y - 14}" r="11" fill="none" stroke="${K.sage}" stroke-dasharray="3 3"/>`; });
    if (stop) p += `<path d="M${stop} ${y - 6} V${y + 40}" stroke="${K.ko}" stroke-width="4"/>${T(stop, y + 58, 'STOP', { fs: 13, fw: 700, fill: K.ko })}`;
    if (ribo) p += `<ellipse cx="${ribo}" cy="${y + 16}" rx="26" ry="22" fill="#5f6f8f" opacity=".85"/>${T(ribo, y + 20, 'ribo', { fs: 10, fw: 700, fill: '#fff' })}`;
    if (note) p += T(450, y + 82, note[0], { fs: 14, fw: 700, fill: note[1] });
    return p;
  };
  if (k >= 1 && k < 2) s += `<g class="in">${T(450, 140, 'ARNm mature : les introns sont retirés, un EJC est déposé 27 nt avant chaque jonction', { fs: 13.5, fill: K.mute })}${mature(170, () => true, null, null, null)}</g>`;
  if (k === 2) s += `<g class="in">${T(450, 140, 'Traduction normale : le stop est dans le dernier exon (4)', { fs: 13.5, fill: K.mute })}${mature(170, () => false, ms[3] + mw * 0.6, ms[3] + mw * 0.6 - 30, ['Le ribosome a délogé tous les EJC → protéine produite', K.ok])}</g>`;
  if (k === 3) { const se = stopExon || 2; const sx = ms[se - 1] + mw * 0.5; s += `<g class="in">${T(450, 140, `Codon stop précoce dans l'exon ${se}`, { fs: 13.5, fill: K.mute })}${mature(170, (j) => j >= se, sx, sx - 30, [se < 4 ? 'Il reste des EJC en aval du stop → alarme → NMD : dégradation sans désadénylation' : 'Aucun EJC en aval du stop → pas de NMD', se < 4 ? K.ko : K.ok])}</g>`; }
  return svgWrap('0 0 900 290', s);
}
const NMD_CAP = [
  "Un gène à 4 exons : le pré-ARNm contient donc 3 introns.",
  "Après l'épissage : 3 jonctions exon-exon, donc 3 EJC, déposés 27 nt avant chaque jonction. Ils restent jusqu'à la traduction.",
  "Lors de la 1re traduction, le ribosome déloge les EJC qu'il rencontre. Le vrai stop est dans le dernier exon : tous les EJC sont partis, tout va bien.",
  "Si un stop apparaît trop tôt (exon 2), le ribosome s'arrête avant des EJC : ceux qui restent en aval signalent un stop précoce. La NMD dégrade l'ARNm, sans désadénylation préalable.",
];

/* ---------- 5. Ouvrir la chromatine : acétylation puis remodelage ---------- */
function drawChrom(k) {
  // k : 0 nucléosome fermé · 1 acétylation par une HAT · 2 remodelage (glissement) : promoteur libre
  const slid = k >= 2, cx = slid ? 690 : 450, cy = 165, R = k >= 1 ? 100 : 80, yL = cy + R;
  const deg = (a) => (a * Math.PI) / 180, P = (r, a) => [cx + r * Math.cos(deg(a)), cy + r * Math.sin(deg(a))];
  let s = '';
  // ADN : ligne + tour autour de l'octamère
  s += `<path d="M20 ${yL} H880" stroke="${K.dna}" stroke-width="7" stroke-linecap="round"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${K.dna}" stroke-width="7"/>`;
  // octamère
  s += `<ellipse cx="${cx}" cy="${cy}" rx="62" ry="54" fill="#e4c69a" stroke="#b08a52" stroke-width="2"/>` + T(cx, cy - 4, 'octamère', { fs: 13, fw: 700 }) + T(cx, cy + 14, "d'histones", { fs: 12 });
  // promoteur
  if (!slid) {
    const [x1, y1] = P(R, 220), [x2, y2] = P(R, 320);
    s += `<path d="M${x1} ${y1} A ${R} ${R} 0 0 1 ${x2} ${y2}" stroke="${K.honey}" stroke-width="11" fill="none" stroke-linecap="round"/>` + T(cx, cy - R - 16, 'promoteur', { fs: 14, fw: 700, fill: '#8a6d23' });
  } else {
    s += `<g class="in"><rect x="250" y="${yL - 9}" width="150" height="18" rx="6" fill="${K.honey}"/>${T(325, yL + 34, 'promoteur libre', { fs: 15, fw: 700, fill: '#8a6d23' })}
      <ellipse cx="325" cy="${yL - 52}" rx="78" ry="38" fill="${K.plum}"/>${T(325, yL - 56, 'PIC', { fs: 16, fw: 700, fill: '#fff' })}${T(325, yL - 38, '+ ARN pol II', { fs: 12, fill: '#fff' })}</g>`;
  }
  // charges de l'ADN (−)
  [200, 340, 25, 155].forEach((a) => { const [x, y] = P(R + 17, a); s += T(x, y + 6, '−', { fs: 22, fw: 700, fill: K.dna }); });
  [[cx - 230, yL], [cx - 150, yL], [cx + 150, yL], [cx + 230, yL]].forEach(([x, y]) => { if (x > 30 && x < 870 && !(slid && x > 240 && x < 410)) s += T(x, y - 10, '−', { fs: 22, fw: 700, fill: K.dna }); });
  // queues d'histones et lysines
  [165, 195, 15, -15].forEach((a) => {
    const [x0, y0] = P(58, a), [x1, y1] = P(R + 45, a), [xm, ym] = P((58 + R + 45) / 2, a + 8);
    s += `<path d="M${x0} ${y0} Q ${xm} ${ym} ${x1} ${y1}" stroke="#b08a52" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="${x1}" cy="${y1}" r="14" fill="#e4c69a" stroke="#b08a52" stroke-width="2"/>${T(x1, y1 + 5, 'K', { fs: 13, fw: 700 })}`;
    if (k === 0) s += `<circle cx="${x1 + 13}" cy="${y1 - 13}" r="9" fill="${K.ko}"/>${T(x1 + 13, y1 - 8.5, '+', { fs: 14, fw: 700, fill: '#fff' })}`;
    else s += `<g class="${k === 1 ? 'in' : ''}"><rect x="${x1 + 2}" y="${y1 - 27}" width="30" height="18" rx="5" fill="${K.ok}"/>${T(x1 + 17, y1 - 13.5, 'Ac', { fs: 12, fw: 700, fill: '#fff' })}</g>`;
  });
  const gx = slid ? cx : 450;
  const num = (x, y, n) => `<circle cx="${x}" cy="${y}" r="17" fill="${K.plum}" stroke="#fff" stroke-width="3"/>${T(x, y + 6, String(n), { fs: 17, fw: 700, fill: '#fff' })}`;
  // ① charges : près d'une lysine en haut à gauche
  { const [x, y] = P(R + 45, 165); s += num(x - 34, y - 34, 1); }
  if (k === 0) s += `<g class="in">${T(cx, yL + 40, 'lysines + ↔ ADN − : l\'ADN est retenu', { fs: 15, fw: 700, fill: K.ko })}</g>`;
  if (k >= 1) { const [x, y] = P(R + 45, -15); s += `<g class="${k === 1 ? 'in' : ''}">${num(x + 52, y - 20, 2)}</g>`; }
  if (k === 1) s += `<g class="in"><ellipse cx="150" cy="70" rx="80" ry="34" fill="${K.ok}"/>${T(150, 66, 'HAT', { fs: 17, fw: 700, fill: '#fff' })}${T(150, 85, '(writer)', { fs: 12, fill: '#fff' })}<path d="M215 90 Q 270 110 ${gx - 135} ${cy - 30}" stroke="${K.ok}" stroke-width="3" fill="none" stroke-dasharray="6 5"/>
    ${T(cx, yL + 40, 'acétylation : charges + neutralisées, l\'ADN se relâche', { fs: 15, fw: 700, fill: K.ok })}</g>`;
  if (k === 2) s += `<g class="in"><ellipse cx="${cx + 118}" cy="52" rx="80" ry="34" fill="#7a86a8"/>${T(cx + 118, 48, 'Remodelage', { fs: 15, fw: 700, fill: '#fff' })}${T(cx + 118, 66, '(ATPase)', { fs: 12, fill: '#fff' })}${num(cx + 30, 30, 3)}
    <path d="M${cx - 220} 40 H${cx - 110}" stroke="#7a86a8" stroke-width="5"/><path d="M${cx - 112} 30 l18 10 l-18 10z" fill="#7a86a8"/>${T(cx - 165, 28, 'glissement', { fs: 13, fw: 600, fill: '#7a86a8' })}${T(cx - 165, 66, 'ou éviction', { fs: 13, fw: 600, fill: '#7a86a8' })}</g>`;
  return svgWrap('0 0 900 330', s);
}
const ACET_CAP = [
  "Nucléosome fermé : les lysines (K) des queues d'histones sont chargées +, l'ADN est chargé − : l'ADN est fortement retenu. Le promoteur, enroulé, est inaccessible.",
  "Une HAT (writer) acétyle les lysines : leurs charges + sont neutralisées. L'ADN est moins retenu, la fibre se relâche : le promoteur devient accessible.",
];
const REMO_CAP = [
  ACET_CAP[0],
  "1. Décompaction : une HAT acétyle les lysines, les charges + sont neutralisées, l'ADN est moins retenu.",
  "2. Un complexe de remodelage (ATPase) fait glisser le nucléosome ou l'évince : le promoteur est dépourvu de nucléosome, le PIC peut s'assembler.",
];

/* ---------- 6. Writers, readers, erasers ---------- */
function drawWER(k) {
  const yT = 170, Ks = [[300, 'K4'], [500, 'K9'], [700, 'K27']];
  let s = `<circle cx="110" cy="${yT}" r="66" fill="#e4c69a" stroke="#b08a52" stroke-width="2"/><circle cx="110" cy="${yT}" r="80" fill="none" stroke="${K.dna}" stroke-width="7"/>${T(110, yT + 5, 'nucléosome', { fs: 13, fw: 700 })}`;
  s += `<path d="M176 ${yT} C 210 ${yT - 20}, 240 ${yT + 20}, 270 ${yT} H 820" stroke="#b08a52" stroke-width="7" fill="none" stroke-linecap="round"/>` + T(560, yT + 52, 'queue N-terminale de l\'histone H3', { fs: 13, fill: K.mute });
  Ks.forEach(([x, l]) => { s += `<circle cx="${x}" cy="${yT}" r="22" fill="#e4c69a" stroke="#b08a52" stroke-width="2"/>${T(x, yT + 5, l, { fs: 13, fw: 700 })}`; });
  const mark = (x, lab, fill) => `<path d="M${x} ${yT - 22} V${yT - 40}" stroke="${fill}" stroke-width="3"/><circle cx="${x}" cy="${yT - 56}" r="17" fill="${fill}"/>${T(x, yT - 51, lab, { fs: 13, fw: 700, fill: '#fff' })}`;
  const enz = (x, y, fill, a, b) => `<ellipse cx="${x}" cy="${y}" rx="70" ry="30" fill="${fill}"/>${T(x, y - 3, a, { fs: 15, fw: 700, fill: '#fff' })}${T(x, y + 15, b, { fs: 11.5, fill: '#fff' })}`;
  // marques
  if (k >= 1) s += `<g class="${k === 1 ? 'in' : ''}">${mark(300, 'me', '#5b7fa8')}</g>`;
  if (k >= 1 && k < 3) s += `<g class="${k === 1 ? 'in' : ''}">${mark(700, 'ac', K.ok)}</g>`;
  if (k === 1) s += `<g class="in">${enz(300, 50, K.ok, 'HMT', 'writer : ajoute')}${enz(700, 50, K.ok, 'HAT', 'writer : ajoute')}</g>`;
  if (k >= 2) s += `<g class="${k === 2 ? 'in' : ''}"><path d="M240 ${yT - 70} Q 300 ${yT - 120} 360 ${yT - 70}" stroke="#2f5e88" stroke-width="14" fill="none" stroke-linecap="round"/>${T(300, yT - 128, 'READER : lit la marque', { fs: 14, fw: 700, fill: '#2f5e88' })}</g>`;
  if (k >= 3) s += `<g class="in">${enz(640, 50, K.ko, 'HDAC', 'eraser : retire')}<g opacity=".55"><circle cx="790" cy="60" r="17" fill="none" stroke="${K.ok}" stroke-width="3" stroke-dasharray="4 3"/>${T(790, 65, 'ac', { fs: 13, fw: 700, fill: K.ok })}</g><path d="M712 ${yT - 60} Q 760 ${yT - 110} 772 80" stroke="${K.ko}" stroke-width="2.5" fill="none" stroke-dasharray="5 4"/></g>`;
  // légende cumulée
  const chip = (x, w, fill, a, b) => `<rect x="${x}" y="268" width="${w}" height="54" rx="12" fill="${fill}"/>${T(x + w / 2, 291, a, { fs: 15, fw: 700, fill: '#fff' })}${T(x + w / 2, 310, b, { fs: 12, fill: '#fff' })}`;
  s += g(k, 1, chip(30, 270, K.ok, 'WRITER = écrit', 'ajoute : HAT (ac), HMT (me)'));
  s += g(k, 2, chip(315, 270, '#2f5e88', 'READER = lit', 'interprète la marque'));
  s += g(k, 3, chip(600, 270, K.ko, 'ERASER = efface', 'retire : HDAC (ac), déméthylases (me)'));
  return svgWrap('0 0 900 340', s);
}
const WER_CAP = [
  "Une queue d'histone H3 sort du nucléosome. Ses lysines (K4, K9, K27…) peuvent porter des marques.",
  "WRITER : une enzyme écrit (ajoute) une marque. HMT → méthyle (me) ; HAT → acétyle (ac).",
  "READER : une protéine lit la marque et l'interprète. C'est ainsi que le code histone est « lu ».",
  "ERASER : une enzyme efface (retire) la marque. HDAC → retire l'acétyle ; déméthylase → retire le méthyle. Les marques sont réversibles.",
];

/* ---------- Schémas fixes des diapos ---------- */
function figSillons() {
  // coupe longitudinale : 2 squelettes déphasés → grand et petit sillons
  const x0 = 30, x1 = 470, yc = 170, A = 70, per = 220, ph = 0.62 * Math.PI;
  const yA = (x) => yc + A * Math.sin((2 * Math.PI * (x - x0)) / per), yB = (x) => yc + A * Math.sin((2 * Math.PI * (x - x0)) / per + ph);
  let a = '', b = '', rungs = '';
  for (let x = x0; x <= x1; x += 2) { a += `${x === x0 ? 'M' : 'L'}${x} ${yA(x).toFixed(1)} `; b += `${x === x0 ? 'M' : 'L'}${x} ${yB(x).toFixed(1)} `; }
  for (let x = x0 + 6; x <= x1; x += 14) rungs += `<path d="M${x} ${yA(x).toFixed(1)} V${yB(x).toFixed(1)}" stroke="#c9ccc0" stroke-width="3"/>`;
  // sommets (bord supérieur) des deux brins : l'écart alterne petit / grand → petit et grand sillons
  const tops = []; for (let x = x0 + 1; x < x1; x += 1) { [yA, yB].forEach((f) => { if (f(x) < f(x - 1) && f(x) <= f(x + 1)) tops.push(x); }); }
  tops.sort((u, v) => u - v);
  let s = rungs + `<path d="${a}" stroke="${K.dna}" stroke-width="7" fill="none"/><path d="${b}" stroke="#c0504d" stroke-width="7" fill="none"/>`;
  s += T(250, 28, 'Coupe longitudinale', { fs: 16, fw: 700 });
  const yt = yc - A - 22, done = {};
  for (let i = 0; i < tops.length - 1; i++) {
    const w = tops[i + 1] - tops[i], big = w > per / 2, key = big ? 'g' : 'p';
    if (done[key] || tops[i] < 60) continue; done[key] = 1;
    const col = big ? K.ok : K.mute, xm = (tops[i] + tops[i + 1]) / 2;
    s += `<path d="M${tops[i] + 4} ${yt + 8} V${yt} H${tops[i + 1] - 4} V${yt + 8}" stroke="${col}" stroke-width="2.5" fill="none"/>${T(xm, yt - 8, big ? 'grand sillon' : 'petit sillon', { fs: 14, fw: 700, fill: col })}`;
  }
  // coupe transversale : une paire A-T vue d'en haut
  const cx = 720, cy = 175;
  let t = `<circle cx="${cx}" cy="${cy}" r="118" fill="#f4f6f1" stroke="${K.sage}" stroke-width="2" stroke-dasharray="6 5"/>` + T(cx, 28, 'Coupe transversale', { fs: 16, fw: 700 });
  t += `<rect x="${cx - 92}" y="${cy - 16}" width="88" height="32" rx="6" fill="#e9b872" stroke="${K.ink}"/>${T(cx - 48, cy + 6, 'A', { fs: 17, fw: 700 })}<rect x="${cx + 4}" y="${cy - 16}" width="88" height="32" rx="6" fill="#8fc0a0" stroke="${K.ink}"/>${T(cx + 48, cy + 6, 'T', { fs: 17, fw: 700 })}`;
  t += `<path d="M${cx - 4} ${cy - 7} H${cx + 4} M${cx - 4} ${cy + 7} H${cx + 4}" stroke="${K.ink}" stroke-width="2" stroke-dasharray="2 2"/>${T(cx, cy + 34, '2 liaisons H', { fs: 11, fill: K.mute })}`;
  t += `<circle cx="${cx - 106}" cy="${cy + 52}" r="16" fill="${K.dna}"/><circle cx="${cx + 106}" cy="${cy + 52}" r="16" fill="#c0504d"/><path d="M${cx - 92} ${cy + 14} L${cx - 102} ${cy + 38} M${cx + 92} ${cy + 14} L${cx + 102} ${cy + 38}" stroke="${K.ink}" stroke-width="2"/>`;
  t += T(cx - 106, cy + 84, 'squelette', { fs: 11, fill: K.mute }) + T(cx + 106, cy + 84, 'squelette', { fs: 11, fill: K.mute });
  t += `<path d="M${cx} ${cy - 22} V${cy - 92}" stroke="${K.ok}" stroke-width="2" stroke-dasharray="4 3"/>${T(cx, cy - 116, 'grand sillon', { fs: 14, fw: 700, fill: K.ok })}${T(cx, cy - 99, 'bases accessibles', { fs: 12.5, fw: 600, fill: K.ok })}`;
  t += `<path d="M${cx} ${cy + 44} V${cy + 92}" stroke="${K.mute}" stroke-width="2" stroke-dasharray="4 3"/>${T(cx, cy + 108, 'petit sillon', { fs: 13.5, fw: 700, fill: K.mute })}`;
  t += `<ellipse cx="${cx + 132}" cy="${cy - 122}" rx="40" ry="22" fill="${K.honey}"/>${T(cx + 132, cy - 117, 'FT', { fs: 14, fw: 700, fill: '#fff' })}<path d="M${cx + 112} ${cy - 104} Q ${cx + 100} ${cy - 60} ${cx + 22} ${cy - 36}" stroke="${K.honey}" stroke-width="2.5" fill="none"/><path d="M${cx + 14} ${cy - 33} l12 -9 l1 11z" fill="${K.honey}"/>`;
  return svgWrap('0 0 900 330', s + `<path d="M520 40 V310" stroke="${K.sage}" stroke-width="1.5"/>` + t);
}
function figDimeres() {
  const C1 = '#c2a05a', C2 = '#7ea6cc';
  const dna = (x1, x2) => { let r = ''; for (let x = x1 + 6; x < x2; x += 12) r += `<path d="M${x} 284 V300" stroke="#c9ccc0" stroke-width="3"/>`; return r + `<path d="M${x1} 282 H${x2} M${x1} 302 H${x2}" stroke="${K.dna}" stroke-width="6" stroke-linecap="round"/>`; };
  const helix = (x1, y1, x2, y2, c, w = 26) => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>` + (() => { let r = ''; const n = 6; for (let i = 1; i < n; i++) { const t = i / n, x = x1 + (x2 - x1) * t, y = y1 + (y2 - y1) * t; r += `<circle cx="${x}" cy="${y}" r="3" fill="#fff" opacity=".55"/>`; } return r; })();
  let s = '';
  // --- Leucine zipper
  s += T(225, 30, 'Leucine zipper', { fs: 18, fw: 700 }) + dna(20, 430);
  s += helix(205, 70, 205, 190, C1) + helix(245, 70, 245, 190, C2);
  [80, 120, 160].forEach((y) => { s += `<circle cx="222" cy="${y}" r="9" fill="${K.ok}"/>${T(222, y + 4, 'L', { fs: 10, fw: 700, fill: '#fff' })}`; });
  [100, 140, 180].forEach((y) => { s += `<circle cx="228" cy="${y}" r="9" fill="${K.ok}"/>${T(228, y + 4, 'L', { fs: 10, fw: 700, fill: '#fff' })}`; });
  s += `<path d="M205 190 Q 195 235 150 278" stroke="${C1}" stroke-width="20" fill="none" stroke-linecap="round"/><path d="M245 190 Q 255 235 300 278" stroke="${C2}" stroke-width="20" fill="none" stroke-linecap="round"/>`;
  s += T(150, 270, '+', { fs: 16, fw: 700, fill: '#fff' }) + T(300, 270, '+', { fs: 16, fw: 700, fill: '#fff' });
  s += T(272, 92, 'hélices α', { fs: 14, fw: 700, a: 'start' }) + T(272, 112, '1 leucine (L) tous les 7 résidus', { fs: 12.5, fill: K.mute, a: 'start' }) + T(272, 130, '→ les leucines s\'emboîtent : dimère', { fs: 12.5, fill: K.ok, fw: 600, a: 'start' });
  s += T(30, 205, 'région basique', { fs: 14, fw: 700, a: 'start' }) + T(30, 224, '(N-term) : lit l\'ADN', { fs: 12.5, fill: K.mute, a: 'start' }) + T(30, 242, 'dans le grand sillon', { fs: 12.5, fill: K.mute, a: 'start' });
  // --- bHLH
  const o = 450;
  s += `<path d="M${o + 20} 40 V300" stroke="${K.sage}" stroke-width="1.5"/>`;
  s += T(o + 225, 30, 'bHLH (hélice-boucle-hélice basique)', { fs: 18, fw: 700 }) + dna(o + 40, o + 430);
  // monomère 1 (gauche)
  s += helix(o + 150, 275, o + 180, 165, C1) + `<path d="M${o + 180} 165 C ${o + 140} 140, ${o + 150} 95, ${o + 190} 92" stroke="${C1}" stroke-width="7" fill="none" stroke-linecap="round"/>` + helix(o + 192, 92, o + 214, 190, C1);
  // monomère 2 (droite)
  s += helix(o + 300, 275, o + 270, 165, C2) + `<path d="M${o + 270} 165 C ${o + 310} 140, ${o + 300} 95, ${o + 260} 92" stroke="${C2}" stroke-width="7" fill="none" stroke-linecap="round"/>` + helix(o + 258, 92, o + 236, 190, C2);
  s += T(o + 225, 66, 'hélices de dimérisation', { fs: 14, fw: 700 }) + `<path d="M${o + 225} 72 V150" stroke="${K.ink}" stroke-width="1.5" stroke-dasharray="3 3"/>`;
  s += T(o + 95, 118, 'boucle', { fs: 14, fw: 700 }) + `<path d="M${o + 120} 122 L${o + 150} 130" stroke="${K.ink}" stroke-width="1.5"/>`;
  s += T(o + 40, 205, 'hélice basique', { fs: 14, fw: 700, a: 'start' }) + T(o + 40, 224, 'lit l\'ADN', { fs: 12.5, fill: K.mute, a: 'start' });
  s += T(o + 325, 215, '2 FT : homo- ou', { fs: 12.5, fill: K.mute, a: 'start' }) + T(o + 325, 233, 'hétérodimère', { fs: 12.5, fill: K.mute, a: 'start' });
  return svgWrap('0 0 900 320', s);
}
function figMerci() {
  const css = `<style>
    .mpol{transform:translateX(540px);animation:mpolmove 6s linear both}
    @keyframes mpolmove{from{transform:translateX(0)}to{transform:translateX(540px)}}
    .mbob{animation:mbob .9s ease-in-out infinite alternate}
    @keyframes mbob{from{transform:translateY(-4px)}to{transform:translateY(4px)}}
    .mrna{stroke-dasharray:100;stroke-dashoffset:0;animation:mrna 6s linear both}
    @keyframes mrna{from{stroke-dashoffset:100}to{stroke-dashoffset:0}}
    .mlet{opacity:1;animation:mlet .6s cubic-bezier(.2,.8,.2,1.4) both}
    @keyframes mlet{from{opacity:0;transform:translateY(30px) scale(.4)}to{opacity:1;transform:none}}
    .mlet,.mconf{transform-box:fill-box;transform-origin:center}
    .mconf{opacity:1;animation:mconf .8s ease-out 6s both}
    @keyframes mconf{from{opacity:0;transform:scale(0)}to{opacity:1;transform:none}}
    @media (prefers-reduced-motion:reduce){.mpol,.mbob,.mrna,.mlet,.mconf{animation:none}}
  </style>`;
  let s = css;
  // ADN double brin
  let a = '', b = '';
  for (let x = 0; x <= 900; x += 4) { a += `${x ? 'L' : 'M'}${x} ${(272 + 8 * Math.sin(x / 18)).toFixed(1)} `; b += `${x ? 'L' : 'M'}${x} ${(272 - 8 * Math.sin(x / 18)).toFixed(1)} `; }
  s += `<path d="${a}" stroke="${K.dna}" stroke-width="5" fill="none"/><path d="${b}" stroke="#c0504d" stroke-width="5" fill="none"/>`;
  // ARN qui sort de la polymérase
  let r = ''; for (let x = 100; x <= 640; x += 4) r += `${x === 100 ? 'M' : 'L'}${x} ${(170 + 10 * Math.sin(x / 22)).toFixed(1)} `;
  s += `<path class="mrna" pathLength="100" d="${r}" stroke="${K.honey}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  const letters = ['M', 'e', 'r', 'c', 'i', '!'], lx = [150, 235, 315, 395, 470, 560];
  letters.forEach((c, i) => { s += `<text class="mlet" style="animation-delay:${(((lx[i] - 100) / 540) * 6).toFixed(2)}s" x="${lx[i]}" y="128" font-size="64" font-weight="700" fill="${K.plum}" text-anchor="middle" font-family="Poppins,sans-serif">${c}</text>`; });
  // confettis
  [[80, 60, K.honey], [200, 40, K.ok], [420, 30, K.sage], [610, 50, K.ko], [760, 40, K.honey], [860, 90, K.ok], [700, 120, K.plum], [40, 140, K.ko]].forEach(([x, y, c], i) => { s += `<circle class="mconf" style="animation-delay:${6 + i * 0.08}s" cx="${x}" cy="${y}" r="${7 + (i % 3) * 3}" fill="${c}"/>`; });
  // la polymérase souriante
  s += `<g class="mpol"><g class="mbob">
    <ellipse cx="100" cy="246" rx="78" ry="62" fill="#5b4a8a"/>
    <ellipse cx="100" cy="300" rx="70" ry="14" fill="#4a3b74"/>
    <circle cx="74" cy="226" r="14" fill="#fff"/><circle cx="126" cy="226" r="14" fill="#fff"/>
    <circle cx="78" cy="229" r="7" fill="${K.ink}"/><circle cx="130" cy="229" r="7" fill="${K.ink}"/>
    <circle cx="81" cy="226" r="2.5" fill="#fff"/><circle cx="133" cy="226" r="2.5" fill="#fff"/>
    <circle cx="58" cy="256" r="9" fill="#e7a3b4" opacity=".8"/><circle cx="142" cy="256" r="9" fill="#e7a3b4" opacity=".8"/>
    <path d="M78 256 Q100 280 122 256" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>
    <text x="100" y="206" font-size="12" font-weight="700" fill="#fff" text-anchor="middle" font-family="Poppins,sans-serif">ARN pol II</text>
  </g></g>`;
  return svgWrap('0 0 900 330', s);
}
const FIGS = { sillons: figSillons, dimeres: figDimeres, merci: figMerci };

const ANIMS = {
  pic: { draw: drawPIC, caps: PIC_CAP },
  compaction: { draw: drawCompaction, caps: COMP_CAP },
  epissage: { draw: drawEpissage, caps: EPI_CAP },
  promoteurs: { draw: drawPromoteurs, caps: PROMO_CAP },
  nmd: { draw: (k) => drawNMD(k, 2), caps: NMD_CAP },
  acetyl: { draw: drawChrom, caps: ACET_CAP },
  remodelage: { draw: drawChrom, caps: REMO_CAP },
  wer: { draw: drawWER, caps: WER_CAP },
};
/* Schémas fixes des mini-cas NMD */
const STATIC_SVG = { nmd_exon2: () => drawNMD(3, 2).replace(/class="in"/g, ''), nmd_exon4: () => drawNMD(3, 4).replace(/class="in"/g, '') };
/* Les mini-cas ne doivent pas montrer la réponse : on affiche l'ARNm sans le verdict */
const CASE_SVG = {
  nmd_exon2: () => drawNMD(3, 2).replace(/<text[^>]*>Il reste des EJC[^<]*<\/text>/, '').replace(/class="in"/g, ''),
  nmd_exon4: () => drawNMD(3, 4).replace(/<text[^>]*>Aucun EJC[^<]*<\/text>/, '').replace(/class="in"/g, ''),
};

/* ---------- Tableaux : qui active, qui réprime ? ---------- */
const PILL = { A: '<span class="pill act">Active</span>', R: '<span class="pill rep">Réprime</span>', N: '<span class="pill neu">Ni l\'un ni l\'autre</span>', AR: '<span class="pill act">Active</span> <span class="pill rep">ou réprime</span>' };
const TABLES = {
  adn_histones: {
    head: ['Ce qu\'on observe', 'Qui le fait', 'Effet', 'Pourquoi'],
    rows: [
      ['<b>Îlot CpG du promoteur déméthylé</b>', '–', 'A', 'L\'initiation est possible'],
      ['<b>Îlot CpG méthylé</b> (5-méthylcytosine)', 'DNMT (donneur : SAM)', 'R', 'Verrou de l\'initiation (certains FT y sont insensibles)'],
      ['<b>Acétylation</b> des histones (K)', 'HAT (writer)', 'A', 'Neutralise les charges + des lysines : la fibre se relâche ; l\'acétylation active toujours'],
      ['<b>Désacétylation</b>', 'HDAC (eraser)', 'R', 'Les charges + reviennent : la fibre se recompacte'],
      ['<b>Mono-méthylation</b> des histones (me1)', 'HMT ; retirée par les déméthylases', 'A', 'À retenir : la mono-méthylation active toujours'],
      ['<b>Phosphorylation, ubiquitination</b>', '–', 'N', 'Stabilité et dégradation des histones (protéasome)'],
    ],
  },
  chromatine: {
    head: ['Ce qu\'on observe', 'Qui le fait', 'Effet', 'Pourquoi'],
    rows: [
      ['<b>Promoteur dépourvu de nucléosomes</b>', 'Remodelage (ATPase) : glissement ou éviction', 'A', 'Le PIC peut s\'assembler'],
      ['<b>Euchromatine</b> (peu condensée)', '–', 'A', 'Régions transcrites'],
      ['<b>Hétérochromatine constitutive</b>', '–', 'R', 'Toujours compacte : télomères, centromères, régions sans gènes'],
      ['<b>Hétérochromatine facultative</b>', '–', 'R', 'Réversible : X inactivé, gènes propres à un autre type cellulaire'],
      ['<b>Compartiment A</b> (centre du noyau)', '–', 'A', 'Boucles larges, chromatine peu condensée'],
      ['<b>Compartiment B</b> (contre la lamina)', '–', 'R', 'Boucles courtes, chromatine condensée'],
      ['<b>Activateur sur un enhancer</b>', 'Facteur trans', 'A', 'Recrute les corégulateurs, qui facilitent le PIC'],
      ['<b>Répresseur sur un silencer</b>', 'Facteur trans', 'R', 'Empêche l\'activation'],
    ],
  },
};
/* Tableau de la fac (méthylation et acétylation des histones) */
const METH = {
  cols: ['H3K4', 'H3K9', 'H3K14', 'H3K27', 'H3K79', 'H3K122', 'H4K20', 'H2BK5'],
  rows: [
    ['me1', ['A', 'A', '', 'A', 'A', '', 'A', 'A']],
    ['me2', ['', 'R', '', 'R', 'A', '', '', '']],
    ['me3', ['A', 'R', '', 'R', 'AR', '', '', 'R']],
    ['ac', ['', 'A', 'A', 'A', '', 'A', '', '']],
  ],
};
function renderTable(id) {
  if (id === 'meth') {
    const keep = (n) => n === 'me1' || n === 'ac';
    const c = (v, n) => !v ? '<td class="c"></td>' : `<td class="c ${keep(n) ? (v === 'A' ? 'act' : v === 'R' ? 'rep' : 'mix') : 'off'}">${v === 'A' ? 'activation' : v === 'R' ? 'répression' : 'les deux'}</td>`;
    const nm = { me1: 'mono-méthylation', me2: 'di-méthylation', me3: 'tri-méthylation', ac: 'acétylation' };
    return `<div class="tbl-wrap"><table class="tbl meth"><thead><tr><th></th>${METH.cols.map((x) => `<th>${x}</th>`).join('')}</tr></thead><tbody>${METH.rows.map(([n, r]) => `<tr class="${keep(n) ? 'keep' : 'off'}"><th>${nm[n]}${keep(n) ? '<span class="tag">à retenir</span>' : '<span class="tag">pas à retenir</span>'}</th>${r.map((v) => c(v, n)).join('')}</tr>`).join('')}</tbody></table></div>`;
  }
  const t = TABLES[id];
  return `<div class="tbl-wrap"><table class="tbl"><thead><tr>${t.head.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${t.rows.map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${PILL[r[2]]}</td><td>${r[3]}</td></tr>`).join('')}</tbody></table></div>`;
}
