import React, { useState, useEffect, useRef } from "react";
import { getSession, getSessionTags, updateRead } from "../service/chat";
import { useParams } from "react-router-dom";
import { App, Row, Col, Drawer, Button } from "antd";
import { MenuOutlined, MessageOutlined } from "@ant-design/icons";
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
import { useProfile } from "../components/context/profilecontext";

export default function ChatPage() {
    const { profile, setProfile } = useProfile();
    const [sessionTags, setSessionTags] = useState([]);
    const [session, setSession] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState('connecting');
    const [sessionMenuVisible, setSessionMenuVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);
    const { sessionid } = useParams();
    const sessionidRef = useRef(sessionid);
    const useridRef = useRef(null);
    const { message } = App.useApp();

    // 监听屏幕尺寸变化
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setIsMobile(width < 768);
            setIsTablet(width >= 768 && width < 1024);
            if(width >= 768) {
                setSessionMenuVisible(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
                        if(receivedMsg.id === parseInt(sessionidRef.current)) {
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

    // 会话侧边栏内容
    const SessionSidebar = () => (
        <div style={{
            height: isMobile ? 'auto' : '100%',
            background: '#fff',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <SessionStatus sessionTags={sessionTags} />
            
            <div style={{ 
                flex: 1, 
                overflow: 'auto',
                minHeight: isMobile ? '400px' : 'auto'
            }}>
                <SessionMenu sessionTags={sessionTags} />
            </div>
        </div>
    );

    if(!profile) {
        return (
            <CustomLayout content={
                <Loading />
            }/>
        )
    }

    return (
        <CustomLayout content={
            <div style={{ 
                height: isMobile ? 'calc(100vh - 64px - 69px)' : 'calc(105vh - 64px - 69px - 48px)',
                position: 'relative'
            }}>
                <ParticleBackground role={profile.role} />

                {/* 移动端布局 */}
                {isMobile ? (
                    <div style={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        background: '#fff',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        margin: '0 8px'
                    }}>
                        {/* 移动端头部 */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '12px 16px',
                            borderBottom: '1px solid #f0f0f0',
                            background: '#fff',
                            zIndex: 10
                        }}>
                            <Button
                                type="text"
                                icon={<MenuOutlined />}
                                onClick={() => setSessionMenuVisible(true)}
                                style={{
                                    marginRight: '12px',
                                    fontSize: '16px',
                                    color: '#595959'
                                }}
                            />
                            <div style={{ flex: 1 }}>
                                <ChatHeader session={session} />
                            </div>
                        </div>

                        {/* 消息显示区域 */}
                        <div style={{
                            flex: 1,
                            padding: '12px',
                            overflowY: 'auto',
                            background: '#fafafa',
                            zIndex: 1
                        }}>
                            <MessageDisplay session={session} />
                        </div>
                        
                        {/* 输入区域 */}
                        <div style={{
                            borderTop: '1px solid #f0f0f0',
                            background: '#fff',
                            zIndex: 10
                        }}>
                            <InputArea setSession={setSession} />
                        </div>

                        {/* 移动端抽屉 */}
                        <Drawer
                            title="会话列表"
                            placement="left"
                            onClose={() => setSessionMenuVisible(false)}
                            open={sessionMenuVisible}
                            width={280}
                            styles={{
                                body: { padding: 0 }
                            }}
                        >
                            <SessionSidebar />
                        </Drawer>
                    </div>
                ) : (
                    /* 桌面端和平板布局 */
                    <Row style={{ height: '100%' }} gutter={16}>
                        {/* 会话列表侧边栏 */}
                        <Col 
                            xs={0} 
                            sm={8} 
                            md={6} 
                            lg={5} 
                            xl={4} 
                            style={{ height: '100%' }}
                        >
                            <div style={{
                                height: '100%',
                                background: '#fff',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                borderRadius: '8px',
                                overflow: 'hidden'
                            }}>
                                <SessionSidebar />
                            </div>
                        </Col>
                        
                        {/* 聊天主区域 */}
                        <Col 
                            xs={24} 
                            sm={16} 
                            md={18} 
                            lg={19} 
                            xl={20} 
                            style={{ height: '100%' }}
                        >
                            <div style={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                background: '#fff',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                borderRadius: '8px',
                                overflow: 'hidden'
                            }}>
                                {/* 聊天头部 */}
                                <div style={{
                                    padding: isTablet ? '12px 16px' : '16px 20px',
                                    borderBottom: '1px solid #f0f0f0',
                                    background: '#fff'
                                }}>
                                    <ChatHeader session={session} />
                                </div>
                                
                                {/* 消息显示区域 */}
                                <div style={{
                                    flex: 1,
                                    padding: isTablet ? '12px' : '16px',
                                    overflowY: 'auto',
                                    background: '#fafafa'
                                }}>
                                    <MessageDisplay session={session} />
                                </div>
                                
                                {/* 输入区域 */}
                                <div style={{
                                    borderTop: '1px solid #f0f0f0',
                                    background: '#fff'
                                }}>
                                    <InputArea setSession={setSession} />
                                </div>
                            </div>
                        </Col>
                    </Row>
                )}
            </div>
        } />
    );
}