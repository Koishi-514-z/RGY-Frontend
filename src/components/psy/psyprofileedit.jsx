import React, { useState } from "react";
import { 
    Form, Input, Button, Avatar, Upload, Typography, Modal, Row, Col, Space, 
    Select, InputNumber, Card
} from "antd";
import { 
    UserOutlined, MailOutlined, SaveOutlined, CloseOutlined, LockOutlined, CameraOutlined, 
    BookOutlined, TrophyOutlined, EnvironmentOutlined, ClockCircleOutlined, DollarOutlined, 
    PhoneOutlined, StarOutlined
} from "@ant-design/icons";
import { App } from 'antd';
import { updatePassword, updatePsyProfile, verifyPassword } from "../../service/user";
import { readFile } from "../../service/common";
import { useSearchParams } from "react-router-dom";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function PsyProfileEdit({profile, setUpdate}) {
    console.log(profile);

    const initFormValues = {
        username: profile.username,
        email: profile.email,
        phone: profile.phone,
        title: profile.title,
        license: profile.license,
        
        specialty: profile.specialty.map(tag => tag.id),
        education: profile.education,
        certifications: profile.certifications.map(tag => tag.id),
        workingYears: profile.workingYears,
        
        consultationFee: profile.consultationFee,
        location: profile.location,
        workingTime: profile.workingTime,
        responseTime: profile.responseTime,
        
        introduction: profile.introduction,
        achievements: profile.achievements,
        
        password: null,
        confirm: null,
    };

    const [editForm] = Form.useForm();
    const [verifyForm] = Form.useForm();
    const [avatar, setAvatar] = useState(profile.avatar);
    const { message } = App.useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    const showModal = () => {
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setIsModalOpen(false);
    } 

    const saveProfile = async () => {
        const formValues = editForm.getFieldsValue();
        formValues.specialty = formValues.specialty.map(tagid => profile.specialtyTags.find(tag => tag.id === tagid));
        formValues.certifications = formValues.certifications.map(tagid => profile.certificationTags.find(tag => tag.id === tagid));
        const newProfile = {
            ...profile,
            ...formValues,
            avatar: avatar
        };
        const res = await updatePsyProfile(newProfile);
        if(!res) {
            message.error('保存失败');
        }
        else {
            message.success('保存成功');
            setUpdate(prev => prev + 1);
        }
        setTimeout(() => {
            closeModal();
            setSearchParams({tabKey: 1});
        }, 1000);
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
        setSearchParams({tabKey: 1});
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
            dataUrl = await readFile(file);
        }
        catch {
            onError('error');
        }
        onSuccess('success');
        setAvatar(dataUrl);
    }

    return (
        <>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <Title level={3} style={{ color: '#722ed1' }}>个人资料编辑</Title>
                <Text type="secondary">完善您的专业信息，提升来访者信任度</Text>
            </div>
            
            <Card 
                style={{ 
                    textAlign: 'center', 
                    marginBottom: '24px',
                    background: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
                    border: '1px solid #d3adf7'
                }}
            >
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
                                backgroundColor: avatar ? 'transparent' : '#722ed1',
                                border: '4px solid #fff',
                                boxShadow: '0 4px 16px rgba(114, 46, 209, 0.3)'
                            }}
                        />
                        <div 
                            style={{ 
                                position: 'absolute', 
                                bottom: 0, 
                                right: 0, 
                                backgroundColor: '#722ed1', 
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
                    点击更换专业头像
                </Text>
            </Card>

            <Form
                form={editForm}
                layout="vertical"
                name="editForm"
                initialValues={initFormValues}
            >
                <Card title={
                    <Space>
                        <UserOutlined style={{ color: '#722ed1' }} />
                        <span>基本信息</span>
                    </Space>
                } style={{ marginBottom: '24px' }}>
                    <Row gutter={24}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="username"
                                label="姓名"
                                required
                                rules={[{ required: true, message: '请输入姓名' }]}
                            >
                                <Input 
                                    prefix={<UserOutlined style={{ color: '#bfbfbf' }} />} 
                                    size="large"
                                    placeholder="请输入真实姓名"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="title"
                                label="职业头衔"
                                rules={[{ required: true, message: '请输入职业头衔' }]}
                            >
                                <Input 
                                    size="large"
                                    placeholder="如：资深心理咨询师"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
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
                                    placeholder="用于接收预约通知"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="phone"
                                label="联系电话"
                                rules={[{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }]}
                            >
                                <Input 
                                    prefix={<PhoneOutlined style={{ color: '#bfbfbf' }} />} 
                                    size="large"
                                    placeholder="联系电话（可选）"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>

                <Card title={
                    <Space>
                        <TrophyOutlined style={{ color: '#faad14' }} />
                        <span>专业资质</span>
                    </Space>
                } style={{ marginBottom: '24px' }}>
                    <Row gutter={24}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="license"
                                label="执业证书"
                                rules={[{ required: true, message: '请输入执业证书' }]}
                            >
                                <Input 
                                    size="large"
                                    placeholder="如：国家二级心理咨询师"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="workingYears"
                                label="从业年限"
                                rules={[{ required: true, message: '请输入从业年限' }]}
                            >
                                <InputNumber
                                    size="large"
                                    min={0}
                                    max={50}
                                    style={{ width: '100%' }}
                                    placeholder="年"
                                    addonAfter="年"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24}>
                            <Form.Item
                                name="education"
                                label="学历背景"
                                rules={[{ required: true, message: '请输入学历背景' }]}
                            >
                                <Input 
                                    size="large"
                                    placeholder="如：北京师范大学 心理学硕士"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24}>
                            <Form.Item
                                name="certifications"
                                label="资质证书"
                            >
                                <Select
                                    mode="multiple"
                                    size="large"
                                    placeholder="选择您拥有的资质证书"
                                    options={profile.certificationTags.map(tag => ({ label: tag.content, value: tag.id }))}
                                    maxTagCount="responsive"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>

                <Card title={
                    <Space>
                        <BookOutlined style={{ color: '#722ed1' }} />
                        <span>专业领域</span>
                    </Space>
                } style={{ marginBottom: '24px' }}>
                    <Row gutter={24}>
                        <Col xs={24}>
                            <Form.Item
                                name="specialty"
                                label="擅长领域"
                                rules={[{ required: true, message: '请选择至少一个擅长领域' }]}
                            >
                                <Select
                                    mode="multiple"
                                    size="large"
                                    placeholder="选择您的专业擅长领域（建议选择3-6个）"
                                    options={profile.specialtyTags.map(tag => ({ label: tag.content, value: tag.id }))}
                                    maxTagCount="responsive"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24}>
                            <Form.Item
                                name="introduction"
                                label="个人简介"
                                rules={[{ required: true, message: '请输入个人简介' }]}
                            >
                                <TextArea
                                    rows={6}
                                    placeholder="请详细介绍您的专业背景、治疗理念、擅长方向等，帮助来访者更好地了解您..."
                                    showCount
                                    maxLength={500}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>

                <Card title={
                    <Space>
                        <ClockCircleOutlined style={{ color: '#13c2c2' }} />
                        <span>服务信息</span>
                    </Space>
                } style={{ marginBottom: '24px' }}>
                    <Row gutter={24}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="location"
                                label="服务地点"
                            >
                                <Input 
                                    prefix={<EnvironmentOutlined style={{ color: '#bfbfbf' }} />}
                                    size="large"
                                    placeholder="如：北京·朝阳区"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="consultationFee"
                                label="咨询收费"
                            >
                                <Input 
                                    prefix={<DollarOutlined style={{ color: '#bfbfbf' }} />}
                                    size="large"
                                    placeholder="如：200-400元/小时"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="responseTime"
                                label="回复速度"
                            >
                                <Select
                                    size="large"
                                    placeholder="选择回复速度"
                                >
                                    <Option value="即时回复">即时回复</Option>
                                    <Option value="5分钟内">5分钟内</Option>
                                    <Option value="30分钟内">30分钟内</Option>
                                    <Option value="1小时内">1小时内</Option>
                                    <Option value="3小时内">3小时内</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="workingTime"
                                label="工作时间"
                            >
                                <Input 
                                    size="large"
                                    placeholder="如：周一至周五 9:00-21:00"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>

                <Card title={
                    <Space>
                        <StarOutlined style={{ color: '#faad14' }} />
                        <span>荣誉成就</span>
                    </Space>
                } style={{ marginBottom: '24px' }}>
                    <Form.Item
                        name="achievements"
                        label="获得荣誉"
                    >
                        <Select
                            mode="tags"
                            size="large"
                            placeholder="输入您获得的荣誉或成就，按回车添加"
                            tokenSeparators={['|']}
                            maxTagCount="responsive"
                        />
                    </Form.Item>
                </Card>

                <Card title={
                    <Space>
                        <LockOutlined style={{ color: '#ff4d4f' }} />
                        <span>密码设置</span>
                    </Space>
                } style={{ marginBottom: '32px' }}>
                    <Row gutter={24}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="password"
                                label="新密码"
                                rules={[
                                    { min: 6, message: '密码至少6个字符' }
                                ]}
                            >
                                <Input.Password 
                                    prefix={<LockOutlined style={{ color: '#bfbfbf' }} />} 
                                    placeholder="输入新密码（不修改请留空）" 
                                    size="large" 
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
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
                </Card>

                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    gap: '16px', 
                    marginBottom: '32px'
                }}>
                    <Button 
                        type="primary" 
                        icon={<SaveOutlined />} 
                        onClick={handleSave}
                        size="large"
                        style={{ 
                            width: '160px',
                            height: '45px',
                            borderRadius: '8px',
                            backgroundColor: '#722ed1',
                            borderColor: '#722ed1'
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
                            borderRadius: '8px',
                        }}
                    >
                        取消
                    </Button>
                </div>
            </Form>

            <Modal
                title={
                    <div style={{ textAlign: 'center', padding: '12px 0' }}>
                        <LockOutlined style={{ fontSize: '24px', color: '#722ed1', marginBottom: '8px' }} />
                        <Title level={4} style={{ margin: '8px 0', color: '#722ed1' }}>验证身份</Title>
                        <Text type="secondary">请输入当前密码以确认修改</Text>
                    </div>
                }
                centered
                open={isModalOpen}
                onOk={handleOk}
                onCancel={closeModal}
                okText="确认修改"
                cancelText="取消"
                okButtonProps={{ 
                    size: 'large',
                    style: { 
                        borderRadius: '8px',
                        backgroundColor: '#722ed1',
                        borderColor: '#722ed1'
                    }
                }}
                cancelButtonProps={{ 
                    size: 'large',
                    style: { borderRadius: '8px' }
                }}
                style={{ top: 20 }}
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