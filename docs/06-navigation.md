---
theme: default
title: Séance 6 — La navigation
info: |
  ## Séance 6 — Développement mobile (ECE)
  Expo Router : le routage par fichiers, un écran de détail avec paramètre,
  et les onglets du bas.
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

<div class="text-xl opacity-90 mt-4">Séance 6 — La navigation</div>

<div class="mt-10 text-base opacity-80">
ECE · 24 h · 12 séances
</div>

<!--
Grosse séance en fichiers, pas en concepts. Le cœur : "un fichier = un écran".
On migre le projet blank vers Expo Router (install + entry + dossier app/), on
fait une pile liste → détail avec un paramètre, PUIS on ajoute les onglets.
Le piège récurrent de la séance : les chemins d'import relatifs qui changent
quand on déplace un fichier dans (tabs)/. Bien prévenir.
-->

---
layout: default
---

# Là où on s'est arrêté

Notre liste charge de vrais sentiers depuis l'API. Mais elle est **plate** : toucher une carte ne fait rien. Impossible d'ouvrir un sentier pour voir ses détails.

Il manque **la navigation** : passer d'un écran à un autre, et revenir. C'est ce qui transforme une liste en **application**.

<div class="mt-4">

On va utiliser **Expo Router**, le système de navigation d'Expo. Son idée est simple et puissante : **la structure de vos fichiers EST la structure de votre app**. Un fichier = un écran, un dossier = une section.

</div>

---
layout: default
---

# Ce qu'on aura à la fin de la séance

<pre class="oc-panel">
   Onglet "Sentiers"            touche une carte           Écran détail
   ┌──────────────────┐         ─────────────►             ┌──────────────────┐
   │ 🥾 Cascade    ❤️ │                                     │  ← Cascade du…   │
   │ 🥾 Crêtes        │                                     │  ┌────────────┐  │
   │ 🥾 Lac           │         ◄─────────────              │  │   photo    │  │
   ├──────────────────┤         bouton retour               │  └────────────┘  │
   │ Sentiers Favoris Carte │                               │  Facile · 7 km   │
   └──────────────────┘                                     └──────────────────┘
</pre>

Deux nouveautés : un **écran de détail** qu'on ouvre en touchant une carte (avec un bouton retour), et les **onglets** en bas — Sentiers · Favoris · Carte — qui structurent toute l'app.

---
layout: section
---

# 1. Le routage par fichiers

---
layout: default
---

# Un fichier = un écran

Avec Expo Router, on ne déclare pas les écrans dans du code : on **crée des fichiers** dans un dossier `app/`. Le nom du fichier devient l'URL de l'écran.

| Fichier | Écran / URL |
|---|---|
| `app/index.tsx` | l'écran d'accueil (`/`) |
| `app/favoris.tsx` | `/favoris` |
| `app/sentiers/[id].tsx` | `/sentiers/1`, `/sentiers/2`… (**paramètre**) |
| `app/_layout.tsx` | pas un écran : **l'ossature** commune (pile, onglets) |

<div class="mt-4">

Deux fichiers ont un rôle spécial :

- **`index.tsx`** est l'écran par défaut d'un dossier (comme `index.html` sur le web).
- **`[id].tsx`** (avec des crochets) est un écran **dynamique** : le `id` change selon le sentier ouvert.
- **`_layout.tsx`** décrit ce qui **entoure** les écrans d'un dossier : une pile avec un bouton retour, ou une barre d'onglets.

</div>

---
layout: section
---

# 2. Installer Expo Router

---
layout: default
---

# Les dépendances et le point d'entrée

Notre projet est en template « blank » : il faut **ajouter** Expo Router. On installe le paquet et ses compagnons avec `expo install` (qui choisit les versions compatibles avec votre SDK) :

```bash
npx expo install expo-router react-native-safe-area-context \
  react-native-screens expo-linking expo-constants expo-status-bar
```

Ensuite, on dit à l'app de **démarrer par Expo Router**. Dans `package.json`, on change la ligne `main` :

```json
{
  "main": "expo-router/entry"
}
```

<div class="mt-3 opacity-90">

`expo-router/entry` remplace l'ancien point de départ (`App.tsx`). Désormais, c'est le dossier `app/` — et son `_layout.tsx` — qui pilote l'application.

</div>

---
layout: default
---

# Le scheme, et l'adieu à `App.tsx`

