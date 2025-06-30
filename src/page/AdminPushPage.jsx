import React, { useState, useEffect } from "react";
import CustomLayout from "../components/layout/customlayout";
import { Card, Space, Typography } from "antd";
import { getAllUrlDatas } from "../service/emotion";
import PushList from "../components/pushlist";
import PushAddingModal from "../components/admin/pushaddingmodal";
import { PushpinOutlined } from "@ant-design/icons";

const { Title } = Typography;

export default function AdminPushPage() {
    const [urlDatas, setUrlDatas] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            const fetched_urls = await getAllUrlDatas();
            setUrlDatas(fetched_urls);
        }
        fetch();
    }, []);

    return (
        <CustomLayout role={2} content={
            <div>
                <Card
                    title={
                        <div style={{ padding: '8px 0' }}>
                            <Space>
                                <PushpinOutlined style={{ color: "#1890ff", fontSize: 28 }} />
                                <Title level={3} style={{ margin: 0, letterSpacing: 2 }}>
                                    推送内容管理
                                </Title>
                            </Space>
                        </div>
                    }
                    extra={
                        <PushAddingModal setUrlDatas={setUrlDatas} />
                    }
                    style={{ 
                        borderRadius: '0px',
                        overflow: 'hidden',
                    }}
                >
                    <PushList urlDatas={urlDatas} />
                </Card>
            </div>
        }/>
    );
}