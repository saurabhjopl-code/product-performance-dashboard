export function initProgressBar() {
  const root = document.getElementById("progress-root");

  root.innerHTML = `
    <div class="progress-container">
      <div class="progress-bar" id="progress-bar"></div>
    </div>
  `;
}

export function setProgress(value) {
  const bar = document.getElementById("progress-bar");
  if (!bar) return;
  bar.style.width = value + "%";
}
