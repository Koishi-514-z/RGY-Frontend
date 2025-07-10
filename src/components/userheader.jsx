import React, { useEffect, useState } from "react";
import { Typography, Avatar, Space, Dropdown, App } from 'antd';
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { logout } from "../service/user";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

export default function UserHeader({profile}) {
    const navigate = useNavigate();
    const { message } = App.useApp();

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

    const handleMenuClick = async ({key}) => {
        if(profile.role === 0) {
            switch (key) {
                case 'profile': {
                    navigate(`/home?tabKey=${1}`);
                    break;
                }
                case 'settings': {
                    navigate(`/home?tabKey=${3}`);
                    break;
                }
                case 'logout': {
                    const res = await logout();
                    if(!res) {
                        message.error('登出失败');
                    }
                    message.success('登出成功');
                    setTimeout(() => {
                        navigate('/login');
                    }, 1500);
                    break;
                }
                default: {
                    break;
                } 
            }
        }
        else if(profile.role === 1) {
            switch (key) {
                case 'profile': {
                    navigate(`/admin/home?tabKey=${1}`);
                    break;
                }
                case 'settings': {
                    navigate(`/admin/home?tabKey=${3}`);
                    break;
                }
                case 'logout': {
                    const res = await logout();
                    if(!res) {
                        message.error('登出失败');
                    }
                    message.success('登出成功');
                    setTimeout(() => {
                        navigate('/login');
                    }, 1500);
                    break;
                }
                default: {
                    break;
                } 
            }
        }
        else if(profile.role === 2) {
            switch (key) {
                case 'profile': {
                    navigate(`/psy/home?tabKey=${1}`);
                    break;
                }
                case 'settings': {
                    navigate(`/psy/home?tabKey=${3}`);
                    break;
                }
                case 'logout': {
                    const res = await logout();
                    if(!res) {
                        message.error('登出失败');
                    }
                    message.success('登出成功');
                    setTimeout(() => {
                        navigate('/login');
                    }, 1500);
                    break;
                }
                default: {
                    break;
                } 
            }
        }
        else {
            navigate('/notfound');
        }
    };

    const role = profile ? profile.role : 0;

    if(role === 1) {
        return (
            <Dropdown
                menu={{ 
                    items: userMenuItems,
                    onClick: handleMenuClick
                }}
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
                menu={{ 
                    items: userMenuItems,
                    onClick: handleMenuClick
                }}
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
                menu={{ 
                    items: userMenuItems,
                    onClick: handleMenuClick
                }}
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