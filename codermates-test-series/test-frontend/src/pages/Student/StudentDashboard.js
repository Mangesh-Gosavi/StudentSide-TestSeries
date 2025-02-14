import React from 'react';
import Header from './Header';
import paper from "../assests/paper.svg"
import calender from "../assests/calender.svg"
import checks from "../assests/check.svg"
import trophy from "../assests/trophy.svg"
import clock from "../assests/clock.svg"
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import StudentResult from "../../services/studentResult";
import "./StudentDashBoard.css"

const StudentDashboard = () => {
    const studentID = 'shriya'
    const [result, setResult] = useState([])
    const [lastTest, setLastTest] = useState(null);
    const [obtainedMarks, setObtainedMarks] = useState(null);
    const [bestscore, setBestScore] = useState(null);


    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
            .toString().padStart(2, "0")}-${date.getFullYear()}`;
    };

    const formatTime = (isoString) => {
        const date = new Date(isoString);
        let hours = date.getHours();
        let minutes = date.getMinutes().toString().padStart(2, "0");
        let ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12; // Convert to 12-hour format
        return `${hours}:${minutes} ${ampm}`;
    };

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await StudentResult.getstudentreports();
                const filtereddata = response.filter((item) => item.StudentId === studentID)
                console.log("Fetched Results:", response);

                const lastTestObject = filtereddata[filtereddata.length - 1];
                setLastTest(lastTestObject);

                // Aggregate results by (StudentId, TestId)
                const aggregatedResults = {};

                filtereddata.forEach((data) => {
                    const key = `${data.StudentId}-${data.TestId}`;

                    if (!aggregatedResults[key]) {
                        aggregatedResults[key] = {
                            StudentId: data.StudentId,
                            TestId: data.TestId,
                            Examname: data.Examname,
                            TotalMarks: data.TotalMarks,
                            ObtainedMarks: data.ObtainedMarks,
                            TestDuration: data.TestDuration || 60,
                            Date: data.DateTime ? formatDate(data.DateTime) : "N/A",
                            Time: data.DateTime ? formatTime(data.DateTime) : "N/A",
                        };
                    }

                    const sortedResults = filtereddata.sort((a, b) => a.ObtainedMarks - b.ObtainedMarks);

                    // Set the last test as the best score (highest score after sorting)
                    const bestTest = sortedResults[sortedResults.length - 1];

                    setBestScore(bestTest);
                    setObtainedMarks(aggregatedResults[key].ObtainedMarks)
                });

                setResult(Object.values(aggregatedResults));
            } catch (err) {
                console.error(err);
            }
        };

        fetchResults();
    }, []);


    return (
        <div style={{width:"100%"}}>
            <div className='dashboard'>
                <Header />
                <div class="cards-container">
                    <div class="card">
                        <div class="card-header">
                            <img class="card-icon" src={paper} alt="paper" />
                            <h3>Tests</h3>
                        </div>
                        <h3>Total Test: {result.length}</h3>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <img class="card-icon" src={calender} alt="calendar" />
                            <h3>Last Attempt Date</h3>
                        </div>
                        <h3>{lastTest ? formatDate(lastTest.DateTime) : "N/A"}</h3>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <img class="card-icon" src={checks} alt="checks" />
                            <h3>Last Attempt Score</h3>
                        </div>
                        <h3>Total Marks : {obtainedMarks}</h3>
                    </div>

                    <div class="card card-best">
                        <div class="card-header">
                            <img class="card-icon" src={trophy} alt="trophy" />
                            <h3>Best Score</h3>
                        </div>
                        <h3>Total Marks : {bestscore ? `${bestscore.ObtainedMarks}` : 'N/A'}</h3>
                    </div>
                </div>

                <div class="results-container">
                    <div class="results-header">
                        <h6>Results of Shryea</h6>
                    </div>

                    <div class="results-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Test ID</th>
                                    <th>Date & Time</th>
                                    <th>Exam Type</th>
                                    <th>Score</th>
                                    <th>Test Duration</th>
                                    <th>View Syllabus</th>
                                    <th>View Report</th>
                                </tr>
                            </thead>
                            <tbody>
                                {result.map((data, index) => (
                                    <tr key={index}>
                                        <td>{data.TestId}</td>
                                        <td>
                                            <span><img class="icon" src={calender} /> {data.Date}</span>
                                            <span><img class="icon" src={clock} /> {data.Time}</span>
                                        </td>
                                        <td>{data.Examname}</td>
                                        <td>{data.ObtainedMarks} / {data.TotalMarks}</td>
                                        <td>{data.TestDuration}</td>
                                        <td>
                                            <button class="dashbtn">View Syllabus</button>
                                        </td>
                                        <td>
                                            <Link to={`/studentreport/${data.TestId}`}>
                                                <button class="dashbtn">Analysis</button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default StudentDashboard;
