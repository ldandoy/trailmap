---
theme: default
title: Séance 2 — Composants & mise en page
info: |
  ## Séance 2 — Développement mobile (ECE)
  Flexbox, Image, ScrollView et les props : construire la carte d'un sentier,
  puis la rendre réutilisable.
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

<div class="text-xl opacity-90 mt-4">Séance 2 — Composants & mise en page</div>

<div class="mt-10 text-base opacity-80">
ECE · 24 h · 12 séances
</div>

<!--
Séance très visuelle. On passe d'un écran "titre centré" à une vraie carte de
sentier réutilisable. Les deux points qui coincent : (1) Flexbox et ses deux
axes, (2) les props. Bien insister sur le passage "carte en dur → composant".
C'est le premier vrai geste d'ingénierie du cours.
-->

---
layout: default
---

# Là où on s'est arrêté

En séance 1, on a affiché **un écran** : un titre centré, avec `View`, `Text` et `StyleSheet`.

```tsx
<View style={styles.container}>
  <Text style={styles.titre}>TrailMap</Text>
</View>
```

Aujourd'hui, on construit la **brique visuelle** de toute l'application : la **carte d'un sentier** — une photo, un nom, une difficulté, une distance. Puis on la rend **réutilisable**, pour pouvoir en afficher autant qu'on veut.

<div class="mt-4">

Pour y arriver, trois outils : **Flexbox** (placer les choses), **`Image`** (afficher une photo), et les **props** (fabriquer un composant paramétrable).

</div>

---
layout: default
---

# Ce qu'on aura à la fin de la séance

<pre class="oc-panel">
  ┌─────────────────────────────────────────────┐
  │  ┌────────┐   Cascade du Hérisson            │
  │  │  📷    │   Facile · 7 km                  │
  │  └────────┘                                  │
  ├─────────────────────────────────────────────┤
  │  ┌────────┐   Crêtes du Jura                 │
  │  │  📷    │   Difficile · 14 km              │
  │  └────────┘                                  │
  ├─────────────────────────────────────────────┤
  │  ┌────────┐   Lac de Chalain                 │
  │  │  📷    │   Moyen · 9 km                   │
  │  └────────┘                                  │
  └─────────────────────────────────────────────┘
</pre>

Trois cartes empilées, qui défilent. Et surtout : **une seule** description de carte dans le code, utilisée trois fois. C'est là qu'on va.

---
layout: section
---

# 1. Flexbox, pour de vrai

---
layout: default
---

# Les deux axes

Tout le placement en React Native repose sur **Flexbox**. Un conteneur (`View`) range ses enfants le long d'un axe, choisi par `flexDirection`.

| `flexDirection` | Les enfants sont rangés... | Défaut ? |
|---|---|---|
| `'column'` | de **haut en bas** (en colonne) | ✅ oui, en RN |
| `'row'` | de **gauche à droite** (en ligne) | non |

<div class="mt-2 opacity-90">

Piège classique venant du web : sur le web le défaut est `row`. **En React Native, le défaut est `column`.** Une `View` empile ses enfants verticalement, sauf si vous demandez `row`.

</div>

<pre class="oc-panel">
  flexDirection: 'column'        flexDirection: 'row'
  (par défaut)
     ┌───┐                        ┌───┐ ┌───┐ ┌───┐
     │ A │                        │ A │ │ B │ │ C │
     ├───┤                        └───┘ └───┘ └───┘
     │ B │
     ├───┤
     │ C │
     └───┘
</pre>

---
layout: default
---

# Aligner : `justifyContent` et `alignItems`

Une fois l'axe choisi, deux propriétés placent les enfants. La difficulté, c'est de savoir **laquelle agit dans quel sens**.

| Propriété | Agit le long de... | Valeurs utiles |
|---|---|---|
| `justifyContent` | l'**axe principal** (celui de `flexDirection`) | `flex-start`, `center`, `space-between`, `space-around` |
| `alignItems` | l'axe **perpendiculaire** | `flex-start`, `center`, `stretch`, `flex-end` |

