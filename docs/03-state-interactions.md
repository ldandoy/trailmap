---
theme: default
title: Séance 3 — État & interactions
info: |
  ## Séance 3 — Développement mobile (ECE)
  useState, Pressable et TextInput : rendre les cartes vivantes — un bouton
  favori, et une barre de recherche qui filtre la liste.
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

<div class="text-xl opacity-90 mt-4">Séance 3 — État & interactions</div>

<div class="mt-10 text-base opacity-80">
ECE · 24 h · 12 séances
</div>

<!--
LA séance clé du cours. Le concept d'état est ce qui sépare une "page" d'une
"application". Ne pas aller trop vite sur le "pourquoi une variable normale ne
marche pas" : c'est LE déclic. Le compteur d'abord (minimal), le favori ensuite
(utile), la recherche pour finir (satisfaisant). Le .map() est volontairement
introduit ici en version naïve ; FlatList le remplacera en séance 4.
-->

---
layout: default
---

# Là où on s'est arrêté

En séance 2, on a une belle liste de cartes de sentiers. Mais elles sont **figées** : on peut les regarder, on ne peut rien en faire.

Toucher le cœur ? Rien. Taper une recherche ? Impossible, il n'y a pas de champ.

Aujourd'hui, on rend l'application **vivante**. Le concept qui rend ça possible s'appelle **l'état** (*state* en anglais), et c'est la notion la plus importante de tout le cours.

<div class="mt-4">

Trois outils : **`useState`** (mémoriser ce qui change), **`Pressable`** (réagir au toucher), **`TextInput`** (saisir du texte).

</div>

---
layout: default
---

# Ce qu'on aura à la fin de la séance

<pre class="oc-panel">
  ┌─────────────────────────────────────────────┐
  │  🔍  cascade|                                 │  ← on tape ici, la liste filtre
  ├─────────────────────────────────────────────┤
  │  ┌────────┐   Cascade du Hérisson       ❤️   │  ← on touche : 🤍 → ❤️
  │  │  📷    │   Facile · 7 km                  │
  │  └────────┘                                  │
  └─────────────────────────────────────────────┘
</pre>

Deux interactions, mais elles contiennent **tout** le principe des applications : quand une donnée change, **l'écran se met à jour tout seul**. Vous ne redessinez jamais l'écran à la main — vous changez la donnée, React s'occupe du reste.

---
layout: section
---

# 1. L'état

---
layout: default
---

# Le problème : une variable ordinaire ne suffit pas

Imaginons un compteur : à chaque toucher, on veut afficher un nombre de plus. Le réflexe naturel — une variable — **ne marche pas** :

```tsx
let compteur = 0

<Pressable onPress={() => { compteur = compteur + 1; console.log(compteur) }}>
  <Text>Vu {compteur} fois</Text>
</Pressable>
```

Si vous lancez ça : la console affiche bien `1`, `2`, `3`… mais **l'écran reste bloqué sur `0`**.

<div class="mt-4">

Pourquoi ? Parce que React **ne redessine l'écran que lorsqu'on le lui demande**. Changer une variable en douce ne le prévient pas. Il faut une variable **spéciale**, qui redessine l'écran à chaque changement. C'est exactement ce que fait `useState`.

</div>

---
layout: default
---

# `useState` : la solution

`useState` crée une variable **suivie par React**. À chaque fois qu'on la change, React **redessine** la partie d'écran concernée.

```tsx
import { useState } from 'react'

const [compteur, setCompteur] = useState(0)
//     ▲          ▲                    ▲
//     │          │                    └── valeur de départ
//     │          └── LA fonction pour changer la valeur
//     └── la valeur actuelle, à lire dans le JSX
```

`useState` renvoie toujours **deux choses**, dans cet ordre :

| | Nom (au choix) | Rôle |
|---|---|---|
| `[0]` | `compteur` | La valeur **à lire** — on l'affiche dans le JSX |
| `[1]` | `setCompteur` | La fonction **à appeler** pour la changer |

<div class="mt-3 opacity-80">

Convention universelle : la fonction s'appelle `set` + le nom de la valeur. `favori` → `setFavori`, `recherche` → `setRecherche`.

</div>

---
layout: default
---

# La règle d'or : toujours passer par le `set`

