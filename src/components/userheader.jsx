import React, { useEffect, useState } from "react";
import { Typography, Avatar, Space, Dropdown } from 'antd';
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';

const { Text } = Typography;

export default function UserHeader({profile}) {
    const userMenuItems = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: '个人资料',
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: '设置',
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: '退出登录',
            danger: true,
        },
    ];

    const role = profile ? profile.role : 0;

    if(role === 1) {
        return (
            <Dropdown
                menu={{ items: userMenuItems }}
                placement="bottomRight"
                trigger={['click']}
            >
                <Space style={{ cursor: 'pointer', color: '#fff' }}>
                    <Avatar 
                        size={32} 
                        icon={<UserOutlined />}
                        src={profile ? profile.avatar : undefined}
                        style={{ backgroundColor: '#fff', color: '#1890ff' }}
                    />
                    <Text style={{ color: '#fff' }}>Admin</Text>
                </Space>
            </Dropdown>
        )
    }

    else if(role === 2) {
        return (
            <Dropdown
                menu={{ items: userMenuItems }}
                placement="bottomRight"
                trigger={['click']}
            >
                <Space style={{ cursor: 'pointer', color: '#fff' }}>
                    <Avatar 
                        size={32} 
                        icon={<UserOutlined />}
                        src={profile ? profile.avatar : undefined}
                        style={{ backgroundColor: '#fff', color: '#722ed1' }}
                    />
                    <Text style={{ color: '#fff' }}>
                        {profile ? profile.username : '咨询师'}
                    </Text>
                </Space>
            </Dropdown>
        )
    }

    else {
        return (
            <Dropdown
                menu={{ items: userMenuItems }}
                placement="bottomRight"
                trigger={['click']}
            >
                <Space style={{ cursor: 'pointer', color: '#fff' }}>
                    <Avatar 
                        size={32} 
                        icon={<UserOutlined />}
                        src={profile ? profile.avatar : undefined}
                        style={{ backgroundColor: '#fff', color: '#1890ff' }}
                    />
                    <Text style={{ color: '#fff' }}>
                        {profile ? profile.username : '用户'}
                    </Text>
                </Space>
            </Dropdown>
        )
    }
}