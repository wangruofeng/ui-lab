---
name: ui-lab-ui-improvement
description: 在 UI Lab 中搜索已有设计案例，并用案例诊断或优化指定界面。适用于找前后对照或交互示例、改进 UI Lab 自身或其他产品的 UI，以及清理界面中的 AI 模板化设计。新增或收录案例使用 ui-lab-case-curation。
metadata:
  version: "1.0.0"
---

# 用 UI Lab 案例优化界面

## 从症状到案例

1. 把需求拆成页面位置、用户任务和出现问题的状态。按问题分别检索，例如「上传列表」可分开查「长文件名、截断、扩展名」和「请求失败、重试、retry」。只有主题时，从主题本身开始检索。
2. 用全量案例目录先跨来源筛选，再按需要缩小范围。来源选择和中英文检索词见[检索与审查指南](references/review-guide.md)。关键词无结果时，换成具体组件、状态或设计手法再试，并说明可用的最接近案例。
3. 优先选用户任务和触发状态相近的案例。核对直达链接，用 `criterion`、案例说明或实际演示确认关键行为。结论应标明依据是索引摘要、源码还是实测。

## 读取全量目录

- **在 UI Lab 仓库中**，运行 `node scripts/build-sitemap.mjs` 从当前工作区生成 `site/sitemap.xml`。需要细节时查看 `site/app/library.js` 的 `collections`、`collectionCases()` 和 `libraryHref()`，以及 `site/cases/` 中的 `tip`、`criterion` 和演示实现。
- **在其他项目中**，读取用户指定的 UI Lab 实例的 `/sitemap.xml`，默认使用[正式站点 XML](https://ui-lab.wangruofeng007.com/sitemap.xml)。XML 不可用时，使用[站内搜索](https://ui-lab.wangruofeng007.com/)或 [GitHub 案例目录](https://github.com/wangruofeng/ui-lab/tree/main/site/cases)。案例链接的 `#/` 路由由浏览器 JavaScript 解析。
- **关键词筛选**，用随附的 [Python 脚本](scripts/search_cases.py)。在 UI Lab 根目录运行以下命令。已安装的 Skill 使用其目录下的脚本；XML 已下载时传文件路径，也可以传 `-` 从标准输入读取。

```sh
python3 skills/ui-lab-ui-improvement/scripts/search_cases.py site/sitemap.xml 长文件名 扩展名
```

结果为 JSON，包含来源、章节、标题、摘要和链接。每个关键词都可独立命中，标题和案例 ID 权重较高。加 `--source break-ui` 限定来源，加 `--limit 5` 控制结果数。按目标重新判断候选的适用性。

## 按用户目标交付

- **找案例**。给出案例名、直达链接、适用条件和可迁移的做法。
- **审查或去 AI 风格**。记录问题发生在哪里、何时出现、妨碍什么任务，再用案例解释可以怎样改、怎样验收。优先处理主操作失焦、视觉权重失衡、重复文案或妨碍交互的动效。保留承担品牌识别、分组、焦点和反馈的设计。
- **实施优化**。沿用目标项目的组件、设计约束和交互语义。修改 UI Lab 时，先读 `AGENTS.md`，从 `site/app/` 定位共用 UI，从 `site/cases/` 定位单个演示，并运行 `npm run build`。用相同内容对比前后，验证受影响的核心操作和适用的窄屏、键盘或减少动态效果状态。具体验收示例见[检索与审查指南](references/review-guide.md)。
