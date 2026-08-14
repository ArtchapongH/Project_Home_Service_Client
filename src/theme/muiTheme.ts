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
      main: "#3366FF",
      light: "#EFF6FF",
      dark: "#2557E0",
      contrastText: "#FFFFFF",
    },
    text: {
      primary: "#1F2937",
      secondary: "#6B7280",
    },
    background: {
      default: "#F3F4F6",
      paper: "#FFFFFF",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          boxShadow: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "none",
          fontWeight: 600,
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          backgroundColor: "#FFFFFF",
          "& fieldset": {
            borderColor: "#E5E7EB",
          },
          "&:hover fieldset": {
            borderColor: "#D1D5DB",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#3366FF",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          fontWeight: 600,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: "8px",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: "#EFEFEF",
          color: "#64748B",
          fontWeight: 600,
          fontSize: "0.875rem",
          borderBottom: "1px solid #E5E7EB",
        },
        body: {
          borderBottom: "1px solid #F3F4F6",
          fontSize: "0.875rem",
        },
      },
    },
  },
});
