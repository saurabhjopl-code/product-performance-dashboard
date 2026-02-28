let chartInstance = null;

export function renderTrendChart(data) {
  const ctx = document.getElementById("trendChart");
  if (!ctx || !data) return;

  if (chartInstance) {
    chartInstance.destroy();
  }

  const labels = data.map(d => d["Order Date"]);
  const gross = data.map(d => Number(d["GMV"] || 0));
  const cancel = data.map(d => Number(d["Cancel Units"] || 0));
  const returns = data.map(d => Number(d["Return Units"] || 0));
  const net = data.map(d => Number(d["Final Revenue"] || 0));

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Gross Sales",
          data: gross,
          borderWidth: 2
        },
        {
          label: "Cancellations",
          data: cancel,
          borderWidth: 2
        },
        {
          label: "Returns",
          data: returns,
          borderWidth: 2
        },
        {
          label: "Net Sales",
          data: net,
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top"
        }
      }
    }
  });
}
