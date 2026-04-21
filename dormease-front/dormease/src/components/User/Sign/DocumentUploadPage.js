import React, { useState, useRef, useEffect } from "react";
import { QRSigningClientCMS } from "sigex-qr-signing-client";
import axios from "axios";
import { api } from "../../../services/api";
import "./FileUpload.css";

function FileUpload() {
  const fileInputRef = useRef(null);
  const [applicationId, setApplicationId] = useState(null);

  const [isSigned, setIsSigned] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [signedCms, setSignedCms] = useState(null);
  const [status, setStatus] = useState("");
  const [mobileLinks, setMobileLinks] = useState({
    eGov: null,
    business: null,
  });
  const [debugLog, setDebugLog] = useState("");

  useEffect(() => {
    const fetchMyApplication = async () => {
      try {
        const res = await api.getMyApplications();
        console.log("Response from getMyApplications:", res.data);
        setApplicationId(res.data[0]?.id);

        if (res?.data[0].signer_full_name) {
          setIsSigned(true);
          setStatus(
            `Already signed by ${res.data[0].signer_full_name}. We've sent the document to your email. Please check it.`
          );
        }
      } catch (err) {
        console.error("Failed to fetch application:", err);
        setStatus("Failed to load application");
      }
    };

    fetchMyApplication();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setStatus(`File "${file.name}" selected`);
    } else {
      setSelectedFile(null);
      setStatus("Please select a PDF file");
    }
  };

  const handleSign = async () => {
    if (!selectedFile) {
      setStatus("Please select a PDF file first");
      return;
    }

    if (!applicationId) {
      setStatus("Application ID not found");
      return;
    }

    try {
      setStatus("Adding file for signing...");

      const qrSigner = new QRSigningClientCMS("Contract signing", true);

      await qrSigner.addDataToSign(
        ["Dormitory Contract", "Agreement", "Келісімшарт"],
        selectedFile,
        [],
        true
      );

      setStatus("Generating QR code...");

      const qrBase64 = await qrSigner.registerQRSinging();
      setQrCode(`data:image/gif;base64,${qrBase64}`);

      setMobileLinks({
        eGov: qrSigner.getEGovMobileLaunchLink(),
        business: qrSigner.getEGovBusinessLaunchLink(),
      });

      setStatus("Waiting for scan and signature...");

      const signatures = await qrSigner.getSignatures(
        () => setStatus("Signature sent to SIGEX, waiting for confirmation..."),
        (err) => setDebugLog((prev) => prev + err.message + "\n")
      );

      if (signatures && signatures[0]) {
        const cmsBase64 = signatures[0];
        setSignedCms(cmsBase64);

        setStatus("Signature received. Uploading to server...");

        const res = await axios.post(
          `http://34.159.255.166:8000/api/applications/${applicationId}/upload-signed/`,
          { signed_content: cmsBase64 },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              "Content-Type": "application/json",
            },
          }
        );

        setStatus(`Signature saved: ${res.data[0].signer_full_name}`);
        console.log("Server response:", res.data);
      } else {
        setStatus("Signature not received");
      }
    } catch (err) {
      console.error("SIGEX error:", err);
      setStatus("Error: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="form-wrapper">
      <div className="personal-info-container">
        <h1>Contract Signing</h1>
        <p className="subtitle">Sign the contract via eGov Mobile</p>

        {!isSigned && (
          <div className="form-group">
            <label className="form-label">Upload PDF Contract</label>
            <div className="upload-area">
              {!selectedFile ? (
                <>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="file-input"
                  />
                  <span className="upload-instruction">
                    Click or drag file here (PDF only)
                  </span>
                </>
              ) : (
                <div className="file-preview">
                  <span className="file-name">{selectedFile.name}</span>
                  <div className="file-actions">
                    <button
                      type="button"
                      className="remove-button"
                      onClick={() => {
                        setSelectedFile(null);
                        setStatus("File removed");
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {!isSigned && (
          <button onClick={handleSign} className="sign-button">
            Sign via eGov Mobile
          </button>
        )}

        {qrCode && (
          <div className="qr-section">
            <p>Scan the QR code:</p>
            <img src={qrCode} alt="QR for eGov signing" width={250} />
          </div>
        )}

        {status && (
          <div className="status-message">
            <strong>{status}</strong>
          </div>
        )}

        {debugLog && (
          <div className="debug-log">
            <details>
              <summary>Debug log</summary>
              <pre>{debugLog}</pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}

export default FileUpload;
