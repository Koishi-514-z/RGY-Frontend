import {post, PREFIX} from "./common";

export async function placeCallBackRequest(orderInfo) {
    const url = `${PREFIX}/placeCallBackRequest`;
    let res;
    try {
        res = post(url, orderInfo);
    } catch (e) {
        console.log(e);
        res = null;
    }
    return res;
}