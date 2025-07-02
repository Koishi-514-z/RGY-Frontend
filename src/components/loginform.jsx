import React from "react";
import { Button, Checkbox, Form, Input, Row, Col, App, Typography, Divider, Space } from "antd";
import { useNavigate, Link } from 'react-router-dom';
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
import { getUserProfile, isDisabled, login } from "../service/user";

const { Text } = Typography;

export default function LoginForm() {
    const navigate = useNavigate();
    const { message, modal } = App.useApp();

    const onFinish = async (values) => {
        const result = await login(values.username, values.password);
        if(result) {
            const disabled = await isDisabled();
            if(disabled) {
                modal.error({
                    title: 'ERROR',
                    content: '您的帐户已被禁用，请联系管理员'
                })
                return;
            }
            message.success('登录成功');
            const fetched_profile = await getUserProfile();
            if(fetched_profile.role === 0) {
                setTimeout(() => {
                    navigate('/home');
                }, 1500);
            }
            else if(fetched_profile.role === 1) {
                setTimeout(() => {
                    navigate('/admin/usermanagement');
                }, 1500);
            }
            else if(fetched_profile.role === 2) {
                setTimeout(() => {
                    navigate('/admin/stats');
                }, 1500);
            }
            else {
                navigate('/notfound');
            }
        }
        else {
            modal.error({
                title: 'ERROR',
                content: '用户名或密码错误'
            })
        }
    };

    return (
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
    )
}