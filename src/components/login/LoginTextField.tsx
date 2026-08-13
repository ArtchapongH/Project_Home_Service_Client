"use client";

import TextField from "@mui/material/TextField";

type LoginTextFieldProps = {
  id: string;
  label: string;
  type?: string;
  value: string;
  placeholder?: string;
  isRequired?: boolean;
  autoComplete?: string;
  onChange: (value: string) => void;
};

export default function LoginTextField({
  id,
  label,
  type = "text",
  value,
  placeholder,
  isRequired = true,
  autoComplete,
  onChange,
}: LoginTextFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm text-gray-700">
        {label}
        {isRequired ? <span className="text-[#d7263d]">*</span> : null}
      </label>
      <TextField
        id={id}
        type={type}
        fullWidth
        hiddenLabel
        required={isRequired}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
