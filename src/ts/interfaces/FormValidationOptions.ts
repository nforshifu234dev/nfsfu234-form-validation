export interface FormValidationOptions {
    form?: HTMLFormElement | HTMLDivElement | string | { form?: HTMLFormElement | HTMLDivElement };
    ajaxOptions?: any;
    customErrorMessages?: Record<string, string>;
    errorType?: 'modal' | 'inline';
}