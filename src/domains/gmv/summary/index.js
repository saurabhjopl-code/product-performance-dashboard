import { eventBus } from "../../../core/eventBus.js";
import { stateStore } from "../../../core/stateStore.js";
import { renderSummary } from "./view.js";

export function initGMVSummary() {
  eventBus.on("DATA_LOADING_COMPLETE", compute);
  eventBus.on("FILTER_CHANGED", compute);
}

function compute() {
  const state = stateStore.getState();
  const raw = state.rawData.gmv.GMV;
  const selectedMonth = state.filters.month;

  let data = raw;

  if (selectedMonth) {
    data = raw.filter(row => {
      const date = new Date(row["Order Date"]);
      const month = date.toLocaleString("default", { month: "short", year: "numeric" });
      return month === selectedMonth;
    });
  }

  const revenue = data.reduce((sum, d) => sum + Number(d["Final Sale Amount"] || 0), 0);
  const units = data.reduce((sum, d) => sum + Number(d["Final Sale Units"] || 0), 0);
  const gmv = data.reduce((sum, d) => sum + Number(d["GMV"] || 0), 0);

  renderSummary({
    revenue,
    units,
    gmv,
    month: selectedMonth || "All Months"
  });
}
