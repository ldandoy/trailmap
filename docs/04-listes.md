---
theme: default
title: Séance 4 — Les listes de données
info: |
  ## Séance 4 — Développement mobile (ECE)
  FlatList, keyExtractor, les zones toutes faites (header, séparateur, vide)
  et le tirer-pour-rafraîchir.
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

<div class="text-xl opacity-90 mt-4">Séance 4 — Les listes de données</div>

<div class="mt-10 text-base opacity-80">
ECE · 24 h · 12 séances
</div>

<!--
Séance courte en concepts, forte en confort. FlatList remplace map+ScrollView.
Le morceau qui mérite du temps : keyExtractor. Utiliser le favori de la séance 3
comme preuve concrète que la clé compte (sinon le cœur "saute" de carte). Le
pull-to-refresh est simulé ici (setTimeout) ; il deviendra un vrai rechargement
API en séance 5. Bien vendre ce lien.
-->

---
layout: default
---

# Là où on s'est arrêté

En séance 3, on affiche la liste des sentiers avec un `.map()` dans un `ScrollView` :

```tsx
<ScrollView>
  {resultats.map((s) => <TrailCard key={s.id} {...s} />)}
</ScrollView>
```

Ça marche très bien… avec **trois** sentiers. Le problème arrive avec **trois cents** : `ScrollView` fabrique **toutes** les cartes d'un coup, même les 290 qu'on ne voit pas. L'app devient lente, saccadée, et gourmande en mémoire.

<div class="mt-4">

Aujourd'hui, on remplace ce `.map()` par le composant fait pour ça : **`FlatList`**. Même résultat à l'écran, mais conçu pour tenir la charge — et avec des fonctions offertes qu'on devrait sinon coder à la main.

</div>

---
layout: section
---

# 1. Pourquoi FlatList

---
layout: default
---

# `ScrollView` fabrique tout, `FlatList` fabrique le visible

La différence est invisible à trois éléments, décisive à trois cents. `FlatList` ne fabrique que ce qui est **à l'écran**, et recycle les cartes au fur et à mesure du défilement. C'est ce qu'on appelle la **virtualisation**.

<pre class="oc-panel">
   ScrollView                        FlatList
   (fabrique tout)                   (fabrique le visible)

   ┌──────────────┐                  ┌──────────────┐
   │ ▓ visible    │                  │ ▓ visible    │  ← fabriquée
   │ ▓ visible    │                  │ ▓ visible    │  ← fabriquée
   ├──────────────┤                  ├──────────────┤
   │ ░ cachée     │                  │   (rien)     │  ← pas encore fabriquée
   │ ░ cachée     │                  │   (rien)     │
   │ ░ … 300      │                  │   …          │
   └──────────────┘                  └──────────────┘
   300 cartes en mémoire             ~12 cartes en mémoire
</pre>

<div class="mt-2 opacity-80">

Règle simple : liste **courte et fixe** (un menu de 4 lignes) → `ScrollView` suffit. Liste **longue ou venue de données** (nos sentiers, demain depuis une API) → **`FlatList`**.

</div>

---
layout: section
---

# 2. FlatList, l'essentiel

---
layout: default
---

# Trois props, et c'est tout

`FlatList` s'articule autour de **trois** props. Retenez ces trois-là, le reste est du bonus.

| Prop | Ce qu'on lui donne | Rôle |
|---|---|---|
| `data` | le **tableau** de données | la liste à afficher (`SENTIERS`) |
| `renderItem` | une **fonction** | comment dessiner **un** élément |
| `keyExtractor` | une **fonction** | l'identifiant unique de chaque élément |

<div class="mt-4">

L'idée : on ne décrit plus **toutes** les cartes. On donne à `FlatList` **les données** et **une recette pour dessiner une carte**, et il s'occupe de la répétition, du défilement, et de la performance.

</div>

<div class="mt-3 opacity-80">

Fini le `.map()` à la main, fini le `ScrollView` : `FlatList` fait défiler tout seul.

</div>

---
layout: default
---

# La liste des sentiers en `FlatList`

