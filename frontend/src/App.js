/**
 * Root App — routing, providers, protected routes
 */
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

// Pages
import LandingPage  from "./pages/LandingPage";
import LoginPage    from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard    from "./pages/Dashboard";
import ChatPage     from "./pages/ChatPage";
import RoadmapPage  from "./pages/RoadmapPage";
import CoursesPage  from "./pages/CoursesPage";
import ProfilePage  from "./pages/ProfilePage";
import ProgressPage from "./pages/ProgressPage";

// Layout
import AppLayout from "./components/layout/AppLayout";

const Protected = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <FullPageLoader />;
  return user ? children : <Navigate to="/login" replace />;
};

const FullPageLoader = () => (
  <div className="h-screen w-screen flex items-center justify-center bg-white dark:bg-ibm-dark">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-ibm-blue border-t-transparent rounded-full animate-spin" />
      <p className="text-ibm-blue font-semibold">Loading LearnMate…</p>
    </div>
  </div>
);

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/"         element={<LandingPage />} />
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected — wrapped in sidebar layout */}
            <Route
              path="/app"
              element={
                <Protected>
                  <AppLayout />
                </Protected>
              }
            >
              <Route index              element={<Navigate to="/app/dashboard" replace />} />
              <Route path="dashboard"   element={<Dashboard />} />
              <Route path="chat"        element={<ChatPage />} />
              <Route path="roadmap"     element={<RoadmapPage />} />
              <Route path="courses"     element={<CoursesPage />} />
              <Route path="profile"     element={<ProfilePage />} />
              <Route path="progress"    element={<ProgressPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
