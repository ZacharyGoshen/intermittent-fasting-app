import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    ScrollView
} from 'react-native';

const Stats = () => {
    return (
        <ScrollView contentContainerStyle={ styles.mainContainer }>
            <Text>Stats</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center'
    }
});

export default Stats;