/**
 * Check if a given password meets specific criteria.
 * @param {string} password - The password to be checked.
 * @param {number} [minLength=8] - The minimum length required for the password (default: 8).
 * @param {number} [maxLength=20] - The maximum length allowed for the password (default: 20).
 * @param {boolean} [includeSymbolsCheck=false] - Flag to determine if symbols check is required (default: false).
 * @param {RegExp | string} [userSymbolRegex=''] - Custom regular expression or string representing symbols to check (default: '').
 * @returns {boolean | string} Returns true if the password meets the criteria; otherwise, returns an error message.
 */
const checkPassword = (
    password: string,
    includeSymbolsCheck: boolean = false,
    minLength: number = 8,
    maxLength: number = 20,
    userSymbolRegex: RegExp | string = ''
): boolean | string => {
    // Regular expressions for checking uppercase, lowercase, and numeric characters.
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const numbersRegex = /[0-9]/;

    // Check the length of the password.
    if (password.length < minLength || password.length > maxLength) {
        return `Make sure the length of your password ranges from ${minLength} - ${maxLength} characters`;
    }

    // Check if the password contains at least one uppercase letter.
    if (!uppercaseRegex.test(password)) {
        return "Your password needs to have at least 1 uppercase (A-Z)";
    }

    // Check if the password contains at least one lowercase letter.
    if (!lowercaseRegex.test(password)) {
        return "Your password needs to have at least one lowercase (a-z)";
    }

    // Check if the password contains at least one numeric character.
    if (!numbersRegex.test(password)) {
        return "Your password needs to have at least one number (0-9)";
    }

    // If symbols check is required, perform the check.
    if (includeSymbolsCheck) {
        // Define the regular expression for symbols or use the custom one provided by the user.
        const symbolRegex = typeof userSymbolRegex === 'string' ? new RegExp(userSymbolRegex) : userSymbolRegex;

        // Check if the password contains at least one symbol.
        if (!symbolRegex.test(password)) {
            return "Your password needs to have one symbol e.g (!@#$%^&*())";
        }
    }

    // If all checks pass, return true.
    return true;
}

export default checkPassword;
