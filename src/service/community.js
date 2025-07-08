import {getJson, PREFIX,post} from "./common";

export async function adminGetBlogById(id) {
    const url = `${PREFIX}/blogs/getById/${id}`;
    let res;
    try {
        res = await getJson(url);
        console.log(res);
    } catch (e) {
        console.log(e);
        throw e;
    }
    return res;
}


export async function reportContent(type, id, reason) {
    if (type === "blog") {
        const url = `${PREFIX}/blogs/report`;
        let params = {
            blogid: id,
            reason: reason
        };

        try {
            await post(url, params);
        } catch (e) {
            throw new Error(e);
        }

    } else if (type === "reply") {
        const url = `${PREFIX}/blogs/reportReply`;
        let params = {
            replyid: id,
            reason: reason
        };

        try {
            await post(url, params);
        } catch (e) {
            throw new Error(e);
        }
    }
}


export async function handleApproveReply(illegalid) {
    const url = `${PREFIX}/blogs/recoverIllegal`;
    let params = {
        illegalid: illegalid
    };
    let res;
    try {
        res = await post(url, params);
        console.log(res);
    } catch (e) {
        throw new Error(e);
    }
    return res;
}


export async function handleApproveBlog(illegalid) {
    const url = `${PREFIX}/blogs/recoverIllegal`;
    let params = {
        illegalid: illegalid
    };
    let res;
    try {
        res = await post(url, params);
        console.log(res);
    } catch (e) {
        throw new Error(e);
    }
    return res;

}


export async function getLatestBlogs(pageSize, currentPage, searchText, tags) {
    const url = `${PREFIX}/blogs/getLatest`;
    let params = {
        pageSize: pageSize,
        currentPage: currentPage,
        searchText: searchText,
        tags: tags
    };
    let res;
    try {
        res = await post(url, params);
        console.log(res);
    } catch (e) {
        res = [];
    }

    return res;
}


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
    const url = `${PREFIX}/blogs/addReply`;
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
        throw e;
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
    let params = {
        pageSize: pageSize,
        currentPage: currentPage,
        searchText: searchText,
        tags: tags
    };
    let res;
    try {
        res = await post(url, params);
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
        let params = {
            blogid: id
        };

        await post(`${PREFIX}/blogs/addBrowsenum`, params);
    } catch (e) {
        throw e;
    }
    return res;
}

/*

点赞与取消点赞
返回json对象表示点赞是否成功

*/

export async function likeBlog(blogid) {
    const url = `${PREFIX}/blogs/like`;

    try {
        let params = {
            blogid: blogid
        };
        await post(url, params);

    } catch (e) {
        throw e;
    }
    //res.success = true;

}


export async function cancelLikeBlog(blogid) {
    const url = `${PREFIX}/blogs/cancellike`;

    try {
        let params = {
            blogid: blogid
        };
        await post(url, params);

    } catch (e) {
        throw e;
    }
    //res.success = true;

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
    //blog.userid = 0;
    blog.tag = [];
    blog.likeNum = 0;
    blog.reply = [];
    let res;
    try {
        res = await post(url, blog);
        console.log(res);
        //res.success = true;
    } catch (e) {
        throw e;
    }
    //以下为测试使用
    //res.success = true;
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

export async function getLiked(id) {
    const url = `${PREFIX}/blogs/getIfLiked`;
    let ret  = false;
    try {
        let params = {
            blogid: id
        };
        ret = await post(url, params);

    } catch (e) {
        throw e;
    }
    return ret;
}

export async function getIllegalBlogs() {
    const url = `${PREFIX}/blogs/getIllegalBlogs`;
    let res;
    try {
        res = await getJson(url);
        res.forEach(item => {
            item.userid = item.user.userid;
            item.username = item.user.username;
            item.avatar = item.user.avatar;

        });
    } catch (e) {
        console.log(e);
        res = [];
    }
    return res;
}

export async function getIllegalReplies() {
    const url = `${PREFIX}/blogs/getIllegalReplies`;
    let res;
    try {
        res = await getJson(url);
        res.forEach(item => {
            item.userid = item.user.userid;
            item.username = item.user.username;
            item.avatar = item.user.avatar;

        });
    } catch (e) {
        console.log(e);
        res = [];
    }
    return res;
}

export async function deleteBlog(blogId, illegalId) {
    const url = `${PREFIX}/blogs/sheldingBlog`;
    try {

        await post(url, { blogid :blogId ,illegalid :illegalId});
    } catch (e) {
        throw e;
    }
}

export async function deleteReply(replyId, illegalId) {
    const url = `${PREFIX}/blogs/sheldingReply`;
    try {
        await post(url, { replyid:replyId, illegalid: illegalId });
    } catch (e) {
        throw e;
    }
}


export async function getUserBlogs(userid) {
    const url = `${PREFIX}/blogs/getmine?userid=${userid}`;
    let res;
    try {
        res = await getJson(url);
    } catch (e) {
        console.log(e);
        res = [];
    }
    return res;
}

export async function getUserReplies(userid) {
    const url = `${PREFIX}/blogs/getreply?userid=${userid}`;
    let res;
    try {
        res = await getJson(url);
    } catch (e) {
        console.log(e);
        res = [];
    }
    return res;
}

