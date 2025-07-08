import React, { useState, useEffect } from "react";
import CustomLayout from "../components/layout/customlayout";
import { getUserProfile } from "../service/user";
import { getPsyProfiles, getUserCounseling } from "../service/counseling";
import ViewCard from "../components/counseling/viewcard";
import Loading from "../components/loading";

export default function CounselingPage() {
    const [profile, setProfile] = useState(null);
    const [psyProfiles, setPsyProfiles] = useState([]);
    const [counseling, setCounseling] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            const fetched_profile = await getUserProfile();
            const fetched_psys = await getPsyProfiles();
            const fetched_counseling = await getUserCounseling();
            setProfile(fetched_profile);
            setPsyProfiles(fetched_psys);
            setCounseling(fetched_counseling);
        }
        fetch();
    }, []);

    if(!profile) {
        return (
            <CustomLayout content={
                <Loading />
            }/>
        )
    }

    return (
        <CustomLayout content={
            <ViewCard psyProfiles={psyProfiles} counseling={counseling} setPsyProfiles={setPsyProfiles} />
        }/>
    )
}