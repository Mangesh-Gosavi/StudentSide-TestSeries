import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import Header from './Header';
import BookmarkedQuestion from "../../services/bookmarkQuestion";
import PaperService from "../../services/paper";
import SolutionPage from './SolutionPage'; 

const BookmarkQuestion = () => {
    const [studentId, setstudentId] = useState('shriya');
    const [orgId, setOrgId] = useState(1);
    const { chapter } = useParams(); 
    const [markquestions, setMarkQuestions] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await BookmarkedQuestion.getbookmarkQuestions();
                const bookmark = response.filter((item)=> item.Chapter === chapter && item.StudentId === studentId)
                setMarkQuestions(bookmark || []);
            } catch (err) {
                console.error(err);
            }
        };

        const Questions = async () => {
            try {
                const response = await PaperService.getPapers(orgId);
                const questions = response.results[0]?.questions || [];
                setQuestions(questions);
            } catch (err) {
                console.error(err);
            }
        };

        Questions();
        fetchQuestions();
    }, []);

    // Handle button click to show the solution in the modal
    const handleSolutionClick = (question_text) => {
        const question = questions.find((item) => item.question_text === question_text); 
        setSelectedQuestion(question);  
        setModalIsOpen(true);  
    };

    // Close the modal
    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedQuestion(null);
    };

    return (
        <div>
            <Header />
            <div style={{ width: "100%", padding: "20px" }}>
                <div style={{ width: "100%", padding: "20px" }}>
                    <div style={{ backgroundColor: "#1a3874", color: "white", borderRadius: "5px" }}>
                        <p style={{ padding: "10px" }}>Bookmarked Questions</p>
                    </div>
                    <table style={{ border: "1px solid rgb(216, 216, 216)", width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th style={{ padding: "15px" }}>Sr.no</th>
                                <th style={{ padding: "15px" }}>Test Id</th>
                                <th style={{ padding: "15px" }}>Test Date Time</th>
                                <th style={{ padding: "15px" }}>Bookmark Date Time</th>
                                <th style={{ padding: "15px" }}>Subject</th>
                                <th style={{ padding: "15px" }}>Question</th>
                                <th style={{ padding: "15px" }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {markquestions.length > 0 ? (
                                markquestions.map((item, index) => (
                                    <tr key={index} style={{ border: "1px solid rgb(216, 216, 216)" }}>
                                        <td style={{ gap: "10px", padding: "15px" }}>{index + 1}</td>
                                        <td style={{ padding: "15px" }}>{item.TestId}</td>
                                        <td style={{ padding: "15px" }}>{item.TestDateTime}</td>
                                        <td style={{ padding: "15px" }}>{item.BookmarkDateTime}</td>
                                        <td style={{ padding: "15px" }}>{item.Subject}</td>
                                        <td style={{ padding: "15px" }}>{item.QuestionId}</td>
                                        <td>
                                            <button
                                                className='dashbtn'
                                                style={{ padding: "8px", borderRadius: "5px" }}
                                                onClick={() => handleSolutionClick(item.QuestionId)} 
                                            >
                                                Solution
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: "center", padding: "15px" }}>
                                        No questions available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Show the modal with the solution */}
            <SolutionPage
                isOpen={modalIsOpen}
                onClose={closeModal}
                questionData={selectedQuestion}  
            />
        </div>
    );
};

export default BookmarkQuestion;
