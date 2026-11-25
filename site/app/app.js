import { caseCount, english, t } from "./locale.js";
import { localizeShell, updateLocaleLinks } from "./locale-shell.js";
import { renderArtwork, renderLibraryHome } from "./library-home.js";
import { connectSlidingTabs } from "./sliding-tabs.js";
import { prepareMotionExamples } from "../cases/motion-primitives/motion-primitives-examples.js";
import { installMotionPrimitives } from "../cases/motion-primitives/motion-primitives.js";
import { updateNavigation } from "./navigation.js";
import { buildPrompt, renderPromptSource } from "./prompts.js";
import {
  collectionCases,
  libraryHref,
  resolveRoute,
  collections,
} from "./library.js";
import { renderScene } from "./scenes.js";
import { connectLoadingDemo, renderLoadingDemo } from "../cases/loading-dev/loading-demo.js";
import { connectTransitionsDemo, renderTransitionsDemo } from "../cases/transitions-dev/transitions-demo.js";
import { connectShadcnDemo, renderShadcnDemo } from "../cases/shadcn-ui/shadcn-demo.js";
import { connectBreakUiDemo, renderBreakUiDemo } from "../cases/break-ui/break-ui-demo.js";
import { connectInterfaceDetails, renderInterfaceDetails } from "../cases/interface-details/interface-details-demo.js";
import { connectStageshowDemo, renderStageshowDemo } from "../cases/stageshow/stageshow-demo.js";

const interactiveDemos = {
  stageshow: { render: renderStageshowDemo, connect: connectStageshowDemo },
  "interface-details": { render: renderInterfaceDetails, connect: connectInterfaceDetails },
  "break-ui": { render: renderBreakUiDemo, connect: connectBreakUiDemo },
  loading: { render: renderLoadingDemo, connect: connectLoadingDemo },
  transitions: { render: renderTransitionsDemo, connect: connectTransitionsDemo },
  shadcn: { render: renderShadcnDemo, connect: connectShadcnDemo },
};

localizeShell();

const catalog = document.querySelector("#catalog");
const main = document.querySelector("#case");
const artworkDialog = document.querySelector("#artwork-dialog");
const artworkPreview = artworkDialog.querySelector("img");
installMotionPrimitives(main);
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const shell = document.querySelector(".shell");
let route = {};
let frame = 0;

function renderCatalog() {
  const { collection, item } = route;
  if (!collection) return;
  catalog.innerHTML =
    collection.categories
      .map(
        (group) => `
    <details ${group.title === item?.category ? "open" : ""}>
      <summary><strong>${group.title}</strong><span>${group.items.length}</span></summary>
      <ul>${group.items.map((entry) => `<li><a href="${libraryHref(collection, entry)}" ${item?.id === entry.id ? 'aria-current="page"' : ""}>${entry.principle ? entry.title.split("：", 1)[0] : entry.title}${entry.principle ? ` <small class="catalog-principle">${entry.principle}</small>` : ""}</a></li>`).join("")}</ul>
    </details>`,
      )
      .join("");
}

