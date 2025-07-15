import React, { useState, useEffect } from "react";
import { Card, Timeline, Typography, Badge, Tag, Avatar, Space, Tooltip } from "antd";
import { 
    UserAddOutlined, EditOutlined, LikeOutlined, SmileOutlined, 
    MessageOutlined, CalendarOutlined, TrophyOutlined, TeamOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;

export default function ProcessLine({milestones}) {
    const getMilestoneConfig = (type) => {
        const configs = {
            register: {
                icon: <UserAddOutlined />,
                color: '#1890ff',
                bgColor: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
                tag: '起点'
            },
            first_post: {
                icon: <EditOutlined />,
                color: '#52c41a',
                bgColor: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)',
                tag: '分享'
            },
            first_like: {
                icon: <LikeOutlined />,
                color: '#fa541c',
                bgColor: 'linear-gradient(135deg, #fff2e8 0%, #ffd8bf 100%)',
                tag: '认可'
            },
            positive_week: {
                icon: <SmileOutlined />,
                color: '#faad14',
                bgColor: 'linear-gradient(135deg, #fffbe6 0%, #fff1b8 100%)',
                tag: '成长'
            },
            first_message: {
                icon: <MessageOutlined />,
                color: '#722ed1',
                bgColor: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
                tag: '交流'
            },
            counseling: {
                icon: <CalendarOutlined />,
                color: '#eb2f96',
                bgColor: 'linear-gradient(135deg, #fff0f6 0%, #ffd6e7 100%)',
                tag: '专业'
            },
            active_member: {
                icon: <TrophyOutlined />,
                color: '#13c2c2',
                bgColor: 'linear-gradient(135deg, #e6fffb 0%, #b5f5ec 100%)',
                tag: '荣誉'
            },
            helper: {
                icon: <TeamOutlined />,
                color: '#f5222d',
                bgColor: 'linear-gradient(135deg, #fff2f0 0%, #ffccc7 100%)',
                tag: '助人'
            }
        };
        return configs[type];
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return '待解锁';
        const date = new Date(timestamp);
        return date.toLocaleDateString('zh-CN', { 
            year: 'numeric',
            month: 'short', 
            day: 'numeric'
        });
    };

    const renderTimelineItem = (milestone) => {
        const config = getMilestoneConfig(milestone.type);
        const isAchieved = milestone.timestamp ? true : false;
        
        return {
            dot: (
                <div style={{
                    width: '40px',
                    height: '40px',
                    background: isAchieved 
                        ? `linear-gradient(135deg, ${config.color} 0%, ${config.color}cc 100%)`
                        : 'linear-gradient(135deg, #d9d9d9 0%, #bfbfbf 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isAchieved 
                        ? `0 4px 12px ${config.color}30`
                        : '0 2px 8px rgba(0,0,0,0.1)',
                    border: '3px solid #fff',
                    fontSize: '16px',
                    color: '#fff',
                    position: 'relative',
                    zIndex: 1
                }}>
                    {config.icon}
                    {isAchieved && (
                        <div style={{
                            position: 'absolute',
                            top: '-2px',
                            right: '-2px',
                            width: '12px',
                            height: '12px',
                            background: '#52c41a',
                            borderRadius: '50%',
                            border: '2px solid #fff',
                            fontSize: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            ✓
                        </div>
                    )}
                </div>
            ),
            children: (
                <div style={{
                    background: isAchieved ? config.bgColor : 'linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)',
                    padding: '20px',
                    borderRadius: '16px',
                    border: `2px solid ${isAchieved ? config.color + '30' : '#d9d9d9'}`,
                    marginBottom: '16px',
                    position: 'relative',
                    overflow: 'hidden',
                    opacity: isAchieved ? 1 : 0.6,
                    transition: 'all 0.3s ease'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: -10,
                        right: -10,
                        width: 40,
                        height: 40,
                        background: `linear-gradient(135deg, ${isAchieved ? config.color : '#d9d9d9'}15, transparent)`,
                        borderRadius: '50%'
                    }} />
                    
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-start',
                        marginBottom: '8px'
                    }}>
                        <div>
                            <Space>
                                <Title level={5} style={{ 
                                    margin: 0, 
                                    color: isAchieved ? config.color : '#8c8c8c',
                                    fontSize: '16px'
                                }}>
                                    {milestone.title}
                                </Title>
                                <Tag style={{
                                    background: isAchieved 
                                        ? `linear-gradient(135deg, ${config.color}, ${config.color}cc)`
                                        : 'linear-gradient(135deg, #d9d9d9, #bfbfbf)',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '10px',
                                    fontWeight: '500'
                                }}>
                                    {config.tag}
                                </Tag>
                            </Space>
                        </div>
                        <Text style={{ 
                            fontSize: '12px', 
                            color: isAchieved ? config.color : '#8c8c8c',
                            fontWeight: '500'
                        }}>
                            {formatDate(milestone.timestamp)}
                        </Text>
                    </div>
                    
                    <Text style={{ 
                        color: isAchieved ? '#595959' : '#8c8c8c',
                        fontSize: '14px',
                        lineHeight: '1.5'
                    }}>
                        {milestone.description}
                    </Text>
                </div>
            )
        };
    };

    const achievedCount = milestones.filter(m => m.timestamp).length;
    const totalCount = milestones.length;

    return (
        <Card 
            style={{ 
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 50%, #f6ffed 100%)',
                border: '1px solid rgba(24, 144, 255, 0.15)',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(24, 144, 255, 0.12)',
                position: 'relative',
                marginBottom: '24px'
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
                            <TrophyOutlined style={{ color: '#fff', fontSize: '24px' }} />
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
                                成长历程
                            </Title>
                            <Text style={{ 
                                color: '#595959', 
                                fontSize: '14px',
                                fontWeight: '500'
                            }}>
                                记录你在社区的重要时刻
                            </Text>
                        </div>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Badge 
                            count={`${achievedCount}/${totalCount}`}
                            style={{ 
                                backgroundColor: '#1890ff',
                                boxShadow: '0 0 0 1px #fff',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: '500',
                                padding: '4px 12px',
                                marginBottom: '4px',
                                height: '24px',
                                lineHeight: '16px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }} 
                        />
                        <div style={{ display: 'flex', gap: '4px' }}>
                            {[1,2,3].map(i => (
                                <div key={i} style={{
                                    width: '6px',
                                    height: '6px',
                                    background: '#1890ff',
                                    borderRadius: '50%'
                                }} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ padding: '0 24px' }}>
                <Timeline
                    mode="left"
                    items={milestones.map(milestone => renderTimelineItem(milestone))}
                    style={{
                        paddingTop: '20px'
                    }}
                />
            </div>
        </Card>
    );
}