/* Contenu du cours : UE2 Ch7.2 · Méthodes de biologie moléculaire (45 min)
   1re partie : les schémas animés propres à ce cours (ils s'ajoutent à ceux de shared.js).
   2e partie : window.COURSE, le déroulé du cours. Pour modifier une question ou une diapo, changez le texte dans la 2e partie. */
(function () {
  const BC = { A: '#4f7a5a', C: '#2f5e88', G: '#b5523b', T: '#c2a05a' }; // couleurs des bases (comme le poly)
  const COMP = { A: 'T', T: 'A', G: 'C', C: 'G' };
  const rc = (s) => s.split('').reverse().map((c) => COMP[c]).join('');
  const arrowR = (x1, y, x2, c, w = 3) => `<path d="M${x1} ${y} H${x2 - 8}" stroke="${c}" stroke-width="${w}"/><path d="M${x2 - 10} ${y - 6} l10 6 l-10 6z" fill="${c}"/>`;
  const arrowL = (x1, y, x2, c, w = 3) => `<path d="M${x1} ${y} H${x2 + 8}" stroke="${c}" stroke-width="${w}"/><path d="M${x2 + 10} ${y - 6} l-10 6 l10 6z" fill="${c}"/>`;

  /* ---------- 1. Enzymes de restriction : HaeIII (franches) puis EcoRI (cohésives) ---------- */
  function drawRestriction(k) {
    const W = 28;
    const cellRow = (x0, y, seq, hl, col) => seq.split('').map((c, i) => `<rect x="${x0 + i * W}" y="${y}" width="${W - 2}" height="30" rx="4" fill="${hl.includes(i) ? '#f3d38c' : '#e7e9e2'}"/>${T(x0 + i * W + (W - 2) / 2, y + 21, c, { fs: 16, fw: 700, fill: col || K.ink })}`).join('');
    const pairs = (x0, y, n, from = 0) => Array.from({ length: n }, (_, i) => `<path d="M${x0 + (from + i) * W + 12} ${y + 31} V${y + 41}" stroke="#9aa1a8" stroke-width="3"/>`).join('');
    // dessine un site : top/bot = séquences complètes, cutTop/cutBot = nb de lettres avant la coupure, open = coupé
    const site = (y, top, bot, hl, cutTop, cutBot, open, name) => {
      const x0 = 120, dx = open ? 70 : 0;
      let s = T(60, y + 22, "5'", { fs: 14, fw: 700 }) + T(60, y + 64, "3'", { fs: 14, fw: 700 });
      const L1 = top.slice(0, cutTop), R1 = top.slice(cutTop), L2 = bot.slice(0, cutBot), R2 = bot.slice(cutBot);
      s += cellRow(x0, y, L1, hl.filter((i) => i < cutTop)) + cellRow(x0 + cutTop * W + dx, y, R1, hl.filter((i) => i >= cutTop).map((i) => i - cutTop));
      s += cellRow(x0, y + 42, L2, hl.filter((i) => i < cutBot)) + cellRow(x0 + cutBot * W + dx, y + 42, R2, hl.filter((i) => i >= cutBot).map((i) => i - cutBot));
      // liaisons H : seulement là où les deux brins se font face dans le même fragment
      const nL = Math.min(cutTop, cutBot), nR = top.length - Math.max(cutTop, cutBot);
      s += pairs(x0, y, nL) + pairs(x0 + dx, y, nR, Math.max(cutTop, cutBot));
      if (!open) {
        if (cutTop !== cutBot) s += pairs(x0, y, Math.abs(cutTop - cutBot), Math.min(cutTop, cutBot));
        const xt = x0 + cutTop * W - 1, xb = x0 + cutBot * W - 1;
        s += `<path d="M${xt} ${y - 10} V${y + 36} H${xb} V${y + 82}" stroke="${K.ko}" stroke-width="4" fill="none"/>`;
      }
      const xe = x0 + top.length * W + dx + 14;
      s += T(xe, y + 22, "3'", { fs: 14, fw: 700, a: 'start' }) + T(xe, y + 64, "5'", { fs: 14, fw: 700, a: 'start' });
      s += T(xe + 40, y + 30, name, { fs: 18, fw: 700, a: 'start' });
      return s;
    };
    let s = '';
    s += g(k, 0, site(30, 'ATCGGCCTAG', 'TAGCCGGATC', [3, 4, 5, 6], 5, 5, k >= 1, 'HaeIII : site GGCC'));
    if (k === 0) s += T(668, 82, 'lu 5\'→3\' sur chaque brin : GGCC', { fs: 14, fill: K.mute, a: 'start' }) + T(668, 102, '= palindrome', { fs: 14, fw: 700, fill: K.ok, a: 'start' });
    if (k >= 1) s += `<g class="${k === 1 ? 'in' : ''}">${T(668, 82, 'coupure au même endroit', { fs: 14, fill: K.mute, a: 'start' })}${T(668, 104, '→ extrémités FRANCHES', { fs: 16, fw: 700, fill: K.plum, a: 'start' })}</g>`;
    s += g(k, 2, site(190, 'ATCGAATTCTAG', 'TAGCTTAAGATC', [3, 4, 5, 6, 7, 8], 4, 8, k >= 3, 'EcoRI : site GAATTC'));
    if (k === 2) s += T(668, 300, 'coupure décalée sur les 2 brins', { fs: 14, fill: K.mute, a: 'start' });
    if (k >= 3) s += `<g class="${k === 3 ? 'in' : ''}">${T(668, 280, 'bouts simple brin (AATT)', { fs: 14, fill: K.mute, a: 'start' })}${T(668, 302, '→ extrémités COHÉSIVES', { fs: 16, fw: 700, fill: K.plum, a: 'start' })}</g>`;
    return svgWrap('0 0 900 330', s);
  }
  const RESTR_CAP = [
    "HaeIII reconnaît GGCC. Lu de 5' vers 3', le brin du bas donne aussi GGCC : le site est un palindrome.",
    "HaeIII coupe les 2 brins au même endroit : les extrémités sont franches.",
    "EcoRI reconnaît GAATTC (palindrome lui aussi) et coupe entre G et A, sur chaque brin.",
    "Les coupures sont décalées : chaque fragment garde un bout simple brin (AATT). Ces extrémités cohésives peuvent se réapparier avec n'importe quel ADN coupé par EcoRI.",
  ];

  /* ---------- 2. Clonage dans une bactérie ---------- */
  function drawClonage(k) {
    const plas = (cx, cy, r, ins, gap, sw = 7) => {
      if (gap) { const a1 = (-90 + 22) * Math.PI / 180, a2 = (-90 - 22 + 360) * Math.PI / 180; return `<path d="M${cx + r * Math.cos(a1)} ${cy + r * Math.sin(a1)} A ${r} ${r} 0 1 1 ${cx + r * Math.cos(a2)} ${cy + r * Math.sin(a2)}" stroke="#7ea6cc" stroke-width="${sw}" fill="none" stroke-linecap="round"/>`; }
      let p = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#7ea6cc" stroke-width="${sw}"/>`;
      if (ins) { const a1 = (-90 - 28) * Math.PI / 180, a2 = (-90 + 28) * Math.PI / 180; p += `<path d="M${cx + r * Math.cos(a1)} ${cy + r * Math.sin(a1)} A ${r} ${r} 0 0 1 ${cx + r * Math.cos(a2)} ${cy + r * Math.sin(a2)}" stroke="${K.ko}" stroke-width="${sw}" fill="none"/>`; }
      return p;
    };
    const bact = (cx, cy, rx, ry, inner) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#f1e3d6" stroke="#c9a98c" stroke-width="2"/><path d="M${cx - rx * 0.55} ${cy} q ${rx * 0.12} ${-ry * 0.5} ${rx * 0.24} 0 t ${rx * 0.24} 0" stroke="#9c7b62" stroke-width="2.5" fill="none"/>${inner || ''}`;
    const lab = (x, y, a, b, c) => T(x, y, a, { fs: 14, fw: 700 }) + (b ? T(x, y + 18, b, { fs: 12, fill: K.mute }) : '') + (c ? T(x, y + 34, c, { fs: 12, fill: K.mute }) : '');
    const P = [
      () => `${plas(80, 70, 34)}${T(80, 75, 'vecteur', { fs: 11, fill: K.mute })}<path d="M150 70 H280" stroke="#9aa1a8" stroke-width="7"/><path d="M190 70 H240" stroke="${K.ko}" stroke-width="7"/>${lab(150, 135, 'Vecteur + ADN d\'intérêt', 'plasmide · gène à cloner')}`,
      () => `${plas(380, 70, 34, false, true)}<path d="M450 70 H490" stroke="${K.ko}" stroke-width="7"/><path d="M500 70 H560" stroke="#9aa1a8" stroke-width="7" opacity=".35"/>${T(470, 50, '✂', { fs: 22, fill: K.ko })}${lab(450, 135, 'Coupure', 'même enzyme de restriction', '→ extrémités compatibles')}`,
      () => `${plas(750, 70, 38, true)}${T(750, 75, 'recombinant', { fs: 10, fill: K.mute })}${lab(750, 135, 'Ligase', 'relie insert et vecteur', '→ ADN recombinant')}`,
      () => `${bact(750, 252, 105, 52, plas(800, 252, 16, true, false, 4))}${lab(750, 330, 'Transformation', 'la bactérie hôte reçoit le plasmide')}`,
      () => { let p = ''; for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) { const x = 380 + i * 48, y = 230 + j * 44; p += bact(x, y, 22, 17, plas(x + 7, y, 6, true, false, 2.5)); } return p + lab(450, 330, 'Divisions → clones', 'cellules identiques ; sélection', 'par l\'antibiotique'); },
      () => { let p = ''; [[60, 230], [100, 225], [140, 232], [180, 228], [80, 270], [120, 268], [160, 272], [200, 266]].forEach(([x, y]) => { p += plas(x, y, 14, true, false, 4); }); return p + lab(130, 330, 'Lyse + purification', 'des milliers de copies', 'de l\'ADN recombinant'); },
    ];
    const ar = [`${arrowR(290, 70, 335, K.sage)}`, `${arrowR(580, 70, 690, K.sage)}`, `<path d="M840 110 V180" stroke="${K.sage}" stroke-width="3"/><path d="M834 176 l6 10 l6 -10z" fill="${K.sage}"/>`, `${arrowL(640, 252, 560, K.sage)}`, `${arrowL(330, 252, 250, K.sage)}`];
    let s = '';
    P.forEach((f, i) => { s += g(k, i, f() + (i < 5 && k > i ? `<g>${ar[i]}</g>` : '')); });
    return svgWrap('0 0 900 385', s);
  }
  const CLON_CAP = [
    "On part d'un vecteur (un plasmide, qui se réplique indépendamment du chromosome bactérien) et de l'ADN qui contient le gène d'intérêt.",
    "On coupe le vecteur et l'ADN d'intérêt avec la même enzyme de restriction : leurs extrémités cohésives sont compatibles.",
    "La ligase relie l'insert au vecteur : on obtient un ADN recombinant.",
    "Transformation : l'ADN recombinant entre dans une bactérie hôte.",
    "La bactérie se divise vite : clones de cellules identiques. Le gène de résistance à un antibiotique permet de ne garder que les bactéries transformées.",
    "On lyse les bactéries et on purifie les plasmides : des milliers de copies identiques de l'ADN recombinant.",
  ];

  /* ---------- 3. La PCR : un cycle, puis la croissance ---------- */
  function drawPCR(k) {
    const x0 = 70, x1 = 830, fA = [280, 330], tg = [330, 570], rA = [570, 620];
    const strand = (y, top, opacity = 1) => `<g opacity="${opacity}"><path d="M${x0} ${y} H${x1}" stroke="${top ? '#8ea3b5' : '#c3cfd9'}" stroke-width="12"/><path d="M${fA[0]} ${y} H${fA[1]}" stroke="${top ? '#2f6fa8' : '#9cc0e0'}" stroke-width="12"/><path d="M${tg[0]} ${y} H${tg[1]}" stroke="${top ? '#b5523b' : '#e2a99c'}" stroke-width="12"/><path d="M${rA[0]} ${y} H${rA[1]}" stroke="${top ? '#5d8a3c' : '#bcd6a6'}" stroke-width="12"/></g>`;
    const ends = (y, top) => T(x0 - 22, y + 5, top ? "5'" : "3'", { fs: 13, fw: 700 }) + T(x1 + 22, y + 5, top ? "3'" : "5'", { fs: 13, fw: 700 });
    let s = '';
    const sep = k >= 1 && k <= 3;
    const yT = sep ? 60 : 80, yB = sep ? 150 : 96;
    if (k <= 3) {
      s += strand(yT, true) + ends(yT, true) + strand(yB, false) + ends(yB, false);
      if (k >= 2) s += `<g class="${k === 2 ? 'in' : ''}">${arrowR(fA[0], yB - 16, fA[1] + 8, '#2f6fa8', 9)}${arrowL(rA[1], yT + 16, rA[0] - 8, '#5d8a3c', 9)}</g>`;
      if (k >= 3) s += `<g class="in"><path d="M${fA[1] + 8} ${yB - 16} H${x1 - 50}" stroke="#2f6fa8" stroke-width="5" stroke-dasharray="${''}"/><path d="M${x1 - 46} ${yB - 16} H${x1}" stroke="#2f6fa8" stroke-width="5" stroke-dasharray="6 5"/><path d="M${rA[0] - 8} ${yT + 16} H${x0 + 50}" stroke="#5d8a3c" stroke-width="5"/><path d="M${x0 + 46} ${yT + 16} H${x0}" stroke="#5d8a3c" stroke-width="5" stroke-dasharray="6 5"/>${T(450, yB + 40, '2 molécules : chaque brin neuf est plus long que la cible (taille variable)', { fs: 13.5, fill: K.mute })}</g>`;
      // profil de température
      const px = [40, 110, 140, 230, 255, 340, 380], py = [300, 205, 205, 300, 300, 255, 255];
      const seg = (i) => `M${px[2 * i - 1] || px[0]} ${py[2 * i - 1] || py[0]}`;
      let prof = `<path d="M40 315 V205 H140 L170 300 H255 L275 255 H380" stroke="${K.sage}" stroke-width="4" fill="none"/>`;
      const plateaux = [[40, 140, 205, '95 °C', 'dénaturation'], [170, 255, 300, '55-65 °C', 'hybridation'], [275, 380, 255, '75 °C', 'synthèse']];
      plateaux.forEach(([a, b, y, t, n], i) => { const on = k === i + 1; prof += `<path d="M${a} ${y} H${b}" stroke="${on ? K.ko : K.sage}" stroke-width="${on ? 8 : 4}"/>${T((a + b) / 2, y - 12, t, { fs: on ? 16 : 13, fw: 700, fill: on ? K.ko : K.mute })}${T((a + b) / 2, y + 22, n, { fs: 12, fill: on ? K.ink : K.mute, fw: on ? 700 : 400 })}`; });
      s += `<g transform="translate(0 10)">${prof}</g>`;
      const info = [
        ['Les ingrédients :', 'ADN matrice · 2 amorces (18-25 nt)', 'ADN polymérase (Taq) · dNTP'],
        ['95 °C · dénaturation', 'les liaisons H cassent :', 'les 2 brins se séparent'],
        ['55-65 °C · hybridation', 'chaque amorce s\'apparie à son brin', '(complémentaire et antisens)'],
        ['75 °C · synthèse', 'la polymérase allonge chaque amorce', 'de 5\' vers 3\' avec les dNTP'],
      ][k];
      s += T(450, 250, info[0], { fs: 18, fw: 700, a: 'start' }) + T(450, 278, info[1], { fs: 15, fill: K.mute, a: 'start' }) + T(450, 300, info[2], { fs: 15, fill: K.mute, a: 'start' });
    } else {
      // croissance : 2^n molécules, dont 2n de taille variable
      const n = [1, 2, 3, 4, 5], bw = 90, base = 300, sc = 7.2;
      s += T(450, 34, 'Après n cycles : 2ⁿ molécules', { fs: 20, fw: 700 });
      n.forEach((c, i) => {
        const tot = 2 ** c, vari = Math.min(tot, 2 * c), exa = tot - vari, x = 120 + i * 140;
        s += `<rect x="${x}" y="${base - vari * sc}" width="${bw}" height="${vari * sc}" fill="#c3cfd9"/><rect x="${x}" y="${base - tot * sc}" width="${bw}" height="${exa * sc}" fill="${K.ko}"/>`;
        s += T(x + bw / 2, base - tot * sc - 10, String(tot), { fs: 16, fw: 700 }) + T(x + bw / 2, base + 22, `cycle ${c}`, { fs: 14 });
      });
      s += `<rect x="120" y="330" width="16" height="16" fill="${K.ko}"/>${T(142, 343, 'taille exacte (d\'une amorce à l\'autre)', { fs: 13, a: 'start' })}<rect x="470" y="330" width="16" height="16" fill="#c3cfd9"/>${T(492, 343, 'taille variable : 2 par cycle', { fs: 13, a: 'start' })}`;
      s += `<rect x="110" y="60" width="340" height="64" rx="10" fill="#f4f1ea"/>${T(280, 86, 'Cycle 25 : 33 millions de copies exactes', { fs: 15, fw: 700, fill: K.ko })}${T(280, 108, 'et seulement 50 fragments de taille variable', { fs: 14, fill: K.mute })}`;
    }
    return svgWrap('0 0 900 360', s);
  }
  const PCR_CAP = [
    "La PCR copie in vitro une région ciblée de l'ADN : la zone rouge, encadrée par les sites des 2 amorces (bleu et vert).",
    "95 °C : dénaturation. Les liaisons hydrogène cassent, les deux brins se séparent.",
    "55-65 °C : hybridation. Chaque amorce s'apparie à son brin, de façon complémentaire et antisens.",
    "75 °C : synthèse. L'ADN polymérase allonge les amorces avec les dNTP. Fin du 1er cycle : 2 molécules, aux brins neufs encore trop longs.",
    "Le nombre de molécules double à chaque cycle. Les fragments de taille exacte apparaissent au cycle 3 puis deviennent écrasants : au cycle 25, 33 millions de copies exactes pour 50 de taille variable.",
  ];

  /* ---------- 4. Sanger : la réaction, puis le gel ---------- */
  const TPL = 'CGAATGCTCAGGCCATCATC'; // matrice 5'→3' (poly), positions +20 … +1
  const SYN = TPL.split('').reverse().map((c) => COMP[c]).join(''); // brin synthétisé 5'→3' : position 1 = en face de +1
  function drawSanger(k) {
    if (k === 7) return drawAssoc();
    const W = 30, xR = 660; // la position +i est en x = xR - i*W
    const xp = (i) => xR - i * W;
    let s = T(40, 70, "5'", { fs: 15, fw: 700 });
    TPL.split('').forEach((c, j) => { const i = 20 - j; s += `<text x="${xp(i) + W / 2}" y="70" font-size="19" font-weight="700" fill="${BC[c]}" text-anchor="middle" font-family="ui-monospace,Menlo,monospace">${c}</text>`; });
    s += `<path d="M${xR + 4} 64 H860" stroke="#8ea3b5" stroke-width="10"/>${T(875, 70, "3'", { fs: 15, fw: 700 })}${T(xp(20) + 15, 40, '+20', { fs: 12, fill: K.mute })}${T(xp(1) + 15, 40, '+1', { fs: 12, fill: K.mute })}`;
    s += T(250, 20, 'matrice simple brin', { fs: 13, fill: K.mute });
    // amorce
    s += `<path d="M${xR + 6} 92 H860" stroke="#c3cfd9" stroke-width="10"/>${T(875, 97, "5'", { fs: 13, fw: 700 })}${T(760, 120, 'amorce (18-25 nt)', { fs: 13, fill: K.mute })}`;
    const syn = (n, y, stopA) => { let p = ''; for (let i = 1; i <= n; i++) { const c = SYN[i - 1]; p += `<text x="${xp(i) + W / 2}" y="${y}" font-size="19" font-weight="700" fill="${BC[c]}" text-anchor="middle" font-family="ui-monospace,Menlo,monospace">${c}</text>`; } if (stopA) p += `<rect x="${xp(n) + 2}" y="${y - 19}" width="${W - 4}" height="25" rx="4" fill="none" stroke="${K.ink}" stroke-width="2"/>`; return p; };
    if (k === 0) s += T(450, 175, 'Dans le tube : matrice + amorce + ADN polymérase + dNTP en excès + un ddNTP marqué', { fs: 15 }) + T(450, 200, "L'amorce apporte l'extrémité 3'-OH de départ.", { fs: 14, fill: K.mute });
    if (k === 1) s += `<g class="in">${syn(9, 97)}${arrowL(xp(9) - 4, 128, xp(9) - 50, K.ink, 2.5)}${T(450, 175, 'La polymérase allonge l\'amorce de 5\' vers 3\', en face de la matrice', { fs: 15 })}${T(450, 200, '(le brin neuf se lit de droite à gauche sur le schéma)', { fs: 13, fill: K.mute })}</g>`;
    if (k >= 2) {
      const n = k === 2 ? 2 : 2;
      if (k === 2) s += `<g class="in">${syn(2, 97, true)}${T(450, 165, 'ddATP incorporé en face d\'un T : arrêt !', { fs: 16, fw: 700, fill: K.ko })}</g>`;
      // dNTP vs ddNTP
      const sugar = (x, y, dd) => `<path d="M${x} ${y} l30 -20 l30 20 l-12 32 h-36z" fill="#f4f1ea" stroke="${K.ink}" stroke-width="2"/>${T(x + 30, y - 26, 'base', { fs: 11, fill: K.mute })}<path d="M${x + 30} ${y - 20} V${y - 22}" stroke="${K.ink}"/>${T(x - 26, y + 6, 'P-P-P', { fs: 11, fill: K.mute })}<path d="M${x + 48} ${y + 32} l14 18" stroke="${K.ink}" stroke-width="2"/>${dd ? T(x + 70, y + 64, "3'-H", { fs: 14, fw: 700, fill: K.ko }) : `<circle cx="${x + 70}" cy="${y + 58}" r="16" fill="#f7e27a"/>${T(x + 70, y + 63, "3'-OH", { fs: 12, fw: 700 })}`}`;
      if (k === 2) s += `<g class="in">${sugar(330, 230, false)}${T(360, 330, 'dNTP : la chaîne continue', { fs: 13, fw: 600, fill: K.ok })}${sugar(560, 230, true)}${T(590, 330, 'ddNTP : pas de 3\'-OH → arrêt', { fs: 13, fw: 600, fill: K.ko })}</g>`;
      if (k >= 3 && k <= 6) {
        const b = 'ACGT'[k - 3], stops = []; for (let i = 1; i <= 20; i++) if (SYN[i - 1] === b) stops.push(i);
        const dy = stops.length > 4 ? 27 : 40;
        s += `<g class="in">${T(40, 150, `Tube dd${b}TP :`, { fs: 16, fw: 700, fill: BC[b], a: 'start' })}`;
        stops.forEach((n, r) => { const y = 180 + r * dy; s += `<path d="M${xR + 6} ${y - 6} H850" stroke="#c3cfd9" stroke-width="8"/>${syn(n, y, true)}${T(895, y, `n+${n}`, { fs: 14, fw: 700, fill: BC[b], a: 'end' })}`; });
        s += `</g>`;
      }
    }
    return svgWrap('0 0 900 360', s);
  }
  /* Les 20 fragments rangés par taille, reliés chacun à sa bande du gel */
  function drawAssoc() {
    const yb = (n) => 512 - n * 22.5, lanes = ['A', 'C', 'G', 'T'], lx = (i) => 600 + i * 70;
    let s = T(240, 26, 'Les 20 fragments, rangés par taille', { fs: 16, fw: 700 }) + T(890, 26, 'Gel', { fs: 16, fw: 700, a: 'end' });
    s += `<rect x="585" y="${yb(20.8)}" width="290" height="${yb(0.2) - yb(20.8)}" rx="8" fill="#f4f6f1" stroke="${K.sage}" stroke-width="2"/>`;
    lanes.forEach((b, i) => { s += T(lx(i) + 25, yb(20.8) - 8, b, { fs: 17, fw: 700, fill: BC[b] }); });
    for (let n = 1; n <= 20; n++) {
      const b = SYN[n - 1], y = yb(n), len = 30 + n * 17, i = lanes.indexOf(b);
      s += `<g class="in" style="animation-delay:${(n * 0.06).toFixed(2)}s">`;
      s += T(56, y + 5, `n+${n}`, { fs: 12.5, fw: 700, fill: BC[b], a: 'end' });
      s += `<path d="M66 ${y} H${66 + len - 14}" stroke="#c3cfd9" stroke-width="9"/><rect x="${66 + len - 16}" y="${y - 9}" width="18" height="18" rx="4" fill="${BC[b]}"/>${T(66 + len - 7, y + 5, b, { fs: 11, fw: 700, fill: '#fff' })}`;
      s += `<path d="M${66 + len + 8} ${y} H${lx(i) - 6}" stroke="${BC[b]}" stroke-width="1.5" stroke-dasharray="4 4" opacity=".8"/>`;
      s += `<rect x="${lx(i)}" y="${y - 5}" width="50" height="10" rx="3" fill="${BC[b]}"/></g>`;
    }
    s += T(240, 525, 'colonne = ddNTP qui a arrêté le fragment · hauteur = taille (petit = en bas)', { fs: 13, fill: K.mute });
    return svgWrap('0 0 900 535', s);
  }
  const SANGER_CAP = [
    "La matrice simple brin et son amorce. Chaque tube contient aussi l'ADN polymérase, les 4 dNTP en excès et un seul type de ddNTP marqué.",
    "La polymérase allonge l'amorce en recopiant la matrice (complémentaire et antiparallèle).",
    "De temps en temps, elle incorpore un ddNTP : sans 3'-OH, la liaison suivante est impossible. La synthèse s'arrête.",
    "Tube ddATP : tous les fragments qui s'arrêtent sur un A : n+2, n+5, n+13, n+16.",
    "Tube ddCTP : les fragments qui s'arrêtent sur un C : n+9, n+10, n+15, n+19.",
    "Tube ddGTP : les fragments qui s'arrêtent sur un G : n+1, n+4, n+7, n+8, n+12, n+14, n+20.",
    "Tube ddTTP : les fragments qui s'arrêtent sur un T : n+3, n+6, n+11, n+17, n+18.",
    "Sur le gel, chaque fragment donne une bande : sa colonne dépend du ddNTP qui l'a arrêté, sa hauteur de sa taille. Le plus petit (n+1) migre le plus loin, tout en bas.",
  ];
  function drawGel(k) {
    const lanes = ['A', 'C', 'G', 'T'], lx = (i) => 110 + i * 75, yb = (n) => 345 - n * 15.2;
    let s = `<rect x="80" y="20" width="310" height="340" rx="8" fill="#f4f6f1" stroke="${K.sage}" stroke-width="2"/>`;
    lanes.forEach((b, i) => { s += `<rect x="${lx(i)}" y="28" width="50" height="10" rx="3" fill="#d4d8cf"/>${T(lx(i) + 25, 16, b, { fs: 17, fw: 700, fill: BC[b] })}`; });
    for (let n = 1; n <= 20; n++) { const b = SYN[n - 1], i = lanes.indexOf(b); s += `<rect x="${lx(i)}" y="${yb(n) - 4}" width="50" height="8" rx="3" fill="${BC[b]}"/>`; }
    s += `<path d="M50 40 V340" stroke="${K.mute}" stroke-width="2.5"/><path d="M44 334 l6 12 l6 -12z" fill="${K.mute}"/>${T(36, 200, 'migration', { fs: 13, fill: K.mute, a: 'middle' }).replace('<text ', '<text transform="rotate(-90 36 200)" ')}`;
    if (k === 0) s += T(430, 120, 'Les 4 réactions migrent côte à côte', { fs: 16, fw: 700, a: 'start' }) + T(430, 146, '(gel dénaturant ou capillaire).', { fs: 14, fill: K.mute, a: 'start' }) + T(430, 186, 'Plus le fragment est petit,', { fs: 16, a: 'start' }) + T(430, 210, 'plus il migre loin (en bas).', { fs: 16, a: 'start' });
    if (k >= 1) {
      s += `<g class="${k === 1 ? 'in' : ''}">`;
      for (let n = 1; n <= 20; n++) { const b = SYN[n - 1]; s += `<text x="410" y="${yb(n) + 5}" font-size="14" font-weight="700" fill="${BC[b]}" font-family="ui-monospace,Menlo,monospace">${b}</text>`; }
      s += `<path d="M440 340 V40" stroke="${K.ok}" stroke-width="3"/><path d="M434 46 l6 -12 l6 12z" fill="${K.ok}"/>${T(456, 330, "5'", { fs: 14, fw: 700, a: 'start' })}${T(456, 50, "3'", { fs: 14, fw: 700, a: 'start' })}`;
      s += T(500, 120, 'On lit de bas en haut :', { fs: 16, fw: 700, a: 'start' }) + T(500, 144, 'c\'est le brin SYNTHÉTISÉ, 5\'→3\'', { fs: 15, a: 'start' });
      s += `<text x="500" y="176" font-size="15" font-weight="700" fill="${K.ink}" font-family="ui-monospace,Menlo,monospace">5'-${SYN}-3'</text></g>`;
    }
    if (k >= 2) s += `<g class="in">${T(500, 228, 'Attention : il faut prendre le', { fs: 16, fw: 700, fill: K.ko, a: 'start' })}${T(500, 252, 'complémentaire pour avoir la matrice', { fs: 16, fw: 700, fill: K.ko, a: 'start' })}<text x="500" y="290" font-size="15" font-weight="700" fill="${K.plum}" font-family="ui-monospace,Menlo,monospace">matrice : 5'-${TPL}-3'</text></g>`;
    return svgWrap('0 0 900 370', s);
  }
  const GEL_CAP = [
    "Les fragments des 4 réactions migrent côte à côte : plus un fragment est petit, plus il va loin. Chaque bande = un fragment arrêté par un ddNTP.",
    "Du bas vers le haut, on lit les bases dans l'ordre de synthèse : c'est la séquence du brin synthétisé, de 5' vers 3'.",
    "Piège : le gel donne le brin synthétisé. La matrice est son complémentaire (antiparallèle).",
  ];

  /* ---------- Schémas fixes ---------- */
  function figOutils() {
    const box = (x, c, t1, t2, t3, icon) => `<rect x="${x}" y="30" width="250" height="250" rx="18" fill="${c}" opacity=".14"/><rect x="${x}" y="30" width="250" height="250" rx="18" fill="none" stroke="${c}" stroke-width="3"/>${icon}${T(x + 125, 200, t1, { fs: 24, fw: 700, fill: c })}${T(x + 125, 230, t2, { fs: 15 })}${T(x + 125, 252, t3, { fs: 15 })}`;
    const sc = `<g transform="translate(110 70)"><circle cx="0" cy="70" r="14" fill="none" stroke="${K.ko}" stroke-width="5"/><circle cx="40" cy="70" r="14" fill="none" stroke="${K.ko}" stroke-width="5"/><path d="M8 58 L52 0 M32 58 L-12 0" stroke="${K.ko}" stroke-width="6" stroke-linecap="round"/></g>`;
    const cp = `<g transform="translate(395 60)"><rect x="0" y="20" width="70" height="50" rx="6" fill="none" stroke="${K.ok}" stroke-width="5"/><rect x="18" y="0" width="70" height="50" rx="6" fill="#fff" stroke="${K.ok}" stroke-width="5"/><rect x="36" y="40" width="70" height="50" rx="6" fill="#fff" stroke="${K.ok}" stroke-width="5"/></g>`;
    const rd = `<g transform="translate(700 70)"><circle cx="20" cy="30" r="28" fill="none" stroke="${K.plum}" stroke-width="6"/><path d="M40 50 L70 80" stroke="${K.plum}" stroke-width="8" stroke-linecap="round"/>${T(20, 36, 'ATG', { fs: 14, fw: 700, fill: K.plum })}</g>`;
    return svgWrap('0 0 900 310', box(50, K.ko, 'COUPER', 'enzymes de', 'restriction', sc) + box(325, K.ok, 'COPIER', 'clonage bactérien', 'et PCR', cp) + box(600, K.plum, 'LIRE', 'séquençage', 'Sanger, haut débit', rd));
  }
  function figPlasmide() {
    const cx = 390, cy = 175, r = 105, arc = (a1, a2, c, w = 22) => { const p = (a) => [cx + r * Math.cos(a * Math.PI / 180), cy + r * Math.sin(a * Math.PI / 180)]; const [x1, y1] = p(a1), [x2, y2] = p(a2); return `<path d="M${x1} ${y1} A ${r} ${r} 0 ${a2 - a1 > 180 ? 1 : 0} 1 ${x2} ${y2}" stroke="${c}" stroke-width="${w}" fill="none"/>`; };
    let s = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#b9c7d4" stroke-width="6"/>`;
    s += arc(-20, 50, '#8ea3b5') + arc(110, 200, '#c9a98c') + arc(-160, -100, '#2f6fa8') + `<rect x="${cx - 16}" y="${cy - r - 16}" width="32" height="32" rx="5" fill="${K.honey}"/>`;
    s += T(cx, cy - 4, 'plasmide', { fs: 18, fw: 700 }) + T(cx, cy + 18, '(ex. pUC19)', { fs: 13, fill: K.mute });
    s += T(cx + 140, cy + 10, 'Origine de réplication', { fs: 15, fw: 700, a: 'start' }) + T(cx + 140, cy + 30, 'se réplique seul, en plusieurs copies', { fs: 12.5, fill: K.mute, a: 'start' });
    s += T(cx - 140, cy + 120, 'Gène de sélection : AmpR', { fs: 15, fw: 700, a: 'end' }) + T(cx - 140, cy + 140, 'résistance à un antibiotique', { fs: 12.5, fill: K.mute, a: 'end' });
    s += T(cx - 130, cy - 95, 'Gène rapporteur : lacZ', { fs: 15, fw: 700, a: 'end' }) + T(cx - 130, cy - 75, 'colonies avec ou sans insert', { fs: 12.5, fill: K.mute, a: 'end' });
    s += `<path d="M${cx + 18} ${cy - r} L${cx + 120} ${cy - r - 50}" stroke="${K.honey}" stroke-width="2"/>${T(cx + 126, cy - r - 54, 'Sites de restriction', { fs: 15, fw: 700, a: 'start' })}${T(cx + 126, cy - r - 34, 'EcoRI, BamHI, HindIII… : on y insère l\'ADN', { fs: 12.5, fill: K.mute, a: 'start' })}`;
    return svgWrap('0 0 900 330', s);
  }
  function figAmorces() {
    const cell = (x, y, t, c, light) => `<rect x="${x}" y="${y}" width="80" height="28" rx="4" fill="${c}" opacity="${light ? 0.45 : 1}"/>${T(x + 40, y + 20, t, { fs: 16, fw: 700, fill: '#fff' }).replace('font-family="Poppins,sans-serif"', 'font-family="ui-monospace,Menlo,monospace"')}`;
    let s = '';
    s += `<path d="M90 150 H810" stroke="#8ea3b5" stroke-width="28"/>` + cell(200, 136, 'TAAC', '#2f6fa8') + `<rect x="280" y="136" width="340" height="28" fill="#b5523b"/>` + cell(620, 136, 'GGCT', '#5d8a3c') + T(70, 156, "5'", { fs: 15, fw: 700 }) + T(830, 156, "3'", { fs: 15, fw: 700 });
    s += `<path d="M90 250 H810" stroke="#c3cfd9" stroke-width="28"/>` + cell(200, 236, 'ATTG', '#2f6fa8', true) + `<rect x="280" y="236" width="340" height="28" fill="#b5523b" opacity=".45"/>` + cell(620, 236, 'CCGA', '#5d8a3c', true) + T(70, 256, "3'", { fs: 15, fw: 700 }) + T(830, 256, "5'", { fs: 15, fw: 700 });
    // amorce 1 sur le brin du bas
    s += cell(200, 196, 'TAAC', '#2f6fa8') + T(180, 216, "5'", { fs: 13, fw: 700 }) + T(300, 216, "3' →", { fs: 13, fw: 700, a: 'start' });
    // amorce 2 sur le brin du haut
    s += cell(620, 90, 'CCGA', '#5d8a3c') + T(600, 110, "← 3'", { fs: 13, fw: 700, a: 'end' }) + T(718, 110, "5'", { fs: 13, fw: 700 });
    s += T(240, 50, 'amorce 1 : 5\'-TAAC-3\'', { fs: 15, fw: 700, fill: '#2f6fa8' }) + T(660, 50, 'amorce 2 : 5\'-AGCC-3\'', { fs: 15, fw: 700, fill: '#5d8a3c' });
    s += T(450, 310, 'Chaque amorce est complémentaire et antisens du brin sur lequel elle s\'hybride', { fs: 14, fill: K.mute });
    return svgWrap('0 0 900 330', s);
  }
  function figChromato() {
    const seq = 'CATTCAGTG', col = { A: '#4f9a4f', C: '#2f5e88', G: '#2b2b2b', T: '#c0504d' };
    const trace = (y0, label, mid) => {
      let s = T(30, y0 - 30, label, { fs: 15, fw: 700, a: 'start' });
      seq.split('').forEach((b, i) => {
        const x = 200 + i * 70, bases = i === 4 ? mid : [[b, 1]];
        bases.forEach(([bb, h], q) => { const H = 70 * h, x2 = x + (bases.length > 1 ? (q ? 5 : -5) : 0); s += `<path d="M${x2 - 24} ${y0} C ${x2 - 10} ${y0}, ${x2 - 10} ${y0 - H}, ${x2} ${y0 - H} C ${x2 + 10} ${y0 - H}, ${x2 + 10} ${y0}, ${x2 + 24} ${y0}" stroke="${col[bb]}" stroke-width="3" fill="none"/>`; });
        const lab = i === 4 ? (mid.length > 1 ? 'N' : mid[0][0]) : b; s += T(x, y0 - 82, lab, { fs: 16, fw: 700, fill: lab === 'N' ? K.plum : col[lab] });
      });
      return s + `<path d="M170 ${y0} H850" stroke="${K.line || '#ccc'}" stroke-width="1"/>`;
    };
    let s = trace(110, 'Contrôle', [['C', 1]]) + trace(225, 'Homozygote', [['G', 1]]) + trace(340, 'Hétérozygote', [['C', 0.55], ['G', 0.55]]);
    s += `<rect x="452" y="15" width="56" height="335" rx="8" fill="none" stroke="${K.honey}" stroke-width="2.5" stroke-dasharray="6 4"/>`;
    s += T(30, 215, 'un seul pic,', { fs: 12.5, fill: K.mute, a: 'start' }) + T(30, 231, 'autre base', { fs: 12.5, fill: K.mute, a: 'start' }) + T(30, 330, '2 pics', { fs: 12.5, fill: K.mute, a: 'start' }) + T(30, 346, 'superposés → N', { fs: 12.5, fill: K.mute, a: 'start' });
    return svgWrap('0 0 900 360', s);
  }
  function figNGS() {
    let s = '';
    const step = (x, n, t) => `<circle cx="${x}" cy="32" r="15" fill="${K.plum}"/>${T(x, 38, n, { fs: 15, fw: 700, fill: '#fff' })}${T(x, 70, t, { fs: 14, fw: 700 })}`;
    s += step(110, '1', 'ADN fragmenté') + step(330, '2', 'adaptateurs') + step(560, '3', 'amplification en pont') + step(790, '4', 'lecture par fluorescence');
    [[40, 110], [110, 140], [60, 170], [130, 200]].forEach(([x, y]) => { s += `<path d="M${x} ${y} H${x + 70}" stroke="#8ea3b5" stroke-width="7"/>`; });
    [[260, 110], [300, 150], [270, 190]].forEach(([x, y]) => { s += `<path d="M${x} ${y} H${x + 14}" stroke="#8e5fa8" stroke-width="7"/><path d="M${x + 14} ${y} H${x + 74}" stroke="#8ea3b5" stroke-width="7"/><path d="M${x + 74} ${y} H${x + 88}" stroke="#8e5fa8" stroke-width="7"/>`; });
    s += `<path d="M470 230 H660" stroke="${K.sage}" stroke-width="5"/>`;
    [490, 530, 570, 610].forEach((x, i) => { s += `<path d="M${x} 230 V${150 + (i % 2) * 20} M${x + 14} 230 V${150 + (i % 2) * 20}" stroke="#5d8a3c" stroke-width="4"/>`; });
    s += `<path d="M590 230 V180 Q 605 140 620 180 V230" stroke="#2f6fa8" stroke-width="4" fill="none"/>${T(565, 260, 'des millions de « clusters »', { fs: 12.5, fill: K.mute })}`;
    s += `<rect x="715" y="95" width="150" height="130" rx="8" fill="#1f2a33"/>`;
    [[740, 120, '#c2a05a'], [790, 115, '#4f7a5a'], [835, 130, '#2f5e88'], [750, 170, '#b5523b'], [800, 165, '#c2a05a'], [845, 185, '#4f7a5a'], [770, 205, '#2f5e88'], [825, 210, '#b5523b']].forEach(([x, y, c]) => { s += `<circle cx="${x}" cy="${y}" r="9" fill="${c}"/>`; });
    s += T(790, 260, '1 couleur = 1 base, à chaque cycle', { fs: 12.5, fill: K.mute });
    s += `<rect x="40" y="290" width="820" height="46" rx="10" fill="#f4f1ea"/>${T(450, 320, 'Résultat : des millions de séquences courtes (50-150 pb) lues en parallèle → un génome en 24 h', { fs: 15, fw: 700 })}`;
    return svgWrap('0 0 900 350', s);
  }
  function figSeqPCR() {
    const seq = 'GGTAAGGGCGGTCGCCTGGCCGCTCCACTGTAGTGGGCGAGCCTGCAGACGACCGCACGGCAGCTCCGGAGTCGGCGGCTCCAGGGCTCCCTCCCCGGAATCACATTCCAGAATCCCCCGGCCACGGGCTTCCCAGTGCAGATT';
    return `<div style="font-family:ui-monospace,Menlo,monospace;font-size:1.02em;line-height:1.6;word-break:break-all;background:#fff;color:#2b3742;border-radius:10px;padding:.7em 1em">5'-<b style="color:#2f6fa8;background:#e3eef8">${seq.slice(0, 10)}</b>${seq.slice(10, -10)}<b style="color:#5d8a3c;background:#e8f1e0">${seq.slice(-10)}</b>-3'</div>`;
  }
  function figGelQuiz() {
    const syn = 'AGTCCATG', lanes = ['A', 'C', 'G', 'T'], lx = (i) => 110 + i * 75, yb = (n) => 300 - n * 30;
    let s = `<rect x="80" y="20" width="310" height="300" rx="8" fill="#f4f6f1" stroke="${K.sage}" stroke-width="2"/>`;
    lanes.forEach((b, i) => { s += `<rect x="${lx(i)}" y="28" width="50" height="10" rx="3" fill="#d4d8cf"/>${T(lx(i) + 25, 16, b, { fs: 17, fw: 700, fill: BC[b] })}`; });
    for (let n = 1; n <= syn.length; n++) { const b = syn[n - 1], i = lanes.indexOf(b); s += `<rect x="${lx(i)}" y="${yb(n) - 5}" width="50" height="10" rx="3" fill="${BC[b]}"/>`; }
    s += `<path d="M50 40 V300" stroke="${K.mute}" stroke-width="2.5"/><path d="M44 294 l6 12 l6 -12z" fill="${K.mute}"/>`;
    s += T(430, 150, 'Gel de séquençage Sanger', { fs: 17, fw: 700, a: 'start' }) + T(430, 176, '(4 réactions, ddA, ddC, ddG, ddT)', { fs: 14, fill: K.mute, a: 'start' }) + T(430, 210, '↓ sens de migration', { fs: 14, fill: K.mute, a: 'start' });
    return svgWrap('0 0 700 330', s);
  }
  /* Animation de fin : PCR qui copie « MERCI », puis lecture d'un chromatogramme */
  function figMerciPCR() {
    const css = `<style>
      .mp-row{opacity:1;animation:mprow .5s ease-out both}
      @keyframes mprow{from{opacity:0;transform:translateX(-30px)}to{opacity:1;transform:none}}
      .mp-pk{stroke-dasharray:100;stroke-dashoffset:0;animation:mppk .6s ease-out both}
      @keyframes mppk{from{stroke-dashoffset:100}to{stroke-dashoffset:0}}
      .mp-let{opacity:1;animation:mplet .5s cubic-bezier(.2,.8,.2,1.4) both;transform-box:fill-box;transform-origin:center}
      @keyframes mplet{from{opacity:0;transform:translateY(20px) scale(.4)}to{opacity:1;transform:none}}
      .mp-cnt{opacity:0;animation:mpcnt .4s ease-out both}
      @keyframes mpcnt{from{opacity:0}to{opacity:1}}
      @media (prefers-reduced-motion:reduce){.mp-row,.mp-pk,.mp-let,.mp-cnt{animation:none}.mp-cnt{opacity:1}}
    </style>`;
    let s = css + T(220, 26, '1 · PCR : on copie le message', { fs: 16, fw: 700 }) + T(670, 26, '2 · Séquençage : on le lit', { fs: 16, fw: 700 });
    const copy = (x, y) => `<path d="M${x} ${y} H${x + 190}" stroke="#8ea3b5" stroke-width="7"/><path d="M${x} ${y + 9} H${x + 190}" stroke="#c3cfd9" stroke-width="7"/><rect x="${x + 50}" y="${y - 8}" width="90" height="25" rx="5" fill="${K.ko}"/>${T(x + 95, y + 10, 'MERCI', { fs: 13, fw: 700, fill: '#fff' })}`;
    const waves = [[0], [1], [2, 3], [4, 5, 6, 7], [8, 9, 10, 11, 12, 13, 14, 15]];
    waves.forEach((w, c) => { w.forEach((i) => { const col = i < 8 ? 0 : 1, row = i % 8; s += `<g class="mp-row" style="animation-delay:${(c * 0.8).toFixed(1)}s">${copy(20 + col * 215, 58 + row * 34)}</g>`; }); });
    s += `<path d="M450 40 V320" stroke="${K.sage}" stroke-width="1.5"/>`;
    // chromatogramme
    const L = ['M', 'E', 'R', 'C', 'I', '!'], cols = ['#4f7a5a', '#2f5e88', '#b5523b', '#c2a05a', '#3d2248', '#4f7a5a'], H = [150, 120, 165, 135, 155, 110];
    s += `<path d="M480 300 H880" stroke="#9aa1a8" stroke-width="2"/>`;
    L.forEach((c, i) => { const x = 510 + i * 70, d = (4.4 + i * 0.45).toFixed(2), h = H[i];
      s += `<path class="mp-pk" pathLength="100" style="animation-delay:${d}s" d="M${x - 30} 300 C ${x - 12} 300, ${x - 12} ${300 - h}, ${x} ${300 - h} C ${x + 12} ${300 - h}, ${x + 12} 300, ${x + 30} 300" stroke="${cols[i]}" stroke-width="4" fill="none"/>`;
      s += `<text class="mp-let" style="animation-delay:${d}s" x="${x}" y="${300 - h - 16}" font-size="40" font-weight="700" fill="${cols[i]}" text-anchor="middle" font-family="Poppins,sans-serif">${c}</text>`; });
    return svgWrap('0 0 900 330', s);
  }

  Object.assign(ANIMS, {
    restriction: { draw: drawRestriction, caps: RESTR_CAP },
    clonage: { draw: drawClonage, caps: CLON_CAP },
    pcr: { draw: drawPCR, caps: PCR_CAP },
    sanger: { draw: drawSanger, caps: SANGER_CAP },
    gel: { draw: drawGel, caps: GEL_CAP },
  });
  Object.assign(FIGS, { outils: figOutils, plasmide: figPlasmide, amorces: figAmorces, chromato: figChromato, ngs: figNGS, seqpcr: figSeqPCR, gelquiz: figGelQuiz, merci_pcr: figMerciPCR });
  TABLES.vecteurs = { plain: true, head: ['Vecteur', 'Taille de l\'insert'], rows: [['<b>Plasmide</b> classique', '5 à 10 kb'], ['<b>BAC</b> (<i>Bacterial Artificial Chromosome</i>)', '300 kb'], ['<b>YAC</b> (<i>Yeast Artificial Chromosome</i>)', 'jusqu\'à 1,5 Mb']] };

  /* ---------- Figures ajoutées pour suivre le plan du cours ---------- */
  const PLAN = [
    ['I', 'AMPLIFICATION DE L\'ADN', [['I.1', '1. Outils moléculaires'], ['I.2', '2. Clonage in vivo'], ['I.3', '3. Clonage in vitro (PCR)']]],
    ['II', 'SÉQUENÇAGE DE L\'ADN', [['II.1', '1. Outils moléculaires'], ['II.2', '2. Technique'], ['II.3', '3. Résultat / Analyse'], ['II.4', '4. Séquençage haut débit']]],
  ];
  const planHTML = (on) => `<div class="plan">${PLAN.map(([id, t, subs]) => `<div class="plan-b ${on === id ? 'on' : 'off'}"><div class="plan-t">${id}. ${t}</div>${subs.map(([sid, st]) => `<div class="plan-s">${st}</div>`).join('')}</div>`).join('')}</div>`;
  function figRT() {
    let s = '';
    s += T(450, 34, 'Reverse transcriptase (enzyme virale, rétrovirus) : ARN → ADN', { fs: 18, fw: 700 });
    // ARNm
    s += T(40, 92, 'ARNm épissé', { fs: 14, fw: 700, a: 'start' }) + `<circle cx="196" cy="110" r="10" fill="#7fa37a"/>`;
    [[210, '#e4b48f'], [300, '#e4b48f'], [390, '#e4b48f']].forEach(([x, c], i) => { s += `<rect x="${x}" y="98" width="88" height="24" fill="${c}" stroke="${K.ink}"/>${T(x + 44, 115, 'exon ' + (i + 1), { fs: 12, fw: 700 })}`; });
    s += T(500, 116, 'AAAA', { fs: 13, fw: 700, fill: K.mute, a: 'start' });
    s += `<path d="M330 135 V170" stroke="${K.plum}" stroke-width="4"/><path d="M322 166 l8 14 l8 -14z" fill="${K.plum}"/>${T(345, 162, 'rétro-transcription', { fs: 13, fw: 600, fill: K.plum, a: 'start' })}`;
    s += T(40, 214, 'ADNc (cDNA)', { fs: 14, fw: 700, a: 'start' });
    [210, 300, 390].forEach((x, i) => { s += `<rect x="${x}" y="200" width="88" height="24" fill="#cfe0ee" stroke="${K.ink}"/>${T(x + 44, 217, 'exon ' + (i + 1), { fs: 12, fw: 700 })}`; });
    s += T(690, 207, 'pas d\'introns !', { fs: 17, fw: 700, fill: K.ok }) + T(690, 230, 'comparé au gène :', { fs: 13, fill: K.mute });
    // gène
    s += T(40, 278, 'Gène', { fs: 14, fw: 700, a: 'start' }) + T(40, 296, '(ADN génomique)', { fs: 12, fill: K.mute, a: 'start' }) + `<path d="M210 282 H720" stroke="${K.mute}" stroke-width="3"/>`;
    [[210, 1], [370, 2], [560, 3]].forEach(([x, i]) => { s += `<rect x="${x}" y="270" width="80" height="24" fill="#cfe0ee" stroke="${K.ink}"/>${T(x + 40, 287, 'exon ' + i, { fs: 12, fw: 700 })}`; });
    s += T(330, 312, 'intron', { fs: 12, fill: K.mute }) + T(500, 312, 'intron', { fs: 12, fill: K.mute });
    return svgWrap('0 0 900 330', s);
  }
  function figLigase() {
    let s = T(450, 36, 'ADN ligase : relie 5\'-P et 3\'-OH par une liaison phosphodiester', { fs: 18, fw: 700 });
    const frag = (x1, x2, y, c) => `<path d="M${x1} ${y} H${x2}" stroke="${c}" stroke-width="12" stroke-linecap="round"/>`;
    s += frag(80, 400, 120, '#8ea3b5') + frag(500, 820, 120, '#7ea6cc');
    s += T(400, 100, '3\'-OH', { fs: 15, fw: 700, fill: K.ko, a: 'end' }) + T(500, 100, '5\'-P', { fs: 15, fw: 700, fill: K.ok, a: 'start' });
    s += `<ellipse cx="450" cy="190" rx="70" ry="30" fill="${K.plum}"/>${T(450, 196, 'ligase', { fs: 16, fw: 700, fill: '#fff' })}<path d="M450 160 V140" stroke="${K.plum}" stroke-width="3"/>`;
    s += `<rect x="560" y="172" width="80" height="36" rx="8" fill="${K.honey}"/>${T(600, 196, 'ATP', { fs: 16, fw: 700, fill: '#fff' })}${T(660, 196, 'énergie nécessaire', { fs: 14, fill: K.mute, a: 'start' })}`;
    s += `<path d="M450 230 V260" stroke="${K.sage}" stroke-width="3"/><path d="M444 256 l6 12 l6 -12z" fill="${K.sage}"/>`;
    s += frag(80, 820, 300, '#8ea3b5') + `<circle cx="450" cy="300" r="10" fill="${K.ok}"/>` + T(450, 330, 'une seule molécule : liaison phosphodiester créée', { fs: 14, fw: 600, fill: K.ok });
    return svgWrap('0 0 900 345', s);
  }
  function figTubes() {
    let s = `<rect x="250" y="20" width="400" height="120" rx="12" fill="#f4f1ea"/>`;
    ['une ADN polymérase', 'des cations divalents (Mg²⁺)', 'des dNTP', 'l\'ADN à séquencer + une amorce'].forEach((t, i) => { s += T(450, 50 + i * 24, '• ' + t, { fs: 15 }); });
    s += `<path d="M450 140 V170 M150 170 H750" stroke="${K.ink}" stroke-width="3" fill="none"/>`;
    [['ddATP', '#4f7a5a'], ['ddGTP', '#b5523b'], ['ddTTP', '#c2a05a'], ['ddCTP', '#2f5e88']].forEach(([n, c], i) => { const x = 150 + i * 200;
      s += `<path d="M${x} 170 V190" stroke="${K.ink}" stroke-width="3"/><path d="M${x - 6} 186 l6 12 l6 -12z" fill="${K.ink}"/>`;
      s += `<path d="M${x - 26} 205 V285 Q ${x - 26} 312 ${x} 312 Q ${x + 26} 312 ${x + 26} 285 V205" stroke="${K.ink}" stroke-width="4" fill="${c}" fill-opacity=".18"/>${T(x, 340, '+ ' + n, { fs: 17, fw: 700, fill: c })}`; });
    return svgWrap('0 0 900 355', s);
  }
  function figThermo() {
    let s = '';
    // couvercle ouvert
    s += `<path d="M150 40 L650 40 L700 120 L100 120 Z" fill="#dfe4ea" stroke="${K.ink}" stroke-width="3"/><rect x="330" y="62" width="140" height="30" rx="6" fill="#c3cfd9"/>`;
    // corps
    s += `<rect x="80" y="125" width="640" height="210" rx="22" fill="#eef1f4" stroke="${K.ink}" stroke-width="3"/>`;
    // bloc 96 puits
    const x0 = 140, y0 = 150, dx = 32, dy = 21;
    s += `<rect x="${x0 - 22}" y="${y0 - 16}" width="${12 * dx + 22}" height="${8 * dy + 16}" rx="8" fill="#c8ced6"/>`;
    for (let r = 0; r < 8; r++) { s += T(x0 - 13, y0 + r * dy + 6, 'ABCDEFGH'[r], { fs: 10, fw: 700, fill: K.mute });
      for (let c = 0; c < 12; c++) s += `<circle cx="${x0 + 8 + c * dx}" cy="${y0 + r * dy + 2}" r="8" fill="${(r * 12 + c) % 7 === 0 ? '#f3d38c' : '#f8f9fa'}" stroke="#8a95a3" stroke-width="1.5"/>`; }
    for (let c = 0; c < 12; c++) s += T(x0 + 8 + c * dx, y0 - 4, String(c + 1), { fs: 9, fill: K.mute });
    // écran
    s += `<rect x="560" y="150" width="140" height="160" rx="10" fill="${K.plum}"/>${T(630, 180, 'cycle 12/30', { fs: 12, fill: '#fff' })}${T(630, 214, '95 °C', { fs: 22, fw: 700, fill: '#f3d38c' })}`;
    s += `<path d="M575 280 h20 l8 -26 h22 l8 18 h20 l6 -10 h16" stroke="#9cc0e0" stroke-width="3" fill="none"/>`;
    s += T(400, 365, 'Thermocycleur : bloc chauffant de 96 puits (8 rangées × 12 colonnes)', { fs: 14, fill: K.mute });
    return svgWrap('0 0 800 380', s);
  }
  function figAmorcesGene() {
    const C = { b: '#2f6fa8', g: '#4f7a5a', o: '#d08a3a', r: '#b5523b' };
    const yT = 100, yB = 225;
    let s = '';
    s += `<path d="M60 ${yT} H840" stroke="${K.ink}" stroke-width="4"/><path d="M60 ${yB} H840" stroke="${K.ink}" stroke-width="4"/>`;
    s += T(40, yT + 6, "5'", { fs: 17, fw: 700 }) + T(860, yT + 6, "3'", { fs: 17, fw: 700 }) + T(40, yB + 6, "3'", { fs: 17, fw: 700 }) + T(860, yB + 6, "5'", { fs: 17, fw: 700 });
    s += `<rect x="150" y="${yT - 15}" width="180" height="30" rx="4" fill="#fff" stroke="${K.ink}" stroke-width="2"/>${T(240, yT + 6, 'Promoteur minimum', { fs: 13, fw: 700 })}`;
    s += `<rect x="670" y="${yT - 15}" width="100" height="30" rx="4" fill="#fff" stroke="${K.ink}" stroke-width="2" stroke-dasharray="5 4"/>${T(720, yT + 6, 'AATAAA', { fs: 14, fw: 700 })}`;
    s += `<rect x="150" y="${yB - 15}" width="180" height="30" rx="4" fill="#fff" stroke="${K.ink}" stroke-width="2"/><rect x="670" y="${yB - 15}" width="100" height="30" rx="4" fill="#fff" stroke="${K.ink}" stroke-width="2" stroke-dasharray="5 4"/>`;
    s += `<path d="M300 ${yT - 15} V48" stroke="${K.ink}" stroke-width="3"/><path d="M294 ${yT - 24} l6 10 l6 -10z" fill="${K.ink}"/>${T(300, 40, 'TSS', { fs: 14, fw: 700 })}`;
    const ar = (x1, x2, y, dir, c) => (dir > 0
      ? `<path d="M${x1} ${y} H${x2 - 10}" stroke="${c}" stroke-width="7"/><path d="M${x2 - 14} ${y - 10} l16 10 l-16 10z" fill="${c}"/>`
      : `<path d="M${x1 + 10} ${y} H${x2}" stroke="${c}" stroke-width="7"/><path d="M${x1 + 14} ${y - 10} l-16 10 l16 10z" fill="${c}"/>`);
    const t = yT + 32, b = yB + 32;
    // brin du haut (amorces qui s'y hybrident)
    s += ar(190, 252, t, 1, C.b) + ar(345, 407, t, -1, C.g) + ar(500, 562, t, -1, C.o) + ar(600, 662, t, -1, C.r);
    // brin du bas
    s += ar(78, 140, b, 1, C.g) + ar(282, 344, b, 1, C.r) + ar(400, 462, b, 1, C.o) + ar(690, 752, b, -1, C.b);
    s += T(450, 300, "Une amorce dessinée sous un brin s'hybride sur ce brin · la flèche va de son extrémité 5' vers son extrémité 3'", { fs: 13, fill: K.mute });
    return svgWrap('0 0 900 315', s);
  }
  FIGS.amorces_gene = figAmorcesGene;
  FIGS.thermo = figThermo;
  FIGS.rt = figRT; FIGS.ligase = figLigase; FIGS.tubes = figTubes;
  FIGS.plan_I = () => planHTML('I'); FIGS.plan_II = () => planHTML('II');
  TABLES.pcrres = { plain: true, head: ['Nombre de cycles', 'Temps', 'Quantité d\'ADN', 'Fragments de taille variable'], rows: [
    ['10', '30 min', '2¹⁰ = 1024 molécules (1,7·10⁻²¹ mol)', '20'], ['20', '1 h', '2²⁰ ≈ 1 million (1,7·10⁻¹⁸ mol)', '40'], ['30', '1 h 30', '2³⁰ ≈ 1 milliard (1,8·10⁻¹⁵ mol)', '60'], ['60', '3 h', '2⁶⁰ ≈ 1,15·10¹⁸ (1,9·10⁻⁶ mol)', '120']] };
  TABLES.hdebit = { plain: true, head: ['Séquençage', 'Taille d\'ADN lue', 'Durée'], rows: [['Sanger (gel)', '1 kb', '6 à 8 heures'], ['Sanger capillaire', '300 kb', '3 heures'], ['Haut débit (Illumina)', '1 Gb', '1 lecture sur toute la lame (flow cell)']] };
})();

