import API_BASE_URL from './config';

class PaperService {
    static async getPapers(orgId) {
        try {
          const response = await fetch(
            `${API_BASE_URL}/api/exams/${orgId}`,
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
    
}

export default PaperService;