On ne modifie **jamais** une variable d'état directement. On appelle **toujours** sa fonction `set`. C'est elle, et elle seule, qui déclenche le redessin.

```tsx
// ❌ NON : React n'est pas prévenu, l'écran ne bouge pas
compteur = compteur + 1
favori = true

// ✅ OUI : React est prévenu, il redessine
setCompteur(compteur + 1)
setFavori(true)
```

<div class="mt-4">

Retenez la boucle, elle est toujours la même :

</div>

<pre class="oc-panel">
   on appelle setXxx(...)  →  React met la valeur à jour  →  React redessine l'écran
        (un toucher)              (en coulisses)              (avec la nouvelle valeur)
</pre>

---
layout: section
---

# 2. Réagir au toucher

---
layout: default
---

# `Pressable` : le composant tactile

En web, on met un `onClick` sur un bouton. En mobile, on **enveloppe** ce qu'on veut rendre tactile dans un `<Pressable>`, et on lui donne un `onPress`.

```tsx
import { Pressable, Text } from 'react-native'

<Pressable onPress={() => console.log('touché !')}>
  <Text>Touchez-moi</Text>
</Pressable>
```

| | Web | React Native |
|---|---|---|
| Composant | `<button>` | `<Pressable>` |
| L'événement | `onClick` | `onPress` |
| Ce qu'on rend tactile | le bouton | **n'importe quoi** : texte, image, carte entière |

<div class="mt-3 opacity-90">

`onPress` attend une **fonction** — le code à exécuter **au moment du toucher**. D'où le `() => …` : « quand on touche, fais ceci ». Sans la flèche, le code s'exécuterait immédiatement au chargement, pas au toucher.

</div>

---
layout: default
---

# `useState` + `Pressable` : le compteur qui marche

On combine les deux. Cette fois, l'écran **se met à jour** à chaque toucher.

```tsx
import { useState } from 'react'
import { Pressable, Text, View } from 'react-native'

export default function App() {
  const [compteur, setCompteur] = useState(0)

  return (
    <View style={{ padding: 60 }}>
      <Pressable onPress={() => setCompteur(compteur + 1)}>
        <Text style={{ fontSize: 24 }}>Vu {compteur} fois</Text>
      </Pressable>
    </View>
  )
}
```

La seule différence avec la version cassée : `let compteur = 0` est devenu `useState(0)`, et l'affectation est devenue `setCompteur(...)`. **C'est tout ce qui sépare une page figée d'une app.**

---
layout: section
---

# 3. Le bouton favori

---
layout: default
---

# Un booléen + un affichage conditionnel

Le favori n'est pas un nombre, c'est un **oui/non** : un booléen. On le stocke avec `useState(false)`, et on **change d'icône** selon sa valeur.

Pour choisir quoi afficher selon une condition, on utilise le **ternaire** `condition ? siVrai : siFaux` :

```tsx
const [favori, setFavori] = useState(false)

<Text>{favori ? '❤️' : '🤍'}</Text>
//      └──────────┬──────────┘
//     si favori est vrai → ❤️, sinon → 🤍
```

Et pour **basculer** la valeur au toucher, on la passe à son contraire avec `!` :

```tsx
<Pressable onPress={() => setFavori(!favori)}>
```

<div class="mt-2 opacity-80">

`!favori` veut dire « l'inverse de favori » : `false` devient `true`, et inversement. Un toucher allume, un autre éteint.

</div>

---
layout: default
---

# `TrailCard` avec un favori

On reprend le `TrailCard` de la séance 2, et on lui ajoute son propre état `favori` et un cœur tactile.

```tsx
import { useState } from 'react'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'

export default function TrailCard({ nom, difficulte, distanceKm, photo }: TrailCardProps) {
  const [favori, setFavori] = useState(false)

  return (
    <View style={styles.carte}>
      <Image source={{ uri: photo }} style={styles.photo} />
      <View style={styles.infos}>
        <Text style={styles.nom}>{nom}</Text>
        <Text style={styles.meta}>{difficulte} · {distanceKm} km</Text>
      </View>
      <Pressable onPress={() => setFavori(!favori)} style={styles.coeur}>
        <Text style={styles.coeurTexte}>{favori ? '❤️' : '🤍'}</Text>
      </Pressable>
    </View>
  )
}
```

Chaque carte a **son propre** `favori` : toucher le cœur d'un sentier n'affecte pas les autres.

