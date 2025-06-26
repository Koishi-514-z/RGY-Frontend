import React, { useState, useEffect } from "react";
import { Menu, Avatar, Typography } from "antd";
import { useNavigate, useParams } from 'react-router-dom';
import { UserOutlined, MessageOutlined } from "@ant-design/icons";

const { Text } = Typography;

export default function SessionMenu({sessionTags}) {
    const navigate = useNavigate();
    const {sessionid} = useParams();
    const [current, setCurrent] = useState(null);

    useEffect(() => {
        if(sessionid) {
            setCurrent(sessionid);
        }
    }, [sessionid]);


    const getLabel = (user) => (
        <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '8px 0',
            width: '100%'
        }}>
            <Avatar 
                src={user.avatar} 
                icon={<UserOutlined style={{ fontSize: '20px' }} />}
                size={50}
                style={{ 
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                    marginRight: '12px',
                    flexShrink: 0
                }}
            />
            <div style={{ flex: 1, overflow: 'hidden' }}>
                <Text 
                    strong
                    style={{ 
                        fontSize: '16px',
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
        label: getLabel(sessionTag.other),
        icon: <MessageOutlined style={{ fontSize: '14px' }} />,
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
                <div style={{ padding: '20px 0', textAlign: 'center' }}>
                    <Text type="secondary">暂无聊天记录</Text>
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
            borderRight: '1px solid #f0f0f0'
        }}>
            <div style={{ 
                padding: '16px 16px 12px',
                borderBottom: '1px solid #f0f0f0'
            }}>
                <Text strong style={{ fontSize: '16px' }}> 会话列表 </Text>
            </div>
            
            <Menu 
                onClick={onClick} 
                mode="inline" 
                selectedKeys={[current]}
                size="large"
                style={{ 
                    borderRight: 0,
                    flex: 1,
                    overflowY: 'auto',
                    overflowX: 'hidden'
                }}
                items={items}
            />
        </div>
    );
}