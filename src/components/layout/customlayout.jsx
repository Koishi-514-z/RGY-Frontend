import React, { useEffect, useRef, useState } from "react";
import { Typography, Layout, Avatar, Space, App, Button, Drawer } from 'antd';
import { UserOutlined, MenuOutlined } from '@ant-design/icons';
import Navbar from "../navbar";
import NavbarCounselor from "../admin/navbarcounselor";
import { getUserProfile } from "../../service/user";
import NavbarAdmin from "../admin/navbaradmin";
import MessageInfromer from "../messageinfromer";
import UserHeader from "../userheader";
import { useProfile } from "../context/profilecontext";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { useNotification } from "../context/notificationcontext";
import { getNotification } from "../../service/notification";

const { Header, Content, Sider, Footer } = Layout;
const { Title, Text } = Typography;

export default function CustomLayout({content}) {
    const { profile, setProfile } = useProfile();
    const { setPrivateNotifications, setPublicNotifications } = useNotification();
    const useridRef = useRef(null);
    const [connectionStatus, setConnectionStatus] = useState('connecting');
    const [siderVisible, setSiderVisible] = useState(false);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
    const { message } = App.useApp();

    // 监听屏幕尺寸变化
    useEffect(() => {
        const handleResize = () => {
            const desktop = window.innerWidth >= 1024;
            setIsDesktop(desktop);
            if(desktop) {
                setSiderVisible(false); // 桌面端不需要抽屉模式
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSider = () => {
        setSiderVisible(!siderVisible);
    };

    const fetchNotification = async () => {
        const fetched_notification = await getNotification();
        const fetched_private = fetched_notification.filter(notify => notify.type < 1000);
        const fetched_public = fetched_notification.filter(notify => notify.type >= 1000);
        setPrivateNotifications(fetched_private);
        setPublicNotifications(fetched_public);
    }

    useEffect(() => {
        const fetch = async () => {
            const fetched_profile = await getUserProfile();
            setProfile(fetched_profile);
        }
        fetch();
    }, []);

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
                client.subscribe("/user/queue/notifications/notify", async (msg) => {
                    try {
                        const receivedMsg = JSON.parse(msg.body);
                        console.log(receivedMsg);
                        if(receivedMsg.touserid !== useridRef.current) {
                            message.error('消息发送错误');
                            return;
                        }
                        fetchNotification();
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

    const role = profile?.role;

    // 根据角色配置样式和内容
    const getLayoutConfig = () => {
        const configs = {
            // 管理员配置
            1: {
                header: {
                    background: 'linear-gradient(90deg,rgb(42, 181, 240) 0%,rgb(44, 116, 250) 100%)',
                    roleTag: {
                        text: '管理员',
                        color: '#ffd500'
                    }
                },
                sider: {
                    width: 220,
                    background: 'white',
                    boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
                    userSection: {
                        padding: '24px 16px',
                        borderBottom: '1px solid #f0f0f0',
                        avatarSize: 64,
                        avatarStyle: { backgroundColor: '#1890ff', marginBottom: 12 },
                        username: 'Admin',
                        usernameStyle: { fontSize: 16 },
                        subtitle: null
                    },
                    navbar: NavbarAdmin
                },
                content: {
                    padding: "32px",
                    background: '#f0fffc'
                },
                footer: {
                    background: '#fff',
                    padding: '16px 50px',
                    borderTop: '1px solid #f0f0f0',
                    boxShadow: '0 -1px 4px rgba(0,0,0,0.03)',
                    textStyle: { color: 'rgba(0, 0, 0, 0.45)' },
                    extraInfo: false
                }
            },
            // 心理咨询师配置
            2: {
                header: {
                    background: 'linear-gradient(90deg, #722ed1 0%, #b37feb 100%)',
                    roleTag: {
                        text: '心理咨询师',
                        color: '#f9f0ff'
                    }
                },
                sider: {
                    width: 260,
                    background: 'linear-gradient(180deg, #f9f0ff 0%, #fff 100%)',
                    boxShadow: '2px 0 12px rgba(114, 46, 209, 0.08)',
                    userSection: {
                        padding: '32px 16px',
                        borderBottom: '2px solid #efdbff',
                        avatarSize: 72,
                        avatarStyle: { 
                            backgroundColor: '#722ed1', 
                            marginBottom: 16, 
                            border: '2px solid #f9f0ff' 
                        },
                        username: profile?.username || '',
                        usernameStyle: { fontSize: 18, color: '#531dab' },
                        subtitle: '专业咨询师',
                        subtitleStyle: { fontWeight: 600, fontSize: 14, color: '#722ed1' },
                        description: '为学生提供专业心理支持',
                        descriptionStyle: { fontSize: 12 }
                    },
                    navbar: NavbarCounselor
                },
                content: {
                    padding: "32px",
                    background: '#f9f0ff',
                    borderTop: '2px solid #efdbff'
                },
                footer: {
                    background: '#f9f0ff',
                    padding: '20px 50px',
                    borderTop: '2px solid #efdbff',
                    boxShadow: '0 -2px 8px rgba(114, 46, 209, 0.08)',
                    textStyle: { fontWeight: 600, color: '#722ed1' },
                    extraInfo: false
                }
            },
            // 普通用户配置
            0: {
                header: {
                    background: 'linear-gradient(90deg, #1890ff 0%, #36cfc9 100%)',
                    roleTag: null
                },
                sider: {
                    width: 220,
                    background: 'linear-gradient(180deg, #e6f7ff 0%, #fff 100%)',
                    boxShadow: '2px 0 8px rgba(24, 144, 255, 0.08)',
                    userSection: {
                        padding: '24px 16px',
                        borderBottom: '1px solid #e6f7ff',
                        avatarSize: 64,
                        avatarStyle: { 
                            backgroundColor: '#1890ff', 
                            marginBottom: 12, 
                            border: '2px solid #e6f7ff' 
                        },
                        username: profile?.username || '',
                        usernameStyle: { fontSize: 16, color: '#1890ff' },
                        subtitle: null,
                        description: '关注心理健康，快乐每一天',
                        descriptionStyle: { fontSize: 12 }
                    },
                    navbar: Navbar
                },
                content: {
                    padding: isDesktop ? "24px" : "16px",
                    background: 'linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 50%, #f6ffed 100%)',
                    borderTop: '1px solid #d9f7be'
                },
                footer: {
                    background: 'linear-gradient(90deg, #f0f9ff 0%, #f6ffed 100%)',
                    padding: isDesktop ? '16px 50px' : '12px 16px',
                    borderTop: '2px solid #d9f7be',
                    boxShadow: '0 -1px 4px rgba(24, 144, 255, 0.06)',
                    textStyle: { fontWeight: 500 },
                    extraInfo: true
                }
            }
        };
        
        return configs[role] || configs[0];
    };

    const config = getLayoutConfig();
    const NavbarComponent = config.sider.navbar;

    // 侧栏内容组件
    const SiderContent = () => (
        <>
            <div style={{ 
                padding: config.sider.userSection.padding,
                textAlign: 'center',
                borderBottom: config.sider.userSection.borderBottom
            }}>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                    <Avatar 
                        size={config.sider.userSection.avatarSize} 
                        icon={<UserOutlined />}
                        src={profile ? profile.avatar : null}
                        style={config.sider.userSection.avatarStyle}
                    />
                </div>
                <div>
                    <Text strong style={config.sider.userSection.usernameStyle}>
                        {config.sider.userSection.username}
                    </Text>
                </div>
                {config.sider.userSection.subtitle && (
                    <div style={{ marginTop: 8 }}>
                        <Text style={config.sider.userSection.subtitleStyle}>
                            {config.sider.userSection.subtitle}
                        </Text>
                    </div>
                )}
                {config.sider.userSection.description && (
                    <div style={{ marginTop: config.sider.userSection.subtitle ? 12 : 8 }}>
                        <Text type="secondary" style={config.sider.userSection.descriptionStyle}>
                            {config.sider.userSection.description}
                        </Text>
                    </div>
                )}
            </div>
            
            <NavbarComponent />
        </>
    );

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Header style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                background: config.header.background,
                padding: isDesktop ? '0 24px' : '0 16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                height: 64
            }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {!isDesktop && (
                        <Button
                            type="text"
                            icon={<MenuOutlined />}
                            onClick={toggleSider}
                            style={{
                                color: '#fff',
                                fontSize: '18px',
                                marginRight: '12px',
                                background: 'rgba(255, 255, 255, 0.1)',
                                border: 'none'
                            }}
                        />
                    )}
                    
                    <Title level={isDesktop ? 3 : 4} style={{ 
                        margin: 0, 
                        color: '#fff', 
                        letterSpacing: config.header.roleTag ? 2 : 1.5,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}>
                        {config.header.roleTag && (
                            <span style={{ 
                                background: 'rgba(255, 255, 255, 0.18)', 
                                borderRadius: 6, 
                                padding: '2px 12px', 
                                marginRight: 12, 
                                fontWeight: 700, 
                                color: config.header.roleTag.color, 
                                fontSize: isDesktop ? 18 : 14,
                                border: '1.5px solid #fff'
                            }}>
                                {config.header.roleTag.text}
                            </span>
                        )}
                        {isDesktop ? '校园心理健康互助社区' : '心理健康社区'}
                    </Title>
                </div>
                
                <Space size={isDesktop ? 16 : 8}>
                    <MessageInfromer role={role}/>
                    <UserHeader profile={profile} />
                </Space>
            </Header>
            
            <Layout>
                {isDesktop && (
                    <Sider 
                        width={config.sider.width} 
                        theme="light" 
                        style={{ 
                            boxShadow: config.sider.boxShadow,
                            position: 'sticky',
                            height: 'calc(100vh - 64px)',
                            top: 64,
                            overflow: 'auto',
                            background: config.sider.background,
                            zIndex: 1
                        }}
                    >
                        <SiderContent />
                    </Sider>
                )}

                {!isDesktop && (
                    <Drawer
                        title={null}
                        placement="left"
                        onClose={() => setSiderVisible(false)}
                        open={siderVisible}
                        width={config.sider.width}
                        headerStyle={{ display: 'none' }}
                        bodyStyle={{ 
                            padding: 0, 
                            background: config.sider.background 
                        }}
                        style={{ zIndex: 1001 }}
                    >
                        <SiderContent />
                    </Drawer>
                )}

                <Content style={{ 
                    padding: config.content.padding, 
                    minHeight: 'calc(100vh - 64px - 69px)',
                    background: config.content.background, 
                    overflow: 'auto',
                    ...(config.content.borderTop && { borderTop: config.content.borderTop })
                }}> 
                    {content}
                </Content>
            </Layout>

            <Footer style={{ 
                textAlign: 'center',
                background: config.footer.background, 
                padding: config.footer.padding,
                borderTop: config.footer.borderTop,
                boxShadow: config.footer.boxShadow,
                zIndex: 1
            }}>
                {config.footer.extraInfo ? (
                    <Space direction="vertical" size={4}>
                        <Text type="secondary" style={{
                            ...config.footer.textStyle,
                            fontSize: isDesktop ? undefined : '12px'
                        }}> 
                            校园心理健康互助社区 ©2025 林淳远 & 郭旭涛 & Koishi 版权所有 
                        </Text>
                        {isDesktop && (
                            <Space size={16}>
                                <Text style={{ fontSize: '11px', color: '#bfbfbf' }}>服务热线: 400-123-4567</Text>
                                <Text style={{ fontSize: '11px', color: '#bfbfbf' }}>邮箱: support@campus-health.com</Text>
                                <Text style={{ fontSize: '11px', color: '#bfbfbf' }}>在线时间: 9:00-22:00</Text>
                            </Space>
                        )}
                    </Space>
                ) : (
                    <Text style={{
                        ...config.footer.textStyle,
                        fontSize: isDesktop ? undefined : '12px'
                    }}> 
                        校园心理健康互助社区 ©2025 林淳远 & 郭旭涛 & Koishi 版权所有 
                    </Text>
                )}
            </Footer>
        </Layout>
    );
}