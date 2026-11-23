import { collectionCases, collections, libraryHref } from "./library.js";

const header = document.querySelector(".site-header");
const homeLink = header.querySelector(".brand");
const currentSource = header.querySelector(".current-source");
const currentSourceLink = currentSource.querySelector("a");
const sourceMenu = header.querySelector(".source-menu");
const sourceList = header.querySelector(".source-options");
const searchButton = header.querySelector(".open-search");
const searchDialog = document.querySelector("#search-dialog");
const queryInput = document.querySelector("#global-search");
const searchResults = document.querySelector("#search-results");
const searchStatus = document.querySelector("#search-status");
const catalogButton = header.querySelector(".catalog-jump");
const catalogDialog = document.querySelector("#catalog-dialog");
const sidebar = document.querySelector(".sidebar");
const shell = document.querySelector(".shell");
const caseMain = document.querySelector("#case");
const narrow = matchMedia("(max-width: 760px)");

const caseIndex = collections.flatMap((collection) =>
  collectionCases(collection).map((item) => ({
    collection,
    item,
    title: item.title.toLowerCase(),
    context: [
      collection.title,
      item.category,
      item.scene,
      item.tip,
      item.referenceLabel,
      ...item.outline,
    ]
      .join(" ")
      .toLowerCase(),
  })),
);

sourceList.innerHTML = collections
  .map(
    (collection) =>
      `<li><a href="${libraryHref(collection)}" data-source-id="${collection.id}">${collection.title}</a></li>`,
  )
  .join("");

function closeNavigation() {
  sourceMenu.open = false;
  if (searchDialog.open) searchDialog.close();
  if (catalogDialog.open) catalogDialog.close();
}

function placeCatalog() {
  catalogButton.hidden = !narrow.matches || sidebar.hidden;
  if (narrow.matches) {
    catalogDialog.querySelector(".catalog-content").append(sidebar);
  } else {
    if (catalogDialog.open) catalogDialog.close();
    shell.insertBefore(sidebar, caseMain);
  }
}

export function updateNavigation(collection, item, missing) {
  closeNavigation();
  sourceMenu.hidden = !item;
  sidebar.hidden = !collection;
  catalogButton.hidden = !narrow.matches || !collection;
  currentSource.hidden = !collection;
  currentSourceLink.textContent = collection?.title ?? "";
  if (collection) currentSourceLink.href = libraryHref(collection);
  else currentSourceLink.removeAttribute("href");
  document.querySelector(".sidebar-source").textContent =
    collection?.title ?? "";
  if (!collection && !missing) homeLink.setAttribute("aria-current", "page");
  else homeLink.removeAttribute("aria-current");
  for (const link of sourceList.querySelectorAll("a")) {
    if (link.dataset.sourceId === collection?.id) {
      link.setAttribute("aria-current", item ? "location" : "page");
    } else {
      link.removeAttribute("aria-current");
    }
  }
}

function renderSearchResults() {
  const query = queryInput.value.trim().toLowerCase();
  if (!query) {
    searchResults.replaceChildren();
    searchStatus.textContent = "输入案例名称、来源或关键词。";
    return;
  }
  const terms = query.split(/\s+/);
  const matches = caseIndex
    .filter(({ title, context }) =>
      terms.every((term) => title.includes(term) || context.includes(term)),
    )
    .sort(
      (a, b) =>
        Number(b.title.includes(query)) - Number(a.title.includes(query)),
    );
  const shown = matches.slice(0, 24);
  searchStatus.textContent =
    matches.length > shown.length
      ? `共 ${matches.length} 个结果，显示前 ${shown.length} 个。`
      : matches.length
        ? `${matches.length} 个结果`
        : "没有找到匹配的案例。";
  searchResults.innerHTML = shown
    .map(
      ({ collection, item }) => `
    <li><a href="${libraryHref(collection, item)}"><strong>${item.title}</strong><small>${collection.title} · ${item.category}</small></a></li>`,
    )
    .join("");
}

function openSearch() {
  closeNavigation();
  queryInput.value = "";
  renderSearchResults();
  searchDialog.showModal();
  queryInput.focus();
}

searchButton.addEventListener("click", openSearch);
queryInput.addEventListener("input", renderSearchResults);
queryInput.addEventListener("keydown", (event) => {
  if (event.isComposing || !["ArrowDown", "Enter"].includes(event.key)) return;
  const result = searchResults.querySelector("a");
  if (!result) return;
  event.preventDefault();
  if (event.key === "Enter") result.click();
  else result.focus();
});
catalogButton.addEventListener("click", () => {
  if (catalogButton.hidden || !catalogDialog.contains(sidebar)) return;
  closeNavigation();
  catalogDialog.showModal();
});
narrow.addEventListener("change", placeCatalog);
placeCatalog();

for (const dialog of [searchDialog, catalogDialog]) {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog || event.target.closest("a[href]"))
      dialog.close();
  });
}

sourceList.addEventListener("click", (event) => {
  const link = event.target.closest("a[href]");
  if (!link) return;
  sourceMenu.open = false;
  if (link.hash === location.hash) sourceMenu.querySelector("summary").focus();
});
document.addEventListener("click", (event) => {
  if (sourceMenu.open && !sourceMenu.contains(event.target))
    sourceMenu.open = false;
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && sourceMenu.open) {
    sourceMenu.open = false;
    sourceMenu.querySelector("summary").focus();
  }
  if (
    (event.metaKey || event.ctrlKey) &&
    !event.altKey &&
    event.key.toLowerCase() === "k"
  ) {
    event.preventDefault();
    if (!searchDialog.open) openSearch();
  }
});
