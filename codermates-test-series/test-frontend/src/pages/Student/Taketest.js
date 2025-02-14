import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import StudentResult from "../../services/studentResult";
import PaperService from "../../services/paper";
import BookmarkedQuestion from "../../services/bookmarkQuestion";
import ReportPopup from "./ReportPopup";

const Test = () => {
    const [studentId, setstudentId] = useState('shriya');
    const [orgId, setOrgId] = useState(1);
    const { testId } = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const testDuration = queryParams.get("duration", 10);
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [examname, setExamname] = useState('');
    const [userAnswers, setUserAnswers] = useState([]);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(testDuration * 60);
    const [markedForReview, setMarkedForReview] = useState([]);
    const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);
    const [timeSpent, setTimeSpent] = useState([]);
    const [isReportPopupOpen, setReportPopupOpen] = useState(false);
    const [papermarks, setPaperMarks] = useState(null);
    const [markingScheme, setMarkingScheme] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await PaperService.getPapers(orgId);
                if (!response || !response.results || response.results.length === 0) {
                    console.error("No papers found.");
                    return;
                }
                const filteredPaper = response.results.find(item => item.test_id === testId);
                if (filteredPaper) {
                    setExamname(filteredPaper.exam_name);
                    setQuestions(filteredPaper.questions || []);
                    const markingScheme = filteredPaper.marking_scheme || { correct: 4, incorrect: -1, unanswered: 0 };
                    setMarkingScheme(markingScheme);
                    setPaperMarks(filteredPaper.total_marks);
                } else {
                    console.error('Test not found');
                }
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };
        fetchData();
    }, [testId, orgId]);
    


    const openReportPopup = () => {
        setReportPopupOpen(true);
    };

    const closeReportPopup = () => {
        setReportPopupOpen(false);
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev === 1) {
                    handleSubmit();
                    clearInterval(timer);
                }
                return prev > 0 ? prev - 1 : 0;
            });

            setTimeSpent((prev) => {
                const updated = [...prev];
                if (updated[currentQuestion] === undefined) {
                    updated[currentQuestion] = 0;
                }
                updated[currentQuestion] += 1;
                return updated;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [currentQuestion]);


    const handleOptionSelect = (option) => {
        setUserAnswers((prev) => {
            const updated = [...prev];
            updated[currentQuestion] = option;
            return updated;
        });
    };

    const handleSaveNext = () => {
        if (userAnswers[currentQuestion] === questions[currentQuestion].CorrectAnswer) {
            setScore(score + 1);
        }

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            // Check if all questions have been answered
            if (!userAnswers.includes(undefined) && !userAnswers.includes(null)) {
                alert("All Questions Saved! You can submit now.");
            }
        }
    };


    const handleMarkForReview = () => {
        setMarkedForReview([...markedForReview, currentQuestion]);
        handleSaveNext();
    };

    const handleBookmark = async () => {
        const question = questions[currentQuestion];

        if (bookmarkedQuestions.includes(currentQuestion)) {
            alert("Question already bookmarked.");
            return;
        }

        const bookmarkData = {
            StudentId: studentId,
            TestId: testId,
            Subject: question.subject || examname,
            TestDateTime: new Date().toISOString(),
            BookmarkDateTime: new Date().toISOString(),
            Chapter: question.chapter || "Unknown",
            QuestionId: question.question_text,
            Comments: "NA",
        };

        try {
            await BookmarkedQuestion.addbookmarkquestion(bookmarkData);
            setBookmarkedQuestions([...bookmarkedQuestions, currentQuestion]);
            alert("Question bookmarked successfully!");
        } catch (error) {
            console.error("Error bookmarking question:", error);
            alert("Failed to bookmark question.");
        }
    };

    const handleClearSelection = () => {
        setUserAnswers((prev) => {
            const updated = [...prev];
            updated[currentQuestion] = null;
            return updated;
        });
    };

    const handleSubmit = async () => {
        let obtainedMarks = 0; 
        const submissionData = {
            StudentId: studentId,
            TestId: testId,
            Examname: examname,
            TestDuration: testDuration,
            responses: questions.map((question, index) => {
                let status = "Wrong";
                let marks = 0;
    
                // Check if the answer is correct, wrong, or unanswered
                if (userAnswers[index] === undefined || userAnswers[index] === null) {
                    status = "Unanswered";
                    marks = markingScheme.unanswered || 0; 
                } else if (userAnswers[index] === question.correct_answer) {
                    status = "Correct";
                    marks = markingScheme.correct || 0; 
                } else {
                    status = "Wrong";
                    marks = markingScheme.incorrect || 0; 
                }
    
                obtainedMarks += marks;

                return {
                    Question: question.question_text,
                    Answer: userAnswers[index] || "Not Answered",
                    Marks: marks,
                    Status: status,
                    TimeTaken: timeSpent[index] || 0
                };
            }),
            TotalMarks: papermarks,
            ObtainedMarks: obtainedMarks,
        };
    
        try {
            const response = await StudentResult.submitTestResult(submissionData);
            alert(`Test submitted successfully!`);
            navigate('/myscheduledtest');
        } catch (error) {
            console.error("Error submitting test results:", error);
            alert("Failed to submit test.");
        }
    };
    

    return (
        <>
            <div className="test-container">
                <div className="header">
                    <h1 className="title">Online Test</h1>
                    <h1 className="title">Paper Description: {examname}</h1>
                    <h1 className="title">Marks: {papermarks}</h1>
                    <p className="time-left">
                        Time Left: {`${Math.floor(timeLeft / 3600)}:${Math.floor((timeLeft % 3600) / 60).toString().padStart(2, "0")}:${(timeLeft % 60).toString().padStart(2, "0")}`}
                    </p>
                </div>

                <div className="content">
                    {/* Question Section */}
                    {questions.length > 0 && questions[currentQuestion] ? (
                        <div className="question-section">
                            <div style={{display:"flex", justifyContent:"space-between"}}>
                            <h2 className="question-text">Subject: {questions[currentQuestion].subject}</h2>
                            <h2 className="question-text">Chapter: {questions[currentQuestion].chapter}</h2>
                            </div>
                            <h2 className="question-text">{[currentQuestion + 1] + ") " + questions[currentQuestion].question_text || 'No question text available'}</h2>
                            <div className="options">
                                {questions[currentQuestion].options ? (
                                    Object.entries(questions[currentQuestion].options).map(([key, option], index) => (
                                        <button
                                            key={index}
                                            className={`option-btn ${userAnswers[currentQuestion] === key ? "selected" : ""}`}
                                            onClick={() => handleOptionSelect(key)}
                                        >
                                            {option}
                                        </button>
                                    ))
                                ) : (
                                    <p>No options available</p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <p>No questions available</p>
                    )}

                    {/* Navigation Panel */}
                    <div className="navigation-panel">
                        <h3 className="nav-title">Question Navigation</h3>
                        <div className="question-buttons">
                            {questions.map((_, index) => {
                                let btnClass = "nav-btn";

                                if (currentQuestion === index) {
                                    btnClass += " current";
                                } else if (markedForReview.includes(index)) {
                                    btnClass += " marked";
                                } else if (userAnswers[index] !== undefined) {
                                    btnClass += " answered";
                                } else {
                                    btnClass += " unanswered";
                                }

                                return (
                                    <button
                                        key={index}
                                        className={btnClass}
                                        onClick={() => setCurrentQuestion(index)}
                                    >
                                        {index + 1}
                                    </button>
                                );
                            })}
                        </div>

                    </div>

                </div>

                <div className="actions">
                    <button className="action-btn yellow" onClick={handleMarkForReview}>Mark for Review</button>
                    <button className="action-btn blue" onClick={handleBookmark}>Bookmark</button>
                    <button className="action-btn red" onClick={openReportPopup}>Report</button>
                    <button className="action-btn red" onClick={handleClearSelection}>Clear</button>
                    <button className="action-btn green" onClick={handleSaveNext} disabled={!userAnswers[currentQuestion]}>Save & Next</button>
                    <button className="action-btn purple" onClick={handleSubmit}>Submit</button>
                </div>

                {isReportPopupOpen && (
                    <ReportPopup
                        studentId={studentId}
                        scheduledBy={orgId}
                        testDuration={testDuration}
                        paperDescription={questions[currentQuestion].Chapter || 'N/A'}
                        questionId={questions[currentQuestion].question_text}
                        closePopup={closeReportPopup}
                    />
                )}
            </div>
        </>
    );
};

export default Test;
