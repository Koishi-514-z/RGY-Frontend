import React, { useState, useEffect } from "react";
import { App, Rate, Form, Flex, Radio, Tag, Modal, Button } from "antd";
import { getEmotion, getTags, updateEmotion } from "../service/emotion";
import Loading from "../components/loading";

export default function EmotionScoring({emotion, setEmotion}) {
    const [editting, setEditting] = useState(false);
    const [form] = Form.useForm();
    const [tags, setTags] = useState([]);
    const { message } = App.useApp();

    useEffect(() => {
        const fetch = async () => {
            const fetched_tags = await getTags();
            setTags(fetched_tags);
        }
        fetch();
    }, []);

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
        const res = await updateEmotion({
            score: values.score,
            tagid: values
        });
        if(!res) {
            message.error('保存失败，请检查网络');
        }
        message.success('保存成功');
        setEmotion(await getEmotion());
        handleClose();
    }

    const getEmotionTag = (tag) => {
        switch(tag.id) {
            case 1: {
                return <Tag color="green"> {tags[0].content} </Tag>;
            }
            case 2: {
                return <Tag color="red"> {tags[1].content} </Tag>;
            }
            case 3: {
                return <Tag color="yellow"> {tags[2].content} </Tag>;
            }
            case 4: {
                return <Tag color="orange"> {tags[3].content} </Tag>;
            }
            case 5: {
                return <Tag color="blue"> {tags[4].content} </Tag>;
            }
            default: {
                return <Tag color="default"> Unknown </Tag>;
            }
        }
    };

    if(tags.length === 0) {
        return (
            <Loading/>
        )
    }

    return (
        <div>
            <Rate disabled={true} defaultValue={emotion.score} />
            {getEmotionTag(emotion.tag)}
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
                Scoring
            </Button>
            <Modal
                title="心情打卡"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={editting}
                onOk={handleOk}
                onCancel={handleClose}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="scoringform"
                >
                    <Form.Item
                        name="score"
                        label="心情评分"
                    >
                        <Rate defaultValue={emotion.score} />
                    </Form.Item>

                    <Form.Item
                        name="tag"
                        label="情绪标签"
                    >
                        <Flex vertical gap="middle">
                            <Radio.Group defaultValue={emotion.tag.id}>
                                <Radio.Button value={1}> {tags[0].content} </Radio.Button>
                                <Radio.Button value={2}> {tags[1].content} </Radio.Button>
                                <Radio.Button value={3}> {tags[2].content} </Radio.Button>
                                <Radio.Button value={4}> {tags[3].content} </Radio.Button>
                                <Radio.Button value={5}> {tags[4].content} </Radio.Button>
                            </Radio.Group>
                        </Flex> 
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}