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

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace={true} />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/emotion" element={<EmotionPage />} />
                <Route path="/community" element={<CommunityPage />} />
                <Route path="/blog/:blogid" element={<BlogdetailPage />} />
                <Route path="/post" element={<PostPage />} />
                <Route path="/forbidden" element={<ForbiddenPage />} />
                <Route path="/*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    )
}