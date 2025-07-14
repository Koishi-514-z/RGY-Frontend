import React, { useState, useEffect } from "react";
import { Button, Avatar, Typography, Card, Row, Col, Space, App, Tag, Badge } from "antd";
import { EditOutlined, UserOutlined, MailOutlined, RobotOutlined, StarOutlined, HeartOutlined } from "@ant-design/icons";
import HomeTabs from "./hometabs";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getSessionid, createSession } from "../../service/chat";

const { Title, Text } = Typography;

export default function ProfileHeader({profile, id}) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const navigate = useNavigate();
    const { message } = App.useApp();

    // 监听屏幕尺寸变化
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleEdit = () => {
        setSearchParams({tabKey: 3});
    };

    const handleAIChat = () => {
        navigate(`/AIassistant`);
    }

    const handleClick = async () => {
        if(!id) {
            navigate(`/chat`);
            return;
        }   
        let sessionid = await getSessionid(id);
        if(!sessionid) {
            sessionid = await createSession(id);
            if(!sessionid) {
                message.error('创建会话失败，请检查网络');
                return;
            }
        }
        navigate(`/chat/${sessionid}`)
    }

    const getDate = (timestamp) => {
        const now = new Date();
        const date = new Date(timestamp);
        const diffTime = now - date;
        const diffDays = Math.floor(diffTime / (24 * 60 * 60 * 1000));
        return `已加入 ${diffDays} 天`;
    }

    const emptyText = '这个家伙很懒，什么也没有留下';

    return (
        <Card 
            style={{ 
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 50%, #f6ffed 100%)',
                border: '1px solid rgba(24, 144, 255, 0.15)',
                borderRadius: '16px',
                overflow: 'hidden',
                marginBottom: '24px',
                boxShadow: '0 4px 20px rgba(24, 144, 255, 0.1)',
                position: 'relative'
            }}
        >
            <Row align="middle" gutter={[24, 16]} style={{ position: 'relative', zIndex: 1 }}>
                {/* 头像区域 */}
                <Col xs={24} sm={6} md={4} style={{ textAlign: 'center' }}>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <Avatar 
                            size={isMobile ? 80 : 120} 
                            icon={<UserOutlined />}
                            src={profile?.avatar}
                            style={{ 
                                backgroundColor: profile?.avatar ? 'transparent' : '#1890ff',
                                border: '4px solid #fff',
                                boxShadow: '0 8px 24px rgba(24, 144, 255, 0.2)'
                            }}
                        />
                    </div>
                </Col>

                {/* 用户信息区域 */}
                <Col xs={24} sm={12} md={15}>
                    <div style={{ 
                        padding: isMobile ? '0' : '8px 0',
                        textAlign: isMobile ? 'center' : 'left'
                    }}>
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '12px', 
                            marginBottom: '8px',
                            justifyContent: isMobile ? 'center' : 'flex-start'
                        }}>
                            <Title level={isMobile ? 4 : 3} style={{ margin: 0, color: '#262626' }}>
                                {profile?.username}
                            </Title>
                        </div>
                        
                        <Space 
                            direction={isMobile ? "horizontal" : "vertical"} 
                            size={isMobile ? 16 : 8} 
                            style={{ 
                                marginBottom: 16,
                                justifyContent: isMobile ? 'center' : 'flex-start',
                                width: '100%'
                            }}
                        >
                            <Text style={{ 
                                fontSize: isMobile ? '13px' : '14px',
                                color: '#595959',
                                lineHeight: '1.5',
                                textAlign: isMobile ? 'center' : 'left',
                                display: 'block'
                            }}>
                                {profile.note ? profile.note : emptyText}
                            </Text>
                            
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '4px',
                                justifyContent: isMobile ? 'center' : 'flex-start'
                            }}>
                                <HeartOutlined style={{ color: '#ff4d4f', fontSize: '14px' }} />
                                <Text style={{ fontSize: '13px', color: '#8c8c8c' }}>
                                    {getDate(profile?.jointime)}
                                </Text>
                            </div>
                        </Space>
                    </div>
                </Col>

                {/* 按钮操作区域 */}
                <Col xs={24} sm={6} md={5}>
                    <Space 
                        size={isMobile ? 12 : 8} 
                        style={{ 
                            justifyContent: isMobile ? 'center' : 'flex-end',
                            width: '100%',
                            flexWrap: 'wrap'
                        }}
                        wrap={isMobile}
                    >
                        <Button 
                            type="primary"
                            icon={<MailOutlined />} 
                            onClick={handleClick}
                            size={isMobile ? "middle" : "large"}
                            style={{ 
                                background: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)',
                                border: 'none',
                                borderRadius: '8px',
                                height: isMobile ? '36px' : '42px',
                                paddingLeft: isMobile ? '12px' : '16px',
                                paddingRight: isMobile ? '12px' : '16px',
                                boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)',
                                fontSize: isMobile ? '13px' : '14px'
                            }}
                        >
                            聊天
                        </Button>
                        
                        {!id && (
                            <>
                                <Button 
                                    icon={<RobotOutlined />} 
                                    onClick={handleAIChat}
                                    size={isMobile ? "middle" : "large"}
                                    style={{ 
                                        borderColor: '#36cfc9',
                                        color: '#36cfc9',
                                        borderRadius: '8px',
                                        height: isMobile ? '36px' : '42px',
                                        width: isMobile ? '36px' : '42px'
                                    }}
                                />
                                <Button 
                                    icon={<EditOutlined />} 
                                    onClick={handleEdit}
                                    size={isMobile ? "middle" : "large"}
                                    style={{ 
                                        borderColor: '#1890ff',
                                        color: '#1890ff',
                                        borderRadius: '8px',
                                        height: isMobile ? '36px' : '42px',
                                        width: isMobile ? '36px' : '42px'
                                    }}
                                />
                            </>
                        )}
                    </Space>
                </Col>

                {/* 标签页区域 */}
                <Col span={24}>
                    <div style={{ 
                        borderTop: '1px solid rgba(24, 144, 255, 0.1)',
                        paddingTop: '16px',
                        marginTop: isMobile ? '16px' : '8px'
                    }}>
                        <HomeTabs id={id} />
                    </div>
                </Col>
            </Row>
        </Card>
    )
}