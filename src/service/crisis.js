import { PREFIX, getJson, post, put, del } from "./common";


export async function getAuditingCrisis() {
    const url = `${PREFIX}/crisis/listAuditing`;
    let res;
    try {
        res = await getJson(url);
    } catch (e) {
        console.log(e);
        res = [];
    }
    return res;
}



export async function getAllConfirmedCrisis() {
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

export async function confirmCrisis(crisisId,urgencyLevel) {
    const url = `${PREFIX}/crisis/confirm`;
    try {
        await post(url, { crisisid:crisisId , urgencylevel:urgencyLevel });
    } catch (e) {
        throw e;
    }
}

export async function deleteCrisis(crisisId) {
    const url = `${PREFIX}/crisis/delete`;
    try {
        await post(url, { crisisid:crisisId });
    } catch (e) {
        throw e;
    }
}

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