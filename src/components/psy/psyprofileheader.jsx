import React from "react";
import { Button, Avatar, Typography, Card, Row, Col, Space, Badge, Tag, Tooltip } from "antd";
import { EditOutlined, UserOutlined, MessageOutlined, StarFilled, CrownOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import PsyHomeTabs from "./psyhometabs";

const { Title, Text } = Typography;

export default function PsyProfileHeader({profile}) {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const handleEdit = () => {
        setSearchParams({tabKey: 3});
    };

    const handleChat = async () => {
        navigate(`/chat`);
    }

    return (
        <Card 
            style={{ 
                background: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
                border: '1px solid #d3adf7',
                borderRadius: '12px',
                overflow: 'hidden',
                marginBottom: '24px',
                boxShadow: '0 4px 20px rgba(114, 46, 209, 0.1)'
            }}
        >
            <Row align="middle" gutter={[16, 16]} style={{ marginBottom: '20px' }}>
                <Col flex="auto">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ position: 'relative' }}>
                            <Avatar 
                                size={64} 
                                icon={<UserOutlined />}
                                src={profile.avatar}
                                style={{ 
                                    backgroundColor: profile.avatar ? 'transparent' : '#722ed1',
                                    border: '3px solid #fff',
                                    boxShadow: '0 4px 12px rgba(114, 46, 209, 0.3)'
                                }}
                            />
                            <div style={{
                                position: 'absolute',
                                bottom: -2,
                                right: -2,
                                background: '#722ed1',
                                borderRadius: '50%',
                                width: '20px',
                                height: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px solid #fff'
                            }}>
                                <CrownOutlined style={{ color: '#fff', fontSize: '10px' }} />
                            </div>
                        </div>

                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                                <Title level={4} style={{ margin: 0, color: '#722ed1' }}>
                                    {profile.username}
                                </Title>
                                
                                <Tag 
                                    color="#722ed1" 
                                    style={{ 
                                        margin: 0,
                                        borderRadius: '12px',
                                        fontSize: '11px',
                                        fontWeight: '500'
                                    }}
                                >
                                    心理咨询师
                                </Tag>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <Space size={4}>
                                    <StarFilled style={{ color: '#faad14', fontSize: '14px' }} />
                                    <Text style={{ fontSize: '13px', color: '#8c8c8c' }}>
                                        {profile.avgScore + ' (' + profile.commentNum + '评价)'}
                                    </Text>
                                </Space>

                                <Text style={{ fontSize: '13px', color: '#8c8c8c' }}>
                                    累计服务 <Text strong style={{ color: '#722ed1' }}> {profile.totalClients} </Text> 位来访者
                                </Text>
                            </div>
                        </div>
                    </div>
                </Col>

                <Col flex="none">
                    <Space size={12}>
                        <Tooltip title="进入咨询室">
                            <Button 
                                type="primary"
                                icon={<MessageOutlined />} 
                                onClick={handleChat}
                                style={{ 
                                    backgroundColor: '#722ed1',
                                    borderColor: '#722ed1',
                                    borderRadius: '8px',
                                    height: '40px',
                                    paddingLeft: '16px',
                                    paddingRight: '16px',
                                    boxShadow: '0 2px 8px rgba(114, 46, 209, 0.3)'
                                }}
                            >
                                咨询室
                            </Button>
                        </Tooltip>
                        
                        <Tooltip title="编辑资料">
                            <Button 
                                icon={<EditOutlined />} 
                                onClick={handleEdit}
                                style={{ 
                                    borderColor: '#722ed1',
                                    color: '#722ed1',
                                    borderRadius: '8px',
                                    height: '40px',
                                    width: '40px'
                                }}
                            />
                        </Tooltip>
                    </Space>
                </Col>
            </Row>

            <div style={{ 
                borderTop: '1px solid rgba(114, 46, 209, 0.1)',
                paddingTop: '16px',
                marginTop: '4px'
            }}>
                <PsyHomeTabs />
            </div>
        </Card>
    )
}