import React from "react";
import { Row, Col, Typography, Card } from "antd";
import RegisterForm from "../components/registerform";

const { Title, Text } = Typography;

export default function RegisterPage() {
    return (
        <div>
            <Row justify="center" align="middle" style={{ minHeight: '100vh', background: '#f0f2f5' }}>
                <Col xs={22} sm={20} md={16} lg={12} xl={10}>
                    <Card 
                        style={{ 
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                            borderRadius: '12px',
                        }}
                    >
                        <div style={{ textAlign: 'center', marginBottom: 24 }}>
                            <Title level={2} style={{ margin: '8px 0' }}> 用户注册 </Title>
                            <Text type="secondary"> 创建您的账号以访问系统 </Text>
                        </div>
                        <RegisterForm />
                    </Card>
                </Col>
            </Row>
        </div>
    );
}