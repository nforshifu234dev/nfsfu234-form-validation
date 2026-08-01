'use strict';

import ajax from "./ajax/ajax";
import ErrorHandler from "./errorHandling";
import { ExceptionHandler, LogLevelInterface } from "./errorHandling/ExceptionHandler";
import displayError from "./errorHandling/displayError";
import getFormDetails from "./formValidations/getFormDetails";
import restrictInputLengthWithCounter from "./formValidations/restrictInputLengthWithCounter";
import validateForm from "./formValidations/validate";
import validateAllCheckbox from "./formValidations/validateAllCheckbox";
import validateAllFile from "./formValidations/validateAllFile";
import validateAllRadio from "./formValidations/validateAllRadio";
import validateAllSelect from "./formValidations/validateAllSelect";
import validateAllTextarea from "./formValidations/validateAllTextarea";
import validateAllInput from "./formValidations/validateAllnput";
import validateCheckbox from "./formValidations/validateCheckbox";
import validateFile from "./formValidations/validateFile";
import validateInput from "./formValidations/validateInput";
import validateRadio from "./formValidations/validateRadio";
import validateSelect from "./formValidations/validateSelect";
import validateTextarea from "./formValidations/validateTextarea";
import ErrorMessageInterface from "./interfaces/ErrorMessagesInterface";
import checkPassword from "./password-handling/checkPassword";
import passwordStrength, { PasswordStrengthResult } from "./password-handling/passwordStrength";
import generatePassword from "./password-handling/generatePassword";
import checkVariableType from "./utilities/checkVariableType";
import containsOnlyIntegers from "./utilities/containsOnlyIntegers";
import countString from "./utilities/countString";
import getPageUrl from "./utilities/getPageUrl";
import isEmail from "./utilities/isEmail";
import isOnline from "./utilities/isOnline";
import isURL from "./utilities/isURL";
import isZIP from "./utilities/isZIP";
import loading from "./utilities/loading";
import redirect from "./utilities/redirect";
import reset from "./utilities/reset";
import togglePasswordVisibility from "./utilities/togglePasswordVisibility";
import togglePasswordVisibilityAll from "./utilities/togglePasswordVisibilityAll";
import { configureForms, autoInitForms } from "./config/formRegistry";
import FormConfigInterface from "./interfaces/FormConfigInterface";


// src/interfaces/FormValidationOptions.ts


/**
 * A lightweight, dependency-free client-side form validation library.
 * Resolves a form (by id, element, or the first `<form>` on the page),
 * then validates inputs, textareas, selects, radios, checkboxes, and file
 * uploads - via HTML attributes, or a declarative config registered with
 * {@link NFSFU234FormValidation.configureForms}.
 */
class NFSFU234FormValidation {
    // private attributes
    private AJAXResult: null | Promise<any>;

    /**
     * The resolved form element this instance operates on. Set during
     * construction (or by whichever method last resolved a `userOptions.form`
     * override) - undefined in non-browser environments, or if no form could
     * be found via `formDetails`, `#jsForm`, or the page's first `<form>`.
     */
    public form: HTMLFormElement | HTMLDivElement | undefined;

    /**
     * Custom error messages keyed by field name or validation rule, used to
     * override the library's default messages when validating this
     * instance's form.
     */
    public customErrorMessages: { [key: string]: string } = {};

