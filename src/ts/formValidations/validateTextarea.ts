import { checkVariableType } from "../utilities";
import displayErrorInline from "../errorHandling/displayErrorInline";
import displayErrorModal from "../errorHandling/displayErrorModal";
import focusInputElement from "../utilities/focusInputElement";
import { ExceptionHandler } from "../errorHandling/ExceptionHandler";
import ErrorMessageInterface from "../interfaces/ErrorMessagesInterface";
import { getFieldRule } from "../config/formRegistry";
import checkFieldRuleConstraints from "../utilities/checkFieldRuleConstraints";

/**
 * Validates a textarea field.
 * @param {HTMLTextAreaElement} textareaField - The textarea element to validate.
 * @param {object} customErrorMessage - Custom error message for textarea validation.
 * @param {boolean} isErrorInline - Whether to display error inline or in a modal. Default is false.
 * @param {HTMLElement} form - The form element associated with the textarea. Default is undefined.
 * @returns {boolean} - Returns true if validation succeeds, otherwise false.
 */
const validateTextarea = (
    textareaField: HTMLTextAreaElement,
    options: any,
    callback?: any
): boolean | string | ErrorMessageInterface => {

    let individualResponseMessage: ErrorMessageInterface = { message: "", type: 'error', code : 400 };

    // Check if running in a browser environment
    if (typeof window === 'undefined') {
        console.error("To access this function, it must be executed in a browser environment.");
        ExceptionHandler("To access this function, you will need to execute it in a browser like Google Chrome, Safari, Firefox, Microsoft Edge, etc.")
        return false;
    }


    // Check if the textarea element is valid and exists in the DOM
    if ( ! textareaField )
    {

        individualResponseMessage.message = "The form you are trying to validate does not exist.";
        ExceptionHandler("The form you are trying to validate does not exist.")
        // failureReturnMessage.push(individualResponseMessage)
        return individualResponseMessage;

    }

    if ( checkVariableType(options) !== 'object' )
    {
        ExceptionHandler("options are not provided");

        individualResponseMessage.message = "options are not provided";

        return individualResponseMessage;
    }

    const isErrorInline: string = options.error_type || options.errorType || 'inline';
    const customErrorMessages: any = options.customErrorMessages || [];
    const form: HTMLFormElement | HTMLDivElement | undefined = options.form || undefined;
    const includeHTML = options.includeHTML === false ? false : true;

    const fieldKey = textareaField.getAttribute('name') || textareaField.id || undefined;
    const fieldRule = form ? getFieldRule(form, fieldKey) : undefined;

    // Determine if the textarea is required based on the 'required' attribute, or the config rule if set
    const isRequired: boolean = fieldRule?.required ?? (textareaField.hasAttribute('required') || textareaField.classList.contains('js-required'));

    // Check if the textarea value is empty
    const textareaValue: string = textareaField.value.trim();

    // Determine the error message for textarea validation
    let errorMessage: string = customErrorMessages?.textarea || "Textarea cannot be left empty.";

    if ( ! includeHTML )
    {

        // Perform the validation for the select field
        if (isRequired && ! textareaValue) {

            ExceptionHandler(errorMessage)

            individualResponseMessage.message = errorMessage;
            individualResponseMessage.data = textareaField

            return individualResponseMessage; // Validation failed
        }

        const constraintError = checkFieldRuleConstraints(textareaValue, fieldRule);
        if (constraintError) {
            individualResponseMessage.message = constraintError;
            individualResponseMessage.data = textareaField;
            ExceptionHandler(constraintError);
            return individualResponseMessage;
        }

        return true;

    }

    if ( ! form )
    {

        individualResponseMessage.message = "The form you are trying to validate does not exist.";
        ExceptionHandler("The form you are trying to validate does not exist.")
        // failureReturnMessage.push(individualResponseMessage)
        return individualResponseMessage;

    }

    // Perform the validation for the textarea
    if (isRequired && ! textareaValue) {

        ExceptionHandler(errorMessage)

        individualResponseMessage.message = errorMessage;
        individualResponseMessage.data = textareaField

        // If the textarea is required and has no value, show the error message
        if (isErrorInline === 'inline') {
            displayErrorInline(textareaField, errorMessage, 3000);
        } else {
            focusInputElement(textareaField, 3000);
            displayErrorModal(errorMessage, form);
        }


        return individualResponseMessage; // Validation failed
    }

    const constraintError = checkFieldRuleConstraints(textareaValue, fieldRule);
    if (constraintError) {
        individualResponseMessage.message = constraintError;
        individualResponseMessage.data = textareaField;

        if (isErrorInline === 'inline') {
            displayErrorInline(textareaField, constraintError, 3000);
        } else {
            focusInputElement(textareaField, 3000);
            displayErrorModal(constraintError, form);
        }

        ExceptionHandler(constraintError);
        return individualResponseMessage;
    }

    individualResponseMessage.code = 200
    individualResponseMessage.data = null
    individualResponseMessage.message = "success"
    individualResponseMessage.type = "success"

    // Validation succeeded
    return true;
};

export default validateTextarea;
