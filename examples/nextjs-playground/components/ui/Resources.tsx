import { packageInfo } from "@/lib/packageInfo";

const resources = [
  {
    title: "Documentation",
    description:
      "Complete guides, API reference, installation instructions and examples.",
    href: packageInfo.documentation,
    action: "Open Docs",
  },

  {
    title: "npm Package",
    description:
      "Install the latest published version from the npm registry.",
    href: packageInfo.npm,
    action: "View npm",
  },

  {
    title: "GitHub Repository",
    description:
      "Browse the source code, contribute and inspect releases.",
    href: packageInfo.github,
    action: "Open Repository",
  },

  {
    title: "Issues",
    description:
      "Found a bug or have a feature request? Let us know.",
    href: packageInfo.issues,
    action: "Report Issue",
  },

  {
    title: "Releases",
    description:
      "View changelogs and every published version.",
    href: packageInfo.releases,
    action: "View Releases",
  },

  {
    title: "Browser Demo",
    description:
      "Standalone HTML example included with this repository for testing without React, Next.js or any framework.",
    location: "examples/browser/index.html",
  },
];

export default function Resources() {
  return (
    <div>
      <h2 className="section-title">
        Resources
      </h2>

      <p className="section-description">
        Everything you need to install, explore, test and contribute to{" "}
        <strong>@nfsfu234/form-validation</strong>.
      </p>

      <div
        className="grid-3"
        style={{
          marginTop: 28,
        }}
      >
        {resources.map((resource) => (
          <div
            key={resource.title}
            className="card"
          >
            <h3>{resource.title}</h3>

            <p className="muted my-3">
              {resource.description}
            </p>

            {"href" in resource ? (
              <a
                className="btn btn-primary"
                href={resource.href}
                target="_blank"
                rel="noreferrer"
              >
                {resource.action}
              </a>
            ) : (
              <>
                <div
                  className="console mt"
                  style={{
                    minHeight: "unset",
                  }}
                >
                  <div className="console-header">
                    Repository Location
                  </div>

                  <pre className="console-output">
{resource.location}
                  </pre>
                </div>

                <p
                  className="muted"
                  style={{
                    marginTop: 12,
                    fontSize: ".9rem",
                  }}
                >
                  Clone the repository and open this file directly in your
                  browser.
                </p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}