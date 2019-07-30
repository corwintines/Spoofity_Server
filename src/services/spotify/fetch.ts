import fetch from 'node-fetch';
import { Response, RequestInit } from 'node-fetch';

/** Helper fetch method to handle spotify errors and responses */
export async function spotifyFetch(
  url: string,
  init?: RequestInit
): Promise<Response> {
  const result = await fetch(url, init);

  // TODO: should we automatically retry, or return the response to the client
  //   in order to communicate that with the end user?
  // Rate Limit
  if (result.status === 429) {
    // number of seconds that you need to wait
    const retryAfter = result.headers.get('Retry-After') as string;
    const retryAfterMs = parseInt(retryAfter) * 1000;

    console.log('Rate Limit Hit', retryAfter);

    await new Promise((resolve) => setTimeout(resolve, retryAfterMs));
    return await spotifyFetch(url, init);
  }

  return result;
}
