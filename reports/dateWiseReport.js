import { formatCurrency, formatNumber } from '../core/utils.js';

export function renderDateWiseReport(data) {

    const container = document.getElementById('report-content');

    if (!data.GMV || data.GMV.length === 0) {
        container.innerHTML = "<p>No data available</p>";
        return;
    }

    const grouped = {};

    data.GMV.forEach(r => {
        const date = r["Order Date"];

        if (!grouped[date]) {
            grouped[date] = {
                grossRevenue: 0,
                cancelRevenue: 0,
                returnRevenue: 0,
                grossUnits: 0,
                cancelUnits: 0,
                returnUnits: 0
            };
        }

        grouped[date].grossRevenue += Number(r.GMV || 0);
        grouped[date].cancelRevenue += Number(r["Cancellation Amount"] || 0);
        grouped[date].returnRevenue += Number(r["Return Amount"] || 0);

        grouped[date].grossUnits += Number(r["Gross Units"] || 0);
        grouped[date].cancelUnits += Number(r["Cancellation Units"] || 0);
        grouped[date].returnUnits += Number(r["Return Units"] || 0);
    });

    const rows = Object.keys(grouped).sort().map(date => {
        const g = grouped[date];
        const netRevenue = g.grossRevenue - g.cancelRevenue - g.returnRevenue;
        const netUnits = g.grossUnits - g.cancelUnits - g.returnUnits;

        return `
            <tr>
                <td>${date}</td>
                <td>${formatCurrency(g.grossRevenue)}</td>
                <td>${formatCurrency(g.cancelRevenue)}</td>
                <td>${formatCurrency(g.returnRevenue)}</td>
                <td>${formatCurrency(netRevenue)}</td>
                <td>${formatNumber(g.grossUnits)}</td>
                <td>${formatNumber(g.cancelUnits)}</td>
                <td>${formatNumber(g.returnUnits)}</td>
                <td>${formatNumber(netUnits)}</td>
            </tr>
        `;
    }).join("");

    container.innerHTML = `
        <div class="report-table-wrapper">
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Gross Rev</th>
                        <th>Cancel Rev</th>
                        <th>Return Rev</th>
                        <th>Net Rev</th>
                        <th>Gross Units</th>
                        <th>Cancel Units</th>
                        <th>Return Units</th>
                        <th>Net Units</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        </div>
    `;
}
