import { t } from "../../app/locale.js";

const toggle = (name, label, checked = false) =>
  `<label class="hacker-control"><input type="checkbox" class="${name}" ${checked ? "checked" : ""}>${label}</label>`;

const disclosure = (label, value, open = false) =>
  `<details class="hacker-disclosure"${open ? " open" : ""}><summary>${label}</summary><p>${value}</p></details>`;

const productCopies = {
  "design-purpose": [
    t("预约日期", "Booking date"),
    t("11 月 28 日", "Nov 28"),
    t("上午还有两个时段。", "Two morning slots are still available."),
    t("查看可预约时段", "View available slots"),
    t("探索更多", "Explore more"),
  ],
  "visual-purpose": [
    t("日期范围", "Date range"),
    t("本周", "This week"),
    t("导出会包含本周公开篇目。", "The export includes this week's public articles."),
    t("导出篇目", "Export articles"),
    t("体验创作空间", "Explore the creative workspace"),
  ],
  "wireframe-purpose": [
    t("清单名称", "List name"),
    t("沿海读物", "Coastal reads"),
    t("保存后仅自己可见。", "Only you can see this list after saving."),
    t("保存清单", "Save list"),
    t("开始旅程", "Start your journey"),
  ],
  "aqua-material": [
    t("外观名称", "Appearance"),
    t("浅色模式", "Light mode"),
    t("适用于此设备。", "Applies to this device."),
    t("应用外观", "Apply appearance"),
    t("应用外观", "Apply appearance"),
  ],
  "semantic-search": [
    t("搜索主题", "Search topics"),
    t("文字排版", "Typography"),
    t("匹配到两次公开工作坊。", "Found two public workshops."),
    t("搜索工作坊", "Search workshops"),
    t("发现更多", "Discover more"),
  ],
};

const fontSamples = {
  "comic-texture": [
    "Light across the bay",
    "Harbour news travels slowly. We follow the water and leave a little room to read.",
    t("收紧词间隙，观察文字颜色", "Tighten word spacing and compare the density of the text"),
  ],
  "small-screen-type": [
    "I1l · O0 · ae",
    "Status 18:40 · Room B3",
    t("查看更小字号", "Preview smaller text"),
  ],
  "type-medium": ["ROMA · AE · M", "Trajan, brush and stone.", t("放大观察笔画", "Zoom in on strokes")],
  "font-pair": [
    "The Field Journal",
    "A weekly collection of places to read, walk and meet.",
    t("放大看标题与正文", "Zoom in on heading and body text"),
  ],
  "real-italic": [
    "a f g · A Field Note",
    "The bay is quiet at dawn.",
    t("放大观察字形", "Zoom in on letterforms"),
  ],
  "no-stretch": ["OPEN STUDIOS", "Saturday · 10 a.m.", t("放大观察比例", "Zoom in on proportions")],
  "left-align": [
    "Harbour notes",
    "Walk past the first gate and follow the lower path. The footbridge is open early in the morning but closes before dark.",
    t("收窄文字栏", "Narrow the text column"),
  ],
};

const dataPalettes = {
  "categorical-colors": {
    labels: [t("阅读", "Reading"), t("实操", "Practice"), t("访谈", "Interviews"), t("评论", "Reviews"), t("资源", "Resources")],
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
    ${!after ? `<div class="hacker-product-decoration">${t("欢迎体验", "Welcome")}</div>` : ""}
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
          [t("文件已更新", "Files updated"), t("晨会记录补充了负责人和截止时间。", "The morning meeting notes now list owners and deadlines.")],
          [t("新增设计稿", "New design draft"), t("新版包含空状态与失败提示。", "This version includes empty states and error messages.")],
          [t("发布前检查", "Pre-release checks"), t("团队将在 17:00 一起完成校验。", "The team will run the checks together at 17:00.")],
        ]
      : [
          [t("本周专题：为什么要留白", "This week's feature: Why whitespace matters"), t("从三组版面对照读懂留白的作用。", "See what whitespace does in three layout comparisons.")],
          [t("排版练习", "Typography exercise"), t("用真实段落检查窄栏的可读性。", "Test narrow-column readability with real paragraphs.")],
          [t("下周预告", "Coming next week"), t("如何为定量图表选择色阶。", "How to choose a color ramp for a quantitative chart.")],
        ];
  return `<div class="hacker-feed">${items.map(([title, content], index) => disclosure(title, content, id === "timeline-context" && index === 0)).join("")}</div>`;
}

