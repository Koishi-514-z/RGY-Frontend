import React from "react";
import { Layout, Typography, Space, Row, Col } from "antd";
import { ProfileOutlined } from "@ant-design/icons";

const { Header, Content } = Layout;
const { Title } = Typography;

export default function EmotionLayout({scoring, diary, graph, push}) {
    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Header style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                background: '#fcfcfc',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                position: 'sticky',
                height: 'auto',
                lineHeight: '1.5',
                padding: '24px 36px'
            }}>
                <Space>
                    <ProfileOutlined style={{ fontSize: 28, color: '#1890ff' }} />
                    <Title level={3} style={{ margin: 0 }}> 每日情绪 </Title>
                </Space>
            </Header>
      
            <Content style={{ padding: '24px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <Row gutter={[24, 24]}>
                        <Col span={24}>
                            {scoring}
                        </Col>
                        <Col span={24}>
                            {diary}
                        </Col>
                        <Col span={24}>
                            {graph}
                        </Col>
                        <Col span={24}>
                            {push}
                        </Col>
                    </Row>
                </div>
            </Content>
        </Layout>
    )
}
