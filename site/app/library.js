import { loadingDevCategories } from "../cases/loading-dev/loading-dev-cases.js";
import { transitionsCategories } from "../cases/transitions-dev/transitions-cases.js";
import { shadcnCategories } from "../cases/shadcn-ui/shadcn-cases.js";
import { motionPrimitivesCategories } from "../cases/motion-primitives/motion-primitives.js";
import { designHackersCategories } from "../cases/design-hackers/design-hackers-cases.js";
import { killSlopCategories } from "../cases/kill-ai-slop/kill-slop-cases.js";
import { nonDesignerCategories } from "../cases/non-designers/non-designer-cases.js";
import { playbookCategories } from "../cases/ui-skills/playbook-cases.js";
import { categories } from "../cases/refactoring-ui/cases.js";
import { breakUiCollection } from "../cases/break-ui/break-ui-cases.js";
import { interfaceDetailsCollection } from "../cases/interface-details/interface-details-cases.js";
import { stageshowCollection } from "../cases/stageshow/stageshow-cases.js";

export const collections = [
  {
    id: "refactoring-ui",
    artwork: { kind: "cover", src: "./assets/source-art/refactoring-ui.webp" },
    type: "书籍",
    title: "重构 UI",
    author: "Adam Wathan、Steve Schoger",
    description: "按原书章节练习视觉层级、排版、色彩和界面细节。",
    url: "https://www.refactoringui.com/",
    categories,
  },
  {
    id: "non-designers-design-book",
    artwork: {
      kind: "cover",
      src: "./assets/source-art/non-designers-design-book.webp",
    },
    type: "书籍",
    title: "写给大家看的设计书",
    author: "Robin Williams",
    edition: "第 4 版 · 人民邮电出版社 · ISBN 978-7-115-40440-4",
    description:
      "从亲密性、对齐、重复与对比，到配色、印刷品和字体。用可编辑的版面观察设计原则。",
    categories: nonDesignerCategories,
  },
  {
    id: "design-for-hackers",
    artwork: { kind: "cover", src: "./assets/source-art/design-for-hackers.webp" },
    type: "书籍",
    title: "写给程序员的设计书",
    author: "David Kadavy",
    edition: "逆向拆解美感 · Design for Hackers",
    description: "从产品目的、排印和构图入手，拆解层级、色彩感知与配色决策。",
    categories: designHackersCategories,
  },
  {
    id: "ui-skills",
    artwork: { kind: "logo", src: "./assets/source-art/ui-skills.webp" },
    type: "参考项目",
    title: "UI Skills Playbook",
    author: "Julien Thibeaut",
    description: "按布局、排版、视觉、可访问性和动效主题浏览完整的交互指南。",
    url: "https://www.ui-skills.com/playbook",
    categories: playbookCategories,
  },
  {
    id: "kill-ai-slop",
    artwork: { kind: "logo", src: "./assets/source-art/kill-ai-slop.svg" },
    type: "参考网站",
    title: "Kill AI Slop",
    author: "yetone",
    description:
      "从配色、字体到动效与布局，用前后对照练习识别和清理常见的界面套路。",
    url: "https://killaislop.com/#catalogue",
    categories: killSlopCategories,
  },
  {
    id: "loading-dev",
    artwork: { kind: "logo", src: "./assets/source-art/loading-dev.png" },
    type: "参考项目",
    title: "loading.dev",
    author: "Jakub Krehel、Paul Faivret",
    description: "体验全部 36 种加载指示器，按旋转、错峰、扩散、波形和形变浏览，逐个调整速度和尺寸。",
    url: "https://loading.dev/",
    categories: loadingDevCategories,
  },
  {
    id: "transitions-dev",
    artwork: { kind: "logo", src: "./assets/source-art/transitions-dev.png" },
    type: "参考项目",
    title: "Transitions.dev",
    author: "Jakub Antalik",
    description: "操作表单、内容卡片和通知，观察动效如何说明界面状态的变化。",
    url: "https://transitions.dev/library.html",
    categories: transitionsCategories,
  },
  {
    id: "shadcn-ui",
    artwork: { kind: "logo", src: "./assets/source-art/shadcn-ui.png" },
    type: "参考项目",
    title: "shadcn/ui",
    author: "shadcn/ui",
    description: "按官网示例体验付款表格、日期范围、命令菜单、聊天滚动和可调整面板等交互。",
    url: "https://ui.shadcn.com/docs/components",
    categories: shadcnCategories,
  },
  {
    id: "motion-primitives",
    artwork: { kind: "logo", src: "./assets/source-art/motion-primitives.svg" },
    type: "参考项目",
    title: "Motion Primitives",
    author: "Julien Thibeaut",
    description:
      "按浮层、切换、文字、滚动和指针反馈浏览交互动效案例。操作两侧演示，观察同一状态变化的不同表现。",
    url: "https://motion-primitives.com/",
    categories: motionPrimitivesCategories,
  },
  breakUiCollection,
  interfaceDetailsCollection,
  stageshowCollection,
];

export function collectionCases(collection) {
  return collection.categories.flatMap((category) =>
    category.items.map((item) => ({ ...item, category: category.title })),
  );
}

export function resolveRoute(hash) {
  if (!hash || hash === "#/") return {};
  if (hash === "#/sitemap") return { sitemap: true };
  if (!hash.startsWith("#/")) return { missing: true };
  const parts = hash.slice(2).split("/");
  const [collectionId, itemId] = parts;
  if (!collectionId || parts.length > 2) return { missing: true };
  const collection = collections.find((entry) => entry.id === collectionId);
  if (!collection || (parts.length === 2 && !itemId)) return { missing: true };
  if (!itemId) return { collection };
  const item = collectionCases(collection).find(
    (entry) => entry.id === itemId,
  );
  return item ? { collection, item } : { missing: true };
}

export function libraryHref(collection, item) {
  return "#/" + [collection?.id, item?.id].filter(Boolean).join("/");
}
