import React, { useState, useEffect } from "react";
import { App, Button, Form, Modal, Typography, Image, Input, Radio, Upload, Select, Tag } from "antd";
import { 
    PlusSquareOutlined, EditOutlined, PictureOutlined, UnorderedListOutlined,
    HeartOutlined, LinkOutlined, TagOutlined, FileTextOutlined, CustomerServiceOutlined
} from "@ant-design/icons";
import { readFile } from "../../service/common";
import { AddUrlData } from "../../service/pushcontent";
import { getUrlTags } from "../../service/emotion";

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function PushAddingModal({reloadPage}) {
    const [isModelOpen, setIsModelOpen] = useState(false);
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [img, setImg] = useState(null);
    const [form] = Form.useForm();
    const { message } = App.useApp();

    useEffect(() => {
        const fetch = async () => {
            const fetched_tags = await getUrlTags();
            setTags(fetched_tags);
        }
        fetch();
    }, []);

    const handleOpen = () => {
        setIsModelOpen(true);
    }

    const handleClose = () => {
        setIsModelOpen(false);
        setSelectedTags([]);
        setImg(null);
        form.resetFields();
    }

    const handleOk = async () => {
        let values;
        try {
            values = await form.validateFields();
        } 
        catch(e) {
            message.error('请完善必填信息');
            return;
        }

        if(selectedTags.length === 0) {
            message.warning('请至少选择一个标签');
            return;
        }

        const newUrlData = {
            type: values.type,
            title: values.title,
            img: img,
            description: values.description,
            url: values.url,
            tags: selectedTags.map(tagid => tags.find(tag => tag.id === tagid))
        }

        const res = await AddUrlData(newUrlData);
        if (!res) {
            message.error('发布失败，请重试');
            return;
        }
        
        reloadPage();
        message.success('内容发布成功！');
        handleClose();
    }

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('只能上传 JPG/PNG 格式的图片');
            return false;
        }
        const isLt5M = file.size / 1024 / 1024 < 8;
        if (!isLt5M) {
            message.error('图片必须小于 8MB');
            return false;
        }
        return true;
    };

    const handleChange = (info) => {
        if(info.file.status === 'done') {
            message.success('封面上传成功');
        }
        else if(info.file.status === 'error') {
            message.error('封面上传失败');
        }
    }

    const customRequest = async ({ file, onSuccess, onError }) => {
        let dataUrl;
        try {
            dataUrl = await readFile(file);
        }
        catch {
            onError('error');
            return;
        }
        onSuccess('success');
        setImg(dataUrl);
    }
    
    return (
        <div>
            <Button
                type="primary"
                icon={<PlusSquareOutlined />}
                onClick={handleOpen}
                style={{
                    background: 'linear-gradient(135deg, #722ed1 0%, #9254de 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 6px 16px rgba(114, 46, 209, 0.3)',
                    fontWeight: '600',
                    fontSize: '16px',
                    height: '44px',
                    padding: '0 24px',
                    transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 20px rgba(114, 46, 209, 0.4)';
                }}
                onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 6px 16px rgba(114, 46, 209, 0.3)';
                }}
            >
                发布新内容
            </Button>

            <Modal
                title={
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        padding: '16px 0',
                        borderBottom: '1px solid rgba(114, 46, 209, 0.1)'
                    }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            background: 'linear-gradient(135deg, #722ed1 0%, #9254de 100%)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(114, 46, 209, 0.3)'
                        }}>
                            <EditOutlined style={{ color: '#fff', fontSize: '20px' }} />
                        </div>
                        <div>
                            <Title level={4} style={{ 
                                margin: 0,
                                background: 'linear-gradient(135deg, #722ed1 0%, #9254de 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}>
                                发布推送内容
                            </Title>
                            <Text style={{ color: '#8c8c8c', fontSize: '14px' }}>
                                分享有价值的心理健康内容
                            </Text>
                        </div>
                    </div>
                }
                open={isModelOpen}
                onOk={handleOk}
                onCancel={handleClose}
                width={600}
                centered
                okText="发布内容"
                cancelText="取消"
                okButtonProps={{
                    style: {
                        background: 'linear-gradient(135deg, #722ed1 0%, #9254de 100%)',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '600',
                        height: '40px',
                        padding: '0 24px'
                    }
                }}
                cancelButtonProps={{
                    style: {
                        borderRadius: '8px',
                        height: '40px',
                        padding: '0 24px'
                    }
                }}
                style={{
                    borderRadius: '16px'
                }}
                bodyStyle={{
                    padding: '12px',
                    background: 'linear-gradient(135deg, rgba(114, 46, 209, 0.02) 0%, rgba(114, 46, 209, 0.05) 100%)'
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="addingform"
                    style={{ marginTop: '16px' }}
                >
                    <Form.Item
                        name="type"
                        label={
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <UnorderedListOutlined style={{ color: '#722ed1' }} />
                                <Text strong style={{ color: '#262626' }}>内容类型</Text>
                            </div>
                        }
                        required
                        rules={[{ required: true, message: '请选择内容类型' }]}
                        style={{ marginBottom: '24px' }}
                    >
                        <Radio.Group size="large" style={{ width: '100%' }}>
                            <Radio.Button 
                                value="article" 
                                style={{
                                    borderRadius: '8px 0 0 8px',
                                    fontWeight: '500',
                                    flex: 1,
                                    textAlign: 'center'
                                }}
                            >
                                <FileTextOutlined style={{ marginRight: '8px' }} />
                                心理文章
                            </Radio.Button>
                            <Radio.Button 
                                value="music" 
                                style={{
                                    borderRadius: '0 8px 8px 0',
                                    fontWeight: '500',
                                    flex: 1,
                                    textAlign: 'center'
                                }}
                            >
                                <CustomerServiceOutlined style={{ marginRight: '8px' }} />
                                治愈音乐
                            </Radio.Button>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        name="title"
                        label={
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <EditOutlined style={{ color: '#722ed1' }} />
                                <Text strong style={{ color: '#262626' }}>内容标题</Text>
                            </div>
                        }
                        required
                        rules={[
                            { required: true, message: '请输入内容标题' },
                            { max: 100, message: '标题不能超过100个字符' }
                        ]}
                        style={{ marginBottom: '24px' }}
                    >
                        <Input 
                            size="large" 
                            placeholder="请输入吸引人的标题，让更多人看到您的内容"
                            style={{
                                borderRadius: '8px',
                                border: '1px solid rgba(114, 46, 209, 0.2)',
                                padding: '12px 16px'
                            }}
                            showCount
                            maxLength={100}
                        />
                    </Form.Item>

                    <Form.Item
                        name="url"
                        label={
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <LinkOutlined style={{ color: '#722ed1' }} />
                                <Text strong style={{ color: '#262626' }}>内容链接</Text>
                            </div>
                        }
                        required
                        rules={[
                            { required: true, message: '请输入内容链接' },
                            { type: 'url', message: '请输入有效的网址' }
                        ]}
                        style={{ marginBottom: '24px' }}
                    >
                        <Input 
                            size="large" 
                            placeholder="https://example.com"
                            style={{
                                borderRadius: '8px',
                                border: '1px solid rgba(114, 46, 209, 0.2)',
                                padding: '12px 16px'
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        label={
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <TagOutlined style={{ color: '#722ed1' }} />
                                <Text strong style={{ color: '#262626' }}>内容标签</Text>
                                <Text style={{ color: '#8c8c8c', fontSize: '12px' }}>
                                    (选择相关标签，帮助用户发现您的内容)
                                </Text>
                            </div>
                        }
                        style={{ marginBottom: '24px' }}
                    >
                        <Select
                            mode="multiple"
                            size="large"
                            placeholder="选择对应的情绪状态标签"
                            value={selectedTags}
                            onChange={value => setSelectedTags(value)}
                            options={tags.map(tag => ({ label: tag.content, value: tag.id }))}
                            maxTagCount="responsive"
                        />
                        {selectedTags.length > 0 && (
                            <div style={{ marginTop: '12px' }}>
                                <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>
                                    已选择 {selectedTags.length} 个标签
                                </Text>
                            </div>
                        )}
                    </Form.Item>

                    <Form.Item
                        label={
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <PictureOutlined style={{ color: '#722ed1' }} />
                                <Text strong style={{ color: '#262626' }}>封面图片</Text>
                                <Text style={{ color: '#8c8c8c', fontSize: '12px' }}>
                                    (可选，建议尺寸 16:9)
                                </Text>
                            </div>
                        }
                        style={{ marginBottom: '24px' }}
                    >
                        <Upload
                            name="uploader"
                            showUploadList={false}
                            beforeUpload={beforeUpload}
                            onChange={handleChange}
                            customRequest={customRequest}
                            style={{ width: '100%' }}
                        >
                            {img ? (
                                <div style={{ position: 'relative', display: 'inline-block' }}>
                                    <Image
                                        src={img}
                                        width={200}
                                        height={120}
                                        style={{
                                            borderRadius: '12px',
                                            objectFit: 'cover',
                                            boxShadow: '0 4px 12px rgba(114, 46, 209, 0.2)',
                                            border: '1px solid rgba(114, 46, 209, 0.1)'
                                        }}
                                        preview={false}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        top: '8px',
                                        right: '8px',
                                        background: 'rgba(0,0,0,0.5)',
                                        color: '#fff',
                                        borderRadius: '4px',
                                        padding: '4px 8px',
                                        fontSize: '12px'
                                    }}>
                                        点击更换
                                    </div>
                                </div>
                            ) : (
                                <div style={{
                                    width: '200px',
                                    height: '120px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '2px dashed rgba(114, 46, 209, 0.3)',
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, rgba(114, 46, 209, 0.05) 0%, rgba(114, 46, 209, 0.1) 100%)',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}>
                                    <PictureOutlined style={{ 
                                        fontSize: '32px', 
                                        color: '#722ed1',
                                        marginBottom: '8px'
                                    }} />
                                    <Text style={{ color: '#722ed1', fontSize: '14px' }}>
                                        点击上传封面
                                    </Text>
                                    <Text style={{ color: '#8c8c8c', fontSize: '12px' }}>
                                        支持 JPG、PNG
                                    </Text>
                                </div>
                            )}
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label={
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <HeartOutlined style={{ color: '#722ed1' }} />
                                <Text strong style={{ color: '#262626' }}>内容简介</Text>
                            </div>
                        }
                        required
                        rules={[
                            { required: true, message: '请输入内容简介' },
                            { max: 500, message: '简介不能超过500个字符' }
                        ]}
                        style={{ marginBottom: '8px' }}
                    >
                        <TextArea
                            size="large"
                            autoSize={{ minRows: 4, maxRows: 6 }}
                            placeholder="请简要介绍这个内容的主要观点和价值，帮助用户了解内容概要..."
                            style={{
                                borderRadius: '8px',
                                border: '1px solid rgba(114, 46, 209, 0.2)',
                                padding: '12px 16px',
                                fontSize: '14px'
                            }}
                            showCount
                            maxLength={500}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}