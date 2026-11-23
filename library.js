import { motionPrimitivesCategories } from "./motion-primitives.js";
import { designHackersCategories } from "./design-hackers-cases.js";
import { killSlopCategories } from "./kill-slop-cases.js";
import { nonDesignerCategories } from "./non-designer-cases.js";
import { playbookCategories } from "./playbook-cases.js";
import { categories } from "./cases.js";

export const collections = [
  {
    id: "refactoring-ui",
    artwork: { kind: "cover", src: "./source-art/refactoring-ui.webp" },
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
      src: "./source-art/non-designers-design-book.webp",
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
    artwork: { kind: "cover", src: "./source-art/design-for-hackers.webp" },
    type: "书籍",
    title: "写给程序员的设计书",
    author: "David Kadavy",
    edition: "逆向拆解美感 · Design for Hackers",
    description: "从产品目的、排印和构图入手，拆解层级、色彩感知与配色决策。",
    categories: designHackersCategories,
  },
  {
    id: "ui-skills",
    artwork: { kind: "logo", src: "./source-art/ui-skills.webp" },
    type: "参考项目",
    title: "UI Skills Playbook",
    author: "Julien Thibeaut",
    description: "按布局、排版、视觉、可访问性和动效主题浏览完整的交互指南。",
    url: "https://www.ui-skills.com/playbook",
    categories: playbookCategories,
  },
  {
    id: "kill-ai-slop",
    artwork: { kind: "logo", src: "./source-art/kill-ai-slop.svg" },
    type: "参考网站",
    title: "Kill AI Slop",
    author: "yetone",
    description:
      "从配色、字体到动效与布局，用前后对照练习识别和清理常见的界面套路。",
    url: "https://killaislop.com/#catalogue",
    categories: killSlopCategories,
  },
  {
    id: "motion-primitives",
    artwork: { kind: "logo", src: "./source-art/motion-primitives.svg" },
    type: "参考项目",
    title: "Motion Primitives",
    author: "Julien Thibeaut",
    description:
      "按浮层、切换、文字、滚动和指针反馈浏览交互动效案例。操作两侧演示，观察同一状态变化的不同表现。",
    url: "https://motion-primitives.com/",
    categories: motionPrimitivesCategories,
  },
];

export function collectionCases(collection) {
  return collection.categories.flatMap((category) =>
    category.items.map((item) => ({ ...item, category: category.title })),
  );
}

const previousPlaybookIds = {
  "focus-rings": "show-visible-focus-rings",
  "form-labels": "label-every-form-field",
  "status-cues": "pair-status-with-labels",
};

export function resolveRoute(hash) {
  const route = hash.replace(/^#\/?/, "").replace(/\/$/, "");
  if (!route || route === "ui") return {};
  const parts = route.split("/");
  if (parts[0] === "ui") parts.shift();
  const [collectionId, itemId] = parts;
  if (!collectionId || parts.length > 2) return { missing: true };
  const collection = collections.find((entry) => entry.id === collectionId);
  if (!collection && parts.length === 1) {
    const book = collections.find((entry) => entry.id === "refactoring-ui");
    const item = collectionCases(book).find(
      (entry) => entry.id === collectionId,
    );
    return item ? { collection: book, item } : { missing: true };
  }
  if (!collection || (parts.length === 2 && !itemId)) return { missing: true };
  if (!itemId) return { collection };
  const canonicalId =
    collectionId === "ui-skills" && Object.hasOwn(previousPlaybookIds, itemId)
      ? previousPlaybookIds[itemId]
      : itemId;
  const item = collectionCases(collection).find(
    (entry) => entry.id === canonicalId,
  );
  return item ? { collection, item } : { missing: true };
}

export function libraryHref(collection, item) {
  return "#/" + [collection?.id, item?.id].filter(Boolean).join("/");
}
