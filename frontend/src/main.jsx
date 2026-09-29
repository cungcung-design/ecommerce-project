import React from "react";
import ReactDOM from "react-dom/client";

import {
  QueryClientProvider,
} from "@tanstack/react-query";

import { GoogleOAuthProvider } from "@react-oauth/google";

import App from "./App";
import { AuthProvider } from "./context/AuthContext";

import "./index.css";

import { queryClient } from "./lib/queryClient";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function AppProviders() {
  const app = (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  );

  if (!googleClientId) {
    return app;
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      {app}
    </GoogleOAuthProvider>
  );
}

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <AppProviders />
  </React.StrictMode>
);