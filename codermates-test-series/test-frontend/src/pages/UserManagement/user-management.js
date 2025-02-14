import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { getUsers } from '../services/userService'; // Updated path to userService
import "bootstrap/dist/css/bootstrap.min.css";

export default function UserManagement() {
  const navigate = useNavigate();

  // State for users, loading, and error
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for filters
  const [filters, setFilters] = useState({
    name: '',
    userId: '',
    type: 'STUDENT',
    status: 'Active',
    date: ''
  });

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch user data from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers(); // Fetch the data using an API function
        setUsers(data);
      } catch (error) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Handle search
  const handleSearch = () => {
    // Apply filter to users if needed or call API with filters
    console.log("Search triggered with filters", filters);
    // Here you can integrate with the API if required
  };

  // Handle reset filters
  const handleResetFilters = () => {
    setFilters({
      name: '',
      userId: '',
      type: 'STUDENT',
      status: 'Active',
      date: ''
    });
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = users.slice(indexOfFirstItem, indexOfLastItem);

  // Total pages for pagination
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleAddUserClick = (path) => {
    navigate(path);  // Navigate to Add User or any other path
  };

  return (
    <div className="container mt-4">
      {/* Filters Section */}
      <div className="card">
        <div className="card-header bg-primary text-white">Filters</div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-3">
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Name"
                name="name"
                value={filters.name}
                onChange={handleFilterChange}
              />
            </div>
            <div className="col-md-3">
              <label>User ID</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter User ID"
                name="userId"
                value={filters.userId}
                onChange={handleFilterChange}
              />
            </div>
            <div className="col-md-3">
              <label>User Type</label>
              <select
                className="form-control"
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
              >
                <option value="STUDENT">STUDENT</option>
                <option value="FACULTY">FACULTY</option>
              </select>
            </div>
            <div className="col-md-3">
              <label>Activation Status</label>
              <select
                className="form-control"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="col-md-3 mt-3">
              <label>User Registered From</label>
              <input
                type="date"
                className="form-control"
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
              />
            </div>
          </div>
          <div className="mt-3">
            <button className="btn btn-primary mr-2" onClick={handleSearch}>
              Search
            </button>
            <button className="btn btn-danger" onClick={handleResetFilters}>
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* User List Section */}
      <div className="card mt-4">
        <div className="card-header bg-primary text-white d-flex justify-content-between">
          <span>User List</span>
          <button className="btn btn-success btn-sm">Download</button>
        </div>
        <div className="card-body">
          <div className="mb-2">
            <button className="btn btn-success btn-sm mr-2" onClick={() => handleAddUserClick("/user-management/add-user")}>+ Add User</button>
            <button className="btn btn-success btn-sm mr-2" onClick={() => handleAddUserClick("/user-management/user-bulk-upload")}>+ Bulk User Creation</button>
            <button className="btn btn-success btn-sm mr-2">+ Set New Password</button>
            <button className="btn btn-success btn-sm mr-2" onClick={() => handleAddUserClick("/user-management/bulk-password-upload")}>+ Bulk Set New Password</button>
            <button className="btn btn-success btn-sm" onClick={() => handleAddUserClick("/user-management/user-bulk-update")}>+ Bulk Update User</button>
          </div>

          {/* Loading and Error States */}
          {loading && <div>Loading...</div>}
          {error && <div className="text-danger">{error}</div>}

          {/* Table for displaying user data */}
          {!loading && !error && (
            <table className="table table-striped table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th>#</th>
                  <th>User Name</th>
                  <th>User ID</th>
                  <th>User Type</th>
                  <th>Contact</th>
                  <th>Created Date</th>
                  <th>Activation Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.userId}</td>
                    <td>{user.type}</td>
                    <td>{user.contact}</td>
                    <td>{user.createdAt}</td>
                    <td>
                      <span className="badge badge-success">{user.status}</span>
                    </td>
                    <td>
                      <button className="btn btn-primary btn-sm" onClick={() => handleAddUserClick(`/user-management/edit-user/${user.id}`)}>
                        <i className="fa fa-pencil"></i> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Pagination */}
          <nav>
            <ul className="pagination justify-content-center">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                  Previous
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, index) => (
                <li key={index} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                  <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                    {index + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};
