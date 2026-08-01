"use client";

import { packageInfo } from "@/lib/packageInfo";

export default function Navbar() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        backdropFilter: "blur(18px)",
        background: "rgba(255,255,255,.88)",
        borderBottom: "1px solid var(--brand-border)",
      }}
    >
      <div
        className="page-container"
        style={{
          height: 72,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 24,
        }}
      >
        <a
          href={packageInfo.documentation}
          target="_blank"
          rel="noreferrer"
          style={{
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "1.1rem",
            }}
          >
            @nfsfu234/form-validation
          </h2>
        </a>

        <nav
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 14,
            fontSize: ".95rem",
          }}
        >
          <a href="#validation">Validation</a>

          <a href="#api">API</a>

          <a href="#password">Password</a>

          <a href="#ajax">AJAX</a>

          <a href="#compatibility">Compatibility</a>

          <span
            style={{
              opacity: .3,
            }}
          >
            |
          </span>

          <a
            href={packageInfo.documentation}
            target="_blank"
            rel="noreferrer"
          >
            Docs
          </a>

          <a
            href={packageInfo.npm}
            target="_blank"
            rel="noreferrer"
          >
            npm
          </a>

          <a
            href={packageInfo.github}
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}