import { loadAllData } from './dataLoader.js';
import { renderExecutiveSummary } from '../summaries/executiveSummary.js';

export const STATE = {
    data: {},
    filteredData: {},
    currentView: "executive"
};

export async function initApp() {
   function showLoading() {
    document.querySelector(".progress-container").style.display = "block";
}

function hideLoading() {
    setTimeout(() => {
        document.querySelector(".progress-container").style.display = "none";
    }, 500);
}

    STATE.data = await loadAllData();
    STATE.filteredData = STATE.data;

    setupNavigation();
    setupFilters();
    renderExecutiveSummary(STATE.filteredData);

    hideLoading();
}

function setupNavigation() {
    const buttons = document.querySelectorAll('.nav-btn');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const view = btn.dataset.view;
            STATE.currentView = view;

            document.getElementById('executive-view').style.display =
                view === "executive" ? "block" : "none";

            document.getElementById('reports-view').style.display =
                view === "reports" ? "block" : "none";
        });
    });
}

function setupFilters() {
    const monthFilter = document.getElementById("filter-month");
    const verticalFilter = document.getElementById("filter-vertical");

    if (!STATE.data.GMV) return;

    const months = [...new Set(STATE.data.GMV.map(r => r["Order Date"]))];
    months.forEach(m => {
        const option = document.createElement("option");
        option.value = m;
        option.textContent = m;
        monthFilter.appendChild(option);
    });

    monthFilter.addEventListener("change", applyFilters);
    verticalFilter.addEventListener("change", applyFilters);
}

function applyFilters() {
    const selectedMonth = document.getElementById("filter-month").value;

    if (!selectedMonth) {
        STATE.filteredData = STATE.data;
    } else {
        STATE.filteredData = {
            ...STATE.data,
            GMV: STATE.data.GMV.filter(r => r["Order Date"] === selectedMonth)
        };
    }

    renderExecutiveSummary(STATE.filteredData);
}

/* Loading UX */

function showLoading() {
    const bar = document.getElementById("progress-bar");
    bar.style.width = "30%";
}

function hideLoading() {
    const bar = document.getElementById("progress-bar");
    bar.style.width = "100%";

    setTimeout(() => {
        bar.style.width = "0%";
    }, 400);
}
