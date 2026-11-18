---
theme: default
title: Séance 5 — Consommer une API (GET)
info: |
  ## Séance 5 — Développement mobile (ECE)
  json-server en local, fetch + useEffect, et les trois états d'un appel réseau :
  chargement, succès, erreur.
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

<div class="text-xl opacity-90 mt-4">Séance 5 — Consommer une API (GET)</div>

<div class="mt-10 text-base opacity-80">
ECE · 24 h · 12 séances
</div>

<!--
Séance charnière : les données quittent le code pour venir du réseau. Deux
pièges à désamorcer AVANT le code, sinon la moitié de la salle est bloquée :
(1) il faut DEUX terminaux (json-server + expo) ; (2) le téléphone ne connaît
pas "localhost" du PC — il faut l'IP LAN, et json-server doit écouter sur
0.0.0.0. Bien prendre le temps sur ces deux points. Le fetch, lui, est facile.
-->

---
layout: default
---

# Là où on s'est arrêté

Depuis la séance 2, nos sentiers sont écrits **en dur**, dans un tableau `SENTIERS` au milieu du code :

```tsx
const SENTIERS = [
  { id: 1, nom: 'Cascade du Hérisson', difficulte: 'Facile', distanceKm: 7, photo: '…' },
  // …
]
```

Ça ne ressemble à aucune vraie application. Dans la vraie vie, les données vivent **ailleurs** — sur un serveur — et l'app va les **chercher** au lancement.

Aujourd'hui, on fait exactement ça : on monte notre **propre** API en local, et l'app récupère les sentiers par le **réseau**. À la fin, `SENTIERS` aura disparu du code.

---
layout: section
---

# 1. Notre API locale : json-server

---
layout: default
---

# Pourquoi une fausse API en local

Pas besoin d'un vrai backend pour apprendre à en **consommer** un. `json-server` transforme un simple fichier JSON en une vraie API REST, en une commande.

| Ce qu'on veut | Ce que json-server offre |
|---|---|
| Être **autonome** | Tourne sur votre machine, sans internet, sans compte |
| Une **vraie** API HTTP | De vraies URL, de vrais codes de statut, du vrai JSON |
| Tous les verbes | `GET` aujourd'hui, `POST`/`PUT`/`DELETE` en séance 7 |
| Des données à nous | On écrit nos sentiers dans un fichier qu'on maîtrise |

<div class="mt-4 opacity-90">

C'est le compromis idéal pour ce cours : le **réalisme** d'une API, sans la **lourdeur** d'un serveur à installer. Le jour où vous aurez un vrai backend, votre code d'app ne changera presque pas.

</div>

---
layout: default
---

# Créer l'API : le fichier de données

On crée un dossier séparé pour l'API, à côté du projet `trailmap`, avec un seul fichier : `db.json`.

```bash
# bash / macOS / Linux
mkdir trailmap-api
cd trailmap-api
touch db.json
```

```powershell
# PowerShell / Windows
New-Item -ItemType Directory trailmap-api
Set-Location trailmap-api
New-Item -ItemType File db.json
```

Chaque **clé** de ce fichier deviendra une **ressource** de l'API. Notre clé `sentiers` donnera l'URL `/sentiers`. Le contenu du fichier est sur la slide suivante.

---
layout: default
---

# `db.json`

Nos sentiers, mais cette fois dans un fichier de **données**, plus dans le code de l'app.

```json
{
  "sentiers": [
    { "id": 1, "nom": "Cascade du Hérisson", "difficulte": "Facile",
      "distanceKm": 7,  "photo": "https://picsum.photos/seed/cascade/400/300" },
    { "id": 2, "nom": "Crêtes du Jura",      "difficulte": "Difficile",
      "distanceKm": 14, "photo": "https://picsum.photos/seed/cretes/400/300" },
    { "id": 3, "nom": "Lac de Chalain",      "difficulte": "Moyen",
      "distanceKm": 9,  "photo": "https://picsum.photos/seed/lac/400/300" }
  ]
}
```

<div class="mt-3 opacity-90">

Le champ `id` est **obligatoire** : json-server s'en sert pour construire les URL individuelles (`/sentiers/1`) et pour les modifications à venir. C'est du **JSON pur** : guillemets doubles partout, pas de virgule après le dernier élément.

</div>

