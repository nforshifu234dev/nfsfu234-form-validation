// lib/validator.ts
"use client";

import NFSFU234FormValidation from "@nfsfu234/form-validation";

export function createValidator(
  form: HTMLFormElement
) {
  return new NFSFU234FormValidation(form);
}