import React, { useState, useEffect } from "react";
import { Row, Col, Typography, Card, Space, Divider } from "antd";
import { UserAddOutlined, HeartOutlined, SafetyOutlined, TeamOutlined, CheckCircleOutlined } from "@ant-design/icons";
import RegisterForm from "../components/registerform";
import ParticleBackground from "../components/layout/particlebackground";
import FloatingElements from "../components/layout/floatingelements";
import FeatureCard from "../components/featurecard";

const { Title, Text } = Typography;

export default function RegisterPage() {
    const benefits = [
        {
            icon: <HeartOutlined />,
            title: "专业支持",
            description: "获得专业心理健康指导",
            color: "#ff7875"
        },
        {
            icon: <TeamOutlined />,
            title: "社区互助",
            description: "加入温暖的互助社区",
            color: "#1890ff"
        },
        {
            icon: <SafetyOutlined />,
            title: "隐私安全",
            description: "严格保护个人隐私",
            color: "#52c41a"
        },
        {
            icon: <CheckCircleOutlined />,
            title: "持续成长",
            description: "记录并跟踪成长历程",
            color: "#faad14"
        }
    ];

    return (
        <div style={{ 
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #52c41a 0%, #1890ff 100%)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <ParticleBackground />
            <FloatingElements />
            
            <Row justify="center" align="middle" style={{ minHeight: '100vh', position: 'relative', zIndex: 2 }}>
                <Col xs={22} sm={20} md={18} lg={16} xl={14}>
                    <Row gutter={[48, 32]} align="middle">
                        <Col xs={24} lg={11}>
                            <div style={{ textAlign: 'center', color: '#fff', marginBottom: '32px' }}>
                                <div style={{
                                    fontSize: '40px',
                                    marginBottom: '16px',
                                    background: 'linear-gradient(45deg, #fff 0%, #e6f7ff 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text'
                                }}>
                                    🚀
                                </div>
                                <Title level={1} style={{ 
                                    color: '#fff', 
                                    marginBottom: '8px',
                                    fontSize: '28px',
                                    fontWeight: 700,
                                    textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                }}>
                                    开启您的
                                </Title>
                                <Title level={2} style={{ 
                                    color: '#e6f7ff', 
                                    marginBottom: '16px',
                                    fontSize: '22px',
                                    fontWeight: 400
                                }}>
                                    心理健康之旅
                                </Title>
                                <Text style={{ 
                                    fontSize: '15px', 
                                    color: 'rgba(255,255,255,0.8)',
                                    lineHeight: 1.6,
                                    display: 'block',
                                    marginBottom: '24px'
                                }}>
                                    加入我们的社区，与志同道合的伙伴一起
                                    <br />
                                    关注心理健康，共同成长进步
                                </Text>
                            </div>
                            
                            <Row gutter={[12, 12]}>
                                {benefits.map((benefit, index) => (
                                    <Col xs={12} key={index}>
                                        <FeatureCard {...benefit} />
                                    </Col>
                                ))}
                            </Row>
                        </Col>
                        
                        <Col xs={24} lg={13}>
                            <Card 
                                style={{ 
                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                                    borderRadius: '16px',
                                    border: 'none',
                                    background: 'rgba(255,255,255,0.95)',
                                    backdropFilter: 'blur(20px)'
                                }}
                                bodyStyle={{ padding: '36px 32px' }}
                            >
                                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                                    <div style={{
                                        width: '56px',
                                        height: '56px',
                                        background: 'linear-gradient(135deg, #52c41a 0%, #1890ff 100%)',
                                        borderRadius: '14px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 16px',
                                        boxShadow: '0 4px 12px rgba(82,196,26,0.3)'
                                    }}>
                                        <UserAddOutlined style={{ fontSize: '24px', color: '#fff' }} />
                                    </div>
                                    <Title level={2} style={{ 
                                        margin: '0 0 8px 0',
                                        color: '#262626',
                                        fontSize: '22px',
                                        fontWeight: 600
                                    }}>
                                        创建新账户
                                    </Title>
                                    <Text type="secondary" style={{ fontSize: '13px' }}>
                                        填写信息，加入我们的健康社区
                                    </Text>
                                </div>
                                
                                <RegisterForm />
                                
                                <Divider style={{ margin: '20px 0' }}>
                                    <Text type="secondary" style={{ fontSize: '12px' }}>
                                        安全注册
                                    </Text>
                                </Divider>
                                
                                <div style={{ textAlign: 'center' }}>
                                    <Space direction="vertical" size={6}>
                                        <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>
                                            注册即表示您同意我们的服务条款和隐私政策
                                        </Text>
                                        <Space size={16}>
                                            <Text style={{ fontSize: '11px', color: '#bfbfbf', cursor: 'pointer' }}>服务条款</Text>
                                            <Text style={{ fontSize: '11px', color: '#bfbfbf', cursor: 'pointer' }}>隐私政策</Text>
                                            <Text style={{ fontSize: '11px', color: '#bfbfbf', cursor: 'pointer' }}>社区规范</Text>
                                        </Space>
                                        <div style={{ marginTop: '12px' }}>
                                            <Text style={{ fontSize: '12px', color: '#595959' }}>
                                                已有账户？
                                                <a href="/login" style={{ color: '#1890ff', marginLeft: '4px' }}>
                                                    立即登录
                                                </a>
                                            </Text>
                                        </div>
                                    </Space>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
            
            <div style={{
                position: 'absolute',
                bottom: '16px',
                left: '50%',
                transform: 'translateX(-50%)',
                textAlign: 'center',
                zIndex: 2
            }}>
                <Text style={{ 
                    fontSize: '11px', 
                    color: 'rgba(255,255,255,0.6)',
                    textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                }}>
                    © 2025 校园心理健康互助社区 - 共建温暖社区
                </Text>
            </div>
        </div>
    );
}