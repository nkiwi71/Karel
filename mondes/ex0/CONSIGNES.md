# Exercice 0 — Premier commit

## Karel
Faites avancer Karel de 3 cases vers l’est. Une commande par ligne : `avancer`.

## Git
1. Vérifiez votre identité : `git config user.name` et `git config user.email`. Sinon, configurez-les.
2. Après avoir écrit votre programme, lancez `git status`. Que voyez-vous ?
3. Ajoutez le fichier : `git add mondes/ex0/programme.karel`, puis relancez `git status`. Qu’est-ce qui a changé ?
4. Commitez : `git commit -m "[0] Karel avance de 3 cases"`. A l’avenir, tous les commits devront être préfixés du numéro de l'exercice entre crochets.
5. Affichez l’historique : `git log --oneline`.
6. Créez un fichier `brouillon.tmp` (contenu libre). Lancez `git status` : pourquoi n’apparaît-il pas ? (Regardez `.gitignore`.)
7. Poussez sur GitHub : `git push`. Vérifiez dans votre navigateur que le commit est visible.
