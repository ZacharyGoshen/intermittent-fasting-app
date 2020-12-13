import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import Timer from './Timer';
import Fasts from './Fasts';
import History from './History';
import Stats from './Stats';
import { getData, storeData } from './Utils';

const App = () => {
  const [currentView, setCurrentView] = useState('timer');
  const [fastData, setFastData] = useState([]);
  const [fastName, setFastName] = useState('16:8 Intermittent');
  const [fastLength, setFastLength] = useState(8 * 60 * 60 * 1000);

  useEffect(() => {
    getData('fastData').then(result => {
      if (result) {
        setFastData(result);
      } else {
        storeData('fastData', []);
      }
    });

    getData('fastName').then(result => {
      setFastName(result);
    });

    getData('fastLength').then(result => {
      setFastLength(result);
    });
  }, []);

  const calculateNavItemStyles = (destination) => {
    if (destination == currentView) {
      return {
        color: '#4ee7ff'
      }
    }
    return {};
  }

  const onChangeFast = (fastName, fastHours, feedingHours) => {
    storeData('fastName', fastName);
    setFastName(fastName);

    storeData('fastLength', fastHours * 60 * 60 * 1000);
    setFastLength(fastHours * 60 * 60 * 1000);

    setCurrentView('timer');
  }

  const addFastData = (fast) => {
    storeData('fastData', [...fastData, fast]);
    setFastData([...fastData, fast]);
  }

  const updateFastData = (fast) => {
    const index = fastData.indexOf(fast);
    fastData.splice(index, 1, fast);

    storeData('fastData', fastData);
    setFastData(fastData);
  }

  return (
    <>
      <SafeAreaView style={ styles.safeArea }>
        { currentView == 'timer' && (
          <Timer 
            onAddFastData={ (newFastData) => addFastData(newFastData) }
            onPressFastName={ () => setCurrentView('fasts') }
            fastName={ fastName }
            fastLength={ fastLength }
            earliestPossibleStartTime = { fastData.length ? new Date(fastData[0].endTime) : null }
          />
        ) }
        { currentView == 'fasts' && (
          <Fasts onChangeFast={ onChangeFast }/>
        ) }
        { currentView == 'history' && (
          <History 
            onUpdateFastData={ (updatedFastData) => updateFastData(updatedFastData) }
            fastData={ fastData }
          />
        ) }        
        { currentView == 'stats' && (
          <Stats/>
        ) }
        <View style={ styles.navBar }>
          <Text 
            style={ [styles.navItem, calculateNavItemStyles('timer')] }
            onPress={ () => setCurrentView('timer') }
          >
            Timer
          </Text>
          <Text 
            style={ [styles.navItem, calculateNavItemStyles('fasts')] }
            onPress={ () => setCurrentView('fasts') }
          >
            Fasts
          </Text>
          <Text 
            style={ [styles.navItem, calculateNavItemStyles('history')] }
            onPress={ () => setCurrentView('history') }
          >
            History
          </Text>
          <Text 
            style={ [styles.navItem, calculateNavItemStyles('stats')] }
            onPress={ () => setCurrentView('stats') }
          >
            Stats
          </Text>
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
  safeArea: {
    flex: 1
  },
});

export default App;
