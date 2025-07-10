import React, { useState, useEffect } from "react";
import { 
    Card, DatePicker, App, Tooltip, Button, Table, Space, Tag, Typography, 
    Row, Col, Statistic, Empty, Select
} from "antd";
import { 
    CalendarOutlined, CheckOutlined, CloseOutlined, ClockCircleOutlined,
    FilterOutlined, EyeOutlined
} from "@ant-design/icons";
import { setStatus } from "../../service/counseling";
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export default function CounselingView({counseling, fetchCounseling}) {
    const [selectedTime, setSelectedTime] = useState(null);
    const [dateRange, setDateRange] = useState(null);
    const [dateCounseling, setDateCounseling] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all');
    const { message } = App.useApp();

    useEffect(() => {
        let filteredData = counseling;

        if (selectedTime) {
            filteredData = filteredData.filter(data => {
                const dataTime = new Date(data.timestamp);
                const dataDate = new Date(dataTime.getFullYear(), dataTime.getMonth(), dataTime.getDate());
                return dataDate.getTime() === selectedTime;
            });
        }

        if (dateRange && dateRange.length === 2) {
            const [start, end] = dateRange;
            filteredData = filteredData.filter(data => {
                const dataTime = dayjs(data.timestamp);
                return dataTime.isAfter(start.startOf('day')) && dataTime.isBefore(end.endOf('day'));
            });
        }

        if (statusFilter !== 'all') {
            filteredData = filteredData.filter(data => data.status === parseInt(statusFilter));
        }

        setDateCounseling(filteredData);
    }, [selectedTime, dateRange, statusFilter, counseling]);

    const handleTimeChange = (date) => {
        if (date) {
            const timestamp = date.unix() * 1000;
            setSelectedTime(timestamp);
        } else {
            setSelectedTime(null);
        }
    }

    const handleRangeChange = (dates) => {
        setDateRange(dates);
        setSelectedTime(null);
    }

    const changeStatus = async (counselingid, status) => {
        const res = await setStatus(counselingid, status);
        if(!res) {
            message.error('操作失败');
        }
        else {
            message.success('操作成功');
            fetchCounseling();
            
        }
    }

    const getStatusStats = () => {
        const stats = {
            pending: 0,
            accepted: 0,
            finished: 0,
            rejected: 0
        };
        
        counseling.forEach(item => {
            switch(item.status) {
                case 0: stats.pending++; break;
                case 1: stats.accepted++; break;
                case 2: stats.finished++; break;
                case 3: stats.rejected++; break;
            }
        });
        
        return stats;
    };

    const stats = getStatusStats();

    const renderStatus = (status) => {
        const statusConfig = {
            0: { text: '待处理', color: 'orange', icon: <ClockCircleOutlined /> },
            1: { text: '已接受', color: 'blue', icon: <CheckOutlined /> },
            2: { text: '已完成', color: 'green', icon: <CheckOutlined /> },
            3: { text: '已拒绝', color: 'red', icon: <CloseOutlined /> }
        };
        
        const config = statusConfig[status];
        return (
            <Tag 
                icon={config.icon} 
                color={config.color}
                style={{ borderRadius: '12px', fontWeight: '500' }}
            >
                {config.text}
            </Tag>
        );
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'counselingid',
            key: 'counselingid',
            width: 60,
            render: (id) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Text strong style={{ fontSize: '13px', color: '#1890ff' }}>
                        #{id}
                    </Text>
                </div>
            )
        },
        {
            title: '预约时间',
            dataIndex: 'timestamp',
            key: 'time',
            width: 180,
            render: timestamp => (
                <div>
                    <div style={{ fontWeight: '500', color: '#262626' }}>
                        {dayjs(timestamp).format('MM月DD日 dddd')}
                    </div>
                    <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                        {dayjs(timestamp).format('HH:mm')} - {dayjs(timestamp).add(1, 'hour').format('HH:mm')}
                    </div>
                </div>
            ),
            sorter: (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        },
        {
            title: '咨询类型',
            dataIndex: 'type',
            key: 'type',
            width: 100,
            render: (type) => (
                <Tag color="#722ed1" style={{ borderRadius: '8px' }}>
                    {type.content}
                </Tag>
            )
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: renderStatus,
            filters: [
                { text: '待处理', value: 0 },
                { text: '已接受', value: 1 },
                { text: '已完成', value: 2 },
                { text: '已拒绝', value: 3 }
            ],
            onFilter: (value, record) => record.status === value
        },
        {
            title: '操作',
            key: 'action',
            width: 120,
            render: (_, record) => {
                const { status, counselingid } = record;
                
                return (
                    <Space size={4}>
                        {status === 0 && (
                            <>
                                <Tooltip title="接受预约">
                                    <Button
                                        type="text"
                                        icon={<CheckOutlined />}
                                        size="small"
                                        onClick={() => changeStatus(counselingid, 1)}
                                        style={{ 
                                            color: '#52c41a',
                                            backgroundColor: 'rgba(82, 196, 26, 0.1)',
                                            border: '1px solid rgba(82, 196, 26, 0.3)',
                                            borderRadius: '6px'
                                        }}
                                    />
                                </Tooltip>
                                <Tooltip title="拒绝预约">
                                    <Button
                                        type="text"
                                        icon={<CloseOutlined />}
                                        size="small"
                                        onClick={() => changeStatus(counselingid, 3)}
                                        style={{ 
                                            color: '#ff4d4f',
                                            backgroundColor: 'rgba(255, 77, 79, 0.1)',
                                            border: '1px solid rgba(255, 77, 79, 0.3)',
                                            borderRadius: '6px'
                                        }}
                                    />
                                </Tooltip>
                            </>
                        )}
                        {status === 1 && (
                            <Tooltip title="标记完成">
                                <Button
                                    type="text"
                                    icon={<CheckOutlined />}
                                    size="small"
                                    onClick={() => changeStatus(counselingid, 2)}
                                    style={{ 
                                        color: '#1890ff',
                                        backgroundColor: 'rgba(24, 144, 255, 0.1)',
                                        border: '1px solid rgba(24, 144, 255, 0.3)',
                                        borderRadius: '6px'
                                    }}
                                />
                            </Tooltip>
                        )}
                        {(status === 2 || status === 3) && (
                            <Tooltip title="查看详情">
                                <Button
                                    type="text"
                                    icon={<EyeOutlined />}
                                    size="small"
                                    style={{ 
                                        color: '#8c8c8c',
                                        backgroundColor: 'rgba(140, 140, 140, 0.1)',
                                        border: '1px solid rgba(140, 140, 140, 0.3)',
                                        borderRadius: '6px'
                                    }}
                                />
                            </Tooltip>
                        )}
                    </Space>
                );
            }
        }
    ];

    return (
        <Card
            style={{
                background: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
                border: '1px solid #d3adf7',
                borderRadius: '16px',
                boxShadow: '0 8px 24px rgba(114, 46, 209, 0.12)'
            }}
        >
            <div style={{ marginBottom: '24px' }}>
                <Title level={4} style={{ margin: 0, color: '#722ed1' }}>
                    <CalendarOutlined style={{ marginRight: '8px' }} />
                    预约记录管理
                </Title>
                <Text style={{ color: '#8c8c8c', fontSize: '13px' }}>
                    查看和管理您的咨询预约记录
                </Text>
            </div>

            <Row gutter={16} style={{ marginBottom: '24px' }}>
                <Col span={6}>
                    <Card size="small" style={{ 
                        background: 'rgba(250, 173, 20, 0.1)',
                        border: '1px solid rgba(250, 173, 20, 0.3)',
                        borderRadius: '8px'
                    }}>
                        <Statistic
                            title="待处理"
                            value={stats.pending}
                            valueStyle={{ color: '#faad14', fontSize: '20px' }}
                            prefix={<ClockCircleOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small" style={{ 
                        background: 'rgba(24, 144, 255, 0.1)',
                        border: '1px solid rgba(24, 144, 255, 0.3)',
                        borderRadius: '8px'
                    }}>
                        <Statistic
                            title="已接受"
                            value={stats.accepted}
                            valueStyle={{ color: '#1890ff', fontSize: '20px' }}
                            prefix={<CheckOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small" style={{ 
                        background: 'rgba(82, 196, 26, 0.1)',
                        border: '1px solid rgba(82, 196, 26, 0.3)',
                        borderRadius: '8px'
                    }}>
                        <Statistic
                            title="已完成"
                            value={stats.finished}
                            valueStyle={{ color: '#52c41a', fontSize: '20px' }}
                            prefix={<CheckOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small" style={{ 
                        background: 'rgba(255, 77, 79, 0.1)',
                        border: '1px solid rgba(255, 77, 79, 0.3)',
                        borderRadius: '8px'
                    }}>
                        <Statistic
                            title="已拒绝"
                            value={stats.rejected}
                            valueStyle={{ color: '#ff4d4f', fontSize: '20px' }}
                            prefix={<CloseOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            <Card size="small" style={{ 
                marginBottom: '16px',
                background: 'rgba(255, 255, 255, 0.6)',
                border: '1px solid rgba(114, 46, 209, 0.1)'
            }}>
                <Row gutter={16} align="middle">
                    <Col>
                        <Text strong style={{ color: '#722ed1' }}>
                            <FilterOutlined style={{ marginRight: '4px' }} />
                            筛选条件：
                        </Text>
                    </Col>
                    <Col>
                        <Space>
                            <Text style={{ fontSize: '13px' }}>单日查询：</Text>
                            <DatePicker 
                                onChange={handleTimeChange}
                                placeholder="选择日期"
                                size="small"
                                style={{ width: '130px' }}
                            />
                        </Space>
                    </Col>
                    <Col>
                        <Space>
                            <Text style={{ fontSize: '13px' }}>日期范围：</Text>
                            <RangePicker
                                onChange={handleRangeChange}
                                placeholder={['开始日期', '结束日期']}
                                size="small"
                                style={{ width: '240px' }}
                            />
                        </Space>
                    </Col>
                    <Col>
                        <Space>
                            <Text style={{ fontSize: '13px' }}>状态：</Text>
                            <Select
                                value={statusFilter}
                                onChange={setStatusFilter}
                                size="small"
                                style={{ width: '100px' }}
                                options={[
                                    { label: '全部', value: 'all' },
                                    { label: '待处理', value: '0' },
                                    { label: '已接受', value: '1' },
                                    { label: '已完成', value: '2' },
                                    { label: '已拒绝', value: '3' }
                                ]}
                            />
                        </Space>
                    </Col>
                    <Col flex="auto">
                        <div style={{ textAlign: 'right' }}>
                            <Button 
                                size="small" 
                                onClick={() => {
                                    setSelectedTime(null);
                                    setDateRange(null);
                                    setStatusFilter('all');
                                }}
                            >
                                重置筛选
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Card>

            <Table
                columns={columns}
                dataSource={dateCounseling}
                rowKey={item => item.counselingid}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => 
                        `第 ${range[0]}-${range[1]} 条，共 ${total} 条记录`
                }}
                locale={{
                    emptyText: (
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description="暂无预约记录"
                            style={{ padding: '40px 0' }}
                        />
                    )
                }}
                scroll={{ x: 'max-content' }}
                style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '12px',
                    overflow: 'hidden'
                }}
            />
        </Card>
    );
}