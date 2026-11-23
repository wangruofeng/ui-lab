const disclosure = (label, content) =>
  `<details class="cleanup-details"><summary>${label}</summary><div>${content}</div></details>`;

const groups = (items, className = "") =>
  `<div class="cleanup-groups ${className}">${items.map(([label, text]) => `<div><strong>${label}</strong><p>${text}</p></div>`).join("")}</div>`;

const notes = [
  ["共享范围", "仅团队成员可见"],
  ["下载格式", "表格与归档文件"],
  ["保留期限", "历史记录保留 30 天"],
];

const tools = [
  ["搜索", "查找工作区文件"],
  ["收藏", "查看已标记内容"],
  ["归档", "整理历史资料"],
];

function toolRows(after, variant) {
  const icons =
    variant === "ai-svg-icon" && !after
      ? ["⊛", "♧", "◈"]
      : [
          '<i class="wireframe-icon wireframe-icon--document"></i>',
          '<i class="wireframe-icon wireframe-icon--journal"></i>',
          '<i class="wireframe-icon wireframe-icon--layout"></i>',
        ];
  return `<ul class="cleanup-tools">${tools.map(([label, text], index) => `<li><span class="cleanup-icon" aria-hidden="true">${icons[index]}</span><div><strong>${label}</strong><p>${text}</p></div></li>`).join("")}</ul>`;
}

function motionPreview(kind, caption) {
  const sample =
    kind === "loading"
      ? '<span class="cleanup-motion-spinner" aria-hidden="true"></span><span class="cleanup-motion-center" aria-hidden="true"></span>'
      : '<span class="cleanup-motion-target" aria-hidden="true">预览文件</span>';
  return `<figure class="cleanup-motion-figure"><div class="cleanup-motion-stage cleanup-motion-stage--${kind}">${sample}</div><figcaption>${caption}</figcaption></figure>`;
}

function summaryBar() {
  return groups(
    [
      ["待处理", "8 张工单"],
      ["需复核", "3 张工单"],
      ["下次更新", "今天 17:00"],
    ],
    "cleanup-dashboard",
  );
}