<div class="mt-4">

En `flexDirection: 'column'` (le défaut) :

- `justifyContent` déplace les enfants **de haut en bas** (axe principal = vertical)
- `alignItems` les déplace **de gauche à droite** (axe perpendiculaire = horizontal)

C'est exactement ce qu'on a utilisé en séance 1 pour **centrer** le titre : les deux à `center`.

</div>

---
layout: default
---

# Espacer : `padding`, `margin`, `gap`

Trois façons de créer de l'espace. On les confond souvent au début.

| Propriété | Ce qu'elle fait | Image mentale |
|---|---|---|
| `padding` | Espace **à l'intérieur**, entre le bord et le contenu | la marge dans un cadre |
| `margin` | Espace **à l'extérieur**, autour de l'élément | l'écart avec les voisins |
| `gap` | Espace **entre les enfants** d'un conteneur | l'écart entre les cases |

```tsx
const styles = StyleSheet.create({
  liste: {
    padding: 16,      // 16 px de marge intérieure sur les 4 côtés
    gap: 12,          // 12 px entre chaque carte, automatiquement
  },
})
```

<div class="mt-3 opacity-80">

`gap` évite d'ajouter un `marginBottom` à chaque enfant : on le déclare **une fois** sur le parent. C'est plus propre, et on s'en servira pour espacer les cartes.

</div>

---
layout: section
---

# 2. Afficher une image

---
layout: default
---

# Le composant `Image`

Le composant `<Image>` affiche une photo. Il a besoin de deux choses : **une source** et **une taille**.

Deux origines possibles pour la source :

| Origine | Syntaxe | Quand |
|---|---|---|
| **Fichier local** (dans `assets/`) | `source={require('./assets/photo.jpg')}` | Logo, icône livrés avec l'app |
| **URL distante** (le web) | `source={{ uri: 'https://…' }}` | Photos qui viennent d'une API |

```tsx
import { Image } from 'react-native'

<Image
  source={{ uri: 'https://picsum.photos/seed/cascade/400/300' }}
  style={{ width: 80, height: 80, borderRadius: 8 }}
/>
```

<div class="mt-3 opacity-90">

Règle **à ne pas oublier** : une image **distante** ne s'affiche **que si on lui donne une largeur et une hauteur**. Sans `width`/`height`, React Native ne connaît pas sa taille et n'affiche rien.

</div>

<div class="mt-2 opacity-80">

Pour TrailMap, les photos viendront plus tard de l'API : on part donc tout de suite sur des **URL distantes**.

</div>

---
layout: section
---

# 3. Construire la carte

---
layout: default
---

# La structure de la carte

Avant de coder, on décrit ce qu'on veut : une **ligne** (`flexDirection: 'row'`) avec la photo à gauche, et à droite un bloc **colonne** avec le nom au-dessus de la difficulté.

<pre class="oc-panel">
  carte  (View, flexDirection: 'row', alignItems: 'center', gap: 12)
  ┌──────────────────────────────────────────────────┐
  │ ┌────────┐   Cascade du Hérisson   ← nom          │
  │ │ photo  │   Facile · 7 km         ← méta         │
  │ │ 80×80  │                                        │
  │ └────────┘   \_________________/                  │
  │   Image        infos (View, flex: 1)              │
  └──────────────────────────────────────────────────┘
</pre>

Le bloc `infos` porte `flex: 1` : il **prend toute la largeur restante** à droite de la photo. C'est le réflexe Flexbox le plus utile — « occupe la place qui reste ».

---
layout: default
---

# Version 1 : la carte, écrite en dur

On commence simple : **une** carte, directement dans `App.tsx`, sans rien de réutilisable. L'objectif est d'abord de la voir s'afficher.

