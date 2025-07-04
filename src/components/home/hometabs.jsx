import React from "react";
import { Tabs, Tooltip } from "antd";
import { UserOutlined, FileTextOutlined, SettingOutlined, HeartOutlined, BarChartOutlined, TeamOutlined } from "@ant-design/icons";

export default function HomeTabs({tabKey, setTabKey, id}) {
    const onChange = (key) => {
        setTabKey(key);
    };

    const items = [
        {
            key: 1,
            label: (
                <span>
                    <UserOutlined style={{ marginRight: 8 }} />
                    个人中心
                </span>
            ),
            disabled: id
        },
        {
            key: 2,
            label: (
                <span>
                    <FileTextOutlined style={{ marginRight: 8 }} />
                    我的博客
                </span>
            ),
        },
        {
            key: 4,
            label: (
                <span>
                    <HeartOutlined style={{ marginRight: 8 }} />
                    心理档案
                </span>
            ),
            disabled: id
        },
        {
            key: 5,
            label: (
                <span>
                    <BarChartOutlined style={{ marginRight: 8 }} />
                    成长轨迹
                </span>
            ),
            disabled: id
        },
        {
            key: 6,
            label: (
                <span>
                    <BarChartOutlined style={{ marginRight: 8 }} />
                    心理咨询
                </span>
            ),
            disabled: id
        },
        {
            key: 3,
            label: (
                <span>
                    <SettingOutlined style={{ marginRight: 8 }} />
                    账户设置
                </span>
            ),
            disabled: id
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