---
layout: default
---

# Lancer l'API — et l'ouvrir au réseau

La commande de base lance l'API sur le port 3000 :

```bash
npx json-server db.json
```

**Mais** telle quelle, json-server n'écoute que sur `localhost` : votre téléphone ne pourra **pas** la joindre. On l'ouvre au réseau local avec `--host 0.0.0.0` :

```bash
npx json-server db.json --host 0.0.0.0
```

On vérifie dans le **navigateur du PC** :

<pre class="oc-panel">
  http://localhost:3000/sentiers        → la liste complète (JSON)
  http://localhost:3000/sentiers/1      → un seul sentier
</pre>

<div class="mt-3 opacity-90">

**Important** : ce terminal doit rester **ouvert** toute la séance. Vous aurez donc **deux** terminaux : un pour `json-server`, un autre pour `npx expo start`.

</div>

---
layout: section
---

# 2. Le piège du « localhost »

---
layout: default
---

# `localhost`, pour le téléphone, c'est le téléphone

C'est **l'**erreur numéro un du mobile. Sur votre téléphone, `localhost` ne désigne pas votre PC : il désigne **le téléphone lui-même**. L'API n'y est pas → l'appel échoue.

<pre class="oc-panel">
  Depuis le PC                        Depuis le téléphone
  http://localhost:3000  ✅           http://localhost:3000  ❌ (= le téléphone !)
                                      http://192.168.1.42:3000  ✅ (= le PC)
</pre>

La solution : joindre le PC par son **adresse IP sur le réseau local**. On la trouve ainsi :

```bash
# Windows
ipconfig                     # → ligne "Adresse IPv4", ex. 192.168.1.42
```

```bash
# macOS
ipconfig getifaddr en0
# Linux
hostname -I
```

<div class="mt-2 opacity-80">

Même condition qu'en séance 1 : téléphone et PC sur **le même Wi-Fi**. C'est aussi l'IP qu'affiche Expo au démarrage.

</div>

---
layout: default
---

# Centraliser l'adresse : `api.ts`

Cette IP change selon la machine et le réseau. On la met à **un seul endroit**, dans un fichier `api.ts`, pour n'avoir qu'une ligne à corriger.

```bash
touch api.ts                        # bash
New-Item -ItemType File api.ts      # PowerShell
```

```ts
// api.ts — adaptez l'IP à VOTRE ordinateur (voir ipconfig)
export const API_URL = 'http://192.168.1.42:3000'

export type Sentier = {
  id: number
  nom: string
  difficulte: string
  distanceKm: number
  photo: string
}
```

<div class="mt-3 opacity-80">

On en profite pour décrire la **forme** d'un sentier avec un `type Sentier`. TypeScript saura ainsi ce que contient chaque objet reçu de l'API, et nous préviendra si on lit un champ qui n'existe pas.

</div>

---
layout: section
---

# 3. Aller chercher les données : `fetch`

---
layout: default
---

# `fetch` : demander, puis attendre

`fetch` est la fonction du navigateur (et de React Native) pour appeler une URL. Un appel réseau **prend du temps** : on utilise `await` pour **attendre** la réponse sans bloquer l'app.

```tsx
const reponse = await fetch(`${API_URL}/sentiers`)   // 1. attendre la réponse
const donnees = await reponse.json()                  // 2. lire le corps en JSON
```

Deux `await`, car il y a **deux** attentes :

| Étape | Ce qu'on attend |
|---|---|
| `await fetch(...)` | que le serveur **réponde** (statut, en-têtes) |
| `await reponse.json()` | que le **corps** soit lu et transformé en objet JS |

<div class="mt-3 opacity-90">

Toute fonction qui contient un `await` doit être marquée `async`. Et comme un réseau peut **échouer**, on entoure le tout d'un `try / catch` — c'est l'objet de la slide sur les trois états.

</div>

---
layout: section
---

# 4. Charger au bon moment : `useEffect`

---
layout: default
---

# Pourquoi pas directement dans le composant ?

Tentant d'appeler `fetch` directement dans le corps du composant. **Piège** : le corps s'exécute à **chaque** redessin. Or `fetch` va faire un `setState`… qui provoque un redessin… qui relance `fetch`… **boucle infinie**.

`useEffect` règle ça : il exécute du code **après** l'affichage, et **seulement quand on le décide**.

