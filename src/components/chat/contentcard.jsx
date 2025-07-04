import React from "react";
import { Typography, Avatar, Space, Tooltip } from "antd";
import { UserOutlined } from "@ant-design/icons";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

const { Text, Paragraph } = Typography;

export default function ContentCard({session, message}) {
    const formatDateTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    if(message.role === 0) {
        return (
            <div style={{ 
                marginBottom: '24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end'
            }}>
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start',
                    marginBottom: '4px'
                }}>
                    <Tooltip title={session.myself.username}>
                        <Text strong style={{ fontSize: '14px', marginRight: '8px' }}>
                            {session.myself.username}
                        </Text>
                    </Tooltip>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        {formatDateTime(message.timestamp)}
                    </Text>
                </div>
                
                <div style={{ 
                    display: 'flex',
                    alignItems: 'flex-start',
                    maxWidth: '80%'
                }}>
                    <div style={{ 
                        backgroundColor: '#1890ff',
                        color: 'white',
                        borderRadius: '18px 0px 18px 18px',
                        padding: '12px 16px',
                        marginRight: '12px',
                        boxShadow: '0 2px 8px rgba(24, 144, 255, 0.15)',
                        wordWrap: 'break-word',
                        wordBreak: 'break-word'
                    }}>
                        <Paragraph style={{ whiteSpace: 'pre-wrap', margin: 0, color: 'white' }}>
                            {message.content}
                        </Paragraph>
                    </div>
                    
                    <Avatar 
                        src={session.myself.avatar}
                        icon={<UserOutlined />}
                        size={40}
                        style={{ 
                            backgroundColor: session.myself.avatar ? 'transparent' : '#1890ff',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                        }} 
                    />
                </div>
            </div>
        );
    }
    else {
        return (
            <div style={{ 
                marginBottom: '24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start'
            }}>
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start',
                    marginBottom: '4px'
                }}>
                    <Tooltip title={session.other.username}>
                        <Text strong style={{ fontSize: '14px', marginRight: '8px' }}>
                            {session.other.username}
                        </Text>
                    </Tooltip>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        {formatDateTime(message.timestamp)}
                    </Text>
                </div>
                
                <div style={{ 
                    display: 'flex',
                    alignItems: 'flex-start',
                    maxWidth: '80%'
                }}>
                    <Avatar 
                        src={session.other.avatar}
                        icon={<UserOutlined />}
                        size={40}
                        style={{ 
                            backgroundColor: session.other.avatar ? 'transparent' : '#52c41a',
                            marginRight: '12px',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                        }} 
                    />
                    
                    <div style={{ 
                        backgroundColor: 'white',
                        borderRadius: '0px 18px 18px 18px',
                        padding: '12px 16px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        border: '1px solid #f0f0f0',
                        wordWrap: 'break-word',
                        wordBreak: 'break-word'
                    }}>
                        <div className="markdown-content">
                            <Paragraph style={{ whiteSpace: 'pre-wrap', margin: 0, color: 'black' }}>
                                <ReactMarkdown
                                    children={message.content}
                                    remarkPlugins={[remarkGfm]}
                                    rehypePlugins={[rehypeHighlight]}
                                />
                            </Paragraph>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}