import React, { useState, useEffect } from "react";
import { Card, Typography } from "antd";
import { getQuote } from "../../service/pushcontent";

const { Text } = Typography;

export default function QuoteCard() {
    const [quote, setQuote] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            const fetched_quote = await getQuote();
            setQuote(fetched_quote);
        }
        fetch();
    }, []);
    
    return (
        <Card 
            style={{ 
                background: 'linear-gradient(135deg, #fff7e6 0%, #fff2e8 100%)',
                border: '1px solid #ffe7ba',
                borderRadius: '12px',
                marginBottom: '24px'
            }}
        >
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', marginBottom: '12px' }}>💭</div>
                <Text style={{ 
                    fontSize: '15px',
                    color: '#8c6e00',
                    fontStyle: 'italic',
                    lineHeight: 1.6,
                    display: 'block',
                    marginBottom: '8px'
                }}>
                    "{quote.text}"
                </Text>
                <Text style={{ 
                    fontSize: '12px',
                    color: '#d48806'
                }}>
                    —— {quote.author}
                </Text>
            </div>
        </Card>
    );
    
}