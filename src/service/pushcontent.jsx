import { PREFIX, getJson, post, put, del } from "./common";

export async function getUrlDatasByTag(tagid, pageIndex, pageSize) {
    tagid = encodeURIComponent(tagid);
    pageIndex = encodeURIComponent(pageIndex);
    pageSize = encodeURIComponent(pageSize);
    const url = `${PREFIX}/pushcontent/getbytag?tagid=${tagid}&pageIndex=${pageIndex}&pageSize=${pageSize}`;
    let res;
    try {
        res = await getJson(url);
    } catch (e) {
        console.log(e);
        res = [];
    }
    return res;
}

export async function getUrlDatas(pageIndex, pageSize) {
    pageIndex = encodeURIComponent(pageIndex);
    pageSize = encodeURIComponent(pageSize);
    const url = `${PREFIX}/pushcontent/get?pageIndex=${pageIndex}&pageSize=${pageSize}`;
    let res;
    try {
        res = await getJson(url);
    } catch (e) {
        console.log(e);
        res = [];
    }
    return res;
}

export async function getSimUrlDatas() {
    const url = `${PREFIX}/pushcontent/getsim`;
    let res;
    try {
        res = await getJson(url);
    } catch (e) {
        console.log(e);
        res = [];
    }
    return res;
}

export async function getDataNum(tagid) {
    tagid = encodeURIComponent(tagid);
    const url = `${PREFIX}/pushcontent/getnum?tagid=${tagid}`;
    let res;
    try {
        res = await getJson(url);
    } catch (e) {
        console.log(e);
        res = 0;
    }
    return res;
}

export async function getAllDataNum() {
    const url = `${PREFIX}/pushcontent/getallnum`;
    let res;
    try {
        res = await getJson(url);
    } catch (e) {
        console.log(e);
        res = 0;
    }
    return res;
}

export async function AddUrlData(urlData) {
    const url = `${PREFIX}/pushcontent/push`;
    let res;
    try {
        res = await post(url, urlData);
    } catch (e) {
        console.log(e);
        res = false;
    }
    return res;
}

export async function deleteUrlData(urlid) {
    urlid = encodeURIComponent(urlid);
    const url = `${PREFIX}/pushcontent/del?urlid=${urlid}`;
    let res;
    try {
        res = await del(url, null);
    } catch (e) {
        console.log(e);
        res = false;
    }
    return res;
}

export async function AddQuote(quote) {
    const url = `${PREFIX}/pushcontent/quote/add`;
    let res;
    try {
        res = await post(url, quote);
    } catch (e) {
        console.log(e);
        res = false;
    }
    return res;
}

export async function getQuote() {
    const url = `${PREFIX}/pushcontent/quote/get`;
    let res;
    try {
        res = await getJson(url);
    } catch (e) {
        console.log(e);
        res = null;
    }
    return res;
}