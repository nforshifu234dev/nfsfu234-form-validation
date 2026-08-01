/**
 * Checks the type of a variable and returns a string representation of the type.
 * If the type cannot be determined, returns 'unknown'.
 *
 * @param {*} variable - The variable whose type needs to be checked.
 * @returns {string} A string representing the type of the variable, or 'unknown'.
 */
const checkVariableType = (variable: any): string => {
    // Check if the variable is a string
    if (typeof variable === 'string') {
        return 'string';
    }
    // Check if the variable is a number
    else if (typeof variable === 'number') {
        return 'number';
    }
    // Check if the variable is a boolean
    else if (typeof variable === 'boolean') {
        return 'boolean';
    }
    // Check if the variable is undefined
    else if (typeof variable === 'undefined') {
        return 'undefined';
    }
    // Check if the variable is null
    else if (variable === null) {
        return 'null';
    }
    // Check if the variable is an HTMLElement (assumes that HTMLElement is defined in the environment)
    else if (variable instanceof HTMLElement) {
        return 'HTML Element';
    }
    // Check if the variable is an array
    else if (typeof variable === 'object' && variable instanceof Array) {
        return 'array';
    }
    // Check if the variable is an object
    else if (typeof variable === 'object' && variable instanceof Object) {
        return 'object';
    }
    // Check if the variable is a function
    else if (typeof variable === 'function') {
        return 'function';
    }
    // If none of the above conditions match, the data type is unknown
    else {
        return 'null';
    }
}

export default checkVariableType;