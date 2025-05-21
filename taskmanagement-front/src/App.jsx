import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Importet e komponentëve dhe hook-eve
import Navbar from "./Components/Layout/Navbar";
import TaskList from "./Features/TaskList";
import TaskForm from "./Features/TaskForm";
import EditTask from "./Features/EditTasks";
import { AuthProvider, useAuth } from "./Components/Layout/AuthContext";
import LoginForm from "./Components/Layout/LoginForm";
import RegisterForm from "./Components/Layout/RegisterForm";

const AppRoutes = () => {
  const { user } = useAuth();

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
          <Route path="/edit/:id" element={<EditTask />} />
          <Route path="/add" element={<TaskForm />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;


