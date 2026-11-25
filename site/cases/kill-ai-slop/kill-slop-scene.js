import { t } from "../../app/locale.js";

const disclosure = (label, content) =>
  `<details class="cleanup-details"><summary>${label}</summary><div>${content}</div></details>`;

const groups = (items, className = "") =>
  `<div class="cleanup-groups ${className}">${items.map(([label, text]) => `<div><strong>${label}</strong><p>${text}</p></div>`).join("")}</div>`;

const notes = [
  [t("共享范围", "Sharing"), t("仅团队成员可见", "Visible to team members only")],
  [t("下载格式", "Download format"), t("表格与归档文件", "Spreadsheets and archives")],
  [t("保留期限", "Retention"), t("历史记录保留 30 天", "History is kept for 30 days")],
];

const tools = [
  [t("搜索", "Search"), t("查找工作区文件", "Find workspace files")],
  [t("收藏", "Favorites"), t("查看已标记内容", "View bookmarked items")],
  [t("归档", "Archive"), t("整理历史资料", "Organize older files")],
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
      : `<span class="cleanup-motion-target" aria-hidden="true">${t("预览文件", "Preview files")}</span>`;
  return `<figure class="cleanup-motion-figure"><div class="cleanup-motion-stage cleanup-motion-stage--${kind}">${sample}</div><figcaption>${caption}</figcaption></figure>`;
}

function summaryBar() {
  return groups(
    [
      [t("待处理", "Pending"), t("8 张工单", "8 tickets")],
      [t("需复核", "Needs review"), t("3 张工单", "3 tickets")],
      [t("下次更新", "Next update"), t("今天 17:00", "Today at 17:00")],
    ],
    "cleanup-dashboard",
  );
}

