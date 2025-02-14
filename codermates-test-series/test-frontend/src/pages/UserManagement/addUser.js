import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaArrowLeft, FaInfoCircle } from "react-icons/fa";
import { studentService } from "../../services/studentService";

export default function AddStudent() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    profileImage: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Navigate back to the users list
  const handleonBack = () => {
    navigate("/students");
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      profileImage: null,
    });
    setError(""); // Reset error as well
  };

  // Submit form to API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simple client-side validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setLoading(false);
      setError("Please fill all required fields.");
      return;
    }

    const studentData = new FormData();
    studentData.append("first_name", formData.firstName);
    studentData.append("last_name", formData.lastName);
    studentData.append("email", formData.email);
    studentData.append("password", formData.password);
    if (formData.profileImage) {
      studentData.append("profile_image", formData.profileImage);
    }

    try {
      await studentService.createStudent(studentData); // Correct method for adding student
      alert("Student added successfully!");
      navigate("/students"); // Redirect to the students list page after success
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card">
        {/* Header */}
        <div className="card-header bg-primary text-white d-flex align-items-center">
          <button className="btn btn-warning btn-sm mr-2" onClick={handleonBack}>
            <FaArrowLeft /> Back
          </button>
          <span className="ml-2">Add New Student</span>
        </div>

        {/* Form */}
        <div className="card-body">
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
                <label>
                  Last Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  className="form-control"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter Last Name"
                  required
                />
              </div>

              {/* Email */}
              <div className="col-md-6 mb-3">
                <label>
                  Email <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter Email"
                  required
                />
              </div>

              {/* Password */}
              <div className="col-md-6 mb-3">
                <label>
                  Password <span className="text-danger">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter Password"
                  required
                />
              </div>

              {/* Profile Image */}
              <div className="col-md-6 mb-3">
                <label>Upload Profile Image <FaInfoCircle color="blue" /></label>
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
              <button type="submit" className="btn btn-primary mr-2" disabled={loading}>
                {loading ? "Adding..." : "Add"}
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleReset}
                disabled={loading}
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
