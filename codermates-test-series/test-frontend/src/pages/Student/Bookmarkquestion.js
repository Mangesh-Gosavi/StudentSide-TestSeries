import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import Header from './Header';
import BookmarkedQuestion from "../../services/bookmarkQuestion";
import PaperService from "../../services/paper";
import SolutionPage from './SolutionPage';
import "./Bookmarkquestion.css"

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
                const bookmark = response.filter((item) => item.Chapter === chapter && item.StudentId === studentId)
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
        <div style={{width:"100%"}}>
            <div className='dashboard'>
                <Header />
                <div className="bookmarks-container">
                    <div className="bookmarks-header">
                        <p>Bookmarked Questions</p>
                    </div>
                    <table className="bookmarks-table">
                        <thead>
                            <tr>
                                <th>Sr.no</th>
                                <th>Test Id</th>
                                <th>Test Date Time</th>
                                <th>Bookmark Date Time</th>
                                <th>Subject</th>
                                <th>Question</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {markquestions.length > 0 ? (
                                markquestions.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.TestId}</td>
                                        <td>{item.TestDateTime}</td>
                                        <td>{item.BookmarkDateTime}</td>
                                        <td>{item.Subject}</td>
                                        <td>{item.QuestionId}</td>
                                        <td>
                                            <button className="solution-btn" onClick={() => handleSolutionClick(item.QuestionId)}>
                                                Solution
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="no-questions">No questions available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Show the modal with the solution */}
                <SolutionPage isOpen={modalIsOpen} onClose={closeModal} questionData={selectedQuestion} />
            </div>
        </div>
    );
};

export default BookmarkQuestion;
