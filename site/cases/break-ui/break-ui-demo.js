import { t } from "../../app/locale.js";

import { boundaryDemos } from "./break-ui-boundaries.js";

const demoMember = { initials: "JP", name: "Jo Park", email: "jo@example.com", projects: 3 };
const worstMember = {
  initials: "AW",
  name: "Aleksandra Wiśniewska-Kowalczyk",
  email: "aleksandra.wisniewska-kowalczyk@northwind-industries-holdings.example.com",
  projects: 1,
};

const scenarios = {
  "missing-member-fields": [
    { ...demoMember, initials: "", name: "", email: "jules@example.com", role: "" },
  ],
  "multilingual-names": [
    { ...demoMember, name: "👩🏽‍💻 Priya", email: "priya@example.com" },
    { ...demoMember, name: "نور الهدى عبد الرحمن (نور)", email: "noor@example.com" },
  ],
  "project-counts": [
    { ...demoMember, projects: 0 },
    { ...demoMember, initials: "JS", name: "Jin Seo", email: "jin@example.com", projects: 1 },
    { ...demoMember, initials: "AM", name: "Ana Mora", email: "ana@example.com", projects: 1284 },
  ],
  "empty-member-list": [],
};

const graphemes = new Intl.Segmenter(undefined, { granularity: "grapheme" });
const projectPlural = new Intl.PluralRules("en");
const projectNumber = new Intl.NumberFormat("en");

function renderMember(member, fixed) {
  const { initials, name, email, projects, role = "Admin" } = member;
  const avatar = fixed ? initials || email[0].toUpperCase() : initials;
  const displayName = fixed ? name.trim() || email : name;
  const count = fixed
    ? `${projectNumber.format(projects)} ${projectPlural.select(projects) === "one" ? "project" : "projects"}`
    : `${projects} projects`;
  return `<div class="break-ui-member">
    <span class="break-ui-avatar" aria-hidden="true">${avatar}</span>
    <div class="break-ui-identity"><strong ${fixed ? 'dir="auto"' : ""}>${displayName}</strong>${displayName !== email ? `<span>${email}</span>` : ""}</div>
    <div class="break-ui-meta">${!fixed || role ? `<span class="break-ui-role">${role}</span>` : ""}<span>${count}</span></div>
  </div>`;
}

function renderMembers(members, fixed, variant) {
  if (!members.length) {
    return fixed ? `<p class="break-ui-empty">${t("暂无团队成员", "No team members")}</p>` : "";
  }

  return `<div class="break-ui-list">${members.map((member) => {
    if (variant !== "multilingual-names" || member === demoMember) {
      return renderMember(member, fixed);
    }

    const initials = fixed ? graphemes.segment(member.name).containing(0).segment : member.name[0];
    return renderMember({ ...member, initials }, fixed);
  }).join("")}</div>`;
}

function renderSide(variant, worst, fixed, page) {
  const renderBoundary = boundaryDemos[variant];
  if (renderBoundary) return renderBoundary(worst, fixed, page);
  const members = worst ? scenarios[variant] ?? [worstMember] : [demoMember];
  return renderMembers(members, fixed, variant);
}

export function renderBreakUiDemo(variant) {
  const showWorst = variant === "project-counts" || Boolean(boundaryDemos[variant]);
  return `<section class="comparison" aria-label="${t("极端数据前后对照", "Stress-test comparison")}">
    <button type="button" class="break-ui-toggle" data-demo-toolbar aria-pressed="${showWorst}">${t("极端数据", "Edge cases")}</button>
    <div class="pair" aria-live="polite">
      <section class="panel"><h3>${t("调整前", "Before")}</h3><div class="stage break-ui-before">${renderSide(variant, showWorst, false)}</div></section>
      <section class="panel"><h3>${t("调整后", "After")}</h3><div class="stage break-ui-after${variant === "missing-member-fields" ? " break-ui-center-row" : ""}">${renderSide(variant, showWorst, true)}</div></section>
    </div>
  </section>`;
}

export function connectBreakUiDemo(section, variant) {
  const toggle = section.querySelector("[data-demo-toolbar]");
  const before = section.querySelector(".break-ui-before");
  const after = section.querySelector(".break-ui-after");

  toggle.addEventListener("click", () => {
    const worst = toggle.getAttribute("aria-pressed") === "false";
    toggle.setAttribute("aria-pressed", String(worst));
    before.innerHTML = renderSide(variant, worst, false);
    after.innerHTML = renderSide(variant, worst, true);
  });

  if (variant === "request-retry") {
    after.addEventListener("click", (event) => {
      if (!event.target.closest("[data-retry-request]")) return;
      after.innerHTML = renderSide(variant, false, true);
      after.querySelector(".break-ui-request-result").focus();
    });
  }

  if (variant === "pagination-boundary") {
    section.addEventListener("click", (event) => {
      const button = event.target.closest("[data-page]");
      if (!button) return;

      const stage = button.closest(".stage");
      const direction = button.textContent;
      const worst = toggle.getAttribute("aria-pressed") === "true";
      stage.innerHTML = renderSide(variant, worst, stage === after, Number(button.dataset.page));
      const buttons = [...stage.querySelectorAll("[data-page]:enabled")];
      (buttons.find((entry) => entry.textContent === direction) ?? buttons[0])?.focus();
    });
  }
}
