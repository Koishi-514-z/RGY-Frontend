import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Card, Typography, Tabs, Space, Radio, Empty } from 'antd';
import { LineChartOutlined, AreaChartOutlined, CalendarOutlined, RiseOutlined, FallOutlined } from '@ant-design/icons';
import { getMonthData, getWeekData } from "../service/emotion";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div style={{ 
                backgroundColor: 'white', 
                padding: '12px', 
                border: '1px solid #f0f0f0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                borderRadius: '6px'
            }}>
                <p style={{ margin: 0, fontWeight: 'bold' }}>{`${label}`}</p>
                <p style={{ margin: '8px 0 0', color: '#1890ff' }}>
                    心情评分: <span style={{ fontWeight: 'bold' }}> {data.score} </span>
                </p>
            </div>
        );
    }

    return null;
};

export default function EmotionGragh({weekData, monthData}) {
    const [activeTab, setActiveTab] = useState("week");
    const [chartType, setChartType] = useState("area");

    const handleTabChange = (key) => {
        setActiveTab(key);
    };

    const handleChartTypeChange = (e) => {
        setChartType(e.target.value);
    };

    const activeData = activeTab === "week" ? weekData : monthData;
 
    const getTrend = (datas) => {
        if(!datas || datas.length < 2) {
            return null;
        }
        const firstScore = datas[0].score;
        const lastScore = datas[datas.length - 1].score;
        const trend = lastScore - firstScore;
        
        return {
            value: trend.toFixed(1),
            isPositive: trend >= 0
        };
    };

    const calcAverage = (datas) => {
        if(!datas || datas.length < 2) {
            return null;
        }
        let avg = 0;
        for(const data of datas) {
            avg += data.score;
        }
        avg /= datas.length;
        return {
            value: avg,
            isPositive: avg >= 3
        }
    }
    
    const trend = getTrend(activeData);
    const average = calcAverage(activeData);

    const renderChart = () => {
        if (!activeData || activeData.length === 0) {
            return (
                <Empty 
                    description="暂无情绪数据" 
                    style={{ margin: '40px 0' }} 
                />
            );
        }

        if(chartType === "line") {
            return (
                <ResponsiveContainer width="100%" height={360}>
                    <LineChart data={activeData} margin={{ top: 20, right: 30, left: 5, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                            dataKey="time" 
                            axisLine={{ stroke: '#f0f0f0' }}
                            tick={{ fill: '#595959' }}
                        />
                        <YAxis 
                            domain={[0, 5]} 
                            axisLine={{ stroke: '#f0f0f0' }}
                            tick={{ fill: '#595959' }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ paddingTop: '10px' }} />
                        <Line 
                            type="monotone" 
                            dataKey="score" 
                            name="心情评分"
                            stroke="#1890ff" 
                            strokeWidth={3}
                            dot={{ fill: '#1890ff', r: 6 }}
                            activeDot={{ r: 8, stroke: '#1890ff', strokeWidth: 2, fill: '#fff' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            );
        } 
        else {
            return (
                <ResponsiveContainer width="100%" height={360}>
                    <AreaChart data={activeData} margin={{ top: 20, right: 30, left: 5, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                            dataKey="time" 
                            axisLine={{ stroke: '#f0f0f0' }}
                            tick={{ fill: '#595959' }}
                        />
                        <YAxis 
                            domain={[0, 5]} 
                            axisLine={{ stroke: '#f0f0f0' }}
                            tick={{ fill: '#595959' }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ paddingTop: '10px' }} />
                        <Area 
                            type="monotone" 
                            dataKey="score" 
                            name="心情评分"
                            stroke="#1890ff" 
                            fill="rgba(24, 144, 255, 0.2)" 
                            strokeWidth={2}
                            activeDot={{ r: 8, stroke: '#1890ff', strokeWidth: 2, fill: '#fff' }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            );
        }
    };

    return (
        <Card 
            title={
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Space>
                        <LineChartOutlined style={{ fontSize: '18px', color: '#1890ff' }} />
                        <Title level={4} style={{ margin: 0 }}>情绪趋势分析</Title>
                    </Space>
                    
                    <Radio.Group 
                        value={chartType} 
                        onChange={handleChartTypeChange}
                        buttonStyle="solid"
                        size="small"
                    >
                        <Radio.Button value="area">
                            <AreaChartOutlined /> 面积图
                        </Radio.Button>
                        <Radio.Button value="line">
                            <LineChartOutlined /> 折线图
                        </Radio.Button>
                    </Radio.Group>
                </div>
            }
            style={{ 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                borderRadius: '12px',
                overflow: 'hidden',
                marginBottom: '24px'
            }}
        >
            <Tabs 
                activeKey={activeTab} 
                onChange={handleTabChange}
                style={{ marginBottom: '24px' }}
            >
                <TabPane 
                    tab={
                        <span>
                            <CalendarOutlined /> 本周趋势
                        </span>
                    } 
                    key="week"
                />
                <TabPane 
                    tab={
                        <span>
                            <CalendarOutlined /> 本月趋势
                        </span>
                    } 
                    key="month"
                />
            </Tabs>
            
            {trend && (
                <div 
                    style={{ 
                        backgroundColor: trend.isPositive ? 'rgba(82, 196, 26, 0.1)' : 'rgba(245, 34, 45, 0.1)', 
                        padding: '12px 16px',
                        borderRadius: '8px',
                        marginBottom: '24px',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    {trend.isPositive ? (
                        <RiseOutlined style={{ color: '#52c41a', fontSize: '20px', marginRight: '12px' }} />
                    ) : (
                        <FallOutlined style={{ color: '#f5222d', fontSize: '20px', marginRight: '12px' }} />
                    )}
                    <div>
                        <Text strong>
                            {activeTab === "week" ? "本周" : "本月"}情绪趋势: 
                            <span style={{ 
                                color: trend.isPositive ? '#52c41a' : '#f5222d',
                                marginLeft: '8px',
                                marginRight: '16px'
                            }}>
                                {trend.isPositive ? "+" : ""}{trend.value}
                            </span>
                            情绪均值:
                            <span style={{ 
                                color: average.isPositive ? '#52c41a' : '#f5222d',
                                marginLeft: '8px'
                            }}>
                                {average.value}
                            </span>
                        </Text>
                        <div style={{ fontSize: '14px', color: '#8c8c8c', marginTop: '4px' }}>
                            {trend.isPositive 
                                ? "您的情绪有所提升，继续保持良好的心态！" 
                                : "您的情绪略有下降，建议多关注自己的心理健康。"
                            }
                        </div>
                    </div>
                </div>
            )}
            
            {renderChart()}
        </Card>
    );
}