import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../Assets/styles/RegisterForm.css"; 

const RegisterForm = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    try {
      const response = await fetch("https://localhost:7086/api/Auth/Register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, roles: ["user"] }),
      });

      if (!response.ok) {
        const err = await response.text();
        setError(err || "Registration failed.");
        return;
      }

      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000); 
    } catch (err) {
      setError("Could not connect to the server.");
      console.error("Register error:", err);
    }
  };

  return (
    <div className="register-container">
      <div className="register-left">
        <div className="login-text">
          <h1>Create Your Space</h1>
          <p>Get started with organizing your life today.</p>
          {/* Shto imazhin këtu nëse do */}
          {/* <img src="/task-illustration.svg" alt="Illustration" /> */}
        </div>
      </div>
      <div className="register-right">
        <div className="register-card animate-pop">
          <h2>Register</h2>
          {error && <div className="error-msg">{error}</div>}
          {success && <div className="success-msg">Registration successful! Redirecting...</div>}
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
            <button type="submit">Register</button>
          </form>
          <p className="register-link">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
