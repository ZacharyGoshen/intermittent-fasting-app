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

  return `${hours}:${('0' + minutes).slice(-2)}:${('0' + seconds).slice(-2)}`;
}

const dateToShortFormat = (date) => {
  const month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
  const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
  return `${month} ${day}`;
}

const timeToShortFormat = (time) => {
  return new Intl.DateTimeFormat('en', { timeStyle: "short" }).format(time);
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
        <Text style={ styles.isFastingMessage }>{
         isFasting ? 'You\'re Fasting!' : 'You\'re Not Fasting.' }
        </Text>
        { isFasting && (
          <ProgressCircle
            backgroundThickness = { 10 }
            circleDiameter={ 350 }  
            foregroundThickness={ 40 }
            percent={ Math.round(100 * ((currentTime.getTime() - currentFastStartTime.getTime()) / fastLength)) }
            time={ calculateTimeDifference(currentFastStartTime.getTime(), currentTime.getTime()) }
          />
        ) }
        <Text
          onPress={ isFasting ? endFast : startFast }
          style={ styles.isFastingButton }
        >
          { isFasting ? 'End fast' : 'Start fast' }
        </Text>
        { isFasting && (
          <View>
            <View style={ styles.fastTimesContainer }>
              <View style={ styles.fastStartTimeContainer }>
                <Text style={ styles.fastTimesHeader }>STARTED FASTING</Text>
                <View style={ styles.fastTimesValue }>
                  <Text 
                    onPress={ () => { 
                      setDateTimePickerMode('date');
                      setShowDateTimePicker(!showDateTimePicker);
                    } }
                    style={ styles.fastTimeButton }
                  >
                    { dateToShortFormat(currentFastStartTime) + ', ' }
                  </Text>
                  <Text 
                    onPress={ () => { 
                      setDateTimePickerMode('time');
                      setShowDateTimePicker(!showDateTimePicker);
                    } }
                    style={ styles.fastTimeButton }
                  >
                    { new Date(currentFastStartTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }
                  </Text>
                </View>
              </View>
              <View style={ styles.fastEndTimeContainer }>
                <Text style={ styles.fastTimesHeader }>FAST ENDING</Text>
                <View style={ styles.fastTimesValue }>
                  <Text>
                    { dateToShortFormat(currentFastStartTime.getTime() + fastLength) + ', ' }
                  </Text>
                  <Text>
                    { new Date(currentFastStartTime.getTime() + fastLength).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }
                  </Text>
                </View>
              </View>
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
  fastEndTimeContainer: {    
    alignItems: 'center',
    display: 'flex',
    marginLeft: 40
  },
  fastStartTimeContainer: {
    alignItems: 'center',
    display: 'flex',
    marginRight: 40
  },
  fastTimeButton: {
    color: '#4ee7ff',
  },
  fastTimeSentence: {
    flexDirection: 'row',
  },
  fastTimesContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  fastTimesHeader: {
    color: 'gray',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10
  },
  fastTimesValue: {
    display: 'flex',
    flexDirection: 'row',
  },
  isFastingButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    color: '#4ee7ff',
    elevation: 1,
    fontSize: 20,
    marginBottom: 40,
    marginTop: 20,
    overflow: 'hidden',
    paddingBottom: 10,
    paddingLeft: 40,
    paddingRight: 40,
    paddingTop: 10,
  },
  isFastingMessage: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20
  },
  mainContainer: {
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  }
});

export default App;
