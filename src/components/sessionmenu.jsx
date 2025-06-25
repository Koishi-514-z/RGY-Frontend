import React, { useState, useEffect } from "react";
import { Menu, Avatar, Space, Typography } from "antd";
import { useNavigate, useParams } from 'react-router-dom';

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

    const getLabel = (user) => {
        <Space>
            <Avatar 
                src={user.avatar} 
                size={48}
                style={{ 
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                }}
            />
            <Text 
                style={{ 
                    fontSize: '16px',
                    display: 'block',
                    marginBottom: '4px'
                }}
            >
                {user.username}
            </Text>
        </Space>
    }

    const items = [];
    for(const sessionTag of sessionTags) {
        items.push({
            key: sessionTag.sessionid,
            label: getLabel(sessionTag.other)
        })
    }

    const onClick = (e) => {
        const clickid = e.key;
        navigate(`/chat/${clickid}`);
    };
    
    return (
        <Menu 
            onClick={onClick} 
            mode="inline" 
            selectedKeys={[current]}
            style={{ 
                borderRight: 0,
                flex: 1
            }}
            items={items} 
        />
    )
}