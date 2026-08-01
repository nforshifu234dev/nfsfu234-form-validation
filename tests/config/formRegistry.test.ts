import { configureForms, registerForm, clearFormRegistry, getFormConfigFor, getFieldRule, autoInitForms } from '../../src/ts/config/formRegistry';

describe('formRegistry', () => {
    beforeEach(() => {
        clearFormRegistry();
        document.body.innerHTML = '';
    });

    test('getFormConfigFor matches a form by #id selector', () => {
        configureForms([{ form: '#loginForm', fields: {} }]);
        const form = document.createElement('form');
        form.id = 'loginForm';
        document.body.appendChild(form);

        expect(getFormConfigFor(form)).toBeDefined();
    });

    test('getFormConfigFor returns undefined for an unregistered form', () => {
        configureForms([{ form: '#loginForm', fields: {} }]);
        const form = document.createElement('form');
        form.id = 'contactForm';
        document.body.appendChild(form);

        expect(getFormConfigFor(form)).toBeUndefined();
    });

    test('getFormConfigFor matches by class selector, supporting repeated forms', () => {
        configureForms([{ form: '.newsletter-form', fields: {} }]);
        const formA = document.createElement('form');
        formA.className = 'newsletter-form';
        const formB = document.createElement('form');
        formB.className = 'newsletter-form';
        document.body.append(formA, formB);

        expect(getFormConfigFor(formA)).toBeDefined();
        expect(getFormConfigFor(formB)).toBeDefined();
    });

    test('getFieldRule returns the registered rule for a known field', () => {
        configureForms([{ form: '#loginForm', fields: { email: { required: true, type: 'email' } } }]);
        const form = document.createElement('form');
        form.id = 'loginForm';
        document.body.appendChild(form);

        const rule = getFieldRule(form, 'email');
        expect(rule?.required).toBe(true);
        expect(rule?.type).toBe('email');
    });

    test('getFieldRule returns undefined for a field with no rule, or an unregistered form', () => {
        configureForms([{ form: '#loginForm', fields: { email: { required: true } } }]);
        const form = document.createElement('form');
        form.id = 'loginForm';
        document.body.appendChild(form);

        expect(getFieldRule(form, 'password')).toBeUndefined();
        expect(getFieldRule(form, undefined)).toBeUndefined();

        const other = document.createElement('form');
        other.id = 'other';
        expect(getFieldRule(other, 'email')).toBeUndefined();
    });

    test('registerForm appends to the registry instead of replacing it', () => {
        configureForms([{ form: '#formA', fields: {} }]);
        registerForm({ form: '#formB', fields: {} });

        const formA = document.createElement('form');
        formA.id = 'formA';
        const formB = document.createElement('form');
        formB.id = 'formB';

        expect(getFormConfigFor(formA)).toBeDefined();
        expect(getFormConfigFor(formB)).toBeDefined();
    });

    test('autoInitForms only wires up forms actually present on the page', () => {
        configureForms([
            { form: '#loginForm', fields: {} },
            { form: '#neverOnThisPage', fields: {} }
        ]);
        const form = document.createElement('form');
        form.id = 'loginForm';
        document.body.appendChild(form);

        class FakeValidationClass {
            submitCalls: any[] = [];
            constructor(public formDetails: any, public ajaxOptions: any) {}
            submit(opts: any) { this.submitCalls.push(opts); }
        }

        const instances = autoInitForms(FakeValidationClass);
        expect(instances.length).toBe(1);
    });

    test('autoInitForms wires submit so firing it calls instance.submit()', () => {
        configureForms([{ form: '#loginForm', fields: {} }]);
        const form = document.createElement('form');
        form.id = 'loginForm';
        document.body.appendChild(form);

        const submitSpy = jest.fn();
        class FakeValidationClass {
            constructor(public formDetails: any, public ajaxOptions: any) {}
            submit(opts: any) { submitSpy(opts); }
        }

        autoInitForms(FakeValidationClass);
        form.dispatchEvent(new Event('submit', { cancelable: true }));

        expect(submitSpy).toHaveBeenCalledTimes(1);
    });
});
