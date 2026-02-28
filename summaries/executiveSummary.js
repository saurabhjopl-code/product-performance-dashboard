import { formatCurrency, formatNumber } from '../core/utils.js';

let trendChart = null;
let splitChart = null;

export function renderExecutiveSummary(data) {
    const container = document.getElementById('executive-view');

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

    const currentMonth = document.getElementById("filter-month").value;
    const previousMonth = getPreviousMonth(currentMonth);

    const prevMonthData = data.GMV.filter(r =>
        r["Order Date"].startsWith(previousMonth)
    );

    const prevNetRevenue =
        sum(prevMonthData, "GMV") -
        sum(prevMonthData, "Cancellation Amount") -
        sum(prevMonthData, "Return Amount");

    const momChange = prevNetRevenue
        ? ((netRevenue - prevNetRevenue) / prevNetRevenue) * 100
        : 0;

    container.innerHTML = `
        <div class="summary-row">
            ${card("Gross Sales", grossRevenue, grossUnits)}
            ${card("Cancellations", cancelRevenue, cancelUnits)}
            ${card("Returns", returnRevenue, returnUnits)}
            ${card("Net Sales", netRevenue, netUnits)}
        </div>

        <div class="summary-row secondary">
            ${simpleCard("MoM Change (Net)", momChange.toFixed(2) + "%")}
        </div>

        <div class="chart-grid">
            <div class="chart-card">
                <div class="chart-title">Date Trend (Net Revenue)</div>
                <canvas id="trendChart"></canvas>
            </div>

            <div class="chart-card">
                <div class="chart-title">Cancel vs Return</div>
                <canvas id="splitChart"></canvas>
            </div>
        </div>
    `;

    renderTrendChart(data.GMV);
    renderSplitChart(cancelRevenue, returnRevenue);
}

/* Helpers */

function sum(arr, key) {
    return arr.reduce((s, r) => s + Number(r[key] || 0), 0);
}

function getPreviousMonth(month) {
    const date = new Date(month + "-01");
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().slice(0,7);
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

/* Charts */

function renderTrendChart(data) {
    const ctx = document.getElementById('trendChart');

    const grouped = {};
    data.forEach(r => {
        const date = r["Order Date"];
        const net =
            Number(r.GMV || 0) -
            Number(r["Cancellation Amount"] || 0) -
            Number(r["Return Amount"] || 0);

        grouped[date] = (grouped[date] || 0) + net;
    });

    const labels = Object.keys(grouped).sort();
    const values = labels.map(l => grouped[l]);

    if (trendChart) trendChart.destroy();

    trendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                data: values,
                borderColor: '#111',
                backgroundColor: 'rgba(0,0,0,0.05)',
                tension: 0.3
            }]
        },
        options: {
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });
}

function renderSplitChart(cancel, returns) {
    const ctx = document.getElementById('splitChart');

    if (splitChart) splitChart.destroy();

    splitChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Cancel', 'Return'],
            datasets: [{
                data: [cancel, returns],
                backgroundColor: ['#111', '#999']
            }]
        },
        options: {
            plugins: { legend: { position: 'bottom' } }
        }
    });
}