Dans `app.json`, on ajoute un **scheme** (le préfixe des liens de l'app, requis par le routeur) :

```json
{
  "expo": {
    "scheme": "trailmap"
  }
}
```

Puis on **supprime `App.tsx`** : il n'a plus de rôle, tout passe maintenant par `app/`.

```bash
rm App.tsx                          # bash
Remove-Item App.tsx                 # PowerShell
```

<div class="mt-4">

À partir de maintenant, la règle est : **on ne crée plus d'écran ailleurs que dans `app/`.** Le reste (`components/`, `api.ts`) ne bouge pas.

</div>

---
layout: default
---

# L'ossature : `app/_layout.tsx`

On crée le dossier `app/` et son layout racine. Pour commencer, une simple **pile** (`Stack`) : c'est elle qui gère le bouton retour et l'en-tête en haut.

```bash
mkdir app
touch app/_layout.tsx               # bash
New-Item -ItemType File app/_layout.tsx   # PowerShell
```

```tsx
// app/_layout.tsx
import { Stack } from 'expo-router'

export default function RootLayout() {
  return <Stack />
}
```

<div class="mt-3 opacity-90">

Une `Stack` empile les écrans comme des feuilles : ouvrir un détail **pose** une feuille par-dessus, le bouton retour la **retire**. C'est le modèle de navigation le plus courant en mobile.

</div>

---
layout: section
---

# 3. Le premier écran : la liste

---
layout: default
---

# `app/index.tsx` : on déplace la liste

L'écran d'accueil, c'est notre liste de sentiers. On prend **tout le code de `App.tsx`** de la séance 5 (états, `charger`, `FlatList`) et on le met dans `app/index.tsx`.

```tsx
// app/index.tsx — c'est l'ancien App.tsx, déplacé
import { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, View } from 'react-native'
import TrailCard from '../components/TrailCard'
import { API_URL, Sentier } from '../api'

export default function EcranSentiers() {
  const [sentiers, setSentiers] = useState<Sentier[]>([])
  // … chargement, erreur, charger(), useEffect, la FlatList (identiques à la séance 5) …
}
```

<div class="mt-3 opacity-90">

Attention aux **imports** : depuis `app/index.tsx`, on remonte d'un cran pour atteindre `components/` et `api.ts` → `'../components/TrailCard'`, `'../api'`. C'est la source d'erreur numéro un de la séance.

</div>

---
layout: default
---

# Rendre chaque carte cliquable : `Link`

Pour ouvrir un sentier, on **enveloppe** chaque carte dans un `<Link>` qui pointe vers son URL de détail. Le `asChild` dit au `Link` : « n'ajoute pas de bouton, rends **mon enfant** cliquable ».

```tsx
import { Link } from 'expo-router'
import { Pressable } from 'react-native'

renderItem={({ item }) => (
  <Link href={`/sentiers/${item.id}`} asChild>
    <Pressable>
      <TrailCard nom={item.nom} difficulte={item.difficulte}
        distanceKm={item.distanceKm} photo={item.photo} />
    </Pressable>
  </Link>
)}
```

<div class="mt-3 opacity-90">

`href={`/sentiers/${item.id}`}` construit l'URL de chaque carte : `/sentiers/1`, `/sentiers/2`… Le cœur ❤️ de la séance 3, lui, reste indépendant : toucher le cœur ne déclenche pas la navigation.

</div>

---
layout: section
---

# 4. L'écran de détail

---
layout: default
---

# `app/sentiers/[id].tsx` : lire le paramètre

On crée l'écran dynamique. Les **crochets** dans le nom du fichier signifient : « ce segment de l'URL est une variable ». On la récupère avec `useLocalSearchParams`.

```bash
mkdir -p app/sentiers
touch app/sentiers/[id].tsx
```

```tsx
// app/sentiers/[id].tsx
import { useLocalSearchParams } from 'expo-router'
import { Text } from 'react-native'

export default function DetailSentier() {
  const { id } = useLocalSearchParams()   // le "1" de /sentiers/1
  return <Text>Sentier n° {id}</Text>
}
```

<div class="mt-3 opacity-90">

Le nom entre crochets (`[id]`) **et** la clé lue (`{ id }`) doivent être **identiques**. Si le fichier est `[id].tsx`, on lit `id` ; si c'est `[sentierId].tsx`, on lit `sentierId`.

</div>

---
layout: default
---

# Charger le détail depuis l'API

On a l'`id` : on va chercher **ce** sentier précis, avec l'URL `/sentiers/:id` qu'offre json-server. Même schéma qu'en séance 5, mais pour **un seul** objet.

```tsx
export default function DetailSentier() {
  const { id } = useLocalSearchParams()
  const [sentier, setSentier] = useState<Sentier | null>(null)

  useEffect(() => {
    fetch(`${API_URL}/sentiers/${id}`)
      .then((r) => r.json())
      .then(setSentier)
  }, [id])

  if (!sentier) return <ActivityIndicator size="large" style={{ flex: 1 }} />
  // … affichage sur la slide suivante …
}
```

<div class="mt-3 opacity-90">

Le tableau de dépendances vaut **`[id]`** cette fois, pas `[]` : si l'`id` change, l'effet se relance et recharge le bon sentier. C'est exactement l'usage prévu du tableau de dépendances.

</div>

---
layout: default
---

# L'affichage du détail

On montre une grande photo, le nom, et les infos. Le `<Stack.Screen>` sert à régler l'**en-tête** de cet écran — ici, y afficher le nom du sentier.

```tsx
import { Stack } from 'expo-router'

return (
  <View style={styles.page}>
    <Stack.Screen options={{ title: sentier.nom }} />
    <Image source={{ uri: sentier.photo }} style={styles.photo} />
    <Text style={styles.titre}>{sentier.nom}</Text>
    <Text style={styles.meta}>{sentier.difficulte} · {sentier.distanceKm} km</Text>
  </View>
)
```

<div class="mt-3 opacity-90">

Le bouton **retour** apparaît **tout seul** dans l'en-tête : la `Stack` le gère pour nous. On a posé une feuille par-dessus la liste ; la flèche la retire. On n'écrit aucune ligne pour ça.

</div>

<div class="mt-2 opacity-80">

Pour enrichir cet écran, ajoutez un champ `description` à vos sentiers dans `db.json` (et au `type Sentier`), puis affichez-le ici.

</div>

---
layout: section
---

# 5. Les onglets

---
layout: default
---

# Regrouper les écrans dans des onglets

On veut une barre en bas : **Sentiers · Favoris · Carte**. En Expo Router, un jeu d'onglets est un **dossier** `(tabs)` avec son propre `_layout.tsx`. Les parenthèses signifient : « ce dossier **groupe** des écrans, mais n'apparaît pas dans l'URL ».

<pre class="oc-panel">
  app/
  ├── _layout.tsx            ← pile racine (Stack)
  ├── (tabs)/
  │   ├── _layout.tsx        ← LA barre d'onglets
  │   ├── index.tsx          ← onglet "Sentiers" (notre liste)
  │   ├── favoris.tsx        ← onglet "Favoris" (à venir, séance 8)
  │   └── carte.tsx          ← onglet "Carte"   (à venir, séance 10)
  └── sentiers/
      └── [id].tsx           ← le détail, PAR-DESSUS les onglets
</pre>

On **déplace** `app/index.tsx` dans `app/(tabs)/index.tsx`, et on crée les deux autres onglets (de simples écrans « à venir » pour l'instant).

---
layout: default
---

# `app/(tabs)/_layout.tsx` : la barre d'onglets

Le layout des onglets liste les écrans, chacun avec son **titre** et son **icône** (les icônes `Ionicons` sont fournies avec Expo, rien à installer).

```tsx
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#135635' }}>
      <Tabs.Screen name="index" options={{ title: 'Sentiers',
        tabBarIcon: ({ color, size }) => <Ionicons name="trail-sign" color={color} size={size} /> }} />
      <Tabs.Screen name="favoris" options={{ title: 'Favoris',
        tabBarIcon: ({ color, size }) => <Ionicons name="heart" color={color} size={size} /> }} />
      <Tabs.Screen name="carte" options={{ title: 'Carte',
        tabBarIcon: ({ color, size }) => <Ionicons name="map" color={color} size={size} /> }} />
    </Tabs>
  )
}
```

Le `name` de chaque `Tabs.Screen` correspond au **nom du fichier** (`index` → `index.tsx`).

---
layout: default
---

# La pile racine par-dessus les onglets

Enfin, on met à jour le layout racine pour qu'il connaisse **deux** choses : le groupe d'onglets, et l'écran de détail qui vient **se poser au-dessus**.

```tsx
// app/_layout.tsx
import { Stack } from 'expo-router'

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="sentiers/[id]" options={{ title: 'Sentier' }} />
    </Stack>
  )
}
```

<div class="mt-3 opacity-90">

`headerShown: false` sur `(tabs)` : les onglets gèrent déjà leur propre en-tête, on masque celui de la pile. L'écran `sentiers/[id]`, lui, s'ouvre **plein écran**, par-dessus la barre d'onglets, avec son bouton retour. C'est le comportement mobile attendu.

</div>

---
layout: default
---

# Les imports après le déplacement

En déplaçant `index.tsx` dans `(tabs)/`, il est descendu d'un niveau. **Tous ses imports relatifs doivent gagner un `../`**.

<div class="oc-col1-40">

| Depuis | Import de `TrailCard` | Import de `api` |
|---|---|---|
| `app/index.tsx` (avant) | `'../components/TrailCard'` | `'../api'` |
| `app/(tabs)/index.tsx` (après) | `'../../components/TrailCard'` | `'../../api'` |

</div>

<div class="mt-4 opacity-90">

C'est **l'erreur classique** du jour : « Unable to resolve module ». Elle veut presque toujours dire qu'un chemin relatif a un `../` de trop ou de trop peu après un déplacement de fichier. TypeScript et l'écran rouge vous montrent le fichier fautif.

</div>

---
layout: section
---

# 6. Atelier

---
layout: default
---

# À faire maintenant

Objectif : **ouvrir un sentier depuis la liste, et naviguer entre trois onglets.**

1. Installer Expo Router (`expo install …`), passer `main` à `expo-router/entry`, ajouter le `scheme`
2. Supprimer `App.tsx`, créer `app/_layout.tsx` (une `Stack`)
3. Déplacer la liste dans `app/index.tsx` (attention aux imports `../`)
4. Envelopper chaque carte dans un `<Link href={`/sentiers/${item.id}`} asChild>`
5. Créer `app/sentiers/[id].tsx` : lire `id`, charger `/sentiers/:id`, afficher le détail
6. Créer `app/(tabs)/` : y déplacer `index.tsx`, ajouter `favoris.tsx` et `carte.tsx`
7. Écrire `(tabs)/_layout.tsx` (les 3 onglets) et mettre à jour `_layout.tsx` racine
8. **Corriger les imports** devenus `../../` après le déplacement dans `(tabs)/`

<div class="mt-3 opacity-80">

Faites-le **dans cet ordre**. Testez après l'étape 5 (la navigation marche déjà, sans onglets), **puis** ajoutez les onglets. Ne montez pas tout d'un coup.

</div>

---
layout: default
---

# Les erreurs qu'on va rencontrer

<div class="oc-col1-40">

| Symptôme | Ce qu'il veut dire | La solution |
|---|---|---|
| `Unable to resolve module` | Chemin relatif faux après déplacement | Ajuster les `../` (voir le tableau) |
| Écran blanc au démarrage | `main` pas passé à `expo-router/entry` | Corriger `package.json`, relancer |
| `id` vaut `undefined` | Nom du fichier ≠ clé lue | `[id].tsx` ↔ `useLocalSearchParams().id` |
| La carte ne navigue pas | `Link` sans `asChild` sur un composant | `<Link … asChild><Pressable>…` |
| Deux en-têtes empilés | En-tête de la pile **et** des onglets | `headerShown: false` sur `(tabs)` |
| Un onglet nommé « (tabs) » | Le groupe apparaît car mal placé | Le `_layout.tsx` doit être **dans** `(tabs)/` |

</div>

---
layout: default
---

# Ce qu'on a mis en place

```tsx
// app/_layout.tsx — la pile racine
<Stack>
  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
  <Stack.Screen name="sentiers/[id]" options={{ title: 'Sentier' }} />
</Stack>

// app/(tabs)/index.tsx — chaque carte ouvre son détail
<Link href={`/sentiers/${item.id}`} asChild>
  <Pressable><TrailCard {...item} /></Pressable>
</Link>

// app/sentiers/[id].tsx — lire le paramètre et charger l'objet
const { id } = useLocalSearchParams()
useEffect(() => { fetch(`${API_URL}/sentiers/${id}`).then(r => r.json()).then(setSentier) }, [id])
```

---
layout: default
---

# Séance prochaine

**Séance 7 — Écrire des données (POST / PUT / DELETE).**

Jusqu'ici, on ne fait que **lire**. On va enfin **modifier** : ajouter un sentier, l'éditer, le supprimer — et voir les changements persister dans `db.json`.

Au programme : un **formulaire** d'ajout (avec les `TextInput` de la séance 3), l'envoi en `POST`, la validation des champs, la suppression avec confirmation, et la mise à jour de la liste après coup. Nos écrans de navigation vont enfin servir à créer du contenu.

<div class="mt-6">

**Pour la prochaine fois** — assurez-vous d'avoir :

</div>

```bash
# la liste ouvre le détail d'un sentier, et 3 onglets en bas
npx json-server db.json --host 0.0.0.0     # terminal 1
npx expo start                              # terminal 2
```
