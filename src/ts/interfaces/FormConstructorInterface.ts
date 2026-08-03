// src/ts/interfaces/FormConstructorInterface.ts

import AJAXOptionsInterface from "./AJAXOptionsInterface";

/**
 * Accepted values for the first argument passed to
 * `new NFSFU234FormValidation(...)`.
 *
 * `undefined`
 *   Automatically resolves `#jsForm`, then the first `<form>`.
 *
 * `null`
 *   Disables automatic form resolution and creates a utility-only
 *   instance with no associated form.
 *
 * `string`
 *   Treated as the ID of a form element.
 *
 * `HTMLFormElement | HTMLDivElement`
 *   Uses the supplied element directly.
 *
 * `{ form, customErrorMessages }`
 *   Allows passing both the target form and instance-specific
 *   custom validation messages.
 */
type FormConstructorInterface =
    | null
    | string
    | HTMLFormElement
    | HTMLDivElement
    | {
          form?: string | HTMLFormElement | HTMLDivElement;
          customErrorMessages?: { [key: string]: string };
          ajaxOptions?: AJAXOptionsInterface;
      };

export default FormConstructorInterface;