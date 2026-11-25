# UI Lab · 设计案例库

[在线体验](https://ui-lab.wangruofeng007.com/)

UI Lab 是一个可交互的设计案例库。当前版本为 **1.2.0**，收录 12 个来源、401 个案例。页首可跨来源搜索，页脚的「站点地图」列出全部案例。案例支持通过 `#/来源/案例` 直接访问和分享。

## 1.2.0 更新

- 书籍和项目详情页在宽屏按最短列排列章节卡片。手机端可直达各章节，案例链接支持整行点击。
- 手机目录浮层固定标题栏和圆形关闭按钮，列表独立滚动并保留系统回弹。
- 案例提示词包含来源、章节、案例编号、直达链接和验收条件。面板高亮显示 Markdown 标题、链接和行内代码，复制时保留原文。
- Kill AI Slop 的案例采用全站灰白配色，保留教学所需的前后差异。全站也精简了导航、搜索和案例说明。
- 站点地图提供 XML 版，并随站点构建生成。新增 UI Lab 界面优化技能，可按关键词和来源检索案例。

## 用案例优化界面

将 [`ui-lab-ui-improvement`](./skills/ui-lab-ui-improvement/SKILL.md) 技能目录复制到目标项目的 `.agents/skills/`，再在 Codex 中调用。技能可以查找相关案例、审查界面和指导实现，适用于自己的产品，也适用于 UI Lab 本身。

> 用 `$ui-lab-ui-improvement` 找几个能改善这个上传列表的案例，重点看长文件名和失败重试。
>
> 用 `$ui-lab-ui-improvement` 检查 UI Lab 首页，找出影响信息层级的 AI 模板化设计，并修复最明显的一处。

技能使用 XML 版站点地图检索全部案例，支持按关键词及来源筛选。也可以直接使用站内搜索，或让支持读取 URL 的工具读取 XML。

## 案例来源

| 来源 | 案例数 | 内容 |
| --- | ---: | --- |
| 《重构 UI》 | 50 | 界面设计前后对照 |
| 《写给大家看的设计书》 | 43 | 排版与视觉设计案例及练习 |
| 《写给程序员的设计书》 | 43 | 设计原则与示例 |
| UI Skills Playbook | 47 | 按主题浏览交互动效 |
| Kill AI Slop | 35 | 界面优化前后对照 |
| loading.dev | 36 | 可调尺寸和速度的加载指示器，支持暂停和重播 |
| Transitions.dev | 44 | 表单反馈、内容状态、数字变化、导航、指针和加载动效 |
| shadcn/ui | 17 | 日期范围选择、搜索多选、表格、图表和附件等组件示例 |
| Motion Primitives | 33 | 可直接操作的动效案例 |
| Break UI | 11 | 成员资料、列表、日期、进度、长文件名、标签折叠和请求重试 |
| Details that make interfaces feel better | 8 | 文字换行、按钮留白、嵌套圆角、图标切换、入场、动画中断、抽屉离场和背景对比 |
| Stageshow | 34 | 产品叙事、数据联动、多人协作、状态反馈与手势 |

loading.dev 的演示由 loading-dev 0.3.8 组件生成静态标记和样式。Transitions.dev 的 Number pop-in 和 Spinning counter 使用对应的公开演示逻辑与样式，其余案例使用原生 HTML、CSS 和 JavaScript 对照公开资料实现。shadcn/ui 案例使用官方组件与示例源码，预览所需的脚本、样式和字体随站点分发。Break UI 案例参照官网演示与上游边界数据清单独立实现，来源标识使用 AI for UI 官网图标。Details that make interfaces feel better 的案例参照 Jakub Krehel 的文章独立实现，来源标识使用作者官网图标。各案例页提供原始参考链接。

## 更新 shadcn/ui 演示

更新 Attachment 静态演示时，运行 `npm ci --prefix vendor-src/shadcn-attachment-src` 和 `node vendor-src/shadcn-attachment-src/build.mjs`。源码来自 [官方组件注册表](https://ui.shadcn.com/r/styles/base-rhea/attachment.json) 和 [官网示例](https://github.com/shadcn-ui/ui/blob/main/apps/v4/examples/base/attachment-demo.tsx)。示例内的三张照片与原页面一致，依照 [Unsplash 许可](https://unsplash.com/license)随演示提供。

其余 16 个案例使用 [官网示例源码](https://github.com/shadcn-ui/ui/tree/main/apps/v4/examples/base)、[交互柱状图源码](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/charts/chart-bar-interactive.tsx)和对应样式的官方组件注册表。更新后运行 `npm ci --prefix vendor-src/shadcn-official-src --legacy-peer-deps` 和 `node vendor-src/shadcn-official-src/build.mjs`，生成 [shadcn-official-demo](./site/demos/shadcn-official-demo/) 的静态文件及依赖许可。日常预览和站点构建直接使用已打包的文件。Toast、Slider、Dropdown Menu 和 Sidebar 的示例取自 [上游 055aa6b](https://github.com/shadcn-ui/ui/tree/055aa6b7837b1808456a24beb4c97a677864aa82/apps/v4/examples/base)，组件取自 Base Nova 官方注册表。

## 更新 Stageshow 演示

收录 [Stageshow 299140f](https://github.com/benjitaylor/skills/tree/299140fafd08df55a9c234e610c3f64af3f45531/stageshow) 的 34 个官方案例。UI Lab 使用自己的案例目录，演示保留上游播放器与脚本。使用 Node.js 20.19 或更高版本。运行 `npm ci --prefix vendor-src/stageshow-src` 安装打包依赖，再用 `npm run typecheck --prefix vendor-src/stageshow-src` 检查类型、用 `npm run build --prefix vendor-src/stageshow-src` 生成静态演示。资产声明见 [Stageshow NOTICE](./vendor-src/stageshow-src/NOTICE.md)，分发许可见 [Stageshow 及依赖许可证](./site/licenses/stageshow-LICENSE.txt)。

## 启动

运行 `npm start` 后访问 <http://127.0.0.1:4322/>。本地预览需要 Node.js、npm 和 Python 3，无需安装 npm 依赖。

启动预览和构建时会从案例目录生成 [XML 版站点地图](http://127.0.0.1:4322/sitemap.xml)。XML 按来源和章节列出案例标题、摘要与正式站点链接，可直接读取。

案例页支持并排观察，点击「播放」将左侧示例过渡到右侧的状态。可以暂停、继续、拖动进度、重播，或通过页底链接切换相邻案例。系统开启减少动态效果时直接呈现目标状态。Motion Primitives 的案例可在两侧直接操作，按需触发、重播、拖动或滚动。

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

## 来源与素材

UI Lab 原创代码采用 [MIT 许可证](./LICENSE)。第三方代码和素材适用各自的许可及权利声明。

项目用途、第三方权利和反馈方式见 [免责声明](./DISCLAIMER.md)。各来源的代码按对应的许可条款使用，包括 [loading.dev](./site/licenses/loading-dev-LICENSE.md)、[Transitions.dev](./site/licenses/transitions-dev-LICENSE.md)、[shadcn/ui](./site/licenses/shadcn-ui-LICENSE.md) 和 [Stageshow](./site/licenses/stageshow-LICENSE.txt)。

书籍案例使用独立绘制的示例界面和整理后的练习说明。封面和项目标识用于识别各自来源，权利归原作者或权利人。演示用山谷照片和抽象插图由 AI 生成。

UI Skills Playbook 的演示源自 [ibelick/ui-skills](https://github.com/ibelick/ui-skills)。上游 MIT 许可和打包依赖的许可见 [playbook-demo](./site/demos/playbook-demo/)。

## 添加参考来源

先阅读 [UI Lab 案例收录技能](./skills/ui-lab-case-curation/SKILL.md)，再在 `site/app/library.js` 的 `collections` 中增加一个来源，设置独立 ID、来源链接、介绍和章节。案例 ID 在来源内唯一，可用 `criterion` 声明独立的提示词验收条件。演示可复用 `site/app/scenes.js` 的现有模板，也可按需增加渲染器。

案例链接统一使用 `#/来源/案例`。

## 更新 UI Skills Playbook 演示

本项目随附已打包的演示和 MIT 许可证，日常预览无需安装额外依赖。Playbook 案例按五个主题收录，使用原项目的切换和交互组件。需要从相邻的 `ui-skills` 源码更新演示时，先安装该仓库的依赖，再在本项目运行 `node scripts/build-playbook.mjs`。重打包前，更新 `site/cases/ui-skills/playbook-cases.js` 中的分类和提示词验收条件。打包会检查分类是否完整覆盖原演示清单。
