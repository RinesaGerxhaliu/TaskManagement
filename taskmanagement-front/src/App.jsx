import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Navbar from "./Components/Layout/Navbar";
import TaskList from "./Features/TaskList";
import TaskForm from "./Features/TaskForm";
import EditTask from "./Features/EditTasks";
import AdminDashboard from "./Features/AdminDashboard";
import ManageCategories from "./Features/ManageCategories";
import ManageTags from "./Features/ManageTags";

import { AuthProvider, useAuth } from "./Components/Layout/AuthContext";
import LoginForm from "./Components/Layout/LoginForm";
import RegisterForm from "./Components/Layout/RegisterForm";

function AppRoutes() {
  const { user } = useAuth();  // KY DO TE FUNKSIONOJE vetem nese eshte brenda AuthProvider

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <>
      <Navbar />

      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<TaskList />} />
          <Route path="/add" element={<TaskForm />} />
          <Route path="/edit/:id" element={<EditTask />} />
          <Route
            path="/admin/*"
            element={
              user.isAdmin
                ? <AdminDashboard />
                : <Navigate to="/" replace />
            }
          >
            {/* When someone hits /admin → redirect to /admin/categories */}
            <Route
              index
              element={<Navigate to="categories" replace />}
            />

            {/* /admin/categories */}
            <Route
              path="categories"
              element={<ManageCategories />}
            />

            {/* /admin/tags */}
            <Route
              path="tags"
              element={<ManageTags />}
            />
          </Route>
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
