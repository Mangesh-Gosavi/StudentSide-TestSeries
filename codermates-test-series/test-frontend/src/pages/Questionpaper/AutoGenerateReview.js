import React from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import './AutoGenerateReview.css';

export default function AutoGenerateReview() {
  const location = useLocation();
  const { examDetailsArray } = location.state || {};

  if (!examDetailsArray || examDetailsArray.length === 0) {
    return <p className="no-exam-message">No exam details available.</p>;
  }

  return (
    <div className="container mt-4">
      <div className="card custom-cards">
        <div className="card-header bg-primary text-white">Generated Exam Papers - Review</div>
        <div className="card-body">
          {examDetailsArray.map((examDetails, index) => (
            <div key={index} className="exam-details-container">
              
              {/* Left Section - Exam Name & Marking Scheme */}
              <div className="left-section">
                <h5 className="exam-name">Exam {index + 1}: {examDetails.exam_name}</h5>
                {examDetails.marking_scheme && (
                  <div className="marking-scheme">
                    <h6>Marking Scheme:</h6>
                    <ul>
                      {Object.entries(examDetails.marking_scheme).map(([key, value]) => (
                        <li key={key}>
                          <strong>{key}:</strong> {typeof value === 'object' ? JSON.stringify(value) : value}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Right Section - Total Marks & Duration */}
              <div className="right-section">
                <p><strong>Total Marks:</strong> {examDetails.total_marks}</p>
                <p><strong>Duration:</strong> {examDetails.exam_duration}</p>
              </div>

              {/* Subject Breakdown */}
              <div className="subject-breakdown">
                <h6>Subject Breakdown:</h6>
                <ul>
                  {examDetails.subject_questions && Object.entries(examDetails.subject_questions).map(([subject, questions]) => (
                    <li key={subject}>{subject}: {questions} questions</li>
                  ))}
                </ul>
              </div>

              {/* Exam Questions */}
              <h6>Questions:</h6>
              <ul className="questions-list">
                {examDetails.questions && examDetails.questions.map((question, qIndex) => (
                  <li key={qIndex} className="question-item">
                    <strong>{qIndex + 1}. {question.question_text}</strong>
                    <ul className="options-list">
                      <li>A: {question.options.A}</li>
                      <li>B: {question.options.B}</li>
                      <li>C: {question.options.C}</li>
                      <li>D: {question.options.D}</li>
                    </ul>
                    <p><strong>Correct Answer:</strong> {question.correct_answer}</p>
                    <p><strong>Difficulty Level:</strong> {question.difficulty}</p>
                  </li>
                ))}
              </ul>

            </div>
          ))}

          <Button variant="secondary" className="mt-3" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
