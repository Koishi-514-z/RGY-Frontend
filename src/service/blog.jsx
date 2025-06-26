import { PREFIX, getJson, post, put, del } from "./common";

export async function getBlogs(userid) {
    userid = encodeURIComponent(userid)
    const url = `${PREFIX}/blogs/getmine?userid=${userid}`;
    let res;
    try {
        res = await getJson(url);
    } catch (e) {
        console.log(e);
        res = null;
    }
    return res;
}

export async function getLikeBlogs(userid) {
    const url = `${PREFIX}/blogs/getlike?userid=${userid}`;
    let res;
    try {
        res = await getJson(url);
    } catch (e) {
        console.log(e);
        res = null;
    }
    return res;
}

export async function getCommentBlogs(userid) {
    const url = `${PREFIX}/blogs/getcomment?userid=${userid}`;
    let res;
    try {
        res = await getJson(url);
    } catch (e) {
        console.log(e);
        res = null;
    }
    return res;
}