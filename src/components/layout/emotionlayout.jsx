import React from "react";
import { Layout, Typography, Space, Row, Col } from "antd";
import { ProfileOutlined, LineChartOutlined, BookOutlined } from "@ant-design/icons";
import ParticleBackground from "./particlebackground";
import FloatingElements from "./floatingelements";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

export default function EmotionLayout({scoring, diary, push, quote, tips}) {
    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Header style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                background: 'linear-gradient(90deg, #fcfcfc 0%, #f0f9ff 100%)',
                boxShadow: '0 2px 12px rgba(24,144,255,0.08)',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                height: 'auto',
                lineHeight: '1.5',
                padding: '20px 32px'
            }}>
                <Space size={16}>
                    <div style={{
                        background: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
                        padding: '8px',
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(24,144,255,0.15)'
                    }}>
                        <ProfileOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                    </div>
                    <div>
                        <Title level={3} style={{ margin: 0, color: '#262626' }}>
                            每日情绪
                        </Title>
                        <Text type="secondary" style={{ fontSize: '13px' }}>
                            记录心情，关爱自己
                        </Text>
                    </div>
                </Space>
            </Header>
      
            <Content style={{ 
                padding: '32px 24px', 
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 50%, #f6ffed 100%)', 
                minHeight: 'calc(100vh - 88px)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <FloatingElements />
                <ParticleBackground />
                <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <Row gutter={[32, 32]}>
                        <Col xs={24} lg={15}>
                            <Space direction="vertical" size={24} style={{ width: '100%' }}>
                                {scoring}
                                {diary}
                            </Space>
                        </Col>

                        <Col xs={24} lg={9}>
                            <div style={{ 
                                position: 'sticky',
                                top: '0px',
                                height: 'fit-content'
                            }}>
                                <Space direction="vertical" size={24} style={{ width: '100%' }}>
                                    {quote && <div>{quote}</div>}
                                    {push}
                                </Space>
                            </div>
                        </Col>
                    </Row>
                    <Row gutter={[32, 32]} justify="left">
                        <Col span={15} offset={4}>
                            {tips && <div style={{ marginTop: '24px' }}>{tips}</div>}
                        </Col>
                    </Row>
                </div>
            </Content>
        </Layout>
    )
}