import React, { useState, useEffect } from "react";
import CustomLayout from "../components/layout/customlayout";
import { Card, Space, Typography } from "antd";
import PushList from "../components/pushlist";
import PushAddingModal from "../components/admin/pushaddingmodal";
import { PushpinOutlined } from "@ant-design/icons";
import { getAllDataNum, getUrlDatas } from "../service/pushcontent";

const { Title } = Typography;

export default function PsyPushPage() {
    const [urlDatas, setUrlDatas] = useState([]);
    const [loadedPage, setLoadedPage] = useState([]);
    const [pageIndex, setPageIndex] = useState(0);
    const pageSize = 12;

    const reloadPage = async () => {
        setLoadedPage([0]);
        setPageIndex(0);
        const datas = [];
        const num = await getAllDataNum();
        for(let i = 0; i < num; ++i) {
            datas.push({});
        }
        const page = await getUrlDatas(0, pageSize);
        for(let i = 0; i < Math.min(pageSize, page.length); ++i) {
            datas[i] = page[i];
        }
        setUrlDatas(datas);
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
                        <PushAddingModal setUrlDatas={setUrlDatas} reloadPage={reloadPage} />
                    }
                    style={{ 
                        borderRadius: '0px',
                        overflow: 'hidden',
                    }}
                >
                    <PushList urlDatas={urlDatas} pageIndex={pageIndex} setPageIndex={setPageIndex} pageSize={pageSize} />
                </Card>
            </div>
        }/>
    );
}