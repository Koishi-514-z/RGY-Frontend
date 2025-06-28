import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import { useNavigate, useLocation } from 'react-router-dom';

export default function NavbarCounselor() {
    const navigate = useNavigate();
    const location = useLocation();
    const [current, setCurrent] = useState(null);

    const items = [
        {
            label: '心理健康统计',
            key: 'stats'
        },
        {
            label: '心理记录',
            key: 'consult'
        },
        {
            label: '推送',
            key: 'push'
        }
    ];

    useEffect(() => {
        const path = location.pathname;
        if(path.includes('/admin/stats')) {
            setCurrent('stats');
        }
        else if(path.includes('/admin/consult')) {
            setCurrent('consult');
        }
        else if(path.includes('/admin/push')) {
            setCurrent('push');
        }
        else {
            setCurrent(null);
        }
    }, [location]);

    const onClick = (e) => {
        switch(e.key) {
            case 'stats': {
                navigate(`/admin/stats`);
                break;
            }
            case 'consult': {
                navigate(`/admin/consult`);
                break;
            }
            case 'push': {
                navigate(`/admin/push`);
                break;
            }
            default: {
                navigate(`/admin/stats`);
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