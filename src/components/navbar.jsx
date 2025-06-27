import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [current, setCurrent] = useState(null);

    const items = [
        {
            label: '个人主页',
            key: 'home'
        },
        {
            label: '每日情绪',
            key: 'emotion'
        },
        {
            label: '树洞社区',
            key: 'community'
        },
        {
            label: 'AI助手',
            key: 'AIassistant'
        }
    ];

    useEffect(() => {
        const path = location.pathname;
        if (path === '/home') {
            setCurrent('home');
        }
        else if (path.includes('/emotion')) {
            setCurrent('emotion');
        }
        else if (path.includes('/community')) {
            setCurrent('community');
        }
        else if (path.includes('AIassistant')) {
            setCurrent('AIassistant');
        }
        else {
            setCurrent(null);
        }
    }, [location]);

    const onClick = (e) => {
        switch(e.key) {
            case 'home': {
                navigate(`/home`);
                break;
            }
            case 'emotion': {
                navigate(`/emotion`);
                break;
            }
            case 'community': {
                navigate(`/community`);
                break;
            }
            case 'AIassistant': {
                navigate(`/AIassistant`);
                break;
            }
            default: {
                navigate(`/home`);
                break;
            }
        }
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