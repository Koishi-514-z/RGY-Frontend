import React from "react";
import { List, Avatar, Typography, Tag, Space } from "antd";
import { Link } from "react-router-dom";
import { FileTextOutlined, CustomerServiceOutlined, TagOutlined } from "@ant-design/icons";

const { Text } = Typography;

export default function PushList({urlDatas, inhome, pageIndex, setPageIndex, pageSize}) {
    const showMore = inhome && urlDatas.length > 3;
    const displayData = inhome ? urlDatas.slice(0, 3) : urlDatas;

    const handlePageChange = (page) => {
        setPageIndex(page - 1);
    };

    const pagination = {
        defaultcurrent: 1,
        current: pageIndex + 1,
        pageSize: pageSize,
        total: displayData.length,
        showSizeChanger: false,
        showQuickJumper: true,
        style: { marginTop: 16, textAlign: 'center' },
        onChange: handlePageChange
    };

    const getTypeConfig = (type) => {
        switch(type) {
            case 'article':
                return {
                    icon: <FileTextOutlined />,
                    color: '#1890ff',
                    text: '心理文章'
                };
            case 'music':
                return {
                    icon: <CustomerServiceOutlined />,
                    color: '#52c41a',
                    text: '治愈音乐'
                };
            default:
                return {
                    icon: <FileTextOutlined />,
                    color: '#1890ff',
                    text: '推荐内容'
                };
        }
    };

    const getTagColor = (index) => {
        const colors = [
            '#1890ff', '#52c41a', '#faad14', '#eb2f96', 
            '#13c2c2', '#fa8c16', '#f5222d', '#722ed1'
        ];
        return colors[index % colors.length];
    };

    return (
        <div>
            <List
                itemLayout="horizontal"
                dataSource={displayData}
                split={true}
                pagination={inhome ? false : pagination}
                style={{ 
                    borderRadius: '8px',
                    padding: '8px',
                    marginTop: '12px'
                }}
                footer={
                    showMore ? (
                        <div style={{ textAlign: 'center', padding: '16px' }}>
                            <Link 
                                to="/emotion" 
                                style={{ 
                                    fontWeight: 500,
                                    color: '#1890ff',
                                    textDecoration: 'none',
                                    fontSize: '14px'
                                }}
                            > 
                                查看更多推荐内容 →
                            </Link>
                        </div>
                    ) : null
                }
                renderItem={(data) => {
                    const typeConfig = getTypeConfig(data.type);
                    
                    return (
                        <List.Item
                            style={{
                                transition: 'all 0.3s',
                                padding: '16px 12px',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                border: '1px solid transparent',
                                marginBottom: '8px'
                            }}
                            className="recommendation-item"
                        >
                            <List.Item.Meta
                                avatar={
                                    <div style={{ position: 'relative' }}>
                                        <Avatar 
                                            src={data.img} 
                                            size={64}
                                            style={{ 
                                                boxShadow: '0 4px 12px rgba(24, 144, 255, 0.15)',
                                                border: '2px solid #fff'
                                            }}
                                        />
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '-4px',
                                            right: '-4px',
                                            width: '24px',
                                            height: '24px',
                                            background: typeConfig.color,
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            border: '2px solid #fff',
                                            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                                        }}>
                                            <span style={{ 
                                                color: '#fff', 
                                                fontSize: '10px',
                                                lineHeight: 1
                                            }}>
                                                {typeConfig.icon}
                                            </span>
                                        </div>
                                    </div>
                                }
                                title={
                                    <div>
                                        <div style={{ marginBottom: '8px' }}>
                                            <a 
                                                href={data.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                style={{ 
                                                    fontSize: '16px', 
                                                    fontWeight: 600,
                                                    color: '#262626',
                                                    textDecoration: 'none',
                                                    lineHeight: '1.4'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.color = '#1890ff';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.color = '#262626';
                                                }}
                                            > 
                                                {data.title}
                                            </a>
                                        </div>

                                        {data.tags.length > 0 && (
                                            <div style={{ marginBottom: '4px' }}>
                                                <Space size={4} wrap>
                                                    <TagOutlined style={{ 
                                                        fontSize: '12px', 
                                                        color: '#8c8c8c',
                                                        marginRight: '4px'
                                                    }} />
                                                    {data.tags.slice(0, 3).map((tag) => (
                                                        <Tag 
                                                            key={tag.id}
                                                            style={{
                                                                background: `${getTagColor(tag.id)}15`,
                                                                border: `1px solid ${getTagColor(tag.id)}30`,
                                                                borderRadius: '8px',
                                                                color: getTagColor(tag.id),
                                                                fontSize: '11px',
                                                                padding: '2px 6px',
                                                                fontWeight: '500',
                                                                margin: '2px'
                                                            }}
                                                        >
                                                            {tag.content}
                                                        </Tag>
                                                    ))}
                                                    {data.tags.length > 3 && (
                                                        <Tag 
                                                            style={{
                                                                background: 'rgba(140, 140, 140, 0.1)',
                                                                border: '1px solid rgba(140, 140, 140, 0.2)',
                                                                borderRadius: '8px',
                                                                color: '#8c8c8c',
                                                                fontSize: '11px',
                                                                padding: '2px 6px',
                                                                margin: '2px'
                                                            }}
                                                        >
                                                            +{data.tags.length - 3}
                                                        </Tag>
                                                    )}
                                                </Space>
                                            </div>
                                        )}
                                    </div>
                                }
                                description={
                                    <Text 
                                        style={{ 
                                            color: '#595959', 
                                            fontSize: '14px',
                                            lineHeight: '1.6',
                                            display: 'block',
                                            marginTop: '8px'
                                        }}
                                        ellipsis={{ rows: 2 }}
                                    >
                                        {data.description}
                                    </Text>
                                }
                            />
                        </List.Item>
                    );
                }}
            />
            <style jsx>{`
                .recommendation-item:hover {
                    background: linear-gradient(135deg, rgba(24, 144, 255, 0.03) 0%, rgba(24, 144, 255, 0.08) 100%);
                    border-color: rgba(24, 144, 255, 0.2) !important;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(24, 144, 255, 0.12);
                }
                
                .recommendation-item {
                    transition: all 0.3s ease;
                }
                
                .recommendation-item:hover .ant-avatar {
                    transform: scale(1.05);
                    box-shadow: 0 6px 16px rgba(24, 144, 255, 0.25) !important;
                }
            `}</style>
        </div>
    );
}