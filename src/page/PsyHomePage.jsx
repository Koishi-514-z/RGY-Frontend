import React, { useState, useEffect, useRef } from "react";
import CustomLayout from "../components/layout/customlayout";
import { useSearchParams } from "react-router-dom";
import { getPsyProfile } from "../service/user";
import PsyHomeLayout from "../components/layout/PsyHomeLayout";
import PsyProfileHeader from "../components/psy/psyprofileheader";
import Loading from "../components/loading";
import { getNotification } from "../service/notification";
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

    const fetchCounseling = async () => {
        const fetched_counseling = await getCounseling(profile.userid);
        setCounseling(fetched_counseling);
    }

    useEffect(() => {
        const fetch = async () => {
            const fetched_profile = await getPsyProfile();
            const fetched_times = await getAvailableTimes(fetched_profile.userid);
            const fetched_counseling = await getCounseling(fetched_profile.userid);
            const fetched_crisis = await getCrisis();
            setProfile(fetched_profile);
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

    const fetchNotification = async () => {
        const fetched_notification = await getNotification();
        const fetched_private = fetched_notification.filter(notify => notify.type < 1000);
        const fetched_public = fetched_notification.filter(notify => notify.type >= 1000);
        setPrivateNotifications(fetched_private);
        setPublicNotifications(fetched_public);
    }

    useEffect(() => {
        fetchNotification();
    }, []);

    useEffect(() => {
        const setModal = () => {
            if(!profile) {
                setIsModelOpen(false);
                return;
            }
            const unreadAndHighPublic = publicNotifications.filter(item => item.priority === 'high' && item.unread);
            const unreadAndHighPrivate = privateNotifications.filter(item => item.priority === 'high' && item.unread);
            if(unreadAndHighPublic.length || unreadAndHighPrivate.length) {
                const storage = localStorage.getItem('notificationModal_' + profile.userid);
                const now = new Date();
                if(!storage) {
                    setIsModelOpen(true);
                }
                const history = new Date(parseInt(storage));
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const historyDate = new Date(history.getFullYear(), history.getMonth(), history.getDate());
                if(today.getTime() !== historyDate.getTime()) {
                    setIsModelOpen(true);
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

    const unreadAndHighPublic = publicNotifications.filter(item => item.priority === 'high' && item.unread);
    const unreadAndHighPrivate = privateNotifications.filter(item => item.priority === 'high' && item.unread);

    return (
        <CustomLayout role={2} update={update} content={
            <PsyHomeLayout
                header={<PsyProfileHeader profile={profile} />}
                modal={<NotificationModal 
                    profile={profile}
                    isModelOpen={isModelOpen} 
                    setIsModelOpen={setIsModelOpen} 
                    highPublic={unreadAndHighPublic} 
                    highPrivate={unreadAndHighPrivate}
                />}
                edit={<PsyProfileEdit profile={profile} setUpdate={setUpdate} />}
                view={<PsyAccountCard profile={profile} />} 
                profilecard={<PsyProfileCard profile={profile} />}
                conuseling={<CounselingCard 
                    availableTimes={availableTimes} 
                    setAvailableTimes={setAvailableTimes} 
                    counseling={counseling}
                    fetchCounseling={fetchCounseling} 
                />}
                notificationcard={<NotificationCard 
                    privateNotifications={privateNotifications} 
                    publicNotifications={publicNotifications} 
                    fetchNotification={fetchNotification}
                />}
                crisis={<CrisisHandlingCard crisisCases={crisisCases} setCrisisCases={setCrisisCases} />}
                tabKey={tabKey}
            />
        } />
    )
}