export type ApiMethod = {
  category: string;
  name: string;
  placeholder: string;
  description: string;
  example: string;
};

export const apiMethods: ApiMethod[] = [
  {
    category: "Validation",
    name: "isEmail",
    placeholder: "hello@example.com",
    description: "Checks whether the value is a valid email address.",
    example: 'validator.isEmail("hello@example.com")',
  },

  {
    category: "Validation",
    name: "isURL",
    placeholder: "https://example.com",
    description: "Checks whether the value is a valid URL.",
    example: 'validator.isURL("https://example.com")',
  },

  {
    category: "Validation",
    name: "isZipCode",
    placeholder: "90210",
    description: "Checks whether the value is a ZIP/postal code.",
    example: 'validator.isZipCode("90210")',
  },

  {
    category: "Numbers",
    name: "isNumber",
    placeholder: "123",
    description: "Checks whether the value contains numbers.",
    example: 'validator.isNumber("123")',
  },

  {
    category: "Numbers",
    name: "containsOnlyIntegers",
    placeholder: "123456",
    description: "Checks whether only integers exist.",
    example: 'validator.containsOnlyIntegers("123456")',
  },

  {
    category: "Utilities",
    name: "countString",
    placeholder: "Hello World",
    description: "Returns the number of characters.",
    example: 'validator.countString("Hello World")',
  },

  {
    category: "Utilities",
    name: "checkVariableType",
    placeholder: "hello",
    description: "Returns the detected JavaScript type.",
    example: 'validator.checkVariableType("hello")',
  },
];