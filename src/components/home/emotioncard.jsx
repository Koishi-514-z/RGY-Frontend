import React, { useState, useEffect } from "react";
import { Card, List, Space, Typography, Tag, Rate, Divider, App, Avatar, Empty, Button } from "antd";
import { HeartOutlined, SmileOutlined, MehOutlined, FrownOutlined, PlusOutlined, ClockCircleOutlined} from "@ant-design/icons";
import { getTags, checkNegative } from "../service/emotion";
import Loading from "./loading";
import PushList from "./pushlist";
import BookingModal from "./bookingmodal";
import { useNavigate } from "react-router-dom";
import { getUrlDatasByTag } from "../service/pushcontent";

const { Title, Text } = Typography;

export default function EmotionCard({emotion, setTabKey}) {
    const [tags, setTags] = useState([]);
    const [urlDatas, setUrlDatas] = useState([]);
    const [negative, setNegative] = useState(false);
    const { message } = App.useApp();
    const navigate = useNavigate();
    const pageSize = 3;

    useEffect(() => {
        const fetch = async () => {
            const fetched_tags = await getTags();
            const isNegative = await checkNegative();
            const fetched_urls = (emotion.tag ? await getUrlDatasByTag(emotion.tag.id, 0, pageSize) : []);
            setTags(fetched_tags);
            setNegative(isNegative);
            setUrlDatas(fetched_urls);
        }
        fetch();
    }, []);

    const handleClick = () => {
        setTabKey(6);
    }

    const getEmotionIcon = (score) => {
        if (score >= 4.0) return { 
            icon: <SmileOutlined />, 
            color: '#52c41a',
            emoji: '😊'
        };
        if (score >= 3.0) return { 
            icon: <HeartOutlined />, 
            color: '#1890ff',
            emoji: '💙'
        };
        if (score >= 2.0) return { 
            icon: <MehOutlined />, 
            color: '#faad14',
            emoji: '🌤️'
        };
        return { 
            icon: <FrownOutlined />, 
            color: '#ff7875',
            emoji: '🌈'
        };
    };

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
                            padding: '6px 14px', 
                            fontSize: '13px',
                            borderRadius: '12px',
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

    const getEmotionDescription = (score) => {
        if (score >= 4.0) return "心情很棒！继续保持这美好的状态";
        if (score >= 3.0) return "心情不错，今天是个不错的日子";
        if (score >= 2.0) return "心情平稳，或许可以做些开心的事";
        return "希望我们能给您带来一些温暖";
    };

    if(!emotion || tags.length === 0) {
        return <Loading />;
    }

    const { icon, color } = getEmotionIcon(emotion.score);

    const title = (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 0 8px 0'
            }}
        >
            <div
                style={{
                    width: 38,
                    height: 38,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
                    borderRadius: '50%',
                    boxShadow: '0 2px 8px rgba(24,144,255,0.10)',
                    marginRight: 8
                }}
            >
                <HeartOutlined style={{ fontSize: 22, color: '#1890ff' }} />
            </div>
            <div>
                <Title
                    level={4}
                    style={{
                        margin: 0,
                        color: '#222',
                        fontWeight: 700,
                        letterSpacing: 1,
                        textShadow: '0 1px 4px rgba(24,144,255,0.08)'
                    }}
                >
                    今日心情
                </Title>
                <Text type="secondary" style={{ fontSize: 13, marginLeft: 2 }}>
                    {new Date().toLocaleDateString()}
                </Text>
            </div>
        </div>
    )

    if (!emotion.tag) {
        return (
            <Card 
                title={title}
                style={{ 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: 'none'
                }}
                extra={
                    <Button
                        icon={<ClockCircleOutlined />}
                        onClick={handleClick}
                        style={{
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(24,144,255,0.10)',
                            padding: '8px 16px'
                        }}
                    >
                        预约心理咨询
                    </Button>
                }
            >
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <Empty
                        image={
                            <div style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }}>
                                <MehOutlined />
                            </div>
                        }
                        description={
                            <div>
                                <Text style={{ fontSize: '16px', color: '#595959', display: 'block', marginBottom: '8px' }}>
                                    今天还没有记录心情呢
                                </Text>
                                <Text style={{ fontSize: '14px', color: '#8c8c8c' }}>
                                    记录每日心情，更好地了解自己的情绪变化
                                </Text>
                            </div>
                        }
                    >
                        <Button 
                            type="primary" 
                            icon={<PlusOutlined />}
                            size="large"
                            style={{
                                borderRadius: '8px',
                                fontWeight: 600,
                                fontSize: '16px',
                                padding: '8px 32px',
                                height: 'auto',
                                boxShadow: '0 4px 12px rgba(24,144,255,0.15)'
                            }}
                            onClick={() => {
                                navigate(`/emotion`);
                            }}
                        >
                            记录今日心情
                        </Button>
                    </Empty>
                    
                    <Divider style={{ margin: '32px 0 24px' }}>
                        <Text type="secondary" style={{ fontSize: '14px' }}>温馨提示</Text>
                    </Divider>
                    
                    <div style={{ textAlign: 'left', background: '#f6f8fa', padding: '16px', borderRadius: '8px' }}>
                        <Space direction="vertical" size={8}>
                            <Text style={{ fontSize: '14px', color: '#595959' }}>
                                📝 每日记录心情，帮助您：
                            </Text>
                            <Text style={{ fontSize: '13px', color: '#8c8c8c', paddingLeft: '16px' }}>
                                • 了解情绪变化规律
                            </Text>
                            <Text style={{ fontSize: '13px', color: '#8c8c8c', paddingLeft: '16px' }}>
                                • 获得个性化内容推荐
                            </Text>
                            <Text style={{ fontSize: '13px', color: '#8c8c8c', paddingLeft: '16px' }}>
                                • 及时获得心理支持
                            </Text>
                        </Space>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card 
            title={title}
            style={{ 
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                borderRadius: '12px',
                overflow: 'hidden',
                border: 'none'
            }}
            extra={
                <Button
                    icon={<ClockCircleOutlined />}
                    onClick={handleClick}
                    style={{
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(24,144,255,0.10)',
                        padding: '8px 16px'
                    }}
                >
                    预约心理咨询
                </Button>
            }
        >
            <div style={{
                background: `linear-gradient(135deg, ${color}06 0%, ${color}03 100%)`,
                padding: '24px 20px',
                borderRadius: '12px',
                border: `1px solid ${color}15`,
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '-15px',
                    right: '-15px',
                    width: '60px',
                    height: '60px',
                    background: `${color}08`,
                    borderRadius: '50%',
                    zIndex: 0
                }} />
                <div style={{ textAlign: 'center', padding: '12px 0 24px' }}>
                    <div style={{ 
                        fontSize: '36px', 
                        color: color,
                        margin: '12px 0' 
                    }}>
                        {icon}
                    </div>
                    
                    <Rate 
                        disabled={true} 
                        value={emotion.score} 
                        style={{ 
                            fontSize: '28px',
                            marginBottom: '16px' 
                        }} 
                    />
                    
                    <div style={{ margin: '16px 0' }}>
                        {getEmotionTag(emotion.tag)}
                    </div>
                    
                    <Text 
                        style={{ 
                            fontSize: '16px',
                            color: color,
                            fontWeight: 500
                        }}
                    >
                        {getEmotionDescription(emotion.score)}
                    </Text>
                    
                    {!negative ? null : (
                        <div style={{ marginTop: '24px' }}>
                            <Divider>
                                <Space>
                                    <HeartOutlined style={{ color: '#ff4d4f' }} />
                                    <Text strong>心情调节推荐</Text>
                                </Space>
                            </Divider>
                            <div style={{ textAlign: 'left'}}>
                                <PushList urlDatas={urlDatas} inhome={true} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}