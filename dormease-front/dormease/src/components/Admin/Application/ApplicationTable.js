import React, { useEffect, useState } from "react";
import "./ApplicationTable.css";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { api } from "../../../services/api";

function DormerTable() {
  const [expandedRow, setExpandedRow] = useState(null);
  const [dormers, setDormers] = useState([]);
  const [filter, setFilter] = useState("all");
  const [currentDocument, setCurrentDocument] = useState(null);

  const fetchApplications = async () => {
    try {
      const response = await api.getApplicationsList();
      const mapped = response.data.map((app) => ({
        id: app.id,
        fullName: `${app.last_name} ${app.first_name} ${
          app.middle_name || ""
        }`.trim(),
        iin: app.iin,
        gender: app.gender === "male" ? "Male" : "Female",
        category: app.priority_verbose,
        city: app.city.toUpperCase(),
        document_id: app.identification_card,
        document_city: app.city_proof_document,
        document_benefit: app.benefit_proof_document,
        status: app.status?.toLowerCase(),
        comment: app.comment || "",
      }));

      setDormers(mapped);
    } catch (error) {
      console.error("Failed to load applications:", error);
      Swal.fire("Error", "Failed to load applications", "error");
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const toggleExpand = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
    setCurrentDocument(null);
  };

  const showDocument = (docUrl) => {
    setCurrentDocument(docUrl);
  };

  const updateStatus = async (id, status) => {
    const current = dormers.find((d) => d.id === id);
    const processedStatuses = ["approved", "rejected", "canceled"];

    if (processedStatuses.includes(current.status)) {
      await Swal.fire({
        icon: "info",
        title: "Already processed",
        text: "This application has already been processed.",
        confirmButtonText: "ОК",
      });
      return;
    }

    let comment = "";
    if (status !== "approved") {
      const { value: inputComment } = await Swal.fire({
        title: "Comment",
        input: "textarea",
        inputLabel: "Reason",
        inputPlaceholder: "Enter a comment...",
        showCancelButton: true,
        confirmButtonText: "Send",
      });
      if (!inputComment) return;
      comment = inputComment;
    }

    try {
      if (status === "approved") {
        await api.approveApplication(id, "Application approved");
      } else if (status === "rejected") {
        await api.rejectApplication(id, comment);
      } else if (status === "canceled") {
        await api.cancelApplication(id, comment);
      }

      Swal.fire("Successfully", `Application ${status}`, "success");
      fetchApplications();
    } catch (err) {
      Swal.fire("Error", `Failed to process application`, "error");
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      approved: { label: "Approved", className: "badge1 badge-approved" },
      pending: { label: "Pending", className: "badge1 badge-pending" },
      rejected: { label: "Rejected", className: "badge1 badge-rejected" },
      canceled: { label: "Canceled", className: "badge1 badge-canceled" },
    };
    const info = map[status] || { label: "Unknown", className: "badge" };
    return <span className={info.className}>{info.label}</span>;
  };

  const filteredDormers = dormers.filter((d) => {
    if (filter === "processed") return d.status && d.status !== "pending";
    if (filter === "unprocessed") return !d.status || d.status === "pending";
    return true;
  });

  return (
    <div className="table-container">
      <h2>Dormitory applications</h2>

      <div className="filter-buttons">
        <button
          onClick={() => setFilter("all")}
          className={filter === "all" ? "active" : ""}
        >
          All
        </button>
        <button
          onClick={() => setFilter("processed")}
          className={filter === "processed" ? "active" : ""}
        >
          Processed
        </button>
        <button
          onClick={() => setFilter("unprocessed")}
          className={filter === "unprocessed" ? "active" : ""}
        >
          Unprocessed
        </button>
      </div>

      <table className="dormer-table">
        <thead>
          <tr>
            <th>Full name</th>
            <th>IIN</th>
            <th>Gender</th>
            <th>Category</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDormers.map((dormer) => (
            <React.Fragment key={dormer.id}>
              <tr>
                <td>{dormer.fullName}</td>
                <td>{dormer.iin}</td>
                <td>{dormer.gender}</td>
                <td>{dormer.category}</td>
                <td>{getStatusBadge(dormer.status)}</td>
                <td>
                  <button
                    onClick={() => toggleExpand(dormer.id)}
                    className="expand-btn">
                    {expandedRow === dormer.id ? "Hide" : "View"}
                  </button>
                </td>
              </tr>
              {expandedRow === dormer.id && (
                <tr className="expanded-row">
                  <td colSpan="6">
                    <div className="expanded-content">
                      <div className="document-viewer-container">
                        {currentDocument ? (
                          <>
                            <iframe
                              src={currentDocument}
                              title="Document Viewer"
                              className="document-viewer"/>
                            <button
                              onClick={() => setCurrentDocument(null)}
                              className="close-viewer-btn">
                              Close Viewer
                            </button>
                          </>
                        ) : (
                          <div className="document-list">
                            <div className="form-field city-field">
                              <label>City:</label>
                              <input type="text" value={dormer.city} readOnly />
                            </div>
                            {dormer.document_id && (
                              <div className="form-field">
                                <label>Identification Document:</label>
                                <div className="document-buttons">
                                <button
                                  onClick={() => showDocument(dormer.document_id)}
                                  className="view-doc-btn">
                                  View
                                </button>
                                <a href={dormer.document_id} target="_blank" rel="noreferrer" className="external-link"> New Tab </a>
                                </div>
                              </div>
                            )}
                            {dormer.document_city && (
                              <div className="form-field">
                                <label>Proof of City:</label>
                                <div className="document-buttons">
                                <button
                                  onClick={() => showDocument(dormer.document_city)}
                                  className="view-doc-btn"> View </button>
                                <a href={dormer.document_city} target="_blank" rel="noreferrer" className="external-link"> New Tab </a>
                                </div>
                              </div>
                            )}

                            {dormer.document_benefit && (
                              <div className="form-field">
                                <label>Benefit Document:</label>
                                <div className="document-buttons">
                                <button
                                  onClick={() => showDocument(dormer.document_benefit)}
                                  className="view-doc-btn"> View </button>
                                <a href={dormer.document_benefit} target="_blank" rel="noreferrer" className="external-link"> New Tab</a>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {!currentDocument && (
                        <>
                          {dormer.status === "pending" && (
                            <div className="status-actions">
                              <button
                                onClick={() => updateStatus(dormer.id, "approved")}
                                className="approve-btn"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => updateStatus(dormer.id, "canceled")}
                                className="cancel-btn"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => updateStatus(dormer.id, "rejected")}
                                className="reject-btn"
                              >
                                Reject
                              </button>
                            </div>
                          )}

                          {["approved", "rejected", "canceled"].includes(
                            dormer.status
                          ) && (
                            <div className="status-text">
                              <strong>Comment:</strong> {dormer.comment || "—"}
                            </div>
                          )}
                        </>
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
  );
}

export default DormerTable;