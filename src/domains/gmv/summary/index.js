import { eventBus } from "../../../core/eventBus.js";
import { stateStore } from "../../../core/stateStore.js";
import { renderSummary } from "./view.js";

export function initGMVSummary() {
  eventBus.on("DATA_LOADING_COMPLETE", compute);
  eventBus.on("FILTER_CHANGED", compute);
}

function compute() {
  const state = stateStore.getState();
  const momData = state.rawData.gmv.MOM || [];
  const selectedMonth = state.filters.month;

  let data;

  if (selectedMonth) {
    data = momData.find(row => row.Month === selectedMonth);
  } else {
    // Aggregate all months
    data = aggregateAll(momData);
  }

  if (!data) return;

  renderSummary({
    grossSales: Number(data.GMV || 0),
    grossUnits: Number(data["Gross Units"] || 0),
    cancelRevenue: Number(data["Cancel Amount"] || 0),
    cancelUnits: Number(data["Cancel Units"] || 0),
    returnRevenue: Number(data["Return Amount"] || 0),
    returnUnits: Number(data["Return Units"] || 0),
    netRevenue: Number(data["Final Revenue"] || 0),
    netUnits: Number(data["Final Units"] || 0),
    cancelPercent: Number(data["Cancel %"] || 0),
    returnPercent: Number(data["Return %"] || 0),
    month: selectedMonth || "All Months"
  });
}

function aggregateAll(rows) {
  return rows.reduce((acc, row) => {
    acc["Gross Units"] += Number(row["Gross Units"] || 0);
    acc.GMV += Number(row.GMV || 0);
    acc["Cancel Units"] += Number(row["Cancel Units"] || 0);
    acc["Cancel Amount"] += Number(row["Cancel Amount"] || 0);
    acc["Return Units"] += Number(row["Return Units"] || 0);
    acc["Return Amount"] += Number(row["Return Amount"] || 0);
    acc["Final Units"] += Number(row["Final Units"] || 0);
    acc["Final Revenue"] += Number(row["Final Revenue"] || 0);
    return acc;
  }, {
    "Gross Units": 0,
    GMV: 0,
    "Cancel Units": 0,
    "Cancel Amount": 0,
    "Return Units": 0,
    "Return Amount": 0,
    "Final Units": 0,
    "Final Revenue": 0
  });
}
