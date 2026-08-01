import getPageUrl from "./getPageUrl";

/**
 * Redirects the user to a specified URL, either immediately or after a specified delay.
 *
 * If the code is running in a browser environment, it uses window.location.href for redirection.
 * In a non-browser environment (e.g., Node.js console), it logs a message indicating the redirection.
 *
 * @param {string} [url=getPageUrl()] - An optional URL to which the user should be redirected.
 *                                           Defaults to the current page's URL if not provided.
 * @param {number} [delay=0] - An optional parameter to delay redirection in seconds.
 */
const redirect = (url: string | null = null , delay: number = 0) => {


    if ( ! url )
    {
        url = getPageUrl() as string;
    }

    // Check if the code is running in a browser environment
    if (typeof window !== 'undefined') {
        // Redirect in a browser environment after the specified delay
        setTimeout(() => {
            window.location.href = url;
        }, delay * 1000); // Convert seconds to milliseconds
    } else {
        // Running in a non-browser environment (e.g., Node.js console)
        console.log(`Redirecting to: ${url || 'current page'} (Delayed: ${delay} seconds)`);
    }

};

export default redirect;