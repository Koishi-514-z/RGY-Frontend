import React, { useState } from "react";
import { App, Input, Form, Typography, Modal, Button, Card, Space, Empty, Divider } from "antd";
import { EditOutlined, BookOutlined, UploadOutlined, FileTextOutlined } from "@ant-design/icons";
import { getDiary, updateDiary } from "../service/emotion";

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;

export default function EmotionDiary({diary, setDiary}) {
    const [editting, setEditting] = useState(false);
    const [form] = Form.useForm();
    const { message, modal } = App.useApp();

    const handleOpen = () => {
        setEditting(true);
        form.setFieldsValue({
            diary: diary.content
        });
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
        modal.confirm({
            title: '是否确认发布？',
            icon: <UploadOutlined />,
            content: '发布后的日记将被保存',
            okText: '确认发布',
            cancelText: '取消',
            async onOk() {
                const res = await updateDiary(values.diary);
                if(!res) {
                    message.error('发布失败，请检查网络');
                    return;
                }
                message.success('发布成功');
                setDiary(await getDiary());
                handleClose();
            },
            onCancel() {
                handleClose();
            }
        });
    }

    const formatDate = () => {
        const now = new Date();
        return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
    };

    return (
        <Card 
            title={
                <div style={{ padding: '8px 0' }}>
                    <Space>
                        <BookOutlined style={{ fontSize: '18px', color: '#1890ff' }} />
                        <Title level={4} style={{ margin: 0 }}>情绪日记</Title>
                    </Space>
                </div>
            }
            extra={
                <Button 
                    type="primary" 
                    icon={<EditOutlined />}
                    onClick={handleOpen}
                    size="middle"
                    style={{ 
                        borderRadius: '6px',
                    }}
                >
                    写日记
                </Button>
            }
            style={{ 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                borderRadius: '12px',
                overflow: 'hidden',
                marginBottom: '24px'
            }}
        >
            <div style={{ minHeight: '200px' }}>
                {diary.content ? (
                    <div>
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            marginBottom: '16px',
                            color: '#8c8c8c'
                        }}>
                            <Text type="secondary">{formatDate()}</Text>
                            <Text type="secondary">记录我的心情</Text>
                        </div>
                        
                        <div style={{ 
                            padding: '16px', 
                            backgroundColor: 'rgba(0,0,0,0.02)', 
                            borderRadius: '8px',
                            borderLeft: '4px solid #1890ff',
                            minHeight: '120px'
                        }}>
                            <Paragraph 
                                style={{ 
                                    fontSize: '15px',
                                    lineHeight: '1.8',
                                    color: '#262626',
                                    whiteSpace: 'pre-wrap'
                                }}
                            >
                                {diary.content}
                            </Paragraph>
                        </div>
                    </div>
                ) : (
                    <Empty 
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                            <span>
                                <Text type="secondary">您还没有写今天的日记</Text>
                            </span>
                        }
                        style={{ margin: '40px 0' }}
                    >
                        <Button 
                            type="primary" 
                            icon={<EditOutlined />}
                            onClick={handleOpen}
                            style={{ 
                                borderRadius: '6px',
                            }}
                        >
                            立即写日记
                        </Button>
                    </Empty>
                )}
            </div>

            <Modal
                title={
                    <div style={{ textAlign: 'center', padding: '12px 0' }}>
                        <FileTextOutlined style={{ fontSize: '24px', color: '#1890ff', marginBottom: '8px' }} />
                        <Title level={4} style={{ margin: '8px 0' }}>今日情绪日记</Title>
                        <Text type="secondary">记录您的想法和感受</Text>
                    </div>
                }
                open={editting}
                onOk={handleOk}
                onCancel={handleClose}
                okText="发布日记"
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
                <div style={{ marginBottom: '16px' }}>
                    <Text type="secondary" style={{ fontSize: '14px' }}>
                        写下您今天的心情、想法或感受，记录生活中的点滴情绪变化。
                    </Text>
                </div>
                
                <Divider style={{ margin: '16px 0' }} />
                
                <Form
                    form={form}
                    layout="vertical"
                    name="diaryform"
                    initialValues={diary.content}
                >
                    <Form.Item 
                        name="diary"
                        rules={[{ required: true, message: '日记内容不能为空' }]}
                    >
                        <TextArea 
                            rows={8} 
                            showCount 
                            maxLength={500} 
                            placeholder="今天的心情如何？发生了什么让您印象深刻的事情？" 
                            style={{ 
                                fontSize: '15px',
                                padding: '12px',
                                borderRadius: '8px',
                                resize: 'none'
                            }}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    )
}