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
  const [fastLength, setFastLength] = useState(16 * 60 * 60 * 1000);

  useEffect(() => {
    getData('fastData').then(result => {
      if (result) {
        setFastData(result);
      } else {
        storeData('fastData', []);
      }
    });

    getData('fastName').then(result => {
      if (result) {
        setFastName(result);
      } else {
        storeData('fastName', '16:8 Intermittent');
      }
    });

    getData('fastLength').then(result => {
      if (result) {
        setFastLength(parseInt(result));
      } else {
        storeData('fastLength', (16 * 60 * 60 * 1000));
      }
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
    setFastData([...fastData, fast].sort((a, b) => { 
      return new Date(a.startTime) < new Date(b.startTime)
    }));
    storeData('fastData', [...fastData, fast].sort((a, b) => { 
      return new Date(a.startTime) < new Date(b.startTime)
    }));
  }

  const updateFastData = (fast) => {
    const index = fastData.indexOf(fast);
    fastData.splice(index, 1, fast);
    storeData('fastData', fastData);
    setFastData(fastData);
  }

  const deleteFastData = (fast) => {
    const fastDataCopy = fastData.slice();
    const index = fastData.indexOf(fast);
    fastDataCopy.splice(index, 1);
    storeData('fastData', fastDataCopy);
    setFastData(fastDataCopy);
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
            onDeleteFastData={ (deletedFastData) => deleteFastData(deletedFastData) }
            fastData={ fastData }
          />
        ) }        
        { currentView == 'stats' && (
          <Stats
            fastData={ fastData }
          />
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
