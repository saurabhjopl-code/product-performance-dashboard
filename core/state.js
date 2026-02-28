import { loadAllData } from './dataLoader.js';
import { renderExecutiveSummary } from '../summaries/executiveSummary.js';

export const STATE = {
    data: {},
    filteredData: {},
    searchQuery: ""
};

export async function initApp() {
    showLoading();

    STATE.data = await loadAllData();

    setupNavigation();
    setupFilters();
    setupSearch();

    applyFilters(); // initial render

    hideLoading();
}

/* ---------------- NAVIGATION ---------------- */

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

/* ---------------- FILTER SETUP ---------------- */

function setupFilters() {
    if (!STATE.data.GMV) return;

    const monthSelect = document.getElementById("filter-month");
    const dateSelect = document.getElementById("filter-date");

    const allDates = STATE.data.GMV.map(r => r["Order Date"]);
    const uniqueMonths = [...new Set(allDates.map(d => d.slice(0, 7)))].sort();

    // Populate months
    uniqueMonths.forEach(m => {
        const option = document.createElement("option");
        option.value = m;
        option.textContent = m;
        monthSelect.appendChild(option);
    });

    // Default to current month or latest available
    const currentMonth = new Date().toISOString().slice(0, 7);
    if (uniqueMonths.includes(currentMonth)) {
        monthSelect.value = currentMonth;
    } else {
        monthSelect.value = uniqueMonths[uniqueMonths.length - 1];
    }

    monthSelect.addEventListener("change", () => {
        populateDates();
        applyFilters();
    });

    dateSelect.addEventListener("change", applyFilters);

    populateDates();
}

/* ---------------- DATE DROPDOWN ---------------- */

function populateDates() {
    const month = document.getElementById("filter-month").value;
    const dateSelect = document.getElementById("filter-date");

    dateSelect.innerHTML = '<option value="">All Dates</option>';

    const filteredDates = STATE.data.GMV
        .map(r => r["Order Date"])
        .filter(d => d.startsWith(month));

    const uniqueDates = [...new Set(filteredDates)].sort();

    uniqueDates.forEach(d => {
        const option = document.createElement("option");
        option.value = d;
        option.textContent = d;
        dateSelect.appendChild(option);
    });
}

/* ---------------- GLOBAL SEARCH ---------------- */

function setupSearch() {
    const searchInput = document.getElementById("global-search");

    searchInput.addEventListener("input", (e) => {
        STATE.searchQuery = e.target.value.toLowerCase().trim();
        applyFilters();
    });
}

/* ---------------- APPLY FILTER PIPELINE ---------------- */

function applyFilters() {
    const month = document.getElementById("filter-month").value;
    const date = document.getElementById("filter-date").value;

    let filtered = STATE.data.GMV.filter(r =>
        r["Order Date"].startsWith(month)
    );

    if (date) {
        filtered = filtered.filter(r => r["Order Date"] === date);
    }

    // Global Search across key columns
    if (STATE.searchQuery) {
        filtered = filtered.filter(row => {
            return Object.values(row).some(value =>
                String(value).toLowerCase().includes(STATE.searchQuery)
            );
        });
    }

    STATE.filteredData = {
        ...STATE.data,
        GMV: filtered
    };

    renderExecutiveSummary(STATE.filteredData);
}

/* ---------------- LOADING ---------------- */

function showLoading() {
    document.getElementById("progress-wrapper").style.display = "block";
}

function hideLoading() {
    document.getElementById("progress-wrapper").style.display = "none";
}
