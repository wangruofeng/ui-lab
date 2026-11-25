export function renderStageshowDemo(variant) {
  return `<div class="stageshow-preview" data-state="loading">
    <iframe class="stageshow-frame" data-src="./demos/stageshow-demo/?example=${encodeURIComponent(variant)}"
      title="Stageshow · ${variant}" height="460" sandbox="allow-scripts allow-same-origin" inert></iframe>
    <div class="stageshow-placeholder">
      <div class="stageshow-skeleton" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
      <p class="stageshow-status" role="status">正在加载演示…</p>
      <button class="demo-trigger" type="button" hidden>重试</button>
    </div>
  </div>`;
}

export function connectStageshowDemo(section) {
  const preview = section.querySelector(".stageshow-preview");
  const frame = preview.querySelector("iframe");
  const placeholder = preview.querySelector(".stageshow-placeholder");
  const status = preview.querySelector(".stageshow-status");
  const retry = preview.querySelector("button");
  let observer;
  let timeout;

  frame.addEventListener("load", () => {
    observer?.disconnect();
    const viewer = frame.contentDocument?.body;
    if (!viewer) return;
    observer = new ResizeObserver(() => {
      if (!frame.isConnected) {
        observer.disconnect();
        return;
      }
      const height = Math.ceil(viewer.getBoundingClientRect().height);
      if (height) frame.height = String(height);
    });
    observer.observe(viewer);
  });

  function finish(state) {
    clearTimeout(timeout);
    window.removeEventListener("message", receive);
    if (!frame.isConnected) return;

    preview.dataset.state = state;
    frame.inert = state !== "ready";
    retry.hidden = state !== "error";
    placeholder.inert = state === "ready";
    if (state === "error") status.textContent = "演示加载失败，请重试。";
  }

  function receive(event) {
    if (event.origin !== location.origin || event.source !== frame.contentWindow ||
        event.data?.type !== "ui-lab:stageshow-preview") return;
    finish(event.data.ready ? "ready" : "error");
  }

  function load() {
    preview.dataset.state = "loading";
    status.textContent = "正在加载演示…";
    retry.hidden = true;
    window.addEventListener("message", receive);
    timeout = setTimeout(() => finish("error"), 20000);
    frame.src = frame.dataset.src;
  }

  retry.addEventListener("click", load);
  load();
}
