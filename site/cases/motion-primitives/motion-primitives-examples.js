import { t } from "../../app/locale.js";

const easing = "cubic-bezier(.2,.75,.25,1)";
const reducedMotion = globalThis.matchMedia?.(
  "(prefers-reduced-motion: reduce)",
) ?? { matches: false };
const activeMotion = new WeakMap();
const pageSize = 8;
const destinations = [
  t("山谷步道", "Valley Trail"),
  t("湖畔木屋", "Lakeside Cabin"),
  t("高地营地", "Highland Camp"),
  t("河边书店", "Riverside Bookshop"),
  t("温室花园", "Greenhouse Garden"),
  t("白石码头", "Whitestone Pier"),
  t("橡树林", "Oak Grove"),
  t("山间车站", "Mountain Station"),
];
const counts = [1248, 3680, 2156];
const minutes = [125, 132, 108];
const numberFormat = new Intl.NumberFormat("zh-CN");
const words = {
  "text-loop": [t("待处理", "Pending"), t("处理中", "In progress"), t("已完成", "Complete")],
  "text-morph": ["TYPE", "STYLE", "LAYOUT"],
  "text-roll": [t("最早加入", "Oldest first"), t("最近更新", "Recently updated"), t("按名排序", "By name")],
  "text-scramble": ["A7F2K9", "Q3T8W6", "N2M4R8"],
};

const button = (action, label, attributes = "") =>
  `<button type="button" class="motion-action" data-mp-action="${action}" ${attributes}>${label}</button>`;

const options = (labels, label) =>
  `<div class="mp-controls" role="group" aria-label="${label}">${labels
    .map((text, index) =>
      button(
        "select",
        text,
        `data-index="${index}" aria-pressed="${index === 0}"`,
      ),
    )
    .join("")}</div>`;

const glyphs = (text) =>
  Array.from(
    text,
    (char) => `<span>${char === " " ? "&nbsp;" : char}</span>`,
  ).join("");

const expander = (title, content) =>
  `<div class="mp-expander">
    ${button("expand", title, 'aria-expanded="false"')}
    <div class="mp-fold" inert><div>${content}</div></div>
  </div>`;

const record = (name, detail) =>
  `<div class="mp-record"><strong>${name}</strong><small>${detail}</small></div>`;

function renderExpandable(id) {
  if (id === "accordion") {
    return [
      [t("票价", "Ticket prices"), t("普通票 ¥40，学生票 ¥20。", "Standard ¥40, student ¥20.")],
      [t("开放时间", "Opening hours"), t("周二至周日 10:00–18:00。", "Tuesday to Sunday, 10:00–18:00.")],
      [t("取票方式", "Ticket pickup"), t("现场出示订单二维码即可。", "Show your order QR code at the venue.")],
    ]
      .map(([title, description]) => expander(title, `<p>${description}</p>`))
      .join("");
  }
  if (id === "disclosure") {
    return (
      record(t("预计周五送达", "Estimated delivery Friday"), t("订单配送", "Order delivery")) +
      expander(
        t("查看配送细节", "View shipping details"),
        `<p>${t("包裹由嘉兴仓发出。发货后可在订单页查看物流。", "This package ships from our Jiaxing warehouse. Track it from your order page after dispatch.")}</p>`,
      )
    );
  }
  return (
    record(t("项目简报", "Project brief"), t("共享范围 · 仅团队", "Sharing · Team only")) +
    expander(
      t("更多操作", "More actions"),
      `<div class="mp-controls">${button("export", t("导出简报", "Export brief"))}${button("copy", t("复制链接", "Copy link"))}</div>`,
    ) +
    '<p class="mp-status" role="status"></p>'
  );
}

function renderViews(labels, views, label) {
  return `${options(labels, label)}
    <div class="mp-views">${views.map((view, index) => `<div class="mp-view" ${index === 0 ? "" : "hidden inert"}>${view}</div>`).join("")}</div>`;
}

