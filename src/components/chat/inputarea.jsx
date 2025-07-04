import React, { useState } from "react";
import { Input, Form, Button, Space, Tooltip, Popover } from "antd";
import { SendOutlined, SmileOutlined, PictureOutlined, PaperClipOutlined, MoreOutlined } from "@ant-design/icons";
import { App } from 'antd';
import { useParams } from 'react-router-dom';
import { getSession, postMessage } from "../../service/chat";

const { TextArea } = Input;

export default function InputArea({setSession}) {
    const { message } = App.useApp();
    const {sessionid} = useParams();
    const [form] = Form.useForm();
    const [inputValue, setInputValue] = useState('');
    
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
        setInputValue('');
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            form.submit();
        }
    }

    const moreActions = (
        <div style={{ padding: '8px' }}>
            <Space direction="vertical" size={4}>
                <Button 
                    type="text" 
                    icon={<PictureOutlined />}
                    style={{ 
                        justifyContent: 'flex-start',
                        width: '100%',
                        padding: '4px 8px'
                    }}
                >
                    发送图片
                </Button>
                <Button 
                    type="text" 
                    icon={<PaperClipOutlined />}
                    style={{ 
                        justifyContent: 'flex-start',
                        width: '100%',
                        padding: '4px 8px'
                    }}
                >
                    发送文件
                </Button>
            </Space>
        </div>
    );
    
    return (
        <div style={{
            background: '#fff',
            padding: '8px 12px',
            borderTop: '1px solid #f0f0f0'
        }}>
            <Form
                form={form}
                name="chatInput"
                onFinish={handleSubmit}
                style={{ marginBottom: 0 }}
            >
                <div style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: '8px'
                }}>
                    <Tooltip title="表情">
                        <Button 
                            type="text" 
                            icon={<SmileOutlined style={{ fontSize: '16px' }}/>} 
                            size="small"
                            style={{
                                minWidth: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        />
                    </Tooltip>

                    <div style={{ flex: 1 }}>
                        <Form.Item
                            name="input"
                            style={{ marginBottom: 0 }}
                        >
                            <TextArea 
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="输入消息，Enter 发送，Shift+Enter 换行" 
                                autoSize={{ minRows: 2, maxRows: 4 }}
                                maxLength={300}
                                style={{ 
                                    borderRadius: '16px',
                                    padding: '8px 12px',
                                    fontSize: '14px',
                                    resize: 'none',
                                    lineHeight: '1.4'
                                }}
                            />
                        </Form.Item>
                    </div>

                    <Popover 
                        content={moreActions} 
                        trigger="click" 
                        placement="topRight"
                    >
                        <Tooltip title="更多">
                            <Button 
                                type="text" 
                                icon={<MoreOutlined style={{ fontSize: '16px' }}/>} 
                                size="small"
                                style={{
                                    minWidth: '32px',
                                    height: '32px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            />
                        </Tooltip>
                    </Popover>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        gap: '4px'
                    }}>
                        {inputValue && (
                            <div style={{
                                fontSize: '11px',
                                color: '#8c8c8c'
                            }}>
                                {inputValue.length}/300
                            </div>
                        )}

                        <Button 
                            type="primary" 
                            disabled={!sessionid || !inputValue.trim()}
                            htmlType="submit" 
                            icon={<SendOutlined />}
                            size="small"
                            style={{ 
                                minWidth: '60px',
                                height: '32px',
                                borderRadius: '16px',
                                fontSize: '13px',
                                fontWeight: 500
                            }}
                        > 
                            发送
                        </Button>
                    </div>
                </div>
            </Form>
        </div>
    );
}