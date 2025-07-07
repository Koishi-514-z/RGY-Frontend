import React, { useState, useEffect } from "react";
import { Card, DatePicker, Row, Col, Button, Typography, Space, Avatar, Tag, Divider, Modal, App, Select } from "antd";
import { CalendarOutlined, ClockCircleOutlined, UserOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';
import { getDateAvailables, addCounseling, getCounselingTags } from "../../service/counseling";

const { Title, Text } = Typography;

export default function SubscribeCard({psyProfile}) {
    const [dateAvailables, setDateAvailables] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [typeTags, setTypeTags] = useState([]);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const { message } = App.useApp();

    useEffect(() => {
        const fetch = async () => {
            const fetched_tags = await getCounselingTags();
            setTypeTags(fetched_tags);
        }
        fetch();
    }, []);

    const handleDateChange = async (date) => {
        if(!date) {
            return;
        }
        setSelectedDate(date);
        setSelectedTimeSlot(null);
    
        const timestamp = date.unix() * 1000;
        const fetched_available = await getDateAvailables(psyProfile.userid, timestamp);
        setDateAvailables(fetched_available);
    };

    const handleTimeSlotSelect = (timeSlot) => {
        setSelectedTimeSlot(timeSlot);
    };

    const handleConfirmAppointment = async () => {
        if(!selectedDate || !selectedTimeSlot) {
            message.warning('请选择预约时间');
            return;
        }
        const date = new Date(selectedDate.unix() * 1000);
        const selectedTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), selectedTimeSlot);
        const counseling = {
            psyid: psyProfile.userid,
            timestamp: selectedTime.getTime(),
            type: typeTags.find(tag => tag.id === selectedType),
            status: 0
        }
        const res = await addCounseling(counseling);
        if(res) {
            message.success('预约成功！');
            setConfirmModalVisible(false);
            handleDateChange(selectedDate);
        }
        else {
            message.error('预约失败，请检查网络');
        }
    };

    const disabledDate = (current) => {
        return current && current < dayjs().startOf('day');
    };

    const formatHour = (hour) => {
        return `${hour}:00-${hour + 1}:00`;
    };

    const renderTimeSlots = () => {
        if (!selectedDate) {
            return (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <CalendarOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
                    <Text style={{ color: '#8c8c8c', display: 'block' }}>
                        请先选择预约日期
                    </Text>
                </div>
            );
        }

        if (dateAvailables.length === 0) {
            return (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <ExclamationCircleOutlined style={{ fontSize: '48px', color: '#faad14', marginBottom: '16px' }} />
                    <Text style={{ color: '#8c8c8c', display: 'block' }}>
                        该日期暂无可预约时间段
                    </Text>
                </div>
            );
        }

        return (
            <Row gutter={[12, 12]}>
                {dateAvailables.map((timeSlot, index) => (
                    <Col xs={12} sm={8} md={6} key={index}>
                        <Button
                            style={{
                                width: '100%',
                                height: '60px',
                                borderRadius: '12px',
                                border: selectedTimeSlot === timeSlot 
                                    ? '2px solid #722ed1' 
                                    : '1px solid rgba(114, 46, 209, 0.2)',
                                background: selectedTimeSlot === timeSlot 
                                    ? 'linear-gradient(135deg, #722ed1 0%, #9254de 100%)'
                                    : 'rgba(255, 255, 255, 0.8)',
                                color: selectedTimeSlot === timeSlot ? '#fff' : '#722ed1',
                                fontWeight: '500',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s ease',
                                boxShadow: selectedTimeSlot === timeSlot 
                                    ? '0 4px 12px rgba(114, 46, 209, 0.3)'
                                    : '0 2px 8px rgba(0,0,0,0.1)'
                            }}
                            onClick={() => handleTimeSlotSelect(timeSlot)}
                            onMouseEnter={(e) => {
                                if (selectedTimeSlot !== timeSlot) {
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 4px 16px rgba(114, 46, 209, 0.2)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (selectedTimeSlot !== timeSlot) {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                                }
                            }}
                        >
                            <ClockCircleOutlined style={{ fontSize: '16px', marginBottom: '4px' }} />
                            <Text style={{ 
                                fontSize: '14px', 
                                color: selectedTimeSlot === timeSlot ? '#fff' : '#722ed1',
                                fontWeight: '600'
                            }}>
                                {timeSlot}
                            </Text>
                        </Button>
                    </Col>
                ))}
            </Row>
        );
    };

    return (
        <div style={{ padding: '24px 0' }}>
            <Card 
                style={{ 
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid rgba(114, 46, 209, 0.15)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 6px 20px rgba(114, 46, 209, 0.12)',
                    backdropFilter: 'blur(10px)'
                }}
                title={
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        padding: '8px 0'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
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
                                <CalendarOutlined style={{ color: '#fff', fontSize: '20px' }} />
                            </div>
                            <div>
                                <Title level={4} style={{ 
                                    margin: 0,
                                    background: 'linear-gradient(135deg, #722ed1 0%, #9254de 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text'
                                }}>
                                    预约咨询时间
                                </Title>
                                <Text style={{ color: '#8c8c8c', fontSize: '14px' }}>
                                    选择合适的时间开始咨询
                                </Text>
                            </div>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Avatar 
                                src={psyProfile.avatar} 
                                size={40}
                                icon={<UserOutlined />}
                                style={{ 
                                    backgroundColor: '#722ed1',
                                    border: '2px solid #fff',
                                    boxShadow: '0 2px 8px rgba(114, 46, 209, 0.2)'
                                }}
                            />
                            <div>
                                <Text style={{ fontWeight: '600', color: '#262626' }}>
                                    {psyProfile.username}
                                </Text>
                                <Tag 
                                    style={{
                                        marginLeft: '8px',
                                        background: 'linear-gradient(135deg, #722ed1 0%, #9254de 100%)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: '#fff',
                                        fontSize: '11px'
                                    }}
                                >
                                    {psyProfile.title}
                                </Tag>
                            </div>
                        </div>
                    </div>
                }
            >
                <Row gutter={32}>
                    <Col xs={24} lg={8}>
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(114, 46, 209, 0.05) 0%, rgba(114, 46, 209, 0.1) 100%)',
                            borderRadius: '12px',
                            padding: '24px',
                            height: '100%',
                            minHeight: '200px'
                        }}>
                            <Title level={5} style={{ 
                                marginBottom: '16px',
                                color: '#722ed1'
                            }}>
                                选择日期
                            </Title>
                            
                            <DatePicker 
                                onChange={handleDateChange}
                                disabledDate={disabledDate}
                                placeholder="选择预约日期"
                                style={{ 
                                    width: '100%', 
                                    marginBottom: '16px',
                                    borderRadius: '8px'
                                }}
                                size="large"
                            />

                            <div style={{ marginBottom: '16px' }}>
                                <Text style={{ 
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: '#722ed1'
                                }}>
                                    咨询类别
                                </Text>
                                <Select
                                    size="large"
                                    placeholder="选择预约类别"
                                    onChange={value => setSelectedType(value)}
                                    options={typeTags.map(tag => ({ label: tag.content, value: tag.id }))}
                                    style={{ 
                                        width: '100%',
                                        borderRadius: '8px'
                                    }}
                                    maxTagCount="responsive"
                                />
                            </div>
                            
                            {selectedDate && (
                                <div style={{
                                    background: 'rgba(255, 255, 255, 0.8)',
                                    borderRadius: '8px',
                                    padding: '16px',
                                    marginTop: '16px'
                                }}>
                                    <Text style={{ 
                                        fontSize: '12px', 
                                        color: '#8c8c8c',
                                        display: 'block',
                                        marginBottom: '4px'
                                    }}>
                                        已选择日期
                                    </Text>
                                    <Text style={{ 
                                        fontSize: '16px', 
                                        fontWeight: '600',
                                        color: '#722ed1'
                                    }}>
                                        {selectedDate.format('YYYY年MM月DD日')}
                                    </Text>
                                    <Text style={{ 
                                        fontSize: '12px', 
                                        color: '#8c8c8c',
                                        display: 'block',
                                        marginTop: '4px'
                                    }}>
                                        {selectedDate.format('dddd')}
                                    </Text>
                                    
                                    {selectedType && (
                                        <div style={{ marginTop: '12px' }}>
                                            <Text style={{ 
                                                fontSize: '12px', 
                                                color: '#8c8c8c',
                                                display: 'block',
                                                marginBottom: '4px'
                                            }}>
                                                咨询类别
                                            </Text>
                                            <Tag style={{
                                                background: 'linear-gradient(135deg, #722ed1 0%, #9254de 100%)',
                                                border: 'none',
                                                borderRadius: '6px',
                                                color: '#fff',
                                                fontSize: '12px'
                                            }}>
                                                {typeTags.find(tag => tag.id === selectedType)?.content}
                                            </Tag>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </Col>

                    <Col xs={24} lg={16}>
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.5)',
                            borderRadius: '12px',
                            padding: '24px',
                            minHeight: '200px'
                        }}>
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                marginBottom: '20px'
                            }}>
                                <Title level={5} style={{ 
                                    margin: 0,
                                    color: '#722ed1'
                                }}>
                                    可预约时间段
                                </Title>
                                {selectedDate && dateAvailables.length > 0 && (
                                    <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>
                                        共 {dateAvailables.length} 个时间段可选
                                    </Text>
                                )}
                            </div>
                            
                            {renderTimeSlots()}
                        </div>
                    </Col>
                </Row>

                {selectedDate && selectedTimeSlot && selectedType && (
                    <div style={{ marginTop: '24px', textAlign: 'center' }}>
                        <Divider />
                        <Space size={16}>
                            <Text style={{ 
                                fontSize: '14px', 
                                color: '#595959'
                            }}>
                                预约时间：{selectedDate?.format('MM月DD日')} {formatHour(selectedTimeSlot)}
                            </Text>
                            <Button 
                                type="primary" 
                                size="large"
                                icon={<CheckCircleOutlined />}
                                style={{
                                    background: 'linear-gradient(135deg, #722ed1 0%, #9254de 100%)',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontWeight: '600',
                                    fontSize: '16px',
                                    padding: '12px 32px',
                                    height: 'auto',
                                    boxShadow: '0 6px 16px rgba(114, 46, 209, 0.3)'
                                }}
                                onClick={() => setConfirmModalVisible(true)}
                            >
                                确认预约
                            </Button>
                        </Space>
                    </div>
                )}
            </Card>

            <Modal
                title="确认预约信息"
                open={confirmModalVisible}
                onCancel={() => setConfirmModalVisible(false)}
                footer={[
                    <Button 
                        key="cancel" 
                        onClick={() => setConfirmModalVisible(false)}
                        style={{ borderRadius: '8px' }}
                    >
                        取消
                    </Button>,
                    <Button 
                        key="confirm" 
                        type="primary" 
                        onClick={handleConfirmAppointment}
                        style={{
                            background: 'linear-gradient(135deg, #722ed1 0%, #9254de 100%)',
                            border: 'none',
                            borderRadius: '8px'
                        }}
                    >
                        确认预约
                    </Button>
                ]}
                style={{ borderRadius: '16px' }}
            >
                <div style={{ padding: '16px 0' }}>
                    <Space direction="vertical" size={16} style={{ width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Avatar 
                                src={psyProfile.avatar} 
                                size={48}
                                icon={<UserOutlined />}
                                style={{ backgroundColor: '#722ed1' }}
                            />
                            <div>
                                <Text style={{ fontWeight: '600', fontSize: '16px' }}>
                                    {psyProfile.username}
                                </Text>
                                <Text style={{ 
                                    display: 'block', 
                                    color: '#8c8c8c', 
                                    fontSize: '14px' 
                                }}>
                                    {psyProfile.title}
                                </Text>
                            </div>
                        </div>
                        
                        <Divider style={{ margin: '12px 0' }} />
                        
                        <div>
                            <Text style={{ color: '#8c8c8c', fontSize: '14px' }}>预约时间</Text>
                            <Text style={{ 
                                display: 'block', 
                                fontSize: '16px', 
                                fontWeight: '600',
                                color: '#722ed1',
                                marginTop: '4px'
                            }}>
                                {selectedDate?.format('YYYY年MM月DD日')} {formatHour(selectedTimeSlot)}
                            </Text>
                        </div>

                        <div>
                            <Text style={{ color: '#8c8c8c', fontSize: '14px' }}>咨询类别</Text>
                            <div style={{ marginTop: '8px' }}>
                                <Tag style={{
                                    background: 'linear-gradient(135deg, #722ed1 0%, #9254de 100%)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: '#fff',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    padding: '6px 16px'
                                }}>
                                    {typeTags.find(tag => tag.id === selectedType)?.content}
                                </Tag>
                            </div>
                        </div>
                    </Space>
                </div>
            </Modal>
        </div>
    );
}