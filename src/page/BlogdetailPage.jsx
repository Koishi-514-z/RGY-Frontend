

import React, { useState, useEffect } from "react";
import CustomLayout from "../components/layout/customlayout";
import { useNavigate, useParams } from "react-router-dom";
import {getBlogById, likeBlog, cancelLikeBlog, addReply, getAvatar, getBlogs, getLiked} from "../service/community";
import { ArrowLeftOutlined, HeartTwoTone } from "@ant-design/icons";
import {Button, Input, List, Card, App, Pagination, Dropdown} from "antd";
import ParticleBackground from "../components/layout/particlebackground";

export default function BlogdetailPage() {
    const param = useParams();
    const id = param.blogid;
    //const id = 1;
    const navigate = useNavigate();
    const [blog, setBlog] = useState({});
    const [isLiked, setIsLiked] = useState(0);
    const [replies, setReplies] = useState([]);
    const [replyContent, setReplyContent] = useState("");
    const [avatar, setAvatar] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [contentPerPage] = useState(450); // 每页显示的字符数
    const [numLikes, setNumLikes] = useState(0);
    const { message } = App.useApp();
    const [avatars, setAvatars] = useState([]);
    const [avatarsMap, setAvatarsMap ] = useState({});


    // useEffect(() => {
    //     const fetchAvatars = async () => {
    //         //遍历blogs，获取所有userid，然后请求对应的头像
    //         const userids = replies.map(reply => reply.userid);
    //         const fetched_avatars = await Promise.all(userids.map(userid => getAvatar(userid)));
    //         setAvatars(fetched_avatars);
    //     };
    //     fetchAvatars();
    //     //设置所有blog的avatar属性
    //
    // }, [ replies ]);
    // useEffect(() => {
    //     const fetchAvatarsMap = async () => {
    //         const fetched_avatars_map = {};
    //         for (let i = 0; i < replies.length; i++) {
    //             const blog = replies[i];
    //             fetched_avatars_map[blog.userid] = avatars[i];
    //         }
    //         setAvatarsMap(fetched_avatars_map);
    //     };
    //     fetchAvatarsMap();
    // }, [ replies, avatars ]);

    const paginatedContent = blog.content;


    const totalPages = blog.content ? Math.ceil(blog.content.length / contentPerPage) : 1;

    useEffect(() => {
        const fetchBlog = async () => {
            const fetched_blog = await getBlogById(id);
            console.log(fetched_blog);
            setBlog(fetched_blog);
            setNumLikes(fetched_blog.likeNum);
        };
        fetchBlog();
        console.log("fetchBlog");
        console.log(blog);
    }, [id]);

    useEffect(() => {
        const fetchReplies = async () => {
            const fetched_replies = blog.replies;
            console.log(fetched_replies);
            setReplies(fetched_replies || []);
        };
        fetchReplies();
    }, [blog]);



    useEffect(() => {
        const getIfLiked = async () => {
            let is_liked = await getLiked(id);
            setIsLiked(is_liked);
        }
        getIfLiked();
    }, [id]);


    useEffect(() => {
        const fetchAvatar = async () => {
            const fetched_avatar = await getAvatar(blog.userid);
            setAvatar(fetched_avatar);
        };
        if (blog.userid) {
            fetchAvatar();
        }
    }, [blog]);
    function handleLike() {
        try{
            if (!isLiked) {
                likeBlog(id).then(res => {

                        setIsLiked(1);
                        setNumLikes(numLikes + 1);

                });
            } else {
                likeBlog(id).then(res => {

                        setIsLiked(0);
                        setNumLikes(numLikes - 1);

                });
            }
        }
        catch(e){
            message.error("点赞失败！");
        }

    }

    async function handleReply() {
        if (replyContent.trim()) {
            const res = await addReply(id, replyContent);
            console.log(replyContent);
            try {
                message.success("回复成功！");
                setReplies([...replies, res]);
                setReplyContent("");
            }
            catch (e) {
                message.error("回复失败！");
            }
        }
        else {
            message.error("回复内容不能为空！");
        }
    }

    async function handleWarmReply(num) {
        let warmMessage = "";
        if (num === 0) {
            warmMessage = "加油加油！";
        }
        else if (num === 1) {
            warmMessage = "你已经很棒了，自信些！";
        }
        else if (num === 2) {
            warmMessage = "不要放弃！有志者事竟成！";
        }
        else {
            warmMessage = "我们与你同在！";
        }
        const res = await addReply(id, warmMessage);
       try {
            message.success("回复成功！");
            setReplies([...replies, res]);
        }
        catch(e) {
            message.error("回复失败！");
        }
    }
    const items = [
        {
            key: '1',
            label: (
                <button type="text" onClick={() => handleWarmReply(0)}>
                    加油加油！
                </button>
            ),
        },
        {
            key: '2',
            label: (
                <button type="text" onClick={() => handleWarmReply(1)}>
                    你已经很棒了，自信些！
                </button>
            ),
        },
        {
            key: '3',
            label: (
                <button type="text" onClick={() => handleWarmReply(2)}>
                    不要放弃！有志者事竟成！
                </button>
            ),
        }
    ];

    return (
        <CustomLayout content={
            <div style={{ padding: '24px', backgroundColor: '#f0f2f5', borderRadius: '8px' }}>
                <ParticleBackground />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <Button
                        type="link"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate(-1)}
                        style={{ fontSize: '16px', color: '#1890ff' }}
                    >
                        返回
                    </Button>
                    <div style={{ textAlign: 'center' }}>
                        <Button
                            icon={<HeartTwoTone twoToneColor={isLiked ? "#ff4d4f" : "#bfbfbf"} />}
                            type="primary"
                            shape="circle"
                            onClick={handleLike}
                            style={{
                                fontSize: '20px',
                                backgroundColor: isLiked ? "#f0f0f0" : "#f0f0f0",
                                borderColor: isLiked ? "#ff4d4f" : "#d9d9d9",
                                color: isLiked ? "#fff" : "#000",
                                boxShadow: isLiked ? "0 4px 12px rgba(255, 77, 79, 0.4)" : "0 2px 8px rgba(0, 0, 0, 0.1)"
                            }}
                        />
                        <div style={{ fontSize: '14px', color: isLiked ? "#ff4d4f" : "#666", marginTop: '8px' }}>
                            <span style={{ fontWeight: 'bold' }}>{numLikes}</span>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '24px', backgroundColor: '#fff', padding: '16px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>

                    <div style={{ flex: '2', display: 'flex', flexDirection: 'column', justifyContent: 'start' }}>

                        <div style={{ fontSize: '14px', color: '#666', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <img
                                src={avatar}
                                alt="avatar"
                                style={{ width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
                                onClick={() => navigate(`/home/${blog.user.userid}`)}
                            />
                            <div><span style={{ fontWeight: 'bold', fontSize: '20px', color: '#333' }}>{blog.user? blog.user.username:""}</span></div>
                        </div>
                        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>{blog.title}</h1>
                        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#555', overflow: 'auto'}}>{paginatedContent}</p>
                        <div style={{ color: '#1890ff', fontWeight: 'bold' }}>#<span>{blog.tags?.join(" #")}</span></div>
                        <div style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>编辑于{new Date(blog.timestamp * 1000).toLocaleString()}</div>


                    </div>
                </div>
                <div style={{ marginTop: '24px', backgroundColor: '#fff', padding: '16px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#333' }}>回复</h2>
                    <List
                        dataSource={replies}
                        renderItem={reply => (
                            <Card style={{ marginBottom: '8px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', border: 'none' }}>
                                <div>
                                    <div style={{ fontSize: '14px', color: '#666', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <img
                                            src={reply.user.avatar || ""}
                                            alt="avatar"
                                            style={{ width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
                                            onClick={() => navigate(`/home/${reply.user.userid}`)}
                                        />
                                        <div><span style={{ fontWeight: 'bold', fontSize: '15px', color: '#333' }}>{reply.user.username}</span></div>
                                    </div>
                                    <div style={{ fontSize: '14px', marginTop: '4px', color: '#555' }}>{reply.content}</div>
                                    <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>回复于{new Date(reply.timestamp * 1000).toLocaleString()}</div>
                                </div>
                            </Card>
                        )}
                    />
                    <Input.TextArea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="输入你的回复..."
                        rows={4}
                        style={{ marginTop: '16px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
                    />
                    <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                        <Button type="primary" onClick={handleReply} style={{ borderRadius: '8px' }}>
                            回复
                        </Button>
                        <Dropdown menu={{ items }} placement="bottomLeft" arrow={{ pointAtCenter: true }}>
                            <Button>暖心回应</Button>
                        </Dropdown>
                    </div>
                </div>
            </div>
        } />
    );
}