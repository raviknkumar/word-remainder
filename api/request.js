import axios from 'axios'
import {ipConfig} from './ipConfig';

export const wordRemainderBaseUrl = () => {
    return ipConfig.ip.wordRemainder.prod;
};

const ffaBaseUrl = () => {
    return ipConfig.ip.ffa.prod;
};

/*
const authData = () => {
    const header = {}
    header['Authorization'] = 'Basic ' + getToken()
    header['appVersion'] = '7';
    return header
}
*/

export const wordRemainderRequest = axios.create({
    baseURL : wordRemainderBaseUrl(),
});

export const ffaRequest = axios.create({
    baseURL : ffaBaseUrl(),
});

export const randomRequest = axios.create({
   baseURL: ''
});
