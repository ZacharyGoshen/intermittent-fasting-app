import React, { useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    FlatList
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { 
    calculateTimeDifference, 
    dateToShortFormat, 
    timeToShortFormat
} from './Utils'

const History = (props) => {
    const [showDateTimePicker, setShowDateTimePicker] = useState(false);
    const [dateTimePickerMode, setDateTimePickerMode] = useState('date');
    const [dateTimePickerValue, setDateTimePickerValue] = useState(new Date());
    const [selectedFastKey, setSelectedFastKey] = useState(null);
    const [selectedFastProperty, setSelectedFastProperty] = useState(null);

    const fastData = props.fastData;

    const onDateTimePickerSubmit = () => {
        const value = dateTimePickerValue;
        let fastToUpdate = fastData.filter(fast => fast.key == selectedFastKey)[0];

        if (!value) { 
            setShowDateTimePicker(false); 
        } else if (dateTimePickerMode == 'date') {
            const year = value.getFullYear();
            const month = value.getMonth();
            const day = value.getDate();
            const hours = new Date(fastToUpdate[selectedFastProperty]).getHours();
            const minutes = new Date(fastToUpdate[selectedFastProperty]).getMinutes();
            const seconds = new Date(fastToUpdate[selectedFastProperty]).getSeconds();
    
            if (new Date(year, month, day, hours, minutes, seconds).getTime() > new Date().getTime()) {
                alert('Invalid starting date.');
            } else {
                fastToUpdate[selectedFastProperty] = new Date(year, month, day, hours, minutes, seconds).toUTCString();
                props.onUpdateFastData(fastToUpdate);
            }
    
            setShowDateTimePicker(false);
        } else if (dateTimePickerMode == 'time') {
            const year = new Date(fastToUpdate[selectedFastProperty]).getFullYear();
            const month = new Date(fastToUpdate[selectedFastProperty]).getMonth();
            const day = new Date(fastToUpdate[selectedFastProperty]).getDate();
            const hours = value.getHours();
            const minutes = value.getMinutes();
            const seconds = value.getSeconds();
    
            if (new Date(year, month, day, hours, minutes, seconds).getTime() > new Date().getTime()) {
                alert('Invalid starting time.');
            } else {
                fastToUpdate[selectedFastProperty] = new Date(year, month, day, hours, minutes, seconds).toUTCString();
                props.onUpdateFastData(fastToUpdate);
            }
    
            setShowDateTimePicker(false);
        }
    }

    return (
        <>
            <View style={ styles.mainContainer }>
                { fastData.length == 0 && (
                    <Text style={ styles.noHistoryMessage }>You Haven't Fasted Yet.</Text>
                ) }
                { fastData.length > 0 && (
                    <FlatList
                        data={ 
                            fastData.sort((a, b) => { return new Date(a.startTime) < new Date(b.startTime) }) 
                        }
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
                                    <View style={ styles.flexRow }>
                                        <Text style={ styles.grayText }>Started </Text>
                                        <Text 
                                            style={ styles.pressableText }
                                            onPress={ () => { 
                                                setDateTimePickerMode('date');
                                                setDateTimePickerValue(new Date(item.startTime));
                                                setSelectedFastKey(item.key);
                                                setSelectedFastProperty('startTime');
                                                setShowDateTimePicker(!showDateTimePicker);
                                            } }
                                        >
                                            { dateToShortFormat(new Date(item.startTime)) }
                                        </Text>
                                        <Text style={ styles.grayText }> at </Text>
                                        <Text 
                                            style={ styles.pressableText }
                                            onPress={ () => { 
                                                setDateTimePickerMode('time');
                                                setDateTimePickerValue(new Date(item.startTime));
                                                setSelectedFastKey(item.key);
                                                setSelectedFastProperty('startTime');
                                                setShowDateTimePicker(!showDateTimePicker);
                                            } }
                                        >
                                            { timeToShortFormat(new Date(item.startTime)) }
                                        </Text>
                                    </View>
                                    <View style={ styles.flexRow }>
                                        <Text style={ styles.grayText }>Ended </Text>
                                        <Text 
                                            style={ styles.pressableText }
                                            onPress={ () => { 
                                                setDateTimePickerMode('date');
                                                setDateTimePickerValue(new Date(item.endTime));
                                                setSelectedFastKey(item.key);
                                                setSelectedFastProperty('endTime');
                                                setShowDateTimePicker(!showDateTimePicker);
                                            } }
                                        >
                                            { dateToShortFormat(new Date(item.endTime)) }
                                        </Text>
                                        <Text style={ styles.grayText }> at </Text>
                                        <Text 
                                            style={ styles.pressableText }
                                            onPress={ () => { 
                                                setDateTimePickerMode('time');
                                                setDateTimePickerValue(new Date(item.endTime));
                                                setSelectedFastKey(item.key);
                                                setSelectedFastProperty('endTime');
                                                setShowDateTimePicker(!showDateTimePicker);
                                            } }
                                        >
                                            { timeToShortFormat(new Date(item.endTime)) }
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        }
                    >
                    </FlatList>
                ) }
            </View>
            { showDateTimePicker && (
                <View style={ styles.dateTimePickerContainer }>
                    <DateTimePicker
                        value={ dateTimePickerValue }
                        mode={ dateTimePickerMode }
                        is24Hour={true}
                        display="spinner"
                        onChange={ (event, value) => setDateTimePickerValue(value) }
                    />
                    <View style={ styles.dateTimePickerButtons }>
                        <Text 
                            style={ styles.dateTimePickerButton }
                            onPress={ onDateTimePickerSubmit }
                        >
                            { 'Set ' + dateTimePickerMode[0].toUpperCase() + dateTimePickerMode.slice(1) }
                        </Text>
                        <Text 
                            style={ styles.dateTimePickerButton }
                            onPress={ () => setShowDateTimePicker(false) }
                        >
                            Cancel
                        </Text>
                    </View>
                </View>
            ) }
        </>
    );
}

const styles = StyleSheet.create({
    dateTimePickerButtons: {
        borderColor: '#f0f0f0',
        borderTopWidth: 2,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        left: 0,
        right: 0
    },
    dateTimePickerButton: {
        backgroundColor: 'white',
        color: '#4ee7ff',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: 20
    },
    dateTimePickerContainer: {
        backgroundColor: 'white',
        borderColor: '#f0f0f0',
        borderTopWidth: 2,
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
    flexRow: {
        display: 'flex',
        flexDirection: 'row'
    },
    goalDuration: {
        color: 'gray',
        fontWeight: 'bold',
        fontSize: 20
    },
    grayText: {
        color: 'gray'
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
    pressableText: {
        color: '#4ee7ff'
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