import { english, localePath } from "./locale.js";
import { localizeCollection } from "./library-en.js";
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

export const libraryBaseUrl = "https://ui-lab.wangruofeng007.com/";

export const originalCollections = [
  {
    id: "refactoring-ui",
    artwork: { kind: "cover", src: "./assets/source-art/refactoring-ui.webp", width: 404, height: 520 },
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
      width: 364,
      height: 520,
    },
    type: "书籍",
    title: "写给大家看的设计书",
    author: "Robin Williams",
    edition: "第 4 版 · 人民邮电出版社 · ISBN 978-7-115-40440-4",
    description:
      "在可编辑的版面上练习亲密性、对齐、重复与对比，以及配色、印刷品和字体。",
    categories: nonDesignerCategories,
  },
  {
    id: "design-for-hackers",
    artwork: { kind: "cover", src: "./assets/source-art/design-for-hackers.webp", width: 414, height: 520 },
    type: "书籍",
    title: "写给程序员的设计书",
    author: "David Kadavy",
    edition: "逆向拆解美感 · Design for Hackers",
    description: "从产品目标出发，练习排版、构图、视觉层级与配色。",
    categories: designHackersCategories,
  },
  {
    id: "ui-skills",
    artwork: { kind: "logo", src: "./assets/source-art/ui-skills.webp" },
    type: "参考项目",
    title: "UI Skills Playbook",
    author: "Julien Thibeaut",
    description: "布局、排版、色彩、可访问性和动效的交互示例。",
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
      "用前后对照识别模板化的配色、排版、文案、布局和动效。",
    url: "https://killaislop.com/#catalogue",
    categories: killSlopCategories,
  },
  {
    id: "loading-dev",
    artwork: { kind: "logo", src: "./assets/source-art/loading-dev.png" },
    type: "参考项目",
    title: "loading.dev",
    author: "Jakub Krehel、Paul Faivret",
    description: "可调速度和尺寸的加载指示器，涵盖旋转、错峰、扩散、波形和形变。",
    url: "https://loading.dev/",
    categories: loadingDevCategories,
  },
  {
    id: "transitions-dev",
    artwork: { kind: "logo", src: "./assets/source-art/transitions-dev.png" },
    type: "参考项目",
    title: "Transitions.dev",
    author: "Jakub Antalik",
    description: "通过表单、卡片和通知，观察动效如何提示状态变化。",
    url: "https://transitions.dev/library.html",
    categories: transitionsCategories,
  },
  {
    id: "shadcn-ui",
    artwork: { kind: "logo", src: "./assets/source-art/shadcn-ui.png" },
    type: "参考项目",
    title: "shadcn/ui",
    author: "shadcn/ui",
    description: "官网示例包括表格、日期范围、命令菜单、聊天滚动和可调整面板。",
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
      "对照浮层、切换、文字、滚动和指针反馈的不同动效。",
    url: "https://motion-primitives.com/",
    categories: motionPrimitivesCategories,
  },
  breakUiCollection,
  interfaceDetailsCollection,
  stageshowCollection,
];

export const englishCollections = originalCollections.map(localizeCollection);
export const collections = english ? englishCollections : originalCollections;

export function collectionCases(collection) {
  return collection.categories.flatMap((category) =>
    category.items.map((item) => ({ ...item, category: category.title })),
  );
}

export function resolveRoute(pathname) {
  pathname = localePath(pathname, "zh-CN");
  if (pathname === "/") return {};
  if (pathname === "/sitemap") return { sitemap: true };
  if (!pathname.startsWith("/")) return { missing: true };
  const parts = pathname.slice(1).split("/");
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

export function libraryHref(collection, item, language) {
  return localePath("/" + [collection?.id, item?.id].filter(Boolean).join("/"), language);
}

export function libraryUrl(collection, item, language) {
  return new URL(libraryHref(collection, item, language), libraryBaseUrl).href;
}
