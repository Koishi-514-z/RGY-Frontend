import React, { useState, useEffect } from "react";
import { getEmotion, getDiary } from "../service/emotion";
import Loading from "../components/loading";
import EmotionPush from "../components/emotion/emotionpush";
import EmotionScoring from "../components/emotion/emotionscoring";
import EmotionDiary from "../components/emotion/emotiondiary";
import CustomLayout from "../components/layout/customlayout";
import EmotionLayout from "../components/layout/emotionlayout";
import { getDataNum, getUrlDatasByTag } from "../service/pushcontent";
import QuoteCard from "../components/emotion/quotecard";
import EmotionTips from "../components/emotion/emotiontips";

export default function EmotionPage() {
    const [emotion, setEmotion] = useState(null);
    const [diary, setDiary] = useState(null);
    const [urlDatas, setUrlDatas] = useState([]);
    const [loadedPage, setLoadedPage] = useState([]);
    const [pageIndex, setPageIndex] = useState(0);
    const pageSize = 8;

    const reloadPage = async (tagid) => {
        setLoadedPage([0]);
        setPageIndex(0);
        const datas = [];
        const num = await getDataNum(tagid);
        for(let i = 0; i < num; ++i) {
            datas.push({});
        }
        const page = await getUrlDatasByTag(tagid, 0, pageSize);
        for(let i = 0; i < Math.min(pageSize, page.length); ++i) {
            datas[i] = page[i];
        }
        setUrlDatas(datas);
    }

    const loadPage = async (tagid) => {
        if(loadedPage.includes(pageIndex)) {
            return;
        }
        const updatedPage = [...loadedPage];
        updatedPage.push(pageIndex);
        const updatedDatas = [...urlDatas];
        const page = await getUrlDatasByTag(tagid, pageIndex, pageSize);
        for(let i = 0; i < Math.min(pageSize, page.length); ++i) {
            updatedDatas[i + pageIndex * pageSize] = page[i];
        }
        setUrlDatas(updatedDatas);
        setLoadedPage(updatedPage);
    }

    useEffect(() => {
        const fetch = async () => {
            const fetched_emotion = await getEmotion();
            const fetched_diary = await getDiary();
            if(fetched_emotion.tag) {
                reloadPage(fetched_emotion.tag.id)
            }
            else {
                setUrlDatas([]);
            }
            setEmotion(fetched_emotion);
            setDiary(fetched_diary);
        }
        fetch();
    }, []);

    useEffect(() => {
        if(urlDatas.length === 0 || !emotion || !emotion.tag) {
            return;
        }
        loadPage(emotion.tag.id);
    }, [pageIndex]);

    if(!emotion || !diary) {
        return (
            <CustomLayout content={
                <Loading />
            }/>
        )
    }

    return (
        <CustomLayout content={
            <div style={{ position: 'relative', overflow: 'hidden' }}>
                <EmotionLayout 
                    scoring={<EmotionScoring emotion={emotion} setEmotion={setEmotion} />}
                    diary={<EmotionDiary diary={diary} setDiary={setDiary} />}
                    push={<EmotionPush score={emotion.score} urlDatas={urlDatas} pageIndex={pageIndex} setPageIndex={setPageIndex} pageSize={pageSize}/>}
                    quote={<QuoteCard />}
                    tips={<EmotionTips />}
                />
            </div>
        }/>
    );
}