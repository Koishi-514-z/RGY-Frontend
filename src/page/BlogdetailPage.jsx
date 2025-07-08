//
//
// import React, { useState, useEffect } from "react";
// import CustomLayout from "../components/layout/customlayout";
// import { useNavigate, useParams } from "react-router-dom";
// import {getBlogById, likeBlog, cancelLikeBlog, addReply, getAvatar, getBlogs, getLiked} from "../service/community";
// import { ArrowLeftOutlined, HeartTwoTone } from "@ant-design/icons";
// import {Button, Input, List, Card, App, Pagination, Dropdown} from "antd";
// import ParticleBackground from "../components/layout/particlebackground";
// import Loading from "../components/loading";
//
// export default function BlogdetailPage() {
//     const param = useParams();
//     const id = param.blogid;
//     //const id = 1;
//     const navigate = useNavigate();
//     const [blog, setBlog] = useState();
//     const [isLiked, setIsLiked] = useState(0);
//     const [replies, setReplies] = useState([]);
//     const [replyContent, setReplyContent] = useState("");
//     const [avatar, setAvatar] = useState("");
//     const [currentPage, setCurrentPage] = useState(1);
//     const [contentPerPage] = useState(450); // 每页显示的字符数
//     const [numLikes, setNumLikes] = useState(0);
//     const { message } = App.useApp();
//     const [avatars, setAvatars] = useState([]);
//     const [avatarsMap, setAvatarsMap ] = useState({});
//
//
//     // useEffect(() => {
//     //     const fetchAvatars = async () => {
//     //         //遍历blogs，获取所有userid，然后请求对应的头像
//     //         const userids = replies.map(reply => reply.userid);
//     //         const fetched_avatars = await Promise.all(userids.map(userid => getAvatar(userid)));
//     //         setAvatars(fetched_avatars);
//     //     };
//     //     fetchAvatars();
//     //     //设置所有blog的avatar属性
//     //
//     // }, [ replies ]);
//     // useEffect(() => {
//     //     const fetchAvatarsMap = async () => {
//     //         const fetched_avatars_map = {};
//     //         for (let i = 0; i < replies.length; i++) {
//     //             const blog = replies[i];
//     //             fetched_avatars_map[blog.userid] = avatars[i];
//     //         }
//     //         setAvatarsMap(fetched_avatars_map);
//     //     };
//     //     fetchAvatarsMap();
//     // }, [ replies, avatars ]);
//
//
//
//     useEffect(() => {
//         const fetchBlog = async () => {
//             const fetched_blog = await getBlogById(id);
//             console.log(fetched_blog);
//             setBlog(fetched_blog);
//             setNumLikes(fetched_blog.likeNum);
//         };
//         fetchBlog();
//         console.log("fetchBlog");
//         console.log(blog);
//     }, [id]);
//
//     useEffect(() => {
//         const fetchReplies = async () => {
//             if (!blog) {
//                 return;
//             }
//             const fetched_replies = blog.replies;
//             console.log(fetched_replies);
//             setReplies(fetched_replies || []);
//         };
//         fetchReplies();
//     }, [blog]);
//
//
//
//     useEffect(() => {
//         const getIfLiked = async () => {
//             let is_liked = await getLiked(id);
//             setIsLiked(is_liked);
//         }
//         getIfLiked();
//     }, [id]);
//
//     function handleLike() {
//         try{
//             if (!isLiked) {
//                 likeBlog(id).then(res => {
//
//                         setIsLiked(1);
//                         setNumLikes(numLikes + 1);
//
//                 });
//             } else {
//                 likeBlog(id).then(res => {
//
//                         setIsLiked(0);
//                         setNumLikes(numLikes - 1);
//
//                 });
//             }
//         }
//         catch(e){
//             message.error("点赞失败！");
//         }
//
//     }
//
//     async function handleReply() {
//         if (replyContent.trim()) {
//             const res = await addReply(id, replyContent);
//             console.log(replyContent);
//             try {
//                 message.success("回复成功！");
//                 setReplies([...replies, res]);
//                 setReplyContent("");
//             }
//             catch (e) {
//                 message.error("回复失败！");
//             }
//         }
//         else {
//             message.error("回复内容不能为空！");
//         }
//     }
//
//     async function handleWarmReply(num) {
//         let warmMessage = "";
//         if (num === 0) {
//             warmMessage = "加油加油！";
//         }
//         else if (num === 1) {
//             warmMessage = "你已经很棒了，自信些！";
//         }
//         else if (num === 2) {
//             warmMessage = "不要放弃！有志者事竟成！";
//         }
//         else {
//             warmMessage = "我们与你同在！";
//         }
//         const res = await addReply(id, warmMessage);
//        try {
//             message.success("回复成功！");
//             setReplies([...replies, res]);
//         }
//         catch(e) {
//             message.error("回复失败！");
//         }
//     }
//     const items = [
//         {
//             key: '1',
//             label: (
//                 <button type="text" onClick={() => handleWarmReply(0)}>
//                     加油加油！
//                 </button>
//             ),
//         },
//         {
//             key: '2',
//             label: (
//                 <button type="text" onClick={() => handleWarmReply(1)}>
//                     你已经很棒了，自信些！
//                 </button>
//             ),
//         },
//         {
//             key: '3',
//             label: (
//                 <button type="text" onClick={() => handleWarmReply(2)}>
//                     不要放弃！有志者事竟成！
//                 </button>
//             ),
//         }
//     ];
//     if(!blog ) {
//         return (
//             <CustomLayout content={
//                 <Loading />
//             }/>
//         )
//     }
//     return (
//         <CustomLayout content={
//             <div style={{ padding: '24px', backgroundColor: '#f0f2f5', borderRadius: '8px' }}>
//                 <ParticleBackground />
//                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
//                     <Button
//                         type="link"
//                         icon={<ArrowLeftOutlined />}
//                         onClick={() => navigate(-1)}
//                         style={{ fontSize: '16px', color: '#1890ff' }}
//                     >
//                         返回
//                     </Button>
//                     <div style={{ textAlign: 'center' }}>
//                         <Button
//                             icon={<HeartTwoTone twoToneColor={isLiked ? "#ff4d4f" : "#bfbfbf"} />}
//                             type="primary"
//                             shape="circle"
//                             onClick={handleLike}
//                             style={{
//                                 fontSize: '20px',
//                                 backgroundColor: isLiked ? "#f0f0f0" : "#f0f0f0",
//                                 borderColor: isLiked ? "#ff4d4f" : "#d9d9d9",
//                                 color: isLiked ? "#fff" : "#000",
//                                 boxShadow: isLiked ? "0 4px 12px rgba(255, 77, 79, 0.4)" : "0 2px 8px rgba(0, 0, 0, 0.1)"
//                             }}
//                         />
//                         <div style={{ fontSize: '14px', color: isLiked ? "#ff4d4f" : "#666", marginTop: '8px' }}>
//                             <span style={{ fontWeight: 'bold' }}>{numLikes}</span>
//                         </div>
//                     </div>
//                 </div>
//                 <div style={{ position: 'relative', zIndex: 1,display: 'flex', gap: '24px', backgroundColor: '#fff', padding: '16px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
//
//
//                     <div style={{ flex: '2', display: 'flex', flexDirection: 'column', justifyContent: 'start' }}>
//
//                         <div style={{ fontSize: '14px', color: '#666', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
//                             <img
//                                 src={blog.user.avatar}
//                                 alt="avatar"
//                                 style={{ width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
//                                 onClick={() => navigate(`/home/${blog.user.userid}`)}
//                             />
//                             <div><span style={{ fontWeight: 'bold', fontSize: '20px', color: '#333' }}>{blog.user? blog.user.username:""}</span></div>
//                         </div>
//                         <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>{blog.title}</h1>
//                         <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#555', overflow: 'auto'}}>{blog.content}</p>
//                         <div style={{ color: '#1890ff', fontWeight: 'bold' }}>#<span>{blog.tags?.join(" #")}</span></div>
//                         <div style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>编辑于{new Date(blog.timestamp * 1000).toLocaleString()}</div>
//
//
//                     </div>
//                 </div>
//                 <div style={{ position: 'relative', zIndex: 1,marginTop: '24px', backgroundColor: '#fff', padding: '16px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
//                     <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#333' }}>回复</h2>
//                     <List
//                         dataSource={replies}
//                         renderItem={reply => (
//                             <Card style={{ marginBottom: '8px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', border: 'none' }}>
//                                 <div>
//                                     <div style={{ fontSize: '14px', color: '#666', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
//                                         <img
//                                             src={reply.user.avatar || ""}
//                                             alt="avatar"
//                                             style={{ width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
//                                             onClick={() => navigate(`/home/${reply.user.userid}`)}
//                                         />
//                                         <div><span style={{ fontWeight: 'bold', fontSize: '15px', color: '#333' }}>{reply.user.username}</span></div>
//                                     </div>
//                                     <div style={{ fontSize: '14px', marginTop: '4px', color: '#555' }}>{reply.content}</div>
//                                     <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>回复于{new Date(reply.timestamp * 1000).toLocaleString()}</div>
//                                 </div>
//                             </Card>
//                         )}
//                     />
//                     <Input.TextArea
//                         value={replyContent}
//                         onChange={(e) => setReplyContent(e.target.value)}
//                         placeholder="输入你的回复..."
//                         rows={4}
//                         style={{ marginTop: '16px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
//                     />
//                     <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
//                         <Button type="primary" onClick={handleReply} style={{ borderRadius: '8px' }}>
//                             回复
//                         </Button>
//                         <Dropdown menu={{ items }} placement="bottomLeft" arrow={{ pointAtCenter: true }}>
//                             <Button>暖心回应</Button>
//                         </Dropdown>
//                     </div>
//                 </div>
//             </div>
//         } />
//     );
// }


