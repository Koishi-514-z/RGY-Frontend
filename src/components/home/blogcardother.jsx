import React from "react";
import { Card, Space, Typography, Badge, Row, Col, Statistic, Tag, Avatar } from "antd";
import { FileTextOutlined, HeartOutlined, CommentOutlined, EyeOutlined, TrophyOutlined, FireOutlined, CalendarOutlined, UserOutlined, RiseOutlined } from "@ant-design/icons";
import BlogList from "./bloglist";

const { Title, Text } = Typography;

export default function BlogCardOther({myBlogs, profile, loading}) {

    const getStats = () => {
        const totalPosts = myBlogs.length;
        const totalLikes = myBlogs.reduce((sum, blog) => sum + blog.likeNum, 0);
        const totalComments = myBlogs.reduce((sum, blog) => sum + blog.replies.length, 0);
        const totalViews = myBlogs.reduce((sum, blog) => sum + blog.browsenum, 0);
        
        return {
            totalPosts,
            totalLikes,
            totalComments,
            totalViews
        };
    };

    const getLastPostTime = () => {
        if (myBlogs.length === 0) return null;
        const latestBlog = myBlogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
        return new Date(latestBlog.timestamp).toLocaleDateString('zh-CN');
    };

    const getUserLevel = () => {
        if(profile?.level >= 30) {
            return { level: '活跃达人', color: '#ff4d4f', icon: <FireOutlined /> };
        } 
        if(profile?.level >= 20) {
            return { level: '资深用户', color: '#faad14', icon: <TrophyOutlined /> };
        }
        if(profile?.level >= 10) {
            return { level: '活跃用户', color: '#52c41a', icon: <RiseOutlined /> };
        }
        return { level: '新手用户', color: '#1890ff', icon: <UserOutlined /> };
    };

    const stats = getStats();
    const lastPostTime = getLastPostTime();
    const userLevel = getUserLevel();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Card 
                style={{ 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%)'
                }}
            >
                <Row align="middle" gutter={[24, 16]}>
                    <Col xs={24} sm={8} style={{ textAlign: 'center' }}>
                        <Avatar 
                            size={64} 
                            src={profile ? profile.avatar : undefined} 
                            icon={<UserOutlined />}
                            style={{ 
                                backgroundColor: '#1890ff',
                                marginBottom: '12px',
                                border: '3px solid #fff',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                            }}
                        />
                        <div>
                            <Text strong style={{ fontSize: '16px', display: 'block' }}>
                                {profile ? profile.username : '用户'}
                            </Text>
                            <Tag 
                                icon={userLevel.icon} 
                                color={userLevel.color}
                                style={{ marginTop: '8px' }}
                            >
                                {userLevel.level}
                            </Tag>
                        </div>
                    </Col>
                    
                    <Col xs={24} sm={16}>
                        <Row gutter={[16, 16]}>
                            <Col xs={12} sm={6}>
                                <Statistic
                                    title="发布帖子"
                                    value={stats.totalPosts}
                                    prefix={<FileTextOutlined style={{ color: '#1890ff' }} />}
                                    valueStyle={{ color: '#1890ff', fontSize: '18px' }}
                                />
                            </Col>
                            <Col xs={12} sm={6}>
                                <Statistic
                                    title="获得点赞"
                                    value={stats.totalLikes}
                                    prefix={<HeartOutlined style={{ color: '#ff4d4f' }} />}
                                    valueStyle={{ color: '#ff4d4f', fontSize: '18px' }}
                                />
                            </Col>
                            <Col xs={12} sm={6}>
                                <Statistic
                                    title="收到评论"
                                    value={stats.totalComments}
                                    prefix={<CommentOutlined style={{ color: '#52c41a' }} />}
                                    valueStyle={{ color: '#52c41a', fontSize: '18px' }}
                                />
                            </Col>
                            <Col xs={12} sm={6}>
                                <Statistic
                                    title="总浏览量"
                                    value={stats.totalViews}
                                    prefix={<EyeOutlined style={{ color: '#faad14' }} />}
                                    valueStyle={{ color: '#faad14', fontSize: '18px' }}
                                />
                            </Col>
                        </Row>
                        
                        {lastPostTime && (
                            <div style={{ 
                                marginTop: '16px', 
                                padding: '12px', 
                                background: 'rgba(255,255,255,0.6)', 
                                borderRadius: '6px' 
                            }}>
                                <Space>
                                    <CalendarOutlined style={{ color: '#8c8c8c' }} />
                                    <Text type="secondary" style={{ fontSize: '13px' }}>
                                        最近发布: {lastPostTime}
                                    </Text>
                                </Space>
                            </div>
                        )}
                    </Col>
                </Row>
            </Card>

            <Card 
                title={
                    <Space>
                        <FileTextOutlined style={{ 
                            fontSize: '20px', 
                            color: '#1890ff',
                            background: 'rgba(24, 144, 255, 0.1)',
                            padding: '6px',
                            borderRadius: '6px'
                        }} />
                        <Title level={4} style={{ margin: 0 }}>TA的帖子</Title>
                        <Badge 
                            count={myBlogs.length} 
                            style={{ 
                                backgroundColor: '#1890ff',
                                boxShadow: '0 0 0 1px #fff'
                            }} 
                        />
                    </Space>
                }
                style={{ 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    borderRadius: '12px',
                    overflow: 'hidden'
                }}
            >
                <BlogList 
                    blogs={myBlogs} 
                    emptyText="该用户还没有发布过帖子"
                    emptyDescription="还没有分享任何内容"
                />
            </Card>
        </div>
    );
}