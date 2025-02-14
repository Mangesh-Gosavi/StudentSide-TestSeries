import React from 'react';
import Header from './Header';
import youtube from "../assests/youtube.svg";
import { useEffect, useState } from 'react';
import ScheduledPapers from "../../services/scheduledPaper";
import { Link } from 'react-router-dom';
import StudentResult from "../../services/studentResult";

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

    const filterschedulepaper = (status) =>{
        setNavBackground(status);
        const newdata = allpapers.filter((item)=> item.Status === status);
        setPapers(newdata);
        
        if (status === "Missed") {
            const newdata = allpapers.filter((item)=> item.Status === "Completed");
            // Extract TestId-StudentId pairs from completed tests (StudentResults)
            const completedTests = new Set(studentresult.map((item) => `${item.TestId}-${item.StudentId}`));
        
            // Filter papers that exist in Scheduled but NOT in completed tests
            const filteredData = newdata.filter(
                (item) => !completedTests.has(`${item.TestId}-${item.StudentId}`)
            );
        
            setPapers(filteredData);
        }

        if (status === "Completed") {
            const newdata = allpapers.filter((item)=> item.Status === "Completed");
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
        <div>
            <Header />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", border: "1px solid rgb(216, 216, 216)" }}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        color: "white",
                        backgroundColor: "#1a3874",
                        border: "1px solid rgb(216, 216, 216)",
                        marginTop: "10px",
                        width: "100%",
                        padding: "15px",
                    }}
                >
                    <h6>My Scheduled Tests</h6>
                    <div style={{ display: "flex", gap: "4px" }}>
                        <img
                            src={youtube}
                            alt="YouTube Icon"
                            onClick={() => Navigate("https://www.youtube.com/watch?v=6gx2mUZrur0")}
                            style={{ filter: "invert(1) brightness(2)", height: "30px" }}
                        />
                        <img
                            src={youtube}
                            alt="YouTube Icon"
                            onClick={() => Navigate("https://www.youtube.com/watch?v=u1fdAVVdAIc")}
                            style={{ filter: "invert(1) brightness(2)", height: "30px" }}
                        />
                    </div>
                </div>

                <div style={{ width: "100%", padding: "20px" }}>
                    {navbackground === 'Active' ? <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", backgroundColor: "#1a3874", color: "white" }}>
                        <p onClick={() => filterschedulepaper('Active')} className="schedulenav" style={{ backgroundColor: " #5EB252" }}>Active Test</p>
                        <p onClick={() => filterschedulepaper('Upcoming')} className="schedulenav" >Upcoming Test</p>
                        <p onClick={() => filterschedulepaper('Missed')} className="schedulenav" >Missed Test</p>
                        <p onClick={() => filterschedulepaper('Completed')} className="schedulenav">Completed Test</p>
                    </div>
                        : navbackground === 'Upcoming' ? <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", backgroundColor: "#1a3874", color: "white" }}>
                            <p onClick={() => filterschedulepaper('Active')} className="schedulenav" >Active Test</p>
                            <p onClick={() => filterschedulepaper('Upcoming')} className="schedulenav" style={{ backgroundColor: " #5EB252" }}>Upcoming Test</p>
                            <p onClick={() => filterschedulepaper('Missed')} className="schedulenav" >Missed Test</p>
                            <p onClick={() => filterschedulepaper('Completed')} className="schedulenav">Completed Test</p>
                        </div>
                            : navbackground === 'Missed' ? <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", backgroundColor: "#1a3874", color: "white" }}>
                                <p onClick={() => filterschedulepaper('Active')} className="schedulenav" >Active Test</p>
                                <p onClick={() => filterschedulepaper('Upcoming')} className="schedulenav" >Upcoming Test</p>
                                <p onClick={() => filterschedulepaper('Missed')} className="schedulenav" style={{ backgroundColor: " #5EB252" }}>Missed Test</p>
                                <p onClick={() => filterschedulepaper('Completed')} className="schedulenav">Completed Test</p>
                            </div>
                                : navbackground === 'Completed' ? <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", backgroundColor: "#1a3874", color: "white" }}>
                                    <p onClick={() => filterschedulepaper('Active')} className="schedulenav" >Active Test</p>
                                    <p onClick={() => filterschedulepaper('Upcoming')} className="schedulenav" >Upcoming Test</p>
                                    <p onClick={() => filterschedulepaper('Missed')} className="schedulenav" >Missed Test</p>
                                    <p onClick={() => filterschedulepaper('Completed')} className="schedulenav" style={{ backgroundColor: " #5EB252" }}>Completed Test</p>
                                </div> : null

                    }
                    <table style={{ border: "1px solid rgb(216, 216, 216)", width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th style={{ padding: "15px" }}>Sr.no</th>
                                <th style={{ padding: "15px" }}>Scheduled By</th>
                                <th style={{ padding: "15px" }}>TestId</th>
                                <th style={{ padding: "15px" }}>Test Start Time</th>
                                <th style={{ padding: "15px" }}>Test End Time</th>
                                <th style={{ padding: "15px" }}>Test Duration</th>
                                <th style={{ padding: "15px" }}>Paper Description</th>
                                <th style={{ padding: "15px" }}>Status</th>
                                <th style={{ padding: "15px" }}>Comments</th>
                                <th style={{ padding: "15px" }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {papers.length > 0 ? (
                                papers.map((item, index) => (
                                    <tr style={{ border: "1px solid rgb(216, 216, 216)" }}>
                                        <td style={{ gap: "10px", padding: "15px" }}>{index + 1}</td>
                                        <td style={{ padding: "15px" }}>{item.ScheduledBy}</td>
                                        <td style={{ padding: "15px" }}>{item.TestId}</td>
                                        <td style={{ padding: "15px" }}>{item.TestStartTime}</td>
                                        <td style={{ padding: "15px" }}>{item.TestEndTime}</td>
                                        <td style={{ padding: "15px" }}>{item.TestDuration}</td>
                                        <td style={{ padding: "15px" }}>{item.PaperDescription}</td>
                                        <td style={{ padding: "15px" }}>{item.Status}</td>
                                        <td style={{ padding: "15px" }}>{item.Comments}</td>
                                        {navbackground === "Active" ? <td style={{ padding: "15px" }}> <Link to={`/taketest/${item.TestId}?duration=${item.TestDuration}&description=${encodeURIComponent(item.PaperDescription)}`}><button className='dashbtn' style={{ padding: "8px", borderRadius: "5px" }}>Take Test</button></Link> </td> 
                                        : navbackground === "Completed" ? <td style={{ padding: "15px" }}> <Link to={`/studentreport/${item.TestId}`}><button className='dashbtn' style={{ padding: "8px", borderRadius: "5px" }}>View Report</button> </Link></td> 
                                        : navbackground === "Missed"  ? <td style={{ padding: "15px" }}> - </td> : null}
                                    </tr>
                                ))
                            ) : null}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Myscheduledtest;
