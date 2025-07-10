import React, { useState, useEffect } from "react";
import { Modal, Typography, Space, Avatar, Tag, Divider, Button } from "antd";
import { CalendarOutlined, NotificationOutlined, MessageOutlined, ExclamationCircleOutlined, InfoCircleOutlined, CheckOutlined, BellOutlined, WarningOutlined, ClockCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function NotificationModal({profile, isModelOpen, setIsModelOpen, highPublic, highPrivate}) {
    const now = new Date();
    
    const handleNotShow = () => {
        localStorage.setItem('notificationModal_' + profile.userid, JSON.stringify(now.getTime()));
        setIsModelOpen(false);
    }

    const handleClose = () => {
        setIsModelOpen(false);
    }

    const handleOk = async () => {
        handleClose();
    }

    const getNotificationTypeInfo = (type) => {
        if(type < 100) {
            return { color: '#1890ff', text: '系统', icon: <InfoCircleOutlined /> };
        }
        else if(type < 200) {
            return { color: '#ff4d4f', text: '安全', icon: <ExclamationCircleOutlined /> };
        }
        else if(type < 300) {
            return { color: '#52c41a', text: '更新', icon: <CheckOutlined /> };
        }
        else if(type < 400) {
            return { color: '#722ed1', text: '消息', icon: <MessageOutlined /> };
        }
        else if(type < 500) {
            return { color: '#13c2c2', text: '提醒', icon: <BellOutlined /> };
        }
        else if(type < 600) {
            return { color: '#13c2c2', text: '警告', icon: <WarningOutlined /> };
        }
        else if(type >= 1000) {
            return { color: '#faad14', text: '公告', icon: <NotificationOutlined /> };
        }
        return { color: '#1890ff', text: '系统', icon: <InfoCircleOutlined /> };
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleString('zh-CN', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const renderNotificationItem = (item) => {
        const typeInfo = getNotificationTypeInfo(item.type);
        
        return (
            <div
                key={item.notificationid}
                style={{
                    padding: '12px 16px',
                    background: 'linear-gradient(135deg, #fff8f0 0%, #fff2e8 100%)',
                    border: '1px solid #ffd591',
                    borderRadius: '8px',
                    marginBottom: '8px',
                    position: 'relative'
                }}
            >
                <div style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '3px',
                    background: 'linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%)',
                    borderRadius: '0 0 0 8px'
                }} />
                
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <Avatar
                        size={32}
                        icon={typeInfo.icon}
                        style={{
                            backgroundColor: typeInfo.color,
                            flexShrink: 0
                        }}
                    />
                    
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px',
                            marginBottom: '6px',
                            flexWrap: 'wrap'
                        }}>
                            <Text strong style={{ 
                                fontSize: '14px',
                                color: '#d4380d',
                                lineHeight: '1.2'
                            }}>
                                {item.title}
                            </Text>
                            
                            <Tag 
                                color={typeInfo.color} 
                                style={{ 
                                    fontSize: '10px',
                                    margin: 0,
                                    borderRadius: '8px'
                                }}
                            >
                                {typeInfo.text}
                            </Tag>
                            
                            <Tag 
                                color="red" 
                                style={{ 
                                    fontSize: '10px',
                                    margin: 0,
                                    borderRadius: '8px'
                                }}
                            >
                                重要
                            </Tag>

                            {item.unread && (
                                <div style={{
                                    width: '6px',
                                    height: '6px',
                                    borderRadius: '50%',
                                    backgroundColor: '#ff4d4f',
                                    animation: 'pulse 2s infinite'
                                }} />
                            )}
                        </div>
                        
                        <Text style={{ 
                            fontSize: '13px',
                            color: '#8c4a00',
                            lineHeight: '1.4',
                            display: 'block',
                            marginBottom: '8px'
                        }}>
                            {item.content}
                        </Text>
                        
                        <div style={{ 
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}>
                            <CalendarOutlined style={{ 
                                fontSize: '10px', 
                                color: '#d9d9d9' 
                            }} />
                            <Text style={{ 
                                fontSize: '11px',
                                color: '#bfbfbf'
                            }}>
                                {formatTime(item.timestamp)}
                            </Text>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            <Modal
                title={
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        paddingRight: '24px'
                    }}>
                        <Space>
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <ExclamationCircleOutlined 
                                    style={{ 
                                        color: '#fff', 
                                        fontSize: '16px' 
                                    }} 
                                />
                            </div>
                            <Title level={4} style={{ margin: 0, color: '#d4380d' }}>
                                重要通知
                            </Title>
                        </Space>
                        
                        <Tag color="red" style={{ margin: 0 }}>
                            {(highPublic.length) + (highPrivate.length)} 条
                        </Tag>
                    </div>
                }
                open={isModelOpen}
                onOk={handleOk}
                onCancel={handleClose}
                width={520}
                okText="我知道了"
                cancelText="关闭"
                centered
                footer={[
                    <Button 
                        key="notToday" 
                        icon={<ClockCircleOutlined />}
                        onClick={handleNotShow}
                        style={{
                            color: '#8c8c8c',
                            borderColor: '#d9d9d9'
                        }}
                    >
                        今日不再显示
                    </Button>,
                    <Button key="cancel" onClick={handleClose}>
                        关闭
                    </Button>,
                    <Button key="ok" type="primary" onClick={handleOk}>
                        我知道了
                    </Button>
                ]}
            >
                <div>
                    {highPublic.length > 0 && (
                        <div style={{ marginBottom: '16px' }}>
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '8px',
                                marginBottom: '12px'
                            }}>
                                <NotificationOutlined style={{ 
                                    color: '#faad14', 
                                    fontSize: '16px' 
                                }} />
                                <Text strong style={{ color: '#d4380d' }}>
                                    重要公告
                                </Text>
                                <Tag color="orange" size="small">
                                    {highPublic.length}
                                </Tag>
                            </div>
                            
                            {highPublic.map(item => renderNotificationItem(item))}
                        </div>
                    )}

                    {highPublic.length > 0 && highPrivate.length > 0 && (
                        <Divider style={{ margin: '16px 0' }} />
                    )}

                    {highPrivate.length > 0 && (
                        <div>
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '8px',
                                marginBottom: '12px'
                            }}>
                                <MessageOutlined style={{ 
                                    color: '#722ed1', 
                                    fontSize: '16px' 
                                }} />
                                <Text strong style={{ color: '#d4380d' }}>
                                    重要通知
                                </Text>
                                <Tag color="purple" size="small">
                                    {highPrivate.length}
                                </Tag>
                            </div>
                            
                            {highPrivate.map(item => renderNotificationItem(item))}
                        </div>
                    )}
                </div>

                <style jsx>{`
                    @keyframes pulse {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.3; }
                    }
                `}</style>
            </Modal>
        </div>
    );
}