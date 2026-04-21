import { useLocation, useNavigate } from "react-router-dom";
import "./CheckEmailPage.css";

export default function CheckEmailPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const email = state?.email || "your email";

  return (
    <div className="verify-page">
      <div className="verify-card">
        <h1>Check Your Email</h1>
        <p className="message">
          We've sent a confirmation link to <strong>{email}</strong>.
        </p>
        <p className="message">Please check your inbox and follow the link to activate your account.</p>
        <button onClick={() => navigate("/login")} className="login-button">
          Back to Login
        </button>
      </div>
    </div>
  );
}
