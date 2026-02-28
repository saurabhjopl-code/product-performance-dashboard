import { loadAllData } from './dataLoader.js';
import { renderExecutiveSummary } from '../summaries/executiveSummary.js';

export const STATE = {
    data: {},
    filteredData: {},
    currentView: "executive"
};

export async function initApp() {
    showLoading();

    try {
        STATE.data = await loadAllData();
        STATE.filteredData = STATE.data;

        setupNavigation();
        setupFilters();
        renderExecutiveSummary(STATE.filteredData);

    } catch (error) {
        console.error("Data Load Error:", error);
    }

    hideLoading();
}

/* Navigation */
function setupNavigation() {
    const buttons = document.querySelectorAll('.nav-btn');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const view = btn.dataset.view;

            document.getElementById('executive-view').style.display =
                view === "executive" ? "block" : "none";

            document.getElementById('reports-view').style.display =
                view === "reports" ? "block" : "none";
        });
    });
}

/* Filters */
function setupFilters() {
    const monthFilter = document.getElementById("filter-month");

    if (!STATE.data.GMV) return;

    const uniqueMonths = [...new Set(
        STATE.data.GMV.map(r => r["Order Date"])
    )];

    uniqueMonths.forEach(m => {
        const option = document.createElement("option");
        option.value = m;
        option.textContent = m;
        monthFilter.appendChild(option);
    });

    monthFilter.addEventListener("change", () => {
        const selected = monthFilter.value;

        if (!selected) {
            STATE.filteredData = STATE.data;
        } else {
            STATE.filteredData = {
                ...STATE.data,
                GMV: STATE.data.GMV.filter(r => r["Order Date"] === selected)
            };
        }

        renderExecutiveSummary(STATE.filteredData);
    });
}

/* Loading */
function showLoading() {
    document.getElementById("progress-wrapper").style.display = "block";
}

function hideLoading() {
    document.getElementById("progress-wrapper").style.display = "none";
}
