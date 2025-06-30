import ConsultRequestTable from "../components/admin/consult_request_table";
import {useEffect, useState} from "react";
import {getConsultRequest, getCrisisIntervention} from "../service/admin";
import CrisisInterventionTable from "../components/admin/crisis_intervention_table";
import CustomLayout from "../components/layout/customlayout";
import { Card, Divider } from "antd";


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

    return (
        <CustomLayout role={2} content={
            <div>
                <Card
                    style={{ 
                        borderRadius: '0px',
                        overflow: 'hidden',
                    }}
                >
                    <CrisisInterventionTable requests={requests1} />
                    <Divider/>
                    <ConsultRequestTable requests={requests2}/>
                </Card>
                
            </div>
        }/>
    );
}