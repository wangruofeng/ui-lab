# UI Lab · 设计案例库

[在线体验](https://ui-lab.wangruofeng007.com/) · [Cloudflare Pages 地址](https://ui-lab-esu.pages.dev/)

UI Lab 是一个可交互的设计案例库。当前版本为 **1.1.0**，收录 9 个来源、344 个案例。可以按来源和章节浏览，使用页首搜索跨来源查找，也可以打开封面或标识的大图。案例支持通过 `#/来源/案例` 直接访问和分享。

| 来源 | 案例数 | 内容 |
| --- | ---: | --- |
| 《重构 UI》 | 50 | 界面设计前后对照 |
| 《写给大家看的设计书》 | 43 | 排版与视觉设计案例及练习 |
| 《写给程序员的设计书》 | 43 | 设计原则与示例 |
| UI Skills Playbook | 47 | 按主题浏览交互动效 |
| Kill AI Slop | 35 | 界面优化前后对照 |
| loading.dev | 36 | 可调尺寸和速度的加载指示器，支持暂停和重播 |
| Transitions.dev | 44 | 表单反馈、内容状态、数字变化、导航、指针和加载动效 |
| shadcn/ui | 13 | 日期范围选择、搜索多选、表格、图表和附件等组件示例 |
| Motion Primitives | 33 | 可直接操作的动效案例 |

loading.dev 的演示由 loading-dev 0.3.8 组件生成静态标记和样式。Transitions.dev 的 Number pop-in 和 Spinning counter 使用对应的公开演示逻辑与样式，其余案例使用原生 HTML、CSS 和 JavaScript 对照公开资料实现。shadcn/ui 案例使用官方组件与示例源码，预览所需的脚本、样式和字体随站点分发。各案例页提供原始参考链接。

## 更新 shadcn/ui 演示

更新 Attachment 静态演示时，运行 `npm ci --prefix shadcn-attachment-src` 和 `node shadcn-attachment-src/build.mjs`。源码来自 [官方组件注册表](https://ui.shadcn.com/r/styles/base-rhea/attachment.json) 和 [官网示例](https://github.com/shadcn-ui/ui/blob/main/apps/v4/examples/base/attachment-demo.tsx)。示例内的三张照片与原页面一致，依照 [Unsplash 许可](https://unsplash.com/license)随演示提供。

其余 12 个案例使用 [官网示例源码](https://github.com/shadcn-ui/ui/tree/main/apps/v4/examples/base)、[交互柱状图源码](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/charts/chart-bar-interactive.tsx)和对应样式的官方组件注册表。更新后运行 `npm ci --prefix shadcn-official-src --legacy-peer-deps` 和 `node shadcn-official-src/build.mjs`，生成 [shadcn-official-demo](./shadcn-official-demo/) 的静态文件及依赖许可。日常预览和站点构建直接使用已打包的文件。

## 启动

运行 `npm start` 后访问 <http://127.0.0.1:4322/>。本地预览需要 Node.js、npm 和 Python 3，无需安装 npm 依赖。

案例页支持并排观察，点击「播放」将左侧示例过渡到右侧的状态。可以暂停、继续、拖动进度、重播，或通过页底链接切换相邻案例。系统开启减少动态效果时直接呈现目标状态。Motion Primitives 的案例可在两侧直接操作，按需触发、重播、拖动或滚动。

## 构建与部署

运行 `npm run build` 将静态站点打包到 `dist/`。可以用以下命令预览与线上相同的构建产物。

```sh
python3 -m http.server 4323 --bind 127.0.0.1 --directory dist
```

Cloudflare Pages 从 GitHub 的 `main` 分支拉取代码，运行 `npm run build`，并发布 `dist/`。在 Pages 的部署记录中对照 GitHub 提交 SHA，即可确认生产站点使用的版本。

## 来源与素材

项目用途、第三方权利和反馈方式见 [免责声明](./DISCLAIMER.md)。各来源的代码按对应的许可条款使用，包括 [loading.dev](./loading-dev-LICENSE.md)、[Transitions.dev](./transitions-dev-LICENSE.md) 和 [shadcn/ui](./shadcn-ui-LICENSE.md)。

书籍案例使用独立绘制的示例界面和整理后的练习说明。封面和项目标识用于识别各自来源，权利归原作者或权利人。演示用山谷照片和抽象插图由 AI 生成。

UI Skills Playbook 的演示源自 [ibelick/ui-skills](https://github.com/ibelick/ui-skills)。上游 MIT 许可和打包依赖的许可见 [playbook-demo](./playbook-demo/)。

## 添加参考来源

先阅读 [UI Lab 案例收录技能](./skills/ui-lab-case-curation/SKILL.md)，再在 `library.js` 的 `collections` 中增加一个来源，设置独立 ID、来源链接、介绍和章节。案例 ID 在来源内唯一，可用 `criterion` 声明独立的提示词验收条件。演示可复用 `scenes.js` 的现有模板，也可按需增加渲染器。

案例链接统一使用 `#/来源/案例`。

## 更新 UI Skills Playbook 演示

本项目随附已打包的演示和 MIT 许可证，日常预览无需安装额外依赖。Playbook 案例按五个主题收录，使用原项目的切换和交互组件。需要从相邻的 `ui-skills` 源码更新演示时，先安装该仓库的依赖，再在本项目运行 `node build-playbook.mjs`。重打包前，更新 `playbook-cases.js` 中的分类和提示词验收条件。打包会检查分类是否完整覆盖原演示清单。
