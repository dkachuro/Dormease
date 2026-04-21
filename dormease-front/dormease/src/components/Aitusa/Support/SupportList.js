import React, { useState, useEffect } from "react";
import "./SupportRequestsPage.css";
import { api } from "../../../services/api";

function SupportRequestsPage() {
  const [supportRequests, setSupportRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [expandedRequest, setExpandedRequest] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [alert, setAlert] = useState({ message: "", type: "" });

  useEffect(() => {
    fetchSupportRequests();
  }, []);

  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => setAlert({ message: "", type: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const fetchSupportRequests = async () => {
    setLoading(true);
    try {
      const response = await api.getSupportList();
      setSupportRequests(response.data);
    } catch (error) {
      console.error("Failed to load support requests", error);
      setAlert({ message: "Error loading support requests", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleString();

  const filteredRequests = supportRequests.filter((request) => {
    const matchesSearch =
      request.subject.toLowerCase().includes(search.toLowerCase()) ||
      request.message.toLowerCase().includes(search.toLowerCase()) ||
      request.student_full_name.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "answered" && request.is_answered) ||
      (statusFilter === "pending" && !request.is_answered);

    return matchesSearch && matchesStatus;
  });

  const toggleRequest = (id) => {
    setExpandedRequest((prev) => (prev === id ? null : id));
    setReplyText("");
  };

  const handleReplySubmit = async (id) => {
    setIsSubmitting(true);
    try {
      await api.replyToSupportMessage(id, { answer: replyText });
      await fetchSupportRequests();
      setExpandedRequest(null);
      setReplyText("");
      setAlert({ message: "Reply sent successfully!", type: "success" });
      setTimeout(() => {
        document.querySelector(".alert")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (error) {
      console.error("Failed to send reply", error);
      setAlert({ message: "Failed to send reply", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="support-requests-page">
      <div className="header-container">
        <h1 className="page-title">Support Requests</h1>

        <div className="controls-container">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All</option>
            <option value="answered">Answered</option>
            <option value="pending">Pending</option>
          </select>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="table-container-req">
          <table className="requests-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Subject</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <React.Fragment key={request.id}>
                  <tr
                    className={`request-row ${
                      expandedRequest === request.id ? "expanded" : ""
                    }`}
                  >
                    <td>{request.student_full_name}</td>
                    <td>{request.subject}</td>
                    <td>{formatDate(request.created_at)}</td>
                    <td>
                      {request.is_answered ? (
                        <span className="status-resolved">Answered</span>
                      ) : (
                        <span className="status-pending">Pending</span>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => toggleRequest(request.id)}
                        className="toggle-button-request"
                      >
                        {expandedRequest === request.id ? "Hide" : "View"}
                      </button>
                    </td>
                  </tr>

                  {expandedRequest === request.id && (
                    <tr className="details-row">
                      <td colSpan="5">
                        <div className="request-details">
                          <div className="request-info">
                            <h4>Request Details</h4>
                            <p>
                              <strong>Student:</strong> {request.student_full_name}
                            </p>
                            <p>
                              <strong>Subject:</strong> {request.subject}
                            </p>
                            <p>
                              <strong>Date:</strong> {formatDate(request.created_at)}
                            </p>
                            <p>
                              <strong>Message:</strong> {request.message}
                            </p>
                          </div>

                          {request.is_answered ? (
                            <div className="messages-section">
                              <h4>Response</h4>
                              <ul className="messages-list">
                                <li className="message student">
                                  <div className="message-header">
                                    <span className="sender">Student</span>
                                    <span className="date">{formatDate(request.created_at)}</span>
                                  </div>
                                  <p className="message-text">{request.message}</p>
                                </li>
                                <li className="message manager">
                                  <div className="message-header">
                                    <span className="sender">Manager</span>
                                    <span className="date">
                                      {formatDate(request.answered_at)}
                                    </span>
                                  </div>
                                  <p className="message-text">{request.answer}</p>
                                </li>
                              </ul>
                            </div>
                          ) : (
                            <div className="reply-section">
                              <h4>Your Response</h4>
                              <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Type your response here..."
                                className="reply-textarea"
                                rows="4"
                              />
                              <div className="reply-actions">
                                <button
                                  onClick={() => handleReplySubmit(request.id)}
                                  className="send-button"
                                  disabled={!replyText || isSubmitting}
                                >
                                  {isSubmitting ? "Sending..." : "Send Response"}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {alert.message && (
        <div className={`alert ${alert.type === "error" ? "alert-error" : "alert-success"}`}>
          {alert.message}
        </div>
      )}
    </div>
  );
}

export default SupportRequestsPage;