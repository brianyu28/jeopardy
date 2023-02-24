import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./components/App";

// Fonts
import "./fonts/korinna.ttf";
import "./fonts/Swiss921-BT_43276.ttf";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<App />);
