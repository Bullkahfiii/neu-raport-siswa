import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import TrialGate from "./components/TrialGate";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <TrialGate>
    <App />
  </TrialGate>
);