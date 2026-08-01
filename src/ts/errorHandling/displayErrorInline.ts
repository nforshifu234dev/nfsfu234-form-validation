import focusInputElement from "../utilities/focusInputElement";

/**
 * displayErrorInline
 * 
 * This function displays an error message inline next to an input field on a login page.
 * The error message is shown for a specified duration and can also be a success message.
 * 
 * @param {HTMLElement} inputField - The input field element where the error message will be displayed.
 * @param {string} message - The error message to be displayed.
 * @param {number} duration - The duration (in milliseconds) for which the error message is visible inline. Default: 3000 ms.
 * @param {boolean} isSuccess - A flag indicating if the message is a success message (true) or an error message (false). Default: false.
 */
const displayErrorInline = (inputField: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, message: string, duration: number = 3000, isSuccess: boolean = false) => {

    if ( ! inputField )
    {
        return false;
    }

    // Focus on the input field and temporarily highlight it using the _focusInputElement function.
    focusInputElement(inputField, duration);

    // Create the inline error message container element.
    const errorMessageContainer = document.createElement('div');
    errorMessageContainer.classList.add('js-inline-message');

    // Set the error message content inside the container.
    errorMessageContainer.innerHTML = message;

    const parentNode = inputField.parentNode;

    if ( ! parentNode )
    {
        return false;
    }

    // Append the error message container to the parent of the input tag, placing it inline next to the input field.
    parentNode.appendChild(errorMessageContainer);

    // Add the 'text-success' class to the container if it's a success message, making it visually distinct.
    if (isSuccess) {
        
        errorMessageContainer.classList.add('text-success');
    }

    // After the specified duration, remove the error message container to hide the message.
    setTimeout(() => {
        parentNode.removeChild(errorMessageContainer);
    }, duration);
}

export default displayErrorInline;