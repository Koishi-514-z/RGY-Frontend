import React from "react";
import { Tabs, Tooltip } from "antd";
import { UserOutlined, FileTextOutlined, SettingOutlined, HeartOutlined, BarChartOutlined } from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";

export default function PsyHomeTabs() {
    const [searchParams, setSearchParams] = useSearchParams();
    const tabKey = parseInt(searchParams.get('tabKey'));

    const onChange = (key) => {
        setSearchParams({tabKey: key});
    };

    const items = [
        {
            key: 1,
            label: (
                <span>
                    <UserOutlined style={{ marginRight: 8 }} />
                    个人中心
                </span>
            )
        },
        {
            key: 2,
            label: (
                <span>
                    <FileTextOutlined style={{ marginRight: 8 }} />
                    心理咨询
                </span>
            )
        },
        {
            key: 4,
            label: (
                <span>
                    <FileTextOutlined style={{ marginRight: 8 }} />
                    危机干预
                </span>
            )
        },
        {
            key: 7,
            label: (
                <span>
                    <BarChartOutlined style={{ marginRight: 8 }} />
                    我的通知
                </span>
            )
        },
        {
            key: 3,
            label: (
                <span>
                    <SettingOutlined style={{ marginRight: 8 }} />
                    个人信息编辑
                </span>
            )
        }
    ];

    return (
        <Tabs 
            activeKey={tabKey} 
            items={items} 
            onChange={onChange}
            size="middle"
            tabBarGutter={24}
            animated={{ tabPane: true }}
        />
    );
}