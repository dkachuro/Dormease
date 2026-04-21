import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosInstance, endpoints } from "../../../services/api";
import { jwtDecode } from "jwt-decode";
import "./LoginForm.css";

export default function TwoFAVerifyPage() {
  const navigate = useNavigate();
  
  const location = useLocation();
  const email = location.state?.email || "";
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axiosInstance.post(
        endpoints.USER_2FA_VERIFY, // это /2fa/email/verify/
        { email, code }
      );

      localStorage.setItem("accessToken", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);

      const decoded = jwtDecode(response.data.access);
      console.log("✅ ACCESS:", response.data.access);
    console.log("✅ ROLE:", decoded.role);

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
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Invalid or expired code"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="main-container">
      <button className="login-back-button" onClick={handleBackToLogin}>
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
          <h1 className="welcome-text">Two-Factor Authentication</h1>
          <h2 className="login-text">Enter the code sent to your email</h2>

          <form className="login-form" onSubmit={handleVerify}>
            <div className="form-group">
              <label className="log-label" htmlFor="code">
                6-digit Code
              </label>
              <input
                type="text"
                id="code"
                name="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>

            {error && <p className="error-text">{error}</p>}

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Verifying..." : "Verify Code"}
            </button>
          </form>

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
}
