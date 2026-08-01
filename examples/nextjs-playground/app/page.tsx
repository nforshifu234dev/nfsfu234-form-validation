import Hero from "@/components/Hero";
import CompatibilityStatus from "@/components/CompatibilityStatus";
import ValidationDemo from "@/components/ValidationDemo";
import ApiPlayground from "@/components/ApiPlayground";
import PasswordUtilities from "@/components/PasswordUtilities";
import AjaxDemo from "@/components/AjaxDemo";
import Console from "@/components/Console";

export default function HomePage() {
  return (
    <main className="page-container">
      <Hero />

      <section className="section">
        <CompatibilityStatus />
      </section>

      <section className="section">
        <ValidationDemo />
      </section>

      <section className="section grid-2">
        <ApiPlayground />
        <Console />
      </section>

      <section className="section">
        <PasswordUtilities />
      </section>

      <section className="section">
        <AjaxDemo />
      </section>

      <footer
        style={{
          marginTop: "96px",
          marginBottom: "48px",
          textAlign: "center",
          color: "var(--brand-muted)",
          borderTop: "1px solid var(--brand-border)",
          paddingTop: "32px",
        }}
      >
        <p>
          Built with ❤️ using{" "}
          <strong>NFSFU234 Form Validation v3</strong>.
        </p>

        <p style={{ marginTop: "8px", fontSize: ".9rem" }}>
          Official Next.js compatibility playground.
        </p>
      </footer>
    </main>
  );
}