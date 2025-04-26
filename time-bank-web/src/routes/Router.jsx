import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import TaskListPage from "../pages/TaskListPage";
import TaskDetailPage from "../pages/TaskDetailPage";
import CreateTaskPage from "../pages/CreateTaskPage";
import ProfilePage from "../pages/ProfilePage";
import NotFoundPage from "../pages/NotFoundPage";
import MainHubPage from "../pages/MainHubPage";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/tasks" element={<ProtectedRoute><TaskListPage /></ProtectedRoute>} /> {/* Task List Page */}
      <Route path="/tasks/new" element={<ProtectedRoute><CreateTaskPage /></ProtectedRoute>} />
      <Route path="/tasks/:id" element={<ProtectedRoute><TaskDetailPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/tasks-hub" element={<ProtectedRoute><MainHubPage /></ProtectedRoute>} /> {/* Main Hub for Tasks */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
