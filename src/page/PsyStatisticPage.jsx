import React, { useState, useEffect } from "react";
import CustomLayout from "../components/layout/customlayout";
import { getPsyProfile } from "../service/user";
import StatisticCard from "../components/psy/statisticcard";
import Loading from "../components/loading";

export default function PsyStatisticPage() {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            const fetched_profile = await getPsyProfile();
            setProfile(fetched_profile);
        }
        fetch();
    }, []);

    if(!profile) {
        return (
            <CustomLayout role={2} content={
                <Loading />
            }/>
        )
    }

    return (
        <CustomLayout role={2} content={
            <StatisticCard />
        }/>
    );
}