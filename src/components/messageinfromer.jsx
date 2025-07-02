import React, { useEffect, useState } from "react";
import { Badge, Button, Tooltip } from 'antd';
import { BellOutlined } from "@ant-design/icons";

export default function MessageInfromer() {
    const [notifications, setNotifications] = useState(3); 

    return (
        <Tooltip title="通知消息">
            <Badge count={notifications} size="small">
                <Button 
                    type="text" 
                    icon={<BellOutlined />} 
                    style={{ color: '#fff' }}
                />
            </Badge>
        </Tooltip>
    )
}