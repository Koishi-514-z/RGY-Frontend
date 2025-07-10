import { useState, useEffect } from "react";
import {
    Avatar, Button, Col, Divider, Input, Layout, Pagination, Row, Select, Space, Tag, Typography, Menu
} from "antd";
import {
    UserOutlined, ClockCircleOutlined, LikeOutlined,
    SearchOutlined, ProfileOutlined, PlusOutlined, FireOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useNavigate } from "react-router-dom";
import { getBlogs, getLatestBlogs } from "../service/community";
import CustomLayout from "../components/layout/customlayout";
import { Header } from "antd/es/layout/layout";
import ParticleBackground from "../components/layout/particlebackground";

dayjs.extend(relativeTime);
const { Option } = Select;
const { Title, Paragraph } = Typography;
const { Text } = Typography;
const { Footer } = Layout;
// 标签颜色映射
const tagColors = {
    '学习': '#3498db',
    '生活': '#2ecc71',
    '情感': '#e74c3c',
    '其他': '#f39c12'
};

// 博客卡片组件
const BlogCard = ({ blog, navigate }) => (
    <div style={{ position: 'relative', zIndex: 1 }} className="blog-card" onClick={() => navigate(`/blog/${blog.blogid}`)}>
        <div className="card-header">
            <div className="user-info">
                <Avatar
                    src={blog.user.avatar || `https://joesch.moe/api/v1/random?key=${blog.userid}`}
                    size={48}
                    icon={<UserOutlined />}
                    className="user-avatar"
                />
                <div>
                    <div className="username">{blog.user.username}</div>
                    <div className="post-time">
                        <ClockCircleOutlined className="time-icon" />
                        {dayjs.unix(blog.timestamp / 1000).toDate().toLocaleString()}
                    </div>
                </div>
            </div>
        </div>

        <div className="card-body">
            <Title level={4} className="blog-title">{blog.title}</Title>
            <Paragraph className="blog-content">
                {blog.content.slice(0, 30)}{blog.content.length > 30 ? "..." : ""}
            </Paragraph>
        </div>
        <Footer className={"card-footer"} >
            <div className="interaction-stats">
                <div className="stat-item">
                    <LikeOutlined className="stat-icon" />
                    <span>{blog.likeNum}赞</span>
                </div>
            </div>

            <div className="blog-tags">
                {blog.tags.map((tag, i) => (
                    <Tag
                        key={i}
                        className="tag"
                        style={{ backgroundColor: tagColors[tag] || '#9b59b6' }}
                    >
                        #{tag}
                    </Tag>
                ))}
            </div>
        </Footer>
    </div>
);

