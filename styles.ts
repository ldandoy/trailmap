import { StyleSheet } from 'react-native';

const greenDark = '#135635';
const greenLight = '#cfe8d5';
const white = '#ffffff';
const sylver = '#c0c0c0';

export const stylesApp = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: greenDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 64 },
  titre: {
    fontSize: 40,
    fontWeight: 'bold',
    color: white,
  },
  sousTitre: {
    fontSize: 16,
    color: greenLight,
    marginTop: 8,
  },
  liste: { padding: 16, paddingTop: 60 },
  separateur: { height: 12 },
  vide: { textAlign: 'center', color: greenDark, marginTop: 40 }
});

export const stylesCard = StyleSheet.create({
  cardContainer: {
    borderWidth: 1,
    borderColor: sylver,
    borderRadius: 8,
    backgroundColor: white,
    padding: 16,
    marginBottom: 16,
  },
  cardContainerImage: {
    paddingBottom: 8,
  },
  cardImage: {
    width: 300,
    height: 100,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardContainerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }
});