

import React, { useState, useEffect } from "react";
import CustomLayout from "../components/layout/customlayout";
import { useNavigate, useParams } from "react-router-dom";
import {getBlogById, likeBlog, cancelLikeBlog, addReply, getAvatar, getBlogs} from "../service/community";
import {ArrowLeftOutlined, DeleteOutlined, HeartTwoTone} from "@ant-design/icons";
import {Button, Input, List, Card, App, Pagination, Dropdown} from "antd";
import Loading from "../components/loading";

export default function BlogdetailPage() {
    const param = useParams();
    const id = param.blogid;
    const navigate = useNavigate();
    const [blog, setBlog] = useState();
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


    useEffect(() => {
        const fetchBlog = async () => {
            const fetched_blog = await getBlogById(id);
            console.log(fetched_blog);
            setBlog(fetched_blog);
            setNumLikes(fetched_blog.likeNum);
        };
        fetchBlog();
    }, [id]);

    useEffect(() => {
        const fetchReplies = async () => {
            if (!blog) return;
            const fetched_replies = blog.replies;
            console.log(fetched_replies);
            setReplies(fetched_replies || []);
        };
        fetchReplies();
    }, [blog]);

    function handleDelete() {
        message.loading("正在删除...");
        setTimeout(() => {
            message.success("删除成功！");
            navigate(-1);
        }, 1000);
    }


    if(!blog ) {
        return (
            <CustomLayout role={1} content={
                <Loading />
            }/>
        )
    }

    return (
        <CustomLayout role={1} content={
            <div style={{ padding: '24px', backgroundColor: '#f0f2f5', borderRadius: '8px' }}>
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
                            //删除博客
                            type="link"
                            icon={<DeleteOutlined />}
                            onClick={handleDelete}
                            style={{
                                fontSize: '20px',
                                backgroundColor: isLiked ? "#f0f0f0" : "#f0f0f0",
                                borderColor: isLiked ? "#ff4d4f" : "#d9d9d9",
                                //color: isLiked ? "#fff" : "#000",
                                boxShadow: isLiked ? "0 4px 12px rgba(255, 77, 79, 0.4)" : "0 2px 8px rgba(0, 0, 0, 0.1)"
                            }}
                        />
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '24px', backgroundColor: '#fff', padding: '16px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>

                    <div style={{ flex: '2', display: 'flex', flexDirection: 'column', justifyContent: 'start' }}>

                        <div style={{ fontSize: '14px', color: '#666', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <img
                                src={blog.user.avatar}
                                alt="avatar"
                                style={{ width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
                                onClick={() => navigate(`/admin/user/${blog.user.userid}`)}
                            />
                            <div><span style={{ fontWeight: 'bold', fontSize: '20px', color: '#333' }}>{blog.user? blog.user.userid:""}</span></div>
                        </div>
                        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>{blog.title}</h1>
                        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#555', overflow: 'auto'}}>{blog.content}</p>
                        <div style={{ color: '#1890ff', fontWeight: 'bold' }}>#<span>{blog.tag?.join(" #")}</span></div>
                        <div style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>编辑于{new Date(blog.timestamp).toLocaleString()}</div>


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
                                            src={reply.user.avatar}
                                            alt="avatar"
                                            style={{ width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
                                            onClick={() => navigate(`/admin/user/${reply.user.userid}`)}
                                        />
                                        <div><span style={{ fontWeight: 'bold', fontSize: '15px', color: '#333' }}>{reply.user.userid}</span></div>
                                    </div>
                                    <div style={{ fontSize: '14px', marginTop: '4px', color: '#555' }}>{reply.content}</div>
                                    <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>回复于{new Date(reply.timestamp ).toLocaleString()}</div>
                                </div>
                            </Card>
                        )}
                    />
                </div>
            </div>
        } />
    );
}