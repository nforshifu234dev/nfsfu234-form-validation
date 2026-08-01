// Declarative validation rule for a single field, keyed by its `name` or `id`
// in a FormConfigInterface. Any property left unset here falls back to
// whatever the field's own HTML attributes say (required, type, pattern,
// minlength/maxlength). Anything set here overrides the attribute-derived
// value for that field.
export default interface FieldRuleInterface {
    required?: boolean,
    type?: 'email' | 'url' | 'zip' | 'date' | 'integer' | string,
    minLength?: number,
    maxLength?: number,
    pattern?: string,
    message?: string,

    // File/image-specific (only relevant for input[type="file"] fields):
    accept?: string[],      // MIME types (e.g. 'image/png'), wildcards ('image/*'), or extensions ('.pdf')
    maxSizeMB?: number,
    minFiles?: number,
    maxFiles?: number,
    maxWidth?: number,      // image-only: rejects images wider than this, in pixels
    maxHeight?: number,     // image-only
    minWidth?: number,      // image-only
    minHeight?: number,     // image-only

    // Optional, more specific overrides than the shared `message` above -
    // use these if you want distinct wording per failure reason (wrong
    // type vs. too large vs. wrong dimensions vs. missing file) instead of
    // one message for all of them. Any left unset fall back to `message`,
    // and if that's unset too, a sensible built-in default is used.
    requiredMessage?: string,
    typeMessage?: string,
    sizeMessage?: string,
    dimensionMessage?: string
}