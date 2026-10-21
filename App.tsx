import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import {Card} from './components/Card';


export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🥾</Text>
      <Text style={styles.titre}>TrailMap</Text>
      <Text style={styles.sousTitre}>Trouvez votre prochaine randonnée</Text>
      <ScrollView>
        <Card 
          nom="Cascade du hérisson"
          difficulte="Facile"
          distanceKm={7}
          photo={require('./assets/images/photo1.jpg')}
        />
        <Card 
          nom="Tour du lac de Chalain"
          difficulte="Facile"
          distanceKm={3}
          photo={require('./assets/images/photo2.jpg')}
        />
        <Card 
          nom="Les sapins"
          difficulte="Difficile"
          distanceKm={17}
          photo={require('./assets/images/photo3.jpg')}
        />
        <Card 
          nom="Tour du lac de Chalain"
          difficulte="Facile"
          distanceKm={3}
          photo={require('./assets/images/photo2.jpg')}
        />
        <Card 
          nom="Les sapins"
          difficulte="Difficile"
          distanceKm={17}
          photo={require('./assets/images/photo3.jpg')}
        />
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
