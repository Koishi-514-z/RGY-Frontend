import React, { useState, useEffect, useRef } from "react";
import CustomLayout from "../components/layout/customlayout";
import { getIntimateUsers, getUserProfile, getSimplifiedProfile, getMilestone } from "../service/user";
import ProfileEdit from "../components/home/profileedit";
import ProfileView from "../components/home/profileview";
import ProfileHeader from "../components/home/profileheader";
import HomeLayout from "../components/layout/homelayout";
import EmotionCard from "../components/home/emotioncard";
import BlogCard from "../components/home/blogcard";
import IntimateCard from "../components/home/intimatecard";
import { getEmotion, getMonthData, getWeekData } from "../service/emotion";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { getCommentBlogs, getLikeBlogs, getBlogs } from "../service/blog";
import EmotionGragh from "../components/home/emotiongragh";
import { getNotification } from "../service/notification";
import NotificationCard from "../components/home/notificationcard";
import NotificationModal from "../components/home/notificationmodal";
import BlogCardOther from "../components/home/blogcardother";
import { useProfile } from "../components/context/profilecontext";
import { useNotification } from "../components/context/notificationcontext";
import EmotionHistoryCard from "../components/home/emotionhistorycard";
import ProcessLine from "../components/home/processline";

export default function HomePage() {
    const { profile, setProfile } = useProfile();
    const { privateNotifications, setPrivateNotifications, publicNotifications, setPublicNotifications } = useNotification();
    const [other, setOther] = useState(null);
    const [emotion, setEmotion] = useState(null);
    const [intimateUsers, setIntimateUsers] = useState([]);
    const [myBlogs, setMyBlogs] = useState([]);
    const [otherBlogs, setOtherBlogs] = useState([]);
    const [likeBlogs, setLikeBlogs] = useState([]);
    const [commentBlogs, setCommentBlogs] = useState([]);
    const [weekData, setWeekData] = useState([]);
    const [monthData, setMonthData] = useState([]);
    const [milestones, setMilestones] = useState([]);
    const [loadedTabs, setLoadedTabs] = useState([]);
    const [isModelOpen, setIsModelOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const {userid} = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const tabKey = parseInt(searchParams.get('tabKey'));
    const navigate = useNavigate();

    // 加载个人信息
    useEffect(() => {
        const fetch = async () => {
            const fetched_profile = await getUserProfile();
            setProfile(fetched_profile);
        }
        fetch();
    }, []);

    // 加载他人主页数据
    useEffect(() => {
        const fetch = async () => {
            if(userid) {
                const me = await getUserProfile();
                if(me.userid === userid) {
                    navigate(`/home?tabKey=${1}`);
                }
                if(!tabKey) {
                    setSearchParams({tabKey: 2});
                }
                setLoading(true);
                const fetched_other = await getSimplifiedProfile(userid);
                const fetched_blogs = await getBlogs(userid);
                setOther(fetched_other);
                setOtherBlogs(fetched_blogs);
                setLoading(false);
            }
        }
        fetch();
    }, [userid]);

    // 加载“个人中心”
    useEffect(() => {
        const fetch = async () => {
            if(!tabKey) {
                setSearchParams({tabKey: 1});
            }
            if(userid || tabKey !== 1 || loadedTabs.includes(1)) {
                return;
            }
            loadedTabs.push(1);
            setLoading(true);
            const fetched_emotion = await getEmotion();
            const fetched_users = await getIntimateUsers();
            setEmotion(fetched_emotion);
            setIntimateUsers(fetched_users);
            setLoading(false);
        }
        fetch();
    }, [userid, tabKey]);

    // 加载“我的博客”
    useEffect(() => {
        const fetch = async () => {
            if(userid || tabKey !== 2 || loadedTabs.includes(2) || !profile.userid) {
                return;
            }
            loadedTabs.push(2);
            setLoading(true);
            const fetched_blogs = await getBlogs(profile.userid);
            const fetched_blogs_like = await getLikeBlogs(profile.userid);
            const fetched_blogs_comment = await getCommentBlogs(profile.userid);
            setMyBlogs(fetched_blogs);
            setLikeBlogs(fetched_blogs_like);
            setCommentBlogs(fetched_blogs_comment);
            setLoading(false);
        }
        fetch();
    }, [userid, tabKey, profile]);

    // 加载“成长轨迹”
    useEffect(() => {
        const fetch = async () => {
            if(userid || tabKey !== 5 || loadedTabs.includes(5)) {
                return;
            }
            loadedTabs.push(5);
            setLoading(true);
            const fetched_week = await getWeekData();
            const fetched_month = await getMonthData();
            const fetched_data = await getMilestone();
            setWeekData(fetched_week);
            setMonthData(fetched_month);
            setMilestones(fetched_data.milestones);
            setLoading(false);
        }
        fetch();
    }, [userid, tabKey]);

    const fetchNotification = async () => {
        const fetched_notification = await getNotification();
        const fetched_private = fetched_notification.filter(notify => notify.type < 1000);
        const fetched_public = fetched_notification.filter(notify => notify.type >= 1000);
        setPrivateNotifications(fetched_private);
        setPublicNotifications(fetched_public);
    }

    // 加载通知
    useEffect(() => {
        if(userid) {
            return;
        }
        fetchNotification();
    }, [userid]);

    useEffect(() => {
        const setModal = () => {
            if(userid || !profile) {
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

    return (
        <CustomLayout content={
            <HomeLayout 
                header={<ProfileHeader profile={userid ? other : profile} id={userid} />} 
                modal={<NotificationModal isModelOpen={isModelOpen} setIsModelOpen={setIsModelOpen} />}
                edit={<ProfileEdit />} 
                view={<ProfileView />} 
                emotionCard={<EmotionCard emotion={emotion} />} 
                intimateCard={<IntimateCard intimateUsers={intimateUsers} />} 
                blogCard={!userid ? <BlogCard myBlogs={myBlogs} likeBlogs={likeBlogs} commentBlogs={commentBlogs} profile={profile} loading={loading}/> : 
                                <BlogCardOther myBlogs={otherBlogs} profile={other} loading={loading} />} 
                emotionGraph={<EmotionGragh weekData={weekData} monthData={monthData} />} 
                historyCard={<EmotionHistoryCard />}
                timeline={<ProcessLine milestones={milestones} />}
                notificationcard={<NotificationCard />}
                tabKey={tabKey} 
            />
        }/>
    )
}