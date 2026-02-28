import { formatCurrency, formatNumber } from '../core/utils.js';

export function renderDateWiseReport(data) {

    const container = document.getElementById('report-content');
    container.innerHTML = "";

    if (!data || !data.GMV || data.GMV.length === 0) {
        container.innerHTML = "<p>No data available</p>";
        return;
    }

    const grouped = {};

    data.GMV.forEach(r => {
        const date = r["Order Date"];

        if (!grouped[date]) {
            grouped[date] = {
                grossUnits: 0,
                grossRevenue: 0,
                cancelUnits: 0,
                cancelRevenue: 0,
                returnUnits: 0,
                returnRevenue: 0
            };
        }

        grouped[date].grossUnits += Number(r["Gross Units"] || 0);
        grouped[date].grossRevenue += Number(r.GMV || 0);
        grouped[date].cancelUnits += Number(r["Cancellation Units"] || 0);
        grouped[date].cancelRevenue += Number(r["Cancellation Amount"] || 0);
        grouped[date].returnUnits += Number(r["Return Units"] || 0);
        grouped[date].returnRevenue += Number(r["Return Amount"] || 0);
    });

    const rows = Object.keys(grouped).sort().map(date => {

        const g = grouped[date];

        const netUnits = g.grossUnits - g.cancelUnits - g.returnUnits;
        const netRevenue = g.grossRevenue - g.cancelRevenue - g.returnRevenue;

        return `
            <tr>
                <td>${date}</td>
                <td>${formatNumber(g.grossUnits)}</td>
                <td>${formatCurrency(g.grossRevenue)}</td>
                <td>${formatNumber(g.cancelUnits)}</td>
                <td>${formatCurrency(g.cancelRevenue)}</td>
                <td>${formatNumber(g.returnUnits)}</td>
                <td>${formatCurrency(g.returnRevenue)}</td>
                <td>${formatNumber(netUnits)}</td>
                <td>${formatCurrency(netRevenue)}</td>
            </tr>
        `;
    }).join("");

    container.innerHTML = `
        <div class="report-table-wrapper">
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Gross Units</th>
                        <th>Gross Rev</th>
                        <th>Cancel Units</th>
                        <th>Cancel Rev</th>
                        <th>Return Units</th>
                        <th>Return Rev</th>
                        <th>Net Units</th>
                        <th>Net Rev</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        </div>
    `;
}
