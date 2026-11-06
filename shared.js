/* Fonctions communes aux deux écrans : utilitaires, animations (SVG), tableaux */
const L = 'ABCDE';
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
    [40, 240, 440].forEach((x) => { p += `<rect x="${x - 6}" y="${y0 + 4}" width="12" height="28" rx="3" fill="${K.plum}"/>`; });
    return p + T(140, y0 + 50, 'TAD 1', { fs: 11, fill: K.mute }) + T(340, y0 + 50, 'TAD 2', { fs: 11, fill: K.mute }); };
  const noyau = (y0) => `<ellipse cx="220" cy="${y0}" rx="150" ry="32" fill="#e9ecf4" stroke="#7a86a8" stroke-width="7"/><ellipse cx="220" cy="${y0}" rx="90" ry="16" fill="#d6ead8"/>` + T(220, y0 + 5, 'A', { fs: 14, fw: 700, fill: K.ok }) + T(345, y0 - 4, 'B', { fs: 14, fw: 700, fill: K.ko }) + T(400, y0 + 5, 'lamina', { fs: 11, fill: '#7a86a8', a: 'start' });
  const chrom = (y0) => `<g transform="translate(240 ${y0})"><rect x="-80" y="-12" width="160" height="24" rx="12" fill="#d38b5d" transform="rotate(-16)"/><rect x="-80" y="-12" width="160" height="24" rx="12" fill="#d38b5d" transform="rotate(16)"/><circle r="8" fill="#9c5b33"/></g>`;
  const R = [
    [helix, 'ADN double brin', '⌀ 2 nm', []],
    [beads, 'Nucléosomes (nucléofilament)', '⌀ 11 nm', ['octamère 2 × (H2A, H2B, H3, H4) + 146 pb', '≈ 1 nucléosome / 200 pb · « collier de perles »']],
    [fibre, 'Fibre de chromatine', '⌀ 30 nm', ['histones (+) ↔ ADN (−) · stabilisée par H1', 'modèle solénoïde ou zigzag']],
    [loops, 'Boucles et domaines (TAD)', '', ['boucles stabilisées par la cohésine', 'TAD bornés par CTCF · gènes co-régulés']],
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
  "3e niveau : la fibre forme des boucles (stabilisées par la cohésine) ; des boucles voisines forment des domaines, les TAD, bornés par CTCF : leurs gènes sont co-régulés.",
  "4e niveau : les compartiments A (boucles larges, au centre) sont transcrits ; les B (boucles courtes, contre la lamina) ne le sont pas. Chaque chromosome a son territoire.",
  "En mitose : compaction maximale, le chromosome métaphasique (700 nm).",
];