function renderCase(collection, active) {
  const motionExample = active.kind === "motion-primitives";
  const interactiveDemo = interactiveDemos[active.demo];
  const referenceLabel = active.demo === "transitions" ? t("官方演示", "Official demo") : t("原始出处", "Original source");
  const cases = collectionCases(collection);
  const index = cases.findIndex((item) => item.id === active.id);
  const previous = cases[index - 1];
  const next = cases[index + 1];
  document.title = `${active.title} · ${collection.title} · ${t("设计案例库", "Design Case Library")}`;
  const link = (item, label, shortcut) =>
    item
      ? `<a href="${libraryHref(collection, item)}" aria-keyshortcuts="${shortcut}" aria-labelledby="case-nav-${shortcut}-label case-nav-${shortcut}-title">
          <span id="case-nav-${shortcut}-label" hidden>${label}</span>
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M13 8H3m4-4L3 8l4 4" />
          </svg>
          <span class="case-nav-title" id="case-nav-${shortcut}-title">${item.title}</span>
        </a>`
      : "";
  main.innerHTML = `
    <header class="case-header">
      <div class="page-context">
        ${breadcrumbs(collection, active)}
        ${active.reference ? `<a class="source-reference" href="${active.reference}">${referenceLabel}</a>` : ""}
      </div>
      <h1 id="case-title" tabindex="-1">${active.title}</h1>
      <p class="intro">${active.tip}</p>
    </header>
    <section class="case-workspace" aria-label="${t("案例内容", "Case content")}">
      <div class="case-view-bar">
        <div class="case-view-tabs sliding-tabs" role="tablist" aria-label="${t("案例视图", "Case views")}">
          <span class="sliding-tabs-indicator" aria-hidden="true"></span>
          <button type="button" id="case-demo-tab" role="tab" aria-selected="true" aria-controls="case-demo-panel">${t("演示", "Demo")}</button>
          <button type="button" id="case-prompt-tab" role="tab" aria-selected="false" aria-controls="case-prompt-panel" tabindex="-1">${t("提示词", "Prompt")}</button>
        </div>
        <div class="demo-actions" hidden></div>
      </div>
      <div class="case-demo-panel" id="case-demo-panel" role="tabpanel" aria-labelledby="case-demo-tab" tabindex="0">
    ${
      interactiveDemo
        ? `<div class="interactive-demo">${interactiveDemo.render(active.variant)}</div>`
        : active.playbookDemo
        ? `<section class="comparison playbook-comparison" aria-labelledby="playbook-demo-title">
      <div class="comparison-bar"><div><h2 id="playbook-demo-title">${t("前后对照", "Before and after")}</h2><p>${t("用右上角的控件切换前后状态。", "Use the controls in the top right to switch states.")}</p></div></div>
      <iframe class="playbook-frame" src="./demos/playbook-demo/?case=${active.id}${english ? "&amp;lang=en" : ""}" title="${active.title} · ${t("交互演示", "Interactive demo")}" sandbox="allow-scripts allow-same-origin"></iframe>
      </section>`
        : `<section class="comparison" aria-label="${t("界面前后对比", "Interface comparison")}">
      <div class="comparison-bar"><div><h2>${active.scene}</h2><p>${motionExample ? t("在两侧做同一操作，比较反馈。", "Try the same action on both sides to compare feedback.") : active.kind === "print" ? t("编辑标题、切换辅助线或播放版式变化。", "Edit the headline, toggle guides, or play the layout transition.") : t("在左侧播放改动过程。", "Play the transition in the left panel.")}</p></div>
      ${
        motionExample
          ? ""
          : `<div class="comparison-actions">
        ${active.hasMotionReplay ? `<button type="button" data-demo-action="cleanup-motion">${t("同时重播动效", "Replay both animations")}</button>` : ""}
        <button type="button" id="play">${t("播放", "Play")}</button>
      </div>`
      }</div>
      <div class="pair">
        <section class="panel"><h3 id="before-label">${t("调整前", "Before")}</h3><div class="stage" id="stage">
          <div id="before-view">${renderScene(active, false)}</div>
          ${motionExample ? "" : `<div id="transition-view" inert>${renderScene(active, true)}</div>`}
        </div></section>
        <section class="panel"><h3>${t("调整后", "After")}</h3><div class="stage">${renderScene(active, true)}</div></section>
      </div>
      ${motionExample ? "" : `<div class="timeline"><label for="progress">${t("播放进度", "Playback progress")}</label><input id="progress" type="range" min="0" max="100" value="0"><output id="percent" for="progress">0%</output></div>`}
    </section>`
    }
      </div>
      <div class="case-prompt-panel" id="case-prompt-panel" role="tabpanel" aria-labelledby="case-prompt-tab" tabindex="0" hidden>
        <div class="case-prompt-field">
          <div class="case-prompt-actions">
            <button type="button" id="copy-prompt" aria-label="${t("复制提示词", "Copy prompt")}">
              <svg class="copy-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <svg class="copied-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <path d="m4 12 5 5L20 6" />
              </svg>
              <span class="copy-label">${t("复制", "Copy")}</span>
              <span class="copied-label">${t("已复制", "Copied")}</span>
            </button>
          </div>
          <pre id="case-prompt" aria-labelledby="case-prompt-tab" tabindex="0"></pre>
        </div>
        <p id="copy-status" role="status"></p>
      </div>
    </section>
    ${active.outline.length ? `<section class="notes"><h2>${t("设计要点", "Design notes")}</h2><ul>${active.outline.map((note) => `<li>${note}</li>`).join("")}</ul></section>` : ""}
    ${active.referenceLabel ? `<p class="case-reference">${t("书中出处", "Book reference")} · ${active.referenceLabel}</p>` : ""}
    <nav class="case-nav" aria-label="${t("相邻案例", "Adjacent cases")}">${link(previous, t("上一案例", "Previous case"), "ArrowLeft")}${link(next, t("下一案例", "Next case"), "ArrowRight")}</nav>`;
  if (interactiveDemo) {
    const section = main.querySelector(".interactive-demo");
    interactiveDemo.connect(section, active.variant);
    const buttons = section.querySelectorAll("[data-demo-toolbar]");
    main.querySelector(".demo-actions").append(...buttons);
  } else if (!active.playbookDemo && !motionExample) {
    connectPlayer();
  }
  connectCaseViews();
  const prompt = document.querySelector("#case-prompt");
  const copyStatus = document.querySelector("#copy-status");
  const markdown = buildPrompt(collection, active);
  renderPromptSource(prompt, markdown);
  function selectPrompt() {
    prompt.focus();
    window.getSelection().selectAllChildren(prompt);
  }
  prompt.addEventListener("keydown", (event) => {
    if (event.key.toLowerCase() !== "a" || !(event.metaKey || event.ctrlKey) || event.altKey || event.shiftKey) return;
    event.preventDefault();
    selectPrompt();
  });
  const copyButton = document.querySelector("#copy-prompt");
  let copyFeedbackTimer;
  copyButton.addEventListener("click", async () => {
    clearTimeout(copyFeedbackTimer);
    delete copyButton.dataset.copied;
    copyStatus.textContent = "";
    try {
      await navigator.clipboard.writeText(markdown);
      if (!copyButton.isConnected) return;
      copyButton.dataset.copied = "true";
      copyStatus.textContent = t("已复制提示词", "Prompt copied");
      clearTimeout(copyFeedbackTimer);
      copyFeedbackTimer = setTimeout(() => {
        delete copyButton.dataset.copied;
        copyStatus.textContent = "";
      }, 2000);
    } catch {
      if (!copyButton.isConnected) return;
      selectPrompt();
      copyStatus.textContent = t("已选中提示词，请手动复制", "Prompt selected. Copy it manually.");
    }
  });
  renderCatalog();
}

