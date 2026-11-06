# Cours interactif UE2 Ch5 (formaScience)

Une petite application web pour faire répondre les étudiants sur leur téléphone pendant le cours, sans Wooclap.

- **prof.html** : l'écran à projeter. Tu pilotes le cours depuis cette page.
- **index.html** : la page des étudiants. Ils l'ouvrent en scannant le QR code ; pas d'appli, pas de compte.
- Tout est en direct. Quand tu cliques sur « Terminer la séance », toutes les réponses sont effacées.

## Essayer tout de suite (mode démo, sans rien installer)

1. Ouvre `prof.html` dans Chrome, puis clique sur « Démarrer une nouvelle séance ».
2. Ouvre `index.html` dans un **autre onglet** du même navigateur et tape le code affiché.
3. Réponds dans l'onglet étudiant, pilote dans l'onglet prof.

En mode démo, seuls les onglets d'un même navigateur sont reliés. Pour les vrais téléphones, il faut Firebase (étape 1).

Le QR code ne fonctionne pas quand les pages sont ouvertes depuis l'ordinateur (adresse qui commence par `file://`) : un téléphone ne peut pas ouvrir un fichier de ton disque. Il marche dès que le site est en ligne (étape 2).

## Étape 1 : créer la base Firebase (gratuit, environ 10 minutes)

1. Va sur https://console.firebase.google.com avec un compte Google, puis « Créer un projet » (par exemple `formascience-cours`). Tu peux refuser Google Analytics.
2. Menu **Build › Authentication** : clique sur « Commencer », onglet « Sign-in method », active **Anonyme**, enregistre.
3. Menu **Build › Realtime Database** : « Créer une base de données ».
   - Choisis l'emplacement **europe-west1 (Belgique)**.
   - Démarre en **mode verrouillé**.
4. Toujours dans Realtime Database, onglet **Règles**.
   - Remplace tout le contenu par celui du fichier `database.rules.json`.
   - Clique sur « Publier ».
5. Roue dentée **Paramètres du projet** : en bas, « Ajouter une application », icône web `</>`, donne un nom, puis « Enregistrer ».
6. Firebase affiche un bloc `firebaseConfig = { apiKey: …, … }`.
   - Recopie ces valeurs dans le fichier `config.js`.
   - Vérifie que `databaseURL` est bien rempli. Il ressemble à `https://formascience-cours-default-rtdb.europe-west1.firebasedatabase.app`. S'il manque, copie-le depuis la page Realtime Database (adresse en haut des données).

Ces clés ne sont pas des mots de passe : elles peuvent être publiques. La sécurité vient des règles de l'étape 4.

- Seul le prof qui a créé une séance peut la piloter et lire les réponses.
- Chaque étudiant ne peut écrire que ses propres réponses.

## Étape 2 : mettre en ligne sur GitHub Pages

1. Sur GitHub, crée un dépôt (par exemple `cours-ue2`). Il peut être public.
2. « Add file › Upload files » : dépose **tout le contenu** de ce dossier, y compris le dossier `img`, puis « Commit changes ».
3. Dans le dépôt, va dans **Settings › Pages**.
   - Dans « Branch », choisis `main` et `/ (root)`, puis « Save ».
   - Attends 1 à 2 minutes.
4. Ton cours est en ligne :
   - Écran prof : `https://TON-COMPTE.github.io/cours-ue2/prof.html`
   - Le QR code affiché en début de cours pointe automatiquement vers la page étudiant.
5. (Conseillé) Dans Firebase › Authentication › Settings › Domaines autorisés, ajoute `TON-COMPTE.github.io`.

## Pendant le cours

| Touche | Action |
|---|---|
| → ou Espace | Action suivante (diapo ou étape d'animation suivante, résultats, réponse, discussion, étape suivante…) |
| ← | Retour (étape d'animation, diapo ou étape précédente) |
| N | Afficher / masquer tes notes (pense à ne pas dupliquer ton écran si tu ne veux pas que les étudiants les voient) |

- Tu peux sauter à n'importe quelle étape en cliquant sur la frise en haut.
- Si tu recharges la page prof, « Reprendre la séance » te ramène où tu en étais.
- À la fin, l'étape « Bilan » montre le taux de réussite par question. Note ce qu'il faut reprendre, puis clique sur « Terminer la séance » deux fois (confirmation) : tout est effacé.

**À tester avant le premier cours** : fais un essai dans l'amphi avec 2 ou 3 téléphones, sur le wifi de la fac et en 4G. L'offre gratuite de Firebase accepte, à ma connaissance, 100 connexions simultanées : c'est largement suffisant pour une classe de 34, mais à vérifier pour un grand amphi.

## Plusieurs cours sur le même site

Chaque cours a son dossier dans `cours/` :

```
cours/
├── ue2-ch5/          ← content.js + img/ (schémas du cours)
└── ue2-ch6/          ← un nouveau dossier par cours
```

- **Liste des cours** : `prof.html` sans rien derrière affiche la liste (fichier `catalogue.js`).
- **Lien direct vers un cours** : `prof.html?cours=ue2-ch5`.
- **Ajouter un cours** : déposer son dossier dans `cours/` (Add file › Upload files, en glissant le dossier), puis ajouter une ligne dans `catalogue.js` (icône crayon sur GitHub).
- Le moteur (`prof.html`, `index.html`, `shared.js`, `backend.js`, `app.css`) est commun : une amélioration profite à tous les cours.
- La base Firebase est la même pour tous les cours.

## Modifier le cours

Tout le contenu d'un cours est dans **`cours/<nom-du-cours>/content.js`** : titres, questions, propositions, bonnes réponses, explications, notes du prof et durées. Tu peux changer un texte directement sur GitHub (icône crayon), puis « Commit » ; le site se met à jour en une minute.

| Type d'étape | Ce que voient les étudiants |
|---|---|
| `join` | Écran d'accueil avec QR code |
| `cloud` | Nuage de mots |
| `poll` | Choix unique (`good` = numéro de la bonne réponse, à partir de 0) |
| `explain` | Une ou plusieurs diapos de cours (`slides`) : points, image, animation pas à pas (`anim`) ou tableau (`table`). Les téléphones affichent « Écoute », ou suivent l'animation et le tableau |
| `tap` | Toucher un schéma (`zone` = rectangle juste, en % : gauche, haut, droite, bas) |
| `match` | Associer |
| `order` | Remettre dans l'ordre (`start` = ordre de départ mélangé) |
| `peer` | QCM vote → discussion → revote (`ok` = lettres justes, ex. `"ACE"`) |
| `number` | Réponse numérique |
| `classify` | Active ou réprime ? : chaque situation à classer |
| `quiz` | Vrai / faux chronométré avec classement |
| `end` | Bilan de la séance |

`qrcode.js` (licence MIT, Kazuhiko Arase) fabrique le QR code ; ne le supprime pas. Les schémas d'un cours sont dans `cours/<nom-du-cours>/img/` ; `img/` à la racine ne contient que le logo (issus des fiches Ch5 de la Ruche). 
