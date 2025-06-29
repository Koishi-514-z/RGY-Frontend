import React, { useState, useEffect } from "react";
import { Tabs } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import TabPane from 'antd/es/tabs/TabPane';

export default function AISessionTabs({activeTab, handleTabChange}) {
    return (
        <Tabs 
            activeKey={activeTab} 
            onChange={handleTabChange}
            style={{ marginBottom: '24px' }}
        >
            <TabPane 
                tab={
                    <span>
                        <CalendarOutlined /> 倾听模式
                    </span>
                } 
                key="hearing"
            />
            <TabPane 
                tab={
                    <span>
                        <CalendarOutlined /> 引导模式
                    </span>
                } 
                key="acting"
            />
        </Tabs>
    )
}
