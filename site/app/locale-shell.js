import { english, locale, localePath } from "./locale.js";

const text = {
  ".skip-link": "Skip to content",
  ".source-menu summary": "Sources",
  ".catalog-jump": "Contents",
  ".catalog-heading": "Case directory",
  ".sitemap-link": "Sitemap",
  "#search-dialog-title": "Search cases",
  "#catalog-dialog-title": "Case directory",
};

const labels = {
  ".site-navigation": "Main navigation",
  ".source-options": "Switch source",
  ".open-search": "Search cases",
  ".github-link": "GitHub repository",
  ".sidebar": "Current source directory",
  "#catalog": "Browse by chapter",
  ".site-footer a[href$=\"/LICENSE\"]": "MIT license for original UI Lab code",
  "#search-dialog .dialog-close": "Close search",
  "#global-search": "Search cases",
  "#search-results": "Search results",
  "#catalog-dialog .dialog-close": "Close contents",
  "#artwork-dialog": "Image preview",
  ".artwork-close": "Close preview",
};

export function localizeShell() {
  document.documentElement.lang = locale;
  if (!english) return;

  for (const [selector, value] of Object.entries(text)) {
    document.querySelector(selector).textContent = value;
  }
  for (const [selector, label] of Object.entries(labels)) {
    const element = document.querySelector(selector);
    element.setAttribute("aria-label", label);
    if (element.hasAttribute("title")) element.title = label;
  }
  document.querySelector("#global-search").placeholder = "Case name, source, or keyword";
  document.querySelector('meta[name="description"]').content =
    "UI cases from design books and reference projects, with comparisons and interactive demos.";

  const switcher = document.querySelector(".locale-switch");
  switcher.textContent = "ZH";
  switcher.lang = "en";
  switcher.hreflang = "zh-CN";
  switcher.setAttribute("aria-label", "Switch to Simplified Chinese");
}

export function updateLocaleLinks() {
  document.querySelector(".brand").href = localePath("/");
  document.querySelector(".sitemap-link").href = localePath("/sitemap");
  const { pathname, search, hash } = location;
  document.querySelector(".locale-switch").href =
    localePath(pathname, english ? "zh-CN" : "en") + search + hash;
}
