import React, { useState, useEffect } from "react";
import CustomLayout from "../components/layout/customlayout";
import { useNavigate, useParams } from "react-router-dom";
import {getBlogById, likeBlog, cancelLikeBlog, addReply, getAvatar, getBlogs} from "../service/community";
import {ArrowLeftOutlined, DeleteOutlined, HeartTwoTone} from "@ant-design/icons";
import {Button, Input, List, Card, App, Pagination, Dropdown} from "antd";

export default function BlogdetailPage() {
    //const {id} = useParams();
    const id = 1;
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


    useEffect(() => {
        const fetchAvatars = async () => {
            //遍历blogs，获取所有userid，然后请求对应的头像
            const userids = replies.map(reply => reply.userid);
            const fetched_avatars = await Promise.all(userids.map(userid => getAvatar(userid)));
            setAvatars(fetched_avatars);
        };
        fetchAvatars();
        //设置所有blog的avatar属性

    }, [ replies ]);
    useEffect(() => {
        const fetchAvatarsMap = async () => {
            const fetched_avatars_map = {};
            for (let i = 0; i < replies.length; i++) {
                const blog = replies[i];
                fetched_avatars_map[blog.userid] = avatars[i];
            }
            setAvatarsMap(fetched_avatars_map);
        };
        fetchAvatarsMap();
    }, [ replies, avatars ]);

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
    }, [id]);

    useEffect(() => {
        const fetchReplies = async () => {
            const fetched_replies = blog.reply;
            console.log(fetched_replies);
            setReplies(fetched_replies || []);
        };
        fetchReplies();
    }, [blog]);

    useEffect(() => {
        const fetchAvatar = async () => {
            const fetched_avatar = await getAvatar(blog.userid);
            setAvatar(fetched_avatar);
        };
        if (blog.userid) {
            fetchAvatar();
        }
    }, [blog.userid]);


    function handleDelete() {
        message.loading("正在删除...");
        setTimeout(() => {
            message.success("删除成功！");
            navigate(-1);
        }, 1000);
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
                            danger
                            style={{
                                fontSize: '20px',
                                backgroundColor: isLiked ? "#f0f0f0" : "#f0f0f0",
                                borderColor: isLiked ? "#ff4d4f" : "#d9d9d9",
                                boxShadow: isLiked ? "0 4px 12px rgba(255, 77, 79, 0.4)" : "0 2px 8px rgba(0, 0, 0, 0.1)"
                            }}
                        />
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '24px', backgroundColor: '#fff', padding: '16px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>

                    <div style={{ flex: '2', display: 'flex', flexDirection: 'column', justifyContent: 'start' }}>

                        <div style={{ fontSize: '14px', color: '#666', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <img
                                src={avatar}
                                alt="avatar"
                                style={{ width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
                                onClick={() => navigate(`/home/${blog.userid}`)}
                            />
                            <div><span style={{ fontWeight: 'bold', fontSize: '20px', color: '#333' }}>{blog.userid}</span></div>
                        </div>
                        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>{blog.title}</h1>
                        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#555', overflow: 'auto'}}>{paginatedContent}</p>
                        <div style={{ color: '#1890ff', fontWeight: 'bold' }}>#<span>{blog.tag?.join(" #")}</span></div>
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
                                            src={avatarsMap[reply.userid]}
                                            alt="avatar"
                                            style={{ width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
                                            onClick={() => navigate(`/home/${reply.userid}`)}
                                        />
                                        <div><span style={{ fontWeight: 'bold', fontSize: '15px', color: '#333' }}>{reply.userid}</span></div>
                                    </div>
                                    <div style={{ fontSize: '14px', marginTop: '4px', color: '#555' }}>{reply.content}</div>
                                    <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>回复于{new Date(reply.timestamp * 1000).toLocaleString()}</div>
                                </div>
                            </Card>
                        )}
                    />
                </div>
            </div>
        } />
    );
}