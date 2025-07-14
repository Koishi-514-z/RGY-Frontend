import React, { useState, useEffect, useRef } from 'react';
import { Input, Button, List, Avatar, Typography, Spin, Row, Col, App, Drawer } from 'antd';
import { UserOutlined, RobotOutlined, MenuOutlined } from '@ant-design/icons';
import CustomLayout from '../components/layout/customlayout';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import AISessionTabs from '../components/admin/AIsessiontabs';
import AISidbar from '../components/admin/AIsidbar';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import ParticleBackground from '../components/layout/particlebackground';

const { TextArea } = Input;
const { Title, Paragraph } = Typography;

export default function AIAssistantPage() {
    const { message } = App.useApp();
    const [AIsessions, setAIsessions] = useState([]);
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [usageSeconds, setUsageSeconds] = useState(0);
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);
    const alertShownRef = useRef(false); 
    const {sessionid} = useParams();                 
    const [searchParams] = useSearchParams();         
    const activeTab = searchParams.get('activeTab');
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setIsMobile(width < 768);
            setIsTablet(width >= 768 && width < 1024);
            if(width >= 768) {
                setSidebarVisible(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const createAIsession = (oldAIsessions = AIsessions) => {
        const initcontentHearing = {
            role: 'developer', 
            content: '你是一位温柔耐心的心理陪伴者。请用关怀和理解的语气倾听用户的表达，不要急于给建议，只需表达共情、理解和支持，让用户感受到被倾听和被接纳。你的回复应充满温暖，鼓励用户继续表达自己的感受。'
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
            if(usageSeconds >= 3600 && !alertShownRef.current) {
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
            message.error('AI 回复失败，请检查网络或 API Key');
        }
    };

    // AI侧边栏内容
    const AISidebar = () => (
        <div style={{
            height: isMobile ? 'auto' : '100%',
            background: '#fff',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <AISidbar 
                AIsessions={AIsessions} 
                handleCreate={handleCreate} 
                handleDelete={deleteAIsession} 
            />
        </div>
    );

    return (
        <CustomLayout content={
            <div style={{
                height: isMobile ? 'calc(100vh - 64px - 69px)' : 'calc(100vh - 64px - 69px - 48px)',
                position: 'relative'
            }}>
                <ParticleBackground />
                
                {/* 头部区域 */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'linear-gradient(90deg, #e6f7ff 0%, #fff 100%)',
                    boxShadow: '0 2px 12px rgba(24,144,255,0.08)',
                    padding: isMobile ? '0px 16px' : '0px 32px',
                    minHeight: 60,
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: isMobile ? '12px' : '0',
                    position: 'relative',
                    zIndex: 10
                }}>
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        width: isMobile ? '100%' : 'auto',
                        justifyContent: isMobile ? 'space-between' : 'flex-start'
                    }}>
                        {isMobile && (
                            <Button
                                type="text"
                                icon={<MenuOutlined />}
                                onClick={() => setSidebarVisible(true)}
                                style={{
                                    fontSize: '16px',
                                    color: '#1890ff'
                                }}
                            />
                        )}
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <RobotOutlined style={{ 
                                fontSize: isMobile ? 24 : 32, 
                                color: '#1890ff', 
                                marginRight: isMobile ? 8 : 16 
                            }} />
                            <Title level={isMobile ? 4 : 3} style={{ 
                                color: '#222', 
                                margin: 0, 
                                letterSpacing: isMobile ? 1 : 2 
                            }}>
                                {isMobile ? 'AI助手' : 'AI 虚拟陪伴助手'}
                            </Title>
                        </div>
                    </div>
                    
                    <div style={{ 
                        flex: isMobile ? 'none' : 1, 
                        display: 'flex', 
                        justifyContent: isMobile ? 'center' : 'flex-start', 
                        paddingLeft: isMobile ? 0 : (isTablet ? 120 : 320),
                        width: isMobile ? '100%' : 'auto'
                    }}>
                        <AISessionTabs 
                            activeTab={activeTab} 
                            handleTabChange={handleTabChange} 
                            mobile={isMobile}
                        />
                    </div>
                </div>

                {/* 主内容区域 */}
                {isMobile ? (
                    /* 移动端布局 */
                    <div style={{
                        height: 'calc(100% - 60px)',
                        display: 'flex',
                        flexDirection: 'column',
                        background: '#fff',
                        margin: '16px 8px 0 8px',
                        borderRadius: '8px',
                        overflow: 'hidden'
                    }}>
                        <div style={{ 
                            flex: 1, 
                            overflowY: 'auto',
                            background: '#fff',
                            padding: '12px',
                            borderBottom: '1px solid #f0f0f0',
                            position: 'relative',
                            zIndex: 1
                        }}>
                            <List
                                dataSource={messages}
                                renderItem={(msg, index) => (
                                    msg.role !== 'developer' && (
                                        <List.Item key={index} style={{ padding: '8px 0' }}>
                                            <List.Item.Meta
                                                avatar={
                                                    msg.role === 'user' ? (
                                                        <Avatar icon={<UserOutlined />} size={40} />
                                                    ) : (
                                                        <Avatar
                                                            icon={<RobotOutlined />}
                                                            style={{ backgroundColor: '#87d068' }}
                                                            size={40}
                                                        />
                                                    )
                                                }
                                                title={
                                                    <span style={{ fontSize: '14px', fontWeight: '500' }}>
                                                        {msg.role === 'user' ? '你' : 'AI小伙伴'}
                                                    </span>
                                                }
                                                description={
                                                    <div className="markdown-content">
                                                        <Paragraph style={{ 
                                                            whiteSpace: 'pre-wrap', 
                                                            margin: 0, 
                                                            color: 'black',
                                                            fontSize: '13px',
                                                            lineHeight: '1.5'
                                                        }}>
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
                            {loading && (
                                <div style={{ textAlign: 'center', padding: '12px' }}>
                                    <Spin />
                                </div>
                            )}
                        </div>
                        
                        <div style={{ 
                            background: '#fff',
                            padding: '12px',
                            position: 'relative',
                            zIndex: 10
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
                                style={{ 
                                    fontSize: '14px',
                                    borderRadius: '8px'
                                }}
                            />
                            <Button 
                                type="primary" 
                                onClick={sendMessage} 
                                style={{ 
                                    marginTop: 8,
                                    borderRadius: '6px',
                                    fontSize: '14px'
                                }}
                                block
                            >
                                发送
                            </Button>
                        </div>

                        <Drawer
                            title="AI会话列表"
                            placement="left"
                            onClose={() => setSidebarVisible(false)}
                            open={sidebarVisible}
                            width={280}
                            styles={{
                                body: { padding: 0 }
                            }}
                        >
                            <AISidebar />
                        </Drawer>
                    </div>
                ) : (
                    /* 桌面端和平板布局 */
                    <Row gutter={[16, 16]} style={{ 
                        height: 'calc(100% - 60px)',
                        margin: '16px 0 0 0',
                        paddingRight: '16px'
                    }}>
                        <Col xs={0} sm={8} md={6} lg={5} xl={4} style={{ height: '100%' }}>
                            <div style={{ 
                                height: '100%', 
                                background: '#fff', 
                                boxShadow: '0 2px 8px rgba(0,0,0,0.09)',
                                borderRadius: '8px',
                                overflow: 'hidden'
                            }}>
                                <AISidebar />
                            </div>
                        </Col>
                        
                        <Col xs={24} sm={16} md={18} lg={19} xl={20} style={{ 
                            height: '100%', 
                            display: 'flex', 
                            flexDirection: 'column' 
                        }}>
                            <div style={{ 
                                flex: 1, 
                                overflowY: 'auto',
                                background: '#fff',
                                padding: isTablet ? '12px' : '16px',
                                marginBottom: '16px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.09)',
                                borderRadius: '8px'
                            }}>
                                <List
                                    dataSource={messages}
                                    renderItem={(msg, index) => (
                                        msg.role !== 'developer' && (
                                            <List.Item key={index}>
                                                <List.Item.Meta
                                                    avatar={
                                                        msg.role === 'user' ? (
                                                            <Avatar icon={<UserOutlined />} size={isTablet ? 48 : 56} />
                                                        ) : (
                                                            <Avatar
                                                                icon={<RobotOutlined />}
                                                                style={{ backgroundColor: '#87d068' }}
                                                                size={isTablet ? 48 : 56}
                                                            />
                                                        )
                                                    }
                                                    title={
                                                        <span style={{ fontSize: isTablet ? '15px' : '16px' }}>
                                                            {msg.role === 'user' ? '你' : 'AI小伙伴'}
                                                        </span>
                                                    }
                                                    description={
                                                        <div className="markdown-content">
                                                            <Paragraph style={{ 
                                                                whiteSpace: 'pre-wrap', 
                                                                margin: 0, 
                                                                color: 'black',
                                                                fontSize: isTablet ? '13px' : '14px',
                                                                lineHeight: '1.6'
                                                            }}>
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
                                {loading && (
                                    <div style={{ textAlign: 'center', padding: '16px' }}>
                                        <Spin size="large" />
                                    </div>
                                )}
                            </div>
                            
                            <div style={{ 
                                background: '#fff',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.09)',
                                borderRadius: '8px'
                            }}>
                                <div style={{
                                    borderRadius: '8px',
                                    background: '#fff',
                                    padding: isTablet ? '12px' : '16px'
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
                                        style={{ 
                                            marginTop: 8,
                                            fontSize: isTablet ? '13px' : '14px'
                                        }}
                                    />
                                    <Button 
                                        type="primary" 
                                        onClick={sendMessage} 
                                        style={{ 
                                            marginTop: 10,
                                            fontSize: isTablet ? '13px' : '14px'
                                        }}
                                    >
                                        发送
                                    </Button>
                                </div>
                            </div>
                        </Col>
                    </Row>
                )}
            </div>
        }/>
    )
};