import React, { useState } from "react";
import axios from "axios"; // Ensure you have axios installed (npm install axios)

export default function AddBulkUser({ title }) {
  const [file, setFile] = useState(null);
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [inputCaptcha, setInputCaptcha] = useState("");
  const [loading, setLoading] = useState(false); // For loading state
  const [error, setError] = useState(""); // To capture error messages

  // Function to generate random captcha
  function generateCaptcha() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  // Handle file input change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle captcha input change
  const handleCaptchaChange = (e) => {
    setInputCaptcha(e.target.value);
  };

  // Reset functionality
  const handleReset = () => {
    setFile(null);
    setInputCaptcha("");
    setCaptcha(generateCaptcha());
    setError("");
  };

  // Handle file upload (submit the form)
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a CSV file to upload!");
      return;
    }
    if (inputCaptcha !== captcha) {
      alert("Invalid Captcha!");
      return;
    }

    setLoading(true);
    setError(""); // Clear any previous errors

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Replace '/api/bulk-upload' with your actual API endpoint
      const response = await axios.post("/api/bulk-upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // To handle file upload
        },
      });

      if (response.status === 200) {
        alert("File uploaded successfully!");
      } else {
        setError("Failed to upload file. Please try again.");
      }
    } catch (err) {
      // More specific error handling
      if (err.response) {
        // If error response from server
        setError(err.response.data.message || "Error during upload.");
      } else {
        // If no response from server (e.g., network error)
        setError("Network error, please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Refresh captcha
  const handleRefreshCaptcha = () => {
    setCaptcha(generateCaptcha());
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header bg-primary text-white d-flex justify-content-between">
          <button className="btn btn-warning" onClick={() => alert("Go Back")}>
            &larr; Back
          </button>
          <h5 className="mb-0 text-white">{title}</h5>
          <button className="btn btn-success">
            <i className="fa fa-download"></i> Download Template File
          </button>
        </div>
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label fw-bold">
                Select CSV File to Upload{" "}
                <span title="Upload CSV file">ℹ️</span>
              </label>
              <input
                type="file"
                className="form-control"
                onChange={handleFileChange}
              />
            </div>

            <div className="col-md-6 d-flex align-items-center">
              <label className="form-label fw-bold me-2">Enter Captcha</label>
              <div className="input-group">
                <span
                  className="form-control fw-bold text-center"
                  style={{ width: "100px" }}
                >
                  {captcha}
                </span>
                <button
                  className="btn btn-secondary"
                  onClick={handleRefreshCaptcha}
                >
                  ↻
                </button>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Captcha here.."
                  value={inputCaptcha}
                  onChange={handleCaptchaChange}
                />
              </div>
            </div>
          </div>

          {/* Display loading and error messages */}
          {loading && <div>Uploading...</div>}
          {error && <div className="text-danger">{error}</div>}

          <div className="d-flex justify-content-start">
            <button
              className="btn btn-primary me-2"
              onClick={handleUpload}
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
            <button
              className="btn btn-danger"
              onClick={handleReset}
              disabled={loading}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
