import React, { useState, useEffect } from "react";
import { Card, Space, Typography, Badge, Button, Row, Col, Statistic, Progress, Tag, Tooltip, Avatar } from "antd";
import { FileTextOutlined, HeartOutlined, CommentOutlined, PlusOutlined, EyeOutlined, TrophyOutlined, FireOutlined, CalendarOutlined, UserOutlined, RiseOutlined } from "@ant-design/icons";
import BlogList from "./bloglist";
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

export default function BlogCard({myBlogs, likeBlogs, commentBlogs, profile}) {
    const navigate = useNavigate();
    console.log(myBlogs);

    const handleClick = () => {
        navigate(`/post`);
    }

    const getStats = () => {
        const totalPosts = myBlogs.length;
        const totalLikes = myBlogs.reduce((sum, blog) => sum + blog.likeNum, 0);
        const totalComments = myBlogs.reduce((sum, blog) => sum + blog.replies.length, 0);
        const totalViews = myBlogs.reduce((sum, blog) => sum + blog.browsenum, 0);
        
        return {
            totalPosts,
            totalLikes,
            totalComments,
            totalViews,
            avgLikesPerPost: totalPosts > 0 ? (totalLikes / totalPosts).toFixed(1) : 0,
            avgCommentsPerPost: totalPosts > 0 ? (totalComments / totalPosts).toFixed(1) : 0
        };
    };

    const getLastPostTime = () => {
        if (myBlogs.length === 0) return null;
        const latestBlog = myBlogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
        console.log(latestBlog);
        return new Date(latestBlog.timestamp).toLocaleDateString('zh-CN');
    };

    const getUserLevel = () => {
        const stats = getStats();
        const score = stats.totalPosts * 2 + stats.totalLikes + stats.totalComments * 1.5;
        if(score >= 100) {
            return { level: '活跃达人', color: '#ff4d4f', icon: <FireOutlined /> };
        } 
        if(score >= 50) {
            return { level: '资深用户', color: '#faad14', icon: <TrophyOutlined /> };
        }
        if(score >= 20) {
            return { level: '活跃用户', color: '#52c41a', icon: <RiseOutlined /> };
        }
        return { level: '新手用户', color: '#1890ff', icon: <UserOutlined /> };
    };

    const stats = getStats();
    const lastPostTime = getLastPostTime();
    const userLevel = getUserLevel();
    
    const createBlogButton = (
        <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleClick}
            style={{
                borderRadius: '6px',
                boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)',
                background: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)',
                border: 'none'
            }}
        >
            发布新帖
        </Button>
    );

    const UserInfoCard = () => (
        <Card 
            style={{ 
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                borderRadius: '12px',
                marginBottom: '24px',
                background: 'linear-gradient(135deg, #f0f9ff 0%,rgb(235, 249, 255) 100%)'
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
                        <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(255,255,255,0.6)', borderRadius: '6px' }}>
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
    );

    const InsightCard = () => (
        <Card 
            title={
                <Space>
                    <TrophyOutlined style={{ color: '#faad14' }} />
                    <Text strong>数据洞察</Text>
                </Space>
            }
            style={{ 
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                borderRadius: '12px',
                marginBottom: '24px'
            }}
        >
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                    <div style={{ 
                        padding: '16px', 
                        background: 'linear-gradient(135deg, #fff7e6 0%, #fff2e8 100%)',
                        borderRadius: '8px',
                        border: '1px solid #ffec3d20'
                    }}>
                        <Text strong style={{ color: '#faad14', display: 'block', marginBottom: '8px' }}>
                            平均互动数据
                        </Text>
                        <Space direction="vertical" style={{ width: '100%' }} size={4}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Text type="secondary">每帖平均点赞:</Text>
                                <Text strong>{stats.avgLikesPerPost}</Text>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Text type="secondary">每帖平均评论:</Text>
                                <Text strong>{stats.avgCommentsPerPost}</Text>
                            </div>
                        </Space>
                    </div>
                </Col>
                
                <Col xs={24} sm={12}>
                    <div style={{ 
                        padding: '16px', 
                        background: 'linear-gradient(135deg, #f6ffed 0%, #f0fff4 100%)',
                        borderRadius: '8px',
                        border: '1px solid #52c41a20'
                    }}>
                        <Text strong style={{ color: '#52c41a', display: 'block', marginBottom: '8px' }}>
                            活跃度分析
                        </Text>
                        <div style={{ marginBottom: '8px' }}>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                社区参与度
                            </Text>
                            <Progress 
                                percent={Math.min(100, (stats.totalPosts + likeBlogs.length + commentBlogs.length) * 2)} 
                                strokeColor="#52c41a"
                                size="small"
                                style={{ marginTop: '4px' }}
                            />
                        </div>
                        <Text type="secondary" style={{ fontSize: '11px' }}>
                            基于发布、点赞、评论综合计算
                        </Text>
                    </div>
                </Col>
            </Row>
        </Card>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
            <UserInfoCard />

            {stats.totalPosts > 0 && <InsightCard />}

            <Card 
                title={
                    <div style={{ padding: '8px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Space>
                            <FileTextOutlined style={{ 
                                fontSize: '20px', 
                                color: '#1890ff',
                                background: 'rgba(24, 144, 255, 0.1)',
                                padding: '6px',
                                borderRadius: '6px'
                            }} />
                            <Title level={4} style={{ margin: 0 }}> 我发布的帖子 </Title>
                            <Badge 
                                count={myBlogs.length} 
                                style={{ 
                                    backgroundColor: '#1890ff',
                                    boxShadow: '0 0 0 1px #fff'
                                }} 
                            />
                        </Space>
                        {stats.totalPosts > 0 && (
                            <Tooltip title={`平均每帖获得 ${stats.avgLikesPerPost} 个赞，${stats.avgCommentsPerPost} 条评论`}>
                                <Space style={{ 
                                    background: 'rgba(24, 144, 255, 0.1)',
                                    padding: '4px 8px',
                                    borderRadius: '12px',
                                    fontSize: '12px'
                                }}>
                                    <Text style={{ color: '#1890ff', fontSize: '12px' }}>
                                        互动率: {((parseFloat(stats.avgLikesPerPost) + parseFloat(stats.avgCommentsPerPost)) / 2).toFixed(1)}
                                    </Text>
                                </Space>
                            </Tooltip>
                        )}
                    </div>
                }
                extra={createBlogButton}
                style={{ 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    marginBottom: '24px'
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
                    <div style={{ padding: '8px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Space>
                            <HeartOutlined style={{ 
                                fontSize: '20px', 
                                color: '#ff4d4f',
                                background: 'rgba(255, 77, 79, 0.1)',
                                padding: '6px',
                                borderRadius: '6px'
                            }} />
                            <Title level={4} style={{ margin: 0, color: '#cf1322' }}> 我点赞的帖子 </Title>
                            <Badge 
                                count={likeBlogs.length} 
                                style={{ 
                                    backgroundColor: '#ff4d4f',
                                    boxShadow: '0 0 0 1px #fff'
                                }} 
                            />
                        </Space>
                        {likeBlogs.length > 0 && (
                            <Text style={{ 
                                background: 'rgba(255, 77, 79, 0.1)',
                                padding: '4px 8px',
                                borderRadius: '12px',
                                color: '#ff4d4f',
                                fontSize: '12px'
                            }}>
                                品味很棒！
                            </Text>
                        )}
                    </div>
                }
                style={{ 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    marginBottom: '24px'
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
                    <div style={{ padding: '8px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Space>
                            <CommentOutlined style={{ 
                                fontSize: '20px', 
                                color: '#52c41a',
                                background: 'rgba(82, 196, 26, 0.1)',
                                padding: '6px',
                                borderRadius: '6px'
                            }} />
                            <Title level={4} style={{ margin: 0, color: '#389e0d' }}> 我评论的帖子 </Title>
                            <Badge 
                                count={commentBlogs.length} 
                                style={{ 
                                    backgroundColor: '#52c41a',
                                    boxShadow: '0 0 0 1px #fff'
                                }} 
                            />
                        </Space>
                        {commentBlogs.length > 0 && (
                            <Text style={{ 
                                background: 'rgba(82, 196, 26, 0.1)',
                                padding: '4px 8px',
                                borderRadius: '12px',
                                color: '#52c41a',
                                fontSize: '12px'
                            }}>
                                活跃参与者
                            </Text>
                        )}
                    </div>
                }
                style={{ 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    borderRadius: '12px',
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