const renderers = {
  accordion: renderExpandable,
  disclosure: renderExpandable,
  "toolbar-expandable": renderExpandable,
  dialog: () => `
    <div class="mp-center">${button("open", t("通知设置", "Notification settings"), 'aria-haspopup="dialog"')}</div>
    <dialog class="mp-modal" aria-label="${t("通知设置", "Notification settings")}">
      <strong>${t("通知设置", "Notification settings")}</strong>
      <label><input type="checkbox" checked> ${t("每周发送摘要", "Send a weekly summary")}</label>
      <label><input type="checkbox"> ${t("项目更新时提醒", "Notify me about project updates")}</label>
      <form method="dialog"><button class="motion-action">${t("完成", "Done")}</button></form>
    </dialog>`,
  "animated-group": () => `
    ${button("group", t("显示记录", "Show records"), 'aria-expanded="false"')}
    <div class="mp-records" hidden>
      ${record(t("春季提案.pdf", "Spring Proposal.pdf"), t("09:10 · 导入成功", "09:10 · Imported"))}
      ${record(t("版式参考.zip", "Layout References.zip"), t("09:12 · 导入成功", "09:12 · Imported"))}
      ${record(t("素材索引.csv", "Asset Index.csv"), t("09:14 · 导入成功", "09:14 · Imported"))}
    </div>`,
  carousel: () =>
    renderViews(
      [t("山谷", "Valley"), t("河畔", "Lakeside"), t("高地", "Highlands")],
      [
        [t("山谷步道", "Valley Trail"), "valley-trail"],
        [t("河畔露营", "Lakeside camping"), "riverside-camp"],
        [t("高地环线", "Highlands loop"), "highland-loop"],
      ].map(
        ([title, image]) => `
      <figure class="mp-slide">
        <img data-fade-on-load src="./assets/source-art/carousel/${image}.webp" alt="" draggable="false"><figcaption>${title}</figcaption>
      </figure>`,
      ),
      t("选择目的地", "Choose a destination"),
    ),
  "transition-panel": () =>
    renderViews(
      [t("名称", "Name"), t("设置", "Settings"), t("预览", "Preview")],
      [
        `<label>${t("项目名称", "Project name")}<input placeholder="${t("输入名称", "Enter a name")}" data-mp-name></label>`,
        `<label><input type="checkbox"> ${t("允许团队编辑", "Allow team editing")}</label>`,
        `<p data-mp-summary>${t("尚未填写项目名称", "No project name entered")}</p>`,
      ],
      t("项目步骤", "Project steps"),
    ),
  "toolbar-dynamic": () =>
    renderViews(
      [t("文字", "Text"), t("图形", "Shape")],
      [
        '<div class="mp-controls">' +
          [
            ["weight", t("加粗", "Bold")],
            ["italic", t("斜体", "Italic")],
            ["underline", t("下划线", "Underline")],
          ]
            .map(([style, label]) =>
              button(
                "style",
                label,
                `data-style="${style}" aria-pressed="false"`,
              ),
            )
            .join("") +
          `</div><p class="mp-tool-sample">${t("画布标题", "Canvas title")}</p>`,
        '<div class="mp-controls">' +
          [
            ["fill", t("填充", "Fill")],
            ["outline", t("描边", "Stroke")],
          ]
            .map(([style, label]) =>
              button(
                "style",
                label,
                `data-style="${style}" aria-pressed="false"`,
              ),
            )
            .join("") +
          `</div><div class="mp-tool-sample mp-tool-shape" role="img" aria-label="${t("样本图形", "Sample shape")}"></div>`,
      ],
      t("选择工具", "Choose a tool"),
    ),
  "animated-number": () => numeric(counts, t("已筹集金额", "Amount raised"), t("元", " CNY")),
  "sliding-number": () => numeric(minutes, t("下一班列车", "Next train"), t("分钟", " min")),
  "spinning-text": () => {
    const text = Array.from("NORTH FIELD · DESIGN STUDIO · ");
    return `<div class="mp-display"><div class="mp-wheel" role="img" aria-label="North Field Design Studio">
      <span aria-hidden="true" class="mp-wheel-center">N</span>
      <span aria-hidden="true" class="mp-wheel-ring">${text
        .map(
          (letter, index) =>
            `<span style="--angle:${(index * 360) / text.length}deg">${letter}</span>`,
        )
        .join("")}</span>
    </div></div>`;
  },
  "text-effect": () =>
    textStage(t("春日来信 · 设计小展", "Letters from Spring · A design exhibition"), [t("春日来信", "Letters from Spring"), " · ", t("设计小展", "A design exhibition")]),
  "text-loop": () => textStage(words["text-loop"][0]),
  "text-morph": () =>
    textStage(
      words["text-morph"][0],
      Array.from(words["text-morph"][0]),
    ),
  "text-roll": () =>
    textStage(
      words["text-roll"][0],
      Array.from(words["text-roll"][0]),
    ),
  "text-scramble": () => textStage(words["text-scramble"][0]),
  "text-shimmer": () => textStage(t("等待导出", "Waiting to export")),
  "text-shimmer-wave": () =>
    textStage(t("正在同步文件", "Syncing files"), Array.from(t("正在同步文件", "Syncing files"))),
  "image-comparison": () => `
    <div class="mp-photo">
      <img src="./assets/mountains.jpg" alt="${t("偏暖的山谷照片", "Warm-toned valley photo")}" draggable="false">
      <img class="mp-photo-cool" src="./assets/mountains.jpg" alt="${t("偏冷的同一张山谷照片", "Cool-toned version of the same valley photo")}" draggable="false">
      <span class="mp-divider" aria-hidden="true"></span>
    </div>
    <label class="mp-range">${t("冷暖分界", "Warm–cool boundary")} <input data-mp-range type="range" min="0" max="100" value="50"></label>`,
  "in-view": () => `
    <div class="mp-scroll mp-in-view-scroll" tabindex="0" role="region" aria-label="${t("展览导览", "Exhibition guide")}">
      <p class="mp-in-view-instruction">${t("向下滚动 ↓", "Scroll down ↓")}</p>
      <div class="mp-in-view-target">
        <div class="mp-in-view-content">
          <strong>${t("展览导览", "Exhibition guide")}</strong>
          <p>${t("从一楼的光影装置出发，沿楼梯上行，在二楼的观景窗前结束参观。", "Start at the light installation on the first floor, take the stairs, and finish at the viewing window on the second floor.")}</p>
        </div>
      </div>
    </div>`,
  "progressive-blur": () => scrollArea(t("收藏地点", "Saved places"), false),
  "scroll-progress": () => scrollArea(t("路线指南", "Trail guide"), true),
  "infinite-slider": () => {
    const cards = [t("北坡", "North Slope"), t("白石", "Whitestone"), t("潮汐", "Tidewater"), t("远岸", "Far Shore")]
      .map((name) => `<span class="mp-exhibit">${name}</span>`)
      .join("");
    return `<div class="mp-marquee" aria-label="${t("北坡、白石、潮汐、远岸", "North Slope, Whitestone, Tidewater, Far Shore")}">
      <div class="mp-belt" aria-hidden="true"><div>${cards}</div><div>${cards}</div></div>
    </div>`;
  },
  "border-trail": () => `
    <div class="mp-center"><div class="mp-trail"><i aria-hidden="true"></i><span>${t("文件已就绪", "File ready")}</span></div></div>`,
  cursor: () =>
    pointerStage(
      '<span class="mp-marker" aria-hidden="true"></span>',
      t("模拟取样", "Simulate sampling"),
    ),
  dock: () => `
    <div class="mp-center"><div class="mp-dock" role="group" aria-label="${t("工作区快捷入口", "Workspace shortcuts")}">
      ${[t("文稿", "Document"), t("文件", "Files"), t("日历", "Calendar"), t("设置", "Settings")]
        .map((name, index) =>
          button(
            "dock",
            `<span class="mp-dock-icon mp-dock-icon--${index}" aria-hidden="true"></span>`,
            `aria-label="${name}" aria-pressed="false"`,
          ),
        )
        .join("")}
    </div></div><p class="mp-status" role="status">${t("选择工具", "Choose a tool")}</p>`,
  "glow-effect": () => `
    <div class="mp-center mp-lamp"><span>${t("环境灯", "Ambient light")}</span></div>`,
  magnetic: () => `
    <div class="mp-center"><button type="button" class="mp-magnet" data-mp-pointer data-mp-action="save"><span>${t("保存草稿", "Save draft")}</span></button></div>
    <p class="mp-status" role="status"></p>`,
  spotlight: () =>
    pointerStage(
      `<span class="mp-starfield" aria-hidden="true"></span><strong>${t("夜景样本", "Night sample")}</strong>`,
      t("移动聚光灯", "Move the spotlight"),
    ),
  tilt: () =>
    pointerStage(
      `<div class="mp-tilt-card"><strong>${t("白砂岩", "White sandstone")}</strong><small>${t("石材样本", "Stone sample")}</small></div>`,
      t("切换观察角度", "Change viewing angle"),
    ),
};

