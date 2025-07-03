import { PREFIX, getJson, post, put, del } from "./common";

export async function getCounseling(psyid) {
    psyid = encodeURIComponent(psyid);
    const url = `${PREFIX}/counseling/get?psyid=${psyid}`;
    let res;
    try {
        res = await getJson(url);
    } catch (e) {
        console.log(e);
        res = null;
    }
    return res;
}

export async function getDateCounseling(psyid, timestamp) {
    psyid = encodeURIComponent(psyid);
    timestamp = encodeURIComponent(timestamp);
    const url = `${PREFIX}/counseling/getdate?psyid=${psyid}&timestamp=${timestamp}`;
    let res;
    try {
        res = await getJson(url);
    } catch (e) {
        console.log(e);
        res = null;
    }
    return res;
}

export async function addCounseling(psyid, timestamp) {
    psyid = encodeURIComponent(psyid);
    timestamp = encodeURIComponent(timestamp);
    const url = `${PREFIX}/counseling/add?psyid=${psyid}&timestamp=${timestamp}`;
    let res;
    try {
        res = await post(url, null);
    } catch (e) {
        console.log(e);
        res = false;
    }
    return res;
}