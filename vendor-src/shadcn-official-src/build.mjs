import { readdir, readFile, writeFile, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join, resolve } from "node:path";
import { build } from "esbuild";
import { compile, optimize } from "@tailwindcss/node";
import { Scanner } from "@tailwindcss/oxide";

const source = fileURLToPath(new URL(".", import.meta.url));
const output = resolve(source, "../../site/demos/shadcn-official-demo");
const upstream = join(source, "upstream");
const nodeModules = join(source, "node_modules");

const files = (await readdir(upstream, { recursive: true }))
  .filter(file => /\.[jt]sx?$/.test(file));
const sources = await Promise.all(files.map(async file => ({
  content: await readFile(join(upstream, file), "utf8"),
  extension: file.endsWith(".tsx") ? "tsx" : "ts",
})));
const iconNames = [...new Set(sources.flatMap(({ content }) =>
  [...content.matchAll(/\blucide="([A-Za-z]\w+)"/g)].map(([, name]) => name),
))].sort();

const bundle = await build({
  entryPoints: [join(source, "entry.tsx")],
  outdir: output,
  absWorkingDir: source,
  plugins: [{
    name: "official-shadcn-imports",
    setup(plugin) {
      plugin.onResolve({ filter: /^@\// }, ({ path }) => {
        const component = path.match(/^@\/(?:styles|registry)\/([^/]+)\/ui\/(.+)$/);
        if (component) return { path: join(upstream, "ui", component[1], component[2] + ".tsx") };
        if (path === "@/app/(create)/components/icon-placeholder") {
          return { path, namespace: "shadcn-icons" };
        }
        const support = {
          "@/components/message-animated": "message-animated.tsx",
          "@/lib/ai": "ai.ts",
          "@/lib/message-animations": "message-animations.ts",
        }[path];
        if (support) return { path: join(upstream, "support", support) };
        return { errors: [{ text: `未找到官方示例的本地依赖 ${path}` }] };
      });
      plugin.onLoad({ filter: /.*/, namespace: "shadcn-icons" }, () => ({
        contents: `
          import { ${iconNames.join(", ")} } from "lucide-react";
          const icons = { ${iconNames.join(", ")} };
          export function IconPlaceholder({ lucide, tabler, hugeicons, phosphor, remixicon, ...props }) {
            const Icon = icons[lucide];
            return Icon ? <Icon {...props} /> : null;
          }
        `,
        resolveDir: source,
        loader: "jsx",
      }));
    },
  }],
  bundle: true,
  splitting: true,
  format: "esm",
  jsx: "automatic",
  minify: true,
  write: false,
  metafile: true,
  legalComments: "eof",
  define: { "process.env.NODE_ENV": '"production"' },
});

const theme = await readFile(join(source, "theme.css"), "utf8");
const utilities = await readFile(join(upstream, "tailwind.css"), "utf8");
const stylesheet = await compile([theme, utilities].join("\n"), {
  base: source,
  onDependency() {},
});
const scanner = new Scanner({ sources: [] });
const candidates = [...sources, {
  content: await readFile(join(output, "index.html"), "utf8"),
  extension: "html",
}];
const css = optimize(stylesheet.build(scanner.scanFiles(candidates)), { minify: true }).code;

const packages = new Set(["tailwindcss", "tw-animate-css"]);
for (const file of Object.keys(bundle.metafile.inputs)) {
  const pkg = file.match(/node_modules\/((?:@[^/]+\/)?[^/]+)\//g)?.at(-1);
  if (pkg) packages.add(pkg.slice("node_modules/".length, -1));
}
const licenses = await Promise.all([...packages].sort().map(async (pkg) => {
  const directory = join(nodeModules, pkg);
  const file = (await readdir(directory)).find(name => /^licen[cs]e(?:\.|$)/i.test(name));
  if (file) return `${pkg}\n\n${(await readFile(join(directory, file), "utf8")).trim()}`;
  if (pkg.startsWith("@ai-sdk/")) {
    return `${pkg}\n\n同属 Vercel AI SDK，见 ai 的 Apache 2.0 许可。`;
  }
  if (["@shadcn/react", "@shadcn/helpers"].includes(pkg)) {
    return `${pkg}\n\n与上面的 shadcn/ui 官方 MIT 许可相同。`;
  }
  if (pkg === "react-remove-scroll-bar") {
    const license = await readFile(join(upstream, "licenses", `${pkg}.txt`), "utf8");
    return `${pkg}\n\n${license.trim()}`;
  }
  throw new Error(`缺少 ${pkg} 的许可证文件`);
}));
const shadcnLicense = await readFile(resolve(source, "../../site/licenses/shadcn-ui-LICENSE.md"), "utf8");
const fontsLicense = await readFile(resolve(source, "../../site/demos/shadcn-attachment-demo/assets/GEIST-LICENSE.txt"), "utf8");
const notices = [
  `shadcn/ui\n\n${shadcnLicense.trim()}`,
  `Geist 和 Geist Mono\n\n${fontsLicense.trim()}`,
  ...licenses,
].join("\n\n----------------------------------------\n\n") + "\n";

const entry = join(output, "entry.js");
const chunks = bundle.outputFiles.filter(file => file.path !== entry);
await Promise.all([
  ...chunks.map(file => writeFile(file.path, file.contents)),
  writeFile(join(output, "demo.css"), css),
  writeFile(join(output, "THIRD-PARTY-NOTICES.txt"), notices),
]);
await writeFile(entry, bundle.outputFiles.find(file => file.path === entry).contents);
const current = new Set(bundle.outputFiles.map(file => file.path));
await Promise.all((await readdir(output))
  .filter(file => file.endsWith(".js") && !current.has(join(output, file)))
  .map(file => rm(join(output, file))));
