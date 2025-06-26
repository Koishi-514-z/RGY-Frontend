import {getJson, PREFIX} from "./common";

export async function getWeeklyData() {
    const url = `${PREFIX}/admin/statistic/mood/weekly`;
    let cartItems;
    try {
        cartItems = await getJson(url);
    } catch (e) {
        console.log(e);
        cartItems = null;
    }
    return cartItems;
}

export async function getMonthlyData() {
    const url = `${PREFIX}/admin/statistic/mood/monthly`;
    let cartItems;
    try {
        cartItems = await getJson(url);
    } catch (e) {
        console.log(e);
        cartItems = null;
    }
    return cartItems;
}

export async function getCrisisIntervention() {
    const url = `${PREFIX}/admin/crisisIntervention`;
    let cartItems;
    try {
        cartItems = await getJson(url);
    } catch (e) {
        console.log(e);
        cartItems = []
    }
    return cartItems;
}

export async function getConsultRequest() {
    const url = `${PREFIX}/admin/consultRequest`;
    let cartItems;
    try {
        cartItems = await getJson(url);
    } catch (e) {
        console.log(e);
        cartItems = []
    }
    return cartItems;
}