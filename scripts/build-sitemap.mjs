import { writeFile } from "node:fs/promises";
import { collections, libraryBaseUrl, libraryUrl } from "../site/app/library.js";

const entities = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" };
const escapeXml = (value) => value.replace(/[&<>"']/g, (char) => entities[char]);
const absoluteUrl = (collection, item) =>
  escapeXml(libraryUrl(collection, item));

const sources = collections.map((collection) => {
  const chapters = collection.categories.map((chapter) => {
    const cases = chapter.items.map((item) => `      <case url="${absoluteUrl(collection, item)}">
        <title>${escapeXml(item.title)}</title>
        <summary>${escapeXml(item.tip)}</summary>
      </case>`).join("\n");
    return `    <chapter title="${escapeXml(chapter.title)}">
${cases}
    </chapter>`;
  }).join("\n");
  return `  <collection url="${absoluteUrl(collection)}">
    <title>${escapeXml(collection.title)}</title>
    <summary>${escapeXml(collection.description)}</summary>
${chapters}
  </collection>`;
}).join("\n");

await writeFile(new URL("../site/sitemap.xml", import.meta.url), `<?xml version="1.0" encoding="UTF-8"?>
<sitemap xml:lang="zh-CN" home="${libraryBaseUrl}">
${sources}
</sitemap>
`);
