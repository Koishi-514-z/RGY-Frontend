import React from "react";
import { Layout, Typography, Divider, Space, Card, Row, Col } from "antd";
import { ProfileOutlined } from "@ant-design/icons";

const { Header, Content } = Layout;
const { Title } = Typography;

export default function HomeLayout({editting, content_edit, content_view}) {
    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Header style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                background: '#fcfcfc',
                padding: '0 24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                position: 'sticky',
                height: 'auto',
                lineHeight: '1.5',
                padding: '24px 36px'
            }}>
                <Space>
                    <ProfileOutlined style={{ fontSize: 28, color: '#1890ff' }} />
                    <Title level={3} style={{ margin: 0 }}> 个人中心 </Title>
                </Space>
            </Header>
      
            <Content>
                {editting ? content_edit : content_view}
            </Content>
        </Layout>
    )
}
