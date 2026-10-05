# Exercice 4 — Annuler : `revert` ou `reset` ?

## Karel
Karel monte l’escalier jusqu’à la balise, la ramasse et s’arrête en haut.
Le motif se répète 4 fois : utilisez `repeter 4 fois:` plutôt que de copier-coller.

## Git
Commencez par une version qui fonctionne, et commitez-la.

### Partie A : `git revert` (annuler un ancien commit sans toucher à l’historique)
1. Remplacez `repeter 4 fois` par `repeter 3 fois`. Commitez : « [4] Essai avec 3 répétitions ».
2. Ajoutez un commentaire dans le fichier. Commitez : « [4] Ajout d’un commentaire ».
3. Vous vous rendez compte que l’essai était une erreur, mais le commentaire est bon. Repérez le hash de l’essai avec `git log --oneline`, puis : `git revert <hash>`.
4. Regardez `git log --oneline` : qu’est-ce qui a été ajouté ? Le programme fonctionne-t-il de nouveau ?

### Partie B : `git reset --soft` (refaire un commit fait trop vite)
1. Ajoutez un commentaire d’en-tête et commitez avec le message « stuff ».
2. Ce message est mauvais. Défaites le commit en gardant vos modifications : `git reset --soft HEAD~1`.
3. `git status` : vos modifications sont prêtes à être commitées. Recommitez avec un vrai message.

### Partie C : `git reset --hard` (la commande qui détruit du travail)
1. Modifiez `programme.karel` **sans commiter**.
2. Lancez `git reset --hard`. Que devient votre modification ? Peut-on la récupérer ?
3. Comparez avec `git restore`, qui ne touche qu’aux fichiers que vous précisez.

## À retenir
- `revert` **ajoute** un commit qui annule un autre commit. L’historique reste intact.
- `reset` **déplace** la pointe de l’historique : les commits « défaits » disparaissent.
- On ne fait jamais `reset` sur des commits déjà poussés.

Poussez avec `git push`.
