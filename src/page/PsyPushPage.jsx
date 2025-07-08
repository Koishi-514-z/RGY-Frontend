import React, { useState, useEffect } from "react";
import CustomLayout from "../components/layout/customlayout";
import { Card, Space, Typography, Row, Col, Statistic, Input, Select, Button, Empty, Spin } from "antd";
import PushList from "../components/pushlist";
import PushAddingModal from "../components/admin/pushaddingmodal";
import { PushpinOutlined, FileTextOutlined, CustomerServiceOutlined, BarChartOutlined } from "@ant-design/icons";
import { getAllDataNum, getSimUrlDatas, getUrlDatas } from "../service/pushcontent";

const { Title, Text } = Typography;

export default function PsyPushPage() {
    const [urlDatas, setUrlDatas] = useState([]);
    const [loadedPage, setLoadedPage] = useState([]);
    const [pageIndex, setPageIndex] = useState(0);
    const [stats, setStats] = useState({ total: 0, articles: 0, music: 0 });
    const pageSize = 12;

    const calculateStats = (data) => {
        const total = data.length;
        const articles = data.filter(item => item.type === 'article').length;
        const music = data.filter(item => item.type === 'music').length;
        
        setStats({ total, articles, music });
    };

    const reloadPage = async () => {
        setLoadedPage([0]);
        setPageIndex(0);
        const datas = await getSimUrlDatas();
        const page = await getUrlDatas(0, pageSize);
        for(let i = 0; i < Math.min(pageSize, page.length); ++i) {
            datas[i] = page[i];
        }
        setUrlDatas(datas);
        calculateStats(datas);
    }

    const loadPage = async () => {
        if(loadedPage.includes(pageIndex)) {
            return;
        }
        const updatedPage = [...loadedPage];
        updatedPage.push(pageIndex);
        const updatedDatas = [...urlDatas];
        const page = await getUrlDatas(pageIndex, pageSize);

        for(let i = 0; i < Math.min(pageSize, page.length); ++i) {
            updatedDatas[i + pageIndex * pageSize] = page[i];
        }

        setUrlDatas(updatedDatas);
        setLoadedPage(updatedPage);
        calculateStats(updatedDatas);
    }

    useEffect(() => {
        reloadPage();
    }, []);

    useEffect(() => {
        if(urlDatas.length === 0) {
            return;
        }
        loadPage();
    }, [pageIndex]);

    return (
        <CustomLayout role={2} content={
            <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
                <Row gutter={24} style={{ marginBottom: '24px' }}>
                    <Col xs={24} sm={8}>
                        <Card 
                            size="small" 
                            style={{ 
                                background: 'linear-gradient(135deg, #722ed1 0%, #9254de 100%)',
                                border: 'none',
                                borderRadius: '12px',
                                color: '#fff'
                            }}
                        >
                            <Statistic 
                                title={<Text style={{ color: 'rgba(255,255,255,0.8)' }}>总推送内容</Text>}
                                value={stats.total} 
                                valueStyle={{ color: '#fff', fontSize: '28px', fontWeight: 'bold' }}
                                prefix={<BarChartOutlined style={{ color: '#fff' }} />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card 
                            size="small" 
                            style={{ 
                                background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
                                border: 'none',
                                borderRadius: '12px',
                                color: '#fff'
                            }}
                        >
                            <Statistic 
                                title={<Text style={{ color: 'rgba(255,255,255,0.8)' }}>心理文章</Text>}
                                value={stats.articles} 
                                valueStyle={{ color: '#fff', fontSize: '28px', fontWeight: 'bold' }}
                                prefix={<FileTextOutlined style={{ color: '#fff' }} />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card 
                            size="small" 
                            style={{ 
                                background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
                                border: 'none',
                                borderRadius: '12px',
                                color: '#fff'
                            }}
                        >
                            <Statistic 
                                title={<Text style={{ color: 'rgba(255,255,255,0.8)' }}>治愈音乐</Text>}
                                value={stats.music} 
                                valueStyle={{ color: '#fff', fontSize: '28px', fontWeight: 'bold' }}
                                prefix={<CustomerServiceOutlined style={{ color: '#fff' }} />}
                            />
                        </Card>
                    </Col>
                </Row>

                <Card
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
                                    <PushpinOutlined style={{ color: '#fff', fontSize: '20px' }} />
                                </div>
                                <div>
                                    <Title level={4} style={{ 
                                        margin: 0,
                                        background: 'linear-gradient(135deg, #722ed1 0%, #9254de 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text'
                                    }}>
                                        推送内容管理
                                    </Title>
                                    <Text style={{ color: '#8c8c8c', fontSize: '14px' }}>
                                        管理和发布心理健康相关内容
                                    </Text>
                                </div>
                            </div>
                            <PushAddingModal setUrlDatas={setUrlDatas} reloadPage={reloadPage} />
                        </div>
                    }
                    style={{ 
                        borderRadius: '16px',
                        overflow: 'hidden',
                        boxShadow: '0 8px 24px rgba(114, 46, 209, 0.12)',
                        border: '1px solid rgba(114, 46, 209, 0.1)'
                    }}
                >
                    {urlDatas.length === 0 ? (
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                                <div>
                                    <Text style={{ color: '#8c8c8c' }}>
                                        暂无推送内容
                                    </Text>
                                    <div style={{ marginTop: '16px' }}>
                                        <PushAddingModal setUrlDatas={setUrlDatas} reloadPage={reloadPage} />
                                    </div>
                                </div>
                            }
                            style={{ padding: '40px 0' }}
                        />
                    ) : (
                        <PushList 
                            urlDatas={urlDatas} 
                            pageIndex={pageIndex} 
                            setPageIndex={setPageIndex} 
                            pageSize={pageSize} 
                        />
                    )}
                </Card>
            </div>
        }/>
    );
}