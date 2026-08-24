# 📜 NFSFU234FormValidation

<div align="center">

A lightweight, dependency-free JavaScript form validation library for modern web applications.

Validate HTML forms with support for inputs, textareas, selects, radio buttons, checkboxes, file uploads, image validation, AJAX submissions, password utilities, and framework-agnostic configuration.

Built for **Vanilla JavaScript**, **React**, **Next.js**, **Vue**, **Svelte**, **Angular**, **Astro**, **Vite**, **Expo Web**, and any project running in the browser.

<br>

[![npm version](https://img.shields.io/npm/v/nfsfu234-form-validation.svg)](https://www.npmjs.com/package/@nfsfu234/form-validation)
[![npm downloads](https://img.shields.io/npm/dm/nfsfu234-form-validation.svg)](https://www.npmjs.com/package/@nfsfu234/form-validation)
[![License: MIT](https://img.shields.io/npm/l/nfsfu234-form-validation)](LICENSE)
[![GitHub Release](https://img.shields.io/github/v/release/NFSFU234FormValidation/nfsfu234-form-validation)](https://github.com/nforshifu234dev/nfsfu234-form-validation/releases)
[![GitHub Stars](https://img.shields.io/github/stars/NFSFU234FormValidation/nfsfu234-form-validation?style=social)](https://github.com/nforshifu234dev/nfsfu234-form-validation)
[![GitHub Issues](https://img.shields.io/github/issues/NFSFU234FormValidation/nfsfu234-form-validation)](https://github.com/nforshifu234dev/nfsfu234-form-validation/issues)
[![CI](https://github.com/nforshifu234dev/nfsfu234-form-validation/actions/workflows/ci.yml/badge.svg)](https://github.com/nforshifu234dev/nfsfu234-form-validation/actions/workflows/ci.yml)

<br>

[📚 Documentation](https://formvalidation.nforshifu234dev.com)
•
[📦 npm](https://www.npmjs.com/package/@nfsfu234/form-validation)
•
[💻 Website Source](https://github.com/nforshifu234dev/website)
•
[🐛 Report Bug](https://github.com/nforshifu234dev/nfsfu234-form-validation/issues)
•
[✨ Request Feature](https://github.com/nforshifu234dev/nfsfu234-form-validation/issues)

</div>

---

## Why NFSFU234FormValidation?

NFSFU234FormValidation is a modern client-side form validation library designed to make form validation simple, flexible, and framework agnostic.

Unlike many validation libraries that require complex schemas or extensive configuration, NFSFU234FormValidation embraces native HTML standards while allowing developers to progressively enhance forms with powerful validation rules, AJAX submission, file validation, custom error handling, password utilities, and reusable configuration.

Whether you're building a simple contact form or managing hundreds of forms across a large application, the library provides a consistent API that scales with your project.

Version **3.0.0** introduces the largest update in the project's history, bringing a redesigned developer experience, automated API documentation, improved TypeScript support, a modern documentation portal, and a cleaner architecture for long-term maintenance.

## Installation

> **📦 Package renamed:** As of `v3.0.0`, this package has moved from `nfsfu234-form-validation` to the **`@nfsfu234`** npm organization and is now published as **`@nfsfu234/form-validation`**. The old package name is deprecated on npm — installing it will show a warning pointing here, and it will not receive further updates.

```bash
npm install @nfsfu234/form-validation
```

```bash
yarn add @nfsfu234/form-validation
```

```bash
pnpm add @nfsfu234/form-validation
```

### Migrating from `nfsfu234-form-validation`

1. **Uninstall the old package and install the new one:**

```bash
   npm uninstall nfsfu234-form-validation
   npm install @nfsfu234/form-validation
```

1. **Update your imports** — only the package specifier changes; every export, method, and behavior is identical:

```diff
   - import NFSFU234FormValidation from "nfsfu234-form-validation";
   + import NFSFU234FormValidation from "@nfsfu234/form-validation";
```

1. **Update the CSS import**, if you use it:

```diff
   - import "nfsfu234-form-validation/css";
   + import "@nfsfu234/form-validation/css";
```

1. **CDN users**, update the script `src`:

```diff
   - <script src="https://cdn.jsdelivr.net/npm/nfsfu234-form-validation"></script>
   + <script src="https://cdn.jsdelivr.net/npm/@nfsfu234/form-validation"></script>
```

No API, behavior, or config changes are required beyond the name — this is purely a package identity move, done ahead of the `v3.0.0` launch to bring the library under its own npm organization.

---

## Requirements

- Modern web browser
- JavaScript enabled
- No external dependencies
- Works with JavaScript and TypeScript
- Compatible with all modern frontend frameworks

---

## Supported Frameworks

NFSFU234FormValidation is framework agnostic and works anywhere JavaScript runs in the browser.

| Framework | Supported |
| ----------- | :---------: |
| HTML | ✅ |
| JavaScript | ✅ |
| TypeScript | ✅ |
| React | ✅ |
| Next.js | ✅ |
| Vue | ✅ |
| Nuxt | ✅ |
| Angular | ✅ |
| Svelte | ✅ |
| SvelteKit | ✅ |
| Astro | ✅ |
| Vite | ✅ |
| Expo Web | ✅ |

For framework-specific installation guides, examples, migration guides, and API documentation, visit the official documentation website:

👉 [**formvalidation.nforshifu234dev.com**](https://formvalidation.nforshifu234dev.com)

## 🚀 Quick Start

Getting started only takes a few lines of code.

Create a simple HTML form:

```html
<form id="loginForm">
  <input
    type="email"
    name="email"
    placeholder="Email address"
    required
  />

  <input
    type="password"
    name="password"
    placeholder="Password"
    required
    minlength="8"
  />

  <button type="submit">
    Log in
  </button>
</form>
```

Initialize the validator:

```javascript
import NFSFU234FormValidation from "@nfsfu234/form-validation";

const validator = new NFSFU234FormValidation({
  form: "#loginForm"
});
```

Validate and submit the form:

```javascript
document
  .getElementById("loginForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const result = await validator.submit();

    if (result.type === "success") {
      console.log("Validation successful!");
    }
  });
```

That's it.

The library automatically detects and validates native HTML validation attributes such as:

- `required`
- `type="email"`
- `type="url"`
- `minlength`
- `maxlength`
- `pattern`
- `accept`
- `multiple`
- file inputs
- radio groups
- checkboxes
- selects

## ✨ Features

NFSFU234FormValidation is designed to provide a complete client-side validation experience while remaining lightweight and framework agnostic.

### Core Validation

- ✅ Native HTML validation support
- ✅ Email validation
- ✅ URL validation
- ✅ ZIP/Postal code validation
- ✅ Date validation
- ✅ Integer validation
- ✅ Custom regular expressions
- ✅ Required field validation
- ✅ Length validation
- ✅ Custom validation messages

### Form Elements

Supports validation for:

- Text inputs
- Password inputs
- Number inputs
- Email inputs
- URL inputs
- Search inputs
- Telephone inputs
- Date inputs
- Textareas
- Select elements
- Radio groups
- Checkboxes
- File uploads
- Image uploads

### File & Image Validation

Validate uploaded files with:

- File type restrictions
- MIME type validation
- File extension validation
- Maximum file size
- Minimum number of files
- Maximum number of files
- Image width
- Image height
- Minimum dimensions
- Maximum dimensions

### AJAX Support

- AJAX form submission
- JSON requests
- FormData support
- Custom headers
- Success callbacks
- Error callbacks
- Redirect support

### User Experience

- Inline error messages
- Modal error messages
- Custom error messages
- Automatic focus handling
- Password visibility toggle
- Password generation
- Password verification
- Password strength utilities

### Multi-Form Support

- Register multiple forms
- Global configuration
- Automatic initialization
- Site-wide validation
- Reusable configuration

### TypeScript

- Built-in TypeScript definitions
- Fully typed API
- IDE autocomplete
- Strong typing support

### Developer Experience

- Framework agnostic
- Zero runtime dependencies
- Modern ES Modules
- CommonJS support
- CDN support
- npm package
- Automatic API documentation
- Extensive documentation
- Practical examples

## 🌍 Browser & Framework Compatibility

NFSFU234FormValidation works in every modern browser and integrates with virtually every frontend framework.

### Supported Browsers

| Browser | Supported |
| ---------- | :---------: |
| Chrome | ✅ |
| Edge | ✅ |
| Firefox | ✅ |
| Safari | ✅ |
| Opera | ✅ |

### Supported Frameworks

| Framework | Supported |
| ----------- | :---------: |
| HTML | ✅ |
| JavaScript | ✅ |
| TypeScript | ✅ |
| React | ✅ |
| Next.js | ✅ |
| Vue | ✅ |
| Nuxt | ✅ |
| Angular | ✅ |
| Svelte | ✅ |
| SvelteKit | ✅ |
| Astro | ✅ |
| Vite | ✅ |
| Expo Web | ✅ |

Because the library interacts directly with the browser's DOM, it should be initialized on the client when used in frameworks that support Server Components, such as Next.js.

Complete integration guides are available in the documentation website.

## 📚 Documentation

The official documentation website contains everything needed to build production-ready forms with NFSFU234FormValidation.

### Learn

- Getting Started
- Installation
- Framework Guides
- Configuration
- Validation Rules
- AJAX Submission
- Password Utilities
- File Validation
- Image Validation
- Error Handling
- Migration Guides

### API Reference

The complete API reference is automatically generated from the project's TypeDoc output, ensuring the documentation always stays synchronized with the latest release.

### Examples

Explore practical implementations including:

- Login forms
- Registration forms
- Contact forms
- Newsletter signup
- File uploads
- Image uploads
- Password validation
- Multi-step forms
- Survey forms
- AJAX forms

### Additional Resources

- Technical blog
- Release notes
- Changelog
- FAQ
- Contributing guide

📖 **Official Documentation**

[https://formvalidation.nforshifu234dev.com](https://formvalidation.nforshifu234dev.com)

---

## Website Source

[https://github.com/nforshifu234dev/nfsfu234-form-validation-website](https://github.com/nforshifu234dev/nfsfu234-form-validation-website)