    /**
     * @param formDetails - The form to attach to: a CSS id string, an
     * element, or `{ form, customErrorMessages }`. Falls back to `#jsForm`,
     * then the first `<form>` on the page, if omitted.
     * @param AJAXOptions - Default AJAX request options used by `.submit()`.
     */
    constructor(formDetails?: any, AJAXOptions?: any) {
        console.log("NFSFU234FormValidation is loaded....");

        if (typeof window === 'undefined') {
            this.form = undefined;
        } else {
            // Initial assignment of this.form
            let formElement: HTMLFormElement | HTMLDivElement | undefined = undefined;

            // Check if formDetails is provided and valid
            if (formDetails && formDetails['form']) {
                if (typeof formDetails['form'] === 'string' && formDetails['form'] !== '') {
                    formElement = document.getElementById(formDetails['form']) as HTMLFormElement | HTMLDivElement | undefined;
                } else if (formDetails['form'] instanceof HTMLElement) {
                    formElement = formDetails['form'] as HTMLFormElement | HTMLDivElement;
                }
            }

            // Fallback to default form selectors if formElement is not set
            if (!formElement) {
                formElement = document.getElementById('jsForm') as HTMLFormElement | HTMLDivElement | undefined;
            }
            if (!formElement) {
                formElement = document.querySelector('form') as HTMLFormElement | HTMLDivElement | undefined;
            }

            // Assign formElement to this.form
            this.form = formElement;
        }

        // If form is found and is an HTMLElement, add novalidate attribute and submit event listener
        if (this.form && this.form instanceof HTMLElement) {
            if (!this.form.hasAttribute('novalidate')) {
                this.form.setAttribute('novalidate', '');
            }

            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
            });
        }

        this.AJAXResult = null; // Store the result of an AJAX call.
    }

    /**
     * Register form configs for the whole site in one place - typically a
     * single shared config file included on every page. Only forms
     * actually present in the current page's DOM get wired up when
     * autoInit() runs, so it's safe to register every form on the site.
     * @param configs - One config per form, keyed by CSS selector, describing its field rules, AJAX options, error display type, and custom messages.
     */
    public static configureForms(configs: FormConfigInterface[]): void {
        configureForms(configs);
    }

    /**
     * Scans the current page for whichever registered forms are present
     * and wires each one up (novalidate, submit handling, and AJAX
     * submission if configured). Call this once per page, after
     * configureForms() has been called with the site's full form config.
     * @returns One `NFSFU234FormValidation` instance per registered form found on the current page.
     */
    public static autoInit(): NFSFU234FormValidation[] {
        return autoInitForms(NFSFU234FormValidation);
    }


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
    private populateOptionsVariables(options: any, formElement: HTMLFormElement | HTMLDivElement | undefined) {
        let isAjax = false;
        let ajaxOptions: null | {
            url: string,
            RequestMethod: "GET" | "POST" | "PATCH" | "UPDATE" | "DELETE",
            RequestHeader?: { [key: string]: string },
            RequestBody?: object | FormData | JSON
        } = null;

        if (typeof options === 'object' && options !== null) {
            isAjax = options.isAjax === true || false;
            ajaxOptions = options.ajaxOptions || null;
        } else if (formElement) {
            isAjax = formElement.getAttribute('isAjax')?.trim() === "true" || false;

            const url = formElement.getAttribute('action') || '';
            const requestMethod = (formElement.getAttribute('method') || 'GET').toUpperCase();

            const requestHeaders: { [key: string]: string } = {};
            const regex = /^nfsfu234_fv_reqheader_(.+)$/i;

            for (let i = 0; i < formElement.attributes.length; i++) {
                const attr = formElement.attributes[i];
                const originalName = attr.name;
                const attrName = attr.name.toLowerCase();
                const match = attrName.match(regex);

                if (match) {
                    const headerKey = match[1];
                    requestHeaders[headerKey] = attr.value;
                }
            }

            ajaxOptions = {
                url,
                RequestMethod: requestMethod as "GET" | "POST" | "PATCH" | "UPDATE" | "DELETE",
                RequestHeader: Object.keys(requestHeaders).length > 0 ? requestHeaders : undefined,
                RequestBody: undefined
            };
        }

        return { isAjax, ajaxOptions };
    }

    /**
     * Validates the whole form (every input, textarea, select, radio,
     * checkbox, and file field), then - if validation passes and AJAX is
     * configured - submits it and resolves once the request completes.
     * Always async; always returns a `Promise`.
     * @param userOptions - Overrides the form/customErrorMessages set at construction.
     * @param callback - Optional callback invoked with the result instead of/alongside the returned Promise.
     * @returns A `Promise` resolving to `{ message, type, data }` on validation-only outcomes, or the raw AJAX response on a successful AJAX submission.
     */
    public async submit(
        userOptions?: HTMLFormElement | HTMLDivElement | string | { form: string | HTMLFormElement | HTMLDivElement, customErrorMessages?: { [key: string]: string } },
        callback?: any
    ): Promise<any> {
        this.form = this.form || undefined;
        this.customErrorMessages = this.customErrorMessages || {};

        let formElement: HTMLFormElement | HTMLDivElement | undefined = this.form;
        let options: any = this.customErrorMessages;

        let isAjax = false;
        let ajaxOptions: null | {
            url: string,
            RequestMethod: "GET" | "POST" | "PUT" | "PATCH" | "UPDATE" | "DELETE",
            RequestHeader?: object,
            RequestBody?: object | FormData | JSON | any
        } = null;

        // Handle userOptions to determine formElement and options
        if (typeof userOptions === 'string') {
            formElement = document.getElementById(userOptions) as HTMLFormElement | HTMLDivElement | undefined;
            options = { form: formElement, customErrorMessages: [] };
        } else if (userOptions instanceof HTMLFormElement || userOptions instanceof HTMLDivElement) {
            formElement = userOptions;
            options = { form: formElement, customErrorMessages: [] };
        } else if (userOptions && typeof userOptions === 'object' && 'form' in userOptions) {
            if (typeof userOptions.form === 'string') {
                formElement = document.getElementById(userOptions.form) as HTMLFormElement | HTMLDivElement | undefined;
            } else if (userOptions.form instanceof HTMLFormElement || userOptions.form instanceof HTMLDivElement) {
                formElement = userOptions.form;
            }
            options = { form: formElement, customErrorMessages: userOptions.customErrorMessages ?? [] };
        }

        // Ensure formElement is available
        if (!formElement) {
            ExceptionHandler('Form element not found.');
            return false;
        }

        // Handle form's novalidate attribute
        const doesNoValidateAttrExist = formElement.getAttribute('novalidate') !== null;
        if (!doesNoValidateAttrExist) {
            formElement.setAttribute('novalidate', '');
        }

        // Prevent default form submission
        formElement.addEventListener('submit', (e) => {
            e.preventDefault();
        });

        // Process options for Ajax submission
        const { isAjax: processedIsAjax, ajaxOptions: processedAjaxOptions } = this.populateOptionsVariables(userOptions, formElement);
        isAjax = processedIsAjax;
        ajaxOptions = processedAjaxOptions;

        // Validate form and determine the error message
        let errMsg: ErrorMessageInterface = { message: "", type: "" };
        const errMsgFromFunction = await validateForm(formElement, options);

        if (errMsgFromFunction === true) {
            errMsg.message = "success";
            errMsg.type = "success";
            errMsg.data = null;
        } else if (typeof errMsgFromFunction === 'object' && errMsgFromFunction !== null && 'message' in errMsgFromFunction) {
            const errMessageFromValidate = errMsgFromFunction.message;
            errMsg.message = (typeof errMessageFromValidate === 'string' || typeof errMessageFromValidate === 'number' || typeof errMessageFromValidate === 'boolean')
                ? errMessageFromValidate
                : "Error";
            errMsg.type = "error";
            errMsg.data = (errMsgFromFunction as any).data ?? errMsgFromFunction;
        } else {
            errMsg.message = "Error";
            errMsg.type = "error";
        }

        // Handle Ajax submission if applicable
        if (errMsg.message === "success" && isAjax && ajaxOptions !== null) {
            ajaxOptions.RequestBody = getFormDetails(formElement);
            return ajax(ajaxOptions)
                .then(response => {
                    const responseCode = response.code || response.status;
                    if (responseCode >= 300 && responseCode <= 500) {
                        const errorDetails = {
                            type: 'modal',
                            message: response.message,
                            duration: 3000,
                            element: formElement,
                            success: false,
                        };

                        errMsg.message = response.message;
                        errMsg.type = "error";
                        errMsg.code = responseCode;
                        errMsg.data = response.data;

                        this.displayError(errorDetails);
                        console.error("THIS IS ERR_ ", response.message);

                        return errMsg;
                    } else {
                        console.log("Success");
                        return response;
                    }
                })
                .catch(error => {
                    console.error("LOLK ", error);
                    return errMsg;
                });
        }

        // Handle callback if provided
        if (typeof callback === 'function') {
            callback(errMsg);
            return true;
        }

        // Return a promise resolving to the error message
        return new Promise((resolve) => {
            resolve(errMsg);
        });
    }



    /**
     * Validates the whole form (every input, textarea, select, radio,
     * checkbox, and file field) without submitting it. Always async;
     * always returns a `Promise`.
     * @param userOptions - Overrides the form/customErrorMessages set at construction.
     * @param callback - Optional callback invoked with the result instead of/alongside the returned Promise.
     * @returns A `Promise` resolving to `{ message, type, data }` describing the validation outcome.
     */
    public async validate(
        userOptions?: HTMLFormElement | HTMLDivElement | string | { form: HTMLFormElement | HTMLDivElement | string; customErrorMessages?: any[] },
        callback?: any
    ): Promise<any> {
        let formElement: HTMLFormElement | HTMLDivElement | undefined;
        let options: any = {}; // Initialize options as an empty object

        // Determine the form element and options based on userOptions
        if (typeof userOptions === 'string') {
            formElement = document.getElementById(userOptions) as HTMLFormElement | HTMLDivElement | undefined;
            options = { form: formElement, customErrorMessages: [] };
        } else if (userOptions instanceof HTMLFormElement || userOptions instanceof HTMLDivElement) {
            formElement = userOptions;
            options = { form: formElement, customErrorMessages: [] };
        } else if (userOptions && typeof userOptions === 'object' && 'form' in userOptions) {
            if (typeof userOptions.form === 'string') {
                formElement = document.getElementById(userOptions.form) as HTMLFormElement | HTMLDivElement | undefined;
            } else if (userOptions.form instanceof HTMLFormElement || userOptions.form instanceof HTMLDivElement) {
                formElement = userOptions.form;
            }
            options = { form: formElement, customErrorMessages: userOptions.customErrorMessages ?? [] };
        } else {
            formElement = this.form;
            options = { form: formElement, customErrorMessages: [] };
        }

        // Ensure form element exists
        if (!formElement) {
            ExceptionHandler('Form element not found.');
            return false;
        }

        // Handle form's novalidate attribute
        const doesNoValidateAttrExist = formElement.getAttribute('novalidate') !== null;
        if (!doesNoValidateAttrExist) {
            formElement.setAttribute('novalidate', '');
        }

        // Prevent default form submission
        formElement.addEventListener('submit', (e) => {
            e.preventDefault();
        });

        // Initialize errMsg with default values
        let errMsg: ErrorMessageInterface = { message: "", type: "" };

        // Validate the form using the provided function
        const errMsgFromFunction = await validateForm(formElement, options);

        if (errMsgFromFunction === true) {
            errMsg.message = "success";
            errMsg.type = "success";
            errMsg.data = null;
        } else if (typeof errMsgFromFunction === 'object' && errMsgFromFunction !== null && 'message' in errMsgFromFunction) {
            const errMessageFromValidate = errMsgFromFunction.message;

            // Ensure the message is of the correct type before assignment
            if (typeof errMessageFromValidate === 'string' || typeof errMessageFromValidate === 'number' || typeof errMessageFromValidate === 'boolean') {
                errMsg.message = errMessageFromValidate;
            } else {
                errMsg.message = "Error"; // Fallback to a default message if the type doesn't match
            }

            errMsg.type = "error";
            errMsg.data = (errMsgFromFunction as any).data ?? errMsgFromFunction;
        } else {
            errMsg.message = "Error";
            errMsg.type = "error";
        }

        // If a callback is provided, invoke it with errMsg
        if (typeof callback === 'function') {
            callback(errMsg);
            return true;
        }

        // Return a promise resolving to the error message
        return new Promise((resolve) => {
            resolve(errMsg);
        });
    }




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
    public ajax(AJAXOptions: any) {

        // return this.AJAXResult = ajax(AJAXOptions);
        return this.AJAXResult = ajax(AJAXOptions);
    }

    /**
     * Returns the Promise from the most recent AJAX request.
     *
     * This is useful if you need to access the result of an earlier call to
     * {@link ajax()} or {@link submit()} without creating a new request.
     *
     * @returns The stored Promise, or `false` if no AJAX request has been made.
     */
    getAJAXResponse(): Promise<any> | boolean {
        if (this.AJAXResult) {
            // If `AJAXResult` contains a value (Promise), return the AJAX response
            return this.AJAXResult;
        } else {
            // If `AJAXResult` is empty (null or undefined), return false
            return false;
        }
    }

    /**
     * Reads every field's current value from a form - inputs, textareas,
     * selects, checkboxes, and radios - keyed by field name (falling back to
     * `data-attr-name` where `name` isn't set).
     * @param form - The form to read, or its CSS id. Falls back to this instance's `form` if omitted.
     * @returns An object/record of field name → value, or `false` if the form couldn't be resolved.
     */
    getFormDetails(form: HTMLFormElement | HTMLDivElement | string)
    {

        if ( ! form )
        {
            form = this.form as HTMLDivElement;
        }

        // console.log("hkbik", getFormDetails(form));


        return getFormDetails(form);
    }

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
    loading(message: string, submitBtn: string | HTMLElement | null = null, form: string | HTMLElement | null | undefined = null)
    {
        if (form !== null) {
            form = typeof form === 'string' ? document.getElementById(form) : form;
            form = typeof form === 'undefined' ? this.form : form;
        }

        // Call the loading function
        return loading(message, submitBtn, form);
    }

    /**
     * Manually displays an error message, either inline next to a field or
     * as a modal, using the same rendering path validation errors use
     * internally.
     * @param details - Error display options: message, target element, display type (`'inline'` | `'modal'`), and duration.
     */
    displayError(details:any)
    {
        displayError(details);
    }

    /**
     * Checks whether a string is a syntactically valid email address.
     * @param email - The value to check.
     * @returns `true` if `email` looks like a valid email address.
     */
    isEmail(email: string): boolean
    {
        return isEmail(email);
    }

    /**
     * Checks whether a string is a syntactically valid URL.
     * @param url - The value to check.
     * @returns `true` if `url` looks like a valid URL.
     */
    isURL(url: string)
    {
        return isURL(url);
    }

    /**
     * Checks whether a value is numeric.
     * @param number - The value to check, as a string or number.
     * @returns `true` if the value is a number.
     */
    isNumber(number: string | number): boolean
    {
        return checkVariableType(number) === 'number';
    }

    /**
     * Checks whether a value is a syntactically valid ZIP/postal code.
     * @param zipCode - The value to check, as a string or number.
     * @returns `true` if `zipCode` looks like a valid ZIP code.
     */
    isZipCode(zipCode: string | number): boolean
    {
        return isZIP(zipCode);
    }

    /** Alias for {@link isZipCode}. */
    isZip(zipCode: string | number): boolean
    {
        return isZIP(zipCode);
    }

    /**
     * Counts the number of characters in a string.
     * @param string - The string to measure.
     * @returns The character count.
     */
    countString(string: string): number
    {
        return countString(string);
    }

    /**
     * Generates a random password of the given length.
     * @param length - The desired password length.
     * @param shouldHash - Unused as of v3 (password hashing was removed); retained for signature compatibility.
     * @returns A `Promise` resolving to the generated password.
     */
    async generatePassword(length?:number, shouldHash?: boolean )
    {
        return await generatePassword(length, shouldHash);
    }

    /** Alias for {@link generatePassword}. */
    async generateRandomPassword(length:number, shouldHash:boolean )
    {
        return await generatePassword(length, shouldHash);
    }

    /**
     * Scores a password's strength heuristically (length + character-class
     * diversity), purely client-side - a UX strength meter, not a security
     * guarantee. Returns a 0-100 score, a qualitative label, and suggestions.
     * @param password - The password to score.
     */
    passwordStrength(password: string): PasswordStrengthResult
    {
        return passwordStrength(password);
    }

    /**
     * Alias for {@link passwordStrength}.
     * @param password - The password to score.
     */
    getPasswordStrength(password: string)
    {
        return passwordStrength(password);
    }

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
    checkPassword( password: string, minLength: number = 8, maxLength: number = 20, includeSymbolsCheck: boolean = false, userSymbolRegex: RegExp | string = '')
    {
        return checkPassword( password, includeSymbolsCheck, minLength, maxLength, userSymbolRegex );
    }


    /**
     * Toggles a single password field between masked and visible, swapping
     * an optional show/hide icon accordingly.
     * @param input - The password input to toggle.
     * @param showIcon - The icon element (or its CSS id) to display when the password is hidden.
     * @param hideIcon - The icon element (or its CSS id) to display when the password is visible.
     */
    togglePasswordVisibility(input: HTMLInputElement, showIcon: string | HTMLElement | null = null, hideIcon: string | HTMLElement | null = null)
    {
        return togglePasswordVisibility(input, showIcon, hideIcon);
    }

    /**
     * Toggles every password field in a form (or just one, unless
     * `toggleAll` is set) between masked and visible.
     * @param icons - The shared show/hide icon elements (or CSS ids) used across all toggled fields.
     * @param uform - The form to scan, as an element or its CSS id. Defaults to this instance's `form` if omitted.
     * @param toggleAll - When `true`, toggles every password field in the form at once. Defaults to `false`.
     */
    togglePasswordVisibilityAll(icons: {
        show: string | HTMLElement | null,
        hide: string | HTMLElement | null
    } , uform: string | HTMLFormElement | HTMLDivElement | null = null, toggleAll: boolean = false)
    {
        return togglePasswordVisibilityAll(icons, uform, toggleAll);
    }

    /**
     * Validates a single input field, via its HTML attributes or an
     * explicit `options` override.
     * @param inputField - The input to validate, as an element or its CSS id.
     * @param options - Overrides for the field's validation rule (`required`, `type`, `minLength`, `maxLength`, `pattern`, `message`, etc.). Defaults to `{}`.
     * @param callback - Optional callback invoked with the result instead of/alongside the returned value.
     * @returns `true` on success, or a `Promise` resolving to an `ErrorMessageInterface` describing the failure.
     */
    validateInput(inputField: HTMLInputElement | string, options: any = {}, callback?: any)
    {
        let individualResponseMessage: ErrorMessageInterface | boolean = {  type: 'error', code : 400 };

        if ( typeof inputField === 'string' )
        {
            inputField = document.getElementById(inputField) as HTMLInputElement
        }

        if ( ! inputField  )
        {
            let errorLogLevel = LogLevelInterface;

            individualResponseMessage.message = "The input field you are trying to validate is undefined.";
            ExceptionHandler("The input field you are trying to validate is undefined.");
        }

        else
        {

            options.form = options.form ?? this.form

            const validateResponse: string | boolean | ErrorMessageInterface  = validateInput(inputField, options, callback);

            if ( validateResponse === true )
            {
                return true;
            }

            individualResponseMessage = validateResponse as ErrorMessageInterface

        }

        // let errMsg = validateResponse.message;

        if (checkVariableType(callback) === 'function') {
            const message = callback(individualResponseMessage);
            // return true;
        }

        return new Promise((resolve, reject)=>{

            resolve(individualResponseMessage)

        });

        // return validateInput(inputField, options, callback);
    }

    /**
     * Validates every input in the form. Returns `true`, or an array of
     * per-field error results.
     * @param form - The form to validate, as an element or its CSS id. Defaults to this instance's `form` if omitted.
     * @param customErrorMessages - Custom error messages keyed by field name or rule, overriding the defaults.
     */
    validateAllInput(form: HTMLFormElement | HTMLDivElement | string, customErrorMessages: any)
    {

        form = form ?? this.form;
        return validateAllInput(form, customErrorMessages);
    }

    /**
     * Validates a single radio group by its input name.
     * @param radioInputField - Any radio input in the group (or its CSS id) - the group is resolved by shared `name`.
     * @param customErrorMessage - A custom message to use instead of the default, if the group is invalid.
     */
    validateRadio(radioInputField: HTMLInputElement | string, customErrorMessage?: any)
    {
        return validateRadio(radioInputField, customErrorMessage);
    }

    /**
     * Validates every radio group in the form.
     * @param form - The form to validate. Defaults to this instance's `form` if omitted.
     * @param customErrorMessage - Custom error messages keyed by radio group name, overriding the defaults.
     */
    validateAllRadio(form: HTMLFormElement | HTMLDivElement, customErrorMessage: any)
    {
        form = form ?? this.form;
        return validateAllRadio(form, customErrorMessage);
    }

    /**
     * Validates a single checkbox field.
     * @param checkboxInputField - The checkbox to validate.
     * @param options - Overrides for the field's validation rule (e.g. `required`).
     */
    validateCheckbox( checkboxInputField: HTMLInputElement, options?: any )
    {
        return validateCheckbox(checkboxInputField, options);
    }

    /**
     * Validates every checkbox in the form.
     * @param form - The form to validate. Defaults to this instance's `form` if omitted.
     * @param options - Custom error messages / overrides keyed by field name.
     */
    validateAllCheckbox(form: HTMLFormElement | HTMLDivElement, options: any)
    {

        form = form ?? this.form;

        return validateAllCheckbox(form, options);
    }

    /**
     * Validates a single `<input type="file">` field: required/min/max file
     * count, accepted types (`accept`), max size (`maxSizeMB`), and - for
     * images - dimension limits. Async, since checking image dimensions
     * requires decoding the file.
     * @param fileInputField - The file input to validate.
     * @param options - File rule overrides: `required`, `accept`, `maxSizeMB`, `minFiles`, `maxFiles`, `maxWidth`, `maxHeight`, `minWidth`, `minHeight`, and their `*Message` variants.
     * @returns A `Promise` resolving to `true`, or an `ErrorMessageInterface` describing the failure.
     */
    validateFile( fileInputField: HTMLInputElement, options?: any )
    {
        return validateFile(fileInputField, options);
    }

    /**
     * Validates every `<input type="file">` field in the form. Async - see
     * {@link validateFile}.
     * @param form - The form to validate. Defaults to this instance's `form` if omitted.
     * @param options - File rule overrides, applied across all file fields unless a field specifies its own.
     * @returns A `Promise` resolving to `true`, or an array of per-field `ErrorMessageInterface` results.
     */
    validateAllFile(form: HTMLFormElement | HTMLDivElement, options?: any)
    {
        form = form ?? this.form;

        return validateAllFile(form, options);
    }

    /**
     * Validates a single `<select>` field.
     * @param selectField - The select element to validate.
     * @param options - Overrides for the field's validation rule (e.g. `required`).
     * @param callback - Optional callback invoked with the result.
     */
    validateSelect( selectField: HTMLSelectElement, options:any, callback: any)
    {
        options.form = options.form ?? this.form

        return validateSelect(selectField, options, callback);
    }

    /**
     * Validates every `<select>` field in the form.
     * @param form - The form to validate.
     * @param options - Custom error messages / overrides keyed by field name.
     */
    validateAllSelect(form: HTMLFormElement | HTMLDivElement, options: any)
    {
        return validateAllSelect(form, options);
    }

    /**
     * Validates a single `<textarea>` field.
     * @param textareaField - The textarea to validate.
     * @param options - Overrides for the field's validation rule (e.g. `required`, `minLength`, `maxLength`).
     */
    validateTextarea(textareaField: HTMLTextAreaElement, options: any )
    {
        return validateTextarea(textareaField, options);
    }

    /**
     * Validates every `<textarea>` field in the form.
     * @param form - The form to validate.
     * @param options - Custom error messages / overrides keyed by field name.
     */
    validateAllTextarea(form: HTMLFormElement | HTMLDivElement, options: any)
    {
        return validateAllTextarea(form, options);
    }


    /**
     * Wires a live character counter to an input/textarea, and (depending
     * on `options`) restricts further input once the limit is reached.
     * @param inputElement - The field to count/restrict.
     * @param counterContainer - The element that displays the current/remaining character count.
     * @param options - Configuration such as the max length and counter display format. Defaults to `{}`.
     */
    restrictInputWithCounter(inputElement: HTMLInputElement | HTMLTextAreaElement, counterContainer: HTMLElement, options: any = {})
    {
        return restrictInputLengthWithCounter(inputElement, counterContainer, options);
    }

    /**
     * Checks whether a string consists only of integer digits.
     * @param str - The string to check.
     * @returns `true` if `str` contains only integer digits.
     */
    public containsOnlyIntegers(str: string):boolean
    {
        return containsOnlyIntegers(str)
    }

    /**
     * Gets the current page's URL.
     * @returns The current page URL, or `false` if it couldn't be determined (e.g. outside a browser environment).
     */
    getPageURL()
    {
        return getPageUrl();
    }

    /**
     * Redirects the browser to a URL, optionally after a delay.
     * @param url - The destination URL. Defaults to the current page's URL (effectively a reload) if omitted, `null`, or `false`.
     * @param delay - Delay in milliseconds before redirecting. Defaults to `0`.
     */
    redirect(url: string | null | false | undefined = null, delay: number = 0)
    {

        if ( ! url )
        {
            url = this.getPageURL() as string;
        }

        redirect(url, delay);
    }

    /**
     * Returns the runtime type of a variable as a lowercase string (e.g.
     * `'string'`, `'number'`, `'object'`, `'function'`), more granular than
     * a raw `typeof`.
     * @param variable - The value to check.
     */
    checkVariableType(variable: any)
    {
        return checkVariableType(variable);
    }

    /**
     * Checks whether the browser is currently connected to the internet.
     * @returns `navigator.onLine`.
     */
    isOnline()
    {
        return isOnline();
    }

    /**
     * Resets all fields in a form to their default/empty values.
     * @param u_form - The form to reset, as an element or its CSS id. Defaults to this instance's `form` if omitted.
     * @returns `true` if the form was found and reset.
     */
    reset(u_form: HTMLFormElement | HTMLDivElement | string): boolean
    {

        let form;

        if ( ! u_form )
        {
            form = this.form;
        }
        else
        {
            form = u_form
        }

        return reset(form);
    }



}

if (typeof window !== 'undefined') {
    // Make the library available globally
    (window as any).NFSFU234FormValidation = NFSFU234FormValidation;
}

export { NFSFU234FormValidation };
export default NFSFU234FormValidation;

// Named re-exports of the public interfaces, so TypeDoc (and consumers) can
// reference these types directly instead of them showing up as unlinked
// inline references.
export type { default as ErrorMessageInterface } from "./interfaces/ErrorMessagesInterface";
export type { default as FormConfigInterface } from "./interfaces/FormConfigInterface";
export type { default as FieldRuleInterface } from "./interfaces/FieldRuleInterface";
export type { PasswordStrengthResult } from "./password-handling/passwordStrength";