const typeNotes = {
  "comic-texture": [t("宽松词距，行内深浅不均", "Loose word spacing creates uneven text density"), t("均匀词距，段落更连续", "Even word spacing gives the paragraph a consistent texture")],
  "small-screen-type": [t("相似字符挤在一起", "Similar characters run together"), t("小字号下仍能分辨字符", "Characters remain distinct at small sizes")],
  "type-medium": [t("等粗笔画", "Uniform stroke weight"), t("粗细笔画与衬线", "Stroke contrast and serifs")],
  "font-pair": [t("标题和正文使用相同字重", "Heading and body text share the same weight"), t("衬线标题搭配轻量无衬线正文", "Serif heading and lightweight sans-serif body")],
  "real-italic": [t("把正体轮廓直接倾斜", "Slanted upright letterforms"), t("字体内置的斜体字形", "True italics designed for the typeface")],
  "no-stretch": [t("将字形压至原宽的 66%", "Letterforms squeezed to 66% of their original width"), t("自然比例，通过字号适应宽度", "Natural proportions with a smaller font size")],
  "left-align": [t("强制两端对齐", "Forced justification"), t("左对齐，保留自然词距", "Left alignment with natural word spacing")],
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
    preview = `<figure class="hacker-crop"><img data-fade-on-load src="./assets/mountains.jpg" alt="${t("山谷、河流与远山", "Valley, river, and distant mountains")}"><figcaption>${after ? t("3∶2 宽幅 · 保留两侧环境", "3∶2 landscape · Keeps the surroundings") : t("1∶1 方形 · 裁掉两侧环境", "1∶1 square · Crops the surroundings")}</figcaption></figure>`;
  } else if (id === "golden-ratio") {
    preview = `<div class="hacker-column-example">
      <div class="hacker-columns"><div><strong>${t("沿岸步道", "Coastal trail")}</strong><p>${t("从木桥出发，向岬角走一公里。", "Start at the wooden bridge and walk one kilometer toward the headland.")}</p></div><aside><strong>${t("开放时间", "Opening hours")}</strong><p>09:00–16:00</p></aside></div>
      <p class="hacker-compare-note">${after ? t("宽屏按内容分配列宽，窄屏让侧栏换行", "Content sets column widths on wide screens and the sidebar wraps on narrow screens") : t("固定 1.618∶1，缩窄时两列一起变窄", "Fixed 1.618∶1 split narrows both columns together")}</p>
    </div>`;
  } else {
    preview = `<div class="hacker-folio"><div class="hacker-folio-text"><strong>${t("山里两日", "Two Days in the Mountains")}</strong><p>${t("沿着溪水的方向走，越过山脚的小桥，再顺着树荫回到村口。空气里有杉木和苔藓的味道。", "Follow the stream, cross the little bridge at the foot of the mountain, and take the shaded path back to the village. The air smells of cedar and moss.")}</p><p>${t("午前抵达驿站。两扇木窗开向谷地，能听见河水和远处的鸟声。", "We reached the inn before noon. Two wooden windows opened onto the valley, where we could hear the river and distant birds.")}</p></div></div>`;
  }
  return `${toggle("hacker-narrow", t("收窄预览", "Narrow preview"))}${preview}`;
}

function compositionScene({ id }, after) {
  if (id === "figure-ground") {
    return `<div class="hacker-ground"><p>${t("城市散步笔记 · 11 月", "City Walk Notes · November")}</p>${disclosure(t("查看 3 条留言", "View 3 comments"), t("最新留言：老桥下的步道已经开放。", "Latest comment: The trail under the old bridge is open."))}</div>`;
  }
  return `${toggle("hacker-grid-toggle", t("显示构图辅助线", "Show composition guides"))}<div class="hacker-shapes" aria-label="${after ? t("有明确动线和焦点的形体构图", "Shapes with a clear visual path and focal point") : t("位置与形态不统一的几何构图", "Geometric shapes with inconsistent placement and form")}" role="img"><i></i><i></i><i></i><i></i><i></i></div>`;
}

const hierarchyControls = {
  "hierarchy-space": ["hacker-space-guides", t("显示间距辅助线", "Show spacing guides")],
  "hierarchy-weight": ["hacker-weight-zoom", t("放大字号对照", "Enlarge type for comparison")],
  "hierarchy-ink": ["hacker-gray", t("去色查看层级", "View hierarchy in grayscale")],
  "hierarchy-rule": ["hacker-rule-guides", t("标出分隔线", "Highlight the divider")],
};

