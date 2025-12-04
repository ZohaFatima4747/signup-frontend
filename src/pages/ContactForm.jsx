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
  const [isSignUp, setIsSignUp] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [responseMsg, setResponseMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (isSignUp) {
      // ✅ Signup to Bubble DB
      const bubbleResponse = await fetch(
        "https://mern-app.bubbleapps.io/version-test/api/1.1/obj/User",
        {
          method: "POST",
          headers: {
            "Authorization": "Bearer c0e5c9d0e302228d79df4a0e1b6c8114", 
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            role: formData.role
          }),
        }
      );

      const data = await bubbleResponse.json();

      if (bubbleResponse.ok) {
        setResponseMsg("Signup successful!");
        setFormData({ name: "", email: "", role: "" });
        setTimeout(() => setResponseMsg(""), 3000);

        // Redirect after signup
        window.location.href = "/home";
      } else {
        setResponseMsg(data.message || "Signup failed");
        setTimeout(() => setResponseMsg(""), 3000);
      }
    } else {
      // 🔹 Login (keep your existing backend login)
      let url = `https://signup-backend-ten.vercel.app/api/v1/contact/login`;

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

        const decoded = JSON.parse(atob(data.token.split(".")[1]));

        if (decoded.role === "admin") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/home";
        }
      }

      setTimeout(() => setResponseMsg(""), 3000);
    }
  } catch (error) {
    setResponseMsg("Server error: " + error.message);
    setTimeout(() => setResponseMsg(""), 3000);
  }
};


  return (
    <div className={`login-container ${isSignUp ? "sign-up-mode" : ""}`}>
      <div className="login-box">
        <h2 style={{ color: "white" }}>{isSignUp ? "Sign Up" : "Login"}</h2>

        <form onSubmit={handleSubmit}>
          {isSignUp && (
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
            {isSignUp ? "Sign Up" : "Login"}
          </button>
        </form>

        {responseMsg && <p className="response-msg" style={{color:"green"}}>{responseMsg}</p>}

        <p
          className="toggle-text"
          onClick={() => setIsSignUp(!isSignUp)}
          style={{ cursor: "pointer" }}
        >
          {isSignUp
            ? "Already have an account? Login"
            : "Don't have an account? Sign Up"}
        </p>
      </div>
    </div>
  );
};

export default ContactForm;
