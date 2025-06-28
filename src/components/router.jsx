import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "../page/LoginPage";
import RegisterPage from "../page/RegisterPage";
import HomePage from "../page/HomePage";
import ForbiddenPage from "../page/ForbiddenPage";
import NotFoundPage from "../page/NotFoundPage";
import EmotionPage from "../page/EmotionPage";
import CommunityPage from "../page/CommunityPage";
import BlogdetailPage from "../page/BlogdetailPage";
import PostPage from "../page/PostPage";
import AdminStatisticPage from "../page/AdminStatisticPage";
import AdminConsultPage from "../page/AdminConsultPage";
import AIAssistantPage from "../page/AIAssistantPage";
import ChatPage from "../page/ChatPage";
import AdminPushPage from "../page/AdminPushPage";


export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace={true} />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/home/:userid" element={<HomePage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/chat/:sessionid" element={<ChatPage />} />
                <Route path="/emotion" element={<EmotionPage />} />
                <Route path="/community" element={<CommunityPage />} />
                <Route path="/blog/:blogid" element={<BlogdetailPage />} />
                <Route path="/post" element={<PostPage />} />
                <Route path="/admin/stats" element={<AdminStatisticPage />} />
                <Route path="/admin/consult" element={<AdminConsultPage />} />
                <Route path="/admin/push" element={<AdminPushPage />} />
                <Route path="/AIassistant" element={<AIAssistantPage />} />
                <Route path="/AIassistant/:sessionid" element={<AIAssistantPage />} />
                <Route path="/forbidden" element={<ForbiddenPage />} />
                <Route path="/*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    )
}