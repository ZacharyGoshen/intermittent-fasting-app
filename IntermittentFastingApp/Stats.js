import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { 
    calculateTimeDifference
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

    const calculateDayBarInnerStyles = (actualLength, goalReached) => {
        const height = dayBarMaxHeight * (actualLength / maxFastLength);
        const backgroundColor = goalReached ? '#4ee7ff' : 'gray';
        return {
            backgroundColor: backgroundColor,
            height: height
        };
    }

    const renderWeekGraph = () => {
        const fasts = fastData;
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
        days.forEach((day, index) => dayBars.push(renderDayBar(day, index)));

        const averageHours = days.reduce((accumulator, day) => {
            return accumulator + (day.timeFasted / (7 * 60 * 60 * 1000));
        }, 0);

        return (
            <View style={ styles.weekGraph }>
                <View style={ styles.weekGraphHeader }>
                    <View>
                        <Text style={ styles.averageHoursHeader }>Average</Text>
                        <Text style={ styles.averageHoursValue }>{ (Math.round(averageHours * 10) / 10) + 'h' }</Text>
                    </View>
                    <Text style={ styles.dateRange }>{ days[6].dateString + ' - ' + days[0].dateString }</Text>
                </View>
                <View style={ styles.dayBarsContainer }>
                    { dayBars }
                    <View style={ styles.axisLabels }>
                        <Text style={ styles.axisLabel }>24</Text>
                        <Text style={ styles.axisLabel }>18</Text>
                        <Text style={ styles.axisLabel }>12</Text>
                        <Text style={ styles.axisLabel }>6</Text>
                        <Text style={ styles.axisLabel }>0</Text>
                    </View>
                </View>
                <View style={ styles.keys }>
                    <View style={ styles.goalKey }></View>
                    <Text>Goal</Text>
                    <View style={ styles.goalReachedKey }></View>
                    <Text>Goal Reached</Text>
                    <View style={ styles.goalNotMetKey }></View>
                    <Text>Goal Not Met</Text>
                </View>
            </View>
        );
    }

    const renderDayBar = (day, index) => {
        const goalFastLength = Math.min((day.timeFasted + day.timeFailed), (24 * 60 * 60 * 1000));
        const actualFastLength = day.timeFasted;
        const hours = Math.round(actualFastLength / (60 * 60 * 1000));
        const dayBarStyles = (index == 6) ? styles.lastDayBar : styles.dayBar;
        const goalReached = actualFastLength >= goalFastLength;

        return (
            <View 
                key={ day.dateString }
                style={ dayBarStyles }
            >
                <Text style={ styles.dayBarHours }>{ hours + 'h' }</Text>
                { ((actualFastLength > 0) || (goalFastLength > 0)) && (
                    <View style={ [styles.dayBarOuter, calculateDayBarOuterStyles(goalFastLength)] }>
                        <View style={ [styles.dayBarInner, calculateDayBarInnerStyles(actualFastLength, goalReached)] }></View>
                    </View>
                ) }
                <Text style={ styles.dayBarDate }>{ day.dateString }</Text>
            </View>
        );
    }

    const getLongestFast = () => {
        let longestFastLength = 0;
        let longestFast = null;
        fastData.forEach(fast => {
            const fastLength = new Date(fast.endTime).getTime() - new Date(fast.startTime).getTime();
            if (fastLength >= longestFast) {
                longestFastLength = fastLength;
                longestFast = fast;
            }
        });
    
        return longestFast;
    }

    const getLongestStreak = () => {
        let longestStreak = 0;
        let currentStreak = 0;
        fastData.forEach(fast => {
            const fastLength = new Date(fast.endTime).getTime() - new Date(fast.startTime).getTime();
            const goalReached = fastLength > fast.duration;
            if (goalReached) {
                currentStreak += 1;
                if (currentStreak > longestStreak) {
                    longestStreak = currentStreak;
                }
            } else {
                currentStreak = 0;
            }
        });
        return longestStreak;
    }

    const getCurrentStreak = () => {
        let currentStreak = 0;
        for (let i = 0; i < fastData.length; i++) {
            const fast = fastData[i];
            const fastLength = new Date(fast.endTime).getTime() - new Date(fast.startTime).getTime();
            const goalReached = fastLength > fast.duration;
            if (goalReached) {
                currentStreak += 1;
            } else {
                break;
            }
        }
        return currentStreak;
    }

    return (
        <ScrollView contentContainerStyle={ styles.mainContainer }>
            { renderWeekGraph() }
            <View style={ styles.record }>
                <Text style={ styles.recordTitle }>Longest Fast</Text>
                <Text style={ styles.recordValue }>{
                    fastData.length != 0 ? 
                        calculateTimeDifference(
                            new Date(getLongestFast().startTime).getTime(), 
                            new Date(getLongestFast().endTime).getTime()
                        ) : '0:00:00'
                }</Text>
            </View>
            <View style={ styles.record }>
                <Text style={ styles.recordTitle }>Longest Streak (Fasts Completed)</Text>
                <Text style={ styles.recordValue }>{ getLongestStreak() }</Text>
            </View>
            <View style={ styles.record }>
                <Text style={ styles.recordTitle }>Current Streak (Fasts Completed)</Text>
                <Text style={ styles.recordValue }>{ getCurrentStreak() }</Text>
            </View>
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
    axisLabel: {
        color: 'gray',
        fontSize: 10,
    }, 
    axisLabels: {
        height: 282,
        justifyContent: 'space-between',
        paddingBottom: 42,
        paddingTop: 40
    },
    dateRange: {
        fontWeight: 'bold'
    },
    dayBar: {
        alignSelf: 'stretch',
        alignItems: 'center',
        borderLeftColor: '#f0f0f0',
        borderLeftWidth: 2,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        paddingLeft: 5,
        paddingRight: 5
    },  
    dayBarDate: {
        fontSize: 10,
        marginBottom: 10,
        marginTop: 20,
    },
    dayBarHours: {
        color: 'gray',
        fontSize: 10
    },
    dayBarInner: {
        borderRadius: 5,
        width: 10
    },
    dayBarOuter: {
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        height: 200,
        justifyContent: 'flex-end',
        marginTop: 20,
        width: 10
    },
    dayBarsContainer: {
        alignItems: 'flex-end',
        flexDirection: 'row-reverse',
        justifyContent: 'center'
    },
    goalKey: {
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        height: 20,
        marginRight: 5,
        width: 20
    },
    goalNotMetKey: {
        backgroundColor: 'gray',
        borderRadius: 20,
        height: 20,
        marginLeft: 10,
        marginRight: 5,
        width: 20
    },
    goalReachedKey: {
        backgroundColor: '#4ee7ff',
        borderRadius: 20,
        height: 20,
        marginLeft: 10,
        marginRight: 5,
        width: 20
    },
    keys: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20
    },
    lastDayBar: {
        alignSelf: 'stretch',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        paddingLeft: 5,
        paddingRight: 5
    },
    mainContainer: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center'
    },
    record: {
        alignSelf: 'stretch',
        borderColor: '#f0f0f0',
        borderRadius: 20,
        borderWidth: 2,
        padding: 10,
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 20
    },
    recordTitle: {
        color: '#4ee7ff'
    },  
    recordValue: {
        fontSize: 40,
    },
    weekGraph: {
        alignSelf: 'stretch',   
        borderColor: '#f0f0f0',
        borderRadius: 20,
        borderWidth: 2,
        marginBottom: 20,
        marginLeft: 20,
        marginRight: 20,
        padding: 20
    },
    weekGraphHeader: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 20
    }
});

export default Stats;