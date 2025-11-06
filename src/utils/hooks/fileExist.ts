import { useState, useEffect } from 'react';

interface UseCheckUrlExistsReturn {
  /** True if the URL exists (returns a 2xx status), false or null otherwise */
  exists: boolean | null;
  /** True while the check is in progress */
  isLoading: boolean;
  /** Stores any error object encountered during the fetch */
  error: any;
}

/**
 * A custom React hook to check if a remote URL (like a .zip file) exists
 * by sending a HEAD request.
 *
 * @param url The URL to check.
 * @returns An object with the loading state, error, and existence status.
 */
export const useCheckUrlExists = (url: string): UseCheckUrlExistsReturn => {
  const [exists, setExists] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    // Prevent fetching if the URL is empty
    if (!url) {
      setExists(false);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const checkUrl = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(url, {
          method: 'HEAD',
          signal: signal,
        });

        // response.ok is true if the status code is in the 200-299 range.
        // This indicates the resource was found.
        setExists(response.ok);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          // A network error, CORS error, or 404 (if not handled by .ok)
          setError(err);
          setExists(false);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkUrl();

    // Cleanup: abort the fetch request if the component unmounts
    return () => {
      controller.abort();
    };
  }, [url]); // Re-run the effect if the URL changes

  return { exists, isLoading, error };
};