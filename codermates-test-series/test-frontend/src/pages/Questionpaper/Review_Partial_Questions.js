import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './review-partial-question.css';
import { useNavigate } from 'react-router-dom';

const ReviewPartialQuestions = () => {
  const location = useLocation();
  const ExamDetails = location.state?.ExamDetails;
  const [organizationId, setOrganizationId] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const orgId = localStorage.getItem('orgId');
    if (orgId) {
      setOrganizationId(orgId);
    } else {
      setError('Organization ID not found. Please log in again.');
    }
  }, []);

  console.log("Received Exam Details:", ExamDetails);

  const isValidExamDetails = (details) => {
    if (!details.exam_name || !details.exam_duration || !details.subject_questions || !details.questions) {
      return false;
    }
  
    return details.questions.every(question => question.que_id && question.exam && question.question_text);
  };

  const formatExamDetails = (examDetails) => {
    const formattedSubjectQuestions = {};
    examDetails.questions.forEach(question => {
      const subject = question.subject;
      if (formattedSubjectQuestions[subject]) {
        formattedSubjectQuestions[subject] += 1;
      } else {
        formattedSubjectQuestions[subject] = 1;
      }
    });

    const formattedExamDetails = {
      org_id: examDetails.org_id,  
      exam_name: examDetails.exam_name,
      exam_duration: examDetails.exam_duration,
      subject_questions: formattedSubjectQuestions,
      questions: examDetails.questions.map(question => ({
        que_id: question.que_id,
        exam: question.exam,
        subject: question.subject,
        area: question.area,
        chapter: question.chapter,
        topic: question.topic,
        difficulty: question.difficulty,
        question_text: question.question_text,
        options: question.options,
        correct_answer: question.correct_answer,
        question_type: question.question_type,
        is_used: question.is_used,
        explain: question.explain,
        marks: question.marks,
        prev_year: question.prev_year
      })),
      marking_scheme: examDetails.marking_scheme || {
        correct: 4,
        incorrect: -1,
        unanswered: 0
      },
      total_marks: examDetails.total_marks || 24
    };

    return formattedExamDetails;
  };

  const handleCreateExam = async () => {
    if (!ExamDetails || !isValidExamDetails(ExamDetails)) {
      setError('Invalid exam details.');
      return;
    }

    const formattedExamDetails = formatExamDetails(ExamDetails);

    try {
      const response = await axios.post('http://localhost:8000/api/create-exam/', formattedExamDetails);
      if (response.status === 201) {
        setSuccessMessage('Exam created successfully!');
        window.alert('Exam created successfully!');
        navigate('/partial-question-generate');
        console.log("Done")
      }
    } catch (err) {
      setError('Failed to create exam. Please try again.');
    }
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header bg-secondary text-white">Review Exam Details</div>
        <div className="card-body">
          {ExamDetails ? (
            <>
              <div>
                <strong>Exam Name:</strong> {ExamDetails.exam_name} <br />
                <strong>Exam Duration:</strong> {ExamDetails.exam_duration} minutes <br />
                <strong>Organization ID:</strong> {organizationId || ExamDetails.org_id} <br />
              </div>

              <div className="mt-4">
                <strong>Marking Scheme:</strong>
                <ul>
                  <li>Correct: {ExamDetails.marking_scheme.correct} marks</li>
                  <li>Incorrect: {ExamDetails.marking_scheme.incorrect} marks</li>
                  <li>Unanswered: {ExamDetails.marking_scheme.unanswered} marks</li>
                </ul>
              </div>

              <div className="mt-4">
                <strong>Total Marks:</strong> {ExamDetails.total_marks} <br />
              </div>

              <div className="mt-4">
                <strong>Subject Questions:</strong>
                <ul>
                  {Object.entries(ExamDetails.subject_questions).map(([subject, count]) => (
                    <li key={subject}>{subject}: {count} questions</li>
                  ))}
                </ul>
              </div>

              <ul className="list-group mt-4">
                {ExamDetails.questions.length === 0 ? (
                  <li className="list-group-item">No questions available</li>
                ) : (
                  ExamDetails.questions.map((question, index) => (
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
                        <strong>Subject:</strong> {question.subject} <br />
                        <strong>Area:</strong> {question.area} <br />
                        <strong>Chapter:</strong> {question.chapter} <br />
                        <strong>Topic:</strong> {question.topic} <br />
                        <strong>Difficulty:</strong> {question.difficulty} <br />
                        <strong>Correct Answer:</strong> {question.correct_answer} <br />
                        <strong>Explanation:</strong> {question.explain} <br />
                        <strong>Previous Year Question:</strong> {question.prev_year ? 'Yes' : 'No'}
                      </div>
                    </li>
                  ))
                )}
              </ul>

              <button className="btn btn-primary mt-4" onClick={handleCreateExam}>
                Create Exam
              </button>

              {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
              {error && <div className="alert alert-danger mt-3">{error}</div>}
            </>
          ) : (
            <div className="alert alert-danger">Exam details not found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewPartialQuestions;
