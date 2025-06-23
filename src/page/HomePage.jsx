import React, { useState, useEffect } from "react";
import CustomLayout from "../components/layout/customlayout";
import { getUserProfile } from "../service/user";
import ProfileEdit from "../components/profileedit";
import ProfileView from "../components/profileview";
import Loading from "../components/loading";
import { Card } from "antd";

export default function HomePage() {
    const [profile, setProfile] = useState(null);
    const [editting, setEditting] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            const fetched_profile = await getUserProfile();
            console.log(fetched_profile);
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
                <div style={{ maxWidth: '750px', margin: '0 auto', padding: '24px' }}>
                    <Card 
                        style={{ 
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            borderRadius: '12px',
                            overflow: 'hidden'
                        }}
                    >
                        <ProfileView profile={profile} setEditting={setEditting} /> 
                    </Card>
                </div> 
            )    
                
        }/>
    )

    /*
        user: {
            password: 
            profile: {
                userid:
                stuid:
                username:
                email:
                avatar:
            }
        }
    */
}