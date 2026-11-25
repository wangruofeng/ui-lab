# 开发、构建与演示维护

[返回项目首页](../README.md)

## 本地开发

运行 `npm start`，访问 <http://127.0.0.1:4322/>。需要 Node.js、npm 和 Python 3。

启动预览和构建时会生成 [XML 站点地图](http://127.0.0.1:4322/sitemap.xml)，其中包含案例的来源、章节、标题、摘要和正式链接。

## 项目目录

- `site/index.html` 是站点入口，`site/app/` 存放全站路由、导航、渲染和公共样式。
- `site/cases/` 按来源组织案例数据、交互代码和专用样式。
- `site/assets/` 存放图片和字体，`site/demos/` 存放随站点分发的演示，`site/licenses/` 存放第三方许可。
- `scripts/` 存放站点和 Playbook 构建脚本，`vendor-src/` 存放用于重新打包 shadcn/ui 和 Stageshow 演示的源码。

## 构建与部署

运行 `npm run build` 将 `site/` 发布文件复制到 `dist/`。可以用以下命令预览当前工作区的构建产物。

```sh
python3 -m http.server 4323 --bind 127.0.0.1 --directory dist
```

Cloudflare Pages 从 GitHub 的 `main` 分支拉取代码，运行 `npm run build`，并发布 `dist/`。在 Pages 的部署记录中对照 GitHub 提交 SHA，即可确认生产站点使用的版本。

## 添加参考来源

先阅读 [UI Lab 案例收录技能](../skills/ui-lab-case-curation/SKILL.md)，再在 `site/app/library.js` 的 `collections` 中增加一个来源，设置独立 ID、来源链接、介绍和章节。案例 ID 在来源内唯一，可用 `criterion` 声明独立的提示词验收条件。演示可复用 `site/app/scenes.js` 的现有模板，也可按需增加渲染器。

案例链接统一使用 `#/来源/案例`。

## 更新 UI Skills Playbook 演示

本项目随附已打包的演示和 MIT 许可证，日常预览无需安装额外依赖。Playbook 案例按五个主题收录，使用原项目的切换和交互组件。需要从相邻的 `ui-skills` 源码更新演示时，先安装该仓库的依赖，再在本项目运行 `node scripts/build-playbook.mjs`。重打包前，更新 `site/cases/ui-skills/playbook-cases.js` 中的分类和提示词验收条件。打包会检查分类是否完整覆盖原演示清单。

## 更新 shadcn/ui 演示

更新 Attachment 演示。

```sh
npm ci --prefix vendor-src/shadcn-attachment-src
node vendor-src/shadcn-attachment-src/build.mjs
```

Attachment 使用官方组件和示例。示例内的三张照片按 Unsplash 许可分发。[组件注册表](https://ui.shadcn.com/r/styles/base-rhea/attachment.json) · [官网示例](https://github.com/shadcn-ui/ui/blob/main/apps/v4/examples/base/attachment-demo.tsx) · [Unsplash 许可](https://unsplash.com/license)

更新其余 16 个演示及依赖许可。

```sh
npm ci --prefix vendor-src/shadcn-official-src --legacy-peer-deps
node vendor-src/shadcn-official-src/build.mjs
```

日常预览和构建直接使用打包后的演示。Toast、Slider、Dropdown Menu 和 Sidebar 使用指定上游版本的示例及 Base Nova 注册表组件。[官网示例源码](https://github.com/shadcn-ui/ui/tree/main/apps/v4/examples/base) · [交互柱状图源码](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/charts/chart-bar-interactive.tsx) · [上游 055aa6b](https://github.com/shadcn-ui/ui/tree/055aa6b7837b1808456a24beb4c97a677864aa82/apps/v4/examples/base) · [构建产物](../site/demos/shadcn-official-demo/)

## 更新 Stageshow 演示

收录 34 个官方案例，演示保留上游播放器与脚本。重新打包需要 Node.js 20.19 或更高版本。[Stageshow 299140f](https://github.com/benjitaylor/skills/tree/299140fafd08df55a9c234e610c3f64af3f45531/stageshow)

```sh
npm ci --prefix vendor-src/stageshow-src
npm run typecheck --prefix vendor-src/stageshow-src
npm run build --prefix vendor-src/stageshow-src
```

[资产声明](../vendor-src/stageshow-src/NOTICE.md) · [Stageshow 及依赖许可证](../site/licenses/stageshow-LICENSE.txt)
