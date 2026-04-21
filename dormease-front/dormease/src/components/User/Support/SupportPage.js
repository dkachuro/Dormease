import React, { useState, useCallback } from "react";
import "./SupportPage.css";
import { axiosInstance, endpoints } from "../../../services/api"; 

const FAQ_ITEMS = [
  {
    question: 'How to reset my password?',
    answer: 'Go to the login page and click "Forgot password". You will receive instructions via email.',
  },
  {
    question: 'How can I pay for the dormitory?',
    answer: 'In the sidebar, go to the "Payments" section — you will find the full instructions there.',
  },
  {
    question: 'How long does it take to process a request?',
    answer: 'We usually respond within a day. Urgent requests may be processed faster.',
  },
];


function SupportPage() {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const clearError = useCallback((field) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);
  
  const toggleFaq = useCallback((index) => {
  setActiveFaq(prev => (prev === index ? null : index));
}, []);


  const validateEmail = useCallback(
    (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    []
  );

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!email) newErrors.email = "Email is required";
    else if (!validateEmail(email))
      newErrors.email = "Please enter a valid email address";

    if (!subject) newErrors.subject = "Subject is required";

    if (!message) newErrors.message = "Message is required";
    else if (message.length < 10)
      newErrors.message = "Message must be at least 10 characters long";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [email, subject, message, validateEmail]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!validateForm()) return;

      setIsSubmitting(true);

      try {
        await axiosInstance.post(endpoints.SUPPORT_CREATE, {
          subject,
          message,
          answer: "", 
        });

        setIsSubmitted(true);
        setEmail("");
        setSubject("");
        setMessage("");
        setErrors({});
      } catch (error) {
        console.error("Support form submission error:", error);
        alert("Failed to submit request. Please try again later.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [subject, message, email, validateForm]
  );

  if (isSubmitted) {
    return (
      <div className="support-container">
        <h1 className="support-title">Student Support</h1>
        <div className="custom-alert" role="alert" aria-live="polite">
          <h4>Success!</h4>
          <p>Your request has been submitted successfully.</p>
          <p>We will send respond to your email.</p>
          <button className="back-button" onClick={() => setIsSubmitted(false)}>
            Submit another question
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="support-container">
      <h1 className="support-title">Student Support / Contact Us</h1>
      <p className="support-description">
        Have questions? Write to us — we’ll reply as soon as possible.
      </p>

      <form
        className="support-form"
        onSubmit={handleSubmit}
        aria-busy={isSubmitting}
      >
        <div className="form-group">
          <label className="sup-label" htmlFor="email">Email (required)</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => clearError("email")}
            placeholder="Enter your email"
            className={errors.email ? "error" : ""}
            disabled={isSubmitting}
          />
          {errors.email && (
            <span className="error-message" role="alert">
              {errors.email}
            </span>
          )}
        </div>

        <div className="form-group">
          <label className="sup-label" htmlFor="subject">Subject (required)</label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            onFocus={() => clearError("subject")}
            placeholder="Example: Issue logging into personal account"
            className={errors.subject ? "error" : ""}
            disabled={isSubmitting}
          />
          {errors.subject && (
            <span className="error-message" role="alert">
              {errors.subject}
            </span>
          )}
        </div>

        <div className="form-group">
          <label className="sup-label" htmlFor="message">Message (required)</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onFocus={() => clearError("message")}
            placeholder="Describe your issue or question in detail"
            rows={5}
            className={errors.message ? "error" : ""}
            disabled={isSubmitting}
          />
          {errors.message && (
            <span className="error-message" role="alert">
              {errors.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={isSubmitting}
          aria-label={isSubmitting ? "Submitting request" : "Submit request"}
        >
          {isSubmitting ? (
            <span className="button-content">
              <span className="spinner" aria-hidden="true" />
              Submitting...
            </span>
          ) : (
            "Submit"
          )}
        </button>
      </form>

      <div className="faq-section">
        <h2 className="faq-title">FAQ</h2>

        {FAQ_ITEMS.map((item, index) => (
          <div key={index} className="faq-item-support">
            <button
              className={`faq-question ${activeFaq === index ? "active" : ""}`}
              onClick={() => toggleFaq(index)}
              aria-expanded={activeFaq === index}
              aria-controls={`faq-answer-${index}`}
            >
              {item.question}
              <span className="faq-toggle" aria-hidden="true">
                {activeFaq === index ? "▲" : "▼"}
              </span>
            </button>
            {activeFaq === index && (
              <div
                id={`faq-answer-${index}`}
                className="faq-answer-support"
                aria-hidden={activeFaq !== index}
              >
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SupportPage;