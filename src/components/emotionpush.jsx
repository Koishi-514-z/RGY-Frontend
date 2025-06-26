import React, { useState, useEffect } from "react";
import { Card, Space, Typography } from "antd";
import { SmileOutlined, MehOutlined, FrownOutlined } from "@ant-design/icons";
import { FileTextOutlined } from "@ant-design/icons";
import PushList from "./pushlist";

const { Title, Text } = Typography;

export default function EmotionPush({score, urlDatas}) {
    const getText = (score) => {
        if (score >= 3.5) return { icon: <SmileOutlined style={{ color: '#52c41a' }} />, color: '#52c41a', text: "   心情很好，下面这些内容或许能让您更加开心！" };
        if (score >= 2.5) return { icon: <MehOutlined style={{ color: '#faad14' }} />, color: '#faad14', text: "   心情平稳，来看一下下面这些内容吧"  };
        return { icon: <FrownOutlined style={{ color: '#f5222d' }} />, color: '#f5222d', text: "   心情不太好，下面这些内容或许能让您开心起来" };
    }

    const { icon, color, text } = getText(score);

    return (
        <Card 
            title={
                <div style={{ padding: '8px 0' }}>
                    <Space>
                        <FileTextOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
                        <Title level={4} style={{ margin: 0 }}> 今日推送 </Title>
                    </Space>
                </div>
            }
            style={{ 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                borderRadius: '12px',
                overflow: 'hidden',
            }}
            extra={
                <div style={{ marginBottom: '24px' }}>
                    <Text 
                        style={{ 
                            fontSize: '15px',
                            display: 'block',
                            textAlign: 'center',
                            margin: '16px 0',
                            color: '#595959'
                        }}
                    >
                        {icon}
                        {text}
                    </Text>
                </div>
            }
        >
            <div>
                <PushList urlDatas={urlDatas} />
            </div>
        </Card>
    );
}