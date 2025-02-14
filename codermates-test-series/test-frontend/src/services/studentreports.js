import API_BASE_URL from './config';

class StudentReports {
    static async getstudentreports() {
        try {
          const response = await fetch(
            `${API_BASE_URL}/user_management/studentreports/`,
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

    static async addStudentReport(reportData) {
      try {
          const response = await fetch(
              `${API_BASE_URL}/user_management/studentreports/`,  
              {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(reportData), 
              }
          );

          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || 'Failed to submit student report');
          }

          return await response.json(); 
      } catch (error) {
          console.error("Error submitting student report:", error);
          throw error;
      }
  }
    
}

export default StudentReports;
