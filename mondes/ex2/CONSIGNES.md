# Exercice 2 — Corriger son dernier commit

## Karel
Karel part du coin haut-gauche. Il doit poser une balise dans les trois autres coins du carré en parcourant son bord, puis revenir à sa case de départ, face au nord.
Karel ne sait pas tourner à droite : écrivez une fonction `tourner_droite` avec `definir`, puis utilisez-la.

## Git : `git commit --amend`
**Règle : on n’amende que les commits qui n’ont pas encore été poussés.**

### Partie A : la faute de frappe
1. Écrivez le début de votre programme (par exemple Karel va récupérer la première balise en haut à droite) et commitez.
2. Modifiez le programme en écrivant volontairement `tourner_gauch` quelque part. Commitez avec le message « [2] Karel tourne à droite ».
3. Exécutez le programme : lisez le message d’erreur.
4. Corrigez la faute, puis **sans créer de nouveau commit** : `git add mondes/ex2/programme.karel` et `git commit --amend --no-edit`.
5. Vérifiez avec `git log --oneline` : il n’y a pas de commit « oups ».

### Partie B : le fichier oublié
1. Créez `mondes/ex2/notes.md` où vous expliquez en comment fonctionne `tourner_droite`.
2. Terminez votre programme, faites `git add mondes/ex2/programme.karel` seulement, et commitez.
3. Lancez `git status` : `notes.md` a été oublié. Ajoutez-le au commit précédent avec `git add` puis `git commit --amend --no-edit`.
4. Changez enfin le message du dernier commit : `git commit --amend -m "[2] Karel termine son tour"`.

Poussez avec `git push` quand tout est propre.