function connectCaseViews() {
  const tablist = main.querySelector(".case-view-tabs");
  const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
  const [demoTab] = tabs;
  const toolbar = main.querySelector(".demo-actions");

  connectSlidingTabs(tablist, selected => {
    for (const tab of tabs) {
      document.getElementById(tab.getAttribute("aria-controls")).hidden = tab !== selected;
    }
    toolbar.hidden = selected !== demoTab || !toolbar.childElementCount;
  });
}

function connectPlayer() {
  const play = document.querySelector("#play");
  const progress = document.querySelector("#progress");
  const percent = document.querySelector("#percent");
  const transition = document.querySelector("#transition-view");
  const label = document.querySelector("#before-label");
  const before = document.querySelector("#before-view");
  const animatedSelectors =
    ".widget, .mock-title, .field, .mock-actions, .metric-meta, .metric-value, .metric-hint, .article-widget h2, .article-widget h3, .article-widget p, .mock-tile, .swatches span, .status-row, .depth-layer, .picture-frame img, .picture-text, .ledger-row, .print-headline, .card-contact, .flyer-event, .flyer-registration, .postcard-caption, .resume-entry, .study-unit, .study-rows li, .hacker-shapes i";
  const targets = [...transition.querySelectorAll(animatedSelectors)];
  function measureChanges() {
    return animatedSelectors
      .split(", ")
      .flatMap((selector) => {
        const first = [...before.querySelectorAll(selector)];
        const last = [...transition.querySelectorAll(selector)];
        if (first.length !== last.length) return [];
        return last
          .map((element, index) => {
            if (first[index].textContent !== element.textContent) return null;
            const from = first[index].getBoundingClientRect();
            const to = element.getBoundingClientRect();
            return { element, x: from.left - to.left, y: from.top - to.top };
          })
          .filter(Boolean);
      })
      .filter(
        ({ element, x, y }) =>
          Math.abs(x) + Math.abs(y) > 2 && !element.matches(".widget"),
      );
  }
  let moves = measureChanges();
  let measuredWidth = transition.clientWidth;
  let layoutChanged = false;
  transition.closest(".comparison").addEventListener("input", (event) => {
    if (event.target.closest(".print-demo, .hacker-demo")) layoutChanged = true;
  });
  const duration = 1350;
  let position = 0;
  let playing = false;
  let startTime;
  function seek(value) {
    position = value;
    const rounded = Math.round(value * 100);
    progress.value = rounded;
    percent.value = rounded + "%";
    progress.style.setProperty("--progress", percent.value);
    transition.style.opacity = value;
    if (layoutChanged || measuredWidth !== transition.clientWidth) {
      for (const element of targets) element.style.translate = "";
      moves = measureChanges();
      measuredWidth = transition.clientWidth;
      layoutChanged = false;
    }
    const remaining = reducedMotion.matches ? 0 : (1 - value) ** 2;
    for (const { element, x, y } of moves) {
      element.style.translate = remaining
        ? `${x * remaining}px ${y * remaining}px`
        : "";
    }
    transition.inert = value < 1;
    before.style.opacity = 1 - value;
    before.inert = value > 0;
    label.lastChild.textContent =
      value === 0 ? t("调整前", "Before") : value === 1 ? t("已显示调整后", "After") : t("变化预览", "Preview");
  }
  function update() {
    play.textContent = playing
      ? t("暂停", "Pause")
      : position === 1
        ? t("重播", "Replay")
        : position > 0
          ? t("继续", "Resume")
          : t("播放", "Play");
  }
  function advance(now) {
    startTime ??= now - position * duration;
    seek(Math.min((now - startTime) / duration, 1));
    if (position < 1) frame = requestAnimationFrame(advance);
    else {
      playing = false;
      update();
    }
  }
  play.addEventListener("click", () => {
    if (playing) {
      cancelAnimationFrame(frame);
      playing = false;
    } else if (reducedMotion.matches) {
      seek(position === 1 ? 0 : 1);
    } else {
      if (position === 1) seek(0);
      startTime = undefined;
      playing = true;
      frame = requestAnimationFrame(advance);
    }
    update();
  });
  progress.addEventListener("input", () => {
    cancelAnimationFrame(frame);
    playing = false;
    seek(Number(progress.value) / 100);
    update();
  });
}

