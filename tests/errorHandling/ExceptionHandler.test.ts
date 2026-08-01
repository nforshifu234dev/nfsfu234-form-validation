import { ExceptionHandler } from '../../src/ts/errorHandling/ExceptionHandler';

describe('ExceptionHandler', () => {
    let consoleErrorSpy: jest.SpyInstance;
    let consoleWarnSpy: jest.SpyInstance;

    beforeEach(() => {
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
        consoleWarnSpy.mockRestore();
    });

    test('default level (console) logs but does not throw', () => {
        expect(() => ExceptionHandler('something went wrong')).not.toThrow();
        expect(consoleErrorSpy).toHaveBeenCalled();
    });

    test('warning level logs a warning and does not throw', () => {
        expect(() => ExceptionHandler('heads up', 'warning')).not.toThrow();
        expect(consoleWarnSpy).toHaveBeenCalled();
    });

    test('throw level throws the error', () => {
        expect(() => ExceptionHandler('fatal', 'throw')).toThrow('fatal');
    });

    test('error_1 level explicitly throws (used for hard validation errors)', () => {
        expect(() => ExceptionHandler('validation failed', 'error_1')).toThrow('validation failed');
    });

    test('an unrecognized level falls through to default and throws', () => {
        // Guards against regressions like the old 'big' typo silently becoming non-throwing
        expect(() => ExceptionHandler('unexpected', 'not-a-real-level')).toThrow('unexpected');
    });
});
