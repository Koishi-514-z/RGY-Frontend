import React, { useState, useEffect } from "react";
import { Rate, Tag, Button, Card, Space, Typography, Row, Col, App, Divider } from "antd";
import { getTags } from "../service/emotion";
import { EditOutlined, PlusOutlined, HeartOutlined, ClockCircleOutlined } from "@ant-design/icons";
import Loading from "../components/loading";
import EmotionScoringModal from "./emotionscoringmodal";

const { Title, Text } = Typography;

export default function EmotionScoring({emotion, setEmotion}) {
    const [editting, setEditting] = useState(false);
    const [tags, setTags] = useState([]);
    const { message } = App.useApp();

    useEffect(() => {
        const fetch = async () => {
            const fetched_tags = await getTags();
            setTags(fetched_tags);
        }
        fetch();
    }, []);

    const handleOpen = () => {
        setEditting(true);
    }

    const getEmotionData = (score) => {
        if (score >= 4.0) return { 
            color: '#52c41a', 
            emoji: '😊',
            text: '心情很棒',
            description: '继续保持这美好的状态'
        };
        if (score >= 3.0) return { 
            color: '#1890ff', 
            emoji: '💙',
            text: '心情不错',
            description: '今天是个不错的日子'
        };
        if (score >= 2.0) return { 
            color: '#faad14', 
            emoji: '🌤️',
            text: '心情平稳',
            description: '或许可以做些开心的事'
        };
        return { 
            color: '#ff7875', 
            emoji: '🌈',
            text: '需要关爱',
            description: '希望能给您带来一些温暖'
        };
    }

    const getEmotionTag = (tag) => {
        if(tags.length === 0) {
            return null;
        }
        
        const tagStyles = [
            { color: '#52c41a', bg: '#f6ffed' },
            { color: '#f5222d', bg: '#fff1f0' },
            { color: '#faad14', bg: '#fffbe6' },
            { color: '#fa8c16', bg: '#fff7e6' },
            { color: '#1890ff', bg: '#e6f7ff' }
        ];
        
        try {
            const tagIndex = tag.id - 1;
            if(tagIndex >= 0 && tagIndex < tags.length) {
                const style = tagStyles[tagIndex];
                return (
                    <Tag 
                        style={{ 
                            padding: '8px 16px', 
                            fontSize: '14px',
                            borderRadius: '14px',
                            margin: 0,
                            backgroundColor: style.bg,
                            color: style.color,
                            border: 'none',
                            fontWeight: 500
                        }}
                    >
                        {tags[tagIndex].content}
                    </Tag>
                );
            }
        } 
        catch (error) {
            message.error("Error rendering emotion tag: ", error);
        }
        return <Tag>Unknown</Tag>;
    };

    if(!emotion || tags.length === 0) {
        return <Loading/>
    }

    if(!emotion.tag) {
        return (
            <Card 
                title={
                    <div style={{ padding: '8px 0' }}>
                        <Space>
                            <HeartOutlined style={{ 
                                fontSize: '20px', 
                                color: '#1890ff',
                                background: 'rgba(24, 144, 255, 0.1)',
                                padding: '6px',
                                borderRadius: '6px'
                            }} />
                            <Title level={4} style={{ margin: 0, color: '#262626' }}>
                                今日心情打卡
                            </Title>
                        </Space>
                    </div>
                }
                style={{ 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: 'none',
                    marginBottom: '24px'
                }}
                extra={
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        background: 'linear-gradient(135deg, #1890ff15 0%, #1890ff08 100%)',
                        padding: '6px 14px',
                        borderRadius: '16px',
                        border: '1px solid #1890ff20'
                    }}>
                        <ClockCircleOutlined style={{ color: '#1890ff', marginRight: 6, fontSize: '14px' }} />
                        <Text style={{ 
                            fontSize: '13px',
                            color: '#1890ff',
                            fontWeight: 500,
                            margin: 0
                        }}>
                            {new Date().toLocaleDateString()}
                        </Text>
                    </div>
                }
            >
                <div style={{
                    background: 'linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%)',
                    padding: '40px 20px',
                    borderRadius: '12px',
                    border: '1px dashed #91d5ff',
                    textAlign: 'center',
                    marginBottom: '20px'
                }}>
                    <div style={{
                        fontSize: '48px',
                        marginBottom: '16px',
                        opacity: 0.6
                    }}>
                        🌱
                    </div>
                    <Title level={4} style={{ 
                        color: '#1890ff',
                        marginBottom: '8px'
                    }}>
                        还没有记录今日心情
                    </Title>
                    <Text style={{ 
                        fontSize: '14px',
                        color: '#8c8c8c',
                        display: 'block',
                        marginBottom: '24px',
                        lineHeight: 1.6
                    }}>
                        记录心情是关爱自己的第一步
                        <br />
                        让我们一起开始这段美好的心理健康之旅
                    </Text>
                    
                    <div style={{
                        background: '#fff',
                        borderRadius: '8px',
                        padding: '16px',
                        marginBottom: '24px',
                        border: '1px solid #f0f0f0'
                    }}>
                        <Row gutter={[16, 12]} justify="center">
                            <Col xs={24} sm={8}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '20px', marginBottom: '8px' }}>⭐</div>
                                    <Text style={{ fontSize: '12px', color: '#595959' }}>
                                        评分打卡
                                    </Text>
                                </div>
                            </Col>
                            <Col xs={24} sm={8}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '20px', marginBottom: '8px' }}>🏷️</div>
                                    <Text style={{ fontSize: '12px', color: '#595959' }}>
                                        情绪标签
                                    </Text>
                                </div>
                            </Col>
                            <Col xs={24} sm={8}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '20px', marginBottom: '8px' }}>📝</div>
                                    <Text style={{ fontSize: '12px', color: '#595959' }}>
                                        心情记录
                                    </Text>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
                
                <Row justify="center">
                    <Col xs={24} sm={16} md={12} lg={8}>
                        <Button 
                            type="primary" 
                            icon={<PlusOutlined />}
                            onClick={handleOpen}
                            size="large"
                            block
                            style={{ 
                                height: '48px',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: 600,
                                boxShadow: '0 3px 10px rgba(24, 144, 255, 0.2)',
                                background: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)',
                                border: 'none'
                            }}
                        >
                            开始记录心情
                        </Button>
                    </Col>
                </Row>

                <EmotionScoringModal tags={tags} editting={editting} setEditting={setEditting} setEmotion={setEmotion} />
            </Card>
        )
    }

    const emotionData = getEmotionData(emotion.score);

    return (
        <Card 
            title={
                <div style={{ padding: '8px 0' }}>
                    <Space>
                        <HeartOutlined style={{ 
                            fontSize: '20px', 
                            color: '#1890ff',
                            background: 'rgba(24, 144, 255, 0.1)',
                            padding: '6px',
                            borderRadius: '6px'
                        }} />
                        <Title level={4} style={{ margin: 0, color: '#262626' }}>
                            今日心情打卡
                        </Title>
                    </Space>
                </div>
            }
            style={{ 
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                borderRadius: '12px',
                overflow: 'hidden',
                border: 'none',
                marginBottom: '24px'
            }}
            extra={
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    background: `linear-gradient(135deg, ${emotionData.color}15 0%, ${emotionData.color}08 100%)`,
                    padding: '6px 14px',
                    borderRadius: '16px',
                    border: `1px solid ${emotionData.color}20`
                }}>
                    <ClockCircleOutlined style={{ color: emotionData.color, marginRight: 6, fontSize: '14px' }} />
                    <Text style={{ 
                        fontSize: '13px',
                        color: emotionData.color,
                        fontWeight: 500,
                        margin: 0
                    }}>
                        {new Date().toLocaleDateString()}
                    </Text>
                </div>
            }
        >
            <div style={{
                background: `linear-gradient(135deg, ${emotionData.color}06 0%, ${emotionData.color}03 100%)`,
                padding: '24px 20px',
                borderRadius: '12px',
                border: `1px solid ${emotionData.color}15`,
                marginBottom: '20px'
            }}>
                <Row align="middle" gutter={[20, 16]}>
                    <Col xs={24} sm={16} md={16}>
                        <Space align="center" size={16}>
                            <div style={{
                                fontSize: '32px',
                                background: `${emotionData.color}15`,
                                borderRadius: '12px',
                                padding: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {emotionData.emoji}
                            </div>
                            <div>
                                <Text style={{ 
                                    fontSize: '18px',
                                    color: emotionData.color,
                                    fontWeight: 600,
                                    display: 'block',
                                    marginBottom: '4px'
                                }}>
                                    {emotionData.text}
                                </Text>
                                <Text style={{ 
                                    fontSize: '14px',
                                    color: '#8c8c8c',
                                    display: 'block',
                                    marginBottom: '8px'
                                }}>
                                    {emotionData.description}
                                </Text>
                                <Text style={{ 
                                    fontSize: '13px',
                                    color: '#bfbfbf'
                                }}>
                                    评分：{emotion.score} 分
                                </Text>
                            </div>
                        </Space>
                    </Col>
                    <Col xs={24} sm={8} md={8}>
                        <div style={{ textAlign: 'center' }}>
                            <Rate 
                                disabled={true} 
                                value={emotion.score} 
                                style={{ 
                                    fontSize: '20px',
                                    color: '#fadb14',
                                    marginBottom: '12px'
                                }}
                                character="⭐"
                            />
                            <div>
                                {getEmotionTag(emotion.tag)}
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
            
            <Row justify="center">
                <Col xs={24} sm={16} md={12} lg={4}>
                    <Button 
                        type="primary" 
                        icon={<EditOutlined />}
                        onClick={handleOpen}
                        size="large"
                        block
                        style={{ 
                            height: '42px',
                            borderRadius: '8px',
                            fontSize: '15px',
                            fontWeight: 600,
                            boxShadow: '0 3px 10px rgba(24, 144, 255, 0.2)'
                        }}
                    >
                        更新心情
                    </Button>
                </Col>
            </Row>

            <EmotionScoringModal tags={tags} editting={editting} setEditting={setEditting} setEmotion={setEmotion} />
        </Card>
    );
}