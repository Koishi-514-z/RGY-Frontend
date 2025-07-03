import React, { useState, useEffect } from "react";
import { App, Button, DatePicker, Form, Modal, Typography, Space } from "antd";
import { ClockCircleOutlined, CalendarOutlined } from "@ant-design/icons";
import { addCounseling } from "../service/counseling";

const { Title, Text } = Typography;

export default function BookingModal() {
    const [isModelOpen, setIsModelOpen] = useState(false);
    const [form] = Form.useForm();
    const { message } = App.useApp();

    const handleOpen = () => {
        setIsModelOpen(true);
    }

    const handleClose = () => {
        setIsModelOpen(false);
        form.resetFields();
    }

    const handleOk = async () => {
        let values;
        try {
            values = await form.validateFields();
        } 
        catch(e) {
            message.error('请正确填写');
            return;
        }
        const timestamp = values.time.unix() * 1000;
        const res = await addCounseling(timestamp);
        if(!res) {
            message.error('发送预约请求失败');
            return;
        }
        message.success('预约成功');
        handleClose();
    }

    return (
        <div>
            <Button
                icon={<ClockCircleOutlined />}
                onClick={handleOpen}
                style={{
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(24,144,255,0.10)',
                    padding: '8px 16px'
                }}
            >
                预约心理咨询
            </Button>
            <Modal
                title={
                    <Space>
                        <CalendarOutlined style={{ color: '#1890ff', fontSize: 22 }} />
                        <Title level={4} style={{ margin: 0, color: '#222' }}>请选择预约时间</Title>
                    </Space>
                }
                open={isModelOpen}
                onOk={handleOk}
                onCancel={handleClose}
                width={420}
                okText="确认预约"
                cancelText="取消"
                centered
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="bookingform"
                >
                    <Form.Item
                        label={<Text strong style={{ fontSize: 15 }}>预约日期与时间</Text>}
                        name="time"
                        rules={[{ required: true, message: '请选择预约时间' }]}
                        style={{ marginBottom: 24 }}
                    >
                        <DatePicker 
                            picker="date" 
                            showTime 
                            placeholder="请选择日期和时间"
                        />
                    </Form.Item>
                    <div style={{ marginBottom: 8 }}>
                        <Text type="secondary" style={{ fontSize: 13 }}>
                            温馨提示：请合理安排时间，预约后请准时参加咨询。
                        </Text>
                    </div>
                </Form>
            </Modal>
        </div>
    );
}