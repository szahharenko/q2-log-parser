// Define a type for the expected server response
interface LogResponse {
    status: 'success' | 'error';
    message: string;
  }

  // Define the shape of the data we are sending
  interface LogPayload {
    lines: string[];
  }

  /**
   * Sends an array of log strings to the specified PHP endpoint.
   *
   * @param logs - The array of strings to log.
   * @param url - The URL of your save_log.php script.
   * @returns A promise that resolves to the server's JSON response.
   */
  export async function sendLogs(logs: string[], url: string): Promise<LogResponse> {
    try {
      // --- NEW: Create the payload object ---
      const payload: LogPayload = {
        lines: logs
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // --- NEW: Stringify the payload object, not just the array ---
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: LogResponse = await response.json();
      return data;

    } catch (error) {
      console.error("Failed to send logs:", error);
      if (error instanceof Error) {
        return { status: 'error', message: error.message };
      }
      return { status: 'error', message: 'An unknown error occurred.' };
    }
  }