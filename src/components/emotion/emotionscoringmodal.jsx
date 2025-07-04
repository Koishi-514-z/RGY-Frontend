import React, { useState, useEffect } from "react";
import { App, Rate, Form, Radio, Tag, Modal, Typography } from "antd";
import { getEmotion, updateEmotion } from "../../service/emotion";
import { HeartOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function EmotionScoringModal({tags, editting, setEditting, setEmotion}) {
    const [score, setScore] = useState(null);
    const [form] = Form.useForm();
    const { message } = App.useApp();

    const onScoreChange = (score) => {
        setScore(score);
    }

    const handleClose = () => {
        setEditting(false);
    }

    const getTag = (tagid) => {
        for(const tag of tags) {
            if(tag.id === tagid) {
                return tag;
            }
        }
        return null;
    } 

    const handleOk = async () => {
        const values = form.getFieldsValue();
        if(!score || !values.tag) {
            message.error('请完整填写');
            return;
        }
        const res = await updateEmotion({
            score: score,
            tag: getTag(parseInt(values.tag) + 1)
        });
        if(!res) {
            message.error('保存失败，请检查网络');
        }
        message.success('保存成功');
        setEmotion(await getEmotion());
        handleClose();
    }

    const tagStyles = [
        { color: '#52c41a', bg: '#f6ffed' },
        { color: '#f5222d', bg: '#fff1f0' },
        { color: '#faad14', bg: '#fffbe6' },
        { color: '#fa8c16', bg: '#fff7e6' },
        { color: '#1890ff', bg: '#e6f7ff' }
    ];

    return (
        <Modal
            title={
                <div style={{ textAlign: 'center', padding: '12px 0' }}>
                    <HeartOutlined style={{ fontSize: '24px', color: '#1890ff', marginBottom: '8px' }} />
                    <Title level={4} style={{ margin: '8px 0' }}>心情打卡</Title>
                    <Text type="secondary">记录您今天的心情和感受</Text>
                </div>
            }
            open={editting}
            onOk={handleOk}
            onCancel={handleClose}
            okText="保存"
            cancelText="取消"
            okButtonProps={{ 
                size: 'large',
                style: { borderRadius: '6px' }
            }}
            cancelButtonProps={{ 
                size: 'large',
                style: { borderRadius: '6px' }
            }}
            style={{ top: 20 }}
            width={600}
        >
            <Form
                form={form}
                layout="vertical"
                name="scoringform"
            >
                <Form.Item
                    name="score"
                    label={
                        <Text strong style={{ fontSize: '16px', color: '#262626' }}>心情评分</Text>
                    }
                    style={{ marginBottom: '32px' }}
                >
                    <div style={{
                        textAlign: 'center',
                        padding: '24px 20px',
                        background: 'linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%)',
                        borderRadius: '16px',
                        position: 'relative'
                    }}>
                        <div style={{ marginBottom: '16px' }}>
                            <Text style={{ 
                                fontSize: '15px', 
                                color: '#595959',
                                display: 'block',
                                marginBottom: '8px'
                            }}>
                                请为今天的心情打分
                            </Text>
                            <Text style={{ 
                                fontSize: '13px', 
                                color: '#8c8c8c'
                            }}>
                                1分=很糟糕 • 3分=一般 • 5分=很开心
                            </Text>
                        </div>
                        
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '12px'
                        }}>
                            <Rate 
                                style={{ 
                                    fontSize: '36px',
                                    color: '#fadb14'
                                }}
                                character="⭐"
                                allowHalf={false}
                                value={score}
                                onChange={onScoreChange}
                            />
                        </div>
                        
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '12px',
                            color: '#8c8c8c',
                            marginTop: '8px',
                            paddingLeft: '2px',
                            paddingRight: '2px'
                        }}>
                            <span>😢 很糟糕</span>
                            <span>😐 一般</span>
                            <span>😊 很开心</span>
                        </div>
                    </div>
                </Form.Item>

                <Form.Item
                    name="tag"
                    label={
                        <Text strong style={{ fontSize: '16px' }}>情绪标签</Text>
                    }
                >
                    <div style={{ textAlign: 'center', padding: '8px 0' }}>
                        <Radio.Group 
                            buttonStyle="outline"
                            size="large"
                            style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px' }}
                        >
                            {tags.map((tag, index) => {
                                const tagStyle = tagStyles[index];
                                return (
                                    <Radio value={index} key={index} style={{ marginRight: 0 }}>
                                        <Tag 
                                            style={{ 
                                                padding: '8px 16px', 
                                                fontSize: '14px',
                                                borderRadius: '14px',
                                                margin: 0,
                                                backgroundColor: tagStyle.bg,
                                                color: tagStyle.color,
                                                border: 'none',
                                                fontWeight: 500
                                            }}
                                        >
                                            {tag.content}
                                        </Tag>
                                    </Radio>
                                );
                            })}
                        </Radio.Group>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
}