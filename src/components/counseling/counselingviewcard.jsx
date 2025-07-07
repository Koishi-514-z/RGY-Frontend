import React, { useState, useEffect } from "react";
import { Card, List, Space, Typography, Tag, Rate, Divider, App, Avatar, Empty, Button } from "antd";
import { 
    UserOutlined, EnvironmentOutlined, ClockCircleOutlined,
    MessageOutlined, TrophyOutlined, BookOutlined,
    CheckCircleOutlined, HeartOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { createSession, getSessionid } from "../../service/chat";

const { Title, Text } = Typography;

export default function CounselingViewCard({psyProfiles}) {
    const { message } = App.useApp();
    const navigate = useNavigate();

    const handleViewProfile = (psyid) => {
        navigate(`/psydetail/${psyid}`);
    };

    const handleCounseling = async (psyid) => {
        let sessionid = await getSessionid(psyid);
        if(!sessionid) {
            sessionid = await createSession(psyid);
            if(!sessionid) {
                message.error('创建会话失败，请检查网络');
                return;
            }
        }
        navigate(`/chat/${sessionid}`);
    }

    const getSpecialtyColor = (index) => {
        const colors = [
            '#1890ff', '#52c41a', '#722ed1', '#fa8c16', 
            '#eb2f96', '#13c2c2', '#faad14', '#f5222d'
        ];
        return colors[index % colors.length];
    };

    const formatWorkingYears = (years) => {
        if (years >= 10) return '资深专家';
        if (years >= 5) return '经验丰富';
        if (years >= 2) return '专业可靠';
        return '新锐咨询师';
    };

    const customEmpty = (
        <div style={{
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%)',
            borderRadius: '20px',
            padding: '60px 40px',
            textAlign: 'center',
            border: '1px solid rgba(24, 144, 255, 0.1)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '150px',
                height: '150px',
                background: 'rgba(114, 46, 209, 0.05)',
                borderRadius: '50%'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-30px',
                left: '-30px',
                width: '100px',
                height: '100px',
                background: 'rgba(82, 196, 26, 0.05)',
                borderRadius: '50%'
            }} />
            
            <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #722ed1 0%, #9254de 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px',
                    boxShadow: '0 8px 24px rgba(114, 46, 209, 0.3)'
                }}>
                    <UserOutlined style={{ fontSize: '32px', color: '#fff' }} />
                </div>
                
                <Title level={4} style={{ 
                    margin: '0 0 8px 0',
                    background: 'linear-gradient(135deg, #722ed1 0%, #9254de 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}>
                    暂无咨询师信息
                </Title>
                <Text style={{ 
                    color: '#8c8c8c',
                    fontSize: '14px',
                    display: 'block',
                    marginBottom: '24px'
                }}>
                    专业的心理咨询师正在入驻中，敬请期待
                </Text>
            </div>
        </div>
    );

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
            title={
                <div style={{
                    margin: '0 -24px 0 -24px',
                    padding: '20px 24px',
                    borderBottom: '1px solid rgba(114, 46, 209, 0.1)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                background: 'linear-gradient(135deg, #722ed1 0%, #9254de 100%)',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '16px',
                                boxShadow: '0 4px 12px rgba(114, 46, 209, 0.3)'
                            }}>
                                <UserOutlined style={{ color: '#fff', fontSize: '20px' }} />
                            </div>
                            <div>
                                <Title level={4} style={{ 
                                    margin: 0,
                                    background: 'linear-gradient(135deg, #722ed1 0%, #9254de 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text'
                                }}>
                                    专业心理咨询师
                                </Title>
                                <Text style={{ color: '#8c8c8c', fontSize: '14px' }}>
                                    为您提供专业的心理健康服务
                                </Text>
                            </div>
                        </div>
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: '20px',
                            padding: '6px 16px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <Text style={{ 
                                fontSize: '12px',
                                fontWeight: '600',
                                color: '#722ed1'
                            }}>
                                共 {psyProfiles.length} 位咨询师
                            </Text>
                        </div>
                    </div>
                </div>
            }
        >
            <List
                dataSource={psyProfiles}
                split={false}
                locale={{ emptyText: customEmpty }}
                style={{ marginTop: '0px' }}
                renderItem={(psy, index) => (
                    <div 
                        key={index}
                        style={{
                            marginBottom: '20px',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer'
                        }}
                        onClick={() => handleViewProfile(psy.userid)}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <Card
                            hoverable
                            style={{
                                borderRadius: '16px',
                                overflow: 'hidden',
                                border: '1px solid rgba(114, 46, 209, 0.15)',
                                background: 'rgba(255, 255, 255, 0.9)',
                                boxShadow: '0 6px 20px rgba(114, 46, 209, 0.12)',
                                transition: 'all 0.3s ease',
                                backdropFilter: 'blur(10px)'
                            }}
                        >
                            <List.Item style={{ border: 'none', padding: 0 }}>
                                <List.Item.Meta
                                    avatar={
                                        <div style={{ position: 'relative' }}>
                                            <Avatar 
                                                src={psy.avatar} 
                                                size={80}
                                                style={{ 
                                                    boxShadow: '0 6px 16px rgba(114, 46, 209, 0.2)',
                                                    border: '4px solid #fff',
                                                    backgroundColor: '#722ed1'
                                                }}
                                                icon={<UserOutlined />}
                                            />
                                        </div>
                                    }
                                    title={
                                        <div style={{ marginBottom: '8px' }}>
                                            <div style={{ 
                                                display: 'flex', 
                                                justifyContent: 'space-between', 
                                                alignItems: 'center',
                                                marginBottom: '8px'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <Title 
                                                        level={5} 
                                                        style={{ 
                                                            margin: 0,
                                                            color: '#262626',
                                                            fontSize: '18px',
                                                            fontWeight: '600'
                                                        }}
                                                    >
                                                        {psy.username}
                                                    </Title>
                                                    <Tag 
                                                        style={{
                                                            background: 'linear-gradient(135deg, #722ed1 0%, #9254de 100%)',
                                                            border: 'none',
                                                            borderRadius: '12px',
                                                            color: '#fff',
                                                            fontSize: '12px',
                                                            fontWeight: '500',
                                                            padding: '2px 12px'
                                                        }}
                                                    >
                                                        {psy.title}
                                                    </Tag>
                                                </div>
                                                
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <Rate 
                                                        disabled 
                                                        value={psy.avgScore} 
                                                        allowHalf
                                                        style={{ fontSize: '14px', color: '#faad14' }} 
                                                    />
                                                    <Text style={{ fontSize: '13px', color: '#8c8c8c' }}>
                                                        ({psy.commentNum})
                                                    </Text>
                                                </div>
                                            </div>

                                            <div style={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: '16px',
                                                marginBottom: '12px'
                                            }}>
                                                <Space size={8}>
                                                    <TrophyOutlined style={{ color: '#faad14', fontSize: '14px' }} />
                                                    <Text style={{ fontSize: '13px', color: '#595959' }}>
                                                        {psy.license}
                                                    </Text>
                                                </Space>
                                                <Space size={8}>
                                                    <BookOutlined style={{ color: '#722ed1', fontSize: '14px' }} />
                                                    <Text style={{ fontSize: '13px', color: '#595959' }}>
                                                        {formatWorkingYears(psy.workingYears)}
                                                    </Text>
                                                </Space>
                                            </div>

                                            <div style={{ marginBottom: '12px' }}>
                                                <Space size={8} wrap>
                                                    {psy.specialty.slice(0, 4).map((tag) => (
                                                        <Tag 
                                                            key={tag.id}
                                                            style={{
                                                                background: `${getSpecialtyColor(tag.id)}15`,
                                                                border: `1px solid ${getSpecialtyColor(tag.id)}30`,
                                                                borderRadius: '8px',
                                                                color: getSpecialtyColor(tag.id),
                                                                fontSize: '12px',
                                                                padding: '2px 8px',
                                                                fontWeight: '500'
                                                            }}
                                                        >
                                                            {tag.content}
                                                        </Tag>
                                                    ))}
                                                    {psy.specialty.length > 4 && (
                                                        <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>
                                                            +{psy.specialty.length - 4}
                                                        </Text>
                                                    )}
                                                </Space>
                                            </div>
                                        </div>
                                    }
                                    description={
                                        <div>
                                            <Text 
                                                style={{ 
                                                    color: '#595959',
                                                    fontSize: '14px',
                                                    lineHeight: '1.6',
                                                    display: 'block',
                                                    marginBottom: '16px'
                                                }}
                                                ellipsis={{ rows: 2 }}
                                            >
                                                {psy.introduction}
                                            </Text>
                                            
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                paddingTop: '16px',
                                                borderTop: '1px solid rgba(114, 46, 209, 0.1)'
                                            }}>
                                                <Space size={20}>
                                                    {psy.location && (
                                                        <div style={{ 
                                                            display: 'flex', 
                                                            alignItems: 'center', 
                                                            gap: '4px'
                                                        }}>
                                                            <EnvironmentOutlined style={{ 
                                                                fontSize: '14px', 
                                                                color: '#13c2c2' 
                                                            }} />
                                                            <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>
                                                                {psy.location}
                                                            </Text>
                                                        </div>
                                                    )}
                                                    <div style={{ 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        gap: '4px'
                                                    }}>
                                                        <ClockCircleOutlined style={{ 
                                                            fontSize: '14px', 
                                                            color: '#52c41a' 
                                                        }} />
                                                        <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>
                                                            {psy.responseTime}
                                                        </Text>
                                                    </div>
                                                    {psy.consultationFee && (
                                                        <div style={{ 
                                                            display: 'flex', 
                                                            alignItems: 'center', 
                                                            gap: '4px'
                                                        }}>
                                                            <HeartOutlined style={{ 
                                                                fontSize: '14px', 
                                                                color: '#ff4d4f' 
                                                            }} />
                                                            <Text style={{ 
                                                                fontSize: '13px', 
                                                                color: '#ff4d4f',
                                                                fontWeight: '600'
                                                            }}>
                                                                {psy.consultationFee}
                                                            </Text>
                                                        </div>
                                                    )}
                                                </Space>
                                                
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <Button
                                                        size="small"
                                                        icon={<MessageOutlined />}
                                                        style={{
                                                            borderRadius: '8px',
                                                            border: '1px solid #722ed1',
                                                            color: '#722ed1'
                                                        }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleCounseling(psy.userid);
                                                        }}
                                                    >
                                                        咨询
                                                    </Button>
                                                    <Button
                                                        type="primary"
                                                        size="small"
                                                        style={{
                                                            background: 'linear-gradient(135deg, #722ed1 0%, #9254de 100%)',
                                                            border: 'none',
                                                            borderRadius: '8px',
                                                            fontWeight: '500'
                                                        }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleViewProfile(psy.userid);
                                                        }}
                                                    >
                                                        查看详情
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                />
                            </List.Item>
                        </Card>
                    </div>
                )}
            />
        </Card>
    );
}