function numeric(values, label, unit) {
  const initial = numberFormat.format(values[0]);
  const visual = unit === t("分钟", " min") ? glyphs(initial) : initial;
  return `<div class="mp-display"><small>${label}</small>
    <strong class="mp-number"><span class="mp-value" aria-hidden="true">${visual}</span> <small>${unit}</small></strong>
    <span class="mp-announcement" role="status">${initial}${unit}</span>
  </div>`;
}

function textStage(text, parts) {
  return `<div class="mp-display">
    <strong class="mp-text" aria-hidden="true">${parts ? parts.map((part) => `<span>${part}</span>`).join("") : text}</strong>
    <span class="mp-announcement" role="status">${text}</span>
  </div>`;
}

function scrollArea(label, progress) {
  return `<div class="mp-scroll-wrap">
    ${progress ? '<div class="mp-progress"><span></span></div><output class="mp-percent">0%</output>' : ""}
    <div class="mp-scroll" tabindex="0" role="region" aria-label="${label}" data-mp-scroll>
      ${Array.from({ length: pageSize }, (_, index) =>
        record(
          progress
            ? `${t("第", "Section")} ${index + 1} ${t("段 ·", " ·")} ${destinations[index]}`
            : destinations[index],
          progress
            ? t("沿石板路向前，经过观察平台后进入林间小道。", "Follow the stone path past the viewing platform and onto the woodland trail.")
            : `${t("路线", "Trail")} ${(index + 1) * 2} km`,
        ),
      ).join("")}
    </div>
  </div>`;
}

