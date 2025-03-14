import React, { useEffect, useState } from "react";
import API_BASE_URL from "../../services/config";
import Header from "./Header";
import "./BooksPage.css";

const BooksPage = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const fetchBooks = async () => {
            const response = await fetch(`${API_BASE_URL}/user_management/studymaterial/`);
            const data = await response.json();
            setBooks(data);
        };

        fetchBooks();
    }, []);

    return (
        <div style={{ width: "100%" }}>
            <div className='dashboard'>
                <Header />
                <div className="books-container">
                    <h1 className="heading">Available Books</h1>
                    <div className="books-grid">
                        {books.map((book, index) => (
                            <div key={index} className="book-card">
                                <h2 className="book-subject">{book.Subject}</h2>
                                <p className="book-name">{book.Name}</p>
                                <a href={book.Url} target="_blank" rel="noopener noreferrer" className="book-link">
                                    Open Book
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BooksPage;