---
layout: default
---

# `TrailCard` — les styles ajoutés

On complète le `StyleSheet` du composant avec le cœur. Le reste (carte, photo, infos, nom, méta) est inchangé depuis la séance 2.

```tsx
const styles = StyleSheet.create({
  // … carte, photo, infos, nom, meta (identiques à la séance 2) …
  coeur: {
    padding: 6,             // une zone tactile confortable autour du cœur
  },
  coeurTexte: {
    fontSize: 22,
  },
})
```

<div class="mt-4 opacity-90">

Le `padding: 6` n'est pas décoratif : il **agrandit la zone touchable**. Un cœur de 22 px tout nu est difficile à viser au pouce ; avec le padding, on vise une zone bien plus large. Régle d'ergonomie mobile : les cibles tactiles doivent être **généreuses**.

</div>

---
layout: section
---

# 4. Saisir du texte

---
layout: default
---

# `TextInput` : un champ contrôlé

`TextInput` est le champ de saisie. La façon propre de l'utiliser : le **relier à un état**. On parle de champ **contrôlé** — l'état est la « source de vérité », le champ n'en est que le reflet.

```tsx
import { useState } from 'react'
import { TextInput } from 'react-native'

const [recherche, setRecherche] = useState('')

<TextInput
  placeholder="Rechercher un sentier…"
  value={recherche}                 // ce qu'affiche le champ = l'état
  onChangeText={setRecherche}       // à chaque frappe, on met l'état à jour
/>
```

Deux props indissociables :

| Prop | Rôle |
|---|---|
| `value` | Ce que le champ **affiche** — toujours la valeur de l'état |
| `onChangeText` | Appelée **à chaque frappe**, avec le nouveau texte |

<div class="mt-2 opacity-80">

La boucle : je tape → `onChangeText` appelle `setRecherche` → l'état change → React redessine → `value` affiche le nouveau texte. Le même cycle que le compteur.

</div>

---
layout: section
---

# 5. Filtrer la liste

---
layout: default
---

# D'abord : les sentiers dans un tableau

Jusqu'ici, on écrivait chaque `<TrailCard>` à la main. Pour pouvoir **filtrer**, on met les données dans un **tableau**, et on génère les cartes à partir de lui avec `.map()`.

```tsx
const SENTIERS = [
  { id: 1, nom: 'Cascade du Hérisson', difficulte: 'Facile',    distanceKm: 7,  photo: 'https://picsum.photos/seed/cascade/400/300' },
  { id: 2, nom: 'Crêtes du Jura',      difficulte: 'Difficile', distanceKm: 14, photo: 'https://picsum.photos/seed/cretes/400/300' },
  { id: 3, nom: 'Lac de Chalain',      difficulte: 'Moyen',     distanceKm: 9,  photo: 'https://picsum.photos/seed/lac/400/300' },
]
```

`.map()` transforme **chaque objet du tableau** en une carte :

```tsx
{SENTIERS.map((s) => (
  <TrailCard key={s.id} nom={s.nom} difficulte={s.difficulte}
    distanceKm={s.distanceKm} photo={s.photo} />
))}
```

<div class="mt-2 opacity-80">

Le `key={s.id}` : React a besoin d'un identifiant **unique** par élément pour suivre la liste. On approfondit ça — et une façon plus performante de faire — en séance 4.

</div>

---
layout: default
---

# `App.tsx` : la recherche qui filtre

On combine tout : un état `recherche`, un `TextInput` contrôlé, et un `.filter()` qui ne garde que les sentiers dont le nom contient le texte tapé.

```tsx
export default function App() {
  const [recherche, setRecherche] = useState('')

  const resultats = SENTIERS.filter((s) =>
    s.nom.toLowerCase().includes(recherche.toLowerCase()),
  )

  return (
    <View style={styles.ecran}>
      <TextInput style={styles.recherche} placeholder="Rechercher un sentier…"
        value={recherche} onChangeText={setRecherche} />

      <ScrollView contentContainerStyle={styles.liste}>
        {resultats.map((s) => (
          <TrailCard key={s.id} nom={s.nom} difficulte={s.difficulte}
            distanceKm={s.distanceKm} photo={s.photo} />
        ))}
      </ScrollView>
    </View>
  )
}
```

