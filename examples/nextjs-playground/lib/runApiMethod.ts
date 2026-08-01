import NFSFU234FormValidation from "@nfsfu234/form-validation";

export default function runApiMethod(
  validator: NFSFU234FormValidation,
  method: string,
  value: string
) {
  const api = validator as unknown as Record<
    string,
    (...args: unknown[]) => unknown
  >;

  const fn = api[method];

  if (typeof fn !== "function") {
    throw new Error(`Unknown API method: ${method}`);
  }

  return fn(value);
}