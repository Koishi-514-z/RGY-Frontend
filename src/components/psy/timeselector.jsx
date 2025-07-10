import React, { useState, useEffect } from "react";
import { Card, Button, Typography, Space, Tag, Row, Col, Tooltip, App, Divider } from "antd";
import { 
    ClockCircleOutlined, CheckOutlined, ClearOutlined, CalendarOutlined, 
    ExclamationCircleOutlined, SaveOutlined, ReloadOutlined, SettingOutlined 
} from "@ant-design/icons";
import { updateAvailableTimes } from "../../service/counseling";

const { Title, Text } = Typography;

export default function TimeSelector({availableTimes, setAvailableTimes}) {
    const { message, modal } = App.useApp();
    const [hasChanges, setHasChanges] = useState(false);

    const weekDays = [
        { key: 'monday', label: '周一', fullName: '星期一' },
        { key: 'tuesday', label: '周二', fullName: '星期二' },
        { key: 'wednesday', label: '周三', fullName: '星期三' },
        { key: 'thursday', label: '周四', fullName: '星期四' },
        { key: 'friday', label: '周五', fullName: '星期五' },
        { key: 'saturday', label: '周六', fullName: '星期六' },
        { key: 'sunday', label: '周日', fullName: '星期日' }
    ];

    const timeSlots = {
        morning: {
            label: '上午',
            icon: '🌅',
            color: '#52c41a',
            hours: [8, 9, 10, 11]
        },
        afternoon: {
            label: '下午',
            icon: '☀️',
            color: '#1890ff',
            hours: [14, 15, 16, 17]
        },
        evening: {
            label: '晚上',
            icon: '🌙',
            color: '#722ed1',
            hours: [19, 20, 21, 22]
        }
    };

    const [selectedTimes, setSelectedTimes] = useState(() => {
        const initial = {};
        weekDays.forEach(day => {
            initial[day.key] = availableTimes[day.key];
        });
        return initial;
    });

    useEffect(() => {
        let hasChanged = false;
        weekDays.forEach(day => {
            availableTimes[day.key].forEach(hour => {
                if(!selectedTimes[day.key].includes(hour)) {
                    hasChanged = true;
                }
            });
            selectedTimes[day.key].forEach(hour => {
                if(!availableTimes[day.key].includes(hour)) {
                    hasChanged = true;
                }
            });
        })
        setHasChanges(hasChanged);
    }, [selectedTimes, availableTimes]);

    const updateTimes = async () => {
        modal.confirm({
            title: '确认修改咨询时间',
            icon: <ExclamationCircleOutlined style={{ color: '#722ed1' }} />,
            content: (
                <div style={{ padding: '16px 0' }}>
                    <Text>您即将修改可预约的咨询时间段，新的时间安排将立即生效。</Text>
                    <div style={{ 
                        marginTop: '12px',
                        padding: '12px',
                        background: '#f9f0ff',
                        borderRadius: '8px',
                        border: '1px solid #d3adf7'
                    }}>
                        <Text strong style={{ color: '#722ed1' }}>
                            📅 新的时间安排：共 {getTotalSelectedSlots()} 个时段
                        </Text>
                        <br />
                        <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>
                            涉及 {Object.keys(selectedTimes).filter(day => 
                                selectedTimes[day].length > 0
                            ).length} 个工作日
                        </Text>
                    </div>
                </div>
            ),
            okText: '确认修改',
            cancelText: '取消',
            okButtonProps: {
                style: {
                    backgroundColor: '#722ed1',
                    borderColor: '#722ed1'
                }
            },
            onOk: async () => {
                const res = await updateAvailableTimes(selectedTimes);
                if(!res) {
                    message.error('修改失败，请稍后重试');
                    return;
                }
                message.success('咨询时间修改成功！');
                setAvailableTimes(selectedTimes);
                setHasChanges(false);
            }
        });
    }

    const resetChanges = () => {
        modal.confirm({
            title: '重置时间设置',
            icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
            content: '确定要重置为原来的时间设置吗？所有未保存的修改将丢失。',
            okText: '确定重置',
            cancelText: '取消',
            okType: 'danger',
            onOk: () => {
                const resetTimes = {};
                weekDays.forEach(day => {
                    resetTimes[day.key] = availableTimes[day.key];
                });
                setSelectedTimes(resetTimes);
                message.info('已重置为原来的时间设置');
            }
        });
    }

    const toggleTimeSlot = (dayKey, hour) => {
        setSelectedTimes(prev => {
            const dayTimes = prev[dayKey];
            const isSelected = dayTimes.includes(hour);
            
            return {
                ...prev,
                [dayKey]: isSelected 
                    ? dayTimes.filter(h => h !== hour)
                    : [...dayTimes, hour].sort((a, b) => a - b)
            };
        });
    };

    const selectTimeSlot = (dayKey, period) => {
        const hours = timeSlots[period].hours;
        setSelectedTimes(prev => {
            const currentHours = prev[dayKey];
            const allSelected = hours.every(h => currentHours.includes(h));
            
            return {
                ...prev,
                [dayKey]: allSelected 
                    ? currentHours.filter(h => !hours.includes(h))
                    : [...new Set([...currentHours, ...hours])].sort((a, b) => a - b)
            };
        });
    };

    const clearDay = (dayKey) => {
        setSelectedTimes(prev => ({
            ...prev,
            [dayKey]: []
        }));
    };

    const selectAllDay = (dayKey) => {
        const allHours = Object.values(timeSlots).flatMap(slot => slot.hours);
        setSelectedTimes(prev => ({
            ...prev,
            [dayKey]: allHours.sort((a, b) => a - b)
        }));
    };

    const formatHour = (hour) => {
        return `${hour}:00-${hour + 1}:00`;
    };

    const getTimeSlotStatus = (dayKey, period) => {
        const hours = timeSlots[period].hours;
        const dayTimes = selectedTimes[dayKey];
        const selectedCount = hours.filter(h => dayTimes.includes(h)).length;
        
        if (selectedCount === 0) return 'none';
        if (selectedCount === hours.length) return 'all';
        return 'partial';
    };

    const getTotalSelectedSlots = () => {
        return Object.values(selectedTimes).reduce((total, dayTimes) => total + dayTimes.length, 0);
    };

    return (
        <Card
            style={{
                background: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
                border: '1px solid #d3adf7',
                borderRadius: '16px',
                boxShadow: '0 8px 24px rgba(114, 46, 209, 0.12)'
            }}
        >
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '24px'
            }}>
                <div style={{ flex: 1 }}>
                    <Title level={4} style={{ margin: 0, color: '#722ed1' }}>
                        <ClockCircleOutlined style={{ marginRight: '8px' }} />
                        设置可预约时间
                    </Title>
                    <Text style={{ color: '#8c8c8c', fontSize: '13px', display: 'block', marginTop: '4px' }}>
                        选择您可以提供咨询服务的时间段
                    </Text>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Tag 
                        icon={<CalendarOutlined />}
                        color="#722ed1"
                        style={{ 
                            fontSize: '12px', 
                            padding: '4px 12px',
                            borderRadius: '12px'
                        }}
                    >
                        已选择 {getTotalSelectedSlots()} 个时段
                    </Tag>
                    
                    {hasChanges && (
                        <Tag 
                            icon={<SettingOutlined />}
                            color="orange"
                            style={{ 
                                fontSize: '12px', 
                                padding: '4px 12px',
                                borderRadius: '12px'
                            }}
                        >
                            有未保存的修改
                        </Tag>
                    )}
                </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
                {weekDays.map((day) => (
                    <div key={day.key} style={{ marginBottom: '24px' }}>
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            marginBottom: '12px' 
                        }}>
                            <Space>
                                <Text strong style={{ 
                                    color: '#722ed1', 
                                    fontSize: '16px',
                                    minWidth: '60px'
                                }}>
                                    {day.label}
                                </Text>
                                {selectedTimes[day.key]?.length > 0 && (
                                    <Tag size="small" color="success">
                                        {selectedTimes[day.key].length} 个时段
                                    </Tag>
                                )}
                            </Space>
                            
                            <Space size={4}>
                                <Button 
                                    size="small" 
                                    type="text"
                                    icon={<CheckOutlined />}
                                    onClick={() => selectAllDay(day.key)}
                                    style={{ color: '#52c41a' }}
                                >
                                    全选
                                </Button>
                                <Button 
                                    size="small" 
                                    type="text"
                                    icon={<ClearOutlined />}
                                    onClick={() => clearDay(day.key)}
                                    style={{ color: '#ff4d4f' }}
                                >
                                    清空
                                </Button>
                            </Space>
                        </div>

                        <div style={{ 
                            background: 'rgba(255, 255, 255, 0.6)',
                            borderRadius: '12px',
                            padding: '16px',
                            border: '1px solid rgba(114, 46, 209, 0.1)'
                        }}>
                            {Object.entries(timeSlots).map(([periodKey, period]) => {
                                const status = getTimeSlotStatus(day.key, periodKey);
                                
                                return (
                                    <div key={periodKey} style={{ marginBottom: '16px' }}>
                                        <div style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            marginBottom: '8px' 
                                        }}>
                                            <Button
                                                size="small"
                                                type={status === 'all' ? 'primary' : 'default'}
                                                style={{
                                                    backgroundColor: status === 'all' ? period.color : 'transparent',
                                                    borderColor: period.color,
                                                    color: status === 'all' ? '#fff' : period.color,
                                                    borderRadius: '16px',
                                                    fontSize: '12px',
                                                    height: '28px',
                                                    minWidth: '80px'
                                                }}
                                                onClick={() => selectTimeSlot(day.key, periodKey)}
                                            >
                                                {period.icon} {period.label}
                                                {status === 'partial' && (
                                                    <span style={{ 
                                                        marginLeft: '4px',
                                                        opacity: 0.7 
                                                    }}>
                                                        ({period.hours.filter(h => 
                                                            selectedTimes[day.key]?.includes(h)
                                                        ).length}/{period.hours.length})
                                                    </span>
                                                )}
                                            </Button>
                                        </div>
                                        
                                        <div style={{ 
                                            display: 'flex', 
                                            flexWrap: 'wrap', 
                                            gap: '6px',
                                            marginLeft: '8px'
                                        }}>
                                            {period.hours.map(hour => {
                                                const isSelected = selectedTimes[day.key]?.includes(hour);
                                                
                                                return (
                                                    <Tooltip 
                                                        key={hour}
                                                        title={`${formatHour(hour)} - 点击${isSelected ? '取消' : '选择'}`}
                                                    >
                                                        <Button
                                                            size="small"
                                                            type={isSelected ? 'primary' : 'default'}
                                                            onClick={() => toggleTimeSlot(day.key, hour)}
                                                            style={{
                                                                backgroundColor: isSelected ? period.color : 'transparent',
                                                                borderColor: isSelected ? period.color : '#d9d9d9',
                                                                color: isSelected ? '#fff' : '#595959',
                                                                borderRadius: '6px',
                                                                fontSize: '11px',
                                                                height: '24px',
                                                                minWidth: '70px',
                                                                transition: 'all 0.2s ease'
                                                            }}
                                                        >
                                                            {hour}:00
                                                        </Button>
                                                    </Tooltip>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{
                background: 'rgba(114, 46, 209, 0.05)',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid rgba(114, 46, 209, 0.1)',
                marginBottom: '24px'
            }}>
                <Row gutter={24}>
                    <Col span={8}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ 
                                fontSize: '20px', 
                                fontWeight: 'bold', 
                                color: '#722ed1' 
                            }}>
                                {Object.keys(selectedTimes).filter(day => 
                                    (selectedTimes[day]?.length || 0) > 0
                                ).length}
                            </div>
                            <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>
                                工作日
                            </Text>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ 
                                fontSize: '20px', 
                                fontWeight: 'bold', 
                                color: '#722ed1' 
                            }}>
                                {getTotalSelectedSlots()}
                            </div>
                            <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>
                                总时段
                            </Text>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ 
                                fontSize: '20px', 
                                fontWeight: 'bold', 
                                color: '#722ed1' 
                            }}>
                                {Math.round(getTotalSelectedSlots() * 100 / (7 * 12))}%
                            </div>
                            <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>
                                时间利用率
                            </Text>
                        </div>
                    </Col>
                </Row>
            </div>

            <div style={{
                background: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(114, 46, 209, 0.1)'
            }}>
                <Row justify="space-between" align="middle">
                    <Col>
                        <Space direction="vertical" size={4}>
                            <Text strong style={{ color: '#262626' }}>操作提示</Text>
                            <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>
                                {hasChanges ? 
                                    '⚠️ 您有未保存的修改，请确认后保存设置' : 
                                    '✅ 当前设置已保存，可继续修改或应用新的时间安排'
                                }
                            </Text>
                        </Space>
                    </Col>
                    <Col>
                        <Space size={12}>
                            <Button 
                                icon={<ReloadOutlined />}
                                onClick={resetChanges}
                                disabled={!hasChanges}
                                style={{ borderRadius: '8px' }}
                            >
                                重置
                            </Button>
                            <Button 
                                type="primary"
                                icon={<SaveOutlined />}
                                onClick={updateTimes}
                                disabled={!hasChanges}
                                style={{
                                    backgroundColor: hasChanges ? '#722ed1' : undefined,
                                    borderColor: hasChanges ? '#722ed1' : undefined,
                                    borderRadius: '8px',
                                    height: '36px',
                                    paddingLeft: '20px',
                                    paddingRight: '20px'
                                }}
                            >
                                保存设置
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </div>
        </Card>
    );
}