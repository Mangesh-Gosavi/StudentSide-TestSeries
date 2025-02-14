import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import './ReviewQuestions.css';

export default function ReviewQuestions() {
  const location = useLocation();
  const { selectedQuestions } = location.state || { selectedQuestions: [] };

  const [examName, setExamName] = useState('');
  const [timeLimit, setTimeLimit] = useState('');
  const [questionMarks, setQuestionMarks] = useState('');
  const [correctMarks, setCorrectMarks] = useState('');
  const [wrongMarks, setWrongMarks] = useState('');
  const [organizationId, setOrganizationId] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Fetch orgId from localStorage
  useEffect(() => {
    const orgId = localStorage.getItem('orgId');
    if (orgId) {
      setOrganizationId(orgId);
    } else {
      setError('Organization ID not found. Please log in again.');
    }
  }, []);

  const handleSubmit = async () => {
    if (!examName || !timeLimit || !questionMarks || !correctMarks || !wrongMarks || !organizationId) {
      alert('Please fill out all fields and ensure you are logged in.');
      return;
    }

    const examDetails = {
      org_id: organizationId, // Include orgId in the payload
      exam_name: examName,
      time_limit: Number(timeLimit),
      question_marks: Number(questionMarks),
      correct_marks: Number(correctMarks),
      wrong_marks: Number(wrongMarks),
      questions: selectedQuestions.map((question) => ({
        question_text: question.question_text,
        options: question.options,
        correct_answer: question.correct_answer,
        question_type: question.question_type,
        difficulty: question.difficulty,
      })),
    };

    console.log('Sending Exam Details:', examDetails);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/create-exam/', examDetails);

      if (response.status === 201) {
        console.log('Exam details and questions submitted successfully');
        navigate('/test-papers');
      } else {
        console.error('Failed to submit the exam details. Status:', response.status);
      }
    } catch (error) {
      console.error('Error submitting exam details:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header bg-secondary text-white">Review Selected Questions</div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          <ul className="list-group">
            {selectedQuestions.length === 0 ? (
              <li className="list-group-item">No questions selected</li>
            ) : (
              selectedQuestions.map((question, index) => (
                <li key={index} className="list-group-item position-relative">
                  <div>
                    <strong>{index + 1}. Question:</strong> {question.question_text}
                    <br />
                    <strong>Options:</strong>
                    <ul>
                      <li>A: {question.options.A}</li>
                      <li>B: {question.options.B}</li>
                      <li>C: {question.options.C}</li>
                      <li>D: {question.options.D}</li>
                    </ul>
                  </div>
                  <div className="question-details">
                    <strong>Question Type:</strong> {question.question_type} <br />
                    <strong>Difficulty:</strong> {question.difficulty} <br />
                    <strong>Correct Answer:</strong> {question.correct_answer}
                  </div>
                </li>
              ))
            )}
          </ul>

          <Form className="mt-4">
            <Form.Group controlId="examName">
              <Form.Label>Exam Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter exam name"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="timeLimit">
              <Form.Label>Time Limit (in minutes)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter time limit"
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="questionMarks">
              <Form.Label>Marks per Question</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter marks per question"
                value={questionMarks}
                onChange={(e) => setQuestionMarks(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="correctMarks">
              <Form.Label>Marks for Correct Answer</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter marks for correct answer"
                value={correctMarks}
                onChange={(e) => setCorrectMarks(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="wrongMarks">
              <Form.Label>Marks Deducted for Wrong Answer</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter marks to deduct for wrong answer"
                value={wrongMarks}
                onChange={(e) => setWrongMarks(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" className="mt-3" onClick={handleSubmit}>
              Save Exam Details
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}
