// src/App.jsx  (or wherever your <AppRoutes> lives)
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Navbar         from "./Components/Layout/Navbar";
import TaskList       from "./Features/TaskList";
import TaskForm       from "./Features/TaskForm";
import EditTask       from "./Features/EditTasks";
import AdminDashboard from "./Features/AdminDashboard";

import { AuthProvider, useAuth } from "./Components/Layout/AuthContext";
import LoginForm     from "./Components/Layout/LoginForm";
import RegisterForm  from "./Components/Layout/RegisterForm";

function AppRoutes() {
  const { user } = useAuth();

  // 1) If there is no user, only show login/register
  if (!user) {
    return (
      <Routes>
        <Route path="/login"    element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        {/* everything else -> login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // 2) Once we have a user, show the navbar + app routes
  return (
    <>
      <Navbar />

      <div className="container mt-4">
        <Routes>
          <Route path="/"        element={<TaskList />} />
          <Route path="/add"     element={<TaskForm />} />
          <Route path="/edit/:id" element={<EditTask />} />

          {/* 3) Only admins get the dashboard; non-admins hitting /admin get bounced */}
          <Route
            path="/admin"
            element={
              user.isAdmin
                ? <AdminDashboard />
                : <Navigate to="/" replace />
            }
          />

          {/* fallback for any other path */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
