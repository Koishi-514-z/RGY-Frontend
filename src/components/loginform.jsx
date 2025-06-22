import React from "react";
import { Button, Checkbox, Form, Input, Row, Col, App, Card, Typography, Divider, Space } from "antd";
import { useNavigate, Link } from 'react-router-dom';
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
import { login } from "../service/user";

const { Title, Text } = Typography;

export default function LoginForm() {
    const navigate = useNavigate();
    const { message, modal } = App.useApp();

    const onFinish = async (values) => {
        const result = await login(values.username, values.password);
        if(result) {
            message.success('登录成功');
            setTimeout(() => {
                navigate('/home');
            }, 1500);
        }
        else {
            modal.error({
                title: 'ERROR',
                content: '用户名或密码错误'
            })
        }
    };

    return (
        <Row justify="center" align="middle" style={{ minHeight: '100vh', background: '#f0f2f5' }}>
            <Col xs={22} sm={16} md={12} lg={8} xl={6}>
                <Card 
                    style={{ 
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        borderRadius: '12px',
                    }}
                >
                    <div style={{ textAlign: 'center', marginBottom: 24 }}>
                        <Title level={2} style={{ margin: '8px 0' }}>欢迎登录</Title>
                        <Text type="secondary">登录以继续访问系统</Text>
                    </div>
                    
                    <Form
                        name="login"
                        layout="vertical"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        size="large"
                    >
                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: '请输入用户名' }]}
                        >
                            <Input 
                                prefix={<UserOutlined style={{ color: '#bfbfbf' }} />} 
                                placeholder="用户名" 
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: '请输入密码' }]}
                        >
                            <Input.Password 
                                prefix={<LockOutlined style={{ color: '#bfbfbf' }} />} 
                                placeholder="密码" 
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Row justify="space-between">
                                <Col>
                                    <Checkbox name="remember"> Remember me </Checkbox>
                                </Col>
                                <Col>
                                    <Link style={{ color: '#1890ff' }}> 忘记密码？ </Link>
                                </Col>
                            </Row>
                        </Form.Item>

                        <Form.Item style={{ marginBottom: 12 }}>   
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                block
                                icon={<LoginOutlined />}
                                style={{ 
                                    height: '46px',
                                    borderRadius: '6px',
                                    fontSize: '16px',
                                    fontWeight: 500
                                }}
                            > 
                                登录
                            </Button>
                        </Form.Item>
                        
                        <Divider style={{ margin: '16px 0' }}>
                            <Text type="secondary"> 或者 </Text>
                        </Divider>
                        
                        <div style={{ textAlign: 'center' }}>
                            <Space>
                                <Text type="secondary"> 还没有账号？ </Text>
                                <Link to="/register" style={{ fontWeight: 500 }}> 立即注册 </Link>
                            </Space>
                        </div>
                    </Form>
                </Card>
            </Col>
        </Row>
    )
}