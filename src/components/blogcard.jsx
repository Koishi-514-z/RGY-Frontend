import React, { useState, useEffect } from "react";
import { Card, Space, Typography, Badge, Button } from "antd";
import { FileTextOutlined, HeartOutlined, CommentOutlined, PlusOutlined } from "@ant-design/icons";
import BlogList from "./bloglist";
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

export default function BlogCard({myBlogs, likeBlogs, commentBlogs}) {
    console.log(myBlogs);

    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/community`);
    }
    
    const createBlogButton = (
        <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleClick}
            style={{
                borderRadius: '6px',
                boxShadow: '0 2px 0 rgba(0,0,0,0.045)'
            }}
        >
            发布新帖
        </Button>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Card 
                title={
                    <div style={{ padding: '8px 0', display: 'flex', alignItems: 'center' }}>
                        <Space>
                            <FileTextOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
                            <Title level={4} style={{ margin: 0 }}> 我发布的帖子 </Title>
                        </Space>
                        <Badge 
                            count={myBlogs.length} 
                            style={{ 
                                marginLeft: '12px', 
                                backgroundColor: '#1890ff',
                                boxShadow: '0 0 0 1px #fff'
                            }} 
                        />
                    </div>
                }
                extra={createBlogButton}
                style={{ 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    borderRadius: '0px',
                    overflow: 'hidden',
                }}
            >
                <BlogList 
                    blogs={myBlogs} 
                    emptyText="您还没有发布过帖子"
                    emptyDescription="分享您的想法和经历，与社区成员互动"
                    emptyButton={createBlogButton}
                />
            </Card>

            <Card 
                title={
                    <div style={{ padding: '8px 0', display: 'flex', alignItems: 'center' }}>
                        <Space>
                            <HeartOutlined style={{ fontSize: '20px', color: '#ff4d4f' }} />
                            <Title level={4} style={{ margin: 0, color: '#cf1322' }}> 我点赞的帖子 </Title>
                        </Space>
                        <Badge 
                            count={likeBlogs.length} 
                            style={{ 
                                marginLeft: '12px', 
                                backgroundColor: '#ff4d4f',
                                boxShadow: '0 0 0 1px #fff'
                            }} 
                        />
                    </div>
                }
                style={{ 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    borderRadius: '0px',
                    overflow: 'hidden',
                }}
            >
                <BlogList 
                    blogs={likeBlogs} 
                    emptyText="您还没有点赞过帖子"
                    emptyDescription="浏览社区并为您喜欢的内容点赞"
                />
            </Card>

            <Card 
                title={
                    <div style={{ padding: '8px 0', display: 'flex', alignItems: 'center' }}>
                        <Space>
                            <CommentOutlined style={{ fontSize: '20px', color: '#52c41a' }} />
                            <Title level={4} style={{ margin: 0, color: '#389e0d' }}> 我评论的帖子 </Title>
                        </Space>
                        <Badge 
                            count={commentBlogs.length} 
                            style={{ 
                                marginLeft: '12px', 
                                backgroundColor: '#52c41a',
                                boxShadow: '0 0 0 1px #fff'
                            }} 
                        />
                    </div>
                }
                style={{ 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    borderRadius: '0px',
                    overflow: 'hidden',
                }}
            >
                <BlogList 
                    blogs={commentBlogs} 
                    emptyText="您还没有评论过帖子"
                    emptyDescription="参与讨论，分享您的观点和反馈"
                />
            </Card>
        </div>
    );
}