import React from "react";
import { Layout, Row, Col, Card } from "antd";
import ParticleBackground from "./particlebackground";

const { Content } = Layout;

export default function PsyHomeLayout({header, modal,
                                    edit, view, 
                                    profilecard, notificationcard, crisis, conuseling,
                                    tabKey}) {
    let content;

    switch(tabKey) {
        case 1: {
            content = (
                <div style={{ margin: '0 auto', padding: '0px 24px' }}>
                    <Row gutter={[24, 24]}>
                        <Col span={16}>
                            {profilecard}
                        </Col>
                        <Col span={8}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                {view}
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
                    {conuseling}
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
        case 4: {
            content = (
                <div style={{ margin: '0 auto', padding: '0px 48px' }}>
                    {crisis}
                </div>
            )
            break;
        }
        case 7: {
            content = (
                <div style={{ margin: '0 auto', padding: '0px 24px' }}>
                    {notificationcard}
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
                background: '#f9f0ff',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <ParticleBackground role={2} />

                <div style={{ margin: '0 auto' }}>
                    <Row gutter={[24, 24]}>
                        <Col span={24}>
                            {header}
                        </Col>
                    </Row>
                </div>
                {modal}
                {content}
            </Content>
        </Layout>
    )
}
