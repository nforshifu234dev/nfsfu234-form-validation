'use strict';

import type AJAXOptionsInterface from "./interfaces/AJAXOptionsInterface";
import type FormConstructorInterface from "./interfaces/FormConstructorInterface";
import { FormValidationOptions } from "./interfaces/FormValidationOptions";
import ajax from "./ajax/ajax";
import ErrorHandler from "./errorHandling";
import { ExceptionHandler } from "./errorHandling/ExceptionHandler";
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


/**
 * Custom error messages keyed by field type (`'radio'`, `'checkbox'`,
 * `'file'`, etc.) or field name, depending on the validator. Used where a
 * method accepts just the messages directly rather than a full
 * {@link FormValidationOptions} object (e.g. {@link NFSFU234FormValidation.validateAllInput}).
 */
export type CustomErrorMessages = { [key: string]: string };

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

    private defaultAJAXOptions?: AJAXOptionsInterface;

    /**
     * Custom error messages keyed by field name or validation rule, used to
     * override the library's default messages when validating this
     * instance's form.
     */
    public customErrorMessages: { [key: string]: string } = {};

    /**
     * Creates a new validator instance.
     *
     * The constructor accepts either:
     *
     * - nothing (automatic form detection)
     * - null (utility-only instance)
     * - a form id
     * - a form element
     * - a configuration object
     *
     * Existing two-parameter initialization is still supported:
     *
     * new NFSFU234FormValidation(formDetails, ajaxOptions)
     *
     * or
     *
     * new NFSFU234FormValidation({
     *     form,
     *     customErrorMessages,
     *     ajaxOptions
     * })
     */
    constructor(
        formDetails?: FormConstructorInterface,
        ajaxOptions?: AJAXOptionsInterface
    ) {
        this.AJAXResult = null;

        // Backwards compatibility
        this.defaultAJAXOptions = ajaxOptions;

        if (typeof window === "undefined") {
            this.form = undefined;
            return;
        }

        // Explicit utility-only instance
        if (formDetails === null) {
            this.form = undefined;
            return;
        }

        let formElement:
            | HTMLFormElement
            | HTMLDivElement
            | undefined;

        // Configuration object
        if (
            formDetails &&
            typeof formDetails === "object" &&
            !(formDetails instanceof HTMLFormElement) &&
            !(formDetails instanceof HTMLDivElement)
        ) {
            if (typeof formDetails.form === "string") {
                formElement =
                    document.getElementById(formDetails.form) as
                        | HTMLFormElement
                        | HTMLDivElement
                        | undefined;
            }
            else if (
                formDetails.form instanceof HTMLFormElement ||
                formDetails.form instanceof HTMLDivElement
            ) {
                formElement = formDetails.form;
            }

            this.customErrorMessages =
                formDetails.customErrorMessages ?? {};

            // New API overrides old constructor parameter
            if (formDetails.ajaxOptions) {
                this.defaultAJAXOptions =
                    formDetails.ajaxOptions;
            }
        }

        // Form id
        else if (typeof formDetails === "string") {
            formElement =
                document.getElementById(formDetails) as
                    | HTMLFormElement
                    | HTMLDivElement
                    | undefined;
        }

        // Element
        else if (
            formDetails instanceof HTMLFormElement ||
            formDetails instanceof HTMLDivElement
        ) {
            formElement = formDetails;
        }

        // Automatic detection
        if (!formElement) {
            formElement =
                document.getElementById("jsForm") as
                    | HTMLFormElement
                    | HTMLDivElement
                    | undefined;
        }

        if (!formElement) {
            formElement =
                document.querySelector("form") as
                    | HTMLFormElement
                    | HTMLDivElement
                    | undefined;
        }

        this.form = formElement;

        if (this.form) {
            if (!this.form.hasAttribute("novalidate")) {
                this.form.setAttribute("novalidate", "");
            }

            this.form.addEventListener("submit", (e) => {
                e.preventDefault();
            });
        }
    }

/**
 * Resolves the form element and validation options from the supplied
 * user options (or falls back to the instance defaults).
 *
 * @throws Error if no form can be resolved.
 */
