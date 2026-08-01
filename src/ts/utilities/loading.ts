import { ExceptionHandler } from "../errorHandling/ExceptionHandler";
import ErrorMessageInterface from "../interfaces/ErrorMessagesInterface";
import checkVariableType from "../utilities/checkVariableType";

/**
 * Changes the content of a button or input element to a specified message while providing loading feedback.
 * @param {string} message - The message to set as the content of the button or input element.
 * @param {string | HTMLElement | null} submitBtn - The button or input element to update.
 * @param {string | HTMLElement | null} form - The HTML form element or its ID.
 * @returns {boolean} Returns true if the operation is successful, false if the button is not found.
 */
const loading = (message: string, submitBtn: string | HTMLElement | null = null, form: string | HTMLElement | null = null): boolean | ErrorMessageInterface => {
    let btn: HTMLElement | null = null; // Initialize btn to null
    let individualResponseMessage: ErrorMessageInterface = { message: "error", type: 'error', code : 400 };


    // Check the type of submitBtn and find the corresponding element
    if (checkVariableType(submitBtn) === 'HTML Element') {
        btn = submitBtn as HTMLElement;
    } else if (typeof submitBtn === 'string') {
        btn = document.getElementById(submitBtn);
    } else if (submitBtn === null && form) {
        // Attempt to find a suitable button element if submitBtn is null
        const formElement = typeof form === 'string' ? document.getElementById(form) : form;
        if (formElement instanceof HTMLFormElement || formElement instanceof HTMLDivElement) {
            btn = formElement.querySelector('button[type="submit"], input[type="submit"], #jsSubmit, input[type="search"], button');
        }
    } else {
        // Handle the case where the button is not found
        // console.error("The button element specified is not found.");
        individualResponseMessage.message = "The button element specified is not found.";
        ExceptionHandler(individualResponseMessage.message)
        return individualResponseMessage;
    }

    if (!btn) {
        individualResponseMessage.message = "The button element specified is not found.";
        ExceptionHandler(individualResponseMessage.message)
        return individualResponseMessage;
    }

    // Update the content of the button with the provided message
    if (btn) {
        if (btn.tagName.toLowerCase() === 'input') {
            (btn as HTMLInputElement).value = message;
        } else {
            btn.innerHTML = message;
        }
        return true;
    }

    individualResponseMessage.message = "The button element specified is not found.";
    ExceptionHandler(individualResponseMessage.message)
    return individualResponseMessage;
};

export default loading;
