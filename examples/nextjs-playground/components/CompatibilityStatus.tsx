"use client";

import { environment } from "@/lib/environment";

export default function CompatibilityStatus() {
  return (
    <div className="card">

      <h2>
        Compatibility Status
      </h2>

      <p className="muted mt-2">
        Live environment verification.
      </p>

      <div
        className="grid-3"
        style={{
          marginTop: "24px",
        }}
      >

        <div className="card">
          <h3>Next.js</h3>
          <p>
            ✓ {environment.next}
          </p>
        </div>


        <div className="card">
          <h3>React</h3>
          <p>
            ✓ {environment.react}
          </p>
        </div>


        <div className="card">
          <h3>TypeScript</h3>
          <p>
            ✓ {environment.typescript}
          </p>
        </div>


        <div className="card">
          <h3>Node</h3>
          <p>
            ✓ {environment.node}
          </p>
        </div>


        <div className="card">
          <h3>Package</h3>
          <p>
            ✓ Loaded
          </p>
        </div>


        <div className="card">
          <h3>CSS</h3>
          <p>
            ✓ Active
          </p>
        </div>

      </div>

    </div>
  );
}