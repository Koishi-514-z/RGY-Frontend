/*
    所有页面的通用Wrapper组件
*/

import React, { useEffect, useState } from "react";
import { Typography, Layout, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Navbar from "../navbar";
import NavbarAdmin from "../admin_stats/navbaradmin";
import { getUserProfile } from "../../service/user";

const { Header, Content, Sider, Footer } = Layout;
const { Title, Text } = Typography;

export default function CustomLayout({content, admin = false}) {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            const fetched_profile = await getUserProfile();
            setProfile(fetched_profile);
        }
        fetch();
    }, []);

    if(admin) {
        return (
            <Layout style={{ minHeight: "100vh" }}>
                <Header style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    background: 'linear-gradient(90deg,rgb(42, 181, 240) 0%,rgb(44, 116, 250) 100%)',
                    padding: '0 24px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1000,
                    height: 64
                }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Title level={3} style={{ margin: 0, color: '#fff', letterSpacing: 2 }}>
                            <span style={{ 
                                background: 'rgba(255, 255, 255, 0.18)', 
                                borderRadius: 6, 
                                padding: '2px 12px', 
                                marginRight: 12, 
                                fontWeight: 700, 
                                color: '#ffd500', 
                                fontSize: 18,
                                border: '1.5px solid #fff'
                            }}>
                                管理员
                            </span>
                            校园心理健康互助社区
                        </Title>
                    </div>
                </Header>
                
                <Layout>
                    <Sider 
                        width={220} 
                        theme="light" 
                        style={{ 
                            boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
                            position: 'sticky',
                            height: 'calc(100vh - 64px)',
                            top: 64,
                            overflow: 'auto'
                        }}
                    >
                        <div style={{ 
                            padding: '24px 16px',
                            textAlign: 'center',
                            borderBottom: '1px solid #f0f0f0'
                        }}>
                            <Avatar 
                                size={64} 
                                icon={<UserOutlined />}
                                src={profile ? profile.avatar : null}
                                style={{ 
                                    backgroundColor: '#1890ff',
                                    marginBottom: 12
                                }}
                            />
                            <div>
                                <Text strong style={{ fontSize: 16 }}> Admin </Text>
                            </div>
                        </div>
                        <NavbarAdmin />
                    </Sider>
                    <Content style={{ 
                        padding: "32px", 
                        minHeight: 'calc(100vh - 64px - 69px)',
                        background: '#f0fffc',
                        overflow: 'auto',
                    }}> 
                        {content}
                    </Content>
                </Layout>

                <Footer style={{ 
                    textAlign: 'center',
                    background: '#fff',
                    padding: '16px 50px',
                    borderTop: '1px solid #f0f0f0',
                    boxShadow: '0 -1px 4px rgba(0,0,0,0.03)'
                }}>
                    <Text type="secondary"> 校园心理健康互助社区 ©2025 林淳远 & 郭旭涛 & Koishi 版权所有 </Text>
                </Footer>
            </Layout>
        )
    }

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Header style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                background: 'linear-gradient(90deg, #00c593 0%, #00b4d8 100%)',
                padding: '0 24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                height: 64
            }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Title level={3} style={{ margin: 0, color: '#ffffff' }}> 校园心理健康互助社区 </Title>
                </div>
            </Header>
            
            <Layout>
                <Sider 
                    width={220} 
                    theme="light" 
                    style={{ 
                        boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
                        position: 'sticky',
                        height: 'calc(100vh - 64px)',
                        top: 64,
                        overflow: 'auto'
                    }}
                >
                    <div style={{ 
                        padding: '24px 16px',
                        textAlign: 'center',
                        borderBottom: '1px solid #f0f0f0'
                    }}>
                        <Avatar 
                            size={64} 
                            icon={<UserOutlined />}
                            src={profile ? profile.avatar : null}
                            style={{ 
                                backgroundColor: '#1890ff',
                                marginBottom: 12
                            }}
                        />
                        <div>
                            <Text strong style={{ fontSize: 16 }}>{profile ? profile.username : ''}</Text>
                        </div>
                    </div>
                    <Navbar />
                </Sider>
                <Content style={{ 
                    padding: "24px", 
                    minHeight: 'calc(100vh - 64px - 69px)',
                    background: '#f5f7fa',
                    overflow: 'auto'
                }}> 
                    {content}
                </Content>
            </Layout>

            <Footer style={{ 
                textAlign: 'center',
                background: '#fff',
                padding: '16px 50px',
                borderTop: '1px solid #f0f0f0',
                boxShadow: '0 -1px 4px rgba(0,0,0,0.03)'
            }}>
                <Text type="secondary"> 校园心理健康互助社区 ©2025 林淳远 & 郭旭涛 & Koishi 版权所有 </Text>
            </Footer>
        </Layout>
    );
}