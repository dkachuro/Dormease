import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance, endpoints } from "../../../services/api";
import "./SignUp.css";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    gender: "",
    course: "",
    group: "",
    receiveUpdates: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleBackClick = () => navigate("/");
  const handleLoginRedirect = () => navigate("/login");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) newErrors.email = ["Email is required"];
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = ["Invalid email format"];

    if (!formData.password) newErrors.password = ["Password is required"];
    else if (formData.password.length < 8)
      newErrors.password = ["Password must be at least 8 characters"];

    if (!formData.firstName) newErrors.firstName = ["First name is required"];
    if (!formData.lastName) newErrors.lastName = ["Last name is required"];
    if (!formData.gender) newErrors.gender = ["Gender is required"];

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
      const response = await axiosInstance.post(endpoints.USER_REGISTER, {
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        gender: formData.gender,
        course: formData.course || null,
        group: formData.group || null,
        receive_updates: formData.receiveUpdates,
      });

      if (response.status === 201) {
        setSuccess(true);
        navigate("/check-email", {
          state: {
            email: formData.email,
          },
        });
      }
    } catch (err) {
      if (err.response?.data) {
        setErrors(err.response.data);
      } else {
        setErrors({ general: "Something went wrong. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-container">
      <div className="signup-form-container">
        <div className="signup-card">
          <h1>Create Account</h1>
          <p className="subtitle">Join our community</p>

          {success && (
            <div className="success-message">
              Registration successful! Redirecting to login...
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <div className="form-group">
                <label className="log-label">First Name*</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={errors.first_name ? "error-input" : ""}
                />
                {errors.first_name && (
                  <p className="error-text">{errors.first_name.join(", ")}</p>
                )}
              </div>

              <div className="form-group">
                <label className="log-label">Last Name*</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={errors.last_name ? "error-input" : ""}
                />
                {errors.last_name && (
                  <p className="error-text">{errors.last_name.join(", ")}</p>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="log-label">Email*</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "error-input" : ""}
              />
              {errors.email && (
                <p className="error-text">{errors.email.join(", ")}</p>
              )}
            </div>

            <div className="form-group">
              <label className="log-label">Password*</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "error-input" : ""}
              />
              {errors.password && (
                <p className="error-text">{errors.password.join(", ")}</p>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="log-label">Gender*</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={errors.gender ? "error-input" : ""}
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                {errors.gender && (
                  <p className="error-text">{errors.gender.join(", ")}</p>
                )}
              </div>
            </div>

            {errors.general && <p className="error-text">{errors.general}</p>}

            <button type="submit" className="signup-button" disabled={loading}>
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="login-link">
            Already have an account?{" "}
            <button className="text-button" onClick={handleLoginRedirect}>
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
