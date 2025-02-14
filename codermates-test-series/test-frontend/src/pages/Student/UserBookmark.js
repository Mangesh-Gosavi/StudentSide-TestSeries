import React, { useEffect, useState } from 'react';
import Header from './Header';
import BookmarkedQuestion from "../../services/bookmarkQuestion";
import { Link } from 'react-router-dom';

const UserBookmark = () => {
    const [subject, setSubject] = useState("");
    const [chapter, setChapter] = useState("");
    const [allmarkquestions, setAllMarkQuestions] = useState([]);
    const [markquestions, setMarkQuestions] = useState([]);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await BookmarkedQuestion.getbookmarkQuestions();
                console.log(response);
                const uniqueChapters = [];
                const uniqueQuestions = response.filter((question) => {
                    if (!uniqueChapters.includes(question.Chapter)) {
                        uniqueChapters.push(question.Chapter);
                        return true;
                    }
                    return false;
                });
                setMarkQuestions(uniqueQuestions || [])
                setAllMarkQuestions(uniqueQuestions || [])
            } catch (err) {
                console.error(err);
            }
        };

        fetchQuestions();
    }, []);

    const HandleSearch = () => {
        const newarray = markquestions.filter((item) => item.Chapter === chapter && item.Subject === subject)
        setMarkQuestions(newarray)
    }

    const Reset = () => {
        setMarkQuestions(allmarkquestions)
    }


    return (
        <div>
            <Header />
            <div style={{ width: "100%", padding: "20px" }}>
                <div style={{ display: "flex", background: "#1a3874", color: "white", borderRadius: "5px", border: "1px solid rgb(216, 216, 216)", marginTop: "10px", padding: "9px" }}>
                    <h6>Filter</h6>
                </div>
                <div style={{ display: "grid", alignItems: "center", gridTemplateColumns: "repeat(auto-fit , 400px)", gap: "10px" }}>

                    <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "20px" }}>
                        <h6>Subject</h6>
                        <select onChange={(e) => { setSubject(e.target.value) }}
                            style={{ height: "40px", width: "300px", border: "1px solid #D3D3D3", borderRadius: "6px", marginTop: "5px" }}>
                            <option value="">Choose Subject Name</option>
                            {[...new Set(markquestions.map(item => item.Subject))].map((subject, index) => {
                                return <option key={index} value={subject}>{subject}</option>;
                            })}
                        </select><br></br>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "20px" }}>
                        <h6>Chapter</h6>
                        <select onChange={(e) => { setChapter(e.target.value) }}
                            style={{ height: "40px", width: "300px", border: "1px solid #D3D3D3", borderRadius: "6px", marginTop: "5px" }}>
                            <option value="">Choose Chapter Name</option>
                            {[...new Set(
                                markquestions
                                    .filter(item => item.Subject === subject)
                                    .map(item => item.Chapter)
                            )].map((chapter, index) => (
                                <option key={index} value={chapter}>
                                    {chapter}
                                </option>
                            ))}
                        </select><br></br>
                    </div>

                    <div style={{ display: "flex", height: "max-content", gap: "10px" }}>
                        <button onClick={() => HandleSearch()} className='dashbtn' style={{ padding: "4px", borderRadius: "5px" }}>Search</button>
                        <button onClick={() => Reset()} style={{ padding: "8px", backgroundColor: "#BB2124", borderRadius: "5px" }}>Reset</button>
                    </div>
                </div>

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
                                <th style={{ padding: "15px" }}>Chapter</th>
                                <th style={{ padding: "15px" }}>Comments</th>
                                <th style={{ padding: "15px" }}>View Question</th>
                                <th style={{ padding: "15px" }}>View Test Report</th>
                            </tr>
                        </thead>
                        <tbody style={{ cursor: "pointer" }}>
                            {markquestions.length > 0 ? (
                                markquestions.map((item, index) => (
                                    <tr key={index} style={{ border: "1px solid rgb(216, 216, 216)" }}>
                                        <td style={{ gap: "10px", padding: "15px" }}>{index + 1}</td>
                                        <td style={{ padding: "15px" }}>{item.TestId}</td>
                                        <td style={{ padding: "15px" }}>{item.TestDateTime}</td>
                                        <td style={{ padding: "15px" }}>{item.BookmarkDateTime}</td>
                                        <td style={{ padding: "15px" }}>{item.Subject}</td>
                                        <Link to={`/bookmarkquestion/${item.Chapter}`} key={index}><td style={{ padding: "15px" }}>{item.Chapter}</td></Link>
                                        <td style={{ padding: "15px" }}>{item.Comments}</td>
                                        <td style={{ padding: "15px" }}> - </td>
                                        <td style={{ padding: "15px" }}> - </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" style={{ textAlign: "center", padding: "15px" }}>No questions available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <button className='dashbtn' style={{ padding: "8px", borderRadius: "5px", marginTop: "10px" }}>Download csv</button>
                </div>
            </div>
        </div>
    );
};

export default UserBookmark;
