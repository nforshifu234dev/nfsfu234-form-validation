import Hero from "@/components/Hero";

import Installation from "@/components/Installation";

import PackageInformation from "@/components/PackageInformation";

import ValidationDemo from "@/components/ValidationDemo";

import ApiPlayground from "@/components/ApiPlayground";

import PasswordUtilities from "@/components/PasswordUtilities";

import AjaxDemo from "@/components/AjaxDemo";

import CompatibilityStatus from "@/components/CompatibilityStatus";

import Navbar from "@/components/ui/Navbar";

import Footer from "@/components/ui/Footer";

import Resources from "@/components/ui/Resources";

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main className="page-container">
        <section className="hero">
          <Hero />
        </section>

        <section className="section">
          <Resources />
        </section>

        <section className="section">
          <PackageInformation />
        </section>

        <section className="section">
          <Installation />
        </section>

        <section
          id="validation"
          className="section"
        >
          <ValidationDemo />
        </section>

        <section
          id="api"
          className="section"
        >
          <ApiPlayground />
        </section>

        <section
          id="password"
          className="section"
        >
          <PasswordUtilities />
        </section>

        <section
          id="ajax"
          className="section"
        >
          <AjaxDemo />
        </section>

        <section
          id="compatibility"
          className="section"
        >
          <CompatibilityStatus />
        </section>
      </main>

      <Footer />
    </>
  );
}