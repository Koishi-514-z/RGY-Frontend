import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import { useNavigate, useLocation } from 'react-router-dom';

export default function NavbarAdmin() {
    const navigate = useNavigate();
    const location = useLocation();
    const [current, setCurrent] = useState(null);

    const items = [
        {
            label: '用户管理',
            key: 'usermanagement'
        },
        {
            label: '帖子管理',
            key: 'blogmanagement'
        },
        {
            label: '违规审核',
            key: 'review'
        },
        {
            label: '危机审核',
            key: 'crisis'
        },
        {
            label: '历史通知',
            key: 'history'
        }
    ];

    useEffect(() => {
        const path = location.pathname;
        if(path.includes('/admin/usermanagement')) {
            setCurrent('usermanagement');
        }
        else if(path.includes('/admin/blogmanagement')) {
            setCurrent('blogmanagement');
        }
        else if(path.includes('/admin/review')) {
            setCurrent('review');
        }
        else if(path.includes('/admin/crisis')) {
            setCurrent('crisis');
        }
        else if(path.includes('/admin/history')) {
            setCurrent('history');
        }
        else {
            setCurrent(null);
        }
    }, [location]);

    const onClick = (e) => {
        switch(e.key) {
            case 'usermanagement': {
                navigate(`/admin/usermanagement`);
                break;
            }
            case 'blogmanagement': {
                navigate(`/admin/blogmanagement`);
                break;
            }
            case'review': {
                navigate(`/admin/review`);
                break;
            }
            case 'crisis': {
                navigate(`/admin/crisis`);
                break;
            }
            case 'history': {
                navigate(`/admin/history`);
                break;
            }
            default: {
                navigate(`/admin/usermanagement`);
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