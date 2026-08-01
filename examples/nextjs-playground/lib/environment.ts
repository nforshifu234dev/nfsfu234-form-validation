// lib/environment.ts
import pkg from "../package.json";

const clean = (version: string | undefined) =>
  version?.replace(/^[^\d]*/, "") ?? "Unknown";

export const environment = {
  library: {
    name: "@nfsfu234/form-validation",
    version:
      pkg.dependencies["nfsfu234-form-validation"] ??
      pkg.devDependencies?.["nfsfu234-form-validation"] ??
      "Local Build",
  },

  next: clean(pkg.dependencies.next),

  react: clean(pkg.dependencies.react),

  typescript: clean(
    pkg.devDependencies?.typescript
  ),

  node:
    typeof process !== "undefined"
      ? process.version
      : "Browser",

  installCommand:
    "npm install nfsfu234-form-validation",
};