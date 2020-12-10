import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    ScrollView
} from 'react-native';

const History = () => {
    return (
        <ScrollView contentContainerStyle={ styles.mainContainer }>
            <Text>History</Text>
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

export default History;