import React, { useState, useEffect, useRef } from 'react';
import {
    Input,
    Button,
    List,
    Avatar,
    Typography,
    Spin,
    Row,
    Col,
    App
} from 'antd';
import { UserOutlined, RobotOutlined, ClockCircleOutlined } from '@ant-design/icons';
import CustomLayout from '../components/layout/customlayout';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import AISessionTabs from '../components/admin_stats/AIsessiontabs';
import AISidbar from '../components/admin_stats/AIsidbar';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

const { TextArea } = Input;
const { Title, Paragraph } = Typography;

const AIAssistant = () => {
    const { message } = App.useApp();
    const [AIsessions, setAIsessions] = useState([]);
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [usageSeconds, setUsageSeconds] = useState(0);
    const alertShownRef = useRef(false); 
    const {sessionid} = useParams();                 
    const [searchParams] = useSearchParams();         
    const activeTab = searchParams.get('activeTab');
    const navigate = useNavigate();

    const createAIsession = (oldAIsessions = AIsessions) => {
        const initcontentHearing = {
            role: 'developer', 
            content: '你是一位温柔耐心的心理陪伴者。请用关怀和理解的语气倾听用户的表达，不要急于给建议，只需表达共情、理解和支持，让用户感受到被倾听和被接纳。你的回复应简短温暖，鼓励用户继续表达自己的感受。'
        }
        const initcontentActing = {
            role: 'developer', 
            content: '你是一位专业的心理健康引导者。请在倾听用户表达的基础上，适当提出开放性问题，引导用户自我觉察和思考，帮助他们梳理情绪和困惑。也请温和地给出建议或心理调适的小技巧，但要避免直接下结论或诊断。'
        }
        const now = new Date();
        const id = activeTab + '_' + now.getTime();
        const newAIsession = {
            sessionid: id,
            timestamp: now.getTime(),
            messages: [(activeTab === 'hearing' ? initcontentHearing : initcontentActing)]
        }
        const newAIsessions = [newAIsession, ...oldAIsessions];
        setAIsessions(newAIsessions);
        localStorage.setItem((activeTab === 'hearing' ? 'AIsessions_hearing' : 'AIsessions_acting'), JSON.stringify(newAIsessions));
        return id;
    }

    const updateDatas = (newMessages) => {
        const now = new Date();
        const newAIsessions = AIsessions.map((AIsession => {
            if(AIsession.sessionid === sessionid) {
                return {
                    ...AIsession,
                    timestamp: now.getTime(),
                    messages: newMessages
                }
            }
            else {
                return AIsession;
            }
        }));
        setAIsessions(newAIsessions);
        localStorage.setItem((activeTab === 'hearing' ? 'AIsessions_hearing' : 'AIsessions_acting'), JSON.stringify(newAIsessions));
    }

    const deleteAIsession = (id) => {
        const newAIsessions = AIsessions.filter(sess => sess.sessionid !== id);
        let newid;
        if(newAIsessions.length === 0) {
            newid = createAIsession([]);
        }
        else {
            newid = newAIsessions[0].sessionid;
            setAIsessions(newAIsessions);
            localStorage.setItem((activeTab === 'hearing' ? 'AIsessions_hearing' : 'AIsessions_acting'), JSON.stringify(newAIsessions));
        }
        if(id === sessionid) {
            navigate(`/AIassistant/${newid}?activeTab=${activeTab}`);
        }
    }

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
            if(usageSeconds >= 10 && !alertShownRef.current) {
                message.info('您单日使用已超过一小时，已安排心理咨询师回访');
                alertShownRef.current = true;
                // let orderInfo = { userid };
                // await placeCallBackRequest(orderInfo);
            }
        };
        handleOveruse();
    }, [usageSeconds]);

    useEffect(() => {
        if(!activeTab) {
            navigate(`/AIassistant?activeTab=hearing`);
            return;
        }
        let datas;
        if(activeTab === 'hearing') {
            datas = JSON.parse(localStorage.getItem('AIsessions_hearing'));
        }
        else {
            datas = JSON.parse(localStorage.getItem('AIsessions_acting'));
        }
        if(!datas || datas.length === 0) {
            const id = createAIsession([]);
            navigate(`/AIassistant/${id}?activeTab=${activeTab}`);
            return;
        }
        else {
            setAIsessions(datas);
        }
    }, [activeTab]);

    useEffect(() => {
        if(!AIsessions || AIsessions.length === 0) {
            return;
        }
        if(!sessionid) {
            const id = AIsessions[0].sessionid;
            navigate(`/AIassistant/${id}?activeTab=${activeTab}`);
            return;
        }
        console.log(AIsessions);
        console.log(sessionid);
        const targ = AIsessions.find(sess => sess.sessionid === sessionid);
        if(!targ) {
            return;
        }
        setMessages(targ.messages);
    }, [sessionid, AIsessions]);

    const handleCreate = () => {
        const id = createAIsession();
        navigate(`/AIassistant/${id}?activeTab=${activeTab}`);
    }

    const handleTabChange = (key) => {
        navigate(`/AIassistant?activeTab=${key}`);
    };

    const sendMessage = async () => {
        if(!userInput.trim()) {
            return;
        }
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
            updateDatas([...newMessages, {role: 'assistant', content: reply}]);
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
                            <AISessionTabs activeTab={activeTab} handleTabChange={handleTabChange} />
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
                    <Col xs={24} sm={8} md={6} lg={5} xl={4} style={{ height: '100%' }}>
                        <div style={{ 
                            height: '100%', 
                            background: '#fff', 
                            boxShadow: '0 2px 8px rgba(0,0,0,0.09)',
                            borderRadius: '4px',
                            overflow: 'hidden'
                        }}>
                            <AISidbar AIsessions={AIsessions} handleCreate={handleCreate} handleDelete={deleteAIsession} />
                        </div>
                    </Col>
                    <Col xs={24} sm={16} md={18} lg={19} xl={20} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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
                                    msg.role !== 'developer' && (
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
                                                description={
                                                    <div className="markdown-content">
                                                        <Paragraph style={{ whiteSpace: 'pre-wrap', margin: 0, color: 'black' }}>
                                                            <ReactMarkdown
                                                                children={msg.content}
                                                                remarkPlugins={[remarkGfm]}
                                                                rehypePlugins={[rehypeHighlight]}
                                                            />
                                                        </Paragraph>
                                                    </div>
                                                }
                                            />
                                        </List.Item>
                                    )
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
};

export default AIAssistant;
