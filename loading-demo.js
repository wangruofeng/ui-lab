import { loadingSpinners } from "./loading-dev-spinners.js";

function renderOptions(name, label, options, selected) {
  return `<div class="loading-option-group" role="radiogroup" aria-labelledby="${name}-label">
    <span class="loading-option-label" id="${name}-label">${label}</span>
    <div class="loading-segments">
      ${options.map(([value, text]) => `<label>
        <input type="radio" name="${name}" value="${value}" ${value === selected ? "checked" : ""}>
        <span>${text}</span>
      </label>`).join("")}
    </div>
  </div>`;
}

export function renderLoadingDemo(variant) {
  const { duration, markup } = loadingSpinners[variant];
  return `
    <div class="loading-stage">
      <div class="loading-shape" data-duration="${duration}" aria-hidden="true">${markup}</div>
      <span>正在加载</span>
    </div>
    <div class="loading-toolbar">
      ${renderOptions("loading-size", "尺寸", [[32, "小"], [56, "中"], [84, "大"]], 56)}
      ${renderOptions("loading-speed", "速度", [[0.75, "0.75×"], [1, "原速"], [1.5, "1.5×"]], 1)}
      <button type="button" data-demo-toolbar data-loading-toggle>播放</button>
      <button type="button" data-demo-toolbar data-loading-restart>从头播放</button>
    </div>`;
}

export function connectLoadingDemo(section) {
  const shape = section.querySelector(".loading-shape");
  const indicator = shape.lastElementChild;
  const toolbar = section.querySelector(".loading-toolbar");
  const toggle = section.querySelector("[data-loading-toggle]");
  const restart = section.querySelector("[data-loading-restart]");
  let playing;

  function setPlaying(next) {
    playing = next;
    indicator.style.setProperty("--ld-play-state", playing ? "running" : "paused");
    toggle.textContent = playing ? "暂停" : "播放";
  }

  setPlaying(!matchMedia("(prefers-reduced-motion: reduce)").matches);
  toolbar.addEventListener("change", ({ target }) => {
    if (target.name === "loading-size") {
      indicator.style.setProperty("--ld-size", `${target.value}px`);
    } else if (target.name === "loading-speed") {
      indicator.style.setProperty("--ld-duration", `${Number(shape.dataset.duration) / Number(target.value)}ms`);
    }
  });
  toggle.addEventListener("click", () => setPlaying(!playing));
  restart.addEventListener("click", () => {
    for (const animation of indicator.getAnimations({ subtree: true })) {
      animation.currentTime = 0;
    }
    setPlaying(true);
  });
}
