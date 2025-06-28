import MoodStats from "../components/admin/mood_stats_board";
import {useEffect, useState} from "react";
import {getMonthlyData, getWeeklyData} from "../service/admin";
import CustomLayout from "../components/layout/customlayout";

export default function AdminStatisticPage() {
    // 示例数据
const weeklyData = {
    averageScore: 3.8,
    moodData: [
        { emotion: "喜悦", percent: 35 },
        { emotion: "沮丧", percent: 15 },
        { emotion: "焦虑", percent: 20 },
        { emotion: "迷茫", percent: 10 },
        { emotion: "中性", percent: 20 },
    ],
};

const monthlyData = {
    averageScore: 3.5,
    moodData: [
        { emotion: "喜悦", percent: 30 },
        { emotion: "沮丧", percent: 18 },
        { emotion: "焦虑", percent: 25 },
        { emotion: "迷茫", percent: 12 },
        { emotion: "中性", percent: 15 },
    ],
};

    // const [weeklyData,setWeeklyData] = useState();
    // const [monthlyData,setMonthlyData] = useState();
    // useEffect(() => {
    //     const fetchData = async () => {
    //         let weeklyData = await getWeeklyData();
    //         setWeeklyData(weeklyData);
    //         let monthlyData = await getMonthlyData();
    //         setMonthlyData(monthlyData);
    //     };
    //
    //     fetchData();
    // }, []);

    return (
        <CustomLayout role={2} content={
            <MoodStats weeklyData={weeklyData} monthlyData={monthlyData}/>
        }/>
    );
}