import React, { useState, useEffect } from "react";
import { Avatar, Button, Col, Divider, Input, List, Pagination, Row, Select, Tag, Typography } from "antd";
import {UserOutlined, ClockCircleOutlined, LikeOutlined, SearchOutlined} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import CustomLayout from "../components/layout/customlayout";
import { getAvatar, getBlogs } from "../service/community";
import { useNavigate } from "react-router-dom";
import Search from "antd/es/input/Search";

dayjs.extend(relativeTime);
const { Option } = Select;

function BlogsSearch({ searchText, tags, onSearchChange, onTagsChange, availableTags }) {
    return (
        <Row gutter={16}>
            <Col span={8}>
                <Search
                    placeholder="搜索帖子或用户"
                    allowClear
                    enterButton={<SearchOutlined />}
                    size="large"
                    value={searchText}
                    onChange={onSearchChange}
                />
            </Col>
            <Col span={8}>
                <Select
                    placeholder="选择标签过滤"
                    mode="multiple"
                    style={{ width: '100%' }}
                    size="large"
                    value={tags}
                    onChange={onTagsChange}
                >
                    <Option value="all">全部</Option>
                    <Option value="学习">学习</Option>
                    <Option value="生活">生活</Option>
                    <Option value="情感">情感</Option>
                    <Option value="其他">其他</Option>
                </Select>
            </Col>
        </Row>
    );
}

export default function CommunityPage() {
    const [searchText, setSearchText] = useState('');
    const [tags, setTags] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [availableTags, setAvailableTags] = useState([]);
    const navigate = useNavigate();
    const [avatarsMap, setAvatarsMap] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [avatars, setAvatars] = useState([]);

    // 获取博客数据
    useEffect(() => {
        const fetchBlogs = async () => {
            const fetched_blogs = await getBlogs(pageSize, currentPage, searchText, tags);
            setBlogs(fetched_blogs);
        };
        fetchBlogs();
        console.log(tags);
    }, [pageSize, currentPage, searchText, tags]);

    useEffect(() => {
        setAvailableTags(['学习','生活','情感','其他']);
    }, []);


    useEffect(() => {
        const fetchAvatars = async () => {

            const userids = blogs.map(blog => blog.userid);
            const fetched_avatars = await Promise.all(userids.map(userid => getAvatar(userid)));
            setAvatars(fetched_avatars);
        };
        fetchAvatars();
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
    
    useEffect(() => {
        setCurrentPage(1);
    }, [searchText, tags]);

    return (
        <CustomLayout role={1} content={
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                {
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                        <Typography.Title level={2}>校园树洞</Typography.Title>

                    </div>
                }

                <div style={{ marginBottom: 24 }}>
                    <BlogsSearch
                        searchText={searchText}
                        tags={tags}
                        onSearchChange={e => setSearchText(e.target.value)}
                        onTagsChange={setTags}
                        availableTags={availableTags}
                    />
                </div>

                <Typography.Title level={4} style={{ marginBottom: 24 }}>
                    📃 所有帖子 ({blogs.length})
                </Typography.Title>

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
                            onClick={() => navigate(`/admin/blog/${blog.blogid}`)}
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

                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={blogs.length}
                    onChange={(page, pageSize) => {
                        setCurrentPage(page);
                        setPageSize(pageSize);
                    }}
                    showSizeChanger
                    onShowSizeChange={(current, size) => {
                        setPageSize(size);
                        setCurrentPage(1);
                    }}
                    style={{ margin: '24px 0', textAlign: 'center' }}
                />

                <Divider dashed style={{ borderColor: '#0055FF' }}>
                    🤗 已经到底啦
                </Divider>
            </div>
        }/>
    );
}

