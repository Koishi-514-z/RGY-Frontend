import React, { useState, useEffect } from "react";
import CustomLayout from "../components/layout/customlayout";
import { useSearchParams } from "react-router-dom";
import { getPsyProfile } from "../service/user";
import PsyHomeLayout from "../components/layout/PsyHomeLayout";
import PsyProfileHeader from "../components/psy/psyprofileheader";
import Loading from "../components/loading";
import { getPrivateNotification, getPublicNotification } from "../service/notification";
import NotificationModal from "../components/home/notificationmodal";
import NotificationCard from "../components/home/notificationcard";
import PsyProfileCard from "../components/psy/psyprofilecard";
import PsyProfileEdit from "../components/psy/psyprofileedit";
import PsyAccountCard from "../components/psy/psyaccountcard";
import { getAvailableTimes, getCounseling } from "../service/counseling";
import CounselingCard from "../components/psy/counselingcard";
import { getCrisis } from "../service/crisis";
import CrisisHandlingCard from "../components/psy/crisishandlingcard";

export default function PsyHomePage() {
    const [profile, setProfile] = useState(null);
    const [privateNotifications, setPrivateNotifications] = useState([]); 
    const [publicNotifications, setPublicNotifications] = useState([]); 
    const [availableTimes, setAvailableTimes] = useState(null);
    const [counseling, setCounseling] = useState([]);
    const [crisisCases, setCrisisCases] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const tabKey = parseInt(searchParams.get('tabKey'));
    const [isModelOpen, setIsModelOpen] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            const fetched_profile = await getPsyProfile();
            const fetched_notifications_private = await getPrivateNotification();
            const fetched_notifications_public = await getPublicNotification();
            const fetched_times = await getAvailableTimes(fetched_profile.userid);
            const fetched_counseling = await getCounseling(fetched_profile.userid);
            const fetched_crisis = await getCrisis();
            setProfile(fetched_profile);
            setPrivateNotifications(fetched_notifications_private);
            setPublicNotifications(fetched_notifications_public);
            setAvailableTimes(fetched_times);
            setCounseling(fetched_counseling);
            setCrisisCases(fetched_crisis);
            if(!tabKey) {
                setSearchParams({tabKey: 1});
            }
        }
        fetch();
    }, []);

    const [update, setUpdate] = useState(0);
    useEffect(() => {
        const fetch = async () => {
            const fetched_profile = await getPsyProfile();
            setProfile(fetched_profile);
        }
        fetch();
    }, [update]);

    useEffect(() => {
        const setModal = () => {
            if(!profile) {
                setIsModelOpen(false);
                return;
            }
            if(publicNotifications.filter(item => item.priority === 'high').length || privateNotifications.filter(item => item.priority === 'high').length) {
                const storage = localStorage.getItem('notificationModal_' + profile.userid);
                const now = new Date();
                if(!storage) {
                    setIsModelOpen(true);
                    localStorage.setItem('notificationModal_' + profile.userid, JSON.stringify(now.getTime()));
                }
                const history = new Date(parseInt(storage));
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const historyDate = new Date(history.getFullYear(), history.getMonth(), history.getDate());
                if(today !== historyDate) {
                    setIsModelOpen(true);
                    localStorage.setItem('notificationModal_' + profile.userid, JSON.stringify(now.getTime()));
                }
            }
            else {
                setIsModelOpen(false);
            }
        }
        setModal();
    }, [profile, privateNotifications, publicNotifications, setIsModelOpen]);

    if(!profile || !availableTimes) {
        return (
            <CustomLayout role={2} content={
                <Loading />
            }/>
        )
    }

    const highPublic = publicNotifications.filter(item => item.priority === 'high');
    const highPrivate = privateNotifications.filter(item => item.priority === 'high');

    return (
        <CustomLayout role={2} update={update} content={
            <PsyHomeLayout
                header={<PsyProfileHeader profile={profile} />}
                modal={<NotificationModal isModelOpen={isModelOpen} setIsModelOpen={setIsModelOpen} highPublic={highPublic} highPrivate={highPrivate}/>}
                edit={<PsyProfileEdit profile={profile} setUpdate={setUpdate} />}
                view={<PsyAccountCard profile={profile} />} 
                profilecard={<PsyProfileCard profile={profile} />}
                conuseling={<CounselingCard availableTimes={availableTimes} setAvailableTimes={setAvailableTimes} counseling={counseling} />}
                notificationcard={<NotificationCard 
                    privateNotifications={privateNotifications} 
                    etPrivateNotifications={setPrivateNotifications} 
                    publicNotifications={publicNotifications} 
                />}
                crisis={<CrisisHandlingCard crisisCases={crisisCases} setCrisisCases={setCrisisCases} />}
                tabKey={tabKey}
            />
        } />
    )
}