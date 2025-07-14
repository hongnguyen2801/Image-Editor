import React from "react";
import ReactDOM from "react-dom/client";
import "@shopify/polaris/build/esm/styles.css";
import App from "./App";

const root = document.getElementById("root");
if (root) {
    ReactDOM.createRoot(root).render(<App />);
}
