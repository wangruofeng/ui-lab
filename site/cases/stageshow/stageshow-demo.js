export function renderStageshowDemo(variant) {
  return `<iframe class="stageshow-frame" src="./demos/stageshow-demo/?example=${encodeURIComponent(variant)}"
    title="Stageshow · ${variant}" height="460" sandbox="allow-scripts allow-same-origin"></iframe>`;
}

export function connectStageshowDemo(section) {
  const frame = section.querySelector(".stageshow-frame");

  function fit() {
    const viewer = frame.contentDocument?.body;
    if (!viewer) return;
    const observer = new ResizeObserver(() => {
      if (!frame.isConnected) {
        observer.disconnect();
        return;
      }
      const height = Math.ceil(viewer.getBoundingClientRect().height);
      if (height) frame.height = String(height);
    });
    observer.observe(viewer);
  }

  frame.addEventListener("load", fit);
}
