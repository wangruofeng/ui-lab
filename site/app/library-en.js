import { caseCopyBooksEn } from "./case-copy-books-en.js";
import { caseCopyExamplesEn } from "./case-copy-examples-en.js";
import { caseCopyUiEn } from "./case-copy-ui-en.js";
import { refactoringTips } from "./refactoring-en.js";

const sources = {
  "refactoring-ui": ["Refactoring UI", "Practice visual hierarchy, typography, color, and interface details by chapter.", [
    "Starting from Scratch", "Hierarchy Is Everything", "Layout and Spacing", "Designing Text", "Working with Color", "Creating Depth", "Working with Images", "Finishing Touches", "Leveling Up",
  ]],
  "non-designers-design-book": ["The Non-Designer's Design Book", "Practice proximity, alignment, repetition, and contrast with editable examples in color, print, and typography.", [
    "The Four Principles", "Color Exercises", "Print and Branding", "Typography and Layout",
  ], "4th edition · Page references use the Chinese edition (ISBN 978-7-115-40440-4)"],
  "design-for-hackers": ["Design for Hackers", "Practice typography, composition, hierarchy, and color with a product goal in mind.", [
    "Design Purpose and Medium", "Type and Typography", "Proportion and Composition", "Visual Hierarchy", "Color Science and Data", "Color in Context",
  ], "Design for Hackers: Reverse Engineering Beauty"],
  "ui-skills": ["UI Skills Playbook", "Interactive examples of layout, typography, color, accessibility, and motion.", [
    "Layout and Containers", "Typography and Copy", "Color, Icons, and Depth", "Accessibility and Feedback", "Motion and State Changes",
  ]],
  "kill-ai-slop": ["Kill AI Slop", "Compare examples to spot formulaic color, typography, copy, layout, and motion.", [
    "Color", "Typography", "Copy", "Components", "Motion", "Layout", "Emerging Visual Patterns",
  ]],
  "loading-dev": ["loading.dev", "Explore adjustable loading indicators that spin, stagger, pulse, wave, and morph.", [
    "Rings and Rotation", "Dots and Staggering", "Scanning and Pulsing", "Grids and Waves", "Morphing and Paths",
  ]],
  "transitions-dev": ["Transitions.dev", "See how motion communicates state changes in forms, cards, and notifications.", [
    "Form Feedback", "Content States", "Action Feedback", "Text and Numbers", "Disclosure and Navigation", "Pointer and Spatial Effects", "Feedback and Loading",
  ]],
  "shadcn-ui": ["shadcn/ui", "Explore official examples of tables, date ranges, command menus, chat scrolling, and resizable panels.", [
    "Content Tools", "Data and Filtering", "Input and Selection", "Commands and Workflows", "Space and Layout",
  ]],
  "motion-primitives": ["Motion Primitives", "Compare motion for overlays, transitions, text, scrolling, and pointer feedback.", [
    "Disclosure and Overlays", "Transitions and Sequencing", "Numbers and Text", "Scrolling and Media", "Pointer and Visual Feedback",
  ]],
  "break-ui": ["Break UI", "Stress-test profiles, lists, dates, progress indicators, long content, and failed requests.", [
    "Stress Testing", "Profiles", "Counts and Lists", "Dates and Progress", "Files and Tags", "Request Feedback",
  ]],
  "make-interfaces-feel-better": ["Details that make interfaces feel better", "Compare text wrapping, button padding, nested radii, entrance motion, status icons, and shadows.", [
    "Typography and Alignment", "Motion and Depth",
  ]],
  "stageshow": ["Stageshow", "Explore product composition, linked charts, collaboration, and gesture feedback through official demos.", [
    "Composition and Storytelling", "Data and Collaboration", "States and Feedback", "Gestures and Direct Manipulation",
  ]],
};

const sourceArtwork = {
  "non-designers-design-book": {
    kind: "cover",
    src: "./assets/source-art/non-designers-design-book-en.webp",
    width: 648,
    height: 929,
  },
};

const caseCopy = { ...caseCopyBooksEn, ...caseCopyExamplesEn, ...caseCopyUiEn };

