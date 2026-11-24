import { connectSlidingTabs } from "../../app/sliding-tabs.js";

const ease = "cubic-bezier(.22,1,.36,1)";

function animate(element, frames, duration, fill = "none") {
  element.getAnimations().forEach(animation => animation.cancel());
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  return element.animate(frames, { duration, fill, easing: ease });
}

function previewToggle({ label, name, variant, content }) {
  return {
    markup: `<div class="tn-preview tn-preview--${variant}" id="tn-preview-${variant}" role="img" aria-label="${name}" data-open="true">
      ${content}
    </div>
    <button type="button" data-demo-toolbar aria-expanded="true" aria-controls="tn-preview-${variant}">${label}</button>`,
    connect(stage) {
      const button = stage.querySelector("[data-demo-toolbar]");
      const surface = stage.querySelector(".tn-preview");

      function setOpen(open) {
        button.setAttribute("aria-expanded", String(open));
        surface.setAttribute("aria-hidden", String(!open));
        surface.dataset.open = String(open);
      }

      function closeOnEscape(event) {
        if (event.key === "Escape") setOpen(false);
      }

      button.addEventListener("click", () => setOpen(surface.dataset.open !== "true"));
      button.addEventListener("keydown", closeOnEscape);
      stage.addEventListener("keydown", closeOnEscape);
    },
  };
}

const gooeyActions = [
  { label: "新建文件", x: -54, y: -34, icon: '<path d="M9 2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V6L9 2v4h4"/>' },
  { label: "添加图片", x: 0, y: -64, icon: '<rect x="2" y="2" width="12" height="12" rx="2"/><circle cx="6" cy="6" r="1"/><path d="m3 12 3-3 2 2 2-3 3 3"/>' },
  { label: "新建文件夹", x: 54, y: -34, icon: '<path d="M2 11.5v-7A1.5 1.5 0 0 1 3.5 3H6l2 2h4.5A1.5 1.5 0 0 1 14 6.5v5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 11.5Z"/>' },
];

const gooeyPosition = ({ x, y }, index) =>
  `style="--goo-x:${x}px; --goo-y:${y}px; --goo-delay:${index * 40}ms"`;

const gooeyMenu = {
  markup: `<div class="tn-gooey" data-open="false">
    <svg class="tn-gooey-surface" viewBox="0 0 200 180" aria-hidden="true">
      <defs><filter id="tn-gooey-merge" x="-50%" y="-70%" width="200%" height="240%" color-interpolation-filters="sRGB">
        <feGaussianBlur stdDeviation="6" result="soft"/>
        <feComponentTransfer in="soft" result="joined"><feFuncA type="linear" slope="18" intercept="-7"/></feComponentTransfer>
        <feComposite in="SourceGraphic" in2="joined" operator="atop"/>
      </filter></defs>
      <g filter="url(#tn-gooey-merge)">
        ${gooeyActions.map((action, index) => `<circle class="tn-gooey-satellite" cx="100" cy="90" r="20" ${gooeyPosition(action, index)}/>`).join("")}
        <circle cx="100" cy="90" r="20"/>
      </g>
    </svg>
    <button class="tn-gooey-trigger" type="button" aria-label="打开菜单" aria-expanded="false" aria-controls="tn-gooey-actions">
      <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 4v12M4 10h12"/></svg>
    </button>
    <div id="tn-gooey-actions" role="group" aria-label="快捷操作" inert>
      ${gooeyActions.map((action, index) => `<button class="tn-gooey-satellite" type="button" aria-label="${action.label}" ${gooeyPosition(action, index)}>
        <svg viewBox="0 0 16 16" aria-hidden="true">${action.icon}</svg>
      </button>`).join("")}
    </div>
  </div>`,
  connect(stage) {
    const shell = stage.querySelector(".tn-gooey");
    const trigger = shell.querySelector(".tn-gooey-trigger");
    const actions = shell.querySelector("#tn-gooey-actions");

    function setOpen(open, restoreFocus = false) {
      if ((shell.dataset.open === "true") === open) return;
      shell.dataset.open = String(open);
      trigger.setAttribute("aria-expanded", String(open));
      trigger.setAttribute("aria-label", open ? "关闭菜单" : "打开菜单");
      if (open || restoreFocus) trigger.focus();
      actions.inert = !open;
      if (open) shell.getAnimations().forEach(effect => effect.cancel());
      else animate(shell, [
        { translate: "0 0" },
        { translate: "0 5px", offset: .3 },
        { translate: "0 0" },
      ], 700);
    }

    trigger.addEventListener("click", () => setOpen(shell.dataset.open !== "true"));
    actions.addEventListener("click", event => {
      if (event.target.closest("button")) setOpen(false, true);
    });
    stage.addEventListener("click", event => {
      if (!shell.contains(event.target)) setOpen(false);
    });
    shell.addEventListener("focusout", event => {
      if (!shell.contains(event.relatedTarget)) setOpen(false);
    });
    shell.addEventListener("keydown", event => {
      if (event.key === "Escape" && shell.dataset.open === "true") {
        event.preventDefault();
        setOpen(false, true);
      }
    });
  },
};

