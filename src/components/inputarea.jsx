import React, { useState, useEffect } from "react";
import { Card, Input, Form, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { App } from 'antd';
import { useParams } from 'react-router-dom';
import { getSession, postMessage } from "../service/chat";

const { TextArea } = Input;

export default function InputArea({setSession}) {
    const { message } = App.useApp();
    const {sessionid} = useParams();

    const handleSubmit = async (values) => {
        const res = await postMessage(values.input);
        if(!res) {
            message.error('发送失败');
        }
        const fetched_session = await getSession(sessionid);
        if(!fetched_session) {
            message.error('加载失败');
        }
        message.success('发送成功');
        setSession(fetched_session);
    }
    
    return (
        <div>
            <Card>
                <Form
                    name="verify"
                    layout="vertical"
                    scrollToFirstError
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="input"
                        rules={[{ required: true, message: '请输入内容' }]}
                    >
                        <TextArea 
                            rows={6} 
                            placeholder="请输入消息内容" 
                            showCount 
                            maxLength={300} 
                        />
                    </Form.Item>

                    <Form.Item 
                        wrapperCol={{ offset: 3, span: 20 }}
                        style={{ marginBottom: 0 }}
                    >   
                        <Button 
                            type="primary" 
                            disabled={!sessionid}
                            htmlType="submit" 
                            style={{ 
                                width: '100%',
                                height: '40px',
                                borderRadius: '0px',
                                fontSize: '16px',
                                fontWeight: 500
                            }}
                        > 
                            发送
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}