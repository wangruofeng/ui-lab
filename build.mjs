import { copyFile, cp, mkdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL(".", import.meta.url));
const output = join(root, "dist");
const siteFiles = [
  "index.html",
  "app.js",
  "sliding-tabs.js",
  "navigation.js",
  "library.js",
  "loading-dev-cases.js",
  "loading-demo.js",
  "loading-dev-spinners.js",
  "loading-dev-LICENSE.md",
  "transitions-cases.js",
  "transitions-catalog.js",
  "transitions-gallery-demos.js",
  "transitions-navigation-demos.js",
  "transitions-demo.js",
  "transitions-demo.css",
  "transitions-official-numbers.js",
  "transitions-official-numbers.css",
  "transitions-dev-LICENSE.md",
  "shadcn-cases.js",
  "shadcn-demo.js",
  "shadcn-ui-LICENSE.md",
  "shadcn-demo.css",
  "cases.js",
  "prompts.js",
  "scenes.js",
  "styles.css",
  "non-designer-cases.js",
  "design-hackers-cases.js",
  "design-hackers-scene.js",
  "design-hackers.css",
  "kill-slop-cases.js",
  "kill-slop-scene.js",
  "kill-slop.css",
  "motion-primitives.js",
  "motion-primitives.css",
  "motion-primitives-cases.js",
  "motion-primitives-examples.js",
  "motion-primitives-examples.css",
  "playbook-cases.js",
  "brand-mark.png",
  "mountains.jpg",
  "ornament-blue.webp",
];

await rm(output, { recursive: true, force: true });
await mkdir(output);
await Promise.all([
  ...siteFiles.map((file) => copyFile(join(root, file), join(output, file))),
  ...["source-art", "playbook-demo", "shadcn-attachment-demo", "shadcn-official-demo", "fonts"].map((directory) =>
    cp(join(root, directory), join(output, directory), { recursive: true }),
  ),
]);
