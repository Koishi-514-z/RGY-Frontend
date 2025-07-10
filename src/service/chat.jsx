import { PREFIX, getJson, post, put, del } from "./common";

export async function getSession(sessionid) {
    sessionid = encodeURIComponent(sessionid);
    const url = `${PREFIX}/chat/getsession?sessionid=${sessionid}`;
    let session;
    try {
        session = await getJson(url);
    } catch (e) {
        console.log(e);
        session = null;
    }
    return session;
}

export async function getSessionTags() {
    const url = `${PREFIX}/chat/gettags`;
    let sessions;
    try {
        sessions = await getJson(url);
    } catch (e) {
        console.log(e);
        sessions = [];
    }
    return sessions;
}

//  返回sessionid
export async function createSession(userid) {
    userid = encodeURIComponent(userid);
    const url = `${PREFIX}/chat/create?userid=${userid}`;
    let sessionid;
    try {
        sessionid = await post(url, null);
    } catch (e) {
        console.log(e);
        sessionid = null;
    }
    return sessionid;
}

//  如不存在，返回null
export async function getSessionid(userid) {
    userid = encodeURIComponent(userid);
    const url = `${PREFIX}/chat/getid?userid=${userid}`;
    let sessionid;
    try {
        sessionid = await getJson(url);
    } catch (e) {
        console.log(e);
        sessionid = null;
    }
    return sessionid;
}

export async function postMessage(sessionid, content) {
    sessionid = encodeURIComponent(sessionid);
    const url = `${PREFIX}/chat/post?sessionid=${sessionid}`;
    let res;
    try {
        res = await put(url, content);
    } catch (e) {
        console.log(e);
        res = false;
    }
    return res;
}

export async function updateRead(sessionid) {
    sessionid = encodeURIComponent(sessionid);
    const url = `${PREFIX}/chat/read?sessionid=${sessionid}`;
    let res;
    try {
        res = await put(url, null);
    } catch (e) {
        console.log(e);
        res = false;
    }
    return res;
}