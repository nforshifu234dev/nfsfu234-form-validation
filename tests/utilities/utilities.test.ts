import isEmail from '../../src/ts/utilities/isEmail';
import isURL from '../../src/ts/utilities/isURL';
import isZIP from '../../src/ts/utilities/isZIP';
import isDate from '../../src/ts/utilities/isDate';
import containsOnlyIntegers from '../../src/ts/utilities/containsOnlyIntegers';
import checkFieldRuleConstraints from '../../src/ts/utilities/checkFieldRuleConstraints';

describe('isEmail', () => {
    test.each([
        ['person@example.com', true],
        ['first.last@sub.example.co', true],
        ['not-an-email', false],
        ['missing@domain', false],
        ['@no-local-part.com', false],
        ['', false],
    ])('%s -> %s', (value, expected) => {
        expect(isEmail(value)).toBe(expected);
    });
});

describe('isURL', () => {
    test('accepts a well-formed URL', () => {
        expect(isURL('https://example.com')).toBe(true);
    });

    test('rejects a clearly invalid URL', () => {
        expect(isURL('not a url')).toBe(false);
    });
});

describe('isZIP', () => {
    test.each([
        ['12345', true],
        ['123456', true],
        [12345, true],
        ['1234', false],
        ['abcde', false],
    ])('%s -> %s', (value, expected) => {
        expect(isZIP(value as any)).toBe(expected);
    });
});

describe('isDate', () => {
    test('accepts a valid date string in the default dd/mm/yyyy format', () => {
        expect(isDate('15/01/2026')).toBe(true);
    });

    test('accepts a valid ISO date string when the yyyy-mm-dd format is specified', () => {
        expect(isDate('2026-01-15', 'yyyy-mm-dd')).toBe(true);
    });

    test('rejects a non-date string', () => {
        expect(isDate('not-a-date')).toBe(false);
    });
});

describe('containsOnlyIntegers', () => {
    test.each([
        ['12345', true],
        ['123.45', false],
        ['abc', false],
        ['', false],
    ])('%s -> %s', (value, expected) => {
        expect(containsOnlyIntegers(value)).toBe(expected);
    });
});

describe('checkFieldRuleConstraints', () => {
    test('returns undefined when there is no rule', () => {
        expect(checkFieldRuleConstraints('anything', undefined)).toBeUndefined();
    });

    test('enforces minLength with a custom message', () => {
        const result = checkFieldRuleConstraints('ab', { minLength: 5, message: 'too short' });
        expect(result).toBe('too short');
    });

    test('enforces maxLength', () => {
        const result = checkFieldRuleConstraints('abcdefgh', { maxLength: 5 });
        expect(result).toContain('no more than 5');
    });

    test('enforces a pattern', () => {
        const result = checkFieldRuleConstraints('abc', { pattern: '^[0-9]+$', message: 'digits only' });
        expect(result).toBe('digits only');
    });

    test('passes when all constraints are satisfied', () => {
        const result = checkFieldRuleConstraints('12345', { minLength: 3, maxLength: 10, pattern: '^[0-9]+$' });
        expect(result).toBeUndefined();
    });
});
