export function initNavbar() {
  const root = document.getElementById("navbar-root");

  root.innerHTML = `
    <!-- Left: Logo -->
    <div>
      <img src="./assets/logo.png" class="app-logo" alt="Logo" />
    </div>

    <!-- Center: App Name -->
    <div class="app-title">
      PRODUCT PERFORMANCE DASHBOARD
    </div>

    <!-- Right: Domain Tabs -->
    <div class="nav-tabs">
      <div class="nav-tab active" data-domain="gmv">GMV</div>
      <div class="nav-tab" data-domain="ads">Ads</div>
      <div class="nav-tab" data-domain="traffic">Traffic</div>
      <div class="nav-tab" data-domain="transactions">Transactions</div>
    </div>
  `;

  const tabs = root.querySelectorAll(".nav-tab");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
    });
  });
}