function pointerStage(content, label) {
  return `<div class="mp-pointer" data-mp-pointer>${content}</div>
    <div class="mp-controls">${button("pointer", label)}<output class="mp-status"></output></div>`;
}

const playButton = button("play", t("播放", "Play"), 'aria-pressed="false"');
const frameActions = {
  "animated-number": button("number", t("更新", "Update")),
  "sliding-number": button("number", t("刷新", "Refresh")),
  "spinning-text": playButton,
  "text-effect": button("text", t("重播", "Replay")),
  "text-loop": button("text", t("切换状态", "Switch status")),
  "text-morph": button("text", t("切换名称", "Switch name")),
  "text-roll": button("text", t("切换排序", "Switch sort order")),
  "text-scramble": button("text", t("生成口令", "Generate code")),
  "text-shimmer": button("text", t("开始导出", "Start export")),
  "text-shimmer-wave": button("text", t("重播", "Replay")),
  "infinite-slider": playButton,
  "border-trail": button("trail", t("模拟导入", "Simulate import")),
  "glow-effect": button("glow", t("开灯", "Turn light on"), 'aria-pressed="false"'),
};

export function renderMotionExample(item, after) {
  return `<article class="widget motion-demo mp-example mp-${item.id}${item.id === "image-comparison" ? " is-cool" : ""}" data-mp-example="${item.id}" data-after="${after}">
    <div class="mp-heading"><h4>${item.scene}</h4>${frameActions[item.id] ?? ""}</div>
    <div class="motion-frame mp-frame">${renderers[item.id](item.id)}</div>
    <p class="motion-note">${item.notes[Number(after)]}</p>
  </article>`;
}

function moves(demo) {
  return demo.dataset.after === "true" && !reducedMotion.matches;
}

function animate(node, keyframes, options = {}) {
  activeMotion.get(node)?.cancel();
  const animation = node.animate(keyframes, {
    duration: 460,
    easing,
    ...options,
  });
  activeMotion.set(node, animation);
  return animation;
}

function setExpanded(group, expanded) {
  group.querySelector("button").setAttribute("aria-expanded", String(expanded));
  group.querySelector(".mp-fold").inert = !expanded;
  group.classList.toggle("is-expanded", expanded);
}

