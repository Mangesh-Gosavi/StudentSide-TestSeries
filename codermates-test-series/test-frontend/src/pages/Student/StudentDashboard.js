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
        <div>
            <Header />
            <div style={{ display: "flex", justifyContent: "center", gap: "5px", marginTop: "10px" }}>
                <div style={{ border: "1px solid rgb(216, 216, 216)", padding: "40px", borderRadius: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <img style={{ height: "25px", fill: "grey" }} src={paper} />
                        <h3>Tests</h3>
                    </div>
                    <h3>Total Test: {result.length}</h3>
                </div>

                <div style={{ border: "1px solid rgb(216, 216, 216)", padding: "40px", borderRadius: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <img style={{ height: "25px", fill: "grey" }} src={calender} />
                        <h3>Last Attempt Date</h3>
                    </div>
                    <h3>{lastTest ? formatDate(lastTest.DateTime) : "N/A"}</h3>
                </div>

                <div style={{ border: "1px solid rgb(216, 216, 216)", padding: "40px", borderRadius: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <img style={{ height: "25px", fill: "grey" }} src={checks} />
                        <h3>Last Attempt Score</h3>
                    </div>
                    <h3>Total Marks : {obtainedMarks}</h3>
                </div>

                <div style={{ backgroundColor: "#5EB252", border: "1px solid rgb(216, 216, 216)", padding: "40px", borderRadius: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <img style={{ height: "25px", fill: "grey" }} src={trophy} />
                        <h3>Best Score</h3>
                    </div>
                    <h3>Total Marks : {bestscore ? `${bestscore.ObtainedMarks}` : 'N/A'}</h3>
                </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ border: "1px solid rgb(216, 216, 216)", marginTop: "10px", width: "85%", padding: "9px" }}>
                    <h6>Results of Shryea</h6>
                </div>

                <div style={{ border: "1px solid rgb(216, 216, 216)", marginTop: "10px", width: "85%", padding: "9px" }}>
                    <table style={{ width: "100%" }}>
                        <thead style={{ backgroundColor: "#1a3874", color: "white" }}>
                            <th style={{ padding: "15px" }}>Test ID</th>
                            <th style={{ padding: "15px" }}>Date & Time</th>
                            <th style={{ padding: "15px" }}>Exam Type</th>
                            <th style={{ padding: "15px" }}>Score</th>
                            <th style={{ padding: "15px" }}>Test Duration</th>
                            <th style={{ padding: "15px" }}>View Syllabus</th>
                            <th style={{ padding: "15px" }}>View Report </th>
                        </thead>
                        <tbody>
                            {result.map((data, index) => (
                                <tr key={index} style={{ border: "1px solid rgb(216, 216, 216)" }}>
                                    <td style={{ padding: "15px" }}>{data.TestId}</td>
                                    <td style={{ display: "flex", gap: "5px", padding: "15px" }}>
                                        <span>
                                            <img style={{ height: "20px", fill: "grey" }} src={calender} /> {data.Date}
                                        </span>
                                        <span>
                                            <img style={{ height: "20px", fill: "grey" }} src={clock} /> {data.Time}
                                        </span>
                                    </td>
                                    <td style={{ padding: "15px" }}>{data.Examname}</td>
                                    <td style={{ padding: "15px" }}>{data.ObtainedMarks} / {data.TotalMarks}</td>
                                    <td style={{ padding: "15px" }}>{data.TestDuration}</td>
                                    <td style={{ padding: "15px" }}>
                                        <button className='dashbtn' style={{ padding: "8px", borderRadius: "5px" }}>View Syllabus</button>
                                    </td>
                                    <td style={{ padding: "15px" }}>
                                        <Link to={`/studentreport/${data.TestId}`}>
                                            <button className='dashbtn' style={{ padding: "8px", borderRadius: "5px" }}>Analysis</button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
