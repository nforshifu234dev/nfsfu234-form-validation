import { ExceptionHandler } from "../errorHandling/ExceptionHandler";
import ErrorMessageInterface from "../interfaces/ErrorMessagesInterface";
import { areAllElementsTrue, checkVariableType } from "../utilities";
import validateCheckbox from "./validateCheckbox";

/**
 * Validates all checkbox inputs within a form.
 * @param {HTMLFormElement} form - The form element containing the checkbox inputs.
 * @param {object} customErrorMessages - Custom error messages for checkbox validation.
 * @returns {boolean} - Returns true if all checkbox inputs are valid or not required, otherwise false.
 */
const validateAllCheckbox = (form: HTMLFormElement | HTMLDivElement, options: any): boolean | ErrorMessageInterface | ErrorMessageInterface[]  => {

    const failureReturnMessage:ErrorMessageInterface[] = [];
    let individualResponseMessage: ErrorMessageInterface = { message: "", code : 400 };

    // Check if running in a browser environment
    if (typeof window === 'undefined') {
        console.error("To access this function, you will need to execute it in a browser like Google Chrome, Safari, Firefox, Microsoft Edge, etc.");
        ExceptionHandler("To access this function, you will need to execute it in a browser like Google Chrome, Safari, Firefox, Microsoft Edge, etc.")
        return false;
    }


    // Check if the form element exists
    if (!form) {
        individualResponseMessage.message = "The form you are trying to validate does not exist. 5555 0000";
        individualResponseMessage.data = form;
        failureReturnMessage.push(individualResponseMessage)
        ExceptionHandler(individualResponseMessage.message);
        return failureReturnMessage;
    }

    if ( checkVariableType(options) !== 'object' )
    {
        ExceptionHandler("options are not provided");
        individualResponseMessage.message = "options are not provided"
        return individualResponseMessage;
    }

    // Array to track the validation results for each checkbox
    const shouldContinue: boolean[] = [];
    
    // Get all checkbox inputs within the form
    const allCheckboxesInForm: NodeListOf<HTMLInputElement> = form.querySelectorAll('input[type="checkbox"]');

    if (allCheckboxesInForm.length > 0) {
        // Iterate over each checkbox input
        allCheckboxesInForm.forEach((checkbox: HTMLInputElement) => {

            options.customErrorMessages = options.customErrorMessages ?? [],
            options.form = options.form ?? form

            const validateInputResponse = validateCheckbox(checkbox, options);

            // Validate each checkbox input
            if (validateInputResponse === true) {
                shouldContinue.push(true); // Checkbox is valid or not required
            } else {
                shouldContinue.push(false); // Checkbox is required and not 
                let individualResponseMessage: ErrorMessageInterface = { message: "", code : 400 };

                shouldContinue.push(false); // Validation failed for this select field
                let proccessedResponse: string = typeof validateInputResponse === 'object' && validateInputResponse !== null
                    ? (validateInputResponse.message as string)
                    : String(validateInputResponse);

                individualResponseMessage.message = proccessedResponse
                individualResponseMessage.data = checkbox

                failureReturnMessage.push(individualResponseMessage)
            }

        });
    } else {
        shouldContinue.push(true); // No checkboxes found, mark validation as successful
    }

    // Check if all validation results are the same (either all true or all false)
    const checkIfAllElementsAreTrue = areAllElementsTrue(shouldContinue);

    if ( checkIfAllElementsAreTrue )
    {
        return true;
    }

    // console.log(failureReturnMessage);

    return failureReturnMessage;    

};

export default validateAllCheckbox;
