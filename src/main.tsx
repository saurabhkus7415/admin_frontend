import React from "react";
import { createRoot } from "react-dom/client";
import ReactDOM from "react-dom/client";
import App from "./App";
import "antd/dist/reset.css";
import "./styles.css";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root element (#root) not found in HTML");

// createRoot(document.getElementById('root')!).render(<App />);

const root = ReactDOM.createRoot(rootEl);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
