// components/CopyButton.tsx
"use client";

import { useState } from "react";

export default function CopyButton({
  text
}: {
  text:string;
}) {

  const [copied,setCopied] =
    useState(false);


  async function copy(){

    await navigator.clipboard.writeText(text);

    setCopied(true);

    setTimeout(()=>{
      setCopied(false);
    },1500);

  }


  return (
    <button
      className="btn btn-secondary"
      onClick={copy}
    >
      {
        copied
          ? "Copied ✓"
          : "Copy"
      }
    </button>
  );
}