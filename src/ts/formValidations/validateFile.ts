import ErrorMessageInterface from "../interfaces/ErrorMessagesInterface";
import FieldRuleInterface from "../interfaces/FieldRuleInterface";
import { ExceptionHandler } from "../errorHandling/ExceptionHandler";
import displayErrorInline from "../errorHandling/displayErrorInline";
import displayErrorModal from "../errorHandling/displayErrorModal";
import focusInputElement from "../utilities/focusInputElement";
import { getFieldRule } from "../config/formRegistry";

const isImageFile = (file: File): boolean => file.type.startsWith('image/');

/**
 * Reads an image file's natural pixel dimensions without uploading it anywhere.
 * Returns null if dimensions can't be determined (e.g. non-browser environment,
 * or a corrupt/unreadable file) - callers should treat null as "skip this check"
 * rather than as a validation failure.
 */
const getImageDimensions = (file: File): Promise<{ width: number; height: number } | null> => {
    return new Promise((resolve) => {
        if (typeof window === 'undefined' || typeof Image === 'undefined' || typeof URL === 'undefined') {
            resolve(null);
            return;
        }

        let objectUrl: string;
        try {
            objectUrl = URL.createObjectURL(file);
        } catch {
            resolve(null);
            return;
        }

        const img = new Image();
        img.onload = () => {
            URL.revokeObjectURL(objectUrl);
            resolve({ width: img.naturalWidth, height: img.naturalHeight });
        };
        img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            resolve(null);
        };
        img.src = objectUrl;
    });
};

/**
 * Checks a file against an `accept` list. Entries starting with '.' match by
 * extension (e.g. '.pdf'), entries ending in '/*' match by MIME type prefix
 * (e.g. 'image/*'), everything else matches the exact MIME type.
 */
const matchesAccept = (file: File, accept?: string[]): boolean => {
    if (!accept || accept.length === 0) return true;

    return accept.some((pattern) => {
        if (pattern.startsWith('.')) {
            return file.name.toLowerCase().endsWith(pattern.toLowerCase());
        }
        if (pattern.endsWith('/*')) {
            return file.type.startsWith(pattern.slice(0, -1));
        }
        return file.type === pattern;
    });
};

/**
 * Validates an <input type="file"> field: required/minFiles/maxFiles, accepted
 * types (by extension or MIME type), max size per file, and - for image files -
 * min/max width and height. All of these are config-driven only (via
 * NFSFU234FormValidation.configureForms()) since there's no equivalent HTML
 * attribute for most of them beyond `required` and `accept`.
 *
 * This is the library's only async field validator, since reading file size/
 * type is synchronous but reading image dimensions requires decoding the
 * image first.
 */
const validateFile = async (
    fileInputField: HTMLInputElement,
    options: any = {}
): Promise<boolean | ErrorMessageInterface> => {

    if (typeof window === 'undefined') {
        ExceptionHandler("To access this function, you need to be in a browser environment.");
        return false;
    }

    let individualResponseMessage: ErrorMessageInterface = { code: 400, message: "" };

    const form: HTMLFormElement | HTMLDivElement | undefined = options.form || undefined;
    const includeHTML = options.includeHTML === false ? false : true;
    const errorType: string = options.errorType || options.error_type || 'inline';
    const customErrorMessages: any = options.customErrorMessages || [];

    const fieldKey = fileInputField.getAttribute('name') || fileInputField.id || undefined;
    const fieldRule: FieldRuleInterface | undefined = form ? getFieldRule(form, fieldKey) : undefined;

    const isRequired = fieldRule?.required ?? fileInputField.hasAttribute('required');
    const files: FileList | null = fileInputField.files;
    const fileCount = files ? files.length : 0;

    let errorMessage: string | undefined = undefined;

    if ((isRequired && fileCount === 0) || (fieldRule?.minFiles !== undefined && fileCount < fieldRule.minFiles)) {
        errorMessage = fieldRule?.requiredMessage ?? customErrorMessages?.file ?? fieldRule?.message
            ?? (fieldRule?.minFiles ? `Please select at least ${fieldRule.minFiles} file(s).` : "Please select a file.");
    }

    if (!errorMessage && fieldRule?.maxFiles !== undefined && fileCount > fieldRule.maxFiles) {
        errorMessage = fieldRule.message ?? `Please select no more than ${fieldRule.maxFiles} file(s).`;
    }

    if (!errorMessage && files && fileCount > 0) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            if (fieldRule?.accept && !matchesAccept(file, fieldRule.accept)) {
                errorMessage = fieldRule.typeMessage ?? fieldRule.message ?? `"${file.name}" is not an accepted file type.`;
                break;
            }

            if (fieldRule?.maxSizeMB !== undefined && file.size > fieldRule.maxSizeMB * 1024 * 1024) {
                errorMessage = fieldRule.sizeMessage ?? fieldRule.message ?? `"${file.name}" exceeds the maximum size of ${fieldRule.maxSizeMB}MB.`;
                break;
            }

            const needsDimensionCheck = fieldRule?.maxWidth !== undefined || fieldRule?.maxHeight !== undefined
                || fieldRule?.minWidth !== undefined || fieldRule?.minHeight !== undefined;

            if (isImageFile(file) && needsDimensionCheck) {
                const dimensions = await getImageDimensions(file);

                if (dimensions) {
                    if (fieldRule!.maxWidth !== undefined && dimensions.width > fieldRule!.maxWidth) {
                        errorMessage = fieldRule!.dimensionMessage ?? fieldRule!.message ?? `"${file.name}" is wider than the maximum of ${fieldRule!.maxWidth}px.`;
                        break;
                    }
                    if (fieldRule!.maxHeight !== undefined && dimensions.height > fieldRule!.maxHeight) {
                        errorMessage = fieldRule!.dimensionMessage ?? fieldRule!.message ?? `"${file.name}" is taller than the maximum of ${fieldRule!.maxHeight}px.`;
                        break;
                    }
                    if (fieldRule!.minWidth !== undefined && dimensions.width < fieldRule!.minWidth) {
                        errorMessage = fieldRule!.dimensionMessage ?? fieldRule!.message ?? `"${file.name}" is narrower than the minimum of ${fieldRule!.minWidth}px.`;
                        break;
                    }
                    if (fieldRule!.minHeight !== undefined && dimensions.height < fieldRule!.minHeight) {
                        errorMessage = fieldRule!.dimensionMessage ?? fieldRule!.message ?? `"${file.name}" is shorter than the minimum of ${fieldRule!.minHeight}px.`;
                        break;
                    }
                }
            }
        }
    }

    if (errorMessage) {
        individualResponseMessage.message = errorMessage;
        individualResponseMessage.data = fileInputField;

        if (includeHTML) {
            if (errorType === 'inline') {
                displayErrorInline(fileInputField as any, errorMessage, 3000);
            } else {
                focusInputElement(fileInputField as any, 3000);
                if (form) displayErrorModal(errorMessage, form as any);
            }
        }

        ExceptionHandler(errorMessage);
        return individualResponseMessage;
    }

    individualResponseMessage.code = 200;
    return true;
};

export default validateFile;