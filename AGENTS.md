# UI Lab 项目说明

UI Lab 是一个静态设计案例库，用于按书籍和参考项目浏览可交互的 UI 案例。

- 使用原生 HTML、CSS 和 JavaScript ES 模块。运行 `npm start` 启动本地预览，运行 `npm run build` 验证并生成站点。端口和部署方式见 [README.md](./README.md)。
- `library.js` 管理来源、路由解析和链接生成。`app.js` 渲染页面，`navigation.js` 管理导航和全站搜索，各来源模块维护章节和案例。
- 站内链接通过 `libraryHref()` 生成。新增来源或案例时遵循 README 的链接格式，确保案例 ID 在所属来源内唯一。
- UI Skills Playbook 演示已随仓库分发，仅在更新上游演示时运行 `build-playbook.mjs`。改动后核对构建产物及受影响的目录、搜索或案例链接。
