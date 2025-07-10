import React, { useEffect, useState } from "react";
import { Typography, Layout, Avatar, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Navbar from "../navbar";
import NavbarCounselor from "../admin/navbarcounselor";
import { getUserProfile } from "../../service/user";
import NavbarAdmin from "../admin/navbaradmin";
import MessageInfromer from "../messageinfromer";
import UserHeader from "../userheader";

const { Header, Content, Sider, Footer } = Layout;
const { Title, Text } = Typography;

export default function CustomLayout({content, role = 0, update = 0}) {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            const fetched_profile = await getUserProfile();
            setProfile(fetched_profile);
        }
        fetch();
    }, [update]);

    if(role === 1) {
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
                    
                    <Space size={16}>
                        <MessageInfromer role={role}/>
                        <UserHeader profile={profile} />
                    </Space>
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
                            <div style={{ position: 'relative', display: 'inline-block' }}>
                                <Avatar 
                                    size={64} 
                                    icon={<UserOutlined />}
                                    src={profile ? profile.avatar : null}
                                    style={{ 
                                        backgroundColor: '#1890ff',
                                        marginBottom: 12
                                    }}
                                />
                            </div>
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

    if(role === 2) {
        return (
            <Layout style={{ minHeight: "100vh" }}>
                <Header style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    background: 'linear-gradient(90deg, #722ed1 0%, #b37feb 100%)', 
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
                                color: '#f9f0ff', 
                                fontSize: 18,
                                border: '1.5px solid #fff'
                            }}>
                                心理咨询师
                            </span>
                            校园心理健康互助社区
                        </Title>
                    </div>
                    
                    <Space size={16}>
                        <MessageInfromer role={role}/>
                        <UserHeader profile={profile} />
                    </Space>
                </Header>
                
                <Layout>
                    <Sider 
                        width={260} 
                        theme="light" 
                        style={{ 
                            boxShadow: '2px 0 12px rgba(114, 46, 209, 0.08)',
                            position: 'sticky',
                            height: 'calc(100vh - 64px)',
                            top: 64,
                            overflow: 'auto',
                            background: 'linear-gradient(180deg, #f9f0ff 0%, #fff 100%)',
                            zIndex: 1
                        }}
                    >
                        <div style={{ 
                            padding: '32px 16px',
                            textAlign: 'center',
                            borderBottom: '2px solid #efdbff'
                        }}>
                            <div style={{ position: 'relative', display: 'inline-block' }}>
                                <Avatar 
                                    size={72} 
                                    icon={<UserOutlined />}
                                    src={profile ? profile.avatar : null}
                                    style={{ 
                                        backgroundColor: '#722ed1',
                                        marginBottom: 16,
                                        border: '2px solid #f9f0ff'
                                    }}
                                />
                            </div>
                            <div>
                                <Text strong style={{ fontSize: 18, color: '#531dab' }}>
                                    {profile ? profile.username : ''}
                                </Text>
                            </div>
                            <div style={{ marginTop: 8 }}>
                                <Text style={{ fontWeight: 600, fontSize: 14, color: '#722ed1' }}>
                                    专业咨询师
                                </Text>
                            </div>
                            <div style={{ marginTop: 12 }}>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    为学生提供专业心理支持
                                </Text>
                            </div>
                        </div>
                        <NavbarCounselor />
                    </Sider>
                    <Content style={{ 
                        padding: "32px", 
                        minHeight: 'calc(100vh - 64px - 69px)',
                        background: '#f9f0ff',
                        overflow: 'auto',
                        borderTop: '2px solid #efdbff'
                    }}> 
                        {content}
                    </Content>
                </Layout>

                <Footer style={{ 
                    textAlign: 'center',
                    background: '#f9f0ff',
                    padding: '20px 50px',
                    borderTop: '2px solid #efdbff',
                    boxShadow: '0 -2px 8px rgba(114, 46, 209, 0.08)',
                    zIndex: 1
                }}>
                    <Text style={{ fontWeight: 600, color: '#722ed1' }}>
                        校园心理健康互助社区 ©2025 林淳远 & 郭旭涛 & Koishi 版权所有
                    </Text>
                </Footer>
            </Layout>
        )
    }

    // 普通用户界面
    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Header style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                background: 'linear-gradient(90deg, #1890ff 0%, #36cfc9 100%)',
                padding: '0 24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                height: 64
            }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Title level={3} style={{ margin: 0, color: '#ffffff', letterSpacing: 1.5 }}> 
                        校园心理健康互助社区 
                    </Title>
                </div>
                
                <Space size={16}>
                    <MessageInfromer role={role}/>
                    <UserHeader profile={profile} />
                </Space>
            </Header>
            
            <Layout>
                <Sider 
                    width={220} 
                    theme="light" 
                    style={{ 
                        boxShadow: '2px 0 8px rgba(24, 144, 255, 0.08)',
                        position: 'sticky',
                        height: 'calc(100vh - 64px)',
                        top: 64,
                        overflow: 'auto',
                        background: 'linear-gradient(180deg, #e6f7ff 0%, #fff 100%)',
                        zIndex: 1
                    }}
                >
                    <div style={{ 
                        padding: '24px 16px',
                        textAlign: 'center',
                        borderBottom: '1px solid #e6f7ff'
                    }}>
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                            <Avatar 
                                size={64} 
                                icon={<UserOutlined />}
                                src={profile ? profile.avatar : null}
                                style={{ 
                                    backgroundColor: '#1890ff',
                                    marginBottom: 12,
                                    border: '2px solid #e6f7ff'
                                }}
                            />
                        </div>
                        <div>
                            <Text strong style={{ fontSize: 16, color: '#1890ff' }}>
                                {profile ? profile.username : ''}
                            </Text>
                        </div>
                        <div style={{ marginTop: 8 }}>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                关注心理健康，快乐每一天
                            </Text>
                        </div>
                    </div>
                    
                    <Navbar />
                </Sider>
                <Content style={{ 
                    padding: "24px", 
                    minHeight: 'calc(100vh - 64px - 69px)',
                    background: 'linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 50%, #f6ffed 100%)', 
                    overflow: 'auto',
                    borderTop: '1px solid #d9f7be'
                }}> 
                    {content}
                </Content>
            </Layout>

            <Footer style={{ 
                textAlign: 'center',
                background: 'linear-gradient(90deg, #f0f9ff 0%, #f6ffed 100%)', 
                padding: '16px 50px',
                borderTop: '2px solid #d9f7be',
                boxShadow: '0 -1px 4px rgba(24, 144, 255, 0.06)',
                zIndex: 1
            }}>
                <Space direction="vertical" size={4}>
                    <Text type="secondary" style={{ fontWeight: 500 }}> 
                        校园心理健康互助社区 ©2025 林淳远 & 郭旭涛 & Koishi 版权所有 
                    </Text>
                    <Space size={16}>
                        <Text style={{ fontSize: '11px', color: '#bfbfbf' }}>服务热线: 400-123-4567</Text>
                        <Text style={{ fontSize: '11px', color: '#bfbfbf' }}>邮箱: support@campus-health.com</Text>
                        <Text style={{ fontSize: '11px', color: '#bfbfbf' }}>在线时间: 9:00-22:00</Text>
                    </Space>
                </Space>
            </Footer>
        </Layout>
    );
}