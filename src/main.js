import { initLayout } from "./ui/layout.js";
import { initNavbar } from "./ui/navbar.js";
import { initProgressBar, startProgress, finishProgress } from "./ui/progressBar.js";
import { loadAllData } from "./core/dataLoader.js";
import { eventBus } from "./core/eventBus.js";
import { stateStore } from "./core/stateStore.js";

import { initGMVSummary } from "./domains/gmv/summary/index.js";
import { initMonthFilter } from "./filters/monthFilter.js";
import { initDateFilter } from "./filters/dateFilter.js";
import { initFilterController } from "./filters/filterController.js";

document.addEventListener("DOMContentLoaded", async () => {

  // UI Init
  initProgressBar();
  initNavbar();
  initLayout();

  // Filters
  initMonthFilter();
  initDateFilter();
  initFilterController();

  // Summary
  initGMVSummary();

  // Progress Listeners
  eventBus.on("DATA_LOADING_START", startProgress);
  eventBus.on("DATA_LOADING_COMPLETE", finishProgress);

  // Start Loading
  eventBus.emit("DATA_LOADING_START");

  const data = await loadAllData();

  stateStore.setRawData(data);
  stateStore.setFilteredData(data);

  eventBus.emit("DATA_LOADING_COMPLETE");
});
