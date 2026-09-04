"use client";

import { useState } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import PasswordVisibilityToggle from "./PasswordVisibilityToggle";

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
  const isPasswordField = type === "password";
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const inputType = isPasswordField && isPasswordVisible ? "text" : type;

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm text-gray-700">
        {label}
        {isRequired ? <span className="text-[#d7263d]">*</span> : null}
      </label>
      <TextField
        id={id}
        type={inputType}
        fullWidth
        hiddenLabel
        required={isRequired}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        slotProps={
          isPasswordField
            ? {
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <PasswordVisibilityToggle
                        isPasswordVisible={isPasswordVisible}
                        onToggle={() =>
                          setIsPasswordVisible((previous) => !previous)
                        }
                      />
                    </InputAdornment>
                  ),
                },
              }
            : undefined
        }
      />
    </div>
  );
}
