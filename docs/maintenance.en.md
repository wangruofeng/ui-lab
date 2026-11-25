# Development, builds, and demo maintenance

[简体中文](./maintenance.md) · English · [Project home](../README.en.md)

## Local development

With Node.js and npm installed, run `npm start` and open <http://127.0.0.1:4322/en>.

Local preview startup and builds generate an [XML sitemap](http://127.0.0.1:4322/sitemap.xml) with case sources, chapters, titles, summaries, and canonical URLs.

## Project layout

- `site/index.html` is the site entry point. `site/app/` contains routing, navigation, rendering, and shared styles.
- `site/cases/` organizes case data, interactions, and styles by source.
- `site/assets/` contains images and fonts. `site/demos/` contains bundled demos, and `site/licenses/` contains third-party licenses.
- `scripts/` contains the site and Playbook build scripts. `vendor-src/` contains the source used to rebuild shadcn/ui and Stageshow demos.

## Build and deployment

Run `npm run build` to generate the home page loading placeholder and XML sitemap and copy the publishable files to `dist/`. Then run `npm run preview` and open <http://127.0.0.1:4323/en> to preview the build.

Cloudflare Pages pulls GitHub's `main` branch, runs `npm run build`, and publishes `dist/`. Match the GitHub commit SHA to the Cloudflare Pages deployment record to confirm the live version. Source and case paths use Cloudflare Pages' default single-page app fallback and are handled by the root `index.html`.

After deployment, open and refresh source pages, case pages, and `/sitemap` directly. Verify that each address displays the corresponding content and that source and case links in `/sitemap.xml` use path-based URLs. A previous deployment may also return HTTP 200 through its single-page app fallback, so check the rendered content and XML links.

## Add a reference source

Read the [UI Lab case curation skill](../skills/ui-lab-case-curation/SKILL.md). Add a source to `collections` in `site/app/library.js` with a unique ID, source link, introduction, and chapters. Case IDs must be unique within the source. Use `criterion` to define a case-specific acceptance criterion for the prompt. Reuse a template from `site/app/scenes.js` or add a renderer when needed.

## Routing and case navigation

On desktop, chapter headings and case entries in the left-hand directory share the same light gray hover background. The current case uses that background with the same text color and weight as a regular entry.

- Source pages use `/source`, case pages use `/source/case`, and the site map uses `/sitemap`. Legacy fragment routes have been retired.
- Generate internal links with `libraryHref()`. Use `libraryUrl()` for production links in the XML sitemap and case prompts.
- Collection pages and the site map share a chapter card layout. Each source has its own columns. Cards are added in chapter order to the current shortest column. The layout uses one column when space is limited.

## Update the UI Skills Playbook demos

The repository ships bundled demos and the MIT license. Local preview needs no extra dependencies. The Playbook cases are grouped into five topics and retain the upstream controls and interactions. To update the demos from a neighboring `ui-skills` checkout, install its dependencies and run `node scripts/build-playbook.mjs` in this repository. Before rebuilding, update the categories and prompt acceptance criteria in `site/cases/ui-skills/playbook-cases.js`. The build checks that the categories cover every upstream demo.

## Update the shadcn/ui demos

Rebuild the Attachment demo.

```sh
npm ci --prefix vendor-src/shadcn-attachment-src
node vendor-src/shadcn-attachment-src/build.mjs
```

The Attachment demo uses the official component and example. Its three photos are distributed under the Unsplash License. [Component registry](https://ui.shadcn.com/r/styles/base-rhea/attachment.json) · [Official example](https://github.com/shadcn-ui/ui/blob/main/apps/v4/examples/base/attachment-demo.tsx) · [Unsplash License](https://unsplash.com/license)

Rebuild the remaining 16 demos and their dependency licenses.

```sh
npm ci --prefix vendor-src/shadcn-official-src --legacy-peer-deps
node vendor-src/shadcn-official-src/build.mjs
```

Local preview and site builds use the bundled demos. Toast, Slider, Dropdown Menu, and Sidebar use examples and Base Nova registry components from the pinned upstream revision. [Official examples](https://github.com/shadcn-ui/ui/tree/main/apps/v4/examples/base) · [Interactive bar chart source](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/charts/chart-bar-interactive.tsx) · [Upstream 055aa6b](https://github.com/shadcn-ui/ui/tree/055aa6b7837b1808456a24beb4c97a677864aa82/apps/v4/examples/base) · [Bundled demos](../site/demos/shadcn-official-demo/)

## Update the Stageshow demos

The collection includes 34 official cases and retains the upstream player and scripts. Rebuilding requires Node.js 20.19 or later. [Stageshow 299140f](https://github.com/benjitaylor/skills/tree/299140fafd08df55a9c234e610c3f64af3f45531/stageshow)

```sh
npm ci --prefix vendor-src/stageshow-src
npm run typecheck --prefix vendor-src/stageshow-src
npm run build --prefix vendor-src/stageshow-src
```

[Asset notices](../vendor-src/stageshow-src/NOTICE.md) · [Stageshow and dependency licenses](../site/licenses/stageshow-LICENSE.txt)

## Site languages

Unprefixed paths use Simplified Chinese. English pages use the `/en` prefix, as in `/en/refactoring-ui/feature`. The header's language link switches the current page between languages. Both versions share source and case IDs. Deep links are handled by the single-page app fallback.

English typography is configured by page language in `site/app/styles.css`. Body text and navigation use self-hosted Inter. Code in prompts uses Roboto Mono. Page titles use Saans Medium when it is installed on the visitor's device and fall back to Inter.

Maintain static site copy in `site/index.html` and `site/app/locale-shell.js`. The English source, chapter, and case names live in `site/app/library-en.js`. English case descriptions, design notes, book references, and acceptance criteria live in `site/app/case-copy-*-en.js`. Maintain demo copy in each module with `t(Chinese, English)`. Embedded Playbook demos use `lang=en` to show the original English copy. When adding or updating a case, provide descriptions, demo copy, and prompts in both languages. The build checks English case navigation, metadata, and prompts for remaining Chinese characters.

## Documentation languages

The default project documentation is in Simplified Chinese. English versions use the `.en.md` suffix. Update both versions together and link to the matching language when adding documentation links. The README images are stored in `docs/images/`.