function switchView(demo, control) {
  const index = Number(control.dataset.index);
  const controls = Array.from(
    demo.querySelectorAll('[data-mp-action="select"]'),
  );
  const oldIndex = controls.findIndex(
    (item) => item.getAttribute("aria-pressed") === "true",
  );
  if (oldIndex === index) return;
  controls[oldIndex].setAttribute("aria-pressed", "false");
  control.setAttribute("aria-pressed", "true");
  const views = Array.from(demo.querySelectorAll(".mp-view"));
  for (const view of views) {
    activeMotion.get(view)?.cancel();
    view.hidden = true;
    view.inert = true;
    view.classList.remove("is-leaving");
  }
  const previous = views[oldIndex];
  const next = views[index];
  const summary = next.querySelector("[data-mp-summary]");
  if (summary) {
    const name = demo.querySelector("[data-mp-name]").value.trim();
    summary.textContent = name ? `${t("项目：", "Project: ")}${name}` : t("尚未填写项目名称", "No project name entered");
  }
  next.hidden = false;
  next.inert = false;
  const status = demo.querySelector(".mp-status");
  if (status) status.textContent = "";
  if (!moves(demo)) return;

  const direction = Math.sign(index - oldIndex);
  const distance =
    demo.dataset.mpExample === "carousel"
      ? "100%"
      : demo.dataset.mpExample === "transition-panel"
        ? "36px"
        : "16px";
  previous.hidden = false;
  previous.classList.add("is-leaving");
  const exit = animate(previous, [
    { transform: "translateX(0)", opacity: 1 },
    {
      transform: `translateX(calc(${-direction} * ${distance}))`,
      opacity: distance === "100%" ? 1 : 0,
    },
  ]);
  exit.onfinish = () => {
    previous.hidden = true;
    previous.classList.remove("is-leaving");
  };
  animate(next, [
    {
      transform: `translateX(calc(${direction} * ${distance}))`,
      opacity: distance === "100%" ? 1 : 0.35,
    },
    { transform: "translateX(0)", opacity: 1 },
  ]);
}

const frameTasks = new WeakMap();

function runFrames(node, duration, update) {
  cancelAnimationFrame(frameTasks.get(node));
  const start = performance.now();
  const tick = (now) => {
    const progress = reducedMotion.matches
      ? 1
      : Math.min(1, (now - start) / duration);
    update(progress);
    if (progress < 1 && node.isConnected) {
      frameTasks.set(node, requestAnimationFrame(tick));
    } else {
      frameTasks.delete(node);
    }
  };
  frameTasks.set(node, requestAnimationFrame(tick));
}

function nextIndex(demo, length) {
  const index = (Number(demo.dataset.index || 0) + 1) % length;
  demo.dataset.index = index;
  return index;
}

function numberChange(demo) {
  const value = demo.querySelector(".mp-value");
  const sliding = demo.dataset.mpExample === "sliding-number";
  const values = sliding ? minutes : counts;
  const previous = Number(demo.dataset.index || 0);
  const next = values[nextIndex(demo, values.length)];
  const announcement = demo.querySelector(".mp-announcement");
  announcement.textContent =
    numberFormat.format(next) + (sliding ? t("分钟", " min") : t("元", " CNY"));
  if (sliding) {
    const oldDigits = String(values[previous]);
    const direction = Math.sign(next - values[previous]);
    value.innerHTML = glyphs(String(next));
    if (moves(demo)) {
      Array.from(value.children).forEach((digit, index) => {
        if (digit.textContent === oldDigits[index]) return;
        const newDigit = digit.textContent;
        const strip = document.createElement("span");
        strip.className = "mp-digit-strip";
        strip.innerHTML = glyphs(
          direction > 0
            ? oldDigits[index] + newDigit
            : newDigit + oldDigits[index],
        );
        digit.replaceChildren(strip);
        const path = direction > 0 ? [0, -50] : [-50, 0];
        const motion = animate(
          strip,
          path.map((y) => ({ transform: `translateY(${y}%)` })),
          { fill: "both" },
        );
        motion.onfinish = () => {
          digit.textContent = newDigit;
        };
      });
    }
    return;
  }
  const start = Number(value.textContent.replaceAll(",", ""));
  cancelAnimationFrame(frameTasks.get(value));
  if (!moves(demo)) {
    value.textContent = numberFormat.format(next);
    return;
  }
  runFrames(value, 720, (progress) => {
    const eased = 1 - (1 - progress) ** 3;
    value.textContent = numberFormat.format(
      Math.round(start + (next - start) * eased),
    );
  });
}

