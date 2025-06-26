// import React, { useState, useEffect } from "react";
// import { Button } from "antd";
//
// import CustomLayout from "../components/layout/customlayout";
// import {Col, Divider, message, Row} from "antd";
// import Title from "antd/es/skeleton/Title";
// import {getBlogs} from "../service/community";
// import BlogCard from "../components/blogcard";
// import { useNavigate } from "react-router-dom";
//
// function BlogsSearch(props) {
//     return null;
// }
//
// export default function CommunityPage() {
//     const [searchText, setSearchText] = useState('');
//     const [tags, setTags] = useState('all');
//     const [blogs, setBlogs] = useState([]);
//     const navigate = useNavigate();
//
//
//     useEffect(() => {
//         const fetchBlogs = async () => {
//             const fetched_blogs = await getBlogs();
//             console.log(fetched_blogs);
//             setBlogs(fetched_blogs);
//         };
//         fetchBlogs();
//     },[]);
//
//     return (
//         <CustomLayout content={
//             <div>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
//                     <Title level={2}>欢迎来到校园树洞</Title>
//                     <Button type="primary" onClick={() => navigate('/post')} style={{ fontSize: '16px' }}>
//                         发帖
//                     </Button>
//                 </div>
//                 <div style={{ marginBottom: '24px' }}>
//                     <BlogsSearch
//                         searchText={searchText}
//                         tags={tags}
//                         onSearchChange={e => setSearchText(e.target.value)}
//                         onTagsChange={setTags}
//                     />
//                 </div>
//                 <Title level={3}>所有帖子</Title>
//                 <Row gutter={[16, 16]}>
//                     {blogs.map(blog => (
//                         <Col span={6} key={blog.blogid}>
//                             <BlogCard blog={blog}  />
//                         </Col>
//                     ))}
//                 </Row>
//                 <Divider variant="dashed" style={{ borderColor: '#0055FF' }} dashed>
//                     End
//                 </Divider>
//             </div>
//         }/>
//     );
// }

// import React, { useState, useEffect } from "react";
// import {Button, Col} from "antd";
//
// import CustomLayout from "../components/layout/customlayout";
// import { Divider, message, Row } from "antd";
// import Title from "antd/es/skeleton/Title";
// import { getBlogs } from "../service/community";
// import { useNavigate } from "react-router-dom";
//
// function BlogsSearch(props) {
//     return null;
// }
//
// export default function CommunityPage() {
//     const [searchText, setSearchText] = useState('');
//     const [tags, setTags] = useState('all');
//     const [blogs, setBlogs] = useState([]);
//     const navigate = useNavigate();
//
//     useEffect(() => {
//         const fetchBlogs = async () => {
//             const fetched_blogs = await getBlogs();
//             console.log(fetched_blogs);
//             setBlogs(fetched_blogs);
//         };
//         fetchBlogs();
//     }, []);
//
//     return (
//         <CustomLayout content={
//             <div>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
//                     <Title level={2}>欢迎来到校园树洞</Title>
//                     <Button type="primary" onClick={() => navigate('/post')} style={{ fontSize: '16px' }}>
//                         发帖
//                     </Button>
//                 </div>
//                 <div style={{ marginBottom: '24px' }}>
//                     <BlogsSearch
//                         searchText={searchText}
//                         tags={tags}
//                         onSearchChange={e => setSearchText(e.target.value)}
//                         onTagsChange={setTags}
//                     />
//                 </div>
//                 <Title level={3}>所有帖子</Title>
//                 <Row gutter={[16, 16]}>
//                     {blogs.map(blog => (
//                         <Col span={24} key={blog.blogid} style={{ marginBottom: '16px' }}>
//                             <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
//                                 <Title level={4}>{blog.title}</Title>
//                                 <p>{blog.content}</p>
//                                 <div>
//                                     <strong>作者ID:</strong> {blog.userid} <br />
//                                     <strong>发布时间:</strong> {new Date(blog.timestamp).toLocaleString()} <br />
//                                     <strong>点赞数:</strong> {blog.likeNum} <br />
//                                     <strong>标签:</strong> {blog.tag.join(', ')}
//                                 </div>
//                             </div>
//                         </Col>
//                     ))}
//                 </Row>
//                 <Divider variant="dashed" style={{ borderColor: '#0055FF' }} dashed>
//                     End
//                 </Divider>
//             </div>
//         }/>
//     );
// }

