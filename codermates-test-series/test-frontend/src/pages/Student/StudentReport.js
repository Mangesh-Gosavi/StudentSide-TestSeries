import React from 'react';
import Header from './Header';
import youtube from "../assests/youtube.svg";
import questionimg from "../assests/question.png";
import answered from "../assests/answered.png";
import correctimg from "../assests/correct.png";
import incorrect from "../assests/cross.png";
import score from "../assests/score.png";
import rank from "../assests/rank.png";
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import StudentResult from "../../services/studentResult";
import PaperService from '../../services/paper';
import SolutionPage from './SolutionPage';

const StudentReport = () => {
    const [studentId, setstudentId] = useState('shriya');
    const [orgId, setOrgId] = useState(1);
    const { testId } = useParams();
    const [allquestion, setAllquestion] = useState([]);
    const [filteredquestion, setFilteredQuestion] = useState([]);
    const [navbackground, setNavBackground] = useState('All');
    const [questions, setQuestions] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [correct, setCorrect] = useState(0);
    const [wrong, setWrong] = useState(0);
    const [notmarked, setNotMarked] = useState(0);
    const [totalscore, setTotalScore] = useState(0);
    const [markingScheme, setMarkingScheme] = useState({
        correct: 0,   // Default value 
        incorrect: 0, // Default value 
        unanswered: 0 // Default value 
    });

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await StudentResult.getstudentreports();
                console.log("Fetched Results:", response);
                let newdata = response.filter((items) => items.TestId === testId && items.StudentId === studentId)
                let totalmarks = newdata[0].TotalMarks
                setTotalScore(totalmarks)
                setAllquestion(newdata || [])
                setFilteredQuestion(newdata || [])

                let correctCount = 0;
                let wrongCount = 0;
                let unansweredCount = 0;

                // Calculate the correct, wrong, and total score based on the fetched data
                newdata.forEach((items) => {
                    if (items.Status === "Correct") {
                        correctCount += 1;
                    }
                    if (items.Status === "Wrong") {
                        wrongCount += 1;
                    }
                    else {
                        unansweredCount += 1;
                    }
                });

                setCorrect(correctCount);
                setWrong(wrongCount);
                setNotMarked(unansweredCount);

            } catch (err) {
                console.error(err);
            }
        };

        fetchResults();

    }, []);

    useEffect(() =>{
        const Questions = async () => {
            try {
                const response = await PaperService.getPapers(orgId);
                const allQuestions = response.results.map(result => result.questions).flat();

                const markingScheme = allQuestions.marking_scheme || {
                    correct: 4, // default values
                    incorrect: -1,
                    unanswered: 0
                };
                setMarkingScheme(markingScheme);
                setQuestions(allQuestions || []);
            } catch (err) {
                console.error(err);
            }
        };

        Questions();
    },[])

    const filterschedulepaper = (status) => {
        setNavBackground(status);
        if (status === "All") {
            setFilteredQuestion(allquestion)
        } else {
            const newdata = allquestion.filter((item) => item.Status === status);
            setFilteredQuestion(newdata);
        }
    }

    const Navigate = (url) => {
        window.open(url, "_blank");
    };

    // Handle button click to show the solution in the modal
    const handleSolutionClick = (question_text) => {
        const question = questions.find(item => item.question_text === question_text); 
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
            <div style={{ display: "flex", justifyContent: "space-between", margin: "10px", gap: "10px" }}>
                <p style={{ display: "flex",gap: "10px" }}>How to Analyse PAR Performance analysis report
                    <img
                        src={youtube}
                        alt="YouTube Icon"
                        onClick={() => Navigate("https://youtu.be/JKwqdl39sgY")}
                        style={{ height: "30px" }}
                    /></p>
                <Link to={`/resultchart/${testId}`}><button className='dashbtn' style={{ padding: "8px", borderRadius: "5px" }}>View performance graph</button></Link>

            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", border: "1px solid rgb(216, 216, 216)" }}>
                <div style={{
                    border: "1px solid rgb(216, 216, 216)", marginTop: "15px", marginBottom: "15px",
                    display: "flex", borderRadius: "10px", width: "100%", justifyContent: "space-around"
                }}>
                    <div style={{
                        display: "flex", flexDirection: "column", justifyContent: "center",
                        alignItems: "center", padding: "40px", gap: "5px"
                    }}>
                        <img
                            src={questionimg}
                            style={{ height: "60px" }}
                        />
                        <p style={{ fontSize: "40px" }}>{allquestion.length}</p>
                        <p>Questions</p>
                    </div>
                    <div style={{
                        display: "flex", flexDirection: "column", justifyContent: "center",
                        alignItems: "center", padding: "40px", gap: "5px"
                    }}>
                        <img
                            src={answered}
                            style={{ height: "60px" }}
                        />
                        <p style={{ fontSize: "40px" }}>{correct + wrong}</p>
                        <p>Answered</p>
                    </div>
                    <div style={{
                        display: "flex", flexDirection: "column", justifyContent: "center",
                        alignItems: "center", padding: "40px", gap: "5px"
                    }}>
                        <img
                            src={correctimg}
                            style={{ height: "60px" }}
                        />
                        <p style={{ fontSize: "40px" }}>{correct}</p>
                        <p>Correct</p>
                    </div>
                    <div style={{
                        display: "flex", flexDirection: "column", justifyContent: "center",
                        alignItems: "center", padding: "40px", gap: "5px"
                    }}>
                        <img
                            src={incorrect}
                            style={{ height: "60px" }}
                        />
                        <p style={{ fontSize: "40px" }}>{notmarked}</p>
                        <p>Unanswered</p>
                    </div>
                    <div style={{
                        display: "flex", flexDirection: "column", justifyContent: "center",
                        alignItems: "center", padding: "40px", gap: "5px"
                    }}>
                        <img
                            src={incorrect}
                            style={{ height: "60px" }}
                        />
                        <p style={{ fontSize: "40px" }}>{wrong}</p>
                        <p>InCorrect</p>
                    </div>
                    <div style={{
                        display: "flex", flexDirection: "column", justifyContent: "center",
                        alignItems: "center", padding: "40px", gap: "5px"
                    }}>
                        <img
                            src={score}
                            style={{ height: "60px" }}
                        />
                        <p style={{ fontSize: "40px" }}>{totalscore}</p>
                        <p>Total Score </p>
                    </div>
                    <div style={{
                        display: "flex", flexDirection: "column", justifyContent: "center",
                        alignItems: "center", padding: "40px", gap: "5px"
                    }}>
                        <img
                            src={rank}
                            style={{ height: "60px" }}
                        />
                        <p style={{ fontSize: "40px" }}>5</p>
                        <p>Rank</p>
                    </div>
                </div>

                <h4 style={{ textAlign: "center" }}>Paper Result: {testId}</h4>
                <div style={{ width: "100%", padding: "20px" }}>
                    {navbackground === 'All' ? <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", backgroundColor: "#1a3874", color: "white" }}>
                        <p onClick={() => filterschedulepaper('All')} className="schedulenav" style={{ backgroundColor: " #5EB252" }}>All Questions</p>
                        <p onClick={() => filterschedulepaper('Correct')} className="schedulenav" >Correct Questions</p>
                        <p onClick={() => filterschedulepaper('Wrong')} className="schedulenav" >Wrong Questions</p>
                    </div>
                        : navbackground === 'Correct' ? <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", backgroundColor: "#1a3874", color: "white" }}>
                            <p onClick={() => filterschedulepaper('All')} className="schedulenav" >All Questions</p>
                            <p onClick={() => filterschedulepaper('Correct')} className="schedulenav" style={{ backgroundColor: " #5EB252" }}>Correct Questions</p>
                            <p onClick={() => filterschedulepaper('Wrong')} className="schedulenav" >Wrong Questions</p>
                        </div>
                            : navbackground === 'Wrong' ? <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", backgroundColor: "#1a3874", color: "white" }}>
                                <p onClick={() => filterschedulepaper('All')} className="schedulenav" >All Questions</p>
                                <p onClick={() => filterschedulepaper('Correct')} className="schedulenav" >Correct Questions</p>
                                <p onClick={() => filterschedulepaper('Wrong')} className="schedulenav" style={{ backgroundColor: " #5EB252" }}>Wrong Questions</p>

                            </div>
                                : null

                    }

                    <table style={{ border: "1px solid rgb(216, 216, 216)", width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th style={{ padding: "15px" }}>Q No</th>
                                <th style={{ padding: "15px" }}>Exam type</th>
                                <th style={{ padding: "15px" }}>Test name</th>
                                <th style={{ padding: "15px" }}>Question</th>
                                <th style={{ padding: "15px" }}>Marks</th>
                                <th style={{ padding: "15px" }}>Status</th>
                                <th style={{ padding: "15px" }}>Time Taken</th>
                                <th style={{ padding: "15px" }}>View</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredquestion.map((items, index) => (
                                <tr style={{ border: "1px solid rgb(216, 216, 216)" }}>
                                    <td style={{ padding: "15px" }}>{index + 1}</td>
                                    <td style={{ padding: "15px" }}>{items.Examname}</td>
                                    <td style={{ padding: "15px" }}>N/A</td>
                                    <td style={{ padding: "15px" }}>{items.Question}</td>
                                    <td style={{ padding: "15px" }}>{items.Status === "Correct" ? items.Marks + "/" + items.Marks :  items.Marks}</td>
                                    <td style={{ padding: "15px" }}>{items.Status}</td>
                                    <td style={{ padding: "15px" }}>{items.TimeTaken}/{items.TestDuration}</td>
                                    <td style={{ padding: "15px" }}><button onClick={() => handleSolutionClick(items.Question)} className='dashbtn' style={{ padding: "8px", borderRadius: "5px" }}>Solution</button></td>
                                </tr>
                            ))}
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

export default StudentReport;