import React from "react";
import { Typography, Card, Row, Col, Space, Tag, Avatar } from "antd";
import { UserOutlined, MailOutlined, IdcardOutlined, SafetyOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useProfile } from "../context/profilecontext";

const { Title, Text } = Typography;

export default function ProfileView() {
    const { profile } = useProfile();

    const InfoItem = ({ icon, label, value, tag, tagColor }) => (
        <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            padding: '16px',
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '12px',
            border: '1px solid rgba(24, 144, 255, 0.1)',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)'
        }}>
            <div style={{ 
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)',
                borderRadius: '12px',
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '16px',
                boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)'
            }}>
                {React.cloneElement(icon, { 
                    style: { color: '#fff', fontSize: '18px' } 
                })}
            </div>
            <div style={{ flex: 1 }}>
                <Text style={{ 
                    color: '#1890ff', 
                    fontSize: '12px', 
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px',
                    marginBottom: '6px',
                    display: 'block'
                }}>
                    {label}
                </Text>
                <Text style={{ 
                    fontSize: '18px', 
                    fontWeight: '600',
                    color: '#262626'
                }}>
                    {value || '-'}
                </Text>
            </div>
            {tag && (
                <Tag 
                    icon={<CheckCircleOutlined />}
                    color={tagColor || "#1890ff"} 
                    style={{ 
                        marginLeft: 'auto',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500',
                        padding: '4px 12px',
                        border: 'none'
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
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 50%, #f6ffed 100%)',
                border: '1px solid rgba(24, 144, 255, 0.15)',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(24, 144, 255, 0.12)',
                position: 'relative'
            }}
        >
            <div style={{
                background: 'linear-gradient(135deg, rgba(24, 144, 255, 0.05) 0%, rgba(54, 207, 201, 0.05) 100%)',
                padding: '24px',
                margin: '-24px -24px 24px -24px',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{
                            width: '56px',
                            height: '56px',
                            background: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '16px',
                            boxShadow: '0 6px 16px rgba(24, 144, 255, 0.3)',
                            position: 'relative'
                        }}>
                            <IdcardOutlined style={{ color: '#fff', fontSize: '24px' }} />
                            <div style={{
                                position: 'absolute',
                                top: '8px',
                                right: '8px',
                                width: '8px',
                                height: '8px',
                                background: '#52c41a',
                                borderRadius: '50%',
                                border: '2px solid #fff'
                            }} />
                        </div>
                        <div>
                            <Title level={4} style={{ 
                                margin: 0, 
                                background: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}>
                                账户信息
                            </Title>
                            <Text style={{ 
                                color: '#595959', 
                                fontSize: '14px',
                                fontWeight: '500'
                            }}>
                                个人账户安全档案
                            </Text>
                        </div>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Tag 
                            icon={<SafetyOutlined />}
                            color="success"
                            style={{ 
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: '500',
                                padding: '4px 12px',
                                marginBottom: '4px'
                            }}
                        >
                            安全认证
                        </Tag>
                        <div style={{ display: 'flex', gap: '4px' }}>
                            {[1,2,3].map(i => (
                                <div key={i} style={{
                                    width: '6px',
                                    height: '6px',
                                    background: '#52c41a',
                                    borderRadius: '50%'
                                }} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <Row gutter={[0, 16]} style={{ position: 'relative', zIndex: 1 }}>
                <Col span={24}>
                    <InfoItem 
                        icon={<IdcardOutlined />}
                        label="账户ID" 
                        value={profile?.userid} 
                    />
                </Col>

                <Col span={24}>
                    <InfoItem 
                        icon={<UserOutlined />}
                        label="用户名" 
                        value={profile?.username} 
                    />
                </Col>
                
                <Col span={24}>
                    <InfoItem 
                        icon={<MailOutlined />}
                        label="电子邮箱" 
                        value={profile?.email} 
                        tag="已验证"
                        tagColor="success"
                    />
                </Col>
            </Row>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-10px) rotate(5deg); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(1.2); }
                }
            `}</style>
        </Card>
    );
}