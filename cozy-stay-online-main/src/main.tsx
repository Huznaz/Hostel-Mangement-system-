import { createRoot } from "react-dom/client";
import { appMode } from "./config/appMode";
import UserApp from "./apps/UserApp";
import AdminApp from "./apps/AdminApp";
import FullApp from "./apps/FullApp";
import "./index.css";

const Root =
  appMode === "user" ? UserApp : appMode === "admin" ? AdminApp : FullApp;

createRoot(document.getElementById("root")!).render(<Root />);
