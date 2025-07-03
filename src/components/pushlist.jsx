import React from "react";
import { List, Avatar, Typography, Tag, Space } from "antd";
import { Link } from "react-router-dom";

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
                    showMore ? <Link to="/emotion" style={{ fontWeight: 500 }}> 查看更多 </Link> : null
                }
                renderItem={data => (
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
                                    src={data.img} 
                                    size={48}
                                    style={{ 
                                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                                    }}
                                />
                            }
                            title={
                                <Space>
                                    <a 
                                        href={data.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        style={{ 
                                            fontSize: '16px', 
                                            fontWeight: 600,
                                            color: '#262626',
                                            textDecoration: 'none'
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
                                </Space>
                            }
                            description={
                                <Text 
                                    style={{ 
                                        color: '#595959', 
                                        fontSize: 14,
                                        lineHeight: '1.5'
                                    }}
                                    ellipsis={{ rows: 2 }}
                                >
                                    {data.description}
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