// 主页面组件
export default function CommunityPage() {
    const [searchText, setSearchText] = useState('');
    const [tags, setTags] = useState([]);
    const [sortOrder, setSortOrder] = useState('recommend');
    const [blogs, setBlogs] = useState([]);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);

    // 获取博客数据
    useEffect(() => {
        const fetchBlogs = async () => {
            let result;
            if (sortOrder === 'recommend') {
                result = await getBlogs(pageSize, currentPage, searchText, tags);
            } else {
                result = await getLatestBlogs(pageSize, currentPage, searchText, tags);
            }
            setBlogs(result.blogs);
            setTotal(result.total);
        };
        fetchBlogs();
    }, [pageSize, currentPage, searchText, tags, sortOrder]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchText, tags, sortOrder]);

    // 处理菜单点击
    const handleMenuClick = (e) => {
        setSortOrder(e.key);
    };

    return (
        <CustomLayout role={0} content={
            <div className="community-page">
                <ParticleBackground />
                <Header style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'linear-gradient(90deg, #fcfcfc 0%, #f0f9ff 100%)',
                    boxShadow: '0 2px 12px rgba(24,144,255,0.08)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                    height: 'auto',
                    lineHeight: '1.5',
                    padding: '20px 32px'
                }}>
                    <Space size={16}>
                        <div style={{
                            background: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
                            padding: '8px',
                            borderRadius: '12px',
                            boxShadow: '0 2px 8px rgba(24,144,255,0.15)'
                        }}>
                            <ProfileOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                        </div>
                        <div>
                            <Title level={3} style={{ margin: 0, color: '#262626' }}>
                                校园树洞
                            </Title>
                        </div>
                    </Space>
                    {/* 搜索和标签过滤框 - 放入顶栏 */}
                    <div style={{ flex: 1, maxWidth: '600px', margin: '0 24px' }}>
                        <Row gutter={16}>
                            <Col span={14}>
                                <Input.Search
                                    placeholder="搜索帖子或用户"
                                    allowClear
                                    enterButton={<SearchOutlined />}
                                    size="large"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    style={{ width: '100%' }}
                                />
                            </Col>
                            <Col span={10}>
                                <Select
                                    placeholder="选择标签过滤"
                                    mode="multiple"
                                    style={{ width: '100%' }}
                                    size="large"
                                    value={tags}
                                    onChange={setTags}
                                >
                                    <Option value="学习">学习</Option>
                                    <Option value="生活">生活</Option>
                                    <Option value="情感">情感</Option>
                                    <Option value="其他">其他</Option>
                                </Select>
                            </Col>
                        </Row>
                    </div>

                    <div>
                        <Button
                            type="primary"
                            size="large"
                            onClick={() => navigate('/post')}
                            className="create-post-btn"
                            icon={<PlusOutlined />}
                        >
                            发布新帖
                        </Button>
                    </div>
                </Header>

                {/* 内容区域 */}
                <div className="content-container" style={{ padding: '0 32px', position: 'relative', zIndex: 1 }}>
                    <div className="blogs-section">
                        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <Title level={4} className="section-title">
                                所有帖子 <span className="post-count">{total}</span>
                            </Title>

                            <Menu className="sort-menu" mode="horizontal" selectedKeys={[sortOrder]} onClick={handleMenuClick} >
                                <Menu.Item key="recommend" icon={<FireOutlined />}>
                                    推荐排序
                                </Menu.Item>
                                <Menu.Item key="latest" icon={<ClockCircleOutlined />}>
                                    最新发布
                                </Menu.Item>
                            </Menu>
                        </div>

                        <div className="blogs-list">
                            {(
                                blogs.map(blog => (
                                    <BlogCard key={blog.blogid} blog={blog} navigate={navigate} />
                                ))
                            )}
                        </div>

                        <Pagination
                            current={currentPage}
                            pageSize={pageSize}
                            total={total}
                            onChange={(page, size) => {
                                setCurrentPage(page);
                                setPageSize(size);
                            }}
                            onShowSizeChange={(_, size) => setPageSize(size)}
                            className="pagination"
                            showSizeChanger
                            showQuickJumper
                        />
                    </div>

                    <div className="sidebar">
                        <div className="sidebar-card" style={{ position: 'relative', zIndex: 1 }}>
                            <Title level={5} className="sidebar-title">热门标签</Title>
                            <div className="popular-tags">
                                {Object.entries(tagColors).map(([tag, color]) => (
                                    <Tag
                                        key={tag}
                                        className="popular-tag"
                                        style={{ backgroundColor: color }}
                                    >
                                        #{tag}
                                    </Tag>
                                ))}
                            </div>
                        </div>

                        <div className="sidebar-card" style={{ position: 'relative', zIndex: 1 }}>
                            <Title level={5} className="sidebar-title" >社区指南</Title>
                            <ul className="community-guidelines">
                                <li>尊重他人观点，保持友好交流</li>
                                <li>禁止发布任何形式的广告</li>
                                <li>保护个人隐私，避免分享敏感信息</li>
                                <li>发现违规内容请及时举报</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <Divider className="footer-divider">
                    <span className="divider-text">已经到底啦 ~</span>
                </Divider>

                <style jsx global>{`
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f0f2f5;
          margin: 0;
          padding: 0;
        }

        .community-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 0 20px;
        }

        .page-header {
          background: linear-gradient(135deg, #3498db, #8e44ad);
          border-radius: 16px;
          padding: 30px 40px;
          margin-bottom: 24px;
          color: white;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }

        .page-title {
          color: white !important;
          margin-bottom: 8px !important;
          display: flex;
          align-items: center;
        }

        .title-icon {
          margin-right: 12px;
          font-size: 28px;
        }

        .page-subtitle {
          color: rgba(255, 255, 255, 0.85) !important;
          margin-bottom: 0 !important;
          font-size: 16px;
        }

        .create-post-btn {
          background: white;
          color: #3498db;
          border: none;
          height: 48px;
          padding: 0 24px;
          font-weight: 600;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .create-post-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
          background: #f8f9fa !important;
        }
        .sort-menu{
          .ant-modal-content {
            background-color: transparent !important;
          }
        }
        .content-container {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
          padding-top: 24px;
        }

        .blogs-section {
          flex: 1;
          min-width: 300px;
        }

        .sidebar {
          width: 320px;
        }

        .sidebar-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .sidebar-title {
          color: #2c3e50 !important;
          margin-bottom: 16px !important;
          border-bottom: 2px solid #f0f2f5;
          padding-bottom: 12px;
        }

        .popular-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .popular-tag {
          border-radius: 20px;
          padding: 4px 12px;
          color: white !important;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .popular-tag:hover {
          transform: translateY(-2px);
        }

        .community-guidelines {
          padding-left: 20px;
          margin: 0;
        }

        .community-guidelines li {
          margin-bottom: 10px;
          color: #555;
          line-height: 1.6;
        }

        .section-header {
          margin-bottom: 24px;
        }

        .section-title {
          display: flex;
          align-items: center;
        }

        .post-count {
          background: #3498db;
          color: white;
          border-radius: 12px;
          padding: 2px 12px;
          font-size: 14px;
          margin-left: 12px;
        }

        .blogs-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 24px;
          margin-bottom: 24px;
        }

        .blog-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .blog-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }

        .card-header {
          padding: 20px 20px 0;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-avatar {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .username {
          font-weight: 600;
          font-size: 16px;
          color: #2c3e50;
        }

        .post-time {
          font-size: 13px;
          color: #7f8c8d;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .time-icon {
          font-size: 12px;
        }

        .card-body {
          padding: 16px 20px;
        }

        .blog-title {
          color: #2c3e50 !important;
          margin-bottom: 12px !important;
        }

        .blog-content {
          color: #555 !important;
          margin-bottom: 0 !important;
          line-height: 1.7;
        }

        .card-footer {
          padding: 16px 20px;
          background: #f9fafb;
          border-top: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .interaction-stats {
          display: flex;
          gap: 20px;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #7f8c8d;
          font-size: 14px;
        }

        .stat-icon {
          font-size: 16px;
        }

        .blog-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .tag {
          border-radius: 20px;
          padding: 4px 12px;
          color: white !important;
          font-weight: 500;
          border: none;
        }

        .pagination {
          text-align: center;
          margin: 32px 0;
        }

        .footer-divider {
          border-top: 1px dashed #ddd !important;
          color: #95a5a6 !important;
          margin: 40px 0 !important;
        }

        .divider-text {
          padding: 0 20px;
          font-size: 14px;
        }

        /* 骨架屏样式 */
        .skeleton {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          padding: 20px;
        }

        .skeleton-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #f0f2f5;
          margin-bottom: 16px;
        }

        .skeleton-lines {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .skeleton-line {
          height: 16px;
          background: #f0f2f5;
          border-radius: 4px;
        }

        .skeleton-line.short {
          width: 40%;
        }

        .skeleton-line.medium {
          width: 70%;
        }

        .skeleton-line.long {
          width: 100%;
        }

        @media (max-width: 992px) {
          .ant-layout-header {
            flex-wrap: wrap;
            height: auto !important;
            padding: 16px !important;
          }

          .header-search-section {
            order: 3;
            width: 100%;
            margin-top: 16px;
          }
        }

        @media (max-width: 768px) {
          .content-container {
            flex-direction: column;
          }

          .sidebar {
            width: 100%;
          }

          .blogs-list {
            grid-template-columns: 1fr;
          }

          .section-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .section-header .ant-menu {
            margin-top: 12px;
            width: 100%;
          }

          .create-post-btn {
            margin-top: 16px;
            align-self: flex-end;
          }
        }
      `}</style>
            </div>
        } />
    );
}
