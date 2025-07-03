import React, { useState, useEffect, useRef } from "react";
import { getSession, getSessionTags, updateRead } from "../service/chat";
import { useParams } from "react-router-dom";
import { App, Row, Col } from "antd";
import SessionMenu from "../components/sessionmenu";
import CustomLayout from "../components/layout/customlayout";
import MessageDisplay from "../components/messagedisplay";
import InputArea from "../components/inputarea";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import ParticleBackground from "../components/layout/particlebackground";

export default function ChatPage() {
    const [sessionTags, setSessionTags] = useState([]);
    const [session, setSession] = useState(null);
    const [stompClient, setStompClient] = useState(null);
    const {sessionid} = useParams();
    const sessionidRef = useRef(sessionid);
    const { message } = App.useApp();

    const fetchSessionTags = async () => {
        const fetched_tags = await getSessionTags();
        setSessionTags(fetched_tags);
    }

    const fetchSession = async () => {
        const fetched_session = await getSession(sessionidRef.current);
        if(!fetched_session) {
            message.error('加载失败');
        }
        setSession(fetched_session);
    }

    useEffect(() => {
        sessionidRef.current = sessionid;
    }, [sessionid]);

    useEffect(() => {
        const socket = new SockJS("http://localhost:8080/ws");
        const client = Stomp.over(socket);
        client.connect({}, () => {
            client.subscribe("/user/queue/notifications", async (msg) => {
                const receivedMsg = JSON.parse(msg.body);
                if(receivedMsg.sessionid === parseInt(sessionidRef.current)) {
                    console.log(receivedMsg.sessionid);
                    console.log(sessionidRef.current);
                    const res = await updateRead(sessionidRef.current);
                    if(!res) {
                        message.error('更新失败');
                        return;
                    }
                    fetchSessionTags();
                    fetchSession();
                }
                else {
                    fetchSessionTags();
                }
            });
        });
        setStompClient(client);
        return () => client.disconnect();
    }, []);

    useEffect(() => {
        fetchSessionTags();
    }, []);

    useEffect(() => {
        const fetch = async () => {
            if(!sessionid) {
                setSession(null);
                return;
            }
            const res = await updateRead(sessionid);
            if(!res) {
                message.error('更新失败');
                return;
            }
            fetchSessionTags();
            fetchSession();
        }
        fetch();
    }, [sessionid]);

    return (
        <CustomLayout content={
            <Row gutter={[24, 24]} style={{ height: 'calc(110vh - 64px - 69px - 48px)' }}>
                <ParticleBackground />
                <Col xs={24} sm={8} md={6} lg={5} xl={4} style={{ height: '100%' }}>
                    <div style={{ 
                        height: '100%', 
                        background: '#fff', 
                        boxShadow: '0 2px 8px rgba(0,0,0,0.09)',
                        borderRadius: '4px',
                        overflow: 'hidden'
                    }}>
                        <SessionMenu sessionTags={sessionTags} />
                    </div>
                </Col>
                
                <Col xs={24} sm={16} md={18} lg={19} xl={20} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ 
                        flex: 1, 
                        overflowY: 'auto',
                        background: '#fff',
                        borderRadius: '4px',
                        padding: '16px',
                        marginBottom: '16px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.09)'
                    }}>
                        <MessageDisplay session={session} />
                    </div>
                    
                    <div style={{ 
                        background: '#fff',
                        borderRadius: '4px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.09)'
                    }}>
                        <InputArea setSession={setSession} />
                    </div>
                </Col>
            </Row>
        }/>
    )
}