import React, { useState, useEffect } from "react";
import { App, Input, Form, Typography, Modal, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { getDiary, updateDiary } from "../service/emotion";

const { TextArea } = Input;
const { Text } = Typography;
const { confirm } = Modal;

export default function EmotionDiary({diary, setDiary}) {
    const [editting, setEditting] = useState(false);
    const [form] = Form.useForm();
    const { message } = App.useApp();

    const handleOpen = () => {
        setEditting(true);
    }

    const handleClose = () => {
        setEditting(false);
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
        confirm({
            title: '是否确认发布？',
            icon: <UploadOutlined />,
            async onOk() {
                const res = await updateDiary(values.diary);
                if(!res) {
                    message.error('发布失败，请检查网络');
                }
                message.success('发布成功');
                setDiary(await getDiary());
                handleClose();
            },
            onCancel() {
                handleClose();
            }
        });
    }

    console.log(diary);

    return (
        <div>
            <Text> {diary.content} </Text>
            <Button 
                type="primary" 
                onClick={handleOpen}
                style={{ 
                    width: '100%',
                    height: '46px',
                    borderRadius: '6px',
                    fontSize: '16px',
                    fontWeight: 500
                }}
            >
                Write
            </Button>
            <Modal
                title="情绪日记"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={editting}
                onOk={handleOk}
                onCancel={handleClose}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="diaryform"
                >
                    <Form.Item name="diary">
                        <TextArea 
                            rows={6} 
                            defaultValue={diary.content}
                            showCount 
                            maxLength={500} 
                            placeholder="write anything..." 
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}