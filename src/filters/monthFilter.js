import { eventBus } from "../core/eventBus.js";
import { stateStore } from "../core/stateStore.js";

export function initMonthFilter() {
  const root = document.getElementById("filters-root");

  const wrapper = document.createElement("div");
  wrapper.className = "filter-item";

  wrapper.innerHTML = `
    <select id="month-filter" class="filter-input">
      <option value="">All Months</option>
    </select>
  `;

  root.appendChild(wrapper);

  eventBus.on("DATA_LOADING_COMPLETE", () => {
    const momData = stateStore.getState().rawData.MOM || [];
    const select = document.getElementById("month-filter");

    select.innerHTML = `<option value="">All Months</option>`;

    momData.forEach(row => {
      const option = document.createElement("option");
      option.value = row.Month;
      option.textContent = row.Month;
      select.appendChild(option);
    });
  });

  wrapper.addEventListener("change", (e) => {
    stateStore.setFilter("month", e.target.value);
    stateStore.setFilter("startDate", null);
    stateStore.setFilter("endDate", null);
    eventBus.emit("FILTER_CHANGED");
  });
}
