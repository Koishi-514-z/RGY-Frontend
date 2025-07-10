import {getJson, PREFIX} from "./common";
import {put} from "./common";

export async function updateUserPriority(userid, disabled) {
    try {
        let url = `${PREFIX}/user/disabled/set?userid=${userid}&disabled=${disabled}`;
        await put(url, null);
    } catch (error) {
        console.error('更新用户状态失败:', error);
        throw error;
    }
}

export async function getAllUsers() {
    const url = `${PREFIX}/user/getall`;
    console.log(url);
    let res;
    try {
        res = await getJson(url);
        console.log(res);
        return res;
    } catch (e) {
        console.log(e);
        res = [];
    }

    return res;
}

