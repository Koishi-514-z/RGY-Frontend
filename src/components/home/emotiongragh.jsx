import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar} from 'recharts';
import { Card, Typography, Tabs, Space, Radio, Empty, Row, Col, Statistic, Tag, Progress, Badge, Divider } from 'antd';
import { LineChartOutlined, AreaChartOutlined, CalendarOutlined, RiseOutlined, FallOutlined, TrophyOutlined, HeartOutlined, ClockCircleOutlined, BarChartOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const timestamp = new Date(data.timestamp);
        const timeStr = timestamp.toLocaleString('zh-CN', {
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        return (
            <div style={{ 
                backgroundColor: 'white', 
                padding: '16px', 
                border: '1px solid #f0f0f0',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                borderRadius: '8px',
                minWidth: '200px'
            }}>
                <p style={{ margin: 0, fontWeight: 'bold', fontSize: '14px' }}>{`${label}`}</p>
                <p style={{ margin: '8px 0 4px', color: '#1890ff', fontSize: '13px' }}>
                    心情评分: <span style={{ fontWeight: 'bold', fontSize: '16px' }}> {data.score} </span>
                </p>
                <p style={{ margin: '4px 0', color: '#8c8c8c', fontSize: '12px' }}>
                    记录时间: {timeStr}
                </p>
                {data.note && (
                    <p style={{ margin: '4px 0 0', color: '#595959', fontSize: '12px', fontStyle: 'italic' }}>
                        备注: {data.note}
                    </p>
                )}
            </div>
        );
    }
    return null;
};


const getTimeDistribution = (emotionDatas) => {
    if(!emotionDatas || emotionDatas.length === 0) {
        return [];
    }
    
    const timeSlots = {
        '早晨': { count: 0, totalScore: 0, range: '06:00-12:00' },
        '下午': { count: 0, totalScore: 0, range: '12:00-18:00' },
        '晚上': { count: 0, totalScore: 0, range: '18:00-24:00' },
        '深夜': { count: 0, totalScore: 0, range: '00:00-06:00' }
    };

    const getSlot = (hour) => {
        if(hour >= 6 && hour < 12) {
            return '早晨';
        }
        else if(hour >= 12 && hour < 18) {
            return '下午';
        }
        else if(hour >= 18 && hour < 24) {
            return '晚上';
        }
        else {
            return '深夜';
        }
    }
    
    emotionDatas.forEach(data => {
        const hour = new Date(data.timestamp).getHours();
        const slot = getSlot(hour);
        timeSlots[slot].count++;
        timeSlots[slot].totalScore += data.score;
    });
    
    return Object.entries(timeSlots).map(([time, data]) => ({
        time,
        count: data.count,
        avgScore: data.count > 0 ? (data.totalScore / data.count).toFixed(1) : 0,
        range: data.range
    })).filter(item => item.count > 0);
};

const getEmotionLevelStats = (emotionDatas) => {
    if(!emotionDatas || emotionDatas.length === 0) {
        return [];
    }

    const getEmotionLabel = (score) => {
        if(score >= 4.0) {
            return '很好';
        }
        if(score >= 3.0) {
            return '不错';
        }
        if(score >= 2.0) {
            return '一般';
        }
        return '较差';
    };
    
    const levels = {
        '很好': { count: 0, color: '#52c41a' },
        '不错': { count: 0, color: '#1890ff' },
        '一般': { count: 0, color: '#faad14' },
        '较差': { count: 0, color: '#f5222d' }
    };
    
    emotionDatas.forEach(data => {
        const label = getEmotionLabel(data.score);
        levels[label].count++;
    });
    
    return Object.entries(levels).map(([level, data]) => ({
        level,
        count: data.count,
        color: data.color,
        percentage: ((data.count / emotionDatas.length) * 100).toFixed(1)
    })).filter(item => item.count > 0);
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
            value: avg.toFixed(1),
            isPositive: avg >= 3
        }
    }
    
    const getStats = (datas) => {
        if(!datas || datas.length === 0) return null;
        
        const scores = datas.map(d => d.score);
        const max = Math.max(...scores);
        const min = Math.min(...scores);
        const maxItem = datas.find(d => d.score === max);
        const minItem = datas.find(d => d.score === min);
        
        return {
            max: { score: max, timestamp: maxItem.timestamp },
            min: { score: min, timestamp: minItem.timestamp },
            total: datas.length
        };
    };
    
    const trend = getTrend(activeData);
    const average = calcAverage(activeData);
    const stats = getStats(activeData);
    const timeDistribution = getTimeDistribution(activeData);
    const emotionLevelStats = getEmotionLevelStats(activeData);

    const renderChart = () => {
        if (!activeData || activeData.length === 0) {
            return (
                <Empty 
                    description="暂无情绪数据" 
                    style={{ margin: '40px 0' }} 
                />
            );
        }

        const chartProps = {
            data: activeData,
            margin: { top: 20, right: 30, left: 5, bottom: 5 }
        };

        const commonElements = (
            <>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                    dataKey="time" 
                    axisLine={{ stroke: '#f0f0f0' }}
                    tick={{ fill: '#595959', fontSize: 12 }}
                />
                <YAxis 
                    domain={[0, 5]} 
                    axisLine={{ stroke: '#f0f0f0' }}
                    tick={{ fill: '#595959', fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
            </>
        );

        if(chartType === "line") {
            return (
                <ResponsiveContainer width="100%" height={360}>
                    <LineChart {...chartProps}>
                        {commonElements}
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
                    <AreaChart {...chartProps}>
                        {commonElements}
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
        <div>
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
                    style={{ marginBottom: '16px' }}
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
                            padding: '16px',
                            borderRadius: '8px',
                            marginBottom: '24px',
                            border: `1px solid ${trend.isPositive ? '#b7eb8f' : '#ffccc7'}`
                        }}
                    >
                        <Row align="middle" gutter={16}>
                            <Col>
                                {trend.isPositive ? (
                                    <RiseOutlined style={{ color: '#52c41a', fontSize: '24px' }} />
                                ) : (
                                    <FallOutlined style={{ color: '#f5222d', fontSize: '24px' }} />
                                )}
                            </Col>
                            <Col flex={1}>
                                <Text strong style={{ fontSize: '16px' }}>
                                    {activeTab === "week" ? "本周" : "本月"}情绪变化: 
                                    <span style={{ 
                                        color: trend.isPositive ? '#52c41a' : '#f5222d',
                                        marginLeft: '8px'
                                    }}>
                                        {trend.isPositive ? "+" : ""}{trend.value} 分
                                    </span>
                                </Text>
                                <div style={{ fontSize: '14px', color: '#8c8c8c', marginTop: '4px' }}>
                                    {trend.isPositive 
                                        ? "太棒了！您的情绪状态在持续改善，继续保持这种积极的心态！" 
                                        : "最近情绪有所波动，建议多关注自己的心理健康，必要时寻求帮助。"
                                    }
                                </div>
                            </Col>
                        </Row>
                    </div>
                )}

                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={16}>
                        {stats && (
                            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                                <Col xs={24} sm={12} md={6}>
                                    <Card size="small" style={{ textAlign: 'center', border: '1px solid #e6f7ff' }}>
                                        <Statistic
                                            title="记录次数"
                                            value={stats.total}
                                            prefix={<ClockCircleOutlined style={{ color: '#1890ff' }} />}
                                            valueStyle={{ color: '#1890ff', fontSize: '20px' }}
                                        />
                                    </Card>
                                </Col>
                                <Col xs={24} sm={12} md={6}>
                                    <Card size="small" style={{ textAlign: 'center', border: '1px solid #f6ffed' }}>
                                        <Statistic
                                            title="平均分数"
                                            value={average?.value}
                                            prefix={<HeartOutlined style={{ color: '#52c41a' }} />}
                                            valueStyle={{ color: '#52c41a', fontSize: '20px' }}
                                        />
                                    </Card>
                                </Col>
                                <Col xs={24} sm={12} md={6}>
                                    <Card size="small" style={{ textAlign: 'center', border: '1px solid #fff7e6' }}>
                                        <Statistic
                                            title="最高分数"
                                            value={stats.max.score}
                                            prefix={<TrophyOutlined style={{ color: '#faad14' }} />}
                                            valueStyle={{ color: '#faad14', fontSize: '20px' }}
                                        />
                                        <Text type="secondary" style={{ fontSize: '10px' }}>
                                            {new Date(stats.max.timestamp).toLocaleDateString()}
                                        </Text>
                                    </Card>
                                </Col>
                                <Col xs={24} sm={12} md={6}>
                                    <Card size="small" style={{ textAlign: 'center', border: '1px solid #fff1f0' }}>
                                        <Statistic
                                            title="最低分数"
                                            value={stats.min.score}
                                            prefix={<FallOutlined style={{ color: '#f5222d' }} />}
                                            valueStyle={{ color: '#f5222d', fontSize: '20px' }}
                                        />
                                        <Text type="secondary" style={{ fontSize: '10px' }}>
                                            {new Date(stats.min.timestamp).toLocaleDateString()}
                                        </Text>
                                    </Card>
                                </Col>
                            </Row>
                        )}

                        <Divider style={{ margin: '24px 0' }}/>
                        
                        {renderChart()}
                    </Col>

                    <Col xs={24} lg={8}>
                        <Card 
                            title={
                                <Space>
                                    <BarChartOutlined style={{ color: '#1890ff' }} />
                                    <Text strong>时间分布分析</Text>
                                </Space>
                            }
                            style={{ 
                                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                borderRadius: '8px'
                            }}
                        >
                            {timeDistribution.length > 0 ? (
                                <ResponsiveContainer width="100%" height={200}>
                                    <BarChart data={timeDistribution}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                                        <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                                        <YAxis tick={{ fontSize: 12 }} />
                                        <Tooltip 
                                            formatter={(value, name) => [
                                                `${value} ${name === 'count' ? '次' : '分'}`,
                                                name === 'count' ? '记录次数' : '平均分数'
                                            ]}
                                        />
                                        <Bar dataKey="count" fill="#91d5ff" name="count" />
                                        <Bar dataKey="avgScore" fill="#1890ff" name="avgScore" />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <Empty description="暂无时间分布数据" />
                            )}
                        </Card>

                        <Divider style={{ margin: '12px 0' }}/>

                        <Card 
                            title={
                                <Space>
                                    <HeartOutlined style={{ color: '#1890ff' }} />
                                    <Text strong>情绪分级统计</Text>
                                </Space>
                            }
                            style={{ 
                                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                borderRadius: '8px'
                            }}
                        >
                            {emotionLevelStats.length > 0 ? (
                                <Space direction="vertical" style={{ width: '100%' }} size={12}>
                                    {emotionLevelStats.map((item, index) => (
                                        <div key={index} style={{ 
                                            display: 'flex', 
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '8px 0'
                                        }}>
                                            <Space>
                                                <Badge color={item.color} />
                                                <Text strong>{item.level}</Text>
                                                <Text type="secondary">({item.count}次)</Text>
                                            </Space>
                                            <div style={{ flex: 1, marginLeft: 16, marginRight: 16 }}>
                                                <Progress 
                                                    percent={item.percentage} 
                                                    strokeColor={item.color}
                                                    size="small"
                                                    showInfo={false}
                                                />
                                            </div>
                                            <Text style={{ color: item.color, fontWeight: 'bold' }}>
                                                {item.percentage}%
                                            </Text>
                                        </div>
                                    ))}
                                </Space>
                            ) : (
                                <Empty description="暂无情绪分级数据" />
                            )}
                        </Card>
                    </Col>
                </Row>
            </Card>
        </div>
    );
}