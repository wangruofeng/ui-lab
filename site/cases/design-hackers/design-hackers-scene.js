const toggle = (name, label, checked = false) =>
  `<label class="hacker-control"><input type="checkbox" class="${name}" ${checked ? "checked" : ""}>${label}</label>`;

const disclosure = (label, value, open = false) =>
  `<details class="hacker-disclosure"${open ? " open" : ""}><summary>${label}</summary><p>${value}</p></details>`;

const productCopies = {
  "design-purpose": [
    "预约日期",
    "11 月 28 日",
    "上午还有两个时段。",
    "查看可预约时段",
    "探索更多",
  ],
  "visual-purpose": [
    "日期范围",
    "本周",
    "导出会包含本周公开篇目。",
    "导出篇目",
    "体验创作空间",
  ],
  "wireframe-purpose": [
    "清单名称",
    "沿海读物",
    "保存后仅自己可见。",
    "保存清单",
    "开始旅程",
  ],
  "aqua-material": [
    "外观名称",
    "浅色模式",
    "适用于此设备。",
    "应用外观",
    "应用外观",
  ],
  "semantic-search": [
    "搜索主题",
    "文字排版",
    "匹配到两次公开工作坊。",
    "搜索工作坊",
    "发现更多",
  ],
};

const fontSamples = {
  "comic-texture": [
    "Light across the bay",
    "Harbour news travels slowly. We follow the water and leave a little room to read.",
    "收紧词间隙，观察文字颜色",
  ],
  "small-screen-type": [
    "I1l · O0 · ae",
    "Status 18:40 · Room B3",
    "查看更小字号",
  ],
  "type-medium": ["ROMA · AE · M", "Trajan, brush and stone.", "放大观察笔画"],
  "font-pair": [
    "The Field Journal",
    "A weekly collection of places to read, walk and meet.",
    "放大看标题与正文",
  ],
  "real-italic": [
    "a f g · A Field Note",
    "The bay is quiet at dawn.",
    "放大观察字形",
  ],
  "no-stretch": ["OPEN STUDIOS", "Saturday · 10 a.m.", "放大观察比例"],
  "left-align": [
    "Harbour notes",
    "Walk past the first gate and follow the lower path. The footbridge is open early in the morning but closes before dark.",
    "收窄文字栏",
  ],
};

const dataPalettes = {
  "categorical-colors": {
    labels: ["阅读", "实操", "访谈", "评论", "资源"],
    before: ["#2d1837", "#9fcdd5", "#efe6a1", "#cb7b6b", "#e7edd8"],
    after: ["#a67b9c", "#5e9ca5", "#b7974d", "#bc8268", "#79a16e"],
  },
  "ordered-colors": {
    labels: ["100", "200", "300", "400", "500"],
    before: ["#bcb6da", "#5e6eaa", "#9690ca", "#493d92", "#443589"],
    after: ["#dcebf2", "#a8cddc", "#6da6bc", "#377888", "#214b63"],
  },
  "diverging-colors": {
    labels: ["−20", "−10", "0", "+10", "+20"],
    before: ["#eee6d5", "#d6af8b", "#b57b63", "#804c52", "#4d304b"],
    after: ["#a84835", "#ddab88", "#f3f0e9", "#9dc2cc", "#286c82"],
  },
};

const pagePalettes = {
  "color-conventions": ["#fff5ef", "#333334", "#f7e8d3", "#923a2b"],
  "color-depth": ["#e4ecf2", "#273b48", "#d4e1e9", "#a4462f"],
  "warm-ink": ["#f7f4ef", "#4b3c31", "#f0ede7", "#4d5b63"],
  "mono-scheme": ["#e8f0f5", "#223b4a", "#d4e3ec", "#315f79"],
  "analogous-scheme": ["#eaf0e3", "#243e31", "#d6e8dd", "#41685f"],
  "complement-scheme": ["#e8eff6", "#243952", "#d7e4f0", "#93471e"],
  "split-triad": ["#f2ebf4", "#362e55", "#e6deec", "#475f3e"],
  "color-mood": ["#f2eee3", "#3d3827", "#e8e1d0", "#7d543a"],
};

