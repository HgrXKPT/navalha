import "@fontsource-variable/inter/index.css";
import "@fontsource/oswald/500.css";
import "@fontsource/oswald/600.css";
import "./styles/reset.css";
import "./styles/tokens.css";
import "./styles/base.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
