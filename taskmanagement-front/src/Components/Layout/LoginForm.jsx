import { useState } from "react";
import { useAuth } from "../Layout/AuthContext";
import { Link } from "react-router-dom";
import "../../Assets/styles/LoginForm.css";

const LoginForm = () => {
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://localhost:7086/api/Auth/Login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        setError("Login failed. Please check your credentials.");
        return;
      }

      const data = await response.json();
      login(data.jwtToken);
    } catch (err) {
      setError("Could not connect to the server. Please try again later.");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-text">
          <h1>Organize Everything</h1>
          <p>Plan, prioritize, and achieve your goals in one place.</p>
         
        </div>
      </div>
      <div className="login-right">
        <div className="login-card animate-pop">
          <h2>Login</h2>
          {error && <div className="error-msg">{error}</div>}
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <button type="submit">Login</button>
          </form>
          <p className="register-link">
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
