import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getMonthData, getWeekData } from "../service/emotion";

export default function EmotionGragh() {
    const [weekData, setWeekData] = useState(null);
    const [monthData, setMonthData] = useState(null);
    
    useEffect(() => {
        const fetch = async () => {
            const fetched_week = await getWeekData();
            const fetched_month = await getMonthData();
            setWeekData(fetched_week);
            setMonthData(fetched_month);
        }
        fetch();
    }, []);

    return (
        <div>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weekData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="score" stroke="#1890ff" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="score" stroke="#1890ff" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}