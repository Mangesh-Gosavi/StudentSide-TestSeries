import React, { useState } from 'react';
import { fetchFilteredQuestions } from '../../services/questionService';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import './QuestionPaper.css';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';

export default function QuestionPaper() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    exam: '',
    subject: '',
    area: '',
    chapter: '',
    topic: '',
    difficulty: '',
  });

  const [dropdownOptions, setDropdownOptions] = useState({
    subjects: [],
    areas: [],
    chapters: [],
    topics: [],
  });

  const [numberOfQuestions, setNumberOfQuestions] = useState(4);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));

    try {
      const response = await axios.get('http://localhost:8000/api/dynamic-dropdown/', {
        params: { ...filters, [name]: value }
      });


      setDropdownOptions((prev) => ({
        ...prev,
        subjects: response.data.subjects || [],
        areas: response.data.areas || [],
        chapters: response.data.chapters || [],
        topics: response.data.topics || [],
      }));
    } catch (err) {
      console.error("Error fetching dropdown options:", err);
    }
  };

  const handleNumberChange = (e) => {
    setNumberOfQuestions(Number(e.target.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const filteredQuestions = await fetchFilteredQuestions(filters, numberOfQuestions);
      console.log("Fetched questions:", filteredQuestions);
      setQuestions(filteredQuestions);
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError('Failed to fetch questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (question) => {
    if (selectedQuestions.includes(question)) {
      setSelectedQuestions(selectedQuestions.filter(q => q !== question));
    } else {
      setSelectedQuestions([...selectedQuestions, question]);
    }
  };

  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);
    
  const handleReviewClick = () => {
    navigate('/review-questions', { state: { selectedQuestions } });
  };



  const handleDeleteQuestion = (questionToDelete) => {
    setSelectedQuestions(selectedQuestions.filter(q => q !== questionToDelete));
  }

  

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Left Column: Form */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-primary text-white">Generate Question Paper</div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Exam</label>
                  <select
                    className="form-control"
                    name="exam"
                    value={filters.exam}
                    onChange={handleChange}
                  >
                    <option value="">Select Exam</option>
                    {['JEE', 'NEET', 'MHT CET'].map((exam) => (
                      <option key={exam} value={exam}>{exam}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Subject</label>
                  <select
                    className="form-control"
                    name="subject"
                    value={filters.subject}
                    onChange={handleChange}
                    disabled={!filters.exam}
                  >
                    <option value="">Select Subject</option>
                    {dropdownOptions.subjects.map((subject) => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Area</label>
                  <select
                    className="form-control"
                    name="area"
                    value={filters.area}
                    onChange={handleChange}
                    disabled={!filters.subject}
                  >
                    <option value="">Select Area</option>
                    {dropdownOptions.areas.map((area) => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Chapter</label>
                  <select
                    className="form-control"
                    name="chapter"
                    value={filters.chapter}
                    onChange={handleChange}
                    disabled={!filters.area}
                  >
                    <option value="">Select Chapter</option>
                    {dropdownOptions.chapters.map((chapter) => (
                      <option key={chapter} value={chapter}>{chapter}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Topic</label>
                  <select
                    className="form-control"
                    name="topic"
                    value={filters.topic}
                    onChange={handleChange}
                    disabled={!filters.chapter}
                  >
                    <option value="">Select Topic</option>
                    {dropdownOptions.topics.map((topic) => (
                      <option key={topic} value={topic}>{topic}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Difficulty</label>
                  <select
                    className="form-control"
                    name="difficulty"
                    value={filters.difficulty}
                    onChange={handleChange}
                  >
                    <option value="">Select difficulty</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Number of Questions</label>
                  <input
                    type="number"
                    className="form-control"
                    value={numberOfQuestions}
                    onChange={handleNumberChange}
                    min="1"
                    max="50"
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : 'Generate Questions'}
                  </button>
                  {selectedQuestions.length > 0 && (
                    <button
                      className="btn btn-success"
                      onClick={handleModalShow}
                    >
                      Preview Selected Questions
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right Column: Generated Questions */}
        <div className="col-md-6">
          {questions.length > 0 && (
            <div className="card">
              <div className="card-header bg-secondary text-white">Generated Questions</div>
              <div className="card-body">
              <p><strong>Selected Questions:</strong> {selectedQuestions.length}</p>
                <ul className="list-group">
                  {questions.map((question, index) => (
                    <li
                      key={index}
                      className={`list-group-item d-flex justify-content-between align-items-center question-box ${selectedQuestions.includes(question) ? 'selected' : ''}`}
                      onClick={() => handleCheckboxChange(question)}
                    >
                      <div className="w-75">
                        <strong>{index + 1}. Question:</strong> {question.question_text} <br />
                        <strong>Options:</strong>
                        <ul>
                          <li>A: {question.options.A}</li>
                          <li>B: {question.options.B}</li>
                          <li>C: {question.options.C}</li>
                          <li>D: {question.options.D}</li>
                        </ul>
                      </div>
                      <div className="d-flex flex-column align-items-end">
                        <div>
                          <strong>Question Type:</strong> {question.question_type} <br />
                          <strong>Difficulty:</strong> {question.difficulty} <br />
                          <strong>Correct Answer:</strong> {question.correct_answer}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                {selectedQuestions.length > 0 && (
                  <button
                    className="btn btn-success mt-3"
                    onClick={handleModalShow}
                  >
                    Preview Selected Questions
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

       {/* Modal to Review Selected Questions */}
        <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
            <Modal.Title>Selected Questions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <ul className="list-group">
            {selectedQuestions.map((selectedQuestion, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-start position-relative">
                <div>
                    <strong>{index + 1}. Question:</strong> {selectedQuestion.question_text} <br />
                    <strong>Options:</strong>
                    <ul>
                    <li>A: {selectedQuestion.options.A}</li>
                    <li>B: {selectedQuestion.options.B}</li>
                    <li>C: {selectedQuestion.options.C}</li>
                    <li>D: {selectedQuestion.options.D}</li>
                    </ul>
                    <strong>Question Type:</strong> {selectedQuestion.question_type} <br />
                    <strong>Difficulty:</strong> {selectedQuestion.difficulty} <br />
                    <strong>Correct Answer:</strong> {selectedQuestion.correct_answer}
                </div>

               {/* Delete Button (Using CloseButton Style) */}
                    <Button
                    variant="link"
                    className="text-dark p-0"
                    style={{ fontSize: '20px', border: 'none' }}
                    onClick={() => handleDeleteQuestion(selectedQuestion)}
                    >
                    &times;
                    </Button>
                </li>
            ))}
            </ul>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>
            Close
            </Button>
            {selectedQuestions.length > 0 && (
            <Button variant="success" onClick={handleReviewClick}>Preview Selected Questions</Button>
          )}
        </Modal.Footer>
        </Modal>


    </div>
  );
}
