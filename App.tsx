import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import {Card as TrailCard} from './components/Card';
import SENTIERS from './data/trail';
import { stylesApp as styles } from './styles';
import { getTrails } from './services/trails';

export default function App() {
  const [count, setCount] = useState(0);
  const [recherche, setRecherche] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const trails = await getTrails();
      // console.log('Trails fetched in App:', trails);
    };
    
    fetchData();
  }, []);

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
      {/*<ScrollView>
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
      </ScrollView>*/}

      <FlatList
        data={resultats}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <TrailCard 
          nom={item.nom} 
          difficulte={item.difficulte}
          distanceKm={item.distanceKm}
          photo={item.photo}
        />}
        ItemSeparatorComponent={() => <View style={styles.separateur} />}
        ListEmptyComponent={<Text style={styles.vide}>Aucun sentier trouvé</Text>}
      />

      <StatusBar style="auto" />
    </View>
  );
}

