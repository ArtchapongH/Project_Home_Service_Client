"use client";

import type { ReactNode } from "react";
import Button from "@mui/material/Button";

type LoginSubmitButtonProps = {
  children: ReactNode;
  isDisabled?: boolean;
};

export default function LoginSubmitButton({
  children,
  isDisabled = false,
}: LoginSubmitButtonProps) {
  return (
    <Button
      type="submit"
      variant="contained"
      fullWidth
      disabled={isDisabled}
      sx={{
        py: 1.5,
        minHeight: 44,
        fontSize: 16,
        fontWeight: 500,
        borderRadius: "8px",
        boxShadow: "none",
        "&:hover": {
          boxShadow: "none",
        },
      }}
    >
      {children}
    </Button>
  );
}
