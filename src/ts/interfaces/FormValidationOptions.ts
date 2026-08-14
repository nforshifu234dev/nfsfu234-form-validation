import AJAXOptionsInterface from "./AJAXOptionsInterface";

/**
 * Call-context options accepted by every `validate*()`/`validateAll*()`
 * method (and `submit()`/`validate()` at the instance level).
 *
 * Does NOT include field-level validation rules (`required`, `type`,
 * `minLength`, `maxLength`, `pattern`, `accept`, `maxSizeMB`, image
 * dimension limits, etc.) - every internal validator reads those
 * exclusively from a rule registered via
 * `NFSFU234FormValidation.configureForms()`, or from the field's own HTML
 * attributes. This interface only controls how a given validation call
 * behaves: which form to validate against, which messages to show, and how
 * to display them.
 */
export interface FormValidationOptions {
    form?: HTMLFormElement | HTMLDivElement | string | { form?: HTMLFormElement | HTMLDivElement };
    ajaxOptions?: AJAXOptionsInterface;
    customErrorMessages?: Record<string, string>;
    errorType?: 'modal' | 'inline';
    /** Legacy alias for `errorType`, still read by some internal validators. */
    error_type?: 'modal' | 'inline';
    /** Whether an error message may contain HTML instead of being treated as plain text. */
    includeHTML?: boolean;
    /** Suppresses displaying the error automatically (e.g. when you only want the result, not the UI side effect). */
    ignoreError?: boolean;
}