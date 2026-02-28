let progressTimer = null;

export function initProgressBar() {
  const root = document.getElementById("progress-root");

  root.innerHTML = `
    <div class="progress-wrapper">
      <div class="progress-track">
        <div class="progress-fill" id="progress-fill"></div>
      </div>
    </div>
  `;
}

export function startProgress() {
  const fill = document.getElementById("progress-fill");
  if (!fill) return;

  let width = 5;
  fill.style.width = width + "%";

  progressTimer = setInterval(() => {
    if (width < 90) {
      width += 3;
      fill.style.width = width + "%";
    }
  }, 120);
}

export function finishProgress() {
  const fill = document.getElementById("progress-fill");
  if (!fill) return;

  clearInterval(progressTimer);

  fill.style.width = "100%";

  setTimeout(() => {
    fill.style.width = "0%";
  }, 400);
}
