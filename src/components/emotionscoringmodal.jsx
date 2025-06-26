import React, { useState, useEffect } from "react";
import { App, Rate, Form, Radio, Tag, Modal, Typography } from "antd";
import { getEmotion, updateEmotion } from "../service/emotion";
import { HeartOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function EmotionScoringModal({tags, editting, setEditting, emotion, setEmotion}) {
    const [form] = Form.useForm();
    const { message } = App.useApp();

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
            tagid: values.tag + 1
        });
        if(!res) {
            message.error('保存失败，请检查网络');
        }
        message.success('保存成功');
        setEmotion(await getEmotion());
        handleClose();
    }

    const tagStyles = [
        { color: '#52c41a', backgroundColor: '#f6ffed', borderColor: '#b7eb8f' },
        { color: '#f5222d', backgroundColor: '#fff1f0', borderColor: '#ffa39e' },
        { color: '#faad14', backgroundColor: '#fffbe6', borderColor: '#ffe58f' },
        { color: '#fa8c16', backgroundColor: '#fff7e6', borderColor: '#ffd591' },
        { color: '#1890ff', backgroundColor: '#e6f7ff', borderColor: '#91d5ff' }
    ];

    console.log(tags);

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
                initialValues={{
                    score: emotion.score,
                    tag: emotion.tag.id
                }}
            >
                <Form.Item
                    name="score"
                    label={
                        <Text strong style={{ fontSize: '16px' }}>心情评分</Text>
                    }
                    rules={[{ required: true, message: '请给今天的心情打分' }]}
                >
                    <div style={{ textAlign: 'center', padding: '16px 0' }}>
                        <Rate 
                            style={{ fontSize: '32px' }} 
                        />
                    </div>
                </Form.Item>

                <Form.Item
                    name="tag"
                    label={
                        <Text strong style={{ fontSize: '16px' }}>情绪标签</Text>
                    }
                    rules={[{ required: true, message: '请选择一个情绪标签' }]}
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
                                            color={tagStyle.color}
                                            style={{
                                                padding: '8px 16px',
                                                fontSize: '15px',
                                                borderRadius: '16px',
                                                cursor: 'pointer',
                                                margin: 0,
                                                backgroundColor: tagStyle.backgroundColor,
                                                borderColor: tagStyle.borderColor,
                                                color: tagStyle.color,
                                                borderWidth: '1px',
                                                borderStyle: 'solid',
                                                transition: 'all 0.3s',
                                                boxShadow: `0 2px 6px rgba(0, 0, 0, 0.1)`,
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