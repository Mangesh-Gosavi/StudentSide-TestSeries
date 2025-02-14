import React from 'react';
import Header from './Header';
import youtube from "../assests/youtube.svg";
import { useEffect, useState } from 'react';
import ScheduledPapers from "../../services/scheduledPaper";
import { Link } from 'react-router-dom';
import StudentResult from "../../services/studentResult";
import "./Myscheduletest.css"

const Myscheduledtest = () => {
    const [studentId, setstudentId] = useState('shriya');
    const [allpapers, setAllPapers] = useState([]);
    const [papers, setPapers] = useState([]);
    const [studentresult, setStudentResult] = useState([]);
    const [navbackground, setNavBackground] = useState('Active');

    useEffect(() => {
        const fetchScheduledPaper = async () => {
            try {
                const response = await ScheduledPapers.getscheduledpaper();
                let newdata = response.filter((items) => items.StudentId === studentId)
                setAllPapers(newdata || []);
                const data = response.filter((items) => items.Status === navbackground)
                setPapers(data)
            } catch (err) {
                console.error(err);
            }
        };

        const fetchResults = async () => {
            try {
                const response = await StudentResult.getstudentreports();
                console.log("Fetched Results:", response);
                let newdata = response.filter((items) => items.StudentId === studentId)
                setStudentResult(newdata || [])

            } catch (err) {
                console.error(err);
            }
        };
        fetchScheduledPaper();
        fetchResults();

    }, []);

    const filterschedulepaper = (status) => {
        setNavBackground(status);
        const newdata = allpapers.filter((item) => item.Status === status);
        setPapers(newdata);

        if (status === "Missed") {
            const newdata = allpapers.filter((item) => item.Status === "Completed");
            // Extract TestId-StudentId pairs from completed tests (StudentResults)
            const completedTests = new Set(studentresult.map((item) => `${item.TestId}-${item.StudentId}`));

            // Filter papers that exist in Scheduled but NOT in completed tests
            const filteredData = newdata.filter(
                (item) => !completedTests.has(`${item.TestId}-${item.StudentId}`)
            );

            setPapers(filteredData);
        }

        if (status === "Completed") {
            const newdata = allpapers.filter((item) => item.Status === "Completed");
            // Extract TestId-StudentId pairs from completed tests (StudentResults)
            const completedTests = new Set(studentresult.map((item) => `${item.TestId}-${item.StudentId}`));

            // Filter papers that exist in Scheduled but NOT in completed tests
            const filteredData = newdata.filter(
                (item) => completedTests.has(`${item.TestId}-${item.StudentId}`)
            );

            setPapers(filteredData);
        }

    }

    const Navigate = (url) => {
        window.open(url, "_blank");
    };

    return (
        <div style={{ width: "100%" }}>
            <div className='dashboard'>
                <Header />
                <div className="scheduled-tests-container">
                    <div className="scheduled-tests-header">
                        <h6>My Scheduled Tests</h6>
                        <div className="youtube-links">
                            <img
                                src={youtube}
                                alt="YouTube Icon"
                                onClick={() => Navigate("https://www.youtube.com/watch?v=6gx2mUZrur0")}
                            />
                            <img
                                src={youtube}
                                alt="YouTube Icon"
                                onClick={() => Navigate("https://www.youtube.com/watch?v=u1fdAVVdAIc")}
                            />
                        </div>
                    </div>

                    {/* Navigation for test categories */}
                    <div className="scheduled-tests-nav">
                        <p onClick={() => filterschedulepaper("Active")} className={navbackground === "Active" ? "active" : ""}>
                            Active Test
                        </p>
                        <p onClick={() => filterschedulepaper("Upcoming")} className={navbackground === "Upcoming" ? "active" : ""}>
                            Upcoming Test
                        </p>
                        <p onClick={() => filterschedulepaper("Missed")} className={navbackground === "Missed" ? "active" : ""}>
                            Missed Test
                        </p>
                        <p onClick={() => filterschedulepaper("Completed")} className={navbackground === "Completed" ? "active" : ""}>
                            Completed Test
                        </p>
                    </div>

                    <table className="scheduled-tests-table">
                        <thead>
                            <tr>
                                <th>Sr.no</th>
                                <th>Scheduled By</th>
                                <th>Test Id</th>
                                <th>Test Start Time</th>
                                <th>Test End Time</th>
                                <th>Test Duration</th>
                                <th>Paper Description</th>
                                <th>Status</th>
                                <th>Comments</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {papers.length > 0 ? (
                                papers.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.ScheduledBy}</td>
                                        <td>{item.TestId}</td>
                                        <td>{item.TestStartTime}</td>
                                        <td>{item.TestEndTime}</td>
                                        <td>{item.TestDuration}</td>
                                        <td>{item.PaperDescription}</td>
                                        <td>{item.Status}</td>
                                        <td>{item.Comments}</td>
                                        <td>
                                            {navbackground === "Active" ? (
                                                <Link to={`/taketest/${item.TestId}?duration=${item.TestDuration}&description=${encodeURIComponent(item.PaperDescription)}`}>
                                                    <button className="dashbtn">Take Test</button>
                                                </Link>
                                            ) : navbackground === "Completed" ? (
                                                <Link to={`/studentreport/${item.TestId}`}>
                                                    <button className="dashbtn">View Report</button>
                                                </Link>
                                            ) : navbackground === "Missed" ? (
                                                "-"
                                            ) : null}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="10" className="no-tests">No scheduled tests available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Myscheduledtest;
