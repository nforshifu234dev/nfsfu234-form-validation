interface ErrorMessageInterface {
    message?: string | boolean | number;
    type?: string;
    code?: number;
    data?: string | number | object | Array<any> | JSON | HTMLElement | null | undefined | boolean;
}

interface PasswordStrengthResult {
    score: number;
    label: 'very weak' | 'weak' | 'fair' | 'good' | 'strong';
    suggestions: string[];
}

interface FieldRuleInterface {
    required?: boolean;
    type?: 'email' | 'url' | 'zip' | 'date' | 'integer' | string;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    message?: string;
    accept?: string[];
    maxSizeMB?: number;
    minFiles?: number;
    maxFiles?: number;
    maxWidth?: number;
    maxHeight?: number;
    minWidth?: number;
    minHeight?: number;
    requiredMessage?: string;
    typeMessage?: string;
    sizeMessage?: string;
    dimensionMessage?: string;
}

interface FormConfigInterface {
    form: string;
    fields?: {
        [fieldName: string]: FieldRuleInterface;
    };
    ajaxOptions?: any;
    errorType?: 'inline' | 'modal';
    customErrorMessages?: {
        [key: string]: string;
    };
}

/**
 * A lightweight, dependency-free client-side form validation library.
 * Resolves a form (by id, element, or the first `<form>` on the page),
 * then validates inputs, textareas, selects, radios, checkboxes, and file
 * uploads - via HTML attributes, or a declarative config registered with
 * {@link NFSFU234FormValidation.configureForms}.
 */
