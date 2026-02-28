import { eventBus } from "../../../core/eventBus.js";
import { stateStore } from "../../../core/stateStore.js";
import { renderSummary } from "./view.js";

export function initGMVSummary() {
  eventBus.on("DATA_LOADING_COMPLETE", compute);
  eventBus.on("FILTER_CHANGED", compute);
}

function compute() {
  const state = stateStore.getState();

  const momData = state.rawData.MOM || [];
  const dateWiseData = state.rawData.DATE_WISE || [];
  const { month, startDate, endDate } = state.filters;

  let summaryData;
  let filteredDateWise;

  // ----- DATE RANGE -----
  if (startDate || endDate) {

    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    filteredDateWise = dateWiseData.filter(row => {
      const rowDate = parseDDMMYYYY(row["Order Date"]);

      if (start && rowDate < start) return false;
      if (end && rowDate > end) return false;

      return true;
    });

    summaryData = aggregateFromDateWise(filteredDateWise);
  }

  // ----- MONTH FILTER -----
  else if (month) {

    summaryData = momData.find(row => row.Month === month);

    const monthDate = parseDDMMYYYY(month);

    filteredDateWise = dateWiseData.filter(row => {
      const rowDate = parseDDMMYYYY(row["Order Date"]);
      return (
        rowDate.getMonth() === monthDate.getMonth() &&
        rowDate.getFullYear() === monthDate.getFullYear()
      );
    });
  }

  // ----- ALL -----
  else {
    summaryData = aggregateAll(momData);
    filteredDateWise = dateWiseData;
  }

  if (!summaryData) {
    renderSummary({
      grossSales: 0,
      grossUnits: 0,
      cancelRevenue: 0,
      cancelUnits: 0,
      returnRevenue: 0,
      returnUnits: 0,
      netRevenue: 0,
      netUnits: 0,
      cancelPercent: 0,
      returnPercent: 0,
      month: "No Data",
      dateWiseData: []
    });
    return;
  }

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
    month: month || (startDate || endDate ? "Custom Range" : "All Months"),
    dateWiseData: filteredDateWise
  });
}

function parseDDMMYYYY(value) {
  const [day, month, year] = value.split("/");
  return new Date(`${year}-${month}-${day}`);
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

function aggregateFromDateWise(rows) {
  return rows.reduce((acc, row) => {
    acc.GMV += Number(row.GMV || 0);
    acc["Gross Units"] += Number(row["Gross Units"] || 0);
    acc["Final Revenue"] += Number(row["Final Revenue"] || 0);
    acc["Final Units"] += Number(row["Final Units"] || 0);
    acc["Cancel Units"] += Number(row["Cancel Units"] || 0);
    acc["Return Units"] += Number(row["Return Units"] || 0);
    return acc;
  }, {
    GMV: 0,
    "Gross Units": 0,
    "Final Revenue": 0,
    "Final Units": 0,
    "Cancel Units": 0,
    "Return Units": 0,
    "Cancel Amount": 0,
    "Return Amount": 0
  });
}
