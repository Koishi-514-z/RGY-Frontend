import React, { useState, useEffect } from "react";
import { Tabs } from "antd";

export default function HomeTabs({tabKey, setTabKey, id}) {
    const onChange = (key) => {
        setTabKey(key);
    }

    const items = [
        {
            key: 1,
            label: 'Profiles',
            disabled: id
        },
        {
            key: 2,
            label: 'Blogs',
        },
        {
            key: 3,
            label: 'Settings',
            disabled: id
        }
    ];

    return (
        <Tabs activeKey={tabKey} items={items} onChange={onChange} />
    )
}