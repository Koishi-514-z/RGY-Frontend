import React, { useState, useEffect } from "react";
import CustomLayout from "../components/layout/customlayout";
import { useNavigate, useParams } from "react-router-dom";
import { getBlogById, likeBlog, cancelLikeBlog, addReply } from "../service/community";
import { ArrowLeftOutlined, HeartTwoTone } from "@ant-design/icons";
import { Button, Input, List, Card } from "antd";

export default function BlogdetailPage() {
    //const {id} = useParams();
    const id = 1;
    const navigate = useNavigate();
    const [blog, setBlog] = useState({});
    const [isLiked, setIsLiked] = useState(0);
    const [replies, setReplies] = useState([]);
    const [replyContent, setReplyContent] = useState("");

    useEffect(() => {
        const fetchBlog = async () => {
            const fetched_blog = await getBlogById(id);
            console.log(fetched_blog);
            setBlog(fetched_blog);
        };
        fetchBlog();
    }, [id]);

    useEffect(() => {
        const fetchReplies = async () => {
            const fetched_replies = blog.reply;
            console.log(fetched_replies);
            setReplies(fetched_replies || []);
        };
        fetchReplies();
    }, [blog]);

    function handleLike() {
        if (!isLiked) {
            likeBlog(id).then(res => {
                if (res.success) {
                    setIsLiked(1);
                }
            });
        } else {
            cancelLikeBlog(id).then(res => {
                if (res.success) {
                    setIsLiked(0);
                }
            });
        }
    }

    async function handleReply() {
        if (replyContent.trim()) {
            const res = await addReply(id, replyContent);
            console.log(replyContent);
            if (res.success) {
                setReplies([...replies, res.reply]);
                setReplyContent("");
            }
        }
    }

    async function handleWarmReply() {
        const warmMessage = "这是一篇很棒的文章！加油！";
        const res = await addReply(id, warmMessage);
        if (res.success) {
            setReplies([...replies, res.reply]);
        }
    }

    return (
        <CustomLayout content={
            <div style={{ padding: '24px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <Button
                        type="link"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate(-1)}
                        style={{ fontSize: '16px' }}
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
                                backgroundColor: isLiked ? "#ff7875" : "#f0f0f0",
                                borderColor: isLiked ? "#ff4d4f" : "#d9d9d9",
                                color: isLiked ? "#fff" : "#000",
                                boxShadow: isLiked ? "0 4px 12px rgba(255, 77, 79, 0.4)" : "0 2px 8px rgba(0, 0, 0, 0.1)"
                            }}
                        />
                        <div style={{ fontSize: '14px', color: isLiked ? "#ff4d4f" : "#666", marginTop: '8px' }}>
                            点赞数：<span style={{ fontWeight: 'bold' }}>{blog.likeNum}</span>
                        </div>
                    </div>
                </div>
                <Card style={{ marginBottom: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>{blog.title}</h1>
                    <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#333' }}>{blog.content}</p>
                    <div style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
                        <div>洞主：<span style={{ fontWeight: 'bold' }}>{blog.userid}</span></div>
                        <div style={{ color: '#007bff' }}>标签：#<span style={{ color: '#007bff' }}>{blog.tag?.join(" #")}</span></div>
                    </div>
                </Card>
                <div style={{ marginTop: '24px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>回复</h2>
                    <List
                        dataSource={replies}
                        renderItem={reply => (
                            <Card style={{ marginBottom: '8px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                                <div>
                                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{reply.userid}</div>
                                    <div style={{ fontSize: '14px', marginTop: '4px' }}>{reply.content}</div>
                                    <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>时间：{new Date(reply.timestamp * 1000).toLocaleString()}</div>
                                </div>
                            </Card>
                        )}
                    />
                    <Input.TextArea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="输入你的回复..."
                        rows={4}
                        style={{ marginTop: '16px', borderRadius: '8px' }}
                    />
                    <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                        <Button type="primary" onClick={handleReply}>
                            回复
                        </Button>
                        <Button type="default" onClick={handleWarmReply}>
                            暖心回应
                        </Button>
                    </div>
                </div>
            </div>
        } />
    );
}