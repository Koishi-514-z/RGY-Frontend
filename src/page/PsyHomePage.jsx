import React, { useState, useEffect, useRef } from "react";
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
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { App } from "antd";

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
    const [connectionStatus, setConnectionStatus] = useState('connecting');
    const useridRef = useRef(null);
    const { message } = App.useApp();

    const fetchCounseling = async () => {
        const fetched_counseling = await getCounseling(profile.userid);
        setCounseling(fetched_counseling);
    }

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
        useridRef.current = profile?.userid;
    }, [profile]);

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

    useEffect(() => {
        const socket = new SockJS("http://localhost:8080/ws");
        const client = Stomp.over(socket);
        
        setConnectionStatus('connecting');
        
        client.connect({}, 
            () => {
                setConnectionStatus('connected');
                client.subscribe("/user/queue/notifications/notify", async (msg) => {
                    try {
                        const receivedMsg = JSON.parse(msg.body);
                        console.log(receivedMsg);
                        if(receivedMsg.touserid !== useridRef.current) {
                            message.error('消息发送错误');
                            return;
                        }
                        const fetched_notifications_private = await getPrivateNotification();
                        const fetched_notifications_public = await getPublicNotification();
                        setPrivateNotifications(fetched_notifications_private);
                        setPublicNotifications(fetched_notifications_public);
                    } catch (error) {
                        console.error('处理消息失败:', error);
                    }
                });
            },
            (error) => {
                console.error('WebSocket连接失败:', error);
                setConnectionStatus('disconnected');
            }
        );
        
        return () => {
            if(client && client.connected) {
                client.disconnect();
            }
            setConnectionStatus('disconnected');
        };
    }, []);

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
                modal={<NotificationModal 
                    profile={profile}
                    isModelOpen={isModelOpen} 
                    setIsModelOpen={setIsModelOpen} 
                    highPublic={highPublic} 
                    highPrivate={highPrivate}/>}
                edit={<PsyProfileEdit profile={profile} setUpdate={setUpdate} />}
                view={<PsyAccountCard profile={profile} />} 
                profilecard={<PsyProfileCard profile={profile} />}
                conuseling={<CounselingCard 
                    availableTimes={availableTimes} 
                    setAvailableTimes={setAvailableTimes} 
                    counseling={counseling}
                    fetchCounseling={fetchCounseling} />}
                notificationcard={<NotificationCard 
                    privateNotifications={privateNotifications} 
                    setPrivateNotifications={setPrivateNotifications} 
                    publicNotifications={publicNotifications} 
                />}
                crisis={<CrisisHandlingCard crisisCases={crisisCases} setCrisisCases={setCrisisCases} />}
                tabKey={tabKey}
            />
        } />
    )
}