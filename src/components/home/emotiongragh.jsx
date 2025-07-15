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
        if(!datas || datas.length == 0) {
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
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(24, 144, 255, 0.1)" />
                <XAxis 
                    dataKey="time" 
                    axisLine={{ stroke: 'rgba(24, 144, 255, 0.2)' }}
                    tick={{ fill: '#595959', fontSize: 12 }}
                />
                <YAxis 
                    domain={[0, 5]} 
                    axisLine={{ stroke: 'rgba(24, 144, 255, 0.2)' }}
                    tick={{ fill: '#595959', fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
            </>
        );

        if(chartType === "line") {
            return (
                <ResponsiveContainer width="100%" height={380}>
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
                <ResponsiveContainer width="100%" height={380}>
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
        <Card 
            style={{ 
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 50%, #f6ffed 100%)',
                border: '1px solid rgba(24, 144, 255, 0.15)',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(24, 144, 255, 0.12)',
                position: 'relative',
                marginBottom: '24px'
            }}
        >
            {/* 头部区域 */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(24, 144, 255, 0.05) 0%, rgba(54, 207, 201, 0.05) 100%)',
                padding: '24px',
                margin: '-24px -24px 24px -24px',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '16px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{
                            width: '56px',
                            height: '56px',
                            background: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '16px',
                            boxShadow: '0 6px 16px rgba(24, 144, 255, 0.3)',
                            position: 'relative'
                        }}>
                            <LineChartOutlined style={{ color: '#fff', fontSize: '24px' }} />
                            <div style={{
                                position: 'absolute',
                                top: '8px',
                                right: '8px',
                                width: '8px',
                                height: '8px',
                                background: '#52c41a',
                                borderRadius: '50%',
                                border: '2px solid #fff'
                            }} />
                        </div>
                        <div>
                            <Title level={4} style={{ 
                                margin: 0, 
                                background: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}>
                                情绪趋势分析
                            </Title>
                            <Text style={{ 
                                color: '#595959', 
                                fontSize: '14px',
                                fontWeight: '500'
                            }}>
                                追踪你的情绪变化轨迹
                            </Text>
                        </div>
                    </div>
                    
                    <Radio.Group 
                        value={chartType} 
                        onChange={handleChartTypeChange}
                        buttonStyle="solid"
                        size="small"
                        style={{
                            background: 'rgba(255, 255, 255, 0.8)',
                            borderRadius: '8px',
                            padding: '2px'
                        }}
                    >
                        <Radio.Button value="area">
                            <AreaChartOutlined /> 面积图
                        </Radio.Button>
                        <Radio.Button value="line">
                            <LineChartOutlined /> 折线图
                        </Radio.Button>
                    </Radio.Group>
                </div>

                {/* 标签页 */}
                <Tabs 
                    activeKey={activeTab} 
                    onChange={handleTabChange}
                    style={{ 
                        marginBottom: '0',
                        '& .ant-tabs-nav': {
                            marginBottom: '0'
                        }
                    }}
                >
                    <TabPane 
                        tab={
                            <span style={{ fontSize: '14px', fontWeight: '500' }}>
                                <CalendarOutlined /> 本周趋势
                            </span>
                        } 
                        key="week"
                    />
                    <TabPane 
                        tab={
                            <span style={{ fontSize: '14px', fontWeight: '500' }}>
                                <CalendarOutlined /> 本月趋势
                            </span>
                        } 
                        key="month"
                    />
                </Tabs>
            </div>

            {/* 内容区域 */}
            <div style={{ padding: '0 24px 24px' }}>
                {/* 趋势提示 */}
                {trend && (
                    <div 
                        style={{ 
                            background: trend.isPositive 
                                ? 'linear-gradient(135deg, rgba(82, 196, 26, 0.1), rgba(82, 196, 26, 0.05))'
                                : 'linear-gradient(135deg, rgba(245, 34, 45, 0.1), rgba(245, 34, 45, 0.05))',
                            padding: '16px 20px',
                            borderRadius: '12px',
                            marginBottom: '24px',
                            border: `1px solid ${trend.isPositive ? 'rgba(82, 196, 26, 0.2)' : 'rgba(245, 34, 45, 0.2)'}`,
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{
                            position: 'absolute',
                            top: -10,
                            right: -10,
                            width: 40,
                            height: 40,
                            background: `linear-gradient(135deg, ${trend.isPositive ? '#52c41a' : '#f5222d'}15, transparent)`,
                            borderRadius: '50%'
                        }} />
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

                {/* 统计卡片 */}
                {stats && (
                    <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                        <Col xs={24} sm={12} md={6}>
                            <div style={{
                                background: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
                                border: '1px solid rgba(24, 144, 255, 0.2)',
                                borderRadius: '12px',
                                padding: '12px 16px',
                                textAlign: 'center',
                                position: 'relative',
                                overflow: 'hidden',
                                height: '90px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    top: -5,
                                    right: -5,
                                    width: 20,
                                    height: 20,
                                    background: 'linear-gradient(135deg, #1890ff20, transparent)',
                                    borderRadius: '50%'
                                }} />
                                <ClockCircleOutlined style={{ color: '#1890ff', fontSize: '18px', marginBottom: '6px' }} />
                                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff', marginBottom: '2px' }}>
                                    {stats.total}
                                </div>
                                <Text style={{ color: '#595959', fontSize: '11px' }}>记录次数</Text>
                            </div>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <div style={{
                                background: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)',
                                border: '1px solid rgba(82, 196, 26, 0.2)',
                                borderRadius: '12px',
                                padding: '12px 16px',
                                textAlign: 'center',
                                position: 'relative',
                                overflow: 'hidden',
                                height: '90px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    top: -5,
                                    right: -5,
                                    width: 20,
                                    height: 20,
                                    background: 'linear-gradient(135deg, #52c41a20, transparent)',
                                    borderRadius: '50%'
                                }} />
                                <HeartOutlined style={{ color: '#52c41a', fontSize: '18px', marginBottom: '6px' }} />
                                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#52c41a', marginBottom: '2px' }}>
                                    {average?.value}
                                </div>
                                <Text style={{ color: '#595959', fontSize: '11px' }}>平均分数</Text>
                            </div>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <div style={{
                                background: 'linear-gradient(135deg, #fffbe6 0%, #fff1b8 100%)',
                                border: '1px solid rgba(250, 173, 20, 0.2)',
                                borderRadius: '12px',
                                padding: '12px 16px',
                                textAlign: 'center',
                                position: 'relative',
                                overflow: 'hidden',
                                height: '90px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    top: -5,
                                    right: -5,
                                    width: 20,
                                    height: 20,
                                    background: 'linear-gradient(135deg, #faad1420, transparent)',
                                    borderRadius: '50%'
                                }} />
                                <TrophyOutlined style={{ color: '#faad14', fontSize: '18px', marginBottom: '6px' }} />
                                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#faad14', marginBottom: '2px' }}>
                                    {stats.max.score}
                                </div>
                                <Text style={{ color: '#595959', fontSize: '11px' }}>最高分数</Text>
                                <Text style={{ color: '#8c8c8c', fontSize: '9px', marginTop: '2px' }}>
                                    {new Date(stats.max.timestamp).toLocaleDateString()}
                                </Text>
                            </div>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <div style={{
                                background: 'linear-gradient(135deg, #fff2f0 0%, #ffccc7 100%)',
                                border: '1px solid rgba(245, 34, 45, 0.2)',
                                borderRadius: '12px',
                                padding: '12px 16px',
                                textAlign: 'center',
                                position: 'relative',
                                overflow: 'hidden',
                                height: '90px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    top: -5,
                                    right: -5,
                                    width: 20,
                                    height: 20,
                                    background: 'linear-gradient(135deg, #f5222d20, transparent)',
                                    borderRadius: '50%'
                                }} />
                                <FallOutlined style={{ color: '#f5222d', fontSize: '18px', marginBottom: '6px' }} />
                                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f5222d', marginBottom: '2px' }}>
                                    {stats.min.score}
                                </div>
                                <Text style={{ color: '#595959', fontSize: '11px' }}>最低分数</Text>
                                <Text style={{ color: '#8c8c8c', fontSize: '9px', marginTop: '2px' }}>
                                    {new Date(stats.min.timestamp).toLocaleDateString()}
                                </Text>
                            </div>
                        </Col>
                    </Row>
                )}

                {/* 主图表 */}
                <div style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(24, 144, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    marginBottom: '24px'
                }}>
                    {renderChart()}
                </div>

                {/* 分析图表 */}
                <Row gutter={[20, 20]}>
                    <Col xs={24} lg={12}>
                        <div style={{
                            background: 'linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%)',
                            border: '1px solid rgba(24, 144, 255, 0.15)',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            height: '260px'
                        }}>
                            <div style={{
                                background: 'linear-gradient(135deg, rgba(24, 144, 255, 0.05) 0%, rgba(54, 207, 201, 0.05) 100%)',
                                padding: '12px 20px',
                                borderBottom: '1px solid rgba(24, 144, 255, 0.1)'
                            }}>
                                <Space>
                                    <BarChartOutlined style={{ color: '#1890ff' }} />
                                    <Text strong style={{ fontSize: '14px' }}>时间分布分析</Text>
                                </Space>
                            </div>
                            <div style={{ padding: '12px' }}>
                                {timeDistribution.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={180}>
                                        <BarChart data={timeDistribution} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(24, 144, 255, 0.1)" />
                                            <XAxis 
                                                dataKey="time" 
                                                tick={{ fontSize: 10, fill: '#595959' }}
                                                axisLine={{ stroke: 'rgba(24, 144, 255, 0.2)' }}
                                            />
                                            <YAxis 
                                                tick={{ fontSize: 10, fill: '#595959' }}
                                                axisLine={{ stroke: 'rgba(24, 144, 255, 0.2)' }}
                                            />
                                            <Tooltip 
                                                contentStyle={{
                                                    background: 'linear-gradient(135deg, #fff 0%, #f8fcff 100%)',
                                                    border: '1px solid rgba(24, 144, 255, 0.2)',
                                                    borderRadius: '8px',
                                                    boxShadow: '0 4px 12px rgba(24, 144, 255, 0.15)',
                                                    fontSize: '12px'
                                                }}
                                                formatter={(value, name) => [
                                                    `${value} ${name === 'count' ? '次' : '分'}`,
                                                    name === 'count' ? '记录次数' : '平均分数'
                                                ]}
                                            />
                                            <Bar 
                                                dataKey="count" 
                                                fill="#91d5ff" 
                                                name="count"
                                                radius={[3, 3, 0, 0]}
                                            />
                                            <Bar 
                                                dataKey="avgScore" 
                                                fill="#1890ff" 
                                                name="avgScore"
                                                radius={[3, 3, 0, 0]}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <Empty 
                                        description="暂无时间分布数据" 
                                        style={{ padding: '40px 0', color: '#8c8c8c' }}
                                        imageStyle={{ height: 50 }}
                                    />
                                )}
                            </div>
                        </div>
                    </Col>

                    <Col xs={24} lg={12}>
                        <div style={{
                            background: 'linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%)',
                            border: '1px solid rgba(24, 144, 255, 0.15)',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            height: '260px'
                        }}>
                            <div style={{
                                background: 'linear-gradient(135deg, rgba(24, 144, 255, 0.05) 0%, rgba(54, 207, 201, 0.05) 100%)',
                                padding: '12px 20px',
                                borderBottom: '1px solid rgba(24, 144, 255, 0.1)'
                            }}>
                                <Space>
                                    <HeartOutlined style={{ color: '#1890ff' }} />
                                    <Text strong style={{ fontSize: '14px' }}>情绪分级统计</Text>
                                </Space>
                            </div>
                            <div style={{ padding: '12px' }}>
                                {emotionLevelStats.length > 0 ? (
                                    <div style={{ 
                                        height: '180px',
                                        overflowY: 'auto'
                                    }}>
                                        <Space direction="vertical" style={{ width: '100%' }} size={8}>
                                            {emotionLevelStats.map((item, index) => (
                                                <div key={index} style={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    padding: '8px 12px',
                                                    background: `linear-gradient(135deg, ${item.color}08, ${item.color}05)`,
                                                    borderRadius: '8px',
                                                    border: `1px solid ${item.color}20`,
                                                    transition: 'all 0.3s ease',
                                                    cursor: 'pointer'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                                    e.currentTarget.style.boxShadow = `0 4px 8px ${item.color}20`;
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                    e.currentTarget.style.boxShadow = 'none';
                                                }}
                                                >
                                                    <Space size={6}>
                                                        <div style={{
                                                            width: '8px',
                                                            height: '8px',
                                                            background: `linear-gradient(135deg, ${item.color}, ${item.color}cc)`,
                                                            borderRadius: '50%',
                                                            boxShadow: `0 2px 4px ${item.color}30`
                                                        }} />
                                                        <Text strong style={{ fontSize: '12px', color: '#262626' }}>
                                                            {item.level}
                                                        </Text>
                                                        <Text type="secondary" style={{ fontSize: '10px' }}>
                                                            ({item.count}次)
                                                        </Text>
                                                    </Space>
                                                    <div style={{ flex: 1, marginLeft: 10, marginRight: 10 }}>
                                                        <Progress 
                                                            percent={parseFloat(item.percentage)} 
                                                            strokeColor={{
                                                                '0%': item.color,
                                                                '100%': `${item.color}cc`
                                                            }}
                                                            size="small"
                                                            showInfo={false}
                                                            trailColor="rgba(0,0,0,0.06)"
                                                            strokeWidth={4}
                                                        />
                                                    </div>
                                                    <Text style={{ 
                                                        color: item.color, 
                                                        fontWeight: 'bold',
                                                        fontSize: '12px',
                                                        minWidth: '35px',
                                                        textAlign: 'right'
                                                    }}>
                                                        {item.percentage}%
                                                    </Text>
                                                </div>
                                            ))}
                                        </Space>
                                    </div>
                                ) : (
                                    <Empty 
                                        description="暂无情绪分级数据" 
                                        style={{ padding: '40px 0', color: '#8c8c8c' }}
                                        imageStyle={{ height: 50 }}
                                    />
                                )}
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </Card>
    );
}