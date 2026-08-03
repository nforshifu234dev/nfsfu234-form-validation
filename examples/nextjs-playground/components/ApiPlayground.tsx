"use client";

import { useEffect, useMemo, useState } from "react";

import NFSFU234FormValidation from "@nfsfu234/form-validation";

import {
  apiMethods,
  ApiMethod,
} from "@/lib/apiMethods";

import runApiMethod from "@/lib/runApiMethod";

import ApiMethodSelect from "@/components/playground/ApiMethodSelect";
import ApiInput from "@/components/playground/ApiInput";
import ApiExample from "@/components/playground/ApiExample";
import ApiResult from "@/components/playground/ApiResult";
import { createValidator } from "@/lib/validator";

export default function ApiPlayground() {
  const [validator, setValidator] = useState<ReturnType<typeof createValidator> | null>(null);

  useEffect(() => {
    const form = document.createElement("form");
    setValidator(createValidator(form));
  }, []);

  const categories = useMemo(
    () => [...new Set(apiMethods.map((item) => item.category))],
    []
  );

  const [category, setCategory] = useState(
    categories[0]
  );

  const filteredMethods = useMemo(
    () =>
      apiMethods.filter(
        (item) => item.category === category
      ),
    [category]
  );

  const [method, setMethod] = useState(
    filteredMethods[0]?.name ?? ""
  );

  useEffect(() => {
    if (
      !filteredMethods.some(
        (item) => item.name === method
      )
    ) {
      setMethod(filteredMethods[0]?.name ?? "");
    }
  }, [filteredMethods, method]);

  const selectedMethod: ApiMethod | undefined =
    filteredMethods.find(
      (item) => item.name === method
    );

  const [value, setValue] = useState("");

  const [result, setResult] =
    useState<unknown>(null);

  const [executionTime, setExecutionTime] =
    useState<number | null>(null);

  useEffect(() => {
    if (selectedMethod) {
      setValue(selectedMethod.placeholder);
      setResult(null);
      setExecutionTime(null);
    }
  }, [selectedMethod]);

  function runTest() {
    if (!selectedMethod) {
      return;
    }

    try {
      const start = performance.now();

      const output = runApiMethod(
        validator,
        selectedMethod.name,
        value
      );

      const end = performance.now();

      setExecutionTime(end - start);

      setResult(output);
    } catch (error) {
      setExecutionTime(null);

      setResult({
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      });
    }
  }

  function clear() {
    if (!selectedMethod) {
      return;
    }

    setValue(selectedMethod.placeholder);
    setExecutionTime(null);
    setResult(null);
  }

  return (
    <div className="card">
      <h2>API Playground</h2>

      <p className="muted my-3">
        Explore every public utility exposed by
        <strong> NFSFU234 Form Validation</strong>.
      </p>

      <ApiMethodSelect
        category={category}
        method={method}
        categories={categories}
        methods={filteredMethods}
        onCategoryChange={setCategory}
        onMethodChange={setMethod}
      />

      {selectedMethod && (
        <>
          <ApiInput
            value={value}
            placeholder={selectedMethod.placeholder}
            description={selectedMethod.description}
            onChange={setValue}
          />

          <ApiExample
            example={selectedMethod.example}
          />
        </>
      )}

      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <button
          className="btn btn-primary"
          onClick={runTest}
        >
          Run Method
        </button>

        <button
          className="btn btn-secondary"
          onClick={clear}
        >
          Clear
        </button>
      </div>

      <ApiResult
        method={method}
        input={value}
        result={result}
        executionTime={executionTime}
      />
    </div>
  );
}