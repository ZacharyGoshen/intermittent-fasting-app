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
  const [currentTime, setCurrentTime] = useState(new Date());

  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [dateTimePickerMode, setDateTimePickerMode] = useState('');

  useEffect(() => {
    getData('currentFastStartTime').then(result => {
      setCurrentFastStartTime(new Date(result));
      setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
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

  return (
      <SafeAreaView style={ styles.mainContainer }>
          <Text style={ styles.currentFastHeader }>Current Fast</Text>
          <View style={ styles.currentFastStartTimeContainer }>
            <Text style={ styles.currentFastStartTimeText }>Started on </Text>
            <Text 
              onPress={ () => { 
                setDateTimePickerMode('date');
                setShowDateTimePicker(!showDateTimePicker);
              } }
              style={ styles.currentFastStartTimeButton }
            >
              { new Date(currentFastStartTime).toLocaleDateString() }
            </Text>
            <Text style={ styles.currentFastStartTimeText }> at </Text>
            <Text 
              onPress={ () => { 
                setDateTimePickerMode('time');
                setShowDateTimePicker(!showDateTimePicker);
              } }
              style={ styles.currentFastStartTimeButton }
            >
              { new Date(currentFastStartTime).toLocaleTimeString() }
            </Text>
          </View>
          <Text style={ styles.currentFastTime }>
            { calculateTimeDifference(currentFastStartTime.getTime(), currentTime.getTime()) }
          </Text>
          { showDateTimePicker && (
              <DateTimePicker
                value={ currentFastStartTime }
                mode={ dateTimePickerMode }
                is24Hour={true}
                display="spinner"
                onChange={ onDateTimePickerChange }
              />
          )}
          <ProgressCircle
            backgroundThickness = { 10 }
            circleDiameter={ 350 }  
            foregroundThickness={ 20 }
            percent={ 30 }
          />
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  currentFastHeader: {
    fontSize: 40
  },
  currentFastStartTimeButton: {
    color: 'blue',
    fontSize: 20
  },
  currentFastStartTimeContainer: {
    flexDirection: 'row',
    fontSize: 20
  },
  currentFastStartTimeText: {
    fontSize: 20
  },
  currentFastTime: {
    fontSize: 40
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
