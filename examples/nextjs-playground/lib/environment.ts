// lib/environment.ts
import pkg from "../package.json";

const pkgDependencies = pkg.dependencies as Record<string, string> | undefined;
const pkgDevDependencies = pkg.devDependencies as Record<string, string> | undefined;

const clean = (version: string | undefined) =>
  version?.replace(/^[^\d]*/, "") ?? "Unknown";

export const environment = {
 library: {
    name: "@nfsfu234/form-validation",
    version:
        pkgDependencies?.["@nfsfu234/form-validation"] ??
        pkgDevDependencies?.["@nfsfu234/form-validation"] ??
        "Local Build",
 },

 next: clean(pkg.dependencies.next),

  react: clean(pkg.dependencies.react),

  typescript: clean(
    pkg.devDependencies?.typescript
  ),

  node: "Browser Runtime",

  installCommand:
    "npm install @nfsfu234/form-validation",
};