```tsx
import { useEffect } from 'react'

useEffect(() => {
  // ce code s'exécute UNE fois, après le premier affichage
  charger()
}, [])
//  ▲
//  le tableau de dépendances : VIDE = « une seule fois, au montage »
```

| Tableau de dépendances | Quand l'effet se déclenche |
|---|---|
| `[]` (vide) | **une seule fois**, au premier affichage |
| `[recherche]` | à chaque fois que `recherche` change |
| *(absent)* | après **chaque** redessin — presque toujours une erreur |

<div class="mt-2 opacity-80">

Pour charger des données au lancement, c'est **toujours** le tableau vide `[]`.

</div>

---
layout: section
---

# 5. Les trois états d'un appel réseau

---
layout: default
---

# Toujours trois cas à gérer

Un appel réseau n'est jamais instantané, et peut échouer. Une app sérieuse gère **trois** états, toujours les mêmes.

| État | Ce qu'on montre à l'écran |
|---|---|
| **En chargement** | un indicateur qui tourne (`ActivityIndicator`) |
| **En erreur** | un message clair, et un bouton « Réessayer » |
| **Succès** | la liste des sentiers |

<div class="mt-4">

On les représente par **trois variables d'état**. Elles vont piloter ce qu'affiche l'écran :

</div>

```tsx
const [sentiers, setSentiers] = useState<Sentier[]>([])   // les données
const [chargement, setChargement] = useState(true)        // vrai au départ
const [erreur, setErreur] = useState<string | null>(null) // null = pas d'erreur
```

<div class="mt-2 opacity-80">

`useState<Sentier[]>([])` : on part d'un **tableau vide** de sentiers. Le `<Sentier[]>` dit à TypeScript ce que ce tableau contiendra.

</div>

---
layout: default
---

# La fonction de chargement

Une seule fonction `charger` fait tout le travail réseau, avec sa gestion d'erreur. On la réutilisera pour le rafraîchissement.

```tsx
const charger = async () => {
  try {
    setErreur(null)
    const reponse = await fetch(`${API_URL}/sentiers`)
    if (!reponse.ok) throw new Error('Statut ' + reponse.status)
    const donnees = await reponse.json()
    setSentiers(donnees)
  } catch (e) {
    setErreur("Impossible de charger les sentiers. L'API est-elle lancée ?")
  }
}
```

<div class="mt-3 opacity-90">

Le `if (!reponse.ok)` est essentiel : `fetch` **ne lève pas** d'erreur sur un `404` ou un `500`. Il faut vérifier `reponse.ok` soi-même, et lever l'erreur pour tomber dans le `catch`.

</div>

---
layout: default
---

# Déclencher, puis afficher selon l'état

On lance `charger` au montage, et on **choisit l'affichage** selon l'état courant : d'abord le chargement, puis l'erreur, sinon la liste.

```tsx
useEffect(() => {
  charger().finally(() => setChargement(false))   // au montage : on charge une fois
}, [])

if (chargement) {
  return <ActivityIndicator size="large" color="#135635" style={styles.centre} />
}
if (erreur) {
  return (
    <View style={styles.centre}>
      <Text style={styles.erreur}>{erreur}</Text>
      <Pressable onPress={() => { setChargement(true); charger().finally(() => setChargement(false)) }}>
        <Text style={styles.reessayer}>Réessayer</Text>
      </Pressable>
    </View>
  )
}
```

Tant que `chargement` est vrai, on voit le rond. En cas de souci, le message + « Réessayer ». Sinon, on passe à la liste.

---
layout: default
---

# Le cas « succès » : la `FlatList`

Une fois chargé et sans erreur, on affiche la `FlatList` de la séance 4 — mais alimentée par `sentiers`, venus de l'**API**.

```tsx
const resultats = sentiers.filter((s) =>
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
```

Le tableau `SENTIERS` en dur a **disparu**. Les données viennent du réseau. La recherche de la séance 3 continue de fonctionner, telle quelle.

---
layout: section
---

# 6. Le vrai « tirer pour rafraîchir »

---
layout: default
---

# On rebranche `onRefresh` sur l'API

En séance 4, le rafraîchissement était **simulé** avec un `setTimeout`. Maintenant qu'on a `charger`, on lui fait vraiment **recharger** les données.