function breadcrumbs(collection, item) {
  return `<nav class="breadcrumbs" aria-label="${t("面包屑导航", "Breadcrumbs")}">
    <a href="${libraryHref()}">${t("案例库", "Library")}</a>
    ${item ? `<span aria-hidden="true">›</span>
    <a href="${libraryHref(collection)}">${collection.title}</a>
    <span aria-hidden="true">›</span>
    <span>${item.category}</span>` : ""}
  </nav>`;
}


function connectChapterGrid(grid) {
  const cards = [...grid.children];
  if (!cards.length) return;

  const style = getComputedStyle(grid);
  const gap = parseFloat(style.columnGap);
  const minWidth = parseFloat(style.getPropertyValue("--chapter-min-width"));

  function layout() {
    const width = grid.getBoundingClientRect().width;
    const columns = Math.min(cards.length, Math.max(1, Math.floor((width + gap) / (minWidth + gap))));
    grid.style.setProperty("--chapter-columns", columns);
    grid.classList.toggle("chapter-grid-stacked", columns > 1);
    if (columns === 1) {
      grid.style.removeProperty("min-height");
      return;
    }

    // Assign valid columns before measuring wrapped content after a resize.
    cards.forEach((card, index) => card.style.setProperty("--chapter-column", index % columns + 1));
    const heights = cards.map(card => card.getBoundingClientRect().height);
    const offsets = Array(columns).fill(0);
    cards.forEach((card, index) => {
      const column = offsets.indexOf(Math.min(...offsets));
      card.style.setProperty("--chapter-column", column + 1);
      card.style.setProperty("--chapter-top", `${offsets[column]}px`);
      offsets[column] += heights[index] + gap;
    });
    grid.style.minHeight = `${Math.max(...offsets) - gap}px`;
  }

  layout();
  const observer = new ResizeObserver(() => {
    if (grid.isConnected) layout();
    else observer.disconnect();
  });
  observer.observe(grid);
  cards.forEach(card => observer.observe(card));
}

