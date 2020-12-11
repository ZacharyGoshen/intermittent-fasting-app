import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    ScrollView,
    FlatList
} from 'react-native';
import Fasts from './Fasts';
import { 
    getData, 
    storeData, 
    calculateTimeDifference, 
    dateToShortFormat, 
    timeToShortFormat
} from './Utils'

const History = (props) => {
    const fastData = props.fastData;

    return (
        <View style={ styles.mainContainer }>
            { fastData.length == 0 && (
                <Text style={ styles.noHistoryMessage }>You Haven't Fasted Yet.</Text>
            ) }
            { fastData.length > 0 && (
                <FlatList
                    data={ fastData }
                    renderItem={ ({item}) => 
                        <View style={ styles.fastContainer }>
                            <Text style={ styles.fastName }>{ item.name }</Text>
                            <View style={ styles.firstRow }>
                                <Text style={ styles.timeFasted }>
                                    { calculateTimeDifference(new Date(item.startTime).getTime(), new Date(item.endTime).getTime()) }
                                </Text>
                                <Text style={ styles.goalDuration }>
                                    { 
                                        Math.round(
                                            100 * (new Date(item.endTime).getTime() - new Date(item.startTime).getTime()) / item.duration
                                        ) + '%' 
                                    }
                                </Text>
                            </View>
                            <View style={ styles.secondRow }>
                                <Text style={ styles.startTime }>{ 'Started ' + dateToShortFormat(new Date(item.startTime)) + ' at ' + timeToShortFormat(new Date(item.startTime)) }</Text>
                                <Text style={ styles.endTime }>{ 'Ended ' + dateToShortFormat(new Date(item.endTime)) + ' at ' + timeToShortFormat(new Date(item.endTime)) }</Text>
                            </View>
                        </View>
                    }
                >
                </FlatList>
            ) }
        </View>
    );
}

const styles = StyleSheet.create({
    endTime: {
        color: 'gray'
    },
    fastContainer: {
        borderBottomColor: '#f0f0f0',
        borderBottomWidth: 2,
        padding: 10
    },
    fastName: {
        color: '#4ee7ff',
        fontWeight: 'bold'
    },  
    firstRow: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    goalDuration: {
        color: 'gray',
        fontWeight: 'bold',
        fontSize: 20
    },
    mainContainer: {
        alignItems: 'stretch',
        flex: 1,
        justifyContent: 'center'
    },
    noHistoryMessage: {
        alignSelf: 'center',
        fontSize: 20,
        fontWeight: 'bold'
    },
    secondRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    startTime: {
        color: 'gray'
    },
    timeFasted: {
        fontSize: 40
    }
});

export default History;