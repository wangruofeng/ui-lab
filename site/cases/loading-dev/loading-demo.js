import { t } from "../../app/locale.js";

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
      <span>${t("正在加载", "Loading")}</span>
    </div>
    <div class="loading-toolbar">
      ${renderOptions("loading-size", t("尺寸", "Size"), [[32, t("小", "Small")], [56, t("中", "Medium")], [84, t("大", "Large")]], 56)}
      ${renderOptions("loading-speed", t("速度", "Speed"), [[0.75, "0.75×"], [1, t("原速", "Normal")], [1.5, "1.5×"]], 1)}
      <button type="button" data-demo-toolbar data-loading-toggle>${t("播放", "Play")}</button>
      <button type="button" data-demo-toolbar data-loading-restart>${t("从头播放", "Restart")}</button>
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
    toggle.textContent = playing ? t("暂停", "Pause") : t("播放", "Play");
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
