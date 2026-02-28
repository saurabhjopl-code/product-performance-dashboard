import { eventBus } from "../core/eventBus.js";
import { stateStore } from "../core/stateStore.js";

export function initMonthFilter() {
  const root = document.getElementById("filters-root");

  const container = document.createElement("div");
  container.className = "filter-group";

  container.innerHTML = `
    <div class="filter-label">Month</div>
    <select id="month-filter" class="filter-select">
      <option value="">All Months</option>
    </select>
  `;

  root.appendChild(container);

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

  container.addEventListener("change", e => {
    if (e.target.id === "month-filter") {
      stateStore.setFilter("month", e.target.value);
      eventBus.emit("FILTER_CHANGED");
    }
  });
}
