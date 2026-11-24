import { renderMotionPrimitives } from "../cases/motion-primitives/motion-primitives.js";
import { renderDesignHackers } from "../cases/design-hackers/design-hackers-scene.js";
import { renderKillSlop } from "../cases/kill-ai-slop/kill-slop-scene.js";

const field = (name, value, type = "text") =>
  `<label class="field"><span>${name}</span><input type="${type}" value="${value}" required></label>`;
const button = (label, options = {}) =>
  `<button type="${options.type ?? "button"}" class="mock-button ${options.style ?? ""}"${options.action ? ` data-demo-action="${options.action}"` : ""}>${label}</button>`;
const feedback = '<p class="demo-feedback" role="status"></p>';

function flow({ id, scene }, after) {
  const examples = {
    feature: ["访客姓名", "林雨", "到访时间", "周三 14:00", "确认预约"],
    detail: ["电子邮箱", "lin@example.com", "访问权限", "可编辑", "发送邀请"],
    scope: [
      "日期",
      "周四 · 11 月 26 日",
      "时段",
      "14:00 – 15:00",
      "预订会议室",
    ],
    voice: ["报名人", "李诺", "同行人数", "2 人", "保存我的位置"],
    actions: ["成员", "周宁", "访问权限", "管理项目", "保存权限"],
    air: ["联系人", "周宁", "配送地址", "青石路 12 号", "保存地址"],
    group: [
      "接收邮箱",
      "lin@example.com",
      "通知时机",
      "包裹寄出时",
      "启用通知",
    ],
    native: ["项目更新", "✔ 接收邮件", "提醒频率", "每日摘要", "保存偏好"],
    practice: [
      "待观察的变量",
      "标题和说明的间隔",
      "记录的观察",
      "能否一眼找到主要操作",
      "保存观察",
    ],
  };
  const [first, value, second, choice, action] = examples[id];
  const top =
    id === "feature" && !after
      ? '<div class="mock-nav">概览　工作区　设置　关于</div>'
      : "";
  const extra =
    id === "scope" && !after
      ? field("重复规则", "每两周一次 · 无结束日期")
      : "";
  const tail =
    id === "actions"
      ? button(after ? "移除成员…" : "立即移除", {
          style: "danger",
          action: after ? "ask-remove" : "remove",
        })
      : "";
  const email = id === "detail" || id === "group";
  const firstField =
    id === "native"
      ? '<label class="field"><span>项目更新</span><span class="demo-check"><input type="checkbox" checked> 接收邮件</span></label>'
      : field(first, value, email ? "email" : "text");
  return `<form class="widget form-widget" data-demo-form>${top}<strong class="mock-title">${scene}</strong>${firstField}${field(second, choice)}${extra}
    <div class="mock-actions">${button(id === "voice" && !after ? "提交资料" : action, { type: "submit" })}${tail}</div>
    ${id === "actions" && after ? `<div class="demo-confirm" hidden><p>移除后，该成员将失去项目访问权限。</p>${button("确认移除", { style: "danger", action: "remove" })} ${button("取消", { action: "cancel-remove" })}</div>` : ""}
    ${feedback}</form>`;
}

function metric({ id, scene }, after) {
  const values = {
    priority: ["18", "GB 可用", "总容量 50 GB"],
    weight: ["¥128", "/ 月", "下次续费 · 12 月 1 日"],
    oncolor: ["268", "公里", "比上月多 42 公里"],
    quiet: ["支付完成", "", "收据已发送至邮箱"],
    labels: ["12", "个空位", "周六上午 · 手冲体验"],
    balance: ["7", "个文件", "还有 2 个等待上传"],
    baseline: ["24.8", "GB", "上周 · 20.2 GB"],
  };
  const [value, unit, hint] = values[id];
  return `<div class="widget metric-widget"><div class="metric-meta"><strong>${scene}</strong></div>
    <div class="metric-value">${id === "labels" && !after ? "<span>空位数量：</span>" : ""}<b>${value}</b><span>${id === "labels" && !after ? "" : unit}</span></div>
    <div class="metric-hint">${hint}</div>${id === "balance" ? '<div class="upload-meter" role="progressbar" aria-label="上传进度" aria-valuenow="78"></div>' : ""}</div>`;
}

