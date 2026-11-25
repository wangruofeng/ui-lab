import { readFile, writeFile } from "node:fs/promises";
import { renderLibraryHome } from "../site/app/library-home.js";

const page = new URL("../site/index.html", import.meta.url);
const html = await readFile(page, "utf8");
const generatedRegion = /(<!-- library-loading:start -->)[\s\S]*?(<!-- library-loading:end -->)/;
const skeleton = renderLibraryHome(true).trimEnd().slice(1)
  .split("\n")
  .map((line) => `      ${line}`)
  .join("\n");
const updated = html.replace(generatedRegion, (_, start, end) => (
  `${start}\n${skeleton}\n          ${end}`
));
if (updated !== html) await writeFile(page, updated);
