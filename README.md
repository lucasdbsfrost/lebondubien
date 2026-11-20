# Le Bon du Bien — le site

## L'ouvrir

Double-clique sur `index.html`. C'est tout : pas de serveur, pas d'installation, pas d'internet nécessaire (sauf pour les images tant qu'elles ne sont pas dans le dossier, voir plus bas).

Les pages s'ouvrent par l'adresse après le `#` : `index.html#/apotres/trotskov`, `index.html#/code/immaculem`, etc. Tu peux les mettre en favori ou les partager.

## Ce qu'il y a dans le dossier

```
index.html        la page (en-tête, pied de page, fenêtre « Rejoindre l'Éveil »)
css/style.css     tout le style : couleurs en haut du fichier (--sang, --or, --nuit…)
js/app.js         le moteur : il lit les textes et construit chaque page
data/site.js      accueil, foi, origines, branches, reliques, liens Discord
data/apotres.js   les 9 apôtres et leurs chapitres
data/chroniques.js  Agapol, Asheville, les Neuf Jours
data/code.js      le Code du Bon du Bien et les Lois d'Immaculem
fonts/            les polices (Cinzel, EB Garamond, Special Elite), en local
images/           les illustrations
```

## Les entrées au défilement

Chaque grande page commence par un trajet : on avance en faisant défiler jusqu'à un lieu.

- Accueil : on pousse les portes de l'église, on remonte la nef jusqu'au chœur et sa verrière.
- La Foi : la verrière aux trois couleurs.
- Les Origines : on descend dans la crypte, une arche par génération (I à VI), jusqu'à la stèle du serment.
- Les Branches : la croisée et ses trois portes.
- Les Apôtres : la bibliothèque, jusqu'au rayon des neuf Vies.
- Les Reliques : la porte du coffre s'ouvre sur le trésor.
- Les Chroniques : la salle des bannières de guerre.
- Le Code : le lutrin et son grand livre ouvert.

Tout est dessiné dans `js/passages.js` (une fonction par lieu). La longueur de chaque trajet est le nombre après `passage('…', …,` dans `js/app.js` : 300 = trois écrans de défilement. Le bouton « Passer l'entrée » saute directement au contenu.

## Modifier un texte

Tout le contenu est dans `data/`. Ouvre le fichier avec un éditeur de texte (VS Code, Notepad++), cherche la phrase, change-la, enregistre, recharge la page.

Attention aux guillemets : dans `data/`, les textes sont entre `'…'` ou entre `` `…` ``. Si ta phrase contient une apostrophe droite `'`, utilise l'apostrophe typographique `’` à la place, ou mets un `\` devant : `l\'Éveil`.

Dans les chapitres (apôtres, chroniques), une ligne vide sépare deux paragraphes.

## Les images

Le site cherche d'abord les images dans `images/` :

- `blason.png` (le blason au centre du triangle)
- `moines.png`, `fideles.png`, `templiers.png` (les branches)
- `kerberos.png`, `justitia.png` (les légions)

Si une image manque, il va la chercher sur lebondubien.fr. Si elle n'y est pas non plus, elle est simplement masquée, sans icône cassée. Pour que le site marche hors ligne, copie ces 6 fichiers dans `images/` avec exactement ces noms.

## Les liens Discord

Dans `data/site.js`, tout en haut, la partie `univers` : un lien par univers (neutre, Metro, Garry's Mod, Minecraft). Le choix du visiteur est retenu dans son navigateur, comme sur l'ancien site.

## En ligne

Il suffit d'envoyer le dossier tel quel (GitHub Pages, ton hébergeur actuel…). Une limite à connaître : comme les pages passent par `#/`, Google ne voit qu'une seule page. Si le référencement compte, il faudra plus tard générer une vraie page HTML par section.
