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
  return `<label class="detail-width" data-demo-toolbar>容器宽度
    <input type="range" min="140" max="260" value="205" step="5">
    <output>205 px</output>
  </label>${compare("默认换行", "标题 balance · 正文 pretty", copy, copy.replace("detail-copy", "detail-copy detail-copy-balanced"))}`;
}

function renderOptical() {
  return `<button type="button" data-demo-toolbar data-guides aria-pressed="true">留白标记</button>
  ${compare("等距留白", "光学补偿",
    '<div class="detail-padding-sample"><span class="detail-play"><i aria-hidden="true"></i>播放预览</span><p>左 20 px · 右 20 px</p></div>',
    '<div class="detail-padding-sample"><span class="detail-play detail-play-optical"><i aria-hidden="true"></i>播放预览</span><p>左 14 px · 右 26 px</p></div>')}`;
}

function renderStagger() {
  return `<label class="detail-select" data-demo-toolbar>入场方式
    <span class="select-control"><select>
      <option value="block">整体</option><option value="groups">分组</option><option value="words">逐词</option>
    </select></span>
  </label>
  <button type="button" data-demo-toolbar data-replay>重播</button>
  <div class="stage detail-stage detail-entrance-stage"><article class="detail-entrance">
    <h3 lang="en">${heading.split(" ").map(word => `<span>${word}</span>`).join(" ")}</h3>
    <p lang="en">${description}</p>
    <div class="detail-entrance-actions"><span>查看案例</span><span>浏览目录</span></div>
  </article></div>`;
}

function renderShadows() {
  return `<label class="detail-select" data-demo-toolbar>背景
    <span class="select-control"><select>
      <option value="light">浅色</option><option value="dark">深色</option><option value="photo">照片</option>
    </select></span>
  </label>
  ${compare("固定色描边", "半透明阴影", '<span class="detail-surface detail-surface-border">消息设置</span>', '<span class="detail-surface detail-surface-shadow">消息设置</span>')}`;
}

function renderDrawer(alternate = false) {
  return `<div class="detail-drawer-viewport"><div class="detail-drawer${alternate ? " detail-drawer-alternate" : ""}">
    <strong>工作区</strong><span>概览</span><span>项目</span><span>设置</span>
  </div></div>`;
}

function renderMotionComparison(first, second, open) {
  return `<button type="button" data-demo-toolbar data-drawer-toggle aria-expanded="${open}">${open ? "关闭面板" : "打开面板"}</button>
    <div class="detail-drawer-comparison" data-open="${open}">
      ${compare(first, second, renderDrawer(), renderDrawer(true))}
    </div>`;
}

function renderRadius() {
  const sample = (adaptive) => `<figure class="detail-radius-sample">
    <div class="detail-radius-shell${adaptive ? " detail-radius-adaptive" : ""}"><div>内圆角 12 px</div></div>
    <figcaption>外圆角 <output>${adaptive ? 28 : 20}</output> px</figcaption>
  </figure>`;
  return `<label class="detail-width" data-demo-toolbar>内边距
    <input type="range" min="4" max="24" value="16"><output>16 px</output>
  </label>${compare("固定外圆角", "外圆角 = 内圆角 + 内边距", sample(false), sample(true))}`;
}

function renderCopyIcon() {
  const icons = `<span class="detail-copy-icons" aria-hidden="true">
    <svg viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>
    <svg viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></svg>
  </span>`;
  const variants = [["瞬切", "instant"], ["淡入淡出", "fade"], ["淡入淡出 + 缩放和模糊", "full"]];
  return `<button type="button" data-demo-toolbar data-copy-example>复制示例文本</button>
    <div class="stage detail-stage detail-icon-stage">
      <div class="detail-icon-options">${variants.map(([label, mode]) => `<div data-icon-mode="${mode}">${icons}<span>${label}</span></div>`).join("")}</div>
      <p class="detail-copy-status" role="status">示例文本 · UI Lab</p>
    </div>`;
}

const demos = {
  "concentric-radius": renderRadius,
  "contextual-copy-icon": renderCopyIcon,
  "responsive-text-wrap": renderWrap,
  "optical-button-padding": renderOptical,
  "staggered-entrance": renderStagger,
  "shadow-on-backgrounds": renderShadows,
  "interruptible-motion": () => renderMotionComparison("固定起点的关键帧", "可中断的 CSS 过渡", false),
  "subtle-drawer-exit": () => renderMotionComparison("完整滑出", "短距离淡出", true),
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
        status.textContent = "已复制 UI Lab";
        timer = setTimeout(() => {
          delete demo.dataset.copied;
          status.textContent = "示例文本 · UI Lab";
        }, 1600);
      } catch {
        delete demo.dataset.copied;
        status.textContent = "复制失败，请重试";
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
      toggle.textContent = open ? "关闭面板" : "打开面板";
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
