import React, { useState } from "react";
import { App, Input, Form, Typography, Modal, Button, Card, Space, Empty, Divider, Row, Col } from "antd";
import { EditOutlined, BookOutlined, UploadOutlined, FileTextOutlined, PlusOutlined, HeartOutlined } from "@ant-design/icons";
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

    const EmptyDiaryState = () => (
        <div style={{
            background: 'linear-gradient(135deg, #e6f7ff 0%, #f6ffed 100%)',
            borderRadius: '12px',
            padding: '40px 20px',
            textAlign: 'center',
            border: '1px dashed #91d5ff',
            minHeight: '280px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div style={{
                fontSize: '64px',
                marginBottom: '20px',
                opacity: 0.7,
                animation: 'float 3s ease-in-out infinite'
            }}>
                📝
            </div>
            
            <Title level={4} style={{ 
                color: '#1890ff',
                marginBottom: '12px',
                fontWeight: 600
            }}>
                还没有写今天的日记
            </Title>
            
            <Text style={{ 
                fontSize: '15px',
                color: '#8c8c8c',
                display: 'block',
                marginBottom: '24px',
                lineHeight: 1.6,
                maxWidth: '320px'
            }}>
                记录今天的心情和感受，让美好的时光永远陪伴您
            </Text>

            <div style={{
                background: '#fff',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                border: '1px solid #f0f0f0',
                width: '100%',
                maxWidth: '400px'
            }}>
                <Row gutter={[16, 12]} justify="center">
                    <Col xs={8}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ 
                                fontSize: '20px', 
                                marginBottom: '8px',
                                color: '#ff7875'
                            }}>
                                💭
                            </div>
                            <Text style={{ fontSize: '11px', color: '#595959' }}>
                                记录想法
                            </Text>
                        </div>
                    </Col>
                    <Col xs={8}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ 
                                fontSize: '20px', 
                                marginBottom: '8px',
                                color: '#52c41a'
                            }}>
                                🌈
                            </div>
                            <Text style={{ fontSize: '11px', color: '#595959' }}>
                                表达情感
                            </Text>
                        </div>
                    </Col>
                    <Col xs={8}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ 
                                fontSize: '20px', 
                                marginBottom: '8px',
                                color: '#1890ff'
                            }}>
                                📚
                            </div>
                            <Text style={{ fontSize: '11px', color: '#595959' }}>
                                回忆美好
                            </Text>
                        </div>
                    </Col>
                </Row>
            </div>

            <Button 
                type="primary" 
                icon={<EditOutlined />}
                onClick={handleOpen}
                size="large"
                style={{ 
                    height: '44px',
                    paddingLeft: '24px',
                    paddingRight: '24px',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)',
                    border: 'none',
                    boxShadow: '0 3px 10px rgba(24, 144, 255, 0.3)'
                }}
            >
                开始写日记
            </Button>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
            `}</style>
        </div>
    );

    return (
        <Card 
            title={
                <div style={{ padding: '8px 0' }}>
                    <Space>
                        <BookOutlined style={{ 
                            fontSize: '20px', 
                            color: '#1890ff',
                            background: 'rgba(24, 144, 255, 0.1)',
                            padding: '6px',
                            borderRadius: '6px'
                        }} />
                        <Title level={4} style={{ margin: 0, color: '#262626' }}>
                            情绪日记
                        </Title>
                    </Space>
                </div>
            }
            extra={
                <Button 
                    icon={<EditOutlined />}
                    onClick={handleOpen}
                    size="middle"
                    style={{ 
                        borderRadius: '6px',
                        height: '32px',
                        fontSize: '13px',
                        background: 'linear-gradient(135deg, #1890ff15 0%, #1890ff08 100%)',
                    }}
                >
                    写日记
                </Button>
            }
            style={{ 
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                borderRadius: '12px',
                overflow: 'hidden',
                border: 'none',
                marginBottom: '24px'
            }}
        >
            <div style={{ minHeight: '240px' }}>
                {diary.content ? (
                    <div>
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            marginBottom: '16px',
                            alignItems: 'center'
                        }}>
                            <Space>
                                <div style={{
                                    background: 'linear-gradient(135deg, #1890ff15 0%, #1890ff08 100%)',
                                    padding: '4px 12px',
                                    borderRadius: '12px',
                                    border: '1px solid #1890ff20'
                                }}>
                                    <Text style={{ 
                                        fontSize: '12px',
                                        color: '#1890ff',
                                        fontWeight: 500
                                    }}>
                                        {formatDate()}
                                    </Text>
                                </div>
                            </Space>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                记录我的心情
                            </Text>
                        </div>
                        
                        <div style={{ 
                            padding: '20px', 
                            background: 'linear-gradient(135deg, #f9f9f9 0%, #fff 100%)', 
                            borderRadius: '12px',
                            border: '1px solid #f0f0f0',
                            borderLeft: '4px solid #1890ff',
                            minHeight: '160px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                        }}>
                            <Paragraph 
                                style={{ 
                                    fontSize: '15px',
                                    lineHeight: '1.8',
                                    color: '#262626',
                                    whiteSpace: 'pre-wrap',
                                    margin: 0
                                }}
                            >
                                {diary.content}
                            </Paragraph>
                        </div>
                    </div>
                ) : (
                    <EmptyDiaryState />
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