On remplace le `.map()` dans le `ScrollView` par une `FlatList`. Voici la version minimale, avec les trois props.

```tsx
import { FlatList } from 'react-native'
import TrailCard from './components/TrailCard'

export default function App() {
  return (
    <FlatList
      data={SENTIERS}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <TrailCard nom={item.nom} difficulte={item.difficulte}
          distanceKm={item.distanceKm} photo={item.photo} />
      )}
    />
  )
}
```

Le résultat à l'écran est identique à la séance 3 — mais cette liste tiendrait trois **mille** sentiers sans ralentir. On décortique `renderItem` et `keyExtractor` juste après.

---
layout: default
---

# `renderItem` : la recette d'une carte

`FlatList` appelle `renderItem` **une fois par élément** du tableau. À chaque appel, il passe un objet, dont on extrait `item` — l'élément courant.

```tsx
renderItem={({ item }) => (
  <TrailCard nom={item.nom} difficulte={item.difficulte}
    distanceKm={item.distanceKm} photo={item.photo} />
)}
//          ▲
//   { item } : l'objet du tableau en cours de dessin
//   (ici, un sentier : { id, nom, difficulte, distanceKm, photo })
```

<div class="mt-3">

Le `{ item }` entre accolades, c'est de la **déstructuration** : `FlatList` passe en réalité `{ item, index, separators }`, et on ne récupère que `item`. Si un jour on a besoin du numéro de ligne, on écrira `({ item, index })`.

</div>

<div class="mt-2 opacity-80">

On pourrait aussi passer l'objet entier avec `{...item}` — mais l'écrire champ par champ reste plus lisible tant qu'on apprend.

</div>

---
layout: default
---

# `keyExtractor` : pourquoi la clé compte vraiment

`keyExtractor` donne à chaque élément un **identifiant unique et stable**. `FlatList` s'en sert pour **suivre** chaque carte quand la liste change — un ajout, une suppression, un filtre.

```tsx
keyExtractor={(item) => String(item.id)}
//                      ▲
//   la clé doit être une CHAÎNE ; notre id est un nombre → String(...)
```

Pourquoi ne pas prendre le **numéro de ligne** comme clé ? Souvenez-vous du **favori** de la séance 3 :

<pre class="oc-panel">
  Liste complète        On filtre "jura"       Avec une clé = position
  0  Cascade  ❤️        0  Crêtes             la carte 0 devient "Crêtes"…
  1  Crêtes            (Crêtes remonte)       …mais garde le ❤️ de Cascade !
  2  Lac                                       → le cœur a sauté de sentier
</pre>

Avec `keyExtractor` sur l'`id`, `FlatList` sait que « Cascade » **est** Cascade, où qu'elle soit dans la liste. L'état reste collé au bon sentier.

---
layout: section
---

# 3. Les zones toutes faites

---
layout: default
---

# Header, séparateur, liste vide

`FlatList` offre des « emplacements » qui remplacent du code qu'on écrivait à la main en séance 3.

| Prop | Ce qu'elle affiche | Remplace… |
|---|---|---|
| `ListHeaderComponent` | un bloc **en haut** de la liste | un en-tête posé au-dessus |
| `ItemSeparatorComponent` | un séparateur **entre** deux éléments | les `marginBottom` / `gap` |
| `ListEmptyComponent` | un bloc quand la liste est **vide** | le `resultats.length === 0 && …` |
| `contentContainerStyle` | le style **du contenu** (padding…) | comme sur `ScrollView` |

<div class="mt-4 opacity-90">

Le `ListEmptyComponent` est particulièrement pratique : plus besoin de tester la longueur soi-même. Si `data` est vide, `FlatList` affiche ce bloc **à la place** de la liste.

</div>

---
layout: default
---

# Une `FlatList` habillée

On ajoute un séparateur et un message de liste vide. Le séparateur est un simple trait ; le bloc vide, un texte centré.

