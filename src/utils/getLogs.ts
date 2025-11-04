  /**
   * Sends an array of log strings to the specified PHP endpoint.
   *
   * @param id - The array of strings to log.
   * @param url - The URL of your save_log.php script.
   * @returns A promise that resolves to the server's JSON response.
   */
// Define a cache expiration time (e.g., 5 minutes in milliseconds)
const CACHE_EXPIRATION_MS = 5 * 60 * 1000;

/**
 * Fetches logs, utilizing localStorage for caching.
 *
 * @param id The ID for the request.
 * @param url The base URL for the log endpoint.
 * @returns A promise that resolves to an array of log strings or null on failure.
 */
export async function getLogs(id: string, url: string): Promise<string[] | null> {
    const cacheKey = `logs_cache_${id}`; // Unique key for this log request

    // 1. **Check Cache**
    try {
        const cachedItem = localStorage.getItem(cacheKey);

        if (cachedItem) {
            const { data, timestamp } = JSON.parse(cachedItem);
            const now = new Date().getTime();

            // Check if the cache is still valid
            if (now - timestamp < CACHE_EXPIRATION_MS) {
                console.log(`Cache hit for ${id}. Returning cached data.`);
                return data;
            } else {
                console.log(`Cache for ${id} expired. Clearing cache and refetching.`);
                localStorage.removeItem(cacheKey); // Clear expired cache
            }
        }
    } catch (e) {
        // Handle potential JSON parse error or localStorage issue
        console.error("Error accessing/parsing localStorage:", e);
        // Continue to fetch if cache reading fails
    }

    // 2. **Fetch Data if Cache Miss/Expired**
    try {
        const response = await fetch(`${url}?r=${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            alert("Failed to load report!");
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: string[] = await response.json();

        // 3. **Cache New Data**
        try {
            const cacheItem = JSON.stringify({
                data: data,
                timestamp: new Date().getTime(),
            });
            localStorage.setItem(cacheKey, cacheItem);
            console.log(`Successfully cached new data for ${id}.`);
        } catch (e) {
            // Handle potential localStorage QuotaExceededError or other write errors
            console.error("Error writing to localStorage:", e);
        }

        return data;

    } catch (error) {
        alert("Failed to load report!");
        return null;
    }
}