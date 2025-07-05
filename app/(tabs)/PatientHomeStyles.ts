import { Platform, StatusBar, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 48,
    paddingVertical: 32,
    paddingHorizontal: 20,
    gap: 24,
  },

  // Mode Switch
  modeSwitchRow: {
    width: '100%',
    paddingHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  modeText: {
    color: 'black',
    fontSize: 16,
    fontFamily: 'SFProDisplay-Light',
    fontWeight: '300',
    lineHeight: 18,
  },

  // Greeting Section
  greetingContainer: {
    marginTop: -15,
    alignSelf: 'stretch',
  },
  greetingTitle: {
    fontFamily: 'SFProDisplay-Black',
    fontSize: 48,
    fontWeight: '800',
    lineHeight: 52.8,
    color: 'black',
  },
  greetingSubtitle: {
    fontFamily: 'SFProDisplay-Light',
    fontSize: 32,
    fontWeight: '300',
    lineHeight: 35.2,
    color: 'black',
  },

  //CARDS
  cardContainer: {
    width: '100%',
    gap: 20,
  },
  card1: {
    display: 'flex',
    height: '45%',
    width: '100%',
    padding: 24,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    flexShrink: 0,
    alignSelf: 'stretch',
    backgroundColor: '#262626',
    borderRadius: 16,
  },
  card2: {
    display: 'flex',
    width: '100%',
    height: '20%',
    padding: 24,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    flexShrink: 0,
    alignSelf: 'stretch',
    backgroundColor: '#3E3E3E',
    borderRadius: 16,
  },
  card3: {
    display: 'flex',
    width: '100%',
    height: '20%',
    padding: 24,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    flexShrink: 0,
    alignSelf: 'stretch',
    backgroundColor: '#666',
    borderRadius: 16,
  },





  textRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    gap: 10,
  },
  cardText: {
    color: '#DED7CD',
    fontSize: 24,
    fontWeight: '300',
    lineHeight: 26.4,
    fontFamily: 'SFProDisplay-Light',
  },

});