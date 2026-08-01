import validateInput from '../../src/ts/formValidations/validateInput';
import { configureForms, clearFormRegistry } from '../../src/ts/config/formRegistry';
import ErrorMessageInterface from '../../src/ts/interfaces/ErrorMessagesInterface';

function makeInput(attrs: { type?: string; name?: string; value?: string; required?: boolean }): HTMLInputElement {
    const el = document.createElement('input');
    if (attrs.type) el.type = attrs.type;
    if (attrs.name) el.name = attrs.name;
    if (attrs.value !== undefined) el.value = attrs.value;
    if (attrs.required) el.required = true;
    return el;
}

describe('validateInput', () => {
    beforeEach(() => {
        clearFormRegistry();
        document.body.innerHTML = '';
    });

    test('a required, empty field with no config fails using plain HTML attributes', () => {
        const form = document.createElement('form');
        form.id = 'form1';
        document.body.appendChild(form);

        const field = makeInput({ type: 'text', name: 'nickname', value: '', required: true });
        const result = validateInput(field, { form, customErrorMessages: [], includeHTML: false }) as ErrorMessageInterface;

        expect(result).not.toBe(true);
        expect(result.message).toBe('This field is required.');
    });

    test('a non-required field with a value passes', () => {
        const form = document.createElement('form');
        const field = makeInput({ type: 'text', name: 'nickname', value: 'hello', required: false });
        const result = validateInput(field, { form, customErrorMessages: [], includeHTML: false });

        expect(result).toBe(true);
    });

    test('invalid email format is rejected', () => {
        const form = document.createElement('form');
        const field = makeInput({ type: 'email', name: 'email', value: 'not-an-email', required: true });
        const result = validateInput(field, { form, customErrorMessages: [], includeHTML: false }) as ErrorMessageInterface;

        expect(result).not.toBe(true);
    });

    test('valid email format passes', () => {
        const form = document.createElement('form');
        const field = makeInput({ type: 'email', name: 'email', value: 'person@example.com', required: true });
        const result = validateInput(field, { form, customErrorMessages: [], includeHTML: false });

        expect(result).toBe(true);
    });

    test('config rule required overrides HTML attribute (attr says not required)', () => {
        const form = document.createElement('form');
        form.id = 'signupForm';
        document.body.appendChild(form);

        configureForms([{ form: '#signupForm', fields: { username: { required: true, minLength: 5, message: 'Username must be at least 5 characters.' } } }]);

        const field = makeInput({ type: 'text', name: 'username', value: 'ab', required: false });
        const result = validateInput(field, { form, customErrorMessages: [], includeHTML: false }) as ErrorMessageInterface;

        expect(result).not.toBe(true);
        expect(result.message).toBe('Username must be at least 5 characters.');
    });

    test('config rule minLength passes once the value is long enough', () => {
        const form = document.createElement('form');
        form.id = 'signupForm';
        document.body.appendChild(form);

        configureForms([{ form: '#signupForm', fields: { username: { required: true, minLength: 5 } } }]);

        const field = makeInput({ type: 'text', name: 'username', value: 'abcdef', required: false });
        const result = validateInput(field, { form, customErrorMessages: [], includeHTML: false });

        expect(result).toBe(true);
    });

    test('a field with no matching config rule falls back to plain HTML-attribute behavior', () => {
        const form = document.createElement('form');
        form.id = 'signupForm';
        document.body.appendChild(form);

        configureForms([{ form: '#signupForm', fields: { username: { required: true, minLength: 5 } } }]);

        const field = makeInput({ type: 'text', name: 'nickname', value: '', required: true });
        const result = validateInput(field, { form, customErrorMessages: [], includeHTML: false }) as ErrorMessageInterface;

        expect(result).not.toBe(true);
        expect(result.message).toBe('This field is required.');
    });

    test('config pattern rule rejects a non-matching value', () => {
        const form = document.createElement('form');
        form.id = 'signupForm';
        document.body.appendChild(form);

        configureForms([{ form: '#signupForm', fields: { zip: { pattern: '^[0-9]{5}$', message: 'Must be a 5-digit ZIP.' } } }]);

        const field = makeInput({ type: 'text', name: 'zip', value: 'abcde', required: false });
        const result = validateInput(field, { form, customErrorMessages: [], includeHTML: false }) as ErrorMessageInterface;

        expect(result).not.toBe(true);
        expect(result.message).toBe('Must be a 5-digit ZIP.');
    });
});
