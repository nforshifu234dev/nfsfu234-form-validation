// Check if a string contains only integers.
const containsOnlyIntegers = (str: string | number): boolean => {
    return /^\d+$/.test(str as string);
};

export default containsOnlyIntegers;