function article({ id, scene }, after) {
  const lead = {
    semantic: "11 月应付金额",
    measure: "来访前请完成线上登记",
    scale: "团队文件支持批量导出",
    font: "访客编号 I1O0 · 09:40",
    line: "交接前整理共享资料",
    leading: "在开放时间内访问工作区",
    link: "在设置中导出项目资料",
    tracking: "FIELD NOTES",
  }[id];
  return `<div class="widget article-widget"><div class="article-kicker">WORKSPACE GUIDE</div><h2>${scene}</h2><h3>${lead}</h3>
  <p>${id === "semantic" ? "¥ 240.00　·　12 月 3 日扣款" : "请先检查项目设置，确认共享范围。保存后，团队成员可以在工作区查看更新并继续处理。"}${id === "link" ? ' <button type="button" class="mock-link" data-demo-action="export">查看导出步骤</button>' : ""}</p>
  ${id === "tracking" ? '<p class="article-kicker">WORKSPACE EDITION</p>' : ""}${id === "link" ? feedback : ""}</div>`;
}

function grid({ scene }) {
  const tiles = [
    { label: "研究资料", icon: "document" },
    { label: "设计稿件", icon: "layout" },
    { label: "交付清单", icon: "checklist" },
    { label: "复盘记录", icon: "journal" },
  ];
  return `<div class="widget grid-widget"><strong class="mock-title">${scene}</strong><div class="mock-grid">
  ${tiles
    .map(
      ({ label, icon }, index) =>
        `<button type="button" class="mock-tile" data-demo-action="tile" data-label="${label}" data-count="${index + 3}" aria-pressed="false"><span class="mock-tile-icon" aria-hidden="true"><i class="wireframe-icon wireframe-icon--${icon}"></i></span><strong>${label}</strong><small>${index + 3} 个项目</small></button>`,
    )
    .join("")}
  </div>${feedback}</div>`;
}

function palette({ id, scene }, after) {
  const labels =
    id === "roles"
      ? ["界面底色", "边界", "主要操作", "成功", "风险"]
      : ["浅底", "边界", "辅助", "主色", "文本"];
  const hue = id === "ramp" ? 155 : id === "saturation" ? 253 : 203;
  const before =
    id === "tint"
      ? ["#f3f3f3", "#ddd", "#aaa", "#777", "#303030"]
      : ["#e7f0ff", "#219ce5", "#95c7ff", "#5f65de", "#273c78"];
  const colors = !after
    ? before
    : id === "roles"
      ? ["#f6f8fb", "#a8b5c7", "#2055cf", "#267355", "#a43a30"]
      : [95, 85, 65, 44, 22].map(
          (light, i) =>
            `hsl(${hue} ${id === "tint" ? 16 : id === "saturation" ? [38, 46, 52, 59, 63][i] : 68}% ${light}%)`,
        );
  return `<div class="widget palette-widget"><strong class="mock-title">${scene}</strong><div class="swatches">${colors
    .map(
      (color, i) =>
        `<button type="button" class="swatch" data-demo-action="swatch" data-label="${labels[i]}" data-color="${color}" aria-pressed="false"><span style="--swatch:${color}"></span><small>${labels[i]}</small></button>`,
    )
    .join("")}</div>${feedback}</div>`;
}

function status({ id, scene }, after) {
  if (id === "empty")
    return `<div class="widget status-widget"><strong class="mock-title">${scene}</strong><div class="empty-state">${after ? `<strong>把常用素材收在一起</strong><small>收藏后的素材会显示在这里</small>${button("浏览素材", { action: "browse" })}${feedback}` : "暂无数据"}</div></div>`;
  return `<div class="widget status-widget"><strong class="mock-title">${scene}</strong>
  ${["项目文件", "团队素材", "访问记录"].map((value, index) => `<div class="status-row"><span>${value}</span><span class="status-pill ${index === 1 ? "pending" : ""}">${id === "colorcue" && !after ? "●" : index === 1 ? "! 待处理" : "✓ 已完成"}</span></div>`).join("")}</div>`;
}

