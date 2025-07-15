import React, { useState, useEffect } from 'react';
import { Tabs, Table, Button, message, Typography, Space, Tag, Select, Input, Modal, Card, Tooltip, Dropdown } from 'antd';
import { getIllegalBlogs, getIllegalReplies, deleteBlog, deleteReply, handleApproveBlog, handleApproveReply } from '../service/community';
import { useNavigate } from 'react-router-dom';
import CustomLayout from "../components/layout/customlayout";
import moment from 'moment';
import { SearchOutlined, ExclamationCircleOutlined, InfoCircleOutlined, MoreOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { confirm } = Modal;

const AdminReviewPage = () => {
    const [illegalBlogs, setIllegalBlogs] = useState([]);
    const [illegalReplies, setIllegalReplies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState('0'); // 默认显示待审核
    const [searchText, setSearchText] = useState('');
    const navigate = useNavigate();
    const [update , setUpdate] = useState(false);
    const [open, setOpen] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [blogs, replies] = await Promise.all([
                getIllegalBlogs(),
                getIllegalReplies()
            ]);
            setIllegalBlogs(blogs);
            setIllegalReplies(replies);
        } catch (error) {
            message.error('加载数据失败：' + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [update]);

    const handleDelete = async (blogId, illegalId, title,type,userid) => {
        if(type === 'blog'){
            await handleDeleteBlog(blogId, illegalId, title, userid);
        }else{
            await handleDeleteReply(blogId, illegalId, userid);
        }
    };

    const handleApprove = async (illegalId,type) => {
        if(type === 'blog'){
            await handleApproveBlog(illegalId);
            setUpdate(!update);
        }else{
            await handleApproveReply(illegalId);
            setUpdate(!update);
        }
    };

    const handleDeleteBlog = async (blogId, illegalId, title, userid) => {
        // confirm({
        //     title: '确认屏蔽帖子',
        //     icon: <ExclamationCircleOutlined />,
        //     content: `确定要屏蔽标题为"${title}"的帖子吗？`,
        //     okText: '确认屏蔽',
        //     okType: 'danger',
        //     cancelText: '取消',
        //     onOk: async () => {
                try {
                    await deleteBlog(blogId, illegalId,userid);
                    message.success('帖子已屏蔽');
                    setUpdate(!update);
                    //await fetchData();
                } catch (error) {
                    message.error('屏蔽失败：' + error.message);
                }

        //});
        //setOpen(true);


    };

    const handleDeleteReply = async (replyId, illegalId, userid) => {
        // try {
        //     await deleteReply(replyId, illegalId);
        //     message.success('回复已屏蔽');
        //     setUpdate(!update);
        //     //await fetchData();
        // } catch (error) {
        //     message.error('屏蔽失败：' + error.message);
        // }

        // confirm({
        //     title: '确认屏蔽回复',
        //     icon: <ExclamationCircleOutlined />,
        //     content: `确定要屏蔽该回复吗？`,
        //     okText: '确认屏蔽',
        //     okType: 'danger',
        //     cancelText: '取消',
        //     onOk: async () => {
                try {
                    await deleteReply(replyId, illegalId, userid);
                    message.success('回复已屏蔽');
                    setUpdate(!update);
                    //await fetchData();
                } catch (error) {
                    message.error('屏蔽失败：' + error.message);
                }

        //     }
        // });
    };

    const formatTimestamp = (timestamp) => {
        return moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
    };

    const getStatusTag = (status) => {
        const statusMap = {
            0: { color: 'gold', text: '待审核' },
            1: { color: 'red', text: '已屏蔽' },
            2: { color: 'green', text: '已撤销' }
        };
        const { color, text } = statusMap[status] || { color: 'default', text: '未知' };
        return <Tag color={color}>{text}</Tag>;
    };

    const filterByStatus = (data) => {
        if (statusFilter === 'all') return data;
        return data.filter(item => item.status.toString() === statusFilter);
    };

    const filterData = (data) => {
        return data.filter(item =>
            item.userid.toLowerCase().includes(searchText.toLowerCase()) ||
            item.content.toLowerCase().includes(searchText.toLowerCase()) ||
            (item.title && item.title.toLowerCase().includes(searchText.toLowerCase()))
        );
    };


    const getActionMenu = (record, type) => ({
        items: [
            {
                key: 'view-user',
                label: '查看用户',
                onClick: () => navigate(`/admin/user/${record.userid}`)
            },
            {
                key: 'view-content',
                label: type === 'blog' ? '查看帖子' : '查看原帖',
                onClick: () => navigate(`/admin/blog/${record.blogid}`)
            },
            ...(record.status === 0 ? [
                {
                    key: 'block',
                    label: <span style={{ color: '#ff4d4f' }}>屏蔽</span>,
                    onClick: () => handleDelete(record.contentid, record.illegalid, record.title, type,record.userid)
                },
                {
                    key: 'approve',
                    label: '撤销举报',
                    onClick: () => handleApprove(record.illegalid, type)
                }
            ] : [])
        ]
    });

    const renderContentWithTooltip = (text) => (
        <Tooltip title={text} placement="topLeft">
            <div style={{
                maxWidth: 200,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
            }}>
                {text}
            </div>
        </Tooltip>
    );

    const blogColumns = [
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status) => getStatusTag(status),
            width: 90,
            align: 'center'
        },
        {
            title: '时间',
            dataIndex: 'timestamp',
            key: 'timestamp',
            render: (timestamp) => formatTimestamp(timestamp),
            width: 160,
            sorter: (a, b) => moment(a.timestamp).unix() - moment(b.timestamp).unix()
        },
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            width: 200,
            render: renderContentWithTooltip
        },
        {
            title: '发帖人',
            dataIndex: 'userid',
            key: 'userid',
            width: 150,
            render: (text) => (
                <Tag color="blue" style={{ cursor: 'pointer' }}
                     onClick={() => navigate(`/admin/user/${text}`)}>
                    {text}
                </Tag>
            )
        },
        {
            title: '违规原因',
            dataIndex: 'reason',
            key: 'reason',
            width: 150,
            render: (text) => <Tag color="red">{text}</Tag>
        },
        {
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 120,
            render: (_, record) => (
                <Space>
                    {record.status === 0 && (
                        <>
                            <Button
                                size="small"
                                danger
                                onClick={() => handleDelete(record.contentid, record.illegalid, record.title,  'blog',record.userid)}
                            >
                                屏蔽
                            </Button>
                            <Button
                                size="small"
                                type="primary"
                                ghost
                                onClick={() => handleApprove(record.illegalid, 'blog')}
                            >
                                撤销
                            </Button>
                        </>
                    )}
                    <Dropdown
                        menu={getActionMenu(record, 'blog')}
                        trigger={['click']}
                        placement="bottomRight"
                    >
                        <Button
                            type="text"
                            icon={<MoreOutlined />}
                            size="small"
                        />
                    </Dropdown>
                </Space>
            ),
        },
    ];

    const replyColumns = [
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status) => getStatusTag(status),
            width: 90,
            align: 'center'
        },
        {
            title: '时间',
            dataIndex: 'timestamp',
            key: 'timestamp',
            render: (timestamp) => formatTimestamp(timestamp),
            width: 160,
            sorter: (a, b) => moment(a.timestamp).unix() - moment(b.timestamp).unix()
        },

        {
            title: '回复人',
            dataIndex: 'userid',
            key: 'userid',
            width: 180,
            render: (text) => (
                <Tag color="blue" style={{ cursor: 'pointer' }}
                     onClick={() => navigate(`/admin/user/${text}`)}>
                    {text}
                </Tag>
            )
        },
        {
            title: '违规原因',
            dataIndex: 'reason',
            key: 'reason',
            width: 70,
            render: (text) => <Tag color="red">{text}</Tag>
        },
        {
            title: '内容',
            dataIndex: 'content',
            key: 'content',
            width: 200,
            render: renderContentWithTooltip
        },
        {
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 120,
            render: (_, record) => (
                <Space>
                    {record.status === 0 && (
                        <>
                            <Button
                                size="small"
                                danger
                                onClick={() => handleDelete(record.contentid, record.illegalid, record.title, 'reply',record.userid)}
                            >
                                屏蔽
                            </Button>
                            <Button
                                size="small"
                                type="primary"
                                ghost
                                onClick={() => handleApprove(record.illegalid, 'reply')}
                            >
                                撤销
                            </Button>
                        </>
                    )}
                    <Dropdown
                        menu={getActionMenu(record, 'reply')}
                        trigger={['click']}
                        placement="bottomRight"
                    >
                        <Button
                            type="text"
                            icon={<MoreOutlined />}
                            size="small"
                        />
                    </Dropdown>
                </Space>
            ),
        },
    ];

    return (
        <CustomLayout role={1} content={
            <div style={{ padding: '24px' }}>
                <Card>
                    <div style={{ marginBottom: 24 }}>
                        <Title level={2}>内容审核
                            <Tooltip title="对违规内容进行审核和处理">
                                <InfoCircleOutlined style={{ fontSize: 16, marginLeft: 8, color: '#1890ff' }} />
                            </Tooltip>
                        </Title>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, marginTop: 24 }}>
                            <Input
                                placeholder="搜索用户ID/标题/内容"
                                prefix={<SearchOutlined />}
                                onChange={e => setSearchText(e.target.value)}
                                style={{ width: 300 }}
                                allowClear
                            />
                            <Select
                                defaultValue="0"
                                style={{ width: 120 }}
                                onChange={setStatusFilter}
                            >
                                <Option value="0">待审核</Option>
                                <Option value="1">已屏蔽</Option>
                                <Option value="2">已撤销</Option>
                                <Option value="all">全部</Option>
                            </Select>
                        </div>
                    </div>
                    <Tabs type="card" tabBarStyle={{ marginBottom: 16 }}>
                        <TabPane
                            tab={
                                <span style={{ display: 'flex', alignItems: 'center' }}>
                                    <ExclamationCircleOutlined style={{ marginRight: 8 }} />
                                    违规帖子
                                    {illegalBlogs.filter(b => b.status === 0).length > 0 && (
                                        <Tag color="red" style={{ marginLeft: 8, borderRadius: 10 }}>
                                            {illegalBlogs.filter(b => b.status === 0).length}
                                        </Tag>
                                    )}
                                </span>
                            }
                            key="1"
                        >
                            <Table
                                columns={blogColumns}
                                dataSource={filterData(filterByStatus(illegalBlogs))}
                                rowKey="contentid"
                                loading={loading}
                                scroll={{ x: 900 }}
                                pagination={{
                                    showSizeChanger: true,
                                    showQuickJumper: true,
                                    showTotal: total => `共 ${total} 条记录`,
                                    pageSizeOptions: ['10', '20', '50']
                                }}
                            />
                        </TabPane>
                        <TabPane
                            tab={
                                <span style={{ display: 'flex', alignItems: 'center' }}>
                                    <ExclamationCircleOutlined style={{ marginRight: 8 }} />
                                    违规回复
                                    {illegalReplies.filter(r => r.status === 0).length > 0 && (
                                        <Tag color="red" style={{ marginLeft: 8, borderRadius: 10 }}>
                                            {illegalReplies.filter(r => r.status === 0).length}
                                        </Tag>
                                    )}
                                </span>
                            }
                            key="2"
                        >
                            <Table
                                columns={replyColumns}
                                dataSource={filterData(filterByStatus(illegalReplies))}
                                rowKey="contentid"
                                loading={loading}
                                scroll={{ x: 1200 }}
                                pagination={{
                                    showSizeChanger: true,
                                    showQuickJumper: true,
                                    showTotal: total => `共 ${total} 条记录`,
                                    pageSizeOptions: ['10', '20', '50']
                                }}
                            />
                        </TabPane>
                    </Tabs>
                </Card>
            </div>
        } />
    );
};

export default AdminReviewPage;