import React, { useState, useEffect } from 'react';
import {Card, Button, Typography, Space, Tag, message, Tooltip, Modal, Divider, Avatar, Pagination} from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import {adminGetBlogById, deleteBlog, deleteReply, getRepliesForBlog} from '../service/community';
import CustomLayout from "../components/layout/customlayout";
import { ArrowLeftOutlined, UserOutlined, LikeOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title, Text, Paragraph } = Typography;
const { confirm } = Modal;

const AdminBlogDetailPage = () => {
    const param = useParams();
    const id = param.blogid;
    const navigate = useNavigate();
    const [blog, setBlog] = useState();
    const [replies, setReplies] = useState([]);
    const [update, setUpdate] = useState(false);
    const [allReplies, setAllReplies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        const fetchBlog = async () => {
            const fetched_blog = await adminGetBlogById(id);
            setBlog(fetched_blog);
            setAllReplies(fetched_blog.replies || [])
        };
        fetchBlog();
    }, [id,update]);

    useEffect(() => {
        const fetchReplies = async () => {
            try {
                if (allReplies.length === 0) {
                    setReplies([]);
                    return;
                }
                if(allReplies[(currentPage - 1)*pageSize]!== null){
                    setReplies(allReplies.slice((currentPage - 1) * pageSize, currentPage * pageSize));
                    console.log(allReplies.slice((currentPage - 1) * pageSize, currentPage * pageSize));
                    return;
                }
                const fetchedReplies = await getRepliesForBlog(
                    id,
                    currentPage,
                    pageSize
                );
                let i = 0;
                for (const reply of fetchedReplies) {
                    allReplies[i + (currentPage - 1) * pageSize] = reply;
                    i++;
                }
                setReplies(allReplies.slice((currentPage - 1) * pageSize, currentPage * pageSize));
            } catch (error) {
                console.error("获取回复失败", error);
            }
        };
        fetchReplies();
    },[currentPage,pageSize,id,allReplies,update]);


    // 处理屏蔽帖子
    const handleBlockBlog = async () => {
        // confirm({
        //     title: '确认屏蔽帖子',
        //     icon: <ExclamationCircleOutlined />,
        //     content: `确定要屏蔽标题为"${blog?.title}"的帖子吗？`,
        //     okText: '确认屏蔽',
        //     okType: 'danger',
        //     cancelText: '取消',
        //     onOk: async () => {
        try {
            await deleteBlog(blog.blogid, null, blog.user?.userid);
            message.success('帖子已屏蔽');
            navigate('/admin/review');
        } catch (error) {
            message.error('屏蔽失败：' + error.message);
        }
        //     }
        // });
    };

    // 处理屏蔽回复
    const handleBlockReply = async (replyId,userid) => {
        // confirm({
        //     title: '确认屏蔽回复',
        //     icon: <ExclamationCircleOutlined />,
        //     content: '确定要屏蔽该回复吗？',
        //     okText: '确认屏蔽',
        //     okType: 'danger',
        //     cancelText: '取消',
        //     onOk: async () => {
        try {
            await deleteReply(replyId, null, userid);
            message.success('回复已屏蔽');
            setUpdate(!update);
            setCurrentPage(1);
        } catch (error) {
            message.error('屏蔽失败：' + error.message);
            console.log(error);
        }
        //     }
        // });
    };

    if (!blog) {
        return (
            <CustomLayout role={1} content={<div>加载中...</div>} />
        );
    }

    if(blog.valid === 0)
    {
        return (
            <CustomLayout content={<div>帖子已被删除</div>} />
        );
    }
    return (
        <CustomLayout role={1} content={
            <div style={{ padding: '24px' }}>
                <Card>
                    {/* 顶部导航区 */}
                    <Space style={{ marginBottom: 24, width: '100%', justifyContent: 'space-between' }}>
                        <Space>
                            <Button 
                                icon={<ArrowLeftOutlined />} 
                                onClick={() => navigate(-1)}
                            >
                                返回
                            </Button>
                            <Title level={3} style={{ margin: 0 }}>帖子详情</Title>
                        </Space>
                        <Button 
                            type="primary" 
                            danger
                            icon={<DeleteOutlined />}
                            onClick={handleBlockBlog}
                        >
                            屏蔽帖子
                        </Button>
                    </Space>

                    {/* 帖子内容区 */}
                    <Card className="blog-content-card">
                        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Space size="large">
                                <Space>
                                    <Avatar 
                                        size={40} 
                                        icon={<UserOutlined />} 
                                        src={blog?.user?.avatar}
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => navigate(`/admin/user/${blog?.user?.userid}`)}
                                    />
                                    <div>
                                        <Text strong style={{ fontSize: 16 }}>{blog?.user?.userid}</Text>
                                        <br />
                                        <Text type="secondary">
                                            {moment(blog?.timestamp).format('YYYY-MM-DD HH:mm:ss')}
                                        </Text>
                                    </div>
                                </Space>
                                {/*<Tag color="blue" */}
                                {/*    style={{ cursor: 'pointer' }} */}
                                {/*    onClick={() => navigate(`/admin/user/${blog?.user?.userid}`)}*/}
                                {/*>*/}
                                {/*    {blog?.user?.userid}*/}
                                {/*</Tag>*/}
                            </Space>
                            <Space>
                                <Tag icon={<LikeOutlined />} color="red">
                                    {blog?.likeNum || 0} 点赞
                                </Tag>
                                <Tag icon={<ExclamationCircleOutlined />} color="red">
                                    {blog?.browsenum || 0} 浏览
                                </Tag>
                                {blog?.tags?.map(tag => (
                                    <Tag key={tag} color="blue">#{tag}</Tag>
                                ))}
                            </Space>
                        </div>

                        <Title level={4}>{blog?.title}</Title>
                        <Paragraph style={{ fontSize: 16 }}>{blog?.content}</Paragraph>
                    </Card>

                    {/* 回复列表区 */}
                    <div style={{ marginTop: 24 }}>
                        <Title level={4}>全部回复 ({allReplies?.length})</Title>
                        {replies?.map((reply, index) => (
                            <Card 
                                key={reply?.replyid}
                                style={{ marginTop: 16 }}
                                className="reply-card"
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Space>
                                        <Avatar 
                                            size={32} 
                                            icon={<UserOutlined />} 
                                            src={reply?.user?.avatar}
                                        />
                                        <Space direction="vertical" size={0}>
                                            <Text strong>{reply?.user?.username}</Text>
                                            <Text type="secondary">
                                                {moment(reply?.timestamp).format('YYYY-MM-DD HH:mm:ss')}
                                            </Text>
                                        </Space>
                                        <Tag 
                                            color="blue" 
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => navigate(`/admin/user/${reply?.user?.userid}`)}
                                        >
                                            {reply?.user?.userid}
                                        </Tag>
                                    </Space>
                                    <Button 
                                        danger
                                        type="text"
                                        icon={<DeleteOutlined />}
                                        onClick={() => handleBlockReply(reply?.replyid,reply?.user?.userid)}
                                    >
                                        屏蔽
                                    </Button>
                                </div>
                                <Paragraph 
                                    style={{ 
                                        marginTop: 16,
                                        marginBottom: 0,
                                        paddingLeft: 40
                                    }}
                                >
                                    {reply?.content}
                                </Paragraph>
                            </Card>
                        ))}
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
                            <Pagination
                                current={currentPage}
                                pageSize={pageSize}
                                total={allReplies.length}
                                onChange={(page, pageSize) => {
                                    setCurrentPage(page);
                                    setPageSize(pageSize);
                                }}
                            />
                        </div>
                    </div>
                </Card>
            </div>
        } />
    );
};

export default AdminBlogDetailPage;