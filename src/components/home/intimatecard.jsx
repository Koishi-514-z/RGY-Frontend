import React, { useState } from "react";
import { Typography, Card, Avatar, Space, List, Badge, Tooltip, Button, Empty, Tag } from "antd";
import { UserOutlined, HeartFilled, IdcardOutlined, MessageOutlined, UserAddOutlined, EyeOutlined, FireOutlined, CrownOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Text, Title } = Typography;

export default function IntimateCard({ intimateUsers }) {
    const navigate = useNavigate();

    const getIntimateLevel = (score) => {
        if (score >= 80) {
            return { 
                level: '挚友', 
                color: '#ff4d4f', 
                icon: <CrownOutlined />,
                bgColor: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
            };
        } else if (score >= 60) {
            return { 
                level: '好友', 
                color: '#faad14', 
                icon: <FireOutlined />,
                bgColor: 'linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%)'
            };
        } else if (score >= 40) {
            return { 
                level: '朋友', 
                color: '#52c41a', 
                icon: <HeartFilled />,
                bgColor: 'linear-gradient(135deg, #81ecec 0%, #74b9ff 100%)'
            };
        } else {
            return { 
                level: '认识', 
                color: '#1890ff', 
                icon: <UserOutlined />,
                bgColor: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
            };
        }
    };

    const renderUserCard = (data) => {
        console.log(data);
        const intimateLevel = getIntimateLevel(data.intimateScore);
        
        return (
            <Card 
                hoverable={true}
                onClick={() => navigate(`/home/${data.intimateProfile.userid}`)}
                style={{ 
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    border: '1px solid #f0f0f0',
                    background: intimateLevel.bgColor,
                    position: 'relative',
                    overflow: 'hidden'
                }}
                bodyStyle={{ padding: '20px' }}
            >
                <div style={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 60,
                    height: 60,
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    zIndex: 0
                }} />
                
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ 
                        position: 'relative', 
                        marginBottom: '16px',
                        display: 'flex',
                        justifyContent: 'center',  
                        width: '100%'             
                    }}>
                        <Avatar 
                            size={80} 
                            icon={<UserOutlined />}
                            src={data.intimateProfile.avatar}
                            style={{ 
                                backgroundColor: data.intimateProfile.avatar ? 'transparent' : '#1890ff',
                                boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                                border: '3px solid rgba(255, 255, 255, 0.8)'
                            }}
                        />
                        
                        <Tooltip title={`亲密度：${data.intimateScore} 分`}>
                            <div style={{ 
                                position: 'absolute',
                                bottom: -5,
                                right: 'calc(50% - 50px)',
                                background: intimateLevel.color,
                                color: 'white',
                                borderRadius: '50%',
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                boxShadow: `0 4px 12px ${intimateLevel.color}40`,
                                border: '2px solid white'
                            }}>
                                {intimateLevel.icon}
                            </div>
                        </Tooltip>
                    </div>
                    
                    <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                        <Text 
                            strong 
                            style={{ 
                                fontSize: '16px',
                                display: 'block',
                                marginBottom: '6px',
                                color: 'rgba(0, 0, 0, 0.85)'
                            }}
                        >
                            {data.intimateProfile.username}
                        </Text>
                        
                        <Tag 
                            icon={intimateLevel.icon}
                            color={intimateLevel.color}
                            style={{ 
                                marginBottom: '8px',
                                fontWeight: 'bold',
                                border: 'none'
                            }}
                        >
                            {intimateLevel.level}
                        </Tag>
                        
                        <Text 
                            type="secondary" 
                            style={{ 
                                fontSize: '12px',
                                display: 'block',
                                lineHeight: '1.4',
                                color: 'rgba(0, 0, 0, 0.6)'
                            }}
                        >
                            {data.intimateProfile.note || "这个人很神秘，没有留下个性签名"}
                        </Text>
                    </div>
                </div>
            </Card>
        );
    };

    if(intimateUsers.length === 0) {
        return (
            <Card 
                title={
                    <div style={{ padding: '8px 0' }}>
                        <Space>
                            <IdcardOutlined style={{ fontSize: '20px', color: '#ff4d4f' }} />
                            <Title level={4} style={{ margin: 0, color: '#262626' }}>亲密用户</Title>
                        </Space>
                    </div>
                }
                style={{ 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                }}
            >
                <Empty 
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                        <div>
                            <Text style={{ color: '#8c8c8c' }}>还没有亲密用户</Text>
                            <br />
                            <Text style={{ color: '#bfbfbf', fontSize: '12px' }}>
                                多与其他用户互动，建立更多联系吧！
                            </Text>
                        </div>
                    }
                    style={{ padding: '40px 0' }}
                />
            </Card>
        );
    }

    return (
        <Card 
            style={{ 
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 50%, #f6ffed 100%)',
                border: '1px solid rgba(24, 144, 255, 0.15)',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(24, 144, 255, 0.12)',
                position: 'relative'
            }}
        >
            <div style={{
                background: 'linear-gradient(135deg, rgba(24, 144, 255, 0.05) 0%, rgba(54, 207, 201, 0.05) 100%)',
                padding: '24px',
                margin: '-24px -24px 24px -24px',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{
                            width: '56px',
                            height: '56px',
                            background: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '16px',
                            boxShadow: '0 6px 16px rgba(24, 144, 255, 0.3)',
                            position: 'relative'
                        }}>
                            <IdcardOutlined style={{ color: '#fff', fontSize: '24px' }} />
                            <div style={{
                                position: 'absolute',
                                top: '8px',
                                right: '8px',
                                width: '8px',
                                height: '8px',
                                background: '#52c41a',
                                borderRadius: '50%',
                                border: '2px solid #fff'
                            }} />
                        </div>
                        <div>
                            <Title level={4} style={{ 
                                margin: 0, 
                                background: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}>
                                亲密用户
                            </Title>
                            <Text style={{ 
                                color: '#595959', 
                                fontSize: '14px',
                                fontWeight: '500'
                            }}>
                                与你互动较多的用户
                            </Text>
                        </div>
                    </div>
                </div>
            </div>
            
            <List
                grid={{ 
                    gutter: [16, 16], 
                    column: 2
                }}
                dataSource={intimateUsers}
                renderItem={(data) => (
                    <List.Item style={{ marginBottom: 0 }}>
                        {renderUserCard(data)}
                    </List.Item>
                )}
            />
        </Card>
    );
}