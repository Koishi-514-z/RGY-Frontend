import React from "react";
import { Button, Avatar, Typography, Card, Row, Col, Space } from "antd";
import { EditOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function ProfileHeader({profile, setEditting}) {
    const handleEdit = () => {
        setEditting(true);
    };

    return (
        <Card 
            style={{ 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                borderRadius: '12px',
                overflow: 'hidden',
                marginBottom: '24px'
            }}
        >
            <Row align="middle" gutter={[24, 0]}>
                <Col xs={24} sm={8} md={4} style={{ textAlign: 'center' }}>
                    <Avatar 
                        size={120} 
                        icon={<UserOutlined />}
                        src={profile.avatar}
                        style={{ 
                            backgroundColor: profile.avatar ? 'transparent' : '#1890ff',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                        }}
                    />
                </Col>

                <Col xs={24} sm={12} md={18}>
                    <div style={{ padding: '8px 0' }}>
                        <Title level={3} style={{ marginBottom: 12 }}>
                            {profile.username}
                        </Title>
                        
                        <Space direction="vertical" size={12} style={{ marginBottom: 20 }}>
                            <Space>
                                <MailOutlined style={{ color: '#1890ff' }} />
                                <Text style={{ fontSize: '16px' }}>{profile.email}</Text>
                            </Space>
                        </Space>
                    </div>
                </Col>
                <Col xs={24} sm={4} md={2}>
                    <Button 
                        type="primary" 
                        icon={<EditOutlined />} 
                        onClick={handleEdit}
                        size="large"
                        style={{ 
                            width: '42px',
                            height: '42px',
                            borderRadius: '6px',
                            fontSize: '15px'
                        }}
                    />
                </Col>
            </Row>
        </Card>
    )
}