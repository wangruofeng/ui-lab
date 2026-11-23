# UI Lab · 设计案例库

[在线体验](https://ui-lab.wangruofeng007.com/) · [Cloudflare Pages 地址](https://ui-lab-esu.pages.dev/)

首页直接列出书籍和参考项目，进入来源后即可浏览案例。当前收录《重构 UI》的 50 个章节案例、UI Skills Playbook 的 47 个案例，《写给大家看的设计书》的 43 个案例和练习，Kill AI Slop 的 35 个案例，《写给程序员的设计书》的 43 个案例，以及 Motion Primitives 的 33 个案例。每个来源拥有独立章节目录、搜索和案例链接。

## 启动

运行 `npm start` 后访问 <http://127.0.0.1:4322/>。静态项目使用 Python 3 的本地 HTTP 服务，无需安装 npm 依赖。

案例页支持并排观察，点击「播放变化」将左侧示例过渡到右侧的状态。可以暂停、继续、拖动进度、重播，或通过页底链接切换相邻案例。系统开启减少动态效果时直接呈现目标状态。Motion Primitives 的案例可在两侧直接操作，按需触发、重播、拖动或滚动。

## 构建与部署

运行 `npm run build` 将静态站点打包到 `dist/`。可以用以下命令预览与线上相同的构建产物。

```sh
python3 -m http.server 4323 --bind 127.0.0.1 --directory dist
```

Cloudflare Pages 从 GitHub 的 `main` 分支拉取代码，运行 `npm run build`，并发布 `dist/`。在 Pages 的部署记录中对照 GitHub 提交 SHA，即可确认生产站点使用的版本。

## 来源与素材

书籍案例使用独立绘制的示例界面和整理后的练习说明。封面和项目标识用于识别各自来源，权利归原作者或权利人。演示用山谷照片和抽象插图由 AI 生成。

UI Skills Playbook 的演示源自 [ibelick/ui-skills](https://github.com/ibelick/ui-skills)。上游 MIT 许可和打包依赖的许可见 [playbook-demo](./playbook-demo/)。

## 添加参考来源

在 `library.js` 的 `collections` 中增加一个来源，设置独立 ID、来源链接、介绍和章节。案例 ID 在来源内唯一，可用 `criterion` 声明独立的提示词验收条件。演示可复用 `scenes.js` 的现有模板，也可按需增加渲染器。

标准案例链接格式为 `#/来源/案例`。旧版 `#/ui/来源/案例` 和《重构 UI》的短链接（如 `#spacing`）仍可访问。

## 更新 UI Skills Playbook 演示

本项目随附已打包的演示和 MIT 许可证，日常预览无需安装额外依赖。Playbook 案例按五个主题收录，使用原项目的切换和交互组件。需要从相邻的 `ui-skills` 源码更新演示时，先安装该仓库的依赖，再在本项目运行 `node build-playbook.mjs`。重打包前，更新 `playbook-cases.js` 中的分类和提示词验收条件。打包会检查分类是否完整覆盖原演示清单。
