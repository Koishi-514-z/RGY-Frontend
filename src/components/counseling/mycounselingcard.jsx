import React, { useState, useEffect } from "react";
import { 
    Card, DatePicker, App, Tooltip, Button, Table, Space, Tag, Typography, 
    Row, Col, Statistic, Empty, Select, Modal, Rate, Input, Avatar
} from "antd";
import { 
    CalendarOutlined, CheckOutlined, CloseOutlined, ClockCircleOutlined,
    MessageOutlined, FilterOutlined, StarOutlined, HeartOutlined, UserOutlined
} from "@ant-design/icons";
import { addComment, getPsySingle, setStatus } from "../../service/counseling";
import dayjs from 'dayjs';
import { createSession, getSessionid } from "../../service/chat";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export default function MyCousnelingCard({counseling, psyProfiles, setPsyProfiles}) {
    const [selectedTime, setSelectedTime] = useState(null);
    const [dateRange, setDateRange] = useState(null);
    const [dateCounseling, setDateCounseling] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all');
    const [ratingModalVisible, setRatingModalVisible] = useState(false);
    const [currentRecord, setCurrentRecord] = useState(null);
    const [rating, setRating] = useState(5);
    const [isSatisfied, setIsSatisfied] = useState(true);
    const { message } = App.useApp();
    const navigate = useNavigate();

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

    const getPsyProfile = (psyid) => {
        return psyProfiles.find(profile => profile.userid === psyid);
    }

    const handleTimeChange = (date) => {
        if(date) {
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
        }
    }

    const handleContact = async (psyid) => {
        let sessionid = await getSessionid(psyid);
        if(!sessionid) {
            sessionid = await createSession(psyid);
            if(!sessionid) {
                message.error('创建会话失败，请检查网络');
                return;
            }
        }
        navigate(`/chat/${sessionid}`);
    }

    const handleComment = (record) => {
        setCurrentRecord(record);
        setRatingModalVisible(true);
        setRating(5);
        setIsSatisfied(true);
    }

    const handleSubmit = async () => {
        const comment = {
            psyid: currentRecord.psyid,
            score: rating,
            success: isSatisfied
        };
        const res = await addComment(comment);
        if(res) {
            message.success('评价提交成功！');
            setCurrentRecord(null)
            setRatingModalVisible(false);
            const newPsyProfile = await getPsySingle(currentRecord.psyid);
            const updatedProfiles = psyProfiles.map((profile) => {
                if(profile.userid === newPsyProfile.userid) {
                    return newPsyProfile;
                }
                else {
                    return profile;
                }
            });
            setPsyProfiles(updatedProfiles);
            
        } else {
            message.error('评价提交失败，请重试');
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
            3: { text: '已取消', color: 'red', icon: <CloseOutlined /> }
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
            width: 80,
            render: (id) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Text strong style={{ fontSize: '13px', color: '#1890ff' }}>
                        #{id}
                    </Text>
                </div>
            )
        },
        {
            title: '咨询师',
            dataIndex: 'psyid',
            key: 'psyid',
            width: 150,
            render: (psyid) => {
                const psyProfile = getPsyProfile(psyid);
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Avatar 
                            size={32}
                            src={psyProfile.avatar}
                            icon={<UserOutlined />}
                            style={{ backgroundColor: '#1890ff' }}
                        />
                        <div>
                            <div style={{ fontWeight: '500', fontSize: '13px' }}>{psyProfile.username}</div>
                            <div style={{ fontSize: '11px', color: '#8c8c8c' }}>{psyProfile.title}</div>
                        </div>
                    </div>
                );
            }
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
            width: 120,
            render: (type) => (
                <Tag 
                    style={{ 
                        background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '12px'
                    }}
                >
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
                { text: '已取消', value: 3 }
            ],
            onFilter: (value, record) => record.status === value
        },
        {
            title: '操作',
            key: 'action',
            width: 120,
            render: (_, record) => {
                const { status, counselingid, psyid } = record;
                
                return (
                    <Space size={4}>
                        {status === 0 && (
                            <Tooltip title="取消预约">
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
                        )}
                        {status === 1 && (
                            <Tooltip title="联系咨询师">
                                <Button
                                    type="text"
                                    icon={<MessageOutlined />}
                                    size="small"
                                    onClick={() => handleContact(psyid)}
                                    style={{ 
                                        color: '#1890ff',
                                        backgroundColor: 'rgba(24, 144, 255, 0.1)',
                                        border: '1px solid rgba(24, 144, 255, 0.3)',
                                        borderRadius: '6px'
                                    }}
                                />
                            </Tooltip>
                        )}
                        {status === 2 && (
                            <Tooltip title="评价咨询师">
                                <Button
                                    type="text"
                                    icon={<StarOutlined />}
                                    size="small"
                                    onClick={() => handleComment(record)}
                                    style={{ 
                                        color: '#faad14',
                                        backgroundColor: 'rgba(250, 173, 20, 0.1)',
                                        border: '1px solid rgba(250, 173, 20, 0.3)',
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
                background: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
                border: '1px solid #91d5ff',
                borderRadius: '16px',
                boxShadow: '0 8px 24px rgba(24, 144, 255, 0.12)'
            }}
        >
            <Row gutter={16} style={{ marginBottom: '24px' }}>
                <Col span={6}>
                    <Card size="small" style={{ 
                        background: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid rgba(250, 173, 20, 0.3)',
                        textAlign: 'center',
                        borderRadius: '12px'
                    }}>
                        <Statistic 
                            title="待处理" 
                            value={stats.pending} 
                            valueStyle={{ color: '#fa8c16', fontSize: '20px' }}
                            prefix={<ClockCircleOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small" style={{ 
                        background: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid rgba(24, 144, 255, 0.3)',
                        textAlign: 'center',
                        borderRadius: '12px'
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
                        background: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid rgba(82, 196, 26, 0.3)',
                        textAlign: 'center',
                        borderRadius: '12px'
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
                        background: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid rgba(255, 77, 79, 0.3)',
                        textAlign: 'center',
                        borderRadius: '12px'
                    }}>
                        <Statistic 
                            title="已取消" 
                            value={stats.rejected} 
                            valueStyle={{ color: '#ff4d4f', fontSize: '20px' }}
                            prefix={<CloseOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            <div style={{ marginBottom: '24px' }}>
                <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                    <CalendarOutlined style={{ marginRight: '8px' }} />
                    我的预约记录
                </Title>
                <Text style={{ color: '#8c8c8c', fontSize: '13px' }}>
                    查看您的咨询预约记录与状态
                </Text>
            </div>

            <Card size="small" style={{ 
                marginBottom: '16px',
                background: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid rgba(24, 144, 255, 0.15)',
                borderRadius: '12px'
            }}>
                <Row gutter={16} align="middle">
                    <Col>
                        <Text strong style={{ color: '#1890ff' }}>
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
                                style={{
                                    color: '#1890ff',
                                    borderColor: '#1890ff'
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
                    background: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '12px',
                    overflow: 'hidden'
                }}
            />

            <Modal
                title={
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '12px',
                        padding: '8px 0'
                    }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <StarOutlined style={{ color: '#fff', fontSize: '18px' }} />
                        </div>
                        <div>
                            <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                                评价咨询师
                            </Title>
                            <Text style={{ color: '#8c8c8c', fontSize: '12px' }}>
                                为本次咨询体验打分
                            </Text>
                        </div>
                    </div>
                }
                open={ratingModalVisible}
                onCancel={() => setRatingModalVisible(false)}
                footer={[
                    <Button 
                        key="cancel" 
                        onClick={() => setRatingModalVisible(false)}
                        style={{ borderRadius: '8px' }}
                    >
                        取消
                    </Button>,
                    <Button 
                        key="submit" 
                        type="primary" 
                        onClick={handleSubmit}
                        style={{
                            background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
                            border: 'none',
                            borderRadius: '8px'
                        }}
                    >
                        提交评价
                    </Button>
                ]}
                width={500}
                style={{ borderRadius: '16px' }}
            >
                {currentRecord && (
                    <div style={{ padding: '16px 0' }}>
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(24, 144, 255, 0.05) 0%, rgba(24, 144, 255, 0.1) 100%)',
                            borderRadius: '12px',
                            padding: '16px',
                            marginBottom: '24px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Avatar 
                                    size={48}
                                    src={getPsyProfile(currentRecord.psyid).avatar}
                                    icon={<UserOutlined />}
                                    style={{ backgroundColor: '#1890ff' }}
                                />
                                <div>
                                    <Text style={{ fontWeight: '600', fontSize: '16px' }}>
                                        {getPsyProfile(currentRecord.psyid).username}
                                    </Text>
                                    <Text style={{ 
                                        display: 'block', 
                                        color: '#8c8c8c', 
                                        fontSize: '14px' 
                                    }}>
                                        {getPsyProfile(currentRecord.psyid).title}
                                    </Text>
                                </div>
                            </div>
                            <div style={{ marginTop: '12px' }}>
                                <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>
                                    咨询时间：{dayjs(currentRecord.timestamp).format('YYYY年MM月DD日 HH:mm')}
                                </Text>
                            </div>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <Text style={{ 
                                display: 'block', 
                                marginBottom: '12px',
                                fontSize: '14px',
                                fontWeight: '500',
                                color: '#262626'
                            }}>
                                您对本次咨询是否满意？
                            </Text>
                            <Space size={16}>
                                <Button
                                    type={isSatisfied ? "primary" : "default"}
                                    icon={<HeartOutlined />}
                                    onClick={() => setIsSatisfied(true)}
                                    style={{
                                        borderRadius: '20px',
                                        background: isSatisfied 
                                            ? 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)'
                                            : undefined,
                                        border: isSatisfied ? 'none' : '1px solid #d9d9d9'
                                    }}
                                >
                                    满意
                                </Button>
                                <Button
                                    type={!isSatisfied ? "primary" : "default"}
                                    icon={<CloseOutlined />}
                                    onClick={() => setIsSatisfied(false)}
                                    style={{
                                        borderRadius: '20px',
                                        background: !isSatisfied 
                                            ? 'linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%)'
                                            : undefined,
                                        border: !isSatisfied ? 'none' : '1px solid #d9d9d9'
                                    }}
                                >
                                    不满意
                                </Button>
                            </Space>
                        </div>

                        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                            <Text style={{ 
                                display: 'block', 
                                marginBottom: '16px',
                                fontSize: '14px',
                                fontWeight: '500',
                                color: '#262626'
                            }}>
                                请为本次咨询打分
                            </Text>
                            <Rate 
                                value={rating} 
                                onChange={setRating}
                                style={{ fontSize: '32px' }}
                                character={<StarOutlined />}
                            />
                            <Text style={{ 
                                display: 'block', 
                                marginTop: '8px',
                                fontSize: '16px',
                                fontWeight: '600',
                                color: '#1890ff'
                            }}>
                                {rating} 分
                            </Text>
                        </div>
                    </div>
                )}
            </Modal>
        </Card>
    );
}