function productScene({ id }, after) {
  const [name, value, context, primary, vague] = productCopies[id];
  return `<form class="hacker-product" data-demo-form>
    ${!after ? '<div class="hacker-product-decoration">欢迎体验</div>' : ""}
    <label><span>${name}</span><input value="${value}" required></label>
    <p>${context}</p>
    <button class="mock-button" type="submit">${after ? primary : vague}</button>
    <p class="demo-feedback" role="status"></p>
  </form>`;
}

function feedScene({ id }) {
  const items =
    id === "timeline-context"
      ? [
          ["文件已更新", "晨会记录补充了负责人和截止时间。"],
          ["新增设计稿", "新版包含空状态与失败提示。"],
          ["发布前检查", "团队将在 17:00 一起完成校验。"],
        ]
      : [
          ["本周专题：为什么要留白", "从三组版面对照读懂留白的作用。"],
          ["排版练习", "用真实段落检查窄栏的可读性。"],
          ["下周预告", "如何为定量图表选择色阶。"],
        ];
  return `<div class="hacker-feed">${items.map(([title, content], index) => disclosure(title, content, id === "timeline-context" && index === 0)).join("")}</div>`;
}

const typeNotes = {
  "comic-texture": ["宽松词距，行内深浅不均", "均匀词距，段落更连续"],
  "small-screen-type": ["相似字符挤在一起", "小字号下仍能分辨字符"],
  "type-medium": ["等粗笔画", "粗细笔画与衬线"],
  "font-pair": ["标题和正文使用相同字重", "衬线标题搭配轻量无衬线正文"],
  "real-italic": ["把正体轮廓直接倾斜", "字体内置的斜体字形"],
  "no-stretch": ["将字形压至原宽的 66%", "自然比例，通过字号适应宽度"],
  "left-align": ["强制两端对齐", "左对齐，保留自然词距"],
};

function typeScene({ id }, after) {
  const [sample, body, label] = fontSamples[id];
  return `${toggle("hacker-type-toggle", label)}
    <div class="hacker-type-sample" lang="en"><strong>${sample}</strong><p>${body}</p></div>
    <p class="hacker-compare-note">${typeNotes[id][Number(after)]}</p>`;
}

function ratioScene({ id }, after) {
  let preview;
  if (id === "ratio-crop") {
    preview = `<figure class="hacker-crop"><img src="./assets/mountains.jpg" alt="山谷、河流与远山"><figcaption>${after ? "3∶2 宽幅 · 保留两侧环境" : "1∶1 方形 · 裁掉两侧环境"}</figcaption></figure>`;
  } else if (id === "golden-ratio") {
    preview = `<div class="hacker-column-example">
      <div class="hacker-columns"><div><strong>沿岸步道</strong><p>从木桥出发，向岬角走一公里。</p></div><aside><strong>开放时间</strong><p>09:00–16:00</p></aside></div>
      <p class="hacker-compare-note">${after ? "宽屏按内容分配列宽，窄屏让侧栏换行" : "固定 1.618∶1，缩窄时两列一起变窄"}</p>
    </div>`;
  } else {
    preview = `<div class="hacker-folio"><div class="hacker-folio-text"><strong>山里两日</strong><p>沿着溪水的方向走，越过山脚的小桥，再顺着树荫回到村口。空气里有杉木和苔藓的味道。</p><p>午前抵达驿站。两扇木窗开向谷地，能听见河水和远处的鸟声。</p></div></div>`;
  }
  return `${toggle("hacker-narrow", "收窄预览")}${preview}`;
}

