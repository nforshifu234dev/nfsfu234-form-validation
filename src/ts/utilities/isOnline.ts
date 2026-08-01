const isOnline = (): boolean => {
    // Check if the code is running in a browser environment
    if (typeof window === 'undefined') {
        console.error(
            "You need to be in a browser environment like Google Chrome, Safari, Firefox, Microsoft Edge, etc. for this function to work."
        );
        return false;
    }

    // Check if the browser reports that it is online
    if (navigator.onLine) {
        return true;
    }

    // Return false if the browser is not online
    return false;
};

export default isOnline;