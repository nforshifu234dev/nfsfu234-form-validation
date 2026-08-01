import validateTextarea from "./validateTextarea";
import { areAllElementsTrue, checkVariableType } from "../utilities";
import { ExceptionHandler } from "../errorHandling/ExceptionHandler";
import ErrorMessageInterface from "../interfaces/ErrorMessagesInterface";

/**
 * Validate all textarea fields within a form.
 * @param {HTMLFormElement | HTMLDivElement} form - The form element to validate.
 * @param {Object} customErrorMessage - Custom error messages for form validation.
 * @returns {boolean} Returns true if all textarea fields are valid or not required, otherwise false.
 */
const validateAllTextarea = (form: HTMLFormElement | HTMLDivElement | string, options: any, callback?: any): ErrorMessageInterface[] | ErrorMessageInterface | boolean => {
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

    if ( checkVariableType(options) !== 'object' )
    {
        ExceptionHandler("options are not provided");
        individualResponseMessage.message = "options are not provided"
        return individualResponseMessage;
    }

    const shouldContinue: boolean[] = [];
    const allTextareasInForm: NodeListOf<HTMLTextAreaElement> = form.querySelectorAll('textarea');

    // If there are textarea fields in the form
    if (allTextareasInForm.length > 0) {

        // Iterate through all textarea fields in the form
        allTextareasInForm.forEach((textarea: HTMLTextAreaElement, index: number) => {

            let individualResponseMessage: ErrorMessageInterface = { message: "", code : 400 };

            options.customErrorMessages = options.customErrorMessages ?? [] 
            options.errorType = options.errorType ??  'inline' 
            options.form = options.form ?? form

            // Call the validateTextarea function for each textarea field
            const validateAllTextareaResponse = validateTextarea(textarea,options);
            if (validateAllTextareaResponse === true) {

                shouldContinue.push(true); // Validation succeeded for this textarea field
                
            } else {

                // console.log(validateAllTextareaResponse);
                let individualResponseMessage: ErrorMessageInterface = { message: "", code : 400 };
                

                shouldContinue.push(false); // Validation failed for this textarea field

                let proccessedResponse: string = typeof validateAllTextareaResponse === 'object' && validateAllTextareaResponse !== null
                    ? (validateAllTextareaResponse.message as string)
                    : String(validateAllTextareaResponse);

                individualResponseMessage.message = proccessedResponse
                individualResponseMessage.data = textarea

                failureReturnMessage.push(individualResponseMessage)

            }

        });
    } else {
        shouldContinue.push(true); // No textarea fields found in the form
    }

    // Check if all validation results are the same (either all true or all false)
    const checkIfAllElementsAreTrue = areAllElementsTrue(shouldContinue);

    if ( checkIfAllElementsAreTrue )
    {
        return true;
    }

    // console.log("Error87451365: ",failureReturnMessage);
    
    return failureReturnMessage;
};

export default validateAllTextarea;
