"use client";

type Props = {
  method: string;
  input: string;
  result: unknown;
  executionTime: number | null;
};

export default function ApiResult({
  method,
  input,
  result,
  executionTime,
}: Props) {
  const isBoolean = typeof result === "boolean";

  return (
    <div className="console mt">
      <div
        className="console-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>Response</span>

        {executionTime !== null && (
          <span
            className="muted"
            style={{
              fontSize: ".85rem",
              fontWeight: 500,
            }}
          >
            {executionTime.toFixed(2)} ms
          </span>
        )}
      </div>

      <div className="console-body">
        {isBoolean && (
          <div
            style={{
              marginBottom: "18px",
            }}
          >
            <span
              className={`badge ${
                result
                  ? "badge-success"
                  : "badge-danger"
              }`}
            >
              {result ? "TRUE" : "FALSE"}
            </span>
          </div>
        )}

        <pre className="console-output">
          {JSON.stringify(
            {
              method,
              input,
              result,
            },
            null,
            2
          )}
        </pre>
      </div>
    </div>
  );
}