function renderOverview(collection) {
  if (collection) {
    const chapters = collection.categories.map((category, index) => ({
      ...category,
      headingId: `collection-chapter-${index + 1}`,
    }));
    const chapterCards = chapters.map(({ title, items, headingId }) => `
      <section class="chapter-card">
        <h2 id="${headingId}" tabindex="-1">${title} <small>${caseCount(items.length)}</small></h2>
        <ul>${items.map((item) => `<li><a href="${libraryHref(collection, item)}">${item.title}</a></li>`).join("")}</ul>
      </section>`).join("");
    const chapterJumps = chapters.map(({ title, headingId }) =>
      `<button type="button" aria-controls="${headingId}">${title}</button>`,
    ).join("");
    main.innerHTML = `
      <header class="collection-header">
        <div class="page-context">
          ${breadcrumbs(collection)}
          ${collection.url ? `<a class="source-reference" href="${collection.url}">${t("来源", "Source")}</a>` : ""}
        </div>
        <div class="collection-heading">
          <h1 id="case-title" tabindex="-1">${collection.title}</h1>
          ${renderArtwork(collection.artwork, true)}
          <p class="intro">${collection.description}</p>
          <p class="collection-meta">
            <span>${collection.type} · ${collection.author} · ${caseCount(collectionCases(collection).length)}</span>
            ${collection.edition ? `<span>${collection.edition}</span>` : ""}
          </p>
        </div>
      </header>
      <nav class="chapter-jumps" aria-label="${t("章节直达", "Jump to a chapter")}">${chapterJumps}</nav>
      <div class="chapter-grid collection-chapters">${chapterCards}</div>`;
    connectChapterGrid(main.querySelector(".collection-chapters"));
    for (const button of main.querySelectorAll(".chapter-jumps button")) {
      button.addEventListener("click", () => {
        const heading = document.getElementById(button.getAttribute("aria-controls"));
        heading.focus({ preventScroll: true });
        heading.scrollIntoView({ block: "start" });
      });
    }
    return;
  }

  main.innerHTML = renderLibraryHome();
}

function renderSitemap() {
  const sources = collections.map((collection) => {
    const chapters = collection.categories.map((category) => `
      <section class="chapter-card">
        <h3>${category.title}</h3>
        <ul>${category.items.map((item) => `<li><a href="${libraryHref(collection, item)}">${item.title}</a></li>`).join("")}</ul>
      </section>`).join("");
    return `
      <details class="sitemap-source">
        <summary>${collection.title} <span>${caseCount(collectionCases(collection).length)}</span></summary>
        <p><a href="${libraryHref(collection)}">${t("查看案例目录", "Browse cases")}</a></p>
        <div class="chapter-grid sitemap-chapters">${chapters}</div>
      </details>`;
  }).join("");
  main.innerHTML = `
    <div class="breadcrumbs"><a href="${libraryHref()}">${t("设计案例库", "Design Case Library")}</a></div>
    <div class="sitemap-heading">
      <h1 id="case-title" tabindex="-1">${t("站点地图", "Sitemap")}</h1>
      <a href="/sitemap.xml" aria-label="${t("XML 版站点地图", "XML sitemap")}">${t("XML 版", "XML")}</a>
    </div>
    <div class="sitemap-sources">${sources}</div>`;
  main.querySelectorAll(".sitemap-chapters").forEach(connectChapterGrid);
}

