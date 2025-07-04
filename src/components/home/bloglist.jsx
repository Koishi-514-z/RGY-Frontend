import React from "react";
import { List, Avatar, Typography, Empty } from "antd";
import { Link, useNavigate } from 'react-router-dom';

const { Text } = Typography;

export default function BlogList({ blogs, emptyText, emptyDescription, emptyButton }) {
    const navigate = useNavigate();

    const customEmpty = (
        <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Text strong style={{ fontSize: '16px', marginBottom: '8px' }}>
                        {emptyText}
                    </Text>
                    <Text type="secondary" style={{ fontSize: '14px', textAlign: 'center', maxWidth: '300px' }}>
                        {emptyDescription}
                    </Text>
                    {emptyButton && (
                        <div style={{ marginTop: '16px' }}>
                            {emptyButton}
                        </div>
                    )}
                </div>
            }
            style={{ margin: '40px 0' }}
        />
    );

    return (
        <div>
            <List
                itemLayout="horizontal"
                dataSource={blogs}
                split={true}
                locale={{ emptyText: customEmpty }}
                style={{ 
                    borderRadius: '8px',
                    padding: '8px',
                    marginTop: '12px'
                }}
                renderItem={blog => (
                    <List.Item
                        style={{
                            transition: 'all 0.3s',
                            padding: '12px 8px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                        }}
                        className="recommendation-item"
                    >
                        <List.Item.Meta
                            avatar={
                                <Avatar 
                                    src={blog.cover} 
                                    size={48}
                                    style={{ 
                                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                                    }}
                                />
                            }
                            title={
                                <Link to={`/blog/${blog.blogid}`} style={{ fontWeight: 500 }}> {blog.title} </Link>
                            }
                            description={
                                <Text 
                                    style={{ color: '#595959' }}
                                    ellipsis={{ rows: 2 }}
                                >
                                    {blog.content}
                                </Text>
                            }
                        />
                    </List.Item>
                )}
            />
            <style jsx>{`
                .recommendation-item:hover {
                    background-color: rgba(24, 144, 255, 0.05);
                }
            `}
            </style>
        </div>
    )
}