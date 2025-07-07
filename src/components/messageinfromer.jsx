import React, { useEffect, useState } from "react";
import { Badge, Button, Tooltip } from 'antd';
import { BellOutlined } from "@ant-design/icons";
import { getPrivateNotification, getPublicNotification } from "../service/notification";
import { useNavigate } from "react-router-dom";

export default function MessageInfromer({role}) {
    const [privateNotifications, setPrivateNotifications] = useState([]); 
    const [publicNotifications, setPublicNotifications] = useState([]); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetch = async () => {
            const fetched_notifications_private = await getPrivateNotification();
            const fetched_notifications_public = await getPublicNotification();
            setPrivateNotifications(fetched_notifications_private);
            setPublicNotifications(fetched_notifications_public);
        }
        fetch();
    }, []);

    const handleClick = () => {
        if(role === 0) {
            navigate(`/home?tabKey=${7}`);
        }
        else if(role === 1) {
            navigate(`/admin/home?tabKey=${7}`);
        }
        else if(role === 2) {
            navigate(`/psy/home?tabKey=${7}`);
        }
        else {
            navigate(`/notfound`);
        }
    }

    const unreadOrHighprivate = privateNotifications.filter(item => item.priority === 'high' || item.unread).length;
    const highPublic = publicNotifications.filter(item => item.priority === 'high').length;

    return (
        <Tooltip title="通知消息">
            <Badge count={unreadOrHighprivate + highPublic} size="small">
                <Button 
                    type="text" 
                    icon={<BellOutlined />} 
                    onClick={handleClick}
                    style={{ 
                        color: '#fff',
                        border: '2px solid rgba(255, 255, 255, 0.6)', 
                        borderRadius: '6px',
                        padding: '4px 8px'
                    }}
                />
            </Badge>
        </Tooltip>
    )
}