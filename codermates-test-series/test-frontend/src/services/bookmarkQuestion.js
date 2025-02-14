import API_BASE_URL from './config';

class BookmarkedQuestion {
    static async getbookmarkQuestions() {
        try {
          const response = await fetch(
            `${API_BASE_URL}/user_management/bookmarkquestion/`,
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

    static async addbookmarkquestion(questiondata) {
      const payload = {
          StudentId: questiondata.StudentId,
          TestId: questiondata.TestId,
          Subject: questiondata.Subject,
          TestDateTime: questiondata.TestDateTime,
          BookmarkDateTime: new Date().toISOString(),  
          Chapter: questiondata.Chapter,
          QuestionId: questiondata.QuestionId,
          Comments: questiondata.Comments || "", 
      };
  
      try {
          const response = await fetch(`${API_BASE_URL}/user_management/bookmarkquestion/`, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
          });
  
          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || "Failed to bookmark question");
          }
  
          return await response.json();
      } catch (error) {
          console.error("Error bookmarking question:", error);
          throw error;
      }
  }
    
    
}

export default BookmarkedQuestion;
