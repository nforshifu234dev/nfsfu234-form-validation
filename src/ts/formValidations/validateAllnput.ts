import { ExceptionHandler } from "../errorHandling/ExceptionHandler";
import ErrorMessageInterface from "../interfaces/ErrorMessagesInterface";
import { areAllElementsTrue } from "../utilities";
import validateInput from "./validateInput";

/**
 * Validate all input fields within a form.
 * @param {HTMLFormElement | HTMLDivElement} form - The form element to validate.
 * @param {Object} customErrorMessages - Custom error messages for form validation.
 * @returns {boolean} Returns true if all input fields are valid, otherwise false.
 */
const validateAllInput = (form: HTMLFormElement | HTMLDivElement | string, options = {
    customErrorMessages: [],
    form
}):  ErrorMessageInterface[] | boolean => {

    const failureReturnMessage:ErrorMessageInterface[] = [];
    let individualResponseMessage: ErrorMessageInterface = { message: "", code : 400 };


    // Check if running in a browser environment
    if (typeof window === 'undefined') {
        
        individualResponseMessage.message = "To access this function, you will need to execute it in a browser like Google Chrome, Safari, Firefox, Microsoft Edge, etc."
    
        failureReturnMessage.push(individualResponseMessage)

        return failureReturnMessage;
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

    const shouldContinue: boolean[] = [];
    // const allInputsInForm: NodeListOf<HTMLInputElement> = form.querySelectorAll('input');
    const allInputsInForm: NodeListOf<HTMLInputElement> = form.querySelectorAll(
        'input:not([type="checkbox"]):not([type="radio"]):not([type="file"])'
    );
    
    // If there are input fields in the form
    if (allInputsInForm.length > 0) {

        allInputsInForm.forEach((input: HTMLInputElement) => {

            options.form = options.form || form

            // Validate each input field using the validateInput function
            const validateInputResponse = validateInput(input, options)
            if (validateInputResponse === true) {
                shouldContinue.push(true);
            } else {
                let individualResponseMessage: ErrorMessageInterface = { message: "", code : 400 , data: null};

                shouldContinue.push(false);

                // console.log(validateInputResponse);
                

                let proccessedResponse: string = typeof validateInputResponse === 'object' && validateInputResponse !== null
                    ? (validateInputResponse.message as string)
                    : String(validateInputResponse);

                individualResponseMessage.message = proccessedResponse
                individualResponseMessage.data = input

                failureReturnMessage.push(individualResponseMessage)

            }
        });

    } else {
        // If there are no input fields in the form, consider it as valid
        shouldContinue.push(true);
    }

    // Check if all validation results are the same (either all true or all false)
    const checkIfAllElementsAreTrue = areAllElementsTrue(shouldContinue);

    if ( checkIfAllElementsAreTrue )
    {
        return true;
    }

    return failureReturnMessage;

};

export default validateAllInput;