private resolveForm(
    userOptions?: FormConstructorInterface
): {
    formElement: HTMLFormElement | HTMLDivElement;
    options: {
        form: HTMLFormElement | HTMLDivElement;
        customErrorMessages: { [key: string]: string };
    };
} {

    let formElement = this.form;
    let customErrorMessages = this.customErrorMessages;

    // Form ID
    if (typeof userOptions === "string") {
        formElement =
            document.getElementById(userOptions) as
                | HTMLFormElement
                | HTMLDivElement
                | undefined;

        customErrorMessages = {};
    }

    // HTMLElement
    else if (
        userOptions instanceof HTMLFormElement ||
        userOptions instanceof HTMLDivElement
    ) {
        formElement = userOptions;
        customErrorMessages = {};
    }

    // Options object
    else if (
        userOptions &&
        typeof userOptions === "object" &&
        !(userOptions instanceof HTMLFormElement) &&
        !(userOptions instanceof HTMLDivElement)
    ) {

        if (typeof userOptions.form === "string") {
            formElement =
                document.getElementById(userOptions.form) as
                    | HTMLFormElement
                    | HTMLDivElement
                    | undefined;
        }
        else if (
            userOptions.form instanceof HTMLFormElement ||
            userOptions.form instanceof HTMLDivElement
        ) {
            formElement = userOptions.form;
        }

        customErrorMessages =
            userOptions.customErrorMessages ??
            this.customErrorMessages;
    }

    if (!formElement) {
        throw new Error("Form element not found.");
    }

    if (!formElement.hasAttribute("novalidate")) {
        formElement.setAttribute("novalidate", "");
    }

    return {
        formElement,
        options: {
            form: formElement,
            customErrorMessages
        }
    };
}

/**
 * Runs validation against a resolved form and normalizes the result into
 * a single ErrorMessageInterface.
 */
