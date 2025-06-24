import {getJson, PREFIX,post} from "./common";

export async function addReply(blogid,reply) {
    const url = `${PREFIX}/replies/add`;
    let res;
    try {
        res = await post(url, reply);
        console.log(res);
    } catch (e) {
        console.log(e);
        res = null;
    }
    return res;
}


export function getReplies() {
}


/*
根绝筛选条件获得所有的帖子信息

*/

export async function getBlogs(data = {}) {
    const url = `${PREFIX}/blogs/get`;
    let res;
    try {
        res = await getJson(url);
        console.log(res);
    } catch (e) {
        console.log(e);
        res = null;
    }
    return res;
}

export async function getBlogById(id) {
    const url = `${PREFIX}/blogs/getById/${id}`;
    let res;
    try {
        res = await getJson(url);
        console.log(res);
    } catch (e) {
        console.log(e);
        res = null;
    }
    return res;
}

/*

点赞与取消点赞
返回json对象表示点赞是否成功

*/

export async function likeBlog(blogid) {
    const url = `${PREFIX}/blogs/like/${blogid}`;
    let res;
    try {
        res = await post(url);
        console.log(res);
    } catch (e) {
        console.log(e);
        res = null;
    }
    return res;
}


export async function cancelLikeBlog(blogid) {
    const url = `${PREFIX}/blogs/cancellike/${blogid}`;
    let res;
    try {
        res = await post(url);
        console.log(res);
        } catch (e) {
        console.log(e);
        res = null;
    }
    return res;
}

export async function addBlog(blog) {
    const url = `${PREFIX}/blogs/add`;
    blog.timestamp = new Date().getTime();
    blog.likeNum = 0;
    blog.reply = [];
    let res;
    try {
        res = await post(url, blog);
        console.log(res);
    } catch (e) {
        console.log(e);
        res = null;
    }
    res.success = true;
    return res;
}
