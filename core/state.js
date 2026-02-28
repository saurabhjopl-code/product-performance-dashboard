import { loadAllData } from './dataLoader.js';
import { renderExecutiveSummary } from '../summaries/executiveSummary.js';
import { renderDateWiseReport } from '../reports/dateWiseReport.js';

export const STATE = {
    data: {},
    filteredData: {},
    searchQuery: "",
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

    applyFilters(); // only updates data
    renderExecutive(); // initial render

    hideLoading();
}

/* ---------------- VIEW ROUTER ---------------- */

function setupNavigation() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.nav-btn')
                .forEach(b => b.classList.remove('active'));

            btn.classList.add('active');
            STATE.currentView = btn.dataset.view;

            toggleView();
        });
    });
}

function toggleView() {
    const exec = document.getElementById('executive-view');
    const reports = document.getElementById('reports-view');

    if (STATE.currentView === "executive") {
        exec.style.display = "block";
        reports.style.display = "none";
        renderExecutive();
    } else {
        exec.style.display = "none";
        reports.style.display = "block";
        renderReport();
    }
}

function setupReportNavigation() {
    document.querySelectorAll('.report-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.report-btn')
                .forEach(b => b.classList.remove('active'));

            btn.classList.add('active');
            STATE.currentReport = btn.dataset.report;
            renderReport();
        });
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
}

/* ---------------- RENDERERS ---------------- */

function renderExecutive() {
    renderExecutiveSummary(STATE.filteredData);
}

function renderReport() {
    if (STATE.currentReport === "date") {
        renderDateWiseReport(STATE.filteredData);
    }
}

/* ---------------- FILTER EVENTS ---------------- */

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

    monthSelect.value = months[months.length - 1];

    monthSelect.addEventListener("change", () => {
        populateDates();
        applyFilters();
        rerenderActive();
    });

    dateSelect.addEventListener("change", () => {
        applyFilters();
        rerenderActive();
    });

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

function setupSearch() {
    const input = document.getElementById("global-search");

    input.addEventListener("input", e => {
        STATE.searchQuery = e.target.value.toLowerCase().trim();
        applyFilters();
        rerenderActive();
    });
}

function setupReset() {
    document.getElementById("reset-filters").addEventListener("click", () => {
        document.getElementById("filter-date").value = "";
        document.getElementById("global-search").value = "";
        STATE.searchQuery = "";
        applyFilters();
        rerenderActive();
    });
}

function rerenderActive() {
    if (STATE.currentView === "executive") {
        renderExecutive();
    } else {
        renderReport();
    }
}

/* ---------------- LOADING ---------------- */

function showLoading() {
    document.getElementById("progress-wrapper").style.display = "block";
}

function hideLoading() {
    document.getElementById("progress-wrapper").style.display = "none";
}
