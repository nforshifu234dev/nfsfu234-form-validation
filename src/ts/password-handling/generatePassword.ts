import { ExceptionHandler } from "../errorHandling/ExceptionHandler";

/**
 * Generates a random password.
 * @param {number} [length] - The length of the generated password. If not provided, a random length between 8 and 18 characters will be used.
 * @param {boolean} [shouldHash=false] - A flag indicating whether the generated password should be hashed. Default is false.
 * @returns {Promise<string | [string, string]>} - A Promise that resolves to the generated password. If shouldHash is true, resolves to an array containing the plain password and the hashed password.
 */
const generatePassword = async (length: number = Math.floor(Math.random() * 11) + 8, shouldHash: boolean = false):  Promise<any> => {
    // The minimum length of the generated password.
    const minLength: number = 8;

    // The maximum length of the generated password.
    const maxLength: number = 18;

    // A string containing all uppercase letters.
    const uppercaseLetters: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    // A string containing all lowercase letters.
    const lowercaseLetters: string = "abcdefghijklmnopqrstuvwxyz";

    // A string containing all digits (numbers).
    const numbers: string = "0123456789";

    // A string containing all symbols.
    const symbols: string = "!@#$%^&*()";

    // The generated password.
    let password: string = "";

    // Validate the length parameter
    if (length < minLength || length > maxLength) {
        ExceptionHandler("Password length must be between 8 and 18 characters.", 'error_1');
    }

    // Add at least one uppercase letter to the password.
    password += uppercaseLetters[Math.floor(Math.random() * uppercaseLetters.length)];

    // Add at least one symbol to the password.
    password += symbols[Math.floor(Math.random() * symbols.length)];

    // Add at least one number to the password.
    password += numbers[Math.floor(Math.random() * numbers.length)];

    // The number of characters already added to the password.
    let charactersAdded: number = 3;

    // Add remaining characters based on the provided length.
    while (charactersAdded < length) {
        // Choose a random character type: 0 for uppercase letter, 1 for lowercase letter, 2 for symbol, 3 for number.
        const randomCharType: number = Math.floor(Math.random() * 4);

        if (randomCharType === 0) {
            password += uppercaseLetters[Math.floor(Math.random() * uppercaseLetters.length)];
        } else if (randomCharType === 1) {
            password += lowercaseLetters[Math.floor(Math.random() * lowercaseLetters.length)];
        } else if (randomCharType === 2) {
            password += symbols[Math.floor(Math.random() * symbols.length)];
        } else {
            password += numbers[Math.floor(Math.random() * numbers.length)];
        }

        charactersAdded++;
    }


    // Return the generated password.
    return password;
};

export default generatePassword;
