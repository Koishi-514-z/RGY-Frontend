import React, { useState, useEffect } from "react";
import { Card, List, Space, Typography, Tag, Rate, Divider, App, Avatar, Empty, Button } from "antd";
import { HeartOutlined, SmileOutlined, MehOutlined, FrownOutlined, PlusOutlined, ClockCircleOutlined, StarOutlined, TrophyOutlined} from "@ant-design/icons";
import { getTags, checkNegative } from "../../service/emotion";
import Loading from "../loading";
import PushList from "../pushlist";
import { useNavigate } from "react-router-dom";
import { getUrlDatas } from "../../service/pushcontent";

const { Title, Text } = Typography;

export default function EmotionCard({emotion}) {
    const [tags, setTags] = useState([]);
    const [urlDatas, setUrlDatas] = useState([]);
    const [negative, setNegative] = useState(false);
    const { message } = App.useApp();
    const navigate = useNavigate();
    const pageSize = 3;

    const loading = !emotion || tags.length === 0;

    useEffect(() => {
        const fetch = async () => {
            const fetched_tags = await getTags();
            const isNegative = await checkNegative();
            const fetched_urls = await getUrlDatas(0, pageSize);
            setTags(fetched_tags);
            setNegative(isNegative);
            setUrlDatas(fetched_urls);
        }
        fetch();
    }, []);

    const getEmotionIcon = (score) => {
        if (score >= 4.0) return { 
            icon: <SmileOutlined />, 
            color: '#52c41a',
            emoji: '😊',
            gradient: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
            bgGradient: 'linear-gradient(135deg, rgba(82, 196, 26, 0.05) 0%, rgba(115, 209, 61, 0.05) 100%)'
        };
        if (score >= 3.0) return { 
            icon: <HeartOutlined />, 
            color: '#1890ff',
            emoji: '💙',
            gradient: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)',
            bgGradient: 'linear-gradient(135deg, rgba(24, 144, 255, 0.05) 0%, rgba(54, 207, 201, 0.05) 100%)'
        };
        if (score >= 2.0) return { 
            icon: <MehOutlined />, 
            color: '#faad14',
            emoji: '🌤️',
            gradient: 'linear-gradient(135deg, #faad14 0%, #ffc53d 100%)',
            bgGradient: 'linear-gradient(135deg, rgba(250, 173, 20, 0.05) 0%, rgba(255, 197, 61, 0.05) 100%)'
        };
        return { 
            icon: <FrownOutlined />, 
            color: '#ff7875',
            emoji: '🌈',
            gradient: 'linear-gradient(135deg, #ff7875 0%, #ff9c6e 100%)',
            bgGradient: 'linear-gradient(135deg, rgba(255, 120, 117, 0.05) 0%, rgba(255, 156, 110, 0.05) 100%)'
        };
    };

    const getEmptyEmotionIcon = () => {
        return {
            icon: <StarOutlined />,
            color: '#d9d9d9',
            emoji: '✨',
            gradient: 'linear-gradient(135deg, #d9d9d9 0%, #f0f0f0 100%)',
            bgGradient: 'linear-gradient(135deg, rgba(217, 217, 217, 0.05) 0%, rgba(240, 240, 240, 0.05) 100%)'
        };
    };

    const getEmotionTag = (tag) => {
        if(tags.length === 0) {
            return null;
        }
        
        const tagStyles = [
            { color: '#52c41a', bg: '#f6ffed', gradient: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)' },
            { color: '#f5222d', bg: '#fff1f0', gradient: 'linear-gradient(135deg, #f5222d 0%, #ff7875 100%)' },
            { color: '#faad14', bg: '#fffbe6', gradient: 'linear-gradient(135deg, #faad14 0%, #ffc53d 100%)' },
            { color: '#fa8c16', bg: '#fff7e6', gradient: 'linear-gradient(135deg, #fa8c16 0%, #ff9c6e 100%)' },
            { color: '#1890ff', bg: '#e6f7ff', gradient: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)' }
        ];
        
        try {
            const tagIndex = tag.id - 1;
            if(tagIndex >= 0 && tagIndex < tags.length) {
                const style = tagStyles[tagIndex];
                return (
                    <div style={{
                        background: style.gradient,
                        borderRadius: '16px',
                        padding: '8px 20px',
                        display: 'inline-block',
                        boxShadow: `0 4px 12px ${style.color}30`,
                        margin: '0 4px'
                    }}>
                        <Text style={{ 
                            color: '#fff',
                            fontSize: '14px',
                            fontWeight: '600',
                            textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                        }}>
                            {tags[tagIndex].content}
                        </Text>
                    </div>
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

    const { icon, color, gradient, bgGradient } = getEmotionIcon(emotion?.score);
    const emptyIcon = getEmptyEmotionIcon();

    const title = (
        <div style={{
            background: bgGradient,
            padding: '20px 24px',
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
                        background: gradient,
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '16px',
                        boxShadow: `0 6px 16px ${color}30`,
                        position: 'relative'
                    }}>
                        {React.cloneElement(icon, { 
                            style: { color: '#fff', fontSize: '24px' } 
                        })}
                        <div style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            width: '8px',
                            height: '8px',
                            background: '#fff',
                            borderRadius: '50%',
                            boxShadow: '0 0 0 2px rgba(255,255,255,0.3)',
                            animation: 'pulse 2s infinite'
                        }} />
                    </div>
                    <div>
                        <Title level={4} style={{ 
                            margin: 0, 
                            background: gradient,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            fontWeight: '700'
                        }}>
                            今日心情
                        </Title>
                        <Text style={{ 
                            color: '#595959', 
                            fontSize: '14px',
                            fontWeight: '500'
                        }}>
                            {new Date().toLocaleDateString()} · 情绪记录
                        </Text>
                    </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '20px',
                        padding: '6px 16px',
                        marginBottom: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <Text style={{ 
                            fontSize: '12px',
                            fontWeight: '600',
                            color: color
                        }}>
                            情绪指数
                        </Text>
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                        {[1,2,3,4,5].map(i => (
                            <div key={i} style={{
                                width: '6px',
                                height: '6px',
                                background: i <= emotion?.score ? color : 'rgba(0,0,0,0.1)',
                                borderRadius: '50%',
                                transition: 'all 0.3s ease'
                            }} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const emptyTitle = (
        <div style={{
            background: emptyIcon.bgGradient,
            padding: '20px 24px',
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
                        background: emptyIcon.gradient,
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '16px',
                        boxShadow: `0 6px 16px ${emptyIcon.color}30`,
                        position: 'relative'
                    }}>
                        {React.cloneElement(emptyIcon.icon, { 
                            style: { color: '#fff', fontSize: '24px' } 
                        })}
                        <div style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            width: '8px',
                            height: '8px',
                            background: '#fff',
                            borderRadius: '50%',
                            boxShadow: '0 0 0 2px rgba(255,255,255,0.3)',
                            opacity: 0.6
                        }} />
                    </div>
                    <div>
                        <Title level={4} style={{ 
                            margin: 0, 
                            color: '#8c8c8c',
                            fontWeight: '700'
                        }}>
                            今日心情
                        </Title>
                        <Text style={{ 
                            color: '#bfbfbf', 
                            fontSize: '14px',
                            fontWeight: '500'
                        }}>
                            {new Date().toLocaleDateString()} · 暂无记录
                        </Text>
                    </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '20px',
                        padding: '6px 16px',
                        marginBottom: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <Text style={{ 
                            fontSize: '12px',
                            fontWeight: '600',
                            color: emptyIcon.color
                        }}>
                            待记录
                        </Text>
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                        {[1,2,3,4,5].map(i => (
                            <div key={i} style={{
                                width: '6px',
                                height: '6px',
                                background: 'rgba(0,0,0,0.1)',
                                borderRadius: '50%',
                                transition: 'all 0.3s ease'
                            }} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    if(!emotion?.tag) {
        return (
            <Card 
                style={{ 
                    background: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 50%, #fafafa 100%)',
                    border: '1px solid rgba(217, 217, 217, 0.3)',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
                    position: 'relative'
                }}
                loading={loading}
            >
                {emptyTitle}
                <div style={{ textAlign: 'center', padding: '40px 20px', position: 'relative', zIndex: 1 }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: emptyIcon.gradient,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 24px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                        position: 'relative'
                    }}>
                        <StarOutlined style={{ fontSize: '36px', color: '#fff' }} />
                        <div style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            width: '12px',
                            height: '12px',
                            background: '#fff',
                            borderRadius: '50%',
                            boxShadow: '0 0 0 3px rgba(255,255,255,0.3)',
                            opacity: 0.8
                        }} />
                    </div>
                    
                    <Text style={{ 
                        fontSize: '18px', 
                        color: '#595959', 
                        display: 'block', 
                        marginBottom: '12px',
                        fontWeight: '600'
                    }}>
                        今天还没有记录心情呢
                    </Text>
                    <Text style={{ 
                        fontSize: '14px', 
                        color: '#8c8c8c',
                        marginBottom: '32px',
                        display: 'block'
                    }}>
                        记录每日心情，更好地了解自己的情绪变化
                    </Text>

                    <Button 
                        type="primary" 
                        icon={<PlusOutlined />}
                        size="large"
                        style={{
                            background: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)',
                            border: 'none',
                            borderRadius: '12px',
                            fontWeight: '600',
                            fontSize: '16px',
                            padding: '12px 32px',
                            height: 'auto',
                            boxShadow: '0 6px 16px rgba(24, 144, 255, 0.3)',
                            transition: 'all 0.3s ease'
                        }}
                        onClick={() => navigate(`/emotion`)}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 8px 20px rgba(24, 144, 255, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 6px 16px rgba(24, 144, 255, 0.3)';
                        }}
                    >
                        记录今日心情
                    </Button>
                    
                    <div style={{ 
                        marginTop: '32px',
                        padding: '20px',
                        background: 'rgba(255, 255, 255, 0.8)',
                        borderRadius: '16px',
                        border: '1px solid rgba(24, 144, 255, 0.1)',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <div style={{ marginBottom: '16px' }}>
                            <TrophyOutlined style={{ 
                                fontSize: '20px', 
                                color: '#faad14',
                                marginRight: '8px'
                            }} />
                            <Text style={{ 
                                fontSize: '16px', 
                                fontWeight: '600',
                                color: '#262626'
                            }}>
                                每日记录心情的好处
                            </Text>
                        </div>
                        <Space direction="vertical" size={12} style={{ width: '100%' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{
                                    width: '6px',
                                    height: '6px',
                                    background: '#52c41a',
                                    borderRadius: '50%',
                                    marginRight: '12px'
                                }} />
                                <Text style={{ fontSize: '14px', color: '#595959' }}>
                                    了解情绪变化规律
                                </Text>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{
                                    width: '6px',
                                    height: '6px',
                                    background: '#1890ff',
                                    borderRadius: '50%',
                                    marginRight: '12px'
                                }} />
                                <Text style={{ fontSize: '14px', color: '#595959' }}>
                                    获得个性化内容推荐
                                </Text>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{
                                    width: '6px',
                                    height: '6px',
                                    background: '#722ed1',
                                    borderRadius: '50%',
                                    marginRight: '12px'
                                }} />
                                <Text style={{ fontSize: '14px', color: '#595959' }}>
                                    及时获得心理支持
                                </Text>
                            </div>
                        </Space>
                    </div>
                </div>
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
            loading={loading}
        >
            {title}

            <div style={{
                background: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '16px',
                border: `1px solid ${color}15`,
                position: 'relative',
                overflow: 'hidden',
                backdropFilter: 'blur(10px)',
                zIndex: 1
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
                
                <div style={{ textAlign: 'center', padding: '32px 24px', position: 'relative', zIndex: 1 }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: gradient,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 24px',
                        boxShadow: `0 8px 24px ${color}30`,
                        position: 'relative'
                    }}>
                        {React.cloneElement(icon, { 
                            style: { color: '#fff', fontSize: '36px' } 
                        })}
                        <div style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            width: '12px',
                            height: '12px',
                            background: '#fff',
                            borderRadius: '50%',
                            boxShadow: '0 0 0 3px rgba(255,255,255,0.3)'
                        }} />
                    </div>
                    
                    <Rate 
                        disabled={true} 
                        value={emotion?.score} 
                        style={{ 
                            fontSize: '24px',
                            marginBottom: '20px',
                            color: color
                        }} 
                    />
                    
                    <div style={{ margin: '20px 0' }}>
                        {getEmotionTag(emotion?.tag)}
                    </div>
                    
                    <Text style={{ 
                        fontSize: '16px',
                        background: gradient,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        fontWeight: '600',
                        display: 'block',
                        textAlign: 'center'
                    }}>
                        {getEmotionDescription(emotion?.score)}
                    </Text>
                    
                    {!negative ? null : (
                        <div style={{ marginTop: '32px' }}>
                            <div style={{
                                background: 'rgba(255, 77, 79, 0.1)',
                                borderRadius: '12px',
                                padding: '16px',
                                border: '1px solid rgba(255, 77, 79, 0.2)',
                                marginBottom: '16px'
                            }}>
                                <Space>
                                    <HeartOutlined style={{ color: '#ff4d4f', fontSize: '16px' }} />
                                    <Text strong style={{ color: '#ff4d4f' }}>
                                        心情调节推荐
                                    </Text>
                                </Space>
                            </div>
                            <div style={{ textAlign: 'left'}}>
                                <PushList urlDatas={urlDatas} inhome={true} />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(1.2); }
                }
            `}</style>
        </Card>
    );
}