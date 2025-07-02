import React, { useState, useEffect } from "react";
import { Row, Col, Typography, Card, Space, Divider } from "antd";
import { HeartOutlined, SafetyOutlined, TeamOutlined, StarOutlined } from "@ant-design/icons";
import LoginForm from "../components/loginform";
import ParticleBackground from "../components/layout/particlebackground";
import FloatingElements from "../components/layout/floatingelements";
import FeatureCard from "../components/featurecard";

const { Title, Text } = Typography;

export default function LoginPage() {
    const features = [
        {
            icon: <HeartOutlined />,
            title: "心理健康",
            description: "专业的心理健康服务",
            color: "#ff7875"
        },
        {
            icon: <TeamOutlined />,
            title: "互助社区",
            description: "温暖的校园互助环境",
            color: "#1890ff"
        },
        {
            icon: <SafetyOutlined />,
            title: "隐私保护",
            description: "严格保护用户隐私",
            color: "#52c41a"
        },
        {
            icon: <StarOutlined />,
            title: "专业服务",
            description: "优质的专业服务体验",
            color: "#faad14"
        }
    ];

    return (
        <div style={{ 
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <ParticleBackground />
            <FloatingElements />
            
            <Row justify="center" align="middle" style={{ minHeight: '100vh', position: 'relative', zIndex: 2 }}>
                <Col xs={22} sm={20} md={18} lg={16} xl={14}>
                    <Row gutter={[48, 32]} align="middle">
                        <Col xs={24} lg={12}>
                            <div style={{ textAlign: 'center', color: '#fff', marginBottom: '40px' }}>
                                <div style={{
                                    fontSize: '48px',
                                    marginBottom: '16px',
                                    background: 'linear-gradient(45deg, #fff 0%, #e6f7ff 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text'
                                }}>
                                    🌟
                                </div>
                                <Title level={1} style={{ 
                                    color: '#fff', 
                                    marginBottom: '8px',
                                    fontSize: '32px',
                                    fontWeight: 700,
                                    textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                }}>
                                    校园心理健康
                                </Title>
                                <Title level={2} style={{ 
                                    color: '#e6f7ff', 
                                    marginBottom: '16px',
                                    fontSize: '24px',
                                    fontWeight: 400
                                }}>
                                    互助社区
                                </Title>
                                <Text style={{ 
                                    fontSize: '16px', 
                                    color: 'rgba(255,255,255,0.8)',
                                    lineHeight: 1.6,
                                    display: 'block',
                                    marginBottom: '24px'
                                }}>
                                    关注心理健康，传递温暖力量
                                    <br />
                                    让每一颗心都能被理解和关爱
                                </Text>
                            </div>
                            
                            <div>
                                <Row gutter={[16, 16]}>
                                    {features.map((feature, index) => (
                                        <Col xs={12} key={index}>
                                            <FeatureCard {...feature} />
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        </Col>
                        
                        <Col xs={24} lg={12}>
                            <Card 
                                style={{ 
                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                                    borderRadius: '16px',
                                    border: 'none',
                                    background: 'rgba(255,255,255,0.95)',
                                    backdropFilter: 'blur(20px)'
                                }}
                            >
                                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                                    <div style={{
                                        width: '64px',
                                        height: '64px',
                                        background: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)',
                                        borderRadius: '16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 16px',
                                        boxShadow: '0 4px 12px rgba(24,144,255,0.3)'
                                    }}>
                                        <HeartOutlined style={{ fontSize: '28px', color: '#fff' }} />
                                    </div>
                                    <Title level={2} style={{ 
                                        margin: '0 0 8px 0',
                                        color: '#262626',
                                        fontSize: '24px',
                                        fontWeight: 600
                                    }}>
                                        欢迎回来
                                    </Title>
                                    <Text type="secondary" style={{ fontSize: '14px' }}>
                                        登录以继续您的心理健康之旅
                                    </Text>
                                </div>
                                
                                <LoginForm />
                                
                                <Divider style={{ margin: '24px 0' }}>
                                    <Text type="secondary" style={{ fontSize: '12px' }}>
                                        安全登录
                                    </Text>
                                </Divider>
                                
                                <div style={{ textAlign: 'center' }}>
                                    <Space direction="vertical" size={8}>
                                        <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>
                                            登录即表示您同意我们的服务条款
                                        </Text>
                                        <Space size={16}>
                                            <Text style={{ fontSize: '11px', color: '#bfbfbf' }}>隐私政策</Text>
                                            <Text style={{ fontSize: '11px', color: '#bfbfbf' }}>用户协议</Text>
                                            <Text style={{ fontSize: '11px', color: '#bfbfbf' }}>帮助中心</Text>
                                        </Space>
                                    </Space>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
            
            <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                textAlign: 'center',
                zIndex: 2
            }}>
                <Text style={{ 
                    fontSize: '12px', 
                    color: 'rgba(255,255,255,0.6)',
                    textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                }}>
                    © 2025 校园心理健康互助社区 - 关爱每一颗心
                </Text>
            </div>
        </div>
    );
}