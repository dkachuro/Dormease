import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../../../services/api";
import "../SignUp/SignUp.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [token] = useState(searchParams.get("token"));
  const [email] = useState(searchParams.get("email")); 

  const handleLoginRedirect = () => navigate("/login");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.newPassword) {
      newErrors.newPassword = ["Password is required"];
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = ["Password must be at least 8 characters"];
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = ["Passwords do not match"];
    }

    if (!token || !email) {
      newErrors.token = ["Invalid reset link"];
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await api.resetPassword({
        email,
        token,
        password: formData.newPassword, 
      });

      if (response.status === 200) {
        setSuccess(true);
        setTimeout(() => navigate("/login"), 3000);
      }
    } catch (err) {
      console.error("Reset error:", err.response?.data);
      if (err.response?.data) {
        setErrors(err.response.data);
      } else {
        setErrors({ general: "Something went wrong. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="main-container">
        <div className="signup-form-container">
          <div className="signup-card">
            <h1>Invalid Reset Link</h1>
            <p className="error-text">
              The password reset link is invalid or expired.
            </p>
            <button className="signup-button" onClick={handleLoginRedirect}>
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-container">
      <div className="signup-form-container">
        <div className="signup-card">
          <h1>Reset Password</h1>

          {success ? (
            <div className="success-message">
              Password reset successfully! Redirecting to login...
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label className="log-label">New Password*</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className={errors.newPassword ? "error-input" : ""}
                  placeholder="Enter new password"
                />
                {errors.newPassword && (
                  <p className="error-text">{errors.newPassword.join(", ")}</p>
                )}
              </div>

              <div className="form-group">
                <label className="log-label">Confirm New Password*</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? "error-input" : ""}
                  placeholder="Confirm new password"
                />
                {errors.confirmPassword && (
                  <p className="error-text">
                    {errors.confirmPassword.join(", ")}
                  </p>
                )}
              </div>

              {errors.token && (
                <p className="error-text">{errors.token.join(", ")}</p>
              )}

              {errors.general && <p className="error-text">{errors.general}</p>}

              <button
                type="submit"
                className="signup-button"
                disabled={loading}
              >
                {loading ? "Resetting password..." : "Reset Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
