import FieldRuleInterface from "./FieldRuleInterface";

// One entry in the site-wide form registry. `form` is a CSS selector (an
// id like '#loginForm', or a class like '.newsletter-form' for forms that
// repeat across pages). Only forms actually present in the current page's
// DOM get initialized when autoInitForms() runs, so it's safe to register
// every form on the whole site in one shared config file.
export default interface FormConfigInterface {
    form: string,
    fields?: { [fieldName: string]: FieldRuleInterface },
    ajaxOptions?: any,
    errorType?: 'inline' | 'modal',
    customErrorMessages?: { [key: string]: string }
}
