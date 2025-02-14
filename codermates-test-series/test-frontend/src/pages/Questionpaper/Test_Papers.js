import React, { useEffect, useState } from 'react';
import './Test_Papers.css';

const TestPapersPage = () => {
    const [testPapers, setTestPapers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [orgId, setOrgId] = useState(null);

    useEffect(() => {
        const storedOrgId = localStorage.getItem('orgId');
        if (storedOrgId) {
            setOrgId(storedOrgId);  
        } else {
            setError('Organization ID not found. Please log in again.');
        }
    }, []); 

    useEffect(() => {
        if (orgId) {
            const fetchTestPapers = async () => {
                try {
                    const response = await fetch(`http://localhost:8000/api/exams/${orgId}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch test papers');
                    }
                    const data = await response.json();
                    setTestPapers(data.results); 
                } catch (err) {
                    setError('Failed to load test papers');
                } finally {
                    setLoading(false);
                }
            };

            fetchTestPapers();
        } else {
            setLoading(false); 
        }
    }, [orgId]); 

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="test-papers-page">
            <h1 className="page-title">Test Papers</h1>
            {testPapers.length > 0 ? (
                <ul className="test-papers-list">
                    {testPapers.map((paper) => (
                        <li key={paper.org_id} className="test-paper-item">
                            <h2 className="exam-name">{paper.exam_name}</h2>
                            <div className="paper-details">
                                <p><strong>Time Limit:</strong> {paper.time_limit} minutes</p>
                                <p><strong>Question Marks:</strong> {paper.question_marks}</p>
                                <p><strong>Correct Marks:</strong> {paper.correct_marks}</p>
                                <p><strong>Wrong Marks:</strong> {paper.wrong_marks}</p>
                            </div>
                            <h3 className="questions-title">Questions:</h3>
                            <ul className="questions-list">
                                {paper.questions.map((question, index) => (
                                    <li key={index} className="question-item">
                                        <p><strong>{question.question_text}</strong></p>
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
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No test papers available</p>
            )}
        </div>
    );
};

export default TestPapersPage;
