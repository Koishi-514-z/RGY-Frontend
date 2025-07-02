import React, { useState } from "react";
import { Form, Input, Button, App, Typography, Divider, Space, Checkbox, Row, Col } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, UserAddOutlined } from "@ant-design/icons";
import { Link, useNavigate } from 'react-router-dom';
import { userExisted, addUser, login, adminVerify } from "../service/user";

const { Text } = Typography;

export default function RegisterForm() {
    const [adminChecked, setAdminChecked] = useState(false);
    const [psyChecked, setPsyChecked] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { message, modal } = App.useApp();

    const onAdminChange = (event) => {
        setAdminChecked(event.target.checked);
        if(event.target.checked) {
            setPsyChecked(false);
        }
    };

    const onPsyChange = (event) => {
        setPsyChecked(event.target.checked);
        if(event.target.checked) {
            setAdminChecked(false);
        }
    };

    const onFinish = async (values) => {
        const existed = await userExisted(values.username);
        if(existed) {
            modal.warning({
                title: '注册失败',
                content: '用户名已存在',
            });
            return;
        }

        if(adminChecked || psyChecked) {
            const res = await adminVerify(values.verifyKey);
            if(!res) {
                message.error("Verify Failed");
                return;
            }
        }

        const now = new Date();
        const timestamp = now.getTime();
        const newUser = {
            password: values.password,
            stuid: values.stuid,
            profile: {
                userid: values.username + "_" + timestamp.toString(),
                username: values.username,
                email: values.email,
                avatar: null,
                node: null,
                role: (adminChecked ? 1 : (psyChecked ? 2 : 0))
            }
        };
        const add = await addUser(newUser);
        if(!add) {
            modal.error({
                title: '注册失败',
                content: '创建用户失败，请检查是否已正确连接到后端应用',
            });
            return;
        }

        const res = await login(values.username, values.password);
        if(!res) {
            message.error('登录失败');
        }
        message.success('注册成功');
        if(newUser.profile.role === 0) {
            setTimeout(() => {
                navigate('/home');
            }, 1500);
        }
        else if(newUser.profile.role === 1) {
            setTimeout(() => {
                navigate('/admin/usermanagement');
            }, 1500);
        }
        else if(newUser.profile.role === 2) {
            setTimeout(() => {
                navigate('/admin/stats');
            }, 1500);
        }
        else {
            navigate('/notfound');
        }
    }

    return (
        <Form
            form={form}
            name="register"
            onFinish={onFinish}
            layout="vertical"
            scrollToFirstError
            size="middle"
        >
            <Row gutter={12}>
                <Col span={12}>
                    <Form.Item
                        name="stuid"
                        label="学号"
                        rules={[
                            { required: true, message: '请输入学号' },
                            { pattern: /^\d{12}$/, message: '学号必须是12位数字' }
                        ]}
                        style={{ marginBottom: 16 }}
                    >
                        <Input 
                            prefix={<UserOutlined style={{ color: '#bfbfbf' }} />} 
                            placeholder="请输入学号" 
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="username"
                        label="用户名"
                        rules={[
                            { required: true, message: '请输入用户名' },
                            { min: 3, message: '用户名至少3个字符' },
                            { max: 20, message: '用户名最多20个字符' }
                        ]}
                        style={{ marginBottom: 16 }}
                    >
                        <Input 
                            prefix={<UserOutlined style={{ color: '#bfbfbf' }} />} 
                            placeholder="请输入用户名" 
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={12}>
                <Col span={12}>
                    <Form.Item
                        name="password"
                        label="密码"
                        rules={[
                            { required: true, message: '请输入密码' },
                            { min: 6, message: '密码至少6个字符' }
                        ]}
                        style={{ marginBottom: 16 }}
                    >
                        <Input.Password 
                            prefix={<LockOutlined style={{ color: '#bfbfbf' }} />} 
                            placeholder="请输入密码" 
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="confirm"
                        label="确认密码"
                        rules={[
                            { required: true, message: '请确认密码' },
                            () => ({
                                validator(_, value) {
                                    const password = form.getFieldValue('password');
                                    if (!value || value === password) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('两次输入的密码不匹配!'));
                                },
                            }),
                        ]}
                        style={{ marginBottom: 16 }}
                    >
                        <Input.Password 
                            prefix={<LockOutlined style={{ color: '#bfbfbf' }} />} 
                            placeholder="请再次输入密码" 
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item
                name="email"
                label="邮箱"
                rules={[
                    { required: true, message: '请输入邮箱' },
                    { type: 'email', message: '请输入有效的邮箱地址!' }
                ]}
                style={{ marginBottom: 16 }}
            >
                <Input 
                    prefix={<MailOutlined style={{ color: '#bfbfbf' }} />} 
                    placeholder="请输入邮箱地址" 
                />
            </Form.Item>

            <Row gutter={12}>
                <Col span={14}>
                    <Form.Item name="checkbox" style={{ marginBottom: 12 }}>
                        <Space size={16}>
                            <Checkbox
                                checked={adminChecked}
                                onChange={onAdminChange}
                                style={{ fontSize: '13px' }}
                            > 
                                管理员 
                            </Checkbox>
                            <Checkbox
                                checked={psyChecked}
                                onChange={onPsyChange}
                                style={{ fontSize: '13px' }}
                            > 
                                心理咨询师 
                            </Checkbox>
                        </Space>
                    </Form.Item>
                </Col>
                <Col span={10}>
                    <Form.Item name="verifyKey" style={{ marginBottom: 12 }}>
                        <Input 
                            prefix={<LockOutlined style={{ color: '#bfbfbf' }} />} 
                            placeholder="验证码" 
                            disabled={!adminChecked && !psyChecked}
                            style={{ fontSize: '13px' }}
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item style={{ marginBottom: 8 }}>
                <Button 
                    type="primary" 
                    htmlType="submit" 
                    icon={<UserAddOutlined />}
                    style={{ 
                        width: '100%',
                        height: '40px',
                        borderRadius: '6px',
                        fontSize: '15px',
                        fontWeight: 500,
                        background: 'linear-gradient(135deg, #52c41a 0%, #1890ff 100%)',
                        border: 'none'
                    }}
                >
                    立即注册
                </Button>
            </Form.Item>
            
            <div style={{ textAlign: 'center', marginTop: 8 }}>
                <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>
                    已有账号？
                    <Link to="/login" style={{ color: '#1890ff', marginLeft: '4px' }}> 
                        返回登录 
                    </Link>
                </Text>
            </div>
        </Form>
    );
}