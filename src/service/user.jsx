import { PREFIX, getJson, post, put } from "./common";

export async function login(username, password) {
    username = encodeURIComponent(username);
    password = encodeURIComponent(password);
    const url = `${PREFIX}/user/login?username=${username}&password=${password}`;
    let res;
    try {
        res = await getJson(url);
    } catch (e) {
        console.log(e);
        res = false;
    }
    return res;
}

export async function userExisted(username) {
    username = encodeURIComponent(username);
    const url = `${PREFIX}/user/existed?username=${username}`;
    let res;
    try {
        res = await getJson(url);
    } catch (e) {
        console.log(e);
        res = false;
    }
    return res;
}

export async function getUserProfile() {
    const url = `${PREFIX}/user/getmine`;
    let res;
    try {
        res = await getJson(url);
    } catch (e) {
        console.log(e);
        res = null;
    }
    return res;
}

export async function getSimplifiedProfile(userid) {
    userid = encodeURIComponent(userid);
    const url = `${PREFIX}/user/getsim?userid=${userid}`;
    let res;
    try {
        res = await getJson(url);
    } catch (e) {
        console.log(e);
        res = null;
    }
    return res;
}

export async function getIntimateUsers() {
    const url = `${PREFIX}/user/getintm`;
    let res;
    try {
        res = await getJson(url);
    } catch (e) {
        console.log(e);
        res = [];
    }
    return res;
}

export async function addUser(user) {
    const url = `${PREFIX}/user/add`;
    let res;
    try {
        res = await post(url, user);
    } catch (e) {
        console.log(e);
        res = false;
    }
    return res;
}

export async function updateProfile(profile) {
    const url = `${PREFIX}/user/profile/update`;
    let res;
    try {
        res = await put(url, profile);
    } catch (e) {
        console.log(e);
        res = false;
    }
    return res;
}

export async function verifyPassword(password) {
    password = encodeURIComponent(password);
    const url = `${PREFIX}/user/verify/pwd?password=${password}`;
    let res;
    try {
        res = await getJson(url);
    } catch (e) {
        console.log(e);
        res = false;
    }
    return res;
}

export async function updatePassword(password) {
    password = encodeURIComponent(password);
    const url = `${PREFIX}/user/pwd?password=${password}`;
    let res;
    try {
        res = await put(url, null);
    } catch (e) {
        console.log(e);
        res = false;
    }
    return res;
}