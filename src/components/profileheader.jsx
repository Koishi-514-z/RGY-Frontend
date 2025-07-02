import React from "react";
import { Button, Avatar, Typography, Card, Row, Col, Space, App } from "antd";
import { EditOutlined, UserOutlined, MailOutlined, RobotOutlined } from "@ant-design/icons";
import HomeTabs from "./hometabs";
import { useNavigate } from "react-router-dom";
import { getSessionid, createSession } from "../service/chat";

const { Title, Text } = Typography;

export default function ProfileHeader({profile, tabKey, setTabKey, id}) {
    const navigate = useNavigate();
    const { message } = App.useApp();

    const handleEdit = () => {
        setTabKey(3);
    };

    const handleAIChat = () => {
        navigate(`/AIassistant`);
    }

    const handleClick = async () => {
        if(!id) {
            navigate(`/chat`);
            return;
        }   
        let sessionid = await getSessionid(id);
        if(!sessionid) {
            sessionid = await createSession(id);
            if(!sessionid) {
                message.error('创建会话失败，请检查网络');
                return;
            }
        }
        navigate(`/chat/${sessionid}`)
    }

    const emptyText = '这个家伙很懒，什么也没有留下';

    return (
        <Card 
            style={{ 
                borderRadius: '0px',
                overflow: 'hidden',
                marginBottom: '24px'
            }}
        >
            <Row align="middle" gutter={[24, 24]}>
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

                <Col xs={24} sm={10} md={15}>
                    <div style={{ padding: '8px 0' }}>
                        <Title level={3} style={{ marginBottom: 12 }}>
                            {profile.username}
                        </Title>
                        
                        <Space direction="vertical" size={12} style={{ marginBottom: 20 }}>
                            <Space>
                                <Text style={{ fontSize: '14px' }}>{profile.note ? profile.note : emptyText}</Text>
                            </Space>
                        </Space>
                    </div>
                </Col>
                <Col xs={24} sm={2} md={2}>
                    <Button 
                        icon={<MailOutlined />} 
                        onClick={handleClick}
                        size="large"
                        style={{ 
                            width: '64px',
                            height: '42px',
                            borderRadius: '6px',
                            fontSize: '15px'
                        }}
                    />
                </Col>
                <Col xs={24} sm={2} md={1}>
                    {!id && 
                        <Button 
                            icon={<RobotOutlined />} 
                            onClick={handleAIChat}
                            size="large"
                            style={{ 
                                width: '42px',
                                height: '42px',
                                borderRadius: '6px',
                                fontSize: '15px'
                            }}
                        />}
                </Col>
                <Col xs={24} sm={2} md={1}>
                    {!id && 
                        <Button 
                            icon={<EditOutlined />} 
                            onClick={handleEdit}
                            size="large"
                            style={{ 
                                width: '42px',
                                height: '42px',
                                borderRadius: '6px',
                                fontSize: '15px'
                            }}
                        />}
                </Col>
                <Col span={24}>
                    <HomeTabs tabKey={tabKey} setTabKey={setTabKey} id={id} />
                </Col>
            </Row>
        </Card>
    )
}