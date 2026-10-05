# Exercice 8 — Projet : Karel dans le labyrinthe

Comme pour l’exercice 7, **aucune commande Git n’est fournie**.

## Le projet
Karel est perdu. Quelque part, une **balise** marque la sortie : il doit la trouver et la **ramasser**. Karel ne voit pas le plan du labyrinthe : il ne sait que ce qu’il perçoit autour de lui (devant, à gauche, à droite).

Un seul programme (`mondes/ex8/programme.karel`) grandit sur 6 étapes. Chaque étape ajoute un ou deux mondes (dans `mondes/ex8/mondes/`).

**Règle d’or : à l’étape N, votre programme doit réussir tous les mondes des étapes 1 à N.**

## Les étapes
| Étape | Mondes | Objectif | Tag |
|---|---|---|---|
| 1 | `1_couloir` | Un couloir droit : trouver la balise au bout. | `lab-1` |
| 2 | `2_coudes` | Le couloir tourne, à gauche et à droite. | `lab-2` |
| 3 | `3_impasses` | Des culs-de-sac apparaissent. | `lab-3` |
| 4 | `4a_labyrinthe`, `4b_grand_labyrinthe` | De vrais labyrinthes. | `lab-4` |
| 5 | `5a_depart_milieu`, `5b_dos_a_la_sortie` | Karel ne part plus de l’entrée. | `lab-5` |
| 6 | `6a_salle`, `6b_salle_piliers` | Des salles ouvertes, sans mur à proximité. | `lab-6` |

Les tags `v1` à `v6` de l’exercice 7 existent déjà : choisissez des noms différents, comme indiqué dans le tableau.

## À chaque étape
1. Chargez le nouveau monde et observez pourquoi votre programme actuel échoue.
2. Faites évoluer le programme.
3. Utilisez « Tester sur plusieurs mondes » avec tous les mondes du dossier : ceux des étapes 1 à N doivent afficher ✅.
4. Préfixez vos commits par la mention `[8.x]` avec x correspondant au numéro de l’étape
5. Marquez la version terminée avec le tag de l’étape.
6. Envoyez votre travail sur GitHub, tags compris.

## Indices
- **Étape 1 :** comment Karel sait-il qu’il est arrivé ? Et que doit-il faire une fois arrivé ?
- **Étape 2 :** à un coude, un seul côté est libre. Que faut-il tester pour choisir ?
- **Étape 3 :** que fait Karel dans une impasse (bloqué devant, à gauche et à droite) ? Une règle simple, qui marche à tous les carrefours, est possible : pensez à quelqu’un qui suit un mur avec une main posée dessus.
- **Étape 4 :** si votre programme ne marche que sur le monde 3, il est trop spécifique. Testez-le sur tous les mondes.
- **Étape 5 :** si votre règle est générale, elle fonctionne déjà. Profitez-en pour nettoyer le code et l’historique avant de taguer.
- **Étape 6 :** dans une salle ouverte, Karel peut tourner en rond pour toujours (le simulateur finit par signaler une boucle infinie). Que doit-il faire avant de longer un mur ? Attention à ne pas casser les mondes précédents.
