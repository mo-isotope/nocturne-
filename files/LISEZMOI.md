# Nocturne — serveur relais

Ce serveur fait deux choses : il **sert la page du jeu**, et il **met en relation
les deux joueurs**. Il ne calcule pas la partie — c'est l'hôte qui simule tout, le
serveur ne fait que transmettre les messages entre les deux téléphones.

Comme le jeu et le relais sont au même endroit, il n'y a qu'une seule adresse à
retenir, et le jeu trouve son relais tout seul.

## Les fichiers à déposer

Quatre fichiers, tous **à la racine du dépôt**, côte à côte :

- `serveur.js`
- `stockage.js`
- `package.json`
- `nocturne.html` — le jeu lui-même
- `LISEZMOI.md` (facultatif)

## Essayer chez soi d'abord

```bash
npm install
node serveur.js
```

Ouvrez `http://localhost:8080` : le jeu doit s'afficher directement.
`http://localhost:8080/etat` affiche l'état du relais en JSON, pratique pour
vérifier qu'il tourne.

Pour tester à deux sur le même réseau wifi, trouvez l'adresse locale de votre
machine (`ipconfig` sous Windows, `ifconfig` ou `ip a` sous Mac/Linux — quelque
chose comme `192.168.1.42`) et utilisez `ws://192.168.1.42:8080` comme adresse de
relais dans le jeu.

## Le mettre en ligne

N'importe quel hébergeur qui exécute Node.js fait l'affaire. Render, Railway et
Fly.io ont tous une offre gratuite suffisante ici — le serveur consomme très peu.

1. Poussez ce dossier sur un dépôt Git.
2. Créez un service web sur l'hébergeur, en pointant sur ce dépôt.
3. Commande de démarrage : `npm start`. Ne fixez pas le port : le code lit
   automatiquement la variable `PORT` que l'hébergeur fournit.
4. L'hébergeur vous donne une adresse en `https://xxx.onrender.com`. C'est
   l'adresse du jeu : ouvrez-la, la partie se lance. L'adresse du relais est
   remplie automatiquement, vous n'avez rien à régler.

## Page sur un site statique (recommandé)

Le relais gratuit de Render s'endort après 15 minutes sans visite. Si la page est
servie par le relais, on voit l'écran d'attente de Render pendant son réveil.
Solution : servir la page depuis un **site statique Render**, qui ne dort jamais.
Le jeu affiche alors tout de suite son propre écran de chargement et réveille le
relais en arrière-plan.

Mise en place, une seule fois :

1. Render → **New → Static Site**, même dépôt que le relais.
2. Root Directory : `files` — Build Command : laisser vide (ou `echo ok`) —
   Publish Directory : `.`
3. Onglet **Redirects/Rewrites** : Source `/`, Destination `/nocturne.html`,
   Action **Rewrite**.
4. Ouvrez l'adresse du site statique : c'est la nouvelle adresse du jeu.

L'adresse du relais est fixée dans `nocturne.html`, ligne
`window.RELAIS_EN_LIGNE = 'wss://…'` (en **wss://**, pas `ws://`). En local
(`localhost`, `192.168…`), le jeu utilise toujours le relais de la machine.
L'ancienne adresse du relais continue aussi de servir le jeu.

Le relais autorise les appels venant d'un autre site sur `/etat` et `/scores`
(en-têtes CORS), sans quoi le tableau des scores ne marcherait pas.

## Garder les scores (important)

Sans configuration, les scores sont écrits dans `scores.json` sur le disque du
serveur. Sur Render/Railway/Fly gratuits ce disque est **effacé à chaque
redémarrage ou mise en veille** : le tableau repart à zéro. Pour qu'ils restent :

1. Créez une base PostgreSQL gratuite (Neon, Supabase ou Aiven).
2. Copiez son adresse de connexion (`postgresql://...`).
3. Sur l'hébergeur, ajoutez la variable d'environnement `DATABASE_URL` avec cette
   adresse, puis redéployez. Le journal doit afficher « Scores : base PostgreSQL ».

## Autres points à connaître

Les offres gratuites mettent le serveur en veille après quelques
minutes sans trafic. La première connexion après une pause peut prendre 30 à 60
secondes à réveiller le service. Avec la page sur le site statique, c'est l'écran
de chargement du jeu qui couvre cette attente (bouton « Jouer sans attendre le
relais » pour lancer une partie solo tout de suite).

## Modifier le code du salon

Le code à quatre lettres n'est qu'une clé de regroupement. Deux joueurs qui
entrent le même code se retrouvent ensemble. Il n'y a pas de mot de passe : si
vous voulez éviter qu'un inconnu tombe sur votre partie, changez simplement de
code, ou allongez-le dans `codeSalon()` côté jeu.

## Consommation

Mesurée sur le scénario le plus chargé du jeu (Brasier en Cauchemar, une
quarantaine d'ennemis à l'écran) : environ 21 Ko/s en moyenne, 36 Ko/s en pointe,
soit à peu près 1,2 Mo par minute de jeu. C'est peu, même en 4G.
