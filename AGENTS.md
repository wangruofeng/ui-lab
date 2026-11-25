# UI Lab 项目说明

UI Lab 是一个静态设计案例库，用于按书籍和参考项目浏览可交互的 UI 案例。

- 使用原生 HTML、CSS 和 JavaScript ES 模块。运行 `npm start` 启动本地预览，运行 `npm run build` 验证并生成站点。端口和部署方式见 [README.md](./README.md)。
- `site/app/library.js` 管理来源、路由解析和链接生成。`site/app/app.js` 渲染页面，`site/app/navigation.js` 管理导航和全站搜索，`site/cases/` 按来源维护章节和案例。
- 站内链接通过 `libraryHref()` 生成。新增来源或案例时遵循 README 的链接格式，确保案例 ID 在所属来源内唯一。
- UI Skills Playbook、shadcn/ui 和 Stageshow 演示已随仓库分发。仅在更新演示时按 README 的对应步骤重新打包。改动后核对构建产物及受影响的目录、搜索或案例链接。
- 全站下拉控件的箭头图标与边框内侧至少留出 10px，选项文字与箭头之间至少留出 8px。原生单选下拉复用 `.select-control`，保留键盘操作和焦点样式。
- 站点新增线性图标统一使用 `site/app/styles.css` 中的 `--icon-stroke-width`（1.5px）。CSS 图标通过 `var(--icon-stroke-width)` 设置笔画厚度，内联 SVG 通过 CSS 的 `stroke-width` 引用同一 token，并确保缩放后的可见线宽一致。
- 交互演示的独立播放、重播等触发按钮优先放在演示右侧。按钮较多或按钮本身参与演示时，在案例内容内布置。窄屏允许按钮换行。
- 独立的演示触发按钮使用浅灰底、无边框的胶囊样式，保留可见的键盘焦点。放在演示内容里的独立触发按钮复用 `.demo-trigger`。
- 交互演示主体以演示区为基准水平和垂直居中，独立触发按钮放在标题栏右侧，避免挤偏主体。
- 筛选或新增案例来源时，使用 [UI Lab 案例收录技能](./skills/ui-lab-case-curation/SKILL.md)。
- 查找已有案例来指导 UI 优化、视觉审查或去 AI 风格时，使用 [UI Lab 界面优化技能](./skills/ui-lab-ui-improvement/SKILL.md)。
