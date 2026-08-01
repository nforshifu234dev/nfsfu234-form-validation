import validateSelect from "./validateSelect";
import { areAllElementsTrue, checkVariableType } from "../utilities";
import { ExceptionHandler } from "../errorHandling/ExceptionHandler";
import ErrorMessageInterface from "../interfaces/ErrorMessagesInterface";

/**
 * Validate all select fields within a form.
 * @param {HTMLFormElement | HTMLDivElement} form - The form element to validate.
 * @param {Object} customErrorMessage - Custom error messages for form validation.
 * @returns {boolean} Returns true if all select fields are valid or not required, otherwise false.
 */
const validateAllSelect = (form: HTMLFormElement | HTMLDivElement | string, options: any): boolean | ErrorMessageInterface | ErrorMessageInterface[] => {

    const failureReturnMessage:ErrorMessageInterface[] = [];
    let individualResponseMessage: ErrorMessageInterface = { message: "", code : 400 };


    // Check if running in a browser environment
    if (typeof window === 'undefined') {
        console.error("To access this function, you will need to execute it in a browser like Google Chrome, Safari, Firefox, Microsoft Edge, etc.");
        return false;
    }

    // Check if the form parameter is a string (ID) and convert it to a form element if necessary
    if (typeof form === 'string') {
        form = document.getElementById(form) as HTMLFormElement | HTMLDivElement;
    }

    // Check if the form element exists
    if (!form) {
        individualResponseMessage.message = "The form you are trying to validate does not exist.";
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

    const shouldContinue: boolean[] = [];
    const allSelectsInForm: NodeListOf<HTMLSelectElement> = form.querySelectorAll('select');

    // If there are select fields in the form
    if (allSelectsInForm.length > 0) {
        // Iterate through all select fields in the form
        allSelectsInForm.forEach((select: HTMLSelectElement) => {


            options.customErrorMessages = options.customErrorMessages ?? [],
            options.form = options.form ?? form

            const validateSelectResponse = validateSelect(select, options);

            if (validateSelectResponse === true) {
                shouldContinue.push(true); // Validation succeeded for this select field
            } else {
                let individualResponseMessage: ErrorMessageInterface = { message: "", code : 400 };

                shouldContinue.push(false); // Validation failed for this select field
                let proccessedResponse: string = typeof validateSelectResponse === 'object' && validateSelectResponse !== null
                    ? (validateSelectResponse.message as string)
                    : String(validateSelectResponse);

                individualResponseMessage.message = proccessedResponse
                individualResponseMessage.data = select

                failureReturnMessage.push(individualResponseMessage)

            }
        });
    } else {
        shouldContinue.push(true); // No select fields found in the form
    }

    // Check if all validation results are the same (either all true or all false)
    const checkIfAllElementsAreTrue = areAllElementsTrue(shouldContinue);

    if ( checkIfAllElementsAreTrue )
    {
        return true;
    }
    
    return failureReturnMessage;    
};

export default validateAllSelect;
