import React, { useState, useEffect, useRef } from 'react';
import {
    Input,
    Button,
    List,
    Avatar,
    Typography,
    Spin,
    message,
    Row,
    Col,
} from 'antd';
import {
    UserOutlined,
    RobotOutlined,
    ClockCircleOutlined,
} from '@ant-design/icons';
import {placeCallBackRequest} from "../service/AIassis";
import CustomLayout from '../components/layout/customlayout';

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
        if(!localStorage.getItem(storageKey)) {
            localStorage.clear();
            localStorage.setItem(storageKey, '0');
        }
        const storedSeconds = parseInt(localStorage.getItem(storageKey));
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
                // let orderInfo = { userid };
                // await placeCallBackRequest(orderInfo);
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
            const response = await fetch(
                'https://llmapi.paratera.com/v1/chat/completions', 
                {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer sk-X8QeVxe2qtRaUBRvRfrh2w',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        model: 'GLM-4-Flash', 
                        messages: newMessages,
                        stream: true,
                        max_tokens: 1024,
                        temperature: 0.6,
                    })
                }
            );
            setLoading(false);
            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let reply = '(AI非专业医生) ';

            while(true) {
                const {value, done} = await reader.read();
                if(done) {
                    break;
                }
                const chunk = decoder.decode(value, {stream: true});
                const prefix = 'data: ';
                const datas = chunk.split(prefix);
                for(let data of datas) {
                    if(data === '') {
                        continue;
                    }
                    if(data.includes('[DONE]')) {
                        break;
                    }
                    data = JSON.parse(data);
                    if(data.choices[0].finish_reason === 'stop') {
                        break;
                    }
                    reply += data.choices[0].delta.content;
                    const updatedMessages = [...newMessages, {role: 'assistant', content: reply}];
                    setMessages(updatedMessages);
                }   
            }
        } catch (err) {
            console.error(err);
            message.error('AI 回复失败，请检查网络或 API Key');
        }
    };

    return (
        <CustomLayout content={
            <div>
                <Row>
                    <Col span={24}>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                background: 'linear-gradient(90deg, #e6f7ff 0%, #fff 100%)',
                                boxShadow: '0 2px 12px rgba(24,144,255,0.08)',
                                padding: '0px 32px',
                                minHeight: 60,
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <RobotOutlined style={{ fontSize: 32, color: '#1890ff', marginRight: 16 }} />
                                <Title level={3} style={{ color: '#222', margin: 0, letterSpacing: 2 }}>
                                    AI 虚拟陪伴助手
                                </Title>
                            </div>
                            <div style={{ color: '#555', fontSize: 16, fontWeight: 500, display: 'flex', alignItems: 'center' }}>
                                <ClockCircleOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                                使用时长：
                                <span style={{ color: '#1890ff', margin: '0 4px', fontWeight: 600 }}>
                                    {Math.floor(usageSeconds / 60)} 分 {usageSeconds % 60} 秒
                                </span>
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row gutter={[24, 24]} style={{ height: 'calc(104vh - 64px - 69px - 48px)' }}>
                    <Col span={24} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ 
                            flex: 1, 
                            overflowY: 'auto',
                            background: '#fff',
                            padding: '16px',
                            marginBottom: '16px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.09)'
                        }}>
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
                        </div>
                        <div style={{ 
                            background: '#fff',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.09)'
                        }}>
                            <div style={{
                                borderRadius: '12px',
                                background: '#fff',
                                padding: '12px',
                                boxShadow: '0 -2px 8px rgba(0,0,0,0.05)'
                            }}>
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
                                    style={{ marginTop: 8 }}
                                />
                                <Button type="primary" onClick={sendMessage} style={{ marginTop: 10 }}>
                                    发送
                                </Button>
                            </div>
                            
                        </div>
                    </Col>
                </Row>
            </div>
            
        }/>
    )


    // return (
    //     <Layout style={{ minHeight: '100vh' }}>
    //         {contextHolder}
    //         <Header
    //             style={{
    //                 color: 'white',
    //                 display: 'flex',
    //                 justifyContent: 'space-between',
    //                 alignItems: 'center',
    //             }}
    //         >
    //             <Title level={3} style={{ color: 'white', margin: 0 }}>
    //                 AI 虚拟陪伴助手
    //             </Title>
    //             <div style={{ color: 'white' }}>
    //                 <ClockCircleOutlined style={{ marginRight: 6 }} />
    //                 使用时长：{Math.floor(usageSeconds / 60)} 分 {usageSeconds % 60} 秒
    //             </div>
    //         </Header>
    //         <Content style={{ padding: '20px' }}>
    //             <List
    //                 dataSource={messages}
    //                 renderItem={(msg, index) => (
    //                     <List.Item key={index}>
    //                         <List.Item.Meta
    //                             avatar={
    //                                 msg.role === 'user' ? (
    //                                     <Avatar icon={<UserOutlined />} />
    //                                 ) : (
    //                                     <Avatar
    //                                         icon={<RobotOutlined />}
    //                                         style={{ backgroundColor: '#87d068' }}
    //                                     />
    //                                 )
    //                             }
    //                             title={msg.role === 'user' ? '你' : 'AI小伙伴'}
    //                             description={msg.content}
    //                         />
    //                     </List.Item>
    //                 )}
    //             />
    //             {loading && <Spin style={{ marginTop: 10 }} />}
    //             <TextArea
    //                 rows={3}
    //                 value={userInput}
    //                 onChange={(e) => setUserInput(e.target.value)}
    //                 onPressEnter={(e) => {
    //                     if (!e.shiftKey) {
    //                         e.preventDefault();
    //                         sendMessage();
    //                     }
    //                 }}
    //                 placeholder="写下你的心情..."
    //                 style={{ marginTop: 20 }}
    //             />
    //             <Button type="primary" onClick={sendMessage} style={{ marginTop: 10 }}>
    //                 发送
    //             </Button>
    //         </Content>
    //         <Footer style={{ textAlign: 'center' }}>
    //             心理健康平台 · AI虚拟陪伴助手
    //         </Footer>
    //     </Layout>
    // );

    // const response = await axios.post(
    //     'https://llmapi.paratera.com/v1/chat/completions', // <-- 修改为你实际的 BASE_URL
    //     {
    //         model: 'GLM-4-Flash', // <-- 替换为你实际使用的模型 ID
    //         messages: newMessages,
    //         stream: false,
    //         max_tokens: 512,
    //         temperature: 0.6,
    //     },
    //     {
    //         headers: {
    //             Authorization: 'Bearer sk-X8QeVxe2qtRaUBRvRfrh2w', // <-- 替换为你的 API Key
    //             'Content-Type': 'application/json',
    //         },
    //     }
    // );
    // const reply = response.data.choices[0].message;
    // // 在整段内容前加上前缀
    // const modifiedReply = {
    //     ...reply,
    //     content: `（AI非专业医生）${reply.content}`
    // };
    // setMessages([...newMessages, modifiedReply]);
};

export default AIAssistant;
