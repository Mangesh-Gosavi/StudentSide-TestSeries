import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BatchService from '../../services/batchService';

export default function EditBatch() {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const [batchData, setBatchData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    is_active: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBatchDetails = useCallback(async () => {
    try {
      const result = await BatchService.getBatch(batchId);
      setBatchData(result);
    } catch (err) {
      setError(err.message || 'Error fetching batch details');
    }
  }, [batchId]);

  useEffect(() => {
    if (batchId) {
      fetchBatchDetails();
    }
  }, [batchId, fetchBatchDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBatchData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await BatchService.updateBatch(batchId, batchData);
      alert('Batch updated successfully!');
      navigate(-1);
    } catch (err) {
      setError(err.message || 'Error updating batch');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header bg-primary text-white">Edit Batch</div>
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

            <input type="hidden" name="start_date" value={batchData.start_date} />
            <input type="hidden" name="end_date" value={batchData.end_date} />

            <input type="hidden" name="is_active" value={batchData.is_active} />

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Batch'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
