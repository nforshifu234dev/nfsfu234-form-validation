"use client";

import { ApiMethod } from "@/lib/apiMethods";

type Props = {
  category: string;
  method: string;
  categories: string[];
  methods: ApiMethod[];

  onCategoryChange: (value: string) => void;
  onMethodChange: (value: string) => void;
};

export default function ApiMethodSelect({
  category,
  method,
  categories,
  methods,
  onCategoryChange,
  onMethodChange,
}: Props) {
  return (
    <>
      <div className="field">
        <label htmlFor="api-category">
          Category
        </label>

        <select
          id="api-category"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          {categories.map((item) => (
            <option
              key={item}
              value={item}
            >
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="api-method">
          Method
        </label>

        <select
          id="api-method"
          value={method}
          onChange={(e) => onMethodChange(e.target.value)}
        >
          {methods.map((item) => (
            <option
              key={item.name}
              value={item.name}
            >
              {item.name}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}