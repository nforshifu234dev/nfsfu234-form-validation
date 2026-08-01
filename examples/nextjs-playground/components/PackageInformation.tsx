"use client";

import { environment } from "@/lib/environment";

function Item({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "1rem",
        padding: ".8rem 0",
        borderBottom: "1px solid var(--brand-border)",
      }}
    >
      <strong>{label}</strong>

      <span className="muted">{value}</span>
    </div>
  );
}

export default function PackageInformation() {
  return (
    <div className="card">

      <h2>Package Information</h2>

      <p className="muted my-3">
        Information about the installed library.
      </p>

      <div className="mt">

        <Item
          label="Package"
          value={environment.library.name}
        />

        <Item
          label="Version"
          value={environment.library.version}
        />

        <Item
          label="License"
          value="MIT"
        />

        <Item
          label="Language"
          value="TypeScript"
        />

        <Item
          label="Runtime Dependencies"
          value="0"
        />

        <Item
          label="Framework"
          value="Framework Agnostic"
        />

        <Item
          label="CSS"
          value="Included"
        />

        <Item
          label="Types"
          value="Included"
        />

        <Item
          label="Module Formats"
          value="ESM • CommonJS • UMD"
        />

      </div>

    </div>
  );
}