const refactoringTitles = {
  feature: "Start with a Feature",
  detail: "Leave the Details for Later",
  scope: "Design Only What You Need",
  voice: "Choose a Personality",
  tokens: "Limit Your Choices",
  priority: "Give Elements Different Priorities",
  weight: "Size Is Only One Factor",
  oncolor: "Choose Secondary Text Colors for Colored Backgrounds",
  quiet: "Emphasize by De-emphasizing",
  labels: "Use Labels Only Where Needed",
  semantic: "Separate Visual Hierarchy from Document Hierarchy",
  balance: "Balance Weight and Contrast",
  actions: "Give Actions a Hierarchy",
  air: "Start with More White Space",
  spacing: "Establish a Spacing System",
  measure: "Use Only the Space You Need",
  grid: "Use Grids Where They Help",
  relative: "Choose Sizes for Each Context",
  group: "Use Spacing to Show Relationships",
  scale: "Establish a Type Scale",
  font: "Choose Readable Fonts",
  line: "Keep Line Length Readable",
  baseline: "Align to the Baseline",
  leading: "Set Line Height for the Context",
  link: "Style Links for Their Context",
  align: "Align Text for Easy Reading",
  tracking: "Fine-Tune Letter Spacing",
  hsl: "Work with HSL",
  roles: "Define Color Roles",
  ramp: "Define Your Shades Up Front",
  saturation: "Adjust Saturation for Light and Dark Shades",
  tint: "Give Neutrals a Subtle Tint",
  contrast: "Check Color Contrast",
  colorcue: "Pair Color with Other Cues",
  light: "Choose a Consistent Light Source",
  height: "Use Shadows to Show Elevation",
  layershadow: "Layer Your Shadows",
  flat: "Show Depth in Flat Designs",
  overlap: "Overlap Elements for Depth",
  photo: "Choose Good Photos",
  scrim: "Protect Text Contrast over Images",
  asset: "Use Assets at the Right Size",
  upload: "Handle User-Uploaded Images",
  native: "Style Native Controls",
  borderaccent: "Add Accent Borders",
  ornament: "Decorate the Background",
  empty: "Design Empty States",
  borders: "Use Fewer Borders",
  rethink: "Try a Different Layout",
  practice: "Practice with Focused Comparisons",
};

const sourceTypes = { "书籍": "Book", "参考项目": "Reference project", "参考网站": "Reference website" };
const acronyms = { ai: "AI", rgb: "RGB", svg: "SVG", otp: "OTP", aqua: "Aqua", "3d": "3D" };

function titleFromId(id) {
  return id.split("-").map((word) => acronyms[word] ?? word).join(" ")
    .replace(/^./, (first) => first.toUpperCase());
}

const principles = { "对齐": "Alignment", "对比": "Contrast", "亲密性": "Proximity", "重复": "Repetition" };

function caseTitle(collectionId, item) {
  if (collectionId === "refactoring-ui" && refactoringTitles[item.id]) return refactoringTitles[item.id];
  const sourceName = item.title.split(" · ", 1)[0];
  return /\p{Script=Han}/u.test(sourceName) ? titleFromId(item.id) : sourceName;
}

export function localizeCollection(collection) {
  const source = sources[collection.id];
  if (!source) return collection;
  const [title, description, chapters, edition] = source;
  return {
    ...collection,
    title,
    description,
    edition,
    artwork: sourceArtwork[collection.id] ?? collection.artwork,
    type: sourceTypes[collection.type] ?? collection.type,
    author: collection.author.replaceAll("、", ", "),
    categories: collection.categories.map((category, index) => ({
      ...category,
      title: chapters[index] ?? category.title,
      items: category.items.map((item) => ({
        ...item,
        title: caseTitle(collection.id, item),
        principle: principles[item.principle] ?? item.principle,
        ...(collection.id === "refactoring-ui" ? { tip: refactoringTips[item.id] ?? item.tip } : {}),
        ...caseCopy[collection.id]?.[item.id],
      })),
    })),
  };
}
