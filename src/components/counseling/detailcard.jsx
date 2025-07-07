import React, { useState, useEffect } from "react";
import { Card, Space, Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import { MessageOutlined, NotificationOutlined } from "@ant-design/icons";
import PsyProfileCard from "../psy/psyprofilecard";
import SubscribeCard from "./subscribecard";

export default function DetailCard({psyProfile}) {
    const [activeTab, setActiveTab] = useState("view");

    const handleSubscribe = () => {
        setActiveTab("subscribe");
    }

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
                            <span>个人名片</span>
                        </Space>
                    }
                    key="view"
                >
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'center',
                        width: '100%'
                    }}>
                        <div style={{ width: '70%', maxWidth: '800px' }}>
                            <PsyProfileCard profile={psyProfile} guest={true} handleSubscribe={handleSubscribe} />
                        </div>
                    </div>
                </TabPane>

                <TabPane
                    tab={
                        <Space>
                            <MessageOutlined />
                            <span>预约信息</span>
                        </Space>
                    }
                    key="subscribe"
                >
                    <SubscribeCard psyProfile={psyProfile} />
                </TabPane>
            </Tabs>
        </Card>
    )
}