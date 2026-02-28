import { eventBus } from "../../../core/eventBus.js";
import { stateStore } from "../../../core/stateStore.js";
import { renderSummary } from "./view.js";

export function initGMVSummary() {
  eventBus.on("DATA_LOADING_COMPLETE", compute);
  eventBus.on("FILTER_CHANGED", compute);
}

function compute() {
  const state = stateStore.getState();
  let data = state.filteredData.gmv.GMV;

  if (state.filters.month) {
    data = data.filter(d => d["Order Date"].includes(state.filters.month));
  }

  const totalRevenue = data.reduce((sum, d) => sum + Number(d["Final Sale Amount"] || 0), 0);
  const totalUnits = data.reduce((sum, d) => sum + Number(d["Final Sale Units"] || 0), 0);
  const totalGMV = data.reduce((sum, d) => sum + Number(d["GMV"] || 0), 0);

  renderSummary({
    revenue: totalRevenue,
    units: totalUnits,
    gmv: totalGMV
  });
}
