import React, { useState, useEffect } from "react";
import CustomLayout from "../components/layout/customlayout";
import { getUserProfile } from "../service/user";
import ProfileEdit from "../components/profileedit";
import ProfileView from "../components/profileview";
import ProfileHeader from "../components/profileheader";
import Loading from "../components/loading";
import { Card } from "antd";

export default function HomePage() {
    const [profile, setProfile] = useState(null);
    const [editting, setEditting] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            const fetched_profile = await getUserProfile();
            setProfile(fetched_profile);
        }
        fetch();
    }, []);

    if(!profile) {
        return (
            <Loading/>
        )
    }

    return (
        <CustomLayout content={
            editting ? 
            (
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
            ) : 
            (
                <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
                    <ProfileHeader profile={profile} setEditting={setEditting} />
                    <ProfileView profile={profile} /> 
                </div>
            )    
                
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
            }
        }

        emotion: {
            emotionid:
            tag: {
                id:
                content:
            }
            userid:
            timestamp:
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
    */
}