import React, { useState, useEffect } from "react";
import { Avatar, Button, Col, Divider, List, Row, Tag, Typography } from "antd";
import { UserOutlined, ClockCircleOutlined, LikeOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import CustomLayout from "../components/layout/customlayout";
import {getAvatar, getBlogs} from "../service/community";
import { useNavigate } from "react-router-dom";

dayjs.extend(relativeTime);

function BlogsSearch(props) {
    return null;
}

export default function CommunityPage() {
    const [searchText, setSearchText] = useState('');
    const [tags, setTags] = useState('all');
    const [blogs, setBlogs] = useState([]);
    const navigate = useNavigate();
    const [avatars, setAvatars] = useState([]);
    const [avatarsMap, setAvatarsMap ] = useState({});

    useEffect(() => {
        const fetchBlogs = async () => {
            const fetched_blogs = await getBlogs();
            setBlogs(fetched_blogs);
        };
        fetchBlogs();
    }, []);
    useEffect(() => {
        const fetchAvatars = async () => {
            //遍历blogs，获取所有userid，然后请求对应的头像
            const userids = blogs.map(blog => blog.userid);
            const fetched_avatars = await Promise.all(userids.map(userid => getAvatar(userid)));
            setAvatars(fetched_avatars);
        };
        fetchAvatars();
        //设置所有blog的avatar属性

    }, [ blogs]);
    useEffect(() => {
        const fetchAvatarsMap = async () => {
            const fetched_avatars_map = {};
            for (let i = 0; i < blogs.length; i++) {
                const blog = blogs[i];
                fetched_avatars_map[blog.userid] = avatars[i];
            }
            setAvatarsMap(fetched_avatars_map);
        };
        fetchAvatarsMap();
    }, [ blogs, avatars ]);

    return (
        <CustomLayout content={
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <Typography.Title level={2}>🎉 欢迎来到校园树洞</Typography.Title>
                    <Button
                        type="primary"
                        onClick={() => navigate('/post')}
                        style={{ fontSize: 16, height: 40 }}
                    >
                        ✍️ 发帖
                    </Button>
                </div>

                <div style={{ marginBottom: 24 }}>
                    <BlogsSearch
                        searchText={searchText}
                        tags={tags}
                        onSearchChange={e => setSearchText(e.target.value)}
                        onTagsChange={setTags}
                    />
                </div>

                <Typography.Title level={4} style={{ marginBottom: 24 }}>📃 所有帖子 ({blogs.length})</Typography.Title>

                <List
                    itemLayout="vertical"
                    dataSource={blogs}
                    renderItem={blog => (
                        <List.Item
                            style={{
                                background: '#fff',
                                borderRadius: 8,
                                marginBottom: 16,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                ':hover': {
                                    transform: 'translateY(-2px)'
                                }
                            }}
                            onClick={() => navigate(`/blog/${blog.blogid}`)}
                        >
                            <List.Item.Meta
                                avatar={
                                    <Avatar
                                        src={ avatarsMap[blog.userid]|| `https://joesch.moe/api/v1/random?key=${blog.userid}`}
                                        size={40}
                                        icon={<UserOutlined />}
                                    />
                                }
                                title={
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <span style={{ marginRight: 16 }}>{blog.userid}</span>
                                        <Tag color="blue">
                                            <ClockCircleOutlined />
                                            {new Date(blog.timestamp * 1000).toLocaleString()}
                                        </Tag>
                                    </div>
                                }
                                description={
                                    <>
                                        <Typography.Title level={5} style={{ marginTop: 8 }}>
                                            {blog.title}
                                        </Typography.Title>
                                        <Typography.Paragraph
                                            ellipsis={{ rows: 2 }}
                                            style={{ color: 'rgba(0,0,0,0.7)' }}
                                        >
                                            {blog.content.slice(0, 60)}...
                                        </Typography.Paragraph>
                                        <div style={{ marginTop: 8 }}>
                                            <Tag icon={<LikeOutlined />} color="red">
                                                {blog.likeNum} 点赞
                                            </Tag>
                                            {blog.tag.map((t, i) => (
                                                <Tag key={i} color={i % 3 === 0 ? 'geekblue' : 'green'}>
                                                    #{t}
                                                </Tag>
                                            ))}
                                        </div>
                                    </>
                                }
                            />
                        </List.Item>
                    )}
                />
                <Divider dashed style={{ borderColor: '#0055FF' }}>
                    🤗 已经到底啦
                </Divider>
            </div>
        }/>
    );
}
