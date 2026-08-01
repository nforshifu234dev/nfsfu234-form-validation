import { ExceptionHandler } from "../errorHandling/ExceptionHandler";
import ErrorMessageInterface from "../interfaces/ErrorMessagesInterface";
import { areAllElementsTrue } from "../utilities";

/**
 * Retrieves data from the provided form element.
 * Collects data from input fields, textareas, and select elements with the specified attribute 'data-attr-name'.
 * The collected data is stored in an object with attribute names as keys and corresponding input values as values.
 * @param {HTMLFormElement | HTMLDivElement | string} u_form - The HTML form element or its ID from which to extract data.
 * @returns {Object | boolean} - Returns an object containing form data if successful, or false if the form is not valid or no data is found.
 */
const getFormDetails = (u_form: HTMLFormElement | HTMLDivElement | string): Record<string, string | boolean> | boolean | ErrorMessageInterface => {
    let individualResponseMessage: ErrorMessageInterface = { message: "", type: 'error', code : 400 };

    // Check if running in a browser environment
    if (typeof window === 'undefined') {
        console.error("To access this function, you will need to execute it in a browser like Google Chrome, Safari, Firefox, Microsoft Edge, etc.");
        ExceptionHandler("To access this function, you will need to execute it in a browser like Google Chrome, Safari, Firefox, Microsoft Edge, etc.");
        return false;
    }
    

    // Check if the form element is provided
    if ( ! u_form )
    {

        individualResponseMessage.message = "The form you are trying to validate does not exist.";
        ExceptionHandler("The form you are trying to validate does not exist.")
        return individualResponseMessage;

    }

    // Resolve form element by ID if it's a string
    const form = typeof u_form === 'string' ? document.getElementById(u_form) : u_form;
    
    // Check if the form element is provided
    if ( ! form )
    {

        individualResponseMessage.message = "The form you are trying to validate does not exist.";
        ExceptionHandler("The form you are trying to validate does not exist.");
        return individualResponseMessage;

    }

    const requestData: Record<string, string | boolean> = {}; // Initialize object to store form data
    const shouldContinue: boolean[] = []; // Track extraction process success

    // Extract data from input fields
    const allInputsInForm = form.querySelectorAll('input');
    allInputsInForm.forEach((input: HTMLInputElement, index: number) => {
        const attributeName = input.getAttribute('data-attr-name') || input.getAttribute('name') || index;
        let inputValue: string | boolean = input.value;

        // Handle checkbox inputs
        if (input.type === 'checkbox') {
            inputValue = input.checked;
        }

        // Handle radio inputs
        if (input.type === 'radio') {
            if (input.checked) {
                inputValue = true;
            } else {
                return; // Skip unchecked radio buttons
            }
        }

        requestData[attributeName] = inputValue; // Store input value in requestData
        shouldContinue.push(true);
    });

    // Extract data from textareas
    const allTextareasInForm = form.querySelectorAll('textarea');
    allTextareasInForm.forEach((textarea: HTMLTextAreaElement, index: number) => {
        const attributeName = textarea.getAttribute('data-attr-name') || textarea.getAttribute('name') || index;
        const textareaValue = textarea.value;

        requestData[attributeName] = textareaValue; // Store textarea value in requestData
        shouldContinue.push(true);
    });

    // Extract data from select elements
    const allSelectsInForm = form.querySelectorAll('select');
    allSelectsInForm.forEach((select: HTMLSelectElement, index: number) => {
        const attributeName = select.getAttribute('data-attr-name') || select.getAttribute('name') || index;
        const selectValue = select.value;

        requestData[attributeName] = selectValue; // Store select value in requestData
        shouldContinue.push(true);
    });

    // Check if all elements in the form extraction process were successful
    if (areAllElementsTrue(shouldContinue)) {
        return requestData; // Return the object containing the form data
    } else {
        return false; // Return false if any part of the form extraction process failed
    }
};

export default getFormDetails;
