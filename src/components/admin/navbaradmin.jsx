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