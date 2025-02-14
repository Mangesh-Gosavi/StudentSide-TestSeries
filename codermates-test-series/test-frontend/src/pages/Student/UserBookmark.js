import React, { useEffect, useState } from 'react';
import Header from './Header';
import BookmarkedQuestion from "../../services/bookmarkQuestion";
import { Link } from 'react-router-dom';
import "./UserBookmark.css"

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
        <div style={{width:"100%"}}>
            <div className='dashboard'>
                <Header />
                <div className="filter-container">
                    <div className="filter-header">
                        <h6>Filter</h6>
                    </div>
                    <div className="filter-options">
                        <div className="filter-option">
                            <h6>Subject</h6>
                            <select onChange={(e) => { setSubject(e.target.value) }} className="filter-select">
                                <option value="">Choose Subject Name</option>
                                {[...new Set(markquestions.map(item => item.Subject))].map((subject, index) => {
                                    return <option key={index} value={subject}>{subject}</option>;
                                })}
                            </select>
                        </div>

                        <div className="filter-option">
                            <h6>Chapter</h6>
                            <select onChange={(e) => { setChapter(e.target.value) }} className="filter-select">
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
                            </select>
                        </div>

                        <div className="filter-buttons">
                            <button onClick={() => HandleSearch()} className="dashbtn">Search</button>
                            <button onClick={() => Reset()} className="reset-btn">Reset</button>
                        </div>
                    </div>
                </div>

                <div className="bookmarked-questions">
                    <div className="bookmarked-header">
                        <p>Bookmarked Questions</p>
                    </div>
                    <table className="questions-table">
                        <thead>
                            <tr>
                                <th>Sr.no</th>
                                <th>Test Id</th>
                                <th>Test Date Time</th>
                                <th>Bookmark Date Time</th>
                                <th>Subject</th>
                                <th>Chapter</th>
                                <th>Comments</th>
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
                                        <Link to={`/bookmarkquestion/${item.Chapter}`}>
                                            <td>{item.Chapter}</td>
                                        </Link>
                                        <td>{item.Comments}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9">No questions available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <button className="dashbtn download-btn">Download csv</button>
                </div>
            </div>
        </div>
    );
};

export default UserBookmark;
