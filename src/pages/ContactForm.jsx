import React, { useState } from "react";
import "../App.css";

// 🔥 Function to refresh access token
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return null;

  try {
    const response = await fetch(`https://signup-backend-ten.vercel.app/api/v1/contact/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      return data.token;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

const ContactForm = () => {
  const [isSignUp, setIsSignUp] = useState(true); // normal toggle for signup/login
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [responseMsg, setResponseMsg] = useState("");
  const [adminLogin, setAdminLogin] = useState(false); // track admin login mode

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let url = isSignUp && !adminLogin
        ? `https://signup-backend-ten.vercel.app/api/v1/contact` // signup endpoint
        : `https://signup-backend-ten.vercel.app/api/v1/contact/login`; // login endpoint

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      setResponseMsg(data.message || "Success!");
      setFormData({ name: "", email: "", password: "" });

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("refreshToken", data.refreshToken);

        const decoded = JSON.parse(atob(data.token.split('.')[1]));
        if (decoded.role === "admin") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/home";
        }
      }

      setTimeout(() => setResponseMsg(""), 3000);
    } catch (error) {
      setResponseMsg("Server error: " + error.message);
      setTimeout(() => setResponseMsg(""), 3000);
    }
  };

  // Admin button click
  const handleAdminClick = () => {
    setIsSignUp(false); // force login view
    setAdminLogin(true); // hide signup toggle
  };

  return (
    <div className={`login-container ${isSignUp ? "sign-up-mode" : ""}`} style={{ position: "relative" }}>
      {/* Admin button top-right */}
      <button
        onClick={handleAdminClick}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          padding: "10px 15px",
          backgroundColor: "#4caf50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Admin
      </button>

      <div className="login-box">
        <h2 style={{ color: "white" }}>{isSignUp && !adminLogin ? "Sign Up" : "Login"}</h2>

        <form onSubmit={handleSubmit}>
          {isSignUp && !adminLogin && (
            <div className="input-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </div>
          )}

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="login-btn">
            {isSignUp && !adminLogin ? "Sign Up" : "Login"}
          </button>
        </form>

        {responseMsg && <p className="response-msg" style={{ color: "green" }}>{responseMsg}</p>}

        {/* Toggle text only if NOT admin login */}
        {!adminLogin && (
          <p
            className="toggle-text"
            onClick={() => setIsSignUp(!isSignUp)}
            style={{ cursor: "pointer" }}
          >
            {isSignUp
              ? "Already have an account? Login"
              : "Don't have an account? Sign Up"}
          </p>
        )}
      </div>
    </div>
  );
};

export default ContactForm;
