import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Typography, Button, Space, Card, Result, Progress } from "antd";
import { LoginOutlined } from '@ant-design/icons';

const { Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

export default function ForbiddenPage() {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(5);
    
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prevCount => {
                if (prevCount <= 1) {
                    clearInterval(timer);
                    navigate('/login');
                    return 0;
                }
                return prevCount - 1;
            });
        }, 1000);
        
        return () => clearInterval(timer); 
    }, [navigate]);

    return (
        <Layout style={{ minHeight: "100vh", background: '#f5f5f5' }}>
            <Content style={{ 
                padding: "40px 24px",
                maxWidth: 800, 
                margin: '0 auto', 
                width: '100%'
            }}>
                <Card 
                    style={{ 
                        borderRadius: 12,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        overflow: 'hidden'
                    }}
                    bodyStyle={{ padding: '32px 24px' }}
                >
                    <Result
                        status="404"
                        title={<Title style={{ margin: 0, fontSize: 64 }}>403 Forbidden</Title>}
                        subTitle={
                            <Paragraph style={{ fontSize: 18, marginBottom: 32, color: '#555' }}>
                                抱歉，您无权访问该页面
                            </Paragraph>
                        }
                        extra={
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
                                <Space size="large">
                                    <Button type="primary" icon={<LoginOutlined />} size="large" onClick={() => navigate('/login')}>
                                        返回登录页
                                    </Button>
                                </Space>
                                
                                <div style={{ width: '100%', maxWidth: 300, marginTop: 16 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                        <Text type="secondary">即将自动跳转到登录页</Text>
                                        <Text strong>{countdown}秒</Text>
                                    </div>
                                    <Progress 
                                        percent={(countdown/5)*100} 
                                        showInfo={false} 
                                        status="active"
                                        strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }} 
                                    />
                                </div>
                            </div>
                        }
                    />
                </Card>
            </Content>
            
            <Footer style={{ textAlign: 'center', background: 'transparent' }}>
                <Text type="secondary"> Koishi GPT &copy; {new Date().getFullYear()}</Text>
            </Footer>
        </Layout>
    );
}