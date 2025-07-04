import React, { useState, useEffect } from "react";
import { Space, Button, Tooltip, Avatar, Empty, Typography } from "antd";
import { UserOutlined, PhoneOutlined, VideoCameraOutlined, MoreOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function ChatHeader({session}) {
    const OnlineStatus = ({ status = 'online' }) => {
        const colors = {
            online: '#52c41a',
            away: '#faad14', 
            offline: '#8c8c8c'
        };
        
        return (
            <div style={{
                position: 'absolute',
                bottom: 2,
                right: 2,
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: colors[status],
                border: '2px solid #fff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
            }} />
        );
    };

    if(!session) {
        return (
            <div style={{
                padding: '16px 20px',
                background: '#fff',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Empty 
                    description="选择一个会话开始聊天"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    style={{ margin: 0 }}
                />
            </div>
        );
    }

    return (
        <div style={{
            padding: '16px 20px',
            background: '#fff',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        }}>
            <Space size={12}>
                <div style={{ position: 'relative' }}>
                    <Avatar 
                        size={40} 
                        src={session.other ? session.other.avatar : null}
                        icon={<UserOutlined />}
                        style={{ backgroundColor: '#1890ff' }}
                    />
                    <OnlineStatus status="online" />
                </div>
                
                <div>
                    <Title level={5} style={{ margin: 0, lineHeight: 1.2 }}>
                        {session.other ? session.other.username : '未知用户'}
                    </Title>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        在线
                    </Text>
                </div>
            </Space>
            
            <Space size={8}>
                <Tooltip title="语音通话">
                    <Button 
                        type="text" 
                        icon={<PhoneOutlined />}
                        style={{ color: '#52c41a' }}
                    />
                </Tooltip>
                
                <Tooltip title="视频通话">
                    <Button 
                        type="text" 
                        icon={<VideoCameraOutlined />}
                        style={{ color: '#1890ff' }}
                    />
                </Tooltip>
                
                <Tooltip title="更多">
                    <Button 
                        type="text" 
                        icon={<MoreOutlined />}
                        style={{ color: '#8c8c8c' }}
                    />
                </Tooltip>
            </Space>
        </div>
    );
}