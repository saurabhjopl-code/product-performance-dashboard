import { initLayout } from "./ui/layout.js";
import { initNavbar } from "./ui/navbar.js";
import { initProgressBar } from "./ui/progressBar.js";

document.addEventListener("DOMContentLoaded", () => {
  initProgressBar();
  initNavbar();
  initLayout();
});
