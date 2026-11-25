import { t } from "../../app/locale.js";

import {
  installMotionExamples,
  renderMotionExample,
} from "./motion-primitives-examples.js";

export { motionPrimitivesCategories } from "./motion-primitives-cases.js";

const image = `<img data-fade-on-load src="./assets/mountains.jpg" alt="${t("远山与蜿蜒的河流", "Distant mountains and a winding river")}">`;
const closeButton =
  `<button type="button" class="motion-close" data-motion-action="close">${t("关闭", "Close")}</button>`;

function renderDialog() {
  return `<div class="motion-frame motion-frame--dialog">
    <button type="button" class="motion-dialog-card motion-origin" data-motion-action="open" aria-expanded="false" aria-haspopup="dialog">
      ${image}<span>${t("山谷步道", "Valley Trail")}</span>
    </button>
    <button type="button" class="motion-scrim" data-motion-action="close" aria-label="${t("关闭详情", "Close details")}" tabindex="-1" hidden></button>
    <section class="motion-layer motion-route-detail" role="dialog" aria-label="${t("山谷步道详情", "Valley Trail details")}" hidden>
      ${image}
      <div><strong>${t("山谷步道", "Valley Trail")}</strong><p>${t("全程 2.8 km · 约 45 分钟", "2.8 km · About 45 minutes")}</p></div>
      ${closeButton}
    </section>
  </div>`;
}

function renderPopover() {
  return `<div class="motion-frame motion-frame--popover">
    <button type="button" class="motion-origin motion-action" data-motion-action="open" aria-expanded="false">${t("添加备注", "Add note")}</button>
    <section class="motion-layer motion-note-layer" role="dialog" aria-label="${t("编辑行程备注", "Edit trip note")}" hidden>
      <label>${t("行程备注", "Trip note")}<textarea rows="2" placeholder="${t("写一句提醒…", "Write a reminder…")}"></textarea></label>
      <div class="motion-note-actions">${closeButton}<button type="button" class="motion-action" data-motion-action="save">${t("保存", "Save")}</button></div>
    </section>
    <p class="motion-saved" role="status"></p>
  </div>`;
}

const periods = [
  [t("日", "Day"), "126", [31, 49, 36, 68, 54, 72, 65]],
  [t("周", "Week"), "842", [18, 39, 57, 35, 63, 81, 70]],
  [t("月", "Month"), "3,269", [46, 37, 32, 51, 62, 58, 86]],
];

function renderBackground() {
  return `<div class="motion-frame motion-frame--switch">
    <div class="motion-options" role="group" aria-label="${t("统计周期", "Time range")}">
      <span class="motion-indicator" aria-hidden="true"></span>
      ${periods.map(([label], index) => `<button type="button" data-motion-index="${index}" aria-pressed="${index === 0}">${label}</button>`).join("")}
    </div>
    <div class="motion-chart-summary" role="status">${t("近一日访问 ·", "Past day visits ·")} <strong>126</strong></div>
    <div class="motion-bars" aria-hidden="true">${periods[0][2].map((height) => `<i style="--bar:${height}%"></i>`).join("")}</div>
  </div>`;
}

const scenarios = {
  "morphing-dialog": {
    render: renderDialog,
    notes: [
      t("点开卡片，详情直接出现在预览中央。", "Select the card to open its details in the center of the preview."),
      t("点开卡片，详情沿着卡片的位置和尺寸展开。", "Select the card to see its details expand from the card’s position and size."),
    ],
  },
  "morphing-popover": {
    render: renderPopover,
    notes: [
      t("点「添加备注」，编辑区会直接出现。", "Select Add note to open the editor immediately."),
      t("点「添加备注」，编辑区从按钮的位置展开。", "Select Add note to expand the editor from the button."),
    ],
  },
  "animated-background": {
    render: renderBackground,
    notes: [
      t("切换日、周、月，选中底色会直接跳到新选项。", "Switch between Day, Week, and Month to see the highlight jump to the new option."),
      t("切换日、周、月，同一块底色会滑到新选项。", "Switch between Day, Week, and Month to see the shared highlight slide to the new option."),
    ],
  },
};

