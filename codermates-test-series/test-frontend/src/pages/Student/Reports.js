import React from 'react';
import Header from './Header';
import { useEffect, useState } from 'react';
import StudentReports from "../../services/studentreports";
import PaperService from "../../services/paper";
import SolutionPage from './SolutionPage';
import "./Reports.css"
const Reports = () => {
    const [studentId, setstudentId] = useState('shriya');
    const [orgId, setOrgId] = useState(1);
    const [reports, setReports] = useState([])
    const [questions, setQuestions] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);

    useEffect(() => {
        const fetchreports = async () => {
            try {
                const response = await StudentReports.getstudentreports();
                console.log(response);
                const filteredPaper = response.filter((item) => item.StudentId === studentId)
                setReports(filteredPaper || []);
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
        fetchreports();
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
                <div className="report-container">
                    <div className="report-header">
                        <h6>Test Error Cumulative Reports</h6>
                    </div>
                    <table className="report-table">
                        <thead>
                            <tr>
                                <th>Sr.no</th>
                                <th>Scheduled By</th>
                                <th>Test Start Time</th>
                                <th>Test Duration</th>
                                <th>Chapter</th>
                                <th>QuestionId</th>
                                <th>Report</th>
                                <th>View</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.length > 0 ? (
                                reports.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.ScheduledBy}</td>
                                        <td>{item.TestStartTime}</td>
                                        <td>{item.TestDuration}</td>
                                        <td>{item.PaperDescription}</td>
                                        <td>{item.QuestionId}</td>
                                        <td>{item.Report}</td>
                                        <td>
                                            <button
                                                className="dashbtn solution-btn"
                                                onClick={() => handleSolutionClick(item.QuestionId)}
                                            >
                                                Solution
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="no-reports">No Reports available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Show the modal with the solution */}
                <SolutionPage
                    isOpen={modalIsOpen}
                    onClose={closeModal}
                    questionData={selectedQuestion}
                />
            </div>

        </div>
    );
};

export default Reports;
