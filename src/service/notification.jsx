import { PREFIX, getJson, post, put, del } from "./common";

export async function getPrivateNotification() {
    const url = `${PREFIX}/notification/private/get`;
    let notify;
    try {
        notify = await getJson(url);
    } catch (e) {
        console.log(e);
        notify = [];
    }
    return notify;
}

export async function getPublicNotification() {
    const url = `${PREFIX}/notification/public/get`;
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

export async function addPublicNotification(notification) {
    const url = `${PREFIX}/notification/public/add`;
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
    const url = `${PREFIX}/notification/private/markread?notificationid=${notificationid}`;
    let res;
    try {
        res = await post(url, null);
    } catch (e) {
        console.log(e);
        res = false;
    }
    return res;
}

export async function markAllRead() {
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