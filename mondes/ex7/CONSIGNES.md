# Exercice 7 — Projet : Karel le jardinier

À partir de maintenant, **plus aucune commande Git n’est fournie**. Vous avez vu tout ce qu’il faut : à vous de choisir les bonnes.

## Le projet
Karel doit **ramasser toutes les balises** d’un champ. Son programme est unique (`mondes/ex7/programme.karel`) et va grandir au fil de 6 étapes. Chaque étape ajoute un monde (dans `mondes/ex7/mondes/`) sur lequel le programme doit aussi fonctionner.

**Règle d’or : à l’étape N, votre programme doit réussir les mondes 1 à N.** Ne cassez jamais un ancien monde pour en réussir un nouveau.

## Les étapes
| Étape | Monde | Objectif | Tag |
|---|---|---|---|
| 1 | `1_rang.monde` | Ramasser toutes les balises d’un rang. | `v1` |
| 2 | `2_champ.monde` | Nettoyer un champ de plusieurs rangs. | `v2` |
| 3 | `3_tas.monde` | Certaines cases contiennent plusieurs balises. | `v3` |
| 4 | `4_autre_coin.monde` | Karel ne part plus du même coin. | `v4` |
| 5 | `5_au_milieu.monde` | Karel part du milieu du champ. | `v5` |
| 6 | `6a_colonne.monde` et `6b_minuscule.monde` | Cas limites : un champ d’une seule colonne, puis d’une seule case. | `v6` |

## Ce que vous devez faire à chaque étape
1. Chargez le nouveau monde et regardez pourquoi votre programme actuel échoue.
2. Faites évoluer le programme en découpant éventuellement en plusieurs commits.
3. Utilisez le bouton « Tester sur plusieurs mondes » de `karel.html` (sélectionnez tous les mondes du dossier) : les mondes 1 à N doivent afficher ✅. Les mondes suivants afficheront ❌, c’est normal.
4. Préfixez vos commits par la mention `[7.x]` avec x correspondant au numéro de l’étape
5. Marquez la version terminée avec le tag `vN`.
6. Envoyez votre travail sur GitHub, tags compris.

## Indices
- **Étape 1 :** que se passe-t-il sur la toute dernière case du rang ?
- **Étape 2 :** parcourir un rang, monter, parcourir le rang suivant dans l’autre sens… Les fonctions sont vos amies.
- **Étape 3 :** une case, plusieurs balises : quelle structure répète tant qu’une condition est vraie ?
- **Étape 4 :** que faut-il connaître avant de commencer à balayer le champ ? Karel peut peut-être se mettre dans une situation connue.
- **Étape 5 :** si votre programme fonctionne déjà, profitez-en pour nettoyer le code et vos messages de commit avant de taguer.
- **Étape 6 :** si tout passe déjà, vérifiez que le code est lisible (noms, commentaires) et que l’historique est propre.

## Objectifs de fin de projet
Quand vous avez le tag `v6` :
1. L’historique (avec les tags visibles) doit se lire comme l’histoire de votre projet.
2. Trouvez comment afficher tout ce qui a changé entre `v2` et `v3`, et notez les modifications principales.
3. Retournez dans la version `v2` et vérifiez qu’elle échoue bien sur le monde 3. Revenez ensuite à la dernière version.
4. Sur GitHub, retrouvez la page qui montre le contenu de `v1`.
5. Si vous vous êtes trompé de commit en posant un tag, vous devez savoir le corriger sans laisser de trace erronée sur GitHub.
