import React from "react";
import { createRoot } from "react-dom/client";
import { InboxPage } from "./src/features/inbox/InboxPage";
import "./styles.css";

const mountNode = document.getElementById("app");

if (!mountNode) {
  throw new Error("Missing #app mount node");
}

createRoot(mountNode).render(
  React.createElement(React.StrictMode, null, React.createElement(InboxPage)),
);
