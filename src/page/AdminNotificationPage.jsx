import React, { useState, useEffect } from 'react';
import { Table, Button, message, Typography, Space, Card, Input, Modal, Form, Select, Tooltip, Tag } from 'antd';
import { ArrowLeftOutlined, SearchOutlined } from '@ant-design/icons';
import { getAllUsers } from '../service/AdminService';
import { sendNotification } from '../service/NotificationService';
import { useNavigate } from 'react-router-dom';
import CustomLayout from "../components/layout/customlayout";

const { Title } = Typography;
const { TextArea } = Input;

const NOTIFICATION_TYPES = [
  { value: 0, label: '系统' },
  { value: 100, label: '安全' },
  { value: 200, label: '更新' },
  { value: 300, label: '消息' },
  { value: 400, label: '提醒' },
  { value: 500, label: '警告' },
  { value: 1000, label: '公告' }
];

const PRIORITIES = [
  { value: 'low', label: '低' },
  { value: 'medium', label: '中' },
  { value: 'high', label: '高' }
];

const ROLES = [
  { value: 'all', label: '全部用户' },
  { value: '0', label: '普通用户' },
  { value: '1', label: '管理员' },
  { value: '2', label: '心理咨询师' }
];

const AdminNotificationPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [roleFilter, setRoleFilter] = useState('all');
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const userList = await getAllUsers();
        setUsers(userList);
      } catch (error) {
        message.error('无法加载用户列表: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleSendNotification = async (values) => {
    if (selectedUsers.length === 0) {
      message.error('请至少选择一个用户');
      return;
    }

    try {
      await sendNotification({
        users: selectedUsers,
        type: values.type,
        priority: values.priority,
        title: values.title,
        content: values.content
      });
      message.success('通知发送成功');
      setIsModalVisible(false);
      form.resetFields();
      navigate(-1);
    } catch (error) {
      message.error('发送失败: ' + error.message);
    }
  };

  const getRoleTag = (role) => {
    const roleMap = {
      0: { color: 'default', text: '普通用户' },
      1: { color: 'blue', text: '管理员' },
      2: { color: 'green', text: '心理咨询师' }
    };
    const { color, text } = roleMap[role] || { color: 'default', text: '未知' };
    return <Tag color={color}>{text}</Tag>;
  };

  const columns = [
    {
      title: '用户ID',
      dataIndex: 'userid',
      key: 'userid',
      width: 150,
      render: (text) => (
        <Button type="link" onClick={() => navigate(`/admin/user/${text}`)}>
          {text}
        </Button>
      )
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      width: 150
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 220,
      render: (text) => (
        <Tooltip title={text}>
          <div style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {text}
          </div>
        </Tooltip>
      )
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      width: 120,
      render: (role) => getRoleTag(role)
    }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = (
      user.userid.toLowerCase().includes(searchText.toLowerCase()) ||
      user.username.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase())
    );
    
    const matchesRole = roleFilter === 'all' || user.role.toString() === roleFilter;
    
    return matchesSearch && matchesRole;
  });

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
            <Title level={3} style={{ margin: 0 }}>发送通知</Title>
          </Space>

          <div style={{ marginTop: 16, marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Space size="middle">
              <Input
                placeholder="搜索用户ID/用户名/邮箱"
                prefix={<SearchOutlined />}
                onChange={e => setSearchText(e.target.value)}
                style={{ width: 300 }}
                allowClear
              />
              <Select
                defaultValue="all"
                style={{ width: 140 }}
                onChange={setRoleFilter}
                options={ROLES}
              />
            </Space>
            <Button
              type="primary"
              onClick={() => setIsModalVisible(true)}
              disabled={selectedUsers.length === 0}
            >
              发送通知 ({selectedUsers.length})
            </Button>
          </div>

          <Table
            rowSelection={{
              onChange: (selectedRowKeys) => setSelectedUsers(selectedRowKeys),
              selections: [
                Table.SELECTION_ALL,
                Table.SELECTION_NONE,
              ]
            }}
            columns={columns}
            dataSource={filteredUsers}
            rowKey="userid"
            loading={loading}
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: total => `共 ${total} 条记录`,
              pageSizeOptions: ['10', '20', '50'],
              defaultPageSize: 10
            }}
            scroll={{ x: 800 }}
          />

          <Modal
            title="编辑通知"
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={null}
            width={600}
          >
            <Form
              form={form}
              onFinish={handleSendNotification}
              layout="vertical"
            >
              <Form.Item
                name="type"
                label="通知类型"
                rules={[{ required: true, message: '请选择通知类型' }]}
              >
                <Select options={NOTIFICATION_TYPES} />
              </Form.Item>

              <Form.Item
                name="priority"
                label="优先级"
                rules={[{ required: true, message: '请选择优先级' }]}
              >
                <Select options={PRIORITIES} />
              </Form.Item>

              <Form.Item
                name="title"
                label="标题"
                rules={[{ required: true, message: '请输入标题' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="content"
                label="内容"
                rules={[{ required: true, message: '请输入内容' }]}
              >
                <TextArea rows={4} />
              </Form.Item>

              <Form.Item>
                <Space style={{ float: 'right' }}>
                  <Button onClick={() => setIsModalVisible(false)}>
                    取消
                  </Button>
                  <Button type="primary" htmlType="submit">
                    发送
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

export default AdminNotificationPage;
