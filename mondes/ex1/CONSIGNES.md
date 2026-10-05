# Exercice 1 — Des commits qui racontent une histoire

## Karel
Karel doit aller ramasser la balise puis revenir à sa case de départ, **face à l’ouest**.
Indice : pour faire demi-tour, il faut tourner à gauche deux fois.

## Git
Vous allez faire **au moins 4 commits**, un par étape :
1. Karel avance jusqu’à la balise.
2. Karel ramasse la balise.
3. Karel fait demi-tour.
4. Karel revient au départ.

Avant **chaque** commit :
- lancez `git diff` et lisez ce que vous allez enregistrer ;
- vérifiez que le programme s’exécute (même s’il n’est pas encore terminé) ;
- écrivez un message qui décrit la modification (« [1] Karel ramasse la balise », pas « modif » ni « test »).

À la fin, `git log --oneline` doit se lire comme le récit de votre solution. Poussez avec `git push`.
