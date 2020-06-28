import {ffaRequest, randomRequest, wordRemainderRequest} from './request';
import axios from 'axios';

export function fetchUser(params) {
    return wordRemainderRequest({
        url: '/user',
        method: 'get',
        params
    })
}

export function fetchWordsByDateRange(params) {
    return wordRemainderRequest({
        url: '/word/findByDate',
        method: 'get',
        params
    })
}

export function fetchWordsForToday(params) {
    return wordRemainderRequest({
        url: '/word/today',
        method: 'get',
        params
    })
}

export function fetchWordsBySearchText(params) {
    return wordRemainderRequest({
        url: '/word/find',
        method: 'get',
        params
    })
}

let headers = {
    "Accept": "application/json, text/plain, */*",
    "Accept-Encoding": "gzip, deflate",
    "Accept-Language": "en-US,en;q=0.9,nl;q=0.8",
    "Content-Type": "application/json",
    "Dnt": "1",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36",
};

export function addWord(data) {
    return wordRemainderRequest({
        url: '/word',
        method: 'post',
        headers,
        data:data
    })
}

