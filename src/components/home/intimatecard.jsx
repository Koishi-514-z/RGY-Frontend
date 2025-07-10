import React from "react";
import { Typography, Card, Avatar, Space, List, Badge, Tooltip } from "antd";
import { UserOutlined, HeartFilled, IdcardOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Text, Title } = Typography;

export default function IntimateCard({intimateUsers}) {
    const navigate = useNavigate();

    return (
        <Card 
            title={
                <div style={{ padding: '8px 0' }}>
                    <Space>
                        <IdcardOutlined style={{ fontSize: '20px', color: '#ff4d4f' }} />
                        <Title level={4} style={{ margin: 0, color: '#262626' }}>亲密用户</Title>
                    </Space>
                </div>
            }
            style={{ 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                borderRadius: '12px',
                overflow: 'hidden',
            }}
            extra={
                <Text type="secondary" style={{ fontSize: '14px' }}>
                    与你情绪相似的用户
                </Text>
            }
        >
            <List
                grid={{ gutter: 24, column: 2, xs: 1, sm: 2 }}
                dataSource={intimateUsers}
                renderItem={(data) => (
                    <List.Item>
                        <Card 
                            hoverable={true}
                            onClick={() => navigate(`/home/${data.intimateProfile.userid}`)}
                            style={{ 
                                borderRadius: '8px',
                                transition: 'all 0.3s',
                                border: '1px solid #f0f0f0'
                            }}
                        >
                            <div style={{ 
                                position: 'relative', 
                                marginBottom: '16px',
                                display: 'flex',
                                justifyContent: 'center',  
                                width: '100%'             
                            }}>
                                <Avatar 
                                    size={80} 
                                    icon={<UserOutlined />}
                                    src={data.intimateProfile.avatar}
                                    style={{ 
                                        backgroundColor: data.intimateProfile.avatar ? 'transparent' : '#1890ff',
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                                        border: '2px solid #fff'
                                    }}
                                />
                                <Tooltip title={"情绪匹配度：" + data.intimateScore}>
                                    <div style={{ 
                                        position: 'absolute',
                                        bottom: -5,
                                        right: -5,
                                        backgroundColor: '#ff4d4f',
                                        color: 'white',
                                        borderRadius: '50%',
                                        width: '28px',
                                        height: '28px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                        boxShadow: '0 2px 6px rgba(255, 77, 79, 0.4)',
                                        border: '2px solid white'
                                    }}>
                                        <HeartFilled />
                                    </div>
                                </Tooltip>
                            </div>
                            
                            <div style={{ textAlign: 'center' }}>
                                <Text 
                                    strong 
                                    style={{ 
                                        fontSize: '16px',
                                        display: 'block',
                                        marginBottom: '4px'
                                    }}
                                >
                                    {data.intimateProfile.username}
                                </Text>
                                <Text type="secondary" style={{ fontSize: '13px' }}>
                                    {data.intimateProfile.note || "这个人很神秘，没有留下个性签名"}
                                </Text>
                            </div>
                        </Card>
                    </List.Item>
                )}
            />
        </Card>
    );
}