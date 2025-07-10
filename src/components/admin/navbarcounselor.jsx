import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import { useNavigate, useLocation } from 'react-router-dom';

export default function NavbarCounselor() {
    const navigate = useNavigate();
    const location = useLocation();
    const [current, setCurrent] = useState(null);

    const items = [
        {
            label: '个人主页',
            key: 'home'
        },
        {
            label: '心理健康统计',
            key: 'stats'
        },
        {
            label: '推送',
            key: 'push'
        }
    ];

    useEffect(() => {
        const path = location.pathname;
        if(path.includes('/psy/home')) {
            setCurrent('home');
        }
        else if(path.includes('/psy/stats')) {
            setCurrent('stats');
        }
        else if(path.includes('/psy/push')) {
            setCurrent('push');
        }
        else {
            setCurrent(null);
        }
    }, [location]);

    const onClick = (e) => {
        switch(e.key) {
            case 'home': {
                navigate(`/psy/home`);
                break;
            }
            case 'stats': {
                navigate(`/psy/stats`);
                break;
            }
            case 'push': {
                navigate(`/psy/push`);
                break;
            }
            default: {
                navigate(`/psy/home`);
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