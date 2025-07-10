import React, { useState, useEffect } from "react";
import { getTags, scanEmotionData } from "../../service/emotion";
import { Card, DatePicker, Select, Row, Col, Typography, Space, Statistic, Empty, Switch, Divider } from "antd";
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, Area, AreaChart
} from 'recharts';
import { CalendarOutlined, BarChartOutlined, PieChartOutlined, ClockCircleOutlined, LineChartOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

export default function StatisticCard() {
    const [emotionData, setEmotionData] = useState(null);  
    const [dateRange, setDateRange] = useState(null);
    const [interval, setInterval] = useState(1);
    const [showDataPoints, setShowDataPoints] = useState(true);
    const [chartType, setChartType] = useState('line'); // 'line' 或 'area'

    const COLORS = [
        '#722ed1', '#1890ff', '#52c41a', '#faad14', 
        '#eb2f96', '#13c2c2', '#fa8c16', '#f5222d'
    ];

    const handleRangeChange = (dates) => {
        setDateRange(dates);
    }

    const handleIntervalChange = (value) => {
        setInterval(value);
    }

    const formatTimeData = (timeDatas, startDate, intervalDays) => {
        if(!timeDatas || timeDatas.length === 0) {
            return [];
        }
        
        return timeDatas.map((item) => {
            const date = dayjs(startDate).add(item.timeIndex * intervalDays, 'day');
            return {
                time: date.format('MM/DD'),
                fullDate: date.format('YYYY-MM-DD'),
                weekday: date.format('dddd'),
                score: item.score,
                total: item.total, 
                timeIndex: item.timeIndex,
                positive: item.positive,
                neutral: item.neutral,
                negative: item.negative
            };
        });
    };

    const formatMoodData = (ratioDatas) => {
        if(!ratioDatas || ratioDatas.length === 0) {
            return [];
        }
            
        return ratioDatas.map((item, index) => ({
            name: item.tag.content,
            value: Math.round(item.percent * 100) / 100,
            count: item.total,
            color: COLORS[index % COLORS.length]
        })).filter(item => item.value > 0);
    };

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        if(percent < 0.05) {
            return null; 
        }

        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text 
                x={x} 
                y={y} 
                fill="white" 
                textAnchor={x > cx ? 'start' : 'end'} 
                dominantBaseline="central"
                fontSize="12"
                fontWeight="bold"
            >
                {`${(percent * 100).toFixed(1)}%`}
            </text>
        );
    };

    const CustomLineTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                    padding: '16px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '12px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    minWidth: '220px'
                }}>
                    <div style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '8px', marginBottom: '8px' }}>
                        <Text strong style={{ color: '#722ed1', fontSize: '14px' }}>
                            📅 {data.fullDate} ({data.weekday})
                        </Text>
                    </div>
                    
                    <div style={{ marginBottom: '8px' }}>
                        <Text style={{ color: '#1890ff', fontSize: '13px', display: 'block' }}>
                            📊 情绪评分: <strong>{data.score.toFixed(1)} 分</strong>
                        </Text>
                        <Text style={{ color: '#52c41a', fontSize: '13px', display: 'block' }}>
                            📈 数据总量: <strong>{data.total} 条</strong>
                        </Text>
                    </div>
                    
                    <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '8px' }}>
                        <Text style={{ color: '#8c8c8c', fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                            情绪分布详情:
                        </Text>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text style={{ color: '#52c41a', fontSize: '11px' }}>
                                😊 {data.positive}
                            </Text>
                            <Text style={{ color: '#faad14', fontSize: '11px' }}>
                                😐 {data.neutral}
                            </Text>
                            <Text style={{ color: '#ff4d4f', fontSize: '11px' }}>
                                😔 {data.negative}
                            </Text>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    const CustomPieTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                    padding: '12px 16px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                    <Text strong style={{ color: '#722ed1', fontSize: '14px', display: 'block' }}>
                        {data.name}
                    </Text>
                    <Text style={{ color: '#1890ff', fontSize: '13px', display: 'block' }}>
                        占比: {data.value}%
                    </Text>
                    <Text style={{ color: '#52c41a', fontSize: '13px', display: 'block' }}>
                        数量: {data.count} 条记录
                    </Text>
                </div>
            );
        }
        return null;
    };

    useEffect(() => {
        const fetch = async () => {
            if(dateRange && dateRange.length === 2) {
                const [start, end] = dateRange;
                const startDate = start.unix() * 1000;
                const endDate = end.unix() * 1000;
                const fetched_datas = await scanEmotionData(startDate, endDate, interval);
                setEmotionData(fetched_datas);
            }
            else {
                setEmotionData(null);
            }
        }
        fetch();
    }, [dateRange, interval]);

    const timeChartData = emotionData ? formatTimeData(
        emotionData.timeDatas, 
        emotionData.startDate, 
        emotionData.interval
    ) : [];
    
    const moodChartData = emotionData ? formatMoodData(emotionData.ratioDatas) : [];

    const totalDataCount = emotionData?.totalNum;
    const averageScore = emotionData?.avgScore;
    const highestScore = timeChartData.length > 0 ? Math.max(...timeChartData.map(item => item.score)).toFixed(1) : 0;
    const lowestScore = timeChartData.length > 0 ? Math.min(...timeChartData.map(item => item.score)).toFixed(1) : 0;
    const dailyAverage = timeChartData.length > 0 ? Math.round(totalDataCount / emotionData.totalDate) : 0;

    return (
        <Card
            style={{
                background: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
                border: '1px solid #d3adf7',
                borderRadius: '16px',
                boxShadow: '0 8px 24px rgba(114, 46, 209, 0.12)'
            }}
            title={
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '24px' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        background: 'linear-gradient(135deg, #722ed1 0%, #9254de 100%)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '16px',
                        boxShadow: '0 4px 12px rgba(114, 46, 209, 0.3)'
                    }}>
                        <BarChartOutlined style={{ color: '#fff', fontSize: '20px' }} />
                    </div>
                    <div>
                        <Title level={4} style={{ 
                            margin: 0,
                            background: 'linear-gradient(135deg, #722ed1 0%, #9254de 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>
                            情绪数据统计分析
                        </Title>
                        <Text style={{ color: '#8c8c8c', fontSize: '14px' }}>
                            深度分析用户情绪变化趋势和分布特征
                        </Text>
                    </div>
                </div>
            }
        >
            <Card 
                size="small" 
                style={{ 
                    marginBottom: '24px',
                    background: 'rgba(255, 255, 255, 0.8)',
                    border: '1px solid rgba(114, 46, 209, 0.15)',
                    borderRadius: '12px'
                }}
            >
                <Row gutter={24} align="middle">
                    <Col>
                        <Space align="center">
                            <CalendarOutlined style={{ color: '#722ed1', fontSize: '16px' }} />
                            <Text strong style={{ color: '#722ed1' }}>时间范围：</Text>
                        </Space>
                    </Col>
                    <Col>
                        <RangePicker
                            onChange={handleRangeChange}
                            placeholder={['开始日期', '结束日期']}
                            size="large"
                            style={{ width: '280px' }}
                        />
                    </Col>
                    <Col>
                        <Space align="center">
                            <ClockCircleOutlined style={{ color: '#722ed1', fontSize: '16px' }} />
                            <Text strong style={{ color: '#722ed1' }}>间隔：</Text>
                        </Space>
                    </Col>
                    <Col>
                        <Select
                            value={interval}
                            onChange={handleIntervalChange}
                            size="large"
                            style={{ width: '120px' }}
                            options={[
                                { label: '1天', value: 1 },
                                { label: '3天', value: 3 },
                                { label: '1周', value: 7 },
                                { label: '2周', value: 14 },
                                { label: '1月', value: 30 }
                            ]}
                        />
                    </Col>
                    <Col>
                        <Space align="center">
                            <Text style={{ color: '#722ed1', fontSize: '14px' }}>图表类型:</Text>
                            <Select
                                value={chartType}
                                onChange={setChartType}
                                size="large"
                                style={{ width: '100px' }}
                                options={[
                                    { label: '折线图', value: 'line' },
                                    { label: '面积图', value: 'area' }
                                ]}
                            />
                        </Space>
                    </Col>
                    {emotionData && (
                        <Col flex="auto">
                            <div style={{ textAlign: 'right' }}>
                                <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>
                                    统计周期：{emotionData.totalNum} 条数据记录
                                </Text>
                            </div>
                        </Col>
                    )}
                </Row>
            </Card>

            {!emotionData ? (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                        <div>
                            <Text style={{ color: '#8c8c8c', fontSize: '16px' }}>
                                请选择时间范围开始数据分析
                            </Text>
                            <br />
                            <Text style={{ color: '#bfbfbf', fontSize: '14px' }}>
                                支持多种时间间隔和图表类型展示
                            </Text>
                        </div>
                    }
                    style={{ padding: '60px 0' }}
                />
            ) : (
                <>
                    <Row gutter={16} style={{ marginBottom: '24px' }}>
                        <Col xs={12} sm={6}>
                            <Card size="small" style={{ 
                                background: 'rgba(255, 255, 255, 0.9)',
                                border: '1px solid rgba(114, 46, 209, 0.2)',
                                textAlign: 'center',
                                borderRadius: '12px'
                            }}>
                                <Statistic 
                                    title="累计数据" 
                                    value={totalDataCount} 
                                    valueStyle={{ color: '#722ed1', fontSize: '20px' }}
                                    prefix={<BarChartOutlined />}
                                    suffix="条"
                                />
                            </Card>
                        </Col>
                        <Col xs={12} sm={6}>
                            <Card size="small" style={{ 
                                background: 'rgba(255, 255, 255, 0.9)',
                                border: '1px solid rgba(24, 144, 255, 0.2)',
                                textAlign: 'center',
                                borderRadius: '12px'
                            }}>
                                <Statistic 
                                    title="平均评分" 
                                    value={averageScore} 
                                    valueStyle={{ color: '#1890ff', fontSize: '20px' }}
                                    prefix={<LineChartOutlined />}
                                    suffix="分"
                                />
                            </Card>
                        </Col>
                        <Col xs={12} sm={6}>
                            <Card size="small" style={{ 
                                background: 'rgba(255, 255, 255, 0.9)',
                                border: '1px solid rgba(82, 196, 26, 0.2)',
                                textAlign: 'center',
                                borderRadius: '12px'
                            }}>
                                <Statistic 
                                    title="最高评分" 
                                    value={highestScore} 
                                    valueStyle={{ color: '#52c41a', fontSize: '20px' }}
                                    suffix="分"
                                />
                            </Card>
                        </Col>
                        <Col xs={12} sm={6}>
                            <Card size="small" style={{ 
                                background: 'rgba(255, 255, 255, 0.9)',
                                border: '1px solid rgba(250, 173, 20, 0.2)',
                                textAlign: 'center',
                                borderRadius: '12px'
                            }}>
                                <Statistic 
                                    title="日均数据" 
                                    value={dailyAverage} 
                                    valueStyle={{ color: '#faad14', fontSize: '20px' }}
                                    suffix="条"
                                />
                            </Card>
                        </Col>
                    </Row>

                    <Card
                        size="small"
                        style={{
                            marginBottom: '24px',
                            background: 'rgba(255, 255, 255, 0.7)',
                            border: '1px solid rgba(114, 46, 209, 0.1)',
                            borderRadius: '12px'
                        }}
                    >
                        <Row gutter={16}>
                            <Col span={12}>
                                <Text style={{ color: '#8c8c8c', fontSize: '12px' }}>评分范围</Text>
                                <br />
                                <Text style={{ color: '#722ed1', fontSize: '14px', fontWeight: 'bold' }}>
                                    {lowestScore} - {highestScore} 分
                                </Text>
                            </Col>
                            <Col span={12}>
                                <Text style={{ color: '#8c8c8c', fontSize: '12px' }}>统计周期</Text>
                                <br />
                                <Text style={{ color: '#722ed1', fontSize: '14px', fontWeight: 'bold' }}>
                                    {emotionData.totalDate} 天
                                </Text>
                            </Col>
                        </Row>
                    </Card>

                    <Row gutter={24}>
                        <Col xs={24} lg={14}>
                            <Card
                                title={
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Space>
                                            <LineChartOutlined style={{ color: '#722ed1' }} />
                                            <span>情绪评分趋势分析</span>
                                        </Space>
                                        <Space>
                                            <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>显示数据点:</Text>
                                            <Switch 
                                                size="small" 
                                                checked={showDataPoints} 
                                                onChange={setShowDataPoints}
                                            />
                                        </Space>
                                    </div>
                                }
                                style={{
                                    background: 'rgba(255, 255, 255, 0.9)',
                                    border: '1px solid rgba(114, 46, 209, 0.15)',
                                    borderRadius: '12px'
                                }}
                            >
                                <ResponsiveContainer width="100%" height={350}>
                                    {chartType === 'area' ? (
                                        <AreaChart data={timeChartData}>
                                            <defs>
                                                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#722ed1" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#722ed1" stopOpacity={0.1}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                            <XAxis 
                                                dataKey="time" 
                                                stroke="#8c8c8c"
                                                fontSize={12}
                                            />
                                            <YAxis 
                                                stroke="#8c8c8c"
                                                fontSize={12}
                                                domain={[0, 10]}
                                            />
                                            <Tooltip content={<CustomLineTooltip />} />
                                            <Area
                                                type="monotone"
                                                dataKey="score"
                                                stroke="#722ed1"
                                                strokeWidth={3}
                                                fillOpacity={1}
                                                fill="url(#colorScore)"
                                                dot={showDataPoints ? { fill: '#722ed1', strokeWidth: 2, r: 4 } : false}
                                                activeDot={{ r: 6, stroke: '#722ed1', strokeWidth: 2 }}
                                            />
                                        </AreaChart>
                                    ) : (
                                        <LineChart data={timeChartData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                            <XAxis 
                                                dataKey="time" 
                                                stroke="#8c8c8c"
                                                fontSize={12}
                                            />
                                            <YAxis 
                                                stroke="#8c8c8c"
                                                fontSize={12}
                                                domain={[0, 10]}
                                            />
                                            <Tooltip content={<CustomLineTooltip />} />
                                            <Line 
                                                type="monotone" 
                                                dataKey="score" 
                                                stroke="#722ed1" 
                                                strokeWidth={3}
                                                dot={showDataPoints ? { fill: '#722ed1', strokeWidth: 2, r: 4 } : false}
                                                activeDot={{ r: 6, stroke: '#722ed1', strokeWidth: 2 }}
                                            />
                                        </LineChart>
                                    )}
                                </ResponsiveContainer>
                            </Card>
                        </Col>

                        <Col xs={24} lg={10}>
                            <Card
                                title={
                                    <Space>
                                        <PieChartOutlined style={{ color: '#722ed1' }} />
                                        <span>情绪类型分布占比</span>
                                    </Space>
                                }
                                style={{
                                    background: 'rgba(255, 255, 255, 0.9)',
                                    border: '1px solid rgba(114, 46, 209, 0.15)',
                                    borderRadius: '12px'
                                }}
                            >
                                {moodChartData.length > 0 ? (
                                    <>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie
                                                    data={moodChartData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={renderCustomizedLabel}
                                                    outerRadius={90}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                >
                                                    {moodChartData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip content={<CustomPieTooltip />} />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        
                                        <Divider style={{ margin: '16px 0' }} />
                                        <div style={{ padding: '0 16px' }}>
                                            <Text style={{ color: '#8c8c8c', fontSize: '12px', display: 'block', marginBottom: '8px' }}>
                                                情绪分布摘要
                                            </Text>
                                            <Row gutter={8}>
                                                {moodChartData.slice(0, 3).map((item, index) => (
                                                    <Col span={8} key={index}>
                                                        <div style={{ textAlign: 'center' }}>
                                                            <div style={{
                                                                width: '12px',
                                                                height: '12px',
                                                                background: item.color,
                                                                borderRadius: '50%',
                                                                margin: '0 auto 4px',
                                                            }}></div>
                                                            <Text style={{ fontSize: '11px', color: '#595959' }}>
                                                                {item.name}
                                                            </Text>
                                                            <br />
                                                            <Text style={{ fontSize: '12px', fontWeight: 'bold', color: item.color }}>
                                                                {item.value}%
                                                            </Text>
                                                        </div>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </div>
                                    </>
                                ) : (
                                    <Empty 
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                        description="暂无情绪分布数据"
                                        style={{ padding: '60px 0' }}
                                    />
                                )}
                            </Card>
                        </Col>
                    </Row>
                </>
            )}
        </Card>
    )
}