import React, {useState, useEffect, useRef} from "react";
import CustomLayout from "../components/layout/customlayout";
import { useNavigate, useParams } from "react-router-dom";
import {
    getBlogById, likeBlog, cancelLikeBlog, addReply,
    getAvatar, getBlogs, getLiked, reportContent
} from "../service/community";
import {
    ArrowLeftOutlined, HeartTwoTone, ExclamationCircleOutlined,
    LikeOutlined, LikeFilled, MessageOutlined, ShareAltOutlined
} from "@ant-design/icons";
import {
    Button,
    Input,
    List,
    Card,
    App,
    Pagination,
    Dropdown,
    Tooltip,
    Typography,
    Space,
    Divider,
    Avatar,
    Select, Tag
} from "antd";
import ParticleBackground from "../components/layout/particlebackground";
import Loading from "../components/loading";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
const { Title, Text } = Typography;
const { Option } = Select;
export default function BlogdetailPage() {
    const param = useParams();
    const id = param.blogid;
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [replies, setReplies] = useState([]);
    const [replyContent, setReplyContent] = useState("");
    const [numLikes, setNumLikes] = useState(0);
    const { message, modal } = App.useApp();
    const reportRef = useRef(null);
    const [reportReason, setReportReason] = useState(null);

    // 举报原因选项
    const reportReasons = [
        "垃圾广告",
        "色情低俗",
        "人身攻击",
        "敏感信息",
        "其他违规内容"
    ];

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const fetchedBlog = await getBlogById(id);
                setBlog(fetchedBlog);
                setNumLikes(fetchedBlog.likeNum);
                setReplies(fetchedBlog.replies || []);
            } catch (error) {
                message.error("加载帖子失败");
            }
        };

        const getIfLiked = async () => {
            try {
                const liked = await getLiked(id);
                setIsLiked(liked);
            } catch (error) {
                console.error("获取点赞状态失败", error);
            }
        };

        fetchBlog();
        getIfLiked();
    }, [id]);

    useEffect(() => {
        const updateRef =  () => {
            reportRef.current = reportReason;
        };
        updateRef();

    }, [reportReason]);

    // 点赞/取消点赞

    async function handleLike() {
        try {
            if (!isLiked) {
                await likeBlog(id);
                setIsLiked(true);
                setNumLikes(numLikes + 1);
                message.success("点赞成功");
            } else {
                await cancelLikeBlog(id);
                setIsLiked(false);
                setNumLikes(numLikes - 1);
                message.success("取消点赞");
            }
        } catch (error) {
            message.error("操作失败，请重试");
        }
    }

    async function handleReply() {
        if (!replyContent.trim()) {
            message.error("回复内容不能为空！");
            return;
        }

        try {
            const newReply = await addReply(id, replyContent);
            setReplies([...replies, newReply]);
            setReplyContent("");
            message.success("回复成功！");
        } catch (error) {
            message.error("回复失败");
        }
    }

    async function handleWarmReply(content) {
        try {
            const newReply = await addReply(id, content);
            setReplies([...replies, newReply]);
            message.success("回复成功！");
        } catch (error) {
            message.error("回复失败");
        }
    }

    // 举报内容
    const handleReport = async (type, id, reason) => {
        try {
            await reportContent(type, id, reason);
            message.success("举报成功，感谢您的反馈");
        } catch (error) {
            message.error("举报失败，请重试");
        }
    };

    // 显示举报对话框
    const showReportModal = (type, id) => {

        modal.confirm({
            title: '举报内容',
            icon: <ExclamationCircleOutlined />,
            content: (
                <div>
                    <p>请选择举报原因：</p>
                    <Select
                        style={{ width: '100%', marginTop: 10 }}
                        placeholder="选择举报原因"
                        onChange={value => setReportReason(value)}
                        //value = {reportReason}
                        options={reportReasons.map(reason => ({ value: reason, label: reason }))}
                    />
                </div>
            ),
            onOk() {
                if (!reportRef.current) {
                    message.error("请选择举报原因");
                    console.log(reportReason);
                    return Promise.reject();
                }
                return handleReport(type, id, reportRef.current);
            },
            onCancel() {
                setReportReason("");
            },
        });
    };

    // 暖心回复选项
    const warmReplyItems = [
        {
            key: '1',
            label: (
                <Button type="text" onClick={() => handleWarmReply("加油加油！")}>
                    加油加油！
                </Button>
            ),
        },
        {
            key: '2',
            label: (
                <Button type="text" onClick={() => handleWarmReply("你已经很棒了，自信些！")}>
                    你已经很棒了，自信些！
                </Button>
            ),
        },
        {
            key: '3',
            label: (
                <Button type="text" onClick={() => handleWarmReply("不要放弃！有志者事竟成！")}>
                    不要放弃！有志者事竟成！
                </Button>
            ),
        }
    ];

    if (!blog) {
        return (
            <CustomLayout content={<Loading />} />
        );
    }

    return (
        <CustomLayout content={
            <div className="blog-detail-container">
                <ParticleBackground />

                {/* 顶部操作栏 */}
                <div style = {{ position:'relative',zIndex:1}} className="header-actions">
                    <Button
                        type="text"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate(-1)}
                        className="back-button"
                    >
                        返回
                    </Button>

                    <Space size="large">
                        <Tooltip title="分享">
                            <Button
                                type="text"
                                icon={<ShareAltOutlined />}
                                className="action-button"
                            />
                        </Tooltip>
                        <Tooltip title="举报帖子">
                            <Button
                                type="text"
                                icon={<ExclamationCircleOutlined />}
                                className="action-button"
                                onClick={() => showReportModal("blog", blog.blogid)}
                            />
                        </Tooltip>
                    </Space>
                </div>

                {/* 帖子内容区域 */}
                <div style={{ position:'relative',zIndex:1 }} className="blog-content-card">
                    <div className="blog-header">
                        <Avatar
                            src={blog.user.avatar}
                            size={48}
                            className="user-avatar"
                            onClick={() => navigate(`/home/${blog.user.userid}`)}
                        />
                        <div className="user-info">
                            <Title level={4} className="username">{blog.user.username}</Title>
                            <Text type="secondary" className="post-time">
                                {new Date(blog.timestamp).toLocaleString()}
                            </Text>
                        </div>
                    </div>

                    <Title level={2} className="blog-title">{blog.title}</Title>

                    <div className="blog-tags">
                        {blog.tags?.map((tag, index) => (
                            <Tag key={index} className="tag">
                                #{tag}
                            </Tag>
                        ))}
                    </div>

                    <div className="blog-body">
                        <Text className="blog-content">{blog.content}</Text>
                    </div>

                    <Divider className="divider" />

                    <div className="blog-footer">
                        <Button
                            type="text"
                            icon={isLiked ? <LikeFilled style={{ color: '#1890ff' }} /> : <LikeOutlined />}
                            onClick={handleLike}
                            className="like-button"
                        >
                            <span className="like-count">{numLikes}</span>
                        </Button>
                        <Button
                            type="text"
                            icon={<MessageOutlined />}
                            className="comment-button"
                        >
                            {replies.length}
                        </Button>
                    </div>
                </div>

                {/* 回复区域 */}
                <div style={{ position:'relative',zIndex:1 }} className="replies-section">
                    <div className="replies-header">
                        <Title level={4} className="section-title">回复 ({replies.length})</Title>
                    </div>

                    <List
                        dataSource={replies}
                        renderItem={reply => (
                            <Card className="reply-card" key={reply.replyid}>
                                <div className="reply-header">
                                    <Avatar
                                        src={reply.user.avatar}
                                        size={36}
                                        className="reply-avatar"
                                        onClick={() => navigate(`/home/${reply.user.userid}`)}
                                    />
                                    <div className="reply-user-info">
                                        <Text strong className="reply-username">{reply.user.username}</Text>
                                        <Text type="secondary" className="reply-time">
                                            {"     "}{"    "}
                                            {new Date(reply.timestamp).toLocaleString()}
                                        </Text>
                                    </div>
                                    <Button
                                        type="text"
                                        icon={<ExclamationCircleOutlined />}
                                        className="report-button"
                                        onClick={() => showReportModal("reply", reply.replyid)}
                                    >
                                        举报
                                    </Button>
                                </div>

                                <div className="reply-content">
                                    <Text>{reply.content}</Text>
                                </div>
                            </Card>
                        )}
                    />

                    <div className="reply-input-area">
                        <Input.TextArea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="输入你的回复..."
                            rows={3}
                            className="reply-textarea"
                        />
                        <div className="reply-actions">
                            <Space>
                                <Button type="primary" onClick={handleReply}>
                                    回复
                                </Button>
                                <Dropdown menu={{ items: warmReplyItems }} trigger={['click']}>
                                    <Button>暖心回应</Button>
                                </Dropdown>
                            </Space>
                        </div>
                    </div>
                </div>

                <style jsx global>{`
                    .blog-detail-container {
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 20px;
                        position: relative;
                        z-index: 1;
                    }
                    
                    .header-actions {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 24px;
                        padding: 0 8px;
                    }
                    
                    .back-button {
                        font-size: 16px;
                        color: #1890ff;
                        padding: 4px 8px;
                    }
                    
                    .action-button {
                        font-size: 18px;
                        color: #666;
                    }
                    
                    .blog-content-card {
                        background: #fff;
                        border-radius: 12px;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
                        padding: 24px;
                        margin-bottom: 24px;
                    }
                    
                    .blog-header {
                        display: flex;
                        align-items: center;
                        margin-bottom: 20px;
                    }
                    
                    .user-avatar {
                        cursor: pointer;
                        margin-right: 16px;
                    }
                    
                    .user-info {
                        display: flex;
                        flex-direction: column;
                    }
                    
                    .username {
                        margin-bottom: 4px;
                        font-size: 18px;
                    }
                    
                    .post-time {
                        font-size: 13px;
                        color: #999;
                    }
                    
                    .blog-title {
                        margin-bottom: 16px;
                        font-size: 24px;
                        color: #333;
                    }
                    
                    .blog-tags {
                        margin-bottom: 20px;
                    }
                    
                    .tag {
                        margin-right: 8px;
                        border-radius: 20px;
                        padding: 2px 12px;
                        font-size: 13px;
                    }
                    
                    .blog-body {
                        margin-bottom: 24px;
                    }
                    
                    .blog-content {
                        font-size: 16px;
                        line-height: 1.8;
                        color: #555;
                        white-space: pre-line;
                    }
                    
                    .divider {
                        margin: 16px 0;
                    }
                    
                    .blog-footer {
                        display: flex;
                        gap: 16px;
                    }
                    
                    .like-button, .comment-button {
                        display: flex;
                        align-items: center;
                        font-size: 15px;
                        color: #666;
                    }
                    
                    .like-count {
                        margin-left: 4px;
                    }
                    
                    .replies-section {
                        background: #fff;
                        border-radius: 12px;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
                        padding: 24px;
                    }
                    
                    .replies-header {
                        margin-bottom: 16px;
                    }
                    
                    .section-title {
                        font-size: 18px;
                    }
                    
                    .reply-card {
                        margin-bottom: 16px;
                        border-radius: 8px;
                        border: 1px solid #f0f0f0;
                    }
                    
                    .reply-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 12px;
                    }
                    
                    .reply-avatar {
                        cursor: pointer;
                        margin-right: 12px;
                    }
                    
                    .reply-user-info {
                        flex: 1;
                    }
                    
                    .reply-username {
                        font-size: 15px;
                    }
                    
                    .reply-time {
                        font-size: 12px;
                        color: #999;
                    }
                    
                    .report-button {
                        color: #ff4d4f;
                        font-size: 13px;
                        padding: 0;
                    }
                    
                    .reply-content {
                        font-size: 15px;
                        color: #333;
                        padding-left: 48px;
                    }
                    
                    .reply-input-area {
                        margin-top: 24px;
                    }
                    
                    .reply-textarea {
                        border-radius: 8px;
                        resize: none;
                    }
                    
                    .reply-actions {
                        display: flex;
                        justify-content: flex-end;
                        margin-top: 12px;
                    }
                    
                    @media (max-width: 768px) {
                        .blog-detail-container {
                            padding: 12px;
                        }
                        
                        .blog-content-card, .replies-section {
                            padding: 16px;
                        }
                        
                        .blog-title {
                            font-size: 20px;
                        }
                        
                        .blog-content {
                            font-size: 15px;
                        }
                        
                        .reply-content {
                            padding-left: 0;
                        }
                    }
                `}</style>
            </div>
        } />
    );
}