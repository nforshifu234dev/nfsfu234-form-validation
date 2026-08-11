# Changelog

All notable changes to the NFSFU234FormValidation Library will be documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and adheres to Semantic Versioning.

## [3.0.0] - Unreleased

### ⚠️ Breaking

- **Removed `.hashPassword()`, `.verifyPassword()`, and `.passwordMatch()`, and the `bcryptjs` runtime dependency entirely.** Client-side password hashing was never a real security feature - it doesn't protect a password in transit, and most real backends already have their own hashing story (bcrypt/argon2 in Node, or built into Django/Rails/Laravel). This library now validates and generates, it doesn't do cryptography. `generatePassword()`'s `shouldHash` option is also removed (it only existed to support the now-removed hashing). `checkPassword()` and `generatePassword()` are unaffected otherwise - both were already pure logic with no crypto dependency. This also makes the "dependency-free" description in `package.json`/README actually accurate - `dependencies` is now genuinely empty.
- `.submit()` and `.validate()` are now always `async` and always return a `Promise` - including code paths that previously returned synchronously (e.g. `return false` when the form element isn't found). Any code checking the result directly (`if (form.submit() === false)`) needs to `await` it or use `.then()` instead. This was necessary to support the new async file/image validation (reading a file's size or decoding its dimensions can't happen synchronously).

### Added

- **Bare (form-less) instantiation:** `new NFSFU234FormValidation(null)` now explicitly skips form resolution entirely - no `#jsForm`/first-`<form>` fallback, no `novalidate` attribute, no submit listener attached. Useful for consumers who only want the instance methods that don't need a form (`.ajax()`, `.isEmail()`, `.generatePassword()`, etc.) - notably React/SSR users, who previously had to pass a throwaway `document.createElement("form")` to construct an instance safely. Omitting the argument entirely still behaves exactly as before (auto-detects a form). Not a breaking change - `null` was not a previously meaningful value for this parameter.
- **`NFSFU234FormValidation.ajax()` static method:** sends a request without needing an instance or a form at all - e.g. `NFSFU234FormValidation.ajax({ url, RequestMethod: "POST" })`. The existing instance method (`validator.ajax(...)`) is unchanged and now delegates to the static one internally, still caching the result on `.getAJAXResponse()` as before.
- **TypeDoc setup:** JSDoc comments added across the main class's public methods, plus a `typedoc.json` config and `npm run docs:build` script generating both an HTML API reference and a JSON model (`docs-json/api.json`). The JSON now ships with the published npm package, so a docs site can fetch the exact, always-current function list via CDN instead of hand-maintaining an "Available Functions" page that can drift from the code.
- **File/image validation:** new `validateFile()`/`validateAllFile()` (and `.validateFile()`/`.validateAllFile()` on the class) for `<input type="file">` fields - required/min/max file count, accepted MIME types or extensions (`accept`), max size (`maxSizeMB`), and image dimension limits (`maxWidth`/`maxHeight`/`minWidth`/`minHeight`), all config-driven since there's no HTML-attribute equivalent for most of these. This is the library's first async field validator (reading image dimensions requires decoding the file first) - `.validate()`/`.submit()` are now `async` to accommodate it.
- **Real test suite:** Jest + jsdom + ts-jest, covering the config registry, `validateInput` (both attribute-driven and config-override paths), the new file validator, `ExceptionHandler`'s log levels (including a regression test for the `'big'`/`error_1` fallthrough issue), and the format-check utilities.
- **CI hardening:** the pipeline now runs type-checking and the full test suite on every push/PR to `main`, not just at release time. Publishing to npm and creating a GitHub release only happen on version tags, and only after both the test and build jobs pass - previously, a tag push went straight to `npm publish` with no gate beyond "did the build not crash."
- **Site-wide form config registry:** `NFSFU234FormValidation.configureForms([...])` + `.autoInit()` - declare validation rules for every form across a multi-page site in one place; each page automatically wires up whichever registered forms are actually present.
- **Declarative field rules:** a field's config rule (`required`, `type`, `minLength`, `maxLength`, `pattern`, `message`) can now override or extend its HTML attributes, across input, textarea, select, radio, and checkbox validation.
- Radio and checkbox validation are now included in `.validate()`/`.submit()` - previously they were silently skipped by the form-wide orchestrator and only worked if called individually.
- `.nvmrc` pinning Node 22 for CI and local dev.
- New `release-dry-run.yml` workflow (manual dispatch) that runs the full typecheck/test/build/docs pipeline plus `semantic-release --dry-run`, so the release plan can be sanity-checked before merging to `main`.
- `npm-package` artifact upload from CI, so a build's exact publishable tarball is downloadable straight from the Actions run.
- Example applications:
  - Browser (vanilla HTML)
  - Next.js App Router playground

- **Flexible constructor API:** `new NFSFU234FormValidation()` now supports:

  - automatic form detection (no arguments)
  - utility-only instances (`null`)
  - a form ID (`"myForm"`)
  - a form element
  - a configuration object containing `form`, `customErrorMessages`, and `ajaxOptions`.
- Internal form resolution was refactored into shared helpers, reducing duplicated validation logic between `.validate()` and `.submit()`.

### Changed

- **Scoped the package to `@nfsfu234/form-validation`**, under the `nfsfu234` npm organization created ahead of launch day.
- Release pipeline switched from tag-triggered (`push a v*.*.* tag → publish`) to trunk-based: `semantic-release` now runs on every push to `main`, determines the next version from Conventional Commits, and handles versioning, the changelog, the npm publish, and the GitHub release in one pass. The old three-job `verify` → `publish` → `release` pipeline is gone.
- `.releaserc.cjs`: added `next`/`alpha` prerelease channels and maintenance-range branches, explicit `commit-analyzer` release rules (`feat` → minor; `fix`/`perf`/`refactor` → patch; `docs`/`style`/`test`/`build`/`ci`/`chore` → no release), and wired the npm tarball into the GitHub release assets.
- CI (`ci.yml`, `release.yml`, `release-dry-run.yml`) now runs against the Node version pinned in the new `.nvmrc` instead of a hardcoded version.
- Bumped `actions/setup-node` from v3 to v4, and replaced the archived `actions/create-release@v1` with `softprops/action-gh-release@v2` in CI.
- `tsup` (the build tool) is now marked unmaintained upstream, with `tsdown` recommended as its successor - not an urgent migration, but worth planning for.
- **License mismatch found on the docs website repo:** its README states GPL 3.0, while this library has always been MIT. Needs correcting on the website - a visitor evaluating this library for commercial use could be scared off by an incorrect copyleft license notice.
- Rewrote `package.json`'s `description` (previously implied an unusual emphasis on textarea fields) and trimmed the `keywords` list from 97 entries down to 16 - the old list included misleading terms implying backend/Node.js/server-side support, which this library has never had.
- Updated `homepage` to the current live domain.
- `.validate()` and `.submit()` now share the same internal validation pipeline, ensuring consistent validation behaviour regardless of which API is used.

### Fixed

- Fixed a form-type detection bug in `submit()` where `instanceof HTMLFormElement || HTMLDivElement` was always `true` regardless of the actual element type.
- Fixed an SSR-safety bug across six validators where an invalid log level (`'big'`) caused a "not in a browser environment" check to throw instead of gracefully returning `false` - this could crash a Next.js/SSR render if any of those functions were reached server-side.
- Fixed the `error_1` log level in `ExceptionHandler` relying on accidental fallthrough behavior to throw; it's now an explicit case.
- Fixed the npm publish pipeline: `tsup` was outputting default file extensions, but `package.json`'s `main` field pointed at a `.cjs` file that was never produced, and the `module` field pointed at a file that actually contained CommonJS output instead of ESM. Added an `exports` map and corrected `main`/`module`/`files` so the package resolves correctly for Node, bundlers, and CDN use.
- Removed `postcss`, `autoprefixer`, `cssnano`, `postcss-cli`, `buffer`, `crypto-browserify`, `stream-browserify`, and `vm-browserify` from runtime `dependencies` - none are used at runtime by consumers; they were build-tooling-only or entirely unused.
- Fixed a copy-paste bug in `togglePasswordVisibility` where the `hideIcon` branch referenced `showIcon`.
- Unsafe type casts in radio/checkbox message handling (`.message as string` on values that could be plain strings) replaced with safe type narrowing.
- Fixed `displayErrorInline()` inserting the inline error message via `parentNode.appendChild()`, which always placed it as the *last* child of the parent regardless of where the input field itself sat — on parents with multiple fields, an error message could render next to the wrong field. It's now inserted immediately after the input via `insertAdjacentElement("afterend", ...)`, so it always lands right below the field it belongs to.
- CSS can now be imported directly from the package using:

  import "@nfsfu234/form-validation/css";

### Removed

- Removed `src/ts/index.ts`, a ~945-line dead duplicate of the main class with its own unrelated bugs - it was never used by the build and nothing imported it.
- Removed `src/ts/formSubmission/submitHandler.ts`, an entire unused parallel form-submission implementation that had been superseded but never deleted.
- Removed an empty, unreferenced `password-handling/passwordHandler.ts`.
- Removed ~300 lines of commented-out legacy code left behind in `nfsfu234FormValidation.ts` and `formValidations/validate.ts`.

### Housekeeping

- Moved the standalone HTML demonstration from `tests/index.html` to `examples/browser/` to better distinguish manual browser examples from automated tests.
- Moved generated TypeScript declaration files alongside the compiled JavaScript output and updated the package exports to match.
- Added a complete Next.js App Router playground demonstrating validation, AJAX requests, password utilities, browser compatibility, package information, installation examples, API playground, and browser demo integration. The playground now consumes the published npm package instead of local source files, providing a realistic integration example.

## [3.0.0-beta] - 2024-08-25

### Important Notes

- 🚨 **Repository Transfer:** This repository has been moved from nforshifu234dev's personal account to the NFSFU234FormValidation organization. Access it under the NFSFU234FormValidation organization by clicking [here](https://github.com/NFSFU234FormValidation/).

### Added

- **Framework Compatibility:** Added support for React JS and Vite, allowing seamless integration with these frameworks.
- **TypeScript Upgrade:** The library has been upgraded from Vanilla JavaScript to TypeScript for enhanced code efficiency and debugging.
- **Error Handling Enhancements:** Introduced the `ErrorMessage` and `ErrorHandler` interfaces for clearer error insights, allowing errors to be handled as HTML elements, text, or null.
- **Revamped Methods:** Redesigned `submit` and `validate` methods to return a Promise resolving to an `ErrorMessageInterface`, providing detailed feedback on validation results.

### Updated

- **Class and ID Renaming:** Updated the `js-required` class to `nfsfu234-fv-required` and the `jsSubmit` ID to `nfsfu234-fv-form` to maintain a consistent naming convention.
- **Website Improvements:** Ongoing work to enhance the website for a more user-friendly experience, with final changes expected by the stable release.

### Removed

- None

## [2.4.4] - 2024-03-01

## IMPORTANT INFORMATION

🚨 **Repository Transfer:** This repository has been moved from nforshifu234dev's personal account to the NFSFU234FormValidation organization. You can now access it under the NFSFU234FormValidation organization by clicking [here](https://github.com/NFSFU234FormValidation/).

### Added

- Added a new [`CODE_OF_CONDUCT`](CODE_OF_CONDUCT.md) file to promote a welcoming and inclusive community.

### Updated

- Modified the [`CONTRIBUTING.md`](CONTRIBUTING.md) file to provide updated guidelines for contributors.
- Updated the [`LICENSE`](LICENSE) file to reflect the project's license.
- Modified the [`Package Information`](package.json) file to ensure accurate information.

### Removed

- The `web` folder has been removed and transferred to its own repository. You can now find it in its dedicated repository [here](https://github.com/nforshifu234dev/website/).

## [2.4.3] - 2024-01-25

## Important Note

- When utilizing the `JsDelivr CDN URL` to access the `NFSFU234FormValidation Library` with the `@latest` tag, be aware that, in some instances, it might not include the latest updates. To ensure the inclusion of the most recent code, consider using the specific version number (e.g., 2.4.3).

- This observation was made during the release of version `2.4.2`.

### Added

- Added `redirect()` function, used for redirecting a user to a specific url or path

### Updated

- Website UI has been updated.
- `copy-webpack-plugin` was updated to `v12.0.2` from `v11.0.0`
- `css-minimizer-webpack-plugin` was updated to `v6.0.0` from `5.0.1`

### Changed

- Modified the `_getFormDetails()` function
  - Fixed the bug, `formValidator.getFormDetails is not a function`. This was due to a bundling error during the rlease of `v2.3.2`
  - Had to add `index` variable when selcting textareas, and select tags. It was returning errors in previous versions.

- Modified the `_loading()` function
  - Here I added the ability for the `loading()` function to select inut feilds with the type `search`

- Modified the `submit()` function
  - Modfied this function in the `else` part when checking if a `button` exists. The console error was a mess.

- Modified the `validateInput()` function
  - Modifed this function to be able to check for `date` type in any input feild.
  - Modified this function to display the prorper error message if an input is of type `url` and is `required`

### Removed

- None

## [2.3.2] - 2023-11-27

### Added

- none

### Changed

- Modified the ReadMe.md file
- Modified the function call attribute for `verifyPassword()` function.
- Modified the `_togglePasswordVisibility()` function to ensure more flexiblity to icon display during toggling more than one password input feild
- Updated the `_getFormDetails()`. In the previous version, only inputs feilds were affected with the updates but now all for elements `inputs`, `textareas`, `select`.

### Removed

- none

## [2.3.1] - 2023-11-25

### Information 🥳🥂

- You can now follow `NFSFU234 Form Validation Library` on [X (Formerly Twitter)](https://x.com/nf_validator234/) and [Instagram](https://www.instagram.com/nf_validator234/). The username is  `nf_validator234`.

- Also you can send an email to `nf.validator234@gmail.com`

### Added

- [verifyPassword()](ReadMe.md#verifypasswordpassword1-string-password2-string-ishashed--false-promiseboolean). Asynchronously compares two passwords, supporting both hashed and plaintext formats. More information in the ReadMe file.

- [getFormDetails()](ReadMe.md#getformdetailsform-htmlformelement). It gets the values of all form elements in a form. Be it inputs, textareas, selects or even checkboks & radio elements. Find More information in the ReadMe file num

### Changed

- Updated the `babel`, `jest` and `webpack` packages to versions `7.23.3`, `29.7.0`, and `5.89.0` respectively

- New instructions to install NFSFU234 Form Validation Library via `npm`, `yarn` in the [Installation Section]()

- Updated the documentation for the illustration for how to use the `generateRandomPassword()` function . Removed the parameters from the illustration because this function does not allow parameters yet.

- Updated the `isURL()` function to properly check and validate URLS.

- Updated the private function , `_getFormDetails()` function. The function could only get form data based on only if the form element has the `data-attr-name` attribute. Then i thought to myself since a lot of forms use the name attribute why not add that attribute to the list. Find out more information in the `getFormDetails()` function that has been made visible

### Removed

- Removed the Independence Day Banner.

## [2.3.0-patch] - 2023-10-01

### Fixed

- Fixed the error of the new features `isOnline()` and `reset()` is not working in the initial `v2.3.0`.

## [2.3.0] - 2023-10-01

### Added

- Added `isOnline()` function to check if a browser is connected to the internet or not
- Added `reset()` function to reset all the inputs to an empty value

### Changed

- Added comments to describe the `loading()` function released in the previous version(`v2.2.0`) in the `nfsfu234-form-validation.js` file located in the `src` folder

- Reviewd and edited the `displayError() function` list details in the `web/json/function-list.json` file,

## [2.2.0] - 2023-09-25

### Added

- Added `loading()` function, this function is used to add your loading message incase you wished to have a custom loading animation or text if you choose not to use the defualt submit function. This function takes 2 parameters. See more information in the [ReadMe](ReadMe)

- Added a new HTML class, `js-spin` to be added to the previous `spin` class for adding spining effect to an element.

## [2.1.0] - 2023-09-09

### Added

- Added the `displayError()` function which accepts 1 parameter of data type object. See more details and how to use  it in the [ReadMe](ReadMe)

## [2.0.0] - 2023-08-26

### Breaking Change

- Renamed the minified CSS output file from `nfsfu234-formValidation.min.css` to `nfsfu234FormValidation.min.css`, impacting how users refrence the minified CSS

### Other Changes

- Updated the banner from the versioning banner to a more static and elegant banner.

## [1.2.4] - 2023-08-26

### Changed

- Improved the `ajax()` function for a  more clean experience.

### Fixed

- Fixed the issue of `custom ajax request body not sending in browser rather getting the form details.`

## [1.2.3] - 2023-08-25

### Fixed

- Fixed the `bcrypt is not defined` issue from both browser and node environments.

## [1.2.2] - 2023-08-25

### Fixed

- Fixed the Netlify website issue and added the neccessary file for the website.

## [1.2.1] - 2023-08-25

### Added

- Website to view all available functions and how to call them. The website is url is [https://nforshifu234dev-nfsfu234-form-validation.netlify.app](https://nforshifu234dev-nfsfu234-form-validation.netlify.app/)
- `hashPassword(password or any string)` function to hash your password or information from a form before sending it from your form.
- `Clearer Information for contribution` in the [`CONTRIBUTING.md`](CONTRIBUTING.md)  file

## [1.1.1] - 2023-08-23

### Added

- `validate()` function for optional validations and more flexibility before submitting a form.

## [1.0.1] - 2023-08-20

### Changed

- Improved the `ajax()` function for a more smoother experience.

### Fixed

- Fixed `ajax()` function to be able to correctly collect the URL from the ajaxOptions parameter or uses the current page URL.

## [1.0.0] - 2023-08-15

🚀 Hello, World! My First Library - NFSFU234 Form Validation Library 📚

I'm thrilled to introduce the first release of the NFSFU234 Form Validation Library! This marks a significant milestone as it's my very first library ever created. I'm excited to share with you a suite of functions designed to validate and interact with various form elements. Whether you're a developer building web applications or working with Node.js, these functions provide a solid foundation for accurate and reliable validation solutions.

### Added

- `submit()` function for form validation and submission.
- `ajax(AJAXOptions)` function for making AJAX requests.
- `getAJAXResponse()` function for retrieving responses from AJAX requests.
- `generateRandomPassword()` function for generating random passwords.
- `checkPassword(password, shouldIncludeSymbol)` function for password strength validation.
- `isEmail(email)` function for email format validation.
- `isURL(url)` function for URL format validation.
- `isZipcode(zipcode)` function for ZIP code validation.
- `containsOnlyIntegers(inputValue)` function for integer content validation.
- `countString(inputValue)` function for character counting.
- `togglePasswordVisibility(form, icons)` function for enabling password visibility toggle.
- `validateInput(input)` function for input field validation.
- `validateAllInput()` function for validating all input fields.
- `validateSelect(select)` function for select field validation.
- `validateAllSelect()` function for validating all select fields.
- `validateTextarea(textarea)` function for textarea field validation.
- `validateAllTextarea()` function for validating all textarea fields.
- `validateCheckbox(checkbox)` function for checkbox field validation.
- `validateAllCheckbox()` function for validating all checkbox fields.
- `validateRadio(radioName)` function for radio button group validation.
- `validateAllRadio()` function for validating all radio button groups.
- `restrictInputLengthWithCounter(inputElement, counterContainer, options)` function for input length restriction with a character counter.
- `checkType(variable)` function for determining the type of a variable.
- `getPageUrl()` function for retrieving the current page URL.

### Changed

- Improved validation logic for better accuracy.
- Enhanced error message handling for better user feedback.

### Fixed

- Resolved issue with incorrect error messages being displayed.

### Removed

- None

As my very first library creation, the NFSFU234 Form Validation Library holds a special place in my journey. 🌱 I'm eager to present these functions that have been crafted with care to streamline form validation processes. 🛠️ Your feedback and support are invaluable as I embark on this exciting journey of library development. 🚀 Thank you for being part of it! 🙏
