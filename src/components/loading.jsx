import { Spin } from "antd";

export default function Loading() {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "60vh"
        }}>
            <Spin size="large" tip="Loading..." />
        </div>
    );
}