import { eventBus } from "../core/eventBus.js";
import { stateStore } from "../core/stateStore.js";

export function initDateFilter() {
  const root = document.getElementById("filters-root");

  const container = document.createElement("div");
  container.className = "filter-group";

  container.innerHTML = `
    <div class="filter-label">From</div>
    <input type="date" id="start-date" class="filter-select"/>

    <div class="filter-label">To</div>
    <input type="date" id="end-date" class="filter-select"/>
  `;

  root.appendChild(container);

  container.addEventListener("change", e => {
    if (e.target.id === "start-date") {
      stateStore.setFilter("startDate", e.target.value);
      eventBus.emit("FILTER_CHANGED");
    }

    if (e.target.id === "end-date") {
      stateStore.setFilter("endDate", e.target.value);
      eventBus.emit("FILTER_CHANGED");
    }
  });
}
