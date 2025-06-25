import React, { useState } from "react";
import { Input, Form, Button, Space, Tooltip } from "antd";
import { SendOutlined, SmileOutlined, PictureOutlined, PaperClipOutlined } from "@ant-design/icons";
import { App } from 'antd';
import { useParams } from 'react-router-dom';
import { getSession, postMessage } from "../service/chat";

const { TextArea } = Input;

export default function InputArea({setSession}) {
    const { message } = App.useApp();
    const {sessionid} = useParams();
    const [form] = Form.useForm();
    
    const handleSubmit = async (values) => {
        const res = await postMessage(sessionid, values.input);
        if(!res) {
            message.error('发送失败，请检查网络连接');
            return;
        }
        
        const fetched_session = await getSession(sessionid);
        if(!fetched_session) {
            message.error('更新会话失败');
            return;
        }
        
        setSession(fetched_session);
        form.resetFields();
    }
    
    return (
        <div style={{
            borderRadius: '12px',
            background: '#fff',
            padding: '12px',
            boxShadow: '0 -2px 8px rgba(0,0,0,0.05)'
        }}>
            <Form
                form={form}
                name="chatInput"
                layout="vertical"
                onFinish={handleSubmit}
                style={{ marginBottom: 0 }}
            >
                <Form.Item
                    name="input"
                    rules={[{ required: true, message: '请输入消息内容' }]}
                    style={{ marginBottom: '12px' }}
                >
                    <TextArea 
                        rows={4} 
                        placeholder="输入消息..." 
                        showCount 
                        maxLength={300}
                        maxRows={4}
                        style={{ 
                            borderRadius: '8px',
                            padding: '12px',
                            fontSize: '15px',
                            resize: 'none',
                            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)'
                        }}
                    />
                </Form.Item>

                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '8px'
                }}>
                    <Space size="middle">
                        <Tooltip title="表情">
                            <Button 
                                type="text" 
                                icon={<SmileOutlined style={{ fontSize: '18px' }}/>} 
                                shape="circle"
                                size="large"
                            />
                        </Tooltip>
                        <Tooltip title="图片">
                            <Button 
                                type="text" 
                                icon={<PictureOutlined style={{ fontSize: '18px' }}/>} 
                                shape="circle"
                                size="large"
                            />
                        </Tooltip>
                        <Tooltip title="附件">
                            <Button 
                                type="text" 
                                icon={<PaperClipOutlined style={{ fontSize: '18px' }}/>} 
                                shape="circle"
                                size="large"
                            />
                        </Tooltip>
                    </Space>
                    
                    <Button 
                        type="primary" 
                        disabled={!sessionid}
                        htmlType="submit" 
                        icon={<SendOutlined />}
                        size="large"
                        style={{ 
                            width: '80px',
                            height: '36px',
                            borderRadius: '4px',
                            fontSize: '15px',
                            fontWeight: 500,
                            boxShadow: '0 2px 6px rgba(24, 144, 255, 0.25)'
                        }}
                    > 
                        发送
                    </Button>
                </div>
            </Form>
        </div>
    );
}