import React, { useState } from "react";
import StudentReports from "../../services/studentreports";

const ReportPopup = ({questionId, studentId, scheduledBy, testDuration, paperDescription, closePopup  }) => {
    const [report, setReport] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();  
        
        const reportData = {
            StudentId: studentId,
            ScheduledBy: scheduledBy,
            TestDuration: testDuration,
            PaperDescription: paperDescription,
            QuestionId: questionId,
            Report: report
        };

        try {
            const response = await StudentReports.addStudentReport(reportData); 
            if (response) {
                alert("Report submitted successfully!");
                closePopup();  
            }
        } catch (error) {
            console.error("Error submitting report:", error);
            alert("Failed to submit report.");
        }
    };


    const overlayStyle = {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    };

    const contentStyle = {
        background: "white",
        padding: "20px",
        borderRadius: "5px",
        width: "400px",
        textAlign: "center",
    };

    const actionsStyle = {
        display: "flex",
        justifyContent: "space-between",
        marginTop: "20px",
    };

    const buttonStyle = {
        padding: "10px 20px",
        cursor: "pointer",
        border: "none",
        borderRadius: "4px",
    };

    const submitButtonStyle = {
        ...buttonStyle,
        backgroundColor: "green",
        color: "white",
    };

    const closeButtonStyle = {
        ...buttonStyle,
        backgroundColor: "red",
        color: "white",
    };

    return (
        <div style={overlayStyle}>
            <div style={contentStyle}>
                <h2>Report for Question {questionId}</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Report:
                        <textarea
                            value={report}
                            onChange={(e) => setReport(e.target.value)}
                            required
                            placeholder="Describe the issue with this question"
                            style={{ width: "100%", height: "100px", marginBottom: "10px" }}
                        />
                    </label>
                    <div style={actionsStyle}>
                        <button
                            type="button"
                            onClick={closePopup}
                            style={closeButtonStyle}
                        >
                            Close
                        </button>
                        <button
                            type="submit"
                            style={submitButtonStyle}
                        >
                            Submit Report
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReportPopup;
