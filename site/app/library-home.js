import { collectionCases, collections, libraryHref } from "./library.js";

export function renderArtwork(artwork, preview = false) {
  if (!artwork) return "";
  const dimensions = artwork.width && artwork.height
    ? ` width="${artwork.width}" height="${artwork.height}"`
    : "";
  const image = `<img src="${artwork.src}"${dimensions} alt="" decoding="async" data-fade-on-load>`;
  const classes = `library-artwork library-artwork--${artwork.kind}`;
  return preview
    ? `<button type="button" class="${classes}" aria-label="${artwork.kind === "cover" ? "放大查看封面" : "放大查看 Logo"}" aria-haspopup="dialog" aria-controls="artwork-dialog">${image}</button>`
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
          <p class="card-meta"><span>${entry.type} · ${items.length} 个案例</span><span>${entry.author}</span></p>
        </div>
      </article>`;
  }).join("");

  return `
    <h1 id="case-title" tabindex="-1">设计案例库</h1>
    <p class="intro">通过前后对照和交互演示学习界面设计。</p>
    <div class="library-grid${loading ? ' library-skeleton" role="status" aria-label="正在加载案例来源' : ""}">${cards}
    </div>`;
}