function compositionScene({ id }, after) {
  if (id === "figure-ground") {
    return `<div class="hacker-ground"><p>城市散步笔记 · 11 月</p>${disclosure("查看 3 条留言", "最新留言：老桥下的步道已经开放。")}</div>`;
  }
  return `${toggle("hacker-grid-toggle", "显示构图辅助线")}<div class="hacker-shapes" aria-label="${after ? "有明确动线和焦点的形体构图" : "位置与形态不统一的几何构图"}" role="img"><i></i><i></i><i></i><i></i><i></i></div>`;
}

const hierarchyControls = {
  "hierarchy-space": ["hacker-space-guides", "显示间距辅助线"],
  "hierarchy-weight": ["hacker-weight-zoom", "放大字号对照"],
  "hierarchy-ink": ["hacker-gray", "去色查看层级"],
  "hierarchy-rule": ["hacker-rule-guides", "标出分隔线"],
};

function hierarchyScene({ id }) {
  const control = toggle(...hierarchyControls[id]);
  return `${control}<div class="hacker-reading hacker-color-preview"><strong>城市中的慢行路线</strong><small>11 月 23 日 · 林雨</small><p>从河边到旧街，沿途有三个适合短暂停留的地点。</p><p>周末可看开放时间与到达方式。</p></div>`;
}

function tableScene() {
  return `${toggle("hacker-column-guides", "显示列对齐辅助线")}
  <table class="hacker-table"><thead><tr><th scope="col">分类</th><th scope="col">已完成</th><th scope="col">待处理</th></tr></thead><tbody>
  ${[
    ["文档", 38, 6],
    ["素材", 112, 19],
    ["审批", 9, 12],
  ]
    .map(
      ([name, done, todo], index) =>
        `<tr><th scope="row"><label><input type="checkbox" data-hacker-row="${index}"> ${name}</label></th><td>${done}</td><td>${todo}</td></tr>`,
    )
    .join("")}</tbody></table>`;
}

function colorCheckScene({ id }, after) {
  if (id === "color-constancy") {
    return `${toggle("hacker-reveal-ink", "显示样块色值")}<div class="hacker-luminance"><div><span><small>#808080</small></span></div><div><span><small>#808080</small></span></div></div>`;
  }
  if (id === "screen-print") {
    return `<div class="hacker-media"><div><i></i><span>屏幕蓝<br><small>RGB 预览</small></span></div><div><i></i><span>印刷蓝<br><small>${after ? "接近印刷用色的示意" : "直接沿用屏幕色"}</small></span></div></div>${disclosure("查看打样说明", "两栏是屏幕示意。出片前请用实际纸张、油墨和配置文件校样。")}`;
  }
  const states = [
    ["完成", "#5f8b60", "success"],
    ["待检查", "#a88336", "caution"],
    ["失败", "#9f5059", "failure"],
  ];
  return `${toggle("hacker-gray", "灰阶预览")}<div class="hacker-status hacker-color-preview">${states.map(([label, color, icon]) => `<div><i style="--sample:${color}" aria-hidden="true">${after ? `<span class="hacker-status-symbol hacker-status-symbol--${icon}"></span>` : ""}</i>${after ? `<span>${label}</span>` : "<span>状态</span>"}</div>`).join("")}</div>`;
}

function dataColorScene({ id }, after) {
  const { labels, before, after: cleaned } = dataPalettes[id];
  return `${toggle("hacker-gray", "灰阶预览")}<div class="hacker-swatch-strip hacker-color-preview">${(after ? cleaned : before).map((color, index) => `<div><i style="--sample:${color}" aria-hidden="true"></i><span>${labels[index]}</span></div>`).join("")}</div>`;
}

function channelScene(_item, after) {
  return `<div class="hacker-channel-controls">${toggle("hacker-red", "红", true)}${toggle("hacker-green", "绿", true)}${toggle("hacker-blue", "蓝", true)}</div>
    <div class="hacker-channel-view"><i></i><i></i><i></i>${after ? '<div class="hacker-mix"></div><small class="hacker-mix-label">RGB 叠加结果</small>' : ""}</div>`;
}

