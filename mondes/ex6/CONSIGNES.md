# Exercice 6 — Les tags : nommer les versions importantes

Un **tag** (étiquette) est un nom attaché à un commit précis, comme `v1` ou `ex2-fini`. Contrairement à une branche, il ne bouge jamais. Il sert à marquer « cette version-là compte ».

Cet exercice n’a pas de partie Karel : vous allez étiqueter votre propre travail des exercices 0 à 5.

## Partie A : créer des tags
1. Lancez `git tag` : la liste est vide.
2. Repérez avec `git log --oneline` le dernier commit de chaque exercice à l’exception du cinquième (ex0 à ex4).
3. Étiquetez-les : `git tag ex0-fini <hash>`, `git tag ex1-fini <hash>`, etc.
4. Relancez `git tag`, puis `git log --oneline --decorate` : où apparaissent les tags ?
5. Regardez ce qu’un tag désigne : `git show ex1-fini`.

## Partie B : tag léger et tag annoté
1. Vos tags précédents sont **légers** : un simple nom. Créez un tag **annoté** sur le dernier commit de l’exercice 5 : `git tag -a ex5-fini <hash> -m "Fin de la première série d’exercices"`.
2. Comparez `git show ex1-fini` et `git show ex5-fini`. Que voyez-vous de plus dans le second ?

## Partie C : voyager avec les tags
1. `git switch --detach ex2-fini`, puis regardez le contenu de `mondes/ex2/` et de `mondes/ex5/`. Que remarquez-vous ?
2. Revenez au présent : `git switch -`.

## Partie D : corriger une erreur
1. Créez volontairement un mauvais tag : `git tag test` (sans hash : il pointe sur le dernier commit).
2. Supprimez-le : `git tag -d test`.
3. Recréez-le sur le bon commit.

## Partie E : partager ses tags
1. Lancez `git push`, puis regardez sur GitHub (onglet « Tags » du dépôt) : vos tags y sont-ils ?
2. Poussez-les : `git push --tags`. Vérifiez de nouveau.
3. Créez un tag `essai`, poussez-le, puis supprimez-le partout : `git tag -d essai` puis `git push origin --delete essai`.

## Questions
- Pourquoi `git push` seul n’envoie-t-il pas les tags ?
- Quelle différence entre un tag et un message de commit ?
- Pourquoi un tag ne se déplace-t-il jamais, contrairement à `HEAD` ?
