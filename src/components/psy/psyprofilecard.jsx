import React, { useState, useEffect } from "react";
import { Card, Avatar, Typography, Tag, Space, Divider, Row, Col, Button, Tooltip, Progress, App, List, Badge } from "antd";
import { 
    UserOutlined, 
    StarFilled, 
    CrownOutlined, 
    CalendarOutlined, 
    BookOutlined, 
    TrophyOutlined,
    HeartOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    MessageOutlined,
    EnvironmentOutlined,
    TeamOutlined,
    FileTextOutlined
} from "@ant-design/icons";
import { createSession, getSessionid } from "../../service/chat";
import { useNavigate } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;

export default function PsyProfileCard({profile, handleSubscribe, guest = false}) {
    const [showFullIntro, setShowFullIntro] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const navigate = useNavigate();
    const { message } = App.useApp();

    // 监听屏幕尺寸变化
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setIsMobile(width < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    console.log(profile);

    const handleCounseling = async () => {
        if(!guest) {
            return;
        }
        let sessionid = await getSessionid(profile.userid);
        if(!sessionid) {
            sessionid = await createSession(profile.userid);
            if(!sessionid) {
                message.error('创建会话失败，请检查网络');
                return;
            }
        }
        navigate(`/chat/${sessionid}`);
    }

    const specialtyColors = ["#722ed1", "#1890ff", "#52c41a", "#faad14", "#f759ab", "#13c2c2"];

    return (
        <Card
            style={{
                borderRadius: isMobile ? '12px' : '16px',
                boxShadow: '0 8px 24px rgba(114, 46, 209, 0.12)',
                border: '1px solid #e8d5ff',
                overflow: 'hidden',
                margin: isMobile ? '0' : undefined
            }}
        >
            {/* 顶部横幅 */}
            <div style={{
                background: 'linear-gradient(135deg, #722ed1 0%, #9254de 100%)',
                height: isMobile ? '60px' : '80px',
                margin: `-${isMobile ? '16px' : '24px'} -${isMobile ? '16px' : '24px'} 0 -${isMobile ? '16px' : '24px'}`,
                position: 'relative'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: isMobile ? '16px' : '24px',
                    transform: 'translateY(-50%)',
                    color: '#fff'
                }}>
                    <Space size={isMobile ? 4 : 8}>
                        <CrownOutlined style={{ fontSize: isMobile ? '16px' : '20px' }} />
                        <Text style={{ 
                            color: '#fff', 
                            fontSize: isMobile ? '13px' : '16px', 
                            fontWeight: 'bold' 
                        }}>
                            专业认证咨询师
                        </Text>
                    </Space>
                </div>
            </div>

            {/* 头像和基本信息 */}
            <div style={{ 
                textAlign: 'center', 
                marginTop: isMobile ? '-24px' : '-32px', 
                marginBottom: isMobile ? '16px' : '24px' 
            }}>
                <Avatar
                    size={isMobile ? 60 : 80}
                    icon={<UserOutlined />}
                    src={profile.avatar}
                    style={{
                        backgroundColor: profile.avatar ? 'transparent' : '#722ed1',
                        border: '4px solid #fff',
                        boxShadow: '0 4px 16px rgba(114, 46, 209, 0.3)'
                    }}
                />
                
                <div style={{ marginTop: isMobile ? '12px' : '16px' }}>
                    <Title level={isMobile ? 4 : 3} style={{ margin: '0 0 4px 0', color: '#262626' }}>
                        {profile.username}
                    </Title>
                    <Text style={{ 
                        fontSize: isMobile ? '12px' : '14px', 
                        color: '#722ed1', 
                        fontWeight: '500' 
                    }}>
                        {profile.title}
                    </Text>
                    <br />
                    <Text style={{ 
                        fontSize: isMobile ? '11px' : '13px', 
                        color: '#8c8c8c' 
                    }}>
                        {profile.license}
                    </Text>
                </div>

                {/* 统计数据 */}
                <Row gutter={isMobile ? 8 : 16} style={{ marginTop: isMobile ? '16px' : '20px' }}>
                    <Col span={8}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ 
                                fontSize: isMobile ? '16px' : '20px', 
                                fontWeight: 'bold', 
                                color: '#722ed1' 
                            }}>
                                {profile.avgScore}
                            </div>
                            <div style={{ 
                                fontSize: isMobile ? '10px' : '12px', 
                                color: '#8c8c8c' 
                            }}>
                                咨询评分
                            </div>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ 
                                fontSize: isMobile ? '16px' : '20px', 
                                fontWeight: 'bold', 
                                color: '#722ed1' 
                            }}>
                                {profile.totalClients}
                            </div>
                            <div style={{ 
                                fontSize: isMobile ? '10px' : '12px', 
                                color: '#8c8c8c' 
                            }}>
                                服务人数
                            </div>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ 
                                fontSize: isMobile ? '16px' : '20px', 
                                fontWeight: 'bold', 
                                color: '#722ed1' 
                            }}>
                                {profile.workingYears}年
                            </div>
                            <div style={{ 
                                fontSize: isMobile ? '10px' : '12px', 
                                color: '#8c8c8c' 
                            }}>
                                从业经验
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>

            <Divider style={{ margin: isMobile ? '16px 0' : '24px 0' }} />

            {/* 专业领域 */}
            <div style={{ marginBottom: isMobile ? '16px' : '24px' }}>
                <Title level={5} style={{ 
                    marginBottom: isMobile ? '8px' : '12px', 
                    color: '#262626',
                    fontSize: isMobile ? '14px' : '16px'
                }}>
                    <BookOutlined style={{ 
                        marginRight: '8px', 
                        color: '#722ed1',
                        fontSize: isMobile ? '14px' : '16px'
                    }} />
                    专业领域
                </Title>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: isMobile ? '4px' : '8px' }}>
                    {profile.specialty.map((tag) => (
                        <Tag
                            key={tag.id}
                            color={specialtyColors[tag.id % specialtyColors.length]}
                            style={{
                                borderRadius: '16px',
                                padding: isMobile ? '2px 8px' : '4px 12px',
                                fontSize: isMobile ? '10px' : '12px',
                                fontWeight: '500'
                            }}
                        >
                            {tag.content}
                        </Tag>
                    ))}
                </div>
            </div>

            {/* 专业资质 */}
            <div style={{ marginBottom: isMobile ? '16px' : '24px' }}>
                <Title level={5} style={{ 
                    marginBottom: isMobile ? '8px' : '12px', 
                    color: '#262626',
                    fontSize: isMobile ? '14px' : '16px'
                }}>
                    <TrophyOutlined style={{ 
                        marginRight: '8px', 
                        color: '#faad14',
                        fontSize: isMobile ? '14px' : '16px'
                    }} />
                    专业资质
                </Title>
                <div>
                    <div style={{ marginBottom: '8px' }}>
                        <Text strong style={{ 
                            color: '#262626',
                            fontSize: isMobile ? '12px' : '14px'
                        }}>学历背景：</Text>
                        <Text style={{ 
                            color: '#595959', 
                            marginLeft: '8px',
                            fontSize: isMobile ? '11px' : '14px'
                        }}>
                            {profile.education}
                        </Text>
                    </div>
                    <div>
                        <Text strong style={{ 
                            color: '#262626',
                            fontSize: isMobile ? '12px' : '14px'
                        }}>执业证书：</Text>
                        <div style={{ marginTop: '4px' }}>
                            {profile.certifications.map((tag) => (
                                <Tag
                                    key={tag.id}
                                    icon={<CheckCircleOutlined />}
                                    color="success"
                                    style={{ 
                                        margin: '2px 4px 2px 0', 
                                        fontSize: isMobile ? '10px' : '11px' 
                                    }}
                                >
                                    {tag.content}
                                </Tag>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 服务统计 */}
            <div style={{ marginBottom: isMobile ? '16px' : '24px' }}>
                <Title level={5} style={{ 
                    marginBottom: isMobile ? '12px' : '16px', 
                    color: '#262626',
                    fontSize: isMobile ? '14px' : '16px'
                }}>
                    <TeamOutlined style={{ 
                        marginRight: '8px', 
                        color: '#52c41a',
                        fontSize: isMobile ? '14px' : '16px'
                    }} />
                    服务统计
                </Title>
                <Row gutter={[isMobile ? 8 : 16, 12]}>
                    <Col xs={24} sm={12}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <Text style={{ 
                                fontSize: isMobile ? '11px' : '13px', 
                                color: '#595959' 
                            }}>咨询满意度</Text>
                            <Text style={{ 
                                fontSize: isMobile ? '11px' : '13px', 
                                color: '#722ed1', 
                                fontWeight: 'bold' 
                            }}>
                                {profile.successRate * 100}%
                            </Text>
                        </div>
                        <Progress 
                            percent={profile.successRate * 100} 
                            size="small" 
                            strokeColor="#722ed1"
                            showInfo={false}
                        />
                    </Col>
                    <Col xs={24} sm={12}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <Text style={{ 
                                fontSize: isMobile ? '11px' : '13px', 
                                color: '#595959' 
                            }}>回复速度</Text>
                            <Text style={{ 
                                fontSize: isMobile ? '11px' : '13px', 
                                color: '#52c41a', 
                                fontWeight: 'bold' 
                            }}>
                                {profile.responseTime}
                            </Text>
                        </div>
                        <Progress 
                            percent={95} 
                            size="small" 
                            strokeColor="#52c41a"
                            showInfo={false}
                        />
                    </Col>
                </Row>

                <Row gutter={isMobile ? 8 : 16} style={{ marginTop: isMobile ? '12px' : '16px' }}>
                    <Col span={8}>
                        <div style={{ 
                            textAlign: 'center', 
                            padding: isMobile ? '8px' : '12px',
                            background: '#f6ffed',
                            borderRadius: '8px',
                            border: '1px solid #b7eb8f'
                        }}>
                            <StarFilled style={{ 
                                color: '#faad14', 
                                fontSize: isMobile ? '14px' : '16px' 
                            }} />
                            <div style={{ 
                                marginTop: '4px', 
                                fontSize: isMobile ? '10px' : '12px', 
                                color: '#52c41a' 
                            }}>
                                {profile.commentNum} 条好评
                            </div>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div style={{ 
                            textAlign: 'center', 
                            padding: isMobile ? '8px' : '12px',
                            background: '#f0f5ff',
                            borderRadius: '8px',
                            border: '1px solid #adc6ff'
                        }}>
                            <HeartOutlined style={{ 
                                color: '#1890ff', 
                                fontSize: isMobile ? '14px' : '16px' 
                            }} />
                            <div style={{ 
                                marginTop: '4px', 
                                fontSize: isMobile ? '10px' : '12px', 
                                color: '#1890ff' 
                            }}>
                                专业温暖
                            </div>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div style={{ 
                            textAlign: 'center', 
                            padding: isMobile ? '8px' : '12px',
                            background: '#fff0f6',
                            borderRadius: '8px',
                            border: '1px solid #ffadd2'
                        }}>
                            <ClockCircleOutlined style={{ 
                                color: '#eb2f96', 
                                fontSize: isMobile ? '14px' : '16px' 
                            }} />
                            <div style={{ 
                                marginTop: '4px', 
                                fontSize: isMobile ? '10px' : '12px', 
                                color: '#eb2f96' 
                            }}>
                                及时回复
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>

            {/* 个人简介 */}
            <div style={{ marginBottom: isMobile ? '16px' : '24px' }}>
                <Title level={5} style={{ 
                    marginBottom: isMobile ? '8px' : '12px', 
                    color: '#262626',
                    fontSize: isMobile ? '14px' : '16px'
                }}>
                    <FileTextOutlined style={{ 
                        marginRight: '8px', 
                        color: '#13c2c2',
                        fontSize: isMobile ? '14px' : '16px'
                    }} />
                    个人简介
                </Title>
                <Paragraph 
                    style={{ 
                        fontSize: isMobile ? '11px' : '13px', 
                        lineHeight: '1.6',
                        color: '#595959',
                        margin: 0
                    }}
                    ellipsis={!showFullIntro ? { 
                        rows: isMobile ? 2 : 3, 
                        expandable: true, 
                        symbol: '展开' 
                    } : false}
                    onExpand={() => setShowFullIntro(true)}
                >
                    {profile.introduction}
                </Paragraph>
            </div>

            {/* 荣誉成就 */}
            <div style={{ marginBottom: isMobile ? '16px' : '24px' }}>
                <Title level={5} style={{ 
                    marginBottom: isMobile ? '8px' : '12px', 
                    color: '#262626',
                    fontSize: isMobile ? '14px' : '16px'
                }}>
                    <TrophyOutlined style={{ 
                        marginRight: '8px', 
                        color: '#faad14',
                        fontSize: isMobile ? '14px' : '16px'
                    }} />
                    荣誉成就
                </Title>
                <List
                    size="small"
                    dataSource={profile.achievements}
                    renderItem={(item) => (
                        <List.Item style={{ 
                            padding: isMobile ? '2px 0' : '4px 0', 
                            border: 'none' 
                        }}>
                            <Space>
                                <Badge status="success" />
                                <Text style={{ 
                                    fontSize: isMobile ? '11px' : '13px', 
                                    color: '#595959' 
                                }}>{item}</Text>
                            </Space>
                        </List.Item>
                    )}
                />
            </div>

            {/* 服务详情 */}
            <div style={{ 
                background: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
                padding: isMobile ? '12px' : '16px',
                borderRadius: '12px',
                margin: '0 -8px'
            }}>
                <Row gutter={[isMobile ? 8 : 16, 8]}>
                    <Col span={24}>
                        <Text strong style={{ 
                            color: '#722ed1', 
                            fontSize: isMobile ? '12px' : '14px' 
                        }}>服务详情</Text>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Space size={4}>
                            <EnvironmentOutlined style={{ 
                                color: '#8c8c8c', 
                                fontSize: isMobile ? '10px' : '12px' 
                            }} />
                            <Text style={{ 
                                fontSize: isMobile ? '10px' : '12px', 
                                color: '#595959' 
                            }}>{profile.location}</Text>
                        </Space>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Space size={4}>
                            <ClockCircleOutlined style={{ 
                                color: '#8c8c8c', 
                                fontSize: isMobile ? '10px' : '12px' 
                            }} />
                            <Text style={{ 
                                fontSize: isMobile ? '10px' : '12px', 
                                color: '#595959' 
                            }}>收费：{profile.consultationFee}</Text>
                        </Space>
                    </Col>
                    <Col span={24}>
                        <Text style={{ 
                            fontSize: isMobile ? '10px' : '12px', 
                            color: '#595959' 
                        }}>
                            工作时间：{profile.workingTime}
                        </Text>
                    </Col>
                </Row>
            </div>

            {/* 操作按钮 */}
            <div style={{ marginTop: isMobile ? '16px' : '24px' }}>
                <Row gutter={isMobile ? 8 : 12}>
                    <Col xs={24} sm={12}>
                        <Button 
                            type="primary" 
                            block
                            onClick={handleCounseling}
                            icon={<MessageOutlined />}
                            style={{
                                backgroundColor: '#722ed1',
                                borderColor: '#722ed1',
                                borderRadius: '8px',
                                height: isMobile ? '36px' : '40px',
                                fontSize: isMobile ? '12px' : '14px',
                                marginBottom: isMobile ? '8px' : '0'
                            }}
                        >
                            在线咨询
                        </Button>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Button 
                            type="primary" 
                            block
                            onClick={handleSubscribe}
                            icon={<CalendarOutlined />}
                            style={{
                                backgroundColor: '#722ed1',
                                borderColor: '#722ed1',
                                borderRadius: '8px',
                                height: isMobile ? '36px' : '40px',
                                fontSize: isMobile ? '12px' : '14px'
                            }}
                        >
                            预约线下咨询
                        </Button>
                    </Col>
                </Row>
            </div>
        </Card>
    );
}