function hierarchyScene({ id }) {
  const control = toggle(...hierarchyControls[id]);
  return `${control}<div class="hacker-reading hacker-color-preview"><strong>${t("城市中的慢行路线", "Slow routes through the city")}</strong><small>${t("11 月 23 日 · 林雨", "Nov 23 · Lin Yu")}</small><p>${t("从河边到旧街，沿途有三个适合短暂停留的地点。", "There are three places to pause along the way from the river to the old street.")}</p><p>${t("周末可看开放时间与到达方式。", "Check opening hours and directions for the weekend.")}</p></div>`;
}

function tableScene() {
  return `${toggle("hacker-column-guides", t("显示列对齐辅助线", "Show column alignment guides"))}
  <table class="hacker-table"><thead><tr><th scope="col">${t("分类", "Category")}</th><th scope="col">${t("已完成", "Complete")}</th><th scope="col">${t("待处理", "Pending")}</th></tr></thead><tbody>
  ${[
    [t("文档", "Documents"), 38, 6],
    [t("素材", "Assets"), 112, 19],
    [t("审批", "Approvals"), 9, 12],
  ]
    .map(
      ([name, done, todo], index) =>
        `<tr><th scope="row"><label><input type="checkbox" data-hacker-row="${index}"> ${name}</label></th><td>${done}</td><td>${todo}</td></tr>`,
    )
    .join("")}</tbody></table>`;
}

function colorCheckScene({ id }, after) {
  if (id === "color-constancy") {
    return `${toggle("hacker-reveal-ink", t("显示样块色值", "Show swatch values"))}<div class="hacker-luminance"><div><span><small>#808080</small></span></div><div><span><small>#808080</small></span></div></div>`;
  }
  if (id === "screen-print") {
    return `<div class="hacker-media"><div><i></i><span>${t("屏幕蓝", "Screen blue")}<br><small>${t("RGB 预览", "RGB preview")}</small></span></div><div><i></i><span>${t("印刷蓝", "Print blue")}<br><small>${after ? t("接近印刷用色的示意", "Illustrative approximation of the print color") : t("直接沿用屏幕色", "Unchanged screen color")}</small></span></div></div>${disclosure(t("查看打样说明", "View proofing notes"), t("两栏是屏幕示意。出片前请用实际纸张、油墨和配置文件校样。", "Both columns are screen previews. Proof with the intended paper, ink, and color profile before production."))}`;
  }
  const states = [
    [t("完成", "Complete"), "#5f8b60", "success"],
    [t("待检查", "Needs review"), "#a88336", "caution"],
    [t("失败", "Failed"), "#9f5059", "failure"],
  ];
  return `${toggle("hacker-gray", t("灰阶预览", "Grayscale preview"))}<div class="hacker-status hacker-color-preview">${states.map(([label, color, icon]) => `<div><i style="--sample:${color}" aria-hidden="true">${after ? `<span class="hacker-status-symbol hacker-status-symbol--${icon}"></span>` : ""}</i>${after ? `<span>${label}</span>` : `<span>${t("状态", "Status")}</span>`}</div>`).join("")}</div>`;
}

function dataColorScene({ id }, after) {
  const { labels, before, after: cleaned } = dataPalettes[id];
  return `${toggle("hacker-gray", t("灰阶预览", "Grayscale preview"))}<div class="hacker-swatch-strip hacker-color-preview">${(after ? cleaned : before).map((color, index) => `<div><i style="--sample:${color}" aria-hidden="true"></i><span>${labels[index]}</span></div>`).join("")}</div>`;
}

function channelScene(_item, after) {
  return `<div class="hacker-channel-controls">${toggle("hacker-red", t("红", "Red"), true)}${toggle("hacker-green", t("绿", "Green"), true)}${toggle("hacker-blue", t("蓝", "Blue"), true)}</div>
    <div class="hacker-channel-view"><i></i><i></i><i></i>${after ? `<div class="hacker-mix"></div><small class="hacker-mix-label">${t("RGB 叠加结果", "Combined RGB output")}</small>` : ""}</div>`;
}

