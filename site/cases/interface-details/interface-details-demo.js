import { t } from "../../app/locale.js";

function compare(first, second, before, after = before) {
  return `<div class="pair">
    <section class="panel"><h3>${first}</h3><div class="stage detail-stage">${before}</div></section>
    <section class="panel"><h3>${second}</h3><div class="stage detail-stage">${after}</div></section>
  </div>`;
}

const heading = "Design for the moments people remember";
const description = "Small decisions make everyday tools easier to understand and use.";

function renderWrap() {
  const copy = `<article class="detail-copy" lang="en"><h4>${heading}</h4><p>${description}</p></article>`;
  return `<label class="detail-width" data-demo-toolbar>${t("容器宽度", "Container width")}
    <input type="range" min="140" max="260" value="205" step="5">
    <output>205 px</output>
  </label>${compare(t("默认换行", "Default wrapping"), t("标题 balance · 正文 pretty", "Heading: balance · Body: pretty"), copy, copy.replace("detail-copy", "detail-copy detail-copy-balanced"))}`;
}

function renderOptical() {
  return `<button type="button" data-demo-toolbar data-guides aria-pressed="true">${t("留白标记", "Padding guides")}</button>
  ${compare(t("等距留白", "Equal padding"), t("光学补偿", "Optical adjustment"),
    `<div class="detail-padding-sample"><span class="detail-play"><i aria-hidden="true"></i>${t("播放预览", "Play preview")}</span><p>${t("左 20 px · 右 20 px", "Left 20 px · Right 20 px")}</p></div>`,
    `<div class="detail-padding-sample"><span class="detail-play detail-play-optical"><i aria-hidden="true"></i>${t("播放预览", "Play preview")}</span><p>${t("左 14 px · 右 26 px", "Left 14 px · Right 26 px")}</p></div>`)}`;
}

function renderStagger() {
  return `<label class="detail-select" data-demo-toolbar>${t("入场方式", "Entrance style")}
    <span class="select-control"><select>
      <option value="block">${t("整体", "Single block")}</option><option value="groups">${t("分组", "By group")}</option><option value="words">${t("逐词", "Word by word")}</option>
    </select></span>
  </label>
  <button type="button" data-demo-toolbar data-replay>${t("重播", "Replay")}</button>
  <div class="stage detail-stage detail-entrance-stage"><article class="detail-entrance">
    <h3 lang="en">${heading.split(" ").map(word => `<span>${word}</span>`).join(" ")}</h3>
    <p lang="en">${description}</p>
    <div class="detail-entrance-actions"><span>${t("查看案例", "View case")}</span><span>${t("浏览目录", "Browse cases")}</span></div>
  </article></div>`;
}

function renderShadows() {
  return `<label class="detail-select" data-demo-toolbar>${t("背景", "Background")}
    <span class="select-control"><select>
      <option value="light">${t("浅色", "Light")}</option><option value="dark">${t("深色", "Dark")}</option><option value="photo">${t("照片", "Photo")}</option>
    </select></span>
  </label>
  ${compare(t("固定色描边", "Solid border"), t("半透明阴影", "Translucent shadow"), `<span class="detail-surface detail-surface-border">${t("消息设置", "Message settings")}</span>`, `<span class="detail-surface detail-surface-shadow">${t("消息设置", "Message settings")}</span>`)}`;
}

function renderDrawer(alternate = false) {
  return `<div class="detail-drawer-viewport"><div class="detail-drawer${alternate ? " detail-drawer-alternate" : ""}">
    <strong>${t("工作区", "Workspace")}</strong><span>${t("概览", "Overview")}</span><span>${t("项目", "Projects")}</span><span>${t("设置", "Settings")}</span>
  </div></div>`;
}

function renderMotionComparison(first, second, open) {
  return `<button type="button" data-demo-toolbar data-drawer-toggle aria-expanded="${open}">${open ? t("关闭面板", "Close panel") : t("打开面板", "Open panel")}</button>
    <div class="detail-drawer-comparison" data-open="${open}">
      ${compare(first, second, renderDrawer(), renderDrawer(true))}
    </div>`;
}

function renderRadius() {
  const sample = (adaptive) => `<figure class="detail-radius-sample">
    <div class="detail-radius-shell${adaptive ? " detail-radius-adaptive" : ""}"><div>${t("内圆角 12 px", "Inner radius: 12 px")}</div></div>
    <figcaption>${t("外圆角", "Outer radius:")} <output>${adaptive ? 28 : 20}</output> px</figcaption>
  </figure>`;
  return `<label class="detail-width" data-demo-toolbar>${t("内边距", "Padding")}
    <input type="range" min="4" max="24" value="16"><output>16 px</output>
  </label>${compare(t("固定外圆角", "Fixed outer radius"), t("外圆角 = 内圆角 + 内边距", "Outer radius = inner radius + padding"), sample(false), sample(true))}`;
}

