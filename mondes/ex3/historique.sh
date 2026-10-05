#!/bin/sh
# Crée 5 commits qui font évoluer mondes/ex3/programme.karel.
set -e
cd "$(git rev-parse --show-toplevel)"
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "Commitez ou annulez vos modifications avant de lancer ce script."; exit 1
fi
if git log --oneline | grep -q "[3] Karel avance jusqu’au mur"; then
  echo "L’historique existe déjà."; exit 1
fi
f=mondes/ex3/programme.karel

cat > $f <<"EOT"
tant que devant_libre:
    avancer
EOT
git add $f; git commit -q -m "[3] Karel avance jusqu’au mur"

cat > $f <<"EOT"
definir tourner_droite:
    repeter 3 fois:
        tourner_gauche

tant que devant_libre:
    avancer
tourner_gauche
avancer
tourner_droite
avancer
avancer
tourner_droite
avancer
tourner_gauche
avancer
avancer
EOT
git add $f; git commit -q -m "[3] Karel contourne le mur par le haut"

echo "ramasser_balise" >> $f
git add $f; git commit -q -m "[3] Karel ramasse la balise"

sed -i "s/repeter 3 fois:/repeter 2 fois:/" $f
git add $f; git commit -q -m "[3] Simplification de tourner_droite"

{ echo "# Karel contourne un mur et ramasse une balise"; echo; cat $f; } > $f.new && mv $f.new $f
git add $f; git commit -q -m "[3] Ajout de commentaires"

echo "Historique créé. Lancez : git log --oneline"