```tsx
import { Image, StyleSheet, Text, View } from 'react-native'

export default function App() {
  return (
    <View style={styles.ecran}>
      <View style={styles.carte}>
        <Image
          source={{ uri: 'https://picsum.photos/seed/cascade/400/300' }}
          style={styles.photo}
        />
        <View style={styles.infos}>
          <Text style={styles.nom}>Cascade du Hérisson</Text>
          <Text style={styles.meta}>Facile · 7 km</Text>
        </View>
      </View>
    </View>
  )
}
```

Les styles sont sur la slide suivante. Enregistrez : la carte apparaît.

---
layout: default
---

# Version 1 — les styles

La suite du même `App.tsx`. C'est ici que Flexbox fait tout le travail de placement.

```tsx
const styles = StyleSheet.create({
  ecran: { flex: 1, backgroundColor: '#eef3ee', padding: 16, paddingTop: 60 },
  carte: {
    flexDirection: 'row',      // photo à gauche, infos à droite
    alignItems: 'center',      // alignées verticalement au centre
    gap: 12,                   // espace entre la photo et les infos
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 10,
  },
  photo: { width: 80, height: 80, borderRadius: 8 },
  infos: { flex: 1 },          // prend toute la largeur restante
  nom: { fontSize: 18, fontWeight: 'bold', color: '#135635' },
  meta: { fontSize: 14, color: '#4b6455', marginTop: 4 },
})
```

<div class="mt-2 opacity-80">

Une vraie carte, propre. Mais telle quelle, pour en afficher trois, il faudrait **copier-coller** tout ce bloc trois fois. C'est le problème qu'on résout maintenant.

</div>

---
layout: section
---

# 4. Les props : rendre la carte réutilisable

---
layout: default
---

# L'idée des props

Un **composant**, c'est une fonction qui renvoie de l'interface. Les **props**, ce sont ses **arguments** : les informations qu'on lui passe pour qu'il s'adapte.

C'est exactement comme une fonction classique :

```tsx
// une fonction ordinaire reçoit des arguments
function bonjour(nom) {
  return 'Bonjour ' + nom
}

// un composant reçoit des props — même idée, pour de l'interface
function Etiquette({ nom }) {
  return <Text>Bonjour {nom}</Text>
}
```

L'objectif : écrire **une seule fois** la carte, avec des « trous » (`nom`, `difficulté`, `distance`, `photo`), puis la réutiliser en **remplissant les trous** différemment à chaque fois.

<div class="mt-3 opacity-80">

On accède aux valeurs passées entre `{ }` dans le JSX : `{nom}` affiche la valeur reçue.

</div>

---
layout: default
---

# Créer le composant `TrailCard`

On sort la carte dans **son propre fichier**. C'est le premier réflexe de code propre : un composant = un fichier, dans un dossier `components/`.

```bash
# bash / macOS / Linux
mkdir components
touch components/TrailCard.tsx
```

```powershell
# PowerShell / Windows
New-Item -ItemType Directory components
New-Item -ItemType File components/TrailCard.tsx
```

On va y écrire une fonction `TrailCard` qui **reçoit** les infos d'un sentier en props, et **renvoie** la carte qu'on avait — mais avec les valeurs remplacées par les props.

<div class="mt-3 opacity-80">

En TypeScript, on décrit d'abord **la forme des props** : quels champs, de quel type. Le fichier complet est sur la slide suivante.

</div>

---
layout: default
---

# `components/TrailCard.tsx`

```tsx
import { Image, StyleSheet, Text, View } from 'react-native'

type TrailCardProps = {
  nom: string
  difficulte: string
  distanceKm: number
  photo: string
}

export default function TrailCard({ nom, difficulte, distanceKm, photo }: TrailCardProps) {
  return (
    <View style={styles.carte}>
      <Image source={{ uri: photo }} style={styles.photo} />
      <View style={styles.infos}>
        <Text style={styles.nom}>{nom}</Text>
        <Text style={styles.meta}>{difficulte} · {distanceKm} km</Text>
      </View>
    </View>
  )
}
```

Le `type TrailCardProps` liste les quatre informations attendues. Si vous oubliez `photo` en utilisant la carte, TypeScript **vous prévient** avant même de lancer l'app.

---
layout: default
---

