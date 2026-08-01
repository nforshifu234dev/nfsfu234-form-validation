/**
 * displayErrorModal
 *
 * This function displays an error message in a modal-like container for a specified duration.
 * The error message can be customized to indicate success (green color) or failure (red color).
 * If a custom error container ID is provided, the error message is appended to that container;
 * otherwise, it creates a new container and appends it to the form.
 *
 * @param {string} message - The error message to display.
 * @param {HTMLElement} form - The form element to which the error message will be added.
 * @param {string} errorContainerId - Optional. The ID of the custom error container.
 * @param {number} duration - Optional. The duration (in milliseconds) for which the error message is visible. Default: 3000 ms.
 * @param {boolean} isSuccess - Optional. If true, the message is displayed as a success message (green color). Default: false.
 * @param {boolean} shouldLogToConsole - Optional. If true, the error message is logged to the console. Default: false.
 */
const displayErrorModal = (message: string, form: HTMLElement | HTMLDivElement, errorContainerId: string = '', duration: number = 3000, isSuccess: boolean = false, shouldLogToConsole: boolean = false) => {

    // Determine the error container based on the provided ID or create a new one if not available
    var errorMessageParentContainer;

    if (errorContainerId != '') {
        errorMessageParentContainer = document.getElementById(errorContainerId);
    } else if (document.querySelectorAll('#js-errorMessageContainer').length > 0) {
        errorMessageParentContainer = form.querySelector('#js-errorMessageContainer');
    } else {
        errorMessageParentContainer = document.createElement('div');
        errorMessageParentContainer.classList.add('js-errorMessageContainer');
        errorMessageParentContainer.setAttribute('id', 'js-errorMessageContainer');
        form.appendChild(errorMessageParentContainer);
    }

    if (! errorMessageParentContainer)
    {
        return false;
    }

    // Create the error message container and append it to the error container parent
    var errorMessageContainer = document.createElement('div');
    errorMessageContainer.classList.add('login-error-message-container', 'active');

    var errorMessageMessageContainer = document.createElement('div');
    errorMessageMessageContainer.classList.add('message', 'js-message');
    errorMessageMessageContainer.innerHTML = message;

    const errorMessageIconContainer = document.createElement('div');
    errorMessageIconContainer.classList.add('icon', 'close', 'js-close');
    errorMessageIconContainer.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M15.71,8.29a1,1,0,0,0-1.42,0L12,10.59,9.71,8.29A1,1,0,0,0,8.29,9.71L10.59,12l-2.3,2.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l2.29,2.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42L13.41,12l2.3-2.29A1,1,0,0,0,15.71,8.29Zm3.36-3.36A10,10,0,1,0,4.93,19.07,10,10,0,1,0,19.07,4.93ZM17.66,17.66A8,8,0,1,1,20,12,7.95,7.95,0,0,1,17.66,17.66Z'/></svg>";

    errorMessageContainer.appendChild(errorMessageMessageContainer);
    errorMessageContainer.appendChild(errorMessageIconContainer);

    errorMessageParentContainer.appendChild(errorMessageContainer);

    // Optionally, set the success class to display the message in green color
    if (isSuccess) {
        errorMessageContainer.classList.add('success');
    }

    // Listens to when the user clicks on the close button of an error message container
    const errorMessageContainerCloseBtn = errorMessageContainer.querySelector('.js-close');

    if (! errorMessageContainerCloseBtn)
    {
        return false;
    }

    errorMessageContainerCloseBtn.addEventListener('click', () => {
        if (errorMessageContainer && errorMessageContainer.parentNode) {
            errorMessageContainer.parentNode.removeChild(errorMessageContainer);
        }
    });

    // Set timeout to remove the error message container after the specified duration
    setTimeout(() => {
        if (errorMessageContainer && errorMessageContainer.parentNode) {
            errorMessageContainer.parentNode.removeChild(errorMessageContainer);
        }
    }, duration);

    // Optionally, log the error message to the console
    if (shouldLogToConsole) {
        console.error(message);
    }
}


export default displayErrorModal;