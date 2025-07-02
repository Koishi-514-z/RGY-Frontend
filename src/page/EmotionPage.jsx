import React, { useState, useEffect } from "react";
import { Card, Space, Typography, Row, Col } from "antd";
import { getEmotion, getDiary, getUrlDatas } from "../service/emotion";
import Loading from "../components/loading";
import EmotionScoring from "../components/emotionscoring";
import EmotionDiary from "../components/emotiondiary";
import EmotionPush from "../components/emotionpush";
import CustomLayout from "../components/layout/customlayout";
import EmotionLayout from "../components/layout/emotionlayout";
import FloatingElements from "../components/layout/floatingelements";

const { Text } = Typography;

const EmotionQuote = () => {
    const quotes = [
        { text: "每一天都是新的开始，珍惜当下的感受", author: "心理学格言" },
        { text: "情绪如天气，总会有晴天", author: "情感导师" },
        { text: "记录心情，就是在记录生活的美好", author: "生活哲学" },
        { text: "善待自己的情绪，它们都有存在的意义", author: "心理健康" }
    ];
    
    const todayQuote = quotes[new Date().getDate() % quotes.length];
    
    return (
        <Card 
            style={{ 
                background: 'linear-gradient(135deg, #fff7e6 0%, #fff2e8 100%)',
                border: '1px solid #ffe7ba',
                borderRadius: '12px',
                marginBottom: '24px'
            }}
        >
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', marginBottom: '12px' }}>💭</div>
                <Text style={{ 
                    fontSize: '15px',
                    color: '#8c6e00',
                    fontStyle: 'italic',
                    lineHeight: 1.6,
                    display: 'block',
                    marginBottom: '8px'
                }}>
                    "{todayQuote.text}"
                </Text>
                <Text style={{ 
                    fontSize: '12px',
                    color: '#d48806'
                }}>
                    —— {todayQuote.author}
                </Text>
            </div>
        </Card>
    );
};

const EmotionTips = () => {
    const tips = [
        { icon: '🌱', title: '每日记录', desc: '坚持记录情绪变化' },
        { icon: '💪', title: '积极调节', desc: '学会情绪管理技巧' },
        { icon: '🎯', title: '设定目标', desc: '为心情设定小目标' },
        { icon: '🤝', title: '寻求支持', desc: '必要时寻求专业帮助' }
    ];
    
    return (
        <Card 
            title={
                <Space>
                    <span style={{ fontSize: '18px' }}>💡</span>
                    <Text strong>情绪管理小贴士</Text>
                </Space>
            }
            style={{ 
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
            }}
        >
            <Row gutter={[16, 16]}>
                {tips.map((tip, index) => (
                    <Col xs={12} sm={6} key={index}>
                        <div style={{ textAlign: 'center', padding: '12px 8px' }}>
                            <div style={{ 
                                fontSize: '20px',
                                marginBottom: '8px',
                                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                            }}>
                                {tip.icon}
                            </div>
                            <Text strong style={{ 
                                fontSize: '13px',
                                display: 'block',
                                marginBottom: '4px',
                                color: '#262626'
                            }}>
                                {tip.title}
                            </Text>
                            <Text style={{ 
                                fontSize: '11px',
                                color: '#8c8c8c',
                                lineHeight: 1.4
                            }}>
                                {tip.desc}
                            </Text>
                        </div>
                    </Col>
                ))}
            </Row>
        </Card>
    );
};

export default function EmotionPage() {
    const [emotion, setEmotion] = useState(null);
    const [diary, setDiary] = useState(null);
    const [urlDatas, setUrlDatas] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            const fetched_emotion = await getEmotion();
            const fetched_diary = await getDiary();
            const fetched_urls = await getUrlDatas();
            setEmotion(fetched_emotion);
            setDiary(fetched_diary);
            setUrlDatas(fetched_urls);
        }
        fetch();
    }, []);

    if(!emotion || !diary) {
        return (
            <CustomLayout content={
                <Loading />
            }/>
        )
    }

    return (
        <CustomLayout content={
            <div style={{ position: 'relative', overflow: 'hidden' }}>
                <EmotionLayout 
                    scoring={<EmotionScoring emotion={emotion} setEmotion={setEmotion} />}
                    diary={<EmotionDiary diary={diary} setDiary={setDiary} />}
                    push={<EmotionPush score={emotion.score} urlDatas={urlDatas} />}
                    quote={<EmotionQuote />}
                    tips={<EmotionTips />}
                />
            </div>
        }/>
    );
}