import React from "react";
import { Button, Avatar, Descriptions, Typography, Card, Row, Col, Divider, Space, Tag } from "antd";
import { EditOutlined, UserOutlined, MailOutlined, IdcardOutlined, NumberOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function ProfileView({profile}) {
    const InfoItem = ({ icon, label, value, tag, tagColor }) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ 
                width: '32px', 
                display: 'flex', 
                justifyContent: 'center',
                marginRight: '12px'
            }}>
                {icon}
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ color: '#8c8c8c', fontSize: '14px', marginBottom: '4px' }}>
                    {label}
                </div>
                <div style={{ fontSize: '16px', fontWeight: 500 }}>
                    {value || '-'}
                </div>
            </div>
            {tag && (
                <Tag color={tagColor || "blue"} style={{ marginLeft: 'auto' }}>
                    {tag}
                </Tag>
            )}
        </div>
    );

    return (
        <Card 
            title={
                <div style={{ padding: '8px 0' }}>
                    <Space>
                        <IdcardOutlined style={{ fontSize: '18px', color: '#1890ff' }} />
                        <Title level={4} style={{ margin: 0 }}>个人信息</Title>
                    </Space>
                </div>
            }
            style={{ 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                borderRadius: '12px',
            }}
        >
            <Row gutter={[0, 16]}>
                <Col span={24}>
                    <InfoItem 
                        icon={<IdcardOutlined style={{ color: '#1890ff' }} />}
                        label="账户ID" 
                        value={profile.userid} 
                    />
                </Col>
                <Col span={24}>
                    <Divider style={{ margin: '4px 0' }} />
                </Col>

                <Col span={24}>
                    <InfoItem 
                        icon={<UserOutlined style={{ color: '#1890ff' }} />}
                        label="用户名" 
                        value={profile.username} 
                    />
                </Col>
                <Col span={24}>
                    <Divider style={{ margin: '4px 0' }} />
                </Col>
                
                <Col span={24}>
                    <InfoItem 
                        icon={<MailOutlined style={{ color: '#1890ff' }} />}
                        label="电子邮箱" 
                        value={profile.email} 
                        tag="已验证"
                        tagColor="success"
                    />
                </Col>
            </Row>
        </Card>
    );
}