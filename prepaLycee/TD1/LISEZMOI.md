# Cours interactifs de la PrépaLycée (formaScience)

Même fonctionnement que les cours UE2 (voir le LISEZMOI à la racine du dépôt), dans un espace à part pour les lycéens.

- **Écran prof** : `https://formascience-code.github.io/cours-formascience/prepaLycee/TD1/prof.html`
- Les élèves scannent le QR code affiché au début : ils arrivent sur `prepaLycee/TD1/index.html`.
- Le contenu du TD (questions, textes, schémas) est dans `cours/td1/content.js` et `cours/td1/img/`.
- Pour un nouveau TD : copier tout le dossier TD1 en TD2, puis changer son `cours/td1/content.js`.
- Firebase : même base que les cours UE2 (`config.js`), rien à configurer.

Types d'étapes en plus de ceux du LISEZMOI principal : `teams` (6 équipes), `tqcm` (QCM d'équipe chronométré), `escape` (escape game), `case` (enquête à indices), `lightning` (manche éclair), `scores` (classement général par équipe). Les couleurs de la prépaLycée sont dans `theme` du `content.js`.
