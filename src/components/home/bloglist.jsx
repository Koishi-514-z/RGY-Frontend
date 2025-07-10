import React from "react";
import { List, Avatar, Typography, Empty, Card, Space, Tag } from "antd";
import { Link, useNavigate } from 'react-router-dom';
import { EyeOutlined, HeartOutlined, MessageOutlined, ClockCircleOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';

const { Text, Title } = Typography;

export default function BlogList({ blogs, emptyText, emptyDescription, emptyButton }) {
    const navigate = useNavigate();

    const customEmpty = (
        <div style={{
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%)',
            borderRadius: '20px',
            padding: '60px 40px',
            textAlign: 'center',
            border: '1px solid rgba(24, 144, 255, 0.1)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '150px',
                height: '150px',
                background: 'rgba(24, 144, 255, 0.05)',
                borderRadius: '50%'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-30px',
                left: '-30px',
                width: '100px',
                height: '100px',
                background: 'rgba(82, 196, 26, 0.05)',
                borderRadius: '50%'
            }} />
            
            <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px',
                    boxShadow: '0 8px 24px rgba(24, 144, 255, 0.3)'
                }}>
                    <MessageOutlined style={{ fontSize: '32px', color: '#fff' }} />
                </div>
                
                <Title level={4} style={{ 
                    margin: '0 0 8px 0',
                    background: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}>
                    {emptyText}
                </Title>
                <Text style={{ 
                    color: '#8c8c8c',
                    fontSize: '14px',
                    display: 'block',
                    marginBottom: '24px',
                    maxWidth: '300px',
                    margin: '0 auto 24px auto'
                }}>
                    {emptyDescription}
                </Text>
                {emptyButton && (
                    <div>
                        {emptyButton}
                    </div>
                )}
            </div>
        </div>
    );

    const handleItemClick = (blogId) => {
        navigate(`/blog/${blogId}`);
    };

    const formatDate = (timestamp) => {
        const now = dayjs();
        const postTime = dayjs(timestamp);
        const diffDays = now.diff(postTime, 'day');
        
        if (diffDays === 0) return '今天';
        if (diffDays === 1) return '昨天';
        if (diffDays < 7) return `${diffDays}天前`;
        return postTime.format('MM-DD');
    };

    return (
        <div style={{ padding: '8px 0' }}>
            <List
                itemLayout="horizontal"
                dataSource={blogs}
                split={false}
                locale={{ emptyText: customEmpty }}
                style={{ 
                    borderRadius: '12px',
                }}
                renderItem={(blog, index) => (
                    <div 
                        key={blog.blogid || index}
                        style={{
                            marginBottom: '16px',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer'
                        }}
                        onClick={() => handleItemClick(blog.blogid)}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <Card
                            hoverable
                            style={{
                                borderRadius: '16px',
                                overflow: 'hidden',
                                border: '1px solid rgba(24, 144, 255, 0.1)',
                                background: 'linear-gradient(135deg, #fafbff 0%, #f0f9ff 100%)',
                                boxShadow: '0 4px 20px rgba(24, 144, 255, 0.08)',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <List.Item style={{ border: 'none', padding: 0 }}>
                                <List.Item.Meta
                                    title={
                                        <div style={{ marginBottom: '8px' }}>
                                            <Title 
                                                level={5} 
                                                style={{ 
                                                    margin: 0,
                                                    fontWeight: '600',
                                                    color: '#262626',
                                                    lineHeight: '1.4',
                                                    fontSize: '16px'
                                                }}
                                                ellipsis={{ rows: 2 }}
                                            >
                                                {blog.title}
                                            </Title>
                                            
                                            <div style={{ 
                                                marginTop: '12px',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}>
                                                <Text style={{ 
                                                    fontSize: '12px', 
                                                    color: '#8c8c8c',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px'
                                                }}>
                                                    <ClockCircleOutlined />
                                                    {formatDate(blog.timestamp)}
                                                </Text>
                                            </div>
                                        </div>
                                    }
                                    description={
                                        <div>
                                            <Text 
                                                style={{ 
                                                    color: '#595959',
                                                    fontSize: '14px',
                                                    lineHeight: '1.6',
                                                    display: 'block',
                                                    marginBottom: '16px'
                                                }}
                                                ellipsis={{ rows: 2 }}
                                            >
                                                {blog.content}
                                            </Text>
                                            
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                paddingTop: '12px',
                                                borderTop: '1px solid rgba(24, 144, 255, 0.08)'
                                            }}>
                                                <Space size={16}>
                                                    <div style={{ 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        gap: '4px',
                                                        color: '#8c8c8c'
                                                    }}>
                                                        <EyeOutlined style={{ fontSize: '14px' }} />
                                                        <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>
                                                            {blog.viewNum}
                                                        </Text>
                                                    </div>
                                                    <div style={{ 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        gap: '4px',
                                                        color: '#8c8c8c'
                                                    }}>
                                                        <HeartOutlined style={{ fontSize: '14px' }} />
                                                        <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>
                                                            {blog.likeNum}
                                                        </Text>
                                                    </div>
                                                    <div style={{ 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        gap: '4px',
                                                        color: '#8c8c8c'
                                                    }}>
                                                        <MessageOutlined style={{ fontSize: '14px' }} />
                                                        <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>
                                                            {blog.replies.length}
                                                        </Text>
                                                    </div>
                                                </Space>
                                                
                                                <div style={{
                                                    background: 'linear-gradient(135deg, rgba(24, 144, 255, 0.1) 0%, rgba(54, 207, 201, 0.1) 100%)',
                                                    borderRadius: '8px',
                                                    padding: '4px 12px',
                                                    fontSize: '12px',
                                                    color: '#1890ff',
                                                    fontWeight: '500'
                                                }}>
                                                    阅读全文
                                                </div>
                                            </div>
                                        </div>
                                    }
                                />
                            </List.Item>
                        </Card>
                    </div>
                )}
            />
        </div>
    );
}