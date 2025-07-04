import React, { useState, useEffect } from "react";
import { Card, Space, Typography } from "antd";
import { SmileOutlined, MehOutlined, FrownOutlined, HeartOutlined, FileTextOutlined, GiftOutlined } from "@ant-design/icons";
import PushList from "../pushlist";

const { Title, Text } = Typography;

export default function EmotionPush({score, urlDatas, pageIndex, setPageIndex, pageSize}) {
    const getText = (score) => {
        if (score >= 4.0) return { 
            icon: <SmileOutlined style={{ color: '#52c41a' }} />, 
            color: '#52c41a', 
            text: "心情很棒！为您推荐更多美好内容",
            emoji: "😊"
        };
        if (score >= 3.0) return { 
            icon: <HeartOutlined style={{ color: '#1890ff' }} />, 
            color: '#1890ff', 
            text: "心情不错，来看看这些温暖的内容吧",
            emoji: "💙"
        };
        if (score >= 2.0) return { 
            icon: <MehOutlined style={{ color: '#faad14' }} />, 
            color: '#faad14', 
            text: "心情平稳，或许这些内容能让您更开心",
            emoji: "🌤️"
        };
        return { 
            icon: <FrownOutlined style={{ color: '#ff7875' }} />, 
            color: '#ff7875', 
            text: "希望这些内容能给您带来一些温暖",
            emoji: "🌈"
        };
    }

    if (!score) {
        return (
            <Card 
                title={
                    <div style={{ padding: '12px 0 8px' }}>
                        <Space>
                            <FileTextOutlined style={{ 
                                fontSize: '22px', 
                                color: '#1890ff',
                                background: 'rgba(24, 144, 255, 0.1)',
                                padding: '8px',
                                borderRadius: '8px'
                            }} />
                            <Title level={4} style={{ margin: 0, color: '#262626' }}> 
                                今日推送 
                            </Title>
                        </Space>
                    </div>
                }
                style={{ 
                    boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: 'none'
                }}
                extra={
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        background: 'linear-gradient(135deg, #e6f7ff 0%, #f6ffed 100%)',
                        padding: '10px 18px',
                        borderRadius: '25px',
                        border: '2px solid rgba(24, 144, 255, 0.1)',
                        boxShadow: '0 2px 8px rgba(24, 144, 255, 0.1)'
                    }}>
                        <GiftOutlined style={{ color: '#1890ff', marginRight: 8, fontSize: '16px' }} />
                        <Text style={{ 
                            fontSize: '14px',
                            color: '#1890ff',
                            fontWeight: 600,
                            margin: 0
                        }}>
                            精选内容推荐
                        </Text>
                    </div>
                }
            >
                <div style={{
                    background: 'linear-gradient(135deg, #f8fcff 0%, #e6f7ff 100%)',
                    padding: '24px 28px',
                    borderRadius: '16px',
                    border: '2px solid rgba(24, 144, 255, 0.08)',
                    marginBottom: '24px',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '-10px',
                        right: '-10px',
                        width: '60px',
                        height: '60px',
                        background: 'rgba(24, 144, 255, 0.05)',
                        borderRadius: '50%',
                        zIndex: 0
                    }} />
                    
                    <Space align="center" style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ 
                            fontSize: '32px',
                            background: 'linear-gradient(135deg, #1890ff, #36cfc9)',
                            borderRadius: '12px',
                            padding: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            🌟
                        </div>
                        <div>
                            <Text style={{ 
                                fontSize: '16px',
                                color: '#1890ff',
                                fontWeight: 600,
                                display: 'block',
                                marginBottom: '6px'
                            }}>
                                为您精心挑选的内容
                            </Text>
                            <Text style={{ 
                                fontSize: '13px',
                                color: '#8c8c8c',
                                lineHeight: 1.5
                            }}>
                                记录今日心情后，我们将为您推荐更个性化的内容
                            </Text>
                        </div>
                    </Space>
                </div>
                
                <PushList urlDatas={urlDatas} inhome={true} />
            </Card>
        );
    }

    const { icon, color, text, emoji } = getText(score);

    return (
        <Card 
            title={
                <div style={{ padding: '12px 0 8px' }}>
                    <Space>
                        <FileTextOutlined style={{ 
                            fontSize: '22px', 
                            color: '#1890ff',
                            background: 'rgba(24, 144, 255, 0.1)',
                            padding: '8px',
                            borderRadius: '8px'
                        }} />
                        <Title level={4} style={{ margin: 0, color: '#262626' }}> 
                            今日推送 
                        </Title>
                    </Space>
                </div>
            }
            style={{ 
                boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
                borderRadius: '16px',
                overflow: 'hidden',
                border: 'none'
            }}
            extra={
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    background: `linear-gradient(135deg, ${color}15 0%, ${color}08 100%)`,
                    padding: '10px 18px',
                    borderRadius: '25px',
                    border: `2px solid ${color}20`,
                    boxShadow: `0 2px 8px ${color}15`
                }}>
                    {icon}
                    <Text style={{ 
                        fontSize: '14px',
                        color: color,
                        fontWeight: 600,
                        marginLeft: 8
                    }}>
                        个性化推荐
                    </Text>
                </div>
            }
        >
            <div style={{
                background: `linear-gradient(135deg, ${color}06 0%, ${color}03 100%)`,
                padding: '24px 28px',
                borderRadius: '16px',
                border: `2px solid ${color}15`,
                marginBottom: '24px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '-20px',
                    right: '-20px',
                    width: '80px',
                    height: '80px',
                    background: `${color}08`,
                    borderRadius: '50%',
                    zIndex: 0
                }} />
                
                <Space align="center" style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ 
                        fontSize: '32px',
                        background: `linear-gradient(135deg, ${color}15, ${color}25)`,
                        borderRadius: '16px',
                        padding: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 4px 12px ${color}20`
                    }}>
                        {emoji}
                    </div>
                    <div>
                        <Text style={{ 
                            fontSize: '16px',
                            color: color,
                            fontWeight: 600,
                            display: 'block',
                            marginBottom: '6px'
                        }}>
                            {text}
                        </Text>
                        <Text style={{ 
                            fontSize: '13px',
                            color: '#8c8c8c',
                            lineHeight: 1.5
                        }}>
                            根据您今日的心情为您推荐的内容
                        </Text>
                    </div>
                </Space>
            </div>
            
            <PushList urlDatas={urlDatas} inhome={true} pageIndex={pageIndex} setPageIndex={setPageIndex} pageSize={pageSize} />
        </Card>
    );
}