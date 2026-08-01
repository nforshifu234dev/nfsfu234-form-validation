import { ExceptionHandler } from "../errorHandling/ExceptionHandler";
import displayErrorInline from "../errorHandling/displayErrorInline";
import displayErrorModal from "../errorHandling/displayErrorModal";
import ErrorMessageInterface from "../interfaces/ErrorMessagesInterface";
import { checkVariableType } from "../utilities";
import containsOnlyIntegers from "../utilities/containsOnlyIntegers";
import focusInputElement from "../utilities/focusInputElement";
import isDate from "../utilities/isDate";
import isEmail from "../utilities/isEmail";
import isURL from "../utilities/isURL";
import isZIP from "../utilities/isZIP";
import validateCheckbox from "./validateCheckbox";
import validateRadio from "./validateRadio";
import { getFieldRule } from "../config/formRegistry";
import checkFieldRuleConstraints from "../utilities/checkFieldRuleConstraints";

/**
 * Validate an input field.
 * @param {HTMLInputElement} inputField - The input field to validate.
 * @param {Object} customErrorMessages - Custom error messages for form validation.
 * @returns {boolean} Returns true if the input field is valid, otherwise false.
 */
const validateInput = (
    inputField: HTMLInputElement, 
    options: any,
    callback?: any
): boolean | string | ErrorMessageInterface => {

    let individualResponseMessage: ErrorMessageInterface = { message: "", type: 'error', data: null, code : 400 };


    // Check if running in a browser environment
    if (typeof window === 'undefined') {
        // let logLevel: 
        console.error("To access this function, you will need to execute it in a browser like Google Chrome, Safari, Firefox, Microsoft Edge, etc.");
        ExceptionHandler("To access this function, you will need to execute it in a browser like Google Chrome, Safari, Firefox, Microsoft Edge, etc.")
        return false;
    }
    
    // Check if the input field exists
    if (!inputField) {
        console.error("The input field you are trying to validate does not exist.");
        return false;
    }


    if ( checkVariableType(options) !== 'object' )
    {
        ExceptionHandler("options are not provided");
        individualResponseMessage.message = "options are not provided"
        return individualResponseMessage;
    }

    // console.log("Input ", inputField);
    // console.log("OPtions ", options.errorType);
    // console.log("Form:", options.form);
    

    
    

    const errorType: any = options.error_type || options.errorType || 'inline'; 
    const customErrorMessages: any = options.customErrorMessages || [];
    const form: any = options.form ?? undefined;
    const includeHTML = options.includeHTML === false ? false : true;


    const inputFieldKey = inputField.getAttribute("name") || inputField.id || undefined;
    const fieldRule = form ? getFieldRule(form, inputFieldKey) : undefined;

    const inputType = fieldRule?.type ?? (inputField.getAttribute("type") as string);
    const inputValue = inputField.value.trim();
    const isRequired = fieldRule?.required ?? (inputField.required || inputField.classList.contains('js-required'));
    let errorMessage: string | undefined = undefined;


    if (! includeHTML)
    {

        // Check if the input field is required and its value is empty
        if (isRequired && inputValue === '') {
            errorMessage = customErrorMessages[inputType] ?? "This field is required.";
        }
        else if (isRequired && inputType === 'radio') {
            options.ignoreError = true;
            const validateRadioResponse = validateRadio(inputField, options);
    
            if ( validateRadioResponse === true )
            {
                errorMessage = undefined; // radio group validated successfully - do not treat as an error
            }
            else
            {
                errorMessage = customErrorMessages[inputType] ?? (typeof validateRadioResponse === 'object' && validateRadioResponse !== null ? validateRadioResponse.message : String(validateRadioResponse));
            }
    
        }
        else if (isRequired && inputType === 'checkbox' && !validateCheckbox(inputField, {form: form, customErrorMessages: customErrorMessages})) {
            errorMessage = customErrorMessages[inputType] ?? 'You need to check this box';
        }
        else {
            // Perform additional validation based on the input field type
            switch (inputType) {
                case 'email':
                    if (inputValue !== '' && !isEmail(inputValue)) {
                        errorMessage = customErrorMessages.email?.format || "Invalid email format.";
                    }
                    break;
                case 'url':
                    if (inputValue !== '' && !isURL(inputValue)) {
                        errorMessage = customErrorMessages.url?.format || "Invalid URL format.";
                    }
                    break;
                case 'zipcode':
                    if (inputValue !== '' && !isZIP(inputValue)) {
                        errorMessage = customErrorMessages.zipcode?.format || "Invalid ZIP code format.";
                    }
                    break;
                case 'date':
                    if (inputValue !== '' && !isDate(inputValue, 'yyyy-mm-dd')) {
                        errorMessage = customErrorMessages.date?.format || "Invalid date format.";
                    }
                    break;
                case 'tel':
                    if (inputValue !== '' && !containsOnlyIntegers(inputValue)) {
                        errorMessage = customErrorMessages.tel?.format || customErrorMessages.phone?.format || "Invalid phone number.";
                    }
                    break;
                case 'phone':
                    if (inputValue !== '' && !containsOnlyIntegers(inputValue)) {
                        errorMessage = customErrorMessages.tel?.format || customErrorMessages.phone?.format || "Invalid date format.";
                    }
                    break;
                // case 'radio':
                //     if (inputValue !== '' && !validateRadio(inputField, options)) {
                //         errorMessage = customErrorMessages.radio?.format || "Invalid radio button selection.";
                //     }
                // case 'checkbox':
                //     if (inputValue !== '' && !validateCheckbox(inputField)) {
                //         errorMessage = customErrorMessages.checkbox?.format || "Invalid checkbox selection.";
                //     }

                default:
                    // No additional validation for other input types
                    break;
            }
        }

        if (!errorMessage) {
            errorMessage = checkFieldRuleConstraints(inputValue, fieldRule);
        }

            // Display the error message if validation fails
            if (errorMessage) {
                
                individualResponseMessage.message = errorMessage;
                individualResponseMessage.data = inputField

                // if ( errorType === 'inline' )
                // {
                //     displayErrorInline(inputField, errorMessage)
        
                // }
                // else
                // {
                //     focusInputElement(inputField);
                //     displayErrorModal(errorMessage, inputField)
                // }

                ExceptionHandler(errorMessage);
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

    

    // Get the input field type, value, and required status
    // const inputType = inputField.type;

    // console.log("inputValue: ", inputValue);
    
    
    // Check if the input field is required and its value is empty
    if (isRequired && inputValue === '') {
        errorMessage = customErrorMessages[inputType] ?? "This field is required.";
    }
    else if (isRequired && inputType === 'radio') {
        options.ignoreError = true;
        const validateRadioResponse = validateRadio(inputField, options);

        if ( validateRadioResponse === true )
        {
            errorMessage = undefined; // radio group validated successfully - do not treat as an error
        }
        else
        {
            errorMessage = customErrorMessages[inputType] ?? (typeof validateRadioResponse === 'object' && validateRadioResponse !== null ? validateRadioResponse.message : String(validateRadioResponse));
        }

    }
    else if (isRequired && inputType === 'checkbox' && !validateCheckbox(inputField, {form: form, customErrorMessages: customErrorMessages})) {
        errorMessage = customErrorMessages[inputType] ?? 'You need to check this box';
    }
    else {
        // Perform additional validation based on the input field type
        switch (inputType) {
            case 'email':
                if (inputValue !== '' && !isEmail(inputValue)) {
                    errorMessage = customErrorMessages.email?.format || "Invalid email format.";
                }
                break;
            case 'url':
                if (inputValue !== '' && !isURL(inputValue)) {
                    errorMessage = customErrorMessages.url?.format || "Invalid URL format.";
                }
                break;
            case 'zipcode':
                if (inputValue !== '' && !isZIP(inputValue)) {
                    errorMessage = customErrorMessages.zipcode?.format || "Invalid ZIP code format.";
                }
                break;
            case 'date':
                if (inputValue !== '' && !isDate(inputValue, 'yyyy-mm-dd')) {
                    errorMessage = customErrorMessages.date?.format || "Invalid date format.";
                }
                break;
            case 'tel':
                if (inputValue !== '' && !containsOnlyIntegers(inputValue)) {
                    errorMessage = customErrorMessages.tel?.format || customErrorMessages.phone?.format || "Invalid phone number.";
                }
                break;
            case 'phone':
                if (inputValue !== '' && !containsOnlyIntegers(inputValue)) {
                    errorMessage = customErrorMessages.tel?.format || customErrorMessages.phone?.format || "Invalid date format.";
                }
                break;
            // case 'radio':
            //     if (inputValue !== '' && !validateRadio(inputField, options)) {
            //         errorMessage = customErrorMessages.radio?.format || "Invalid radio button selection.";
            //     }
            // case 'checkbox':
            //     if (inputValue !== '' && !validateCheckbox(inputField)) {
            //         errorMessage = customErrorMessages.checkbox?.format || "Invalid checkbox selection.";
            //     }

            // Add additional cases for other input types if needed
            default:
                // No additional validation for other input types
                break;
        }
    }

    if (!errorMessage) {
        errorMessage = checkFieldRuleConstraints(inputValue, fieldRule);
    }


    // Display the error message if validation fails
    if (errorMessage) {
        

        individualResponseMessage.message = errorMessage;
        individualResponseMessage.data = inputField
        
        if ( errorType === 'inline' )
        {
            displayErrorInline(inputField, errorMessage)

        }
        else
        {
            focusInputElement(inputField);
            displayErrorModal(errorMessage, inputField)
        }

        ExceptionHandler(errorMessage);
        return individualResponseMessage;
    }

    individualResponseMessage.code = 200
    individualResponseMessage.data = null
    individualResponseMessage.message = "success"
    individualResponseMessage.type = "success"

    return true; // Input field is valid
};

export default validateInput;
