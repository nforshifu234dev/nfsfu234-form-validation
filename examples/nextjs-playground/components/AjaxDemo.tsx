"use client";

import { useMemo, useState } from "react";
import { createValidator } from "@/lib/validator";

type ResponseState = {
  status: string;
  duration: string;
  size: string;
  data: unknown;
} | null;

export default function AjaxDemo() {
  const validator = useMemo(
    () => createValidator(document.createElement("form")),
    []
  );

  const [url, setUrl] = useState(
    "https://jsonplaceholder.typicode.com/posts"
  );

  const [method, setMethod] = useState("POST");

  const [query, setQuery] = useState("");

  const [token, setToken] = useState("");

  const [headers, setHeaders] = useState(
`{
  "Content-Type":"application/json"
}`
  );

  const [body, setBody] = useState(
`{
  "title":"NFSFU234 Demo",
  "body":"Testing AJAX module",
  "userId":1
}`
  );

  const [response, setResponse] =
    useState<ResponseState>(null);

  function loadJSONPlaceholder() {
    setUrl(
      "https://jsonplaceholder.typicode.com/posts"
    );

    setMethod("POST");

    setQuery("");

    setToken("");

    setHeaders(
`{
  "Content-Type":"application/json"
}`
    );

    setBody(
`{
  "title":"NFSFU234 Demo",
  "body":"Testing AJAX module",
  "userId":1
}`
    );
  }

  function loadHTTPBin() {
    setUrl("https://httpbin.org/anything");

    setMethod("POST");

    setQuery("library=nfsfu234&version=3");

    setToken("demo-token");

    setHeaders(
`{
  "Content-Type":"application/json"
}`
    );

    setBody(
`{
  "library":"NFSFU234",
  "version":"3"
}`
    );
  }

  function loadCustom() {
    setUrl("");

    setMethod("GET");

    setQuery("");

    setToken("");

    setHeaders("{}");

    setBody("{}");
  }

  async function sendRequest() {
    try {
      const parsedHeaders =
        headers.trim() === ""
          ? {}
          : JSON.parse(headers);

      if (token.trim()) {
        parsedHeaders.Authorization =
          `Bearer ${token}`;
      }

      const parsedBody =
        body.trim() === ""
          ? {}
          : JSON.parse(body);

      const start = performance.now();

      const result = await validator.ajax({
        url,
        RequestMethod: method,
        RequestHeader: parsedHeaders,
        RequestBody: parsedBody,
        QueryParameters: query,
      });

      const duration =
        performance.now() - start;

      const json =
        JSON.stringify(result, null, 2);

      const bytes =
        new TextEncoder().encode(json).length;

      setResponse({
        status: "200 OK",
        duration: `${duration.toFixed(0)} ms`,
        size: `${(bytes / 1024).toFixed(2)} KB`,
        data: result,
      });

    } catch (error: any) {

      setResponse({
        status: "Request Failed",
        duration: "--",
        size: "--",
        data: {
          error: error.message,
        },
      });

    }
  }

  return (
    <div className="card">

      <h2>AJAX Playground</h2>

      <p className="muted my-3">
        Test the built-in AJAX helper against public APIs or your own endpoint.
      </p>

      <div
        style={{
          display: "flex",
          gap: ".75rem",
          flexWrap: "wrap",
          marginBottom: "1rem",
        }}
      >
        <button
          className="btn btn-secondary"
          onClick={loadJSONPlaceholder}
        >
          JSONPlaceholder
        </button>

        <button
          className="btn btn-secondary"
          onClick={loadHTTPBin}
        >
          HTTPBin Echo
        </button>

        <button
          className="btn btn-secondary"
          onClick={loadCustom}
        >
          Custom URL
        </button>
      </div>

      <div className="field">
        <label>Endpoint URL</label>

        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>

      <div className="field">
        <label>Method</label>

        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        >
          <option>GET</option>
          <option>POST</option>
          <option>PUT</option>
          <option>PATCH</option>
          <option>DELETE</option>
        </select>
      </div>

      <div className="field">
        <label>Query Parameters</label>

        <input
          placeholder="page=1&limit=5"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="field">
        <label>Bearer Token</label>

        <input
          placeholder="Optional"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
      </div>

      <div className="field">
        <label>Headers (JSON)</label>

        <textarea
          value={headers}
          onChange={(e) => setHeaders(e.target.value)}
        />
      </div>

      <div className="field">
        <label>Request Body (JSON)</label>

        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </div>

      <div
        style={{
          display: "flex",
          gap: "1rem",
        }}
      >
        <button
          className="btn btn-primary"
          onClick={sendRequest}
        >
          Send Request
        </button>

        <button
          className="btn btn-secondary"
          onClick={() => setResponse(null)}
        >
          Clear Response
        </button>
      </div>

      <div className="console mt">

        <div className="console-header">
          Response
        </div>

        <div className="console-body">

          {response && (

            <div
              style={{
                marginBottom: "1rem",
                display: "grid",
                gap: ".35rem",
              }}
            >
              <strong>
                Status: {response.status}
              </strong>

              <span>
                Duration: {response.duration}
              </span>

              <span>
                Response Size: {response.size}
              </span>
            </div>

          )}

          <pre className="console-output">
            {response
              ? JSON.stringify(
                  response.data,
                  null,
                  2
                )
              : "// Send a request to see the response"}
          </pre>

        </div>

      </div>

    </div>
  );
}