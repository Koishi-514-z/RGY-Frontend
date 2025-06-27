import React, { useState, useEffect } from "react";
import CustomLayout from "../components/layout/customlayout";
import { getIntimateUsers, getUserProfile, getSimplifiedProfile } from "../service/user";
import ProfileEdit from "../components/profileedit";
import ProfileView from "../components/profileview";
import ProfileHeader from "../components/profileheader";
import Loading from "../components/loading";
import HomeLayout from "../components/layout/homelayout";
import EmotionCard from "../components/emotioncard";
import BlogCard from "../components/blogcard";
import IntimateCard from "../components/intimatecard";
import { getEmotion, getMonthData, getWeekData } from "../service/emotion";
import { useParams, useNavigate } from "react-router-dom";
import { getCommentBlogs, getLikeBlogs, getBlogs } from "../service/blog";
import EmotionGragh from "../components/emotiongragh";

export default function HomePage() {
    const [profile, setProfile] = useState(null);
    const [emotion, setEmotion] = useState(null);
    const [intimateUsers, setIntimateUsers] = useState([]);
    const [myBlogs, setMyBlogs] = useState([]);
    const [likeBlogs, setLikeBlogs] = useState([]);
    const [commentBlogs, setCommentBlogs] = useState([]);
    const [weekData, setWeekData] = useState([]);
    const [monthData, setMonthData] = useState([]);
    const {userid} = useParams();
    const [tabKey, setTabKey] = useState(userid ? 2 : 1);
    const navigate = useNavigate();

    useEffect(() => {
        const fetch = async () => {
            if(userid) {
                const me = await getUserProfile();
                if(me.userid === userid) {
                    navigate(`/home`);
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
                setTabKey(2);
                setMyBlogs(fetched_blogs);
                setLikeBlogs(fetched_blogs_like);
                setCommentBlogs(fetched_blogs_comment);
            }
            else {
                const fetched_profile = await getUserProfile();
                if(fetched_profile.role === 1) {
                    navigate(`/admin/stats`);
                }
                const fetched_emotion = await getEmotion();
                const fetched_users = await getIntimateUsers();
                const fetched_blogs = await getBlogs(fetched_profile.userid);
                const fetched_blogs_like = await getLikeBlogs(fetched_profile.userid);
                const fetched_blogs_comment = await getCommentBlogs(fetched_profile.userid);
                const fetched_week = await getWeekData();
                const fetched_month = await getMonthData();
                setProfile(fetched_profile);
                setEmotion(fetched_emotion);
                setIntimateUsers(fetched_users);
                setTabKey(1);
                setMyBlogs(fetched_blogs);
                setLikeBlogs(fetched_blogs_like);
                setCommentBlogs(fetched_blogs_comment);
                setWeekData(fetched_week);
                setMonthData(fetched_month);
            }
        }
        fetch();
    }, [userid]);

    if(!profile || (!userid && !emotion)) {
        return (
            <CustomLayout content={
                <Loading />
            }/>
        )
    }

    return (
        <CustomLayout content={
            <HomeLayout 
                header={<ProfileHeader profile={profile} tabKey={tabKey} setTabKey={setTabKey} id={userid} />} 
                edit={<ProfileEdit profile={profile} setProfile={setProfile} setTabKey={setTabKey} />} 
                view={<ProfileView profile={profile} />} 
                emotionCard={<EmotionCard emotion={emotion} />} 
                intimateCard={<IntimateCard intimateUsers={intimateUsers} />} 
                blogCard={<BlogCard myBlogs={myBlogs} likeBlogs={likeBlogs} commentBlogs={commentBlogs} />} 
                emotionGraph={<EmotionGragh weekData={weekData} monthData={monthData} />} 
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
    */
}