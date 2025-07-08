import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, message, Typography, Tag, Popconfirm, Space } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { getAllUsers, updateUserPriority } from '../service/AdminService';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import CustomLayout from "../components/layout/customlayout";

const { Title } = Typography;

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const userList = await getAllUsers();
      setUsers(userList.filter(u => u.username !== 'Auth'));
    } catch (error) {
      message.error('无法加载用户列表: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleBan = async (userid, currentPriority) => {
    const newPriority = currentPriority === 1 ? 0 : 1;
    const actionText = newPriority === 0 ? '封禁' : '解禁';

    try {
      await updateUserPriority(userid, newPriority);
      message.success(`用户 ${userid} 已${actionText}`);
      fetchUsers(); // 重新加载用户列表以更新状态
    } catch (error) {
      message.error(`操作失败: ${error.message}`);
    }
  };

  const columns = [
    { title: '用户名', dataIndex: 'userid', key: 'userid' },
    {
      title: '状态',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => (
        priority === 0 
          ? <Tag color="red">已封禁</Tag> 
          : <Tag color="green">正常</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Popconfirm
          title={`确定要${record.priority === 1 ? '封禁' : '解禁'}该用户吗？`}
          onConfirm={() => handleToggleBan(record.username, record.priority)}
          okText="确定"
          cancelText="取消"
        >
          <Button type="primary" danger={record.priority === 1}>
            {record.priority === 1 ? '封禁' : '解禁'}
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <CustomLayout role={1} content={
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <Title level={2}>用户管理</Title>
            <Space>
              <Button type="primary" onClick={() => navigate('/admin/review')}>
                内容审核
              </Button>
              <Button type="primary" danger onClick={() => navigate('/admin/crisis')}>
                危机审核
              </Button>
            </Space>
          </div>

          <Outlet />
          <Table
              columns={columns}
              dataSource={users}
              rowKey="username"
              loading={loading}
              pagination={false}
          />
        </div>
      } />
    </div>
  );
};

export default AdminPage;