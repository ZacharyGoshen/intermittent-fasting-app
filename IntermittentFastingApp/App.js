/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TextInput,
  Button
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

import ProgressCircle from './ProgressCircle';

const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    const value = jsonValue != null ? JSON.parse(jsonValue) : null;
    return value;
  } catch (e) {
    alert('Failed to fetch the data from storage')
  }
}

const storeData = async (key, value, callback) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    alert('Failed to save the data to the storage')
  }
}

const calculateTimeDifference = (startTime, endTime) => {
  let seconds = Math.round((endTime - startTime) / 1000);

  const hours = Math.floor(seconds / 3600);
  seconds -= hours * 3600;

  const minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;

  return `${hours}h ${minutes}m ${seconds}s`;
}

const App = () => {
  const [currentFastStartTime, setCurrentFastStartTime] = useState(new Date());
  const [isFasting, setIsFasting] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [fastLength, setFastLength] = useState(8 * 60 * 60 * 1000);

  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [dateTimePickerMode, setDateTimePickerMode] = useState('');

  useEffect(() => {
    getData('currentFastStartTime').then(result => {
      if (result) {
        setCurrentFastStartTime(new Date(result));
        setIsFasting(true);
        setInterval(() => {
          setCurrentTime(new Date());
        }, 1000);
      }
    });
  }, []);

  const onDateTimePickerChange = (event, value) => {
    if (dateTimePickerMode == 'date') {
      onCurrentFastStartDateChange(value);
    } else if (dateTimePickerMode == 'time') {
      onCurrentFastStartTimeChange(value);
    }
  }

  const onCurrentFastStartDateChange = (value) => {
    if (!value) return;

    const year = value.getFullYear();
    const month = value.getMonth();
    const day = value.getDate();
    const hours = currentFastStartTime.getHours();
    const minutes = currentFastStartTime.getMinutes();
    const seconds = currentFastStartTime.getSeconds();

    if (new Date(year, month, day, hours, minutes, seconds).getTime() > currentTime) {
      alert('Invalid starting date.');
    } else {
      setCurrentFastStartTime(new Date(year, month, day, hours, minutes, seconds));
      storeData('currentFastStartTime', new Date(year, month, day, hours, minutes, seconds).toUTCString());
    }
  }

  const onCurrentFastStartTimeChange = (value) => {
    if (!value) return;

    const year = currentFastStartTime.getFullYear();
    const month = currentFastStartTime.getMonth();
    const day = currentFastStartTime.getDate();
    const hours = value.getHours();
    const minutes = value.getMinutes();
    const seconds = value.getSeconds();

    if (new Date(year, month, day, hours, minutes, seconds).getTime() > currentTime) {
      alert('Invalid starting time.');
    } else {
      setCurrentFastStartTime(new Date(year, month, day, hours, minutes, seconds));
      storeData('currentFastStartTime', new Date(year, month, day, hours, minutes, seconds).toUTCString());
    }
  }

  const startFast = () => {
    setIsFasting(true);
    setCurrentFastStartTime(new Date());
    storeData('currentFastStartTime', currentFastStartTime.toUTCString());
  }

  const endFast = () => {
    setIsFasting(false);
  }

  return (
    <>
      <SafeAreaView style={ styles.mainContainer }>
        <Text>{ isFasting ? 'You\'re Fasting!' : 'You\'re Not Fasting.' }</Text>
        { isFasting && (
          <ProgressCircle
            backgroundThickness = { 10 }
            circleDiameter={ 350 }  
            foregroundThickness={ 20 }
            percent={ Math.round(100 * ((currentTime.getTime() - currentFastStartTime.getTime()) / fastLength)) }
            time={ calculateTimeDifference(currentFastStartTime.getTime(), currentTime.getTime()) }
          />
        ) }
        <Button
          title={ isFasting ? 'End fast' : 'Start fast' }
          onPress={ isFasting ? endFast : startFast }
        >
        </Button>
        { isFasting && (
          <View>
            <View style={ styles.fastTimeSentence }>
              <Text>Started on </Text>
              <Text 
                onPress={ () => { 
                  setDateTimePickerMode('date');
                  setShowDateTimePicker(!showDateTimePicker);
                } }
                style={ styles.fastTimeButton }
              >
                { currentFastStartTime.toLocaleDateString() }
              </Text>
              <Text> at </Text>
              <Text 
                onPress={ () => { 
                  setDateTimePickerMode('time');
                  setShowDateTimePicker(!showDateTimePicker);
                } }
                style={ styles.fastTimeButton }
              >
                { currentFastStartTime.toLocaleTimeString() }
              </Text>
            </View>
            <View style={ styles.fastTimeSentence }>
              <Text>Ends on </Text>
              <Text>
                { new Date(currentFastStartTime.getTime() + fastLength).toLocaleDateString() }
              </Text>
              <Text> at </Text>
              <Text 
                onPress={ () => { 
                  setDateTimePickerMode('time');
                  setShowDateTimePicker(!showDateTimePicker);
                } }
              >
                { new Date(currentFastStartTime.getTime() + fastLength).toLocaleTimeString() }
              </Text>
            </View>
          </View>
        ) }
      </SafeAreaView>
      { showDateTimePicker && (
        <DateTimePicker
          value={ currentFastStartTime }
          mode={ dateTimePickerMode }
          is24Hour={true}
          display="spinner"
          onChange={ onDateTimePickerChange }
        />
      ) }
    </>
  );
};

const styles = StyleSheet.create({
  fastTimeButton: {
    color: 'blue',
  },
  fastTimeSentence: {
    flexDirection: 'row',
  },
  mainContainer: {
    alignItems: 'center',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  }
});

export default App;
