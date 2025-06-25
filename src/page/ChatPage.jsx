import React, { useState, useEffect } from "react";
import { getSession, getSessionTags } from "../service/chat";
import { useParams } from "react-router-dom";
import { App } from "antd";
import SessionMenu from "../components/sessionmenu";
import CustomLayout from "../components/layout/customlayout";
import MessageDisplay from "../components/messagedisplay";
import InputArea from "../components/inputarea";

export default function ChatPage() {
    const [sessionTags, setSessionTags] = useState([]);
    const [session, setSession] = useState(null);
    const {sessionid} = useParams();
    const { message } = App.useApp();

    useEffect(() => {
        const fetch = async () => {
            const fetched_tags = await getSessionTags();
            setSessionTags(fetched_tags);
        }
        fetch();
    }, []);

    useEffect(() => {
        const fetch = async () => {
            if(!sessionid) {
                setSession(null);
                return;
            }
            const fetched_session = await getSession(sessionid);
            if(!fetched_session) {
                message.error('加载失败');
            }
            setSession(fetched_session);
        }
        fetch();
    }, [sessionid]);

    return (
        <CustomLayout content={
            <div>
                <SessionMenu sessionTags={sessionTags} />
                <MessageDisplay session={session} />
                <InputArea setSession={setSession} />
            </div>
        }/>
        
    )
}