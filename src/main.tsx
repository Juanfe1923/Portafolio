import { createRoot } from "react-dom/client";
import "@fontsource-variable/plus-jakarta-sans";
import "@fontsource-variable/jetbrains-mono";
import "./index.css";
import BackgroundCanvas from "@/components/BackgroundCanvas";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <>
    <BackgroundCanvas />
    <div className="relative z-10">
      <App />
    </div>
  </>,
);
