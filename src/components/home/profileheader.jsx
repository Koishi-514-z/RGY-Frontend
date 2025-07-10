import React from "react";
import { Button, Avatar, Typography, Card, Row, Col, Space, App, Tag, Badge } from "antd";
import { EditOutlined, UserOutlined, MailOutlined, RobotOutlined, StarOutlined, HeartOutlined } from "@ant-design/icons";
import HomeTabs from "./hometabs";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getSessionid, createSession } from "../../service/chat";

const { Title, Text } = Typography;

export default function ProfileHeader({profile, id}) {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const { message } = App.useApp();

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
            <Row align="middle" gutter={[24, 24]} style={{ position: 'relative', zIndex: 1 }}>
                <Col xs={24} sm={8} md={4} style={{ textAlign: 'center' }}>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <Avatar 
                            size={120} 
                            icon={<UserOutlined />}
                            src={profile.avatar}
                            style={{ 
                                backgroundColor: profile.avatar ? 'transparent' : '#1890ff',
                                border: '4px solid #fff',
                                boxShadow: '0 8px 24px rgba(24, 144, 255, 0.2)'
                            }}
                        />
                    </div>
                </Col>

                <Col xs={24} sm={10} md={15}>
                    <div style={{ padding: '8px 0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <Title level={3} style={{ margin: 0, color: '#262626' }}>
                                {profile.username}
                            </Title>
                            <Tag 
                                color="#1890ff" 
                                style={{ 
                                    borderRadius: '12px',
                                    fontSize: '11px',
                                    fontWeight: '500'
                                }}
                            >
                                活跃用户
                            </Tag>
                        </div>
                        
                        <Space direction="vertical" size={8} style={{ marginBottom: 16 }}>
                            <Text style={{ 
                                fontSize: '14px',
                                color: '#595959',
                                lineHeight: '1.5'
                            }}>
                                {profile.note ? profile.note : emptyText}
                            </Text>
                            
                            <Space size={16}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <HeartOutlined style={{ color: '#ff4d4f', fontSize: '14px' }} />
                                    <Text style={{ fontSize: '13px', color: '#8c8c8c' }}>
                                        {getDate(profile.jointime)}
                                    </Text>
                                </div>
                            </Space>
                        </Space>
                    </div>
                </Col>

                <Col xs={24} sm={6} md={5}>
                    <Space size={8} style={{ justifyContent: 'flex-end', width: '100%' }}>
                        <Button 
                            type="primary"
                            icon={<MailOutlined />} 
                            onClick={handleClick}
                            size="large"
                            style={{ 
                                background: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)',
                                border: 'none',
                                borderRadius: '8px',
                                height: '42px',
                                paddingLeft: '16px',
                                paddingRight: '16px',
                                boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)'
                            }}
                        >
                            聊天
                        </Button>
                        
                        {!id && (
                            <>
                                <Button 
                                    icon={<RobotOutlined />} 
                                    onClick={handleAIChat}
                                    size="large"
                                    style={{ 
                                        borderColor: '#36cfc9',
                                        color: '#36cfc9',
                                        borderRadius: '8px',
                                        height: '42px',
                                        width: '42px'
                                    }}
                                />
                                <Button 
                                    icon={<EditOutlined />} 
                                    onClick={handleEdit}
                                    size="large"
                                    style={{ 
                                        borderColor: '#1890ff',
                                        color: '#1890ff',
                                        borderRadius: '8px',
                                        height: '42px',
                                        width: '42px'
                                    }}
                                />
                            </>
                        )}
                    </Space>
                </Col>

                <Col span={24}>
                    <div style={{ 
                        borderTop: '1px solid rgba(24, 144, 255, 0.1)',
                        paddingTop: '16px',
                        marginTop: '8px'
                    }}>
                        <HomeTabs id={id} />
                    </div>
                </Col>
            </Row>
        </Card>
    )
}