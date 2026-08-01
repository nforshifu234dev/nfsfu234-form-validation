import { ExceptionHandler } from "../errorHandling/ExceptionHandler";
import displayErrorInline from "../errorHandling/displayErrorInline";
import displayErrorModal from "../errorHandling/displayErrorModal";
import ErrorMessageInterface from "../interfaces/ErrorMessagesInterface";
import focusInputElement from "../utilities/focusInputElement";
import { getFieldRule } from "../config/formRegistry";

/**
 * Validates a checkbox input field.
 * @param {HTMLInputElement} checkboxInputField - The checkbox input field to validate.
 * @param {object} customErrorMessage - Custom error messages for checkbox validation.
 * @param {boolean} isErrorInline - Flag indicating whether to display the error message inline or in a modal.
 * @param {HTMLFormElement} form - The form element containing the checkbox input.
 * @returns {boolean} - Returns true if the checkbox input is valid or not required, otherwise false.
 */
function validateCheckbox(
    checkboxInputField: HTMLInputElement,
    options: any,
    callback?: any
): boolean  | ErrorMessageInterface {
    let individualResponseMessage: ErrorMessageInterface = { message: "", type: 'error', code : 400 };

    // Check if running in a browser environment
    if (typeof window === 'undefined') {
        console.error("To access this function, you will need to execute it in a browser like Google Chrome, Safari, Firefox, Microsoft Edge, etc.");
        ExceptionHandler("To access this function, you will need to execute it in a browser like Google Chrome, Safari, Firefox, Microsoft Edge, etc.")
        return false;
    }

    const form: HTMLFormElement | HTMLDivElement | undefined = options.form || undefined;
    const customErrorMessage: any = options.customErrorMessages || null;
    const errorType: string = options.errorType || 'inline'
    const includeHTML = options.includeHTML === false ? false : true;


    const fieldKey = checkboxInputField.getAttribute('name') || checkboxInputField.id || undefined;
    const fieldRule = form ? getFieldRule(form, fieldKey) : undefined;
    const isRequired: boolean = fieldRule?.required ?? (checkboxInputField.hasAttribute('required') || checkboxInputField.classList.contains('js-required'));

    const errorMessage: string = (customErrorMessage && customErrorMessage['checkbox'] && customErrorMessage['checkbox'] !== '') ?
    customErrorMessage['checkbox'] : 'You need to check this box';

    // Check if the input field is a checkbox
    if (checkboxInputField.getAttribute('type') !== 'checkbox') {
        return false; // Not a checkbox, return false
    }

    if ( ! includeHTML )
    {

        // Perform the validation for the select field
        if (isRequired && ! checkboxInputField.checked) {

            ExceptionHandler(errorMessage)

            individualResponseMessage.message = errorMessage;
            individualResponseMessage.data = checkboxInputField

            return individualResponseMessage; // Validation failed
        }

        return true;

    }

    if ( ! form )
    {

        individualResponseMessage.message = "The form you are trying to validate does not exist.";
        ExceptionHandler("The form you are trying to validate does not exist. 5765846846")
        return individualResponseMessage;

    }

    const shouldContinue: boolean[] = [];

    // If the checkbox is required and not checked
    if (isRequired && ! checkboxInputField.checked) {


        ExceptionHandler(errorMessage)

        individualResponseMessage.message = errorMessage;
        individualResponseMessage.data = checkboxInputField

        // Display the error message inline or in a modal based on the isErrorInline flag
        if (errorType === 'inline') {
            displayErrorInline(checkboxInputField, errorMessage, 3000);
        } else if (errorType === 'modal') {
            focusInputElement(checkboxInputField, 3000);
            displayErrorModal(errorMessage, form);
        }

        // shouldContinue.push(false); // Mark the validation as unsuccessful
        return individualResponseMessage; // Validation failed
    } else {
        // shouldContinue.push(true); // Mark the validation as successful
        return true; // Checkbox is valid or not required
    }

}

export default validateCheckbox;
