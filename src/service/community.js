import {getJson, PREFIX,post} from "./common";


/*

reply: {
                replyid:
                blogid:
                userid:
                timestamp:
                content:
            }

 */
export async function addReply(blogid,reply) {
    const url = `${PREFIX}/replies/add`;
    let replyData = {
        blogid: blogid,
        content: reply,
        userid: "",
        timestamp: 0
    };
    let res;
    try {
        res = await post(url, replyData);
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

export async function getBlogs(pageSize, currentPage, searchText, tags) {
    const url = `${PREFIX}/blogs/get`;
    let res;
    try {
        res = await getJson(url);
        console.log(res);
    } catch (e) {
        console.log(e);
        res = [];
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
        res = {};
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
    res.success = true;
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
    res.success = true;
    return res;
}


/*

发表帖子

返回json对象表示发表是否成功
 blogid:
            userid:
            timestamp:
            likeNum:
            cover:
            title:
            content:
            tag[]
            reply[]

*/

export async function addBlog(blog) {
    const url = `${PREFIX}/blogs/add`;
    blog.timestamp = 0;
    blog.userid = 0;
    blog.tag = [];
    blog.likeNum = 0;
    blog.reply = [];
    let res;
    try {
        res = await post(url, blog);
        console.log(res);
        //res.success = true;
    } catch (e) {
        console.log(e);
        res = null;
    }
    //以下为测试使用
    res.success = true;
    return res;
}

//获取头像
export async function getAvatar(userid) {
    const url = `${PREFIX}/user/getAvatar/${userid}`;
    let res;
    try {
        res = await getJson(url);
    } catch (e) {
        console.log(e);
        res.avatar = null;
    }
    return res.avatar;
}

