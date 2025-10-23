  /**
   * Sends an array of log strings to the specified PHP endpoint.
   *
   * @param id - The array of strings to log.
   * @param url - The URL of your save_log.php script.
   * @returns A promise that resolves to the server's JSON response.
   */
  export async function getLogs(id: string, url: string): Promise<string | null> {
    try {

      const response = await fetch(`${url}?r=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: string = await response.json();
      return data;

    } catch (error) {
      console.error("Failed to send logs:", error);
      return null;
    }
  }