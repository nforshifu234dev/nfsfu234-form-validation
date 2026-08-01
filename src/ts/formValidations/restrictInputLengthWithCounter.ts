import { ExceptionHandler } from "../errorHandling/ExceptionHandler";
import ErrorMessageInterface from "../interfaces/ErrorMessagesInterface";
import { checkVariableType } from "../utilities";
import countString from "../utilities/countString";

/**
 * Count input characters and restrict input while typing in a given input element.
 * @param {HTMLInputElement} inputElement - The HTML input element to count and restrict.
 * @param {HTMLElement} [counterContainer] - Optional container to display the character count. If not provided, it creates one automatically.
 * @param {Object} [options={}] - An object with the following optional properties:
 *   - maxLength {number}: Maximum allowed characters (default: 250).
 *   - minLength {number}: Minimum allowed characters (default: 0).
 *   - shouldButtonDisable {boolean}: Flag to determine whether to disable buttons on reaching maxLength (default: false).
 *   - formId {string}: The ID of the form element associated with the input.
 * @returns {boolean} Return true if the input meets the restrictions, otherwise false.
 */
const restrictInputLengthWithCounter = (inputElement: HTMLInputElement | HTMLTextAreaElement,  options: any = {}, counterContainer?: HTMLElement | string): any => {

    let individualResponseMessage: ErrorMessageInterface = { message: "", code : 400 };


    // Check if the input element exists.
    if (!inputElement) {
        // console.error("The input element you are trying to count and restrict is not found. Check your HTML code.");
        individualResponseMessage.message = "The input element you are trying to count and restrict is not found. Check your HTML code."
        ExceptionHandler(individualResponseMessage.message);
        return individualResponseMessage;
    }

    // Extract options or set default values.
    const maxLength = (options['maxLength'] && parseInt(options['maxLength']) && options['maxLength'] >= 1) ? options['maxLength'] : 250;
    const minLength = (options['minLength'] && parseInt(options['minLength'])) ? options['minLength'] : 0;
    const shouldButtonDisable = (options['shouldButtonDisable'] && options['shouldButtonDisable']) ? true : false;

    let form;

    if ( options.form && checkVariableType(options.form) === 'string' )
    {
        document.getElementById(options.form)
    }
    else if ( options.form && checkVariableType(options.form) === 'HTML Element' )
    {
        form = options.form
    }
    else
    {

        
        if ( document.getElementById("nfsfu234_fv_form") )
        {
            form = document.getElementById("nfsfu234_fv_form");
        }
        else if ( document.getElementById("jsForm") )
        {
            form = document.getElementById("jsForm");
        }
        else if ( document.querySelector("form") )
        {
            form = document.querySelector("form");
        }
        else
        {
            form = undefined
        }

    }

    // Check if the form element exists
    if (!form) {
        individualResponseMessage.message = "The form you are trying to validate does not exist.";
        ExceptionHandler(individualResponseMessage.message);
        return individualResponseMessage;
    }

    // Add an event listener to the input element for counting and restricting.
    inputElement.addEventListener('input', () => {
        // Count the number of characters in the input element.
        var textLength = countString(inputElement.value);
        var returnMessage = false;

        // Check if a counter container is provided or create one if not.
        var counterElement: any;

        if ( checkVariableType(counterContainer) === 'string' )
        {

            counterElement = document.getElementById(counterContainer as string)

        }

        if (!counterElement) {
            const parentNode = inputElement.parentNode;

            if ( parentNode?.querySelector(".js-counterContainer") )
            {
                counterElement = parentNode.querySelector(".js-counterContainer")
            }
            else
            {
                counterElement = document.createElement('span');
                counterElement.classList.add('js-counterContainer');
                if (! parentNode)
                {
                    return false;
                }
                parentNode.appendChild(counterElement);
            }

            
        } else {
            counterElement = counterElement;
        }

        if ( ! counterElement )
        {
            individualResponseMessage.message = "Counter Element Not Found";
            ExceptionHandler(individualResponseMessage.message)
            return individualResponseMessage;
        }

        // Apply restrictions based on character count and options.
        if (textLength > maxLength) {
            textLength = maxLength;
            counterElement.classList.remove('text-fail');
            counterElement.classList.add('text-success');
            inputElement.value = inputElement.value.slice(0, maxLength);

            // Enable buttons in the associated form (if specified).
            if (shouldButtonDisable && form) {
                form.querySelectorAll('button').forEach((button: HTMLButtonElement) => {
                    button.disabled = false;
                });
            }

            returnMessage = true;
        } else if (textLength >= maxLength) {
            inputElement.value = inputElement.value.slice(0, maxLength);
            counterElement.classList.remove('text-fail');
            counterElement.classList.add('text-success');

            // Enable buttons in the associated form (if specified).
            if (shouldButtonDisable && form) {
                form.querySelectorAll('button').forEach((button: HTMLButtonElement) => {
                    button.disabled = false;
                });
            }

            returnMessage = true;
        } else if (textLength >= minLength && minLength !== 0) {
            counterElement.classList.remove('text-fail');
            counterElement.classList.add('text-success');

            // Enable buttons in the associated form (if specified).
            if (shouldButtonDisable && form) {
                form.querySelectorAll('button').forEach((button: HTMLButtonElement) => {
                    button.disabled = false;
                });
            }

            returnMessage = true;
        } else {
            counterElement.classList.add('text-fail');

            // Enable buttons in the associated form (if specified).
            if (shouldButtonDisable && form) {
                form.querySelectorAll('button').forEach((button: HTMLButtonElement) => {
                    button.disabled = false;
                });
            }
        }

        // Update the counter element with the current character count.
        counterElement.innerHTML = `${textLength}/${maxLength}`;

        return returnMessage;
    });

};

export default restrictInputLengthWithCounter;