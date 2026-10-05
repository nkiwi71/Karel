# Exercice 5 — Partager avec le prof

## Karel
Karel habite la maison de gauche. Le journal (la balise) est dans le jardin, à une distance qu’il ne connaît pas.
Il doit sortir, ramasser le journal, rentrer et retrouver sa place de départ, **face à l’est**.
Utilisez `tant que pas balise_ici:` pour l’aller, puis une fonction `demi_tour`.

## Git
### Partie A : pousser sa solution
1. Résolvez l’exercice et commitez : « [5] Karel rapporte le journal ». Poussez avec `git push`.

### Partie B : réécrire un commit déjà poussé
1. Changez le message du dernier commit : `git commit --amend -m "[5] Karel rapporte le journal (version finale)"`.
2. Tentez de pousser : `git push`. **Lisez l’erreur** : pourquoi GitHub refuse-t-il ?
3. **N’utilisez pas `--force`.** Annulez votre amend en vous alignant sur GitHub : vérifiez que `git status` est propre, puis `git reset --hard origin/main`.
4. `git log --oneline` : votre commit a retrouvé son ancien message.

### Partie C : récupérer le retour du prof
1. Prévenez l'enseignant que vous avez atteint cette partie en lui donnant le lien de votre dépôt github.
2. Ne faites plus aucune modification ni commit. Attendez que l'enseignant vous indique avoir modifié votre dépôt.
3. Lancez `git pull`.
4. Utilisez `git log --oneline` et `git diff` pour comprendre ce qui a été modifié.
