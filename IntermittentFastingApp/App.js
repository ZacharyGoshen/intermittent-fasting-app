/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  return (
      <SafeAreaView>
        <ScrollView>
          <Text>Some text</Text>
        </ScrollView>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({

});

export default App;
