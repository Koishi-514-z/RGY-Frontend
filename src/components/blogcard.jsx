import React, {useEffect, useState} from 'react';
import {Card, CardBody, CardTitle, CardText} from "antd"
import { useNavigate } from 'react-router-dom';
import { getAvatar } from "../service/community";

export default function BlogCard({blog}){
    const navigate = useNavigate();
    const [date, setDate] = useState(null);
    const [avatar, setAvatar] = useState("");
    
    const handleClick = () => {
        navigate(`/blog/${blog.blogid}`);
    }



    useEffect(() => {
        const date_get = new Date(blog.timestamp * 1000);
        setDate(date_get.toLocaleString());
    }, [blog]);

    useEffect(() => {
        const fetchAvatar = async () => {
            const fetched_avatar = await getAvatar(blog.userid);
            setAvatar(fetched_avatar);
        };
        fetchAvatar();
    }, [blog.userid]);

    return (
        <Card
            hoverable
            cover={<img alt={blog.title} src={blog.cover} style={{
                width: '100%',
                height: '400px',
                objectFit: 'cover',
                borderRadius: '8px'
            }}/>}

            onClick={handleClick}
        >
            <Card.Meta
                title={blog.title}
                description={
                    <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <img
                                src={avatar}
                                alt="avatar"
                                style={{ width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer' }}
                            />
                            <div>{blog.userid}</div>
                        </div>
                        <div style={{ color: '#007bff' }}>#<span style={{ color: '#007bff' }}>{blog.tag?.join(" #")}</span></div>
                        <div>编辑于{date}</div>
                    </>
                }
            />
        </Card>
    );
}