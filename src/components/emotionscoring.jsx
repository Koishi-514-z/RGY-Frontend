import React, { useState, useEffect } from "react";
import { App, Rate, Form, Radio, Tag, Modal, Button, Card, Space, Typography, Row, Col } from "antd";
import { getEmotion, getTags, updateEmotion } from "../service/emotion";
import { HeartOutlined, EditOutlined, CalendarOutlined } from "@ant-design/icons";
import Loading from "../components/loading";
import EmotionScoringModal from "./emotionscoringmodal";

const { Title, Text } = Typography;

export default function EmotionScoring({emotion, setEmotion}) {
    const [editting, setEditting] = useState(false);
    const [form] = Form.useForm();
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

    const handleClose = () => {
        setEditting(false);
    }

    const handleOk = async () => {
        let values;
        try {
            values = await form.validateFields();
        } 
        catch(e) {
            message.error('请正确填写');
            return;
        }
        const res = await updateEmotion({
            score: values.score,
            tagid: values.tag
        });
        if(!res) {
            message.error('保存失败，请检查网络');
        }
        message.success('保存成功');
        setEmotion(await getEmotion());
        handleClose();
    }

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
            if (tagIndex >= 0 && tagIndex < tags.length) {
                return (
                    <Tag 
                        color={tagColors[tag.id]} 
                        style={{ 
                            padding: '4px 12px', 
                            fontSize: '14px',
                            borderRadius: '16px',
                            margin: '0 8px'
                        }}
                    >
                        {tags[tagIndex].content}
                    </Tag>
                );
            }
        } 
        catch (error) {
            console.error("Error rendering emotion tag:", error);
        }
        
        return <Tag color="default">Unknown</Tag>;
    };

    if(tags.length === 0) {
        return <Loading/>
    }

    return (
        <Card 
            title={
                <div style={{ padding: '8px 0' }}>
                    <Space>
                        <CalendarOutlined style={{ fontSize: '18px', color: '#1890ff' }} />
                        <Title level={4} style={{ margin: 0 }}>今日心情打卡</Title>
                    </Space>
                </div>
            }
            style={{ 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                borderRadius: '12px',
                overflow: 'hidden',
                marginBottom: '24px'
            }}
        >
            <Row align="middle" justify="center" gutter={[0, 24]}>
                <Col span={24} style={{ textAlign: 'center' }}>
                    <Space direction="vertical" size={16} align="center">
                        <Text style={{ fontSize: '16px', color: '#595959' }}>
                            您的当前心情状态
                        </Text>
                        <div>
                            <Rate 
                                disabled={true} 
                                value={emotion.score} 
                                style={{ fontSize: '24px' }}
                            />
                        </div>
                        <div>
                            {getEmotionTag(emotion.tag)}
                        </div>
                    </Space>
                </Col>
                
                <Col span={4}>
                    <Button 
                        type="primary" 
                        icon={<EditOutlined />}
                        onClick={handleOpen}
                        size="large"
                        style={{ 
                            width: '100%',
                            height: '46px',
                            borderRadius: '6px',
                            fontSize: '16px',
                            fontWeight: 500
                        }}
                    >
                        更新心情
                    </Button>
                </Col>
            </Row>

            <EmotionScoringModal tags={tags} editting={editting} setEditting={setEditting} emotion={emotion} setEmotion={setEmotion} />
        </Card>
    );
}