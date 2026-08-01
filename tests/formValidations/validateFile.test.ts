import validateFile from '../../src/ts/formValidations/validateFile';
import validateAllFile from '../../src/ts/formValidations/validateAllFile';
import { configureForms, clearFormRegistry } from '../../src/ts/config/formRegistry';
import ErrorMessageInterface from '../../src/ts/interfaces/ErrorMessagesInterface';

function makeFileInput(name: string, files: File[]): HTMLInputElement {
    const el = document.createElement('input');
    el.type = 'file';
    el.name = name;
    Object.defineProperty(el, 'files', { value: files, writable: true });
    return el;
}

describe('validateFile', () => {
    let mockDimensions = { width: 800, height: 600 };

    beforeEach(() => {
        clearFormRegistry();
        document.body.innerHTML = '';
        mockDimensions = { width: 800, height: 600 };

        // jsdom doesn't actually decode images, so provide a deterministic mock.
        (global as any).URL.createObjectURL = jest.fn(() => 'blob:mock');
        (global as any).URL.revokeObjectURL = jest.fn();
        (global as any).Image = class {
            onload: (() => void) | null = null;
            naturalWidth = 0;
            naturalHeight = 0;
            set src(_v: string) {
                this.naturalWidth = mockDimensions.width;
                this.naturalHeight = mockDimensions.height;
                if (this.onload) this.onload();
            }
        };
    });

    test('required field with no file selected fails', async () => {
        const form = document.createElement('form');
        form.id = 'uploadForm';
        document.body.appendChild(form);
        configureForms([{ form: '#uploadForm', fields: { avatar: { required: true } } }]);

        const field = makeFileInput('avatar', []);
        const result = await validateFile(field, { form, includeHTML: false }) as ErrorMessageInterface;

        expect(result).not.toBe(true);
        expect(result.message).toMatch(/select a file/i);
    });

    test('file with a disallowed MIME type is rejected', async () => {
        const form = document.createElement('form');
        form.id = 'uploadForm';
        document.body.appendChild(form);
        configureForms([{ form: '#uploadForm', fields: { avatar: { accept: ['image/png', 'image/jpeg'] } } }]);

        const field = makeFileInput('avatar', [new File(['x'], 'doc.txt', { type: 'text/plain' })]);
        const result = await validateFile(field, { form, includeHTML: false }) as ErrorMessageInterface;

        expect(result).not.toBe(true);
        expect(result.message).toMatch(/not an accepted file type/i);
    });

    test('extension-based accept (.pdf) allows a matching file', async () => {
        const form = document.createElement('form');
        form.id = 'uploadForm';
        document.body.appendChild(form);
        configureForms([{ form: '#uploadForm', fields: { resume: { accept: ['.pdf'] } } }]);

        const field = makeFileInput('resume', [new File(['%PDF-1.4'], 'resume.pdf', { type: 'application/pdf' })]);
        const result = await validateFile(field, { form, includeHTML: false });

        expect(result).toBe(true);
    });

    test('file exceeding maxSizeMB is rejected', async () => {
        const form = document.createElement('form');
        form.id = 'uploadForm';
        document.body.appendChild(form);
        configureForms([{ form: '#uploadForm', fields: { resume: { maxSizeMB: 1 } } }]);

        const bigContent = new Array(2 * 1024 * 1024).fill('a').join('');
        const field = makeFileInput('resume', [new File([bigContent], 'big.pdf', { type: 'application/pdf' })]);
        const result = await validateFile(field, { form, includeHTML: false }) as ErrorMessageInterface;

        expect(result).not.toBe(true);
        expect(result.message).toMatch(/exceeds the maximum size/i);
    });

    test('image wider than maxWidth is rejected', async () => {
        const form = document.createElement('form');
        form.id = 'uploadForm';
        document.body.appendChild(form);
        configureForms([{ form: '#uploadForm', fields: { avatar: { maxWidth: 1000 } } }]);
        mockDimensions = { width: 2000, height: 500 };

        const field = makeFileInput('avatar', [new File(['x'], 'wide.png', { type: 'image/png' })]);
        const result = await validateFile(field, { form, includeHTML: false }) as ErrorMessageInterface;

        expect(result).not.toBe(true);
        expect(result.message).toMatch(/wider than/i);
    });

    test('image within all limits passes', async () => {
        const form = document.createElement('form');
        form.id = 'uploadForm';
        document.body.appendChild(form);
        configureForms([{ form: '#uploadForm', fields: { avatar: { accept: ['image/png'], maxSizeMB: 2, maxWidth: 1000, maxHeight: 1000 } } }]);
        mockDimensions = { width: 400, height: 300 };

        const field = makeFileInput('avatar', [new File(['x'], 'good.png', { type: 'image/png' })]);
        const result = await validateFile(field, { form, includeHTML: false });

        expect(result).toBe(true);
    });

    test('validateAllFile finds the one failing field among multiple file inputs', async () => {
        const form = document.createElement('form');
        form.id = 'uploadForm';
        configureForms([{ form: '#uploadForm', fields: { resume: { required: true } } }]);

        const avatarField = makeFileInput('avatar', [new File(['x'], 'good.png', { type: 'image/png' })]);
        const resumeField = makeFileInput('resume', []);
        form.append(avatarField, resumeField);

        const result = await validateAllFile(form, { includeHTML: false });

        expect(Array.isArray(result)).toBe(true);
        expect((result as ErrorMessageInterface[]).length).toBe(1);
    });

    test('validateAllFile returns true when every file input passes', async () => {
        const form = document.createElement('form');
        form.id = 'uploadForm';
        configureForms([{ form: '#uploadForm', fields: { resume: { required: true } } }]);

        const resumeField = makeFileInput('resume', [new File(['%PDF'], 'resume.pdf', { type: 'application/pdf' })]);
        form.append(resumeField);

        const result = await validateAllFile(form, { includeHTML: false });
        expect(result).toBe(true);
    });
});
