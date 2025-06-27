import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {Button, Input, Select, Form, message, Card, Upload, App} from "antd";
import { addBlog } from "../service/community";
import CustomLayout from "../components/layout/customlayout";

export default function PostPage() {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [tmpUrl, setTmpUrl] = useState('');
    const { message, modal } = App.useApp();
    //const message = useMessage();

    const handleSubmit = async (values) => {
        setLoading(true);
        const blog = {
            title: values.title,
            content: values.content,
            tag: values.tag,
            cover: tmpUrl,
        };
        const res = await addBlog(blog);
        if (res && res.success) {
            message.success("发帖成功！");
            setTimeout(() => {
                navigate("/community");
            }, 1000);
        } else {
            message.error("发帖失败，请稍后再试！");
        }
        setLoading(false);
    };

//    const handleCoverUpload = async (info) => {
//         if (info.file.status === 'done' || info.file.status ==='success') {
//             const file = info.file.originFileObj;
//             const formData = new FormData();
//             formData.append('file', file);
//             formData.append('filename', file.name);

//             try {
//                 const response = await post('http://localhost:8080/api/saveImg', {
//                     method: 'POST',
//                     body: formData,
//                 });

//                 if (!response.ok) {
//                     message.error('上传失败,请重试');
//                 }

//                 //const fileUrl = URL.createObjectURL(file);
//                 //setPreviewUrl(fileUrl);
//                 let responseJson = await response.json();
//                 let imageUrl = `${PREFIX}/readImg/${responseJson.filename}`;
//                 setTmpUrl(imageUrl);
//                 //onAvatarChange(responseJson.filename);
//                 message.success('上传成功');
//             } catch (error) {
//                 message.error('上传失败，请重试');
//             }
//         }
//     }

    return (
        <CustomLayout content={<div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
            <Card style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', textAlign: 'center' }}>发帖</h2>
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item
                        name="title"
                        label="标题"
                        rules={[{ required: true, message: '请输入标题' }]}
                    >
                        <Input placeholder="请输入标题" style={{ borderRadius: '8px' }} />
                    </Form.Item>
                    <Form.Item
                        name="content"
                        label="内容"
                        rules={[{ required: true, message: '请输入内容' }]}
                    >
                        <Input.TextArea rows={6} placeholder="请输入内容" style={{ borderRadius: '8px' }} />
                    </Form.Item>
                    <Form.Item
                        name="tag"
                        label="标签"
                        rules={[{ required: true, message: '请选择标签' }]}
                    >
                        <Select mode="multiple" placeholder="请选择标签" style={{ borderRadius: '8px' }}>
                            <Select.Option value="学习">学习</Select.Option>
                            <Select.Option value="生活">生活</Select.Option>
                            <Select.Option value="情感">情感</Select.Option>
                            <Select.Option value="其他">其他</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%', borderRadius: '8px' }}>
                            提交
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>

        }/>

    );
}
