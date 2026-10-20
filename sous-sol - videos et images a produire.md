# Sous-sol secret — vidéos et images à produire

Le feu de bois (« Créer animation feu 16 bits ») a servi de modèle : caméra fixe, fond uni,
8 secondes, 1280×720, 24 images/s. Je m'occupe du reste (découpe, détourage, boucle,
intégration dans le jeu).

## Règles communes à toutes les vidéos

- **Pixel art 16 bits**, vue **3/4 plongeante** comme le jeu (on voit le dessus et la face avant).
- **Caméra FIXE** : aucun zoom, aucun travelling, aucun tremblement.
- **Fond UNI** : une seule couleur plate, sans dégradé, sans vignette, sans texture, **sans sol
  ni ombre portée**. La couleur du fond est indiquée pour chaque vidéo et n'apparaît jamais dans
  le sujet.
- **Sujet seul, centré, entier dans le cadre**, environ la moitié de la hauteur de l'image,
  marges d'au moins 15 %.
- **Pas de fumée grise, de brouillard, de poussière sombre, de flou de mouvement** : ça se
  confond avec le fond et abîme la découpe (la fumée de la vidéo du feu a dû être écartée).
- **Marches : sur place**, de profil légèrement de trois quarts, **tourné vers la droite**, pas
  régulier. Je choisis moi-même le morceau qui boucle le mieux.
- Pour chaque sujet, générez de préférence **deux prises** : on garde la meilleure.

---

## Priorité 1 — de quoi jouer le sous-sol

### 1. Cerbère, marche  (`cerbere_marche.mp4`) — fond vert `#00B140`
> Pixel art 16 bits, vue 3/4 plongeante, caméra fixe, fond vert uni sans ombre ni sol. Un
> gigantesque chien de l'enfer à **trois têtes** marche sur place, de profil vers la droite :
> pelage noir charbon, crinière de braises, trois gueules grondantes aux yeux rouges, bave
> brillante, pattes massives, queue lourde. Démarche lente, pesante, les trois têtes
> oscillent à contretemps. Boucle de marche régulière. 8 secondes.

