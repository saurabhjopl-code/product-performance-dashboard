import { eventBus } from "../../../core/eventBus.js";
import { stateStore } from "../../../core/stateStore.js";
import { renderSummary } from "./view.js";

export function initGMVSummary() {
  eventBus.on("DATA_LOADING_COMPLETE", compute);
  eventBus.on("FILTER_CHANGED", compute);
}

function compute() {
  const state = stateStore.getState();
  const raw = state.rawData.gmv.GMV || [];
  const selectedMonth = state.filters.month;

  let data = raw;

  if (selectedMonth) {
    data = raw.filter(row => {
      const date = new Date(row["Order Date"]);
      const monthName = date.toLocaleString("default", { month: "short" });
      const year = date.getFullYear();
      const formatted = `${monthName}-${year}`;
      return formatted === selectedMonth;
    });
  }

  const grossSales = data.reduce((s, d) => s + Number(d["GMV"] || 0), 0);
  const grossUnits = data.reduce((s, d) => s + Number(d["Gross Units"] || 0), 0);

  const cancelRevenue = data.reduce((s, d) => s + Number(d["Cancellation Amount"] || 0), 0);
  const cancelUnits = data.reduce((s, d) => s + Number(d["Cancellation Units"] || 0), 0);

  const returnRevenue = data.reduce((s, d) => s + Number(d["Return Amount"] || 0), 0);
  const returnUnits = data.reduce((s, d) => s + Number(d["Return Units"] || 0), 0);

  const netRevenue = data.reduce((s, d) => s + Number(d["Final Sale Amount"] || 0), 0);
  const netUnits = data.reduce((s, d) => s + Number(d["Final Sale Units"] || 0), 0);

  const cancelPercent = grossSales ? ((cancelRevenue / grossSales) * 100).toFixed(2) : 0;
  const returnPercent = grossSales ? ((returnRevenue / grossSales) * 100).toFixed(2) : 0;

  renderSummary({
    grossSales,
    grossUnits,
    cancelRevenue,
    cancelUnits,
    returnRevenue,
    returnUnits,
    netRevenue,
    netUnits,
    cancelPercent,
    returnPercent,
    month: selectedMonth || "All Months"
  });
}
