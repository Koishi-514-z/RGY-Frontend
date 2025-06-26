import ConsultRequestTable from "../components/admin_stats/consult_request_table";
import {useEffect, useState} from "react";
import {getConsultRequest, getCrisisIntervention} from "../service/admin";
import CrisisInterventionTable from "../components/admin_stats/crisis_intervention_table";


export default function AdminConsultPage() {
    const requests1 = [
        {
            id: 1,
            userid: "user1",
            timestamp: "2023-10-02T12:00:00Z",
        },
        {
            id: 2,
            userid: "user2",
            timestamp: "2023-10-03T14:30:00Z",
        },
    ];
    const requests2 = [
        {
            id: 1,
            timestamp: "2023-10-01T12:00:00Z",
        },
        {
            id: 2,
            timestamp: "2023-10-02T14:30:00Z",
        },
    ];
    // const [requests1,setRequests1] = useState([]);
    // const [requests2,setRequests2] = useState([]);
    // useEffect(() => {
    //     const fetchRequests = async () => {
    //         let requests1 = await getConsultRequest();
    //         setRequests1(requests1);
    //         let requests2 = await getCrisisIntervention();
    //         setRequests2(requests2);
    //     };
    //
    //     fetchRequests();
    // }, []);

    return (<>
        <CrisisInterventionTable requests={requests1} />
        <ConsultRequestTable requests={requests2}/>
    </>
    );
}