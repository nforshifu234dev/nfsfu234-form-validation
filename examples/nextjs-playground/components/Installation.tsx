"use client";

import CopyButton from "./CopyButton";

const INSTALLS = {
  npm: "npm install @nfsfu234/form-validation",
  yarn: "yarn add @nfsfu234/form-validation",
  pnpm: "pnpm add @nfsfu234/form-validation",
};

const IMPORT =
`import NFSFU234FormValidation from "@nfsfu234/form-validation";`;

const QUICKSTART =
`const validator = new NFSFU234FormValidation(form);

const result = await validator.validate();`;

const CDN =
`<script src="https://cdn.jsdelivr.net/npm/@nfsfu234/form-validation"></script>`;

function Block({
  title,
  code,
}:{
  title:string;
  code:string;
}){

  return(

    <div className="console mt">

      <div
        className="console-header"
        style={{
          display:"flex",
          justifyContent:"space-between",
          alignItems:"center",
        }}
      >

        <span>{title}</span>

        <CopyButton text={code} />

      </div>

      <pre className="console-output">
        {code}
      </pre>

    </div>

  );

}

export default function Installation(){

  return(

    <div className="card">

      <h2>Installation</h2>

      <p className="muted my-3">
        Install the package using your preferred package manager.
      </p>

      <Block
        title="npm"
        code={INSTALLS.npm}
      />

      <Block
        title="yarn"
        code={INSTALLS.yarn}
      />

      <Block
        title="pnpm"
        code={INSTALLS.pnpm}
      />

      <Block
        title="CDN"
        code={CDN}
      />

      <Block
        title="Import"
        code={IMPORT}
      />

      <Block
        title="Quick Start"
        code={QUICKSTART}
      />

    </div>

  );

}