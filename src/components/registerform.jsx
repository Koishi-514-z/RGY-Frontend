import React, { useState } from "react";
import { Form, Input, Button, App, Typography, Divider, Space, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, UserAddOutlined } from "@ant-design/icons";
import { Link, useNavigate } from 'react-router-dom';
import { userExisted, addUser, login, adminVerify } from "../service/user";

const { Text } = Typography;

export default function RegisterForm() {
    const [checked, setChecked] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { message, modal } = App.useApp();

    const onChange = (event) => {
        setChecked(event.target.checked);
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

        if(checked) {
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
                role: checked
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
        setTimeout(() => {
            navigate('/home');
        }, 1500);
    }

    return (
        <Form
            form={form}
            name="register"
            onFinish={onFinish}
            layout="vertical"
            scrollToFirstError
            size="large"
        >
            <Form.Item
                name="stuid"
                label="学号"
                required
                tooltip="请填写学号"
                rules={[
                    { required: true, message: '请输入学号' },
                    {
                        pattern: /^\d{12}$/,
                        message: '学号必须是12位数字'
                    }
                ]}
            >
                <Input 
                    prefix={<UserOutlined style={{ color: '#bfbfbf' }} />} 
                    placeholder="请输入学号" 
                    size="large" 
                />
            </Form.Item>

            <Form.Item
                name="username"
                label="用户名"
                required
                tooltip="请填写用户名, 3到20个字符之间"
                rules={[
                    { required: true, message: '请输入用户名' },
                    { min: 3, message: '用户名至少3个字符' },
                    { max: 20, message: '用户名最多20个字符' }
                ]}
            >
                <Input 
                    prefix={<UserOutlined style={{ color: '#bfbfbf' }} />} 
                    placeholder="请输入用户名" 
                    size="large" 
                />
            </Form.Item>

            <Form.Item
                name="password"
                label="密码"
                required
                tooltip="请填写密码, 至少6位"
                rules={[
                    { required: true, message: '请输入密码' },
                    { min: 6, message: '密码至少6个字符' }
                ]}
            >
                <Input.Password 
                    prefix={<LockOutlined style={{ color: '#bfbfbf' }} />} 
                    placeholder="请输入密码" 
                    size="large" 
                />
            </Form.Item>

            <Form.Item
                name="confirm"
                label="确认密码"
                required
                tooltip="请再次填写密码"
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
            >
                <Input.Password 
                    prefix={<LockOutlined style={{ color: '#bfbfbf' }} />} 
                    placeholder="请再次输入密码" 
                    size="large" 
                />
            </Form.Item>

            <Form.Item
                name="email"
                label="邮箱"
                required
                tooltip="请填写邮箱地址"
                rules={[
                    { required: true, message: '请输入邮箱' },
                    { type: 'email', message: '请输入有效的邮箱地址!' }
                ]}
            >
                <Input 
                    prefix={<MailOutlined style={{ color: '#bfbfbf' }} />} 
                    placeholder="请输入邮箱地址" 
                    size="large" 
                />
            </Form.Item>

            <Form.Item name="checkbox">
                <Checkbox
                    checked={checked}
                    onChange={onChange}
                > 
                    注册为管理员 
                </Checkbox>
            </Form.Item>

            <Form.Item name="verifyKey">
                <Input 
                    prefix={<LockOutlined />} 
                    placeholder="verifyKey" 
                    size="large" 
                    disabled={!checked}
                />
            </Form.Item>

            <Form.Item style={{ marginBottom: 12 }}>
                <Button 
                    type="primary" 
                    htmlType="submit" 
                    icon={<UserAddOutlined />}
                    style={{ 
                        width: '100%',
                        height: '46px',
                        borderRadius: '6px',
                        fontSize: '16px',
                        fontWeight: 500
                    }}
                >
                    立即注册
                </Button>
            </Form.Item>
            
            <Divider style={{ margin: '16px 0' }}>
                <Text type="secondary"> 或者 </Text>
            </Divider>
            
            <div style={{ textAlign: 'center' }}>
                <Space>
                    <Text type="secondary"> 已有账号？ </Text>
                    <Link to="/login" style={{ fontWeight: 500 }}> 返回登录 </Link>
                </Space>
            </div>
        </Form>
    );
}