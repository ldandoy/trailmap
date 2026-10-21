import { Image, Text, View } from 'react-native';
import { styles } from '../styles';

interface cardProps {
  nom: string;
  difficulte: string;
  distanceKm: number;
  photo: any;
}

export const Card = ({ nom, difficulte, distanceKm, photo } : cardProps) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardContainerImage}>
        <Image 
          source={photo}
          style={styles.cardImage}
        />
      </View>
      <View>
        <View>
          <Text style={styles.cardTitle}>{nom}</Text>
        </View>
        <View>
          <Text>{difficulte}</Text><Text>{distanceKm} km</Text>
        </View>
      </View>
    </View>
  )
}
