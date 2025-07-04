import React, { useState, useEffect } from "react";
import { Typography } from "antd";

const { Text } = Typography;

export default function FeatureCard({icon, title, description, color}) {
    return (
        <div style={{
            background: '#eaf1ff',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            border: `1px solid ${color}15`,
            transition: 'all 0.3s ease',
            cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-4px)';
            e.target.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
        }}
        onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0px)';
            e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
        }}
        >
            <div style={{
                fontSize: '24px',
                color: color,
                background: `${color}10`,
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px'
            }}>
                {icon}
            </div>
            <Text strong style={{ fontSize: '14px', display: 'block', marginBottom: '6px', color: '#262626' }}>
                {title}
            </Text>
            <Text style={{ fontSize: '12px', color: '#8c8c8c', lineHeight: 1.4 }}>
                {description}
            </Text>
        </div>
    );
}