const paletteExamples = {
  "color-conventions": [
    "预约状态",
    "周五 · 下午 2 点",
    "尚未确认，请在今天 18:00 前确认。",
    "确认预约",
    "确认后将收到场地和时间说明。",
  ],
  "color-depth": [
    "场馆开放",
    "主展厅 · 一楼",
    "本周开放两场导览。",
    "查看导览",
    "周五与周六 14:00 · 一楼集合。",
  ],
  "warm-ink": [
    "给读者的便笺",
    "11 月 23 日 · 林雨",
    "周末的阅读路线已补充两处安静的停留点。",
    "查看补充位置",
    "旧桥下与社区图书室均可休息。",
  ],
  "mono-scheme": [
    "每周航海读物",
    "第 12 期 · 灯塔",
    "从航标、潮汐和古地图认识沿海。",
    "打开阅读清单",
    "本期共三篇，约 20 分钟。",
  ],
  "analogous-scheme": [
    "初冬乡野",
    "本周路线 · 2.5 km",
    "从水田边穿过竹林，最后到达旧村。",
    "查看路线",
    "从白石桥起步，步行约一小时。",
  ],
  "complement-scheme": [
    "河边活动日",
    "周六 · 开放报名",
    "留意有风路段，带上饮水。",
    "查看报名时间",
    "本周六 10:00 · 南岸入口登记。",
  ],
  "split-triad": [
    "工作室开放日",
    "周日 · 三场活动",
    "上午参观工坊，下午有手工体验。",
    "查看日程",
    "10:00 参观 · 14:00 体验。",
  ],
  "color-mood": [
    "本周食谱",
    "栗子与菌菇 · 约 30 分钟",
    "先烘烤栗子，再与菌菇一起慢炖。",
    "查看食材",
    "栗子 150 g · 菌菇 200 g。",
  ],
};

function paletteScene({ id }, after) {
  const [heading, meta, body, action, details] = paletteExamples[id];
  const [bg, ink, panel, accent] = after
    ? pagePalettes[id]
    : ["#f6dbeb", "#53265d", "#f9e7a3", "#8a439c"];
  const style = `--paper:${bg};--sample-ink:${ink};--panel:${panel};--sample-accent:${accent}`;
  if (id === "warm-ink") {
    return `${toggle("hacker-gray", "灰阶预览")}<div class="hacker-tone hacker-color-preview">
      <strong>${heading}</strong><small>${meta}</small><p>${body}</p>${disclosure(action, details)}
    </div>`;
  }
  return `${toggle("hacker-gray", "灰阶预览")}<div class="hacker-color-preview">
      <div class="hacker-palette" style="${style}">
        <header><small>${meta}</small><strong>${heading}</strong></header><p>${body}</p>${disclosure(action, details)}
      </div>
      <div class="hacker-palette-key" style="${style}"><span>底色</span><span>信息区</span><span>操作</span></div>
    </div>`;
}

function proofScene(_item, after) {
  const tokens = after ? ["“", "”", "’", "′", "″"] : ['"', '"', "'", "'", '"'];
  const [open, close, apostrophe, feet, inches] = tokens.map(
    (token) => `<mark>${token}</mark>`,
  );
  return `${toggle("hacker-type-toggle", "放大校样")}<div class="hacker-type-sample hacker-proof" lang="en">
    <p>${open}Look closely,${close} she said.</p>
    <p>Ada${apostrophe}s notebook</p>
    <p>5${feet} 6${inches}</p>
  </div>`;
}

const layouts = {
  product: productScene,
  feed: feedScene,
  type: typeScene,
  ratio: ratioScene,
  composition: compositionScene,
  hierarchy: hierarchyScene,
  table: tableScene,
  "color-check": colorCheckScene,
  "data-color": dataColorScene,
  channels: channelScene,
  palette: paletteScene,
  proof: proofScene,
};

export function renderDesignHackers(item, after) {
  return `<article class="widget hacker-demo hacker-${item.layout}"><h4>${item.scene}</h4>${layouts[item.layout](item, after)}</article>`;
}
