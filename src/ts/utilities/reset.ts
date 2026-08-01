const reset = (form: HTMLFormElement | HTMLDivElement | string | null = null): boolean => {
    // Check if the code is running in a browser environment
    if (typeof window === 'undefined') {
        console.error(
            "You need to be in a browser environment like Google Chrome, Safari, Firefox, Microsoft Edge, etc. for this function to work."
        );
        return false;
    }

    // Get the target form element
    let targetForm: HTMLElement | null = null;
    if (typeof form === 'string') {
        // If the form parameter is a string, assume it's an ID and try to find the element
        targetForm = document.getElementById(form);
        if (!targetForm) {
            console.error(`Form with ID "${form}" not found.`);
            return false;
        }
    } else if (form instanceof HTMLFormElement || form instanceof HTMLDivElement) {
        // If the form parameter is a valid HTMLFormElement or HTMLDivElement, use it directly
        targetForm = form;
    } else if (form === null) {
        // If no form parameter is provided, default to the document's body
        targetForm = document.body;
    } else {
        console.error("Invalid form parameter.");
        return false;
    }

    // Select all form elements within the target form
    const allFormElements = targetForm.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('input, textarea, select');

    // Reset the values of input fields, textareas, and selected index of select elements
    allFormElements.forEach((element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement) => {
        if (element instanceof HTMLInputElement) {
            if (element.type === 'radio' || element.type === 'checkbox') {
                element.checked = false;
            } else {
                element.value = '';
            }
        } else if (element instanceof HTMLTextAreaElement) {
            element.value = '';
        } else if (element instanceof HTMLSelectElement) {
            element.selectedIndex = 0;
        }
    });

    return true;
};

export default reset;
