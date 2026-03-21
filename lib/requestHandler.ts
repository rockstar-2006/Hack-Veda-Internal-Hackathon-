/**
 * Request Handler Utility
 * Prevents requests from getting stuck with timeouts and error handling
 */

interface RequestOptions {
  timeout?: number;
  retries?: number;
}

/**
 * Wrapper function to handle fetch requests with timeout and retry logic
 * Prevents requests from getting stuck indefinitely
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit & RequestOptions = {}
): Promise<Response> {
  const { timeout = 10000, retries = 1, ...fetchOptions } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        const response = await fetch(url, {
          ...fetchOptions,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // If response is ok, return it
        if (response.ok) {
          return response;
        }

        // If response is error and it's not a retryable error, throw
        if (response.status >= 400 && response.status < 500) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        // For 5xx errors, allow retry
        if (attempt < retries) {
          lastError = new Error(`HTTP ${response.status}: ${response.statusText}`);
          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }

        return response;
      } catch (error) {
        clearTimeout(timeoutId);
        if (error instanceof Error && error.name === "AbortError") {
          lastError = new Error(`Request timeout after ${timeout}ms`);
          if (attempt < retries) {
            const delay = Math.pow(2, attempt) * 1000;
            await new Promise((resolve) => setTimeout(resolve, delay));
            continue;
          }
        }
        throw error;
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt === retries) {
        throw lastError;
      }
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw (
    lastError || new Error("Request failed after all retries")
  );
}

/**
 * Cleanup function to ensure no dangling requests
 * Call this on page transitions or unmount
 */
export function cleanupRequests() {
  // This helps prevent memory leaks from pending requests
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("cleanup-requests"));
  }
}
