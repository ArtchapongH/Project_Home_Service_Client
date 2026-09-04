"use client";

import Button from "@mui/material/Button";

type FacebookLoginButtonProps = {
  label: string;
};

export default function FacebookLoginButton({ label }: FacebookLoginButtonProps) {
  const handleFacebookLogin = () => {
    // Connect Facebook login later
  };

  return (
    <Button
      fullWidth
      variant="outlined"
      onClick={handleFacebookLogin}
      startIcon={
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <rect width="24" height="24" rx="5" fill="#1877F2" />
          <path
            fill="#fff"
            d="M16.5 24v-8.25h2.77l.41-3.2H16.5V10.5c0-.87.24-1.47 1.5-1.47h1.6V6.13C19.32 6.04 18.2 6 17 6c-2.5 0-4.21 1.53-4.21 4.33v2.22H10v3.2h2.79V24H16.5z"
          />
        </svg>
      }
      sx={{
        py: 1.5,
        minHeight: 44,
        fontSize: { xs: 14, sm: 16 },
        borderRadius: "8px",
        borderColor: "#3b82f6",
        color: "#3b82f6",
      }}
    >
      {label}
    </Button>
  );
}