### 2. Cerbère, attaque  (`cerbere_attaque.mp4`) — fond vert `#00B140`
> Même chien à trois têtes, même style, même fond. Il s'arrête, se ramasse sur ses pattes
> arrière, puis **projette ses trois têtes en avant** gueules grandes ouvertes, crocs
> dehors, et reprend sa posture. Le geste se répète trois fois dans la vidéo. 6 à 8 secondes.
> *(Je m'en sers pour la charge du boss, comme pour la Faucheuse.)*

### 3. La plante, pousse  (`plante_pousse.mp4`) — fond magenta `#FF00FF`
> Pixel art 16 bits, vue 3/4 plongeante, caméra fixe, fond magenta uni. Une **plante
> légendaire** sort de terre : une pousse, puis des tiges vert profond aux feuilles larges,
> et enfin un grand **bulbe-fleur doré qui s'ouvre et rayonne** d'une lumière chaude. Elle est
> plantée dans un petit monticule de terre sombre. Pas de rose ni de violet. 6 secondes.

### 4. La plante, mûre  (`plante_boucle.mp4`) — fond magenta `#FF00FF`
> Même plante, même style, **déjà épanouie** : feuilles qui ondulent doucement, fleur dorée
> qui pulse et laisse monter quelques étincelles dorées. Parfaitement bouclée. 6 à 8 secondes.

### 5. Chapelle lumineuse  (`chapelle_lumineuse.mp4`) — fond bleu nuit `#131021`
Image de départ fournie : `png/references_sous_sol/chapelle.png` (la chapelle actuelle du jeu),
à utiliser **en image→vidéo** pour garder exactement le même dessin.
> Animez cette chapelle sans la modifier : la lumière **chaude et dorée** coule par la porte
> et les fenêtres, pulse lentement comme si quelque chose de vivant dormait à l'intérieur,
> quelques lucioles dorées montent le long des murs. Aucun mouvement de caméra. Boucle de
> 6 secondes.

---

## Priorité 2 — les ennemis du sous-sol (marche sur place, comme le Cerbère)

| Fichier | Créature | Fond |
|---|---|---|
| `araignee_marche.mp4` | **Araignée des cavernes** : corps noir et violet, huit pattes, yeux en grappe, rapide et nerveuse | vert `#00B140` |
| `mineur_marche.mp4` | **Squelette de mineur** : casque cabossé avec lampe, pioche à l'épaule, démarche traînante | vert `#00B140` |
| `champignon_marche.mp4` | **Champignon errant** : grand chapeau brun à pois clairs, petits pieds, spores qui s'échappent par le haut | magenta `#FF00FF` |
| `golem_marche.mp4` | **Golem de cristal** : corps de roche sombre hérissé de cristaux bleus qui brillent, très lent, très lourd | magenta `#FF00FF` |

Prompt type (à adapter) :
> Pixel art 16 bits, vue 3/4 plongeante, caméra fixe, fond [couleur] uni sans ombre ni sol.
> [Créature + description] marche sur place, de profil vers la droite, démarche régulière et
> bouclée. 8 secondes.

---

## Priorité 3 — l'ambiance et le final

### 6. L'escalier de sortie  (`escalier.mp4`) — fond bleu nuit `#131021`
> Pixel art 16 bits, vue 3/4 plongeante, caméra fixe, fond uni. Un **escalier de pierre usée
> qui monte** vers une lumière chaude et dorée (en haut de l'image) ; la lumière pulse
> doucement, quelques grains de poussière dorée flottent dedans. Parfaitement bouclée.
> 6 secondes.

### 7. L'effondrement du sol  (`effondrement.mp4`) — fond vert `#00B140`
> Pixel art 16 bits, vue de dessus légèrement inclinée, caméra fixe, fond vert uni. Une
> **plaque circulaire de dalles de pierre** (environ cinq dalles de large) : elle se fissure
> en étoile, des blocs se détachent un à un et **tombent en tournant** vers le bas de l'image,
> puis la plaque entière s'écroule et il ne reste rien. Poussière claire et beige seulement,
> **pas de fumée grise**. 6 secondes.
> *(Dessous, le jeu dessine un trou noir : la vidéo ne sert qu'aux dalles.)*

### 8. Aura du personnage géant ×3  (`aura_geant.mp4`) — fond bleu nuit `#131021`
> Pixel art 16 bits, caméra fixe, fond uni. Un **anneau de flammes d'énergie dorée et
> blanche**, vide au centre, qui tourbillonne et dégage des étincelles. Boucle parfaite.
> 6 secondes.

### 9. Cristaux et champignons lumineux  (`cristaux.mp4`, `champignons_lumineux.mp4`) — fond bleu nuit `#131021`
> Un groupe de **trois cristaux bleus** (ou : de **champignons géants phosphorescents**
> vert-cyan) qui pulsent de lumière tour à tour. Boucle parfaite. 6 secondes chacun.

---

## Images fixes (pas de vidéo)

Comme pour vos planches de décors précédentes : **une planche par image, fond blanc uni, objets
bien séparés, chacun entier**, même style 16 bits et même vue 3/4.

### A. Planche « décors du sous-sol »
Stalagmites (3 tailles) · colonnes de roche (2) · gros rochers (2) · stalactite tombée au sol ·
chariot de mine · pioche plantée dans le sol · rails (2 segments droits, 1 courbe) · caisse en
bois · lanterne posée · squelette de mineur écroulé · tas de pierres · petite mare souterraine ·
toile d'araignée au sol · entrée de tunnel étayée de poutres.

### B. Sol de caverne  (`sol_caverne.png`)
Texture de roche et de terre sombre, **carrée 512×512, qui se répète sans couture**, vue de
dessus, quelques cailloux et fissures, ton bleu-gris froid très sombre.

### C. Mur de roche  (`mur_roche.png`)
Un bloc de roche brute carré, vue 3/4 : face avant visible et dessus, **même proportion que le
mur de briques du jeu**, qui s'aligne côte à côte sans trou ni coupure.

### D. Le trou  (`trou.png`)
Le trou laissé par l'effondrement : bord de dalles brisées autour d'un puits noir, vue de dessus
légèrement inclinée, fond blanc uni, environ cinq dalles de large.

---

## Ce que je fais en attendant

Je peux commencer la mécanique avec les sprites actuels comme **remplaçants** (les monstres
existants pour les ennemis, le colosse pour le boss) ; chaque vidéo livrée les remplacera ensuite par
un script d'extraction, sans toucher au code.
