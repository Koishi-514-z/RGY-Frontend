import { Table } from "antd";
import { formatTime } from "../../utils/time";
import React from "react";
import {Link} from "react-router-dom";

export default function CrisisInterventionTable({ requests }) {
    const columns = [
        { title: 'UserID', dataIndex: 'userid', key: 'userid', },
        {
            title: '危机发生时间', dataIndex: 'timestamp', key: 'timestamp',
            render: (time) => formatTime(time)
        },
    ];

    return (
        <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2>需要进行危机干预的列表</h2>
                <Link to="/admin/stats" style={{ fontSize: 14 }}>
                    返回情绪统计
                </Link>
            </div>
            <Table
                columns={columns}
                dataSource={requests.map(request => ({
                    ...request,
                    key: request.id
                }))}
            />
        </>
    );
}