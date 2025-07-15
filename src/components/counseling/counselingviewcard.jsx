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
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const { message } = App.useApp();
    const navigate = useNavigate();

    // 监听屏幕尺寸变化
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setIsMobile(width < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
            '#1890ff', '#52c41a', '#fa8c16', '#eb2f96', 
            '#13c2c2', '#faad14', '#f5222d', '#722ed1'
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
            borderRadius: isMobile ? '16px' : '20px',
            padding: isMobile ? '40px 20px' : '60px 40px',
            textAlign: 'center',
            border: '1px solid rgba(24, 144, 255, 0.1)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{
                position: 'absolute',
                top: isMobile ? '-30px' : '-50px',
                right: isMobile ? '-30px' : '-50px',
                width: isMobile ? '100px' : '150px',
                height: isMobile ? '100px' : '150px',
                background: 'rgba(24, 144, 255, 0.05)',
                borderRadius: '50%'
            }} />
            <div style={{
                position: 'absolute',
                bottom: isMobile ? '-20px' : '-30px',
                left: isMobile ? '-20px' : '-30px',
                width: isMobile ? '70px' : '100px',
                height: isMobile ? '70px' : '100px',
                background: 'rgba(82, 196, 26, 0.05)',
                borderRadius: '50%'
            }} />
            
            <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                    width: isMobile ? '60px' : '80px',
                    height: isMobile ? '60px' : '80px',
                    background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px',
                    boxShadow: '0 8px 24px rgba(24, 144, 255, 0.3)'
                }}>
                    <UserOutlined style={{ 
                        fontSize: isMobile ? '24px' : '32px', 
                        color: '#fff' 
                    }} />
                </div>
                
                <Title level={isMobile ? 5 : 4} style={{ 
                    margin: '0 0 8px 0',
                    background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}>
                    暂无咨询师信息
                </Title>
                <Text style={{ 
                    color: '#8c8c8c',
                    fontSize: isMobile ? '12px' : '14px',
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
                borderRadius: isMobile ? '16px' : '20px',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(24, 144, 255, 0.12)',
                position: 'relative'
            }}
            title={
                <div style={{
                    margin: isMobile ? '0 -16px 0 -16px' : '0 -24px 0 -24px',
                    padding: isMobile ? '16px' : '20px 24px',
                    borderBottom: '1px solid rgba(24, 144, 255, 0.1)'
                }}>
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        flexDirection: isMobile ? 'column' : 'row',
                        gap: isMobile ? '12px' : '0'
                    }}>
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            width: isMobile ? '100%' : 'auto',
                            justifyContent: isMobile ? 'center' : 'flex-start'
                        }}>
                            <div style={{
                                width: isMobile ? '40px' : '48px',
                                height: isMobile ? '40px' : '48px',
                                background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
                                borderRadius: isMobile ? '10px' : '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: isMobile ? '12px' : '16px',
                                boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)'
                            }}>
                                <UserOutlined style={{ 
                                    color: '#fff', 
                                    fontSize: isMobile ? '16px' : '20px' 
                                }} />
                            </div>
                            <div style={{ textAlign: isMobile ? 'center' : 'left' }}>
                                <Title level={isMobile ? 5 : 4} style={{ 
                                    margin: 0,
                                    background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text'
                                }}>
                                    专业心理咨询师
                                </Title>
                                <Text style={{ 
                                    color: '#8c8c8c', 
                                    fontSize: isMobile ? '12px' : '14px',
                                    display: isMobile ? 'none' : 'block'
                                }}>
                                    为您提供专业的心理健康服务
                                </Text>
                            </div>
                        </div>
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: '20px',
                            padding: isMobile ? '4px 12px' : '6px 16px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <Text style={{ 
                                fontSize: isMobile ? '10px' : '12px',
                                fontWeight: '600',
                                color: '#1890ff'
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
                            marginBottom: isMobile ? '16px' : '20px',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer'
                        }}
                        onClick={() => handleViewProfile(psy.userid)}
                        onMouseEnter={(e) => {
                            if (!isMobile) {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isMobile) {
                                e.currentTarget.style.transform = 'translateY(0)';
                            }
                        }}
                    >
                        <Card
                            hoverable={!isMobile}
                            style={{
                                borderRadius: isMobile ? '12px' : '16px',
                                overflow: 'hidden',
                                border: '1px solid rgba(24, 144, 255, 0.15)',
                                background: 'rgba(255, 255, 255, 0.9)',
                                boxShadow: '0 6px 20px rgba(24, 144, 255, 0.12)',
                                transition: 'all 0.3s ease',
                                backdropFilter: 'blur(10px)'
                            }}
                            bodyStyle={{
                                padding: isMobile ? '16px' : '24px'
                            }}
                        >
                            <List.Item style={{ border: 'none', padding: 0 }}>
                                <List.Item.Meta
                                    avatar={
                                        <div style={{ 
                                            position: 'relative',
                                            alignSelf: isMobile ? 'center' : 'flex-start',
                                            marginBottom: isMobile ? '12px' : '0'
                                        }}>
                                            <Avatar 
                                                src={psy.avatar} 
                                                size={isMobile ? 60 : 80}
                                                style={{ 
                                                    boxShadow: '0 6px 16px rgba(24, 144, 255, 0.2)',
                                                    border: isMobile ? '3px solid #fff' : '4px solid #fff',
                                                    backgroundColor: '#1890ff'
                                                }}
                                                icon={<UserOutlined />}
                                            />
                                        </div>
                                    }
                                    title={
                                        <div style={{ 
                                            marginBottom: isMobile ? '6px' : '8px',
                                            textAlign: isMobile ? 'center' : 'left'
                                        }}>
                                            <div style={{ 
                                                display: 'flex', 
                                                justifyContent: isMobile ? 'center' : 'space-between', 
                                                alignItems: 'center',
                                                marginBottom: isMobile ? '6px' : '8px',
                                                flexDirection: isMobile ? 'column' : 'row',
                                                gap: isMobile ? '8px' : '0'
                                            }}>
                                                <div style={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    gap: isMobile ? '8px' : '12px',
                                                    flexDirection: isMobile ? 'column' : 'row'
                                                }}>
                                                    <Title 
                                                        level={5} 
                                                        style={{ 
                                                            margin: 0,
                                                            color: '#262626',
                                                            fontSize: isMobile ? '16px' : '18px',
                                                            fontWeight: '600'
                                                        }}
                                                    >
                                                        {psy.username}
                                                    </Title>
                                                    <Tag 
                                                        style={{
                                                            background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
                                                            border: 'none',
                                                            borderRadius: '12px',
                                                            color: '#fff',
                                                            fontSize: isMobile ? '10px' : '12px',
                                                            fontWeight: '500',
                                                            padding: isMobile ? '1px 8px' : '2px 12px'
                                                        }}
                                                    >
                                                        {psy.title}
                                                    </Tag>
                                                </div>
                                                
                                                <div style={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    gap: isMobile ? '4px' : '8px' 
                                                }}>
                                                    <Rate 
                                                        disabled 
                                                        value={psy.avgScore} 
                                                        allowHalf
                                                        style={{ 
                                                            fontSize: isMobile ? '12px' : '14px', 
                                                            color: '#faad14' 
                                                        }} 
                                                    />
                                                    <Text style={{ 
                                                        fontSize: isMobile ? '11px' : '13px', 
                                                        color: '#8c8c8c' 
                                                    }}>
                                                        ({psy.commentNum})
                                                    </Text>
                                                </div>
                                            </div>

                                            <div style={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: isMobile ? '12px' : '16px',
                                                marginBottom: isMobile ? '10px' : '12px',
                                                justifyContent: isMobile ? 'center' : 'flex-start',
                                                flexWrap: 'wrap'
                                            }}>
                                                <Space size={isMobile ? 4 : 8}>
                                                    <TrophyOutlined style={{ 
                                                        color: '#faad14', 
                                                        fontSize: isMobile ? '12px' : '14px' 
                                                    }} />
                                                    <Text style={{ 
                                                        fontSize: isMobile ? '11px' : '13px', 
                                                        color: '#595959' 
                                                    }}>
                                                        {isMobile ? psy.license.slice(0, 8) + '...' : psy.license}
                                                    </Text>
                                                </Space>
                                                <Space size={isMobile ? 4 : 8}>
                                                    <BookOutlined style={{ 
                                                        color: '#1890ff', 
                                                        fontSize: isMobile ? '12px' : '14px' 
                                                    }} />
                                                    <Text style={{ 
                                                        fontSize: isMobile ? '11px' : '13px', 
                                                        color: '#595959' 
                                                    }}>
                                                        {formatWorkingYears(psy.workingYears)}
                                                    </Text>
                                                </Space>
                                            </div>

                                            <div style={{ 
                                                marginBottom: isMobile ? '10px' : '12px',
                                                textAlign: isMobile ? 'center' : 'left'
                                            }}>
                                                <Space size={isMobile ? 4 : 8} wrap>
                                                    {psy.specialty.slice(0, isMobile ? 3 : 4).map((tag) => (
                                                        <Tag 
                                                            key={tag.id}
                                                            style={{
                                                                background: `${getSpecialtyColor(tag.id)}15`,
                                                                border: `1px solid ${getSpecialtyColor(tag.id)}30`,
                                                                borderRadius: '8px',
                                                                color: getSpecialtyColor(tag.id),
                                                                fontSize: isMobile ? '10px' : '12px',
                                                                padding: isMobile ? '1px 6px' : '2px 8px',
                                                                fontWeight: '500'
                                                            }}
                                                        >
                                                            {tag.content}
                                                        </Tag>
                                                    ))}
                                                    {psy.specialty.length > (isMobile ? 3 : 4) && (
                                                        <Text style={{ 
                                                            fontSize: isMobile ? '10px' : '12px', 
                                                            color: '#8c8c8c' 
                                                        }}>
                                                            +{psy.specialty.length - (isMobile ? 3 : 4)}
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
                                                    fontSize: isMobile ? '12px' : '14px',
                                                    lineHeight: '1.6',
                                                    display: 'block',
                                                    marginBottom: isMobile ? '12px' : '16px',
                                                    textAlign: isMobile ? 'center' : 'left'
                                                }}
                                                ellipsis={{ rows: isMobile ? 1 : 2 }}
                                            >
                                                {psy.introduction}
                                            </Text>
                                            
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: isMobile ? 'flex-start' : 'center',
                                                paddingTop: isMobile ? '12px' : '16px',
                                                borderTop: '1px solid rgba(24, 144, 255, 0.1)',
                                                flexDirection: isMobile ? 'column' : 'row',
                                                gap: isMobile ? '12px' : '0'
                                            }}>
                                                <Space 
                                                    size={isMobile ? 12 : 20}
                                                    wrap
                                                    style={{ 
                                                        justifyContent: isMobile ? 'center' : 'flex-start',
                                                        width: isMobile ? '100%' : 'auto'
                                                    }}
                                                >
                                                    {psy.location && (
                                                        <div style={{ 
                                                            display: 'flex', 
                                                            alignItems: 'center', 
                                                            gap: '4px'
                                                        }}>
                                                            <EnvironmentOutlined style={{ 
                                                                fontSize: isMobile ? '12px' : '14px', 
                                                                color: '#13c2c2' 
                                                            }} />
                                                            <Text style={{ 
                                                                fontSize: isMobile ? '10px' : '12px', 
                                                                color: '#8c8c8c' 
                                                            }}>
                                                                {isMobile ? psy.location.slice(0, 6) : psy.location}
                                                            </Text>
                                                        </div>
                                                    )}
                                                    <div style={{ 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        gap: '4px'
                                                    }}>
                                                        <ClockCircleOutlined style={{ 
                                                            fontSize: isMobile ? '12px' : '14px', 
                                                            color: '#52c41a' 
                                                        }} />
                                                        <Text style={{ 
                                                            fontSize: isMobile ? '10px' : '12px', 
                                                            color: '#8c8c8c' 
                                                        }}>
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
                                                                fontSize: isMobile ? '12px' : '14px', 
                                                                color: '#ff4d4f' 
                                                            }} />
                                                            <Text style={{ 
                                                                fontSize: isMobile ? '11px' : '13px', 
                                                                color: '#ff4d4f',
                                                                fontWeight: '600'
                                                            }}>
                                                                {psy.consultationFee}
                                                            </Text>
                                                        </div>
                                                    )}
                                                </Space>
                                                
                                                <div style={{ 
                                                    display: 'flex', 
                                                    gap: isMobile ? '12px' : '8px',
                                                    width: isMobile ? '100%' : 'auto',
                                                    justifyContent: isMobile ? 'center' : 'flex-end'
                                                }}>
                                                    <Button
                                                        size={isMobile ? "middle" : "small"}
                                                        icon={<MessageOutlined />}
                                                        style={{
                                                            borderRadius: '8px',
                                                            border: '1px solid #1890ff',
                                                            color: '#1890ff',
                                                            fontSize: isMobile ? '12px' : '14px',
                                                            height: isMobile ? '32px' : 'auto',
                                                            minWidth: isMobile ? '60px' : 'auto'
                                                        }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleCounseling(psy.userid);
                                                        }}
                                                    >
                                                        {isMobile ? '咨询' : '咨询'}
                                                    </Button>
                                                    <Button
                                                        type="primary"
                                                        size={isMobile ? "middle" : "small"}
                                                        style={{
                                                            background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
                                                            border: 'none',
                                                            borderRadius: '8px',
                                                            fontWeight: '500',
                                                            fontSize: isMobile ? '12px' : '14px',
                                                            height: isMobile ? '32px' : 'auto',
                                                            minWidth: isMobile ? '80px' : 'auto'
                                                        }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleViewProfile(psy.userid);
                                                        }}
                                                    >
                                                        {isMobile ? '详情' : '查看详情'}
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