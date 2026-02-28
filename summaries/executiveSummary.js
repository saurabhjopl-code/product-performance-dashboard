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

    container.innerHTML = `
        <div class="summary-row">
            ${createCard("Gross Sales", grossRevenue, grossUnits)}
            ${createCard("Cancellations", cancelRevenue, cancelUnits)}
            ${createCard("Returns", returnRevenue, returnUnits)}
            ${createCard("Net Sales", netRevenue, netUnits)}
        </div>
    `;
}

function createCard(title, revenue, units) {
    return `
        <div class="kpi-card">
            <div class="kpi-title">${title}</div>
            <div class="kpi-main">${formatCurrency(revenue)}</div>
            <div class="kpi-sub">${formatNumber(units)} units</div>
        </div>
    `;
}
