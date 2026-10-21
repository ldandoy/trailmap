---
theme: default
title: Séance 1 — Découverte de React Native & Expo
info: |
  ## Séance 1 — Développement mobile (ECE)
  Comprendre l'écosystème mobile, installer Expo, créer le projet TrailMap
  et afficher son premier écran.
class: cover text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
mdc: true
fonts:
  sans: 'Plus Jakarta Sans'
  serif: 'Plus Jakarta Sans'
  mono: 'Fira Code'
colorSchema: light
browserExporter: false
record: false
contextMenu: false
editor: false
---

# Développement mobile

<div class="text-xl opacity-90 mt-4">Séance 1 — Découverte de React Native & Expo</div>

<div class="mt-10 text-base opacity-80">
ECE · 24 h · 12 séances
</div>

<!--
Première séance. L'objectif n'est PAS de tout comprendre du mobile, c'est que
tout le monde reparte avec Expo installé, le projet TrailMap créé, et un écran
qui s'affiche sur SON téléphone. Le "waouh" du QR code qui lance l'app sur le
téléphone perso fait énormément pour la motivation. Prévoir large sur l'install.
-->

---
layout: default
---

# Au programme de ce cours

Douze séances de deux heures. À la fin, chacun de vous aura **une vraie application mobile**, qui tourne sur son téléphone, affiche des données depuis une API, et ouvre une carte.

| Séances | Ce qu'on y fait |
|---|---|
| **1 → 4** | Les bases : Expo, composants, interactions, listes de données |
| **5 → 9** | La vraie app : API, navigation, formulaires, persistance, connexion |
| **10 → 12** | La finition : carte & géolocalisation, qualité, build |

<div class="mt-6">

On ne fait pas de théorie pour la théorie. Chaque séance se termine sur **quelque chose qui s'affiche à l'écran**.

</div>

---
layout: default
---

# Le fil rouge : TrailMap

On construit **une seule application**, du début à la fin du cours.

**TrailMap**, c'est une application de randonnée : on y parcourt une liste de sentiers, on ouvre la fiche détaillée de chacun, on met ses préférés en favori, et on les voit tous **sur une carte**.

C'est volontairement simple à comprendre. Ce qui est intéressant, ce n'est pas le sujet : c'est **tout ce qu'il contient**.

| Ce qu'il faut apprendre | Où ça apparaît dans TrailMap |
|---|---|
| Afficher une liste de données | La liste des sentiers |
| Naviguer entre des écrans | Liste → fiche d'un sentier |
| Lire et écrire via une API | Charger, ajouter, modifier un sentier |
| Garder une info sur le téléphone | Les favoris, même après avoir fermé l'app |
| Utiliser le matériel du téléphone | La carte et le GPS |

---
layout: default
---

# Ce que vous aurez à la fin

<pre class="oc-panel">
   ┌─────────────────────────┐        ┌─────────────────────────┐
   │  📋  Sentiers           │        │  🗺️  Carte              │
   │  ───────────────────    │        │        ▲                │
   │  🥾 Cascade du Hérisson │        │     📍   📍             │
   │     Facile · 7 km       │        │   📍        ▲           │
   │  ───────────────────    │        │      📍  ● moi          │
   │  🥾 Crêtes du Jura   ❤️ │        │         📍              │
   │     Difficile · 14 km   │        │    📍       📍          │
   │  ───────────────────    │        │                         │
   │  [ Sentiers ][ Favoris ][ Carte ]│ [ Sentiers ][ Favoris ][ Carte ]│
   └─────────────────────────┘        └─────────────────────────┘
</pre>

Une application qui tourne sur **votre** téléphone, avec de vraies données et une carte interactive. Aujourd'hui, on pose la première brique : **le projet existe et un écran s'affiche.**

---
layout: section
---

# 1. Comprendre le mobile

---
layout: default
---

# Trois façons de faire une app mobile

Avant d'écrire une ligne, il faut savoir **ce qu'on choisit** — et pourquoi.

