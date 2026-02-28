import { formatCurrency, formatNumber } from '../core/utils.js';

export function renderExecutiveSummary(data) {
    const container = document.getElementById('executive-view');

    if (!data.GMV || data.GMV.length === 0) {
        container.innerHTML = "<p>No data available</p>";
        return;
    }

    const grossRevenue = data.GMV.reduce((sum, r) => sum + Number(r.GMV || 0), 0);
    const grossUnits = data.GMV.reduce((sum, r) => sum + Number(r["Gross Units"] || 0), 0);

    const cancelRevenue = data.GMV.reduce((sum, r) => sum + Number(r["Cancellation Amount"] || 0), 0);
    const cancelUnits = data.GMV.reduce((sum, r) => sum + Number(r["Cancellation Units"] || 0), 0);

    const returnRevenue = data.GMV.reduce((sum, r) => sum + Number(r["Return Amount"] || 0), 0);
    const returnUnits = data.GMV.reduce((sum, r) => sum + Number(r["Return Units"] || 0), 0);

    const netRevenue = grossRevenue - cancelRevenue - returnRevenue;
    const netUnits = grossUnits - cancelUnits - returnUnits;

    const cancelPct = grossRevenue ? (cancelRevenue / grossRevenue) * 100 : 0;
    const returnPct = grossRevenue ? (returnRevenue / grossRevenue) * 100 : 0;
    const netRealisation = grossRevenue ? (netRevenue / grossRevenue) * 100 : 0;
    const asp = netUnits ? netRevenue / netUnits : 0;

    container.innerHTML = `
        <div class="summary-row">
            ${createRevenueCard("Gross Sales", grossRevenue, grossUnits)}
            ${createRevenueCard("Cancellations", cancelRevenue, cancelUnits)}
            ${createRevenueCard("Returns", returnRevenue, returnUnits)}
            ${createRevenueCard("Net Sales", netRevenue, netUnits)}
        </div>

        <div class="summary-row secondary">
            ${createSimpleCard("Cancel %", cancelPct.toFixed(2) + "%")}
            ${createSimpleCard("Return %", returnPct.toFixed(2) + "%")}
            ${createSimpleCard("Net Realisation %", netRealisation.toFixed(2) + "%")}
            ${createSimpleCard("Avg Selling Price", formatCurrency(asp))}
        </div>
    `;
}

function createRevenueCard(title, revenue, units) {
    return `
        <div class="kpi-card">
            <div class="kpi-title">${title}</div>
            <div class="kpi-main">${formatCurrency(revenue)}</div>
            <div class="kpi-sub">${formatNumber(units)} units</div>
        </div>
    `;
}

function createSimpleCard(title, value) {
    return `
        <div class="kpi-card small">
            <div class="kpi-title">${title}</div>
            <div class="kpi-main">${value}</div>
        </div>
    `;
}
