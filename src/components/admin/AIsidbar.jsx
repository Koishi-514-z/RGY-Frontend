import React from "react";
import AISessionMenu from "./AIsessionmenu";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Divider } from "antd";

export default function AISidbar({AIsessions, handleCreate, handleDelete}) {
    return (
        <div
            style={{
                background: "#fff",
                padding: "12px 16px",
                minHeight: 320
            }}
        >
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                <Button
                    icon={<PlusOutlined />}
                    onClick={handleCreate}
                    style={{
                        borderRadius: "8px",
                        width: 36,
                        fontWeight: 600,
                        fontSize: 16,
                        height: 36
                    }}
                />
            </div>
            <Divider style={{ margin: "0 0 6px 0" }} />
            <AISessionMenu AIsessions={AIsessions} handleDelete={handleDelete} />
        </div>
    );
}