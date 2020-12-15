import AsyncStorage from '@react-native-async-storage/async-storage';

export const getData = async (key) => {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        const value = jsonValue != null ? JSON.parse(jsonValue) : null;
        return value;
    } catch (e) {
        alert('Failed to fetch the data from storage')
    }
}

export const storeData = async (key, value, callback) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
         alert('Failed to save the data to the storage')
    }
}

export const calculateTimeDifference = (startTime, endTime) => {
    if (startTime > endTime ) {
        return '0:00:00';
    }

    let seconds = Math.round((endTime - startTime) / 1000);

    const hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;

    const minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;

    return `${hours}:${('0' + minutes).slice(-2)}:${('0' + seconds).slice(-2)}`;
}

export const dateToShortFormat = (date) => {
    const yesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));
    const today = new Date();
    const tomorrow = new Date(new Date().getTime() + (24 * 60 * 60 * 1000));

    if (date.getDate() == yesterday.getDate()) {
        return 'Yesterday';
    } else if (date.getDate() == today.getDate()) {
        return 'Today';
    } else if (date.getDate() == tomorrow.getDate()) {
        return 'Tomorrow';
    } else {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const month = months[date.getMonth()];
        const day = date.getDate();
        return `${month} ${day}`;
    }
}

export const timeToShortFormat = (time) => {
    const hour = time.getHours();
    const minute = time.getMinutes();
    return `${hour}:${minute}`;
}