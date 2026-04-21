import React, { useEffect, useState } from "react";
import { api } from "../../../services/api";
import "./StudentTable.css";
import "./Contracts.css";

const Contracts = () => {
  const [contracts, setContracts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [showIframe, setShowIframe] = useState(false);

  const toggleRow = (id) => {
    setExpandedRowId(expandedRowId === id ? null : id);
  };
  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await api.getAllContracts();
        setContracts(response.data);
      } catch (error) {
        console.error("Error while receiving contracts:", error);
      }
    };

    fetchContracts();
  }, []);

  const filtered = contracts.filter((c) =>
    (c.full_name + c.email + c.status)
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="student-table-container">
      <div className="table-header">
        <h2>All Contracts</h2>

        <div className="search-wrapper">
          <img
            src="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 24 24%27 stroke-width=%271.5%27 stroke=%27currentColor%27 class=%27w-4 h-4%27%3E%3Cpath stroke-linecap=%27round%27 stroke-linejoin=%27round%27 d=%27M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z%27 /%3E%3C/svg%3E"
            alt="search icon"
            className="search-icon"
          />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <table className="student-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Application status</th>
            <th>Signed</th>
            <th>Signed by</th>
            <th>Signature date</th>
            {/* <th>Contract</th> */}
          </tr>
        </thead>
        <tbody>
          {filtered.map((c) => (
            <React.Fragment key={c.id}>
              <tr onClick={() => toggleRow(c.id)} className="clickable-row">
                <td>{c.full_name}</td>
                <td>{c.email}</td>
                <td>{c.status}</td>
                <td>{c.signed ? "Yes" : "No"}</td>
                <td>{c.signed_by || "-"}</td>
                <td>{c.signed_at || "-"}</td>
                {/* <td>
                  {c.contract_url ? (
                    <a href={c.contract_url} target="_blank" rel="noreferrer">View
                    </a>
                  ) : (
                    "-"
                  )}
                </td> */}
              </tr>
              {expandedRowId === c.id && (
                <tr className="expanded-row">
                  <td colSpan="8">
                    <div className="contract-details">
                      <p>
                        <strong>Signed by:</strong> {c.signed_by || "-"}
                      </p>
                      <p>
                        <strong>Signature Date:</strong> {c.signed_at || "-"}
                      </p>
                      <p>
                        <strong>Contract:</strong>{" "}
                        <button
                          onClick={() => setShowIframe(true)}
                          className="view-button"
                        >
                          View
                        </button>
                      </p>
                      {c.signed_contract_info_pdf_url && (
                        <p>
                          <strong>Info file:</strong>{" "}
                          <a
                            href={c.signed_contract_info_pdf_url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Open PDF
                          </a>
                        </p>
                      )}
                      {showIframe && (
                        <div className="pdf-viewer">
                          <iframe
                            src={c.contract_url}
                            width="100%"
                            height="500px"
                            title="Contract PDF"
                            className="contract-iframe"
                          ></iframe>
                          <div className="iframe-actions">
                            <button
                              onClick={() => setShowIframe(false)}
                              className="close-iframe-btn"
                            >
                              Close
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
  );
};

export default Contracts;