On filtre `SENTIERS`, on affiche `resultats`. À chaque frappe, `recherche` change, React redessine, la liste se réduit **en direct**.

---
layout: default
---

# Le petit plus : « aucun résultat »

Quand la recherche ne correspond à rien, une liste vide est déroutante. On affiche un message — avec l'autre façon d'afficher sous condition, le `&&` :

```tsx
{resultats.length === 0 && (
  <Text style={styles.vide}>Aucun sentier trouvé pour « {recherche} »</Text>
)}
```

<div class="mt-2">

`condition && (…)` se lit : « **si** la condition est vraie, affiche ce qui suit ; sinon, n'affiche rien ». Idéal quand il n'y a **rien** à montrer dans le cas contraire (contrairement au ternaire, qui choisit entre **deux** affichages).

</div>

| Besoin | Outil |
|---|---|
| Choisir entre **deux** affichages (❤️ ou 🤍) | ternaire `? :` |
| Afficher **ou rien** (un message d'erreur) | `&&` |

---
layout: section
---

# 6. Atelier

---
layout: default
---

# À faire maintenant

On part du projet `trailmap` de la séance 2. Objectif : **une liste qui filtre, avec des favoris.**

1. Ajouter un état `favori` dans `TrailCard`, et un cœur tactile (`Pressable` + `useState`)
2. Basculer l'icône `🤍` / `❤️` au toucher, avec un ternaire
3. Passer les sentiers dans un tableau `SENTIERS`, les afficher avec `.map()`
4. Ajouter un `TextInput` contrôlé (`value` + `onChangeText`) en haut de l'écran
5. Filtrer la liste avec `.filter()` selon le texte tapé
6. Afficher « Aucun sentier trouvé » quand `resultats` est vide
7. **Bonus** : un compteur « X favoris » — indice : il faudra faire **remonter** l'état des favoris vers `App` (on verra cette technique proprement en séance 8)

<div class="mt-3 opacity-80">

Le bonus est volontairement dur : il pointe vers la limite de l'état local, qu'on lèvera plus tard. Ne bloquez pas dessus.

</div>

---
layout: default
---

# Les erreurs qu'on va rencontrer

<div class="oc-col1-40">

| Symptôme | Ce qu'il veut dire | La solution |
|---|---|---|
| L'écran ne se met pas à jour | Valeur changée sans le `set` | Appeler `setXxx(...)`, jamais `xxx = ...` |
| `Invalid hook call` | `useState` appelé hors d'un composant | Le mettre **dans** la fonction du composant |
| Le champ n'accepte pas la frappe | `value` sans `onChangeText` | Toujours les **deux** ensemble |
| Le clic se déclenche au chargement | `onPress={maFonction()}` avec `()` | `onPress={() => maFonction()}` |
| `Each child … unique key` | `.map()` sans `key` | Ajouter `key={s.id}` |

</div>

---
layout: default
---

# Ce qu'on a mis en place

```tsx
// L'état : une valeur suivie par React + sa fonction de mise à jour
const [favori, setFavori] = useState(false)

// Réagir au toucher, et basculer l'état
<Pressable onPress={() => setFavori(!favori)}>
  <Text>{favori ? '❤️' : '🤍'}</Text>
</Pressable>

// Un champ contrôlé : l'état est la source de vérité
<TextInput value={recherche} onChangeText={setRecherche} />

// Filtrer une liste selon l'état, et l'afficher
const resultats = SENTIERS.filter((s) =>
  s.nom.toLowerCase().includes(recherche.toLowerCase()))
{resultats.map((s) => <TrailCard key={s.id} {...s} />)}
```

---
layout: default
---

# Séance prochaine

**Séance 4 — Les listes de données.**

Notre `.map()` dans un `ScrollView` fonctionne… tant qu'il y a trois sentiers. Avec **trois cents**, l'app rame : `ScrollView` fabrique **tout** d'un coup, même ce qu'on ne voit pas.

La solution, c'est **`FlatList`** : le composant fait pour les longues listes. Il n'affiche que ce qui est à l'écran, gère les `key` proprement, et offre le « tirer pour rafraîchir ». On reprendra notre liste de sentiers pour la passer à l'échelle.

<div class="mt-8">

**Pour la prochaine fois** — assurez-vous d'avoir :

</div>

```bash
# des favoris qui basculent + une recherche qui filtre la liste
npx expo start
```