const paletteExamples = {
  "color-conventions": [
    t("预约状态", "Booking status"),
    t("周五 · 下午 2 点", "Fri · 2 p.m."),
    t("尚未确认，请在今天 18:00 前确认。", "Awaiting confirmation. Please confirm by 18:00 today."),
    t("确认预约", "Confirm booking"),
    t("确认后将收到场地和时间说明。", "You'll receive the venue and time after confirming."),
  ],
  "color-depth": [
    t("场馆开放", "Venue open"),
    t("主展厅 · 一楼", "Main gallery · Ground floor"),
    t("本周开放两场导览。", "Two guided tours are available this week."),
    t("查看导览", "View tours"),
    t("周五与周六 14:00 · 一楼集合。", "Fri and Sat at 14:00 · Meet on the ground floor."),
  ],
  "warm-ink": [
    t("给读者的便笺", "A note for readers"),
    t("11 月 23 日 · 林雨", "Nov 23 · Lin Yu"),
    t("周末的阅读路线已补充两处安静的停留点。", "We've added two quiet stops to the weekend reading route."),
    t("查看补充位置", "View the new stops"),
    t("旧桥下与社区图书室均可休息。", "There are places to rest under the old bridge and at the community library."),
  ],
  "mono-scheme": [
    t("每周航海读物", "Weekly Nautical Reads"),
    t("第 12 期 · 灯塔", "Issue 12 · Lighthouses"),
    t("从航标、潮汐和古地图认识沿海。", "Get to know the coast through navigation marks, tides, and old maps."),
    t("打开阅读清单", "Open reading list"),
    t("本期共三篇，约 20 分钟。", "Three articles in this issue · About 20 minutes"),
  ],
  "analogous-scheme": [
    t("初冬乡野", "Early Winter in the Countryside"),
    t("本周路线 · 2.5 km", "This week's route · 2.5 km"),
    t("从水田边穿过竹林，最后到达旧村。", "Cross the bamboo grove from the edge of the rice paddies to the old village."),
    t("查看路线", "View route"),
    t("从白石桥起步，步行约一小时。", "Start at White Stone Bridge and walk for about an hour."),
  ],
  "complement-scheme": [
    t("河边活动日", "Riverside Activity Day"),
    t("周六 · 开放报名", "Sat · Registration open"),
    t("留意有风路段，带上饮水。", "Watch for windy stretches and bring water."),
    t("查看报名时间", "View registration times"),
    t("本周六 10:00 · 南岸入口登记。", "Sat at 10:00 · Register at the south bank entrance."),
  ],
  "split-triad": [
    t("工作室开放日", "Open Studio Day"),
    t("周日 · 三场活动", "Sun · Three activities"),
    t("上午参观工坊，下午有手工体验。", "Tour the workshop in the morning and try a craft in the afternoon."),
    t("查看日程", "View schedule"),
    t("10:00 参观 · 14:00 体验。", "10:00 tour · 14:00 hands-on session"),
  ],
  "color-mood": [
    t("本周食谱", "This week's recipe"),
    t("栗子与菌菇 · 约 30 分钟", "Chestnuts and mushrooms · About 30 minutes"),
    t("先烘烤栗子，再与菌菇一起慢炖。", "Roast the chestnuts first, then simmer them with the mushrooms."),
    t("查看食材", "View ingredients"),
    t("栗子 150 g · 菌菇 200 g。", "150 g chestnuts · 200 g mushrooms"),
  ],
};

function paletteScene({ id }, after) {
  const [heading, meta, body, action, details] = paletteExamples[id];
  const [bg, ink, panel, accent] = after
    ? pagePalettes[id]
    : ["#f6dbeb", "#53265d", "#f9e7a3", "#8a439c"];
  const style = `--paper:${bg};--sample-ink:${ink};--panel:${panel};--sample-accent:${accent}`;
  if (id === "warm-ink") {
    return `${toggle("hacker-gray", t("灰阶预览", "Grayscale preview"))}<div class="hacker-tone hacker-color-preview">
      <strong>${heading}</strong><small>${meta}</small><p>${body}</p>${disclosure(action, details)}
    </div>`;
  }
  return `${toggle("hacker-gray", t("灰阶预览", "Grayscale preview"))}<div class="hacker-color-preview">
      <div class="hacker-palette" style="${style}">
        <header><small>${meta}</small><strong>${heading}</strong></header><p>${body}</p>${disclosure(action, details)}
      </div>
      <div class="hacker-palette-key" style="${style}"><span>${t("底色", "Background")}</span><span>${t("信息区", "Content panel")}</span><span>${t("操作", "Action")}</span></div>
    </div>`;
}

function proofScene(_item, after) {
  const tokens = after ? ["“", "”", "’", "′", "″"] : ['"', '"', "'", "'", '"'];
  const [open, close, apostrophe, feet, inches] = tokens.map(
    (token) => `<mark>${token}</mark>`,
  );
  return `${toggle("hacker-type-toggle", t("放大校样", "Zoom in on proof"))}<div class="hacker-type-sample hacker-proof" lang="en">
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
