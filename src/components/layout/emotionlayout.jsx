import React from "react";
import { Layout, Typography, Space, Row, Col } from "antd";
import { ProfileOutlined, LineChartOutlined, BookOutlined } from "@ant-design/icons";

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
                top: 0,
                zIndex: 100,
                height: 'auto',
                lineHeight: '1.5',
                padding: '16px 24px'
            }}>
                <Space>
                    <ProfileOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                    <Title level={3} style={{ margin: 0 }}> 每日情绪 </Title>
                </Space>
            </Header>
      
            <Content style={{ padding: '24px', backgroundColor: '#f0f2f5' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <Row gutter={[24, 24]}>
                        <Col xs={24} lg={16}>
                            <div style={{ marginBottom: '24px' }}>
                                {scoring}
                            </div>
                            <div>
                                {diary}
                            </div>
                        </Col>

                        <Col xs={24} lg={8}>
                            <div style={{ 
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-start'
                            }}>
                                {push}
                            </div>
                        </Col>
                    </Row>

                    <Row style={{ marginTop: '24px' }}>
                        <Col span={24}>
                            {graph}
                        </Col>
                    </Row>
                </div>
            </Content>
        </Layout>
    )
}