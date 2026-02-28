import { renderTrendChart } from "./trendChart.js";

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
        <div class="summary-label">Gross Sales</div>
        <div class="summary-value">
          ₹ ${formatNumber(data.grossSales)}
          <span class="units">(${formatNumber(data.grossUnits)} units)</span>
        </div>
      </div>

      <div class="summary-card">
        <div class="summary-label">Cancellations</div>
        <div class="summary-value">
          ₹ ${formatNumber(data.cancelRevenue)}
          <span class="units">(${formatNumber(data.cancelUnits)} units)</span>
        </div>
        <div class="percent">${data.cancelPercent}%</div>
      </div>

      <div class="summary-card">
        <div class="summary-label">Returns</div>
        <div class="summary-value">
          ₹ ${formatNumber(data.returnRevenue)}
          <span class="units">(${formatNumber(data.returnUnits)} units)</span>
        </div>
        <div class="percent">${data.returnPercent}%</div>
      </div>

      <div class="summary-card">
        <div class="summary-label">Net Sales</div>
        <div class="summary-value">
          ₹ ${formatNumber(data.netRevenue)}
          <span class="units">(${formatNumber(data.netUnits)} units)</span>
        </div>
      </div>

    </div>

    <div style="margin-top:40px;">
      <canvas id="trendChart"></canvas>
    </div>
  `;

  renderTrendChart(data.dateWiseData);
}

function formatNumber(num) {
  if (num >= 10000000) return (num / 10000000).toFixed(2) + "Cr";
  if (num >= 100000) return (num / 100000).toFixed(2) + "L";
  if (num >= 1000) return (num / 1000).toFixed(2) + "K";
  return num.toLocaleString();
}
