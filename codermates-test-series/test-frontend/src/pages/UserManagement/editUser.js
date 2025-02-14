import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaArrowLeft, FaInfoCircle } from "react-icons/fa";

export default function EditUser() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userId: "",
    schoolName: "",
    activationStatus: "Active",
    userType: "STUDENT",
    profileImage: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Navigate back to the user list page
  const handleonBack = () => {
    navigate("/users");
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: files ? files[0] : value,
    }));
  };

  // Submit updated user data to the API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      // Assuming the backend endpoint for updating user data is '/api/users/update'
      const response = await axios.post(`/users/update/${userId}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data", // To handle file upload
        },
      });

      if (response.status === 200) {
        setSuccessMessage("User updated successfully!");
        navigate("/users"); // Navigate after success
      } else {
        setError("Failed to update user. Please try again.");
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Error during update.");
      } else {
        setError("Network error, please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch user details for editing
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/users/${userId}`);
        setFormData(response.data);
      } catch (err) {
        setError("Failed to fetch user details.");
      }
    };

    fetchUser();
  }, [userId]);

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header bg-primary text-white d-flex align-items-center">
          <button className="btn btn-warning" onClick={handleonBack}>
            <FaArrowLeft /> Back
          </button>
          <h5 className="mb-0" style={{ marginLeft: "20px" }}>
            Edit User
          </h5>
        </div>

        <div className="card-body">
          {successMessage && (
            <div className="alert alert-success">{successMessage}</div>
          )}
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* First Name */}
              <div className="col-md-6 mb-3">
                <label>
                  First Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  className="form-control"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter First Name"
                  required
                />
              </div>

              {/* Last Name */}
              <div className="col-md-6 mb-3">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  className="form-control"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter Last Name"
                />
              </div>

              {/* User ID */}
              <div className="col-md-6 mb-3">
                <label>
                  User ID <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="userId"
                  className="form-control"
                  value={formData.userId}
                  onChange={handleChange}
                  disabled
                />
              </div>

              {/* User Type */}
              <div className="col-md-6 mb-3">
                <label>
                  User Type <span className="text-danger">*</span> <FaInfoCircle color="blue" />
                </label>
                <select
                  name="userType"
                  className="form-control"
                  value={formData.userType}
                  onChange={handleChange}
                  required
                >
                  <option value="STUDENT">STUDENT</option>
                  <option value="FACULTY">FACULTY</option>
                </select>
              </div>

              {/* School Name */}
              <div className="col-md-6 mb-3">
                <label>School Name</label>
                <input
                  type="text"
                  name="schoolName"
                  className="form-control"
                  value={formData.schoolName}
                  onChange={handleChange}
                  placeholder="Enter School Name"
                />
              </div>

              {/* Activation Status */}
              <div className="col-md-6 mb-3">
                <label>
                  Activation Status <span className="text-danger">*</span>
                </label>
                <select
                  name="activationStatus"
                  className="form-control"
                  value={formData.activationStatus}
                  onChange={handleChange}
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Profile Image */}
              <div className="col-md-6 mb-3">
                <label>Upload Profile Image</label>
                <input
                  type="file"
                  name="profileImage"
                  className="form-control-file"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Loading & Error Messages */}
            {loading && <div>Loading...</div>}
            {error && <div className="text-danger">{error}</div>}

            <div className="mt-3">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleonBack}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
