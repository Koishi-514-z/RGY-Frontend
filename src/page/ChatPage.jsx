import React, { useState, useEffect, useRef } from "react";
import { getSession, getSessionTags, updateRead } from "../service/chat";
import { useParams } from "react-router-dom";
import { App, Row, Col } from "antd";
import SessionMenu from "../components/chat/sessionmenu";
import CustomLayout from "../components/layout/customlayout";
import MessageDisplay from "../components/chat/messagedisplay";
import InputArea from "../components/chat/inputarea";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import ParticleBackground from "../components/layout/particlebackground";
import ChatHeader from "../components/chat/chatheader";
import SessionStatus from "../components/chat/sessionstatus";
import { getUserProfile } from "../service/user";
import Loading from "../components/loading";

export default function ChatPage() {
    const [profile, setProfile] = useState(null);
    const [sessionTags, setSessionTags] = useState([]);
    const [session, setSession] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState('connecting');
    const { sessionid } = useParams();
    const sessionidRef = useRef(sessionid);
    const useridRef = useRef(null);
    const { message } = App.useApp();

    const fetchSessionTags = async () => {
        try {
            const fetched_tags = await getSessionTags();
            setSessionTags(fetched_tags);
        } catch (error) {
            console.error('获取会话列表失败:', error);
        }
    };

    const fetchSession = async () => {
        try {
            const fetched_session = await getSession(sessionidRef.current);
            if (!fetched_session) {
                message.error('加载会话失败');
                return;
            }
            console.log(fetched_session);
            setSession(fetched_session);
        } catch (error) {
            console.error('获取会话详情失败:', error);
            message.error('加载会话失败');
        }
    };

    useEffect(() => {
        sessionidRef.current = sessionid;
    }, [sessionid]);

    useEffect(() => {
        useridRef.current = profile?.userid;
    }, [profile]);

    useEffect(() => {
        const socket = new SockJS("https://localhost:8443/ws");
        const client = Stomp.over(socket);
        
        setConnectionStatus('connecting');
        
        client.connect({}, 
            () => {
                setConnectionStatus('connected');
                client.subscribe("/user/queue/notifications/chat", async (msg) => {
                    try {
                        const receivedMsg = JSON.parse(msg.body);
                        console.log(receivedMsg);
                        if(receivedMsg.touserid !== useridRef.current) {
                            message.error('消息发送错误');
                            return;
                        }
                        if (receivedMsg.id === parseInt(sessionidRef.current)) {
                            const res = await updateRead(sessionidRef.current);
                            if (!res) {
                                message.error('更新失败');
                                return;
                            }
                            fetchSessionTags();
                            fetchSession();
                        } else {
                            fetchSessionTags();
                        }
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

    useEffect(() => {
        fetchSessionTags();
    }, []);

    useEffect(() => {
        const fetch = async () => {
            if (!sessionid) {
                setSession(null);
                return;
            }
            try {
                const res = await updateRead(sessionid);
                if (!res) {
                    message.error('更新失败');
                    return;
                }
                fetchSessionTags();
                fetchSession();
            } catch (error) {
                console.error('更新会话失败:', error);
            }
        };
        fetch();
    }, [sessionid]);

    useEffect(() => {
        const fetch = async () => {
            const fetched_profile = await getUserProfile();
            setProfile(fetched_profile);
        }
        fetch();
    }, []);

    if(!profile) {
        return (
            <CustomLayout role={0} content={
                <Loading />
            }/>
        )
    }

    return (
        <CustomLayout role={profile.role} content={
            <div style={{ height: 'calc(110vh - 64px - 69px - 48px)' }}>
                <ParticleBackground role={profile.role} />

                <Row style={{ height: '100%' }}>
                    <Col xs={24} sm={8} md={6} lg={5} xl={4} style={{ height: '100%' }}>
                        <div style={{
                            height: '100%',
                            background: '#fff',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <SessionStatus sessionTags={sessionTags} />
                            
                            <div style={{ flex: 1, overflow: 'auto' }}>
                                <SessionMenu sessionTags={sessionTags} />
                            </div>
                        </div>
                    </Col>
                    
                    <Col xs={24} sm={16} md={18} lg={19} xl={20} style={{ height: '100%' }}>
                        <div style={{
                            height: '100%',
                            marginLeft: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            background: '#fff',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            borderRadius: '8px',
                            overflow: 'hidden'
                        }}>
                            <ChatHeader session={session} />
                            
                            <div style={{
                                flex: 1,
                                padding: '16px',
                                overflowY: 'auto',
                                background: '#fafafa'
                            }}>
                                <MessageDisplay session={session} />
                            </div>
                            
                            <div style={{
                                borderTop: '1px solid #f0f0f0',
                                background: '#fff'
                            }}>
                                <InputArea setSession={setSession} />
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        } />
    );
}