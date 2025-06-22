import React from "react";
import { Row, Col, Typography, Card } from "antd";
import LoginForm from "../components/loginform";

const { Title, Text } = Typography;

export default function LoginPage() {
    return (
        <div>
            <Row justify="center" align="middle" style={{ minHeight: '100vh', background: '#f0f2f5' }}>
                <Col xs={22} sm={16} md={12} lg={8} xl={6}>
                    <Card 
                        style={{ 
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                            borderRadius: '12px',
                        }}
                    >
                        <div style={{ textAlign: 'center', marginBottom: 24 }}>
                            <Title level={2} style={{ margin: '8px 0' }}>欢迎登录</Title>
                            <Text type="secondary">登录以继续访问系统</Text>
                        </div>
                        <LoginForm />
                    </Card>
                </Col>
            </Row>
        </div>
    )
}