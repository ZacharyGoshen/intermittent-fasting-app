import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity
} from 'react-native';

const Fasts = (props) => {
    const onChangeFast = props.onChangeFast;

    return (
        <ScrollView contentContainerStyle={ styles.mainContainer }>
            <TouchableOpacity 
                style={ [styles.fastContainer, styles.fastContainer1] }
                onPress={ () => onChangeFast('16:8 Intermittent', 16, 8) }
            >
                <Text style={ styles.fastLength }>16 HOURS</Text>
                <Text style={ styles.fastTitle }>16:8 Intermittent</Text>
                <Text style={ styles.fastDescription }>A 16 hour fast with an 8 hour feeding window</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={ [styles.fastContainer, styles.fastContainer2] }
                onPress={ () => onChangeFast('18:6 Intermittent', 18, 6) }
            >
                <Text style={ styles.fastLength }>18 HOURS</Text>
                <Text style={ styles.fastTitle }>18:6 Intermittent</Text>
                <Text style={ styles.fastDescription }>A 18 hour fast with an 6 hour feeding window</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={ [styles.fastContainer, styles.fastContainer3] }
                onPress={ () => onChangeFast('20:4 Intermittent', 20, 4) }
            >
                <Text style={ styles.fastLength }>20 HOURS</Text>
                <Text style={ styles.fastTitle }>20:4 Intermittent</Text>
                <Text style={ styles.fastDescription }>A 20 hour fast with an 4 hour feeding window</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={ [styles.fastContainer, styles.fastContainer4] }
                onPress={ () => onChangeFast('36:12 Intermittent', 36, 12) }
            >
                <Text style={ styles.fastLength }>36 HOURS</Text>
                <Text style={ styles.fastTitle }>36:12 Intermittent</Text>
                <Text style={ styles.fastDescription }>A 36 hour fast with an 12 hour feeding window</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    fastContainer: {
        alignSelf: 'stretch',
        borderRadius: 20,
        padding: 20
    },
    fastContainer1: {
        backgroundColor: '#4ee7ff',
    },
    fastContainer2: {
        backgroundColor: '#4dffa0',
    },
    fastContainer3: {
        backgroundColor: '#ffa04d',
    },
    fastContainer4: {
        backgroundColor: '#ffa0ff',
    },
    fastDescription: {
        color: 'white'
    },
    fastLength: {
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 10
    },
    fastTitle: {
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 10
    },
    mainContainer: {
        alignItems: 'center',
        flex: 1,
        paddingLeft: 60,
        paddingRight: 60,
        justifyContent: 'space-evenly'
    }
});

export default Fasts;