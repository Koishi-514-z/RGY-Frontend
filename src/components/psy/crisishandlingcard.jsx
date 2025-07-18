import React, { useState, useEffect } from "react";
import { 
    Card, List, Avatar, Tag, Button, Space, Typography, 
    Alert, Badge, Tooltip, Modal, Input, Select, Row, Col,
    Divider, Empty, message
} from "antd";
import { 
    ClockCircleOutlined, UserOutlined,
    PhoneOutlined, MessageOutlined, EyeOutlined, CheckOutlined,
    WarningOutlined, HeartOutlined, TeamOutlined
} from "@ant-design/icons";
import dayjs from 'dayjs';
import { updateCrisisStatus, getCrisis } from "../../service/crisis";
import { createSession, getSessionid } from "../../service/chat";
import { useNavigate } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;

export default function CrisisHandlingCard({crisisCases, setCrisisCases}) {
    const [selectedCase, setSelectedCase] = useState(null);
    const [detailVisible, setDetailVisible] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');
    const [urgencyFilter, setUrgencyFilter] = useState('all');
    const navigate = useNavigate();

    const urgencyLevels = {
        0: { 
            text: 'low',
            label: '中低危险', 
            color: '#faad14', 
            bgColor: 'rgba(250, 173, 20, 0.1)',
            icon: <ClockCircleOutlined />
        },
        1: { 
            text: 'high',
            label: '高危险', 
            color: '#fa8c16', 
            bgColor: 'rgba(250, 140, 22, 0.1)',
            icon: <WarningOutlined />
        },
        2: { 
            text: 'critical',
            label: '极危险', 
            color: '#ff4d4f', 
            bgColor: 'rgba(255, 77, 79, 0.1)',
            icon: <WarningOutlined />
        }
    };

    const statusConfig = {
        0: { text: 'pending', label: '待处理', color: 'orange' },
        1: { text: 'processing', label: '处理中', color: 'blue' },
        2: { text: 'resolved', label: '已解决', color: 'green' }
    };

    const handleStatusUpdate = async (crisisid, newStatus) => {
        try {
            const res = await updateCrisisStatus(crisisid, newStatus);
            if (res) {
                message.success('状态更新成功');
                setCrisisCases(await getCrisis());
            }
        } catch (error) {
            message.error('状态更新失败');
        }
    };

    const handleEmergencySession = async (userid) => {
        let sessionid = await getSessionid(userid);
        if(!sessionid) {
            sessionid = await createSession(userid);
            if(!sessionid) {
                message.error('创建会话失败，请检查网络');
                return;
            }
        }
        navigate(`/chat/${sessionid}?case=emergency`)
    };

    const filteredCases = crisisCases.filter(item => {
        const statusMatch = statusFilter === 'all' || item.status === parseInt(statusFilter);
        const urgencyMatch = urgencyFilter === 'all' || item.urgencyLevel === parseInt(urgencyFilter);
        return statusMatch && urgencyMatch;
    });

    const getSortedCases = () => {
        return filteredCases.sort((a, b) => {
            const urgencyDiff = b.urgencyLevel - a.urgencyLevel;
            if (urgencyDiff !== 0) return urgencyDiff;
            return new Date(b.timestamp) - new Date(a.timestamp);
        });
    };

    const renderCrisisItem = (item) => {
        const urgency = urgencyLevels[item.urgencyLevel];
        const isUrgent = item.urgencyLevel === 2;

        return (
            <List.Item
                key={item.id}
                style={{
                    background: urgency.bgColor,
                    border: `2px solid ${urgency.color}`,
                    borderRadius: '12px',
                    margin: '8px 0',
                    padding: '16px',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {isUrgent && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        background: urgency.color,
                        color: '#fff',
                        padding: '4px 12px',
                        borderRadius: '0 12px 0 12px',
                        fontSize: '11px',
                        fontWeight: 'bold'
                    }}>
                        紧急处理
                    </div>
                )}

                <List.Item.Meta
                    avatar={
                        <Badge dot={isUrgent} color={urgency.color}>
                            <Avatar 
                                size={48}
                                style={{ 
                                    backgroundColor: urgency.color,
                                    border: `2px solid ${urgency.color}`
                                }}
                                icon={<UserOutlined />}
                                src={item.userAvatar}
                            />
                        </Badge>
                    }
                    title={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Text strong style={{ fontSize: '16px' }}>
                                用户ID: {item.userid}
                            </Text>
                            <Tag 
                                icon={urgency.icon}
                                color={urgency.color}
                                style={{ fontWeight: '500' }}
                            >
                                {urgency.label}
                            </Tag>
                            <Tag color={statusConfig[item.status].color}>
                                {statusConfig[item.status].label}
                            </Tag>
                        </div>
                    }
                    description={
                        <div style={{ marginTop: '8px' }}>
                            <Paragraph 
                                style={{ 
                                    margin: 0, 
                                    color: '#262626',
                                    lineHeight: '1.6'
                                }}
                                ellipsis={{ rows: 2, expandable: true }}
                            >
                                <Text strong style={{ color: urgency.color }}>危机内容：</Text>
                                {item.content}
                            </Paragraph>
                            
                            <div style={{ 
                                marginTop: '12px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <Space size={16}>
                                    <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>
                                        <ClockCircleOutlined style={{ marginRight: '4px' }} />
                                        {dayjs(item.timestamp).format('MM-DD HH:mm')}
                                    </Text>
                                </Space>
                                
                                <Space size={8}>
                                    <Tooltip title="查看详情">
                                        <Button
                                            size="small"
                                            icon={<EyeOutlined />}
                                            onClick={() => {
                                                setSelectedCase(item);
                                                setDetailVisible(true);
                                            }}
                                        />
                                    </Tooltip>
                                    
                                    {item.status === 0 && (
                                        <>
                                            <Tooltip title="立即联系">
                                                <Button
                                                    type="primary"
                                                    danger={isUrgent}
                                                    size="small"
                                                    icon={<PhoneOutlined />}
                                                    onClick={() => handleEmergencySession(item.userid)}
                                                />
                                            </Tooltip>
                                            
                                            <Tooltip title="标记处理中">
                                                <Button
                                                    size="small"
                                                    icon={<MessageOutlined />}
                                                    onClick={() => handleStatusUpdate(item.crisisid, 1)}
                                                />
                                            </Tooltip>
                                        </>
                                    )}
                                    
                                    {item.status === 1 && (
                                        <Tooltip title="标记已解决">
                                            <Button
                                                type="primary"
                                                size="small"
                                                icon={<CheckOutlined />}
                                                onClick={() => handleStatusUpdate(item.crisisid, 2)}
                                                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                                            />
                                        </Tooltip>
                                    )}
                                </Space>
                            </div>
                        </div>
                    }
                />
            </List.Item>
        );
    };

    return (
        <Card
            style={{
                background: 'linear-gradient(135deg, #fff1f0 0%, #ffebe6 100%)',
                border: '2px solid #ff7875',
                borderRadius: '16px',
                boxShadow: '0 8px 24px rgba(255, 77, 79, 0.15)'
            }}
        >
            <div style={{ marginBottom: '24px' }}>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '16px'
                }}>
                    <div>
                        <Title level={4} style={{ margin: 0, color: '#ff4d4f' }}>
                            <WarningOutlined style={{ marginRight: '8px' }} />
                            危机干预处理
                        </Title>
                        <Text style={{ color: '#8c8c8c', fontSize: '13px' }}>
                            紧急心理危机案例监控与处理中心
                        </Text>
                    </div>
                    
                    <Badge 
                        count={filteredCases.filter(item => 
                            item.urgencyLevel === 2 || item.urgencyLevel === 1
                        ).length}
                        style={{ backgroundColor: '#ff4d4f' }}
                    >
                        <TeamOutlined style={{ fontSize: '24px', color: '#ff4d4f' }} />
                    </Badge>
                </div>

                {filteredCases.some(item => item.urgencyLevel === 2) && (
                    <Alert
                        message="紧急警告"
                        description="当前有极危险级别的危机案例需要立即处理！"
                        type="error"
                        showIcon
                        style={{ 
                            marginBottom: '16px',
                            borderRadius: '8px',
                            border: '1px solid #ff4d4f'
                        }}
                        action={
                            <Button size="small" danger type="primary">
                                立即处理
                            </Button>
                        }
                    />
                )}
            </div>

            <Card size="small" style={{ 
                marginBottom: '16px',
                background: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid rgba(255, 77, 79, 0.2)'
            }}>
                <Row gutter={16} align="middle">
                    <Col>
                        <Text strong>筛选条件：</Text>
                    </Col>
                    <Col>
                        <Space>
                            <Text style={{ fontSize: '13px' }}>状态：</Text>
                            <Select
                                value={statusFilter}
                                onChange={setStatusFilter}
                                size="small"
                                style={{ width: '100px' }}
                                options={[
                                    { label: '全部', value: 'all' },
                                    { label: '待处理', value: '0' },
                                    { label: '处理中', value: '1' },
                                    { label: '已解决', value: '2' }
                                ]}
                            />
                        </Space>
                    </Col>
                    <Col>
                        <Space>
                            <Text style={{ fontSize: '13px' }}>危险级别：</Text>
                            <Select
                                value={urgencyFilter}
                                onChange={setUrgencyFilter}
                                size="small"
                                style={{ width: '100px' }}
                                options={[
                                    { label: '全部', value: 'all' },
                                    { label: '极危险', value: '2' },
                                    { label: '高危险', value: '1' },
                                    { label: '中低危险', value: '0' },
                                ]}
                            />
                        </Space>
                    </Col>
                    <Col flex="auto">
                        <div style={{ textAlign: 'right' }}>
                            <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>
                                共 {filteredCases.length} 个案例
                            </Text>
                        </div>
                    </Col>
                </Row>
            </Card>

            <List
                dataSource={getSortedCases()}
                renderItem={renderCrisisItem}
                locale={{
                    emptyText: (
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description="暂无危机案例"
                            style={{ padding: '40px 0' }}
                        />
                    )
                }}
                style={{ 
                    maxHeight: '600px', 
                    overflowY: 'auto',
                    padding: '0 4px'
                }}
            />

            <Modal
                title={
                    <span style={{ color: '#ff4d4f' }}>
                        <WarningOutlined style={{ marginRight: '8px' }} />
                        危机案例详情
                    </span>
                }
                open={detailVisible}
                onCancel={() => setDetailVisible(false)}
                footer={null}
                width={600}
            >
                {selectedCase && (
                    <div>
                        <Divider orientation="left">基本信息</Divider>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Text strong>用户ID：</Text>
                                <Text>{selectedCase.userId}</Text>
                            </Col>
                            <Col span={12}>
                                <Text strong>危险级别：</Text>
                                <Tag color={urgencyLevels[selectedCase.urgencyLevel].color}>
                                    {urgencyLevels[selectedCase.urgencyLevel].label}
                                </Tag>
                            </Col>
                        </Row>
                        
                        <Divider orientation="left">危机内容</Divider>
                        <Paragraph style={{ 
                            background: '#f5f5f5', 
                            padding: '12px', 
                            borderRadius: '8px',
                            border: '1px solid #d9d9d9'
                        }}>
                            {selectedCase.content}
                        </Paragraph>
                    </div>
                )}
            </Modal>
        </Card>
    );
}