export function renderKillSlop({ id, scene, criterion }, after) {
  let heading = scene;
  let body;
  let action = disclosure("查看对照要点", `<p>${criterion}</p>`);
  switch (id) {
    case "indigo-violet-gradient":
      body = "<p>将当前版本发布到团队测试环境。</p>";
      action = disclosure("开始发布", "<p>检查通过，可以发布到测试环境。</p>");
      break;
    case "gradient-text":
      body = "<p>从合并记录整理每周更新。</p>";
      action = disclosure(
        "查看最近更新",
        "<p>11 月 23 日 · 增加导出筛选。</p>",
      );
      break;
    case "warm-cozy-palette":
      body = "<p>今天可预约木工台和公共工作桌。</p>";
      action = disclosure(
        "查看可用时段",
        "<p>14:00–16:00 · 木工台剩余 2 个名额。</p>",
      );
      break;
    case "default-semantic-palette":
      body = groups(
        [
          ["待开始", "素材目录"],
          ["已完成", "项目文档"],
          ["待处理", "校验 2 条记录"],
          ["失败", "目标目录不可访问"],
        ],
        "cleanup-statuses",
      );
      action = disclosure(
        "查看失败原因",
        "<p>请检查目标目录的读取权限后重试。</p>",
      );
      break;
    case "mono-hue-alert":
      body =
        '<div class="cleanup-alert"><strong>同步已暂停</strong><p>磁盘空间不足，释放空间后可重试。</p></div>';
      action = disclosure("查看空间占用", "<p>历史备份占用 2.4 GB。</p>");
      break;
    case "atmosphere-gradient":
      body = summaryBar();
      break;
    case "serif-emphasis":
      heading = "为团队整理<span>共享资料</span>";
      body = "<p>搜索资料、按项目归档，并查看最近更新。</p>";
      break;
    case "serif-body-misuse":
      body = groups(
        [
          ["订阅费", "¥ 120.00"],
          ["工位费", "¥ 865.40"],
          ["资料费", "¥ 18.00"],
        ],
        "cleanup-ledger",
      );
      action = disclosure("查看账期", "<p>本期账单包含 11 月的三项支出。</p>");
      break;
    case "decorative-text-lines":
      heading = after ? "报名须知" : "<s>报名</s><mark>须知</mark>";
      body = "<p>每人可登记一次，现场凭姓名签到。</p>";
      break;
    case "section-kicker":
      body = groups(
        notes.map(([label, text]) => [
          after
            ? label
            : `<small class="cleanup-kicker">项目设置</small>${label}`,
          text,
        ]),
      );
      break;
    case "oversized-hero-headline":
      heading = after ? "整理交接清单" : "用一个工作区整理每一项项目交接工作";
      body = "<p>记录负责人、待办和截止日期。</p>";
      break;
    case "flat-type-hierarchy":
      body = groups([
        ["预计周四送达", "配送范围：城区"],
        ["收货说明", "到达前电话联系"],
      ]);
      break;
    case "highlighted-keywords":
      body = after
        ? "<p>共享链接 7 天后失效。收件人可以查看文件并留言。</p>"
        : "<p><mark>共享链接</mark> <mark>7 天后</mark>失效。收件人可以<mark>查看文件</mark>并<mark>留言</mark>。</p>";
      action = disclosure(
        "查看权限",
        "<p>仅打开链接的收件人可查看与留言。</p>",
      );
      break;
    case "ai-copy-tics":
      body = after
        ? "<p>导入本周工单，生成包含完成率与待办的周报草稿。</p>"
        : "<p>从灵感到成果，开启无缝协作的新体验，释放每个团队的无限潜能。</p>";
      action = disclosure(
        after ? "预览报告字段" : "开启新体验",
        "<p>报告包含完成工单、待处理工单和负责人。</p>",
      );
      break;
    case "emoji-everywhere":
      body = groups(
        [
          ["评论提醒", "收到新回复时通知"],
          ["进度邮件", "每周五汇总未完成任务"],
          ["同步提醒", "文件同步失败时通知"],
        ].map(([label, text], index) => [
          after
            ? label
            : `<span class="cleanup-emoji" aria-hidden="true">${["💬", "📥", "✨"][index]}</span>${label}`,
          text,
        ]),
        "cleanup-emoji-list",
      );
      break;
    case "status-dot-glow":
      body = `<div class="cleanup-queue">
        <div><span>文档索引</span><strong class="cleanup-live"><i aria-hidden="true"></i>正在运行</strong></div>
        <div><span>素材归档</span><strong class="cleanup-live"><i aria-hidden="true"></i>正在运行</strong></div>
        <div><span>历史备份</span><small>等待执行</small></div>
      </div><p>上次检查：今天 10:32</p>`;
      action = disclosure("查看运行记录", "<p>10:32 · 检查完成。</p>");
      break;
    case "left-border-callout":
      body = groups(notes, "cleanup-callouts");
      break;
    case "pastel-icon-tiles":
    case "ai-svg-icon":
    case "tinted-icon-tile":
      body = toolRows(after, id);
      break;
    case "over-rounded-glass":
    case "oversized-shadow":
    case "broken-corner-border": {
      const surface =
        '<div class="cleanup-surface"><strong>团队通知</strong><p>在有新成员加入时提醒我。</p><label><input type="checkbox" checked> 接收通知</label></div>';
      body =
        id === "oversized-shadow"
          ? `<div class="cleanup-shadow-preview">${surface}</div>`
          : surface;
      break;
    }
    case "nested-radius":
      body = `<div class="cleanup-radius"><div></div></div>
        <p class="cleanup-measure">外圆角 30 px · 内边距 10 px · 内圆角 ${after ? "20" : "4"} px</p>`;
      break;
    case "badge-spam":
      body = `<div class="cleanup-badges">${["交付包", "11 月 23 日", "林雨", "待审阅"].map((text, i) => `<span class="${!after || i === 3 ? "cleanup-badge" : ""}">${text}</span>`).join("")}</div>`;
      break;
    case "springy-hover":
      body = motionPreview(
        "hover",
        after ? "位置保持不动，底色短暂变化" : "上跳、放大，再回到原位",
      );
      action = disclosure("预览交接清单", "<p>清单包含 6 个任务。</p>");
      break;
    case "wobbly-spinner":
      body = motionPreview(
        "loading",
        after ? "旋转轴对准中心标记" : "旋转轴偏离中心标记",
      );
      action = disclosure(
        "演示同步",
        "<p>正在同步文件摘要。收起可停止单栏预览。</p>",
      );
      break;
    case "feature-grid":
      body = groups(
        [
          [after ? "File search" : "FILE SEARCH", "按名称查找"],
          [after ? "Quick export" : "QUICK EXPORT", "导出项目资料"],
          [after ? "Archive" : "ARCHIVE", "收纳旧版本"],
        ],
        "cleanup-feature-grid",
      );
      break;
    case "fake-stat-trio":
      body = after
        ? groups([
            ["每日备份", "工作日晚间执行"],
            ["历史版本", "保留最近 30 天"],
            ["恢复预览", "选择文件后查看版本"],
          ])
        : groups(
            [
              ["99.99%", "可靠性"],
              ["10×", "性能提升"],
              ["50 万", "任务已保护"],
            ],
            "cleanup-stat-trio",
          );
      action = disclosure(
        "查看备份范围",
        "<p>示例覆盖工作区文档和项目附件。</p>",
      );
      break;
    case "numbered-sections":
      body = groups(
        notes.map(([label, text], i) => [
          after
            ? label
            : `<small class="cleanup-kicker">0${i + 1}</small>${label}`,
          text,
        ]),
      );
      break;
    case "nested-cards":
      body = `<div class="cleanup-nest">${groups(notes)}</div>`;
      break;
    case "monotone-spacing":
      body = groups([
        ["邮件提醒", "新评论和提及"],
        ["每日摘要", "工作日下午发送"],
        ["系统通知", "服务状态变化"],
      ]);
      action = disclosure("预览通知", "<p>今天收到 2 条新的项目评论。</p>");
      break;
    case "overused-font":
      body =
        '<p class="cleanup-font-sample">Open studios · 14:30</p><p>周六开放，门票可在现场领取。</p>';
      action = disclosure("查看展览日期", "<p>11 月 28 日至 12 月 6 日。</p>");
      break;
    case "tasteful-terminal":
      body = after
        ? "<p>正在读：《沿海观察笔记》</p><p>还剩 4 篇文章。</p>"
        : "<p>$ reading-list --status</p><p>&gt; current: coastal-notes · queued: 4</p>";
      action = disclosure(
        after ? "查看下一篇" : "run next_item",
        "<p>下一篇：《潮线和旧桥》。</p>",
      );
      break;
    case "editorial-dashboard":
      heading = after ? scene : "每日工作纪事";
      body = summaryBar();
      action = disclosure(
        "查看待处理工单",
        "<p>最早一张工单已等待 2 小时。</p>",
      );
      break;
    default:
      throw new Error(`缺少图鉴演示：${id}`);
  }

  return `<article class="widget cleanup-demo"><header><h4>${heading}</h4></header><div class="cleanup-body">${body}</div>${action}</article>`;
}
