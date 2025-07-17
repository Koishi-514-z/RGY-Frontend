import React, { useState, useEffect } from "react";
import {Card, Table, Space, Input, Select, Typography, Tag, Button, Tooltip, message} from "antd";
import { SearchOutlined, InfoCircleOutlined, UserOutlined, LikeOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import CustomLayout from "../components/layout/customlayout";
import { getBlogs, getLatestBlogs } from "../service/community";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
const { Option } = Select;

const AdminCommunityPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [tags, setTags] = useState([]);
  const [sortOrder, setSortOrder] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const result = sortOrder === 'recommend' 
          ? await getBlogs(pageSize, currentPage, searchText, tags)
          : await getLatestBlogs(pageSize, currentPage, searchText, tags);
        setBlogs(result.blogs);
        setTotal(result.total);
      } catch (error) {
        message.error('加载博客失败: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [pageSize, currentPage, update, tags, sortOrder]);

  const renderEllipsisText = (text) => (
    <Tooltip title={text} placement="topLeft">
      <div style={{
        maxWidth: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }}>
        {text}
      </div>
    </Tooltip>
  );

  const columns = [
    {
      title: '发布时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 180,
      render: (timestamp) => dayjs.unix(timestamp / 1000).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '作者',
      dataIndex: ['user', 'userid'],
      key: 'username',
      width: 150,
      render: (text, record) => (
        <Tag color="blue" style={{ cursor: 'pointer' }}
          onClick={() => navigate(`/admin/user/${record.user.userid}`)}>
          {text}
        </Tag>
      )
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      render: renderEllipsisText
    },
    {
      title: '浏览量',
      dataIndex: 'browsenum',
      key: 'browsenum',
      width: 100,
      render: (num) => (
        <Space>
          {num}
        </Space>
      )
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: 200,
      render: (tags) => (
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {tags?.map(tag => (
            <Tag key={tag} color="blue">#{tag}</Tag>
          ))}
        </div>
      )
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Button type="link" onClick={() => navigate(`/admin/blog/${record.blogid}`)}>
          查看详情
        </Button>
      ),
    }
  ];

  return (
    <CustomLayout role={1} content={
      <div style={{ padding: '24px' }}>
        <Card>
          <div style={{ marginBottom: 24 }}>
            <Title level={2}>
              帖子管理
              <Tooltip title="管理所有用户发布的帖子">
                <InfoCircleOutlined style={{ fontSize: 16, marginLeft: 8, color: '#1890ff' }} />
              </Tooltip>
            </Title>

            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginTop: 24,
              marginBottom: 16 
            }}>
              <Space size="middle">
                <Input
                  placeholder="搜索标题/用户"
                  prefix={<SearchOutlined />}
                  onChange={e => setSearchText(e.target.value)}
                  onPressEnter={() => setUpdate(!update)}
                  style={{ width: 300 }}
                  allowClear
                />
                <Select
                  mode="multiple"
                  placeholder="选择标签"
                  style={{ width: 200 }}
                  onChange={setTags}
                  allowClear
                >
                  <Option value="学习">学习</Option>
                  <Option value="生活">生活</Option>
                  <Option value="情感">情感</Option>
                  <Option value="其他">其他</Option>
                </Select>
              </Space>
              
              <Select
                defaultValue="latest"
                style={{ width: 120 }}
                onChange={setSortOrder}
              >
                <Option value="latest">最新</Option>
                <Option value="recommend">最热</Option>
              </Select>
            </div>
          </div>

          <Table
            columns={columns}
            dataSource={blogs}
            rowKey="blogid"
            loading={loading}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: total => `共 ${total} 条记录`,
              onChange: (page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              },
              pageSizeOptions: ['10', '20', '50']
            }}
            scroll={{ x: 1200 }}
          />
        </Card>
      </div>
    } />
  );
};

export default AdminCommunityPage;

