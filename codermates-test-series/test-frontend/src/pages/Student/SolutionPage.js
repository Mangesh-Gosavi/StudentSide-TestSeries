import React from "react";
import "./SolutionPage.css"; 

const SolutionPage = ({ isOpen, onClose, questionData }) => { 
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="modal-title">Solution for Question</h3>
        <h5>{questionData.question_text}</h5> 

        <div className="options-section">
          <p><strong>Options:</strong></p>
          <ul>
            <li>A: {questionData.options.A}</li> 
            <li>B: {questionData.options.B}</li>
            <li>C: {questionData.options.C}</li>
            <li>D: {questionData.options.D}</li>
          </ul>
        </div>

        <p><strong>Correct Answer:</strong> {questionData.correct_answer}</p>

        <p><strong>Solution:</strong></p>
        <p>{questionData.explain || "Solution not available."}</p>

        <button onClick={onClose} className="close-button">Close</button>  
      </div>
    </div>
  );
};

export default SolutionPage;