function depth({ id, scene }) {
  return `<div class="widget depth-widget"><div class="depth-top"><strong>${scene}</strong></div><div class="depth-layer"><strong>${id === "light" ? "添加附件" : "团队工作区"}</strong><small>最后更新 · 10 分钟前</small>${id === "light" ? `${button("选择文件", { action: "file" })}<input type="file" hidden>` : button("查看详情", { action: "details" })}${feedback}</div></div>`;
}

function picture({ id, scene }) {
  return `<div class="widget picture-widget"><div class="picture-frame"><img src="./assets/mountains.jpg" alt=""><div class="picture-text"><strong>${scene}</strong><small>户外探索 · 路线精选</small></div></div>${id === "upload" ? '<div class="picture-caption">成员上传 · 旅行记录</div>' : ""}</div>`;
}

function ledger({ id, scene }, after) {
  if (id === "rethink" && after)
    return `<div class="widget ticket"><small>城市通行券</small><strong>周末双日票</strong><p>周六 09:00 起生效</p><div>票号 CT–046　·　可入场</div></div>`;
  return `<div class="widget ledger-widget"><strong class="mock-title">${scene}</strong>
  ${(id === "rethink"
    ? [
        ["票种", "双日票"],
        ["生效", "周六 09:00"],
        ["票号", "CT–046"],
      ]
    : [
        ["工作区订阅", "¥1,280.00"],
        ["团队午餐", "¥84.50"],
        ["交通补贴", "¥9.00"],
      ]
  )
    .map(
      ([label, value]) =>
        `<div class="ledger-row"><span>${label}</span><b>${value}</b></div>`,
    )
    .join("")}</div>`;
}

const printCopy = {
  "easy-design": [
    "创作者开放日",
    "11 月 28 日 · 14:00",
    "创作、交换与现场演示",
    "社区工坊 · 2 楼",
    "预约免费席位",
  ],
  "sally-group": [
    "预约咨询",
    "周二至周五",
    "个人与小组咨询",
    "青石街 18 号",
    "联系前台预约",
  ],
  "friday-club": [
    "本月选题 · 城市散步",
    "周五 · 19:30",
    "分享一页你喜欢的文字",
    "西街书屋 · 二层",
    "现场登记",
  ],
  moonstone: [
    "冬季小物系列",
    "黄铜吊饰",
    "棉线编织",
    "亚麻收纳袋",
    "逛逛本期手作",
  ],
  "shakespeare-reading": [
    "冬夜的对白",
    "周二 · 19:00",
    "选读剧本并交流角色",
    "光井剧场 · 小厅",
    "报名参加",
  ],
  "piano-bar": [
    "周六 · 三场演出",
    "19:30 · 三重奏",
    "20:30 · 钢琴独奏",
    "21:30 · 即兴合奏",
    "现场领座",
  ],
  "moonlight-inn": [
    "山野间的短住",
    "林间步道",
    "手作早餐",
    "松风路 8 号",
    "查询房间",
  ],
  "o-ye-gods": [
    "写给黄昏的三行字",
    "风越过低矮的墙",
    "一盏灯沿小路醒来",
    "摘自《城外来信》",
    "拾页文库",
  ],
  tristate: [
    "社区门诊",
    "体检 · 周一至周五",
    "咨询 · 周二和周四",
    "梧桐广场南侧",
    "预约服务",
  ],
  undiscovered: [
    "黑匣子剧场",
    "星期六 · 20:00",
    "从地图边缘出发的故事",
    "先锋剧场 · 小厅",
    "预留座位",
  ],
  "i-read": [
    "散文与诗歌",
    "周日下午",
    "选一首诗读给大家",
    "社区图书室",
    "加入共读",
  ],
  "pie-art": [
    "周末烘焙课",
    "01 预烤派皮",
    "02 加入果馅",
    "03 静置后切片",
    "查看完整课表",
  ],
  "space-design": [
    "居住与零售空间",
    "住宅 · 建筑更新",
    "零售 · 空间陈列",
    "南风里 29 号",
    "预约沟通",
  ],
  "happy-saddles": [
    "周末轻骑行",
    "城市短途路线",
    "每月开放两次新人团",
    "河岸公园 · 北门",
    "了解路线",
  ],
  "share-pie": [
    "烘焙故事 · 第一期",
    "苹果与桂皮",
    "手工黄油派皮",
    "周末限定",
    "到店分享",
  ],
  "sal-friends": [
    "诊所服务",
    "预约 · 常规检查",
    "咨询 · 家庭照护",
    "复诊 · 健康随访",
    "联系接待处",
  ],
  "senior-radio": [
    "社区声音",
    "午后 · 旧唱片",
    "傍晚 · 听众来信",
    "周末 · 社区访谈",
    "查看节目表",
  ],
  umbrellas: [
    "两种材料的联合展",
    "纸伞 · 结构与透光",
    "炭笔 · 轮廓与纹理",
    "白墙展厅",
    "入场免费",
  ],
  "iread-rack": [
    "城市阅读计划",
    "书单小卡",
    "给下一次短途旅行",
    "城南图书站",
    "领取阅读卡",
  ],
  "hugs-pie": ["当天出炉", "苹果派", "莓果派", "枫林路 5 号", "预订留货"],
  "sally-type": [
    "每周开放预约",
    "周三和周五 · 下午",
    "个人顾问服务",
    "青石街 18 号",
    "联系前台",
  ],
  dentist: [
    "家庭牙科",
    "周一至周六",
    "常规检查与清洁",
    "春山街转角",
    "预约问诊",
  ],
  packaging: [
    "春季采收",
    "焙火乌龙",
    "山野花香 · 轻焙",
    "净含量 50 g",
    "枝间茶事",
  ],
  letterhead: [
    "项目信件",
    "致项目合作伙伴",
    "方案评审安排见信件正文",
    "海风路 35 号",
    "北岸设计事务所",
  ],
  newsletter: ["十一月号", "街角小市场", "居民来信", "社区日程", "下期征稿"],
  brochure: [
    "徒步路线手册",
    "站点 A · 河滩",
    "站点 B · 旧桥",
    "站点 C · 观景台",
    "沿蓝色标记前行",
  ],
  newspaper: [
    "每周三至周日营业",
    "早上八点出炉",
    "法棍 · 肉桂卷 · 奶油面包",
    "石榴巷 2 号",
    "预订当天面包",
  ],
  punctuation: [
    "Editorial workshop",
    "10–12 November",
    "“Start with the reader.”",
    "Mon–Fri · Studio 4",
    "Bring a notebook",
  ],
  "type-shape": [
    "Journal No. 04",
    "Field notes from the coast",
    "A short essay on tides",
    "Winter edition",
    "Read the next story",
  ],
};

