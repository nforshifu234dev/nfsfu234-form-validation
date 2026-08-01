/**
 * Checks if the provided value is a valid ZIP code.
 * @param {string | number} zipCode - The ZIP code to validate.
 * @returns {boolean} - Returns true if the ZIP code is valid, otherwise false.
 */
const isZIP = (zipCode: string | number): boolean => {
    // Convert zipCode to a string if it's a number
    if (typeof zipCode === 'number') {
        zipCode = zipCode.toString() as string;
    }

    // Regular expression to match ZIP codes with exactly 5 or 6 digits
    const zipCodeRegex = /^\d{5}(?:\d{1})?$/;
    return zipCodeRegex.test(zipCode);
};

export default isZIP;
