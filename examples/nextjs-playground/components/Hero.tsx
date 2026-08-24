"use client";

import Link from "next/link";
import { environment } from "@/lib/environment";

export default function Hero() {
  return (
    <section className="hero">

      <div className="card">

        {/* Status */}

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "28px",
          }}
        >
          <span className="badge badge-success">
            ✓ Next.js {environment.next}
          </span>

          <span className="badge badge-success">
            ✓ React {environment.react}
          </span>

          <span className="badge badge-success">
            ✓ TypeScript {environment.typescript}
          </span>

          <span className="badge badge-success">
            ✓ CSS Loaded
          </span>

          <span className="badge badge-success">
            ✓ Package Imported
          </span>
        </div>

        {/* Heading */}

        <h1 className="hero-title">
          NFSFU234{" "}
          <span className="orange">
            Form Validation
          </span>
        </h1>

        <p
          style={{
            fontWeight: 700,
            fontSize: "1.2rem",
            marginTop: "8px",
          }}
        >
          Official Next.js Compatibility Playground
        </p>

        <p className="hero-subtitle">
          Verify that the npm package works correctly inside a real
          Next.js application. This playground exercises the public API,
          validates forms, demonstrates password utilities, AJAX
          submissions, CSS loading, TypeScript support, and other
          features before every release.
        </p>

        {/* Install */}

        <div
          className="console mt"
          style={{
            marginTop: "40px",
          }}
        >
          <div className="console-header">
            Installation
          </div>

          <div className="console-output">
            <pre className="console console-small">
{`npm install @nfsfu234/form-validation`}
            </pre>
          </div>
        </div>

        {/* Buttons */}

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            marginTop: "36px",
          }}
        >
          <Link
            href="https://formvalidation.nforshifu234dev.com"
            target="_blank"
            className="btn btn-primary"
          >
            Documentation
          </Link>

          <Link
            href="https://www.npmjs.com/package/@nfsfu234/form-validation"
            target="_blank"
            className="btn btn-secondary"
          >
            npm Package
          </Link>

          <Link
            href="https://github.com/nforshifu234dev/nfsfu234-form-validation"
            target="_blank"
            className="btn btn-secondary"
          >
            GitHub
          </Link>
        </div>

      </div>

      {/* Feature cards */}

      <div
        className="grid-3"
        style={{
          marginTop: "32px",
        }}
      >
        <div className="card">
          <h3>Framework Agnostic</h3>

          <p className="muted my-3">
            The same package powers Vanilla JavaScript, React,
            Next.js, Vue, Angular, Astro, Svelte, Vite and more.
          </p>
        </div>

        <div className="card">
          <h3>Production Ready</h3>

          <p className="muted my-3">
            Built with TypeScript, zero runtime dependencies,
            tree-shakeable modules, CSS exports and modern package
            exports.
          </p>
        </div>

        <div className="card">
          <h3>Quality Assurance</h3>

          <p className="muted my-3">
            This playground is used before every release to ensure the
            published npm package behaves exactly as documented inside a
            real Next.js application.
          </p>
        </div>
      </div>

    </section>
  );
}