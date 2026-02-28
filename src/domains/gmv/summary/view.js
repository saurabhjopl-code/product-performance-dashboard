export function renderSummary(data) {
  const root = document.getElementById("executive-root");

  root.innerHTML = `
    <div class="section-header">
      <div class="section-title">GMV Executive Summary</div>
      <div class="section-subtitle">
        Performance Overview • ${data.month}
      </div>
    </div>

    <div class="summary-grid">
      <div class="summary-card">
        <div class="summary-label">Final Revenue</div>
        <div class="summary-value">₹ ${data.revenue.toLocaleString()}</div>
      </div>

      <div class="summary-card">
        <div class="summary-label">Final Units</div>
        <div class="summary-value">${data.units.toLocaleString()}</div>
      </div>

      <div class="summary-card">
        <div class="summary-label">GMV</div>
        <div class="summary-value">₹ ${data.gmv.toLocaleString()}</div>
      </div>
    </div>
  `;
}
