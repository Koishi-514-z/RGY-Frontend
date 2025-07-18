import React, { useState, useEffect } from "react";
import { Menu, Avatar, Typography, Badge, Button, Modal, Input, App } from "antd";
import { useNavigate, useParams } from 'react-router-dom';
import { UserOutlined, PlusOutlined } from "@ant-design/icons";
import { getSessionid, createSession } from "../../service/chat";

const { Text } = Typography;

export default function SessionMenu({sessionTags}) {
    const navigate = useNavigate();
    const {sessionid} = useParams();
    const [current, setCurrent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [targetUserId, setTargetUserId] = useState('');
    const [loading, setLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const { message } = App.useApp();

    // 监听屏幕尺寸变化
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if(sessionid) {
            setCurrent(sessionid);
        }
    }, [sessionid]);

    const handleCreate = async (userid) => {
        if (!userid || !userid.trim()) {
            message.error('请输入有效的用户ID');
            return;
        }

        setLoading(true);

        let newSessionid = await getSessionid(userid.trim());
        if(!newSessionid) {
            newSessionid = await createSession(userid.trim());
            if(!newSessionid) {
                message.error('创建会话失败，请检查网络或用户ID是否正确');
                setLoading(false);
                return;
            }
            message.success('会话创建成功');
        }
        else {
            message.info('会话已存在');
        }
        navigate(`/chat/${newSessionid}`);
        setIsModalOpen(false);
        setTargetUserId('');

        setLoading(false);
    }

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        handleCreate(targetUserId);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setTargetUserId('');
    };

    const getLabel = (user, unread) => (
        <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: isMobile ? '6px 0' : '8px 0',
            width: '100%'
        }}>
            <Badge
                count={unread}
                offset={[-16, 8]} 
                style={{ 
                    backgroundColor: '#1890ff',
                    boxShadow: '0 0 0 1px #fff'
                }}
            >
                <Avatar 
                    src={user.avatar} 
                    icon={<UserOutlined style={{ fontSize: isMobile ? '16px' : '20px' }} />}
                    size={isMobile ? 40 : 50}
                    style={{ 
                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                        marginRight: isMobile ? '12px' : '16px',
                        flexShrink: 0
                    }}
                />
            </Badge>
            <div style={{ flex: 1, overflow: 'hidden' }}>
                <Text 
                    strong
                    style={{ 
                        fontSize: isMobile ? '14px' : '16px',
                        display: 'block',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginTop: '4px'
                    }}
                >
                    {user.username}
                </Text>
            </div>
        </div>
    );

    const items = sessionTags.map(sessionTag => ({
        key: sessionTag.sessionid,
        label: getLabel(sessionTag.other, sessionTag.unread),
        style: { height: 'auto' }
    }));

    const onClick = (e) => {
        const clickid = e.key;
        navigate(`/chat/${clickid}`);
    };
    
    if (items.length === 0) {
        items.push({
            key: 'empty',
            label: (
                <div style={{ 
                    padding: isMobile ? '16px 0' : '20px 0', 
                    textAlign: 'center' 
                }}>
                    <Text type="secondary" style={{ fontSize: isMobile ? '13px' : '14px' }}>
                        暂无聊天记录
                    </Text>
                </div>
            ),
            disabled: true
        });
    }
    
    return (
        <div style={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            borderRight: isMobile ? 'none' : '1px solid #f0f0f0'
        }}>
            <div style={{ 
                padding: isMobile ? '12px 12px 8px' : '16px 16px 12px',
                borderBottom: '1px solid #f0f0f0',
                background: '#fff'
            }}>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: isMobile ? '8px' : '12px'
                }}>
                    <Text strong style={{ 
                        fontSize: isMobile ? '14px' : '16px' 
                    }}>
                        会话列表
                    </Text>
                    <Button
                        type="default"
                        size={isMobile ? "small" : "middle"}
                        icon={<PlusOutlined />}
                        onClick={showModal}
                        style={{
                            borderRadius: '6px',
                            fontSize: isMobile ? '12px' : '14px',
                            height: isMobile ? '28px' : '32px',
                            padding: isMobile ? '0 8px' : '0 12px'
                        }}
                    />
                </div>
            </div>
            
            <Menu 
                onClick={onClick} 
                mode="inline" 
                selectedKeys={[current]}
                size={isMobile ? "middle" : "large"}
                style={{ 
                    borderRight: 0,
                    flex: 1,
                    overflowY: 'auto',
                    overflowX: 'hidden'
                }}
                items={items}
            />

            <Modal
                title={
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        fontSize: isMobile ? '16px' : '18px'
                    }}>
                        <PlusOutlined style={{ 
                            marginRight: '8px', 
                            color: '#1890ff',
                            fontSize: isMobile ? '16px' : '18px'
                        }} />
                        创建新会话
                    </div>
                }
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                confirmLoading={loading}
                okText="创建"
                cancelText="取消"
                width={isMobile ? '90%' : 400}
                centered={isMobile}
                styles={{
                    body: { 
                        padding: isMobile ? '16px' : '24px' 
                    }
                }}
            >
                <div style={{ margin: isMobile ? '16px 0' : '20px 0' }}>
                    <Text style={{ 
                        display: 'block', 
                        marginBottom: '12px',
                        color: '#595959',
                        fontSize: isMobile ? '13px' : '14px'
                    }}>
                        请输入要聊天的用户ID：
                    </Text>
                    <Input
                        placeholder="输入用户ID"
                        value={targetUserId}
                        onChange={(e) => setTargetUserId(e.target.value)}
                        onPressEnter={handleOk}
                        size={isMobile ? "middle" : "large"}
                        style={{
                            borderRadius: '6px',
                            fontSize: isMobile ? '14px' : '16px'
                        }}
                        prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                    />
                    <Text type="secondary" style={{ 
                        fontSize: isMobile ? '11px' : '12px',
                        display: 'block',
                        marginTop: '8px'
                    }}>
                        提示：输入对方的用户ID即可开始聊天
                    </Text>
                </div>
            </Modal>
        </div>
    );
}