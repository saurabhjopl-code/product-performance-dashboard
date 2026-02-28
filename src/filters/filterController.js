import { eventBus } from "../core/eventBus.js";
import { stateStore } from "../core/stateStore.js";

export function initFilterController() {
  eventBus.on("FILTER_CHANGED", () => {
    const state = stateStore.getState();
    const raw = state.rawData;

    const { month, startDate, endDate } = state.filters;

    let filtered = { ...raw };

    // Month filter overrides date range
    if (month) {
      filtered.activeFilter = { type: "month", value: month };
    }
    else if (startDate || endDate) {
      filtered.activeFilter = {
        type: "dateRange",
        startDate,
        endDate
      };
    }
    else {
      filtered.activeFilter = null;
    }

    stateStore.setFilteredData(filtered);

    eventBus.emit("FILTER_APPLIED");
  });
}
