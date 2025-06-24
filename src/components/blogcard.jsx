import React, {useEffect, useState} from 'react';
import {Card, CardBody, CardTitle, CardText} from "antd"
import { useNavigate } from 'react-router-dom';
export default function BlogCard({blog}){
    const navigate = useNavigate();
    const [date, setDate] = useState(null);
    const handleClick = () => {
        navigate(`/blog/:${blog.blogid}`);
    }

    useEffect(() => {
        const date_get = new Date(blog.timestamp * 1000);
        setDate(date_get.toLocaleString());
    }, [blog]);
    return (
        <Card
            hoverable
            cover={<img alt={blog.title} src={blog.cover} style={{
                width: '100%',
                height: 380,
                objectFit: 'cover'
            }}/>}

            onClick={handleClick}
        >
            <Card.Meta
                title={blog.title}
                description={
                    <>
                        <div>洞主：{blog.userid}</div>
                        <div style={{ color: '#007bff' }}>标签：#<span style={{ color: '#007bff' }}>{blog.tag?.join(" #")}</span></div>
                        <div>发布时间:{date}</div>
                    </>
                }
            />
        </Card>
    );
}