import { packageInfo } from "@/lib/packageInfo";

export default function Footer() {
  return (
    <footer
      style={{
        marginTop: "96px",
        borderTop: "1px solid var(--brand-border)",
        padding: "48px 0",
      }}
    >
      <div
        className="page-container"
        style={{
          display: "grid",
          gap: 24,
        }}
      >
        <div>
          <h2
            style={{
              marginTop: 0,
            }}
          >
            @nfsfu234/form-validation
          </h2>

          <p className="muted mt-3">
            Lightweight, dependency-free, framework-agnostic form validation
            library for modern web applications.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <span className="badge badge-success">
            v{packageInfo.version}
          </span>

          <span className="badge">
            {packageInfo.license}
          </span>

          <span className="badge">
            {packageInfo.framework}
          </span>

          <span className="badge">
            {packageInfo.dependencies} Dependencies
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 18,
          }}
        >
          <a
            href={packageInfo.documentation}
            target="_blank"
            rel="noreferrer"
          >
            Documentation
          </a>

          <a
            href={packageInfo.npm}
            target="_blank"
            rel="noreferrer"
          >
            npm Package
          </a>

          <a
            href={packageInfo.github}
            target="_blank"
            rel="noreferrer"
          >
            GitHub Repository
          </a>

          <a
            href={packageInfo.issues}
            target="_blank"
            rel="noreferrer"
          >
            Report Issue
          </a>

          <a
            href={packageInfo.releases}
            target="_blank"
            rel="noreferrer"
          >
            Releases
          </a>
        </div>

        <p
          className="muted"
          style={{
            margin: 0,
            fontSize: ".9rem",
          }}
        >
          This application is the official Next.js playground used to test and
          showcase the npm package before release. Documentation, guides, and API
          references are available on the documentation website.
        </p>
      </div>
    </footer>
  );
}