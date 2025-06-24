import React, { useState, useEffect } from "react";
import CustomLayout from "../components/layout/customlayout";
import { getUserProfile } from "../service/user";
import ProfileEdit from "../components/profileedit";
import ProfileView from "../components/profileview";
import ProfileHeader from "../components/profileheader";
import Loading from "../components/loading";
import HomeLayout from "../components/layout/homelayout";
import EmotionCard from "../components/emotioncard";
import { Card, Row, Col, Space } from "antd";
import { getEmotion } from "../service/emotion";

export default function HomePage() {
    const [profile, setProfile] = useState(null);
    const [emotion, setEmotion] = useState(null);
    const [editting, setEditting] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            const fetched_profile = await getUserProfile();
            const fetched_emotion = await getEmotion();
            setProfile(fetched_profile);
            setEmotion(fetched_emotion);
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
            <HomeLayout 
                editting={editting} 
                content_edit={
                    <div style={{ maxWidth: '750px', margin: '0 auto', padding: '24px' }}>
                        <Card 
                            style={{ 
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                borderRadius: '12px',
                                overflow: 'hidden'
                            }}
                        >
                            <ProfileEdit profile={profile} setProfile={setProfile} setEditting={setEditting} />
                        </Card>
                    </div> 
                }
                content_view={
                    <div style={{ margin: '0 auto', padding: '24px' }}>
                        <Row gutter={[24, 24]}>
                            <Col span={24}>
                                <ProfileHeader profile={profile} setEditting={setEditting} />
                            </Col>
                        </Row>
                        <Row gutter={[24, 24]}>
                            <Col span={16}>
                                <EmotionCard emotion={emotion} />
                            </Col>

                            <Col span={8}>
                                <ProfileView profile={profile} /> 
                            </Col>
                        </Row>
                    </div>
                }
            />
        }/>
    )

    /*
        user: {
            password: 
            stuid:
            profile: {
                userid:
                username:
                email:
                avatar:
                note:
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
            label: (positive/neutral/negative)
            content:
        }

        blog: {
            blogid:
            userid:
            timestamp:
            likeNum:
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
    */
}