```tsx
const [refreshing, setRefreshing] = useState(false)

const rafraichir = () => {
  setRefreshing(true)
  charger().finally(() => setRefreshing(false))   // un vrai appel réseau
}
```

Et on branche les deux props sur la `FlatList` :

```tsx
<FlatList
  data={resultats}
  // … renderItem, keyExtractor … 
  refreshing={refreshing}
  onRefresh={rafraichir}
/>
```

<div class="mt-2 opacity-80">

Testez en direct : modifiez un nom dans `db.json`, enregistrez, **tirez la liste** dans l'app → le nouveau nom apparaît. La donnée circule vraiment.

</div>

---
layout: section
---

# 7. Atelier

---
layout: default
---

# À faire maintenant

Objectif : **`trailmap` affiche des sentiers venus de l'API, plus du code.**

1. Créer `trailmap-api/db.json` avec la ressource `sentiers`
2. Lancer `npx json-server db.json --host 0.0.0.0`, vérifier `/sentiers` dans le navigateur
3. Trouver l'IP de votre PC (`ipconfig`) et la mettre dans `api.ts`
4. Ajouter les trois états (`sentiers`, `chargement`, `erreur`) et la fonction `charger`
5. Charger au montage avec `useEffect(() => …, [])`
6. Afficher : le `ActivityIndicator`, puis l'erreur + « Réessayer », puis la `FlatList`
7. Rebrancher `onRefresh` sur `charger` (vrai rechargement)
8. **Test de l'erreur** : coupez `json-server`, tirez pour rafraîchir → le message doit s'afficher

<div class="mt-3 opacity-80">

Le point 8 est aussi important que les autres : une app qui ne gère pas la panne réseau n'est **pas** finie.

</div>

---
layout: default
---

# Les erreurs qu'on va rencontrer

<div class="oc-col1-40">

| Symptôme | Ce qu'il veut dire | La solution |
|---|---|---|
| `Network request failed` | `localhost` utilisé, ou mauvais Wi-Fi | Mettre l'**IP LAN** du PC dans `api.ts` |
| Marche sur le PC, pas sur le tel | json-server sur `localhost` seul | Lancer avec `--host 0.0.0.0` |
| L'app charge sans fin | `setChargement(false)` jamais atteint | Le mettre dans un `.finally(...)` |
| Un `404` ne déclenche pas le `catch` | `fetch` ne lève pas sur `4xx`/`5xx` | Tester `if (!reponse.ok) throw …` |
| Boucle infinie de requêtes | `fetch` dans le corps du composant | Le mettre dans `useEffect(…, [])` |
| Rien, pas d'erreur | terminal json-server fermé | Le relancer, le **laisser ouvert** |

</div>

---
layout: default
---

# Ce qu'on a mis en place

```tsx
// api.ts — un seul endroit pour l'adresse
export const API_URL = 'http://192.168.1.42:3000'

// Les trois états d'un appel réseau
const [sentiers, setSentiers]   = useState<Sentier[]>([])
const [chargement, setChargement] = useState(true)
const [erreur, setErreur]       = useState<string | null>(null)

// Charger une fois, au montage
useEffect(() => { charger().finally(() => setChargement(false)) }, [])

// Choisir l'affichage selon l'état
if (chargement) return <ActivityIndicator size="large" />
if (erreur)     return <Text>{erreur}</Text>
return <FlatList data={sentiers} refreshing={refreshing} onRefresh={rafraichir} … />
```

---
layout: default
---

# Séance prochaine

**Séance 6 — La navigation.**

Notre liste est belle, mais **plate** : on ne peut pas ouvrir un sentier pour voir ses détails. Il manque la **navigation** — passer d'un écran à un autre.

Au programme : **Expo Router**, le système de navigation d'Expo, qui fonctionne **par fichiers** (un fichier = un écran). On créera un écran de **détail** (`GET /sentiers/:id`), on passera d'un écran à l'autre en touchant une carte, et on posera les **onglets** du bas : Sentiers · Favoris · Carte.

<div class="mt-6">

**Pour la prochaine fois** — assurez-vous d'avoir :

</div>

```bash
# la liste des sentiers chargée depuis json-server, avec les 3 états
npx json-server db.json --host 0.0.0.0     # terminal 1
npx expo start                              # terminal 2
```
