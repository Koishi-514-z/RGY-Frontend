import React, { useState, useEffect } from 'react';
import {Table, Card, Typography, Tag, Space, Input, Modal, Button, Tooltip, message} from 'antd';
import { SearchOutlined, InfoCircleOutlined, EyeOutlined } from '@ant-design/icons';
import CustomLayout from "../components/layout/customlayout";
import { getAdminNotifications } from '../service/NotificationService';
import moment from 'moment';

const { Title, Text } = Typography;

const AdminNotificationHistoryPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const result = await getAdminNotifications();
      setNotifications(result);
    } catch (error) {
      message.error('加载通知历史失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationTypeInfo = (type) => {
    if (type < 100) return { color: '#1890ff', text: '系统' };
    if (type < 200) return { color: '#ff4d4f', text: '安全' };
    if (type < 300) return { color: '#52c41a', text: '更新' };
    if (type < 400) return { color: '#722ed1', text: '消息' };
    if (type < 500) return { color: '#13c2c2', text: '提醒' };
    if (type < 600) return { color: '#faad14', text: '警告' };
    return { color: '#fa8c16', text: '公告' };
  };

  const getPriorityTag = (priority) => {
    const colors = {
      high: 'red',
      medium: 'orange',
      low: 'green'
    };
    if (priority === 'high') return <Tag color={colors[priority]}>{"高"}</Tag>;
    if (priority ==='medium') return <Tag color={colors[priority]}>{"中"}</Tag>;
    if (priority === 'low') return <Tag color={colors[priority]}>{"低"}</Tag>;
    return <Tag color={colors[priority]}>{priority.toUpperCase()}</Tag>;
  };

  const showNotificationDetail = (record) => {
    setSelectedNotification(record);
    setDetailModalVisible(true);
  };

  const columns = [
    {
      title: '发送时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 180,
      render: (timestamp) => moment(timestamp).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type) => {
        const { color, text } = getNotificationTypeInfo(type);
        return <Tag color={color}>{text}</Tag>;
      }
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      render: (text) => (
        <Tooltip title={text} placement="topLeft">
          <div style={{ 
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {text.length > 20 ? text.slice(0, 20) + '...' : text}
          </div>
        </Tooltip>
      )
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: getPriorityTag
    },
    {
      title: '状态',
      key: 'status',
      width: 150,
      render: (_, record) => (
        <Space>
          <Tag color="blue">{record.unreadnum} 未读</Tag>
        </Space>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => showNotificationDetail(record)}
        >
          查看详情
        </Button>
      )
    }
  ];

  const filteredNotifications = notifications.filter(item =>
    item.title.toLowerCase().includes(searchText.toLowerCase()) ||
    item.content.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <CustomLayout role={1} content={
      <div style={{ padding: '24px' }}>
        <Card>
          <div style={{ marginBottom: 24 }}>
            <Title level={2}>
              我的通知
              <Tooltip title="查看已发送的所有通知">
                <InfoCircleOutlined style={{ fontSize: 16, marginLeft: 8, color: '#1890ff' }} />
              </Tooltip>
            </Title>

            <div style={{ marginTop: 16, marginBottom: 16 }}>
              <Input
                placeholder="搜索通知标题或内容"
                prefix={<SearchOutlined />}
                onChange={e => setSearchText(e.target.value)}
                style={{ width: 300 }}
                allowClear
              />
            </div>
          </div>

          <Table
            columns={columns}
            dataSource={filteredNotifications}
            rowKey="timestamp"
            loading={loading}
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: total => `共 ${total} 条记录`,
              pageSizeOptions: ['10', '20', '50']
            }}
            scroll={{ x: 1000 }}
          />

          <Modal
            title="通知详情"
            open={detailModalVisible}
            onCancel={() => setDetailModalVisible(false)}
            footer={null}
            width={600}
          >
            {selectedNotification && (
              <div>
                <div style={{ marginBottom: 16 }}>
                  <Space>
                    {getNotificationTypeInfo(selectedNotification.type).text}
                    {getPriorityTag(selectedNotification.priority)}
                  </Space>
                </div>
                
                <Title level={4}>{selectedNotification.title}</Title>
                
                <Text style={{ 
                  whiteSpace: 'pre-wrap',
                  fontSize: 14,
                  display: 'block',
                  marginBottom: 24
                }}>
                  {selectedNotification.content}
                </Text>

                <div style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderTop: '1px solid #f0f0f0',
                  paddingTop: 16
                }}>
                  <Text type="secondary">
                    发送时间: {moment(selectedNotification.timestamp).format('YYYY-MM-DD HH:mm:ss')}
                  </Text>
                  <Space>
                    <Tag color="blue">{selectedNotification.unreadnum} 未读</Tag>

                  </Space>
                </div>
              </div>
            )}
          </Modal>
        </Card>
      </div>
    } />
  );
};

export default AdminNotificationHistoryPage;
