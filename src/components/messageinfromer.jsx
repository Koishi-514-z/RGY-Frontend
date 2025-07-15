import React, { useEffect, useState } from "react";
import { Badge, Button, Tooltip } from 'antd';
import { BellOutlined } from "@ant-design/icons";
import { getNotification } from "../service/notification";
import { useNavigate } from "react-router-dom";

export default function MessageInfromer({role}) {
    const [privateNotifications, setPrivateNotifications] = useState([]); 
    const [publicNotifications, setPublicNotifications] = useState([]); 
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchNotification = async () => {
            const fetched_notification = await getNotification();
            const fetched_private = fetched_notification.filter(notify => notify.type < 1000);
            const fetched_public = fetched_notification.filter(notify => notify.type >= 1000);
            setPrivateNotifications(fetched_private);
            setPublicNotifications(fetched_public);
        }
        fetchNotification();
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

    const unreadPrivate = privateNotifications.filter(item => item.unread).length;
    const unreadPublic = publicNotifications.filter(item => item.unread).length;

    return (
        <Tooltip title="通知消息">
            <Badge count={unreadPrivate + unreadPublic} size="small">
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