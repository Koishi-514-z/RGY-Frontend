import { PREFIX, getJson, post, put, del } from "./common";

export async function getEmotion() {
    const url = `${PREFIX}/emotion/tag/get`;
    let res;
    try {
        res = await getJson(url);
    } catch (e) {
        console.log(e);
        res = null;
    }
    return res;
}

export async function getTags() {
    const url = `${PREFIX}/emotion/tag/getall`;
    let res;
    try {
        res = await getJson(url);
    } catch (e) {
        console.log(e);
        res = [];
    }
    return res;
}

export async function getUrlTags() {
    const url = `${PREFIX}/emotion/tag/geturl`;
    let res;
    try {
        res = await getJson(url);
    } catch (e) {
        console.log(e);
        res = [];
    }
    return res;
}

export async function checkNegative() {
    const url = `${PREFIX}/emotion/negative`;
    let res;
    try {
        res = await getJson(url);
    } catch (e) {
        console.log(e);
        res = false;
    }
    return res;
}

export async function getDiary() {
    const url = `${PREFIX}/emotion/diary/get`;
    let res;
    try {
        res = await getJson(url);
    } catch (e) {
        console.log(e);
        res = null;
    }
    return res;
}

export async function getWeekData() {
    const url = `${PREFIX}/emotion/data/getweek`;
    let res;
    try {
        res = await getJson(url);
    } catch (e) {
        console.log(e);
        res = [];
    }
    return res;
}

export async function getMonthData() {
    const url = `${PREFIX}/emotion/data/getmonth`;
    let res;
    try {
        res = await getJson(url);
    } catch (e) {
        console.log(e);
        res = [];
    }
    return res;
}

export async function scanEmotionData(start, end, interval) {
    start = encodeURIComponent(start);
    end = encodeURIComponent(end);
    interval = encodeURIComponent(interval);
    const url = `${PREFIX}/emotion/data/scan?start=${start}&end=${end}&interval=${interval}`;
    let res;
    try {
        res = await getJson(url);
    } catch (e) {
        console.log(e);
        res = null;
    }
    return res;
}

export async function updateEmotion(data) {
    const url = `${PREFIX}/emotion/tag/update`;
    let res;
    try {
        res = await put(url, data);
    } catch (e) {
        console.log(e);
        res = false;
    }
    return res;
}

export async function updateDiary(diary) {
    const url = `${PREFIX}/emotion/diary/update`;
    let res;
    try {
        res = await put(url, diary);
    } catch (e) {
        console.log(e);
        res = false;
    }
    return res;
}