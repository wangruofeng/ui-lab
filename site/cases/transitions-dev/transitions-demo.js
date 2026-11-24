import { transitionsGalleryDemos } from "./transitions-gallery-demos.js";

const check = '<svg viewBox="0 0 20 20" aria-hidden="true"><path pathLength="1" d="m5 10 3 3 7-7"/></svg>';
const motionReduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const easeOut = "cubic-bezier(.22,1,.36,1)";
const animateButton = '<button type="button" data-demo-toolbar>播放</button>';
const feedback = '<p class="td-feedback" role="status"></p>';

function animate(element, keyframes, options) {
  if (!motionReduced()) return element.animate(keyframes, options);
}

const demos = {
  ...transitionsGalleryDemos,
  "drag-and-drop": {
    markup: `<div class="td-stack">
      <div class="td-drop-grid">
        <div data-origin><button type="button" class="td-drag-card" aria-label="把示例图片放入放置区"></button></div>
        <div class="td-drop-zone" data-target aria-label="放置区"><span>把图片拖到这里</span></div>
      </div>${feedback}
    </div>`,
    connect(stage) {
      const card = stage.querySelector(".td-drag-card");
      const zone = stage.querySelector("[data-target]");
      const status = stage.querySelector("[role=status]");
      let drag;
      let offset;
      let settling = false;

      function settle(accepted, restoreFocus = false) {
        settling = true;
        zone.classList.remove("is-target");
        card.style.transform = "";
        if (!accepted) {
          const slide = animate(card, [
            { transform: offset },
            { transform: "none" },
          ], { duration: 500, easing: "cubic-bezier(.34,1.56,.64,1)" });
          if (slide) slide.finished.then(() => { settling = false; }, () => {});
          else settling = false;
          return;
        }
        card.hidden = true;
        zone.classList.add("is-filled");
        zone.firstElementChild.hidden = true;
        status.textContent = "图片已放入。";
        animate(zone, [
          { transform: "scale(1)", easing: easeOut },
          { transform: "scale(.97)", offset: 250 / 700, easing: easeOut },
          { transform: "scale(1)" },
        ], { duration: 700 });
        setTimeout(() => {
          zone.classList.remove("is-filled");
          zone.firstElementChild.hidden = false;
          card.hidden = false;
          if (restoreFocus && (document.activeElement === document.body || document.activeElement === card)) card.focus();
          animate(card, [{ opacity: 0, transform: "scale(.92)" }, { opacity: 1, transform: "none" }], 240);
          settling = false;
          status.textContent = "可以再次拖放。";
        }, 1800);
      }

      card.addEventListener("pointerdown", (event) => {
        if (settling || event.button !== 0) return;
        drag = {
          id: event.pointerId, x: event.clientX, y: event.clientY,
          lastX: event.clientX, lastTime: event.timeStamp, moved: false,
        };
        card.setPointerCapture(event.pointerId);
      });
      card.addEventListener("pointermove", (event) => {
        if (drag?.id !== event.pointerId || settling) return;
        const dx = event.clientX - drag.x;
        const dy = event.clientY - drag.y;
        if (Math.abs(dx) + Math.abs(dy) > 3) drag.moved = true;
        if (!drag.moved) return;
        const velocity = (event.clientX - drag.lastX) / Math.max(event.timeStamp - drag.lastTime, 1);
        drag.lastX = event.clientX;
        drag.lastTime = event.timeStamp;
        const reduced = motionReduced();
        const angle = reduced ? 0 : Math.max(-10, Math.min(10, velocity * 28));
        offset = `translate(${dx}px, ${dy}px) rotate(${angle}deg) scale(${reduced ? 1 : 1.05})`;
        card.style.transform = offset;
        const target = zone.getBoundingClientRect();
        const bounds = card.getBoundingClientRect();
        const x = bounds.left + bounds.width / 2;
        const y = bounds.top + bounds.height / 2;
        zone.classList.toggle("is-target", x >= target.left && x <= target.right
          && y >= target.top && y <= target.bottom);
      });
      for (const type of ["pointerup", "pointercancel"]) {
        card.addEventListener(type, (event) => {
          if (drag?.id !== event.pointerId) return;
          if (drag.moved) settle(type === "pointerup" && zone.classList.contains("is-target"));
          drag = undefined;
        });
      }
      card.addEventListener("click", (event) => {
        if (event.detail === 0 && !settling) settle(true, true);
      });
    },
  },
  "spinner-to-check": {
    markup: `<div class="td-stack">
      <div class="td-task-tile">
        <span class="td-save-icon" aria-hidden="true"><span class="td-save-spinner"></span><span data-check>${check}</span></span>
        <span><strong>构建演示页面</strong><small>8 个子任务</small></span>
      </div>
      ${animateButton}${feedback}
    </div>`,
    connect(stage) {
      const button = stage.querySelector("button");
      const icon = stage.querySelector(".td-save-icon");
      const status = stage.querySelector("[role=status]");
      let reset;
      button.addEventListener("click", () => {
        clearTimeout(reset);
        icon.removeAttribute("data-done");
        if (!motionReduced()) icon.getBoundingClientRect();
        icon.setAttribute("data-done", "");
        status.textContent = "任务已完成。";
        reset = setTimeout(() => {
          icon.removeAttribute("data-done");
          status.textContent = "任务处理中。";
        }, 2000);
      });
    },
  },
  "delete-dissolve": {
    markup: `<div class="td-stack">
      <div class="td-delete-area">
        <div class="td-delete-card" role="img" aria-label="山景示例图片"></div>
        <div class="td-smoke" aria-hidden="true"></div>
        <button type="button" data-delete aria-label="删除示例图片">删除</button>
      </div>${feedback}
    </div>`,
    connect(stage) {
      const card = stage.querySelector(".td-delete-card");
      const remove = stage.querySelector("[data-delete]");
      const cloud = stage.querySelector(".td-smoke");
      const status = stage.querySelector("[role=status]");
      remove.addEventListener("click", () => {
        if (remove.getAttribute("aria-disabled") === "true") return;
        remove.setAttribute("aria-disabled", "true");
        card.hidden = true;
        status.textContent = "正在删除图片。";
        const effects = [];
        if (!motionReduced()) {
          for (let y = 0; y < 4; y += 1) {
            for (let x = 0; x < 7; x += 1) {
              const fragment = document.createElement("i");
              fragment.style.setProperty("--column", x);
              fragment.style.setProperty("--row", y);
              cloud.append(fragment);
              const drift = Math.cos(x * 1.7 + y) * 26;
              const fall = 18 + y * 15 + x % 4 * 8;
              effects.push(animate(fragment, [
                { opacity: 1, transform: "none", filter: "none" },
                { opacity: .72, transform: `translate(${drift / 2}px,${fall / 3}px) scale(1.55)`, filter: "blur(4px)", offset: .37 },
                { opacity: 0, transform: `translate(${drift}px,${fall}px) scale(2.4)`, filter: "blur(12px)" },
              ], { duration: 760 + x * 35, easing: "ease-in", fill: "forwards" })?.finished);
            }
          }
        }
        Promise.allSettled(effects).then(() => {
          cloud.replaceChildren();
          setTimeout(() => {
            card.hidden = false;
            remove.setAttribute("aria-disabled", "false");
            animate(card, [{ opacity: 0, transform: "scale(.94)" }, { opacity: 1, transform: "none" }], 290);
            status.textContent = "图片已恢复，可以再次播放。";
          }, motionReduced() ? 400 : 760);
        });
      });
    },
  },
  "learn-more-hover": {
    markup: `<button type="button" class="td-learn">
      了解更多 <span class="td-learn-arrow" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 4L10 8"/>
          <path d="M10 8L6 12"/>
        </svg>
      </span>
    </button>`,
  },
  "notification-badge": {
    markup: `<div class="td-stack">
      <div class="td-inbox" data-badge-open="false" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 16h14l-2-3V9a5 5 0 0 0-10 0v4Zm5 3h4"/></svg>
        <span class="td-badge"><span>1</span></span>
      </div>
      ${animateButton}${feedback}
    </div>`,
    connect(stage) {
      const inbox = stage.querySelector(".td-inbox");
      const status = stage.querySelector("[role=status]");
      const button = stage.querySelector("button");
      button.setAttribute("aria-pressed", "false");
      button.addEventListener("click", () => {
        const visible = inbox.dataset.badgeOpen === "false";
        inbox.dataset.badgeOpen = String(visible);
        button.setAttribute("aria-pressed", String(visible));
        status.textContent = visible ? "1 条未读通知。" : "通知角标已隐藏。";
      });
    },
  },
  "icon-swap": {
    markup: `<div class="td-stack">
      <div class="td-icon-slot" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
        <svg viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></svg></div>
      ${animateButton}${feedback}
    </div>`,
    connect(stage) {
      const button = stage.querySelector("button");
      const slot = stage.querySelector(".td-icon-slot");
      button.setAttribute("aria-pressed", "false");
      button.addEventListener("click", () => {
        const open = button.getAttribute("aria-pressed") === "false";
        button.setAttribute("aria-pressed", String(open));
        slot.classList.toggle("is-open", open);
        stage.querySelector("[role=status]").textContent = open ? "显示关闭图标。" : "显示菜单图标。";
      });
    },
  },
  "streaming-text": {
    markup: `<div class="td-stack">
      <p class="td-stream-text">图层中的 文字 可以 逐段 显现。 保留 段落 的 完整 高度， 这样 阅读 位置 不会 在 输出 时 来回 跳动。</p>
      ${animateButton}${feedback}
    </div>`,
    connect(stage) {
      const text = stage.querySelector(".td-stream-text");
      const output = stage.querySelector("[role=status]");
      const words = text.textContent.trim().split(/\s+/u).map(word => {
        const span = document.createElement("span");
        span.textContent = word;
        return span;
      });
      text.replaceChildren(...words);
      let effects = [];
      let run = 0;
      stage.querySelector("button").addEventListener("click", () => {
        const current = ++run;
        effects.forEach(effect => effect.cancel());
        effects = words.map((word, index) => animate(word, [
          { opacity: 0, filter: "blur(1px)" },
          { opacity: 1, filter: "blur(0)" },
        ], { duration: 350, delay: index * 60, fill: "backwards", easing: easeOut })).filter(Boolean);
        Promise.allSettled(effects.map(effect => effect.finished)).then(() => {
          if (current === run) output.textContent = "全文已显示。";
        });
      });
    },
  },
  "error-state-shake": {
    markup: `<div class="td-form">
      <input type="email" value="lin" aria-label="邮箱地址" aria-describedby="td-email-status">
      <p id="td-email-status" class="td-status td-stage-status" role="status"></p>
      ${animateButton}
    </div>`,
    connect(stage) {
      const input = stage.querySelector("input");
      const status = stage.querySelector("[role=status]");
      let effect;
      let release;
      let timer;
      stage.querySelector("button").addEventListener("click", () => {
        clearTimeout(timer);
        effect?.cancel();
        release?.cancel();
        input.setAttribute("aria-invalid", "true");
        status.textContent = "请输入有效的邮箱地址。";
        effect = animate(input, [
          { transform: "none", easing: easeOut },
          { transform: "translateX(6px)", offset: 80 / 280, easing: easeOut },
          { transform: "translateX(-6px)", offset: 160 / 280, easing: easeOut },
          { transform: "translateX(4px)", offset: 220 / 280, easing: easeOut },
          { transform: "none" },
        ], 280);
        timer = setTimeout(() => {
          input.removeAttribute("aria-invalid");
          release = animate(status, [{ opacity: 1 }, { opacity: 0 }], { duration: 280, fill: "forwards" });
          const clear = () => { status.textContent = ""; };
          if (release) release.finished.then(clear, () => {});
          else clear();
        }, 3280);
      });
    },
  },
  "input-clear-with-dissolve": {
    markup: `<div class="td-form">
      <div class="td-clear-field">
        <input type="text" value="界面 动效 如何 工作？" placeholder="搜索" aria-label="搜索" autocomplete="off">
        <div class="td-cleared-text" aria-hidden="true"></div>
        <button type="button" class="td-clear-trigger" aria-label="清空搜索">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
            <path d="m4.5 4.5 7 7m0-7-7 7"/>
          </svg>
        </button>
      </div>
      <button type="button" data-demo-toolbar data-reset>重置文字</button>
    </div>`,
    connect(stage) {
      const input = stage.querySelector("input");
      const ghost = stage.querySelector(".td-cleared-text");
      const trigger = stage.querySelector(".td-clear-trigger");
      const original = input.value;
      const placeholder = input.placeholder;
      let visual;
      function reset() {
        visual?.cancel();
        ghost.replaceChildren();
        input.value = original;
        input.placeholder = placeholder;
        trigger.hidden = false;
      }
      trigger.addEventListener("click", () => {
        if (!input.value) return;
        visual?.cancel();
        const offset = input.scrollLeft;
        const phrase = document.createElement("span");
        const incoming = document.createElement("span");
        phrase.textContent = input.value;
        incoming.textContent = placeholder;
        ghost.replaceChildren(phrase, incoming);
        input.value = "";
        input.placeholder = "";
        trigger.hidden = true;
        input.focus();

        const options = { duration: 400, easing: easeOut, fill: "both" };
        visual = animate(phrase, [
          { opacity: 1, transform: `translate(${-offset}px, 0)`, filter: "blur(0)" },
          { opacity: 0, transform: `translate(${-offset}px, 12px)`, filter: "blur(2px)" },
        ], options);
        const reveal = animate(incoming, [
          { opacity: .9, transform: "translateY(-12px)", filter: "blur(2px)" },
          { opacity: 1, transform: "translateY(0)", filter: "blur(0)" },
        ], options);
        const finish = () => {
          if (!phrase.isConnected) return;
          ghost.replaceChildren();
          input.placeholder = placeholder;
        };
        if (reveal) reveal.finished.then(finish, () => {});
        else finish();
      });
      input.addEventListener("input", () => {
        ghost.replaceChildren();
        input.placeholder = placeholder;
        trigger.hidden = !input.value;
      });
      stage.querySelector("[data-reset]").addEventListener("click", reset);
    },
  },
  "checkbox-check": {
    markup: `<label class="td-choice">
      <input type="checkbox">
      <span class="td-checkbox">${check}</span>
      通知我
    </label>`,
  },
  toggle: {
    markup: `<button type="button" class="td-switch" role="switch" aria-checked="false" aria-label="切换开关">
      <span class="td-switch-thumb" aria-hidden="true"></span>
    </button>`,
    connect(stage) {
      const button = stage.querySelector(".td-switch");
      button.addEventListener("click", () => {
        button.classList.add("is-initialized");
        button.setAttribute("aria-checked", String(button.getAttribute("aria-checked") === "false"));
      });
    },
  },
  "card-resize": {
    markup: `<div class="td-resize" data-expanded="true">
      <div class="td-card td-resize-preview" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div>
      ${animateButton}${feedback}
    </div>`,
    connect(stage) {
      const panel = stage.querySelector(".td-resize");
      const button = stage.querySelector("button");
      button.setAttribute("aria-pressed", "false");
      button.addEventListener("click", () => {
        const large = panel.dataset.expanded !== "true";
        panel.dataset.expanded = String(large);
        button.setAttribute("aria-pressed", String(!large));
        stage.querySelector("[role=status]").textContent = large ? "已切换到宽卡片。" : "已切换到窄卡片。";
      });
    },
  },
  "skeleton-loader-and-reveal": {
    markup: `<div class="td-stack">
      <div class="td-profile" aria-busy="true">
        <div class="td-profile-content" inert>
          <span class="td-avatar" aria-hidden="true">林</span>
          <div><strong>林可</strong><p>lin@example.com</p></div>
        </div>
        <div class="td-skeleton" aria-hidden="true"><i></i><i></i><i></i></div>
      </div>
      ${animateButton}${feedback}
    </div>`,
    connect(stage) {
      const button = stage.querySelector("button");
      const profile = stage.querySelector(".td-profile");
      const details = stage.querySelector(".td-profile-content");
      const skeleton = stage.querySelector(".td-skeleton");
      const status = stage.querySelector("[role=status]");
      let pulse;
      let timer;
      function replay() {
        clearTimeout(timer);
        pulse?.cancel();
        profile.dataset.resetting = "";
        profile.setAttribute("aria-busy", "true");
        details.inert = true;
        status.textContent = "";
        skeleton.getBoundingClientRect();
        delete profile.dataset.resetting;
        pulse = animate(skeleton, [{ opacity: 1 }, { opacity: .5 }, { opacity: 1 }], { duration: 1000, easing: "ease-in-out" });
        timer = setTimeout(() => {
          profile.setAttribute("aria-busy", "false");
          details.inert = false;
          status.textContent = "已显示用户信息。";
        }, 1000);
      }
      button.addEventListener("click", replay);
    },
  },
  "reasoning-stream": {
    markup: `<div class="td-stack">
      <div class="td-log-window" aria-label="推理记录" tabindex="0">
        <div class="td-log-strip"><div class="td-log-copy">
          <p>先确认卡顿是每帧重新计算模糊，还是遮罩重复触发绘制。分开测量后更容易找到合适的修正。</p>
          <p>位置动画一直重绘元素时，渐变和滤镜也会反复参与渲染。可以分开测量绘制和合成的成本。</p>
          <p>让内容保持静止，只移动上面的遮盖层。把视觉变化放在合成阶段，避免每次都生成相同画面。</p>
          <p>最后对照原动效的速度和对比度，保留能让读者看清状态变化的节奏。</p>
        </div></div>
      </div>
      <button type="button" data-demo-toolbar data-play aria-pressed="false">播放</button>
    </div>`,
    connect(stage) {
      const button = stage.querySelector("[data-play]");
      const strip = stage.querySelector(".td-log-strip");
      const copy = strip.firstElementChild;
      const tail = copy.cloneNode(true);
      tail.setAttribute("aria-hidden", "true");
      strip.append(tail);
      let position = 0;
      let timer;
      function step() {
        if (!stage.isConnected || button.getAttribute("aria-pressed") !== "true") return;
        const height = copy.offsetHeight;
        const line = Number.parseFloat(getComputedStyle(copy).lineHeight);
        const end = position + line * 2;
        const effect = animate(strip, [
          { transform: `translateY(${-position}px)` },
          { transform: `translateY(${-end}px)` },
        ], { duration: 500, easing: easeOut, fill: "both" });
        const next = () => {
          position = height ? end % height : 0;
          strip.style.transform = `translateY(${-position}px)`;
          effect?.cancel();
          if (button.getAttribute("aria-pressed") === "true") timer = setTimeout(step, 840);
        };
        if (effect) effect.finished.then(next, () => {});
        else next();
      }

      button.addEventListener("click", () => {
        const playing = button.getAttribute("aria-pressed") !== "true";
        button.setAttribute("aria-pressed", String(playing));
        button.textContent = playing ? "暂停" : "播放";
        clearTimeout(timer);
        if (playing && !strip.getAnimations().length) timer = setTimeout(step, 840);
      });
    },
  },
  "like-button": {
    markup: `<button type="button" class="td-like" aria-pressed="false">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-8-5.1-8-10.2a4.4 4.4 0 0 1 8-2.5 4.4 4.4 0 0 1 8 2.5C20 14.9 12 20 12 20Z"/></svg>点赞
    </button>`,
    connect(stage) {
      const button = stage.querySelector("button");
      let pop;
      button.addEventListener("click", () => {
        const liked = button.getAttribute("aria-pressed") === "false";
        button.setAttribute("aria-pressed", String(liked));
        pop?.cancel();
        button.querySelectorAll("i").forEach(particle => particle.remove());
        if (!liked || motionReduced()) return;
        pop = animate(button.querySelector("svg"), [
          { transform: "scale(1)" },
          { transform: "scale(.82)", offset: .3 },
          { transform: "scale(1)" },
        ], { duration: 350, easing: "cubic-bezier(.34,1.96,.64,1)" });
        for (let index = 0; index < 8; index += 1) {
          const particle = document.createElement("i");
          const angle = index * Math.PI / 4;
          particle.setAttribute("aria-hidden", "true");
          button.append(particle);
          const x = Math.cos(angle) * 20;
          const y = Math.sin(angle) * 20;
          const drift = animate(particle, [
            { transform: "scale(.4)", opacity: 0 },
            { transform: `translate(${x / 4}px, ${y / 4}px) scale(1)`, opacity: 1, offset: .2 },
            { transform: `translate(${x}px, ${y}px) scale(.6)`, opacity: 0 },
          ], { duration: 600, easing: easeOut });
          if (drift) drift.finished.then(() => particle.remove(), () => particle.remove());
          else particle.remove();
        }
      });
    },
  },
  "banner-stacking": {
    markup: `<div class="td-stack">
      <ul class="td-banners" aria-label="通知堆栈" tabindex="0">
        <li>通知 3</li><li>通知 2</li><li>通知 1</li>
      </ul>
      <button type="button" data-demo-toolbar data-add>添加通知</button>${feedback}
    </div>`,
    connect(stage) {
      const add = stage.querySelector("[data-add]");
      const list = stage.querySelector("ul");
      const status = stage.querySelector("[role=status]");
      let count = 3;
      add.addEventListener("click", () => {
        const item = document.createElement("li");
        item.textContent = `通知 ${++count}`;
        const oldest = list.querySelector("li:nth-child(3)");
        list.prepend(item);
        oldest.classList.add("is-leaving");
        oldest.setAttribute("aria-hidden", "true");
        const exit = animate(oldest, [
          { opacity: getComputedStyle(oldest).opacity, transform: getComputedStyle(oldest).transform },
          { opacity: 0, transform: "translateY(-36px) scale(.82)", filter: "blur(2px)" },
        ], { duration: 250, easing: easeOut, fill: "forwards" });
        if (exit) exit.finished.then(() => oldest.remove(), () => oldest.remove());
        else oldest.remove();
        animate(item, [
          { opacity: 0, transform: "translateY(60px) scale(.97)", filter: "blur(2px)" },
          { opacity: 1, transform: "none", filter: "none" },
        ], { duration: 350, easing: easeOut });
        status.textContent = `已添加通知 ${count}，保留最近 3 条。`;
      });
    },
  },
};

export function renderTransitionsDemo(variant) {
  return `<div class="td-stage">${demos[variant].markup}</div>`;
}

export function connectTransitionsDemo(section, variant) {
  demos[variant].connect?.(section.querySelector(".td-stage"));
}
