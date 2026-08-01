import validateFile from "./validateFile";
import ErrorMessageInterface from "../interfaces/ErrorMessagesInterface";

/**
 * Validates every <input type="file"> in the form. Async, since validateFile
 * may need to decode image dimensions.
 */
const validateAllFile = async (
    form: HTMLFormElement | HTMLDivElement,
    options?: any
): Promise<boolean | ErrorMessageInterface[]> => {

    if (!form || typeof form.querySelectorAll !== 'function') {
        return true; // Nothing to validate against - not this function's job to report a missing form.
    }

    const fileInputs = form.querySelectorAll('input[type="file"]');
    const results: ErrorMessageInterface[] = [];
    let allValid = true;

    for (const fileInput of Array.from(fileInputs) as HTMLInputElement[]) {
        const result = await validateFile(fileInput, { ...options, form });

        if (result !== true) {
            allValid = false;
            results.push(result as ErrorMessageInterface);
        }
    }

    return allValid ? true : results;
};

export default validateAllFile;