# `TrailCard` — ses styles

La fin de `components/TrailCard.tsx` : ce sont les mêmes styles que la version en dur, déplacés avec le composant.

```tsx
const styles = StyleSheet.create({
  carte: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 10,
  },
  photo: { width: 80, height: 80, borderRadius: 8 },
  infos: { flex: 1 },
  nom: { fontSize: 18, fontWeight: 'bold', color: '#135635' },
  meta: { fontSize: 14, color: '#4b6455', marginTop: 4 },
})
```

Le composant est maintenant **autonome** : il porte son affichage **et** son style. On peut l'utiliser partout, sans se soucier de l'intérieur.

---
layout: default
---

# Utiliser `TrailCard` dans `App.tsx`

On importe le composant, et on l'appelle comme une balise. Chaque **prop** se passe comme un attribut.

```tsx
import { StyleSheet, View } from 'react-native'
import TrailCard from './components/TrailCard'

export default function App() {
  return (
    <View style={styles.ecran}>
      <TrailCard nom="Cascade du Hérisson" difficulte="Facile"
        distanceKm={7} photo="https://picsum.photos/seed/cascade/400/300" />
      <TrailCard nom="Crêtes du Jura" difficulte="Difficile"
        distanceKm={14} photo="https://picsum.photos/seed/cretes/400/300" />
    </View>
  )
}
```

<div class="mt-2 opacity-90">

Deux détails de syntaxe : le texte se passe entre guillemets (`nom="..."`), mais un **nombre** se passe entre accolades (`distanceKm={7}`). Les accolades veulent dire « ceci est du JavaScript, pas du texte ».

</div>

---
layout: default
---

# Une carte, réutilisée trois fois

C'est tout l'intérêt : la carte est décrite **une fois** dans `TrailCard.tsx`, et `App.tsx` ne fait plus que la remplir avec des valeurs différentes.

<div class="oc-col1-40">

| Avant (version 1) | Maintenant |
|---|---|
| Tout le bloc carte copié pour chaque sentier | `<TrailCard … />` sur une ligne |
| Changer le style = corriger partout | Changer le style = **un seul endroit** |
| `App.tsx` illisible, très long | `App.tsx` se lit comme une liste |

</div>

<div class="mt-4">

Si demain on veut arrondir les coins de **toutes** les cartes, on modifie `borderRadius` **une fois**, dans `TrailCard.tsx`. Toutes les cartes changent. C'est ça, un composant.

</div>

<div class="mt-3 opacity-80">

En séance 4, on ne les écrira même plus à la main : une liste de données produira les cartes automatiquement.

</div>

---
layout: section
---

# 5. Faire défiler : `ScrollView`

---
layout: default
---

# Pourquoi `ScrollView`

Une `View` **ne défile pas**. Si vos cartes dépassent la hauteur de l'écran, le bas est simplement **coupé** — impossible d'y accéder.

`ScrollView` est une `View` qui **défile**. On remplace juste la `View` du haut par un `ScrollView`.

| | `View` | `ScrollView` |
|---|---|---|
| Contenu qui dépasse | **coupé** | **accessible en défilant** |
| Où mettre le style de mise en page | `style` | `contentContainerStyle` |

<div class="mt-3 opacity-90">

Le piège : sur un `ScrollView`, la mise en page du contenu (padding, gap) se met dans **`contentContainerStyle`**, pas dans `style`. C'est la source d'erreur numéro un avec ce composant.

</div>

---
layout: default
---

# `App.tsx` avec `ScrollView`

On enveloppe les cartes dans un `ScrollView`, et on ajoute une troisième carte pour avoir de quoi défiler.

