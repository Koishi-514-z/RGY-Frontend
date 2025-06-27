import React, { useState, useEffect } from "react";
import { Card, List, Space, Typography, Tag, Rate, Divider, App, Avatar } from "antd";
import { HeartOutlined, SmileOutlined, MehOutlined, FrownOutlined, ThunderboltOutlined, ClockCircleOutlined} from "@ant-design/icons";
import { getTags, getUrlDatas, checkNegative } from "../service/emotion";
import Loading from "./loading";
import PushList from "./pushlist";
import BookingModal from "./bookingmodal";

const { Title, Text } = Typography;

export default function EmotionCard({emotion}) {
    const [tags, setTags] = useState([]);
    const [urlDatas, setUrlDatas] = useState([]);
    const [negative, setNegative] = useState(false);
    const { message } = App.useApp();

    useEffect(() => {
        const fetch = async () => {
            const fetched_tags = await getTags();
            const isNegative = await checkNegative();
            const fetched_urls = await getUrlDatas();
            setTags(fetched_tags);
            setNegative(isNegative);
            setUrlDatas(fetched_urls);
        }
        fetch();
    }, []);

    const getEmotionIcon = (score) => {
        if (score >= 4.5) return { icon: <SmileOutlined />, color: '#52c41a' };
        if (score >= 3.5) return { icon: <HeartOutlined />, color: '#1890ff' };
        if (score >= 2.5) return { icon: <MehOutlined />, color: '#faad14' };
        if (score >= 1.5) return { icon: <FrownOutlined />, color: '#fa8c16' };
        return { icon: <ThunderboltOutlined />, color: '#f5222d' };
    };

    const getEmotionTag = (tag) => {
        if(tags.length === 0) {
            return null;
        }
        const tagColors = {
            1: "success",
            2: "error",  
            3: "warning", 
            4: "orange",  
            5: "processing" 
        };
        try {
            const tagIndex = tag.id - 1;
            if(tagIndex >= 0 && tagIndex < tags.length) {
                return (
                    <Tag 
                        color={tagColors[tag.id] || "default"} 
                        style={{ 
                            padding: '4px 12px', 
                            fontSize: '14px',
                            borderRadius: '16px'
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
        return <Tag color="default"> Unknown </Tag>;
    };

    const getEmotionDescription = (score) => {
        if (score >= 4.5) return "心情非常好，继续保持！";
        if (score >= 3.5) return "心情不错，今天是个好日子！";
        if (score >= 2.5) return "心情平稳，愿你一切安好。";
        if (score >= 1.5) return "心情有点低落，需要调整一下。";
        return "心情不太好，建议找人聊聊或做些喜欢的事。";
    };

    if(tags.length === 0) {
        return <Loading />;
    }

    const { icon, color } = getEmotionIcon(emotion.score);

    return (
        <Card 
            title={
                <div style={{ padding: '8px 0' }}>
                    <Space>
                        <HeartOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
                        <Title level={4} style={{ margin: 0 }}> 今日心情 </Title>
                    </Space>
                </div>
            }
            style={{ 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                borderRadius: '12px',
                overflow: 'hidden',
            }}
            extra={
                <BookingModal />
            }
        >
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
                        
                        <Text 
                            style={{ 
                                fontSize: '15px',
                                display: 'block',
                                textAlign: 'center',
                                margin: '16px 0',
                                color: '#595959'
                            }}
                        >
                            我们为您精选了以下内容，希望能帮助您改善心情
                        </Text>
                        
                        <PushList urlDatas={urlDatas} inhome={true} />
                    </div>
                )}
            </div>
        </Card>
    );
}