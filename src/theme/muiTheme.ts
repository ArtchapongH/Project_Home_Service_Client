"use client";

import { createTheme } from "@mui/material/styles";

export const muiTheme = createTheme({
  typography: {
    fontFamily: "Prompt, sans-serif",
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  palette: {
    primary: {
      main: "#3b82f6",
    },
    text: {
      primary: "#374151",
      secondary: "#6b7280",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          "& fieldset": {
            borderColor: "#e5e7eb",
          },
        },
      },
    },
  },
});
