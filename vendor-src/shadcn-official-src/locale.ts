const english = new URLSearchParams(location.search).get("lang") === "en"

export function t(chinese: string, translation: string) {
  return english ? translation : chinese
}
