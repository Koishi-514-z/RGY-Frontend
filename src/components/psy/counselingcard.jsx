import React, { useState, useEffect } from "react";
import { Card, Space, Tabs } from "antd";
import TimeSelector from "./timeselector";
import TabPane from "antd/es/tabs/TabPane";
import { MessageOutlined, NotificationOutlined } from "@ant-design/icons";
import CounselingView from "./counselingviewcard";

export default function CounselingCard({availableTimes, setAvailableTimes, counseling}) {
    const [activeTab, setActiveTab] = useState("select");

    return (
        <Card
            style={{
                background: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
                border: '1px solid #d3adf7',
                borderRadius: '16px',
                boxShadow: '0 8px 24px rgba(114, 46, 209, 0.12)'
            }}
        >
            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                style={{ marginTop: '-8px' }}
            >
                <TabPane
                    tab={
                        <Space>
                            <NotificationOutlined />
                            <span>预约时间选择</span>
                        </Space>
                    }
                    key="select"
                >
                    <TimeSelector availableTimes={availableTimes} setAvailableTimes={setAvailableTimes} />
                </TabPane>

                <TabPane
                    tab={
                        <Space>
                            <MessageOutlined />
                            <span>预约记录</span>
                        </Space>
                    }
                    key="view"
                >
                    <CounselingView counseling={counseling} />
                </TabPane>
            </Tabs>
        </Card>
    )
}