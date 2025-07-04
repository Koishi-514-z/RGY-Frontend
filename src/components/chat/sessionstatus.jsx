import React, { useState, useEffect } from "react";
import { Row, Col, Typography } from "antd";

const { Text } = Typography;

export default function SessionStatus({sessionTags}) {
    const totalSessions = sessionTags.length;
    const unreadCount = sessionTags.reduce((sum, tag) => sum + tag.unread, 0);

    return (
        <div style={{
            padding: '12px 16px',
            background: 'linear-gradient(135deg, #e6f7ff 0%, #f6ffed 100%)',
            borderBottom: '1px solid #f0f0f0'
        }}>
            <Row gutter={16}>
                <Col span={12} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1890ff' }}>
                        {totalSessions}
                    </div>
                    <Text style={{ fontSize: '11px', color: '#8c8c8c' }}>会话</Text>
                </Col>
                <Col span={12} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#ff4d4f' }}>
                        {unreadCount}
                    </div>
                    <Text style={{ fontSize: '11px', color: '#8c8c8c' }}>未读</Text>
                </Col>
            </Row>
        </div>
    );
}