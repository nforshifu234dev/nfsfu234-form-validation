import { ExceptionHandler } from "../errorHandling/ExceptionHandler";
import ErrorMessageInterface from "../interfaces/ErrorMessagesInterface";
import { areAllElementsTrue, checkVariableType } from "../utilities";
import validateAllInput from "./validateAllnput";
import validateAllSelect from "./validateAllSelect";
import validateAllTextarea from "./validateAllTextarea";
import validateAllRadio from "./validateAllRadio";
import validateAllCheckbox from "./validateAllCheckbox";
import validateAllFile from "./validateAllFile";

const validateForm = async (
    form: HTMLFormElement | HTMLDivElement | null,
    options?: any,
    isErrorInline?: boolean
): Promise<boolean | ErrorMessageInterface> => {
    
    let errMsg: ErrorMessageInterface = { message: "", data: null, code: 400 };
    let errMsgArray: { [key: string]: ErrorMessageInterface } = {};

    if (!form) {
        ExceptionHandler("Form element not found.");
        errMsg.message = "Form element not found.";
        return errMsg;
    }

    const shouldContinue: boolean[] = [];

    const isValidateAllInputs = validateAllInput(form, options);
    const isValidateAllTextareas = validateAllTextarea(form, options);
    const isValidateAllSelects = validateAllSelect(form, options);
    const isValidateAllRadios = validateAllRadio(form, options);
    const isValidateAllCheckboxes = validateAllCheckbox(form, options);
    const isValidateAllFiles = await validateAllFile(form, options);

    if (isValidateAllInputs === true) {
        shouldContinue.push(true);
    } else {
        let msg: ErrorMessageInterface = { code: 400, message: "" };
        let resMsg: ErrorMessageInterface[] = isValidateAllInputs as any;

        msg.message = "Inputs Validation Failed";
        msg.data = resMsg;

        errMsgArray['inputs'] = msg;
        shouldContinue.push(false);
    }

    if (isValidateAllTextareas === true) {
        shouldContinue.push(true);
    } else {
        shouldContinue.push(false);
        let msg: ErrorMessageInterface = { code: 400, message: "" };
        let resMsg: ErrorMessageInterface[] = isValidateAllTextareas as any;

        msg.message = "Textarea Validation Failed";
        msg.data = resMsg;

        errMsgArray['textareas'] = msg;
    }

    if (isValidateAllSelects === true) {
        shouldContinue.push(true);
    } else {
        shouldContinue.push(false);
        let msg: ErrorMessageInterface = { code: 400, message: "" };
        let resMsg: ErrorMessageInterface[] = isValidateAllSelects as any;

        msg.message = "Selects Validation Failed";
        msg.data = resMsg;

        errMsgArray['selects'] = msg;
    }

    if (isValidateAllRadios === true) {
        shouldContinue.push(true);
    } else {
        shouldContinue.push(false);
        let msg: ErrorMessageInterface = { code: 400, message: "" };
        let resMsg: ErrorMessageInterface[] = isValidateAllRadios as any;

        msg.message = "Radio Validation Failed";
        msg.data = resMsg;

        errMsgArray['radios'] = msg;
    }

    if (isValidateAllCheckboxes === true) {
        shouldContinue.push(true);
    } else {
        shouldContinue.push(false);
        let msg: ErrorMessageInterface = { code: 400, message: "" };
        let resMsg: ErrorMessageInterface[] = isValidateAllCheckboxes as any;

        msg.message = "Checkbox Validation Failed";
        msg.data = resMsg;

        errMsgArray['checkboxes'] = msg;
    }

    if (isValidateAllFiles === true) {
        shouldContinue.push(true);
    } else {
        shouldContinue.push(false);
        let msg: ErrorMessageInterface = { code: 400, message: "" };
        let resMsg: ErrorMessageInterface[] = isValidateAllFiles as any;

        msg.message = "File Validation Failed";
        msg.data = resMsg;

        errMsgArray['files'] = msg;
    }

    const checkIfAllElementsAreTrue = areAllElementsTrue(shouldContinue);

    if (checkIfAllElementsAreTrue) {
        return true;
    }

    const mainResponse: ErrorMessageInterface = {
        message: "Form Validation Error",
        data: errMsgArray
    };

    return mainResponse;
};

export default validateForm;