```tsx
import { ScrollView, StyleSheet } from 'react-native'
import TrailCard from './components/TrailCard'

export default function App() {
  return (
    <ScrollView contentContainerStyle={styles.liste}>
      <TrailCard nom="Cascade du Hérisson" difficulte="Facile"
        distanceKm={7} photo="https://picsum.photos/seed/cascade/400/300" />
      <TrailCard nom="Crêtes du Jura" difficulte="Difficile"
        distanceKm={14} photo="https://picsum.photos/seed/cretes/400/300" />
      <TrailCard nom="Lac de Chalain" difficulte="Moyen"
        distanceKm={9} photo="https://picsum.photos/seed/lac/400/300" />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  liste: { backgroundColor: '#eef3ee', padding: 16, paddingTop: 60, gap: 12 },
})
```

Le `gap: 12` de la liste espace les cartes entre elles. Vos trois cartes s'affichent et **défilent**.

---
layout: section
---

# 6. Atelier

---
layout: default
---

# À faire maintenant

On reprend le projet `trailmap` de la séance 1. Objectif : **une liste de cartes de sentiers qui défile.**

1. Dans `App.tsx`, recréer **une** carte en dur (photo + nom + difficulté + distance)
2. La styliser en ligne : photo à gauche, infos à droite (`flexDirection: 'row'`, `gap`)
3. Créer le dossier `components/` et le fichier `TrailCard.tsx`
4. Y déplacer la carte, avec un `type TrailCardProps` et les quatre props
5. Dans `App.tsx`, afficher **trois** `TrailCard` avec des sentiers différents
6. Envelopper le tout dans un `ScrollView` pour que ça défile
7. **Bonus** : ajouter une prop `duree` (ex. `"2 h 30"`) et l'afficher sur la carte

<div class="mt-4">

Je passe dans les rangs. Le point qui bloque le plus souvent : l'image distante qui **ne s'affiche pas** faute de `width`/`height`. Pensez-y en premier.

</div>

---
layout: default
---

# Les erreurs qu'on va rencontrer

<div class="oc-col1-40">

| Symptôme | Ce qu'il veut dire | La solution |
|---|---|---|
| L'image ne s'affiche pas | Pas de `width`/`height` sur une image distante | Donner une taille dans le `style` |
| Les cartes sont empilées, jamais côte à côte | `flexDirection` par défaut = `column` | Mettre `flexDirection: 'row'` |
| Le bas de la liste est coupé | Une `View` ne défile pas | Remplacer par `ScrollView` |
| `padding` ignoré sur le `ScrollView` | Mis dans `style` au lieu du contenu | Utiliser `contentContainerStyle` |
| `Property 'photo' is missing` | Une prop obligatoire n'est pas passée | Ajouter la prop, ou lire le message TS |

</div>

---
layout: default
---

# Ce qu'on a mis en place

```tsx
// components/TrailCard.tsx — le composant réutilisable
type TrailCardProps = {
  nom: string; difficulte: string; distanceKm: number; photo: string
}

export default function TrailCard({ nom, difficulte, distanceKm, photo }: TrailCardProps) {
  return (
    <View style={styles.carte}>
      <Image source={{ uri: photo }} style={styles.photo} />
      <View style={styles.infos}>
        <Text style={styles.nom}>{nom}</Text>
        <Text style={styles.meta}>{difficulte} · {distanceKm} km</Text>
      </View>
    </View>
  )
}
```

```tsx
// App.tsx — on remplit la carte autant de fois qu'on veut
<ScrollView contentContainerStyle={styles.liste}>
  <TrailCard nom="Cascade du Hérisson" difficulte="Facile" distanceKm={7} photo={...} />
</ScrollView>
```

---
layout: default
---

# Séance prochaine

**Séance 3 — État & interactions.**

Nos cartes sont pour l'instant **figées** : elles affichent, mais ne réagissent à rien. On va les rendre **vivantes**.

Au programme : le `useState` (mémoriser une information qui change), les composants tactiles (`Pressable`) pour réagir au toucher, et le `TextInput` pour saisir du texte. Concrètement : un **bouton favori ❤️** sur chaque carte, et une **barre de recherche**.

<div class="mt-8">

**Pour la prochaine fois** — assurez-vous d'avoir :

</div>

```bash
# une liste de 3 TrailCard qui s'affiche et défile
npx expo start
```