function editablePrintTitle(title) {
  return `<h2 class="print-headline" contenteditable="plaintext-only" role="textbox" aria-label="编辑示例标题" spellcheck="false">${title}</h2>`;
}

const printFormats = {
  "business-card": {
    size: "横版名片 · 90 × 54 mm",
    render(title) {
      return `<div class="card-identity">
        <span class="card-monogram" aria-hidden="true">LN</span>
        ${editablePrintTitle(title)}
        <p>独立插画师 · 出版与品牌合作</p>
      </div>
      <address class="card-contact"><span>138 0000 0521</span><span>hello@example.com</span></address>`;
    },
  },
  flyer: {
    size: "A5 竖版传单 · 148 × 210 mm",
    render(title) {
      return `<div class="flyer-kicker">社区维修活动</div>
      <div class="flyer-art" aria-hidden="true"><span></span><span></span><span></span></div>
      ${editablePrintTitle(title)}
      <div class="flyer-event"><strong>周六 14:00</strong><span>社区工坊 · 一层</span></div>
      <p class="flyer-description">带上一件需要修理的小物。志愿者会和你一起找出问题，试着修好它。</p>
      <div class="flyer-registration">现场报名 · 免费参加</div>`;
    },
  },
  postcard: {
    size: "A6 横版明信片 · 148 × 105 mm",
    controls:
      '<label class="print-guide"><input class="postcard-flip" type="checkbox">查看背面</label>',
    render(title) {
      return `<div class="postcard-front">
        <img src="./assets/mountains.jpg" alt="山谷中的河流与远山">
        <div class="postcard-caption">${editablePrintTitle(title)}<p>十一月 · 山谷</p></div>
      </div>
      <div class="postcard-back">
        <p class="postcard-note">清早沿山路散步，云散后看见了白色村庄。愿你那边也有好天气。<br><strong>林南</strong></p>
        <div class="postcard-address"><span class="postcard-stamp">邮票</span><span>收件人　陈一然</span><span>青石路 18 号</span><span>邮编　310000</span></div>
      </div>`;
    },
  },
  resume: {
    size: "A4 竖版简历 · 210 × 297 mm",
    render(title) {
      return `<header class="resume-header">
        ${editablePrintTitle(title)}
        <p class="resume-role">产品设计师</p>
        <p class="resume-contact">杭州 · yifan@example.com</p>
      </header>
      <section class="resume-section">
        <h3>工作经历</h3>
        <div class="resume-entry"><strong>产品设计师 · 流光工作室</strong><time>2022–至今</time><p>负责协作工具的设计系统和任务流程。</p></div>
        <div class="resume-entry"><strong>视觉设计师 · 西岸设计</strong><time>2020–2022</time><p>为内容和电商产品建立视觉规范。</p></div>
      </section>
      <section class="resume-section"><h3>教育背景</h3><div class="resume-entry"><strong>视觉传达设计 · 本科</strong><time>2016–2020</time></div></section>
      <section class="resume-section"><h3>技能</h3><p>设计系统、交互原型、用户研究</p></section>`;
    },
  },
};

