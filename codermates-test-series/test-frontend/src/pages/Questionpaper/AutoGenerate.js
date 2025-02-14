import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import './AutoGenerate.css'; 

export default function AutoGenerate() {
  const [exam_name, setExamType] = useState('JEE');
  const [numQuestions, setNumQuestions] = useState(0);
  const [lowDifficulty, setLowDifficulty] = useState(20);
  const [mediumDifficulty, setMediumDifficulty] = useState(60);
  const [highDifficulty, setHighDifficulty] = useState(20);
  const [examDetailsArray, setExamDetailsArray] = useState([]); // Changed to array
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDifficulty, setShowDifficulty] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (parseInt(lowDifficulty) + parseInt(mediumDifficulty) + parseInt(highDifficulty) !== 100) {
      setError('Difficulty percentages must add up to 100');
      return;
    }

    try {
      const response = await axios.get('http://127.0.0.1:8000/auto-paper/generate-paper/', {
        params: {
          exam_name: exam_name,
          num_questions: numQuestions,
          Low: lowDifficulty,
          Medium: mediumDifficulty,
          High: highDifficulty,
        },
      });

      if (response.status === 200) {
        // Store the response in the array
        setExamDetailsArray((prevArray) => [...prevArray, response.data]);
        setError(null);
      }
    } catch (error) {
      setError('Failed to generate exam paper');
      console.error(error);
    }
  };

  const handleCloseModal = () => setShowModal(false);
  const handleViewPaper = () => setShowModal(true);

  const toggleDifficulty = () => setShowDifficulty(!showDifficulty);

  const handleNavigateToReview = () => {
    // Ensure the `examDetailsArray` is correctly passed
    if (examDetailsArray && examDetailsArray.length > 0) {
      navigate('/review-autogenerate', { state: { examDetailsArray } });
    } else {
      console.log("Exam details are not available");  // Log to check if examDetailsArray has data
    }
  };
  return (
    <div className="container mt-4">
      <div className="card custom-card">
        <div className="card-header bg-secondary text-white">Auto Generate Exam Paper</div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="exam_name">
              <Form.Label>Exam Type</Form.Label>
              <Form.Control
                as="select"
                value={exam_name}
                onChange={(e) => setExamType(e.target.value)}
                className="form-control custom-form-control"
              >
                <option value="JEE">JEE</option>
                <option value="NEET">NEET</option>
                <option value="MHT-CET">MHT-CET</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="numQuestions">
              <Form.Label>Number of Questions</Form.Label>
              <Form.Control
                type="number"
                value={numQuestions}
                onChange={(e) => setNumQuestions(e.target.value)}
                className="form-control custom-form-control"
              />
            </Form.Group>

            <div className="difficulty-section">
              <Button
                variant="link"
                onClick={toggleDifficulty}
                className="text-decoration-none custom-link-button"
              >
                {showDifficulty ? 'Hide Difficulty Options ▲' : 'Show Difficulty Options ▼'}
              </Button>

              {showDifficulty && (
                <div className="difficulty-inputs mt-3">
                  <Form.Group controlId="lowDifficulty">
                    <Form.Label>Low Difficulty (%)</Form.Label>
                    <Form.Control
                      type="number"
                      value={lowDifficulty}
                      onChange={(e) => setLowDifficulty(e.target.value)}
                      className="form-control custom-form-control"
                    />
                  </Form.Group>

                  <Form.Group controlId="mediumDifficulty">
                    <Form.Label>Medium Difficulty (%)</Form.Label>
                    <Form.Control
                      type="number"
                      value={mediumDifficulty}
                      onChange={(e) => setMediumDifficulty(e.target.value)}
                      className="form-control custom-form-control"
                    />
                  </Form.Group>

                  <Form.Group controlId="highDifficulty">
                    <Form.Label>High Difficulty (%)</Form.Label>
                    <Form.Control
                      type="number"
                      value={highDifficulty}
                      onChange={(e) => setHighDifficulty(e.target.value)}
                      className="form-control custom-form-control"
                    />
                  </Form.Group>
                </div>
              )}
            </div>

            <Button variant="primary" type="submit" className="mt-3 custom-btn">
              Generate Exam Paper
            </Button>
          </Form>

          {examDetailsArray.length > 0 && (
            <Button variant="success" className="mt-3 custom-btn" onClick={handleViewPaper}>
              View Generated Exam Papers
            </Button>
          )}
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Generated Exam Papers</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {examDetailsArray.length > 0 ? (
            examDetailsArray.map((examDetails, index) => (
              <div key={index}>
                <p><strong>Exam Type:</strong> {examDetails.exam_name}</p>
                <p><strong>Total Marks:</strong> {examDetails.total_marks}</p>
                <p><strong>Duration:</strong> {examDetails.exam_duration}</p>

                {examDetails.marking_scheme && (
                  <div>
                    <h5>Marking Scheme:</h5>
                    <ul>
                      {Object.entries(examDetails.marking_scheme).map(([key, value]) => (
                        <li key={key}>
                          <strong>{key}:</strong> {typeof value === 'object' ? JSON.stringify(value) : value}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <h5>Subject Breakdown:</h5>
                <ul>
                  {examDetails.subject_questions && Object.entries(examDetails.subject_questions).map(([subject, questions]) => (
                    <li key={subject}>{subject}: {typeof questions === 'object' ? JSON.stringify(questions) : questions} questions</li>
                  ))}
                </ul>

                <h5>Questions:</h5>
                <ul className="questions-list">
                  {examDetails.questions &&
                    examDetails.questions.map((question, qIndex) => (
                      <li key={qIndex} className="question-item">
                        <p>
                          <strong>{qIndex + 1}. {question.question_text}</strong>
                        </p>
                        <ul className="options-list">
                          {Object.entries(question.options).map(([key, option]) => (
                            <li key={key}>
                              {key}: {option}
                            </li>
                          ))}
                        </ul>
                        <p><strong>Correct Answer:</strong> {question.correct_answer}</p>
                        <p><strong>Difficulty:</strong> {question.difficulty}</p>
                      </li>
                    ))}
                </ul>
              </div>
            ))
          ) : (
            <p>No exam details available.</p>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleNavigateToReview}>
            Go to Review
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