declare class NFSFU234FormValidation {
    private AJAXResult;
    /**
     * The resolved form element this instance operates on. Set during
     * construction (or by whichever method last resolved a `userOptions.form`
     * override) - undefined in non-browser environments, or if no form could
     * be found via `formDetails`, `#jsForm`, or the page's first `<form>`.
     */
    form: HTMLFormElement | HTMLDivElement | undefined;
    /**
     * Custom error messages keyed by field name or validation rule, used to
     * override the library's default messages when validating this
     * instance's form.
     */
    customErrorMessages: {
        [key: string]: string;
    };
    /**
     * @param formDetails - The form to attach to: a CSS id string, an
     * element, or `{ form, customErrorMessages }`. Falls back to `#jsForm`,
     * then the first `<form>` on the page, if omitted.
     * @param AJAXOptions - Default AJAX request options used by `.submit()`.
     */
    constructor(formDetails?: any, AJAXOptions?: any);
    /**
     * Register form configs for the whole site in one place - typically a
     * single shared config file included on every page. Only forms
     * actually present in the current page's DOM get wired up when
     * autoInit() runs, so it's safe to register every form on the site.
     * @param configs - One config per form, keyed by CSS selector, describing its field rules, AJAX options, error display type, and custom messages.
     */
    static configureForms(configs: FormConfigInterface[]): void;
    /**
     * Scans the current page for whichever registered forms are present
     * and wires each one up (novalidate, submit handling, and AJAX
     * submission if configured). Call this once per page, after
     * configureForms() has been called with the site's full form config.
     * @returns One `NFSFU234FormValidation` instance per registered form found on the current page.
     */
    static autoInit(): NFSFU234FormValidation[];
    /**
     * @internal
     * Resolves whether a call should submit via AJAX and, if so, builds the
     * request options - either from an explicit `options.ajaxOptions`
     * object, or (as a fallback) from the form element's own `isAjax`,
     * `action`, `method`, and `nfsfu234_fv_reqheader_*` attributes.
     * Not part of the public API - excluded from generated docs.
     * @param options - Either an explicit `{ isAjax, ajaxOptions }`-shaped object, or omitted to fall back to reading the form's attributes.
     * @param formElement - The form to read AJAX-related attributes from when `options` doesn't already specify them.
     */
    private populateOptionsVariables;
    /**
     * Validates the whole form (every input, textarea, select, radio,
     * checkbox, and file field), then - if validation passes and AJAX is
     * configured - submits it and resolves once the request completes.
     * Always async; always returns a `Promise`.
     * @param userOptions - Overrides the form/customErrorMessages set at construction.
     * @param callback - Optional callback invoked with the result instead of/alongside the returned Promise.
     * @returns A `Promise` resolving to `{ message, type, data }` on validation-only outcomes, or the raw AJAX response on a successful AJAX submission.
     */
    submit(userOptions?: HTMLFormElement | HTMLDivElement | string | {
        form: string | HTMLFormElement | HTMLDivElement;
        customErrorMessages?: {
            [key: string]: string;
        };
    }, callback?: any): Promise<any>;
    /**
     * Validates the whole form (every input, textarea, select, radio,
     * checkbox, and file field) without submitting it. Always async;
     * always returns a `Promise`.
     * @param userOptions - Overrides the form/customErrorMessages set at construction.
     * @param callback - Optional callback invoked with the result instead of/alongside the returned Promise.
     * @returns A `Promise` resolving to `{ message, type, data }` describing the validation outcome.
     */
    validate(userOptions?: HTMLFormElement | HTMLDivElement | string | {
        form: HTMLFormElement | HTMLDivElement | string;
        customErrorMessages?: any[];
    }, callback?: any): Promise<any>;
    /**
     * Sends an AJAX request using the supplied request configuration.
     *
     * The returned Promise is also stored internally so it can later be
     * retrieved with {@link getAJAXResponse()}.
     *
     * @param AJAXOptions - The request configuration, including the URL,
     * HTTP method, headers, and request body.
     * @returns A Promise that resolves with the server response.
     */
    ajax(AJAXOptions: any): Promise<any>;
    /**
     * Returns the Promise from the most recent AJAX request.
     *
     * This is useful if you need to access the result of an earlier call to
     * {@link ajax()} or {@link submit()} without creating a new request.
     *
     * @returns The stored Promise, or `false` if no AJAX request has been made.
     */
    getAJAXResponse(): Promise<any> | boolean;
    /**
     * Reads every field's current value from a form - inputs, textareas,
     * selects, checkboxes, and radios - keyed by field name (falling back to
     * `data-attr-name` where `name` isn't set).
     * @param form - The form to read, or its CSS id. Falls back to this instance's `form` if omitted.
     * @returns An object/record of field name → value, or `false` if the form couldn't be resolved.
     */
    getFormDetails(form: HTMLFormElement | HTMLDivElement | string): boolean | ErrorMessageInterface | Record<string, string | boolean>;
    /**
     * Shows a loading message/animation on a submit button (or the form
     * itself) while an async operation - typically `.submit()` - is in
     * flight. Pair with your own logic to clear it once the operation
     * settles.
     * @param message - The loading text to display.
     * @param submitBtn - The submit button to update, as an element or its CSS id. Defaults to none.
     * @param form - The form the loading state applies to, as an element or its CSS id. Defaults to this instance's `form` when omitted.
     * @returns `true` (or `false`/an `ErrorMessageInterface` on failure to resolve the target elements).
     */
    loading(message: string, submitBtn?: string | HTMLElement | null, form?: string | HTMLElement | null | undefined): boolean | ErrorMessageInterface;
    /**
     * Manually displays an error message, either inline next to a field or
     * as a modal, using the same rendering path validation errors use
     * internally.
     * @param details - Error display options: message, target element, display type (`'inline'` | `'modal'`), and duration.
     */
    displayError(details: any): void;
    /**
     * Checks whether a string is a syntactically valid email address.
     * @param email - The value to check.
     * @returns `true` if `email` looks like a valid email address.
     */
    isEmail(email: string): boolean;
    /**
     * Checks whether a string is a syntactically valid URL.
     * @param url - The value to check.
     * @returns `true` if `url` looks like a valid URL.
     */
    isURL(url: string): boolean;
    /**
     * Checks whether a value is numeric.
     * @param number - The value to check, as a string or number.
     * @returns `true` if the value is a number.
     */
    isNumber(number: string | number): boolean;
    /**
     * Checks whether a value is a syntactically valid ZIP/postal code.
     * @param zipCode - The value to check, as a string or number.
     * @returns `true` if `zipCode` looks like a valid ZIP code.
     */
    isZipCode(zipCode: string | number): boolean;
    /** Alias for {@link isZipCode}. */
    isZip(zipCode: string | number): boolean;
    /**
     * Counts the number of characters in a string.
     * @param string - The string to measure.
     * @returns The character count.
     */
    countString(string: string): number;
    /**
     * Generates a random password of the given length.
     * @param length - The desired password length.
     * @param shouldHash - Unused as of v3 (password hashing was removed); retained for signature compatibility.
     * @returns A `Promise` resolving to the generated password.
     */
    generatePassword(length?: number, shouldHash?: boolean): Promise<any>;
    /** Alias for {@link generatePassword}. */
    generateRandomPassword(length: number, shouldHash: boolean): Promise<any>;
    /**
     * Scores a password's strength heuristically (length + character-class
     * diversity), purely client-side - a UX strength meter, not a security
     * guarantee. Returns a 0-100 score, a qualitative label, and suggestions.
     * @param password - The password to score.
     */
    passwordStrength(password: string): PasswordStrengthResult;
    /**
     * Alias for {@link passwordStrength}.
     * @param password - The password to score.
     */
    getPasswordStrength(password: string): PasswordStrengthResult;
    /**
     * Validates a password against length and (optionally) symbol
     * requirements.
     * @param password - The password to check.
     * @param minLength - Minimum allowed length. Defaults to `8`.
     * @param maxLength - Maximum allowed length. Defaults to `20`.
     * @param includeSymbolsCheck - Whether the password must contain a symbol. Defaults to `false`.
     * @param userSymbolRegex - A custom regex (or pattern string) defining what counts as a symbol, used only when `includeSymbolsCheck` is `true`.
     * @returns `true` if the password passes all checks, otherwise a string/error describing the failure.
     */
    checkPassword(password: string, minLength?: number, maxLength?: number, includeSymbolsCheck?: boolean, userSymbolRegex?: RegExp | string): string | boolean;
    /**
     * Toggles a single password field between masked and visible, swapping
     * an optional show/hide icon accordingly.
     * @param input - The password input to toggle.
     * @param showIcon - The icon element (or its CSS id) to display when the password is hidden.
     * @param hideIcon - The icon element (or its CSS id) to display when the password is visible.
     */
    togglePasswordVisibility(input: HTMLInputElement, showIcon?: string | HTMLElement | null, hideIcon?: string | HTMLElement | null): any;
    /**
     * Toggles every password field in a form (or just one, unless
     * `toggleAll` is set) between masked and visible.
     * @param icons - The shared show/hide icon elements (or CSS ids) used across all toggled fields.
     * @param uform - The form to scan, as an element or its CSS id. Defaults to this instance's `form` if omitted.
     * @param toggleAll - When `true`, toggles every password field in the form at once. Defaults to `false`.
     */
    togglePasswordVisibilityAll(icons: {
        show: string | HTMLElement | null;
        hide: string | HTMLElement | null;
    }, uform?: string | HTMLFormElement | HTMLDivElement | null, toggleAll?: boolean): void;
    /**
     * Validates a single input field, via its HTML attributes or an
     * explicit `options` override.
     * @param inputField - The input to validate, as an element or its CSS id.
     * @param options - Overrides for the field's validation rule (`required`, `type`, `minLength`, `maxLength`, `pattern`, `message`, etc.). Defaults to `{}`.
     * @param callback - Optional callback invoked with the result instead of/alongside the returned value.
     * @returns `true` on success, or a `Promise` resolving to an `ErrorMessageInterface` describing the failure.
     */
    validateInput(inputField: HTMLInputElement | string, options?: any, callback?: any): true | Promise<unknown>;
    /**
     * Validates every input in the form. Returns `true`, or an array of
     * per-field error results.
     * @param form - The form to validate, as an element or its CSS id. Defaults to this instance's `form` if omitted.
     * @param customErrorMessages - Custom error messages keyed by field name or rule, overriding the defaults.
     */
    validateAllInput(form: HTMLFormElement | HTMLDivElement | string, customErrorMessages: any): boolean | ErrorMessageInterface[];
    /**
     * Validates a single radio group by its input name.
     * @param radioInputField - Any radio input in the group (or its CSS id) - the group is resolved by shared `name`.
     * @param customErrorMessage - A custom message to use instead of the default, if the group is invalid.
     */
    validateRadio(radioInputField: HTMLInputElement | string, customErrorMessage?: any): string | boolean | ErrorMessageInterface;
    /**
     * Validates every radio group in the form.
     * @param form - The form to validate. Defaults to this instance's `form` if omitted.
     * @param customErrorMessage - Custom error messages keyed by radio group name, overriding the defaults.
     */
    validateAllRadio(form: HTMLFormElement | HTMLDivElement, customErrorMessage: any): boolean | ErrorMessageInterface | ErrorMessageInterface[];
    /**
     * Validates a single checkbox field.
     * @param checkboxInputField - The checkbox to validate.
     * @param options - Overrides for the field's validation rule (e.g. `required`).
     */
    validateCheckbox(checkboxInputField: HTMLInputElement, options?: any): boolean | ErrorMessageInterface;
    /**
     * Validates every checkbox in the form.
     * @param form - The form to validate. Defaults to this instance's `form` if omitted.
     * @param options - Custom error messages / overrides keyed by field name.
     */
    validateAllCheckbox(form: HTMLFormElement | HTMLDivElement, options: any): boolean | ErrorMessageInterface | ErrorMessageInterface[];
    /**
     * Validates a single `<input type="file">` field: required/min/max file
     * count, accepted types (`accept`), max size (`maxSizeMB`), and - for
     * images - dimension limits. Async, since checking image dimensions
     * requires decoding the file.
     * @param fileInputField - The file input to validate.
     * @param options - File rule overrides: `required`, `accept`, `maxSizeMB`, `minFiles`, `maxFiles`, `maxWidth`, `maxHeight`, `minWidth`, `minHeight`, and their `*Message` variants.
     * @returns A `Promise` resolving to `true`, or an `ErrorMessageInterface` describing the failure.
     */
    validateFile(fileInputField: HTMLInputElement, options?: any): Promise<boolean | ErrorMessageInterface>;
    /**
     * Validates every `<input type="file">` field in the form. Async - see
     * {@link validateFile}.
     * @param form - The form to validate. Defaults to this instance's `form` if omitted.
     * @param options - File rule overrides, applied across all file fields unless a field specifies its own.
     * @returns A `Promise` resolving to `true`, or an array of per-field `ErrorMessageInterface` results.
     */
    validateAllFile(form: HTMLFormElement | HTMLDivElement, options?: any): Promise<boolean | ErrorMessageInterface[]>;
    /**
     * Validates a single `<select>` field.
     * @param selectField - The select element to validate.
     * @param options - Overrides for the field's validation rule (e.g. `required`).
     * @param callback - Optional callback invoked with the result.
     */
    validateSelect(selectField: HTMLSelectElement, options: any, callback: any): boolean | ErrorMessageInterface;
    /**
     * Validates every `<select>` field in the form.
     * @param form - The form to validate.
     * @param options - Custom error messages / overrides keyed by field name.
     */
    validateAllSelect(form: HTMLFormElement | HTMLDivElement, options: any): boolean | ErrorMessageInterface | ErrorMessageInterface[];
    /**
     * Validates a single `<textarea>` field.
     * @param textareaField - The textarea to validate.
     * @param options - Overrides for the field's validation rule (e.g. `required`, `minLength`, `maxLength`).
     */
    validateTextarea(textareaField: HTMLTextAreaElement, options: any): string | boolean | ErrorMessageInterface;
    /**
     * Validates every `<textarea>` field in the form.
     * @param form - The form to validate.
     * @param options - Custom error messages / overrides keyed by field name.
     */
    validateAllTextarea(form: HTMLFormElement | HTMLDivElement, options: any): boolean | ErrorMessageInterface | ErrorMessageInterface[];
    /**
     * Wires a live character counter to an input/textarea, and (depending
     * on `options`) restricts further input once the limit is reached.
     * @param inputElement - The field to count/restrict.
     * @param counterContainer - The element that displays the current/remaining character count.
     * @param options - Configuration such as the max length and counter display format. Defaults to `{}`.
     */
    restrictInputWithCounter(inputElement: HTMLInputElement | HTMLTextAreaElement, counterContainer: HTMLElement, options?: any): any;
    /**
     * Checks whether a string consists only of integer digits.
     * @param str - The string to check.
     * @returns `true` if `str` contains only integer digits.
     */
    containsOnlyIntegers(str: string): boolean;
    /**
     * Gets the current page's URL.
     * @returns The current page URL, or `false` if it couldn't be determined (e.g. outside a browser environment).
     */
    getPageURL(): string | boolean;
    /**
     * Redirects the browser to a URL, optionally after a delay.
     * @param url - The destination URL. Defaults to the current page's URL (effectively a reload) if omitted, `null`, or `false`.
     * @param delay - Delay in milliseconds before redirecting. Defaults to `0`.
     */
    redirect(url?: string | null | false | undefined, delay?: number): void;
    /**
     * Returns the runtime type of a variable as a lowercase string (e.g.
     * `'string'`, `'number'`, `'object'`, `'function'`), more granular than
     * a raw `typeof`.
     * @param variable - The value to check.
     */
    checkVariableType(variable: any): string;
    /**
     * Checks whether the browser is currently connected to the internet.
     * @returns `navigator.onLine`.
     */
    isOnline(): boolean;
    /**
     * Resets all fields in a form to their default/empty values.
     * @param u_form - The form to reset, as an element or its CSS id. Defaults to this instance's `form` if omitted.
     * @returns `true` if the form was found and reset.
     */
    reset(u_form: HTMLFormElement | HTMLDivElement | string): boolean;
}

export { type ErrorMessageInterface, type FieldRuleInterface, type FormConfigInterface, NFSFU234FormValidation, type PasswordStrengthResult, NFSFU234FormValidation as default };
