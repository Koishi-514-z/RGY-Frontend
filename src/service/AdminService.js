import {getJson, PREFIX} from "./common";
import {post} from "./common";

export async function updateUserPriority(userid, priority) {
    try {
        const response = await post('/auth/priority',  { "username": userid, "priority": priority });
        return response;
    } catch (error) {
        console.error('更新用户状态失败:', error);
        throw error;
    }
}

export async function getAllUsers() {
    const url = `${PREFIX}/auth/users`;
    let res;
    try {
        // res = await getJson(url);
        // console.log(res);
        res = [];
        for (let i = 0; i < 10; i++) {
            res.push({
                "userid": "user" + i,
                "priority": 1,

            });
        }
        return res;
    } catch (e) {
        console.log(e);
        res = [];
    }

    return res;
}

