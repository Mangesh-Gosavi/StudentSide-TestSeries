const SolutionPage = ({ isOpen, onClose, questionData }) => {
  if (!isOpen) return null;  // Don't render the modal if it's not open

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <h3 style={{textAlign:"center"}}>Solution for Question</h3><br></br>
        <h5>{questionData.question_text}</h5> 

        <div>
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

        <button onClick={onClose} style={buttonStyle}>Close</button>  
      </div>
    </div>
  );
};

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const modalContentStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '5px',
  maxWidth: '600px',
  width: '80%',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
};

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#1a3874',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

export default SolutionPage;