const morphMenu = {
  markup: `<div class="tn-morph-anchor">
    <div class="tn-menu-morph" data-open="false">
      <div class="tn-menu-actions" id="tn-menu-actions" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
      <button type="button" class="tn-menu-trigger" aria-expanded="false" aria-controls="tn-menu-actions" aria-label="打开菜单">
        <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 4v12M4 10h12"/></svg>
      </button>
    </div>
  </div>`,
  connect(stage) {
    const shell = stage.querySelector(".tn-menu-morph");
    const trigger = shell.querySelector(".tn-menu-trigger");
    const isOpen = () => shell.dataset.open === "true";
    let settle;

    function setOpen(open) {
      if (open === isOpen()) return;
      shell.dataset.open = String(open);
      trigger.setAttribute("aria-expanded", String(open));
      trigger.setAttribute("aria-label", open ? "关闭菜单" : "打开菜单");
      if (open) {
        settle?.cancel();
        trigger.focus({ preventScroll: true });
      } else if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
        settle = shell.animate([
          { translate: "0 0" },
          { translate: "5px 5px", offset: .35 },
          { translate: "0 0" },
        ], { duration: 700, easing: ease });
      }
    }

    trigger.addEventListener("click", () => setOpen(!isOpen()));
    stage.addEventListener("click", event => {
      if (!trigger.contains(event.target)) setOpen(false);
    });
    trigger.addEventListener("blur", () => setOpen(false));
    trigger.addEventListener("keydown", event => {
      if (event.key === "Escape" && isOpen()) {
        event.preventDefault();
        setOpen(false);
      }
    });
  },
};

const pageTokens = [
  ["Ethereum", "ETH", '<path d="m8 0 5 8-5 3-5-3Zm-5 9 5 3 5-3-5 7Z"/>'],
  ["Avalanche", "AVAX", '<path d="m7 2-5 9a1 1 0 0 0 1 2h4l3-5-2-6a.6.6 0 0 0-1 0Zm4 7-2 4h5a.7.7 0 0 0 .6-1l-2-3a1 1 0 0 0-1.6 0Z"/>'],
  ["BNB", "BNB", '<path d="m8 1 4 4-1.5 1.5L8 4 5.5 6.5 4 5Zm-6 5 2 2-2 2-2-2Zm12 0 2 2-2 2-2-2ZM8 6l2 2-2 2-2-2Zm-4 5 1.5-1.5L8 12l2.5-2.5L12 11l-4 4Z"/>'],
];

const successCheck = {
  markup: `<div class="tn-check" data-open="false" aria-hidden="true">
      <svg viewBox="0 0 24 24"><path pathLength="1" d="m8.64 12.48 2.24 2.4 4.48-4.8"/></svg>
    </div>
    <button class="demo-trigger tn-stage-toggle" type="button" aria-pressed="false">播放动画</button>
    <p class="td-feedback" role="status"></p>`,
  connect(stage) {
    const badge = stage.querySelector(".tn-check");
    const line = badge.querySelector("path");
    const button = stage.querySelector("button");
    const status = stage.querySelector("[role=status]");
    const duration = 500;

    button.addEventListener("click", () => {
      const show = badge.dataset.open !== "true";
      const style = getComputedStyle(badge);
      const pose = { transform: style.transform, translate: style.translate };
      const exitStart = { ...pose, opacity: style.opacity, filter: style.filter };
      badge.dataset.open = String(show);
      button.setAttribute("aria-pressed", String(show));
      status.textContent = show ? "操作成功。" : "成功标记已收起。";

      if (!show) {
        animate(badge, [exitStart, { ...pose, opacity: 0, filter: "blur(4px)" }], duration);
        return;
      }

      line.getAnimations().forEach(effect => effect.cancel());
      const entry = animate(badge, [
        { opacity: 0, transform: "rotate(80deg)", filter: "blur(10px)" },
        { opacity: 1, transform: "rotate(0deg)", filter: "blur(0)" },
      ], duration);
      if (entry) {
        badge.animate([{ translate: "0 40px" }, { translate: "0 0" }], {
          duration, easing: "cubic-bezier(.34, 1.35, .64, 1)",
        });
        line.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], {
          duration, delay: 80, easing: ease, fill: "backwards",
        });
      }
    });
  },
};

