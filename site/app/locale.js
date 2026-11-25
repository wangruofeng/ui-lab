export const locale = /^\/en(?:\/|$)/.test(globalThis.location?.pathname ?? "") ? "en" : "zh-CN";
export const english = locale === "en";

export function t(chinese, translation) {
  return english ? translation : chinese;
}

export function caseCount(count) {
  return t(`${count} 个案例`, `${count} ${count === 1 ? "case" : "cases"}`);
}

export function localePath(path, language = locale) {
  const original = path.replace(/^\/en(?=\/|$)/, "") || "/";
  return language === "en" ? "/en" + (original === "/" ? "" : original) : original;
}