window.COURSE = {
 "title": "Techniques de biologie moléculaire",
 "subtitle": "UE2-B3 · cours interactif",
 "capBold": ["HaeIII", "EcoRI", "palindrome", "franches", "cohésives", "vecteur", "plasmide", "enzyme de restriction", "ligase", "ADN recombinant", "Transformation", "antibiotique", "clones", "amorces", "amorce", "dénaturation", "hybridation", "synthèse", "ADN polymérase", "dNTP", "ddNTP", "ddATP", "ddCTP", "ddGTP", "ddTTP", "3'-OH", "matrice", "brin synthétisé", "complémentaire", "bande", "taille exacte", "taille variable"],
 "style": "cards",
 "chrono": 45,
 "chrono_revote": 15,
 "parts": ["Accueil", "I.1 · Outils", "I.2 · Clonage in vivo", "I.3 · Clonage in vitro (PCR)", "II.1-2 · Séquençage", "II.3 · Résultat / analyse", "II.4 · Haut débit"],
 "steps": [
  { "part": 0, "kind": "join", "min": 2, "title": "Rejoindre la séance",
    "notes": ["Projette cet écran dès l'entrée des étudiants : ils scannent le QR code.", "Rappel : le Ch7.1 (organisation du génome) est à apprendre seul."] },

  { "part": 1, "kind": "explain", "min": 5, "title": "I. Amplification de l'ADN · 1. Outils moléculaires",
    "slides": [
     { "t": "Plan du cours", "fig": "plan_I" },
     { "t": "a. Les ADN vecteurs", "table": "vecteurs",
       "memo": ["Vecteur = ADN (linéaire ou circulaire) sur lequel on ajoute le fragment à amplifier : l'insert", "Le plus facile d'utilisation : le plasmide"],
       "notes": ["Poly diapo 13 pour les tailles d'insert."] },
     { "t": "b. Les enzymes de restriction",
       "pts": ["<b>Endonucléases de type II</b>, d'origine <b>bactérienne</b> (mécanisme de défense, années 60, prix Nobel 1978)",
               "Coupent l'ADN <b>double brin</b>, fonctionnent en <b>dimère</b>",
               "Reconnaissent un site précis de <mark>4 à 10 pb</mark> : le <b>site de restriction</b>",
               "Le site est un <b>palindrome</b> : même séquence lue 5'→3' sur les deux brins",
               "Besoin de <mark>Mg²⁺</mark>"],
       "notes": ["Analogie du poly : KAYAK, RESSASSER. Mais pour l'ADN, le palindrome se lit sur les DEUX brins, chacun de 5' vers 3'."] },
     { "t": "b. Extrémités franches ou cohésives", "anim": "restriction",
       "notes": ["Les extrémités cohésives sont la clé du clonage in vivo."] },
     { "t": "c. La reverse transcriptase (RT)", "fig": "rt",
       "notes": ["Hors poly (ton cours) : le poly cite seulement la RT-PCR (« amplification d'ARN »).", "Intérêt : l'ADNc n'a pas d'introns ; inséré dans un plasmide, la bactérie peut le transcrire ET le traduire en protéine."] },
     { "t": "d. L'ADN ligase", "fig": "ligase",
       "notes": ["Hors poly (ton cours) : le poly montre seulement « ligase » sur le schéma du clonage."] }
    ] },

  { "part": 2, "kind": "explain", "min": 3, "title": "2. Clonage in vivo",
    "slides": [
     { "t": "2. Clonage in vivo : dans une bactérie", "anim": "clonage",
       "notes": ["Poly : le clonage bactérien (années 70) repose sur le plasmide, qui se réplique indépendamment du chromosome en plusieurs copies, et sur les divisions rapides des bactéries."] },
     { "t": "Le plasmide pUC19", "fig": "plasmide",
       "notes": ["Insiste sur le gène de sélection (antibiotique) et le gène rapporteur (lacZ)."] }
    ] },
  { "part": 2, "kind": "order", "min": 2, "title": "Remets le clonage dans l'ordre",
    "q": "Classe les étapes du clonage in vivo.",
    "items": ["Couper le vecteur et l'ADN d'intérêt avec la même enzyme de restriction",
              "Relier l'insert au vecteur avec la ligase",
              "Transformation : faire entrer le plasmide dans une bactérie hôte",
              "Sélectionner les bactéries transformées avec l'antibiotique",
              "Laisser les bactéries se diviser : clones identiques",
              "Lyser les bactéries et purifier les plasmides"],
    "start": [2, 5, 0, 4, 1, 3],
    "notes": ["Piège attendu : la ligase avant la coupure, ou la sélection après la purification."] },

  { "part": 3, "kind": "explain", "min": 7, "title": "3. Clonage in vitro : la PCR",
    "slides": [
     { "t": "a. Objectif de la PCR",
       "pts": ["<b>PCR</b> = Polymerase Chain Reaction (Kary Mullis, <mark>1986</mark>, Nobel 1993)",
               "<b>Amplifier</b> la quantité d'ADN de départ <b>sans système vivant</b>, de manière <b>ciblée</b>",
               "On copie la réplication avec : des <b>dNTP</b>, une ADN polymérase résistante à la chaleur (<b>Taq polymérase</b>) et <b>deux amorces</b>",
               "À chaque cycle, l'ADN est répliqué une fois : pour n cycles, <mark>2ⁿ ADN</mark>"],
       "notes": ["Hors poly (ton cours) : la Taq polymérase et la formule 2ⁿ. Le poly dit « synthèse exponentielle »."] },
     { "t": "a. Les amorces", "fig": "amorces",
       "pts": ["Petites séquences d'ADN de <mark>18 à 25 nt</mark>, <b>complémentaires et antisens</b> de la séquence cible"],
       "notes": ["Exemple repris du poly (diapo 20)."] },
     { "t": "b. Technique : un cycle de PCR", "anim": "pcr",
       "notes": ["Hors poly (ton cours) : environ 1 min par étape.", "Poly : cycle 25 = 33 millions de copies exactes et 50 fragments de taille variable."] },
     { "t": "c. Résultats", "table": "pcrres",
       "memo": ["2ⁿ molécules après n cycles", "seulement 2n fragments de taille variable", "Cycle 25 (poly) : 33 millions de copies exactes, 50 de taille variable"],
       "notes": ["Tableau de ton cours (hors poly), à 3 min par cycle."] },
     { "t": "c. Applications de la PCR", "fig": "thermo", "side": true,
       "pts": ["Amplifie des fragments de <mark>moins de 5 kb</mark>",
               "<b>RT-PCR</b> : amplification d'<b>ARN</b> (copié d'abord en ADNc par la RT)",
               "Réalisée dans des automates : les <b>thermocycleurs</b>"],
       "notes": ["Le poly cite aussi la qPCR (PCR quantitative), retirée de la diapo."] }
    ] },
  { "part": 3, "kind": "poll", "min": 3, "title": "d. Que peut-on vous demander ? Exercice 1",
    "q": "Quelle paire d'amorces permet d'amplifier cette séquence par PCR ? (un seul brin représenté ; régions ciblées en couleur)",
    "fig": "seqpcr", "draw": true,
    "opts": ["5'-GGTAAGGGCG-3' et 5'-AGTGCAGATT-3'",
             "5'-GGTAAGGGCG-3' et 5'-AATCTGCACT-3'",
             "5'-CCATTCCCGC-3' et 5'-AATCTGCACT-3'",
             "5'-GGTAAGGGCG-3' et 5'-TCACGTCTAA-3'"],
    "good": 1,
    "ex": "Amorce 1 = début du brin, tel quel : 5'-GGTAAGGGCG-3'. Amorce 2 = complémentaire ET inversée de la fin (AGTGCAGATT) : 5'-AATCTGCACT-3'. D écrit le complémentaire sans l'inverser.",
    "notes": ["Ton exercice 1. Méthode : amorce sens = copie du début ; amorce antisens = complémentaire inversé de la fin, toujours écrite 5'→3'."] },
  { "part": 3, "kind": "match", "min": 3, "seconds": 60, "title": "d. Que peut-on vous demander ? Exercice 2", "fig": "amorces_gene",
    "q": "Plusieurs couples d'amorces (une couleur = un couple) peuvent s'hybrider sur ce gène eucaryote. Par quel couple chaque région est-elle amplifiée ?",
    "pairs": [["Le promoteur minimum est amplifié par le couple…", "Amorces vertes"],
              ["La séquence codante est amplifiée par le couple…", "Amorces rouges"]],
    "options": ["Amorces bleues", "Amorces vertes", "Amorces orange", "Amorces rouges"],
    "ex": "Un couple fonctionne si l'amorce du brin du bas pointe vers la droite, celle du brin du haut vers la gauche, et que la première est à gauche de la seconde : on amplifie ce qui est entre les deux.",
    "notes": ["1 minute. Ton exercice 2, redessiné d'après ta diapo 17 (une couleur = un couple). Sur le téléphone, les 4 couleurs sont proposées.", "À expliquer ensuite : les orange n'amplifient qu'une partie de la séquence codante ; les bleues sont mal orientées et n'amplifient rien.", "Règle à faire dire : sur le brin du haut (5'→3'), une amorce utile pointe vers la gauche ; sur le brin du bas, vers la droite."] },
  { "part": 3, "kind": "peer", "min": 3, "title": "Vote, analyse, revote",
    "q": "Quelle(s) est (sont) la (les) proposition(s) juste(s) ?",
    "items": ["Un cycle de PCR comprend une dénaturation à 95 °C, une hybridation des amorces à 55-65 °C et une synthèse à 75 °C.",
              "Les amorces sont des séquences d'ADN de 18 à 25 nucléotides, complémentaires et antisens de la séquence cible.",
              "Après 25 cycles, toutes les molécules produites ont exactement la taille de la séquence ciblée.",
              "La PCR permet d'amplifier des fragments d'ADN de plus de 50 kb.",
              "La RT-PCR permet d'amplifier de l'ARN."],
    "ok": "ABE",
    "ex": ["Les 3 étapes et leurs températures.", "Définition du poly.", "Il reste 50 fragments de taille variable.", "La PCR amplifie moins de 5 kb.", "RT-PCR = amplification d'ARN."],
    "notes": ["La C piège souvent : fais-la défendre par quelqu'un qui l'a cochée."] },

  { "part": 4, "kind": "explain", "min": 5, "title": "II. Séquençage de l'ADN · 1. Outils · 2. Technique",
    "slides": [
     { "t": "Plan du cours", "fig": "plan_II" },
     { "t": "1. Objectif et outils moléculaires",
       "pts": ["<b>Objectif</b> : obtenir la séquence en nucléotides d'un fragment d'ADN inconnu",
               "Méthode de <b>Sanger</b> (<mark>1977</mark>, Nobel 1980) : on utilise encore l'activité d'une <b>ADN polymérase</b>",
               "On dénature l'ADN (simple brin), puis on ajoute : une ADN polymérase, une <b>amorce</b> (3'-OH libre), des <b>dNTP</b>",
               "+ un <b>ddNTP</b> (didésoxynucléotide, <b>pas de 3'-OH</b>) marqué par fluorescence : il <b>arrête</b> la polymérisation"],
       "notes": ["Poly : 2 techniques développées en parallèle, la dégradation chimique (Maxam et Gilbert) et la synthèse enzymatique sélective (Sanger)."] },
     { "t": "2. Technique : 4 réactions", "fig": "tubes",
       "notes": ["Hors poly (ton cours) : les cations divalents. Le poly précise : ADN polymérase I, nucléotides en excès, ddNTP marqué (³⁵S ou fluorescence)."] },
     { "t": "2. Technique : pourquoi la synthèse s'arrête", "anim": "sanger",
       "notes": ["Exemple du poly (diapos 22-23) : matrice 5'-CGAATGCTCAGGCCATCATC-3'.", "Dernière étape : les 20 fragments rangés par taille et reliés à leur bande du gel ; la diapo suivante lit ce gel."] }
    ] },

  { "part": 5, "kind": "explain", "min": 4, "title": "3. Résultat / Analyse",
    "slides": [
     { "t": "3. Lire le gel", "anim": "gel",
       "notes": ["Le piège classique : la séquence lue sur le gel est celle du brin synthétisé, pas de la matrice."] },
     { "t": "3. Améliorations et lecture d'une mutation", "fig": "chromato",
       "pts": ["ddNTP <b>fluorescents</b> · <b>électrophorèse capillaire</b> · analyse informatique · lecture de <mark>1000 pb maximum</mark>",
               "<b>Homozygote</b> : un seul pic, autre base · <b>hétérozygote</b> : 2 pics superposés (N)"] }
    ] },
  { "part": 5, "kind": "poll", "min": 3, "title": "Lis le gel",
    "q": "Voici un gel de séquençage Sanger. Quelle est la séquence du brin matrice ?",
    "fig": "gelquiz",
    "opts": ["5'-AGTCCATG-3'", "5'-TCAGGTAC-3'", "5'-CATGGACT-3'", "5'-GTACCTGA-3'"],
    "good": 2,
    "ex": "De bas en haut, on lit le brin synthétisé : 5'-AGTCCATG-3' (piège A). La matrice est son complémentaire antiparallèle : 3'-TCAGGTAC-5', soit 5'-CATGGACT-3'.",
    "notes": ["B = complémentaire écrit dans le mauvais sens ; D = lecture de haut en bas.", "Fais-les écrire sur la fiche avant de voter."] },
  { "part": 5, "kind": "peer", "min": 3, "title": "Vote, analyse, revote",
    "q": "Quelle(s) est (sont) la (les) proposition(s) juste(s) ?",
    "items": ["Un ddNTP ne possède pas de groupement 3'-OH : son incorporation arrête la synthèse.",
              "Chaque réaction de séquençage contient les 4 dNTP en excès et un seul type de ddNTP marqué.",
              "Sur le gel, les fragments les plus grands migrent le plus loin.",
              "La lecture du gel donne directement la séquence du brin matrice.",
              "Le séquençage Sanger permet de lire au maximum environ 1000 pb."],
    "ok": "ABE",
    "ex": ["Pas de 3'-OH : plus de liaison phosphodiester possible.", "Comme dans le poly.", "Ce sont les plus petits.", "On lit le brin synthétisé : il faut prendre le complémentaire.", "1000 pb maximum."],
    "notes": ["La D est le piège n° 1 des examens."] },

  { "part": 6, "kind": "explain", "min": 3, "title": "4. Séquençage haut débit",
    "slides": [
     { "t": "4. Séquençage haut débit (quelques mots)", "fig": "ngs",
       "pts": ["Années <mark>2000</mark> : <b>millions de fragments</b> lus en parallèle, séquences <b>courtes</b> (50-150 pb)",
               "<b>PCR en pont</b> · lecture <b>pendant la synthèse</b> par <b>fluorescence</b> · un génome complet en <mark>24 h</mark>"] },
     { "t": "4. Quel est l'intérêt ? La rapidité", "table": "hdebit",
       "memo": ["Explosion du nombre de génomes séquencés", "Coût d'un génome humain : ≈ 100 millions de dollars en 2001, moins de 1000 dollars aujourd'hui"],
       "notes": ["Tableau de ton cours (hors poly).", "Les chiffres de coût sont lus sur le graphique du NIH (poly diapo 36)."] }
    ] },
  { "part": 6, "kind": "thanks", "min": 1, "title": "Merci pour votre attention !", "fig": "merci_pcr",
    "notes": ["Sur les téléphones : « Merci ! Révise avec ta fiche et le lexique. »"] }
 ]
};
