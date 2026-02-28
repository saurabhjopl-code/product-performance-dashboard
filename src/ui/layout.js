export function initLayout() {
  const executive = document.getElementById("executive-root");
  const reports = document.getElementById("reports-root");

  executive.innerHTML = `
    <div class="grid grid-4" id="executive-cards"></div>
    <div id="executive-charts" style="margin-top:32px;"></div>
  `;

  reports.innerHTML = `
    <div id="reports-content"></div>
  `;
}
