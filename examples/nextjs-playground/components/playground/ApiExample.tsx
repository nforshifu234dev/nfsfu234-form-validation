"use client";

type Props = {
  example: string;
};

export default function ApiExample({
  example,
}: Props) {
  return (
    <div
      className="console mt"
      style={{
        marginBottom: "24px",
      }}
    >
      <div className="console-header">
        Example
      </div>

      <pre className="console-output">
        <code>{example}</code>
      </pre>
    </div>
  );
}