function morphText(display, text) {
  const old = Array.from(display.children, (node) => ({
    node,
    letter: node.textContent,
    rect: node.getBoundingClientRect(),
  }));
  const parent = display.getBoundingClientRect();
  const remaining = [...old];
  const next = Array.from(text, (char) => {
    const index = remaining.findIndex(({ letter }) => letter === char);
    if (index >= 0) return remaining.splice(index, 1)[0].node;
    const node = document.createElement("span");
    node.textContent = char;
    return node;
  });
  display.replaceChildren(...next);
  for (const { node } of old) activeMotion.get(node)?.cancel();
  const positions = next.map((node) => node.getBoundingClientRect());
  next.forEach((node, index) => {
    const from = old.find((entry) => entry.node === node)?.rect;
    animate(
      node,
      from
        ? [
            { transform: `translateX(${from.left - positions[index].left}px)` },
            { transform: "translateX(0)" },
          ]
        : [
            { transform: "translateY(10px)", opacity: 0 },
            { transform: "translateY(0)", opacity: 1 },
          ],
      { duration: 640 },
    );
  });
  remaining.forEach(({ node, rect }) => {
    const ghost = node.cloneNode(true);
    ghost.className = "mp-glyph-ghost";
    ghost.style.left = `${rect.left - parent.left}px`;
    display.append(ghost);
    animate(
      ghost,
      [{ opacity: 1 }, { opacity: 0, transform: "translateY(-10px)" }],
      { duration: 280, fill: "forwards" },
    ).onfinish = () => ghost.remove();
  });
}

function changeText(demo, control) {
  const id = demo.dataset.mpExample;
  const display = demo.querySelector(".mp-text");
  const live = demo.querySelector(".mp-announcement");
  const choices = words[id];
  const previous = live.textContent;
  const next = choices
    ? choices[nextIndex(demo, choices.length)]
    : id === "text-shimmer"
      ? previous === t("正在导出", "Exporting")
        ? t("等待导出", "Waiting to export")
        : t("正在导出", "Exporting")
      : previous;
  live.textContent = next;
  if (id === "text-shimmer")
    control.textContent = next === t("正在导出", "Exporting") ? t("结束导出", "Finish export") : t("开始导出", "Start export");
  if (id === "text-morph") {
    display
      .querySelectorAll(".mp-glyph-ghost")
      .forEach((ghost) => ghost.remove());
    if (moves(demo)) morphText(display, next);
    else display.innerHTML = glyphs(next);
    return;
  }
  if (id === "text-scramble") {
    cancelAnimationFrame(frameTasks.get(display));
    display.textContent = next;
    if (!moves(demo)) return;
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    runFrames(display, 680, (progress) => {
      display.textContent = Array.from(next, (char, index) =>
        index < Math.floor(progress * next.length)
          ? char
          : alphabet[Math.floor(Math.random() * alphabet.length)],
      ).join("");
    });
    return;
  }
  if (id === "text-loop") {
    display.textContent = next;
    if (!moves(demo)) return;
    display.innerHTML = `<span class="mp-loop-strip"><span>${previous}</span><span>${next}</span></span>`;
    animate(
      display.firstElementChild,
      [{ transform: "translateY(0)" }, { transform: "translateY(-50%)" }],
      { fill: "both", duration: 520 },
    ).onfinish = () => {
      display.textContent = next;
    };
    return;
  }
  if (id === "text-roll") {
    display.innerHTML = glyphs(next);
    if (!moves(demo)) return;
    Array.from(display.children).forEach((glyph, index) => {
      const letter = glyph.textContent;
      glyph.innerHTML = `<span class="mp-roll-front">${previous[index]}</span><span class="mp-roll-back">${letter}</span>`;
      animate(
        glyph,
        [{ transform: "rotateX(0)" }, { transform: "rotateX(-180deg)" }],
        { duration: 470, delay: index * 75, fill: "both" },
      );
    });
    return;
  }
  if (id === "text-shimmer") {
    display.textContent = next;
    if (next === t("正在导出", "Exporting") && moves(demo)) {
      display.classList.add("mp-sheen");
      animate(
        display,
        [{ backgroundPosition: "175% 0" }, { backgroundPosition: "-75% 0" }],
        { duration: 1000 },
      ).onfinish = () => display.classList.remove("mp-sheen");
    } else {
      activeMotion.get(display)?.cancel();
      display.classList.remove("mp-sheen");
    }
    return;
  }
  const wave = id === "text-shimmer-wave";
  const keyframes = wave
    ? [
        { color: "var(--ink)" },
        { color: "var(--mp-text-highlight)", offset: 0.45 },
        { color: "var(--ink)" },
      ]
    : [
        { opacity: 0, transform: "translateY(13px)" },
        { opacity: 1, transform: "translateY(0)" },
      ];
  const nodes = moves(demo) ? Array.from(display.children) : [display];
  nodes.forEach((node, index) => {
    animate(
      node,
      moves(demo) || wave
        ? keyframes
        : [{ opacity: 0 }, { opacity: 0, offset: 0.99 }, { opacity: 1 }],
      {
        duration: reducedMotion.matches ? 0 : wave ? 560 : 440,
        delay: index * 100,
        fill: "backwards",
      },
    );
  });
}

