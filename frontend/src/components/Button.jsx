import * as React from "react";
import Button from "@mui/material/Button";

export default function Buttons({ text, onClick, disabled, color }) {
  return (
    <Button
      variant="contained"
      onClick={onClick}
      disabled={disabled}
      color={color}
    >
      {text}
    </Button>
  );
}
