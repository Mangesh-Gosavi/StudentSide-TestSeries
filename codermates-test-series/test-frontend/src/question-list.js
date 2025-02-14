import React, { useEffect, useState } from 'react';
import axios from 'axios';

const QuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/question-bank/questions/');
        setQuestions(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  if (loading) return <p>Loading questions...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Questions</h1>
      <ul>
        {questions.map((question) => (
          <li key={question.id}>
            <h3>{question.question_text}</h3>
            <ul>
              <li>A: {question.option_a}</li>
              <li>B: {question.option_b}</li>
              <li>C: {question.option_c}</li>
              <li>D: {question.option_d}</li>
            </ul>
            <p>Correct Answer: {question.correct_answer}</p>
            <p>Difficulty: {question.difficulty}</p>
            <p>Weightage: {question.weightage}</p>
            {/* Render subject and grade properly */}
            <p>Subject: {question.subject.name}</p>
            <p>Grade: {question.subject.grade.name}</p>
            <p>Chapter: {question.chapter}</p>
            <p>Subtopic: {question.subtopic || 'None'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionList;
