import { PREFIX, getJson, post, put, del } from "./common";

export async function getCounseling(psyid) {
    psyid = encodeURIComponent(psyid);
    const url = `${PREFIX}/counseling/get?psyid=${psyid}`;
    let res;
    try {
        res = await getJson(url);
    } catch (e) {
        console.log(e);
        res = [];
    }
    return res;
}

export async function getUserCounseling() {
    const url = `${PREFIX}/counseling/getuser`;
    let res;
    try {
        res = await getJson(url);
    } catch (e) {
        console.log(e);
        res = [];
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
        res = [];
    }
    return res;
}

export async function getPsySingle(psyid) {
    psyid = encodeURIComponent(psyid);
    const url = `${PREFIX}/counseling/getpsy?psyid=${psyid}`;
    let res;
    try {
        res = await getJson(url);
    } catch (e) {
        console.log(e);
        res = null;
    }
    return res;
}

export async function getPsyProfiles() {
    const url = `${PREFIX}/counseling/getpsys`;
    let res;
    try {
        res = await getJson(url);
    } catch (e) {
        console.log(e);
        res = [];
    }
    return res;
}

export async function getCounselingTags() {
    const url = `${PREFIX}/counseling/gettags`;
    let res;
    try {
        res = await getJson(url);
    } catch (e) {
        console.log(e);
        res = [];
    }
    return res;
}

export async function addCounseling(counseling) {
    const url = `${PREFIX}/counseling/add`;
    let res;
    try {
        res = await post(url, counseling);
    } catch (e) {
        console.log(e);
        res = false;
    }
    return res;
}

export async function addComment(comment) {
    const url = `${PREFIX}/counseling/addcomm`;
    let res;
    try {
        res = await post(url, comment);
    } catch (e) {
        console.log(e);
        res = false;
    }
    return res;
}

export async function setStatus(counselingid, status) {
    counselingid = encodeURIComponent(counselingid);
    status = encodeURIComponent(status);
    const url = `${PREFIX}/counseling/status?counselingid=${counselingid}&status=${status}`;
    let res;
    try {
        res = await put(url, null);
    } catch (e) {
        console.log(e);
        res = false;
    }
    return res;
}

export async function getAvailableTimes(psyid) {
    psyid = encodeURIComponent(psyid);
    const url = `${PREFIX}/counseling/available/get?psyid=${psyid}`;
    let res;
    try {
        res = await getJson(url);
    } catch (e) {
        console.log(e);
        res = null;
    }
    return res;
}

export async function getDateAvailables(psyid, timestamp) {
    psyid = encodeURIComponent(psyid);
    timestamp = encodeURIComponent(timestamp);
    const url = `${PREFIX}/counseling/available/getdate?psyid=${psyid}&timestamp=${timestamp}`;
    let res;
    try {
        res = await getJson(url);
    } catch (e) {
        console.log(e);
        res = [];
    }
    return res;
}

export async function updateAvailableTimes(datas) {
    const url = `${PREFIX}/counseling/available/set`;
    let res;
    try {
        res = await post(url, datas);
    } catch (e) {
        console.log(e);
        res = false;
    }
    return res;
}