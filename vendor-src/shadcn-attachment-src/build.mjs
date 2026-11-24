import { createRequire } from "node:module";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join, resolve } from "node:path";

const source = fileURLToPath(new URL(".", import.meta.url));
const output = resolve(source, "../../site/demos/shadcn-attachment-demo");
const dependencies = process.argv[2] ? resolve(process.argv[2]) : source;
const requireBuild = createRequire(join(dependencies, "package.json"));
const { build } = requireBuild("esbuild");
const { compile, optimize } = requireBuild("@tailwindcss/node");
const { Scanner } = requireBuild("@tailwindcss/oxide");
const nodeModules = join(dependencies, "node_modules");

const bundle = await build({
  entryPoints: [join(source, "entry.tsx")],
  outfile: join(output, "demo.js"),
  nodePaths: [nodeModules],
  absWorkingDir: source,
  alias: {
    cn: join(source, "registry-adapters.tsx"),
    "@/app/(create)/components/icon-placeholder": join(source, "registry-adapters.tsx"),
    "@/registry/base-rhea/ui/button": join(source, "button.tsx"),
  },
  bundle: true,
  format: "esm",
  jsx: "automatic",
  minify: true,
  metafile: true,
  legalComments: "eof",
  define: { "process.env.NODE_ENV": '"production"' },
});

const files = await readdir(source);
const candidates = await Promise.all([
  ...files.filter(file => file.endsWith(".tsx")).map(async (file) => ({
    content: await readFile(join(source, file), "utf8"),
    extension: "tsx",
  })),
  { content: await readFile(join(output, "index.html"), "utf8"), extension: "html" },
]);
const sheets = await Promise.all(["theme.css", "official-utilities.css"].map(
  file => readFile(join(source, file), "utf8"),
));
const tailwind = await compile(sheets.join("\n"), { base: dependencies, onDependency() {} });
const scanner = new Scanner({ sources: [] });
const style = tailwind.build(scanner.scanFiles(candidates));
await writeFile(join(output, "demo.css"), optimize(style, { minify: true }).code);

const packages = new Set(["tailwindcss"]);
for (const file of Object.keys(bundle.metafile.inputs)) {
  const pkg = file.match(/node_modules\/((?:@[^/]+\/)?[^/]+)\//g)?.at(-1);
  if (pkg) packages.add(pkg.slice("node_modules/".length, -1));
}
const licenses = await Promise.all([...packages].sort().map(async (pkg) => {
  const directory = join(nodeModules, pkg);
  const file = (await readdir(directory)).find(name => /^licen[cs]e(?:\.|$)/i.test(name));
  if (!file) throw new Error(`缺少 ${pkg} 的许可证文件`);
  return `${pkg}\n\n${(await readFile(join(directory, file), "utf8")).trim()}`;
}));
const shadcnLicense = await readFile(resolve(source, "../../site/licenses/shadcn-ui-LICENSE.md"), "utf8");
await writeFile(join(output, "THIRD-PARTY-NOTICES.txt"), [
  `shadcn/ui\n\n${shadcnLicense.trim()}`,
  ...licenses,
].join("\n\n----------------------------------------\n\n") + "\n");
