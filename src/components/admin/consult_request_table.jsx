import {Table, Tabs} from "antd";
import { formatTime } from "../../utils/time";
import React from "react";
import {Link} from "react-router-dom";

export default function ConsultRequestTable({ requests }) {
    const columns = [
        {
            title: '意向咨询时间', dataIndex: 'timestamp', key: 'timestamp',
            render: (time) => formatTime(time)
        },
    ];

    return <>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2>咨询请求列表（均为匿名用户）</h2>
        </div>
        <Table
        columns={columns}
        dataSource={requests.map(request => ({
            ...request,
            key: request.id
        }))}
    />
        </>;
}