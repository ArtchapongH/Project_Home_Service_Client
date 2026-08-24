"use client";

import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

type PasswordVisibilityToggleProps = {
  isPasswordVisible: boolean;
  onToggle: () => void;
};

export default function PasswordVisibilityToggle({
  isPasswordVisible,
  onToggle,
}: PasswordVisibilityToggleProps) {
  return (
    <IconButton
      type="button"
      size="small"
      aria-label={isPasswordVisible ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
      onClick={onToggle}
      onMouseDown={(event) => event.preventDefault()}
      sx={{ color: "#6b7280" }}
    >
      {isPasswordVisible ? (
        <VisibilityOffIcon fontSize="small" />
      ) : (
        <VisibilityIcon fontSize="small" />
      )}
    </IconButton>
  );
}
