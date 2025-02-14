import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BatchService from '../../services/batchService';

export default function CreateBatch() {
  const navigate = useNavigate();
  const [batchData, setBatchData] = useState({
    name: '',
    description: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
      .toISOString().split('T')[0],
    is_active: true,
  });
  const [organizationId, setOrganizationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const orgId = localStorage.getItem('orgId');
    if (orgId) {
      setOrganizationId(orgId);
    } else {
      setError('Organization ID not found. Please log in again.');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBatchData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!organizationId) {
      setError('Organization ID is required to create a batch.');
      setLoading(false);
      return;
    }

    try {
      await BatchService.createBatch({
        ...batchData,
        organization: organizationId,
      });

      alert('Batch created successfully!');
      navigate(-1);
    } catch (err) {
      setError(err.message || 'Error creating batch');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header bg-primary text-white">Create New Batch</div>
        <div className="card-body">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Batch Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={batchData.name}
                onChange={handleChange}
                required
                placeholder="Enter batch name"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                name="description"
                value={batchData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Enter batch description"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="form-control"
                name="start_date"
                value={batchData.start_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">End Date</label>
              <input
                type="date"
                className="form-control"
                name="end_date"
                value={batchData.end_date}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !organizationId}
            >
              {loading ? 'Creating...' : 'Create Batch'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
