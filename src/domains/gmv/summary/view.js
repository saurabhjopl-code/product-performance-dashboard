export function renderSummary(data) {
  const root = document.getElementById("executive-cards");

  root.innerHTML = `
    <div class="card">
      <h4>Final Revenue</h4>
      <h2>₹ ${data.revenue.toLocaleString()}</h2>
    </div>

    <div class="card">
      <h4>Final Units</h4>
      <h2>${data.units.toLocaleString()}</h2>
    </div>

    <div class="card">
      <h4>GMV</h4>
      <h2>₹ ${data.gmv.toLocaleString()}</h2>
    </div>
  `;
}
