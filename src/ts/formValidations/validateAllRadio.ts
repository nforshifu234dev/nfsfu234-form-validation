import { ExceptionHandler } from "../errorHandling/ExceptionHandler";
import ErrorMessageInterface from "../interfaces/ErrorMessagesInterface";
import { areAllElementsTrue, checkVariableType } from "../utilities";
import validateRadio from "./validateRadio";

/**
 * Validates all radio inputs within a form.
 * @param {HTMLElement} form - The form element containing radio inputs to be validated.
 * @param {object} customErrorMessage - Custom error message for radio validation.
 * @returns {boolean} - Returns true if all radio inputs are valid, otherwise false.
 */
const validateAllRadio = (form: HTMLFormElement | HTMLDivElement | string, options: any): ErrorMessageInterface[] | ErrorMessageInterface | boolean => {

    const failureReturnMessage:ErrorMessageInterface[] = [];
    let individualResponseMessage: ErrorMessageInterface = { message: "", code : 400 };

    // Check if running in a browser environment
    if (typeof window === 'undefined') {
        console.error("To access this function, it must be executed in a browser environment.");
        individualResponseMessage.message = "To access this function, you will need to execute it in a browser like Google Chrome, Safari, Firefox, Microsoft Edge, etc."
    
        failureReturnMessage.push(individualResponseMessage)

        return failureReturnMessage;
        // return false;
    }

    // Check if the form parameter is a string (ID) and convert it to a form element if necessary
    if (typeof form === 'string') {
        form = document.getElementById(form) as HTMLFormElement | HTMLDivElement;
    }

    // Check if the form element exists
    if (!form) {
        individualResponseMessage.message = "The form you are trying to validate does not exist.";
        failureReturnMessage.push(individualResponseMessage)
        return failureReturnMessage;
    }

    if ( checkVariableType(options) !== 'object' )
    {
        ExceptionHandler("options are not provided");
        individualResponseMessage.message = "options are not provided"
        return individualResponseMessage;
    }

    // Get all radio inputs within the form
    const allRadiosInForm: NodeListOf<HTMLInputElement> = form.querySelectorAll('input[type="radio"]');
    const shouldContinue: boolean[] = [];
    const seenGroupNames = new Set<string>();

    allRadiosInForm.forEach((radio: HTMLInputElement) => {

        const groupName = radio.getAttribute('name');

        // Skip radios with no name, and skip groups we've already validated
        if (!groupName || seenGroupNames.has(groupName)) {
            return;
        }
        seenGroupNames.add(groupName);

        let individualResponseMessage: ErrorMessageInterface = { message: "", code: 400 };

        const validateRadioResponse = validateRadio(radio, options);

        if (validateRadioResponse === true) {
            shouldContinue.push(true);
        } else {
            shouldContinue.push(false);

            let proccessedResponse: string = typeof validateRadioResponse === 'object' && validateRadioResponse !== null
                ? (validateRadioResponse.message as string)
                : String(validateRadioResponse);

            individualResponseMessage.message = proccessedResponse;
            individualResponseMessage.data = radio;

            failureReturnMessage.push(individualResponseMessage);
        }
    });

    // Check if all validation results are the same (either all true or all false)
    const checkIfAllElementsAreTrue = areAllElementsTrue(shouldContinue);

    if ( checkIfAllElementsAreTrue )
    {
        return true;
    }
 
    //  console.log(failureReturnMessage);
     
    return failureReturnMessage;
};

export default validateAllRadio;
