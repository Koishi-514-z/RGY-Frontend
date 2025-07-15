import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, message, Typography, Tag, Space, Card, Input, Tooltip, Modal, Form, Select } from 'antd';
import { SearchOutlined, UserOutlined, InfoCircleOutlined, NotificationOutlined, SoundOutlined } from '@ant-design/icons';
import { getAllUsers, updateUserPriority } from '../service/AdminService';
import { sendNotification } from '../service/NotificationService';
import { useNavigate, Outlet } from 'react-router-dom';
import CustomLayout from "../components/layout/customlayout";
import moment from 'moment';

const { Title } = Typography;
const { TextArea } = Input;

const PRIORITIES = [
  { value: 'low', label: '低' },
  { value: 'medium', label: '中' },
  { value: 'high', label: '高' }
];

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();
  const [update, setUpdate] = useState(false);
  const [isAnnouncementModalVisible, setIsAnnouncementModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const userList = await getAllUsers();
        setUsers(userList.filter(u => u.role !== 1 && u.role !== 2));
      } catch (error) {
        message.error('无法加载用户列表: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, [update]);

  const handleToggleBan = async (userid, currentDisabled) => {
    const newDisabled = currentDisabled === 0 ? 1 : 0;
    const actionText = newDisabled === 1 ? '封禁' : '解禁';

    try {
      await updateUserPriority(userid, newDisabled);
      setUpdate(!update);
      console.log(`用户 ${userid} 已${actionText}`);
      message.success(`用户 ${userid} 已${actionText}`);
    } catch (error) {
      message.error(`操作失败: ${error.message}`);
    }
  };

  const handleSendAnnouncement = async (values) => {
    try {
      await sendNotification({
        users: users.map(user => user.userid), // 发送给所有用户
        type: 1000, // 公告类型
        priority: values.priority,
        title: values.title,
        content: values.content
      });
      message.success('公告发布成功');
      setIsAnnouncementModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('发布失败: ' + error.message);
    }
  };

  const filteredUsers = users.filter(user =>
    user.userid.toLowerCase().includes(searchText.toLowerCase()) ||
    user.username.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: '用户ID',
      dataIndex: 'userid',
      key: 'userid',
      width: 150,
      render: (text) => (
        <Tag color="blue" style={{ cursor: 'pointer' }} onClick={() => navigate(`/admin/user/${text}`)}>
          {text}
        </Tag>
      )
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      width: 150,
      render: (text) => (
        <span style={{ color: '#1890ff', cursor: 'pointer' }} >
          {text}
        </span>
      )
    },
    {
      title: '注册时间',
      dataIndex: 'jointime',
      key: 'jointime',
      width: 180,
      render: (jointime) => moment(jointime).format('YYYY-MM-DD HH:mm:ss'),
      sorter: (a, b) => moment(a.registerTime).unix() - moment(b.registerTime).unix()
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 200,
      render: (text) => (
        <Tooltip title={text}>
          <div style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {text}
          </div>
        </Tooltip>
      )
    },
    {
      title: '状态',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (priority) => (
        priority === 0
          ? <Tag color="red">已封禁</Tag>
          : <Tag color="green">正常</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            onClick={() => navigate(`/admin/user/${record.userid}`)}
          >
            查看详情
          </Button>
          <Button
            type={record.disabled === 0 ? "primary" : "default"}
            danger={record.disabled === 0}
            onClick={() => handleToggleBan(record.userid, record.disabled)}
          >
            {record.disabled === 0 ? '封禁' : '解禁'}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <CustomLayout role={1} content={
      <div style={{ padding: '24px' }}>
        <Card>
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={2}>
                用户管理
                <Tooltip title="管理系统用户，可进行查看详情、封禁等操作">
                  <InfoCircleOutlined style={{ fontSize: 16, marginLeft: 8, color: '#1890ff' }} />
                </Tooltip>
              </Title>
              <Space>
                <Button
                  type="primary"
                  icon={<SoundOutlined />}
                  onClick={() => setIsAnnouncementModalVisible(true)}
                >
                  发布公告
                </Button>
                <Button
                  type="primary"
                  icon={<NotificationOutlined />}
                  onClick={() => navigate('/admin/notification')}
                >
                  发送通知
                </Button>
              </Space>
            </div>

            <div style={{ marginTop: 16, marginBottom: 16 }}>
              <Input
                placeholder="搜索用户ID/用户名"
                prefix={<SearchOutlined />}
                onChange={e => setSearchText(e.target.value)}
                style={{ width: 300 }}
                allowClear
              />
            </div>
          </div>

          <Table
            columns={columns}
            dataSource={filteredUsers}
            rowKey="userid"
            loading={loading}
            scroll={{ x: 1000 }}
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: total => `共 ${total} 条记录`,
              pageSizeOptions: ['10', '20', '50'],
              defaultPageSize: 10
            }}
          />

          <Modal
            title="发布公告"
            open={isAnnouncementModalVisible}
            onCancel={() => setIsAnnouncementModalVisible(false)}
            footer={null}
            width={600}
          >
            <Form
              form={form}
              onFinish={handleSendAnnouncement}
              layout="vertical"
            >
              <Form.Item
                name="priority"
                label="优先级"
                rules={[{ required: true, message: '请选择优先级' }]}
              >
                <Select options={PRIORITIES} />
              </Form.Item>

              <Form.Item
                name="title"
                label="公告标题"
                rules={[{ required: true, message: '请输入标题' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="content"
                label="公告内容"
                rules={[{ required: true, message: '请输入内容' }]}
              >
                <TextArea rows={4} />
              </Form.Item>

              <Form.Item>
                <Space style={{ float: 'right' }}>
                  <Button onClick={() => setIsAnnouncementModalVisible(false)}>
                    取消
                  </Button>
                  <Button type="primary" htmlType="submit">
                    发布
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Modal>
        </Card>
      </div>
    } />
  );
};

export default AdminPage;