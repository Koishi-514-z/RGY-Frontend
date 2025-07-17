import React, { useState, useEffect } from 'react';
import { Tabs, Table, Button, message, Typography, Space, Tag, Input, Modal, Dropdown, Select, Card } from 'antd';
import { getAuditingCrisis, getAllConfirmedCrisis, confirmCrisis, deleteCrisis } from '../service/crisis';
import { useNavigate } from 'react-router-dom';
import CustomLayout from "../components/layout/customlayout";
import moment from 'moment';
import { SearchOutlined, ExclamationCircleOutlined, MoreOutlined, WarningOutlined, CheckCircleOutlined } from '@ant-design/icons';
import '../css/CrisisReviewPage.css'; // 引入自定义样式

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { confirm } = Modal;

const CrisisReviewPage = () => {
    const [auditingList, setAuditingList] = useState([]);
    const [confirmedList, setConfirmedList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [selectedCrisis, setSelectedCrisis] = useState(null);
    const [urgencyLevel, setUrgencyLevel] = useState(2);
    const [urgencyFilter, setUrgencyFilter] = useState('all');
    const navigate = useNavigate();
    const [update, setUpdate] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [auditing, confirmed] = await Promise.all([
                getAuditingCrisis(),
                getAllConfirmedCrisis()
            ]);
            setAuditingList(auditing);
            setConfirmedList(confirmed);
            console.log('auditing:', auditing);
            console.log('confirmed:', confirmed);
        } catch (error) {
            message.error('加载数据失败：' + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [auditing, confirmed] = await Promise.all([
                    getAuditingCrisis(),
                    getAllConfirmedCrisis()
                ]);
                setAuditingList(auditing);
                setConfirmedList(confirmed);
                console.log('auditing:', auditing);
                console.log('confirmed:', confirmed);
            } catch (error) {
                message.error('加载数据失败：' + error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [update]);

    const showConfirmModal = (crisis) => {
        setSelectedCrisis(crisis);
        setUrgencyLevel(2);
        setConfirmModalVisible(true);
    };

    const handleConfirm = async () => {
        if (!selectedCrisis) return;

        try {
            console.log('confirm crisis:', selectedCrisis.crisisid, urgencyLevel);
            await confirmCrisis(selectedCrisis.crisisid, urgencyLevel);
            console.log('confirmed crisis:', selectedCrisis.crisisid, urgencyLevel);
            setConfirmModalVisible(false);
            setUpdate(!update);
        } catch (error) {
            message.error('操作失败：' + error.message);
            console.log('confirm crisis error:', error.message);
        }
    };

    const handleDelete = async (crisisId) => {
        try {
            await deleteCrisis(crisisId);
            message.success('已删除危机预警');
            setUpdate(!update);
        } catch (error) {
            message.error('操作失败：' + error.message);
        }
    };

    const getUrgencyOptions = [
        { value: 'all', label: '全部等级' },
        { value: 2, label: '高危' },
        { value: 1, label: '中危' },
        { value: 0, label: '低危' }
    ];

    const filterData = (data) => {
        return data.filter(item => {
            const matchesSearch = item.userid.toLowerCase().includes(searchText.toLowerCase()) ||
                item.content.toLowerCase().includes(searchText.toLowerCase());

            const matchesUrgency = urgencyFilter === 'all' || item.urgencyLevel === urgencyFilter;

            return matchesSearch && matchesUrgency;
        });
    };

    const getUrgencyTag = (level) => {
        console.log(level);
        const levels = {
            2: { color: '#ff4d4f', text: '高危' },
            1: { color: '#faad14', text: '中危' },
            0: { color: '#52c41a', text: '低危' }
        };
        const info = levels[level];
        return <Tag color={info.color} style={{ fontWeight: 'bold' }}>{info.text}</Tag>;
    };

    const getActionMenu = (record, isConfirmed = false) => ({
        items: [
            {
                key: 'view-user',
                label: '查看用户详情',
                icon: <SearchOutlined />,
                onClick: () => navigate(`/admin/user/${record.userid}`)
            },
            ...(!isConfirmed ? [
                {
                    key: 'confirm',
                    label: '确认预警',
                    icon: <CheckCircleOutlined />,
                    onClick: () => showConfirmModal(record)
                },
                {
                    key: 'cancel',
                    label: '撤销预警',
                    icon: <ExclamationCircleOutlined />,
                    onClick: () => handleDelete(record.crisisid)
                }
            ] : [])
        ]
    });

    const columns = [
        {
            title: '用户ID',
            dataIndex: 'userid',
            key: 'userid',
            render: (userid) => (
                <Button type="link" onClick={() => navigate(`/admin/user/${userid}`)} className="user-link">
                    <Text strong>{userid}</Text>
                </Button>
            )
        },
        {
            title: '高危内容',
            dataIndex: 'content',
            key: 'content',
            ellipsis: true,
            render: (text) => <Text style={{ color: '#ff4d4f' }}>{text}</Text>
        },
        {
            title: '危机等级',
            dataIndex: 'urgencyLevel',
            key: 'urgencyLevel',

            sorter: (a, b) => {
                return a.urgencyLevel - b.urgencyLevel;
            },
            render: (level) => getUrgencyTag(level) // 默认显示高危
        },
        {
            title: '检测时间',
            dataIndex: 'timestamp',
            key: 'timestamp',
            render: (timestamp) => (
                <div className="timestamp-cell">
                    {moment(timestamp).format('YYYY/MM/DD')}
                    <Text type="secondary" className="time-text">
                        {moment(timestamp).format('HH:mm')}
                    </Text>
                </div>
            )
        },
        {
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 60,
            render: (_, record) => (
                <Dropdown
                    menu={getActionMenu(record)}
                    trigger={['click']}
                    placement="bottomRight"
                    overlayClassName="action-dropdown"
                >
                    <Button type="text" icon={<MoreOutlined className="action-icon" />} />
                </Dropdown>
            ),
        }
    ];

    const confirmedColumns = [
        {
            title: '用户ID',
            dataIndex: 'userid',
            key: 'userid',
            render: (userid) => (
                <Button type="link" onClick={() => navigate(`/admin/user/${userid}`)} className="user-link">
                    <Text strong>{userid}</Text>
                </Button>
            )
        },
        {
            title: '高危内容',
            dataIndex: 'content',
            key: 'content',
            ellipsis: true,
            render: (text) => <Text style={{ color: '#ff4d4f' }}>{text}</Text>
        },
        {
            title: '危机等级',
            dataIndex: 'urgencyLevel',
            key: 'urgencyLevel',
            sorter: (a, b) => {
                return a.urgencyLevel - b.urgencyLevel;
            },
            render: (level) => getUrgencyTag(level)

        },
        {
            title: '检测时间',
            dataIndex: 'timestamp',
            key: 'timestamp',
            render: (timestamp) => (
                <div className="timestamp-cell">
                    {moment(timestamp).format('YYYY/MM/DD')}
                    <Text type="secondary" className="time-text">
                        {moment(timestamp).format('HH:mm')}
                    </Text>
                </div>
            )
        },
        {
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 60,
            render: (_, record) => (
                <Dropdown
                    menu={getActionMenu(record, true)}
                    trigger={['click']}
                    placement="bottomRight"
                    overlayClassName="action-dropdown"
                >
                    <Button type="text" icon={<MoreOutlined className="action-icon" />} />
                </Dropdown>
            ),
        }
    ];

    return (
        <CustomLayout role={1} content={
            <div className="crisis-review-container">
                <Card className="header-card">
                    <div className="header-content">
                        <div className="title-section">
                            <div className="title-row">
                                <Title level={3} className="page-title">高危用户审核</Title>
                            </div>
                            <Text type="secondary" className="page-subtitle">监控和审查潜在风险用户行为</Text>
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: 16
                        }}>
                            <Space size="middle">
                                <Input
                                    placeholder="搜索用户ID或内容"
                                    prefix={<SearchOutlined />}
                                    onChange={e => setSearchText(e.target.value)}
                                    style={{ width: 200 }}
                                    allowClear
                                />
                                <Select
                                    defaultValue="all"
                                    style={{ width: 120 }}
                                    onChange={setUrgencyFilter}
                                    options={getUrgencyOptions}
                                />
                            </Space>
                        </div>
                    </div>
                </Card>

                <Card className="content-card">
                    <Tabs defaultActiveKey="1" type="card" className="crisis-tabs">
                        <TabPane tab={
                            <span className="tab-title">
                                <ExclamationCircleOutlined />
                                待审核预警
                                {auditingList.length > 0 && (
                                    <Tag color="red" className="count-tag">{auditingList.length}</Tag>
                                )}
                            </span>
                        } key="1">
                            <Table
                                columns={columns}
                                dataSource={filterData(auditingList)}
                                rowKey="crisisid"
                                loading={loading}
                                pagination={{
                                    showSizeChanger: true,
                                    showQuickJumper: true,
                                    showTotal: total => `共 ${total} 条记录`,
                                    pageSizeOptions: ['10', '20', '50'],
                                    className: 'crisis-pagination'
                                }}
                                className="crisis-table"
                                rowClassName={(record, index) => index % 2 === 0 ? 'even-row' : 'odd-row'}
                            />
                        </TabPane>
                        <TabPane tab={
                            <span className="tab-title">
                                <CheckCircleOutlined />
                                已确认预警
                                {confirmedList.length > 0 && (
                                    <Tag color="blue" className="count-tag">{confirmedList.length}</Tag>
                                )}
                            </span>
                        } key="2">
                            <Table
                                columns={confirmedColumns}
                                dataSource={filterData(confirmedList)}
                                rowKey="crisisid"
                                loading={loading}
                                pagination={{
                                    showSizeChanger: true,
                                    showQuickJumper: true,
                                    showTotal: total => `共 ${total} 条记录`,
                                    pageSizeOptions: ['10', '20', '50'],
                                    className: 'crisis-pagination'
                                }}
                                className="crisis-table"
                                rowClassName={(record, index) => index % 2 === 0 ? 'even-row' : 'odd-row'}
                            />
                        </TabPane>
                    </Tabs>
                </Card>

                <Modal
                    title="确认危机预警"
                    visible={confirmModalVisible}
                    onOk={handleConfirm}
                    onCancel={() => setConfirmModalVisible(false)}
                    okText="确认"
                    cancelText="取消"
                    okButtonProps={{ danger: true }}
                    className="confirm-modal"
                >
                    <div className="modal-content">
                        <div className="warning-banner">
                            <ExclamationCircleOutlined className="warning-icon" />
                            <span>确定将此用户标记为危机用户吗？</span>
                        </div>

                        <div className="user-info">
                            <Text strong>用户ID：</Text>
                            <Text>{selectedCrisis?.userid}</Text>
                        </div>

                        <div className="content-info">
                            <Text strong>高危内容：</Text>
                            <Text className="danger-content">{selectedCrisis?.content}</Text>
                        </div>

                        <div className="priority-selector">
                            <Text strong>预警优先级：</Text>
                            <Select
                                value={urgencyLevel}
                                onChange={setUrgencyLevel}
                                className="priority-select"
                            >
                                <Option value={2}>
                                    <Tag color="#ff4d4f">高危</Tag>
                                </Option>
                                <Option value={1}>
                                    <Tag color="#faad14">中危</Tag>
                                </Option>
                                <Option value={0}>
                                    <Tag color="#52c41a">低危</Tag>
                                </Option>
                            </Select>
                        </div>
                    </div>
                </Modal>
            </div>
        } />
    );
};

export default CrisisReviewPage;
