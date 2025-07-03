import React, { useState, useEffect } from "react";
import { App, Button, Form, Modal, Typography, Space, Image, Input, Radio, Upload } from "antd";
import { PlusSquareOutlined, EditOutlined, PictureOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { readFile } from "../../service/common";
import { AddUrlData } from "../../service/pushcontent";

const { Title, Text } = Typography;

export default function PushAddingModal({reloadPage}) {
    const [isModelOpen, setIsModelOpen] = useState(false);
    const [img, setImg] = useState(null);
    const [form] = Form.useForm();
    const { message } = App.useApp();

    const handleOpen = () => {
        setIsModelOpen(true);
    }

    const handleClose = () => {
        setIsModelOpen(false);
        form.resetFields();
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
        const now = new Date();
        const newUrlData = {
            urlid: 'urldata_' + now.getTime(),
            type: values.type,
            title: values.title,
            img: img,
            description: values.description,
            url: values.url
        }
        const res = await AddUrlData(newUrlData);
        if(!res) {
            message.error('上传失败');
            return;
        }
        reloadPage();
        message.success('添加成功');
        handleClose();
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
            message.success('图片上传成功');
        }
        else if(info.file.status === 'error') {
            message.error('图片上传失败');
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
        setImg(dataUrl);
    }

    return (
        <div>
            <Button
                type="primary"
                icon={<PlusSquareOutlined />}
                onClick={handleOpen}
                style={{
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(24,144,255,0.10)',
                    fontWeight: 600,
                    fontSize: 16,
                    width: 120,
                    height: 36,
                    padding: '8px 28px'
                }}
            >
                添加内容
            </Button>
            <Modal
                title={
                    <Space>
                        <UnorderedListOutlined style={{ color: '#1890ff', fontSize: 22 }} />
                        <Title level={4} style={{ margin: 0, color: '#222' }}>请填写具体信息</Title>
                    </Space>
                }
                open={isModelOpen}
                onOk={handleOk}
                onCancel={handleClose}
                width={480}
                centered
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="addingform"
                >
                    <Form.Item
                        name="url"
                        label={<Text strong>网址</Text>}
                        required
                        rules={[{ required: true, message: '请输入网址' }]}
                        style={{ marginBottom: 20 }}
                    >
                        <Input size="large" placeholder="请输入内容网址" />
                    </Form.Item>

                    <Form.Item
                        name="title"
                        label={<Text strong>标题</Text>}
                        required
                        rules={[{ required: true, message: '请输入标题' }]}
                        style={{ marginBottom: 20 }}
                    >
                        <Input size="large" placeholder="请输入标题" />
                    </Form.Item>

                    <Form.Item
                        name="type"
                        label={<Text strong>类别</Text>}
                        required
                        rules={[{ required: true, message: '请选择类别' }]}
                        style={{ marginBottom: 20 }}
                    >
                        <Radio.Group buttonStyle="solid" size="middle">
                            <Radio.Button value="article">文章</Radio.Button>
                            <Radio.Button value="music">音乐</Radio.Button>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        name="img"
                        label={<Text strong>封面图</Text>}
                        style={{ marginBottom: 20 }}
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
                                <Image
                                    src={img}
                                    width={120}
                                    height={120}
                                    style={{
                                        borderRadius: 10,
                                        objectFit: 'cover',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                        marginBottom: 8
                                    }}
                                    preview={false}
                                />
                            ) : (
                                <div style={{
                                    width: 120,
                                    height: 120,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1.5px dashed #bfbfbf',
                                    borderRadius: 10,
                                    background: '#f4f8fb'
                                }}>
                                    <PictureOutlined style={{ fontSize: 36, color: '#bfbfbf' }} />
                                </div>
                            )}
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label={<Text strong>详细内容</Text>}
                        required
                        rules={[{ required: true, message: '请输入详细内容' }]}
                        style={{ marginBottom: 8 }}
                    >
                        <Input.TextArea
                            prefix={<EditOutlined style={{ color: '#bfbfbf' }} />}
                            size="large"
                            autoSize={{ minRows: 3, maxRows: 5 }}
                            placeholder="请输入详细内容"
                            style={{
                                borderRadius: 8,
                                fontSize: 15,
                                padding: '10px 12px'
                            }}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}