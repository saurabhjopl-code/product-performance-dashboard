import { loadAllData } from './dataLoader.js';
import { renderExecutiveSummary } from '../summaries/executiveSummary.js';
import { renderDateWiseReport } from '../reports/dateWiseReport.js';

export const STATE = {
    data: {},
    filteredData: {},
    searchQuery: "",
    debounceTimer: null,
    currentView: "executive",
    currentReport: "date"
};

export async function initApp() {
    showLoading();

    STATE.data = await loadAllData();

    setupNavigation();
    setupReportNavigation();
    setupFilters();
    setupSearch();
    setupReset();

    applyFilters();   // only updates STATE

    hideLoading();
}

/* ---------------- MAIN NAV ---------------- */

function setupNavigation() {
    const buttons = document.querySelectorAll('.nav-btn');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            STATE.currentView = btn.dataset.view;

            document.getElementById('executive-view').style.display =
                STATE.currentView === "executive" ? "block" : "none";

            document.getElementById('reports-view').style.display =
                STATE.currentView === "reports" ? "block" : "none";

            renderActiveView();
        });
    });
}

/* ---------------- REPORT NAV ---------------- */

function setupReportNavigation() {
    const buttons = document.querySelectorAll('.report-btn');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            STATE.currentReport = btn.dataset.report;

            if (STATE.currentView === "reports") {
                renderCurrentReport();
            }
        });
    });
}

/* ---------------- FILTERS ---------------- */

function setupFilters() {
    const monthSelect = document.getElementById("filter-month");
    const dateSelect = document.getElementById("filter-date");

    const dates = STATE.data.GMV.map(r => r["Order Date"]);
    const months = [...new Set(dates.map(d => d.slice(0,7)))].sort();

    months.forEach(m => {
        const opt = document.createElement("option");
        opt.value = m;
        opt.textContent = m;
        monthSelect.appendChild(opt);
    });

    const currentMonth = new Date().toISOString().slice(0,7);
    monthSelect.value = months.includes(currentMonth)
        ? currentMonth
        : months[months.length - 1];

    monthSelect.addEventListener("change", () => {
        populateDates();
        applyFilters();
    });

    dateSelect.addEventListener("change", applyFilters);

    populateDates();
}

function populateDates() {
    const month = document.getElementById("filter-month").value;
    const dateSelect = document.getElementById("filter-date");

    dateSelect.innerHTML = '<option value="">All Dates</option>';

    const dates = STATE.data.GMV
        .map(r => r["Order Date"])
        .filter(d => d.startsWith(month));

    [...new Set(dates)].sort().forEach(d => {
        const opt = document.createElement("option");
        opt.value = d;
        opt.textContent = d;
        dateSelect.appendChild(opt);
    });
}

/* ---------------- SEARCH ---------------- */

function setupSearch() {
    const input = document.getElementById("global-search");
    const clearBtn = document.getElementById("clear-search");

    input.addEventListener("input", (e) => {
        clearTimeout(STATE.debounceTimer);

        clearBtn.style.display = e.target.value ? "block" : "none";

        STATE.debounceTimer = setTimeout(() => {
            STATE.searchQuery = e.target.value.toLowerCase().trim();
            applyFilters();
        }, 300);
    });

    clearBtn.addEventListener("click", () => {
        input.value = "";
        clearBtn.style.display = "none";
        STATE.searchQuery = "";
        applyFilters();
    });
}

/* ---------------- RESET ---------------- */

function setupReset() {
    document.getElementById("reset-filters").addEventListener("click", () => {
        document.getElementById("filter-date").value = "";
        document.getElementById("global-search").value = "";
        document.getElementById("clear-search").style.display = "none";
        STATE.searchQuery = "";
        applyFilters();
    });
}

/* ---------------- FILTER ENGINE ---------------- */

function applyFilters() {
    const month = document.getElementById("filter-month").value;
    const date = document.getElementById("filter-date").value;

    let filtered = STATE.data.GMV.filter(r =>
        r["Order Date"].startsWith(month)
    );

    if (date) {
        filtered = filtered.filter(r => r["Order Date"] === date);
    }

    if (STATE.searchQuery) {
        filtered = filtered.filter(row =>
            Object.values(row).some(v =>
                String(v).toLowerCase().includes(STATE.searchQuery)
            )
        );
    }

    STATE.filteredData = { ...STATE.data, GMV: filtered };

    updateFilterSummary(month, filtered.length);

    renderActiveView();
}

/* ---------------- VIEW ROUTER ---------------- */

function renderActiveView() {
    if (STATE.currentView === "executive") {
        renderExecutiveSummary(STATE.filteredData);
    } else {
        renderCurrentReport();
    }
}

function renderCurrentReport() {
    if (STATE.currentReport === "date") {
        renderDateWiseReport(STATE.filteredData);
    }
}

/* ---------------- UI HELPERS ---------------- */

function updateFilterSummary(month, count) {
    document.getElementById("filter-summary").textContent =
        `${month} | ${count} Records`;
}

function showLoading() {
    document.getElementById("progress-wrapper").style.display = "block";
}

function hideLoading() {
    document.getElementById("progress-wrapper").style.display = "none";
}
