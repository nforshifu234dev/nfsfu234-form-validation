/**
 * Check if All Elements are True
 *
 * This function checks if all elements in the given array are equal to true.
 *
 * @param {Array} arr - The array to be checked.
 * @returns {boolean} Returns true if all elements in the array are equal to true, otherwise false.
 */
export const areAllElementsTrue = (arr: Array<any>): boolean => {
    // Use the 'every' method to check if every element in the array is equal to true
    return arr.every(element => element === true);
}

/**
 * Count Length of Object
 *
 * This function calculates the number of properties (keys) in a given object.
 * @param {Object} object - The object for which the length is to be calculated.
 * @returns {number} Returns the number of properties (keys) in the object.
 */
export const countLengthOfObject = (object: object): number => {
    // Return the number of keys in the object using Object.keys() and calculating its length
    return Object.keys(object).length;
}

/**
 * Checks the data type of a variable and returns the corresponding type as a string.
 *
 * @param {*} variable - The variable to check the data type.
 * @returns {string} Returns the data type of the variable as a string.
 */
export const checkVariableType = (variable: any): string | null => {
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
        return null;
    }
}