export function renderMotionPrimitives(item, after) {
  const { id, scene } = item;
  if (!scenarios[id]) return renderMotionExample(item, after);
  const { render, notes } = scenarios[id];
  return `<article class="widget motion-demo motion-demo--${id}" data-motion-demo>
    <h4>${scene}</h4>${render()}<p class="motion-note">${notes[Number(after)]}</p>
  </article>`;
}

const runningAnimation = new WeakMap();

function changeOverlay(demo, opening) {
  const origin = demo.querySelector(".motion-origin");
  const panel = demo.querySelector(".motion-layer");
  const scrim = demo.querySelector(".motion-scrim");
  const current = opening ? origin : panel;
  const target = opening ? panel : origin;
  const from = current.getBoundingClientRect();
  runningAnimation.get(demo)?.cancel();

  demo.classList.toggle("is-open", opening);
  panel.hidden = !opening;
  if (scrim) scrim.hidden = !opening;
  origin.setAttribute("aria-expanded", String(opening));

  if (
    demo.closest(".improved") &&
    (opening || !demo.classList.contains("motion-demo--morphing-popover")) &&
    !matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    const to = target.getBoundingClientRect();
    runningAnimation.set(
      demo,
      target.animate(
        [
          {
            transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})`,
            transformOrigin: "top left",
          },
          { transform: "none", transformOrigin: "top left" },
        ],
        { duration: 320, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
      ),
    );
  }
  const focusTarget = opening
    ? panel.querySelector("textarea, .motion-close")
    : origin;
  focusTarget.focus({ preventScroll: true });
}

function selectPeriod(demo, index) {
  const options = demo.querySelector(".motion-options");
  const [label, count, bars] = periods[index];
  options.style.setProperty("--motion-index", index);
  for (const button of options.querySelectorAll("button")) {
    button.setAttribute(
      "aria-pressed",
      String(Number(button.dataset.motionIndex) === index),
    );
  }
  const summary = demo.querySelector(".motion-chart-summary");
  summary.firstChild.textContent = t(`近一${label}访问 · `, `Past ${label.toLowerCase()} visits · `);
  summary.querySelector("strong").textContent = count;
  demo
    .querySelectorAll(".motion-bars i")
    .forEach((bar, index) => bar.style.setProperty("--bar", `${bars[index]}%`));
}

export function installMotionPrimitives(main) {
  installMotionExamples(main);
  main.addEventListener("click", (event) => {
    const demo = event.target.closest("[data-motion-demo]");
    if (!demo) return;
    const option = event.target.closest("[data-motion-index]");
    if (option) {
      selectPeriod(demo, Number(option.dataset.motionIndex));
      return;
    }
    const action = event.target.closest("[data-motion-action]")?.dataset
      .motionAction;
    if (action === "open") changeOverlay(demo, true);
    else if (action === "close" && demo.classList.contains("is-open"))
      changeOverlay(demo, false);
    else if (action === "save") {
      const input = demo.querySelector("textarea");
      const saved = demo.querySelector(".motion-saved");
      const text = input.value.trim();
      if (!text) {
        input.focus();
        return;
      }
      saved.textContent = `${t("备注：", "Note: ")}${text}`;
      demo.querySelector(".motion-origin").textContent = t("编辑备注", "Edit note");
      changeOverlay(demo, false);
    } else if (
      demo.classList.contains("is-open") &&
      !event.target.closest(".motion-layer")
    ) {
      changeOverlay(demo, false);
    }
  });
  main.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const demo = event.target.closest("[data-motion-demo].is-open");
    if (!demo) return;
    event.preventDefault();
    changeOverlay(demo, false);
  });
}
