// import axios from 'axios';

// export const fetchFilteredQuestions = async (filters, numberOfQuestions) => {
//   try {
//     const response = await axios.post('http://127.0.0.1:8000/api/filter-questions/', {
//       filters,
//       number_of_questions: numberOfQuestions,
//     });
//     return response.data.questions || [];
//   } catch (err) {
//     throw new Error("Failed to load questions. Please try again later.");
//   }
// };

// import axios from 'axios';

// export const fetchFilteredQuestions = async (filters, numberOfQuestions) => {
//   if (typeof filters !== 'object' || typeof numberOfQuestions !== 'number') {
//     throw new Error("Invalid input parameters. Filters should be an object and numberOfQuestions should be a number.");
//   }

//   try {
//     const response = await axios.post('http://127.0.0.1:8000/api/filter-questions/', {
//       filters,
//       number_of_questions: numberOfQuestions,
//     }, {
//       timeout: 10000, // Set a timeout of 10 seconds for the request
//     });

//     return response.data.questions || [];
//   } catch (err) {
//     // Handle network or other errors
//     console.error('Error fetching filtered questions:', err);
//     throw new Error("Failed to load questions. Please try again later.");
//   }
// };

import axios from 'axios';

export const fetchFilteredQuestions = async (filters, numberOfQuestions) => {
  if (typeof filters !== 'object' || typeof numberOfQuestions !== 'number') {
    throw new Error("Invalid input parameters. Filters should be an object and numberOfQuestions should be a number.");
  }

  const cleanedFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => value) 
  );

  try {
    const response = await axios.post('http://127.0.0.1:8000/api/filter-questions/', {
      filters: cleanedFilters,  
      number_of_questions: numberOfQuestions,
    }, {
      timeout: 10000, 
    });

    return response.data.questions || [];
  } catch (err) {
    console.error('Error fetching filtered questions:', err);
    throw new Error("Failed to load questions. Please try again later.");
  }
};
