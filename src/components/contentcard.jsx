import React, { useState, useEffect } from "react";
import { Card, Typography, Avatar, Space, Divider } from "antd";
import { UserOutlined, RobotOutlined } from "@ant-design/icons";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

const { Text, Paragraph } = Typography;

export default function ContentCard({session, message}) {
    const formatDateTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    if(message.role === 0) {        //  自己发送的消息
        return (
            <div style={{ marginBottom: '16px' }}>
                <Card 
                    extra={<Text type="secondary"> {formatDateTime(message.timestamp)} </Text>}
                    style={{ 
                        borderRadius: '8px',
                        backgroundColor: '#f0f9ff'
                    }}
                >
                    <Space align="start">
                        <Avatar 
                            src={session.myself.avatar}
                            style={{ 
                                backgroundColor: '#1890ff',
                                marginRight: '12px'
                            }} 
                        />
                        <div style={{ flex: 1 }}>
                            <Paragraph style={{ whiteSpace: 'pre-wrap', marginBottom: 0 }}>
                                {message.content}
                            </Paragraph>
                        </div>
                    </Space>
                </Card>
            </div>
        );
    }
    
    else {                      //  对方发送的消息
        return (
            <div style={{ marginBottom: '16px' }}>
                <Card 
                    extra={<Text type="secondary"> {formatDateTime(message.timestamp)} </Text>}
                    style={{ 
                        borderRadius: '8px',
                        backgroundColor: '#f6ffed'
                    }}
                >
                    <Space align="start">
                        <Avatar 
                            src={session.other.avatar}
                            style={{ 
                                backgroundColor: '#52c41a',
                                marginRight: '12px'
                            }} 
                        />
                        <div style={{ flex: 1 }}>
                            <ReactMarkdown
                                children={message.content}
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeHighlight]}
                            />
                        </div>
                    </Space>
                </Card>
            </div>
        );
    }
}