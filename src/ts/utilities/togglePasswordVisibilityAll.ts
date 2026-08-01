import { ExceptionHandler } from "../errorHandling/ExceptionHandler";
import togglePasswordVisibility from "./togglePasswordVisibility";

/**
 * Toggles the visibility of password inputs and updates corresponding visibility icons.
 * @param {object} [icons={}] - Object containing icons for showing and hiding the password.
 * @param {Element} [icons.show=null] - Icon for showing the password.
 * @param {Element} [icons.hide=null] - Icon for hiding the password.
 * @param {string | HTMLElement} [uform=null] - The form element or its ID.
 * @param {boolean} [toggleAll=false] - Flag indicating whether to toggle all password inputs.
 * @returns {void}
 */
const togglePasswordVisibilityAll = (icons: { show?: string | HTMLElement | null, hide?: string | HTMLElement | null } = {}, uform: string | HTMLFormElement | HTMLDivElement | null = null, toggleAll: boolean = false): void => {
    // Get the form element based on the provided ID or directly.
    const form: HTMLElement | null = typeof uform === 'string' ? document.getElementById(uform) : uform;

    if (!form) {
        console.error('Form element not found.');
        ExceptionHandler("Form Element not found");
        return;
    }

    // Get all password inputs within the specified form.
    const allPasswordInputs: NodeListOf<HTMLInputElement> = form.querySelectorAll('input[type="password"]');

    // Get the icon elements for showing and hiding the password.
    const showIcon: string | HTMLElement | null = icons.show || null;
    const hideIcon: string | HTMLElement | null = icons.hide || null;

    if (toggleAll) {
        // Toggle visibility for all password inputs.
        allPasswordInputs.forEach((input: HTMLInputElement) => {
            togglePasswordVisibility(input, showIcon, hideIcon);
        });
    } else {
        // Toggle visibility for the first password input.
        if (allPasswordInputs.length > 0) {
            togglePasswordVisibility(allPasswordInputs[0], showIcon, hideIcon);
        }
    }
};


export default togglePasswordVisibilityAll;