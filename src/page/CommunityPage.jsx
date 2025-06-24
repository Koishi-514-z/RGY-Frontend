import React, { useState, useEffect } from "react";
import { Button } from "antd";

import CustomLayout from "../components/layout/customlayout";
import {Col, Divider, message, Row} from "antd";
import Title from "antd/es/skeleton/Title";
import {getBlogs} from "../service/community";
import BlogCard from "../components/blogcard";
import { useNavigate } from "react-router-dom";

function BlogsSearch(props) {
    return null;
}

export default function CommunityPage() {
    const [searchText, setSearchText] = useState('');
    const [tags, setTags] = useState('all');
    const [blogs, setBlogs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlogs = async () => {
            const fetched_blogs = await getBlogs();
            console.log(fetched_blogs);
            setBlogs(fetched_blogs);
        };
        fetchBlogs();
    },[]);

    return (
        <CustomLayout content={
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <Title level={2}>欢迎来到校园树洞</Title>
                    <Button type="primary" onClick={() => navigate('/post')} style={{ fontSize: '16px' }}>
                        发帖
                    </Button>
                </div>
                <div style={{ marginBottom: '24px' }}>
                    <BlogsSearch
                        searchText={searchText}
                        tags={tags}
                        onSearchChange={e => setSearchText(e.target.value)}
                        onTagsChange={setTags}
                    />
                </div>
                <Title level={3}>所有帖子</Title>
                <Row gutter={[16, 16]}>
                    {blogs.map(blog => (
                        <Col span={6} key={blog.blogid}>
                            <BlogCard blog={blog} showCategory />
                        </Col>
                    ))}
                </Row>
                <Divider variant="dashed" style={{ borderColor: '#0055FF' }} dashed>
                    End
                </Divider>
            </div>
        }/>
    );
}