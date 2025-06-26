import {message} from "antd";

const isError = (code) => {
    if(code == 500 || code == 404 || code == 403 || code == 401) {
        return true;
    }
    return false;
}

export async function getJson(url) {
    // let res = await fetch(url, { method: "GET", credentials: "include" });
    let res = await fetch(url, { method: "GET" });
    let res_json = await res.json();
    if(isError(res_json.code)) {
        window.location.href = '/forbidden';
        return null;
    }
    return res_json;
}

export async function get(url) {
    // let res = await fetch(url, { method: "GET", credentials: "include" });
    try {
        let res = await fetch(url, { method: "GET" });
        let res_json = await res.json();
        if(isError(res_json.code)) {
            window.location.href = '/forbidden';
            return null;
        }
        return res;
    } catch (error) {
        message.error("API请求错误：" + error.message);
        throw new Error(error.message);
    }
}

/*
增设异常处理
*/

export async function put(url, data) {
    try {
        let opts = {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
            // credentials: "include"
        };
        let res = await fetch(url, opts);
        let res_json = await res.json();
        if (isError(res_json.code)) {
            window.location.href = '/forbidden';
            return null;
        }
        return res_json;
    }
    catch (error) {
        message.error("API请求错误：" + error.message);
        throw new Error(error.message);
    }
}

export async function del(url, data) {
    try {
        let opts = {
            method: "DELETE",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
            // credentials: "include"
        };
        let res = await fetch(url, opts);
        let res_json = await res.json();
        if (isError(res_json.code)) {
            window.location.href = '/forbidden';
            return null;
        }
        return res_json;
    }
    catch (error) {
        message.error("API请求错误：" + error.message);
        throw new Error(error.message);
    }
}


export async function post(url, data) {
    try {
        let opts = {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
            // credentials: "include"
        };
        let res = await fetch(url, opts);
        let res_json = await res.json();
        if (isError(res_json.code)) {
            window.location.href = '/forbidden';
            return null;
        }
        return res_json;
    } catch (error) {
        message.error("API请求错误：" + error.message);
        throw new Error(error.message);
    }
}

export async function readFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            resolve(event.target.result);
        };
        reader.onerror = (error) => {
            reject(error);
        }
        reader.readAsDataURL(file);
    });
}

export const BASEURL = 'http://localhost:8080';
export const BASEURL_MOCK = 'https://b317a8dc-e8d1-4b75-b957-2543aaf00613.mock.pstmn.io';
export const PREFIX = `${BASEURL}/api`;