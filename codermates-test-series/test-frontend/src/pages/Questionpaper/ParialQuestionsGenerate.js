import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function PartialQuestionGenerate() {
  const navigate = useNavigate();
  const [filters1, setFilters1] = useState({
    exam: '',
    subject: [],
    area: [],
    chapter: [],
    topic: [],
    difficulty: '',
  });

  const [dropdownOptions, setDropdownOptions] = useState({
    subjects: [],
    areas: [],
    chapters: [],
    topics: [],
  });

  const [filters, setFilters] = useState({
    exam: '',
    subject: [],
    area: [],
    chapter: [],
    topic: [],
    // difficulty: '',
  });

  const [organizationId, setOrganizationId] = useState('');
  const [numberOfQuestions, setNumberOfQuestions] = useState(4);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [examDetails, setExamDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [examName, setExamName] = useState('');
  const [examDuration, setExamDuration] = useState('');
  const [low, setLow] = useState(20);
  const [medium, setMedium] = useState(20);
  const [high, setHigh] = useState(60);

   // Fetch orgId from localStorage
    useEffect(() => {
      const orgId = localStorage.getItem('orgId');
      if (orgId) {
        setOrganizationId(orgId);
      } else {
        setError('Organization ID not found. Please log in again.');
      }
    }, []);
  

  // Fetch subjects and related options when the exam changes
  useEffect(() => {
    const fetchSubjects = async () => {
      if (filters1.exam) {
        try {
          const response = await axios.get('http://127.0.0.1:8000/api/multi-select-dropdown/', {
            params: { exam: filters1.exam },
          });
          setDropdownOptions({
            subjects: response.data.subjects || [],
            areas: [],
            chapters: [],
            topics: [],
          });
        } catch (err) {
          console.error('Error fetching subjects:', err);
        }
      }
    };
    fetchSubjects();
  }, [filters1.exam]);
  
  useEffect(() => {
    const fetchAreas = async () => {
        if (filters1.subject.length > 0) {
            try {
                const params = {
                    exam: filters1.exam,
                    subject: filters1.subject, // Axios will format it correctly
                };

                const response = await axios.get('http://127.0.0.1:8000/api/multi-select-dropdown/', {
                    params: params,
                    paramsSerializer: (params) => {
                        return new URLSearchParams(params).toString();
                    }
                });

                setDropdownOptions((prev) => ({
                    ...prev,
                    areas: response.data.areas || [],
                    chapters: [],
                    topics: [],
                }));
            } catch (err) {
                console.error('Error fetching areas:', err);
            }
        }
    };

    fetchAreas();
}, [filters1.subject]); // ✅ Runs when subject changes

  
useEffect(() => {
    const fetchChapters = async () => {
        if (filters1.area.length > 0) {
            try {
                const params = {
                    exam: filters1.exam,
                    subject: filters1.subject,
                    area: filters1.area, // Ensure this is properly serialized
                };

                const response = await axios.get('http://127.0.0.1:8000/api/multi-select-dropdown/', {
                    params: params,
                    paramsSerializer: (params) => {
                        return new URLSearchParams(params).toString();
                    }
                });

                setDropdownOptions((prev) => ({
                    ...prev,
                    chapters: response.data.chapters || [],
                    topics: [],
                }));
            } catch (err) {
                console.error('Error fetching chapters:', err);
            }
        }
    };

    fetchChapters();
}, [filters1.area]); // ✅ Runs when area changes

  
useEffect(() => {
    const fetchTopics = async () => {
        if (filters1.chapter.length > 0) {
            try {
                const params = {
                    exam: filters1.exam,
                    subject: filters1.subject,
                    area: filters1.area,
                    chapter: filters1.chapter, // Ensure this is properly serialized
                };

                const response = await axios.get('http://127.0.0.1:8000/api/multi-select-dropdown/', {
                    params: params,
                    paramsSerializer: (params) => {
                        return new URLSearchParams(params).toString();
                    }
                });

                setDropdownOptions((prev) => ({
                    ...prev,
                    topics: response.data.topics || [],
                }));
            } catch (err) {
                console.error('Error fetching topics:', err);
            }
        }
    };

    fetchTopics();
}, [filters1.chapter]); // ✅ Runs when chapter changes

useEffect(() => {
  setFilters((prevFilters) => ({
    ...prevFilters,
    exam: filters1.exam, 
  }));
}, [filters1.exam]);


  const handleChange = async (e) => {
    const { name, value } = e.target;

    if (e.target.multiple) {
      const options = Array.from(e.target.selectedOptions, (option) => option.value);
      setFilters1((prev) => ({
        ...prev,
        [name]: options,
      }));
    } else {
      setFilters1((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleNumberChange = (e) => {
    setNumberOfQuestions(Number(e.target.value));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    const examdetails = {
      org_id: organizationId,
      exam_name: examName,  // example: "Science Exam"
      exam_duration: examDuration, // example: "38 minutes"
      Low: low,  // example: 20
      Medium: medium,  // example: 20
      High: high,  // example: 60
      filters: {
        exam: filters.exam, // example: "JEE"
        subject: filters.subject, // example: ["Mathematics", "Physics", "Chemistry"]
        area: filters.area, // example: ["Algebra", "Algebras", "Organic Chemistry"]
        chapter: filters.chapter, // example: ["Linear Equations", "Linear Equations", "Polymers"]
        topic: filters.topic, // example: ["Solving Linear Equations", "Solving Linear Equations", "Types of Polymers"]
      },
      number_of_questions: numberOfQuestions,  // example: 12
    };

    console.log(examdetails)
 
    try {
      const response = await axios.post('http://localhost:8000/partial-question-management/filter-questions/', examdetails);
      console.log(response.data); 
      setExamDetails(response.data);
      setQuestions(response.data?.questions || []);
    } catch (err) {
      setError('Failed to fetch questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  const handleCheckboxChange = (question) => {
    if (selectedQuestions.includes(question)) {
      setSelectedQuestions(selectedQuestions.filter((q) => q !== question));
    } else {
      setSelectedQuestions([...selectedQuestions, question]);
    }
  };

  // const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);

  const handleReviewClick = () => {
    // Navigate with ExamDetails stored in state
    if (examDetails) {
        navigate('/review-partial-question', { state: { ExamDetails: examDetails } });
    } else {
        setError('Exam details are not available.');
    }
};

  // const handleDeleteQuestion = (questionToDelete) => {
  //   setSelectedQuestions(selectedQuestions.filter(q => q !== questionToDelete));
  // };

  const handleSelectItem = (item, field) => {
    // Automatically deselect the previous filter when a new filter is selected
    if (field === 'chapter') {
      // When selecting chapter, clear subjects, areas, and topics
      setFilters1(prev => ({
        ...prev,
        subject: [], // Clear subject
        area: [], // Clear area
        topic: [], // Clear topic
        chapter: [item] // Select the new chapter
      }));
    } else if (field === 'area') {
      // When selecting area, clear subjects and chapters
      setFilters1(prev => ({
        ...prev,
        subject: [], // Clear subject
        chapter: [], // Clear chapter
        area: [item], // Select the new area
      }));
    } else if (field === 'subject') {
      // When selecting subject, clear areas, chapters, and topics
      setFilters1(prev => ({
        ...prev,
        area: [], // Clear area
        chapter: [], // Clear chapter
        topic: [], // Clear topic
        subject: [item], // Select the new subject
      }));
    } else {
      // For other fields (like topic or difficulty), just update that field
      setFilters1(prev => ({
        ...prev,
        [field]: [item] // Select the new value
      }));
    }
    setFilters(prev => ({
      ...prev,
      [field]: prev[field].includes(item) ? prev[field] : [...prev[field], item], // Append item to filters if not already present
    }));
  };

  const handleRemoveItem = (item, field) => {
    setFilters1(prev => ({
      ...prev,
      [field]: prev[field].filter(i => i !== item)
    }));
  };

  const handleRemoveItemFromFilters = (item, field) => {
    setFilters(prev => ({
      ...prev,
      [field]: prev[field].filter(i => i !== item) // Remove the item from the array for the given field
    }));
  };
  

// const handleFilterChange = (filterType, value) => {
//   setFilters1(prevFilters => {
//     // Check if the filter already exists, if it does, update it, otherwise add a new filter
//     const existingFilterIndex = prevFilters.findIndex(filter => filter.type === filterType);
//     if (existingFilterIndex >= 0) {
//       const updatedFilters = [...prevFilters];
//       updatedFilters[existingFilterIndex] = { type: filterType, value };
//       return updatedFilters;
//     }
    
//     // If filter doesn't exist, add it
//     return [...prevFilters, { type: filterType, value }];
//   });
// };

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Left Column: Form */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-primary text-white">Generate Partial Question Paper</div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              

              <form onSubmit={handleSubmit}>

                <div className="mb-3">
                  <label className="form-label">Exam Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={examName}
                    onChange={(e) => setExamName(e.target.value)}
                    placeholder="Enter Exam Name"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Exam Duration</label>
                  <input
                    type="text"
                    className="form-control"
                    value={examDuration}
                    onChange={(e) => setExamDuration(e.target.value)}
                    placeholder="Enter Exam Duration"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Low Difficulty (%)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={low}
                    onChange={(e) => setLow(Number(e.target.value))}
                    placeholder="Low Difficulty"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Medium Difficulty (%)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={medium}
                    onChange={(e) => setMedium(Number(e.target.value))}
                    placeholder="Medium Difficulty"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">High Difficulty (%)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={high}
                    onChange={(e) => setHigh(Number(e.target.value))}
                    placeholder="High Difficulty"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Exam</label>
                  <select
                    className="form-control"
                    name="exam"
                    value={filters1.exam}
                    onChange={handleChange}
                  >
                    <option value="">Select Exam</option>
                    {['JEE', 'NEET', 'MHT CET'].map((exam) => (
                      <option key={exam} value={exam}>{exam}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Subject</label>
                  <div className="d-flex flex-wrap">
                    {dropdownOptions.subjects.map((subject) => (
                      <button
                        type="button"
                        key={subject}
                        className={`btn btn-outline-primary m-1 ${filters1.subject.includes(subject) ? 'active' : ''}`}
                        onClick={() => handleSelectItem(subject, 'subject')}
                      >
                        {subject}
                        {filters1.subject.includes(subject) && (
                          <span
                            className="ml-2"
                            style={{ cursor: 'pointer', fontSize: '18px' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveItem(subject, 'subject');
                            }}
                          >
                            &times;
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Area</label>
                  <div className="d-flex flex-wrap">
                    {dropdownOptions.areas.map((area) => (
                      <button
                        type="button"
                        key={area}
                        className={`btn btn-outline-primary m-1 ${filters1.area.includes(area) ? 'active' : ''}`}
                        onClick={() => handleSelectItem(area, 'area')}
                      >
                        {area}
                        {filters1.area.includes(area) && (
                          <span
                            className="ml-2"
                            style={{ cursor: 'pointer', fontSize: '18px' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveItem(area, 'area');
                            }}
                          >
                            &times;
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Chapter</label>
                  <div className="d-flex flex-wrap">
                    {dropdownOptions.chapters.map((chapter) => (
                      <button
                        type="button"
                        key={chapter}
                        className={`btn btn-outline-primary m-1 ${filters1.chapter.includes(chapter) ? 'active' : ''}`}
                        onClick={() => handleSelectItem(chapter, 'chapter')}
                      >
                        {chapter}
                        {filters1.chapter.includes(chapter) && (
                          <span
                            className="ml-2"
                            style={{ cursor: 'pointer', fontSize: '18px' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveItem(chapter, 'chapter');
                            }}
                          >
                            &times;
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Topic</label>
                  <div className="d-flex flex-wrap">
                    {dropdownOptions.topics.map((topic) => (
                      <button
                        type="button"
                        key={topic}
                        className={`btn btn-outline-primary m-1 ${filters1.topic.includes(topic) ? 'active' : ''}`}
                        onClick={() => handleSelectItem(topic, 'topic')}
                      >
                        {topic}
                        {filters1.topic.includes(topic) && (
                          <span
                            className="ml-2"
                            style={{ cursor: 'pointer', fontSize: '18px' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveItem(topic, 'topic');
                            }}
                          >
                            &times;
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Number of Questions</label>
                  <input
                    type="number"
                    className="form-control"
                    value={numberOfQuestions}
                    onChange={handleNumberChange}
                  />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Loading...' : 'Generate Questions'}
                </button>
              </form>
            </div>
          </div>
        </div>
      {/* Right Column: Selected Filters and Selected Questions */}
      <div className="col-md-6">
        <div className="card">
          <div className="card-header bg-success text-white">Selected Filters and Questions</div>
          <div className="card-body">
            {/* Display Selected Filters */}
            <div>
              <h5>Selected Filters</h5>
              <ul>
                {Object.entries(filters).map(([key, value]) => (
                  value.length > 0 && (
                    <li key={key}>
                      <strong>{key.charAt(0).toUpperCase() + key.slice(1)}: </strong>
                      {Array.isArray(value) ? (
                        value.map((item, idx) => (
                          <span key={idx}>
                            {item}
                            <span
                              style={{ cursor: 'pointer', marginLeft: '10px', fontSize: '18px' }}
                              onClick={() => handleRemoveItemFromFilters(item, key)} // Pass item and key separately
                            >
                              &times;
                            </span>
                          </span>
                        ))
                      ) : (
                        value
                      )}
                    </li>
                  )
                ))}
              </ul>
            </div>

            {/* Display Selected Questions */}
            <div>
              <h5>Selected Questions</h5>
              <ul className="list-group">
              {questions.map((question, index) => (
                <li
                  key={index}
                  className={`list-group-item d-flex justify-content-between align-items-center question-box ${selectedQuestions.includes(question) ? 'selected' : ''}`}
                  onClick={() => handleCheckboxChange(question)}
                >
                  <div className="w-75">
                    <strong>{index + 1}. Question:</strong> {question.question_text} <br />
                    <strong>Options:</strong>
                    <ul>
                      <li>A: {question.options.A}</li>
                      <li>B: {question.options.B}</li>
                      <li>C: {question.options.C}</li>
                      <li>D: {question.options.D}</li>
                    </ul>
                  </div>
                  <div className="d-flex flex-column align-items-end">
                    <div>
                      <strong>Question Type:</strong> {question.question_type} <br />
                      <strong>Difficulty:</strong> {question.difficulty} <br />
                      <strong>Correct Answer:</strong> {question.correct_answer}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            {selectedQuestions.length > 0 && (
              <button
                className="btn btn-success mt-3"
                onClick={handleModalShow}
              >
                Preview Selected Questions
              </button>
            )}
        </div>

            

            {/* Option to review questions */}
            <button onClick={handleReviewClick} className="btn btn-warning mt-3">
              Review Selected Questions
            </button>
          </div>
        </div>
    </div>
       
    </div>
  </div>
  );
}