| Approche | Comment | Le prix à payer |
|---|---|---|
| **Natif** | Kotlin pour Android, Swift pour iOS | Deux codes, deux équipes, deux fois le travail |
| **Cross-platform** | **Un seul code** pour Android **et** iOS | Une fine couche entre vous et le natif |
| **Web mobile** | Un site adapté au téléphone | Pas dans le store, pas d'accès au GPS/caméra complet |

<div class="mt-6">

Le natif reste la référence en performance. Mais écrire **deux fois** la même app coûte cher. C'est le problème que **React Native** résout : un seul code, deux vraies applications natives.

</div>

---
layout: default
---

# React Native, en un schéma

Vous écrivez du **JavaScript** (avec React). React Native le traduit en **vrais composants natifs** — pas une page web déguisée.

<pre class="oc-panel">
   VOTRE CODE                    REACT NATIVE                LE TÉLÉPHONE
   ┌──────────────┐              ┌──────────────┐            ┌──────────────┐
   │ JavaScript   │              │  traduit vos │            │  Android →   │
   │ + React      │ ───────────► │  composants  │ ─────────► │  vrai bouton │
   │              │              │  en natif    │            │  Android     │
   │ &lt;Text&gt;       │              │              │            │  iOS →       │
   │ &lt;View&gt;       │              │              │            │  vrai bouton │
   │ &lt;Button&gt;     │              │              │            │  iOS         │
   └──────────────┘              └──────────────┘            └──────────────┘
</pre>

Un `<Text>` que vous écrivez devient un vrai composant texte Android **et** un vrai composant texte iOS. Vous écrivez une fois, l'utilisateur voit du natif.

<div class="mt-4 opacity-80">

Bonne nouvelle si vous avez déjà vu React : **c'est le même React**. Mêmes composants, même `useState`, même JSX. On remplace juste `<div>` par `<View>` et `<p>` par `<Text>`.

</div>

---
layout: default
---

# Pourquoi Expo (et pas React Native « tout seul »)

React Native seul demande d'installer **Android Studio**, le SDK Android, un émulateur, de configurer Java... Une heure par machine, et ça casse souvent. En cours, on n'a pas ce temps.

**Expo** est la boîte à outils **officiellement recommandée** pour démarrer avec React Native. Elle enlève toute cette installation.

| Sans Expo | Avec Expo |
|---|---|
| Android Studio + SDK + émulateur | L'app tourne sur **votre propre téléphone** |
| iOS impossible sans un Mac | iOS testable via l'app Expo Go |
| Configuration longue et fragile | `npx create-expo-app`, et c'est parti |
| Accès caméra/GPS à configurer à la main | Fourni, prêt à l'emploi |

<div class="mt-4 opacity-80">

Expo n'est pas une version « au rabais » : les grandes apps l'utilisent en production. Et le jour où on a besoin du natif brut, une commande (`npx expo prebuild`) régénère les dossiers `android/` et `ios/`. On ne se ferme aucune porte.

</div>

---
layout: section
---

# 2. Installer les outils

---
layout: default
---

# Ce qu'on installe aujourd'hui

Trois choses, et rien d'autre. Chacune règle un problème précis.

| Outil | À quoi il sert | Où |
|---|---|---|
| **Node.js** | Faire tourner les outils JavaScript (dont Expo) | Sur l'ordinateur |
| **VS Code** | Écrire le code | Sur l'ordinateur |
| **Expo Go** | Voir l'app en direct, sans build | Sur **votre téléphone** |

<div class="mt-8">

Pas d'Android Studio, pas de Xcode. Votre téléphone **est** votre appareil de test. Ceux qui n'ont pas de smartphone utiliseront un émulateur — on verra ça au cas par cas.

</div>

<!--
Insister : on installe peu. La séance 1 rate quand on essaie d'installer dix
choses et que la moitié de la classe décroche sur un message d'erreur Java.
-->

---
layout: default
---

# Installer Node.js

