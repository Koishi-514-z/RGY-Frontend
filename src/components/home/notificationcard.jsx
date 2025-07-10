import React, { useState, useEffect } from "react";
import { Card, Tabs, List, Avatar, Space, Badge, Button, Typography, Tag, Empty, Tooltip, Divider, App, Popconfirm } from "antd";
import { BellOutlined, NotificationOutlined, MessageOutlined, EyeOutlined, DeleteOutlined, SettingOutlined, CheckOutlined, ClearOutlined, ExclamationCircleOutlined, InfoCircleOutlined, WarningOutlined } from "@ant-design/icons";
import { getPrivateNotification, markRead, markAllRead, deleteNotification, markPublicRead, markAllPublicRead, getNotification, markAllPrivateRead } from "../../service/notification";

const { Text, Title } = Typography;
const { TabPane } = Tabs;

export default function NotificationCard({ privateNotifications, publicNotifications, fetchNotification }) {
    const [activeTab, setActiveTab] = useState("public");
    const { message, modal } = App.useApp();

    const unreadPrivate = privateNotifications.filter(item => item.unread).length;
    const unreadPublic = publicNotifications.filter(item => item.unread).length;

    const markAsRead = async (notificationid) => {
        const res = await markRead(notificationid);
        if (!res) {
            message.error('标记已读失败');
            return;
        }
        message.success('已标记为已读');
        fetchNotification();
    };

    const markAllPrivateAsRead = async () => {
        if(unreadPrivate === 0) {
            message.info('暂无未读通知');
            return;
        }
        
        const res = await markAllPrivateRead();
        if (!res) {
            message.error('批量标记失败');
            return;
        }
        message.success(`已将 ${unreadPrivate} 条通知标记为已读`);
        fetchNotification();
    };

    const markAllPublicAsRead = async () => {
        if(unreadPublic === 0) {
            message.info('暂无未读公告');
            return;
        }
        
        const res = await markAllPublicRead();
        if (!res) {
            message.error('批量标记失败');
            return;
        }
        message.success(`已将 ${unreadPublic} 条公告标记为已读`);
        fetchNotification();
    };

    const handleDelete = async (notificationid) => {
        const res = await deleteNotification(notificationid);
        if (!res) {
            message.error('删除失败');
            return;
        }
        message.success('通知已删除');
        fetchNotification();
    };

    const clearReadNotifications = () => {
        const readNotifications = privateNotifications.filter(item => !item.unread);
        if(readNotifications.length === 0) {
            message.info('暂无已读通知');
            return;
        }

        modal.confirm({
            title: '确认清空已读通知',
            icon: <ExclamationCircleOutlined />,
            content: `您将清空 ${readNotifications.length} 条已读通知，此操作不可恢复。`,
            okText: '确认清空',
            cancelText: '取消',
            okType: 'danger',
            onOk: async () => {
                for(const notification of readNotifications) {
                    const res = await deleteNotification(notification.notificationid);
                    if(!res) {
                        message.error('删除失败');
                        return;
                    }
                }
                message.success('已清空所有已读通知');
                fetchNotification();
            }
        });
    };

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

    const getPriorityStyle = (priority) => {
        if(priority === 'high') {
            return { color: '#ff4d4f', fontWeight: 'bold' };
        } 
        else if(priority === 'medium') {
            return { color: '#faad14', fontWeight: 'normal' };
        }
        return { color: '#52c41a', fontWeight: 'normal' };
    };

    const formatTime = (timestamp) => {
        const now = new Date();
        const time = new Date(timestamp);
        const diffInHours = (now - time) / (1000 * 60 * 60);
        
        if(diffInHours < 1) {
            return '刚刚';
        } 
        else if(diffInHours < 24) {
            return `${Math.floor(diffInHours)} 小时前`;
        } 
        else if(diffInHours < 48) {
            return '昨天';
        } 
        else {
            return time.toLocaleDateString();
        }
    };

    const renderNotificationItem = (item, type) => {
        const typeInfo = getNotificationTypeInfo(item.type);
        const isPrivate = type === 'private';
        
        return (
            <List.Item
                key={item.notificationid}
                style={{
                    padding: '16px',
                    background: item.unread ? '#f6ffed' : '#fff',
                    border: item.unread ? '1px solid #b7eb8f' : '1px solid #f0f0f0',
                    borderRadius: '8px',
                    marginBottom: '8px',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden'
                }}
                actions={[
                    item.unread && (
                        <Tooltip title="标记为已读">
                            <Button
                                type="text"
                                icon={<EyeOutlined />}
                                size="small"
                                onClick={() => markAsRead(item.notificationid)}
                                style={{ color: '#52c41a' }}
                            />
                        </Tooltip>
                    ),
                    isPrivate && (
                        <Popconfirm
                            title="确定要删除这条通知吗？"
                            onConfirm={() => handleDelete(item.notificationid)}
                            okText="确定"
                            cancelText="取消"
                        >
                            <Tooltip title="删除">
                                <Button
                                    type="text"
                                    icon={<DeleteOutlined />}
                                    size="small"
                                    style={{ color: '#ff4d4f' }}
                                />
                            </Tooltip>
                        </Popconfirm>
                    )
                ].filter(Boolean)}
            >
                {item.priority === 'high' && (
                    <div style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: '4px',
                        background: 'linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%)'
                    }} />
                )}
                
                <List.Item.Meta
                    avatar={
                        <div style={{ position: 'relative' }}>
                            <Avatar
                                icon={typeInfo.icon}
                                style={{
                                    backgroundColor: typeInfo.color,
                                    border: '2px solid #fff',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                }}
                            />
                            {item.unread !== 0 && (
                                <div style={{
                                    position: 'absolute',
                                    top: -2,
                                    right: -2,
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    backgroundColor: '#ff4d4f',
                                    border: '1px solid #fff',
                                    animation: 'pulse 2s infinite'
                                }} />
                            )}
                        </div>
                    }
                    title={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <Text strong style={{ 
                                fontSize: '14px',
                                color: !item.unread ? '#595959' : '#262626',
                                ...getPriorityStyle(item.priority)
                            }}>
                                {item.title}
                            </Text>
                            
                            <Tag 
                                color={typeInfo.color} 
                                style={{ 
                                    fontSize: '10px',
                                    margin: 0,
                                    borderRadius: '10px'
                                }}
                            >
                                {typeInfo.text}
                            </Tag>
                            
                            {item.priority === 'high' && (
                                <Badge status="error" text="重要" style={{ fontSize: '10px' }} />
                            )}
                            
                            {!item.unread && (
                                <Tag color="default" style={{ fontSize: '10px', margin: 0 }}>
                                    已读
                                </Tag>
                            )}
                        </div>
                    }
                    description={
                        <div style={{ marginTop: '4px' }}>
                            <Text 
                                style={{ 
                                    fontSize: '13px',
                                    lineHeight: '1.4',
                                    color: !item.unread ? '#8c8c8c' : '#595959',
                                    display: 'block',
                                    marginBottom: '8px'
                                }}
                            >
                                {item.content}
                            </Text>
                            
                            <div style={{ 
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <Text style={{ 
                                    fontSize: '11px',
                                    color: '#bfbfbf'
                                }}>
                                    {formatTime(item.timestamp)}
                                </Text>
                            </div>
                        </div>
                    }
                />
            </List.Item>
        );
    };

    return (
        <Card
            title={
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Space>
                        <BellOutlined style={{ color: '#1890ff', fontSize: '18px' }} />
                        <Title level={4} style={{ margin: 0 }}>通知消息</Title>
                        {(unreadPublic + unreadPrivate > 0) && (
                            <Badge 
                                count={unreadPublic + unreadPrivate} 
                                style={{ 
                                    backgroundColor: '#ff4d4f',
                                    boxShadow: '0 0 0 1px #fff'
                                }} 
                            />
                        )}
                    </Space>
                    <Tooltip title="通知设置">
                        <Button
                            type="text"
                            icon={<SettingOutlined />}
                            size="small"
                            style={{ color: '#8c8c8c' }}
                        />
                    </Tooltip>
                </div>
            }
            style={{
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                borderRadius: '12px',
                overflow: 'hidden',
                marginBottom: '24px'
            }}
        >
            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                style={{ marginTop: '-8px' }}
            >
                <TabPane
                    tab={
                        <Space>
                            <NotificationOutlined />
                            <span>公告</span>
                            {unreadPublic > 0 && (
                                <Badge
                                    count={unreadPublic}
                                    size="small"
                                    style={{ backgroundColor: '#1890ff' }}
                                />
                            )}
                        </Space>
                    }
                    key="public"
                >
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {publicNotifications && publicNotifications.length > 0 ? (
                            <List
                                dataSource={publicNotifications}
                                renderItem={(item) => renderNotificationItem(item, 'public')}
                                style={{ background: 'transparent' }}
                            />
                        ) : (
                            <Empty
                                description="暂无公告"
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                style={{ margin: '40px 0' }}
                            />
                        )}
                    </div>
                </TabPane>

                <TabPane
                    tab={
                        <Space>
                            <MessageOutlined />
                            <span>私有通知</span>
                            {unreadPrivate > 0 && (
                                <Badge
                                    count={unreadPrivate}
                                    size="small"
                                    style={{ backgroundColor: '#722ed1' }}
                                />
                            )}
                        </Space>
                    }
                    key="private"
                >
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {privateNotifications && privateNotifications.length > 0 ? (
                            <List
                                dataSource={privateNotifications}
                                renderItem={(item) => renderNotificationItem(item, 'private')}
                                style={{ background: 'transparent' }}
                            />
                        ) : (
                            <Empty
                                description="暂无私有通知"
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                style={{ margin: '40px 0' }}
                            />
                        )}
                    </div>
                </TabPane>
            </Tabs>

            <Divider style={{ margin: '16px 0 12px' }} />
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                    {activeTab === 'public' 
                        ? `共 ${publicNotifications?.length || 0} 条公告，${unreadPublic} 条未读`
                        : `共 ${privateNotifications?.length || 0} 条通知，${unreadPrivate} 条未读`
                    }
                </Text>
                
                <Space size={8}>
                    {activeTab === 'public' ? (
                        <Button 
                            type="link" 
                            size="small" 
                            style={{ fontSize: '12px' }}
                            disabled={unreadPublic === 0}
                            onClick={markAllPublicAsRead}
                            icon={<CheckOutlined />}
                        >
                            全部已读
                        </Button>
                    ) : (
                        <>
                            <Button 
                                type="link" 
                                size="small" 
                                style={{ fontSize: '12px' }}
                                disabled={unreadPrivate === 0}
                                onClick={markAllPrivateAsRead}
                                icon={<CheckOutlined />}
                            >
                                全部已读
                            </Button>
                            <Button 
                                type="link" 
                                size="small" 
                                style={{ fontSize: '12px' }}
                                onClick={clearReadNotifications}
                                icon={<ClearOutlined />}
                            >
                                清空已读
                            </Button>
                        </>
                    )}
                </Space>
            </div>

            <style jsx>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
        </Card>
    );
}