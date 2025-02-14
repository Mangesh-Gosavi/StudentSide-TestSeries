import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Table,
  Form,
  Button,
  InputGroup,
  Pagination,
} from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import BatchService from "../../services/batchService";
import "../../styles/main.css";

export default function ViewBatchList() {
  const [batches, setBatches] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  const itemsPerPage = 10;
  const navigate = useNavigate();
  const organizationId = localStorage.getItem("orgId");
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const fetchBatches = useCallback(
    async (search = "") => {
      if (!organizationId) {
        setError("No organization found. Please login again.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await BatchService.getBatchesForOrganization(
          organizationId,
          currentPage,
          itemsPerPage,
          search
        );

        if (isSearchActive) {
          const regex = new RegExp(search, "i");
          const filteredResults = response.results.filter((batch) =>
            regex.test(batch.name)
          );
          setBatches(filteredResults);
          setTotalCount(filteredResults.length);
        } else {
          setBatches(response.results || []);
          setTotalCount(response.count || 0);
        }
      } catch (err) {
        setError(err.message || "Failed to fetch batches. Please try again later.");
      } finally {
        setLoading(false);
      }
    },
    [organizationId, currentPage, itemsPerPage, isSearchActive]
  );

  useEffect(() => {
    if (!isSearchActive) {
      fetchBatches();
    }
  }, [fetchBatches, isSearchActive]);

  const handleSearch = useCallback(() => {
    if (!searchInput.trim()) {
      alert("Nothing entered to search");
      return;
    }
    setIsSearchActive(true);
    setCurrentPage(1);
    fetchBatches(searchInput);
  }, [searchInput, fetchBatches]);

  const handleReset = useCallback(() => {
    setSearchInput("");
    setIsSearchActive(false);
    setCurrentPage(1);
    fetchBatches("");
  }, [fetchBatches]);

  const handleSearchInput = (e) => {
    setSearchInput(e.target.value);
  };

  const handlePageChange = (direction) => {
    setCurrentPage((prev) => (direction === "next" ? prev + 1 : prev - 1));
  };

  const handleAction = async (type, batchId) => {
    switch (type) {
      case "delete":
        if (window.confirm("Are you sure you want to delete this batch?")) {
          try {
            await BatchService.deleteBatch(batchId);
            fetchBatches(searchInput);
            alert("Batch deleted successfully");
          } catch (err) {
            alert(err.message || "Failed to delete the batch");
          }
        }
        break;

      case "edit":
        navigate(`/batches/${batchId}/edit-batch`);
        break;

      case "addStudents":
        navigate(`/batches/${batchId}/add-students`);
        break;

      default:
        break;
    }
  };

  return (
    <Container fluid className="batch-list-container">
      <Row className="bg-primary text-white py-3 mb-4">
        <Col>
          <h4>Batch List View</h4>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col md={8}>
          <InputGroup className="search-input-group">
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search batches..."
              value={searchInput}
              onChange={handleSearchInput}
              className="search-input"
            />
            <Button variant="primary" onClick={handleSearch}>
              Search
            </Button>
            <Button variant="danger" onClick={handleReset}>
              Reset
            </Button>
          </InputGroup>
        </Col>
        <Col md={4} className="text-end">
          <Button variant="success" onClick={() => navigate("/batches/add-batch")}>
            <FaPlus className="me-1" />
            Create Batch
          </Button>
        </Col>
      </Row>

      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="text-danger text-center">{error}</div>}

      <Row>
        <Col>
          <Table striped bordered hover responsive className="batch-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Batch Name</th>
                <th>Description</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Students</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {batches.length > 0 ? (
                batches.map((batch, index) => (
                  <tr key={batch.id}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{batch.name}</td>
                    <td>{batch.description}</td>
                    <td>{new Date(batch.start_date).toLocaleDateString()}</td>
                    <td>{new Date(batch.end_date).toLocaleDateString()}</td>
                    <td>{batch.is_active ? "Active" : "Inactive"}</td>
                    <td>{batch.student_count}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-1"
                        onClick={() => handleAction("edit", batch.id)}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="me-1"
                        onClick={() => handleAction("delete", batch.id)}
                      >
                        <FaTrash />
                      </Button>
                      <Button
                        variant="outline-success"
                        size="sm"
                        onClick={() => handleAction("addStudents", batch.id)}
                      >
                        <FaPlus />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">
                    {isSearchActive ? "No batches found with that name." : "No batches found."}
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>

      {batches.length > 0 && (
        <Row>
          <Col className="d-flex justify-content-end">
            <Pagination>
              <Pagination.Prev
                onClick={() => handlePageChange("prev")}
                disabled={currentPage === 1}
              >
                Previous
              </Pagination.Prev>
              <Pagination.Item active>{currentPage}</Pagination.Item>
              <Pagination.Next
                onClick={() => handlePageChange("next")}
                disabled={currentPage === totalPages}
              >
                Next
              </Pagination.Next>
            </Pagination>
          </Col>
        </Row>
      )}
    </Container>
  );
}