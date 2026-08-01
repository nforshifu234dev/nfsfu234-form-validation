import { ExceptionHandler } from "../errorHandling/ExceptionHandler";

const getPageUrl = ():string | boolean => {

    if ( typeof window === 'undefined' )
    {
        ExceptionHandler('This function only works in a broswer environment...');
        return false;
    }

    // Access the 'window' object and retrieve the current URL using 'window.location.href'.
    // This will return the complete URL, including the protocol (http/https), domain, port, path, and query parameters.
    return window.location.href;
};

export default getPageUrl;