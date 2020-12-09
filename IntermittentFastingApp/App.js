import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import Timer from './Timer';

const App = () => {
  const [currentView, setCurrentView] = useState('timer');

  return (
    <>
      <SafeAreaView style={ styles.safeArea }>
        { currentView == 'timer' && (
          <Timer/>
        ) }
        <View style={ styles.navBar }>
          <Text 
            style={ styles.navItemCurrent }
            onPress={ () => setCurrentView('timer') }
          >
            Timer
          </Text>
          <Text 
            style={ styles.navItem }
            onPress={ () => setCurrentView('fasts') }
          >
            Fasts
          </Text>
          <Text style={ styles.navItem }>History</Text>
          <Text style={ styles.navItem }>Stats</Text>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  navBar: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: 'white',
    borderColor: '#f0f0f0',
    borderTopWidth: 2,
    display: 'flex',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  navItem: {
    color: 'gray',
    fontWeight: 'bold'
  },
  navItemCurrent: {
    color: '#4ee7ff',
    fontWeight: 'bold'
  },
  safeArea: {
    flex: 1
  },
});

export default App;
