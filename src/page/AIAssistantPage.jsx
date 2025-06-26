import React, { useState, useEffect, useRef } from 'react';
import {
    Layout,
    Input,
    Button,
    List,
    Avatar,
    Typography,
    Spin,
    message,
    Modal,
} from 'antd';
// import useMessage from "antd/es/message/useMessage";
import {
    UserOutlined,
    RobotOutlined,
    ClockCircleOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import {placeCallBackRequest} from "../service/AIassis";

const { Header, Content, Footer } = Layout;
const { TextArea } = Input;
const { Title } = Typography;

const AIAssistant = () => {
    let userid="fakeuser";

    const [messageApi, contextHolder] = message.useMessage();
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [usageSeconds, setUsageSeconds] = useState(0);
    const alertShownRef = useRef(false); // 用于解决闭包 stale 状态问题

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        const storageKey = `usage_${today}`;
        const storedSeconds = parseInt(localStorage.getItem(storageKey) || '0', 10);
        setUsageSeconds(storedSeconds);

        const interval = setInterval(() => {
            setUsageSeconds((prev) => {
                const updated = prev + 1;
                localStorage.setItem(storageKey, updated.toString());
                return updated;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleOveruse = async () => {
            if (usageSeconds >= 10 && !alertShownRef.current) {
                messageApi.success('您单日使用已超过一小时，已安排心理咨询师回访', 3);
                alertShownRef.current = true;
                let orderInfo = { userid };
                await placeCallBackRequest(orderInfo);
            }
        };

        handleOveruse();
    }, [usageSeconds]);


    const sendMessage = async () => {
        if (!userInput.trim()) return;

        const userMsg = { role: 'user', content: userInput };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setUserInput('');
        setLoading(true);

        try {
            const response = await axios.post(
                'https://llmapi.paratera.com/v1/chat/completions', // <-- 修改为你实际的 BASE_URL
                {
                    model: 'GLM-4-Flash', // <-- 替换为你实际使用的模型 ID
                    messages: newMessages,
                    stream: false,
                    max_tokens: 512,
                    temperature: 0.6,
                },
                {
                    headers: {
                        Authorization: 'Bearer sk-X8QeVxe2qtRaUBRvRfrh2w', // <-- 替换为你的 API Key
                        'Content-Type': 'application/json',
                    },
                }
            );

            const reply = response.data.choices[0].message;
            // 在整段内容前加上前缀
            const modifiedReply = {
                ...reply,
                content: `（AI非专业医生）${reply.content}`
            };

            setMessages([...newMessages, modifiedReply]);
        } catch (err) {
            console.error(err);
            message.error('AI 回复失败，请检查网络或 API Key');
        } finally {
            setLoading(false);
        }
    };


    return (
        <Layout style={{ minHeight: '100vh' }}>
            {contextHolder}
            <Header
                style={{
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Title level={3} style={{ color: 'white', margin: 0 }}>
                    AI 虚拟陪伴助手
                </Title>
                <div style={{ color: 'white' }}>
                    <ClockCircleOutlined style={{ marginRight: 6 }} />
                    使用时长：{Math.floor(usageSeconds / 60)} 分 {usageSeconds % 60} 秒
                </div>
            </Header>
            <Content style={{ padding: '20px' }}>
                <List
                    dataSource={messages}
                    renderItem={(msg, index) => (
                        <List.Item key={index}>
                            <List.Item.Meta
                                avatar={
                                    msg.role === 'user' ? (
                                        <Avatar icon={<UserOutlined />} />
                                    ) : (
                                        <Avatar
                                            icon={<RobotOutlined />}
                                            style={{ backgroundColor: '#87d068' }}
                                        />
                                    )
                                }
                                title={msg.role === 'user' ? '你' : 'AI小伙伴'}
                                description={msg.content}
                            />
                        </List.Item>
                    )}
                />
                {loading && <Spin style={{ marginTop: 10 }} />}
                <TextArea
                    rows={3}
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onPressEnter={(e) => {
                        if (!e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                        }
                    }}
                    placeholder="写下你的心情..."
                    style={{ marginTop: 20 }}
                />
                <Button type="primary" onClick={sendMessage} style={{ marginTop: 10 }}>
                    发送
                </Button>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
                心理健康平台 · AI虚拟陪伴助手
            </Footer>
        </Layout>
    );
};

export default AIAssistant;
