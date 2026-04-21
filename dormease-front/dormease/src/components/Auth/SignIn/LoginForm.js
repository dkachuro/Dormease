import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance, endpoints } from "../../../services/api";
import { jwtDecode } from "jwt-decode";
import "./LoginForm.css";

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [resetEmail, setResetEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleBackClick = () => {
    navigate("/");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResetEmailChange = (e) => {
    setResetEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axiosInstance.post(
        "user/2fa/email/request/",
        formData
      );
console.log("➡️ RESPONSE:", response.data);

      if (response.data.access && response.data.refresh) {
          console.log("🎯 Доверенное устройство — переходим напрямую");

        localStorage.setItem("accessToken", response.data.access);
        localStorage.setItem("refreshToken", response.data.refresh);

        const decoded = jwtDecode(response.data.access);
          console.log("🎯 role:", decoded.role); 

        const role = decoded.role;

        switch (role) {
          case "admin":
            navigate("/admin/dashboard");
            break;
          case "aitusa":
            navigate("/aitusa/dashboard");
            break;
          default:
            navigate("/student");
        }
      } else {
          console.log("🛡 Требуется 2FA — редиректим на /2fa-verify");

        navigate("/2fa-verify", {
          state: { email: formData.email },
        });
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.detail ||
          "Invalid credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = () => {
    navigate("/signup");
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setShowResetForm(true);
  };

  const handleSendResetLink = async (e) => {
    try {
      await axiosInstance.post(endpoints.PASSWORD_RESET, { email: resetEmail });
      setResetSent(true);
    } catch (err) {
      console.error("Reset error:", err.response?.data);
      setError(err.response?.data?.email?.[0] || "Failed to send reset link");
    }

    try {
      // Replace with your actual password reset endpoint
      await axiosInstance.post(endpoints.PASSWORD_RESET, { email: resetEmail });
      setResetSent(true);
    } catch (err) {
      console.error("Reset error:", err.response?.data); // <-- добавь

      setError(err.response?.data?.detail || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setShowResetForm(false);
    setResetSent(false);
    setResetEmail("");
  };

  return (
    <div className="main-container">
      <button className="login-back-button" onClick={handleBackClick}>
        Back
      </button>

      <div className="centered-card">
        <div className="image-section">
          <div className="image-placeholder">
            <img
              src="/aitu.jpg"
              alt="University Campus"
              className="background-image"
            />
          </div>
        </div>

        <div className="form-section">
          <h1 className="welcome-text">Welcome back</h1>
          <h2 className="login-text">
            {showResetForm ? "Reset Password" : "Login your account"}
          </h2>

          {!showResetForm ? (
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="log-label" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="log-label" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {error && <p className="error-text">{error}</p>}

              <button type="submit" className="login-button" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          ) : (
            <form className="login-form" onSubmit={handleSendResetLink}>
              {resetSent ? (
                <div className="reset-success">
                  <p>Reset link has been sent to your email!</p>
                </div>
              ) : (
                <>
                  <div className="form-group">
                    <label className="log-label" htmlFor="reset-email">
                      Email
                    </label>
                    <input
                      type="email"
                      id="reset-email"
                      name="reset-email"
                      value={resetEmail}
                      onChange={handleResetEmailChange}
                      required
                      placeholder="Enter your email to receive reset link"
                    />
                  </div>

                  {error && <p className="error-text">{error}</p>}

                  <div className="reset-actions">
                    <button
                      type="submit"
                      className="login-button"
                      disabled={loading}
                    >
                      {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                    <div className="forgot-password-link">
                      <a
                        href="#"
                        className="forgot-password"
                        onClick={handleBackToLogin}
                      >
                        Back To Login
                      </a>
                    </div>
                  </div>
                </>
              )}
            </form>
          )}

          {!showResetForm && (
            <>
              <div className="forgot-password-link">
                <a
                  href="#"
                  className="forgot-password"
                  onClick={handleForgotPassword}
                >
                  Forgot Password
                </a>
              </div>

              <div className="footer-links">
                <p>
                  Do not have account yet?{" "}
                  <button className="text-button" onClick={handleCreateAccount}>
                    Create Account
                  </button>
                </p>
              </div>
            </>
          )}

          <div className="footer-text">
            <p>aitu@astanait.edu.kz</p>
            <p>Mangilik el, C1, Astana IT University</p>
            <p>+7 777 777 77 77</p>
            <p>© 2024 ATU Dormitory Management. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
