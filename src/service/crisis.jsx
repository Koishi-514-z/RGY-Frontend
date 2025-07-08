import { PREFIX, getJson, post, put, del } from "./common";

export async function getCrisis() {
    const url = `${PREFIX}/crisis/getall`;
    let res;
    try {
        res = await getJson(url);
    } catch (e) {
        console.log(e);
        res = [];
    }
    return res;
}

export async function updateCrisisStatus(crisisid, status) {
    crisisid = encodeURIComponent(crisisid);
    status = encodeURIComponent(status);
    const url = `${PREFIX}/crisis/update?crisisid=${crisisid}&status=${status}`;
    let res;
    try {
        res = await put(url, null);
    } catch (e) {
        console.log(e);
        res = false;
    }
    return res;
}