function formatPrintScene(id, title, format) {
  return `<div class="widget print-demo print-format format-${id}">
    <div class="print-format-toolbar">
      <span class="print-format-size">${format.size}</span>
      ${printGuide()}
      ${format.controls ?? ""}
    </div>
    <article class="print-page format-sheet">${format.render(title)}</article>
  </div>`;
}

const printStudies = {
  "piano-bar": "schedule",
  "pie-art": "steps",
  "moonlight-inn": "feature",
  tristate: "columns",
  "sal-friends": "columns",
  brochure: "fold",
  letterhead: "stationery",
  newsletter: "columns",
  packaging: "packaging",
  umbrellas: "labels",
  "senior-radio": "schedule",
  punctuation: "proof",
  "type-class": "specimens",
  "type-conflict": "article",
  "type-shape": "article",
  "spacing-type": "wrap",
};

const studyColors = {
  complementary: ["#e7effd", "#224578", "#f1a251"],
  triadic: ["#f3e9fb", "#65438c", "#86b789", "#e4a44b"],
  "split-complement": ["#e8f3f2", "#235763", "#d990a4", "#e2ad67"],
  analogous: ["#e8f4f2", "#2b6c81", "#83b78b", "#91acda"],
  monochrome: ["#eeecfb", "#382d6c", "#998cdb", "#c0b7ea"],
  "warm-cool": ["#e2eff5", "#245468", "#f6a75f"],
};

