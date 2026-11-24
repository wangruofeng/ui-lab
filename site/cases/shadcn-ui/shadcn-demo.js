const minimumHeights = {
  "message-scroller": 540,
  "code-block": 320,
  trace: 420,
  "data-table": 460,
  chart: 400,
  combobox: 340,
  "date-picker": 440,
  "input-otp": 220,
  command: 390,
  questionnaire: 470,
  "context-menu": 430,
  resizable: 300,
};

export function renderShadcnDemo(variant) {
  if (variant === "attachment") {
    return `<iframe class="sc-attachment-frame" src="./demos/shadcn-attachment-demo/"
      title="shadcn/ui 官方 Attachment 组件演示" sandbox="allow-scripts allow-same-origin"></iframe>`;
  }
  return `<iframe class="sc-official-frame" src="./demos/shadcn-official-demo/?case=${encodeURIComponent(variant)}"
    data-case="${variant}" height="${minimumHeights[variant]}" title="shadcn/ui 官方 ${variant} 示例"
    sandbox="allow-scripts allow-same-origin allow-downloads allow-forms" allow="clipboard-write"></iframe>`;
}

export function connectShadcnDemo(section) {
  const frame = section.querySelector(".sc-official-frame");
  if (!frame) return;
  frame.addEventListener("load", () => {
    const preview = frame.contentDocument?.querySelector("#official-demo");
    if (!preview) return;
    const minimum = Number(frame.getAttribute("height"));
    const observer = new ResizeObserver(() => {
      if (!frame.isConnected) {
        observer.disconnect();
        return;
      }
      frame.style.height = `${Math.max(minimum, Math.ceil(preview.getBoundingClientRect().height) + 2)}px`;
    });
    observer.observe(preview);
  }, { once: true });
}
