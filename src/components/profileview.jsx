import React, { useState } from "react";
import { Button, Avatar, Descriptions, Typography, Card } from "antd";
import { EyeOutlined, EyeInvisibleOutlined, EditOutlined, UserOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function ProfileView({profile, setEditting}) {
    const [show, setShow] = useState(false);

    const handleEdit = () => {
        setEditting(true);
    };

    const handleClick = () => {
        setShow(!show);
    }

    return (
        <div>
            <>
                <Avatar 
                    size={120} 
                    icon={<UserOutlined />}
                    src={profile.avatar}
                    style={{ 
                        backgroundColor: '#1890ff',
                        marginBottom: 12
                    }}
                />
                <Title level={4} style={{ marginTop: 16, marginBottom: 4 }}>{profile.username}</Title>
            </>
            <Button 
                type="primary" 
                icon={<EditOutlined />} 
                onClick={handleEdit}
                style={{ width: '100%' }}
            >
                Edit
            </Button>
            <>
                <Card 
                    title={<Title level={4}> 个人信息 </Title>} 
                    style={{ 
                        boxShadow: '0 2px 8px rgba(0,0,0,0.09)',
                        borderRadius: 8
                    }}
                >
                    <Descriptions bordered column={1}>
                        <Descriptions.Item label="用户名"> {profile.username} </Descriptions.Item>
                        <Descriptions.Item label="电子邮箱"> {profile.email} </Descriptions.Item>
                    </Descriptions>
                </Card>
                
                <Card 
                    title={<Title level={4}> 账户安全 </Title>} 
                    style={{ 
                        marginTop: 24,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.09)',
                        borderRadius: 8
                    }}
                >
                    <Descriptions bordered column={1}>
                        <Descriptions.Item label="账户ID"> {profile.userid} </Descriptions.Item>
                        <Descriptions.Item label="密码"> 
                            <Text> {show ? profile.password : "*************"} </Text>
                            <Button 
                                type="default"
                                onClick={handleClick}
                                icon={show ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                                style={{
                                    borderRadius: 4,
                                    boxShadow: '0 2px 0 rgba(0,0,0,0.045)',
                                    fontWeight: 500,
                                    height: 38
                                }}
                            /> 
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
            </>
        </div>
    );
}