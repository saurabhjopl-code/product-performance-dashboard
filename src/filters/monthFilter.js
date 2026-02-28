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
    const data = stateStore.getState().rawData.gmv.MOM;

    const months = [...new Set(data.map(d => d.Month))];

    const select = document.getElementById("month-filter");

    months.forEach(m => {
      const option = document.createElement("option");
      option.value = m;
      option.textContent = m;
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
