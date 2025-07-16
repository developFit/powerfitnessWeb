import React from "react";
import ReactDOM from "react-dom/client";
import { Snackbar, Alert } from "@mui/material";

const renderNotification = (
  message: string,
  severity: "success" | "error"
) => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = ReactDOM.createRoot(container);

  const handleClose = () => {
    root.unmount();
    container.remove();
  };

  root.render(
    <Snackbar open autoHideDuration={3000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export const showSuccess = (message: string) => {
  renderNotification(message, "success");
};

export const showError = (message: string) => {
  renderNotification(message, "error");
};