function renderCopyIcon() {
  const icons = `<span class="detail-copy-icons" aria-hidden="true">
    <svg viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>
    <svg viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></svg>
  </span>`;
  const variants = [[t("瞬切", "Instant swap"), "instant"], [t("淡入淡出", "Crossfade"), "fade"], [t("淡入淡出 + 缩放和模糊", "Crossfade + scale and blur"), "full"]];
  return `<button type="button" data-demo-toolbar data-copy-example>${t("复制示例文本", "Copy sample text")}</button>
    <div class="stage detail-stage detail-icon-stage">
      <div class="detail-icon-options">${variants.map(([label, mode]) => `<div data-icon-mode="${mode}">${icons}<span>${label}</span></div>`).join("")}</div>
      <p class="detail-copy-status" role="status">${t("示例文本 · UI Lab", "Sample text · UI Lab")}</p>
    </div>`;
}

const demos = {
  "concentric-radius": renderRadius,
  "contextual-copy-icon": renderCopyIcon,
  "responsive-text-wrap": renderWrap,
  "optical-button-padding": renderOptical,
  "staggered-entrance": renderStagger,
  "shadow-on-backgrounds": renderShadows,
  "interruptible-motion": () => renderMotionComparison(t("固定起点的关键帧", "Fixed-start keyframes"), t("可中断的 CSS 过渡", "Interruptible CSS transition"), false),
  "subtle-drawer-exit": () => renderMotionComparison(t("完整滑出", "Full slide out"), t("短距离淡出", "Short fade out"), true),
};

export function renderInterfaceDetails(variant) {
  return `<section class="interface-details${variant === "optical-button-padding" ? " detail-show-guides" : ""}" data-detail-case="${variant}">${demos[variant]()}</section>`;
}

export function connectInterfaceDetails(section, variant) {
  const demo = section.querySelector(".interface-details");

  if (variant === "concentric-radius") {
    const input = demo.querySelector("input");
    const padding = demo.querySelector(".detail-width output");
    const outer = demo.querySelector(".detail-radius-adaptive + figcaption output");
    function update() {
      demo.style.setProperty("--detail-inset", `${input.value}px`);
      padding.value = `${input.value} px`;
      outer.value = String(input.valueAsNumber + 12);
    }
    input.addEventListener("input", update);
    update();
  }

  if (variant === "contextual-copy-icon") {
    const button = demo.querySelector("[data-copy-example]");
    const status = demo.querySelector("[role=status]");
    let timer;
    button.addEventListener("click", async () => {
      clearTimeout(timer);
      try {
        await navigator.clipboard.writeText("UI Lab");
        demo.dataset.copied = "";
        status.textContent = t("已复制 UI Lab", "Copied UI Lab");
        timer = setTimeout(() => {
          delete demo.dataset.copied;
          status.textContent = t("示例文本 · UI Lab", "Sample text · UI Lab");
        }, 1600);
      } catch {
        delete demo.dataset.copied;
        status.textContent = t("复制失败，请重试", "Copy failed. Try again.");
      }
    });
  }

  if (variant === "responsive-text-wrap") {
    const width = demo.querySelector("input");
    const output = demo.querySelector("output");
    width.addEventListener("input", () => {
      const value = `${width.value} px`;
      demo.style.setProperty("--detail-width", `${width.value}px`);
      output.value = value;
    });
  }

  if (variant === "optical-button-padding") {
    const button = demo.querySelector("[data-guides]");
    button.addEventListener("click", () => {
      button.setAttribute("aria-pressed", String(demo.classList.toggle("detail-show-guides")));
    });
  }

  if (variant === "staggered-entrance") {
    const select = demo.querySelector("select");
    const replay = demo.querySelector("[data-replay]");
    const content = demo.querySelector(".detail-entrance");
    let animations = [];
    function play() {
      animations.forEach(animation => animation.cancel());
      animations = [];
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const parts = select.value === "block" ? [content] : [...content.children];
      if (select.value === "words") parts.splice(0, 1, ...content.querySelectorAll("h3 span"));
      animations = parts.map((part, index) => part.animate([
        { opacity: 0, transform: "translateY(8px)", filter: "blur(4px)" },
        { opacity: 1, transform: "translateY(0)", filter: "blur(0)" },
      ], { duration: 420, delay: index * 80, fill: "backwards", easing: "ease-out" }));
    }
    select.addEventListener("change", play);
    replay.addEventListener("click", play);
  }

  const toggle = demo.querySelector("[data-drawer-toggle]");
  if (toggle) {
    const comparison = demo.querySelector(".detail-drawer-comparison");
    const drawer = comparison.querySelector(".detail-drawer");
    let animation;

    const panels = comparison.querySelectorAll(".detail-drawer");
    function setPanelsVisible(open) {
      panels.forEach(panel => panel.setAttribute("aria-hidden", String(!open)));
    }
    setPanelsVisible(comparison.dataset.open === "true");

    toggle.addEventListener("click", () => {
      const open = comparison.dataset.open !== "true";
      comparison.dataset.open = String(open);
      comparison.dataset.interacted = "";
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? t("关闭面板", "Close panel") : t("打开面板", "Open panel");
      setPanelsVisible(open);

      animation?.cancel();
      if (variant === "interruptible-motion" && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const positions = open ? ["-100%", "0%"] : ["0%", "-100%"];
        animation = drawer.animate(positions.map(x => ({ transform: `translateX(${x})` })), {
          duration: 600,
          easing: "ease-in-out",
        });
      }
    });
  }

  if (variant === "shadow-on-backgrounds") {
    const select = demo.querySelector("select");
    select.addEventListener("change", () => {
      demo.dataset.background = select.value;
    });
  }
}
