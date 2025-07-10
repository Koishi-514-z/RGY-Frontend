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
import PsyHomePage from "../page/PsyHomePage";
import PsyStatisticPage from "../page/PsyStatisticPage";
import PsyPushPage from "../page/PsyPushPage";
import AIAssistantPage from "../page/AIAssistantPage";
import ChatPage from "../page/ChatPage";
import AdminPage from "../page/AdminPage";
import AdminCommunityPage from "../page/AdminCommunityPage";
import AdminBlogdetailPage from "../page/AdminBlogdetailPage";
import AdminReviewPage from "../page/AdminReviewPage";
import CrisisReviewPage from "../page/CrisisReviewPage";
import AdminUserDetailPage from "../page/AdminUserDetailPage";
import CounselingPage from "../page/CounselingPage";
import CounselingDetailPage from "../page/CounselingDetailPage";
import AdminNotificationPage from "../page/AdminNotificationPage";

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
                <Route path="/counseling" element={<CounselingPage />} />
                <Route path="/psydetail/:psyid" element={<CounselingDetailPage />} />
                <Route path="/psy/home" element={<PsyHomePage />} />
                <Route path="/psy/stats" element={<PsyStatisticPage />} />
                <Route path="/psy/push" element={<PsyPushPage />} />
                <Route path="/AIassistant" element={<AIAssistantPage />} />
                <Route path="/admin/usermanagement" element={<AdminPage />} />
                <Route path="/admin/blogmanagement" element={<AdminCommunityPage />} />
                <Route path="/admin/review" element={<AdminReviewPage />} />
                <Route path="/admin/crisis" element={<CrisisReviewPage />} />
                <Route path="/admin/notification" element={<AdminNotificationPage />} />
                <Route path="/admin/blog/:blogid" element={<AdminBlogdetailPage />} />
                <Route path="/AIassistant/:sessionid" element={<AIAssistantPage />} />
                <Route path="/admin/user/:userid" element={<AdminUserDetailPage />}/>

                <Route path="/forbidden" element={<ForbiddenPage />} />
                <Route path="/*" element={<NotFoundPage />} />

            </Routes>
        </BrowserRouter>
    )
}