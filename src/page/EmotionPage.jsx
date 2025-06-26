import React, { useState, useEffect } from "react";
import { getEmotion, getDiary, getUrlDatas, getWeekData, getMonthData } from "../service/emotion";
import Loading from "../components/loading";
import EmotionScoring from "../components/emotionscoring";
import EmotionDiary from "../components/emotiondiary";
import EmotionGragh from "../components/emotiongragh";
import EmotionPush from "../components/emotionpush";
import CustomLayout from "../components/layout/customlayout";
import EmotionLayout from "../components/layout/emotionlayout";

export default function EmotionPage() {
    const [emotion, setEmotion] = useState(null);
    const [diary, setDiary] = useState(null);
    const [urlDatas, setUrlDatas] = useState([]);
    const [weekData, setWeekData] = useState([]);
    const [monthData, setMonthData] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            const fetched_emotion = await getEmotion();
            const fetched_diary = await getDiary();
            const fetched_urls = await getUrlDatas();
            const fetched_week = await getWeekData();
            const fetched_month = await getMonthData();
            setEmotion(fetched_emotion);
            setDiary(fetched_diary);
            setUrlDatas(fetched_urls);
            setWeekData(fetched_week);
            setMonthData(fetched_month);
        }
        fetch();
    }, []);

    if(!emotion || !diary) {
        return (
            <CustomLayout content={
                <Loading />
            }/>
        )
    }

    return (
        <CustomLayout content={
            <EmotionLayout 
                scoring={<EmotionScoring emotion={emotion} setEmotion={setEmotion} />}
                diary={<EmotionDiary diary={diary} setDiary={setDiary} />}
                graph={<EmotionGragh weekData={weekData} monthData={monthData} />}
                push={<EmotionPush score={emotion.score} urlDatas={urlDatas} />}
            />
        }/>
    );
}