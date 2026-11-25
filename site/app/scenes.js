import { t } from "./locale.js";

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
    feature: [t("访客姓名", "Visitor name"), t("林雨", "Lin Yu"), t("到访时间", "Visit time"), t("周三 14:00", "Wed 14:00"), t("确认预约", "Confirm booking")],
    detail: [t("电子邮箱", "Email"), "lin@example.com", t("访问权限", "Access"), t("可编辑", "Can edit"), t("发送邀请", "Send invitation")],
    scope: [
      t("日期", "Date"),
      t("周四 · 11 月 26 日", "Thu · Nov 26"),
      t("时段", "Time slot"),
      "14:00 – 15:00",
      t("预订会议室", "Book meeting room"),
    ],
    voice: [t("报名人", "Attendee"), t("李诺", "Li Nuo"), t("同行人数", "Party size"), t("2 人", "2 people"), t("保存我的位置", "Save my spot")],
    actions: [t("成员", "Member"), t("周宁", "Zhou Ning"), t("访问权限", "Access"), t("管理项目", "Manage project"), t("保存权限", "Save permissions")],
    air: [t("联系人", "Contact"), t("周宁", "Zhou Ning"), t("配送地址", "Delivery address"), t("青石路 12 号", "12 Bluestone Road"), t("保存地址", "Save address")],
    group: [
      t("接收邮箱", "Notification email"),
      "lin@example.com",
      t("通知时机", "When to notify"),
      t("包裹寄出时", "When the package ships"),
      t("启用通知", "Enable notifications"),
    ],
    native: [t("项目更新", "Project updates"), t("✔ 接收邮件", "✔ Receive email"), t("提醒频率", "Reminder frequency"), t("每日摘要", "Daily digest"), t("保存偏好", "Save preferences")],
    practice: [
      t("待观察的变量", "Variable to observe"),
      t("标题和说明的间隔", "Space between heading and description"),
      t("记录的观察", "Observation"),
      t("能否一眼找到主要操作", "Can you spot the main action at a glance?"),
      t("保存观察", "Save observation"),
    ],
  };
  const [first, value, second, choice, action] = examples[id];
  const top =
    id === "feature" && !after
      ? `<div class="mock-nav">${t("概览　工作区　设置　关于", "Overview　Workspace　Settings　About")}</div>`
      : "";
  const extra =
    id === "scope" && !after
      ? field(t("重复规则", "Repeat"), t("每两周一次 · 无结束日期", "Every two weeks · No end date"))
      : "";
  const tail =
    id === "actions"
      ? button(after ? t("移除成员…", "Remove member…") : t("立即移除", "Remove now"), {
          style: "danger",
          action: after ? "ask-remove" : "remove",
        })
      : "";
  const email = id === "detail" || id === "group";
  const firstField =
    id === "native"
      ? `<label class="field"><span>${t("项目更新", "Project updates")}</span><span class="demo-check"><input type="checkbox" checked> ${t("接收邮件", "Receive email")}</span></label>`
      : field(first, value, email ? "email" : "text");
  return `<form class="widget form-widget" data-demo-form>${top}<strong class="mock-title">${scene}</strong>${firstField}${field(second, choice)}${extra}
    <div class="mock-actions">${button(id === "voice" && !after ? t("提交资料", "Submit details") : action, { type: "submit" })}${tail}</div>
    ${id === "actions" && after ? `<div class="demo-confirm" hidden><p>${t("移除后，该成员将失去项目访问权限。", "The member will lose access to this project.")}</p>${button(t("确认移除", "Confirm removal"), { style: "danger", action: "remove" })} ${button(t("取消", "Cancel"), { action: "cancel-remove" })}</div>` : ""}
    ${feedback}</form>`;
}

