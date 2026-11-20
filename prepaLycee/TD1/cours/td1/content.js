/* TD PrépaLycée · Biologie cellulaire · révision B1, B2, B3
   Pour modifier une question, changez le texte ici (icône crayon sur GitHub, puis « Commit »).
   Types utilisés : join, teams (6 équipes), tqcm (QCM d'équipe chronométré), explain, tap, classify, escape, case (enquête à indices), scores (classement général), lightning (manche éclair).
   Points : `pts` dans chaque étape notée. */
/* Schémas du TD « Dedans ou dehors ? » (topologie des membranes) */
(function () {
  const NUDE = '#e8c4ae', CORE = '#fbf1ea', SUG = '#7f9f52', PROT = '#9aa7c7', CLA = '#c2a05a';
  const band = (d) => `<path d="${d}" fill="none" stroke="${NUDE}" stroke-width="22" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${CORE}" stroke-width="9" stroke-linejoin="round"/>`;
  // glycoprotéine : centrée en (x,y), sucres orientés selon l'angle a (radians, 0 = vers le haut)
  const gp = (x, y, a, sugars = true) => {
    const deg = a * 180 / Math.PI;
    const tree = sugars ? `<path d="M0 -16 V-30 M0 -30 L-9 -42 M0 -30 L9 -42" stroke="${SUG}" stroke-width="2.5"/><circle cx="0" cy="-30" r="5" fill="${SUG}"/><circle cx="-9" cy="-43" r="5" fill="${SUG}"/><circle cx="9" cy="-43" r="5" fill="${SUG}"/>` : '';
    return `<g transform="translate(${x} ${y}) rotate(${deg})"><rect x="-7" y="-17" width="14" height="34" rx="6" fill="${PROT}" stroke="#5b6a8f" stroke-width="1.5"/>${tree}</g>`;
  };
  const clath = (x, y, a) => { const deg = a * 180 / Math.PI; return `<g transform="translate(${x} ${y}) rotate(${deg})"><path d="M0 14 V30 M0 30 L-8 38 M0 30 L8 38" stroke="${CLA}" stroke-width="3" stroke-linecap="round"/></g>`; };
  const cargo = (x, y, r = 14) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#d9b8ec" stroke="#9a71a9" stroke-width="2"/>`;
  const labels = T(30, 40, 'Milieu extracellulaire', { fs: 17, fw: 600, fill: K.mute, a: 'start' }) + T(30, 360, 'Cytosol', { fs: 17, fw: 600, fill: K.mute, a: 'start' });
  const flat = band('M10 110 H890');
  const vesicle = (cx, cy, r, inward, coat, fill = '#fff') => {
    let s = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>` + band(`M${cx - r} ${cy} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0`);
    [-60, 60, 180].forEach((d) => { const a = d * Math.PI / 180; const px = cx + r * Math.sin(a), py = cy - r * Math.cos(a); s += gp(px, py, inward ? a + Math.PI : a); });
    if (coat) for (let d = 0; d < 360; d += 30) { const a = d * Math.PI / 180; s += clath(cx + r * Math.sin(a), cy - r * Math.cos(a), a + Math.PI); }
    return s;
  };
  function drawTopo(k) {
    let s = labels;
    if (k === 0) {
      s += flat + gp(210, 110, 0) + gp(470, 110, 0) + gp(720, 110, 0);
      s += `<path d="M340 99 V80 M340 80 L332 70 M340 80 L348 70" stroke="${SUG}" stroke-width="2.5"/><circle cx="332" cy="68" r="5" fill="${SUG}"/><circle cx="348" cy="68" r="5" fill="${SUG}"/>`;
      s += T(340, 150, 'glycolipide', { fs: 13, fill: K.mute }) + T(470, 165, 'glycoprotéine', { fs: 13, fill: K.mute });
      s += T(640, 250, 'Les sucres : toujours côté extérieur', { fs: 20, fw: 700, fill: SUG });
    }
    if (k === 1) {
      const d = 'M10 110 H330 C390 110 380 270 450 270 C520 270 510 110 570 110 H890';
      s += band(d) + gp(450, 270, 0) + cargo(450, 195, 11) + gp(200, 110, 0) + gp(730, 110, 0);
      [[392, 190, -1.15], [410, 240, -0.6], [450, 270, 0], [490, 240, 0.6], [508, 190, 1.15]].forEach(([x, y, a]) => { s += clath(x, y, a); });
      s += T(450, 345, 'clathrine (face cytosolique)', { fs: 15, fw: 600, fill: CLA });
      s += T(600, 195, 'Le creux du puits', { fs: 17, fw: 700, a: 'start' }) + T(600, 219, '= encore l’extérieur', { fs: 17, fw: 700, fill: SUG, a: 'start' });
    }
    if (k === 2) {
      s += flat + gp(200, 110, 0) + gp(730, 110, 0) + vesicle(450, 250, 66, true, true) + cargo(450, 250, 9);
      s += T(600, 220, 'Les sucres pointent', { fs: 17, fw: 700, a: 'start' }) + T(600, 244, 'vers la lumière de la vésicule', { fs: 17, fw: 700, fill: SUG, a: 'start' }) + T(600, 268, '= un morceau d’extérieur enfermé', { fs: 15, fill: K.mute, a: 'start' });
    }
    if (k === 3) {
      s += flat + gp(200, 110, 0) + gp(730, 110, 0) + vesicle(450, 250, 66, true, false, '#fde3ea');
      [[-20, -12], [14, -18], [0, 14], [-18, 18], [22, 10]].forEach(([dx, dy]) => { s += `<circle cx="${450 + dx}" cy="${250 + dy}" r="5" fill="#9a71a9"/>`; });
      s += T(450, 345, 'Lysosome : pH acide', { fs: 16, fw: 700, fill: '#b5523b' });
      s += T(600, 230, 'Digestion dans la lumière', { fs: 17, fw: 700, a: 'start' }) + T(600, 254, '→ petites molécules réutilisables', { fs: 15, fill: K.mute, a: 'start' });
    }
    if (k === 4) {
      const d = 'M10 110 H600 C628 110 618 175 655 175 C692 175 682 110 710 110 H890';
      s += band(d) + gp(655, 175, 0) + gp(200, 110, 0);
      s += vesicle(330, 270, 52, true, false) + `<path d="M400 245 C480 230 560 210 610 185" stroke="${K.mute}" stroke-width="2.5" fill="none" stroke-dasharray="6 5"/><path d="M612 184 l-12 0 l6 10z" fill="${K.mute}"/>`;
      s += T(330, 355, 'vésicule venue du Golgi', { fs: 14, fill: K.mute });
      s += T(655, 240, 'Après la fusion :', { fs: 16, fw: 700 }) + T(655, 262, 'les sucres sont dehors', { fs: 16, fw: 700, fill: SUG });
    }
    return svgWrap('0 0 900 380', s);
  }
  ANIMS.topo = { draw: drawTopo, caps: [
    "Membrane plasmique : les sucres des glycoprotéines et des glycolipides sont toujours tournés vers le milieu extracellulaire.",
    "Endocytose : la clathrine s'assemble sur la face cytosolique et creuse un puits. Le creux du puits, c'est encore l'extérieur.",
    "La vésicule se détache : sa lumière est un morceau d'extérieur enfermé. Les sucres pointent vers la lumière, jamais vers le cytosol.",
    "La clathrine se détache ; la vésicule devient endosome puis rejoint le lysosome : le contenu est digéré dans une lumière acide.",
    "Dans l'autre sens : les sucres ajoutés dans la lumière du RE et du Golgi restent dans la lumière des vésicules… et se retrouvent dehors après la fusion.",
  ] };
  window.TOPO = { band, gp, vesicle, flat, labels, cargo };
})();

window.COURSE = {
  title: "De la membrane au cytosquelette",
  subtitle: "PrépaLycée · Biologie cellulaire · TD de révision B1, B2, B3",
  listen: "Regarde l'écran : la prochaine activité arrive.",
  bye: "Bravo ! Révise avec les fiches B1, B2 et B3 et les vidéos de Willy.",
  /* Couleurs de la prépaLycée biologie (charte formaScience : bleu profond, sauge, rose nude) */
  theme: { '--bg': '#f6f6f2', '--surface': '#ffffff', '--ink': '#2b3742', '--muted': '#6b7280', '--line': '#e3e5df',
    '--sage': '#a6ab99', '--sage-ink': '#2b3742', '--sage-soft': '#eef0e9', '--honey': '#a3451a', '--nude': '#c2a594',
    '--plum': '#2b3742', '--plum-soft': '#eef0e9', '--btn': '#2b3742', '--btn2': '#a6ab99', '--banner': '#c2a594',
    '--ok': '#4f7a5a', '--ok-soft': '#e5efe6', '--ko': '#b5523b', '--ko-soft': '#f7e6e1' },
  /* Les 6 équipes : un téléphone par équipe, pour tout le TD */
  teams: [
    { id: 'ribo', n: 'Les Ribosomes', c: '#a3451a' }, { id: 'golgi', n: 'Les Golgi', c: '#c2a05a' },
    { id: 'lyso', n: 'Les Lysosomes', c: '#9a71a9' }, { id: 'centro', n: 'Les Centrosomes', c: '#2f5e88' },
    { id: 'vesi', n: 'Les Vésicules', c: '#7f9f52' }, { id: 'kine', n: 'Les Kinésines', c: '#c2a594' },
  ],
  parts: ['Accueil', '1 · QCM', '2 · Dedans ou dehors ?', '3 · Escape game', '4 · Enquêtes', '5 · Manche éclair'],
  steps: [
    { part: 0, kind: 'join', min: 2, title: 'Rejoindre la séance',
      notes: ["Seul le téléphone de chaque équipe a besoin de scanner le QR code (6 téléphones)."] },
    { part: 0, kind: 'teams', min: 2, title: 'Formez vos 6 équipes', q: "Choisissez votre équipe",
      rules: 'Total sur 100 : QCM 28 pts (7 par QCM) · Dedans ou dehors 12 pts · Escape game 20 pts · Enquêtes 40 pts',
      notes: ["25 élèves → 6 équipes de 4 (une de 5), formées avec les voisins : personne ne bouge.", "Chaque équipe choisit son nom à l'écran ; une équipe déjà prise est grisée sur les téléphones.", "Si une carte affiche « 2 téléphones », demande à l'équipe d'en garder un seul (c'est le meilleur score des deux qui compte)."] },

    /* ---------------- PARTIE 1 : QCM ratés, en équipe (1 minute chacun) ---------------- */
    { part: 1, kind: 'tqcm', seconds: 60, pts: 7, min: 3, title: 'B1 · Synthèse et acheminement',
      q: "Concernant la synthèse et l'acheminement des molécules, quelle(s) proposition(s) est (sont) exacte(s) ?",
      items: ["Le monoxyde d'azote (NO) nécessite l'hydrolyse d'un ATP pour entrer dans la cellule contre son gradient.",
        "La macromolécule digérée dans le système endolysosomal fournit de petites molécules réutilisables par la cellule.",
        "L'appareil de Golgi est le site d'incorporation des produits de sécrétion volumineux avant leur exocytose.",
        "Juste après la perte du manteau de clathrine, les glycoprotéines d'une vésicule d'endocytose orientent leurs sucres vers la lumière de la vésicule.",
        "Une protéine à ancre GPI est insérée dans la membrane par un domaine transmembranaire hydrophobe."],
      ok: 'BCD',
      ex: ["Le NO est un gaz hydrophobe : diffusion simple, sans protéine ni ATP.",
        "Dégradation progressive dans des compartiments de plus en plus acides.",
        "Le Golgi enferme les produits de sécrétion dans des vésicules qui fusionnent avec la membrane.",
        "La lumière de la vésicule est un morceau d'extérieur enfermé : les sucres, toujours côté extracellulaire, y pointent (voir la partie 2).",
        "L'ancre GPI est un lipide : la protéine ne s'enfonce que partiellement dans le feuillet externe (intrinsèque extracellulaire)."],
      notes: ["Question B1Q20 du Bilan B1 : 60 % d'erreurs.", "ATTENTION : dans Chamilo, la proposition D est corrigée FAUX. Ici elle est notée JUSTE (les sucres sont bien dans la lumière de la vésicule, qui est topologiquement l'extérieur). À trancher avant la séance ; pour revenir à la clé Chamilo, mettre ok: 'BC'.", "La D sert de transition vers la partie 2 : laisse une équipe défendre son choix avant la correction."] },
    { part: 1, kind: 'tqcm', seconds: 60, pts: 7, min: 3, title: 'B1 · Les protéines membranaires',
      q: "Concernant les protéines membranaires, quelles propositions sont INEXACTES ?",
      items: ["Les protéines extrinsèques sont fixées à la surface de la membrane par des liaisons faibles.",
        "Toutes les protéines intrinsèques traversent entièrement la membrane.",
        "Les protéines intrinsèques sont insérées dans l'épaisseur de la bicouche, en contact direct avec les acides gras.",
        "Les chaînes de sucres des glycoprotéines transmembranaires peuvent être orientées vers le cytosol.",
        "Les protéines extrinsèques peuvent se trouver du côté extracellulaire."],
      ok: 'BD',
      ex: ["Exacte : liaisons faibles, sans pénétrer la bicouche.",
        "Inexacte : certaines ne s'enfoncent que dans un feuillet (ancre GPI) ; seules les transmembranaires traversent.",
        "Exacte : elles sont au contact des chaînes d'acides gras.",
        "Inexacte : les sucres sont toujours côté extracellulaire, jamais côté cytosol.",
        "Exacte : extrinsèques intracellulaires ou extracellulaires."],
      notes: ["Question B1Q02 : on demande les INEXACTES, piège fréquent de lecture. Fais relire la consigne à voix haute.", "Les bonnes réponses affichées en vert sont donc les propositions FAUSSES (B et D)."] },
    { part: 1, kind: 'tqcm', seconds: 60, pts: 7, min: 3, title: 'B2 · Golgi et tri',
      q: "Concernant l'appareil de Golgi et le tri des protéines, quelle(s) proposition(s) est (sont) exacte(s) ?",
      items: ["Les protéines entrent dans l'appareil de Golgi par la face trans, tournée vers la membrane plasmique.",
        "Les enzymes lysosomales sont reconnues dans le réseau trans-golgien grâce à l'étiquette mannose-6-phosphate.",
        "La sécrétion constitutive ne nécessite aucun signal et existe dans toutes les cellules.",
        "L'O-glycosylation se fait sur l'azote d'une asparagine.",
        "L'insuline est libérée par sécrétion régulée, quand la glycémie augmente."],
      ok: 'BCE',
      ex: ["Entrée par la face cis (convexe, côté REG), sortie par la face trans.",
        "Le récepteur au M6P du TGN les envoie vers les lysosomes.",
        "En continu, sans signal (ex. : collagène).",
        "O-glycosylation : sur le OH de Ser ou Thr, dans le Golgi. L'Asn (azote N), c'est la N-glycosylation.",
        "Stockée en granules, libérée sur signal."],
      notes: ["EMPLACEMENT PROVISOIRE : à remplacer par la question la plus ratée du Bilan B2 (statistiques des questions dans Chamilo)."] },
    { part: 1, kind: 'tqcm', seconds: 60, pts: 7, min: 3, title: 'B3 · Le cytosquelette',
      q: "Concernant le cytosquelette, quelle(s) proposition(s) est (sont) exacte(s) ?",
      items: ["Un filament d'actine s'allonge plus vite à son extrémité (+).",
        "La polymérisation des filaments intermédiaires nécessite de l'ATP.",
        "La kinésine transporte ses cargos vers l'extrémité (+) des microtubules.",
        "Un microtubule qui perd sa coiffe GTP se défait très vite : c'est la catastrophe.",
        "L'anneau qui coupe la cellule en deux à la fin de la division est formé de microtubules."],
      ok: 'ACD',
      ex: ["Filament polarisé : (+) rapide, (−) lent.",
        "Ni ATP ni GTP pour les filaments intermédiaires.",
        "Transport antérograde ; la dynéine va vers le (−).",
        "Sans coiffe GTP, les protofilaments s'écartent comme des pelures.",
        "Anneau contractile = actine + myosine II."],
      notes: ["EMPLACEMENT PROVISOIRE : à remplacer par la question la plus ratée du Bilan B3."] },

    { part: 1, kind: 'scores', min: 1, title: 'Classement après les QCM', legend: '7 points par QCM entièrement juste (28 points au total).' },

    /* ---------------- PARTIE 2 : DEDANS OU DEHORS ? ---------------- */
    { part: 2, kind: 'explain', min: 4, title: 'Dedans ou dehors ?',
      slides: [
        { t: 'À vous de manipuler',
          pts: ["Matériel par binôme : <b>une feuille</b> (la membrane) et <b>un feutre</b>", "Dessinez des petits sucres sur <b>une seule face</b> : c'est la face <b>extracellulaire</b>", "Feuille à plat, sucres vers le haut : c'est la <b>membrane plasmique</b>", "Avec le doigt, <b>creusez</b> la feuille vers le bas : c'est l'<b>endocytose</b>", "Refermez la feuille en <b>boule</b> : où sont passés les sucres ?"],
          notes: ["Prévoir des feuilles de brouillon. Variante qui marche très bien : une chaussette qu'on retourne.", "Laisse 2 minutes, puis demande à 2 ou 3 binômes ce qu'ils observent avant de lancer l'animation."] },
        { t: 'Ce qu\'il fallait voir', anim: 'topo', ratio: 2.37,
          notes: ["Insiste sur la règle : une face de membrane ne change JAMAIS de côté.", "Lien B2 : les sucres sont ajoutés dans la lumière du RE et du Golgi, donc ils finissent dehors."] },
        { t: 'La règle à retenir',
          pts: ["<b>Lumière</b> du RE, du Golgi, des vésicules, des endosomes et des lysosomes = côté <b>extérieur</b>", "<b>Cytosol</b> = côté intérieur : ribosomes, clathrine, moteurs, cytosquelette", "Une face de membrane <b>ne change jamais de côté</b> : bourgeonnement et fusion conservent l'orientation", "Les sucres sont toujours dans la lumière… ou dehors"],
          notes: ["C'est exactement le piège de la proposition D de B1Q20."] },
      ] },
    { part: 2, kind: 'tap', pts: 4, min: 2, title: 'Où sont les sucres ?',
      q: "Cette vésicule vient de se détacher par endocytose. Touche l'endroit où se trouvent les sucres de ses glycoprotéines.", img: 'vesicule', zone: [44, 49.5, 56, 70.5],
      ex: "Dans la lumière de la vésicule : c'est un morceau d'extérieur enfermé. Les sucres ne passent jamais du côté du cytosol.",
      notes: ["La carte des clics montre tout de suite qui place les sucres dehors (côté cytosol) : c'est l'erreur à corriger."] },
    { part: 2, kind: 'classify', pts: 8, min: 3, title: 'Côté cytosol ou côté lumière ?',
      q: "Pour chaque élément : de quel côté de la membrane se trouve-t-il ?",
      choices: [['C', 'Côté cytosol'], ['L', 'Lumière / extérieur']],
      items: [["Les sucres d'une glycoprotéine de la membrane plasmique", 'L'], ["Les sucres d'une glycoprotéine dans une vésicule d'endocytose", 'L'], ['Le manteau de clathrine', 'C'],
        ['Les ribosomes du REG', 'C'], ["Le N-glycanne que l'OST transfère en bloc", 'L'], ['Les premiers sucres ajoutés sur le dolichol-P', 'C'],
        ['Les hydrolases acides du lysosome', 'L'], ['Les glycolipides', 'L'], ['Une kinésine qui transporte une vésicule', 'C'],
        ['Le M6P fixé sur son récepteur dans le TGN', 'L'], ['Une protéine extrinsèque intracellulaire', 'C'], ['Une protéine à ancre GPI', 'L']],
      notes: ["Le dolichol-P est le piège : les premiers sucres sont ajoutés côté cytosol, puis flip-flop vers la lumière (fiche N-glycosylation).", "Corrige en partant des plus ratés (l'écran les trie)."] },

    { part: 2, kind: 'scores', min: 1, title: 'Classement après « Dedans ou dehors ? »', legend: 'Schéma : 4 points si la zone est juste · Tri : 8 points au prorata des bonnes réponses (12 points au total).' },

    /* ---------------- PARTIE 3 : ESCAPE GAME ---------------- */
    { part: 3, kind: 'escape', min: 16, title: "Le voyage d'une protéine", assign: true, pts: 20, roomPts: 2,
      minutes: 13, penalty: 20, hintPenalty: 45, word: 'VESICULES',
      intro: "Même équipes, <b>même téléphone</b>, sans bouger : chaque équipe reçoit une protéine (2 équipes par protéine). Votre protéine doit atteindre sa destination avant la fin du chrono. Chaque salle réussie donne une lettre du mot de passe final.",
      finalQ: "Vous avez toutes les lettres : tapez le mot de passe pour ouvrir la porte de sortie !",
      routes: [
        { id: 'lyso', name: 'Hydrolase acide', desc: 'Enzyme digestive · destination : le lysosome', color: '#9a71a9' },
        { id: 'sec', name: 'Glycoprotéine sécrétée', desc: 'Exportée en continu hors de la cellule, comme le collagène', color: '#c2a05a' },
        { id: 'mem', name: 'Récepteur membranaire', desc: 'Glycoprotéine transmembranaire · destination : la membrane plasmique', color: '#7f9f52' },
      ],
      rooms: [
        { t: 'Salle 1 · Le cytosol', type: 'choice', story: "Votre protéine vient de commencer à être traduite sur un ribosome libre, dans le cytosol. Le chrono tourne !",
          q: "Quelle partie de la protéine envoie le ribosome se fixer sur le réticulum ?", opts: ['Le peptide signal', "L'étiquette mannose-6-phosphate", 'La séquence KDEL', "L'ancre GPI"], good: 0,
          hint: "C'est la toute première partie synthétisée de la protéine.", win: "Le ribosome se fixe sur le REG.", debrief: 'Peptide signal → ribosome fixé au REG' },
        { t: 'Salle 2 · Le REG', type: 'choice', q: "Pendant sa synthèse, où part votre protéine ?",
          opts: ['Dans le cytosol', 'Directement dans la lumière du RE', 'Dans le noyau', 'Dans une mitochondrie'], good: 1,
          by: { mem: { q: "Votre protéine est transmembranaire : où se retrouve-t-elle pendant sa synthèse ?", opts: ['Libre dans le cytosol', 'Insérée dans la membrane du RE', 'Libre dans la lumière du RE', 'Dans le noyau'], good: 1 } },
          hint: "Translocation co-traductionnelle : la protéine est injectée au fur et à mesure de sa synthèse.", win: "Translocation co-traductionnelle réussie.", debrief: 'Translocation co-traductionnelle' },
        { t: 'Salle 3 · Le chantier des sucres', type: 'order', q: "Remettez dans l'ordre les étapes de la N-glycosylation.",
          items: ['Premiers sucres ajoutés un à un sur le dolichol-P, côté cytosol', "Flip-flop : l'oligosaccharide passe dans la lumière", "Allongement jusqu'à 14 sucres", "Transfert en bloc sur une asparagine, par l'OST", 'Élagage pendant le repliement : contrôle qualité'], start: [2, 0, 4, 1, 3],
          hint: "Tout commence côté cytosol, sur un lipide de la membrane du RE.", win: "Votre protéine porte son N-glycanne.", debrief: 'Ordre de la N-glycosylation' },
        { t: 'Salle 4 · Le cadenas à chiffres', type: 'code', numeric: true, ph: 'Nombre',
          q: "Combien de sucres compte l'oligosaccharide transféré en bloc sur la protéine ?", good: '14',
          hint: "Relisez la salle précédente : il est allongé avant le transfert.", win: "14 sucres, transférés en bloc.", debrief: '14 sucres sur une Asn' },
        { t: 'Salle 5 · Direction le Golgi', type: 'choice', story: "Votre protéine est bien repliée : elle quitte le RE dans une vésicule de transport.",
          q: "Par quelle face entre-t-elle dans l'appareil de Golgi ?", opts: ['La face cis, convexe, tournée vers le RE', 'La face trans, concave, tournée vers la membrane', "Par n'importe quel saccule", 'Par le réseau trans-golgien'], good: 0,
          hint: "« cis » = du même côté que le RE.", win: "Entrée par la face cis.", debrief: 'Entrée par la face cis' },
        { t: 'Salle 6 · Le passager clandestin', type: 'code', ph: '4 lettres', story: "Une protéine résidente du RE est montée par erreur dans votre vésicule. Elle sera renvoyée au RE grâce à une séquence de 4 lettres.",
          q: "Tapez ces 4 lettres.", good: 'KDEL', hint: "Ça commence par K et ça finit par L.", win: "Le clandestin repart vers le RE.", debrief: 'Séquence KDEL (retour vers le RE)' },
        { t: 'Salle 7 · La traversée du Golgi', type: 'choice', q: "Votre glycoprotéine arrive dans le TGN. Quelle voie de sortie prend-elle ?",
          opts: ['Sécrétion constitutive : en continu, sans signal', 'Sécrétion régulée : stockée en granules, libérée sur signal', 'Voie lysosomale, grâce au M6P', 'Retour vers le RE, grâce à KDEL'], good: 0,
          hint: "Elle est exportée en continu, comme le collagène des fibroblastes.",
          by: {
            lyso: { type: 'code', ph: 'Abréviation', q: "Dans le Golgi, votre enzyme reçoit une étiquette que lit un récepteur du TGN. Tapez son abréviation.", good: 'M6P', hint: "Un mannose… phosphorylé en position 6." },
            mem: { type: 'multi', q: "Pendant la traversée cis → trans, quelles modifications votre récepteur peut-il subir ?", opts: ['Remaniement de ses N-glycannes', 'O-glycosylation sur une sérine ou une thréonine', "Ajout d'un peptide signal", "Transfert en bloc de 14 sucres par l'OST"], good: [0, 1], hint: "Le peptide signal et le transfert en bloc, c'était avant, dans le RE." },
          },
          win: "Tri réussi dans le TGN.", debrief: 'Maturation et tri dans le TGN' },
        { t: 'Salle 8 · Sur les rails', type: 'choice', q: "Votre vésicule part du Golgi, près du noyau, vers la membrane plasmique. Quel moteur la transporte sur les microtubules ?",
          opts: ["La kinésine, vers l'extrémité (+)", "La dynéine, vers l'extrémité (−)", 'La myosine II, vers le (−)', 'Aucun : elle dérive au hasard'], good: 0,
          hint: "Du centre vers la périphérie, c'est vers le (+).",
          by: { lyso: { q: "Les lysosomes sont regroupés près du noyau. Si on bloque la dynéine, que se passe-t-il ?", opts: ['Les lysosomes se dispersent dans toute la cellule', 'Rien : la kinésine prend le relais', 'Les lysosomes fusionnent avec le noyau', 'Les microtubules se dépolymérisent'], good: 0, hint: "La dynéine va vers le (−), donc vers le centre de la cellule." } },
          win: "Bon moteur, bon sens !", debrief: 'Kinésine (+) / dynéine (−)' },
        { t: "Salle 9 · L'arrivée", type: 'choice', q: "Près de la membrane, les microtubules s'arrêtent. Qui prend le relais pour le dernier trajet ?",
          opts: ["La myosine I, sur les filaments d'actine", 'La myosine II, dans un anneau contractile', 'La kinésine, sur les filaments intermédiaires', 'La dynéine, sur les lamines'], good: 0,
          hint: "Juste sous la membrane, le cortex est fait d'actine.",
          by: {
            mem: { q: "Votre récepteur est arrivé dans la membrane plasmique. Où pointent ses chaînes de sucres ?", opts: ['Vers le milieu extracellulaire', 'Vers le cytosol', 'Ça dépend de la cellule', "Il n'a plus de sucres"], good: 0, hint: "Lumière du Golgi et des vésicules = côté extérieur." },
            lyso: { q: "Dans le lysosome, votre enzyme digère une macromolécule. Que deviennent les produits ?", opts: ['De petites molécules réutilisables par la cellule', 'Une nouvelle protéine', 'Ils sont renvoyés au RE', 'Ils restent intacts dans la vésicule'], good: 0, hint: "Le système endolysosomal recycle." },
          },
          win: "Destination atteinte !", debrief: 'Arrivée : myosine I, topologie, lysosome' },
      ],
      notes: ["Les protéines sont attribuées automatiquement : Ribosomes et Centrosomes → hydrolase ; Golgi et Vésicules → glycoprotéine sécrétée ; Lysosomes et Kinésines → récepteur.", "Points : 20 pour une équipe sortie ; sinon 2 points par salle franchie (18 au maximum).", "Top départ = chrono de 13 min. Erreur : +20 s ; indice : +45 s. Classement = chrono + pénalités.", "Après le classement, l'écran « débrief » montre les salles qui ont bloqué : corrige-les rapidement.", "Mot de passe final : VESICULES."] },

    { part: 3, kind: 'scores', min: 1, title: "Classement après l'escape game", legend: "Escape game : 20 points si l'équipe est sortie, sinon 2 points par salle franchie." },

    /* ---------------- PARTIE 4 : ENQUÊTES CLINIQUES ---------------- */
    /* Type « case » : le prof révèle les indices un par un ; chaque équipe peut diagnostiquer à tout moment.
       Points : 10 avec 1 indice, 8 avec 2, 6 avec 3, 0 si faux (4 dossiers = 40 points). */
    { part: 4, kind: 'case', pts: [10, 8, 6], eyebrow: 'Dossier n° 1', min: 2, title: 'Le petit footballeur',
      clues: ["Lucas, 5 ans, n'arrive plus à suivre ses copains au foot : il tombe souvent et se fatigue vite.",
        "Pour se relever du sol, il « grimpe » sur ses propres cuisses avec les mains. Ses mollets sont étonnamment gros.",
        "Biopsie : ses fibres musculaires s'abîment à chaque contraction. Il lui manque la protéine qui relie l'actine à la membrane."],
      q: "Quelle protéine manque à Lucas ?",
      opts: ['La dystrophine', 'La desmine', 'La kinésine', 'La tubuline'], good: 0,
      ex: "Myopathie de Duchenne : sans dystrophine, l'actine des fibres n'est plus reliée à la membrane ; les fibres s'abîment à chaque contraction et dégénèrent (B3, actine et mouvements).",
      notes: ["Laisse 30 à 40 s par indice : les équipes sûres d'elles répondent tôt et prennent plus de points.", "Révèle le diagnostic quand toutes les équipes ont répondu."] },
    { part: 4, kind: 'case', pts: [10, 8, 6], eyebrow: 'Dossier n° 2', min: 2, title: 'Les clés perdues',
      clues: ["M. R., 79 ans, perd ses clés, oublie ses rendez-vous et répète plusieurs fois les mêmes questions.",
        "Dans ses neurones, les « rails » de l'axone deviennent instables.",
        "Une protéine qui devrait être fixée le long des microtubules s'en détache et s'accumule en amas."],
      q: "Quelle est cette protéine ?",
      opts: ['Tau', 'La dynéine', 'La cofiline', 'La lamine'], good: 0,
      ex: "Maladie d'Alzheimer : Tau, qui stabilise les microtubules de l'axone, s'en détache et s'accumule dans le cerveau ; c'est associé à la mort des neurones." },
    { part: 4, kind: 'case', pts: [10, 8, 6], eyebrow: 'Dossier n° 3', min: 2, title: 'La tumeur sans papiers',
      clues: ["Une tumeur est découverte dans le foie de M. K. Mais le foie n'est peut-être pas son lieu de naissance…",
        "Le labo teste les filaments intermédiaires des cellules tumorales : desmine −, GFAP −, neurofilaments −.",
        "Dernier test : kératine +."],
      q: "D'où viennent les cellules tumorales ?",
      opts: ["D'un épithélium (carcinome)", "D'un muscle", 'De cellules gliales (gliome)', 'De neurones'], good: 0,
      ex: "Chaque tissu a ses filaments intermédiaires : kératine → épithélium (carcinome) ; desmine → muscle ; GFAP → gliome ; neurofilaments → origine neuronale." },
    { part: 4, kind: 'case', pts: [10, 8, 6], eyebrow: 'Dossier n° 4', min: 2, title: 'Le colis mal étiqueté',
      clues: ["Un nourrisson de 10 mois grandit mal. Ses lysosomes sont gonflés de déchets non digérés.",
        "Pourtant, ses hydrolases acides sont bien fabriquées… et on en retrouve plein dans son sang !",
        "L'enzyme du Golgi qui phosphoryle le mannose ne fonctionne pas."],
      q: "Pourquoi ses enzymes partent-elles dans le sang ?",
      opts: ["Sans étiquette M6P, le TGN ne les envoie pas aux lysosomes : elles sont sécrétées", "Elles n'ont pas de peptide signal", "Elles ne sont pas N-glycosylées dans le RE", 'La dynéine est bloquée'], good: 0,
      ex: "Maladie des cellules I (mucolipidose de type II) : sans M6P, les hydrolases ne sont pas triées vers les lysosomes et sortent par la voie de sécrétion. Les lysosomes, sans enzymes, accumulent des déchets.",
      notes: ["Dossier pour aller plus loin : il combine B2 (M6P, tri dans le TGN) et B1 (système endolysosomal)."] },
    { part: 4, kind: 'scores', min: 1, title: 'Classement avant la manche éclair', legend: 'Total sur 100 : QCM 28 · Dedans ou dehors 12 · Escape game 20 · Enquêtes 40. Il reste une manche bonus de 50 points…',
      notes: ["Fais monter le suspense : rien n'est joué, la dernière manche vaut 50 points."] },

    /* ---------------- PARTIE 5 : MANCHE ÉCLAIR (bonus, au-delà du cours) ---------------- */
    { part: 5, kind: 'explain', min: 2, title: 'Le saviez-vous ?',
      slides: [
        { t: 'Le saviez-vous ? Un médicament tiré d\'un arbre',
          pts: ["Le <b>taxol</b> (paclitaxel) a été découvert dans l'écorce de l'<b>if</b> : c'est aujourd'hui un médicament <b>anticancéreux</b>", "Il se fixe sur les <b>microtubules</b> et les <b>empêche de se dépolymériser</b>", "Les microtubules restent figés : plus de catastrophe, plus d'instabilité dynamique", "On va plus loin que le cours… Question : pourquoi ça bloque les cellules cancéreuses ?"],
          notes: ["Ne donne pas la réponse : la question éclair arrive juste après.", "Pour la correction : le fuseau de division est fait de microtubules ; il a besoin de pousser et de rétrécir sans arrêt pour capturer puis séparer les chromosomes. Figé, il ne fonctionne plus : la mitose s'arrête, surtout dans les cellules qui se divisent beaucoup."] },
      ] },
    { part: 5, kind: 'lightning', min: 2, title: 'Manche éclair', seconds: 20, pts: [50, 40, 30, 20, 10, 10],
      q: "Pourquoi le taxol empêche-t-il les cellules cancéreuses de se diviser ?",
      opts: ["Le fuseau de division, fait de microtubules, ne peut plus se réorganiser pour séparer les chromosomes", "L'anneau d'actine et de myosine II ne peut plus se former", "Les filaments intermédiaires du noyau se dissolvent", "La cellule ne peut plus fabriquer d'ATP"], good: 0,
      ex: "Le fuseau de division est fait de microtubules qui doivent sans cesse pousser et rétrécir (instabilité dynamique) pour capturer puis séparer les chromosomes. Stabilisés par le taxol, ils sont figés : la division s'arrête.",
      notes: ["20 secondes, un seul clic : la réponse part dès que l'équipe touche une proposition.", "Points selon l'ordre des bonnes réponses : 50, 40, 30, 20, 10, 10 ; 0 si faux."] },
    { part: 5, kind: 'scores', min: 2, title: 'Classement final', legend: 'Sur 100 + manche éclair (jusqu\'à 50 points bonus).',
      notes: ["Annonce le podium en commençant par la 3e place."] },

  ],
};