function updatePointer(demo, target, x, y) {
  if (!moves(demo)) return;
  target.style.setProperty("--x", `${x * 100}%`);
  target.style.setProperty("--y", `${y * 100}%`);
  target.style.setProperty("--pull-x", `${(x - 0.5) * 24}px`);
  target.style.setProperty("--pull-y", `${(y - 0.5) * 16}px`);
  target.style.setProperty("--tilt-x", `${(0.5 - y) * 28}deg`);
  target.style.setProperty("--tilt-y", `${(x - 0.5) * 34}deg`);
  if (demo.dataset.mpExample === "cursor") {
    demo.querySelector(".mp-status").textContent =
      `${Math.round(x * 100)}%，${Math.round(y * 100)}%`;
  }
}

function setStatus(demo, text) {
  demo.querySelector(".mp-status").textContent = text;
}

const actions = {
  expand(demo, control) {
    const group = control.closest(".mp-expander");
    const expanded = control.getAttribute("aria-expanded") === "false";
    if (expanded && demo.dataset.mpExample === "accordion") {
      demo
        .querySelectorAll(".mp-expander.is-expanded")
        .forEach((other) => setExpanded(other, false));
    }
    setExpanded(group, expanded);
  },
  select: switchView,
  open(demo) {
    const dialog = demo.querySelector("dialog");
    dialog.showModal();
    if (moves(demo))
      animate(dialog, [
        { opacity: 0, transform: "translateY(32px) scale(.96)" },
        { opacity: 1, transform: "translateY(0) scale(1)" },
      ]);
  },
  group(demo, control) {
    const records = demo.querySelector(".mp-records");
    records.hidden = !records.hidden;
    control.textContent = records.hidden ? t("显示记录", "Show records") : t("清空记录", "Clear records");
    control.setAttribute("aria-expanded", String(!records.hidden));
    if (!records.hidden && moves(demo)) {
      Array.from(records.children).forEach((node, index) =>
        animate(
          node,
          [
            { opacity: 0, transform: "translateX(-22px)" },
            { opacity: 1, transform: "translateX(0)" },
          ],
          { delay: index * 145, fill: "backwards" },
        ),
      );
    }
  },
  number: numberChange,
  text: changeText,
  play(demo, control) {
    const playing = demo.classList.toggle("is-playing");
    control.setAttribute("aria-pressed", String(playing));
    control.textContent = playing ? t("暂停", "Pause") : t("播放", "Play");
  },
  trail(demo) {
    const trail = demo.querySelector(".mp-trail");
    if (moves(demo)) {
      animate(
        trail.querySelector("i"),
        [
          { transform: "rotate(0turn)", opacity: 1 },
          { transform: "rotate(1turn)", opacity: 1 },
        ],
        { duration: 1400, easing: "linear" },
      );
    } else {
      animate(
        trail,
        [
          { borderColor: "#387590" },
          { borderColor: "#387590" },
          { borderColor: "var(--brand-border)" },
        ],
        { duration: reducedMotion.matches ? 0 : 1400 },
      );
    }
  },
  pointer(demo) {
    const target = demo.querySelector("[data-mp-pointer]");
    const [x, y] = nextIndex(demo, 2) ? [0.78, 0.32] : [0.24, 0.7];
    updatePointer(demo, target, x, y);
    if (!moves(demo) && demo.dataset.mpExample === "cursor")
      setStatus(demo, "50%，50%");
  },
  save(demo) {
    setStatus(demo, t("已保存草稿", "Draft saved"));
  },
  style(demo, control) {
    const pressed = control.getAttribute("aria-pressed") === "false";
    control.setAttribute("aria-pressed", String(pressed));
    control
      .closest(".mp-view")
      .querySelector(".mp-tool-sample")
      .classList.toggle(`mp-style-${control.dataset.style}`, pressed);
  },
  async copy(demo) {
    try {
      await navigator.clipboard.writeText(location.href);
      setStatus(demo, t("已复制案例链接", "Case link copied"));
    } catch {
      setStatus(demo, t("可从浏览器地址栏复制案例链接", "Copy the case link from the browser’s address bar."));
    }
  },
  export(demo) {
    const file = new Blob([t("项目简报\n共享范围 · 仅团队\n", "Project brief\nSharing · Team only\n")], {
      type: "text/plain;charset=utf-8",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = t("项目简报.txt", "Project Brief.txt");
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    setStatus(demo, t("已导出示例简报", "Sample brief exported"));
  },
  dock(demo, control) {
    demo
      .querySelectorAll(".mp-dock button")
      .forEach((item) =>
        item.setAttribute("aria-pressed", String(control === item)),
      );
    setStatus(demo, `${t("已打开", "Open")}${control.getAttribute("aria-label")}`);
  },
  glow(demo, control) {
    const active = demo.classList.toggle("is-lit");
    control.setAttribute("aria-pressed", String(active));
    control.textContent = active ? t("关灯", "Turn light off") : t("开灯", "Turn light on");
  },
};

let observers = [];

export function prepareMotionExamples(main) {
  observers.forEach((observer) => observer.disconnect());
  observers = [];
  for (const root of main.querySelectorAll(
    '.mp-in-view[data-after="true"] .mp-scroll',
  )) {
    if (root.closest("[inert]")) continue;
    const target = root.querySelector(".mp-in-view-target");
    const observer = new IntersectionObserver(
      (entries) => target.classList.toggle("is-in-view", entries.at(-1).isIntersecting),
      { root, rootMargin: "0px 0px -72px 0px" },
    );
    observer.observe(target);
    observers.push(observer);
  }
  const loops = Array.from(
    main.querySelectorAll(".mp-spinning-text, .mp-infinite-slider"),
  ).filter((demo) => !demo.closest("[inert]"));
  if (loops.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) =>
        target.classList.toggle("is-onscreen", isIntersecting),
      );
    });
    loops.forEach((demo) => observer.observe(demo));
    observers.push(observer);
  }
}

