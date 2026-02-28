import { initLayout } from "./ui/layout.js";
import { initNavbar } from "./ui/navbar.js";
import { initProgressBar, startProgress, finishProgress } from "./ui/progressBar.js";
import { loadAllData } from "./core/dataLoader.js";
import { eventBus } from "./core/eventBus.js";

import { initGMVSummary } from "./domains/gmv/summary/index.js";
import { initMonthFilter } from "./filters/monthFilter.js";
import { initDateFilter } from "./filters/dateFilter.js";
import { initFilterController } from "./filters/filterController.js";



document.addEventListener("DOMContentLoaded", async () => {
  initProgressBar();
  initNavbar();
  initLayout();
  initMonthFilter();
  initDateFilter();
  initFilterController();
  initGMVSummary();
  
  eventBus.on("DATA_LOADING_START", startProgress);
  eventBus.on("DATA_LOADING_COMPLETE", finishProgress);

  await loadAllData();
});
