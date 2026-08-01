import displayErrorInline from "./displayErrorInline";
import displayErrorModal from "./displayErrorModal";

/**
 * Display an error message in the specified manner.
 *
 * @param {Object} details - The details of the error message.
 * @param {string} details.type - The type of error display (either 'inline' or 'modal').
 * @param {string} details.message - The error message to be displayed.
 * @param {number} details.duration - The duration for which the error message should be visible.
 * @param {HTMLElement} details.element - The HTML element to which the error message is associated.
 * @param {boolean} [details.success=false] - A flag indicating whether the operation was successful.
 * @returns {boolean} Returns true if the error message was displayed successfully, false otherwise.
 */
const displayError = (details: {
    type: string;
    message: string;
    duration: number;
    element: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    success?: boolean;
}): boolean => {
    // Destructure the details object
    const { type, message, duration, element, success = false } = details;

    // Check if the element is a valid HTML element
    if (!(element instanceof HTMLElement)) {
        console.error("The HTML Element you are trying to use is not found.");
        return false;
    }

    // Set the 'position' property of 'element' to 'relative'
    element.style.position = 'relative';

    // Determine the type of error display and invoke the appropriate function
    if (type === 'inline') {
        displayErrorInline(element, message, duration, success);
    } else if (type === 'modal') {
        displayErrorModal(message, element, '', duration, success);
    } else {
        // Display an error message for unsupported error display types
        console.error("The type of error display you specified is not supported.");
        return false;
    }

    return true;
};


export default displayError;