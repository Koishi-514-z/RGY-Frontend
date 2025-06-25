import React, { useState, useEffect } from "react";
import { List } from 'antd';
import ContentCard from "./contentcard";

export default function MessageDisplay({session}) {
    return (
        <div>
            <List
                grid={{ gutter: 16, column: 1 }}
                dataSource={session ? session.messages : []}
                renderItem={message => (
                    <List.Item>
                        <ContentCard message={message} />
                    </List.Item>
                )}
            />
        </div>
    )
}