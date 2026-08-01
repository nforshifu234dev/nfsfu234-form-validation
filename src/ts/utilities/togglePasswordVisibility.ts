import { checkVariableType } from ".";
import { ExceptionHandler } from "../errorHandling/ExceptionHandler";

/**
 * Toggles the visibility of a password input and updates the corresponding visibility icon.
 * @param {HTMLElement} input - The password input element.
 * @param {Element} [showIcon=null] - Icon for showing the password.
 * @param {Element} [hideIcon=null] - Icon for hiding the password.
 * @returns {void}
 */
const togglePasswordVisibility = (input: HTMLInputElement, showIcon: string | HTMLElement | null = null, hideIcon: string | HTMLElement | null = null): boolean | any => {


    let allTogglePasswordsButton : any | undefined = document.querySelectorAll('.nfsfu234_fv_togglePassword') || document.querySelectorAll('.js-togglePassword') || undefined;
    
    // if ( allTogglePasswordsButton.length < 1 )
    // {

    //     allTogglePasswordsButton = document.querySelectorAll('.js-togglePassword');

    // }
    
    // if ( allTogglePasswordsButton.length < 1 )
    // {

    //     allTogglePasswordsButton = undefined;

    // }


    if ( ! allTogglePasswordsButton )
    {
        ExceptionHandler("No Toggle Password Button was found. Check your HTML Code", 'error_1')
        return false;
    }

    function updateIcon(inputType:string, iconContainer:HTMLElement) {

        if (showIcon === null) {
            // iconContainer.appendChild(showIcon.cloneNode(true));

            // iconContainer.innerHTML = ""

            showIcon = "show"

        } 
        
        if (hideIcon === null) {
            // iconContainer.appendChild(hideIcon.cloneNode(true));

            // iconContainer.innerHTML = ""

            hideIcon = "hide"

        }

        // Append the appropriate icon.
        if (inputType === 'password' && showIcon !== null) {
            // iconContainer.appendChild(showIcon.cloneNode(true));

            iconContainer.innerHTML = ""

            if ( typeof showIcon === "string" )
            {
                iconContainer.innerHTML = showIcon
            }
            else if ( checkVariableType(showIcon) === "HTML Element" )
            {
                iconContainer.appendChild(showIcon)
            }

        } else if (inputType === 'text' && hideIcon !== null) {
            // iconContainer.appendChild(hideIcon.cloneNode(true));
            iconContainer.innerHTML = ""

            if ( typeof hideIcon === "string" )
            {
                iconContainer.innerHTML = hideIcon
            }
            else if ( checkVariableType(hideIcon) === "HTML Element" )
            {
                iconContainer.appendChild(hideIcon)
            }

        }


    }

    allTogglePasswordsButton.forEach( (toggleBtn: HTMLElement) => {

        let inputType = input.type;
        const iconContainer: HTMLElement | null = input.nextElementSibling as HTMLElement;

        updateIcon(inputType, iconContainer)

        toggleBtn.addEventListener('click', ()=>{

            // Toggle the input type between 'password' and 'text'.
            input.type = input.type === 'password' ? 'text' : 'password';

            // Update the visibility icon based on the current input type.
            const inputType: string = input.type;
            if (iconContainer) {
                // Clear existing icon content.
                // iconContainer.textContent = '';

                updateIcon(inputType, iconContainer)

            }

        })

    } )



};


export default togglePasswordVisibility;