import React, { useState, useEffect } from "react";
import { Button, Menu, Popover } from "antd";
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { DeleteOutlined, EllipsisOutlined } from "@ant-design/icons";

export default function AISessionMenu({AIsessions, handleDelete}) {
    const navigate = useNavigate();
    const {sessionid} = useParams();
    const [current, setCurrent] = useState(null);
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('activeTab');

    const calculateGroup = (AIsession) => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); 
        const sessionDate = new Date(AIsession.timestamp);
        const sessionDay = new Date(sessionDate.getFullYear(), sessionDate.getMonth(), sessionDate.getDate());

        const diffTime = today.getTime() - sessionDay.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if(diffDays === 0) {
            return 0;
        }
        else if(diffDays === 1) {
            return 1;
        }
        else if(diffDays <= 7) {
            return 2;
        }
        else {
            return 3;
        }
    }

    const items = [
        {
            key: 'group0',
            label: 'Today',
            type: 'group',
            children: []
        },
        {
            key: 'group1',
            label: 'Yesterday',
            type: 'group',
            children: []
        },
        {
            key: 'group2',
            label: 'Previous 7 Days',
            type: 'group',
            children: []
        },
        {
            key: 'group3',
            label: 'Before 7 Days',
            type: 'group',
            children: []
        }
    ];

    for(const AIsession of AIsessions) {
        const groupNumber = calculateGroup(AIsession);
        let title = '新会话';
        const targ = AIsession.messages.find(msg => msg.role === 'user');
        if(targ) {
            title = targ.content;
        }
        items[groupNumber].children.push({
            key: AIsession.sessionid,
            label: (
                <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 8,
                width: '100%'
            }}>
                <span style={{
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}>
                    {title}
                </span>
                <Popover
                    trigger="click"
                    placement="bottom"
                    content={
                        <Button
                            type="text"
                            icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />}
                            size="small"
                            style={{ width: 80, textAlign: 'left' }}
                            onClick={e => {
                                e.stopPropagation();
                                handleDelete(AIsession.sessionid);
                            }}
                        >
                            删除
                        </Button>
                    }
                >
                    <Button
                        type="text"
                        icon={<EllipsisOutlined style={{ fontSize: 18 }} />}
                        size="small"
                        style={{ marginLeft: 4 }}
                        onClick={e => e.stopPropagation()}
                    />
                </Popover>
            </div>
            )
        });
    }

    useEffect(() => {
        if(sessionid) {
            setCurrent(sessionid);
        }
    }, [sessionid]);

    const onClick = (e) => {
        const clickid = e.key;
        navigate(`/AIassistant/${clickid}?activeTab=${activeTab}`);
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