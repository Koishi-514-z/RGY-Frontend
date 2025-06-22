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