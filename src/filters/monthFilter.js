import { stateStore } from "../core/stateStore.js";
import { eventBus } from "../core/eventBus.js";

export function initMonthFilter() {
  const root = document.getElementById("filters-root");

  root.innerHTML = `
    <div class="filter-group">
      <div class="filter-label">Month</div>
      <select id="month-filter" class="filter-select">
        <option value="">All Months</option>
      </select>
    </div>
  `;

  eventBus.on("DATA_LOADING_COMPLETE", () => {
    const momData = stateStore.getState().rawData.gmv.MOM || [];

    const select = document.getElementById("month-filter");

    momData.forEach(row => {
      const option = document.createElement("option");
      option.value = row.Month;
      option.textContent = row.Month;
      select.appendChild(option);
    });
  });

  root.addEventListener("change", e => {
    if (e.target.id === "month-filter") {
      stateStore.setFilter("month", e.target.value);
      eventBus.emit("FILTER_CHANGED");
    }
  });
}
