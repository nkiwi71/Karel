# Karel et Git

Ce dépôt contient un simulateur (`karel.html`) et une série d’exercices, rangés dans le dossier `mondes/` (`ex0` à `ex8`).

## Utilisation
1. Dans VS Code, ouvrez le **dossier** du dépôt (Fichier, puis Ouvrir le dossier). Si VS Code propose d’installer l’extension **Live Server**, acceptez.
2. Faites un clic droit sur `karel.html` dans l’explorateur de VS Code, puis **Open with Live Server** (ou cliquez sur **Go Live** en bas à droite). Le navigateur s’ouvre sur la page.
3. Choisissez l’exercice dans le menu : ses consignes s’affichent à gauche, son monde au centre et son programme à droite.
4. Modifiez `mondes/exN/programme.karel` dans VS Code, enregistrez, puis cliquez sur « Rafraîchir » et « Exécuter ».
5. Quand le message « Objectif atteint ! » s’affiche, faites un commit.

**Si ça ne marche pas :** vérifiez que c’est bien le *dossier* du dépôt qui est ouvert dans VS Code (et pas un fichier seul ou un sous-dossier), puis fermez et rouvrez VS Code. N’ouvrez pas `karel.html` par double-clic : la page ne peut pas lire vos fichiers dans ce cas.

Astuce : écrire `pause` dans un programme arrête l’exécution sur cette ligne ; « Exécuter » la reprend.

Chaque exercice a un fichier `CONSIGNES.md` (affiché dans la page) : lisez la partie Karel **et** la partie Git.

## Contenu
- `ex0` à `ex5` : les commandes de base (commit, amend, historique, annulation, partage).
- `ex6` : les tags.
- `ex7` : projet « Karel le jardinier », sans commandes fournies.
- `ex8` : projet « Karel dans le labyrinthe », sans commandes fournies.

## Règles
- Un commit = une étape qui a du sens, avec un message qui dit ce qui a changé.
- Ne modifiez jamais les fichiers `.monde` (sauf indication contraire).
