import Toast from 'react-native-simple-toast';
import Clipboard from "@react-native-community/clipboard";
import {Alert} from 'react-native';


export const getDateAsString = (date) => {
    let month = '' + (date.getMonth() + 1),
        day = '' + date.getDate(),
        year = date.getFullYear();

    if (month.length < 2) {
        month = '0' + month;
    }
    if (day.length < 2) {
        day = '0' + day;
    }

    return [year, month, day].join('-');
};

export const addDaysToDate = (date, days) => {
    return new Date(date.setMonth(date.getDate() + days));
};

export const addMonthsToDate = (date, months) => {
    return new Date(date.setMonth(date.getMonth() + months));
};

export const addYearsToDate = (date, years) => {
    return new Date(date.setMonth(date.getYear() + years));
};

export const showToast = (message) => {
    Toast.showWithGravity(message, Toast.LONG, Toast.TOP);
};

export const writeToClipboard = async (word) => {
    await Clipboard.setString(word.name);
    Alert.alert('Copied to Clipboard!');
};