/* ---------- 3. Épissage alternatif ---------- */
function drawEpissage(k) {
  const ex = (x, w, y, fill, lab) => `<rect x="${x}" y="${y}" width="${w}" height="34" rx="6" fill="${fill}" stroke="${K.ink}" stroke-width="1"/>${T(x + w / 2, y + 23, lab, { fs: 15, fw: 700 })}`;
  const A = '#e4b48f', Bc = '#7ea6cc';
  let s = '';
  s += `<path d="M150 70 H690" stroke="${K.mute}" stroke-width="3"/>` + ex(60, 110, 53, A, 'Exon 1') + ex(345, 100, 53, Bc, 'Exon 2') + ex(620, 110, 53, A, 'Exon 3');
  s += T(258, 110, 'intron', { fs: 12, fill: K.mute }) + T(533, 110, 'intron', { fs: 12, fill: K.mute });
  s += g(k, 1, `<path d="M170 52 C 220 0, 300 0, 345 52 M445 52 C 500 0, 580 0, 620 52" stroke="${K.ok}" stroke-width="3" fill="none"/>
     ${ex(40, 100, 200, A, '1')}${ex(140, 90, 200, Bc, '2')}${ex(230, 100, 200, A, '3')}${T(185, 262, 'Exon 2 retenu → ARNm 1-2-3', { fs: 14, fw: 600 })}${T(185, 284, '→ isoforme protéique A', { fs: 14, fill: K.ok, fw: 600 })}`);
  s += g(k, 2, `<path d="M170 88 C 300 160, 520 160, 620 88" stroke="${K.ko}" stroke-width="3" stroke-dasharray="7 5" fill="none"/>
     ${ex(590, 100, 200, A, '1')}${ex(690, 100, 200, A, '3')}${T(690, 262, 'Exon 2 exclu → ARNm 1-3', { fs: 14, fw: 600 })}${T(690, 284, '→ isoforme protéique B', { fs: 14, fill: K.ko, fw: 600 })}`);
  s += g(k, 3, `<rect x="40" y="310" width="820" height="48" rx="10" fill="#f4f1ea"/>${T(450, 340, 'Même gène, même ADN : seul le choix des exons change (épissage sur l\'ARN, dans le noyau).', { fs: 14, fw: 600 })}`);
  return svgWrap('0 0 900 410', T(20, 26, 'pré-ARNm (le même dans toutes les cellules)', { fs: 14, fill: K.mute, a: 'start' }) + `<g transform="translate(0 40)">${s}</g>`);
}
const EPI_CAP = [
  "Un pré-ARNm avec 3 exons. L'exon 2 (bleu) est un exon « cassette » : il peut être gardé ou retiré.",
  "Voie 1 : le spliceosome relie l'exon 1 à l'exon 2, puis l'exon 2 à l'exon 3. L'ARNm contient 1-2-3.",
  "Voie 2 : le spliceosome relie directement l'exon 1 à l'exon 3. L'exon 2 part avec les introns : l'ARNm contient 1-3.",
  "Résultat : un gène, plusieurs ARNm, plusieurs isoformes. L'ADN, lui, ne change pas.",
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

const ANIMS = {
  pic: { draw: drawPIC, caps: PIC_CAP },
  compaction: { draw: drawCompaction, caps: COMP_CAP },
  epissage: { draw: drawEpissage, caps: EPI_CAP },
  promoteurs: { draw: drawPromoteurs, caps: PROMO_CAP },
  nmd: { draw: (k) => drawNMD(k, 2), caps: NMD_CAP },
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
      ['<b>Acétylation</b> des histones (K)', 'HAT (writer)', 'A', 'Neutralise les charges + des lysines : la fibre se relâche'],
      ['<b>Désacétylation</b>', 'HDAC (eraser)', 'R', 'Les charges + reviennent : la fibre se recompacte'],
      ['<b>Méthylation</b> des histones (K ou R)', 'HMT ; retirée par les déméthylases', 'AR', 'Selon la position et le nombre de méthyles (tableau suivant)'],
      ['<b>Phosphorylation, ubiquitination</b>', '–', 'N', 'Stabilité et dégradation des histones (protéasome)'],
    ],
  },
  chromatine: {
    head: ['Ce qu\'on observe', 'Qui le fait', 'Effet', 'Pourquoi'],
    rows: [
      ['<b>Promoteur dépourvu de nucléosomes</b>', 'Remodelage (ATPase) : glissement ou éviction', 'A', 'Le PIC peut s\'assembler'],
      ['<b>Variants d\'histones</b> (H2A.Z, H3.3…)', 'Chaperonnes FACT et HIRA', 'N', 'Propriétés particulières du nucléosome (stabilité, interactions)'],
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
    const c = (v) => v === 'A' ? '<td class="c act">activation</td>' : v === 'R' ? '<td class="c rep">répression</td>' : v === 'AR' ? '<td class="c mix">les deux</td>' : '<td class="c"></td>';
    return `<div class="tbl-wrap"><table class="tbl meth"><thead><tr><th></th>${METH.cols.map((x) => `<th>${x}</th>`).join('')}</tr></thead><tbody>${METH.rows.map(([n, r]) => `<tr><th>${n === 'ac' ? 'acétylation' : n === 'me1' ? 'mono-méthylation' : n === 'me2' ? 'di-méthylation' : 'tri-méthylation'}</th>${r.map(c).join('')}</tr>`).join('')}</tbody></table></div>`;
  }
  const t = TABLES[id];
  return `<div class="tbl-wrap"><table class="tbl"><thead><tr>${t.head.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${t.rows.map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${PILL[r[2]]}</td><td>${r[3]}</td></tr>`).join('')}</tbody></table></div>`;
}
