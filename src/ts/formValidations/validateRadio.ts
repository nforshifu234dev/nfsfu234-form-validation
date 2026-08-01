import { ExceptionHandler } from "../errorHandling/ExceptionHandler";
import displayErrorInline from "../errorHandling/displayErrorInline";
import displayErrorModal from "../errorHandling/displayErrorModal";
import ErrorMessageInterface from "../interfaces/ErrorMessagesInterface";
import focusInputElement from "../utilities/focusInputElement";
import { getFieldRule } from "../config/formRegistry";

/**
 * Validates a single radio input or a group of radio inputs.
 * @param {HTMLInputElement | string} radioInputField - The radio input element or its name attribute.
 * @param {object} customErrorMessage - Custom error message for radio validation.
 * @returns {boolean} - Returns true if the radio input(s) are valid, otherwise false.
 */
const validateRadio = (
    radioInputField: HTMLInputElement | string,  
    options: any,
    callback?: any
): boolean | string | ErrorMessageInterface => {

    // Check if running in a browser environment
    if (typeof window === 'undefined') {
        console.error("To access this function, it must be executed in a browser environment.");
        ExceptionHandler("To access this function, you will need to execute it in a browser like Google Chrome, Safari, Firefox, Microsoft Edge, etc.")
        return false;
    }

    let individualResponseMessage: ErrorMessageInterface = { message: "an error occurred", type: 'error', code : 400 };

    const form: HTMLFormElement | HTMLDivElement | undefined = options.form || undefined;
    const customErrorMessages: any = options.customErrorMessages || null;
    let errorMessage = (customErrorMessages && customErrorMessages['radio']) ?? 'You need to choose a value.';

    
    if ( ! form )
    {

        individualResponseMessage.message = "The form you are trying to validate does not exist.";
        ExceptionHandler("The form you are trying to validate does not exist. 5765846846")
        return individualResponseMessage;

    }

    let radioName: string | null = null;

    // Determine the radio group name
    if (typeof radioInputField === 'object' && radioInputField instanceof HTMLInputElement) {
        radioName = radioInputField.getAttribute('name');
    } else if (typeof radioInputField === 'string') {
        radioName = radioInputField;
    } else {

        // Check if the select field is valid and exists in the DOM
        if (!radioInputField) {
            console.error("The radio element(s) to validate is(are) not found.");
            individualResponseMessage.message = "The radio element(s) to validate is(are) not found.";
            return individualResponseMessage;
        }

    }

    if ( ! radioName )
    {
        ExceptionHandler("The radio element(s) to validate is(are) not found.");
        individualResponseMessage.message = "The radio element(s) to validate is(are) not found.";
        return individualResponseMessage;
    }

    // Get all radio inputs within the same group
    const radioGroup: NodeListOf<HTMLInputElement> = document.querySelectorAll(`input[type="radio"][name="${radioName}"]`);
    const fieldRule = form ? getFieldRule(form, radioName) : undefined;
    let isRequired: boolean = false;
    let isAnyRadioChecked: boolean = false;
    const errorType: string = options.errorType || 'inline'
    let radioInput: any = null;

    if (radioGroup.length > 0) {
        radioInput = radioGroup[0]; // default focus/error target = first radio in group
    }

    // Iterate over each radio input in the group
    radioGroup.forEach((radio: HTMLInputElement) => {
        const radioIsRequired = fieldRule?.required ?? (radio.required || radio.classList.contains('js-required'));

        if (radioIsRequired) {
            isRequired = true;
        }

        if (radio.checked) {
            isAnyRadioChecked = true;
            radioInput = radio; // prefer the checked one as reference, if any
        }
    });

    // Group is valid if it's not required, or if at least one radio is checked
    if (!isRequired || isAnyRadioChecked) {
        return true;
    }

    const ignoreError = options.ignoreError && options.ignoreError === true ? true : false;

    

    if ( ! ignoreError )
    {

        

        // Display the error message inline or in a modal based on the isErrorInline flag
        if (errorType === 'inline') {
            displayErrorInline(radioInput as HTMLInputElement, errorMessage, 3000);
        } else if (errorType === 'modal') {
            focusInputElement(radioInput  as HTMLInputElement, 3000);
            displayErrorModal(errorMessage, form);
        }


    }

    individualResponseMessage.message = "You need to choose a value.";
    individualResponseMessage.data = radioInput

    // console.error("luytoyfouytvctrusatdf: ", individualResponseMessage);
    

    return individualResponseMessage;

};

export default validateRadio;
