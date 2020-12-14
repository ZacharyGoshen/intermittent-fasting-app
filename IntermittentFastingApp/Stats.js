import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { act } from 'react-test-renderer';
import { 
    dateToShortFormat, 
} from './Utils'

const Stats = (props) => {
    const fastData = props.fastData;
    const dayBarMaxHeight = 200;
    const maxFastLength = 24 * 60 * 60 * 1000;

    const calculateDayBarOuterStyles = (goalLength) => {
        const height = dayBarMaxHeight * (goalLength / maxFastLength);
        return {
            height: height
        }
    }

    const calculateDayBarInnerStyles = (goalLength, actualLength) => {
        const height = dayBarMaxHeight * (actualLength / maxFastLength);
        return {
            height: height
        };
    }

    const renderDayBars = () => {
        const fasts = fastData.sort((a, b) => new Date(a.startTime) < new Date(b.startTime));
        const currentTime = new Date().getTime();

        let days = [];
        for (let i = 0; i < 7; i++) {
            const offset = (i + 1) * 24 * 60 * 60 * 1000;

            const dayStartTime = new Date(currentTime - offset).setHours(0, 0, 0, 0);
            const dayEndTime = dayStartTime + (24 * 60 * 60 * 1000) - 1;
            const dateString = new Intl.DateTimeFormat('en', { month: 'short', day: '2-digit' }).format(new Date(dayStartTime));

            let timeFasted = 0;
            let timeFailed = 0;
            fasts.forEach(fast => {
                const fastStartTime = new Date(fast.startTime).getTime();
                const fastEndTime = new Date(fast.endTime).getTime();
                const goalEndTime = fastStartTime + fast.duration;             

                if (!(fastEndTime < dayStartTime || fastStartTime > dayEndTime)) {
                    if (fastStartTime >= dayStartTime && fastEndTime <= dayEndTime) {
                        timeFasted += (fastEndTime - fastStartTime);
                    } else if (fastStartTime >= dayStartTime) {
                        timeFasted += (dayEndTime - fastStartTime);
                    } else if (fastEndTime <= dayEndTime) {
                        timeFasted += (fastEndTime - dayStartTime);
                    } else {
                        timeFasted += (24 * 60 * 60 * 1000);
                    }
                }

                if (!(goalEndTime < dayStartTime || fastEndTime > dayEndTime || fastEndTime >= goalEndTime)) {
                    if (fastEndTime >= dayStartTime && goalEndTime <= dayEndTime) {
                        timeFailed += (goalEndTime - fastEndTime);
                    } else if (fastEndTime >= dayStartTime) {
                        timeFailed += (dayEndTime - fastEndTime);
                    } else if (goalEndTime <= dayEndTime) {
                        timeFailed += (goalEndTime - dayStartTime);
                    } else {
                        timeFailed += (24 * 60 * 60 * 1000);
                    }
                }
            });

            days.push({
                dateString: dateString,
                dayStartTime: new Date(dayStartTime).toString(),
                dayEndTime: new Date(dayEndTime).toString(),
                timeFasted: timeFasted,
                timeFailed: timeFailed
            });
        }

        let dayBars = [];
        days.forEach(day => dayBars.push(renderDayBar(day)));

        const averageHours = days.reduce((accumulator, day) => {
            return accumulator + (day.timeFasted / (7 * 60 * 60 * 1000));
        }, 0);

        return (
            <View style={ styles.weekGraph }>
                <View style={ styles.weekGraphHeader }>
                    <View>
                        <Text style={ styles.averageHoursHeader }>Average</Text>
                        <Text style={ styles.averageHoursValue }>{ averageHours.toString().slice(0, 4) + 'h' }</Text>
                    </View>
                    <Text style={ styles.dateRange }>{ days[6].dateString + ' - ' + days[0].dateString }</Text>
                </View>
                <View style={ styles.dayBarsContainer }>
                    { dayBars }
                </View>
            </View>
        );
    }

    const renderDayBar = (day) => {
        const goalFastLength = Math.min((day.timeFasted + day.timeFailed), (24 * 60 * 60 * 1000));
        const actualFastLength = day.timeFasted;
        const hours = Math.round(actualFastLength / (60 * 60 * 1000));

        return (
            <View 
                key={ day.dateString }
                style={ styles.dayBar }
            >
                <Text style={ styles.dayBarHours }>{ hours + 'h' }</Text>
                { ((actualFastLength > 0) || (goalFastLength > 0)) && (
                    <View style={ [styles.dayBarOuter, calculateDayBarOuterStyles(goalFastLength)] }>
                        <View style={ [styles.dayBarInner, calculateDayBarInnerStyles(goalFastLength, actualFastLength)] }></View>
                    </View>
                ) }
                <Text style={ styles.dayBarDate }>{ day.dateString }</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={ styles.mainContainer }>
            { renderDayBars() }
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    averageHoursHeader: {
        color: 'gray'
    },
    averageHoursValue: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    dateRange: {
        fontWeight: 'bold'
    },
    dayBar: {
        alignItems: 'center'
    },  
    dayBarDate: {
        fontSize: 12,
        marginTop: 20
    },
    dayBarHours: {
        color: 'gray',
        fontSize: 12
    },
    dayBarInner: {
        backgroundColor: '#4ee7ff',
        borderRadius: 5,
        width: 10
    },
    dayBarOuter: {
        backgroundColor: 'gray',
        borderRadius: 5,
        height: 200,
        justifyContent: 'flex-end',
        marginTop: 20
    },
    dayBarsContainer: {
        alignItems: 'flex-end',
        flexDirection: 'row-reverse',
        justifyContent: 'space-evenly'
    },
    mainContainer: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center'
    },
    weekGraph: {
        alignSelf: 'stretch',   
        borderColor: '#f0f0f0',
        borderRadius: 20,
        borderWidth: 2,
        margin: 20,
        padding: 20
    },
    weekGraphHeader: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20
    }
});

export default Stats;