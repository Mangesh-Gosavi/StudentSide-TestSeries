import API_BASE_URL from './config';

class ScheduledPapers {
    static async getscheduledpaper() {
        try {
          const response = await fetch(
            `${API_BASE_URL}/user_management/scheduledpaper/`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
    
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch scheduledpaper');
          }
    
          return await response.json();
          
        } catch (error) {
          console.error("Error fetching scheduledpaper:", error);
          throw error;
        }
      }

    //   static async addbookmarkquestion(questiondata, organizationId ,marks) {
    //     // Add organizationId to the request body
    //     const payload = { ...questiondata, organizationId, marks };
    
    //     try {
    //         const response = await fetch(`${API_BASE_URL}/user_management/bookmarkquestion/`, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify(payload),
    //         });
    
    //         if (!response.ok) {
    //             const errorData = await response.json();
    //             throw new Error(errorData.error || "Failed to create paper");
    //         }
    
    //         return await response.json();
    //     } catch (error) {
    //         console.error("Error in paper creation:", error);
    //         throw error;
    //     }
    // }
    
}

export default ScheduledPapers;
