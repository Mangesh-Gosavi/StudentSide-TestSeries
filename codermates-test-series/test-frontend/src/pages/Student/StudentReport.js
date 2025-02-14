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
import "./StudentReport.css"

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
                let totalmarks = newdata[0].ObtainedMarks
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

    useEffect(() => {
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
    }, [])

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
        <div style={{width:"100%"}}>
            <div className='dashboard'>
                <Header />
                <div className="test-header">
                    <p className="analysis-text">
                        How to Analyse PAR Performance analysis report
                        <img
                            src={youtube}
                            alt="YouTube Icon"
                            className="youtube-icon"
                            onClick={() => Navigate("https://youtu.be/JKwqdl39sgY")}
                        />
                    </p>
                    <Link to={`/resultchart/${testId}`}>
                        <button className="dashbtn">View performance graph</button>
                    </Link>
                </div>

                <div className="test-summary">
                    <div className="summary-container">
                        {[{ img: questionimg, value: allquestion.length, label: "Questions" },
                        { img: answered, value: correct + wrong, label: "Answered" },
                        { img: correctimg, value: correct, label: "Correct" },
                        { img: incorrect, value: notmarked, label: "Unanswered" },
                        { img: incorrect, value: wrong, label: "Incorrect" },
                        { img: score, value: totalscore, label: "Total Score" },
                        { img: rank, value: 5, label: "Rank" }].map((item, index) => (
                            <div className="summary-box" key={index}>
                                <img src={item.img} alt={item.label} className="summary-img" />
                                <p className="summary-value">{item.value}</p>
                                <p className="summary-label">{item.label}</p>
                            </div>
                        ))}
                    </div>

                    <h4 className="result-title">Paper Result: {testId}</h4>

                    <div className="nav-container">
                        <p onClick={() => filterschedulepaper('All')} className={`schedulenav ${navbackground === 'All' ? 'active' : ''}`}>All Questions</p>
                        <p onClick={() => filterschedulepaper('Correct')} className={`schedulenav ${navbackground === 'Correct' ? 'active' : ''}`}>Correct Questions</p>
                        <p onClick={() => filterschedulepaper('Wrong')} className={`schedulenav ${navbackground === 'Wrong' ? 'active' : ''}`}>Wrong Questions</p>
                    </div>

                    <table className="result-table">
                        <thead>
                            <tr>
                                <th>Q No</th>
                                <th>Exam type</th>
                                <th>Test name</th>
                                <th>Question</th>
                                <th>Marks</th>
                                <th>Status</th>
                                <th>Time Taken</th>
                                <th>View</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredquestion.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.Examname}</td>
                                    <td>N/A</td>
                                    <td>{item.Question}</td>
                                    <td>{item.Status === "Correct" ? `${item.Marks}/${item.Marks}` : item.Marks}</td>
                                    <td>{item.Status}</td>
                                    <td>{item.TimeTaken}/{item.TestDuration}</td>
                                    <td><button onClick={() => handleSolutionClick(item.Question)} className="solution-btn">Solution</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <SolutionPage isOpen={modalIsOpen} onClose={closeModal} questionData={selectedQuestion} />
            </div>
        </div>
    );
};

export default StudentReport;