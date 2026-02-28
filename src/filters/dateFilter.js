import { eventBus } from "../core/eventBus.js";
import { stateStore } from "../core/stateStore.js";

export function initDateFilter() {
  const root = document.getElementById("filters-root");

  const wrapper = document.createElement("div");
  wrapper.className = "filter-item";

  wrapper.innerHTML = `
    <input type="date" id="start-date" class="filter-input" />
    <input type="date" id="end-date" class="filter-input" />
  `;

  root.appendChild(wrapper);

  wrapper.addEventListener("change", (e) => {
    if (e.target.id === "start-date") {
      stateStore.setFilter("startDate", e.target.value);
    }

    if (e.target.id === "end-date") {
      stateStore.setFilter("endDate", e.target.value);
    }

    eventBus.emit("FILTER_CHANGED");
  });
}
