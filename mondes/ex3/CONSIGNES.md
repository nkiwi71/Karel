# Exercice 3 — Voyager dans l’historique

## Préparation
Vérifiez que `git status` est propre, puis lancez : `sh mondes/ex3/historique.sh`
Le script ajoute 5 commits qui font évoluer `mondes/ex3/programme.karel`. Affichez-les avec `git log --oneline`.

## Karel
Le monde `mondes/ex3/monde.monde` contient un mur que Karel doit contourner avant de ramasser la balise.
**Le programme actuel ne fonctionne plus.** À vous de retrouver la dernière version qui marchait.

## Git
### Partie A : abandonner des modifications
1. Modifiez `programme.karel` n’importe comment, sans commiter.
2. Regardez `git status` et `git diff`.
3. Annulez : `git restore mondes/ex3/programme.karel`. Le fichier est revenu à son état du dernier commit.

### Partie B : visiter le passé
1. Notez le hash de chaque commit (`git log --oneline`).
2. Visitez-en un : `git switch --detach <hash>`. Rechargez le programme dans `karel.html`, exécutez-le.
3. **Ne modifiez rien** pendant la visite. Répétez pour chaque commit.
4. Retournez au présent : `git switch main`.

Quel commit a cassé le programme ? Notez son hash et son message.

### Partie C : réparer
1. Récupérez le fichier de la dernière bonne version : `git restore --source <hash-bon> mondes/ex3/programme.karel`.
2. Vérifiez dans `karel.html` que « Objectif atteint ! » s’affiche.
3. Commitez : « [3] Retour à la version qui fonctionne ».
4. Poussez avec `git push`.

## Question
Quel est l'effet de bord de la manipulation que l'on vient de faire ?
