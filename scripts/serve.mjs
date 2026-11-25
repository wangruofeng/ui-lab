import { createReadStream } from "node:fs";
import { realpath, stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";
import { pipeline } from "node:stream";
import { fileURLToPath } from "node:url";
import { resolveRoute } from "../site/app/library.js";

const [directory = "site", port = "4322"] = process.argv.slice(2);
const root = await realpath(resolve(fileURLToPath(new URL("../", import.meta.url)), directory));
const host = "127.0.0.1";
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
};

const server = createServer(async (request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" }).end();
    return;
  }

  let url;
  let pathname;
  try {
    url = new URL(request.url, `http://${host}`);
    pathname = decodeURIComponent(url.pathname);
  } catch {
    response.writeHead(400).end();
    return;
  }
  if (pathname.includes("\0")) {
    response.writeHead(400).end();
    return;
  }

  try {
    let file = resolve(root, `.${pathname}`);
    if (file !== root && !file.startsWith(root + sep)) {
      response.writeHead(404).end();
      return;
    }

    const requested = await stat(file).catch((error) => {
      if (error.code !== "ENOENT" || resolveRoute(url.pathname).missing) throw error;
      return null;
    });
    if (!requested) {
      file = resolve(root, "index.html");
    } else if (requested.isDirectory()) {
      if (!url.pathname.endsWith("/")) {
        response.writeHead(301, { Location: `./${url.pathname.split("/").pop()}/${url.search}` }).end();
        return;
      }
      file = resolve(file, "index.html");
    }

    file = await realpath(file);
    if (!file.startsWith(root + sep)) {
      response.writeHead(404).end();
      return;
    }
    const details = await stat(file);
    if (!details.isFile()) {
      response.writeHead(404).end();
      return;
    }

    response.writeHead(200, {
      "Content-Type": contentTypes[extname(file)] ?? "application/octet-stream",
      "Content-Length": details.size,
    });
    if (request.method === "HEAD") {
      response.end();
      return;
    }
    pipeline(createReadStream(file), response, () => {});
  } catch (error) {
    const missing = ["ENOENT", "ENOTDIR"].includes(error.code);
    if (!missing) console.error(error);
    response.writeHead(missing ? 404 : 500).end();
  }
});

server.listen(Number(port), host, () => {
  console.log(`UI Lab: http://${host}:${server.address().port}/`);
});
