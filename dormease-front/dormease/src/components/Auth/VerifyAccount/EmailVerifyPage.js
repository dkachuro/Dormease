import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { api } from "../../../services/api";
import "./EmailVerifyPage.css";

export default function EmailVerifyPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying your link...");
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      setMessage("Token not found in the URL.");
      setSuccess(false);
      return;
    }

    api
      .verifyEmailToken(token)
      .then(() => {
        setMessage("Your account has been successfully verified! You can now log in.");
        setSuccess(true);
      })
      .catch(() => {
        setMessage("This verification link is invalid or has already been used.");
        setSuccess(false);
      });
  }, [params]);

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="verify-page">
      <div className="verify-card">
        <h1>Email Verification</h1>
        <p className={`message ${success === true ? "text-success" : success === false ? "text-error" : ""}`}>
          {message}
        </p>
        {success && (
          <button onClick={handleLoginRedirect} className="login-button">
            Go to Login
          </button>
        )}
      </div>
    </div>
  );
}
