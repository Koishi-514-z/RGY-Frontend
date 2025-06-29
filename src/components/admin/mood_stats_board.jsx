import React, { useState } from "react";
import { Card, Statistic, Row, Col, Tabs, Typography } from "antd";
import { SmileOutlined } from "@ant-design/icons";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

const { Link } = Typography;


export default function MoodStats({ weeklyData, monthlyData }) {
    const [activeTab, setActiveTab] = useState("week");
    const data = activeTab === "week" ? weeklyData : monthlyData;

    return (
        <Card
            style={{ borderRadius: "16px" }}
            title={
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Tabs
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        size="large"
                        items={[
                            { key: "week", label: "本周心理健康统计" },
                            { key: "month", label: "本月心理健康统计" },
                        ]}
                    />
                </div>
            }
        >
            <Row gutter={[16, 16]} align="middle">
                <Col span={24}>
                    <Statistic
                        title="平均心情评分（1-5）"
                        value={data.averageScore}
                        precision={1}
                        prefix={<SmileOutlined />}
                    />
                </Col>

                <Col span={24}>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={data.moodData}
                            layout="vertical"
                            margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                type="number"
                                domain={[0, 100]}
                                tickFormatter={(value) => `${value}%`}
                            />
                            <YAxis type="category" dataKey="emotion" />
                            <Tooltip formatter={(value) => `${value}%`} />
                            <Bar
                                dataKey="percent"
                                fill="#1890ff"
                                barSize={30}
                                radius={[5, 5, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </Col>
            </Row>
        </Card>
    );
};