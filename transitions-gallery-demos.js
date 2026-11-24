import { transitionsOfficialNumberDemos } from "./transitions-official-numbers.js";
import { transitionsNavigationDemos } from "./transitions-navigation-demos.js";

const reduceMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

function play(element, frames, options) {
  if (reduceMotion()) return;
  element.getAnimations().forEach(animation => animation.cancel());
  return element.animate(frames, options);
}

const action = (label = "重播动效") => `<button type="button" data-demo-toolbar>${label}</button>`;
const status = '<p role="status" class="td-status td-stage-status"></p>';

function digitLayer(slot, value) {
  const layer = document.createElement("span");
  layer.textContent = value;
  slot.append(layer);
  return layer;
}

function exchangeDigit(slot, previous, next, direction) {
  slot.replaceChildren();
  const leaving = digitLayer(slot, previous);
  const arriving = digitLayer(slot, next);
  const rest = { opacity: 1, transform: "none", filter: "none" };
  const edge = offset => ({ opacity: 0, transform: `translateY(${offset * .14}em)`, filter: "blur(.042em)" });
  const options = { duration: 455, fill: "both", easing: "cubic-bezier(.22,1,.36,1)" };
  const exit = play(leaving, [rest, edge(-direction)], options);
  play(arriving, [edge(direction), rest], options);
  exit.finished.then(() => leaving.remove(), () => leaving.remove());
}

function subtleNumberDemo() {
  const initial = "1,284";
  const slotsFor = value => [...value].map(digit => `<span class="tg-digit">${digit}</span>`).join("");
  return {
    markup: `<div class="td-stack"><div class="tg-number" aria-hidden="true">${slotsFor(initial)}</div>
      ${action("更新数字")}${status}</div>`,
    connect(stage) {
      const number = stage.querySelector(".tg-number");
      const output = stage.querySelector("[role=status]");
      let previous = initial;
      output.textContent = `数值：${initial}`;
      stage.querySelector("button").addEventListener("click", () => {
        const oldValue = Number(previous.replaceAll(",", ""));
        const delta = Math.floor(Math.random() * 80) - 40;
        const newValue = oldValue + (delta >= 0 ? delta + 1 : delta);
        const next = newValue.toLocaleString("en-US");
        if (reduceMotion() || previous.length !== next.length) {
          number.innerHTML = slotsFor(next);
        } else {
          const direction = newValue >= oldValue ? 1 : -1;
          [...number.children].forEach((slot, position) => {
            const before = previous[position];
            const after = next[position];
            if (before !== after) exchangeDigit(slot, before, after, direction);
          });
        }
        previous = next;
        output.textContent = `数值：${next}`;
      });
    },
  };
}

function sweep(organic = false) {
  const visual = organic
    ? '<div class="tg-organic-field" aria-hidden="true"><i></i><i></i><i></i></div>'
    : '<p class="tg-sweep">正在规划下一步</p>';
  return {
    markup: `<div class="td-stack tg-sweep-demo">${visual}${action("播放")}</div>`,
    connect(stage) {
      const demo = stage.querySelector(".tg-sweep-demo");
      const button = stage.querySelector("button");
      button.addEventListener("click", () => {
        const active = demo.classList.toggle("is-playing");
        button.textContent = active ? (organic ? "停止" : "暂停") : "播放";
      });
    },
  };
}

