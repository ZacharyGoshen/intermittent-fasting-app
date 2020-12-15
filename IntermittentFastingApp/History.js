import React, { useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    FlatList,
    TouchableOpacity
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { 
    calculateTimeDifference, 
    dateToShortFormat, 
    timeToShortFormat
} from './Utils'

const History = (props) => {
    const [fastData, setFastData] = useState(props.fastData);
    const [showDateTimePicker, setShowDateTimePicker] = useState(false);
    const [dateTimePickerMode, setDateTimePickerMode] = useState('date');
    const [dateTimePickerValue, setDateTimePickerValue] = useState(new Date());
    const [selectedFastKey, setSelectedFastKey] = useState(null);
    const [selectedFastProperty, setSelectedFastProperty] = useState(null);

    const isTimeValid = (time, key) => {
        let selectedFastIndex = null;
        let i = 0;
    
        while (selectedFastIndex == null) {
            if (fastData[i].key == key) {
                selectedFastIndex = i;
            } else {
                i++;
            }
        }
    
        const latestPossibleStartTime = (selectedFastIndex != fastData.length - 1) ? new Date(fastData[selectedFastIndex + 1].endTime) : null;
        const earliestPossibleEndTime = (selectedFastIndex != 0) ? new Date(fastData[selectedFastIndex - 1].startTime) : null;
    
        if (latestPossibleStartTime && time <= latestPossibleStartTime) {
            return false;
        }
    
        if (earliestPossibleEndTime && time >= earliestPossibleEndTime) {
            return false;
        }
    
        return true;
    }

    const onDateTimePickerSubmit = () => {
        const date = dateTimePickerValue;
        let fast = fastData.filter(fast => fast.key == selectedFastKey)[0];

        if (!isTimeValid(date, selectedFastKey)) {
            alert('You already recorded a fast during that time.');
        } else if (dateTimePickerMode == 'date') {
            onFastDateChange(fast, date);
        } else if (dateTimePickerMode == 'time') {
            onFastTimeChange(fast, date);
        }

        setShowDateTimePicker(false);
    }

    const onFastDateChange = (fast, newDate) => {
        const year = newDate.getFullYear();
        const month = newDate.getMonth();
        const day = newDate.getDate();
        const hours = new Date(fast[selectedFastProperty]).getHours();
        const minutes = new Date(fast[selectedFastProperty]).getMinutes();
        const seconds = new Date(fast[selectedFastProperty]).getSeconds();
        const updatedDate = new Date(year, month, day, hours, minutes, seconds);

        if (updatedDate > new Date()) {
            alert('Date can not be in the future.');
        } else if (selectedFastProperty == 'startTime' && updatedDate > new Date(fast.endTime) ) {
            alert('Starting date can\'t be after the ending date.');
        } else if (selectedFastProperty == 'endTime' && updatedDate < new Date(fast.startTime) ) {
            alert('Ending date can\'t be before the starting date.');
        } else {
            fast[selectedFastProperty] = updatedDate.toUTCString();
            props.onUpdateFastData(fast);
        }
    }

    const onFastTimeChange = (fast, newTime) => {
        const year = new Date(fast[selectedFastProperty]).getFullYear();
        const month = new Date(fast[selectedFastProperty]).getMonth();
        const day = new Date(fast[selectedFastProperty]).getDate();
        const hours = newTime.getHours();
        const minutes = newTime.getMinutes();
        const seconds = newTime.getSeconds();
        const updatedTime = new Date(year, month, day, hours, minutes, seconds);

        if (updatedTime > new Date()) {
            alert('Time can not be in the future.');
        } else if (selectedFastProperty == 'startTime' && updatedTime > new Date(fast.endTime) ) {
            alert('Starting time can\'t be after the ending time.');
        }  else if (selectedFastProperty == 'endTime' && updatedTime < new Date(fast.startTime) ) {
            alert('Ending time can\'t be before the starting time.');
        } else {
            fast[selectedFastProperty] = updatedTime.toUTCString();
            props.onUpdateFastData(fast);
        }
    }

    const calculatePercentageStyles = (percent) => {
        if (percent >= 100) {
            return {
                color: '#4ee7ff'
            }
        } else {
            return {
                color: 'gray'
            }
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
                        data={ fastData }
                        renderItem={ ({item, index}) => 
                            <Swipeable 
                                renderRightActions={ () => 
                                    <TouchableOpacity
                                        style={ styles.deleteButton }
                                        onPress={ () => { 
                                            props.onDeleteFastData(item); 
                                            const fastDataCopy = fastData.slice();
                                            fastDataCopy.splice(index, 1);
                                            setFastData(fastDataCopy);
                                        } }
                                    >
                                        <Text style={ styles.deleteButtonText }>Delete</Text>
                                    </TouchableOpacity>
                                }
                            >
                                <View style={ styles.fastContainer } >
                                    <Text style={ styles.fastName }>{ item.name }</Text>
                                    <View style={ styles.firstRow }>
                                        <Text style={ styles.timeFasted }>
                                            { calculateTimeDifference(new Date(item.startTime).getTime(), new Date(item.endTime).getTime()) }
                                        </Text>
                                        <Text style={ [styles.percentage, calculatePercentageStyles(100 * (new Date(item.endTime).getTime() - new Date(item.startTime).getTime()) / item.duration)] }>
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
                                                    setShowDateTimePicker(true);
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
                                                    setShowDateTimePicker(true);
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
                            </Swipeable>
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
    deleteButton: {
        backgroundColor: '#ff644d',
        justifyContent: 'center'
    },
    deleteButtonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        margin: 10,
    },
    fastContainer: {
        backgroundColor: 'white',
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
    percentage: {
        color: 'gray',
        fontWeight: 'bold',
        fontSize: 20
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