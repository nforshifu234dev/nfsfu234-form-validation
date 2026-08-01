import FormConfigInterface from "../interfaces/FormConfigInterface";
import FieldRuleInterface from "../interfaces/FieldRuleInterface";
import { ExceptionHandler } from "../errorHandling/ExceptionHandler";

// The site-wide registry. Meant to be populated once (e.g. from a single
// shared config file included on every page of a multi-page site) via
// configureForms(). Each page only actually initializes whichever of these
// forms are present in *that* page's DOM — see autoInitForms().
let registeredForms: FormConfigInterface[] = [];

/**
 * Register form configs for the whole site. Safe to call with every form
 * across every page in one shared config file - only forms actually
 * present on the current page get initialized by autoInitForms().
 * Calling this again replaces the previous registry.
 */
const configureForms = (configs: FormConfigInterface[]): void => {
    if (!Array.isArray(configs)) {
        ExceptionHandler("configureForms expects an array of form configs.");
        return;
    }
    registeredForms = configs;
};

/**
 * Adds to the existing registry instead of replacing it. Useful if
 * different parts of a codebase want to register their own forms
 * independently (e.g. a shared layout config plus a page-specific one).
 */
const registerForm = (config: FormConfigInterface): void => {
    registeredForms.push(config);
};

const clearFormRegistry = (): void => {
    registeredForms = [];
};

/**
 * Finds the registered config (if any) whose selector matches the given
 * form element. Uses Element.matches, so both #id and .class selectors
 * work, including class selectors that match multiple repeated forms.
 */
const getFormConfigFor = (formElement: Element | undefined | null): FormConfigInterface | undefined => {
    if (!formElement) return undefined;

    return registeredForms.find((config) => {
        try {
            return formElement.matches(config.form);
        } catch {
            return false;
        }
    });
};

/**
 * Looks up the declarative rule for a single field (by name or id) within
 * whichever registered config matches the given form. Returns undefined if
 * the form isn't registered, or the field has no rule - in both cases the
 * caller should fall back to HTML-attribute-driven detection.
 */
const getFieldRule = (
    formElement: Element | undefined | null,
    fieldKey: string | undefined | null
): FieldRuleInterface | undefined => {
    if (!fieldKey) return undefined;

    const config = getFormConfigFor(formElement);
    return config?.fields?.[fieldKey];
};

/**
 * Scans the current page for every registered form that's actually
 * present, and wires each one up: sets novalidate, and binds its submit
 * event to run validation (and AJAX submission, if configured) via the
 * standard NFSFU234FormValidation class. Returns the created instances.
 *
 * Safe to call on every page load (e.g. from a shared bootstrap script) -
 * forms not present on the current page are simply skipped.
 */
const autoInitForms = (FormValidationClass: any): any[] => {
    if (typeof document === 'undefined') {
        // SSR / non-browser environment - nothing to wire up, fail gracefully.
        return [];
    }

    const instances: any[] = [];

    registeredForms.forEach((config) => {
        let matches: NodeListOf<Element>;
        try {
            matches = document.querySelectorAll(config.form);
        } catch {
            ExceptionHandler(`Invalid form selector in configureForms(): "${config.form}"`);
            return;
        }

        matches.forEach((formElement) => {
            const instance = new FormValidationClass(
                { form: formElement, customErrorMessages: config.customErrorMessages },
                config.ajaxOptions
            );

            formElement.addEventListener('submit', (e: Event) => {
                e.preventDefault();
                instance.submit(
                    {
                        form: formElement,
                        customErrorMessages: config.customErrorMessages,
                        errorType: config.errorType
                    }
                );
            });

            instances.push(instance);
        });
    });

    return instances;
};

export {
    configureForms,
    registerForm,
    clearFormRegistry,
    getFormConfigFor,
    getFieldRule,
    autoInitForms
};
