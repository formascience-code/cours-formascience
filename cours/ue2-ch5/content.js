/* Contenu du cours : UE2 Ch5 · Réguler l'expression des gènes (version élaguée, 1 h)
   Pour modifier une question ou une diapo, changez le texte ici. */
window.COURSE = {
 "title": "Réguler l'expression des gènes",
 "subtitle": "UE2 · Ch5 · cours interactif",
 "chrono": 45,
 "chrono_revote": 15,
 "parts": [
  "Accueil",
  "1 · Qui régule ?",
  "2 · Allumer un gène",
  "3 · Après la transcription",
  "4 · Compacter",
  "5 · Ouvrir et marquer"
 ],
 "steps": [
  {
   "part": 0,
   "kind": "join",
   "min": 2,
   "title": "Rejoindre la séance",
   "notes": [
    "Projette cet écran dès l'entrée des étudiants : ils scannent le QR code avec l'appareil photo.",
    "Lance le cours quand le compteur ne bouge plus."
   ]
  },
  {
   "part": 1,
   "kind": "explain",
   "min": 6,
   "title": "Qui régule ?",
   "notes": [
    "« Avant → » fait avancer d'un pas (diapo ou étape d'animation) ; « ← Retour » recule d'un pas."
   ],
   "slides": [
    {
     "t": "Pourquoi et quand réguler ?",
     "img": "gene_legende",
     "pts": [
      "Même génome dans toutes les cellules nucléées : chaque type cellulaire a son <b>programme transcriptionnel</b>",
      "Gènes de ménage : transcrits partout · gènes régulés : selon le type cellulaire, la condition, le moment",
      "Régulation <b>surtout à l'initiation</b> : plus il y a de PIC sur un promoteur, plus le gène produit d'ARNm"
     ],
     "notes": [
      "Exemple du cours : les gènes des globines et des myosines sont dans toutes les cellules ; les globines ne sont transcrites que dans la lignée érythrocytaire, les myosines que dans le muscle.",
      "« Surtout » à l'initiation, mais aussi à l'élongation, la terminaison, la maturation et l'export."
     ]
    },
    {
     "t": "Les acteurs : cis et trans",
     "pts": [
      "<b>cis</b> = séquences d'ADN sur la même molécule que le gène : promoteur, séquences <b>proximales</b> (≈ −200), <b>distales</b> (enhancers, silencers)",
      "Les séquences cis sont <b>présentes dans toutes les cellules</b> (portées par le génome)",
      "<b>trans</b> = protéines codées par d'autres gènes, n'importe où dans le génome : ce sont elles qui <b>varient</b> d'une cellule à l'autre",
      "Activateur → enhancer · répresseur → silencer"
     ],
     "img": "gene_legende",
     "notes": [
      "Image : l'adresse est écrite sur l'ADN (cis), les facteurs trans viennent la lire.",
      "Piège : un facteur trans n'est pas forcément codé à côté de son gène cible."
     ]
    },
    {
     "t": "3 familles de facteurs protéiques",
     "pts": [
      "<b>Facteurs généraux</b> de la transcription (TFIIA, B, D, E, F, H) : forment le <b>PIC</b> avec l'ARN pol II. Ils sont <b>ubiquitaires</b> : ils n'expliquent pas à eux seuls les différences entre cellules",
      "<b>Facteurs régulateurs</b> : activateurs et répresseurs, fixés sur les séquences cis",
      "<b>Corégulateurs</b> : ne lient pas l'ADN ; recrutés par le domaine d'activation des FT ; modifient la chromatine et facilitent la formation du PIC"
     ],
     "notes": [
      "Insiste : ubiquitaire = présent dans toutes les cellules."
     ]
    },
    {
     "t": "Le promoteur minimum",
     "pts": [
      "± 50 pb de part et d'autre du <b>TSS</b> (1er nucléotide de l'ARNm)",
      "Promoteurs à <b>boîte TATA</b> (≈ 20 % des gènes de classe II) : TSS unique, gènes fortement régulés",
      "Promoteurs à <b>îlots CpG</b>, sans TATA : TSS multiples, gènes de ménage",
      "Éléments : BRE (fixe TFIIB) · TATA (fixe TBP) · Inr (contient le TSS, reconnu par TFIID) · DPE (TFIID / pol II)"
     ],
     "notes": [
      "Tous les motifs ne sont pas présents sur tous les promoteurs à TATA : chaque promoteur a sa combinaison.",
      "Ordre d'arrivée des facteurs généraux (poly diapos 46-48) : TFIID (TBP) → TFIIA → TFIIB → TFIIF + ARN pol II → TFIIE → TFIIH."
     ]
    }
   ]
  },
  {
   "part": 1,
   "kind": "tap",
   "min": 2,
   "title": "Schéma à compléter",
   "q": "Touche la séquence sur laquelle se fixe un facteur régulateur.",
   "img": "gene",
   "ex": "Les facteurs régulateurs se fixent sur les séquences cis : distales (1, enhancer ou silencer) ou proximales (2, ≈ −200). Les deux zones sont justes.",
   "notes": [
    "15 secondes. Deux zones justes : 1 (séquence distale) et 2 (séquences proximales). La boîte TATA (3) fixe TBP, un facteur général : piège."
   ],
   "seconds": 15,
   "zones": [
    [
     5,
     53,
     18.8,
     67
    ],
    [
     46,
     53,
     55.5,
     67
    ]
   ]
  },
  {
   "part": 1,
   "kind": "match",
   "min": 2,
   "title": "Qui fait quoi ?",
   "q": "Associe chaque famille de facteurs à ce qu'elle fait.",
   "pairs": [
    [
     "Facteurs généraux",
     "Forment le PIC et recrutent l'ARN pol II"
    ],
    [
     "Facteurs régulateurs",
     "Se fixent sur enhancers et silencers"
    ],
    [
     "Corégulateurs",
     "Sont recrutés par les FT, sans lier l'ADN"
    ]
   ],
   "notes": [
    "Piège attendu : « les corégulateurs se fixent sur l'ADN »."
   ]
  },
  {
   "part": 1,
   "kind": "peer",
   "min": 3,
   "title": "Vote, analyse, revote",
   "q": "Quelle(s) est (sont) la (les) proposition(s) juste(s) ?",
   "items": [
    "Un enhancer est une séquence d'ADN qui agit en cis.",
    "Un activateur transcriptionnel est un facteur trans qui se fixe sur un silencer.",
    "Les séquences cis sont présentes dans toutes les cellules de l'organisme.",
    "Un facteur trans est forcément codé par un gène voisin de son gène cible.",
    "Les séquences régulatrices proximales sont situées juste en amont du promoteur minimum."
   ],
   "ok": "ACE",
   "ex": [
    "Portée par la même molécule d'ADN que le gène.",
    "Activateur → enhancer ; répresseur → silencer.",
    "Portées par le génome ; ce sont les facteurs trans qui varient.",
    "Sa localisation est indépendante du gène cible.",
    "Les séquences distales sont, elles, à distance."
   ],
   "notes": [
    "1er vote seul ; répartition sans correction ; analyse du QCM avec eux (2 min) ; « Relancer le vote » ; correction."
   ]
  },
  {
   "part": 2,
   "kind": "explain",
   "min": 5,
   "title": "Allumer un gène",
   "slides": [
    {
     "t": "Comment un facteur de transcription lit l'ADN",
     "pts": [
      "Un FT reconnaît une séquence de <b>5 à 10 nucléotides</b>, qui lui est spécifique",
      "Il lit les bases dans le <b>grand sillon</b>, où elles sont accessibles, par des liaisons <b>hydrogène</b> et des interactions <b>hydrophobes</b>",
      "<b>Sans ouvrir la double hélice</b> : la structure double brin n'est pas modifiée",
      "Une légère variation de la séquence consensus <b>module la force</b> de la liaison"
     ],
     "notes": [
      "Analogie : le FT « lit » la tranche des bases sans ouvrir le livre.",
      "Piège classique : « la fixation d'un FT nécessite l'ouverture de la double hélice » est faux.",
      "Schéma (lien avec le Ch. structure de l'ADN) : les deux squelettes ne sont pas diamétralement opposés, d'où un grand et un petit sillon. Le poly ne parle que du grand sillon : c'est là que le FT lit les bases."
     ],
     "fig": "sillons"
    },
    {
     "t": "Les dimères rendent le FT plus spécifique",
     "pts": [
      "Les FT agissent souvent en <b>dimères</b> : homodimère (2 FT identiques) ou hétérodimère (2 FT différents) → la <b>spécificité augmente</b>",
      "<b>Leucine zipper</b> : région basique (N-term) qui contacte l'ADN + hélice α avec une <b>leucine tous les 7 résidus</b> : les leucines s'emboîtent (interactions hydrophobes) → dimère",
      "<b>Hélice-boucle-hélice basique (bHLH)</b> : hélice basique qui lit l'ADN, une boucle, puis une hélice de dimérisation"
     ],
     "notes": [
      "Piège : dans un leucine zipper, ce ne sont pas les leucines qui touchent l'ADN, c'est la région basique."
     ],
     "fig": "dimeres"
    },
    {
     "t": "Une combinaison par gène",
     "pts": [
      "<b>Plus de 2000 FT</b> décrits chez l'Homme",
      "Chaque gène a sa <b>combinaison de séquences régulatrices</b> : proximales (juste en amont du promoteur) et distales (enhancers, parfois très loin)",
      "Cette combinaison recrute une <b>combinaison particulière de protéines</b> : c'est la régulation combinatoire",
      "Comme un orchestre : le résultat dépend de qui joue, pas d'un seul musicien"
     ],
     "notes": [
      "Les enhancers peuvent être loin : l'ADN se replie pour les rapprocher du promoteur (lien avec la partie 4)."
     ]
    },
    {
     "t": "Le scénario de l'allumage",
     "img": "allumer",
     "pts": [
      "1. Les FT se fixent sur l'enhancer",
      "2. Par leur domaine d'activation, ils recrutent des <b>corégulateurs</b> (interaction protéine-protéine)",
      "3. Les corégulateurs <b>modifient la chromatine</b> : le promoteur devient accessible",
      "4. Le <b>PIC s'assemble</b> et l'ARN pol II démarre"
     ],
     "notes": [
      "C'est le lien entre la partie 1 (PIC) et la partie 5 (chromatine)."
     ]
    },
    {
     "t": "Le verrou : la méthylation de l'ADN",
     "pts": [
      "Les cytosines des dinucléotides <b>CpG</b> peuvent être méthylées par les <b>DNMT</b>",
      "<b>Îlot CpG méthylé → pas d'initiation</b> ; îlot déméthylé → initiation possible",
      "Attention : <b>certains FT ne dépendent pas</b> du statut de méthylation"
     ],
     "notes": [
      "Le donneur de méthyle est la SAM (S-adénosylméthionine).",
      "≈ 70 % des CpG du génome sont méthylés ; les îlots CpG des promoteurs actifs sont déméthylés.",
      "Les 5-méthylcytosines peuvent se désaminer en T : perte progressive des CpG au cours de l'évolution.",
      "Piège : la méthylation de l'ADN porte sur les cytosines (pas d'uracile dans l'ADN)."
     ]
    }
   ]
  },
  {
   "part": 2,
   "kind": "peer",
   "min": 3,
   "title": "Vote, analyse, revote",
   "q": "Quelle(s) est (sont) la (les) proposition(s) juste(s) ?",
   "items": [
    "La présence de groupements méthyles sur les îlots CpG d'un promoteur empêche l'initiation.",
    "Sur un promoteur méthylé, une protéine liant les CpG méthylés peut occuper la place du FT.",
    "Tous les facteurs de transcription sont sensibles à la méthylation de l'ADN.",
    "Un îlot CpG déméthylé est compatible avec l'initiation de la transcription.",
    "La méthylation de l'ADN porte sur les uraciles."
   ],
   "ok": "ABD",
   "ex": [
    "C'est un verrou de l'initiation.",
    "Le FT ne peut plus se fixer.",
    "Certains ne dépendent pas du statut de méthylation.",
    "Îlot déméthylé = initiation possible.",
    "Sur les cytosines des CpG (pas d'uracile dans l'ADN)."
   ],
   "notes": [
    "La C piège souvent : fais-la défendre par quelqu'un qui l'a cochée."
   ]
  },
  {
   "part": 3,
   "kind": "explain",
   "min": 4,
   "title": "Après la transcription",
   "slides": [
    {
     "t": "L'épissage alternatif",
     "anim": "epissage",
     "notes": [
      "Insiste : l'épissage se fait sur l'ARN, l'ADN ne change pas. Ici, 4 exons dont 2 « cassettes » → 3 isoformes.",
      "Exemple du cours : NRXN3, 2 promoteurs + 6 exons inclus ou exclus + 3 exons à site donneur ou accepteur alternatif → plus de 1000 transcrits."
     ]
    },
    {
     "t": "Les promoteurs alternatifs",
     "anim": "promoteurs",
     "notes": [
      "Changer de promoteur = changer de TSS selon le tissu ou le moment.",
      "Les 7 promoteurs de la dystrophine donnent des protéines de Dp427 à Dp71."
     ]
    }
   ]
  },
  {
   "part": 4,
   "kind": "explain",
   "min": 5,
   "title": "Compacter l'ADN",
   "slides": [
    {
     "t": "De l'ADN nu au chromosome",
     "anim": "compaction",
     "notes": [
      "Une marche par niveau ; donne chaque fois le diamètre.",
      "Pourquoi compacter : répartir l'information génétique en mitose / méiose, la protéger, et réguler l'accès selon les besoins de transcription."
     ]
    },
    {
     "t": "Le nucléosome",
     "img": "nucleosome_legende",
     "pts": [
      "Octamère = <b>2 × (H2A, H2B, H3, H4)</b>",
      "Entouré de <b>1,65 tour d'ADN = 146 pb</b>",
      "<b>H1</b> = le « verrou », à l'extérieur de l'octamère",
      "ADN de liaison entre 2 nucléosomes (taille variable) · ≈ 1 nucléosome / 200 pb · ≈ 30 millions par cellule diploïde"
     ],
     "notes": [
      "Confusion fréquente : 146 pb (autour de l'octamère) et 200 pb (un nucléosome + l'ADN de liaison)."
     ]
    },
    {
     "t": "Où est la chromatine active ?",
     "pts": [
      "<b>Euchromatine</b> : peu condensée, transcription active",
      "<b>Hétérochromatine</b> : compacte, en périphérie du noyau et autour du nucléole, transcription inactive",
      "Constitutive : stable, dans toutes les cellules (télomères, centromères, régions sans gènes)",
      "Facultative : réversible selon les besoins (chromosome X inactivé, gènes propres à un autre type cellulaire)",
      "Compartiments <b>A</b> (centre, transcrits) / <b>B</b> (lamina, silencieux) · chaque chromosome occupe un <b>territoire</b>"
     ],
     "notes": [
      "Fais le lien avec l'animation : niveau 4."
     ]
    }
   ]
  },
  {
   "part": 4,
   "kind": "tap",
   "min": 2,
   "title": "Schéma à compléter",
   "q": "Touche l'histone qui ne fait pas partie de l'octamère.",
   "img": "nucleosome",
   "zone": [
    40.2,
    70.5,
    48,
    99
   ],
   "ex": "C'est H1, le « verrou » : elle stabilise l'ADN à l'extérieur de l'octamère.",
   "notes": [
    "Question rapide : 30 secondes, carte des clics, une phrase de correction."
   ],
   "seconds": 10
  },
  {
   "part": 4,
   "kind": "number",
   "min": 2,
   "title": "Deux chiffres à retenir",
   "ex": "146 pb s'enroulent autour de l'octamère (1,65 tour). 200 pb : c'est l'écart moyen d'un nucléosome au suivant, ADN de liaison compris (≈ 1 nucléosome / 200 pb).",
   "notes": [
    "20 secondes pour les deux. La confusion 146 / 200 se voit bien sur les deux histogrammes."
   ],
   "seconds": 20,
   "qs": [
    {
     "q": "Combien de paires de bases d'ADN s'enroulent autour de l'octamère ?",
     "good": 146
    },
    {
     "q": "Tous les combien de paires de bases trouve-t-on un nucléosome (ADN de liaison compris) ?",
     "good": 200
    }
   ]
  },
  {
   "part": 4,
   "kind": "peer",
   "min": 3,
   "title": "Vote, analyse, revote",
   "q": "Quelle(s) est (sont) la (les) proposition(s) juste(s) ?",
   "items": [
    "L'euchromatine est peu condensée et transcriptionnellement active.",
    "L'hétérochromatine se situe en périphérie du noyau et autour du nucléole.",
    "Les télomères et les centromères sont de l'hétérochromatine facultative.",
    "Le chromosome X inactivé est de l'hétérochromatine facultative.",
    "En interphase, chaque chromosome occupe un territoire défini dans le noyau."
   ],
   "ok": "ABDE",
   "ex": [
    "Elle correspond aux régions transcrites.",
    "Compacte et inactive.",
    "Ce sont des exemples d'hétérochromatine constitutive.",
    "Réversible en fonction des besoins.",
    "Évite l'enchevêtrement et les cassures."
   ],
   "notes": [
    "Pendant l'analyse, demande un exemple de constitutive et de facultative à voix haute."
   ]
  },
  {
   "part": 5,
   "kind": "explain",
   "min": 7,
   "title": "Ouvrir et marquer la chromatine",
   "slides": [
    {
     "t": "La chromatine n'est pas figée",
     "anim": "remodelage",
     "nocap": true,
     "compact": true,
     "pts": [
      "L'ADN d'un nucléosome peut être <b>transitoirement dissocié</b> des histones",
      "Les histones portent des <b>modifications post-traductionnelles</b>, par exemple l'<b>acétylation</b> :",
      {
       "n": 1,
       "k": 0,
       "t": "<b>Au départ</b> : les lysines + retiennent l'ADN − ; le promoteur, enroulé, est inaccessible"
      },
      {
       "n": 2,
       "k": 1,
       "t": "<b>Décompaction</b> : une <b>HAT</b> acétyle les lysines, les charges + sont neutralisées, l'ADN se relâche"
      },
      {
       "n": 3,
       "k": 2,
       "t": "<b>Remodelage</b> : un complexe à activité <b>ATPase</b> fait <b>glisser</b> le nucléosome ou l'<b>évince</b>"
      },
      {
       "n": "→",
       "k": 2,
       "t": "Les <b>promoteurs actifs sont dépourvus de nucléosomes</b> : le PIC peut s'assembler"
      }
     ],
     "notes": [
      "Schéma : insiste sur les charges. Lysines + / ADN − = attraction. Acétylation = charges neutralisées = ADN moins retenu.",
      "Lien avec la partie 2 : ce sont les corégulateurs qui amènent ces activités."
     ]
    },
    {
     "t": "Le code histone",
     "img": "code_histone",
     "pts": [
      "Modifications <b>réversibles</b> : acétylation, méthylation, phosphorylation, ubiquitination, citrullination",
      "<b>H3K4me1</b> = histone <b>H3</b>, lysine (<b>K</b>) en position <b>4</b>, <b>mono-méthylée</b>",
      "<b>H3K27ac</b> = lysine 27 de H3 <b>acétylée</b>"
     ],
     "notes": [
      "Décode H3K4me1 et H3K27ac avec eux à voix haute."
     ]
    },
    {
     "t": "Writers, readers, erasers",
     "anim": "wer",
     "notes": [
      "Poly diapos 132-134 : writers = enzymes qui ajoutent les marques ; erasers = enzymes qui les retirent ; readers = enzymes qui interprètent les marques.",
      "Phrase à faire répéter : writer = écrit, reader = lit, eraser = efface."
     ]
    },
    {
     "t": "Qui active, qui réprime ? (1/2) · ADN et histones",
     "table": "adn_histones",
     "notes": [
      "À retenir (consigne de la fac) : l'acétylation active toujours ; la mono-méthylation active toujours. Les di- et tri-méthylations ne sont pas à retenir."
     ]
    },
    {
     "t": "La méthylation des histones : le tableau du cours",
     "table": "meth",
     "memo": [
      "À retenir : mono-méthylation (me1) = activation",
      "À retenir : acétylation (ac) = activation",
      "Di- et tri-méthylations : pas à retenir (consigne de la fac)"
     ],
     "notes": [
      "Montre le tableau, mais insiste : seules les lignes « mono-méthylation » et « acétylation » sont à retenir, et elles sont entièrement en « activation »."
     ]
    }
   ]
  },
  {
   "part": 5,
   "kind": "classify",
   "min": 3,
   "table": true,
   "title": "Qui active, qui réprime ? (2/2) · nucléosomes et noyau",
   "q": "Pour chaque situation : active ou réprime la transcription ?",
   "items": [
    [
     "Promoteur dépourvu de nucléosomes",
     "A",
     "Remodelage (ATPase) : le PIC peut s'assembler"
    ],
    [
     "Euchromatine (peu condensée)",
     "A",
     "Régions transcrites"
    ],
    [
     "Hétérochromatine constitutive",
     "R",
     "Toujours compacte : télomères, centromères, régions sans gènes"
    ],
    [
     "Hétérochromatine facultative",
     "R",
     "Réversible : X inactivé, gènes propres à un autre type cellulaire"
    ],
    [
     "Compartiment A (centre du noyau)",
     "A",
     "Boucles larges, chromatine peu condensée"
    ],
    [
     "Compartiment B (contre la lamina)",
     "R",
     "Boucles courtes, chromatine condensée"
    ],
    [
     "Activateur fixé sur un enhancer",
     "A",
     "Recrute les corégulateurs, qui facilitent le PIC"
    ],
    [
     "Répresseur fixé sur un silencer",
     "R",
     "Empêche l'activation"
    ]
   ],
   "notes": [
    "Pas de minuteur : tu gères le temps. Commente les situations pendant qu'ils répondent, puis « Avant → » affiche la correction.",
    "Fais remarquer : tout ce qui ouvre la chromatine active, tout ce qui la compacte réprime."
   ]
  },
  {
   "part": 5,
   "kind": "classify",
   "min": 3,
   "title": "Active ou réprime ? · marques d'histones",
   "q": "Pour chaque situation : active ou réprime la transcription ?",
   "items": [
    [
     "H3K4me1",
     "A",
     "Mono-méthylation : active toujours"
    ],
    [
     "H3K27ac",
     "A",
     "Acétylation : active toujours"
    ],
    [
     "Désacétylation des histones par une HDAC",
     "R",
     "L'HDAC retire l'acétyle : les charges + reviennent, la fibre se recompacte"
    ],
    [
     "H4K20me1",
     "A",
     "Mono-méthylation : active toujours"
    ],
    [
     "H3K9ac",
     "A",
     "Acétylation : active toujours"
    ],
    [
     "Acétylation des histones par une HAT",
     "A",
     "Charges + neutralisées : la fibre se relâche"
    ],
    [
     "H3K9me1",
     "A",
     "Mono-méthylation : active toujours"
    ],
    [
     "H3K14ac",
     "A",
     "Acétylation : active toujours"
    ]
   ],
   "notes": [
    "But : un réflexe. me1 et ac = toujours activation. Piège : la désacétylation par une HDAC réprime."
   ],
   "table": true
  },
  {
   "part": 5,
   "kind": "match",
   "min": 2,
   "title": "Qui fait quoi sur les histones ?",
   "q": "Associe chaque enzyme à ce qu'elle fait.",
   "pairs": [
    [
     "HAT (writer)",
     "Ajoute un acétyle : active"
    ],
    [
     "HDAC (eraser)",
     "Retire un acétyle : réprime"
    ],
    [
     "HMT (writer)",
     "Ajoute un méthyle"
    ]
   ],
   "notes": [
    "Rappel : ajouter un acétyle neutralise les charges + des lysines et relâche la fibre."
   ],
   "seconds": 30
  },
  {
   "part": 5,
   "kind": "peer",
   "min": 3,
   "title": "Vote, analyse, revote",
   "q": "Quelle(s) est (sont) la (les) proposition(s) juste(s) ?",
   "items": [
    "L'acétylation des histones neutralise les charges positives des lysines et relâche la chromatine.",
    "Une mono-méthylation d'histone, comme H3K4me1, est associée à l'activation de la transcription.",
    "Les HDAC ajoutent des groupements acétyles sur les histones.",
    "H3K27ac désigne l'acétylation de la lysine 27 de l'histone H3.",
    "L'acétylation des histones est une marque de répression."
   ],
   "ok": "ABD",
   "ex": [
    "Les lysines perdent leur charge + : l'ADN est moins retenu.",
    "Mono-méthylation = activation (consigne de la fac).",
    "Elles les retirent (erasers) : les HAT les ajoutent.",
    "Histone H3, lysine (K) 27, acétylée.",
    "L'acétylation active toujours."
   ],
   "notes": [
    "Seules la mono-méthylation et l'acétylation sont à retenir : les deux activent."
   ]
  },
  {
   "part": 5,
   "kind": "thanks",
   "min": 1,
   "title": "Merci pour votre attention !",
   "notes": [
    "Sur les téléphones : « Merci ! Révise avec ta fiche et le lexique. »"
   ]
  }
 ]
};
