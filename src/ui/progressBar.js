let progressInterval = null;

export function initProgressBar() {
  const root = document.getElementById("progress-root");

  root.innerHTML = `
    <div class="progress-container">
      <div class="progress-bar" id="progress-bar"></div>
    </div>
  `;
}

export function startProgress() {
  const bar = document.getElementById("progress-bar");
  if (!bar) return;

  let width = 0;
  bar.style.width = "0%";

  progressInterval = setInterval(() => {
    if (width < 85) {
      width += 5;
      bar.style.width = width + "%";
    }
  }, 100);
}

export function finishProgress() {
  const bar = document.getElementById("progress-bar");
  if (!bar) return;

  clearInterval(progressInterval);
  bar.style.width = "100%";

  setTimeout(() => {
    bar.style.width = "0%";
  }, 400);
}
