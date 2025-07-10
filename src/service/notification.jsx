import { PREFIX, getJson, post, put, del } from "./common";


export async function getNotification() {
    const url = `${PREFIX}/notification/get`;
    let notify;
    try {
        notify = await getJson(url);
    } catch (e) {
        console.log(e);
        notify = [];
    }
    return notify;
}

export async function addPrivateNotification(notification) {
    const url = `${PREFIX}/notification/private/add`;
    let res;
    try {
        res = await put(url, notification);
    } catch (e) {
        console.log(e);
        res = false;
    }
    return res;
}

export async function markRead(notificationid) {
    notificationid = encodeURIComponent(notificationid);
    const url = `${PREFIX}/notification/markread?notificationid=${notificationid}`;
    let res;
    try {
        res = await post(url, null);
    } catch (e) {
        console.log(e);
        res = false;
    }
    return res;
}

export async function markAllPrivateRead() {
    const url = `${PREFIX}/notification/private/markallread`;
    let res;
    try {
        res = await post(url, null);
    } catch (e) {
        console.log(e);
        res = false;
    }
    return res;
}

export async function markAllPublicRead() {
    const url = `${PREFIX}/notification/public/markallread`;
    let res;
    try {
        res = await post(url, null);
    } catch (e) {
        console.log(e);
        res = false;
    }
    return res;
}

export async function deleteNotification(notificationid) {
    notificationid = encodeURIComponent(notificationid);
    const url = `${PREFIX}/notification/private/del?notificationid=${notificationid}`;
    let res;
    try {
        res = await del(url, null);
    } catch (e) {
        console.log(e);
        res = false;
    }
    return res;
}