function metric({ id, scene }, after) {
  const values = {
    priority: ["18", t("GB 可用", "GB available"), t("总容量 50 GB", "50 GB total")],
    weight: ["¥128", t("/ 月", "/ month"), t("下次续费 · 12 月 1 日", "Next renewal · Dec 1")],
    oncolor: ["268", t("公里", "km"), t("比上月多 42 公里", "42 km more than last month")],
    quiet: [t("支付完成", "Payment complete"), "", t("收据已发送至邮箱", "Receipt sent by email")],
    labels: ["12", t("个空位", "spots left"), t("周六上午 · 手冲体验", "Sat morning · Pour-over workshop")],
    balance: ["7", t("个文件", "files"), t("还有 2 个等待上传", "2 more waiting to upload")],
    baseline: ["24.8", "GB", t("上周 · 20.2 GB", "Last week · 20.2 GB")],
  };
  const [value, unit, hint] = values[id];
  return `<div class="widget metric-widget"><div class="metric-meta"><strong>${scene}</strong></div>
    <div class="metric-value">${id === "labels" && !after ? `<span>${t("空位数量：", "Spots available:")}</span>` : ""}<b>${value}</b><span>${id === "labels" && !after ? "" : unit}</span></div>
    <div class="metric-hint">${hint}</div>${id === "balance" ? `<div class="upload-meter" role="progressbar" aria-label="${t("上传进度", "Upload progress")}" aria-valuenow="78"></div>` : ""}</div>`;
}

function article({ id, scene }, after) {
  const lead = {
    semantic: t("11 月应付金额", "Amount due in November"),
    measure: t("来访前请完成线上登记", "Check in online before your visit"),
    scale: t("团队文件支持批量导出", "Export team files in bulk"),
    font: t("访客编号 I1O0 · 09:40", "Visitor ID I1O0 · 09:40"),
    line: t("交接前整理共享资料", "Organize shared files before handoff"),
    leading: t("在开放时间内访问工作区", "Access the workspace during opening hours"),
    link: t("在设置中导出项目资料", "Export project files in settings"),
    tracking: "FIELD NOTES",
  }[id];
  return `<div class="widget article-widget"><div class="article-kicker">WORKSPACE GUIDE</div><h2>${scene}</h2><h3>${lead}</h3>
  <p>${id === "semantic" ? t("¥ 240.00　·　12 月 3 日扣款", "¥ 240.00　·　Charged Dec 3") : t("请先检查项目设置，确认共享范围。保存后，团队成员可以在工作区查看更新并继续处理。", "Check your project settings to confirm who has access. Once you save, team members can see the update in the workspace and continue their work.")}${id === "link" ? ` <button type="button" class="mock-link" data-demo-action="export">${t("查看导出步骤", "View export steps")}</button>` : ""}</p>
  ${id === "tracking" ? '<p class="article-kicker">WORKSPACE EDITION</p>' : ""}${id === "link" ? feedback : ""}</div>`;
}

function grid({ scene }) {
  const tiles = [
    { label: t("研究资料", "Research"), icon: "document" },
    { label: t("设计稿件", "Design files"), icon: "layout" },
    { label: t("交付清单", "Delivery checklist"), icon: "checklist" },
    { label: t("复盘记录", "Retrospectives"), icon: "journal" },
  ];
  return `<div class="widget grid-widget"><strong class="mock-title">${scene}</strong><div class="mock-grid">
  ${tiles
    .map(
      ({ label, icon }, index) =>
        `<button type="button" class="mock-tile" data-demo-action="tile" data-label="${label}" data-count="${index + 3}" aria-pressed="false"><span class="mock-tile-icon" aria-hidden="true"><i class="wireframe-icon wireframe-icon--${icon}"></i></span><strong>${label}</strong><small>${index + 3} ${t("个项目", "projects")}</small></button>`,
    )
    .join("")}
  </div>${feedback}</div>`;
}

