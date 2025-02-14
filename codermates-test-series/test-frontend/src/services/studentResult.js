import API_BASE_URL from './config';

class StudentResult {
    static async getstudentreports() {
        try {
          const response = await fetch(
            `${API_BASE_URL}/user_management/results/`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
    
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch questions');
          }
    
          return await response.json();
          
        } catch (error) {
          console.error("Error fetching questions:", error);
          throw error;
        }
      }

      static async submitTestResult(submissionData) {
        try {
            const response = await fetch(`${API_BASE_URL}/user_management/results/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submissionData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to submit test results');
            }

            return await response.json();
        } catch (error) {
            console.error("Error submitting test results:", error);
            throw error;
        }
    }
}

export default StudentResult;
