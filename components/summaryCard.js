export function createSummaryCard(title, value) {
    return `
        <div class="summary-card">
            <div class="summary-title">${title}</div>
            <div class="summary-value">${value}</div>
        </div>
    `;
}
