import { formatCurrency, formatNumber } from '../core/utils.js';

let trendChart = null;
let splitChart = null;

export function renderExecutiveSummary(data) {

    const container = document.getElementById('executive-view');
    container.innerHTML = ""; // HARD RESET

    if (!data.GMV || data.GMV.length === 0) {
        container.innerHTML = "<p>No data available</p>";
        return;
    }

    const grossRevenue = sum(data.GMV, "GMV");
    const grossUnits = sum(data.GMV, "Gross Units");

    const cancelRevenue = sum(data.GMV, "Cancellation Amount");
    const cancelUnits = sum(data.GMV, "Cancellation Units");

    const returnRevenue = sum(data.GMV, "Return Amount");
    const returnUnits = sum(data.GMV, "Return Units");

    const netRevenue = grossRevenue - cancelRevenue - returnRevenue;
    const netUnits = grossUnits - cancelUnits - returnUnits;

    const cancelPct = grossRevenue ? (cancelRevenue / grossRevenue) * 100 : 0;
    const returnPct = grossRevenue ? (returnRevenue / grossRevenue) * 100 : 0;
    const netRealisation = grossRevenue ? (netRevenue / grossRevenue) * 100 : 0;
    const asp = netUnits ? netRevenue / netUnits : 0;

    container.innerHTML = `
        <div class="exec-wrapper">

            <div class="summary-row">
                ${card("Gross Sales", grossRevenue, grossUnits)}
                ${card("Cancellations", cancelRevenue, cancelUnits)}
                ${card("Returns", returnRevenue, returnUnits)}
                ${card("Net Sales", netRevenue, netUnits)}
            </div>

            <div class="summary-row secondary">
                ${simpleCard("Cancel %", cancelPct.toFixed(2) + "%")}
                ${simpleCard("Return %", returnPct.toFixed(2) + "%")}
                ${simpleCard("Net Realisation %", netRealisation.toFixed(2) + "%")}
                ${simpleCard("ASP", formatCurrency(asp))}
            </div>

            <div class="chart-grid">
                <div class="chart-card">
                    <div class="chart-title">Date Trend (Gross vs Net Revenue)</div>
                    <canvas id="trendChart"></canvas>
                </div>

                <div class="chart-card">
                    <div class="chart-title">Cancel vs Return</div>
                    <canvas id="splitChart"></canvas>
                </div>
            </div>

        </div>
    `;

    renderTrendChart(data.GMV);
    renderSplitChart(cancelRevenue, returnRevenue);
}

function sum(arr, key) {
    return arr.reduce((s, r) => s + Number(r[key] || 0), 0);
}

function card(title, revenue, units) {
    return `
        <div class="kpi-card">
            <div class="kpi-title">${title}</div>
            <div class="kpi-main">${formatCurrency(revenue)}</div>
            <div class="kpi-sub">${formatNumber(units)} units</div>
        </div>
    `;
}

function simpleCard(title, value) {
    return `
        <div class="kpi-card small">
            <div class="kpi-title">${title}</div>
            <div class="kpi-main">${value}</div>
        </div>
    `;
}

function renderTrendChart(data) {
    const ctx = document.getElementById('trendChart');

    const grossMap = {};
    const netMap = {};

    data.forEach(r => {
        const d = r["Order Date"];
        const g = Number(r.GMV || 0);
        const n = g - Number(r["Cancellation Amount"] || 0) - Number(r["Return Amount"] || 0);

        grossMap[d] = (grossMap[d] || 0) + g;
        netMap[d] = (netMap[d] || 0) + n;
    });

    const labels = Object.keys(grossMap).sort();
    const grossValues = labels.map(l => grossMap[l]);
    const netValues = labels.map(l => netMap[l]);

    if (trendChart) trendChart.destroy();

    trendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                { label: "Gross", data: grossValues, borderColor: "#999", tension: 0.3 },
                { label: "Net", data: netValues, borderColor: "#111", tension: 0.3 }
            ]
        },
        options: {
            plugins: { legend: { position: "bottom" } },
            scales: { y: { beginAtZero: true } }
        }
    });
}

function renderSplitChart(cancel, returns) {
    const ctx = document.getElementById('splitChart');

    if (splitChart) splitChart.destroy();

    splitChart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Cancel", "Return"],
            datasets: [{
                data: [cancel, returns],
                backgroundColor: ["#111", "#999"]
            }]
        },
        options: {
            plugins: { legend: { position: "bottom" } }
        }
    });
}
