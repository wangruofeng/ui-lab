import { caseCount, t } from "./locale.js";
import { collectionCases, collections, libraryHref } from "./library.js";

export function renderArtwork(artwork, preview = false) {
  if (!artwork) return "";
  const dimensions = artwork.width && artwork.height
    ? ` width="${artwork.width}" height="${artwork.height}"`
    : "";
  const image = `<img src="${artwork.src}"${dimensions} alt="" decoding="async" data-fade-on-load>`;
  const classes = `library-artwork library-artwork--${artwork.kind}`;
  return preview
    ? `<button type="button" class="${classes}" aria-label="${artwork.kind === "cover" ? t("放大查看封面", "Enlarge the cover") : t("放大查看 Logo", "Enlarge the logo")}" aria-haspopup="dialog" aria-controls="artwork-dialog">${image}</button>`
    : `<div class="${classes}">${image}</div>`;
}

export function renderLibraryHome(loading = false) {
  const cards = collections.map((entry) => {
    const items = collectionCases(entry);
    const directDemo = items.length === 1 && items[0].kind === "interactive" ? items[0] : undefined;
    const artwork = loading && entry.artwork
      ? '<div class="library-artwork"></div>'
      : renderArtwork(entry.artwork);
    const title = loading
      ? `<span>${entry.title}</span>`
      : `<a href="${libraryHref(entry, directDemo)}">${entry.title}</a>`;
    return `
      <article class="library-card"${loading ? ' aria-hidden="true"' : ""}>
        ${artwork}
        <div class="library-card-copy">
          <h2>${title}</h2>
          <p class="library-card-description">${entry.description}</p>
          <p class="card-meta"><span>${entry.type} · ${caseCount(items.length)}</span><span>${entry.author}</span></p>
        </div>
      </article>`;
  }).join("");

  return `
    <h1 id="case-title" tabindex="-1">${t("设计案例库", "Design Case Library")}</h1>
    <p class="intro">${t("通过前后对照和交互演示学习界面设计。", "Learn interface design through before-and-after comparisons and interactive demos.")}</p>
    <div class="library-grid${loading ? " library-skeleton" : ""}"${loading ? ` role="status" aria-label="${t("正在加载案例来源", "Loading case sources")}"` : ""}>${cards}
    </div>`;
}
