const focusInputElement = (inputElement: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, duration: number = 3000) => {

    // Set focus on the specified input element to bring it into focus.
    inputElement.focus();

    // Add the 'input-focus-error' CSS class to the input element to apply the temporary highlighting effect.
    inputElement.classList.add('input-focus-error');

    // After the specified duration, remove the 'input-focus-error' CSS class to revert the highlighting effect.
    setTimeout(() => {
        inputElement.classList.remove('input-focus-error');
    }, duration);

};

export default focusInputElement;