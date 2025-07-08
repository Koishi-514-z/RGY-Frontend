import React from "react";
import { Typography, Card, Row, Col, Divider, Space, Tag, Avatar } from "antd";
import { UserOutlined, MailOutlined, IdcardOutlined, CrownOutlined, StarFilled } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function PsyAccountCard({profile}) {
    const InfoItem = ({ icon, label, value, tag, tagColor }) => (
        <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            padding: '12px 16px',
            background: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)',
            borderRadius: '8px',
            border: '1px solid #f0f0f0',
            transition: 'all 0.3s ease'
        }}>
            <div style={{ 
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #722ed1 0%, #9254de 100%)',
                borderRadius: '50%',
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '16px',
                boxShadow: '0 2px 8px rgba(114, 46, 209, 0.3)'
            }}>
                {React.cloneElement(icon, { 
                    style: { color: '#fff', fontSize: '16px' } 
                })}
            </div>
            <div style={{ flex: 1 }}>
                <Text style={{ 
                    color: '#722ed1', 
                    fontSize: '12px', 
                    fontWeight: '500',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '4px',
                    display: 'block'
                }}>
                    {label}
                </Text>
                <Text style={{ 
                    fontSize: '16px', 
                    fontWeight: '600',
                    color: '#262626'
                }}>
                    {value || '-'}
                </Text>
            </div>
            {tag && (
                <Tag 
                    color={tagColor || "#722ed1"} 
                    style={{ 
                        marginLeft: 'auto',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '500',
                        padding: '2px 8px'
                    }}
                >
                    {tag}
                </Tag>
            )}
        </div>
    );

    return (
        <Card 
            style={{ 
                background: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
                border: '1px solid #d3adf7',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 8px 24px rgba(114, 46, 209, 0.12)'
            }}
        >
            <div style={{
                background: 'linear-gradient(135deg, #722ed1 0%, #9254de 100%)',
                padding: '20px 24px',
                margin: '-24px -24px 24px -24px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '-20px',
                    right: '-20px',
                    width: '100px',
                    height: '100px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%'
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '-30px',
                    left: '-30px',
                    width: '80px',
                    height: '80px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '50%'
                }} />
                
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '16px',
                        border: '2px solid rgba(255, 255, 255, 0.3)'
                    }}>
                        <CrownOutlined style={{ color: '#fff', fontSize: '20px' }} />
                    </div>
                    <div>
                        <Title level={4} style={{ margin: 0, color: '#fff' }}>
                            账户信息
                        </Title>
                        <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>
                            专业心理咨询师认证档案
                        </Text>
                    </div>
                    <div style={{ marginLeft: 'auto' }}>
                        <Tag 
                            icon={<StarFilled />}
                            color="gold"
                            style={{ 
                                borderRadius: '16px',
                                fontSize: '12px',
                                fontWeight: '500'
                            }}
                        >
                            已认证
                        </Tag>
                    </div>
                </div>
            </div>

            <Row gutter={[0, 16]}>
                <Col span={24}>
                    <InfoItem 
                        icon={<IdcardOutlined />}
                        label="账户ID" 
                        value={profile.userid} 
                    />
                </Col>

                <Col span={24}>
                    <InfoItem 
                        icon={<UserOutlined />}
                        label="用户名" 
                        value={profile.username} 
                    />
                </Col>
                
                <Col span={24}>
                    <InfoItem 
                        icon={<MailOutlined />}
                        label="电子邮箱" 
                        value={profile.email} 
                        tag="已验证"
                        tagColor="success"
                    />
                </Col>
            </Row>

            <div style={{
                marginTop: '24px',
                padding: '16px',
                background: 'rgba(114, 46, 209, 0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(114, 46, 209, 0.1)',
                textAlign: 'center'
            }}>
                <Space>
                    <div style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#722ed1'
                    }} />
                    <Text style={{ 
                        color: '#722ed1', 
                        fontSize: '12px',
                        fontWeight: '500'
                    }}>
                        专业认证 · 安全可信
                    </Text>
                    <div style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#722ed1'
                    }} />
                </Space>
            </div>
        </Card>
    );
}