import React, { useEffect, useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import ProgressCircle from './ProgressCircle';
import { 
    getData, 
    storeData, 
    calculateTimeDifference, 
    dateToShortFormat, 
    timeToShortFormat
} from './Utils'

const Timer = (props) => {
    const [currentFastStartTime, setCurrentFastStartTime] = useState(new Date());
    const [isFasting, setIsFasting] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showDateTimePicker, setShowDateTimePicker] = useState(false);
    const [dateTimePickerMode, setDateTimePickerMode] = useState('');
    const [dateTimePickerValue, setDateTimePickerValue] = useState(new Date());

    const onPressFastName = props.onPressFastName;
    const onUpdateFastData = props.onUpdateFastData;
    const fastName = props.fastName;
    const fastLength = props.fastLength;

    useEffect(() => {
        let interval = null;
        let mounted = true;

        getData('currentFastStartTime').then(result => {
            if (result) {
                setCurrentFastStartTime(new Date(result));
                setIsFasting(true);
            }

            interval = setInterval(() => {
                if (mounted) {
                    setCurrentTime(new Date());
                } else {
                    clearInterval(interval);
                }
            }, 1000);
        });

        return () => { mounted = false };
    }, []);

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

        setShowDateTimePicker(false);
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

        setShowDateTimePicker(false);
    }

    const startFast = () => {
        setIsFasting(true);
        setCurrentFastStartTime(new Date());
        storeData('currentFastStartTime', currentFastStartTime.toUTCString());
    }

    const endFast = () => {
        setIsFasting(false);
        onUpdateFastData({
            key: currentFastStartTime.getTime().toString(),
            name: fastName,
            duration: fastLength,
            startTime: currentFastStartTime.toUTCString(),
            endTime: currentTime.toUTCString()
        });
        storeData('currentFastStartTime', null);
    }

    return (
        <>
            <ScrollView contentContainerStyle={ styles.mainContainer }>
                <Text style={ styles.isFastingMessage }>
                    { isFasting ? 'You\'re Fasting!' : 'You\'re Not Fasting.' }
                </Text>
                { isFasting && (
                    <>
                        <TouchableOpacity 
                            onPress={ onPressFastName }
                            style={ styles.fastNameButton }
                        >
                            <Text 
                                style={ styles.fastNameButtonText }
                            >
                                { fastName + ' Fast' }
                            </Text>
                        </TouchableOpacity>
                        <ProgressCircle
                            backgroundThickness = { 10 }
                            circleDiameter={ 350 }  
                            foregroundThickness={ 40 }
                            percent={ Math.round(100 * ((currentTime.getTime() - currentFastStartTime.getTime()) / fastLength)) }
                            timeElapsed={ calculateTimeDifference(currentFastStartTime.getTime(), currentTime.getTime()) }
                            timeRemaining={ calculateTimeDifference(currentTime.getTime(), (currentFastStartTime.getTime() + fastLength)) }
                        />
                    </>
                ) }
                <TouchableOpacity
                    onPress={ isFasting ? endFast : startFast }
                    style={ styles.isFastingButton }
                >
                    <Text style={ styles.isFastingButtonText }>{ isFasting ? 'End Fast' : 'Start Fast' }</Text>
                </TouchableOpacity>
                { isFasting && (
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
                                { timeToShortFormat(currentFastStartTime) }
                            </Text>
                        </View>
                        </View>
                        <View style={ styles.fastEndTimeContainer }>
                        <Text style={ styles.fastTimesHeader }>FAST ENDING</Text>
                        <View style={ styles.fastTimesValue }>
                            <Text>
                            { dateToShortFormat(new Date(currentFastStartTime.getTime() + fastLength)) + ', ' }
                            </Text>
                            <Text>
                            { timeToShortFormat(new Date(currentFastStartTime.getTime() + fastLength)) }
                            </Text>
                        </View>
                        </View>
                    </View>
                ) }
            </ScrollView>
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
                            onPress={ () => { 
                                if (dateTimePickerMode == 'date') {
                                onCurrentFastStartDateChange(dateTimePickerValue);
                                } else if (dateTimePickerMode == 'time') {
                                onCurrentFastStartTimeChange(dateTimePickerValue);
                                }
                            } }
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
    fastNameButton: {
        backgroundColor: 'white',
        borderColor: '#f0f0f0',
        borderRadius: 20,
        borderWidth: 2,
        marginBottom: 20,
        paddingBottom: 10,
        paddingLeft: 40,
        paddingRight: 40,
        paddingTop: 10,
        zIndex: 1
    },
    fastNameButtonText: {
        color: '#4ee7ff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    fastEndTimeContainer: {    
        alignItems: 'center',
        display: 'flex'
    },
    fastStartTimeContainer: {
        alignItems: 'center',
        display: 'flex'
    },
    fastTimeButton: {
        color: '#4ee7ff',
    },
    fastTimeSentence: {
        flexDirection: 'row',
    },
    fastTimesContainer: {
        alignSelf: 'stretch',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
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
        borderColor: '#f0f0f0',
        borderRadius: 20,
        borderWidth: 2,
        marginBottom: 40,
        marginTop: 20,
        paddingBottom: 10,
        paddingLeft: 40,
        paddingRight: 40,
        paddingTop: 10,
    },
    isFastingButtonText: {
        color: '#4ee7ff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    isFastingMessage: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: 20
    },
    mainContainer: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center'
    }
});
  
export default Timer;