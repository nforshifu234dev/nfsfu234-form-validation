import { checkVariableType } from "../utilities";
import displayErrorInline from "../errorHandling/displayErrorInline";
import displayErrorModal from "../errorHandling/displayErrorModal";
import focusInputElement from "../utilities/focusInputElement";
import { ExceptionHandler } from "../errorHandling/ExceptionHandler";
import ErrorMessageInterface from "../interfaces/ErrorMessagesInterface";
import { getFieldRule } from "../config/formRegistry";
/**
 * Validates a select field.
 * @param {HTMLSelectElement} selectField - The select element to validate.
 * @param {object} customErrorMessage - Custom error message for select validation.
 * @param {HTMLElement} form - The form element associated with the select. Default is undefined.
 * @param {boolean} isErrorInline - Whether to display error inline or in a modal. Default is false.
 * @returns {boolean} - Returns true if validation succeeds, otherwise false.
 */
const validateSelect = (
    selectField: HTMLSelectElement,
    options: any,
    callback?: any
): boolean | ErrorMessageInterface => {

    let individualResponseMessage: ErrorMessageInterface = { message: "", type: 'error', code : 400 };


    // Check if running in a browser environment
    if (typeof window === 'undefined') {
        console.error("To access this function, you will need to execute it in a browser like Google Chrome, Safari, Firefox, Microsoft Edge, etc.");
        ExceptionHandler("To access this function, you will need to execute it in a browser like Google Chrome, Safari, Firefox, Microsoft Edge, etc.")
        return false;
    }

    // Check if the select field is valid and exists in the DOM
    if (!selectField) {
        console.error("The select element to validate is not found.");
        return false;
    }

    if ( checkVariableType(options) !== 'object' )
    {
        ExceptionHandler("options are not provided");
        return false;
    }

    const isErrorInline: string = options.error_type || options.errorType || 'inline';
    const customErrorMessages: any = options.customErrorMessages || [];
    const form: HTMLFormElement | HTMLDivElement | undefined = options.form || undefined;
    const includeHTML = options.includeHTML === false ? false : true;

    // Determine if the select field is required based on the 'required' attribute, or the config rule if set
    const fieldKey = selectField.getAttribute('name') || selectField.id || undefined;
    const fieldRule = form ? getFieldRule(form, fieldKey) : undefined;
    const isRequired: boolean = fieldRule?.required ?? (selectField.hasAttribute('required') || selectField.classList.contains('js-required'));

    // Check if the select field has a value selected
    const selectValue: string = selectField.value.trim();

    
    // Determine the error message for select validation
    let errorMessage: string = customErrorMessages?.select || "You have to select an option.";

    if ( ! includeHTML )
    {

        // Perform the validation for the select field
        if (isRequired && !selectValue) {

            ExceptionHandler(errorMessage)

            individualResponseMessage.message = errorMessage;
            individualResponseMessage.data = selectField

            return individualResponseMessage; // Validation failed
        }

        return true;

    }

    if ( ! form )
    {

        individualResponseMessage.message = "The form you are trying to validate does not exist.";
        ExceptionHandler("The form you are trying to validate does not exist.")
        return individualResponseMessage;

    }




    // Perform the validation for the select field
    if (isRequired && !selectValue) {

        ExceptionHandler(errorMessage)

        individualResponseMessage.message = errorMessage;
        individualResponseMessage.data = selectField

        // If the select field is required and no value is selected, show the error message
        if (isErrorInline) {
            displayErrorInline(selectField, errorMessage, 3000);
        } else {
            focusInputElement(selectField, 3000);
            displayErrorModal(errorMessage, form);
        }
        return individualResponseMessage; // Validation failed
    }

    individualResponseMessage.code = 200
    individualResponseMessage.data = null
    individualResponseMessage.message = "success"
    individualResponseMessage.type = "success"

    // Validation succeeded
    return true;
};

export default validateSelect;