Node.js exécute du JavaScript en dehors du navigateur. C'est lui qui fera tourner Expo et tous les outils du cours. On prend la version **LTS** (la version stable, support long).

Téléchargez sur **[nodejs.org](https://nodejs.org)** et laissez toutes les options par défaut.

Puis, dans un terminal, on vérifie que les **deux** commandes répondent :

```bash
node --version
npm --version
```

Vous devez voir deux numéros de version, par exemple `v22.11.0` et `10.9.0`. `npm` (le gestionnaire de paquets) est installé **automatiquement** avec Node.

<div class="mt-4 opacity-80">

Si une commande n'est pas reconnue, **fermez et rouvrez votre terminal** : c'est le cas neuf fois sur dix.

</div>

---
layout: default
---

# Installer Expo Go sur le téléphone

C'est l'application qui va afficher votre projet **en direct** pendant que vous codez. Elle sert de « lecteur » pour votre app tant qu'elle est en développement.

<pre class="oc-panel">
  Android          →   Google Play Store   →   chercher "Expo Go"   →   Installer
  iPhone / iPad    →   App Store           →   chercher "Expo Go"   →   Installer
</pre>

Une condition **essentielle** pour la suite : le téléphone et l'ordinateur doivent être sur **le même réseau Wi-Fi**. C'est comme ça qu'ils se parleront.

<div class="mt-6">

En amphi, le Wi-Fi de l'école peut bloquer cette communication. Plan B prévu : le **mode tunnel** d'Expo (on le verra si besoin), qui passe par internet plutôt que par le Wi-Fi local.

</div>

---
layout: section
---

# 3. Créer le projet

---
layout: default
---

# Créer le projet TrailMap

On génère le projet avec l'outil officiel. Le `--template blank-typescript` demande un projet **vide et en TypeScript** : la base la plus simple pour démarrer, sans fioritures à comprendre le premier jour.

```bash
# bash / macOS / Linux
npx create-expo-app@latest trailmap --template blank-typescript
cd trailmap
```

```powershell
# PowerShell / Windows
npx create-expo-app@latest trailmap --template blank-typescript
Set-Location trailmap
```

La commande télécharge et installe tout ce qu'il faut (cela prend une à deux minutes la première fois). `npx` exécute l'outil sans l'installer durablement : pratique pour une commande qu'on ne lance qu'une fois.

<div class="mt-4 opacity-80">

**TypeScript**, c'est du JavaScript qui vérifie les types. Il attrapera vos fautes d'inattention **avant** que l'app ne plante. On l'utilisera dès le début, en douceur.

</div>

---
layout: default
---

# Ce que la commande a créé

Regardons le dossier obtenu. Quelques fichiers seulement, chacun avec un rôle.

<pre class="oc-panel">
trailmap/
├── App.tsx            ← LE fichier de départ : votre premier écran
├── app.json           ← la config de l'app (nom, icône, écran de démarrage)
├── package.json       ← la liste des librairies du projet
├── tsconfig.json      ← les réglages TypeScript
├── assets/            ← images : icône de l'app, écran de démarrage
└── node_modules/      ← les librairies installées (jamais touché à la main)
</pre>

Celui qui nous intéresse aujourd'hui, c'est **`App.tsx`**. C'est le point d'entrée : ce que React Native affiche au lancement. Tout le reste, on le découvrira au fil des séances.

<div class="mt-4 opacity-80">

`.tsx` = un fichier TypeScript qui contient de l'interface (le « x » est pour le JSX, la syntaxe des composants). On y vient tout de suite.

</div>

---
layout: default
---

# Lancer l'application

Depuis le dossier `trailmap`, on démarre le serveur de développement :

```bash
npx expo start
```

Un **QR code** apparaît dans le terminal. La suite se passe sur le téléphone :

<pre class="oc-panel">
  Android   →   ouvrir Expo Go   →   "Scan QR code"   →   viser le terminal
  iPhone    →   appareil photo    →   viser le QR code  →   toucher la notification
</pre>

Quelques secondes de chargement, et **votre app s'ouvre sur votre téléphone**. Laissez ce terminal tourner pendant toute la séance : c'est lui qui envoie l'app au téléphone.

<div class="mt-4 opacity-80">

Pas de téléphone sous la main ? Appuyez sur `a` dans le terminal pour un émulateur Android, ou `w` pour ouvrir dans le navigateur.

</div>

---
layout: section
---

# 4. Lire son premier écran

---
layout: default
---

# Le contenu de `App.tsx`

Voici, presque à l'identique, ce que le template a écrit dans `App.tsx`. C'est un écran complet, en quelques lignes.

```tsx
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
```

On décortique chaque partie dans les slides suivantes.

---
layout: default
---

# `View` et `Text` : les deux briques de base

En web, on écrit `<div>` et `<p>`. En React Native, ça n'existe pas. On a des **composants natifs** :

| Composant | En web, c'est... | Rôle |
|---|---|---|
| `<View>` | `<div>` | Une **boîte** : elle regroupe et positionne le contenu |
| `<Text>` | `<p>` / `<span>` | Du **texte** — et **tout** texte doit être dans un `<Text>` |
| `<Image>` | `<img>` | Une image |

<div class="mt-4">

La règle qui surprend au début : **on ne peut pas écrire du texte « en vrac »**. Ceci plante :

</div>

```tsx
<View>Bonjour</View>          {/* ❌ erreur : du texte hors d'un <Text> */}
<View><Text>Bonjour</Text></View>   {/* ✅ correct */}
```

Ces composants viennent de la librairie `react-native` : c'est la ligne `import { ... } from 'react-native'` en haut du fichier.

---
layout: default
---

# Le style : `StyleSheet` et Flexbox

Pas de CSS séparé en mobile. Le style est un **objet JavaScript**, créé avec `StyleSheet.create`, puis branché sur un composant avec `style={...}`.

```tsx
const styles = StyleSheet.create({
  container: {
    flex: 1,                    // occuper tout l'espace disponible
    alignItems: 'center',       // centrer horizontalement
    justifyContent: 'center',   // centrer verticalement
    backgroundColor: '#fff',
  },
})
```

Trois propriétés font déjà 90 % du travail de mise en page :

| Propriété | Ce qu'elle fait |
|---|---|
| `flex: 1` | « Prends toute la place disponible » |
| `alignItems` | Aligner sur l'axe horizontal (`center`, `flex-start`...) |
| `justifyContent` | Aligner sur l'axe vertical (`center`, `space-between`...) |

<div class="mt-3 opacity-80">

C'est **Flexbox**, comme en CSS — mais ici c'est la seule façon de positionner, et tout est en colonne par défaut. On l'approfondit en séance 2.

</div>

---
layout: default
---

# Notre premier écran TrailMap

Remplaçons le contenu de `App.tsx` par un vrai écran d'accueil. On garde la structure, on change le texte et on ajoute un peu de style.

```tsx
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🥾</Text>
      <Text style={styles.titre}>TrailMap</Text>
      <Text style={styles.sousTitre}>Trouvez votre prochaine randonnée</Text>
      <StatusBar style="auto" />
    </View>
  )
}
```

Le tableau de styles est sur la slide suivante. Dès que vous enregistrez le fichier, l'écran se met à jour **tout seul** sur le téléphone.

---
layout: default
---

# Notre premier écran TrailMap — les styles

La suite du même fichier `App.tsx` : le bloc `styles` qui habille les trois textes.

```tsx
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#135635',       // le vert de TrailMap
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 64 },
  titre: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  sousTitre: {
    fontSize: 16,
    color: '#cfe8d5',
    marginTop: 8,
  },
})
```

Un fond vert, une grosse chaussure, le nom de l'app et une accroche. **C'est votre premier écran mobile.**

---
layout: default
---

# Le rechargement instantané

Vous n'aurez **jamais** à fermer et relancer l'app pendant que vous codez. C'est le confort le plus marquant du mobile moderne.

| Vous faites... | Ce qui se passe |
|---|---|
| Enregistrer le fichier (`Ctrl/Cmd + S`) | L'écran se met à jour en **moins d'une seconde** |
| Secouer le téléphone | Un menu de développement s'ouvre |
| Une faute de frappe dans le code | Un écran rouge décrit l'erreur, ligne à l'appui |

<div class="mt-6">

L'**écran rouge d'erreur** n'est pas une punition : c'est votre meilleur outil. Il dit **quel fichier**, **quelle ligne**, et **quel est le problème**. On apprend à le lire — on ne le fuit pas.

</div>

<div class="mt-4 opacity-80">

Essayez : changez `TrailMap` en `TrailMap 🌲`, enregistrez, et regardez le téléphone. Voilà votre boucle de travail pour tout le cours.

</div>

---
layout: section
---

# 5. Atelier

---
layout: default
---

# À faire maintenant

Le reste de la séance est pour vous. L'objectif : **que l'écran d'accueil de TrailMap s'affiche sur votre téléphone.**

1. Installer Node.js, vérifier `node --version` et `npm --version`
2. Installer **Expo Go** sur votre téléphone
3. Créer le projet : `npx create-expo-app@latest trailmap --template blank-typescript`
4. Lancer `npx expo start` et scanner le QR code
5. Vérifier que l'app de départ s'ouvre sur le téléphone
6. Remplacer `App.tsx` par l'écran d'accueil TrailMap (titre + accroche + fond vert)
7. Changer une couleur ou un texte, enregistrer, **voir l'écran se mettre à jour tout seul**

<div class="mt-6">

Je passe dans les rangs. **Levez la main dès que quelque chose bloque** — ne restez pas coincé dix minutes en silence, surtout sur l'installation.

</div>

---
layout: default
---

# Les erreurs qu'on va rencontrer

Autant les annoncer : elles vont toutes arriver dans cette salle aujourd'hui.

<div class="oc-col1-40">

| Symptôme | Ce qu'il veut dire | La solution |
|---|---|---|
| `'node' n'est pas reconnu` | Terminal ouvert avant l'installation | Fermer et rouvrir le terminal |
| Le QR code ne charge pas | Téléphone et PC pas sur le même Wi-Fi | Même réseau, ou `npx expo start --tunnel` |
| Écran rouge `Unexpected token` | Une faute de frappe dans le code | Lire la ligne indiquée, corriger |
| `Text strings must be rendered...` | Du texte hors d'un `<Text>` | Envelopper le texte dans `<Text>` |
| Rien ne se met à jour | Le serveur `expo start` a été fermé | Le relancer dans le dossier `trailmap` |

</div>

---
layout: default
---

# Ce qu'on a mis en place

```bash
# Les outils
node --version
npm --version

# Le projet
npx create-expo-app@latest trailmap --template blank-typescript
cd trailmap

# Le lancer, puis scanner le QR code avec Expo Go
npx expo start
```

```tsx
// App.tsx — le cœur de l'écran d'accueil
export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🥾</Text>
      <Text style={styles.titre}>TrailMap</Text>
      <Text style={styles.sousTitre}>Trouvez votre prochaine randonnée</Text>
    </View>
  )
}
```

---
layout: default
---

# Séance prochaine

**Séance 2 — Composants & mise en page.**

On part de cet écran unique pour construire une **vraie carte de sentier** : une photo, un nom, un niveau de difficulté, une distance — le bloc qu'on répétera ensuite pour faire toute la liste.

On y creuse **Flexbox** (lignes, colonnes, espacements), les composants `<Image>` et `<ScrollView>`, et la façon de passer des informations à un composant avec les **props**.

<div class="mt-8">

**Pour la prochaine fois** — vérifiez que ces trois points fonctionnent chez vous :

</div>

```bash
node --version          # une version s'affiche
npx expo start          # le QR code apparaît
# et l'écran TrailMap s'ouvre bien dans Expo Go
```