```tsx
<FlatList
  data={resultats}
  keyExtractor={(item) => String(item.id)}
  renderItem={({ item }) => (
    <TrailCard nom={item.nom} difficulte={item.difficulte}
      distanceKm={item.distanceKm} photo={item.photo} />
  )}
  contentContainerStyle={styles.liste}
  ItemSeparatorComponent={() => <View style={styles.separateur} />}
  ListEmptyComponent={
    <Text style={styles.vide}>Aucun sentier trouvé</Text>
  }
/>
```

```tsx
const styles = StyleSheet.create({
  liste: { padding: 16, paddingTop: 60 },
  separateur: { height: 12 },                 // l'espace entre deux cartes
  vide: { textAlign: 'center', color: '#4b6455', marginTop: 40 },
})
```

---
layout: section
---

# 4. Tirer pour rafraîchir

---
layout: default
---

# Le geste « pull-to-refresh »

Tirer une liste vers le bas pour la recharger : c'est un réflexe universel sur mobile. `FlatList` le gère avec **deux** props, sans composant supplémentaire.

| Prop | Type | Rôle |
|---|---|---|
| `refreshing` | booléen (un état) | `true` = affiche le petit rond qui tourne |
| `onRefresh` | fonction | appelée quand l'utilisateur **tire** la liste |

<div class="mt-3">

Le scénario est toujours le même :

</div>

<pre class="oc-panel">
  l'utilisateur tire  →  onRefresh se déclenche  →  setRefreshing(true)
       →  on (re)charge les données  →  setRefreshing(false)  →  le rond disparaît
</pre>

<div class="mt-2 opacity-80">

Aujourd'hui nos données sont en dur : on **simulera** un rechargement d'une seconde. En séance 5, ce même `onRefresh` ira vraiment rechercher les sentiers sur l'API.

</div>

---
layout: default
---

# Le rafraîchissement, en code

On ajoute un état `refreshing`, une fonction qui le passe à `true` puis à `false`, et on branche les deux props.

```tsx
const [refreshing, setRefreshing] = useState(false)

const rafraichir = () => {
  setRefreshing(true)
  // séance 5 : ici, on rechargera les sentiers depuis l'API
  setTimeout(() => setRefreshing(false), 1000)   // simulation : 1 seconde
}

return (
  <FlatList
    data={resultats}
    keyExtractor={(item) => String(item.id)}
    renderItem={({ item }) => <TrailCard nom={item.nom} difficulte={item.difficulte}
      distanceKm={item.distanceKm} photo={item.photo} />}
    refreshing={refreshing}
    onRefresh={rafraichir}
  />
)
```

Tirez la liste vers le bas : le rond tourne une seconde, puis disparaît. La mécanique est en place ; il ne manquera que les vraies données.

---
layout: section
---

# 5. Recherche + `FlatList`

---
layout: default
---

# On recolle la barre de recherche

On veut garder le filtre de la séance 3. La barre de recherche reste **au-dessus** de la `FlatList`, dans une `View` qui enveloppe le tout.

```tsx
export default function App() {
  const [recherche, setRecherche] = useState('')
  const resultats = SENTIERS.filter((s) =>
    s.nom.toLowerCase().includes(recherche.toLowerCase()))

  return (
    <View style={styles.ecran}>
      <TextInput style={styles.recherche} placeholder="Rechercher un sentier…"
        value={recherche} onChangeText={setRecherche} />

      <FlatList
        data={resultats}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <TrailCard nom={item.nom} difficulte={item.difficulte}
          distanceKm={item.distanceKm} photo={item.photo} />}
        ItemSeparatorComponent={() => <View style={styles.separateur} />}
        ListEmptyComponent={<Text style={styles.vide}>Aucun sentier trouvé</Text>}
      />
    </View>
  )
}
```

---
layout: default
---

# Pourquoi la recherche reste en dehors de la liste

`FlatList` propose `ListHeaderComponent` pour poser un bloc en haut. Tentant d'y mettre la barre de recherche… mais **c'est un piège** ici.

À chaque frappe, l'état `recherche` change, et `FlatList` se redessine. Si le `TextInput` est **dans** l'en-tête, il peut **perdre le focus** à chaque lettre — le clavier se referme, la saisie devient impossible.

