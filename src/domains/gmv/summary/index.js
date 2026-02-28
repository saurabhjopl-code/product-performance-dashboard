import { eventBus } from "../../../core/eventBus.js";
import { stateStore } from "../../../core/stateStore.js";
import { renderSummary } from "./view.js";

export function initGMVSummary() {
  eventBus.on("DATA_LOADING_COMPLETE", compute);
  eventBus.on("FILTER_CHANGED", compute);
}

function compute() {
  const state = stateStore.getState();

  const momData = state.rawData?.gmv?.MOM || [];
  const dateWiseData = state.rawData?.gmv?.DATE_WISE || [];
  const selectedMonth = state.filters.month;

  let summaryData;
  let filteredDateWise;

  if (selectedMonth) {
    summaryData = momData.find(row => row.Month === selectedMonth);

    const selectedDate = new Date(selectedMonth);

    filteredDateWise = dateWiseData.filter(row => {
      const rowDate = new Date(row["Order Date"]);
      return (
        rowDate.getMonth() === selectedDate.getMonth() &&
        rowDate.getFullYear() === selectedDate.getFullYear()
      );
    });

  } else {
    summaryData = aggregateAll(momData);
    filteredDateWise = dateWiseData;
  }

  if (!summaryData) return;

  renderSummary({
    grossSales: Number(summaryData.GMV || 0),
    grossUnits: Number(summaryData["Gross Units"] || 0),
    cancelRevenue: Number(summaryData["Cancel Amount"] || 0),
    cancelUnits: Number(summaryData["Cancel Units"] || 0),
    returnRevenue: Number(summaryData["Return Amount"] || 0),
    returnUnits: Number(summaryData["Return Units"] || 0),
    netRevenue: Number(summaryData["Final Revenue"] || 0),
    netUnits: Number(summaryData["Final Units"] || 0),
    cancelPercent: Number(summaryData["Cancel %"] || 0),
    returnPercent: Number(summaryData["Return %"] || 0),
    month: selectedMonth || "All Months",
    dateWiseData: filteredDateWise
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
