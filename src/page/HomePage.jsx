import React, { useState, useEffect } from "react";
import CustomLayout from "../components/layout/customlayout";
import { getIntimateUsers, getUserProfile, getSimplifiedProfile } from "../service/user";
import ProfileEdit from "../components/home/profileedit";
import ProfileView from "../components/home/profileview";
import ProfileHeader from "../components/home/profileheader";
import Loading from "../components/loading";
import HomeLayout from "../components/layout/homelayout";
import EmotionCard from "../components/home/emotioncard";
import BlogCard from "../components/home/blogcard";
import IntimateCard from "../components/home/intimatecard";
import { getEmotion, getMonthData, getWeekData } from "../service/emotion";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { getCommentBlogs, getLikeBlogs, getBlogs } from "../service/blog";
import EmotionGragh from "../components/home/emotiongragh";
import { getPrivateNotification, getPublicNotification } from "../service/notification";
import NotificationCard from "../components/home/notificationcard";
import NotificationModal from "../components/home/notificationmodal";

export default function HomePage() {
    const [profile, setProfile] = useState(null);
    const [emotion, setEmotion] = useState(null);
    const [intimateUsers, setIntimateUsers] = useState([]);
    const [myBlogs, setMyBlogs] = useState([]);
    const [likeBlogs, setLikeBlogs] = useState([]);
    const [commentBlogs, setCommentBlogs] = useState([]);
    const [weekData, setWeekData] = useState([]);
    const [monthData, setMonthData] = useState([]);
    const [privateNotifications, setPrivateNotifications] = useState([]); 
    const [publicNotifications, setPublicNotifications] = useState([]); 
    const [isModelOpen, setIsModelOpen] = useState(false);
    const {userid} = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const tabKey = parseInt(searchParams.get('tabKey'));
    const navigate = useNavigate();

    useEffect(() => {
        const fetch = async () => {
            if(userid) {
                const me = await getUserProfile();
                if(me.userid === userid) {
                    navigate(`/home?tabKey=${1}`);
                }
                const fetched_profile = await getSimplifiedProfile(userid);
                const fetched_blogs = await getBlogs(userid);
                const fetched_blogs_like = await getLikeBlogs(userid);
                const fetched_blogs_comment = await getCommentBlogs(userid);
                setProfile(fetched_profile);
                setEmotion(null);
                setIntimateUsers(null);
                setWeekData([]);
                setMonthData([]);
                setMyBlogs(fetched_blogs);
                setLikeBlogs(fetched_blogs_like);
                setCommentBlogs(fetched_blogs_comment);
                setPrivateNotifications([]);
                setPublicNotifications([]);
                if(!tabKey) {
                    setSearchParams({tabKey: 2});
                }
            }
            else {
                const fetched_profile = await getUserProfile();
                const fetched_emotion = await getEmotion();
                const fetched_users = await getIntimateUsers();
                const fetched_blogs = await getBlogs(fetched_profile.userid);
                const fetched_blogs_like = await getLikeBlogs(fetched_profile.userid);
                const fetched_blogs_comment = await getCommentBlogs(fetched_profile.userid);
                const fetched_week = await getWeekData();
                const fetched_month = await getMonthData();
                const fetched_notifications_private = await getPrivateNotification();
                const fetched_notifications_public = await getPublicNotification();
                setProfile(fetched_profile);
                setEmotion(fetched_emotion);
                setIntimateUsers(fetched_users);
                setMyBlogs(fetched_blogs);
                setLikeBlogs(fetched_blogs_like);
                setCommentBlogs(fetched_blogs_comment);
                setWeekData(fetched_week);
                setMonthData(fetched_month);
                setPrivateNotifications(fetched_notifications_private);
                setPublicNotifications(fetched_notifications_public);
                if(!tabKey) {
                    setSearchParams({tabKey: 1});
                }
            }
        }
        fetch();
    }, [userid]);

    const [update, setUpdate] = useState(0);
    useEffect(() => {
        const fetch = async () => {
            if(userid) {
                return;
            }
            const fetched_profile = await getUserProfile();
            setProfile(fetched_profile);
        }
        fetch();
    }, [update]);

    useEffect(() => {
        const setModal = () => {
            if(userid || !profile) {
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

    if(!profile || (!userid && !emotion)) {
        return (
            <CustomLayout content={
                <Loading />
            }/>
        )
    }

    const highPublic = publicNotifications.filter(item => item.priority === 'high');
    const highPrivate = privateNotifications.filter(item => item.priority === 'high');

    return (
        <CustomLayout update={update} content={
            <HomeLayout 
                header={<ProfileHeader profile={profile} id={userid} />} 
                modal={<NotificationModal isModelOpen={isModelOpen} setIsModelOpen={setIsModelOpen} highPublic={highPublic} highPrivate={highPrivate}/>}
                edit={<ProfileEdit profile={profile} setUpdate={setUpdate} />} 
                view={<ProfileView profile={profile} />} 
                emotionCard={<EmotionCard emotion={emotion} />} 
                intimateCard={<IntimateCard intimateUsers={intimateUsers} />} 
                blogCard={<BlogCard myBlogs={myBlogs} likeBlogs={likeBlogs} commentBlogs={commentBlogs} profile={profile} />} 
                emotionGraph={<EmotionGragh weekData={weekData} monthData={monthData} />} 
                notificationcard={<NotificationCard privateNotifications={privateNotifications} setPrivateNotifications={setPrivateNotifications} publicNotifications={publicNotifications} />}
                tabKey={tabKey} 
            />
        }/>
    )

    /*
        user: {
            password: 
            stuid:
            profile: {
                userid:     *
                username:   *
                email:
                avatar:     *
                note:       *
                role:
            }
        }

        emotion: {
            emotionid:
            userid:
            timestamp:
            tag: {
                id:
                content:
            }
            score:
        }

        diary: {
            diaryid:
            userid:
            timestamp:
            label: (0->positive  1->neutral  2->negative)
            content:
        }

        blog: {
            blogid:
            userid:
            timestamp:
            likeNum:
            title:
            cover:
            content:
            tag[]
            reply[]

            reply: {
                replyid:
                blogid:
                userid:
                timestamp:
                content:
            }
        }

        urlData: {
            urlid:
            type: (music/article)
            title:
            img:
            description:
            url:
        }

        session: {
            sessionid:
            myself:  (id in database)   (simplified)
            other:  (id in database)   (simplified)
            timestamp: (最近一次私信的时间)
            unread: 
            messages[]

            message: {
                messageid:
                role: (0->myself, 1->other)
                timestamp
                content
            }
        }

        AIsession: {
            sessionid: 
            timestamp: (最近一次聊天的时间)
            messages[]

            message: {
                role:
                content:
            }
        }
    */
}