export function renderKillSlop({ id, scene, criterion }, after) {
  let heading = scene;
  let body;
  let action = disclosure(t("查看对照要点", "View comparison notes"), `<p>${criterion}</p>`);
  switch (id) {
    case "indigo-violet-gradient":
      body = `<p>${t("将当前版本发布到团队测试环境。", "Deploy the current version to the team&#39;s test environment.")}</p>`;
      action = disclosure(t("开始发布", "Start deployment"), `<p>${t("检查通过，可以发布到测试环境。", "Checks passed. Ready to deploy to the test environment.")}</p>`);
      break;
    case "gradient-text":
      body = `<p>${t("从合并记录整理每周更新。", "Compile the weekly update from merged changes.")}</p>`;
      action = disclosure(
        t("查看最近更新", "View recent updates"),
        `<p>${t("11 月 23 日 · 增加导出筛选。", "Nov 23 · Added export filters.")}</p>`,
      );
      break;
    case "warm-cozy-palette":
      body = `<p>${t("今天可预约木工台和公共工作桌。", "Woodworking benches and shared worktables are available today.")}</p>`;
      action = disclosure(
        t("查看可用时段", "View available times"),
        `<p>${t("14:00–16:00 · 木工台剩余 2 个名额。", "14:00–16:00 · 2 spots left at the woodworking bench.")}</p>`,
      );
      break;
    case "default-semantic-palette":
      body = groups(
        [
          [t("待开始", "Not started"), t("素材目录", "Asset directory")],
          [t("已完成", "Complete"), t("项目文档", "Project documents")],
          [t("待处理", "Pending"), t("校验 2 条记录", "Validate 2 records")],
          [t("失败", "Failed"), t("目标目录不可访问", "Cannot access the target folder")],
        ],
        "cleanup-statuses",
      );
      action = disclosure(
        t("查看失败原因", "View error details"),
        `<p>${t("请检查目标目录的读取权限后重试。", "Check read permissions for the target folder, then try again.")}</p>`,
      );
      break;
    case "mono-hue-alert":
      body =
        `<div class="cleanup-alert"><strong>${t("同步已暂停", "Sync paused")}</strong><p>${t("磁盘空间不足，释放空间后可重试。", "Free up disk space, then try again.")}</p></div>`;
      action = disclosure(t("查看空间占用", "View disk usage"), `<p>${t("历史备份占用 2.4 GB。", "Older backups use 2.4 GB.")}</p>`);
      break;
    case "atmosphere-gradient":
      body = summaryBar();
      break;
    case "serif-emphasis":
      heading = `${t("为团队整理", "Organize your team&#39;s")}<span>${t("共享资料", "shared files")}</span>`;
      body = `<p>${t("搜索资料、按项目归档，并查看最近更新。", "Find files, archive them by project, and see what changed recently.")}</p>`;
      break;
    case "serif-body-misuse":
      body = groups(
        [
          [t("订阅费", "Subscription"), "¥ 120.00"],
          [t("工位费", "Desk fee"), "¥ 865.40"],
          [t("资料费", "Materials fee"), "¥ 18.00"],
        ],
        "cleanup-ledger",
      );
      action = disclosure(t("查看账期", "View billing period"), `<p>${t("本期账单包含 11 月的三项支出。", "This bill includes three expenses from November.")}</p>`);
      break;
    case "decorative-text-lines":
      heading = after ? t("报名须知", "Registration details") : `<s>${t("报名", "Registration")}</s><mark>${t("须知", "Details")}</mark>`;
      body = `<p>${t("每人可登记一次，现场凭姓名签到。", "One registration per person. Check in under your name at the door.")}</p>`;
      break;
    case "section-kicker":
      body = groups(
        notes.map(([label, text]) => [
          after
            ? label
            : `<small class="cleanup-kicker">${t("项目设置", "Project settings")}</small>${label}`,
          text,
        ]),
      );
      break;
    case "oversized-hero-headline":
      heading = after ? t("整理交接清单", "Organize your handoff checklist") : t("用一个工作区整理每一项项目交接工作", "One workspace for everything you need to do when handing off a project");
      body = `<p>${t("记录负责人、待办和截止日期。", "Track owners, tasks, and deadlines.")}</p>`;
      break;
    case "flat-type-hierarchy":
      body = groups([
        [t("预计周四送达", "Expected Thursday"), t("配送范围：城区", "Delivery area: City limits")],
        [t("收货说明", "Delivery instructions"), t("到达前电话联系", "Call before arrival")],
      ]);
      break;
    case "highlighted-keywords":
      body = after
        ? `<p>${t("共享链接 7 天后失效。收件人可以查看文件并留言。", "The shared link expires in 7 days. Recipients can view the files and comment.")}</p>`
        : `<p><mark>${t("共享链接", "The shared link")}</mark> <mark>${t("7 天后", "expires in 7 days")}</mark>${t("失效。收件人可以", ". Recipients can ")}<mark>${t("查看文件", "view the files")}</mark>${t("并", " and ")}<mark>${t("留言", "comment")}</mark>${t("。", ".")}</p>`;
      action = disclosure(
        t("查看权限", "View permissions"),
        `<p>${t("仅打开链接的收件人可查看与留言。", "Only recipients who open the link can view files and leave comments.")}</p>`,
      );
      break;
    case "ai-copy-tics":
      body = after
        ? `<p>${t("导入本周工单，生成包含完成率与待办的周报草稿。", "Import this week&#39;s tickets to draft a weekly report with the completion rate and outstanding tasks.")}</p>`
        : `<p>${t("从灵感到成果，开启无缝协作的新体验，释放每个团队的无限潜能。", "From inspiration to impact, unlock a seamless collaboration experience and unleash your team&#39;s limitless potential.")}</p>`;
      action = disclosure(
        after ? t("预览报告字段", "Preview report fields") : t("开启新体验", "Unlock the experience"),
        `<p>${t("报告包含完成工单、待处理工单和负责人。", "The report lists completed and outstanding tickets and their owners.")}</p>`,
      );
      break;
    case "emoji-everywhere":
      body = groups(
        [
          [t("评论提醒", "Comment alerts"), t("收到新回复时通知", "Notify me about new replies")],
          [t("进度邮件", "Progress email"), t("每周五汇总未完成任务", "Summarize open tasks every Friday")],
          [t("同步提醒", "Sync alerts"), t("文件同步失败时通知", "Notify me when a file fails to sync")],
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
        <div><span>${t("文档索引", "Document index")}</span><strong class="cleanup-live"><i aria-hidden="true"></i>${t("正在运行", "Running")}</strong></div>
        <div><span>${t("素材归档", "Asset archive")}</span><strong class="cleanup-live"><i aria-hidden="true"></i>${t("正在运行", "Running")}</strong></div>
        <div><span>${t("历史备份", "Backup history")}</span><small>${t("等待执行", "Queued")}</small></div>
      </div><p>${t("上次检查：今天 10:32", "Last checked today at 10:32")}</p>`;
      action = disclosure(t("查看运行记录", "View run history"), `<p>${t("10:32 · 检查完成。", "10:32 · Check complete.")}</p>`);
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
        `<div class="cleanup-surface"><strong>${t("团队通知", "Team notifications")}</strong><p>${t("在有新成员加入时提醒我。", "Notify me when a new member joins.")}</p><label><input type="checkbox" checked> ${t("接收通知", "Receive notifications")}</label></div>`;
      body =
        id === "oversized-shadow"
          ? `<div class="cleanup-shadow-preview">${surface}</div>`
          : surface;
      break;
    }
    case "nested-radius":
      body = `<div class="cleanup-radius"><div></div></div>
        <p class="cleanup-measure">${t("外圆角 30 px · 内边距 10 px · 内圆角", "Outer radius 30 px · Padding 10 px · Inner radius")} ${after ? "20" : "4"} px</p>`;
      break;
    case "badge-spam":
      body = `<div class="cleanup-badges">${[t("交付包", "Delivery package"), t("11 月 23 日", "Nov 23"), t("林雨", "Lin Yu"), t("待审阅", "Awaiting review")].map((text, i) => `<span class="${!after || i === 3 ? "cleanup-badge" : ""}">${text}</span>`).join("")}</div>`;
      break;
    case "springy-hover":
      body = motionPreview(
        "hover",
        after ? t("位置保持不动，底色短暂变化", "Stays in place with a brief background change") : t("上跳、放大，再回到原位", "Jumps up, grows, then returns to its original position"),
      );
      action = disclosure(t("预览交接清单", "Preview handoff checklist"), `<p>${t("清单包含 6 个任务。", "The checklist contains 6 tasks.")}</p>`);
      break;
    case "wobbly-spinner":
      body = motionPreview(
        "loading",
        after ? t("旋转轴对准中心标记", "Rotation is centered on the guide") : t("旋转轴偏离中心标记", "Rotation is offset from the center guide"),
      );
      action = disclosure(
        t("演示同步", "Sync demo"),
        `<p>${t("正在同步文件摘要。收起可停止单栏预览。", "Syncing file summaries. Collapse this pane to stop its preview.")}</p>`,
      );
      break;
    case "feature-grid":
      body = groups(
        [
          [after ? "File search" : "FILE SEARCH", t("按名称查找", "Find by name")],
          [after ? "Quick export" : "QUICK EXPORT", t("导出项目资料", "Export project files")],
          [after ? "Archive" : "ARCHIVE", t("收纳旧版本", "Archive older versions")],
        ],
        "cleanup-feature-grid",
      );
      break;
    case "fake-stat-trio":
      body = after
        ? groups([
            [t("每日备份", "Daily backups"), t("工作日晚间执行", "Runs on weekday evenings")],
            [t("历史版本", "Version history"), t("保留最近 30 天", "Keeps the last 30 days")],
            [t("恢复预览", "Restore preview"), t("选择文件后查看版本", "Select a file to view its versions")],
          ])
        : groups(
            [
              ["99.99%", t("可靠性", "Reliability")],
              ["10×", t("性能提升", "Performance gain")],
              [t("50 万", "500,000"), t("任务已保护", "Tasks protected")],
            ],
            "cleanup-stat-trio",
          );
      action = disclosure(
        t("查看备份范围", "View backup coverage"),
        `<p>${t("示例覆盖工作区文档和项目附件。", "The example covers workspace documents and project attachments.")}</p>`,
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
        [t("邮件提醒", "Email alerts"), t("新评论和提及", "New comments and mentions")],
        [t("每日摘要", "Daily digest"), t("工作日下午发送", "Sent on weekday afternoons")],
        [t("系统通知", "System notifications"), t("服务状态变化", "Service status changes")],
      ]);
      action = disclosure(t("预览通知", "Preview notifications"), `<p>${t("今天收到 2 条新的项目评论。", "There are 2 new project comments today.")}</p>`);
      break;
    case "overused-font":
      body =
        `<p class="cleanup-font-sample">Open studios · 14:30</p><p>${t("周六开放，门票可在现场领取。", "Open Saturday. Tickets are available at the door.")}</p>`;
      action = disclosure(t("查看展览日期", "View exhibition dates"), `<p>${t("11 月 28 日至 12 月 6 日。", "Nov 28 to Dec 6.")}</p>`);
      break;
    case "tasteful-terminal":
      body = after
        ? `<p>${t("正在读：《沿海观察笔记》", "Reading: Coastal Field Notes")}</p><p>${t("还剩 4 篇文章。", "4 articles remaining.")}</p>`
        : "<p>$ reading-list --status</p><p>&gt; current: coastal-notes · queued: 4</p>";
      action = disclosure(
        after ? t("查看下一篇", "View next article") : "run next_item",
        `<p>${t("下一篇：《潮线和旧桥》。", "Next: The Tide Line and the Old Bridge.")}</p>`,
      );
      break;
    case "editorial-dashboard":
      heading = after ? scene : t("每日工作纪事", "Daily Work Journal");
      body = summaryBar();
      action = disclosure(
        t("查看待处理工单", "View open tickets"),
        `<p>${t("最早一张工单已等待 2 小时。", "The oldest ticket has been waiting for 2 hours.")}</p>`,
      );
      break;
    default:
      throw new Error(`${t("缺少图鉴演示：", "Missing catalog demo:")}${id}`);
  }

  return `<article class="widget cleanup-demo"><header><h4>${heading}</h4></header><div class="cleanup-body">${body}</div>${action}</article>`;
}