function palette({ id, scene }, after) {
  const labels =
    id === "roles"
      ? [t("界面底色", "Surface"), t("边界", "Border"), t("主要操作", "Primary action"), t("成功", "Success"), t("风险", "Risk")]
      : [t("浅底", "Light surface"), t("边界", "Border"), t("辅助", "Secondary"), t("主色", "Primary"), t("文本", "Text")];
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
    return `<div class="widget status-widget"><strong class="mock-title">${scene}</strong><div class="empty-state">${after ? `<strong>${t("把常用素材收在一起", "Keep favorite assets together")}</strong><small>${t("收藏后的素材会显示在这里", "Assets you save will appear here")}</small>${button(t("浏览素材", "Browse assets"), { action: "browse" })}${feedback}` : t("暂无数据", "No data")}</div></div>`;
  return `<div class="widget status-widget"><strong class="mock-title">${scene}</strong>
  ${[t("项目文件", "Project files"), t("团队素材", "Team assets"), t("访问记录", "Access history")].map((value, index) => `<div class="status-row"><span>${value}</span><span class="status-pill ${index === 1 ? "pending" : ""}">${id === "colorcue" && !after ? "●" : index === 1 ? t("! 待处理", "! Pending") : t("✓ 已完成", "✓ Complete")}</span></div>`).join("")}</div>`;
}

function depth({ id, scene }) {
  return `<div class="widget depth-widget"><div class="depth-top"><strong>${scene}</strong></div><div class="depth-layer"><strong>${id === "light" ? t("添加附件", "Add attachment") : t("团队工作区", "Team workspace")}</strong><small>${t("最后更新 · 10 分钟前", "Last updated · 10 minutes ago")}</small>${id === "light" ? `${button(t("选择文件", "Choose file"), { action: "file" })}<input type="file" hidden>` : button(t("查看详情", "View details"), { action: "details" })}${feedback}</div></div>`;
}

function picture({ id, scene }) {
  return `<div class="widget picture-widget"><div class="picture-frame"><img data-fade-on-load src="./assets/mountains.jpg" alt=""><div class="picture-text"><strong>${scene}</strong><small>${t("户外探索 · 路线精选", "Outdoor exploration · Featured routes")}</small></div></div>${id === "upload" ? `<div class="picture-caption">${t("成员上传 · 旅行记录", "Member upload · Travel journal")}</div>` : ""}</div>`;
}

