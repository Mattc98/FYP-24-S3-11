export interface Feedback {
    RoomID: number;
    UserID: number;
    Feedback: string;
  }
  
  export async function submitFeedback(feedback: Feedback): Promise<boolean> {
    try {
      const response = await fetch('/api/submitFeedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedback),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      return false;
    }
  }