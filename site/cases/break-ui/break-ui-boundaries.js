import { t } from "../../app/locale.js";

const pageSize = 3;
const projects = ["Design system", "Mobile checkout", "Release notes", "Team settings"];

export function renderPagination(worst, fixed, page = 1) {
  const total = worst ? 3 : 4;
  const pages = fixed ? Math.ceil(total / pageSize) : Math.floor(total / pageSize) + 1;
  const start = (page - 1) * pageSize;
  return `<div class="break-ui-example">
    <ul>${projects.slice(start, Math.min(start + pageSize, total)).map((name) => `<li>${name}</li>`).join("")}</ul>
    <div class="break-ui-pagination">
      <button type="button" class="demo-trigger" data-page="${page - 1}" ${page === 1 ? "disabled" : ""}>${t("上一页", "Previous")}</button>
      <span>${page} / ${pages} ${t("页", "pages")}</span>
      <button type="button" class="demo-trigger" data-page="${page + 1}" ${page === pages ? "disabled" : ""}>${t("下一页", "Next")}</button>
    </div>
  </div>`;
}

const dateIn = (zone) => new Intl.DateTimeFormat(t("zh-TW", "en-US"), {
  dateStyle: "medium",
  timeZone: zone,
});

function renderDate(worst, fixed) {
  const date = new Date(worst ? "2025-12-31T23:30:00-08:00" : "2025-12-31T00:30:00-08:00");
  const zone = fixed ? "Asia/Taipei" : "America/Los_Angeles";
  return `<div class="break-ui-example">
    <strong>${t("计划发布日期", "Scheduled publication date")}</strong>
    <time datetime="${date.toISOString()}">${dateIn(zone).format(date)}</time>
    <span>${fixed ? t("台北时区", "Taipei time zone") : t("来源时区（洛杉矶）", "Source time zone (Los Angeles)")}</span>
  </div>`;
}

function renderProgress(worst, fixed) {
  const values = worst ? [142, -3] : [68];
  return `<div class="break-ui-example">${values.map((value, index) => {
    const bounded = Math.max(0, Math.min(100, value));
    const shown = fixed ? bounded : value;
    const label = index === 0 ? t("文件导入", "File import") : t("索引更新", "Index update");
    return `<div>
      <div class="break-ui-progress-label"><span>${label}</span><span>${shown}%</span></div>
      <div class="break-ui-progress-track" role="progressbar" aria-label="${label}" aria-valuenow="${bounded}" aria-valuetext="${shown}%">
        <span style="width:${Math.abs(shown)}%;${shown < 0 ? `left:${shown}%` : ""}"></span>
      </div>
    </div>`;
  }).join("")}</div>`;
}

function renderFileName(worst, fixed) {
  const name = worst ? "Q3 Board Deck — FINAL (revised) v12 [approved by legal]" : "Release notes";
  const filename = name + ".pdf";
  return `<div class="break-ui-example">
    <strong>${t("会议资料", "Meeting materials")}</strong>
    ${fixed && worst ? `<details class="break-ui-file-details">
      <summary>
        <span class="break-ui-filename"><span>${name}</span><span>.pdf</span></span>
        <span class="break-ui-full-name">${filename}</span>
        <span class="break-ui-file-open">${t("查看完整文件名", "Show full file name")}</span>
        <span class="break-ui-file-close">${t("收起文件名", "Hide full file name")}</span>
      </summary>
    </details>` : `<span class="break-ui-filename-clipped">${filename}</span>`}
  </div>`;
}

const projectTags = ["design", "frontend", "q3", "urgent", "needs-review", "accessibility",
  "mobile", "analytics", "growth", "payments", "localization", "customer-feedback-from-enterprise-onboarding"];

function renderTagList(worst, fixed) {
  const tags = worst ? projectTags : projectTags.slice(0, 3);
  const renderTags = (items) => `<div class="break-ui-tags">${items.map((tag) => `<span>${tag}</span>`).join("")}</div>`;

  return `<div class="break-ui-example">
    <strong>${t("项目标签", "Project tags")}</strong>
    ${renderTags(fixed ? tags.slice(0, 3) : tags)}
    ${fixed && tags.length > 3 ? `<details class="break-ui-extra-tags">
      <summary>${t("其余", "Show")} ${tags.length - 3} ${t("个标签", "more tags")}</summary>
      ${renderTags(tags.slice(3))}
    </details>` : ""}
  </div>`;
}

function renderRequest(worst, fixed) {
  return `<div class="break-ui-example">
    <strong>${t("近期项目", "Recent projects")}</strong>
    ${!worst ? `<p class="break-ui-request-result" tabindex="-1">${t("已加载 2 个项目", "2 projects loaded")}</p><ul><li>Design system</li><li>Mobile checkout</li></ul>`
      : fixed ? `<p>${t("项目暂时无法加载。", "Projects are temporarily unavailable.")}</p><button type="button" class="demo-trigger" data-retry-request>${t("重试", "Retry")}</button>`
      : '<p>HTTP 503: Service Unavailable</p>'}
  </div>`;
}

export const boundaryDemos = {
  "pagination-boundary": renderPagination,
  "date-time-zone": renderDate,
  "out-of-range-progress": renderProgress,
  "long-file-name": renderFileName,
  "tag-overflow": renderTagList,
  "request-retry": renderRequest,
};
