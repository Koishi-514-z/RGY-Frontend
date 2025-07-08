import React, { useState, useEffect } from 'react';
import { Card, Table, Tabs, Typography, Tag, Button, message, Tooltip, Space } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import {adminGetBlogById, getUserBlogs, getUserReplies} from '../service/community';
import CustomLayout from "../components/layout/customlayout";
import { ArrowLeftOutlined, WarningOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const AdminUserDetailPage = () => {
    const { userid } = useParams();
    const navigate = useNavigate();
    const [userBlogs, setUserBlogs] = useState([]);
    const [userReplies, setUserReplies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [titles, setTitles] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            try {
                const [blogs, replies] = await Promise.all([
                    getUserBlogs(userid),
                    getUserReplies(userid)
                ]);
                setUserBlogs(blogs);
                setUserReplies(replies);
            } catch (error) {
                message.error('加载用户数据失败：' + error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [userid]);

    //获得所有回复对应的帖子标题

    useEffect(() => {
        const fetchTitles = async () => {
            try {
                const titles = await Promise.all(userReplies.map(async (reply) => {
                    const blog = await adminGetBlogById(reply.blogid);
                    return blog.title;
                }));
                setTitles(titles);
            } catch (error) {
                message.error('加载博客标题失败：' + error.message);
            }
        };
        if (userReplies.length > 0) {
            fetchTitles();
        }

    }, [userReplies]);

    const blogColumns = [
        {
            title: '发布时间',
            dataIndex: 'timestamp',
            key: 'timestamp',
            width: 170,
            render: (timestamp) => moment(timestamp).format('YYYY-MM-DD HH:mm:ss'),
            sorter: (a, b) => a.timestamp - b.timestamp
        },
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            render: (text) => (
                <Tooltip title={text}>
                    <div style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {text}
                    </div>
                </Tooltip>
            )
        },
        {
            title: '浏览量',
            dataIndex: 'browsenum',
            key: 'browsenum',
            width: 100,
        },
        {
            title: '点赞数',
            dataIndex: 'likeNum',
            key: 'likeNum',
            width: 100,
            sorter: (a, b) => a.likeNum - b.likeNum
        },
        {
            title: '标签',
            dataIndex: 'tags',
            key: 'tags',
            width: 200,
            render: (tags) => (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {tags?.map((tag) => (
                        <Tag key={tag}>{tag}</Tag>
                    ))}
                </div>
            )
        },
        {
            title: '操作',
            key: 'action',
            width: 120,
            fixed: 'right',
            render: (_, record) => (
                <Button type="link" onClick={() => navigate(`/admin/blog/${record.blogid}`)}>
                    查看详情
                </Button>
            )
        }
    ];

    const replyColumns = [
        {
            title: '回复时间',
            dataIndex: 'timestamp',
            key: 'timestamp',
            width: 170,
            render: (timestamp) => moment(timestamp).format('YYYY-MM-DD HH:mm:ss'),
            sorter: (a, b) => a.timestamp - b.timestamp
        },
        {
            title: '原帖标题',
            dataIndex: 'replyid',
            key: 'replyid',
            render: (replyid) => (
                <Tooltip title={titles[userReplies.findIndex((reply) => reply.replyid === replyid)]}>
                    <Button type="link" onClick={() => navigate(`/admin/blog/${userReplies[userReplies.findIndex((reply) => reply.replyid === replyid)].blogid}`)}>
                        {titles[userReplies.findIndex((reply) => reply.replyid === replyid)]}
                    </Button>
                </Tooltip>
            )
        },
        {
            title: '回复内容',
            dataIndex: 'content',
            key: 'content',
            render: (text) => (
                <Tooltip title={text}>
                    <div style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {text}
                    </div>
                </Tooltip>
            )
        }
    ];

    return (
        <CustomLayout role={1} content={
            <div style={{ padding: '24px' }}>
                <Card>
                    <Space style={{ marginBottom: 16 }}>
                        <Button 
                            icon={<ArrowLeftOutlined />} 
                            onClick={() => navigate(-1)}
                        >
                            返回
                        </Button>
                        <Title level={3} style={{ margin: 0 }}>
                            用户 {userid} 的活动记录
                        </Title>
                    </Space>

                    <Tabs defaultActiveKey="1" style={{ marginTop: 16 }}>
                        <TabPane 
                            tab={
                                <span>
                                    发帖记录
                                    <Tag color="blue" style={{ marginLeft: 8 }}>
                                        {userBlogs.length}
                                    </Tag>
                                </span>
                            } 
                            key="1"
                        >
                            <Table
                                columns={blogColumns}
                                dataSource={userBlogs}
                                rowKey="blogid"
                                loading={loading}
                                pagination={{
                                    showSizeChanger: true,
                                    showQuickJumper: true,
                                    showTotal: total => `共 ${total} 条记录`
                                }}
                                scroll={{ x: 1200 }}
                            />
                        </TabPane>
                        <TabPane 
                            tab={
                                <span>
                                    回复记录
                                    <Tag color="blue" style={{ marginLeft: 8 }}>
                                        {userReplies.length}
                                    </Tag>
                                </span>
                            } 
                            key="2"
                        >
                            <Table
                                columns={replyColumns}
                                dataSource={userReplies}
                                rowKey="replyid"
                                loading={loading}
                                pagination={{
                                    showSizeChanger: true,
                                    showQuickJumper: true,
                                    showTotal: total => `共 ${total} 条记录`
                                }}
                                scroll={{ x: 1000 }}
                            />
                        </TabPane>
                    </Tabs>
                </Card>
            </div>
        } />
    );
};

export default AdminUserDetailPage;
