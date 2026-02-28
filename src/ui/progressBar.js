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
  bar.style.width = "20%";
}

export function finishProgress() {
  const bar = document.getElementById("progress-bar");
  bar.style.width = "100%";

  setTimeout(() => {
    bar.style.width = "0%";
  }, 400);
}
