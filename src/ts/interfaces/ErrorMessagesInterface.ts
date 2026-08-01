// Define the errorMessage interface outside the submit method
export default interface ErrorMessageInterface {
    message?: string | boolean | number,
    type?: string,
    code?: number,
    data?: string | number | object | Array<any> | JSON | HTMLElement | null | undefined | boolean
}