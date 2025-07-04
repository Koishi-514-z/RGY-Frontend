import React, { useState, useEffect } from "react";
import { Card, Space, Typography, Row, Col } from "antd";

const { Text } = Typography;

export default function EmotionTips() {
    const tips = [
        { icon: '🌱', title: '每日记录', desc: '坚持记录情绪变化' },
        { icon: '💪', title: '积极调节', desc: '学会情绪管理技巧' },
        { icon: '🎯', title: '设定目标', desc: '为心情设定小目标' },
        { icon: '🤝', title: '寻求支持', desc: '必要时寻求专业帮助'}
    ];
    
    return (
        <Card 
            title={
                <Space>
                    <span style={{ fontSize: '18px' }}>💡</span>
                    <Text strong>情绪管理小贴士</Text>
                </Space>
            }
            style={{ 
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
            }}
        >
            <Row gutter={[16, 16]}>
                {tips.map((tip, index) => (
                    <Col xs={12} sm={6} key={index}>
                        <div style={{ textAlign: 'center', padding: '12px 8px' }}>
                            <div style={{ 
                                fontSize: '20px',
                                marginBottom: '8px',
                                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                            }}>
                                {tip.icon}
                            </div>
                            <Text strong style={{ 
                                fontSize: '13px',
                                display: 'block',
                                marginBottom: '4px',
                                color: '#262626'
                            }}>
                                {tip.title}
                            </Text>
                            <Text style={{ 
                                fontSize: '11px',
                                color: '#8c8c8c',
                                lineHeight: 1.4
                            }}>
                                {tip.desc}
                            </Text>
                        </div>
                    </Col>
                ))}
            </Row>
        </Card>
    );
}