import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPsySingle } from "../service/counseling";
import CustomLayout from "../components/layout/customlayout";
import DetailCard from "../components/counseling/detailcard";
import Loading from "../components/loading";

export default function CounselingDetailPage() {
    const [psyProfile, setPsyProfile] = useState(null);
    const { psyid } = useParams();

    useEffect(() => {
        const fetch = async () => {
            const fetched_psy = await getPsySingle(psyid);
            setPsyProfile(fetched_psy);
        }
        fetch();
    }, [psyid]);

    if(!psyProfile) {
        return (
            <CustomLayout content={
                <Loading />
            }/>
        )
    }

    return (
        <CustomLayout content={
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                padding: '0 20px' 
            }}>
                <DetailCard psyProfile={psyProfile} />
            </div>
        }/>
    )
}