<div class="mt-3">

La règle : un champ de saisie qui **pilote** la liste se met **à côté** de la `FlatList`, pas dedans. On garde `ListHeaderComponent` pour du contenu **statique** — un titre, un compteur « 12 sentiers ».

</div>

<div class="mt-3 opacity-80">

C'est le genre de détail qui distingue une app qui « marche en démo » d'une app agréable à utiliser. On les signalera au fil du cours.

</div>

---
layout: section
---

# 6. Atelier

---
layout: default
---

# À faire maintenant

On part du projet `trailmap` de la séance 3. Objectif : **la même liste, mais en `FlatList`, prête à grandir.**

1. Remplacer le `.map()` + `ScrollView` par une `FlatList` (`data`, `renderItem`, `keyExtractor`)
2. Vérifier que les favoris **et** la recherche fonctionnent toujours
3. Ajouter un `ItemSeparatorComponent` entre les cartes
4. Ajouter un `ListEmptyComponent` (« Aucun sentier trouvé ») et supprimer l'ancien test `&&`
5. Brancher le tirer-pour-rafraîchir (`refreshing` + `onRefresh`), simulé avec `setTimeout`
6. **Bonus** : allonger `SENTIERS` à 20 entrées et faire défiler — sentir la fluidité
7. **Bonus** : un `ListHeaderComponent` statique affichant « `resultats.length` sentiers »

<div class="mt-3 opacity-80">

Astuce pour le bonus des 20 sentiers : dupliquez vos objets en changeant `id` et `nom`, ou générez-les avec un `.map()` sur `[1, 2, 3, …]`.

</div>

---
layout: default
---

# Les erreurs qu'on va rencontrer

<div class="oc-col1-40">

| Symptôme | Ce qu'il veut dire | La solution |
|---|---|---|
| `Each child … unique key` | `keyExtractor` absent ou clé non unique | Retourner un id unique par élément |
| La clé « n'est pas une chaîne » | `id` numérique passé tel quel | `String(item.id)` |
| `renderItem` : `item` est `undefined` | Oubli des accolades `{ item }` | `renderItem={({ item }) => …}` |
| Rien ne s'affiche | `data` vide ou mal orthographié | Vérifier le tableau passé à `data` |
| Le clavier se ferme à chaque lettre | `TextInput` dans `ListHeaderComponent` | Le sortir, à côté de la `FlatList` |
| `padding` ignoré | Mis dans `style` | `contentContainerStyle` |

</div>

---
layout: default
---

# Ce qu'on a mis en place

```tsx
<FlatList
  data={resultats}                                   // le tableau à afficher
  keyExtractor={(item) => String(item.id)}           // un id unique et stable
  renderItem={({ item }) => (                         // la recette d'une carte
    <TrailCard nom={item.nom} difficulte={item.difficulte}
      distanceKm={item.distanceKm} photo={item.photo} />
  )}
  contentContainerStyle={styles.liste}
  ItemSeparatorComponent={() => <View style={styles.separateur} />}
  ListEmptyComponent={<Text style={styles.vide}>Aucun sentier trouvé</Text>}
  refreshing={refreshing}                             // le rond de chargement
  onRefresh={rafraichir}                              // tirer pour recharger
/>
```

---
layout: default
---

# Séance prochaine

**Séance 5 — Consommer une API.**

Nos sentiers sont écrits **en dur** dans le code. C'est le moment d'aller les chercher là où vivent les vraies données : **une API**.

Au programme : lancer notre propre fausse API en local avec **json-server** (aucune dépendance à internet), aller chercher les données avec `fetch`, et gérer les trois états de tout appel réseau — **en cours de chargement**, **réussi**, **en erreur**. Et notre `onRefresh` d'aujourd'hui rechargera enfin de **vraies** données.

<div class="mt-6">

**Pour la prochaine fois** — assurez-vous d'avoir :

</div>

```bash
# une FlatList qui filtre, sépare, et se tire-pour-rafraîchir
npx expo start
```
