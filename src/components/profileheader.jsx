import React from "react";
import { Button, Avatar, Typography, Card } from "antd";
import { EditOutlined, UserOutlined, MailOutlined, IdcardOutlined, NumberOutlined } from "@ant-design/icons";

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
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <Avatar 
                    size={120} 
                    icon={<UserOutlined />}
                    src={profile.avatar}
                    style={{ 
                        backgroundColor: profile.avatar ? 'transparent' : '#1890ff',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                    }}
                />
                <Title level={3} style={{ marginTop: 16, marginBottom: 4 }}>
                    {profile.username}
                </Title>
                <Text type="secondary" style={{ fontSize: '16px' }}>
                    {profile.email}
                </Text>
                
                <div style={{ marginTop: '24px' }}>
                    <Button 
                        type="primary" 
                        icon={<EditOutlined />} 
                        onClick={handleEdit}
                        size="large"
                        style={{ 
                            width: '180px',
                            height: '42px',
                            borderRadius: '6px',
                            fontSize: '15px'
                        }}
                    >
                        编辑个人资料
                    </Button>
                </div>
            </div>
        </Card>
    )
}