function printStudy(id, title, [kicker, first, second, third, footer], after) {
  const colors = studyColors[id];
  const layout = colors ? "colors" : printStudies[id];
  if (!layout) return null;
  const heading = editablePrintTitle(title);
  const items = [first, second, third];
  const line = (value) => `<p>${value}</p>`;
  const intro = `<header class="study-header"><p class="print-kicker">${kicker}</p>${heading}</header>`;
  const closing = `<footer class="print-footer">${footer}</footer>`;
  let content;
  switch (layout) {
    case "colors": {
      const active = after
        ? colors
        : ["#ffe698", "#704080", "#ea958c", "#90cc76"].slice(0, colors.length);
      const labels = ["背景", "主色", "强调", "辅助"];
      const swatches = active
        .map(
          (color, i) =>
            `<div style="--sample:${color}"><i aria-hidden="true"></i><small>${labels[i]}</small></div>`,
        )
        .join("");
      content = `<div class="color-example" style="--sheet:${active[0]};--primary:${active[1]};--accent:${active[2]};--secondary:${active[3] ?? active[2]}">${intro}${line(first)}<span class="color-example-action">${footer}</span></div><div class="print-swatches">${swatches}</div>`;
      break;
    }
    case "columns":
    case "fold":
    case "labels": {
      const cards = items
        .map((item, index) => {
          const [label, description] = item.split(" · ");
          return `<section class="study-unit"><span class="study-index">0${index + 1}</span><strong>${label}</strong>${description ? line(description) : ""}</section>`;
        })
        .join("");
      content = `${intro}<div class="study-units">${cards}</div>${closing}`;
      break;
    }
    case "schedule":
    case "steps": {
      const rows = items
        .map((item) => {
          const [marker, detail] = item.split(
            layout === "steps" ? / (.+)/ : " · ",
          );
          return `<li><b>${marker}</b><span>${detail ?? ""}</span></li>`;
        })
        .join("");
      content = `${intro}<ol class="study-rows">${rows}</ol>${closing}`;
      break;
    }
    case "feature":
      content = `${intro}<div class="study-feature-image"><img src="./assets/mountains.jpg" alt="山谷与远山"></div><section class="study-amenities">${line(first)}${line(second)}</section><address>${third}<br><strong>${footer}</strong></address>`;
      break;
    case "stationery":
      content = `<div class="study-letter">${intro}<div>${line(first)}${line(second)}</div><address>${third}</address></div><div class="study-envelope"><span>${footer}</span><p>${third}</p></div>`;
      break;
    case "packaging":
      content = `${intro}<div class="study-packaging">${[first, "蜜香红茶", "山间白茶"].map((blend, index) => `<section style="--blend:${["#7e5d3c", "#8a3e54", "#4d735f"][index]}"><strong>${footer}</strong><span>${blend}</span><small>${third}</small></section>`).join("")}</div>${line(second)}`;
      break;
    case "proof":
      content = `${intro}<ul class="study-proof"><li><small>日期范围</small>10<mark>${after ? "–" : "-"}</mark>12 November</li><li><small>引用</small><mark>${after ? "“" : '"'}</mark>Start with the reader.<mark>${after ? "”" : '"'}</mark></li><li><small>撇号</small>designer<mark>${after ? "’" : "'"}</mark>s note</li></ul>${closing}`;
      break;
    case "specimens":
      content = `${intro}<div class="study-specimens">${["旧式衬线", "粗衬线", "无衬线"].map((label) => `<div><b>Ag<span>&amp;</span></b><small>${label}</small></div>`).join("")}</div>`;
      break;
    case "wrap":
      content = `${intro}<div class="study-wrap"><p>排版需要给读者留一点余地。太窄的栏宽会让短语断开，也容易只剩一个字留在行尾。</p><p>先用真实文字调试栏宽，再决定字距和段落节奏。</p></div>${closing}`;
      break;
    default:
      content = `${intro}<div class="study-article"><p>${first}</p><p>${second}</p><cite>${third}</cite></div>${closing}`;
  }
  return `<div class="widget print-demo print-study study-${layout}">
    ${printGuide()}
    <article class="print-page">${content}</article>
  </div>`;
}

function printGuide() {
  return '<label class="print-guide"><input class="print-guides-toggle" type="checkbox">显示辅助线</label>';
}

function printScene({ id, scene, treatment }, after) {
  const format = printFormats[id];
  if (format) return formatPrintScene(id, scene, format);
  const copy = printCopy[id] ?? [
    "创意工作坊",
    "11 月 28 日 · 14:00",
    "展览与公开交流",
    "社区工坊 · 二层",
    "了解活动安排",
  ];
  const title = id === "punctuation" && !after ? "A designer's note" : scene;
  const study = printStudy(id, title, copy, after);
  if (study) return study;
  const [kicker, first, second, third, footer] = copy;
  return `<div class="widget print-demo ${treatment}">
    ${printGuide()}
    <article class="print-page">
      <div class="print-kicker">${kicker}</div>
      ${editablePrintTitle(title)}
      <ul class="print-details"><li>${first}</li><li>${second}</li><li>${third}</li></ul>
      <div class="print-footer">${footer}</div>
    </article>
  </div>`;
}

const renderers = {
  "motion-primitives": renderMotionPrimitives,
  "design-hackers": renderDesignHackers,
  "kill-slop": renderKillSlop,
  print: printScene,
  flow,
  metric,
  article,
  grid,
  palette,
  status,
  depth,
  picture,
  ledger,
};

export function renderScene(item, after) {
  const kindClass =
    item.kind === "print"
      ? " print-case"
      : item.kind === "kill-slop"
        ? " cleanup-case"
        : "";
  return `<div class="scene ${item.id}${kindClass}${item.kind === "design-hackers" ? " hacker-case" : ""} ${after ? "improved" : "initial"}">${renderers[item.kind](item, after)}</div>`;
}
