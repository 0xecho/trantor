import environment from './env'
import { browser } from '$app/environment';

/**
 * Wraps the given fetch implementation to have an absolute base url, returns a fetch function that can accept url paths
 * @param {URL} baseUrl - the url to prefix all requests with 
 * @param {Fetch} fetch - the fetch implementation to wrap
 * @returns 
 */
export function fetchAbsolute (baseUrl: URL, fetch: WindowOrWorkerGlobalScope['fetch']) {
  return async (url: string, ...args: RequestInit[]) => {
    return fetch(new URL(url, baseUrl).href, ...args);
  }
}

// Apologizing for ssr: serverside not having window.fetch
export const fetchApi = browser ? fetchAbsolute(environment.PUBLIC_BASE_URL!, fetch) : fetch;
export const customFetchApi = (fetch: WindowOrWorkerGlobalScope['fetch']) => fetchAbsolute(environment.PUBLIC_BASE_URL!, fetch);