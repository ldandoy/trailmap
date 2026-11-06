import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import {Card} from './components/Card';
import SENTIERS from './data/trail';

export default function App() {
  const [count, setCount] = useState(0);
  const [recherche, setRecherche] = useState('');

  const resultats = SENTIERS.filter((s) =>
    s.nom.toLowerCase().includes(recherche.toLowerCase()),
  );

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🥾</Text>
      <Text style={styles.titre}>TrailMap</Text>
      <Text style={styles.sousTitre}>Trouvez votre prochaine randonnée</Text>
      <View>
      <Pressable onPress={() => {
        setCount(count + 1);
        console.log('touché !');
      }}>
        <Text>Touchez-moi</Text>
      </Pressable>
      <Text>Nombre de touches: {count}</Text>
      </View>
      <View>
        <TextInput placeholder="Rechercher un sentier…"
        value={recherche} onChangeText={setRecherche} />
      </View>
      <ScrollView>
        {resultats.map((sentier) => (
          <Card 
            key={sentier.id}
            nom={sentier.nom}
            difficulte={sentier.difficulte}
            distanceKm={sentier.distanceKm}
            photo={sentier.photo}
          />
        ))}

        {resultats.length === 0 && (
          <Text>Aucun sentier trouvé pour « {recherche} »</Text>
        )}
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

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