export const transitionsNavigationDemos = {
  "menu-dropdown": {
    markup: `<div class="tn-dropdown-demo">
      <button class="demo-trigger" type="button" aria-expanded="true" aria-controls="tn-dropdown">切换菜单</button>
      <div class="tn-dropdown" id="tn-dropdown" data-state="open" aria-hidden="true"><span></span><span></span><span></span></div>
    </div>`,
    connect(stage) {
      const trigger = stage.querySelector("button");
      const dropdown = stage.querySelector(".tn-dropdown");
      let closeTimer;
      function setOpen(open) {
        clearTimeout(closeTimer);
        trigger.setAttribute("aria-expanded", String(open));
        if (open) {
          dropdown.dataset.state = "open";
        } else if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
          dropdown.dataset.state = "closed";
        } else {
          dropdown.dataset.state = "closing";
          const duration = parseFloat(getComputedStyle(dropdown).getPropertyValue("--tn-dropdown-close"));
          closeTimer = setTimeout(() => { dropdown.dataset.state = "closed"; }, duration);
        }
      }
      trigger.addEventListener("click", () => setOpen(dropdown.dataset.state !== "open"));
      trigger.addEventListener("keydown", event => {
        if (event.key === "Escape" && dropdown.dataset.state === "open") {
          event.preventDefault();
          setOpen(false);
        }
      });
    },
  },
  "modal-open-close": previewToggle({
    label: "切换弹窗",
    name: "弹窗布局预览",
    variant: "modal",
    content: `<span class="tn-modal-title"></span>
      <span class="tn-modal-dot"></span>
      <div class="tn-modal-lines"><span></span><span></span><span></span></div>
      <div class="tn-modal-actions"><span></span><span></span></div>`,
  }),
  "panel-reveal": previewToggle({
    label: "切换面板",
    name: "底部面板布局预览",
    variant: "sheet",
    content: `<div class="tn-sheet-lines"><span></span><span></span></div>
      <div class="tn-sheet-tiles"><span></span><span></span><span></span><span></span></div>`,
  }),
  "toast-open-close": {
    markup: `<div class="tn-toast" id="tn-toast" role="status" aria-hidden="true">
      <span class="tn-toast-dot" aria-hidden="true"></span>
      <span class="tn-toast-line" aria-hidden="true"></span>
      <span class="td-feedback">示例提示已显示</span>
    </div>
    <button class="demo-trigger tn-stage-toggle" type="button" aria-expanded="false" aria-controls="tn-toast">切换提示</button>`,
    connect(stage) {
      const toast = stage.querySelector(".tn-toast");
      const trigger = stage.querySelector(".tn-stage-toggle");
      trigger.addEventListener("click", () => {
        const open = trigger.getAttribute("aria-expanded") !== "true";
        trigger.setAttribute("aria-expanded", String(open));
        toast.setAttribute("aria-hidden", String(!open));
      });
    },
  },
  "success-check": successCheck,
  "dropdown-menu-morph": morphMenu,
  "gooey-plus-menu": gooeyMenu,
  "page-side-by-side": {
    markup: `<div class="tn-page-slide" data-page="1">
      <span class="tn-page-title" aria-hidden="true"></span>
      <div class="tn-page tn-page-tokens" data-page-id="1" role="group" aria-label="选择代币">
        ${pageTokens.map(([name, symbol, icon]) => `<button class="tn-page-token" type="button">
          <span class="tn-token-icon"><svg viewBox="0 0 16 16" aria-hidden="true">${icon}</svg></span>
          <span>${name}<small>${symbol}</small></span>
        </button>`).join("")}
      </div>
      <div class="tn-page tn-page-amount" data-page-id="2" role="group" aria-label="示例金额" inert>
        <p class="tn-amount-value">$10</p>
        <div class="tn-amount-presets"><span>25%</span><span>50%</span><span>Max</span></div>
        <p>$66.11 可用</p>
      </div>
      <button class="tn-page-back" type="button" aria-label="返回代币列表" inert>
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m10 4-4 4 4 4"/></svg>
      </button>
    </div>`,
    connect(stage) {
      const panel = stage.querySelector(".tn-page-slide");
      const list = panel.querySelector(".tn-page-tokens");
      const amount = panel.querySelector(".tn-page-amount");
      const back = panel.querySelector(".tn-page-back");
      let selected;
      list.addEventListener("click", event => {
        selected = event.target.closest(".tn-page-token");
        if (!selected) return;
        panel.dataset.page = "2";
        back.inert = amount.inert = false;
        back.focus({ preventScroll: true });
        list.inert = true;
      });
      back.addEventListener("click", () => {
        panel.dataset.page = "1";
        list.inert = false;
        selected.focus({ preventScroll: true });
        back.inert = amount.inert = true;
      });
    },
  },
  "tabs-sliding": {
    markup: `<div class="sliding-tabs" role="tablist" aria-label="工作方式">
      <span class="sliding-tabs-indicator" aria-hidden="true"></span>
      ${["Plan", "Debug", "Ask"].map((label, index) => `<button type="button" role="tab" aria-selected="${index === 0}" tabindex="${index === 0 ? 0 : -1}">${label}</button>`).join("")}
    </div>`,
    connect(stage) {
      connectSlidingTabs(stage.querySelector(".sliding-tabs"));
    },
  },
  "tooltip-open-close": {
    markup: `<div class="td-stack"><div class="td-actions tn-tooltip" data-visible="false">
      ${[["复制", "复制摘要"], ["分享", "分享给团队"], ["更多", "查看更多操作"]].map(([label, hint]) =>
        `<button class="demo-trigger" type="button" data-hint="${hint}">${label}</button>`,
      ).join("")}<span role="tooltip" id="tn-tooltip"></span>
      </div></div>`,
    connect(stage) {
      const group = stage.querySelector(".tn-tooltip");
      const tooltip = group.querySelector("[role=tooltip]");
      const buttons = [...group.querySelectorAll("button")];
      function show(button) {
        const alreadyVisible = group.dataset.visible === "true";
        group.dataset.visible = "true";
        group.classList.toggle("tn-tooltip-travel", alreadyVisible);
        for (const trigger of buttons) trigger.removeAttribute("aria-describedby");
        button.setAttribute("aria-describedby", tooltip.id);
        tooltip.textContent = button.dataset.hint;
        tooltip.style.setProperty("--tip-x", `${button.offsetLeft + button.offsetWidth / 2}px`);
      }
      function hide() {
        group.dataset.visible = "false";
        group.classList.remove("tn-tooltip-travel");
        for (const button of buttons) button.removeAttribute("aria-describedby");
      }
      for (const button of buttons) {
        button.addEventListener("pointerenter", () => show(button));
        button.addEventListener("focus", () => show(button));
        button.addEventListener("keydown", event => { if (event.key === "Escape") hide(); });
      }
      group.addEventListener("pointerleave", hide);
      group.addEventListener("focusout", event => { if (!group.contains(event.relatedTarget)) hide(); });
    },
  },
  accordion: {
    markup: `<div class="tn-accordion">
      <div class="tn-accordion-item" data-open="false">
        <button class="tn-accordion-trigger" type="button" aria-expanded="false" aria-controls="tn-accordion-panel">
          外观
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4"/></svg>
        </button>
        <div class="tn-accordion-panel" id="tn-accordion-panel" inert>
          <div class="tn-accordion-inner">
            <div class="tn-accordion-rows" aria-hidden="true">
              <div><span></span><span></span></div>
              <div><span></span><span></span></div>
              <div><span></span><span></span></div>
            </div>
          </div>
        </div>
      </div>
    </div>`,
    connect(stage) {
      const item = stage.querySelector(".tn-accordion-item");
      const trigger = item.querySelector("button");
      const panel = item.querySelector(".tn-accordion-panel");
      trigger.addEventListener("click", () => {
        const open = item.dataset.open !== "true";
        item.dataset.open = String(open);
        trigger.setAttribute("aria-expanded", String(open));
        panel.inert = !open;
      });
    },
  },
  "image-open-tilt": {
    markup: `<div class="td-stack tn-image-stage"><button type="button" class="tn-image-toggle" aria-label="放大示例图片" aria-pressed="false">
      <img src="./assets/mountains.jpg" alt="" width="320" height="180"></button></div>`,
    connect(stage) {
      const trigger = stage.querySelector("button");
      trigger.addEventListener("click", () => {
        const opening = trigger.getAttribute("aria-pressed") === "false";
        const direction = opening ? 1 : -.6;
        const start = getComputedStyle(trigger).transform;
        trigger.setAttribute("aria-pressed", String(opening));
        trigger.setAttribute("aria-label", opening ? "缩小示例图片" : "放大示例图片");
        animate(trigger, [
          { transform: start },
          {
            transform: `perspective(650px) rotateX(${-12 * direction}deg) rotateY(${18 * direction}deg)`,
            offset: .45,
          },
          { transform: "none" },
        ], opening ? 450 : 350);
      });
    },
  },
};
