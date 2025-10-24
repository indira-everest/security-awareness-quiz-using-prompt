export async function withRetry<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  args: T,
  retries = 3,
  delayMs = 5000
): Promise<R> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn(...args);
    } catch (error: any) {
      const isOverloadError =
        error.message?.includes("503") ||
        error.message?.includes("UNAVAILABLE") ||
        error.message?.includes("overloaded");

      if (isOverloadError && attempt < retries) {
        console.warn(
          `⚠️ Model overloaded (attempt ${attempt}/${retries}). Retrying in ${
            delayMs / 1000
          }s...`
        );
        await new Promise((res) => setTimeout(res, delayMs * attempt));
      } else {
        throw error;
      }
    }
  }
  throw new Error("Exceeded maximum retry attempts");
}