function renderRoute() {
  if (artworkDialog.open) artworkDialog.close();
  cancelAnimationFrame(frame);
  route = resolveRoute(location.pathname);
  updateLocaleLinks();
  const { collection, item, missing, sitemap } = route;
  updateNavigation(collection, item, missing);
  shell.classList.toggle("library-shell", !collection);
  document.title = collection
    ? `${collection.title} · ${t("设计案例库", "Design Case Library")}`
    : t("设计案例库", "Design Case Library");
  if (sitemap) {
    document.title = `${t("站点地图", "Sitemap")} · ${t("设计案例库", "Design Case Library")}`;
    renderSitemap();
  } else if (missing) {
    main.innerHTML = `<h1 id="case-title" tabindex="-1">${t("找不到案例", "Case not found")}</h1><p><a href="${libraryHref()}">${t("返回案例库", "Back to the library")}</a></p>`;
  } else if (item) {
    renderCase(collection, item);
  } else {
    renderOverview(collection);
    renderCatalog();
  }
  prepareMotionExamples(main);
}

document.querySelector(".skip-link").addEventListener("click", (event) => {
  event.preventDefault();
  main.focus();
});
document.addEventListener("keydown", (event) => {
  if (!route.item || (event.key !== "ArrowLeft" && event.key !== "ArrowRight")) return;
  if (event.defaultPrevented || event.repeat || event.isComposing ||
      event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  if (event.target.closest("input, textarea, select, [contenteditable], .case-workspace, .source-menu") ||
      document.querySelector("dialog[open]")) return;

  const adjacentCase = main.querySelector(`.case-nav a[aria-keyshortcuts="${event.key}"]`);
  if (!adjacentCase) return;
  event.preventDefault();
  adjacentCase.click();
});
function navigateToRoute() {
  renderRoute();
  document.querySelector("#case-title").focus({ preventScroll: true });
  window.scrollTo(0, 0);
}

document.addEventListener("click", (event) => {
  if (event.defaultPrevented || event.button !== 0 ||
      event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  const link = event.target.closest("a[href]");
  if (!link || link.target || link.hasAttribute("download") ||
      link.origin !== location.origin || link.classList.contains("locale-switch") || link.hash || link.search ||
      resolveRoute(link.pathname).missing) return;

  event.preventDefault();
  if (link.href === location.href) return;
  history.pushState(null, "", link.href);
  navigateToRoute();
});
window.addEventListener("popstate", navigateToRoute);
document.addEventListener("load", ({ target }) => {
  if (target instanceof HTMLImageElement && target.hasAttribute("data-fade-on-load")) {
    target.classList.add("image-loaded");
  }
}, true);
renderRoute();
delete document.documentElement.dataset.localizing;

function selectDemoOption(button) {
  const group = button.parentElement;
  group
    .querySelector('[aria-pressed="true"]')
    ?.setAttribute("aria-pressed", "false");
  button.setAttribute("aria-pressed", "true");
}

const synchronizedControls = [
  ".postcard-flip",
  ".print-guides-toggle",
  ".hacker-gray",
  ".hacker-grid-toggle",
  ".hacker-space-guides",
  ".hacker-weight-zoom",
  ".hacker-rule-guides",
  ".hacker-column-guides",
  ".hacker-narrow",
  ".hacker-reveal-ink",
  ".hacker-type-toggle",
];

main.addEventListener("input", (event) => {
  const matched = synchronizedControls.find((selector) =>
    event.target.matches(selector),
  );
  if (matched) {
    for (const toggle of main.querySelectorAll(matched)) {
      toggle.checked = event.target.checked;
    }
    return;
  }
  if (event.target.matches("[data-hacker-row]")) {
    for (const row of main.querySelectorAll("[data-hacker-row]")) {
      if (row.dataset.hackerRow === event.target.dataset.hackerRow) {
        row.checked = event.target.checked;
      }
    }
    return;
  }
  if (!event.target.matches(".print-headline")) return;
  const headline = event.target.textContent;
  for (const other of main.querySelectorAll(".print-headline")) {
    if (other !== event.target) other.textContent = headline;
  }
});

main.addEventListener("submit", (event) => {
  const form = event.target.closest("[data-demo-form]");
  if (!form) return;
  event.preventDefault();
  form.querySelector(".demo-feedback").textContent =
    t(`${event.submitter.textContent}成功（本地演示）`, `${event.submitter.textContent}: success (local demo)`);
});

main.addEventListener("change", (event) => {
  if (!event.target.matches(".depth-layer input[type=file]")) return;
  const file = event.target.files[0];
  event.target.parentElement.querySelector(".demo-feedback").textContent = file
    ? t(`已选择：${file.name}`, `Selected: ${file.name}`)
    : "";
});

artworkDialog.addEventListener("click", (event) => {
  if (event.target === artworkDialog) artworkDialog.close();
});

main.addEventListener("click", (event) => {
  const artworkButton = event.target.closest('button[aria-controls="artwork-dialog"]');
  if (artworkButton) {
    const src = artworkButton.querySelector("img").src;
    if (artworkPreview.src !== src) {
      artworkPreview.classList.remove("image-loaded");
      artworkPreview.src = src;
    }
    artworkPreview.dataset.kind = route.collection.artwork.kind;
    artworkPreview.alt = route.collection.title;
    artworkDialog.showModal();
    return;
  }
  const button = event.target.closest("[data-demo-action]");
  if (!button) return;
  if (button.dataset.demoAction === "cleanup-motion") {
    const comparison = button.closest(".comparison");
    comparison.classList.remove("cleanup-motion-playing");
    comparison.getBoundingClientRect();
    comparison.classList.add("cleanup-motion-playing");
    return;
  }
  const widget = button.closest(".widget");
  const status = widget.querySelector(".demo-feedback");
  const confirmation = widget.querySelector(".demo-confirm");
  switch (button.dataset.demoAction) {
    case "tile":
      selectDemoOption(button);
      status.textContent = t(`已选中${button.dataset.label} · ${button.dataset.count} 个项目`, `Selected: ${button.dataset.label} · ${button.dataset.count} projects`);
      break;
    case "swatch":
      selectDemoOption(button);
      status.textContent = `${button.dataset.label} · ${button.dataset.color}`;
      break;
    case "export":
      status.textContent = t("在项目设置中选择「导出」，再选择所需文件格式。", "In project settings, select Export and choose a file format.");
      break;
    case "browse":
      status.textContent = t("素材预览：工作区模板、排版指南、组件清单。", "Preview: workspace templates, typography guide, and component list.");
      break;
    case "details":
      status.textContent = t("团队工作区 · 3 个项目 · 最近更新于 10 分钟前", "Team workspace · 3 projects · Updated 10 minutes ago");
      break;
    case "file":
      widget.querySelector("input[type=file]").click();
      break;
    case "ask-remove":
      confirmation.hidden = false;
      confirmation.querySelector("button").focus();
      break;
    case "cancel-remove":
      confirmation.hidden = true;
      widget.querySelector('[data-demo-action="ask-remove"]').focus();
      break;
    case "remove":
      widget.querySelectorAll("input, button").forEach((control) => {
        control.disabled = true;
      });
      if (confirmation) confirmation.hidden = true;
      status.textContent = t("已移除成员（本地演示）", "Member removed (local demo)");
      break;
  }
});
