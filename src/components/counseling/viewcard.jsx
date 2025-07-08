import React, { useState, useEffect } from "react";
import { Card, Space, Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import { MessageOutlined, NotificationOutlined } from "@ant-design/icons";
import CounselingViewCard from "./counselingviewcard";
import MyCousnelingCard from "./mycounselingcard";

export default function ViewCard({psyProfiles, counseling, setPsyProfiles}) {
    const [activeTab, setActiveTab] = useState("browse");

    return (
        <Card 
            style={{ 
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 50%, #f6ffed 100%)',
                border: '1px solid rgba(24, 144, 255, 0.15)',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(24, 144, 255, 0.12)',
                position: 'relative',
                width: '100%',
                maxWidth: '1200px'
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
                            <span>心理咨询中心</span>
                        </Space>
                    }
                    key="browse"
                >
                    <CounselingViewCard psyProfiles={psyProfiles} />
                </TabPane>

                <TabPane
                    tab={
                        <Space>
                            <MessageOutlined />
                            <span>我的预约</span>
                        </Space>
                    }
                    key="mine"
                >
                    <MyCousnelingCard counseling={counseling} psyProfiles={psyProfiles} setPsyProfiles={setPsyProfiles} />
                </TabPane>
            </Tabs>
        </Card>
    )
}