private async validateResolvedForm(
    formElement: HTMLFormElement | HTMLDivElement,
    options: {
        form: HTMLFormElement | HTMLDivElement;
        customErrorMessages: { [key: string]: string };
    }
): Promise<ErrorMessageInterface> {

    const validationResult = await validateForm(
        formElement,
        options
    );

    // Validation passed
    if (validationResult === true) {
        return {
            message: "success",
            type: "success",
            data: null
        };
    }

    // Validation returned an ErrorMessageInterface
    if (
        typeof validationResult === "object" &&
        validationResult !== null &&
        "message" in validationResult
    ) {

        const message =
            typeof validationResult.message === "string" ||
            typeof validationResult.message === "number" ||
            typeof validationResult.message === "boolean"
                ? validationResult.message
                : "Error";

        return {
            message,
            type: "error",
            code: validationResult.code,
            data:
                validationResult.data ?? validationResult
        };
    }

    // Fallback
    return {
        message: "Error",
        type: "error"
    };
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
    private populateOptionsVariables(options: FormConstructorInterface | undefined, formElement: HTMLFormElement | HTMLDivElement | undefined) {
        let isAjax = false;
        // Previously a hand-duplicated inline type that had drifted from the
        // real AJAXOptionsInterface (missing 'PUT' and RequestBodyIgnore) -
        // using the actual imported interface now instead of a stale copy.
        let ajaxOptions: AJAXOptionsInterface | null = null;

        if (
            typeof options === 'object' &&
            options !== null &&
            !(options instanceof HTMLFormElement) &&
            !(options instanceof HTMLDivElement)
        ) {
            // NOTE: `isAjax` is not actually declared on FormConstructorInterface's
            // object shape (only `form`, `customErrorMessages`, `ajaxOptions` are).
            // This line has therefore likely always read `undefined` for anyone
            // passing `{ isAjax: true, ajaxOptions: {...} }` to submit()/the
            // constructor - the previous `options: any` typing hid this.
            // Preserved as-is (behavior unchanged) rather than silently inventing
            // new semantics; worth deciding whether `isAjax` should be added to
            // FormConstructorInterface, or this line removed, in a follow-up.
            isAjax = (options as { isAjax?: boolean }).isAjax === true;
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
                RequestMethod: requestMethod as "GET" | "POST" | "PUT" | "PATCH" | "UPDATE" | "DELETE",
                RequestHeader: Object.keys(requestHeaders).length > 0 ? requestHeaders : undefined,
                RequestBody: undefined
            };
        }

        return { isAjax, ajaxOptions };
    }

    /**
     * Extracts the request body from a resolved form.
     *
     * Wraps {@link getFormDetails} and guarantees the caller either receives
     * valid request data or an error result that can be returned directly.
     *
     * @param form - The resolved form element.
     * @returns The request body, an ErrorMessageInterface, or false if extraction failed.
     */
    private getResolvedFormData(
        form: HTMLFormElement | HTMLDivElement
    ): Record<string, string | boolean> | ErrorMessageInterface | false {

        const formData = getFormDetails(form);

        if (formData === false) {
            return false;
        }

        if (
            typeof formData === "object" &&
            formData !== null &&
            "message" in formData
        ) {
            return formData;
        }

        return formData;
    }

    /**
     * Validates the whole form (every input, textarea, select, radio,
     * checkbox, and file field), then—if validation succeeds and AJAX is
     * enabled—submits the form using either the supplied AJAX options or
     * the instance's default AJAX configuration.
     *
     * The method first resolves the target form from the supplied
     * `userOptions` (or falls back to the form attached to this instance),
     * validates it, and finally submits it if appropriate.
     *
     * Validation-only usage is also supported. When AJAX is not enabled,
     * the method simply resolves with the validation result.
     *
     * @param userOptions - Overrides the form and custom error messages
     * configured on this instance.
     * @param callback - Optional callback invoked with the validation result.
     * @returns A Promise resolving to an ErrorMessageInterface when no AJAX
     * submission occurs, or the AJAX response when submitted.
     */
    public async submit(
        userOptions?: FormConstructorInterface,
        callback?: (result: ErrorMessageInterface) => void
    ): Promise<any> {

        let resolved;

        try {
            resolved = this.resolveForm(userOptions);
        }
        catch (error: any) {
            ExceptionHandler(error.message);
            return false;
        }

        const {
            formElement,
            options
        } = resolved;

        const validationResult =
            await this.validateResolvedForm(
                formElement,
                options
            );

        if (typeof callback === "function") {
            callback(validationResult);
        }

        if (validationResult.type !== "success") {
            return validationResult;
        }

        const populated =
            this.populateOptionsVariables(
                userOptions,
                formElement
            );

        const ajaxOptions =
            populated.ajaxOptions ??
            this.defaultAJAXOptions ??
            null;

        if (!populated.isAjax || !ajaxOptions) {
            return validationResult;
        }

        const formData =
            this.getResolvedFormData(formElement);

        if (
            formData === false ||
            (
                typeof formData === "object" &&
                formData !== null &&
                "message" in formData
            )
        ) {
            return formData;
        }

        ajaxOptions.RequestBody = formData;

        const response = await ajax(ajaxOptions);

        const responseCode =
            response.code ??
            response.status;

        if (
            responseCode >= 300 &&
            responseCode <= 599
        ) {

            const errorResult: ErrorMessageInterface = {
                message: response.message,
                type: "error",
                code: responseCode,
                data: response.data
            };

            this.displayError({
                type: "modal",
                message: response.message,
                duration: 3000,
                element: formElement,
                success: false
            });

            return errorResult;
        }

        return response;
    }


    /**
     * Validates the whole form (every input, textarea, select, radio,
     * checkbox, and file field) without submitting it.
     *
     * @param userOptions - Overrides the form/customErrorMessages configured
     * on this instance.
     * @param callback - Optional callback invoked with the validation result.
     * @returns A Promise resolving to the validation result.
     */
    public async validate(
        userOptions?: FormConstructorInterface,
        callback?: (result: ErrorMessageInterface) => void
    ): Promise<ErrorMessageInterface | false> {

        let resolved;

        try {
            resolved = this.resolveForm(userOptions);
        }
        catch (error: any) {
            ExceptionHandler(error.message);
            return false;
        }

        const {
            formElement,
            options
        } = resolved;

        const validationResult =
            await this.validateResolvedForm(
                formElement,
                options
            );

        if (typeof callback === "function") {
            callback(validationResult);
        }

        return validationResult;
    }


    /**
       Sends an AJAX request using the supplied request configuration.
       Sends an AJAX request using the supplied request configuration. Static
       - does not require a form or an instance. Use this when you only need
       the AJAX helper and don't want to construct the class just to call it
       (e.g. `NFSFU234FormValidation.ajax({...})` in a React component with
       no form to attach to).

       @param AJAXOptions - The request configuration, including the URL,
       HTTP method, headers, and request body.
       @returns A Promise that resolves with the server response.
        */
    public static ajax(AJAXOptions: AJAXOptionsInterface) {
        return ajax(AJAXOptions);
    }

    /**
       Instance version of {@link NFSFU234FormValidation.ajax}. Sends an AJAX
       request using the supplied request configuration.

        The returned Promise is also stored internally so it can later be
        retrieved with {@link getAJAXResponse()}.

        @param AJAXOptions - The request configuration, including the URL,
        HTTP method, headers, and request body.
        @returns A Promise that resolves with the server response.
     */
    public ajax(AJAXOptions: AJAXOptionsInterface) {
        return this.AJAXResult = NFSFU234FormValidation.ajax(AJAXOptions);
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
    getFormDetails(form?: HTMLFormElement | HTMLDivElement | string)
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
        // NOTE: the internal checkPassword() (imported above) has a
        // DIFFERENT parameter order than this public method:
        //   internal:  (password, includeSymbolsCheck, minLength, maxLength, userSymbolRegex)
        //   this method: (password, minLength, maxLength, includeSymbolsCheck, userSymbolRegex)
        // This wrapper intentionally keeps the public signature's more
        // intuitive (minLength, maxLength, includeSymbolsCheck) order.
        // If either signature ever changes, this mapping must be updated
        // to match - a swapped minLength/includeSymbolsCheck here would
        // silently pass a boolean where a number is expected (or vice
        // versa) with no compiler error, since both are loosely typed at
        // this boundary.
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
     * Validates a single input field, via its HTML attributes or a rule
     * registered with {@link NFSFU234FormValidation.configureForms}.
     * @param inputField - The input to validate, as an element or its CSS id.
     * @param options - Call-context options (which form, custom messages, how to display errors). Does NOT accept field-rule fields like `required`/`minLength`/`pattern` - those come only from HTML attributes or `configureForms()`. Defaults to `{}`.
     * @param callback - Optional callback invoked with the result instead of/alongside the returned value.
     * @returns `true` on success, or a `Promise` resolving to an `ErrorMessageInterface` describing the failure.
     */
    async validateInput(
        inputField: HTMLInputElement | string,
        options: FormValidationOptions = {},
        callback?: (result: ErrorMessageInterface | true) => void
    ): Promise<ErrorMessageInterface | true>
    {
        if ( typeof inputField === 'string' )
        {
            inputField = document.getElementById(inputField) as HTMLInputElement
        }

        let individualResponseMessage: ErrorMessageInterface | true;

        if ( ! inputField  )
        {
            individualResponseMessage = {
                type: 'error',
                code: 400,
                message: "The input field you are trying to validate is undefined."
            };
            ExceptionHandler(individualResponseMessage.message as string);
        }

        else
        {

            options.form = options.form ?? this.form

            const validateResponse: string | boolean | ErrorMessageInterface  = validateInput(inputField, options, callback);

            individualResponseMessage = validateResponse === true
                ? true
                : (validateResponse as ErrorMessageInterface);

        }

        if (checkVariableType(callback) === 'function') {
            callback!(individualResponseMessage);
        }

        // Always returns via the implicit Promise from `async` now - no more
        // "sometimes a bare `true`, sometimes a Promise" inconsistency for
        // callers awaiting this method.
        return individualResponseMessage;
    }

    /**
     * Validates every input in the form. Returns `true`, or an array of
     * per-field error results.
     * @param form - The form to validate, as an element or its CSS id. Defaults to this instance's `form` if omitted.
     * @param customErrorMessages - Custom error messages keyed by field type/name, overriding the defaults.
     */
    validateAllInput(form?: HTMLFormElement | HTMLDivElement | string, customErrorMessages?: CustomErrorMessages)
    {

        form = form ?? this.form;

        // `form ?? this.form` can still be `undefined` here - `this.form`
        // is itself optional (e.g. a utility-only instance constructed with
        // `null`, or no form found automatically). The internal validators
        // all handle a missing form at runtime already (they return their
        // own "form does not exist" error), but their parameter types don't
        // declare `undefined` as accepted, so TypeScript correctly refuses
        // to let it through un-narrowed. This guard mirrors that same
        // internal behavior explicitly, which also satisfies the type
        // checker honestly instead of silencing it with a cast.
        if (!form) {
            const message = "The form you are trying to validate does not exist.";
            ExceptionHandler(message);
            return [{ message, code: 400 }];
        }

        // Previously passed `customErrorMessages` directly as the internal
        // function's second argument - but that function expects a full
        // `options` object with a *nested* `customErrorMessages` property,
        // which it then forwards as-is into validateInput() for every
        // field. Passing the bare dict meant it was silently never read.
        return validateAllInput(form, { customErrorMessages });
    }

    /**
     * Validates a single radio group by its input name, using this
     * instance's form.
     * @param radioInputField - Any radio input in the group (or its CSS id) - the group is resolved by shared `name`.
     * @param customErrorMessage - A message shown if the group is invalid. (The internal validator only supports one message slot here, not one per group name, despite what the group is called.)
     */
    validateRadio(radioInputField: HTMLInputElement | string, customErrorMessage?: string)
    {
        // Previously this passed `customErrorMessage` straight through as
        // the internal validator's `options` object - but validateRadio()
        // internally reads `options.form` and `options.customErrorMessages.radio`,
        // not a bare string. A plain string has neither property, so the
        // form was never resolved and the custom message never applied.
        const options: FormValidationOptions = {
            form: this.form,
            customErrorMessages: customErrorMessage ? { radio: customErrorMessage } : undefined,
        };
        return validateRadio(radioInputField, options);
    }

    /**
     * Validates every radio group in the form.
     * @param form - The form to validate. Defaults to this instance's `form` if omitted.
     * @param customErrorMessage - A message shown for any invalid radio group in this form. (Same one-slot limitation as {@link validateRadio}.)
     */
    validateAllRadio(form?: HTMLFormElement | HTMLDivElement, customErrorMessage?: string)
    {
        form = form ?? this.form;

        if (!form) {
            const message = "The form you are trying to validate does not exist.";
            ExceptionHandler(message);
            return [{ message, code: 400 }];
        }

        // validateAllRadio() internally forwards `options` to validateRadio()
        // for each group WITHOUT ever setting `options.form` itself (unlike
        // validateAllCheckbox/validateAllSelect/validateAllTextarea, which
        // all do this internally) - so it has to happen here instead, or
        // every group fails with "the form you are trying to validate does
        // not exist" regardless of what form was passed to this method.
        const options: FormValidationOptions = {
            form,
            customErrorMessages: customErrorMessage ? { radio: customErrorMessage } : undefined,
        };
        return validateAllRadio(form, options);
    }

    /**
     * Validates a single checkbox field, using this instance's form.
     * @param checkboxInputField - The checkbox to validate.
     * @param options - Call-context options. `options.customErrorMessages.checkbox` sets the message shown when required and unchecked. Field-level rules (`required`) come from the checkbox's own HTML attribute or `configureForms()`, not from here.
     */
    validateCheckbox( checkboxInputField: HTMLInputElement, options: FormValidationOptions = {} )
    {
        // Previously never merged in this.form - validateCheckbox() reads
        // options.form directly and fails without it, so calling this the
        // normal way (relying on the instance's form) never worked.
        options.form = options.form ?? this.form;
        return validateCheckbox(checkboxInputField, options);
    }

    /**
     * Validates every checkbox in the form.
     * @param form - The form to validate. Defaults to this instance's `form` if omitted.
     * @param options - Call-context options, applied across all checkboxes in the form.
     */
    validateAllCheckbox(form?: HTMLFormElement | HTMLDivElement, options?: FormValidationOptions)
    {

        form = form ?? this.form;

        if (!form) {
            const message = "The form you are trying to validate does not exist. 5555 0000";
            ExceptionHandler(message);
            return [{ message, code: 400, data: form }];
        }

        return validateAllCheckbox(form, options);
    }

    /**
     * Validates a single `<input type="file">` field: required/min/max file
     * count, accepted types (`accept`), max size (`maxSizeMB`), and - for
     * images - dimension limits. Async, since checking image dimensions
     * requires decoding the file.
     *
     * IMPORTANT: those rule fields (`required`, `accept`, `maxSizeMB`, the
     * dimension limits, etc.) are read only from a rule registered via
     * {@link NFSFU234FormValidation.configureForms} - there's no HTML
     * attribute equivalent for most of them, and passing them in `options`
     * here has no effect. `options` only controls call context (which form,
     * custom messages, how errors are displayed).
     *
     * @param fileInputField - The file input to validate.
     * @param options - Call-context options. `options.customErrorMessages.file` sets the message shown on failure.
     * @returns A `Promise` resolving to `true`, or an `ErrorMessageInterface` describing the failure.
     */
    validateFile( fileInputField: HTMLInputElement, options: FormValidationOptions = {} )
    {
        options.form = options.form ?? this.form;
        return validateFile(fileInputField, options);
    }

    /**
     * Validates every `<input type="file">` field in the form. Async - see
     * {@link validateFile}.
     * @param form - The form to validate. Defaults to this instance's `form` if omitted.
     * @param options - Call-context options, applied across all file fields (does not accept rule fields - see {@link validateFile}).
     * @returns A `Promise` resolving to `true`, or an array of per-field `ErrorMessageInterface` results.
     */
    validateAllFile(form?: HTMLFormElement | HTMLDivElement, options?: FormValidationOptions)
    {
        form = form ?? this.form;

        // Unlike the other validateAll* internals, validateAllFile() treats
        // a missing form as "nothing to validate" (returns `true`), not an
        // error - matching that here rather than the pattern used elsewhere.
        if (!form) {
            return true;
        }

        return validateAllFile(form, options);
    }

    /**
     * Validates a single `<select>` field.
     * @param selectField - The select element to validate.
     * @param options - Call-context options. `options.customErrorMessages.select` sets the message shown when required and no option is selected. Field-level rules (`required`) come from the select's own HTML attribute or `configureForms()`, not from here.
     * @param callback - Optional callback invoked with the result.
     */
    validateSelect( selectField: HTMLSelectElement, options: FormValidationOptions = {}, callback?: (result: ErrorMessageInterface | true) => void)
    {
        options.form = options.form ?? this.form

        return validateSelect(selectField, options, callback);
    }

    /**
     * Validates every `<select>` field in the form.
     * @param form - The form to validate.
     * @param options - Call-context options, applied across all selects in the form.
     */
    validateAllSelect(form?: HTMLFormElement | HTMLDivElement, options?: FormValidationOptions)
    {
        // Previously missing: every sibling validateAll* method falls back
        // to this.form when called without one - this one silently didn't,
        // so `.validateAllSelect()` with no args passed `undefined` straight
        // through instead of using the instance's form.
        form = form ?? this.form;

        if (!form) {
            const message = "The form you are trying to validate does not exist.";
            ExceptionHandler(message);
            return [{ message, code: 400 }];
        }

        return validateAllSelect(form, options);
    }

    /**
     * Validates a single `<textarea>` field, using this instance's form.
     * @param textareaField - The textarea to validate.
     * @param options - Call-context options. `options.customErrorMessages.textarea` sets the message shown when required and empty. Field-level rules (`required`/`minLength`/`maxLength`) come from the textarea's own HTML attributes or `configureForms()`, not from here.
     */
    validateTextarea(textareaField: HTMLTextAreaElement, options: FormValidationOptions = {} )
    {
        // Same missing-form-merge bug as validateRadio/validateCheckbox -
        // validateTextarea() reads options.form directly and fails without
        // it (once includeHTML's default `true` path is reached), so this
        // never worked when relying on the instance's form.
        options.form = options.form ?? this.form;
        return validateTextarea(textareaField, options);
    }

    /**
     * Validates every `<textarea>` field in the form.
     * @param form - The form to validate.
     * @param options - Call-context options, applied across all textareas in the form.
     */
    validateAllTextarea(form?: HTMLFormElement | HTMLDivElement, options?: FormValidationOptions)
    {
        // Same missing-fallback issue as validateAllSelect - added here too.
        form = form ?? this.form;

        if (!form) {
            const message = "The form you are trying to validate does not exist.";
            ExceptionHandler(message);
            return [{ message, code: 400 }];
        }

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
    reset(u_form?: HTMLFormElement | HTMLDivElement | string): boolean
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
export type { default as AJAXOptionsInterface } from "./interfaces/AJAXOptionsInterface";
export type { default as FormConstructorInterface } from "./interfaces/FormConstructorInterface";