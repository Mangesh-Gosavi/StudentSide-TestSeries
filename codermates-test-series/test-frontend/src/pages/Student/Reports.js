import React from 'react';
import Header from './Header';
import { useEffect, useState } from 'react';
import StudentReports from "../../services/studentreports";
import PaperService from "../../services/paper";
import SolutionPage from './SolutionPage'; 

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
        <div>
            <Header />
            <div style={{ width: "100%", padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "center", background: "#1a3874", color: "white", border: "1px solid rgb(216, 216, 216)", marginTop: "10px", padding: "9px" }}>
                    <h6>Test Error Cumilative Reports</h6>
                </div>
                <table style={{ border: "1px solid rgb(216, 216, 216)", width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
                    <thead>
                        <tr>
                            <th style={{ padding: "15px" }}>Sr.no</th>
                            <th style={{ padding: "15px" }}>Scheduled By</th>
                            <th style={{ padding: "15px" }}>Test Start Time</th>
                            <th style={{ padding: "15px" }}>Test Duration</th>
                            <th style={{ padding: "15px" }}>Chapter</th>
                            <th style={{ padding: "15px" }}>QuestionId</th>
                            <th style={{ padding: "15px" }}>Report</th>
                            <th style={{ padding: "15px" }}>View</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.length > 0 ? (
                            reports.map((item, index) => (
                                <tr key={index} style={{ border: "1px solid rgb(216, 216, 216)" }}>
                                    <td style={{ gap: "10px", padding: "15px" }}>{index + 1}</td>
                                    <td style={{ padding: "15px" }}>{item.ScheduledBy}</td>
                                    <td style={{ padding: "15px" }}>{item.TestStartTime}</td>
                                    <td style={{ padding: "15px" }}>{item.TestDuration}</td>
                                    <td style={{ padding: "15px" }}>{item.PaperDescription}</td>
                                    <td style={{ padding: "15px" }}>{item.QuestionId}</td>
                                    <td style={{ padding: "15px" }}>{item.Report}</td>
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
                                <td colSpan="9" style={{ textAlign: "center", padding: "15px" }}>No Reports available</td>
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
    );
};

export default Reports;
