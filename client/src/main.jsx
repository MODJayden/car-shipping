import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import store from "./store/store";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter>
      <Provider store={store}>
        <App />
        <Toaster />
      </Provider>
    </HashRouter>
  </StrictMode>
);
