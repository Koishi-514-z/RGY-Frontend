import React from "react";
import { Layout, Row, Col, Card } from "antd";
import ParticleBackground from "./particlebackground";

const { Content } = Layout;

export default function HomeLayout({header, edit, view, emotionCard, intimateCard, blogCard, emotionGraph, tabKey}) {
    let content;

    switch(tabKey) {
        case 1: {
            content = (
                <div style={{ margin: '0 auto', padding: '0px 24px' }}>
                    <Row gutter={[24, 24]}>
                        <Col span={16}>
                            {emotionCard}
                        </Col>
                        <Col span={8}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                {view}
                                {intimateCard}
                            </div>
                        </Col>
                    </Row>
                </div>
            )
            break;
        }
        case 2: {
            content = (
                <div style={{ margin: '0 auto', padding: '0px 48px' }}>
                    {blogCard}
                </div>
            )
            break;
        }
        case 3: {
            content = (
                <div style={{ maxWidth: '750px', margin: '0 auto', padding: '0px 24px' }}>
                    <Card 
                        style={{ 
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            borderRadius: '12px',
                            overflow: 'hidden'
                        }}
                    >
                        {edit}
                    </Card>
                </div> 
            )
            break;
        }
        case 5: {
            content = (
                <div style={{ margin: '0 auto', padding: '0px 24px' }}>
                    {emotionGraph}
                </div> 
            )
            break;
        }
        default: {
            content = null;
            break;
        }
    }

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Content style={{ 
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 50%, #f6ffed 100%)', 
                position: 'relative',
                overflow: 'hidden'
            }}>
                <ParticleBackground />

                <div style={{ margin: '0 auto' }}>
                    <Row gutter={[24, 24]}>
                        <Col span={24}>
                            {header}
                        </Col>
                    </Row>
                </div>
                
                {content}
            </Content>
        </Layout>
    )
}
