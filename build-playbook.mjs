import { createRequire } from "node:module";
import { readFile, writeFile, mkdir, copyFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { playbookCategories } from "./playbook-cases.js";

const projectDir = path.dirname(fileURLToPath(import.meta.url));
const upstream = path.resolve(
  process.argv[2] || path.join(projectDir, "../ui-skills"),
);
const output = path.join(projectDir, "playbook-demo");
const requireUpstream = createRequire(path.join(upstream, "package.json"));
const { build } = requireUpstream("esbuild");
const { compile, optimize } = requireUpstream("@tailwindcss/node");
const { Scanner } = requireUpstream("@tailwindcss/oxide");

const manifest = await readFile(
  path.join(upstream, "src/data/playbook-demos.ts"),
  "utf8",
);
const registered = [...manifest.matchAll(/^\s+"([^"]+)",$/gm)].map(
  (match) => match[1],
);
const ids = playbookCategories.flatMap((category) =>
  category.items.map((item) => item.id),
);
if (
  ids.length !== new Set(ids).size ||
  [...registered].sort().join() !== [...ids].sort().join()
) {
  throw new Error("案例分类必须覆盖所有 Playbook 演示，每个演示仅收录一次。");
}

await mkdir(output, { recursive: true });
const entry = `
  import { createElement } from "react";
  import { createRoot } from "react-dom/client";
  import { PlaybookDemoRouter } from "./src/ui/playbook/demo-router.tsx";
  const slug = new URLSearchParams(location.search).get("case");
  const mount = document.querySelector("#demo");
  fetch("./translations.json").then(response => response.json()).then(dictionary => {
    createRoot(mount).render(createElement(PlaybookDemoRouter, { slug, dictionary }));
  }).catch(() => {
    mount.textContent = "案例加载失败，请刷新重试。";
  });
`;
const bundle = await build({
  stdin: { contents: entry, resolveDir: upstream },
  absWorkingDir: upstream,
  outfile: path.join(output, "demo.js"),
  bundle: true,
  format: "esm",
  jsx: "automatic",
  minify: true,
  metafile: true,
  legalComments: "eof",
  define: { "process.env.NODE_ENV": '"production"' },
  plugins: [
    {
      name: "portable-playbook-assets",
      setup(build) {
        build.onLoad(
          {
            filter:
              /(?:aspect-ratio-demo\.tsx|image-outline-demo\.tsx|i18n-core\.mjs)$/,
          },
          async ({ path: filename }) => {
            const contents = (await readFile(filename, "utf8"))
              .replace(
                /https:\/\/upload\.wikimedia\.org\/[^"]+/g,
                "../mountains.jpg",
              )
              .replace("/i18n/zh-CN.json", "./translations.json");
            return {
              contents,
              loader: filename.endsWith(".tsx") ? "tsx" : "js",
            };
          },
        );
      },
    },
  ],
});

const inputs = Object.keys(bundle.metafile.inputs).filter(
  (filename) => filename.startsWith("src/") && /\.[cm]?[jt]sx?$/.test(filename),
);
const sourceFiles = await Promise.all(
  inputs.map(async (filename) => ({
    content: await readFile(path.join(upstream, filename), "utf8"),
    extension: path.extname(filename).slice(1),
  })),
);
const original = await readFile(
  path.join(upstream, "public/i18n/zh-CN.json"),
  "utf8",
);
const source = sourceFiles
  .map((file) => file.content.replace(/\s+/g, " "))
  .join("\n");
const dictionary = Object.fromEntries(
  Object.entries(JSON.parse(original)).filter(
    ([key]) => key === "My favorites" || source.includes(key),
  ),
);
await writeFile(
  path.join(output, "translations.json"),
  JSON.stringify(dictionary),
);

const cssPath = path.join(upstream, "src/styles/global.css");
const baseCss = (await readFile(cssPath, "utf8"))
  .replace(/^@import "@fontsource\/[^"]+";\n/gm, "")
  .replace(/@font-face\s*\{[^}]+\}/, "");
const tailwind = await compile(baseCss, {
  base: path.dirname(cssPath),
  onDependency() {},
});
const scanner = new Scanner({ sources: [] });
const style = tailwind.build(scanner.scanFiles(sourceFiles));
await writeFile(
  path.join(output, "demo.css"),
  optimize(style, { minify: true }).code,
);
await copyFile(path.join(upstream, "LICENSE"), path.join(output, "LICENSE"));
console.log(`已打包 ${ids.length} 个 Playbook 演示。`);