function ledger({ id, scene }, after) {
  if (id === "rethink" && after)
    return `<div class="widget ticket"><small>${t("城市通行券", "City Pass")}</small><strong>${t("周末双日票", "Two-Day Weekend Pass")}</strong><p>${t("周六 09:00 起生效", "Valid from Sat at 09:00")}</p><div>${t("票号 CT–046　·　可入场", "Pass CT–046　·　Ready for entry")}</div></div>`;
  return `<div class="widget ledger-widget"><strong class="mock-title">${scene}</strong>
  ${(id === "rethink"
    ? [
        [t("票种", "Pass type"), t("双日票", "Two-day pass")],
        [t("生效", "Valid from"), t("周六 09:00", "Sat 09:00")],
        [t("票号", "Pass number"), "CT–046"],
      ]
    : [
        [t("工作区订阅", "Workspace subscription"), "¥1,280.00"],
        [t("团队午餐", "Team lunch"), "¥84.50"],
        [t("交通补贴", "Transit allowance"), "¥9.00"],
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
    t("创作者开放日", "Creators’ Open Day"),
    t("11 月 28 日 · 14:00", "Nov 28 · 14:00"),
    t("创作、交换与现场演示", "Making, swapping, and live demos"),
    t("社区工坊 · 2 楼", "Community workshop · 2nd floor"),
    t("预约免费席位", "Reserve a free spot"),
  ],
  "sally-group": [
    t("预约咨询", "Book a consultation"),
    t("周二至周五", "Tue to Fri"),
    t("个人与小组咨询", "Individual and group consultations"),
    t("青石街 18 号", "18 Bluestone Street"),
    t("联系前台预约", "Call reception to book"),
  ],
  "friday-club": [
    t("本月选题 · 城市散步", "This month · City walks"),
    t("周五 · 19:30", "Fri · 19:30"),
    t("分享一页你喜欢的文字", "Share a page you love"),
    t("西街书屋 · 二层", "West Street Bookshop · 2nd floor"),
    t("现场登记", "Register on arrival"),
  ],
  moonstone: [
    t("冬季小物系列", "Winter craft collection"),
    t("黄铜吊饰", "Brass charms"),
    t("棉线编织", "Cotton macramé"),
    t("亚麻收纳袋", "Linen storage pouches"),
    t("逛逛本期手作", "Browse the collection"),
  ],
  "shakespeare-reading": [
    t("冬夜的对白", "Dialogue on a Winter Night"),
    t("周二 · 19:00", "Tue · 19:00"),
    t("选读剧本并交流角色", "Read scenes and discuss the characters"),
    t("光井剧场 · 小厅", "Lightwell Theater · Studio"),
    t("报名参加", "Sign up"),
  ],
  "piano-bar": [
    t("周六 · 三场演出", "Sat · Three sets"),
    t("19:30 · 三重奏", "19:30 · Trio"),
    t("20:30 · 钢琴独奏", "20:30 · Solo piano"),
    t("21:30 · 即兴合奏", "21:30 · Improvised ensemble"),
    t("现场领座", "Seats available at the door"),
  ],
  "moonlight-inn": [
    t("山野间的短住", "A short stay in the hills"),
    t("林间步道", "Woodland trails"),
    t("手作早餐", "Homemade breakfast"),
    t("松风路 8 号", "8 Pinewind Road"),
    t("查询房间", "Check room availability"),
  ],
  "o-ye-gods": [
    t("写给黄昏的三行字", "Three Lines for Dusk"),
    t("风越过低矮的墙", "The wind crosses the low wall"),
    t("一盏灯沿小路醒来", "A lamp wakes along the path"),
    t("摘自《城外来信》", "From Letters from Beyond the City"),
    t("拾页文库", "Looseleaf Press"),
  ],
  tristate: [
    t("社区门诊", "Community clinic"),
    t("体检 · 周一至周五", "Checkups · Mon to Fri"),
    t("咨询 · 周二和周四", "Consultations · Tue and Thu"),
    t("梧桐广场南侧", "South side of Sycamore Square"),
    t("预约服务", "Book an appointment"),
  ],
  undiscovered: [
    t("黑匣子剧场", "Black Box Theater"),
    t("星期六 · 20:00", "Sat · 20:00"),
    t("从地图边缘出发的故事", "A story from the edge of the map"),
    t("先锋剧场 · 小厅", "Pioneer Theater · Studio"),
    t("预留座位", "Reserve a seat"),
  ],
  "i-read": [
    t("散文与诗歌", "Essays and poetry"),
    t("周日下午", "Sunday afternoon"),
    t("选一首诗读给大家", "Choose a poem to read aloud"),
    t("社区图书室", "Community library"),
    t("加入共读", "Join the reading group"),
  ],
  "pie-art": [
    t("周末烘焙课", "Weekend baking class"),
    t("01 预烤派皮", "01 Blind-bake the crust"),
    t("02 加入果馅", "02 Add the fruit filling"),
    t("03 静置后切片", "03 Let it cool, then slice"),
    t("查看完整课表", "View the full schedule"),
  ],
  "space-design": [
    t("居住与零售空间", "Residential and retail spaces"),
    t("住宅 · 建筑更新", "Residential · Building renovation"),
    t("零售 · 空间陈列", "Retail · Store displays"),
    t("南风里 29 号", "29 Southwind Lane"),
    t("预约沟通", "Schedule a consultation"),
  ],
  "happy-saddles": [
    t("周末轻骑行", "Easy weekend rides"),
    t("城市短途路线", "Short city routes"),
    t("每月开放两次新人团", "Two beginner rides each month"),
    t("河岸公园 · 北门", "Riverside Park · North gate"),
    t("了解路线", "Explore the route"),
  ],
  "share-pie": [
    t("烘焙故事 · 第一期", "Baking stories · Issue 1"),
    t("苹果与桂皮", "Apple and cinnamon"),
    t("手工黄油派皮", "Handmade butter crust"),
    t("周末限定", "Weekends only"),
    t("到店分享", "Come share a slice"),
  ],
  "sal-friends": [
    t("诊所服务", "Clinic services"),
    t("预约 · 常规检查", "Appointments · Routine checkups"),
    t("咨询 · 家庭照护", "Consultations · Family care"),
    t("复诊 · 健康随访", "Follow-ups · Ongoing care"),
    t("联系接待处", "Contact reception"),
  ],
  "senior-radio": [
    t("社区声音", "Community voices"),
    t("午后 · 旧唱片", "Afternoon · Vintage records"),
    t("傍晚 · 听众来信", "Evening · Listener letters"),
    t("周末 · 社区访谈", "Weekend · Community interviews"),
    t("查看节目表", "View program schedule"),
  ],
  umbrellas: [
    t("两种材料的联合展", "An Exhibition in Two Materials"),
    t("纸伞 · 结构与透光", "Paper umbrellas · Structure and translucency"),
    t("炭笔 · 轮廓与纹理", "Charcoal · Line and texture"),
    t("白墙展厅", "Whitewall Gallery"),
    t("入场免费", "Free admission"),
  ],
  "iread-rack": [
    t("城市阅读计划", "City Reading Project"),
    t("书单小卡", "Reading list card"),
    t("给下一次短途旅行", "For your next short trip"),
    t("城南图书站", "Southside Library"),
    t("领取阅读卡", "Get a reading card"),
  ],
  "hugs-pie": [t("当天出炉", "Baked fresh today"), t("苹果派", "Apple pie"), t("莓果派", "Berry pie"), t("枫林路 5 号", "5 Maplewood Road"), t("预订留货", "Reserve a pie")],
  "sally-type": [
    t("每周开放预约", "Appointments every week"),
    t("周三和周五 · 下午", "Wed and Fri · Afternoon"),
    t("个人顾问服务", "Individual consulting"),
    t("青石街 18 号", "18 Bluestone Street"),
    t("联系前台", "Contact reception"),
  ],
  dentist: [
    t("家庭牙科", "Family dentistry"),
    t("周一至周六", "Mon to Sat"),
    t("常规检查与清洁", "Routine checkups and cleaning"),
    t("春山街转角", "Corner of Spring Hill Street"),
    t("预约问诊", "Book a visit"),
  ],
  packaging: [
    t("春季采收", "Spring harvest"),
    t("焙火乌龙", "Roasted oolong"),
    t("山野花香 · 轻焙", "Wildflower notes · Light roast"),
    t("净含量 50 g", "Net weight 50 g"),
    t("枝间茶事", "Branch & Leaf Tea"),
  ],
  letterhead: [
    t("项目信件", "Project letter"),
    t("致项目合作伙伴", "Dear project partners,"),
    t("方案评审安排见信件正文", "See the letter for the proposal review schedule"),
    t("海风路 35 号", "35 Seabreeze Road"),
    t("北岸设计事务所", "North Shore Design Studio"),
  ],
  newsletter: [t("十一月号", "November issue"), t("街角小市场", "Corner market"), t("居民来信", "Letters from residents"), t("社区日程", "Community calendar"), t("下期征稿", "Submit to the next issue")],
  brochure: [
    t("徒步路线手册", "Walking trail guide"),
    t("站点 A · 河滩", "Stop A · Riverbank"),
    t("站点 B · 旧桥", "Stop B · Old bridge"),
    t("站点 C · 观景台", "Stop C · Lookout"),
    t("沿蓝色标记前行", "Follow the blue markers"),
  ],
  newspaper: [
    t("每周三至周日营业", "Open Wed to Sun"),
    t("早上八点出炉", "Fresh from the oven at 8 a.m."),
    t("法棍 · 肉桂卷 · 奶油面包", "Baguettes · Cinnamon rolls · Brioche"),
    t("石榴巷 2 号", "2 Pomegranate Lane"),
    t("预订当天面包", "Reserve bread for today"),
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
  return `<h2 class="print-headline" contenteditable="plaintext-only" role="textbox" aria-label="${t("编辑示例标题", "Edit sample heading")}" spellcheck="false">${title}</h2>`;
}

const printFormats = {
  "business-card": {
    size: t("横版名片 · 90 × 54 mm", "Landscape business card · 90 × 54 mm"),
    render(title) {
      return `<div class="card-identity">
        <span class="card-monogram" aria-hidden="true">LN</span>
        ${editablePrintTitle(title)}
        <p>${t("独立插画师 · 出版与品牌合作", "Freelance illustrator · Publishing and brand partnerships")}</p>
      </div>
      <address class="card-contact"><span>138 0000 0521</span><span>hello@example.com</span></address>`;
    },
  },
  flyer: {
    size: t("A5 竖版传单 · 148 × 210 mm", "Portrait A5 flyer · 148 × 210 mm"),
    render(title) {
      return `<div class="flyer-kicker">${t("社区维修活动", "Community repair event")}</div>
      <div class="flyer-art" aria-hidden="true"><span></span><span></span><span></span></div>
      ${editablePrintTitle(title)}
      <div class="flyer-event"><strong>${t("周六 14:00", "Sat 14:00")}</strong><span>${t("社区工坊 · 一层", "Community workshop · Ground floor")}</span></div>
      <p class="flyer-description">${t("带上一件需要修理的小物。志愿者会和你一起找出问题，试着修好它。", "Bring a small item that needs fixing. Volunteers will help you find the problem and try to repair it.")}</p>
      <div class="flyer-registration">${t("现场报名 · 免费参加", "Sign up at the door · Free to attend")}</div>`;
    },
  },
  postcard: {
    size: t("A6 横版明信片 · 148 × 105 mm", "Landscape A6 postcard · 148 × 105 mm"),
    controls:
      `<label class="print-guide"><input class="postcard-flip" type="checkbox">${t("查看背面", "View the reverse")}</label>`,
    render(title) {
      return `<div class="postcard-front">
        <img data-fade-on-load src="./assets/mountains.jpg" alt="${t("山谷中的河流与远山", "A river in a valley with distant mountains")}">
        <div class="postcard-caption">${editablePrintTitle(title)}<p>${t("十一月 · 山谷", "November · In the valley")}</p></div>
      </div>
      <div class="postcard-back">
        <p class="postcard-note">${t("清早沿山路散步，云散后看见了白色村庄。愿你那边也有好天气。", "I walked the mountain path early this morning. When the clouds cleared, a white village came into view. I hope the weather is fine where you are, too.")}<br><strong>${t("林南", "Nan Lin")}</strong></p>
        <div class="postcard-address"><span class="postcard-stamp">${t("邮票", "Stamp")}</span><span>${t("收件人　陈一然", "To　Yiran Chen")}</span><span>${t("青石路 18 号", "18 Bluestone Road")}</span><span>${t("邮编　310000", "Postal code　310000")}</span></div>
      </div>`;
    },
  },
  resume: {
    size: t("A4 竖版简历 · 210 × 297 mm", "Portrait A4 résumé · 210 × 297 mm"),
    render(title) {
      return `<header class="resume-header">
        ${editablePrintTitle(title)}
        <p class="resume-role">${t("产品设计师", "Product designer")}</p>
        <p class="resume-contact">${t("杭州 · yifan@example.com", "Hangzhou · yifan@example.com")}</p>
      </header>
      <section class="resume-section">
        <h3>${t("工作经历", "Experience")}</h3>
        <div class="resume-entry"><strong>${t("产品设计师 · 流光工作室", "Product designer · Lumen Studio")}</strong><time>${t("2022–至今", "2022–Present")}</time><p>${t("负责协作工具的设计系统和任务流程。", "Designed the system and task flows for a collaboration tool.")}</p></div>
        <div class="resume-entry"><strong>${t("视觉设计师 · 西岸设计", "Visual designer · West Shore Design")}</strong><time>2020–2022</time><p>${t("为内容和电商产品建立视觉规范。", "Built visual guidelines for content and e-commerce products.")}</p></div>
      </section>
      <section class="resume-section"><h3>${t("教育背景", "Education")}</h3><div class="resume-entry"><strong>${t("视觉传达设计 · 本科", "B.A. in Visual Communication Design")}</strong><time>2016–2020</time></div></section>
      <section class="resume-section"><h3>${t("技能", "Skills")}</h3><p>${t("设计系统、交互原型、用户研究", "Design systems, interactive prototypes, and user research")}</p></section>`;
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
      const labels = [t("背景", "Background"), t("主色", "Primary"), t("强调", "Accent"), t("辅助", "Secondary")];
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
      content = `${intro}<div class="study-feature-image"><img data-fade-on-load src="./assets/mountains.jpg" alt="${t("山谷与远山", "Valley and distant mountains")}"></div><section class="study-amenities">${line(first)}${line(second)}</section><address>${third}<br><strong>${footer}</strong></address>`;
      break;
    case "stationery":
      content = `<div class="study-letter">${intro}<div>${line(first)}${line(second)}</div><address>${third}</address></div><div class="study-envelope"><span>${footer}</span><p>${third}</p></div>`;
      break;
    case "packaging":
      content = `${intro}<div class="study-packaging">${[first, t("蜜香红茶", "Honey-scented black tea"), t("山间白茶", "Mountain white tea")].map((blend, index) => `<section style="--blend:${["#7e5d3c", "#8a3e54", "#4d735f"][index]}"><strong>${footer}</strong><span>${blend}</span><small>${third}</small></section>`).join("")}</div>${line(second)}`;
      break;
    case "proof":
      content = `${intro}<ul class="study-proof"><li><small>${t("日期范围", "Date range")}</small>10<mark>${after ? "–" : "-"}</mark>12 November</li><li><small>${t("引用", "Quotation")}</small><mark>${after ? "“" : '"'}</mark>Start with the reader.<mark>${after ? "”" : '"'}</mark></li><li><small>${t("撇号", "Apostrophe")}</small>designer<mark>${after ? "’" : "'"}</mark>s note</li></ul>${closing}`;
      break;
    case "specimens":
      content = `${intro}<div class="study-specimens">${[t("旧式衬线", "Old-style serif"), t("粗衬线", "Slab serif"), t("无衬线", "Sans serif")].map((label) => `<div><b>Ag<span>&amp;</span></b><small>${label}</small></div>`).join("")}</div>`;
      break;
    case "wrap":
      content = `${intro}<div class="study-wrap"><p>${t("排版需要给读者留一点余地。太窄的栏宽会让短语断开，也容易只剩一个字留在行尾。", "Typography needs to give readers a little room. A narrow column can break up phrases or leave a word stranded on a line by itself.")}</p><p>${t("先用真实文字调试栏宽，再决定字距和段落节奏。", "Test the column width with real copy before adjusting tracking and paragraph rhythm.")}</p></div>${closing}`;
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
  return `<label class="print-guide"><input class="print-guides-toggle" type="checkbox">${t("显示辅助线", "Show guides")}</label>`;
}

function printScene({ id, scene, treatment }, after) {
  const format = printFormats[id];
  if (format) return formatPrintScene(id, scene, format);
  const copy = printCopy[id] ?? [
    t("创意工作坊", "Creative Workshop"),
    t("11 月 28 日 · 14:00", "Nov 28 · 14:00"),
    t("展览与公开交流", "Exhibition and public discussion"),
    t("社区工坊 · 二层", "Community workshop · 2nd floor"),
    t("了解活动安排", "View the event schedule"),
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
