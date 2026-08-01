"use client";

type Props = {
  value: string;
  placeholder: string;
  description: string;

  onChange: (value: string) => void;
};

export default function ApiInput({
  value,
  placeholder,
  description,
  onChange,
}: Props) {
  return (
    <>
      <div className="field">
        <label htmlFor="api-input">
          Input Value
        </label>

        <input
          id="api-input"
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          autoComplete="off"
          spellCheck={false}
        />
      </div>

      <p
        className="muted"
        style={{
          marginTop: "-8px",
          marginBottom: "24px",
        }}
      >
        {description}
      </p>
    </>
  );
}