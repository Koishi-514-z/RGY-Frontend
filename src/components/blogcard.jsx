import React from'react';
import {Card, CardBody, CardTitle, CardText} from "antd"
import { useNavigate } from 'react-router-dom';
export default function BlogCard({blog}){
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/blog/:${blog.id}');
    }
    return (
        <Card
            hoverable
            cover={<img alt={blog.title} src={blog.cover} style={{
                width: '100%',
                height: 400,
                objectFit: 'cover'
            }}/>}

            onClick={handleClick}
        >
            <Card.Meta
                title={blog.title}
                description={
                    <>
                        <div>作者：{blog.author}</div>
                        <div>发布时间：{blog.date}</div>
                    </>
                }
            />
        </Card>
    );
}