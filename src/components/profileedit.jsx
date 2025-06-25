import React, { useState } from "react";
import { Form, Input, Button, Avatar, Upload, Typography, Modal, Divider, Row, Col, Space } from "antd";
import { UserOutlined, MailOutlined, SaveOutlined, CloseOutlined, LockOutlined, CameraOutlined, EditOutlined } from "@ant-design/icons";
import { App } from 'antd';
import { getUserProfile, updatePassword, updateProfile, verifyPassword } from "../service/user";
import { readFile } from "../service/common";

const { Title, Text } = Typography;

export default function ProfileEdit({profile, setProfile, setTabKey}) {
    const initFormValues = {
        username: profile.username,
        password: null,
        confirm: null,
        email: profile.email
    };
    const [editForm] = Form.useForm();
    const [verifyForm] = Form.useForm();
    const [avatar, setAvatar] = useState(profile.avatar);
    const { message } = App.useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setIsModalOpen(false);
    } 

    const saveProfile = async () => {
        const formValues = editForm.getFieldsValue();
        const newProfile = {
            ...profile,
            username: formValues.username,
            email: formValues.email,
            avatar: avatar
        };
        const res = await updateProfile(newProfile);
        if(!res) {
            message.error('保存失败');
        }
        else {
            message.success('保存成功');
            setProfile(await getUserProfile());
        }
        closeModal();
        setTabKey(1);
    }
    
    const handleSave = async () => {
        let values;
        try {
            values = await editForm.validateFields();
        }
        catch {
            message.error('请正确填写表单信息');
            return;
        }
        showModal();
    };

    const handleCancel = () => {
        setTabKey(1);
    };

    const handleOk = async () => {
        const newPassword = editForm.getFieldValue('password');
        let values;
        try {
            values = await verifyForm.validateFields();
        }
        catch {
            message.error('请填写原密码');
            return;
        }
        const res = await verifyPassword(values.password);
        if(!res) {
            message.error('密码错误');
            return;
        }
        if(newPassword) {
            const updated = await updatePassword(newPassword);
            if(!updated) {
                message.error('修改密码失败');
                return;
            }
        }
        await saveProfile();
    }

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('只能上传 JPG/PNG 格式的图片');
            return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 16;
        if (!isLt2M) {
            message.error('图片必须小于 16MB');
            return false;
        }
        return true;
    };

    const handleChange = (info) => {
        if(info.file.status === 'done') {
            message.success('头像上传成功');
        }
        else if(info.file.status === 'error') {
            message.error('头像上传失败');
        }
    }

    const customRequest = async ({ file, onSuccess, onError }) => {
        let dataUrl;
        try {
            dataUrl = await readFile(file.originFileObj);
        }
        catch {
            onError('error');
        }
        onSuccess('success');
        setAvatar(dataUrl);
    }

    return (
        <>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <Title level={3}>个人资料编辑</Title>
                <Text type="secondary">更新您的个人信息和账户设置</Text>
            </div>
            
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <Upload
                    name="avatar"
                    listType="picture-circle"
                    className="avatar-uploader"
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                    customRequest={customRequest}
                >
                    <div style={{ position: 'relative' }}>
                        <Avatar 
                            src={avatar} 
                            size={120}
                            icon={<UserOutlined />}
                            style={{ 
                                objectFit: 'cover',
                                backgroundColor: avatar ? 'transparent' : '#1890ff',
                            }}
                        />
                        <div 
                            style={{ 
                                position: 'absolute', 
                                bottom: 0, 
                                right: 0, 
                                backgroundColor: '#1890ff', 
                                borderRadius: '50%',
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                            }}
                        >
                            <CameraOutlined />
                        </div>
                    </div>
                </Upload>
                <Text type="secondary" style={{ display: 'block', marginTop: '8px' }}>
                    点击更换头像
                </Text>
            </div>

            <Form
                form={editForm}
                layout="vertical"
                name="editForm"
                initialValues={initFormValues}
            >
                <Row gutter={24}>
                    <Col xs={24} md={{ span: 18, offset: 2 }}>
                        <Form.Item
                            name="username"
                            label="用户名"
                            required
                            rules={[{ required: true, message: '请输入用户名' }]}
                        >
                            <Input 
                                prefix={<UserOutlined style={{ color: '#bfbfbf' }} />} 
                                size="large"
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col xs={24} md={{ span: 18, offset: 2 }}>
                        <Form.Item
                            name="email"
                            label="电子邮箱"
                            required
                            rules={[
                                { type: 'email', message: '请输入有效的邮箱地址' }, 
                                { required: true, message: '请输入邮箱地址' }
                            ]}
                        >
                            <Input 
                                prefix={<MailOutlined style={{ color: '#bfbfbf' }} />} 
                                size="large" 
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col xs={24} md={{ span: 18, offset: 2 }}>
                        <Form.Item
                            name="note"
                            label="个性签名"
                        >
                            <Input 
                                prefix={<EditOutlined style={{ color: '#bfbfbf' }} />} 
                                size="large" 
                                showCount 
                                maxLength={30} 
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Divider>
                    <Space>
                        <LockOutlined />
                        <Text>密码设置</Text>
                    </Space>
                </Divider>

                <Row gutter={24}>
                    <Col xs={24} md={{ span: 18, offset: 2 }}>
                        <Form.Item
                            name="password"
                            label="新密码"
                            rules={[
                                { min: 6, message: '密码至少6个字符' }
                            ]}
                        >
                            <Input.Password 
                                prefix={<LockOutlined style={{ color: '#bfbfbf' }} />} 
                                placeholder="输入新密码" 
                                size="large" 
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col xs={24} md={{ span: 18, offset: 2 }}>
                        <Form.Item
                            name="confirm"
                            label="确认新密码"
                            rules={[
                                () => ({
                                    validator(_, value) {
                                        const password = editForm.getFieldValue('password');
                                        if(!password || value === password) {
                                            return Promise.resolve();
                                        }
                                        if(!value) {
                                            return Promise.reject(new Error('请确认新密码'));
                                        }
                                        return Promise.reject(new Error('两次输入的密码不匹配'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password 
                                prefix={<LockOutlined style={{ color: '#bfbfbf' }} />} 
                                placeholder="确认新密码" 
                                size="large" 
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    gap: '16px', 
                    marginTop: '32px' 
                }}>
                    <Button 
                        type="primary" 
                        icon={<SaveOutlined />} 
                        onClick={handleSave}
                        size="large"
                        style={{ 
                            width: '160px',
                            height: '45px',
                            borderRadius: '6px',
                        }}
                    >
                        保存更改
                    </Button>
                    <Button 
                        danger
                        icon={<CloseOutlined />} 
                        onClick={handleCancel}
                        size="large"
                        style={{ 
                            width: '160px',
                            height: '45px',
                            borderRadius: '6px',
                        }}
                    >
                        取消
                    </Button>
                </div>
            </Form>

            <Modal
                title={
                    <div style={{ textAlign: 'center', padding: '12px 0' }}>
                        <LockOutlined style={{ fontSize: '24px', color: '#1890ff', marginBottom: '8px' }} />
                        <Title level={4} style={{ margin: '8px 0' }}>验证身份</Title>
                        <Text type="secondary">请输入当前密码以确认修改</Text>
                    </div>
                }
                open={isModalOpen}
                onOk={handleOk}
                onCancel={closeModal}
                okText="确认修改"
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
                bodyStyle={{ padding: '24px' }}
            >
                <Form
                    form={verifyForm}
                    name="verifyForm"
                    layout="vertical"
                    scrollToFirstError
                >
                    <Form.Item
                        name="password"
                        label="当前密码"
                        required
                        rules={[{ required: true, message: '请输入当前密码' }]}
                    >
                        <Input.Password 
                            prefix={<LockOutlined style={{ color: '#bfbfbf' }} />} 
                            size="large" 
                            placeholder="请输入当前密码"
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}