import React, { useState, useEffect } from "react";
import { List, Avatar, Typography } from "antd";
import { Link, useNavigate } from 'react-router-dom';

const { Text } = Typography;

export default function PushList({urlDatas, inhome}) {
    const navigate = useNavigate();
    const maxItems = 2;
    let showMore = false;

    if(inhome) {
        showMore = (urlDatas.length > maxItems);
        urlDatas = urlDatas.slice(0, maxItems);
    }

    return (
        <div>
            <List
                itemLayout="horizontal"
                dataSource={urlDatas}
                split={true}
                
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
                                <a 
                                    href={data.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    style={{ 
                                        fontSize: '16px', 
                                        fontWeight: 500,
                                        color: '#1890ff'
                                    }}
                                > 
                                    {data.title} 
                                </a>
                            }
                            description={
                                <Text 
                                    style={{ color: '#595959' }}
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