import React, { useState, useEffect } from "react";
import { getEmotion, getDiary } from "../service/emotion";
import Loading from "../components/loading";
import EmotionScoring from "../components/emotionscoring";
import EmotionDiary from "../components/emotiondiary";
import EmotionGragh from "../components/emotiongragh";
import CustomLayout from "../components/layout/customlayout";

export default function EmotionPage() {
    const [emotion, setEmotion] = useState(null);
    const [diary, setDiary] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            const fetched_emotion = await getEmotion();
            const fetched_diary = await getDiary();
            setEmotion(fetched_emotion);
            setDiary(fetched_diary);
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
            <div>
                <EmotionScoring emotion={emotion} setEmotion={setEmotion} />
                <EmotionDiary diary={diary} setDiary={setDiary} />
            </div>
        }/>
    );
}