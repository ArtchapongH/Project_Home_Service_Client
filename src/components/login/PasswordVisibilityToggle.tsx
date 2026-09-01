"use client";

import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useTranslations } from "next-intl";

type PasswordVisibilityToggleProps = {
  isPasswordVisible: boolean;
  onToggle: () => void;
};

export default function PasswordVisibilityToggle({
  isPasswordVisible,
  onToggle,
}: PasswordVisibilityToggleProps) {
  const t = useTranslations("Common");

  return (
    <IconButton
      type="button"
      size="small"
      aria-label={isPasswordVisible ? t("hidePassword") : t("showPassword")}
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