export function installMotionExamples(main) {
  main.addEventListener("click", (event) => {
    const control = event.target.closest("[data-mp-action]");
    const demo = control?.closest("[data-mp-example]");
    if (demo) actions[control.dataset.mpAction](demo, control);
  });
  main.addEventListener("input", (event) => {
    if (event.target.matches("[data-mp-range]")) {
      event.target
        .closest("[data-mp-example]")
        .style.setProperty("--split", `${event.target.value}%`);
      event.target
        .closest("[data-mp-example]")
        .classList.toggle("is-cool", event.target.value >= 50);
    }
  });
  main.addEventListener(
    "scroll",
    (event) => {
      const root = event.target;
      if (!root.matches?.("[data-mp-scroll]")) return;
      const demo = root.closest("[data-mp-example]");
      const end = root.scrollHeight - root.clientHeight;
      const progress =
        end > 0 ? Math.min(1, Math.max(0, root.scrollTop / end)) : 1;
      const value = demo.querySelector(".mp-percent");
      if (value) {
        const hasTimeline =
          CSS.supports("animation-timeline: --mp-reading") &&
          !reducedMotion.matches;
        const percent =
          demo.dataset.after === "true"
            ? Math.round(progress * 100)
            : Math.floor(progress * 4) * 25;
        if (demo.dataset.after === "true" && !hasTimeline) {
          demo.querySelector(".mp-progress span").style.transform =
            `scaleX(${progress})`;
        }
        value.textContent = `${percent}%`;
      }
      if (demo.dataset.mpExample === "progressive-blur")
        demo.classList.toggle("is-at-end", progress >= 0.99);
    },
    true,
  );
  main.addEventListener("pointermove", (event) => {
    const target = event.target.closest("[data-mp-pointer]");
    const demo = target?.closest("[data-mp-example]");
    if (!demo || !moves(demo)) return;
    const bounds = target.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    updatePointer(
      demo,
      target,
      Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width)),
      Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height)),
    );
  });
  main.addEventListener("pointerout", (event) => {
    const target = event.target.closest("[data-mp-pointer]");
    if (target && !target.contains(event.relatedTarget)) {
      updatePointer(target.closest("[data-mp-example]"), target, 0.5, 0.5);
    }
  });
}
