import React, { useState, useEffect } from "react";
import { Card, Space, Typography, Badge, Button, Row, Col, Statistic, Progress, Tag, Tooltip, Avatar, List, Modal, Divider, App } from "antd";
import { HeartOutlined, CalendarOutlined, FileTextOutlined, TagOutlined, EyeOutlined, SmileOutlined, MehOutlined, FrownOutlined, TrophyOutlined, FireOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { getHistoryRecords, getRecordNum, getTags } from "../../service/emotion";

const { Title, Text } = Typography;

export default function EmotionHistoryCard() {
    const { message } = App.useApp();
    const [tags, setTags] = useState([]);
    const [historyRecords, setHistoryRecords] = useState([]);
    const [loadedPage, setLoadedPage] = useState([]);
    const [pageIndex, setPageIndex] = useState(0);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const pageSize = 6;

    const reloadPage = async () => {
        setLoadedPage([0]);
        setPageIndex(0);
        const datas = [];
        const number = await getRecordNum();
        for(let i = 0; i < number; ++i) {
            datas.push({
                tag: null,
                score: null,
                diary: null,
                label: null,
                timestamp: null
            })
        }
        const page = await getHistoryRecords(0, pageSize);
        for(let i = 0; i < Math.min(pageSize, page.length); ++i) {
            datas[i] = page[i];
        }
        setHistoryRecords(datas);
    }

    const loadPage = async () => {
        if(loadedPage.includes(pageIndex)) {
            return;
        }
        const updatedPage = [...loadedPage];
        updatedPage.push(pageIndex);
        const updatedDatas = [...historyRecords];
        const page = await getHistoryRecords(pageIndex, pageSize);

        for(let i = 0; i < Math.min(pageSize, page.length); ++i) {
            updatedDatas[i + pageIndex * pageSize] = page[i];
        }

        setHistoryRecords(updatedDatas);
        setLoadedPage(updatedPage);
    }

    useEffect(() => {
        reloadPage();
    }, []);

    useEffect(() => {
        if(historyRecords.length === 0) {
            return;
        }
        loadPage();
    }, [pageIndex]);

    useEffect(() => {
        const fetch = async () => {
            const fetched_tags = await getTags();
            setTags(fetched_tags);
        }
        fetch();
    }, []);

    const handlePageChange = (page) => {
        setPageIndex(page - 1);
    };

    const showDetailModal = (record) => {
        setSelectedRecord(record);
        setDetailModalOpen(true);
    };

    const getEmotionConfig = (score) => {
        if (score >= 4) {
            return {
                color: '#52c41a',
                bgColor: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)',
                borderColor: '#b7eb8f',
                icon: <SmileOutlined />,
                level: '积极',
                desc: '心情很好'
            };
        } else if (score >= 2) {
            return {
                color: '#faad14',
                bgColor: 'linear-gradient(135deg, #fffbe6 0%, #fff1b8 100%)',
                borderColor: '#ffe58f',
                icon: <MehOutlined />,
                level: '平静',
                desc: '心情平静'
            };
        } else {
            return {
                color: '#ff4d4f',
                bgColor: 'linear-gradient(135deg, #fff2f0 0%, #ffccc7 100%)',
                borderColor: '#ffccc7',
                icon: <FrownOutlined />,
                level: '消极',
                desc: '需要关注'
            };
        }
    };

    const getEmotionLabelConfig = (label) => {
        if(label === 0) {
            return {
                text: '积极倾向',
                color: '#52c41a',
                bgColor: '#f6ffed',
                icon: <TrophyOutlined />,
            };
        } 
        else if(label === 1) {
            return {
                text: '中性倾向',
                color: '#1890ff',
                bgColor: '#e6f7ff',
                icon: <FireOutlined />,
            };
        } 
        else if(label === 2) {
            return {
                text: '消极倾向',
                color: '#ff4d4f',
                bgColor: '#fff2f0',
                icon: <ThunderboltOutlined />,
            };
        }
        return {
            text: '未知倾向',
            color: '#8c8c8c',
            bgColor: '#f5f5f5',
            icon: <MehOutlined />,
            desc: '无法识别情绪倾向'
        };
    };

    const tagStyles = [
        { color: '#52c41a', gradient: 'linear-gradient(135deg, #4cd4d4ff 0%, #5addb3ff 100%)' },
        { color: '#f5222d', gradient: 'linear-gradient(135deg, #f5222d 0%, #ff7875 100%)' },
        { color: '#faad14', gradient: 'linear-gradient(135deg, #faad14 0%, #ffc53d 100%)' },
        { color: '#fa8c16', gradient: 'linear-gradient(135deg, #fa8c16 0%, #ff9c6e 100%)' },
        { color: '#1890ff', gradient: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)' }
    ];

    const renderEmotionTag = (tag) => {
        if(!tag || tags.length === 0) {
            return null;
        }
        
        try {
            const tagIndex = tag.id - 1;
            if(tagIndex >= 0 && tagIndex < tags.length) {
                const style = tagStyles[tagIndex % tagStyles.length];
                return (
                    <Tag
                        icon={<TagOutlined />}
                        style={{
                            background: style.gradient,
                            border: 'none',
                            borderRadius: '12px',
                            color: '#fff',
                            fontSize: '10px',
                            padding: '2px 8px',
                            fontWeight: '500',
                            boxShadow: `0 4px 12px ${style.color}30`,
                            maxWidth: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                    >
                        {tags[tagIndex].content}
                    </Tag>
                );
            }
        } catch (error) {
            console.error("Error rendering emotion tag: ", error);
        }
        return null;
    };

    const renderDetailEmotionTag = (tag) => {
        if(!tag || tags.length === 0) {
            return null;
        }

        try {
            const tagIndex = tag.id - 1;
            if(tagIndex >= 0 && tagIndex < tags.length) {
                const style = tagStyles[tagIndex % tagStyles.length];
                return (
                    <div style={{
                        background: style.gradient,
                        borderRadius: '12px',      
                        padding: '6px 12px',        
                        display: 'inline-block',
                        boxShadow: `0 3px 8px ${style.color}30`,  
                        margin: '0 4px'
                    }}>
                        <Text style={{ 
                            color: '#fff',
                            fontSize: '13px',         
                            fontWeight: '500',        
                            textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                        }}>
                            {tags[tagIndex].content}
                        </Text>
                    </div>
                );
            }
        } catch (error) {
            console.error("Error rendering emotion tag: ", error);
        }
        return null;
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return {
            date: date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
            weekday: date.toLocaleDateString('zh-CN', { weekday: 'short' })
        };
    };

    const pagination = {
        defaultcurrent: 1,
        current: pageIndex + 1,
        pageSize: pageSize,
        total: historyRecords.length,
        showSizeChanger: false,
        showQuickJumper: true,
        style: { marginTop: 16, textAlign: 'center' },
        onChange: handlePageChange,
        showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条记录`
    };

    const renderEmotionItem = (record) => {
        if (!record.timestamp) {
            return (
                <div style={{
                    padding: '20px',
                    background: 'linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%)',
                    borderRadius: '16px',
                    border: '1px solid rgba(24, 144, 255, 0.15)',
                    height: '180px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: -20,
                        right: -20,
                        width: 60,
                        height: 60,
                        background: 'rgba(24, 144, 255, 0.1)',
                        borderRadius: '50%'
                    }} />
                    <div style={{ textAlign: 'center', color: '#bfbfbf', zIndex: 1 }}>
                        <div style={{ 
                            fontSize: '28px', 
                            marginBottom: '8px',
                            color: '#1890ff',
                            animation: 'pulse 1.5s ease-in-out infinite'
                        }}>
                            <HeartOutlined />
                        </div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>加载中...</Text>
                    </div>
                </div>
            );
        }

        const emotionConfig = getEmotionConfig(record.score);
        const dateInfo = formatDate(record.timestamp);

        return (
            <div 
                onClick={() => showDetailModal(record)}
                style={{
                    padding: '20px',
                    background: emotionConfig.bgColor,
                    borderRadius: '16px',
                    border: `2px solid ${emotionConfig.borderColor}`,
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    height: '180px',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                    e.currentTarget.style.boxShadow = `0 12px 24px ${emotionConfig.color}20`;
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
                }}
            >
                <div style={{
                    position: 'absolute',
                    top: -15,
                    right: -15,
                    width: 50,
                    height: 50,
                    background: `linear-gradient(135deg, ${emotionConfig.color}15, ${emotionConfig.color}08)`,
                    borderRadius: '50%'
                }} />

                <div style={{
                    position: 'absolute',
                    bottom: -20,
                    left: -20,
                    width: 40,
                    height: 40,
                    background: `linear-gradient(135deg, ${emotionConfig.color}10, transparent)`,
                    borderRadius: '50%'
                }} />

                <div style={{ 
                    position: 'absolute',
                    top: '12px', 
                    left: '12px',
                    zIndex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                }}>
                    <Text strong style={{ 
                        color: emotionConfig.color, 
                        fontSize: '14px',
                        fontWeight: '600',
                        lineHeight: '1.2'
                    }}>
                        {dateInfo.date}
                    </Text>
                    <Tag 
                        style={{ 
                            margin: 0, 
                            fontSize: '9px',
                            borderRadius: '8px',
                            background: `linear-gradient(135deg, ${emotionConfig.color}, ${emotionConfig.color}cc)`,
                            color: '#fff',
                            border: 'none',
                            fontWeight: '500',
                            padding: '1px 8px'
                        }}
                    >
                        {dateInfo.weekday}
                    </Tag>
                </div>

                {record.tag && (
                    <div style={{ 
                        position: 'absolute', 
                        top: '12px', 
                        right: '12px',
                        zIndex: 2
                    }}>
                        {renderEmotionTag(record.tag)}
                    </div>
                )}

                <div style={{ 
                    textAlign: 'center', 
                    marginTop: '45px',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    zIndex: 1,
                    position: 'relative'
                }}>
                    <div style={{ 
                        fontSize: '28px', 
                        color: emotionConfig.color,
                        marginBottom: '2px',
                        textShadow: `0 2px 4px ${emotionConfig.color}20`
                    }}>
                        {emotionConfig.icon}
                    </div>
                    <Text strong style={{ 
                        fontSize: '20px', 
                        color: emotionConfig.color,
                        fontWeight: '700'
                    }}>
                        {record.score}/5
                    </Text>
                </div>
            </div>
        );
    };

    return (
        <>
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
                        justifyContent: 'space-between'
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
                                <HeartOutlined style={{ color: '#fff', fontSize: '24px' }} />
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
                                    我的历史情绪
                                </Title>
                                <Text style={{ 
                                    color: '#595959', 
                                    fontSize: '14px',
                                    fontWeight: '500'
                                }}>
                                    记录你的情绪变化
                                </Text>
                            </div>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Badge 
                                count={historyRecords.length} 
                                style={{ 
                                    backgroundColor: '#1890ff',
                                    boxShadow: '0 0 0 1px #fff',
                                    borderRadius: '20px',
                                    fontSize: '12px',
                                    fontWeight: '500',
                                    padding: '4px 12px',
                                    marginBottom: '4px',
                                    height: '24px',
                                    lineHeight: '24px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }} 
                            />
                            <div style={{ display: 'flex', gap: '4px' }}>
                                {[1,2,3].map(i => (
                                    <div key={i} style={{
                                        width: '6px',
                                        height: '6px',
                                        background: '#1890ff',
                                        borderRadius: '50%'
                                    }} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <List
                    grid={{ 
                        gutter: [20, 20], 
                        column: 3,
                        xs: 1,
                        sm: 2,
                        md: 3
                    }}
                    dataSource={historyRecords}
                    renderItem={record => (
                        <List.Item style={{ marginBottom: 0 }}>
                            {renderEmotionItem(record)}
                        </List.Item>
                    )}
                    pagination={pagination}
                    style={{ position: 'relative', zIndex: 1 }}
                />
            </Card>

            <Modal
                title={
                    selectedRecord && (
                        <Space>
                            <HeartOutlined style={{ color: '#1890ff' }} />
                            <span
                                style={{
                                    background: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    fontSize: '18px',
                                    fontWeight: '600'
                                }}
                            >
                                情绪记录详情
                            </span>
                            <Tag
                                style={{
                                    background: `linear-gradient(135deg, ${getEmotionConfig(selectedRecord.score).color}, ${getEmotionConfig(selectedRecord.score).color}cc)`,
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '8px'
                                }}
                            >
                                {formatDate(selectedRecord.timestamp).date}
                            </Tag>
                        </Space>
                    )
                }
                open={detailModalOpen}
                onCancel={() => setDetailModalOpen(false)}
                footer={[
                    <Button 
                        key="close" 
                        onClick={() => setDetailModalOpen(false)}
                        style={{
                            borderRadius: '8px',
                            background: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)',
                            border: 'none',
                            color: '#fff'
                        }}
                    >
                        关闭
                    </Button>
                ]}
                width={700}
                centered
                style={{
                    borderRadius: '16px',
                    overflow: 'hidden'
                }}
            >
                {selectedRecord && (
                    <div style={{
                        background: 'linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%)',
                        padding: '24px',
                        borderRadius: '12px'
                    }}>
                        <Row gutter={[20, 20]} style={{ marginBottom: '24px' }}>
                            <Col span={8}>
                                <div style={{
                                    background: '#fff',
                                    padding: '16px',
                                    borderRadius: '12px',
                                    textAlign: 'center',
                                    boxShadow: '0 2px 8px rgba(24, 144, 255, 0.06)',
                                    border: '1px solid rgba(24, 144, 255, 0.1)'
                                }}>
                                    <Statistic
                                        title="情绪分数"
                                        value={selectedRecord.score}
                                        suffix="/ 5"
                                        valueStyle={{ 
                                            color: getEmotionConfig(selectedRecord.score).color,
                                            fontSize: '24px',
                                            fontWeight: '700'
                                        }}
                                        prefix={getEmotionConfig(selectedRecord.score).icon}
                                    />
                                </div>
                            </Col>
                            <Col span={8}>
                                <div style={{
                                    background: '#fff',
                                    padding: '16px',
                                    borderRadius: '12px',
                                    textAlign: 'center',
                                    boxShadow: '0 2px 8px rgba(24, 144, 255, 0.06)',
                                    border: '1px solid rgba(24, 144, 255, 0.1)'
                                }}>
                                    <Statistic
                                        title="记录日期"
                                        value={formatDate(selectedRecord.timestamp).date}
                                        valueStyle={{ fontSize: '16px', fontWeight: '600', color: '#1890ff' }}
                                        prefix={<CalendarOutlined />}
                                    />
                                    <Text type="secondary" style={{ fontSize: '12px' }}>
                                        {formatDate(selectedRecord.timestamp).weekday}
                                    </Text>
                                </div>
                            </Col>
                            <Col span={8}>
                                <div style={{
                                    background: '#fff',
                                    padding: '16px',
                                    borderRadius: '12px',
                                    textAlign: 'center',
                                    boxShadow: '0 2px 8px rgba(24, 144, 255, 0.06)',
                                    border: '1px solid rgba(24, 144, 255, 0.1)'
                                }}>
                                    <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>情绪状态</Text>
                                    <Tag 
                                        style={{
                                            background: `linear-gradient(135deg, ${getEmotionConfig(selectedRecord.score).color}, ${getEmotionConfig(selectedRecord.score).color}cc)`,
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontWeight: '500'
                                        }}
                                    >
                                        {getEmotionConfig(selectedRecord.score).level}
                                    </Tag>
                                    <br />
                                    <Text style={{ 
                                        fontSize: '12px', 
                                        color: getEmotionConfig(selectedRecord.score).color,
                                        marginTop: '4px',
                                        display: 'block'
                                    }}>
                                        {getEmotionConfig(selectedRecord.score).desc}
                                    </Text>
                                </div>
                            </Col>
                        </Row>

                        <Divider style={{ borderColor: 'rgba(24, 144, 255, 0.1)' }} />

                        {selectedRecord.tag && (
                            <div style={{ 
                                marginBottom: '20px',
                                background: '#fff',
                                padding: '16px',
                                borderRadius: '12px',
                                boxShadow: '0 2px 8px rgba(24, 144, 255, 0.06)',
                                border: '1px solid rgba(24, 144, 255, 0.1)'
                            }}>
                                <Text strong style={{ display: 'block', marginBottom: '12px', fontSize: '15px', color: '#1890ff' }}>
                                    <TagOutlined /> 情绪标签
                                </Text>
                                {renderDetailEmotionTag(selectedRecord.tag)}
                            </div>
                        )}

                        {selectedRecord.label !== null && selectedRecord.label !== undefined && (
                            <div style={{ 
                                marginBottom: '20px',
                                background: '#fff',
                                padding: '16px',
                                borderRadius: '12px',
                                boxShadow: '0 2px 8px rgba(24, 144, 255, 0.06)',
                                border: '1px solid rgba(24, 144, 255, 0.1)'
                            }}>
                                <Text strong style={{ display: 'block', marginBottom: '12px', fontSize: '15px', color: '#1890ff' }}>
                                    日记情绪倾向
                                </Text>
                                {(() => {
                                    const labelConfig = getEmotionLabelConfig(selectedRecord.label);
                                    return (
                                        <Tag 
                                            icon={labelConfig.icon}
                                            style={{
                                                background: `linear-gradient(135deg, ${labelConfig.color}, ${labelConfig.color}cc)`,
                                                color: '#fff',
                                                border: 'none',
                                                fontSize: '12px', 
                                                padding: '4px 12px',
                                                borderRadius: '8px',
                                                fontWeight: '500'
                                            }}
                                        >
                                            {labelConfig.text}
                                        </Tag>
                                    );
                                })()}
                            </div>
                        )}

                        {selectedRecord.diary && (
                            <div style={{
                                background: '#fff',
                                padding: '16px',
                                borderRadius: '12px',
                                boxShadow: '0 2px 8px rgba(24, 144, 255, 0.06)',
                                border: '1px solid rgba(24, 144, 255, 0.1)'
                            }}>
                                <Text strong style={{ display: 'block', marginBottom: '12px', fontSize: '15px', color: '#1890ff' }}>
                                    <FileTextOutlined /> 情绪日记
                                </Text>
                                <div style={{
                                    background: '#fafafa',
                                    padding: '16px',
                                    borderRadius: '8px',
                                    border: '1px solid #f0f0f0',
                                    lineHeight: '1.6'
                                }}>
                                    <Text style={{ fontSize: '14px', whiteSpace: 'pre-wrap' }}>
                                        {selectedRecord.diary}
                                    </Text>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            <style jsx>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.05); }
                }
            `}</style>
        </>
    );
}