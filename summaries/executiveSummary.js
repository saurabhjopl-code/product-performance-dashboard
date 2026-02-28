import { createSummaryCard } from '../components/summaryCard.js';
import { formatCurrency, formatNumber } from '../core/utils.js';

export function renderExecutiveSummary(data) {
    const container = document.getElementById('summary');

    if (!data.GMV) {
        container.innerHTML = "<p>Please update sheet links in config/sheets.js</p>";
        return;
    }

    const totalGMV = data.GMV.reduce((sum, row) => sum + Number(row.GMV || 0), 0);
    const totalFinalRevenue = data.GMV.reduce((sum, row) => sum + Number(row['Final Sale Amount'] || 0), 0);

    container.innerHTML = `
        <div class="summary-grid">
            ${createSummaryCard("Total GMV", formatCurrency(totalGMV))}
            ${createSummaryCard("Final Revenue", formatCurrency(totalFinalRevenue))}
            ${createSummaryCard("Total Units", formatNumber(data.GMV.length))}
        </div>
    `;
}