export const transitionsGalleryDemos = {
  ...transitionsNavigationDemos,
  ...transitionsOfficialNumberDemos,
  "number-subtle-change": subtleNumberDemo(),
  "shimmer-text": sweep(),
  "organic-shimmer": sweep(true),
  "pro-gradient-text": {
    markup: '<div class="td-stack"><p class="tg-sweep tg-gradient">专业动效</p></div>',
  },
  "text-states-swap": {
    markup: `<div class="td-stack"><div class="tg-text-swap"><p aria-live="polite">正在处理</p></div>${action("切换状态")}</div>`,
    connect(stage) {
      const output = stage.querySelector("p");
      const trigger = stage.querySelector("button");
      let busy = false;
      let index = 0;
      const states = ["正在处理", "处理完成"];
      trigger.addEventListener("click", async () => {
        if (busy) return;
        busy = true;
        const exit = play(output, [
          { opacity: 1, transform: "none", filter: "none" },
          { opacity: 0, filter: "blur(2px)", transform: "translateY(-4px)" },
        ], { duration: 150, easing: "ease-in-out", fill: "forwards" });
        if (exit) await exit.finished.catch(() => {});
        if (!stage.isConnected) return;
        index = (index + 1) % states.length;
        output.textContent = states[index];
        const enter = play(output, [
          { opacity: 0, filter: "blur(2px)", transform: "translateY(4px)" },
          { opacity: 1, filter: "none", transform: "none" },
        ], { duration: 150, easing: "ease-in-out" });
        if (enter) await enter.finished.catch(() => {});
        busy = false;
      });
    },
  },
  "texts-reveal": {
    markup: `<div class="td-stack"><div id="tg-reveal-copy" class="tg-reveal-text" aria-hidden="true"><h3>评审记录已更新</h3><p>可以查看最新的命名和布局建议。</p></div>
      <button type="button" data-demo-toolbar aria-expanded="false" aria-controls="tg-reveal-copy">切换文字</button></div>`,
    connect(stage) {
      const copy = stage.querySelector(".tg-reveal-text");
      const button = stage.querySelector("button");
      button.addEventListener("click", () => {
        const shown = copy.classList.toggle("is-shown");
        copy.setAttribute("aria-hidden", String(!shown));
        button.setAttribute("aria-expanded", String(shown));
        [...copy.children].forEach((line, index) => {
          const motion = shown
            ? [{ opacity: 0, transform: "translateY(12px)", filter: "blur(3px)" }, { opacity: 1, transform: "none", filter: "none" }]
            : [{ opacity: 1 }, { opacity: 0 }];
          play(line, motion, { duration: shown ? 500 : 200, delay: shown ? index * 40 : 0, fill: "backwards", easing: "cubic-bezier(.22,1,.36,1)" });
        });
      });
    },
  },
  "thinking-states": {
    markup: `<div class="td-stack tg-thinking">
      <div class="tg-text-swap"><div><p class="tg-sweep" aria-live="polite">正在准备工作区</p></div><span aria-hidden="true"></span></div>
      ${action("播放")}
    </div>`,
    connect(stage) {
      const demo = stage.querySelector(".tg-thinking");
      const trigger = stage.querySelector("button");
      const text = stage.querySelector("p");
      const previous = stage.querySelector(".tg-text-swap span");
      const labels = ["正在准备工作区", "正在运行命令", "正在浏览文件"];
      const hold = 2000;
      let index = 0;
      let timer;
      function next() {
        if (!stage.isConnected || !demo.classList.contains("is-playing")) return;
        previous.textContent = text.textContent;
        text.textContent = labels[++index % labels.length];
        const exit = play(previous, [
          { opacity: 1, transform: "none", filter: "none" },
          { opacity: 0, filter: "blur(2px)", transform: "translateY(-8px)" },
        ], { duration: 150, easing: "ease-in-out" });
        if (exit) exit.finished.then(() => { previous.textContent = ""; }, () => {});
        else previous.textContent = "";
        play(text.parentElement, [
          { opacity: 0, filter: "blur(2px)", transform: "translateY(8px)" },
          { opacity: 1, filter: "none", transform: "none" },
        ], { duration: 150, easing: "ease-in-out", delay: 50, fill: "backwards" });
        timer = setTimeout(next, hold);
      }
      trigger.addEventListener("click", () => {
        const playing = demo.classList.toggle("is-playing");
        trigger.textContent = playing ? "暂停" : "播放";
        clearTimeout(timer);
        if (playing) {
          timer = setTimeout(next, hold);
        } else {
          previous.getAnimations().forEach(animation => animation.cancel());
          text.parentElement.getAnimations().forEach(animation => animation.cancel());
          previous.textContent = "";
        }
      });
    },
  },
  "avatar-group-hover": {
    markup: `<div class="tg-avatars" role="group" aria-label="评审成员">
      ${Array.from({ length: 6 }, (_, index) => {
        const number = index + 1;
        return `<span class="tg-avatar" tabindex="0" aria-label="评审成员 ${number}">
          <img src="./source-art/avatar-group/avatar-${number}.webp" alt="" width="32" height="32" draggable="false">
        </span>`;
      }).join("")}
      <span class="tg-avatar tg-avatar-more" tabindex="0" aria-label="另有两位成员">+2</span>
    </div>`,
    connect(stage) {
      const group = stage.querySelector(".tg-avatars");
      const members = [...group.children];

      let hovered = null;
      let focused = null;

      function update() {
        const index = members.indexOf(hovered ?? focused);
        group.classList.toggle("is-lifted", index !== -1);
        for (const [position, member] of members.entries()) {
          const distance = Math.abs(position - index);
          member.style.setProperty("--lift", index < 0 ? "0px" : `${-4 * 0.45 ** distance}px`);
          member.style.setProperty("--lift-scale", position === index ? 1.05 : 1);
        }
      }

      for (const member of members) {
        member.addEventListener("pointerenter", event => {
          if (event.pointerType === "touch") return;
          hovered = member;
          update();
        });
        member.addEventListener("focus", () => {
          focused = member.matches(":focus-visible") ? member : null;
          update();
        });
      }
      group.addEventListener("pointerleave", () => {
        hovered = null;
        update();
      });
      group.addEventListener("focusout", event => {
        if (group.contains(event.relatedTarget)) return;
        focused = null;
        update();
      });
    },
  },
  "card-stack-hover": {
    markup: `<button type="button" class="tg-card-stack" aria-label="产品照片卡片堆" aria-expanded="false">
      <span class="tg-stack-card"><img src="./source-art/card-stack/studio-camera.webp" alt="蓝色复古相机" width="312" height="312" draggable="false"></span>
      <span class="tg-stack-card"><img src="./source-art/card-stack/studio-radio.webp" alt="绿色桌面收音机" width="312" height="312" draggable="false"></span>
      <span class="tg-stack-card"><img src="./source-art/card-stack/studio-headphones.webp" alt="橙色头戴式耳机" width="312" height="312" draggable="false"></span>
    </button>`,
    connect(stage) {
      const stack = stage.querySelector(".tg-card-stack");

      function collapse() {
        stack.setAttribute("aria-expanded", "false");
        stack.classList.remove("is-hovering");
      }

      stack.addEventListener("pointerenter", event => {
        if (event.pointerType === "mouse") stack.classList.add("is-hovering");
      });
      stack.addEventListener("pointerleave", () => stack.classList.remove("is-hovering"));
      stack.addEventListener("click", () => {
        if (stack.getAttribute("aria-expanded") === "true") {
          collapse();
        } else {
          stack.setAttribute("aria-expanded", "true");
        }
      });
      stack.addEventListener("keydown", event => {
        if (event.key === "Escape") collapse();
      });
      stack.addEventListener("blur", collapse);
      stage.addEventListener("click", event => {
        if (!stack.contains(event.target)) collapse();
      });
    },
  },
  "3d-tilt": {
    markup: `<div class="tg-tilt-anchor" tabindex="0" role="img" aria-label="灰色示例信用卡，移动指针或按住拖动可倾斜">
      <div class="tg-tilt" aria-hidden="true">
        <div class="tg-tilt-heading"><span>Credit</span><strong>UI LAB</strong></div>
        <div class="tg-tilt-details"><span>Alex Morgan</span><span>••••  ••••  ••••  0425</span></div>
        <div class="tg-tilt-glare"></div>
      </div>
    </div>`,
    connect(stage) {
      const anchor = stage.querySelector(".tg-tilt-anchor");
      const card = anchor.querySelector(".tg-tilt");
      const angleRange = 40;
      let captured = null;

      function tilt(x, y) {
        anchor.classList.add("is-tilting");
        card.style.setProperty("--rx", `${(.5 - y) * angleRange}deg`);
        card.style.setProperty("--ry", `${(x - .5) * angleRange}deg`);
        card.style.setProperty("--glare-x", `${x * 100}%`);
        card.style.setProperty("--glare-y", `${y * 100}%`);
      }

      function reset() {
        anchor.classList.remove("is-tilting");
        card.style.removeProperty("--rx");
        card.style.removeProperty("--ry");
      }

      function follow(event) {
        if (reduceMotion() || (event.pointerType !== "mouse" && event.pointerId !== captured)) return;
        const rect = anchor.getBoundingClientRect();
        const clamp = value => Math.max(0, Math.min(1, value));
        tilt(clamp((event.clientX - rect.left) / rect.width), clamp((event.clientY - rect.top) / rect.height));
      }

      function finishDrag(event) {
        if (event.pointerId !== captured) return;
        captured = null;
        reset();
      }

      anchor.addEventListener("pointerdown", event => {
        if (event.pointerType === "mouse" || captured !== null || reduceMotion()) return;
        captured = event.pointerId;
        anchor.setPointerCapture(captured);
        follow(event);
      });
      anchor.addEventListener("pointermove", follow);
      anchor.addEventListener("pointerleave", () => { if (captured === null) reset(); });
      anchor.addEventListener("pointerup", finishDrag);
      anchor.addEventListener("pointercancel", finishDrag);
      anchor.addEventListener("lostpointercapture", finishDrag);
      anchor.addEventListener("focus", () => {
        if (anchor.matches(":focus-visible") && !reduceMotion()) tilt(.78, .24);
      });
      anchor.addEventListener("blur", reset);
    },
  },
  "confetti-burst": {
    markup: `<div class="tg-confetti"><canvas aria-hidden="true"></canvas><button class="demo-trigger" type="button">播放彩屑</button></div>`,
    connect(stage) {
      const holder = stage.querySelector(".tg-confetti");
      const canvas = holder.querySelector("canvas");
      const button = holder.querySelector("button");
      const drawing = canvas.getContext("2d");
      const colors = ["#bf5541", "#3766af", "#b1882a", "#2d8a71", "#8858a1"];
      let run = 0;
      button.addEventListener("click", () => {
        if (reduceMotion()) return;
        cancelAnimationFrame(run);
        const box = holder.getBoundingClientRect();
        const target = button.getBoundingClientRect();
        const width = box.width;
        const height = box.height;
        const ratio = Math.min(2, devicePixelRatio || 1);
        canvas.width = width * ratio;
        canvas.height = height * ratio;
        drawing.setTransform(ratio, 0, 0, ratio, 0, 0);
        const buttonLeft = target.left - box.left;
        const buttonRight = target.right - box.left;
        const buttonTop = target.top - box.top;
        const now = performance.now();
        const pieces = Array.from({ length: 100 }, (_, index) => {
          const x = Math.random() * width;
          const drift = (Math.random() - .5) * 33;
          const landing = Math.max(4, Math.min(width - 4, x + drift));
          const onButton = landing >= buttonLeft + 3 && landing <= buttonRight - 3;
          return {
            x, landing, onButton,
            surface: onButton ? buttonTop - 2 : height - 5,
            delay: Math.random() * 480,
            duration: 390 + Math.random() * 420,
            angle: Math.random() * Math.PI * 2,
            spin: (Math.random() - .5) * 12,
            width: 2.5 + Math.random() * 2.6,
            color: colors[index % colors.length],
          };
        });
        function frame(time) {
          drawing.clearRect(0, 0, width, height);
          if (!holder.isConnected || reduceMotion()) return;
          const age = time - now;
          const alpha = Math.min(1, Math.max(0, (2140 - age) / 420));
          if (!alpha) return;
          drawing.globalAlpha = alpha;
          for (const piece of pieces) {
            const elapsed = age - piece.delay;
            if (elapsed < 0) continue;
            const fall = Math.min(1, elapsed / piece.duration);
            const bounce = Math.min(1, Math.max(0, (elapsed - piece.duration) / 210));
            const y = -10 + (piece.surface + 10) * fall ** 1.75
              - Math.sin(bounce * Math.PI) * (piece.onButton ? 12 : 7);
            const x = piece.x + (piece.landing - piece.x) * fall;
            drawing.save();
            drawing.translate(x, y);
            drawing.rotate(piece.angle + piece.spin * fall);
            drawing.fillStyle = piece.color;
            drawing.fillRect(-piece.width / 2, -2, piece.width, 4);
            drawing.restore();
          }
          run = requestAnimationFrame(frame);
        }
        run = requestAnimationFrame(frame);
      });
    },
  },
  "matrix-dot-loader": {
    markup: `<div class="td-stack"><div class="tg-matrices" role="group" aria-label="四种加载节奏">
      ${[["scan", "扫描"], ["twinkle", "闪烁"], ["orbit", "环绕"], ["pulse", "脉冲"]].map(([pattern, label]) =>
      `<div class="tg-matrix-sample"><div class="tg-matrix" data-pattern="${pattern}" aria-hidden="true">${"<i></i>".repeat(16)}</div><span>${label}</span></div>`).join("")}
      </div></div>`,
    connect(stage) {
      const corners = [0, 3, 12, 15];
      const clockwise = [1, 2, 7, 11, 14, 13, 8, 4];
      const scattered = [7, 2, 11, 5, 14, 9, 0, 12, 3, 15, 6, 10, 13, 1, 8, 4];
      for (const matrix of stage.querySelectorAll(".tg-matrix")) {
        const pattern = matrix.dataset.pattern;
        for (const [index, dot] of [...matrix.children].entries()) {
          const perimeter = clockwise.indexOf(index);
          if ((pattern === "orbit" || pattern === "pulse") && corners.includes(index)) {
            dot.classList.add("tg-matrix-gap");
            continue;
          }
          if (pattern === "orbit" && perimeter < 0) {
            dot.classList.add("tg-matrix-still");
            continue;
          }
          const phase = {
            scan: (index % 4) * 120,
            twinkle: scattered[index] * 75,
            orbit: perimeter * 150,
            pulse: perimeter < 0 ? 0 : 192,
          }[pattern];
          dot.style.setProperty("--matrix-delay", `${phase}ms`);
        }
      }
    },
  },
  "image-gen-placeholder": {
    markup: `<div class="td-stack"><div class="tg-image-slot tg-generation-slot" data-image-state="idle">
      <div class="tg-image-noise" aria-hidden="true"></div>
      <div class="tg-image" role="img" aria-label="云下山脉" aria-hidden="true"></div>
      </div>${action("播放")}${status}</div>`,
    connect(stage) {
      const button = stage.querySelector("button");
      const slot = stage.querySelector(".tg-generation-slot");
      const image = slot.querySelector(".tg-image");
      const noise = slot.querySelector(".tg-image-noise");
      const output = stage.querySelector("[role=status]");
      const states = [
        ["idle", "播放", "已重置。"],
        ["loading", "显示图像", "正在生成示例图。"],
        ["revealed", "重置", "示例图已显示。"],
      ];
      let index = 0;
      const dots = document.createDocumentFragment();
      for (let i = 0; i < 240; i += 1) {
        const dot = document.createElement("i");
        const delay = Math.random() * 6000;
        const cycle = 1400 * (.9 + Math.random() * .2);
        const phase = (delay % cycle) / cycle;
        dot.style.setProperty("--dot-delay", `${-delay}ms`);
        dot.style.setProperty("--dot-alpha", String(.5 - .5 * Math.cos(phase * Math.PI * 2)));
        dot.style.setProperty("--dot-cycle", `${cycle}ms`);
        dots.append(dot);
      }
      noise.append(dots);
      button.addEventListener("click", () => {
        index = (index + 1) % states.length;
        const [state, label, message] = states[index];
        slot.dataset.imageState = state;
        image.setAttribute("aria-hidden", String(state !== "revealed"));
        button.textContent = label;
        output.textContent = message;
      });
    },
  },
  "get-pro-button": {
    markup: `<button type="button" class="tg-rim"><span class="tg-rim-light" aria-hidden="true"></span>Get Pro</button>`,
  },
};
