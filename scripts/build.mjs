import { copyFile, cp, rm } from "node:fs/promises";
import "./check-english-copy.mjs";
import "./build-sitemap.mjs";
import "./build-home.mjs";

const source = new URL("../site/", import.meta.url);
const output = new URL("../dist/", import.meta.url);

await rm(output, { recursive: true, force: true });
await cp(source, output, { recursive: true });
await copyFile(new URL("../LICENSE", import.meta.url), new URL("LICENSE", output));
